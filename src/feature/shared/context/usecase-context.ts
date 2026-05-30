import { createContext } from 'react';
import type { AuthUsecase } from '@/feature/auth/usecase/auth-usecase';

export type UsecaseContext = {
  authUsecase: AuthUsecase;
};

export const UsecaseContext = createContext<UsecaseContext | null>(null);
