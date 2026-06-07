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

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

type ReviewSubmissionDTO = {
  id: string;
  message: string;
  reviewImages: string[];
};

type ApplicationItemResponse = {
  id: string;
  eventId: string;
  status: ApplicationStatus;
  reviewSubmission?: ReviewSubmissionDTO;
  appliedAt: string;
};

export type ApplicationListResponse = {
  applications: ApplicationItemResponse[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
};

type ApplicationSummaryResponse = {
  id: string;
  reviewerId: string;
  reviewerName: string;
  status: ApplicationStatus;
  appliedAt: string;
  hasSubmission: boolean;
};

export type ApplicationSummaryListResponse = {
  applications: ApplicationSummaryResponse[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
};

export type ApplicationSubmissionRequest = {
  imageList: string[];
  comment: string;
};

export type EventCreateRequest = {
  title: string;
  condition: string;
  reward: number;
};

export type EventResponse = {
  id: string;
  title: string;
  condition: string;
  reward: number;
  isActive: boolean;
};

export type EventListResponse = {
  events: EventResponse[];
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type ResetPasswordRequest = {
  email: string;
};

export type StoreCreateRequest = {
  name: string;
  address: string;
  category: StoreType;
  thumbnailUrl?: string;
  description?: string;
};

export type StoreCreateResponse = {
  id: string;
  name: string;
  address: string;
  category: StoreType;
  thumbnailKey?: string;
  description?: string;
};

export type DepositRequest = {
  amount: number;
};

export type DepositResponse = {
  balance: number;
  depositedAt: string;
};

export type StoreListQuery = {
  category?: StoreType;
  name?: string;
  page?: string;
  size?: string;
};

export type StoreIdQuery = { storeId: string };
export type EventIdQuery = { eventId: string };
export type ApplicationIdQuery = { applicationId: string };

export type EventApplicationListQuery = {
  eventId: string;
  status?: 'pending' | 'approved' | 'rejected';
  page?: string;
  size?: string;
};
