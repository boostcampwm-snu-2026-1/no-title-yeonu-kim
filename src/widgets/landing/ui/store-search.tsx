import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { QueryContext } from '@/feature/shared/context/query-context';
import { ReviewContext } from '@/feature/shared/context/review-context';
import { useGuardContext } from '@/feature/shared/context/use-gaurd-context';
import { useRouteNavigation } from '@/feature/shared/routes/use-route-navigation';
import { Button } from '@/widgets/common/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/widgets/common/ui/card';
import { Input } from '@/widgets/common/ui/input';

const useDebounce = (value: string, delay: number) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};

const CATEGORY_LABEL: Record<string, string> = {
  RESTAURANT: '음식점',
  CAFE: '카페',
  FASHION: '패션',
  BEAUTY: '뷰티',
  ETC: '기타',
};

export const StoreSearch = () => {
  const { storeQuery } = useGuardContext(QueryContext);
  const { storeId, eventId, setStore, setEvent } =
    useGuardContext(ReviewContext);
  const { toSubmit } = useRouteNavigation();

  const [searchInput, setSearchInput] = useState('');
  const searchTerm = useDebounce(searchInput, 300);

  const { storeList, isLoading } = storeQuery.useGetStores({
    name: searchTerm,
  });
  const { eventList } = storeQuery.useGetStoreEvents({ storeId });

  const stores = storeList?.stores ?? [];
  const selectedStore = stores.find((s) => s.id === storeId);
  const events = eventList?.events ?? selectedStore?.events ?? [];

  return (
    <div className="space-y-6">
      <h1 className="font-semibold text-xl">가게 검색</h1>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="가게 이름을 검색하세요"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          className="pl-8"
        />
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-muted-foreground text-sm">
          검색 중...
        </p>
      ) : stores.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground text-sm">
          검색 결과가 없습니다.
        </p>
      ) : (
        <div className="space-y-2">
          {stores.map((store) => (
            <button
              key={store.id}
              type="button"
              className="w-full text-left"
              onClick={() => {
                setStore(store.id);
              }}
            >
              <Card
                className={`cursor-pointer transition-colors hover:ring-primary/50 ${
                  storeId === store.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle>{store.name}</CardTitle>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs">
                      {CATEGORY_LABEL[store.category] ?? store.category}
                    </span>
                  </div>
                  <CardDescription>{store.address}</CardDescription>
                </CardHeader>
              </Card>
            </button>
          ))}
        </div>
      )}

      {storeId !== null && (
        <div className="space-y-3">
          <h2 className="font-medium text-base">
            {selectedStore?.name}의 이벤트
          </h2>
          {events.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              등록된 이벤트가 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              {events
                .filter((ev) => ev.isActive)
                .map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    className="w-full text-left"
                    onClick={() => {
                      setEvent(ev.id);
                    }}
                  >
                    <Card
                      className={`cursor-pointer transition-colors hover:ring-primary/50 ${
                        eventId === ev.id ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle>{ev.title}</CardTitle>
                          <span className="shrink-0 font-semibold text-primary text-sm">
                            {ev.reward} ETH
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">
                          {ev.condition}
                        </p>
                      </CardContent>
                    </Card>
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      <Button
        className="w-full"
        disabled={storeId === null || eventId === null}
        onClick={() => {
          if (storeId !== null && eventId !== null) {
            toSubmit({ storeId, eventId });
          }
        }}
      >
        다음 단계
      </Button>
    </div>
  );
};
