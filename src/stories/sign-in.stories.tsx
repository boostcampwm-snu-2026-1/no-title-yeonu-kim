import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import { expect, userEvent, within } from 'storybook/test';
import { SignInForm } from '@/widgets/auth';

const meta: Meta<typeof SignInForm> = {
  title: 'Auth/SignInForm',
  component: SignInForm,
};

export default meta;

type Story = StoryObj<typeof SignInForm>;

export const SuccessReviewer: Story = {
  name: '200 로그인 성공 (손님)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByLabelText('이메일'),
      'reviewer@example.com'
    );
    await userEvent.type(canvas.getByLabelText('비밀번호'), 'TestPass1!');
    await userEvent.click(canvas.getByRole('button', { name: '로그인' }));
  },
};

export const ClientValidationError: Story = {
  name: '400 빈 폼 제출 (클라이언트 유효성)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '로그인' }));
    await expect(
      canvas.findByText('올바른 이메일을 입력해 주세요.')
    ).resolves.toBeInTheDocument();
    await expect(
      canvas.findByText('비밀번호를 입력해 주세요.')
    ).resolves.toBeInTheDocument();
  },
};

export const ErrorNotFound: Story = {
  name: '401 계정 없음',
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/auth/user/session', () =>
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
    await userEvent.type(
      canvas.getByLabelText('이메일'),
      'notfound@example.com'
    );
    await userEvent.type(canvas.getByLabelText('비밀번호'), 'TestPass1!');
    await userEvent.click(canvas.getByRole('button', { name: '로그인' }));
    await expect(
      canvas.findByText('이메일 또는 비밀번호가 일치하지 않습니다.')
    ).resolves.toBeInTheDocument();
  },
};

export const ErrorWrongPassword: Story = {
  name: '401 비밀번호 불일치',
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/auth/user/session', () =>
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
    await userEvent.type(canvas.getByLabelText('이메일'), 'valid@example.com');
    await userEvent.type(canvas.getByLabelText('비밀번호'), 'wrongpassword');
    await userEvent.click(canvas.getByRole('button', { name: '로그인' }));
    await expect(
      canvas.findByText('이메일 또는 비밀번호가 일치하지 않습니다.')
    ).resolves.toBeInTheDocument();
  },
};
