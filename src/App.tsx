import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { implAuthUsecase } from '@/feature/auth/usecase/auth-usecase';
import { UsecaseContext } from '@/feature/shared/context/usecase-context';
import { externalCall, implApi } from '@/infrastructure/api';
import { RouterProvider } from './routes/router-provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const App = () => {
  const api = implApi({ externalCall });
  const authUsecase = implAuthUsecase({ api });

  return (
    <QueryClientProvider client={queryClient}>
      <UsecaseContext.Provider value={{ authUsecase }}>
        <RouterProvider />
      </UsecaseContext.Provider>
    </QueryClientProvider>
  );
};
