import type { UserRole } from '@/feature/auth/domain/user-role';
import type { UsecaseResponse } from '@/feature/shared/response';
import type { Apis } from '@/infrastructure/api';
import type { UserWithAccessTokenResponse } from '@/mocks/auth/schemas';

export type AuthUsecase = {
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

export const implAuthUsecase = ({ api }: { api: Apis }): AuthUsecase => ({
  signUp: async ({ role, username, email, password }) => {
    const { status, data } = await api['POST /api/auth/user']({
      body: { role, username, email, password },
    });

    if (status === 200) {
      return { type: 'success', data: data };
    }

    return { type: 'error', code: data.code, message: data.message };
  },

  signIn: async ({ role, mail, password }) => {
    const { status, data } = await api['POST /api/auth/user/session']({
      body: { role, mail, password },
    });

    if (status === 200) {
      return {
        type: 'success',
        data,
      };
    }
    return { type: 'error', code: data.code, message: data.message };
  },
});
