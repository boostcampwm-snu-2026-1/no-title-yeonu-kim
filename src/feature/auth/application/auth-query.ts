import { useMutation } from '@tanstack/react-query';
import { useGuardContext } from '@/feature/shared/context/use-gaurd-context';
import { UsecaseContext } from '@/feature/shared/context/usecase-context';
import { createErrorMessage } from '@/feature/shared/error/create-error-message';
import { useRouteNavigation } from '@/routes/use-route-navigation';
import type { UserRole } from '../domain/user-role';

export const useSignIn = ({
  setResponseMessage,
}: {
  setResponseMessage: (message: string) => void;
}) => {
  const { authUsecase } = useGuardContext(UsecaseContext);
  const { toMain } = useRouteNavigation();
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
};

export const useSignUp = ({
  setResponseMessage,
}: {
  setResponseMessage: (message: string) => void;
}) => {
  const { authUsecase } = useGuardContext(UsecaseContext);
  const { toMain } = useRouteNavigation();
  const { mutate: signUp, isPending } = useMutation({
    mutationFn: async ({
      role,
      username,
      email,
      password,
    }: {
      role: 'OWNER' | 'REVIEWER';
      username: string;
      email: string;
      password: string;
    }) => {
      return await authUsecase.signUp({
        role,
        username,
        email,
        password,
      });
    },
    onSuccess: (response) => {
      if (response.type === 'success') {
        toMain();
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
};
