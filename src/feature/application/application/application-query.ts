import { useMutation, useQuery } from '@tanstack/react-query';
import { createErrorMessage } from '@/feature/shared/error/create-error-message';
import type {
  EventDetailResponse,
  StoreDetailResponse,
} from '@/infrastructure/api/apis/local-server/schemas';
import type { ApplicationUsecase } from '../usecase/application-usecase';

export type ApplicationQuery = ReturnType<typeof useApplicationQuery>;

export const useApplicationQuery = ({
  applicationUsecase,
}: {
  applicationUsecase: ApplicationUsecase;
}) => {
  return {
    useGetStore: ({ storeId }: { storeId: string }) => {
      const { data, isLoading } = useQuery({
        queryKey: ['store', storeId],
        queryFn: async (): Promise<StoreDetailResponse> => {
          const response = await applicationUsecase.getStore({ storeId });
          if (response.type === 'success') {
            return response.data;
          }
          throw new Error(response.message);
        },
      });
      return { store: data, isLoading };
    },

    useGetEvent: ({ eventId }: { eventId: string }) => {
      const { data, isLoading } = useQuery({
        queryKey: ['event', eventId],
        queryFn: async (): Promise<EventDetailResponse> => {
          const response = await applicationUsecase.getEvent({ eventId });
          if (response.type === 'success') {
            return response.data;
          }
          throw new Error(response.message);
        },
      });
      return { event: data, isLoading };
    },

    useSubmitApplication: ({
      setResponseMessage,
      onSuccess,
    }: {
      setResponseMessage: (message: string) => void;
      onSuccess: () => void;
    }) => {
      const { mutate: submitApplication, isPending } = useMutation({
        mutationFn: async ({
          eventId,
          walletAddress,
          imageFile,
        }: {
          eventId: string;
          walletAddress: string;
          imageFile: File;
        }) => {
          return await applicationUsecase.submitApplication({
            eventId,
            walletAddress,
            imageFile,
          });
        },
        onSuccess: (response) => {
          if (response.type === 'success') {
            onSuccess();
            return;
          }
          setResponseMessage(
            createErrorMessage(
              response.code,
              '제출에 실패했습니다. 다시 시도해 주세요.'
            )
          );
        },
      });
      return { submitApplication, isPending };
    },
  };
};
