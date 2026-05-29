import type { StoreWithEventsResponse } from './schemas';

export const mockStores: StoreWithEventsResponse[] = [
  {
    id: 'store-001',
    name: '기절초풍왕순대',
    address: '서울특별시 관악구 봉천동 1620-38',
    category: 'RESTAURANT',
    description: '이 순대를 먹으면 기절해요.',
    events: [
      {
        id: 'event-001',
        title: '신규 메뉴 불닭볶음면 먹고 리뷰 달기',
        condition: '영수증, 리뷰 캡처 사진을 업로드해주세요.',
        reward: 5000,
        isActive: true,
      },
    ],
    totalEventCount: 1,
  },
  {
    id: 'store-002',
    name: '어저구 베이커리',
    address: '서울특별시 관악구 봉천동 123-45',
    category: 'CAFE',
    thumbnailKey: '/STORE/store-002/thumbnail.png',
    description: '맛있는 베이커리입니다.',
    events: [
      {
        id: 'event-002',
        title: '크루아상 먹고 리뷰 달기',
        condition: '영수증 사진을 업로드해주세요.',
        reward: 3000,
        isActive: true,
      },
      {
        id: 'event-003',
        title: '아메리카노 먹고 리뷰 달기',
        condition: '영수증 사진을 업로드해주세요.',
        reward: 2000,
        isActive: true,
      },
    ],
    totalEventCount: 2,
  },
];
