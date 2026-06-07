import type { UsecaseResponse } from '@/feature/shared/response';
import type { Apis } from '@/infrastructure/api';
import type {
  StoreEventListResponse,
  StoreListWithEventsResponse,
} from '@/infrastructure/api/apis/local-server/schemas';

export type StoreUsecase = {
  getStores: (params: {
    name?: string;
  }) => UsecaseResponse<StoreListWithEventsResponse>;
  getStoreEvents: (params: {
    storeId: string;
  }) => UsecaseResponse<StoreEventListResponse>;
};

export const implStoreUsecase = ({ api }: { api: Apis }): StoreUsecase => ({
  getStores: async ({ name } = {}) => {
    const { status, data } = await api['GET /api/store']({
      query: name ? { name } : undefined,
    });
    if (status === 200) {
      return { type: 'success', data: data };
    }
    const err = data as { code: string; message: string };
    return { type: 'error', code: err.code, message: err.message };
  },

  getStoreEvents: async ({ storeId }) => {
    const { status, data } = await api['GET /api/store/:storeId/events']({
      query: { storeId },
    });
    if (status === 200) {
      return { type: 'success', data: data };
    }
    const err = data as { code: string; message: string };
    return { type: 'error', code: err.code, message: err.message };
  },
});
