import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { ReviewContext } from '@/feature/shared/context/review-context';
import { StoreSearch } from '@/widgets/landing/ui/store-search';

const STORE_NAME = '기절초풍왕순대';
const EVENT_NAME = '신규 메뉴 불닭볶음면 먹고 리뷰 달기';

const StoreSearchWithReview = () => {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  return (
    <ReviewContext.Provider
      value={{
        storeId,
        eventId,
        setStore: (id) => {
          setStoreId(id);
          setEventId(null);
        },
        setEvent: setEventId,
      }}
    >
      <StoreSearch />
    </ReviewContext.Provider>
  );
};

const meta: Meta<typeof StoreSearchWithReview> = {
  title: 'Landing/StoreSearch',
  component: StoreSearchWithReview,
};

export default meta;
type Story = StoryObj<typeof StoreSearchWithReview>;

const selectStore = async (
  canvas: ReturnType<typeof within>,
  storeName = STORE_NAME
) => {
  const storeCard = await canvas.findByText(storeName);
  await userEvent.click(storeCard);
};

// ─── 성공 케이스 ──────────────────────────────────────

export const Default: Story = {
  name: '200 가게 목록 로드',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.findByText(STORE_NAME)).resolves.toBeInTheDocument();
    await expect(
      canvas.findByText('어저구 베이커리')
    ).resolves.toBeInTheDocument();
  },
};

export const SelectStore: Story = {
  name: '200 가게 선택 후 이벤트 표시',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await selectStore(canvas);
    await expect(canvas.findByText(EVENT_NAME)).resolves.toBeInTheDocument();
  },
};

export const SelectStoreAndEvent: Story = {
  name: '200 가게·이벤트 선택 후 다음 단계 활성화',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await selectStore(canvas);
    const eventCard = await canvas.findByText(EVENT_NAME);
    await userEvent.click(eventCard);
    const button = canvas.getByRole('button', { name: '다음 단계' });
    expect(button).not.toBeDisabled();
  },
};

export const SearchFilter: Story = {
  name: '200 검색어로 가게 필터링',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.findByText('어저구 베이커리')
    ).resolves.toBeInTheDocument();
    const searchInput = canvas.getByPlaceholderText('가게 이름을 검색하세요');
    await userEvent.type(searchInput, '순대');
    // 1단계: 디바운스(300ms) 후 이전 목록이 사라질 때까지 대기
    await waitFor(
      () =>
        expect(canvas.queryByText('어저구 베이커리')).not.toBeInTheDocument(),
      { timeout: 2000 }
    );
    // 2단계: 쿼리 완료 후 필터링 결과가 나타날 때까지 대기 (이 시점에 "검색 중..." 상태일 수 있음)
    await waitFor(
      () => expect(canvas.getByText(STORE_NAME)).toBeInTheDocument(),
      { timeout: 2000 }
    );
    expect(canvas.queryByText('어저구 베이커리')).not.toBeInTheDocument();
  },
};

export const NoSearchResults: Story = {
  name: '검색 결과 없음',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText(STORE_NAME);
    const searchInput = canvas.getByPlaceholderText('가게 이름을 검색하세요');
    await userEvent.type(searchInput, '없는가게이름');
    await expect(
      canvas.findByText('검색 결과가 없습니다.')
    ).resolves.toBeInTheDocument();
  },
};

// ─── 에러 케이스 ──────────────────────────────────────

export const ErrorGetStoresFailed: Story = {
  name: '500 가게 목록 조회 실패',
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/store', () =>
          HttpResponse.json(
            { code: 'SERVER_ERROR', message: 'Internal server error' },
            { status: 500 }
          )
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.findByText('검색 결과가 없습니다.')
    ).resolves.toBeInTheDocument();
  },
};

export const ErrorGetStoreEventsFailed: Story = {
  name: '404 이벤트 목록 조회 실패',
  parameters: {
    msw: {
      handlers: [
        // events: [] 로 반환해 fallback도 비어있도록 설정
        http.get('*/api/store', () =>
          HttpResponse.json({
            stores: [
              {
                id: 'store-001',
                name: STORE_NAME,
                address: '서울특별시 관악구 봉천동 1620-38',
                category: 'RESTAURANT',
                description: '이 순대를 먹으면 기절해요.',
                events: [],
                totalEventCount: 0,
              },
            ],
            totalCount: 1,
            currentPage: 0,
            totalPages: 1,
            hasNext: false,
          })
        ),
        http.get('*/api/store/:storeId/events', () =>
          HttpResponse.json(
            { code: 'STORE_001', message: 'Store not found' },
            { status: 404 }
          )
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await selectStore(canvas);
    await expect(
      canvas.findByText('등록된 이벤트가 없습니다.')
    ).resolves.toBeInTheDocument();
  },
};
