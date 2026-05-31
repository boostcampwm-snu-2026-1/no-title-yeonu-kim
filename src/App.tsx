import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'storybook/internal/preview-api';
import { useAuthQuery } from '@/feature/auth/application/auth-query';
import { implAuthUsecase } from '@/feature/auth/usecase/auth-usecase';
import { QueryContext } from '@/feature/shared/context/query-context';
import { TokenContext } from '@/feature/shared/context/token-context';
import { UsecaseContext } from '@/feature/shared/context/usecase-context';
import { RouterProvider } from '@/feature/shared/routes/router-provider';
import { externalCall, implApi } from '@/infrastructure/api';
import { implTokenRepository } from '@/infrastructure/token/token-repository';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const App = () => {
  const [token, setToken] = useState<string | null>(null);
  const api = implApi({ externalCall });
  const tokenRepository = implTokenRepository({ setToken });
  const authUsecase = implAuthUsecase({ api, tokenRepository });
  const authQuery = useAuthQuery({ authUsecase });

  return (
    <QueryClientProvider client={queryClient}>
      <QueryContext.Provider value={{ authQuery }}>
        <TokenContext.Provider value={{ token }}>
          <UsecaseContext.Provider value={{ authUsecase }}>
            <RouterProvider />
          </UsecaseContext.Provider>
        </TokenContext.Provider>
      </QueryContext.Provider>
    </QueryClientProvider>
  );
};
