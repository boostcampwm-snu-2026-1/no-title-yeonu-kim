import { HttpResponse, type HttpResponseResolver } from 'msw';
import { mockOwnerUser, mockReviewerUser, mockVerificationToken } from './data';
import { getRole } from '../utils';
import type {
  ChangePasswordRequest,
  EmailRequest,
  EmailValidateRequest,
  SignInRequest,
  SignUpRequest,
} from './schemas';

type AuthResolver = {
  signUp: HttpResponseResolver<never, SignUpRequest, never>;
  signIn: HttpResponseResolver<never, SignInRequest, never>;
  checkEmailDuplicate: HttpResponseResolver<never, EmailRequest, never>;
  sendVerificationEmail: HttpResponseResolver<never, EmailRequest, never>;
  validateEmailCode: HttpResponseResolver<never, EmailValidateRequest, never>;
  signOut: HttpResponseResolver<never, never, never>;
  resetPassword: HttpResponseResolver<never, EmailRequest, never>;
  changePassword: HttpResponseResolver<never, ChangePasswordRequest, never>;
};

export const authResolver: AuthResolver = {
  checkEmailDuplicate: async ({ request }) => {
    const body = (await request.json()) as EmailRequest;

    if (!body.email) {
      return HttpResponse.json(
        { code: 'GEN_004', message: 'Required fields are missing or invalid' },
        { status: 400 }
      );
    }

    if (body.email === 'duplicate@example.com') {
      return HttpResponse.json(
        { code: 'USER_001', message: 'This email is already registered' },
        { status: 409 }
      );
    }

    return HttpResponse.json(null, { status: 200 });
  },

  sendVerificationEmail: async ({ request }) => {
    const body = (await request.json()) as EmailRequest;

    if (!body.email) {
      return HttpResponse.json(
        { code: 'GEN_004', message: 'Required fields are missing or invalid' },
        { status: 400 }
      );
    }

    // 이메일 발송 실패 시뮬레이션
    if (body.email === 'fail-send@example.com') {
      return HttpResponse.json(
        { code: 'MAIL_001', message: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return HttpResponse.json(null, { status: 200 });
  },

  validateEmailCode: async ({ request }) => {
    const body = (await request.json()) as EmailValidateRequest;

    if (!body.email || !body.code) {
      return HttpResponse.json(
        { code: 'GEN_004', message: 'Required fields are missing or invalid' },
        { status: 400 }
      );
    }

    // 잘못된 인증 코드 시뮬레이션
    if (body.code === '000000') {
      return HttpResponse.json(
        { code: 'USER_006', message: 'Email verification code is invalid or expired' },
        { status: 400 }
      );
    }

    return HttpResponse.json(mockVerificationToken, { status: 200 });
  },

  signOut: ({ request }) => {
    const role = getRole(request);

    if (!role) {
      return HttpResponse.json(
        { code: 'AUTH_001', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    return HttpResponse.json(null, { status: 200 });
  },

  resetPassword: async ({ request }) => {
    const body = (await request.json()) as EmailRequest;

    if (!body.email) {
      return HttpResponse.json(
        { code: 'GEN_004', message: 'Required fields are missing or invalid' },
        { status: 400 }
      );
    }

    if (body.email === 'notfound@example.com') {
      return HttpResponse.json(
        { code: 'USER_002', message: 'User not found' },
        { status: 404 }
      );
    }

    if (body.email === 'fail-send@example.com') {
      return HttpResponse.json(
        { code: 'MAIL_001', message: 'Failed to send reset password email' },
        { status: 500 }
      );
    }

    return HttpResponse.json(null, { status: 200 });
  },

  changePassword: async ({ request }) => {
    const role = getRole(request);

    if (!role) {
      return HttpResponse.json(
        { code: 'AUTH_001', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as ChangePasswordRequest;

    if (!body.currentPassword || !body.newPassword) {
      return HttpResponse.json(
        { code: 'GEN_004', message: 'Required fields are missing or invalid' },
        { status: 400 }
      );
    }

    if (body.currentPassword === 'wrongpassword') {
      return HttpResponse.json(
        { code: 'AUTH_002', message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return HttpResponse.json(null, { status: 200 });
  },

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
