import { http } from 'msw';

import { depositResolver } from './resolvers';

export const depositHandlers = [
  http.get('*/api/deposit', depositResolver.getDeposit),
  http.post('*/api/deposit', depositResolver.chargeDeposit),
];
