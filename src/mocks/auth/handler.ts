import { http } from 'msw';

import { authResolver } from './resolvers';

export const authHandlers = [
  http.post('*/api/auth/user', authResolver.signUp),
  http.post('*/api/auth/user/session', authResolver.signIn),
];
