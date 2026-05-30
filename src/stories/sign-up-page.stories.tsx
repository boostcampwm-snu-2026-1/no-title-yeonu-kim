import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, within } from 'storybook/test';
import { SignUpPage } from '@/pages/sign-up';

const VALID_PASSWORD = 'TestPass1!';
const VALID_NAME = '홍길동';
const VALID_EMAIL = 'test@example.com';
const VALID_CODE = '123456';

async function completeEmailVerification(
  canvas: ReturnType<typeof within>,
  email = VALID_EMAIL
) {
  await userEvent.type(canvas.getByLabelText('이메일'), email);
  await userEvent.click(
    canvas.getByRole('button', { name: '인증 코드 발송' })
  );
  const codeInput = await canvas.findByLabelText('인증 코드');
  await userEvent.type(codeInput, VALID_CODE);
  await userEvent.click(canvas.getByRole('button', { name: '인증 확인' }));
  await expect(
    canvas.findByText('이메일 인증이 완료되었습니다.')
  ).resolves.toBeInTheDocument();
}

const meta: Meta<typeof SignUpPage> = {
  title: 'Pages/SignUpPage',
  component: SignUpPage,
};

export default meta;

type Story = StoryObj<typeof SignUpPage>;

export const Default: Story = {
  name: '기본 페이지 렌더링',
};

export const FullFlowSuccess: Story = {
  name: '전체 플로우 — 손님 회원가입 성공',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('실명'), VALID_NAME);
    await completeEmailVerification(canvas);
    await userEvent.type(canvas.getByLabelText('비밀번호'), VALID_PASSWORD);
    await userEvent.type(
      canvas.getByLabelText('비밀번호 확인'),
      VALID_PASSWORD
    );
    await userEvent.click(canvas.getByRole('button', { name: '회원가입' }));
  },
};

export const FullFlowOwnerSuccess: Story = {
  name: '전체 플로우 — 사장님 회원가입 성공',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: '사장님' }));
    await userEvent.type(canvas.getByLabelText('실명'), VALID_NAME);
    await completeEmailVerification(canvas, 'owner@example.com');
    await userEvent.type(canvas.getByLabelText('비밀번호'), VALID_PASSWORD);
    await userEvent.type(
      canvas.getByLabelText('비밀번호 확인'),
      VALID_PASSWORD
    );
    await userEvent.click(canvas.getByRole('button', { name: '회원가입' }));
  },
};

export const FullFlowDuplicateEmail: Story = {
  name: '전체 플로우 — 중복 이메일 → 모달',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('실명'), VALID_NAME);
    await userEvent.type(
      canvas.getByLabelText('이메일'),
      'duplicate@example.com'
    );
    await userEvent.type(canvas.getByLabelText('비밀번호'), VALID_PASSWORD);
    await userEvent.type(
      canvas.getByLabelText('비밀번호 확인'),
      VALID_PASSWORD
    );
    await userEvent.click(canvas.getByRole('button', { name: '회원가입' }));
    await expect(
      screen.findByText('이미 가입된 이메일입니다')
    ).resolves.toBeInTheDocument();
    // 로그인하기 버튼 클릭 시 로그인 페이지로 이동
    await userEvent.click(screen.getByRole('button', { name: '로그인하기' }));
  },
};

export const FullFlowEmailVerification: Story = {
  name: '전체 플로우 — 이메일 발송 → 코드 인증',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('이메일'), VALID_EMAIL);
    await userEvent.click(
      canvas.getByRole('button', { name: '인증 코드 발송' })
    );
    // 코드 입력창과 타이머 표시 확인
    await expect(
      canvas.findByLabelText('인증 코드')
    ).resolves.toBeInTheDocument();
    await expect(canvas.findByText(/5:0/)).resolves.toBeInTheDocument();
    // 코드 인증
    const codeInput = await canvas.findByLabelText('인증 코드');
    await userEvent.type(codeInput, VALID_CODE);
    await userEvent.click(canvas.getByRole('button', { name: '인증 확인' }));
    await expect(
      canvas.findByText('이메일 인증이 완료되었습니다.')
    ).resolves.toBeInTheDocument();
  },
};
