export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

type ReviewSubmissionDTO = {
  id: string;
  message: string;
  reviewImages: string[];
};

type RejectionDTO = {
  id: string;
  reason: string;
  rejectedAt: string;
};

export type ApplicationResponse = {
  id: string;
  eventId: string;
  status: ApplicationStatus;
  appliedAt: string;
  reviewSubmission?: ReviewSubmissionDTO;
  rejection?: RejectionDTO;
  approvedAt?: string;
};

export type ApplicationSummaryDTO = {
  id: string;
  reviewerId: string;
  reviewerName: string;
  status: string;
  appliedAt: string;
  hasSubmission: boolean;
};

export type ApplicationSummaryListResponse = {
  applications: ApplicationSummaryDTO[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
};

export type ApplicationListResponse = {
  applications: ApplicationResponse[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
};

export type ApplicationSubmissionRequest = {
  imageList: string[];
  comment: string;
};

export type ApplicationStatusRequest = {
  status: 'approved' | 'rejected';
  reason?: string;
};
