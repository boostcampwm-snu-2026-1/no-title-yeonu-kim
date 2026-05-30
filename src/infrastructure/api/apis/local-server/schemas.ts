type UserBriefDTO = {
  id: string;
  userRole: 'OWNER' | 'REVIEWER';
};

export type SignUpRequest = {
  role: 'OWNER' | 'REVIEWER';
  username: string;
  email: string;
  password: string;
};

export type SignInRequest = {
  role: 'OWNER' | 'REVIEWER';
  mail: string;
  password: string;
};

export type UserWithAccessTokenResponse = {
  user: UserBriefDTO;
  token: string;
};
