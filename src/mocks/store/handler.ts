import { http } from 'msw';

import { storeResolver } from './resolvers';

export const storeHandlers = [
  http.post('*/api/store', storeResolver.createStore),
  http.get('*/api/store', storeResolver.getStores),
  // /store/:storeId/events 를 /store/:storeId 보다 먼저 등록
  http.get('*/api/store/:storeId/events', storeResolver.getStoreEvents),
  http.get('*/api/store/:storeId', storeResolver.getStore),
  http.patch('*/api/store/:storeId', storeResolver.patchStore),
  http.delete('*/api/store/:storeId', storeResolver.deleteStore),
];
