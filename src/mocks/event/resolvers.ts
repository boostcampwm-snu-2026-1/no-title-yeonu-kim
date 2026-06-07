import { HttpResponse, type HttpResponseResolver } from 'msw';

import { getRole, INSUFFICIENT_DEPOSIT_REWARD } from '../utils';
import { mockEvents } from './data';
import type { EventCreateRequest, EventPatchRequest } from './schemas';

type EventResolver = {
  createEvent: HttpResponseResolver<never, EventCreateRequest, never>;
  getOwnerEvents: HttpResponseResolver<never, never, never>;
  getEvent: HttpResponseResolver<{ eventId: string }, never, never>;
  patchEvent: HttpResponseResolver<
    { eventId: string },
    EventPatchRequest,
    never
  >;
  deleteEvent: HttpResponseResolver<{ eventId: string }, never, never>;
};

export const eventResolver: EventResolver = {
  createEvent: async ({ request }) => {
    const role = getRole(request);
    if (!role) {
      return HttpResponse.json(
        {
          code: 'AUTH_001',
          message: 'Authorization header is missing or malformed',
        },
        { status: 401 }
      );
    }
    if (role !== 'OWNER') {
      return HttpResponse.json(
        {
          code: 'AUTH_007',
          message: 'You do not have permission to perform this action',
        },
        { status: 401 }
      );
    }

    const body = (await request.json()) as EventCreateRequest;
    if (!body.title || !body.condition || body.reward == null) {
      return HttpResponse.json(
        { code: 'GEN_004', message: 'Required fields are missing or invalid' },
        { status: 400 }
      );
    }

    // reward >= INSUFFICIENT_DEPOSIT_REWARD → 예치금 부족
    if (body.reward >= INSUFFICIENT_DEPOSIT_REWARD) {
      return HttpResponse.json(
        { code: 'DEPOSIT_001', message: 'Deposit balance is insufficient' },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      {
        id: 'event-new-001',
        title: body.title,
        condition: body.condition,
        reward: body.reward,
        isActive: true,
      },
      { status: 200 }
    );
  },

  getOwnerEvents: ({ request }) => {
    const role = getRole(request);
    if (!role) {
      return HttpResponse.json(
        {
          code: 'AUTH_001',
          message: 'Authorization header is missing or malformed',
        },
        { status: 401 }
      );
    }
    if (role !== 'OWNER') {
      return HttpResponse.json(
        {
          code: 'AUTH_007',
          message: 'You do not have permission to perform this action',
        },
        { status: 401 }
      );
    }

    return HttpResponse.json({ events: mockEvents });
  },

  getEvent: ({ params }) => {
    const { eventId } = params;
    const event = mockEvents.find((e) => e.id === eventId);
    if (!event) {
      return HttpResponse.json(
        { code: 'EVENT_001', message: 'Event not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(event);
  },

  patchEvent: async ({ request, params }) => {
    const { eventId } = params;
    const role = getRole(request);
    if (!role) {
      return HttpResponse.json(
        {
          code: 'AUTH_001',
          message: 'Authorization header is missing or malformed',
        },
        { status: 401 }
      );
    }
    if (role !== 'OWNER') {
      return HttpResponse.json(
        {
          code: 'AUTH_007',
          message: 'You do not have permission to perform this action',
        },
        { status: 401 }
      );
    }

    const event = mockEvents.find((e) => e.id === eventId);
    if (!event) {
      return HttpResponse.json(
        { code: 'EVENT_001', message: 'Event not found' },
        { status: 404 }
      );
    }

    const body = (await request.json()) as EventPatchRequest;

    // isActive: false로 이미 마감된 이벤트를 다시 마감하려 할 때
    if (body.isActive === false && !event.isActive) {
      return HttpResponse.json(
        { code: 'GEN_003', message: 'Event is already closed' },
        { status: 400 }
      );
    }

    return HttpResponse.json({ ...event, ...body });
  },

  deleteEvent: ({ request, params }) => {
    const { eventId } = params;
    const role = getRole(request);
    if (!role) {
      return HttpResponse.json(
        {
          code: 'AUTH_001',
          message: 'Authorization header is missing or malformed',
        },
        { status: 401 }
      );
    }
    if (role !== 'OWNER') {
      return HttpResponse.json(
        {
          code: 'AUTH_007',
          message: 'You do not have permission to perform this action',
        },
        { status: 401 }
      );
    }

    const event = mockEvents.find((e) => e.id === eventId);
    if (!event) {
      return HttpResponse.json(
        { code: 'EVENT_001', message: 'Event not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(null, { status: 200 });
  },
};
