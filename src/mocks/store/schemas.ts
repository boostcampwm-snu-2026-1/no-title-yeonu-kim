export type StoreType = 'RESTAURANT' | 'CAFE' | 'FASHION' | 'BEAUTY' | 'ETC';

export type StoreCreateRequest = {
  name: string;
  address: string;
  category: StoreType;
  thumbnailUrl?: string;
  description?: string;
};

export type StorePatchRequest = {
  name?: string;
  address?: string;
  category?: StoreType;
  thumbnailUrl?: string;
  description?: string;
};

export type StoreResponse = {
  id: string;
  name: string;
  address: string;
  category: StoreType;
  thumbnailKey?: string;
  description?: string;
};

type EventBriefDTO = {
  id: string;
  title: string;
  condition: string;
  reward: number;
  isActive: boolean;
};

export type StoreWithEventsResponse = StoreResponse & {
  events: EventBriefDTO[];
  totalEventCount: number;
};

export type StoreListWithEventsResponse = {
  stores: StoreWithEventsResponse[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
};

export type StoreEventListResponse = {
  events: EventBriefDTO[];
};
