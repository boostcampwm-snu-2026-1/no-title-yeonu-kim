import { HttpResponse, type HttpResponseResolver } from 'msw';

import { getRole, NO_DEPOSIT_OWNER_TOKEN } from '../utils';
import { mockDeposit } from './data';
import type { DepositRequest } from './schemas';

type DepositResolver = {
  getDeposit: HttpResponseResolver<never, never, never>;
  chargeDeposit: HttpResponseResolver<never, DepositRequest, never>;
};

export const depositResolver: DepositResolver = {
  getDeposit: ({ request }) => {
    const role = getRole(request);
    if (!role) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (role !== 'OWNER') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // 예치금 정보가 없는 사장님 시뮬레이션 (NO_DEPOSIT_OWNER_TOKEN 사용)
    if (request.headers.get('Authorization') === NO_DEPOSIT_OWNER_TOKEN) {
      return HttpResponse.json(
        { message: 'Deposit not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(mockDeposit);
  },

  chargeDeposit: async ({ request }) => {
    const role = getRole(request);
    if (!role) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (role !== 'OWNER') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = (await request.json()) as DepositRequest;
    if (body.amount == null || body.amount <= 0) {
      return HttpResponse.json({ message: 'Invalid amount' }, { status: 400 });
    }

    return HttpResponse.json(
      {
        balance: mockDeposit.balance + body.amount,
        depositedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  },
};
