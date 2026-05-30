type UserBriefDTO = {
  id: string;
  userRole: 'OWNER' | 'REVIEWER';
};

export type UserWithAccessTokenResponse = {
  user: UserBriefDTO;
  token: string;
};
