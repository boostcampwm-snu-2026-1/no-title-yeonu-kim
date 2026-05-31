import { Outlet } from 'react-router';
import type { UserRole } from '@/feature/auth/domain/user-role';
import { TokenContext } from '@/feature/shared/context/token-context';
import { useGuardContext } from '@/feature/shared/context/use-gaurd-context';
import { UserContext } from '@/feature/shared/context/user-context';
import { PATH } from '@/feature/shared/routes/path';
import { RouteNavigator } from '@/feature/shared/routes/route-navigator';
import { ReSignInModal } from '@/widgets/common/ui/re-sign-in-modal';

export const ProtectedRoute = ({ role }: { role: UserRole | 'SIGN_IN' }) => {
  const { token } = useGuardContext(TokenContext);
  const { role: currentRole } = useGuardContext(UserContext);

  if (token === null) {
    return <ReSignInModal />;
  }

  if (role === 'SIGN_IN') {
    return <Outlet />;
  }

  if (currentRole === role) {
    return <Outlet />;
  }

  return <RouteNavigator link={PATH.LANDING} />;
};
