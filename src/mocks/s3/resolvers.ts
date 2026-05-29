import { HttpResponse, type HttpResponseResolver } from 'msw';

import { getRole } from '../utils';
import { MOCK_S3_BASE_URL } from './data';
import type { S3UploadRequest } from './schemas';

type S3Resolver = {
  getPresignedUrl: HttpResponseResolver<never, S3UploadRequest, never>;
};

export const s3Resolver: S3Resolver = {
  getPresignedUrl: async ({ request }) => {
    const role = getRole(request);
    if (!role) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as S3UploadRequest;
    if (!body.fileName || !body.fileType) {
      return HttpResponse.json(
        { message: 'Required field missing' },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      url: `${MOCK_S3_BASE_URL}/${body.fileType}/${body.fileName}`,
      s3Key: `/${body.fileType}/mock/${body.fileName}`,
    });
  },
};
