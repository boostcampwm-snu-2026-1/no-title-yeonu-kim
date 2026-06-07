import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';

import { useApplicationQuery } from '@/feature/application/application/application-query';
import { implApplicationUsecase } from '@/feature/application/usecase/application-usecase';
import { useAuthQuery } from '@/feature/auth/application/auth-query';
import { implAuthUsecase } from '@/feature/auth/usecase/auth-usecase';
import { implFileUsecase } from '@/feature/file/usecase/file-usecase';
import { QueryContext } from '@/feature/shared/context/query-context';
import { useStoreQuery } from '@/feature/store/application/store-query';
import { implStoreUsecase } from '@/feature/store/usecase/store-usecase';
import { externalCall, implApi } from '@/infrastructure/api';
import { implStorageApi } from '@/infrastructure/api/client';
import { externalStorageCall } from '@/infrastructure/api/external-call';
import { implTokenRepository } from '@/infrastructure/token/token-repository';
import { eventHandlers } from '@/mocks/event/handler';
import { s3Handlers } from '@/mocks/s3/handler';
import { SubmitForm } from '@/widgets/application/ui/submit-form';

const VALID_WALLET = '0xAbCdEf1234567890AbCdEf1234567890AbCdEf12';
const MOCK_S3_BASE_URL = 'https://mock-s3.example.com/presigned';

const SubmitFormWrapper = () => {
  const [, setToken] = useState<string | null>(null);
  const api = implApi({ externalCall });
  const storageApi = implStorageApi({ externalStorageCall });
  const tokenRepository = implTokenRepository({ setToken });
  const authUsecase = implAuthUsecase({ api, tokenRepository });
  const authQuery = useAuthQuery({ authUsecase });
  const storeUsecase = implStoreUsecase({ api });
  const storeQuery = useStoreQuery({ storeUsecase });
  const fileUsecase = implFileUsecase({ api, storageApi });
  const applicationUsecase = implApplicationUsecase({ api, fileUsecase });
  const applicationQuery = useApplicationQuery({ applicationUsecase });

  return (
    <QueryContext.Provider value={{ authQuery, storeQuery, applicationQuery }}>
      <Routes>
        <Route path="/store/:storeId/event/:eventId" element={<SubmitForm />} />
        <Route
          path="*"
          element={<Navigate to="/store/store-001/event/event-001" replace />}
        />
      </Routes>
    </QueryContext.Provider>
  );
};

// userEvent.upload은 display:none 요소에서 pointer events 체크를 통과하지 못하므로
// DataTransfer + fireEvent.change로 직접 주입한다.
const uploadFileToInput = (canvasElement: HTMLElement, file: File) => {
  const fileInput =
    canvasElement.querySelector<HTMLInputElement>('input[type="file"]')!;
  const dt = new DataTransfer();
  dt.items.add(file);
  Object.defineProperty(fileInput, 'files', {
    value: dt.files,
    configurable: true,
  });
  fireEvent.change(fileInput);
};

const fillForm = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  await userEvent.type(
    canvas.getByPlaceholderText('지갑 주소 직접 입력 (0x...)'),
    VALID_WALLET
  );
  uploadFileToInput(
    canvasElement,
    new File(['img'], 'review.jpg', { type: 'image/jpeg' })
  );
  // 이미지 상태 반영 후 버튼 활성화 대기
  await waitFor(() =>
    expect(canvas.getByRole('button', { name: '제출하기' })).not.toBeDisabled()
  );
};

const meta: Meta<typeof SubmitFormWrapper> = {
  title: 'Application/SubmitForm',
  component: SubmitFormWrapper,
};

export default meta;
type Story = StoryObj<typeof SubmitFormWrapper>;

// ─── 초기 상태 ──────────────────────────────────────
export const Default: Story = {
  name: '200 폼 초기 렌더 — 가게·이벤트 정보 표시',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.findByText('기절초풍왕순대')
    ).resolves.toBeInTheDocument();
    await expect(
      canvas.findByText('신규 메뉴 불닭볶음면 먹고 리뷰 달기')
    ).resolves.toBeInTheDocument();
  },
};

// ─── 성공 케이스 ──────────────────────────────────────
export const Success: Story = {
  name: '200 제출 성공 — 완료 화면 전환',
  play: async ({ canvasElement }) => {
    await fillForm(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '제출하기' }));
    await expect(canvas.findByText('제출 완료')).resolves.toBeInTheDocument();
  },
};

// ─── MetaMask ──────────────────────────────────────
export const MetaMaskNotInstalled: Story = {
  name: 'MetaMask 미설치 — 설치 안내 메시지',
  play: async ({ canvasElement }) => {
    // 브라우저에 MetaMask가 설치돼 있어도 미설치 케이스를 재현하기 위해 임시 제거
    const originalEthereum = window.ethereum;
    window.ethereum = undefined;

    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'MetaMask 연결' })
    );
    await expect(
      canvas.findByText(
        'MetaMask가 설치되어 있지 않습니다. metamask.io에서 설치해 주세요.'
      )
    ).resolves.toBeInTheDocument();

    window.ethereum = originalEthereum;
  },
};

