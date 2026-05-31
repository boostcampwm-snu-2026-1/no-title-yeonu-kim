import { createContext } from 'react';
import type { AuthQuery } from '@/feature/auth/application/auth-query';

export type QueryContext = {
  authQuery: AuthQuery;
};

export const QueryContext = createContext<QueryContext | null>(null);
