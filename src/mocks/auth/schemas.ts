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

export type EmailRequest = {
  email: string;
};

export type EmailValidateRequest = {
  email: string;
  code: string;
};

export type VerificationTokenResponse = {
  verificationToken: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};
