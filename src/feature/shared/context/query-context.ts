import { createContext } from 'react';
import type { ApplicationQuery } from '@/feature/application/application/application-query';
import type { AuthQuery } from '@/feature/auth/application/auth-query';
import type { StoreQuery } from '@/feature/store/application/store-query';

export type QueryContext = {
  authQuery: AuthQuery;
  storeQuery: StoreQuery;
  applicationQuery: ApplicationQuery;
};

export const QueryContext = createContext<QueryContext | null>(null);
