import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import { expect, screen, userEvent, within } from 'storybook/test';
import { SignUpForm } from '@/widgets/auth';

const VALID_PASSWORD = 'TestPass1!';
const VALID_NAME = '홍길동';
const VALID_EMAIL = 'test@example.com';
const VALID_CODE = '123456';

async function completeEmailVerification(
  canvas: ReturnType<typeof within>,
  email = VALID_EMAIL
) {
  await userEvent.type(canvas.getByLabelText('이메일'), email);
  await userEvent.click(canvas.getByRole('button', { name: '인증 코드 발송' }));
  const codeInput = await canvas.findByLabelText('인증 코드');
  await userEvent.type(codeInput, VALID_CODE);
  await userEvent.click(canvas.getByRole('button', { name: '인증 확인' }));
  await expect(
    canvas.findByText('이메일 인증이 완료되었습니다.')
  ).resolves.toBeInTheDocument();
}

const meta: Meta<typeof SignUpForm> = {
  title: 'Auth/SignUpForm',
  component: SignUpForm,
};

export default meta;

type Story = StoryObj<typeof SignUpForm>;

// ─── 인증 이메일 발송 ──────────────────────────────────────

export const SendVerificationEmail: Story = {
  name: '인증 이메일 발송 → 코드 입력창 표시',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('이메일'), VALID_EMAIL);
    await userEvent.click(
      canvas.getByRole('button', { name: '인증 코드 발송' })
    );
    await expect(
      canvas.findByLabelText('인증 코드')
    ).resolves.toBeInTheDocument();
  },
};

export const ResendCooldown: Story = {
  name: '재발송 버튼 쿨다운 (30초)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('이메일'), VALID_EMAIL);
    await userEvent.click(
      canvas.getByRole('button', { name: '인증 코드 발송' })
    );
    const resendBtn = await canvas.findByRole('button', { name: /재발송/ });
    await expect(resendBtn).toBeDisabled();
  },
};

export const SendEmailFailed: Story = {
  name: '500 인증 이메일 발송 실패',
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/auth/email/verify', () =>
          HttpResponse.json(
            { code: 'MAIL_001', message: 'Failed to send email' },
            { status: 500 }
          )
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByLabelText('이메일'),
      'fail-send@example.com'
    );
    await userEvent.click(
      canvas.getByRole('button', { name: '인증 코드 발송' })
    );
    await expect(
      canvas.findByText(
        '이메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.'
      )
    ).resolves.toBeInTheDocument();
  },
};

// ─── 인증 코드 확인 ────────────────────────────────────────

export const VerifyCodeSuccess: Story = {
  name: '인증 코드 확인 성공 → 인증 완료 표시',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('이메일'), VALID_EMAIL);
    await userEvent.click(
      canvas.getByRole('button', { name: '인증 코드 발송' })
    );
    const codeInput = await canvas.findByLabelText('인증 코드');
    await userEvent.type(codeInput, VALID_CODE);
    await userEvent.click(canvas.getByRole('button', { name: '인증 확인' }));
    await expect(
      canvas.findByText('이메일 인증이 완료되었습니다.')
    ).resolves.toBeInTheDocument();
  },
};

export const VerifyCodeError: Story = {
  name: '400 잘못된 인증 코드 → 에러 메시지',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('이메일'), VALID_EMAIL);
    await userEvent.click(
      canvas.getByRole('button', { name: '인증 코드 발송' })
    );
    const codeInput = await canvas.findByLabelText('인증 코드');
    await userEvent.type(codeInput, '000000');
    await userEvent.click(canvas.getByRole('button', { name: '인증 확인' }));
    await expect(
      canvas.findByText('이메일 인증 코드가 유효하지 않거나 만료되었습니다.')
    ).resolves.toBeInTheDocument();
  },
};

// ─── 회원가입 성공 ─────────────────────────────────────────

export const SuccessReviewer: Story = {
  name: '200 회원가입 성공 (손님)',
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

export const SuccessOwner: Story = {
  name: '200 회원가입 성공 (사장님)',
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

// ─── 에러 시나리오 ─────────────────────────────────────────

export const ClientValidationError: Story = {
  name: '400 빈 폼 제출 (클라이언트 유효성)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '회원가입' }));
    await expect(
      canvas.findByText('한글 2~6자 또는 영문 2~20자로 입력해 주세요.')
    ).resolves.toBeInTheDocument();
    await expect(
      canvas.findByText('올바른 이메일을 입력해 주세요.')
    ).resolves.toBeInTheDocument();
    await expect(
      canvas.findByText('비밀번호 필수 조건을 만족해 주세요.')
    ).resolves.toBeInTheDocument();
  },
};

export const ErrorDuplicateEmail: Story = {
  name: '409 중복 이메일 → 로그인 유도 모달',
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
    // 모달은 document.body에 portal로 렌더링됨
    await expect(
      screen.findByText('이미 가입된 이메일입니다')
    ).resolves.toBeInTheDocument();
  },
};

export const ErrorReviewerExpiredCode: Story = {
  name: '400 이메일 인증 코드 만료 (손님)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('실명'), VALID_NAME);
    await completeEmailVerification(canvas, 'test+fail@snu.ac.kr');
    await userEvent.type(canvas.getByLabelText('비밀번호'), VALID_PASSWORD);
    await userEvent.type(
      canvas.getByLabelText('비밀번호 확인'),
      VALID_PASSWORD
    );
    await userEvent.click(canvas.getByRole('button', { name: '회원가입' }));
    await expect(
      canvas.findByText('이메일 인증 코드가 유효하지 않거나 만료되었습니다.')
    ).resolves.toBeInTheDocument();
  },
};

export const ErrorOwnerWrongPassword: Story = {
  name: '401 비밀번호 불일치 (사장님)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: '사장님' }));
    await userEvent.type(canvas.getByLabelText('실명'), VALID_NAME);
    await completeEmailVerification(canvas, 'owner@example.com');
    await userEvent.type(
      canvas.getByLabelText('비밀번호'),
      'wrong-owner-secret'
    );
    await userEvent.type(
      canvas.getByLabelText('비밀번호 확인'),
      'wrong-owner-secret'
    );
    await userEvent.click(canvas.getByRole('button', { name: '회원가입' }));
    await expect(
      canvas.findByText('이메일 또는 비밀번호가 일치하지 않습니다.')
    ).resolves.toBeInTheDocument();
  },
};
