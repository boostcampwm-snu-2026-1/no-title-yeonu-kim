import { http } from 'msw';

import { applicationResolver } from './resolvers';

export const applicationHandlers = [
  http.get(
    '*/api/event/:eventId/applications',
    applicationResolver.getEventApplications
  ),
  http.post('*/api/application/:eventId', applicationResolver.applyEvent),
  http.get('*/api/application', applicationResolver.getMyApplications),
  http.delete(
    '*/api/application/:applicationId',
    applicationResolver.cancelApplication
  ),
  http.post(
    '*/api/application/:applicationId/submission',
    applicationResolver.submitReview
  ),
  http.patch(
    '*/api/application/:applicationId/status',
    applicationResolver.updateStatus
  ),
];
