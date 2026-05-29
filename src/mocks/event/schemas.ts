export type EventCreateRequest = {
  title: string;
  condition: string;
  reward: number;
};

export type EventPatchRequest = {
  title?: string;
  condition?: string;
  reward?: number;
  isActive?: boolean;
};

export type EventResponse = {
  id: string;
  title: string;
  condition: string;
  reward: number;
  isActive: boolean;
};

export type EventListResponse = {
  events: EventResponse[];
};
