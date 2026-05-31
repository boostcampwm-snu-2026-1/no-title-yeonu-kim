import type { UserRole } from '@/feature/auth/domain/user-role';
import type { UsecaseResponse } from '@/feature/shared/response';
import type { Apis } from '@/infrastructure/api';
import type { VerificationTokenResponse } from '@/infrastructure/api/apis/local-server/schemas';
import type { TokenStateRepository } from '@/infrastructure/token/token-repository';
import type { UserWithAccessTokenResponse } from '@/mocks/auth/schemas';

export type AuthUsecase = {
  checkEmailDuplicate: ({ email }: { email: string }) => UsecaseResponse<null>;
  sendVerificationEmail: ({
    email,
  }: {
    email: string;
  }) => UsecaseResponse<null>;
  validateEmailCode: ({
    email,
    code,
  }: {
    email: string;
    code: string;
  }) => UsecaseResponse<VerificationTokenResponse>;
  signUp: ({
    role,
    username,
    email,
    password,
  }: {
    role: UserRole;
    username: string;
    email: string;
    password: string;
  }) => UsecaseResponse<UserWithAccessTokenResponse>;
  signIn: ({
    role,
    mail,
    password,
  }: {
    role: UserRole;
    mail: string;
    password: string;
  }) => UsecaseResponse<UserWithAccessTokenResponse>;
};

export const implAuthUsecase = ({
  api,
  tokenRepository,
}: {
  api: Apis;
  tokenRepository: TokenStateRepository;
}): AuthUsecase => ({
  checkEmailDuplicate: async ({ email }) => {
    const { status, data } = await api['POST /api/auth/email']({
      body: { email },
    });
    if (status === 200) {
      return { type: 'success', data: null };
    }
    return { type: 'error', code: data.code, message: data.message };
  },

  sendVerificationEmail: async ({ email }) => {
    const { status, data } = await api['POST /api/auth/email/verify']({
      body: { email },
    });
    if (status === 200) {
      return { type: 'success', data: null };
    }
    return { type: 'error', code: data.code, message: data.message };
  },

  validateEmailCode: async ({ email, code }) => {
    const { status, data } = await api['POST /api/auth/email/validate']({
      body: { email, code },
    });
    if (status === 200) {
      return { type: 'success', data: data as VerificationTokenResponse };
    }
    return { type: 'error', code: data.code, message: data.message };
  },

  signUp: async ({ role, username, email, password }) => {
    const { status, data } = await api['POST /api/auth/user']({
      body: { role, username, email, password },
    });

    if (status === 200) {
      tokenRepository.setToken({ token: data.token });
      return { type: 'success', data: data };
    }

    return { type: 'error', code: data.code, message: data.message };
  },

  signIn: async ({ role, mail, password }) => {
    const { status, data } = await api['POST /api/auth/user/session']({
      body: { role, mail, password },
    });

    if (status === 200) {
      tokenRepository.setToken({ token: data.token });
      return {
        type: 'success',
        data,
      };
    }
    return { type: 'error', code: data.code, message: data.message };
  },
});
