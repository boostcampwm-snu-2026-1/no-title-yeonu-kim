import { HttpResponse, type HttpResponseResolver } from 'msw';

import { ALREADY_APPLIED_EVENT_ID, ALREADY_SUBMITTED_APP_ID, getRole } from '../utils';
import { mockEvents } from '../event/data';
import type { ApplicationSubmissionRequest, ApplicationStatusRequest } from './schemas';
import { mockApplications, mockApplicationSummaries } from './data';

type ApplicationResolver = {
  getEventApplications: HttpResponseResolver<{ eventId: string }, never, never>;
  applyEvent: HttpResponseResolver<{ eventId: string }, never, never>;
  getMyApplications: HttpResponseResolver<never, never, never>;
  cancelApplication: HttpResponseResolver<{ applicationId: string }, never, never>;
  submitReview: HttpResponseResolver<{ applicationId: string }, ApplicationSubmissionRequest, never>;
  updateStatus: HttpResponseResolver<{ applicationId: string }, ApplicationStatusRequest, never>;
};

export const applicationResolver: ApplicationResolver = {
  // GET /event/:eventId/applications - 사장님이 이벤트별 신청 목록 조회
  getEventApplications: ({ request, params }) => {
    const { eventId } = params;
    const role = getRole(request);
    if (!role) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    if (role !== 'OWNER') return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });

    const event = mockEvents.find((e) => e.id === eventId);
    if (!event) return HttpResponse.json({ message: 'Event not found' }, { status: 404 });

    const url = new URL(request.url);
    const statusFilter = url.searchParams.get('status');
    const page = Number(url.searchParams.get('page') ?? '0');
    const size = Number(url.searchParams.get('size') ?? '20');

    const filtered = statusFilter
      ? mockApplicationSummaries.filter((a) => a.status.toLowerCase() === statusFilter)
      : mockApplicationSummaries;
    const paginated = filtered.slice(page * size, (page + 1) * size);

    return HttpResponse.json({
      applications: paginated,
      totalCount: filtered.length,
      currentPage: page,
      totalPages: Math.ceil(filtered.length / size) || 1,
      hasNext: (page + 1) * size < filtered.length,
    });
  },

  // POST /application/:eventId - 리뷰어가 이벤트 신청
  applyEvent: ({ request, params }) => {
    const { eventId } = params;
    const role = getRole(request);
    if (!role) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    if (role !== 'REVIEWER') return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });

    const event = mockEvents.find((e) => e.id === eventId);
    if (!event) return HttpResponse.json({ message: 'Event not found' }, { status: 404 });

    // 이미 마감된 이벤트
    if (!event.isActive) return HttpResponse.json({ message: 'Event already closed' }, { status: 400 });

    // 이미 신청한 이벤트 → ALREADY_APPLIED_EVENT_ID 사용
    if (eventId === ALREADY_APPLIED_EVENT_ID) {
      return HttpResponse.json({ message: 'Already applied' }, { status: 409 });
    }

    return HttpResponse.json(null, { status: 200 });
  },

  // GET /application - 리뷰어가 신청한 모든 이벤트 조회
  getMyApplications: ({ request }) => {
    const role = getRole(request);
    if (!role) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    if (role !== 'REVIEWER') return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });

    return HttpResponse.json({
      applications: mockApplications,
      totalCount: mockApplications.length,
      currentPage: 0,
      totalPages: 1,
      hasNext: false,
    });
  },

  // DELETE /application/:applicationId - 신청 취소
  cancelApplication: ({ request, params }) => {
    const { applicationId } = params;
    const role = getRole(request);
    if (!role) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const app = mockApplications.find((a) => a.id === applicationId);
    if (!app) return HttpResponse.json({ message: 'Application not found' }, { status: 404 });

    // 해당 신청의 신청자가 아닌 경우 시뮬레이션: OWNER가 접근하면 403
    if (role === 'OWNER') return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });

    return HttpResponse.json(null, { status: 200 });
  },

  // POST /application/:applicationId/submission - 리뷰 인증 제출
  submitReview: async ({ request, params }) => {
    const { applicationId } = params;
    const role = getRole(request);
    if (!role) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const app = mockApplications.find((a) => a.id === applicationId);
    if (!app) return HttpResponse.json({ message: 'Application not found' }, { status: 404 });

    // 이미 인증을 제출한 신청 → ALREADY_SUBMITTED_APP_ID 사용
    if (applicationId === ALREADY_SUBMITTED_APP_ID) {
      return HttpResponse.json({ message: 'Review already submitted' }, { status: 409 });
    }

    // 해당 신청의 신청자가 아닌 경우: OWNER가 접근하면 403
    if (role === 'OWNER') return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });

    return HttpResponse.json(null, { status: 200 });
  },

  // PATCH /application/:applicationId/status - 사장님이 인증 승인/반려
  updateStatus: async ({ request, params }) => {
    const { applicationId } = params;
    const role = getRole(request);
    if (!role) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    if (role !== 'OWNER') return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });

    const app = mockApplications.find((a) => a.id === applicationId);
    if (!app) return HttpResponse.json({ message: 'Application not found' }, { status: 404 });

    return HttpResponse.json(null, { status: 200 });
  },
};
