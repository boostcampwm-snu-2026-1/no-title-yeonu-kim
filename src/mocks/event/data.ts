import type { EventResponse } from './schemas';

export const mockEvents: EventResponse[] = [
  {
    id: 'event-001',
    title: '신규 메뉴 불닭볶음면 먹고 리뷰 달기',
    condition: '영수증, 리뷰 캡처 사진을 업로드해주세요.',
    reward: 5000,
    isActive: true,
  },
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
  // isActive: false → PATCH 마감 처리 시 400 트리거용
  {
    id: 'closed-event-001',
    title: '종료된 이벤트',
    condition: '이미 종료된 이벤트입니다.',
    reward: 1000,
    isActive: false,
  },
];
