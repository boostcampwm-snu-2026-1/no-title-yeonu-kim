import { HttpResponse, type HttpResponseResolver } from 'msw';
import { mockOwnerUser, mockReviewerUser } from './data';
import type { SignInRequest, SignUpRequest } from './schemas';

type AuthResolver = {
  signUp: HttpResponseResolver<never, SignUpRequest, never>;
  signIn: HttpResponseResolver<never, SignInRequest, never>;
};

export const authResolver: AuthResolver = {
  signUp: async ({ request }) => {
    const body = (await request.json()) as SignUpRequest;

    if (!body.role || !body.username || !body.email || !body.password) {
      return HttpResponse.json(
        { code: 'GEN_004', message: 'Required fields are missing or invalid' },
        { status: 400 }
      );
    }

    // 중복 이메일
    if (body.email === 'duplicate@example.com') {
      return HttpResponse.json(
        { code: 'USER_001', message: 'This email is already registered' },
        { status: 409 }
      );
    }

    // 리뷰어: 이메일 인증 코드 만료 시뮬레이션 (email에 +fail 포함)
    if (body.role === 'REVIEWER' && body.email.includes('+fail')) {
      return HttpResponse.json(
        {
          code: 'USER_006',
          message: 'Email verification code is invalid or expired',
        },
        { status: 400 }
      );
    }

    // 사장님: 사전 설정된 비밀번호 불일치
    if (body.role === 'OWNER' && body.password === 'wrong-owner-secret') {
      return HttpResponse.json(
        { code: 'AUTH_002', message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const response = body.role === 'OWNER' ? mockOwnerUser : mockReviewerUser;
    return HttpResponse.json(response, { status: 200 });
  },

  signIn: async ({ request }) => {
    const body = (await request.json()) as SignInRequest;

    if (!body.role || !body.mail || !body.password) {
      return HttpResponse.json(
        { code: 'GEN_004', message: 'Required fields are missing or invalid' },
        { status: 400 }
      );
    }

    // 계정 없음 or 비밀번호 불일치
    if (
      body.mail === 'notfound@example.com' ||
      body.password === 'wrongpassword'
    ) {
      return HttpResponse.json(
        { code: 'AUTH_002', message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const response = body.role === 'OWNER' ? mockOwnerUser : mockReviewerUser;
    return HttpResponse.json(response, { status: 200 });
  },
};
