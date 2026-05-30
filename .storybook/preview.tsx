import type { Preview } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { MemoryRouter } from 'react-router';
import { implAuthUsecase } from '../src/feature/auth/usecase/auth-usecase';
import { UsecaseContext } from '../src/feature/shared/context/usecase-context';
import { externalCall, implApi } from '../src/infrastructure/api';
import { handlers } from '../src/mocks/handlers';
import '../src/index.css';

initialize({ onUnhandledRequest: 'bypass' });

const preview: Preview = {
  parameters: {
    msw: { handlers },
  },
  loaders: [mswLoader],
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, retry: false },
          mutations: { retry: false },
        },
      });
      const api = implApi({ externalCall });
      const authUsecase = implAuthUsecase({ api });

      return (
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <UsecaseContext.Provider value={{ authUsecase }}>
              <Story />
            </UsecaseContext.Provider>
          </QueryClientProvider>
        </MemoryRouter>
      );
    },
  ],
};

export default preview;