export const MetaMaskConnectionFailed: Story = {
  name: 'MetaMask 연결 거부 — 에러 메시지',
  play: async ({ canvasElement }) => {
    const originalEthereum = window.ethereum;
    window.ethereum = {
      request: () =>
        Promise.reject(new Error('User rejected the request')) as Promise<
          string[]
        >,
    };

    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'MetaMask 연결' })
    );
    await expect(
      canvas.findByText('MetaMask 연결에 실패했습니다.')
    ).resolves.toBeInTheDocument();

    window.ethereum = originalEthereum;
  },
};

// ─── 클라이언트 유효성 ──────────────────────────────────────
export const ClientValidationErrorInvalidWallet: Story = {
  name: '400 잘못된 지갑 주소 형식 (클라이언트 유효성)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByPlaceholderText('지갑 주소 직접 입력 (0x...)'),
      '0xinvalid'
    );
    await expect(
      canvas.findByText('올바른 이더리움 주소를 입력해 주세요 (0x 시작, 42자)')
    ).resolves.toBeInTheDocument();
  },
};

export const ClientValidationErrorInvalidFileType: Story = {
  name: '400 허용되지 않는 파일 형식 (클라이언트 유효성)',
  play: async ({ canvasElement }) => {
    uploadFileToInput(
      canvasElement,
      new File(['pdf content'], 'document.pdf', { type: 'application/pdf' })
    );
    const canvas = within(canvasElement);
    await expect(
      canvas.findByText(
        'jpg, jpeg, png, webp 파일만 가능하며 크기는 10MB 이하여야 합니다.'
      )
    ).resolves.toBeInTheDocument();
  },
};

// ─── API 에러 ──────────────────────────────────────
// msw-storybook-addon은 parameters.msw.handlers 설정 시 전역 핸들러를 resetHandlers()로
// 제거하고 스토리 핸들러만 등록한다. 따라서 제출 플로우에서 필요한 S3 핸들러를 함께 포함해야 한다.

export const ErrorPresignedUrlFail: Story = {
  name: '500 presigned URL 발급 실패',
  parameters: {
    msw: {
      handlers: [
        // POST /api/s3를 오버라이드 — 이 시점에서 플로우가 멈추므로 S3 PUT은 불필요
        http.post('*/api/s3', () =>
          HttpResponse.json(
            { code: 'S3_001', message: 'Failed to generate presigned URL' },
            { status: 500 }
          )
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    await fillForm(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '제출하기' }));
    await expect(
      canvas.findByText('파일 업로드 URL 생성에 실패했습니다.')
    ).resolves.toBeInTheDocument();
  },
};

export const ErrorS3UploadFail: Story = {
  name: '500 S3 파일 업로드 실패',
  parameters: {
    msw: {
      handlers: [
        // PUT 오버라이드를 먼저 등록해 s3Handlers의 PUT보다 우선 적용
        http.put(
          `${MOCK_S3_BASE_URL}/*`,
          () => new HttpResponse(null, { status: 500 })
        ),
        // presigned URL 발급(POST /api/s3)은 정상 동작 필요
        ...s3Handlers,
      ],
    },
  },
  play: async ({ canvasElement }) => {
    await fillForm(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '제출하기' }));
    await expect(
      canvas.findByText('파일 업로드 URL 생성에 실패했습니다.')
    ).resolves.toBeInTheDocument();
  },
};

export const ErrorEventClosed: Story = {
  name: '400 마감된 이벤트 신청',
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/applications', () =>
          HttpResponse.json(
            { code: 'GEN_003', message: 'Event is already closed' },
            { status: 400 }
          )
        ),
        // fillForm의 업로드 플로우(POST /api/s3 + PUT S3)에 필요
        ...s3Handlers,
      ],
    },
  },
  play: async ({ canvasElement }) => {
    await fillForm(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '제출하기' }));
    await expect(
      canvas.findByText('잘못된 요청입니다.')
    ).resolves.toBeInTheDocument();
  },
};

export const ErrorEventNotFound: Story = {
  name: '404 존재하지 않는 이벤트',
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/applications', () =>
          HttpResponse.json(
            { code: 'EVENT_001', message: 'Event not found' },
            { status: 404 }
          )
        ),
        ...s3Handlers,
      ],
    },
  },
  play: async ({ canvasElement }) => {
    await fillForm(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '제출하기' }));
    await expect(
      canvas.findByText('이벤트를 찾을 수 없습니다.')
    ).resolves.toBeInTheDocument();
  },
};

export const ErrorStoreLoadFail: Story = {
  name: '404 가게 정보 조회 실패 — 로딩 유지',
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/store/:storeId', () =>
          HttpResponse.json(
            { code: 'STORE_001', message: 'Store not found' },
            { status: 404 }
          )
        ),
        // 이벤트 쿼리는 글로벌 핸들러와 독립적으로 병렬 실행되므로 별도 포함
        ...eventHandlers,
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 이벤트 카드는 성공적으로 로드되고, 가게 카드만 로딩 상태로 남는지 확인
    await expect(
      canvas.findByText('신규 메뉴 불닭볶음면 먹고 리뷰 달기')
    ).resolves.toBeInTheDocument();
    expect(canvas.getAllByText('불러오는 중...')).toHaveLength(1);
  },
};
