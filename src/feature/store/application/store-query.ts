import { useQuery } from '@tanstack/react-query';

import type {
  StoreEventListResponse,
  StoreListWithEventsResponse,
} from '@/infrastructure/api/apis/local-server/schemas';

import type { StoreUsecase } from '../usecase/store-usecase';

export type StoreQuery = ReturnType<typeof useStoreQuery>;

export const useStoreQuery = ({
  storeUsecase,
}: {
  storeUsecase: StoreUsecase;
}) => {
  return {
    useGetStores: ({ name }: { name: string }) => {
      const { data, isLoading } = useQuery({
        queryKey: ['stores', name],
        queryFn: async (): Promise<StoreListWithEventsResponse> => {
          const response = await storeUsecase.getStores({ name });
          if (response.type === 'success') {
            return response.data;
          }
          throw new Error(response.message);
        },
      });
      return { storeList: data, isLoading };
    },

    useGetStoreEvents: ({ storeId }: { storeId: string | null }) => {
      const { data } = useQuery({
        queryKey: ['store-events', storeId],
        queryFn: async (): Promise<StoreEventListResponse> => {
          const response = await storeUsecase.getStoreEvents({
            storeId: storeId!,
          });
          if (response.type === 'success') {
            return response.data;
          }
          throw new Error(response.message);
        },
        enabled: storeId !== null,
      });
      return { eventList: data };
    },
  };
};
