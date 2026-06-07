import type { UsecaseResponse } from '@/feature/shared/response';
import type { Apis } from '@/infrastructure/api';
import type {
  EventDetailResponse,
  StoreDetailResponse,
} from '@/infrastructure/api/apis/local-server/schemas';
import type { FileUsecase } from '../../file/usecase/file-usecase';

export type ApplicationUsecase = {
  getStore(params: { storeId: string }): UsecaseResponse<StoreDetailResponse>;
  getEvent(params: { eventId: string }): UsecaseResponse<EventDetailResponse>;
  submitApplication(params: {
    token: string;
    eventId: string;
    walletAddress: string;
    imageFile: File;
  }): UsecaseResponse<null>;
};

export const implApplicationUsecase = ({
  api,
  fileUsecase,
}: {
  api: Apis;
  fileUsecase: FileUsecase;
}): ApplicationUsecase => ({
  getStore: async ({ storeId }) => {
    const { status, data } = await api['GET /api/store/:storeId']({
      query: { storeId },
    });
    if (status === 200) {
      return { type: 'success', data: data as StoreDetailResponse };
    }
    const err = data as { code: string; message: string };
    return { type: 'error', code: err.code, message: err.message };
  },

  getEvent: async ({ eventId }) => {
    const { status, data } = await api['GET /api/event/:eventId']({
      query: { eventId },
    });
    if (status === 200) {
      return { type: 'success', data: data as EventDetailResponse };
    }
    const err = data as { code: string; message: string };
    return { type: 'error', code: err.code, message: err.message };
  },

  submitApplication: async ({ token, eventId, walletAddress, imageFile }) => {
    const presignedResp = await fileUsecase.getUploadPresignedUrl({
      token,
      fileName: imageFile.name,
      fileType: 'REVIEW',
    });
    if (presignedResp.type === 'error') {
      return presignedResp;
    }

    const uploadResp = await fileUsecase.uploadFile({
      presignedUrl: presignedResp.data.url,
      file: imageFile,
    });
    if (uploadResp.type === 'error') {
      return uploadResp;
    }

    const { status, data } = await api['POST /api/applications']({
      token,
      body: { eventId, walletAddress, imageKey: presignedResp.data.s3Key },
    });
    if (status === 200) {
      return { type: 'success', data: null };
    }
    const err = data as { code: string; message: string };
    return { type: 'error', code: err.code, message: err.message };
  },
});
