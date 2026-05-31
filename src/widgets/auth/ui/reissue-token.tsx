import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router';
import { QueryContext } from '@/feature/shared/context/query-context';
import { TokenContext } from '@/feature/shared/context/token-context';
import { useGuardContext } from '@/feature/shared/context/use-gaurd-context';

export const ReissueToken = () => {
  const hasReissued = useRef(false);
  const { token } = useGuardContext(TokenContext);

  const { authQuery } = useGuardContext(QueryContext);
  const { useRefreshToken } = authQuery;
  const { reissueToken } = useRefreshToken();

  useEffect(() => {
    if (token === null && !hasReissued.current) {
      hasReissued.current = true;
      reissueToken();
    }
  }, [token, useRefreshToken]);

  if (token === null && !hasReissued.current) {
    return null;
  }

  return <Outlet />;
};
