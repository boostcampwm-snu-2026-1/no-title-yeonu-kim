import { createContext } from 'react';
import type { AuthQuery } from '@/feature/auth/application/auth-query';
import type { StoreQuery } from '@/feature/store/application/store-query';

export type QueryContext = {
  authQuery: AuthQuery;
  storeQuery: StoreQuery;
};

export const QueryContext = createContext<QueryContext | null>(null);
