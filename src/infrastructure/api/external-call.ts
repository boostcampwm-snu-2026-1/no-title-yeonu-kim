import type { ExternalCallParams, ResponseNecessary } from './domain';

export const externalCall = async (
  params: ExternalCallParams
): Promise<ResponseNecessary> => {
  const response = await fetch(`/${params.path}`, {
    method: params.method,
    headers: params.headers as HeadersInit,
    body: params.body !== undefined ? JSON.stringify(params.body) : undefined,
    credentials: params.credentials as RequestCredentials,
  });
  const data = await response.json().catch(() => null);
  return { status: response.status, data };
};
