import { http } from 'msw';

import { eventResolver } from './resolvers';

export const eventHandlers = [
  http.post('*/api/event', eventResolver.createEvent),
  // /event/owner를 /event/:eventId보다 먼저 등록
  http.get('*/api/event/owner', eventResolver.getOwnerEvents),
  http.patch('*/api/event/:eventId', eventResolver.patchEvent),
  http.delete('*/api/event/:eventId', eventResolver.deleteEvent),
];
