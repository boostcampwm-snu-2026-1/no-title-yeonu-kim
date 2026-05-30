import type {
  ErrorResponse,
  InternalCallParams,
  ResponseNecessary,
  SuccessResponse,
} from '../../domain';
import type {
  EmailRequest,
  EmailValidateRequest,
  SignInRequest,
  SignUpRequest,
  UserWithAccessTokenResponse,
  VerificationTokenResponse,
} from './schemas';

type GetApisProps = {
  callWithToken: <R extends ResponseNecessary>(
    p: InternalCallParams & { token: string }
  ) => Promise<R | ErrorResponse>;
  callWithoutToken: <R extends ResponseNecessary>(
    p: InternalCallParams & { token?: never }
  ) => Promise<R | ErrorResponse>;
  callWithOptionalToken: <R extends ResponseNecessary>(
    p: InternalCallParams & { token?: string }
  ) => Promise<R | ErrorResponse>;
};

type Api = (_: {
  body: never;
  token: string;
  params: never;
  query: never;
}) => Promise<{ status: number; data: unknown }>;

export const getLocalServerApis = ({ callWithoutToken }: GetApisProps) =>
  ({
    'POST /api/auth/email': ({ body }: { body: EmailRequest }) =>
      callWithoutToken<SuccessResponse<null>>({
        method: 'POST',
        path: 'api/auth/email',
        body,
      }),
    'POST /api/auth/email/verify': ({ body }: { body: EmailRequest }) =>
      callWithoutToken<SuccessResponse<null>>({
        method: 'POST',
        path: 'api/auth/email/verify',
        body,
      }),
    'POST /api/auth/email/validate': ({
      body,
    }: {
      body: EmailValidateRequest;
    }) =>
      callWithoutToken<SuccessResponse<VerificationTokenResponse>>({
        method: 'POST',
        path: 'api/auth/email/validate',
        body,
      }),
    'POST /api/auth/user': ({ body }: { body: SignUpRequest }) =>
      callWithoutToken<SuccessResponse<UserWithAccessTokenResponse>>({
        method: 'POST',
        path: 'api/auth/user',
        body,
      }),
    'POST /api/auth/user/session': ({ body }: { body: SignInRequest }) =>
      callWithoutToken<SuccessResponse<UserWithAccessTokenResponse>>({
        method: 'POST',
        path: 'api/auth/user/session',
        body,
      }),
  }) satisfies Record<string, Api>;
