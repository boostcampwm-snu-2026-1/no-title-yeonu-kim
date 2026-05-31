import { createContext } from 'react';
import type { UserRole } from '@/feature/auth/domain/user-role';

export type UserContext = {
  role: UserRole | null;
  id: string | null;
};

export const UserContext = createContext<UserContext | null>(null);
