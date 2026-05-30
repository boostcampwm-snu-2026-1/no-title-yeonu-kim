import { useMutation } from '@tanstack/react-query';
import { useGuardContext } from '@/feature/shared/context/use-gaurd-context';
import { UsecaseContext } from '@/feature/shared/context/usecase-context';
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
      } else {
        if (response.code === 'AUTH_002' || response.code === 'GEN_004') {
          setResponseMessage('아이디 또는 비밀번호가 일치하지 않습니다.');
          return;
        }
      }
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
      } else {
        if (response.code === 'USER_003') {
          setResponseMessage('이미 존재하는 이메일입니다.');
          return;
        }
        setResponseMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    },
  });

  return { signUp, isPending };
};
