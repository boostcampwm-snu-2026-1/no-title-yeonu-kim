import { http } from 'msw';

import { storeResolver } from './resolvers';

export const storeHandlers = [
  http.post('*/api/store', storeResolver.createStore),
  http.get('*/api/store', storeResolver.getStores),
  http.patch('*/api/store/:storeId', storeResolver.patchStore),
  http.delete('*/api/store/:storeId', storeResolver.deleteStore),
  http.get('*/api/store/:storeId/events', storeResolver.getStoreEvents),
];
