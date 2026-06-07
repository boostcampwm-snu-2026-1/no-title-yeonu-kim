import type {
  ErrorResponse,
  InternalCallParams,
  ResponseNecessary,
  SuccessResponse,
} from '../../domain';
import { encodeQueryParams } from '../encode-query-params';
import type {
  ApplicationCreateRequest,
  ApplicationIdQuery,
  ApplicationListResponse,
  ApplicationSubmissionRequest,
  ApplicationSummaryListResponse,
  ChangePasswordRequest,
  DepositRequest,
  DepositResponse,
  EmailRequest,
  EmailValidateRequest,
  EventApplicationListQuery,
  EventCreateRequest,
  EventDetailResponse,
  EventIdQuery,
  EventListResponse,
  EventResponse,
  ResetPasswordRequest,
  S3UploadRequest,
  S3UploadResponse,
  SignInRequest,
  SignUpRequest,
  StoreCreateRequest,
  StoreCreateResponse,
  StoreDetailResponse,
  StoreEventListResponse,
  StoreIdQuery,
  StoreListQuery,
  StoreListWithEventsResponse,
  TokenResponse,
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
    'GET /api/store/:storeId': ({ query }: { query: StoreIdQuery }) =>
      callWithoutToken<SuccessResponse<StoreDetailResponse>>({
        method: 'GET',
        path: `api/store/${query.storeId}`,
      }),
    'GET /api/event/:eventId': ({ query }: { query: { eventId: string } }) =>
      callWithoutToken<SuccessResponse<EventDetailResponse>>({
        method: 'GET',
        path: `api/event/${query.eventId}`,
      }),
    'POST /api/s3': ({ body }: { body: S3UploadRequest }) =>
      callWithoutToken<SuccessResponse<S3UploadResponse>>({
        method: 'POST',
        path: 'api/s3',
        body,
      }),
    'POST /api/applications': ({ body }: { body: ApplicationCreateRequest }) =>
      callWithoutToken<SuccessResponse<null>>({
        method: 'POST',
        path: 'api/applications',
        body,
      }),

    // Event
    'POST /api/event': ({
      body,
      token,
    }: {
      body: EventCreateRequest;
      token: string;
    }) =>
      callWithToken<SuccessResponse<EventResponse>>({
        method: 'POST',
        path: 'api/event',
        body,
        token,
      }),
    'GET /api/event/owner': ({ token }: { token: string }) =>
      callWithToken<SuccessResponse<EventListResponse>>({
        method: 'GET',
        path: 'api/event/owner',
        token,
      }),
    'DELETE /api/event/:eventId': ({
      query,
      token,
    }: {
      query: EventIdQuery;
      token: string;
    }) =>
      callWithToken<SuccessResponse<void>>({
        method: 'DELETE',
        path: `api/event/${query.eventId}`,
        token,
      }),
    'GET /api/event/:eventId/applications': ({
      query,
      token,
    }: {
      query: EventApplicationListQuery;
      token: string;
    }) => {
      const { eventId, ...rest } = query;
      const qs =
        Object.keys(rest).length > 0 ? encodeQueryParams({ params: rest }) : '';
      return callWithToken<SuccessResponse<ApplicationSummaryListResponse>>({
        method: 'GET',
        path: qs
          ? `api/event/${eventId}/applications?${qs}`
          : `api/event/${eventId}/applications`,
        token,
      });
    },

    // Store
    'POST /api/store': ({
      body,
      token,
    }: {
      body: StoreCreateRequest;
      token: string;
    }) =>
      callWithToken<SuccessResponse<StoreCreateResponse>>({
        method: 'POST',
        path: 'api/store',
        body,
        token,
      }),
    'DELETE /api/store/:storeId': ({
      query,
      token,
    }: {
      query: StoreIdQuery;
      token: string;
    }) =>
      callWithToken<SuccessResponse<void>>({
        method: 'DELETE',
        path: `api/store/${query.storeId}`,
        token,
      }),

    // Application
    'GET /api/application': ({ token }: { token: string }) =>
      callWithToken<SuccessResponse<ApplicationListResponse>>({
        method: 'GET',
        path: 'api/application',
        token,
      }),
    'DELETE /api/application/:applicationId': ({
      query,
      token,
    }: {
      query: ApplicationIdQuery;
      token: string;
    }) =>
      callWithToken<SuccessResponse<void>>({
        method: 'DELETE',
        path: `api/application/${query.applicationId}`,
        token,
      }),
    'POST /api/application/:applicationId/submission': ({
      query,
      body,
      token,
    }: {
      query: ApplicationIdQuery;
      body: ApplicationSubmissionRequest;
      token: string;
    }) =>
      callWithToken<SuccessResponse<void>>({
        method: 'POST',
        path: `api/application/${query.applicationId}/submission`,
        body,
        token,
      }),

    // Auth - password
    'PATCH /api/auth/password': ({
      body,
      token,
    }: {
      body: ChangePasswordRequest;
      token: string;
    }) =>
      callWithToken<SuccessResponse<void>>({
        method: 'PATCH',
        path: 'api/auth/password',
        body,
        token,
      }),
    'POST /api/auth/password': ({ body }: { body: ResetPasswordRequest }) =>
      callWithoutToken<SuccessResponse<void>>({
        method: 'POST',
        path: 'api/auth/password',
        body,
      }),

    // Deposit
    'POST /api/deposit': ({
      body,
      token,
    }: {
      body: DepositRequest;
      token: string;
    }) =>
      callWithToken<SuccessResponse<DepositResponse>>({
        method: 'POST',
        path: 'api/deposit',
        body,
        token,
      }),
  }) satisfies Record<string, Api>;
