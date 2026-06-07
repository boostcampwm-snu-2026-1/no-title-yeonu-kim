import { createContext } from 'react';

export type ReviewContext = {
  storeId: string | null;
  eventId: string | null;
  setStore: (storeId: string) => void;
  setEvent: (eventId: string) => void;
};

export const ReviewContext = createContext<ReviewContext | null>(null);
