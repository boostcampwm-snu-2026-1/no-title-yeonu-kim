import type { ApplicationResponse, ApplicationSummaryDTO } from './schemas';

export const mockApplications: ApplicationResponse[] = [
  // 아직 제출한 내용이 없는 신청
  {
    id: 'app-001',
    eventId: 'event-001',
    status: 'PENDING',
    appliedAt: '2026-05-29T10:00:00Z',
  },
  // 리뷰 제출 후 승인 대기 중
  {
    id: 'app-002',
    eventId: 'event-002',
    status: 'PENDING',
    reviewSubmission: {
      id: 'sub-001',
      message: '사장님 안녕하세요.',
      reviewImages: ['/REVIEW/260526/something1.png'],
    },
    appliedAt: '2026-05-28T09:00:00Z',
  },
  // 승인된 신청
  {
    id: 'app-003',
    eventId: 'event-003',
    status: 'APPROVED',
    reviewSubmission: {
      id: 'sub-002',
      message: '밥이 너무 맛있었어요.',
      reviewImages: ['/REVIEW/260526/something2.png'],
    },
    appliedAt: '2026-05-27T08:00:00Z',
    approvedAt: '2026-05-28T10:00:00Z',
  },
  // 이미 제출한 신청 → POST /submission 시 409 트리거용
  {
    id: 'submitted-app-001',
    eventId: 'event-001',
    status: 'PENDING',
    reviewSubmission: {
      id: 'sub-003',
      message: '이미 제출한 신청입니다.',
      reviewImages: [],
    },
    appliedAt: '2026-05-26T10:00:00Z',
  },
];

// GET /event/:eventId/applications 응답용 요약 목록
export const mockApplicationSummaries: ApplicationSummaryDTO[] = [
  {
    id: 'app-001',
    reviewerId: 'reviewer-001',
    reviewerName: '김철수',
    status: 'PENDING',
    appliedAt: '2026-05-29T10:00:00Z',
    hasSubmission: false,
  },
  {
    id: 'app-002',
    reviewerId: 'reviewer-002',
    reviewerName: '이영희',
    status: 'PENDING',
    appliedAt: '2026-05-28T09:00:00Z',
    hasSubmission: true,
  },
  {
    id: 'app-003',
    reviewerId: 'reviewer-003',
    reviewerName: '박지수',
    status: 'APPROVED',
    appliedAt: '2026-05-27T08:00:00Z',
    hasSubmission: true,
  },
];
