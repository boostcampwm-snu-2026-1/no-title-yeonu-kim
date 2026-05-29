import { applicationHandlers } from './application/handler';
import { authHandlers } from './auth/handler';
import { depositHandlers } from './deposit/handler';
import { eventHandlers } from './event/handler';
import { s3Handlers } from './s3/handler';
import { storeHandlers } from './store/handler';

export const handlers = [
  ...authHandlers,
  ...storeHandlers,
  ...eventHandlers,
  ...applicationHandlers,
  ...depositHandlers,
  ...s3Handlers,
];
