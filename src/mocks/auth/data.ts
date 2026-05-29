import type { UserWithAccessTokenResponse } from './schemas';

export const mockOwnerUser: UserWithAccessTokenResponse = {
  user: { id: 'owner-001', userRole: 'OWNER' },
  token: 'mock-owner-token',
};

export const mockReviewerUser: UserWithAccessTokenResponse = {
  user: { id: 'reviewer-001', userRole: 'REVIEWER' },
  token: 'mock-reviewer-token',
};
