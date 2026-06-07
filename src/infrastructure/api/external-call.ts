import type {
  ExternalCallParams,
  ExternalFileCallParams,
  ResponseNecessary,
} from './domain';

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

export const externalStorageCall = async (
  content: ExternalFileCallParams,
  returnFile: boolean = false
) => {
  const getBody = (body: Record<string, unknown> | File | undefined) => {
    if (body === undefined) {
      return undefined;
    }
    if (body instanceof File) {
      return body;
    }
    return JSON.stringify(body);
  };

  const response = await fetch(content.path, {
    method: content.method,
    headers: content.headers,
    ...(getBody(content.body) !== undefined
      ? { body: getBody(content.body) }
      : {}),
  });

  if (returnFile) {
    const responseBlob = (await response.blob().catch(() => null)) as Blob;
    const contentType = response.headers.get('Content-Type');
    return {
      status: response.status,
      data: { blob: responseBlob, type: contentType },
    };
  }
  const responseBody = (await response.json().catch(() => null)) as unknown;
  return {
    status: response.status,
    data: responseBody,
  };
};
