import type {
  ErrorResponse,
  InternalFileCallParams,
  ResponseNecessary,
  SuccessResponse,
} from '../../domain';
import type { BlobResponse, UploadFileRequest } from './schemas';

type GetApisProps = {
  callWithFile: <R extends ResponseNecessary>(
    p: InternalFileCallParams,
    returnFile?: boolean
  ) => Promise<R | ErrorResponse>;
};

type Api = (_: {
  path: string;
  body: never;
  token: string;
  contentType: never;
  params: never;
  query: never;
  formData?: FormData;
}) => Promise<{ status: number; data: unknown }>;

export const getStorageServerApis = ({ callWithFile }: GetApisProps) =>
  ({
    'PUT upload-file': ({
      path,
      body,
      contentType,
    }: {
      path: string;
      body: UploadFileRequest;
      contentType: string;
    }) =>
      callWithFile<SuccessResponse<void>>({
        method: 'PUT',
        contentType,
        path,
        body,
      }),
    'GET download-file': ({ path }: { path: string }) => {
      const returnFile = true;
      return callWithFile<SuccessResponse<BlobResponse>>(
        {
          method: 'GET',
          path,
        },
        returnFile
      );
    },
  }) satisfies Record<string, Api>;
