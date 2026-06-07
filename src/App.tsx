import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { useApplicationQuery } from '@/feature/application/application/application-query';
import { implApplicationUsecase } from '@/feature/application/usecase/application-usecase';
import { useAuthQuery } from '@/feature/auth/application/auth-query';
import { implAuthUsecase } from '@/feature/auth/usecase/auth-usecase';
import { implFileUsecase } from '@/feature/file/usecase/file-usecase';
import { QueryContext } from '@/feature/shared/context/query-context';
import { ReviewContext } from '@/feature/shared/context/review-context';
import { TokenContext } from '@/feature/shared/context/token-context';
import { UsecaseContext } from '@/feature/shared/context/usecase-context';
import { RouterProvider } from '@/feature/shared/routes/router-provider';
import { useStoreQuery } from '@/feature/store/application/store-query';
import { implStoreUsecase } from '@/feature/store/usecase/store-usecase';
import { externalCall, implApi } from '@/infrastructure/api';
import { implStorageApi } from '@/infrastructure/api/client';
import { externalStorageCall } from '@/infrastructure/api/external-call';
import { implTokenRepository } from '@/infrastructure/token/token-repository';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const AppContent = () => {
  const [token, setToken] = useState<string | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const api = implApi({ externalCall });
  const storageApi = implStorageApi({ externalStorageCall });
  const tokenRepository = implTokenRepository({ setToken });
  const authUsecase = implAuthUsecase({ api, tokenRepository });
  const authQuery = useAuthQuery({ authUsecase });
  const storeUsecase = implStoreUsecase({ api });
  const storeQuery = useStoreQuery({ storeUsecase });
  const fileUsecase = implFileUsecase({ api, storageApi });
  const applicationUsecase = implApplicationUsecase({ api, fileUsecase });
  const applicationQuery = useApplicationQuery({ applicationUsecase });

  return (
    <QueryContext.Provider value={{ authQuery, storeQuery, applicationQuery }}>
      <TokenContext.Provider value={{ token }}>
        <UsecaseContext.Provider value={{ authUsecase }}>
          <ReviewContext.Provider
            value={{
              storeId,
              eventId,
              setStore: (id) => {
                setStoreId(id);
                setEventId(null);
              },
              setEvent: setEventId,
            }}
          >
            <RouterProvider />
          </ReviewContext.Provider>
        </UsecaseContext.Provider>
      </TokenContext.Provider>
    </QueryContext.Provider>
  );
};

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};
