import type {
  ErrorResponse,
  InternalCallParams,
  ResponseNecessary,
  SuccessResponse,
} from '../../domain';
import { encodeQueryParams } from './encode-query-params';
import type {
  EmailRequest,
  EmailValidateRequest,
  SignInRequest,
  SignUpRequest,
  StoreEventListResponse,
  StoreListWithEventsResponse,
  StoreType,
  TokenResponse,
  UserWithAccessTokenResponse,
  VerificationTokenResponse,
} from './schemas';

type StoreListQuery = {
  category?: StoreType;
  name?: string;
  page?: string;
  size?: string;
};

type StoreIdQuery = { storeId: string };

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

export const getLocalServerApis = ({
  callWithoutToken,
  callWithToken,
}: GetApisProps) =>
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

    'GET /api/auth/token': () =>
      callWithoutToken<SuccessResponse<TokenResponse>>({
        method: 'GET',
        path: 'api/auth/token',
      }),
    'DELETE /api/auth/user/session': ({ token }: { token: string }) =>
      callWithToken<SuccessResponse<void>>({
        method: 'DELETE',
        path: 'api/auth/user/session',
        token,
      }),
    'GET /api/store': ({ query }: { query?: StoreListQuery }) => {
      const qs =
        query !== undefined ? encodeQueryParams({ params: query }) : '';
      return callWithoutToken<SuccessResponse<StoreListWithEventsResponse>>({
        method: 'GET',
        path: qs ? `api/store?${qs}` : 'api/store',
      });
    },
    'GET /api/store/:storeId/events': ({ query }: { query: StoreIdQuery }) =>
      callWithoutToken<SuccessResponse<StoreEventListResponse>>({
        method: 'GET',
        path: `api/store/${query.storeId}/events`,
      }),
  }) satisfies Record<string, Api>;
