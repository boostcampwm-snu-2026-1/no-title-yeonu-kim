import { HttpResponse, type HttpResponseResolver } from 'msw';

import { getRole } from '../utils';
import { mockStores } from './data';
import type {
  StoreCreateRequest,
  StorePatchRequest,
  StoreResponse,
} from './schemas';

const toStoreResponse = (store: (typeof mockStores)[0]): StoreResponse => {
  const { events: _events, totalEventCount: _totalEventCount, ...rest } = store;
  return rest;
};

type StoreResolver = {
  createStore: HttpResponseResolver<never, StoreCreateRequest, never>;
  getStores: HttpResponseResolver<never, never, never>;
  patchStore: HttpResponseResolver<
    { storeId: string },
    StorePatchRequest,
    never
  >;
  deleteStore: HttpResponseResolver<{ storeId: string }, never, never>;
  getStoreEvents: HttpResponseResolver<{ storeId: string }, never, never>;
};

export const storeResolver: StoreResolver = {
  createStore: async ({ request }) => {
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

    const body = (await request.json()) as StoreCreateRequest;
    if (!body.name || !body.address || !body.category) {
      return HttpResponse.json(
        { code: 'GEN_004', message: 'Required fields are missing or invalid' },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      {
        id: 'store-new-001',
        name: body.name,
        address: body.address,
        category: body.category,
        thumbnailKey: body.thumbnailUrl,
        description: body.description,
      },
      { status: 200 }
    );
  },

  getStores: ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const page = Number(url.searchParams.get('page') ?? '0');
    const size = Number(url.searchParams.get('size') ?? '10');

    const filtered = category
      ? mockStores.filter((s) => s.category === category)
      : mockStores;
    const paginated = filtered.slice(page * size, (page + 1) * size);

    return HttpResponse.json({
      stores: paginated,
      totalCount: filtered.length,
      currentPage: page,
      totalPages: Math.ceil(filtered.length / size) || 1,
      hasNext: (page + 1) * size < filtered.length,
    });
  },

  patchStore: async ({ request, params }) => {
    const { storeId } = params;
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

    const store = mockStores.find((s) => s.id === storeId);
    if (!store) {
      return HttpResponse.json(
        { code: 'STORE_001', message: 'Store not found' },
        { status: 404 }
      );
    }

    const body = (await request.json()) as StorePatchRequest;
    return HttpResponse.json({ ...toStoreResponse(store), ...body });
  },

  deleteStore: ({ request, params }) => {
    const { storeId } = params;
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

    const store = mockStores.find((s) => s.id === storeId);
    if (!store) {
      return HttpResponse.json(
        { code: 'STORE_001', message: 'Store not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(null, { status: 200 });
  },

  getStoreEvents: ({ params }) => {
    const { storeId } = params;
    const store = mockStores.find((s) => s.id === storeId);
    if (!store) {
      return HttpResponse.json(
        { code: 'STORE_001', message: 'Store not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({ events: store.events });
  },
};
