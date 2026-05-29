import { HttpResponse, type HttpResponseResolver } from 'msw';

import { getRole } from '../utils';
import type { StoreCreateRequest, StorePatchRequest, StoreResponse } from './schemas';
import { mockStores } from './data';

const toStoreResponse = (store: (typeof mockStores)[0]): StoreResponse => {
  const { events: _events, totalEventCount: _totalEventCount, ...rest } = store;
  return rest;
};

type StoreResolver = {
  createStore: HttpResponseResolver<never, StoreCreateRequest, never>;
  getStores: HttpResponseResolver<never, never, never>;
  patchStore: HttpResponseResolver<{ storeId: string }, StorePatchRequest, never>;
  deleteStore: HttpResponseResolver<{ storeId: string }, never, never>;
  getStoreEvents: HttpResponseResolver<{ storeId: string }, never, never>;
};

export const storeResolver: StoreResolver = {
  createStore: async ({ request }) => {
    const role = getRole(request);
    if (!role) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    if (role !== 'OWNER') return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });

    const body = (await request.json()) as StoreCreateRequest;
    if (!body.name || !body.address || !body.category) {
      return HttpResponse.json({ message: 'Required field missing' }, { status: 400 });
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
      { status: 201 },
    );
  },

  getStores: ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const page = Number(url.searchParams.get('page') ?? '0');
    const size = Number(url.searchParams.get('size') ?? '10');

    const filtered = category ? mockStores.filter((s) => s.category === category) : mockStores;
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
    if (!role) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    if (role !== 'OWNER') return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });

    const store = mockStores.find((s) => s.id === storeId);
    if (!store) return HttpResponse.json({ message: 'Store not found' }, { status: 404 });

    const body = (await request.json()) as StorePatchRequest;
    return HttpResponse.json({ ...toStoreResponse(store), ...body });
  },

  deleteStore: ({ request, params }) => {
    const { storeId } = params;
    const role = getRole(request);
    if (!role) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    if (role !== 'OWNER') return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });

    const store = mockStores.find((s) => s.id === storeId);
    if (!store) return HttpResponse.json({ message: 'Store not found' }, { status: 404 });

    return HttpResponse.json(null, { status: 200 });
  },

  getStoreEvents: ({ params }) => {
    const { storeId } = params;
    const store = mockStores.find((s) => s.id === storeId);
    if (!store) return HttpResponse.json({ message: 'Store not found' }, { status: 404 });

    return HttpResponse.json({ events: store.events });
  },
};
