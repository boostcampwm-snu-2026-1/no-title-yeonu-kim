import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createErrorMessage } from '@/feature/shared/error/create-error-message';
import { useRouteNavigation } from '@/feature/shared/routes/use-route-navigation';
import type { UserRole } from '../domain/user-role';
import type { AuthUsecase } from '../usecase/auth-usecase';

export type AuthQuery = ReturnType<typeof useAuthQuery>;

export const useAuthQuery = ({ authUsecase }: { authUsecase: AuthUsecase }) => {
  const { toMain } = useRouteNavigation();
  const queryClient = useQueryClient();

  return {
    useSendVerificationEmail: ({
      onSuccess,
      setResponseMessage,
    }: {
      onSuccess: () => void;
      setResponseMessage: (message: string) => void;
    }) => {
      const { mutate: sendVerificationEmail, isPending } = useMutation({
        mutationFn: async ({ email }: { email: string }) => {
          return await authUsecase.sendVerificationEmail({ email });
        },
        onSuccess: (response) => {
          if (response.type === 'success') {
            onSuccess();
            return;
          }
          setResponseMessage(
            createErrorMessage(
              response.code,
              '인증 이메일 발송에 실패했습니다.'
            )
          );
        },
      });

      return { sendVerificationEmail, isPending };
    },

    useValidateEmailCode: ({
      onSuccess,
      setCodeError,
    }: {
      onSuccess: (verificationToken: string) => void;
      setCodeError: (message: string) => void;
    }) => {
      const { mutate: validateEmailCode, isPending } = useMutation({
        mutationFn: async ({
          email,
          code,
        }: {
          email: string;
          code: string;
        }) => {
          return await authUsecase.validateEmailCode({ email, code });
        },
        onSuccess: (response) => {
          if (response.type === 'success') {
            onSuccess(response.data.verificationToken);
            return;
          }
          setCodeError(
            createErrorMessage(response.code, '인증 코드 확인에 실패했습니다.')
          );
        },
      });

      return { validateEmailCode, isPending };
    },
    useSignIn: ({
      setResponseMessage,
    }: {
      setResponseMessage: (message: string) => void;
    }) => {
      const { mutate: signIn, isPending } = useMutation({
        mutationFn: async ({
          role,
          mail,
          password,
        }: {
          role: UserRole;
          mail: string;
          password: string;
        }) => {
          return await authUsecase.signIn({ role, mail, password });
        },
        onSuccess: (response) => {
          if (response.type === 'success') {
            toMain();
            return;
          }
          setResponseMessage(
            createErrorMessage(
              response.code,
              '로그인에 실패했습니다. 다시 시도해 주세요.'
            )
          );
        },
      });

      return { signIn, isPending };
    },
    useSignUp: ({
      setResponseMessage,
      onDuplicateEmail,
    }: {
      setResponseMessage: (message: string) => void;
      onDuplicateEmail: () => void;
    }) => {
      const { mutate: signUp, isPending } = useMutation({
        mutationFn: async ({
          role,
          username,
          email,
          password,
        }: {
          role: UserRole;
          username: string;
          email: string;
          password: string;
        }) => {
          const checkResult = await authUsecase.checkEmailDuplicate({ email });
          if (checkResult.type === 'error') {
            return checkResult;
          }
          return await authUsecase.signUp({ role, username, email, password });
        },
        onSuccess: (response) => {
          if (response.type === 'success') {
            toMain();
            return;
          }
          if (response.code === 'USER_001') {
            onDuplicateEmail();
            return;
          }
          setResponseMessage(
            createErrorMessage(
              response.code,
              '회원가입에 실패했습니다. 다시 시도해 주세요.'
            )
          );
        },
      });

      return { signUp, isPending };
    },
    useRefreshToken: () => {
      const { mutate: reissueToken } = useMutation({
        mutationFn: async () => {
          const response = await authUsecase.reissueAccessToken();
          return response;
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries();
        },
        onError: () => {
          return;
        },
      });

      return {
        reissueToken,
      };
    },
  };
};
