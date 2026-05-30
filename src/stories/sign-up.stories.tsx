import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import { expect, userEvent, within } from 'storybook/test';
import { SignUpForm } from '@/widgets/auth';

const VALID_PASSWORD = 'TestPass1!';
const VALID_NAME = '홍길동';
const VALID_EMAIL = 'test@example.com';

const meta: Meta<typeof SignUpForm> = {
  title: 'Auth/SignUpForm',
  component: SignUpForm,
};

export default meta;

type Story = StoryObj<typeof SignUpForm>;

export const SuccessReviewer: Story = {
  name: '200 회원가입 성공 (손님)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('실명'), VALID_NAME);
    await userEvent.type(canvas.getByLabelText('이메일'), VALID_EMAIL);
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
    await userEvent.type(canvas.getByLabelText('이메일'), 'owner@example.com');
    await userEvent.type(canvas.getByLabelText('비밀번호'), VALID_PASSWORD);
    await userEvent.type(
      canvas.getByLabelText('비밀번호 확인'),
      VALID_PASSWORD
    );
    await userEvent.click(canvas.getByRole('button', { name: '회원가입' }));
  },
};

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
  name: '409 중복 이메일',
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/auth/user', () =>
          HttpResponse.json(
            { code: 'USER_001', message: 'This email is already registered' },
            { status: 409 }
          )
        ),
      ],
    },
  },
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
      canvas.findByText('이미 사용 중인 이메일입니다.')
    ).resolves.toBeInTheDocument();
  },
};

export const ErrorReviewerExpiredCode: Story = {
  name: '400 이메일 인증 코드 만료 (손님)',
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/auth/user', () =>
          HttpResponse.json(
            {
              code: 'USER_006',
              message: 'Email verification code is invalid or expired',
            },
            { status: 400 }
          )
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('실명'), VALID_NAME);
    await userEvent.type(
      canvas.getByLabelText('이메일'),
      'test+fail@example.com'
    );
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
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/auth/user', () =>
          HttpResponse.json(
            { code: 'AUTH_002', message: 'Invalid credentials' },
            { status: 401 }
          )
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: '사장님' }));
    await userEvent.type(canvas.getByLabelText('실명'), VALID_NAME);
    await userEvent.type(canvas.getByLabelText('이메일'), 'owner@example.com');
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
