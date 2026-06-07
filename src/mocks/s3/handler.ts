import { http } from 'msw';
import { MOCK_S3_BASE_URL } from './data';
import { s3Resolver } from './resolvers';

export const s3Handlers = [
  http.post('*/api/s3', s3Resolver.getPresignedUrl),
  http.put(`${MOCK_S3_BASE_URL}/*`, s3Resolver.uploadFile),
];
