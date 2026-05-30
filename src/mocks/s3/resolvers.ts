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
      return HttpResponse.json({ code: 'AUTH_001', message: 'Authorization header is missing or malformed' }, { status: 401 });
    }

    const body = (await request.json()) as S3UploadRequest;
    if (!body.fileName || !body.fileType) {
      return HttpResponse.json(
        { code: 'GEN_004', message: 'Required fields are missing or invalid' },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      url: `${MOCK_S3_BASE_URL}/${body.fileType}/${body.fileName}`,
      s3Key: `/${body.fileType}/mock/${body.fileName}`,
    });
  },
};
