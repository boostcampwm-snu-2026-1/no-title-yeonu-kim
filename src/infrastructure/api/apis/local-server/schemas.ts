export type StoreType = 'RESTAURANT' | 'CAFE' | 'FASHION' | 'BEAUTY' | 'ETC';

type EventBriefDTO = {
  id: string;
  title: string;
  condition: string;
  reward: number;
  isActive: boolean;
};

export type StoreWithEventsResponse = {
  id: string;
  name: string;
  address: string;
  category: StoreType;
  thumbnailKey?: string;
  description?: string;
  events: EventBriefDTO[];
  totalEventCount: number;
};

export type StoreListWithEventsResponse = {
  stores: StoreWithEventsResponse[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
};

export type StoreEventListResponse = {
  events: EventBriefDTO[];
};

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

export type TokenResponse = {
  accessToken: string;
};

export type StoreDetailResponse = {
  id: string;
  name: string;
  address: string;
};

export type EventDetailResponse = {
  id: string;
  title: string;
  condition: string;
  reward: number;
  isActive: boolean;
};

export type S3FileType = 'REVIEW' | 'STORE';

export type S3UploadRequest = {
  fileName: string;
  fileType: S3FileType;
};

export type S3UploadResponse = {
  url: string;
  s3Key: string;
};

export type ApplicationCreateRequest = {
  eventId: string;
  walletAddress: string;
  imageKey: string;
};
