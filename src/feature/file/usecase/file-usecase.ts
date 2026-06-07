import type { FileType } from '@/entities/file';
import type { UsecaseResponse } from '@/feature/shared/response';
import type { Apis } from '@/infrastructure/api';
import type { S3UploadResponse } from '@/infrastructure/api/apis/local-server/schemas';
import type { StorageApis } from '@/infrastructure/api/client';

export type FileUsecase = {
  getUploadPresignedUrl(params: {
    fileName: string;
    fileType: FileType;
  }): UsecaseResponse<S3UploadResponse>;
  uploadFile(params: {
    presignedUrl: string;
    file: File;
  }): UsecaseResponse<null>;
};

export const implFileUsecase = ({
  api,
  storageApi,
}: {
  api: Apis;
  storageApi: StorageApis;
}): FileUsecase => ({
  getUploadPresignedUrl: async ({ fileName, fileType }) => {
    const { status, data } = await api['POST /api/s3']({
      body: { fileName, fileType },
    });
    if (status === 200) {
      return { type: 'success', data: data as S3UploadResponse };
    }
    const err = data as { code: string; message: string };
    return { type: 'error', code: err.code, message: err.message };
  },

  uploadFile: async ({ presignedUrl, file }) => {
    const { status } = await storageApi['PUT upload-file']({
      path: presignedUrl,
      body: file,
      contentType: file.type,
    });
    if (status === 200) {
      return { type: 'success', data: null };
    }
    return {
      type: 'error',
      code: 'S3_001',
      message: '이미지 업로드에 실패했습니다.',
    };
  },
});
