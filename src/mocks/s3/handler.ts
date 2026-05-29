import { http } from 'msw';

import { s3Resolver } from './resolvers';

export const s3Handlers = [http.post('*/api/s3', s3Resolver.getPresignedUrl)];
