import { http } from 'msw';

import { authResolver } from './resolvers';

export const authHandlers = [
  http.post('*/api/auth/email', authResolver.checkEmailDuplicate),
  http.post('*/api/auth/email/verify', authResolver.sendVerificationEmail),
  http.post('*/api/auth/email/validate', authResolver.validateEmailCode),
  http.post('*/api/auth/user', authResolver.signUp),
  http.post('*/api/auth/user/session', authResolver.signIn),
  http.delete('*/api/auth/user/session', authResolver.signOut),
  http.post('*/api/auth/password', authResolver.resetPassword),
  http.patch('*/api/auth/password', authResolver.changePassword),
];
