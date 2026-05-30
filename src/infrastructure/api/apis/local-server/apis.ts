import type {
  ErrorResponse,
  InternalCallParams,
  ResponseNecessary,
  SuccessResponse,
} from '../../domain';
import type { TestRequest, TestResponse } from './schemas';

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
    'GET /test': ({ body }: { body: TestRequest }) =>
      callWithoutToken<SuccessResponse<TestResponse>>({
        method: 'GET',
        path: 'test',
        body,
      }),
  }) satisfies Record<string, Api>;
