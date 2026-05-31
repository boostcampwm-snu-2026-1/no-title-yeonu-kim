import type { Preview } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { type ReactNode, useState } from 'react';
import { MemoryRouter } from 'react-router';

import { useAuthQuery } from '../src/feature/auth/application/auth-query';
import { implAuthUsecase } from '../src/feature/auth/usecase/auth-usecase';
import { QueryContext } from '../src/feature/shared/context/query-context';
import { TokenContext } from '../src/feature/shared/context/token-context';
import { UsecaseContext } from '../src/feature/shared/context/usecase-context';
import { externalCall, implApi } from '../src/infrastructure/api';
import { implTokenRepository } from '../src/infrastructure/token/token-repository';
import { handlers } from '../src/mocks/handlers';
import '../src/index.css';

initialize({ onUnhandledRequest: 'bypass' });

/**
 * QueryClientProvider 안에서 렌더되는 내부 컴포넌트.
 * module 레벨에 정의해야 story 전환 시 불필요한 remount를 방지할 수 있다.
 */
const StoryAuthProviders = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const api = implApi({ externalCall });
  const tokenRepository = implTokenRepository({ setToken });
  const authUsecase = implAuthUsecase({ api, tokenRepository });
  const authQuery = useAuthQuery({ authUsecase });

  return (
    <QueryContext.Provider value={{ authQuery }}>
      <TokenContext.Provider value={{ token }}>
        <UsecaseContext.Provider value={{ authUsecase }}>
          {children}
        </UsecaseContext.Provider>
      </TokenContext.Provider>
    </QueryContext.Provider>
  );
};

const preview: Preview = {
  parameters: {
    msw: { handlers },
  },
  loaders: [mswLoader],
  decorators: [
    (Story) => {
      const [queryClient] = useState(
        () =>
          new QueryClient({
            defaultOptions: {
              queries: { refetchOnWindowFocus: false, retry: false },
              mutations: { retry: false },
            },
          })
      );

      return (
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <StoryAuthProviders>
              <Story />
            </StoryAuthProviders>
          </QueryClientProvider>
        </MemoryRouter>
      );
    },
  ],
};

export default preview;
