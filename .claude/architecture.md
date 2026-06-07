## 레이어 구조 및 역할

### 1. pages/ — 페이지 진입점
파일 경로: src/pages/{페이지명}.tsx
역할: 레이아웃 래퍼만 담당하며, 실제 로직이나 상태를 포함하지 않는다.
비즈니스 로직이나 상태는 전적으로 widget에 위임한다.

예시:
  export const SignInPage = () => (
    <div className="flex min-h-screen items-center justify-center ...">
      <SignInForm />
    </div>
  );

---

### 2. widgets/{도메인}/ui/ — UI 컴포넌트
파일 경로: src/widgets/{도메인}/ui/{컴포넌트명}.tsx
역할:
  - 화면에 보이는 실제 UI 구성
  - presenter를 통한 폼 유효성 검사
  - Context API(useGuardContext)를 통해 query 훅 주입받아 사용
  - useRouteNavigation으로 페이지 전환

Context 사용 패턴 (의존성 주입):
  const { authQuery } = useGuardContext(QueryContext);
  const { useSignIn } = authQuery;
  const { signIn, isPending } = useSignIn({ setResponseMessage });

Presenter 사용 패턴:
  const { inputStates, formStates } = authFormPresenter.useValidator({ authInputPresenter });

규칙:
  - Context에서 꺼낼 때는 반드시 useGuardContext를 사용한다 (null 방어 포함).
  - useContext를 직접 사용하지 않는다.

---

### 3. feature/{도메인}/presenter/ — 입력 유효성 검사
파일 경로: src/feature/{도메인}/presenter/{도메인}-input-presenter.ts
             src/feature/{도메인}/presenter/{도메인}-form-presenter.ts
역할:
  - 각 입력 필드의 상태(value, isError, onChange)를 관리하는 커스텀 훅
  - 정규식 기반 유효성 검사 포함
  - formStates는 여러 inputState를 조합하여 폼 전체의 에러 여부를 계산

반환 타입은 src/entities/input.ts 에 정의된 Input<T>, InputWithDetailedError<T, E> 를 사용한다.

---

### 4. feature/{도메인}/application/ — Query 훅 (Application Layer)
파일 경로: src/feature/{도메인}/application/{도메인}-query.ts
역할:
  - usecase를 주입받아 React Query(useMutation / useQuery) 기반의 훅을 반환
  - API 호출 후 성공/실패 분기 처리 (response.type === 'success' | 'error')
  - 성공 시 라우팅, 실패 시 에러 메시지 세팅

패턴:
  export const use{Domain}Query = ({ {domain}Usecase }: { {domain}Usecase: {Domain}Usecase }) => {
    return {
      use{Action}: ({ setResponseMessage }) => {
        const { mutate, isPending } = useMutation({
          mutationFn: async (params) => await {domain}Usecase.{action}(params),
          onSuccess: (response) => {
            if (response.type === 'success') { /* 라우팅 */ return; }
            setResponseMessage(createErrorMessage(response.code, '기본 메시지'));
          },
        });
        return { {action}: mutate, isPending };
      },
    };
  };

---

### 5. feature/{도메인}/usecase/ — Use Case (Business Logic)
파일 경로: src/feature/{도메인}/usecase/{도메인}-usecase.ts
역할:
  - 비즈니스 로직 인터페이스(타입)와 구현체(implXxxUsecase)를 함께 정의
  - API 호출 결과를 UsecaseResponse<T> 타입으로 정규화
  - 필요 시 tokenRepository 등 인프라 레이어와 협력

반환 타입: src/feature/shared/response.ts 의 UsecaseResponse<T>
  → Promise<{ type: 'success'; data: T } | { type: 'error'; code: string; message: string }>

---

### 6. feature/{도메인}/domain/ — 도메인 타입
파일 경로: src/feature/{도메인}/domain/
역할: 해당 도메인에서 사용하는 핵심 타입 및 enum 정의 (UserRole, Schema 등)

---

### 7. infrastructure/api/ — API 클라이언트

#### 파일 구조
  src/infrastructure/api/
    domain.ts                          — ExternalCallParams, InternalCallParams, 공통 응답 타입
    client.ts                          — implApi: callWithToken / callWithoutToken / callWithOptionalToken
    external-call.ts                   — fetch 래퍼 (path를 그대로 사용, query string 처리 없음)
    apis/local-server/
      apis.ts                          — 엔드포인트별 함수 정의 (getLocalServerApis)
      schemas.ts                       — 요청/응답 DTO 타입
      encode-query-params.ts           — URL 쿼리 파라미터 직렬화 유틸

#### 엔드포인트 작성 규칙

1. query 타입은 반드시 named type으로 정의한다. Record<string, string>으로 퉁치지 않는다.
     // 금지
     ({ query }: { query?: Record<string, string> })

     // 올바른 방법
     type StoreListQuery = {
       category?: StoreType;
       name?: string;
       page?: string;
       size?: string;
     };
     ({ query }: { query?: StoreListQuery })

2. URL 쿼리 파라미터(?key=value)는 encodeQueryParams로 path에 직접 삽입한다.
   callWithToken/callWithoutToken에 query 필드를 넘기지 않는다.

     import { encodeQueryParams } from './encode-query-params';

     'GET /api/store': ({ query }: { query?: StoreListQuery }) => {
       const qs = query !== undefined ? encodeQueryParams({ params: query }) : '';
       return callWithoutToken<SuccessResponse<StoreListWithEventsResponse>>({
         method: 'GET',
         path: qs ? `api/store?${qs}` : 'api/store',
       });
     },

3. path 파라미터(:storeId 등)는 query 객체로 받아 path 문자열에 직접 보간한다.

     type StoreIdQuery = { storeId: string };

     'GET /api/store/:storeId/events': ({ query }: { query: StoreIdQuery }) =>
       callWithoutToken<SuccessResponse<StoreEventListResponse>>({
         method: 'GET',
         path: `api/store/${query.storeId}/events`,
       }),

4. 인증 토큰 필요 여부에 따라 call 함수를 구분한다.
     - callWithoutToken : 인증 불필요
     - callWithToken    : 토큰 필수 ({ token: string } 추가 전달)
     - callWithOptionalToken : 토큰 선택적

5. 모든 엔드포인트 함수는 getLocalServerApis 반환 객체에 추가하며,
   satisfies Record<string, Api> 제약을 통과해야 한다.

#### encodeQueryParams 동작
파일: src/infrastructure/api/apis/local-server/encode-query-params.ts
  - undefined / null 값은 자동으로 제외된다.
  - 배열 값은 같은 key로 append된다 (?tag=a&tag=b).
  - 숫자/불리언도 toString()으로 직렬화된다.
  - 반환값은 query string만 (? 없음). 빈 문자열이면 query 없음.

---

### 7-b. infrastructure/token/ — 토큰 저장소
파일 경로: src/infrastructure/token/token-repository.ts
역할:
  - TokenStateRepository 인터페이스 + implTokenRepository 구현
  - setToken / removeToken으로 React state(useState)에 토큰 반영

---

### 8. Context API — 의존성 주입 (DI)
파일 경로: src/feature/shared/context/

구조:
  - query-context.ts   : { authQuery, ... } — application 훅 묶음
  - usecase-context.ts : { authUsecase, ... } — usecase 인스턴스
  - token-context.ts   : { token } — 현재 인증 토큰
  - use-gaurd-context.ts : useGuardContext<T> — null-safe 컨텍스트 접근 훅

DI 조립 위치: src/App.tsx (AppContent 컴포넌트)
  const api = implApi({ externalCall });
  const tokenRepository = implTokenRepository({ setToken });
  const authUsecase = implAuthUsecase({ api, tokenRepository });
  const authQuery = useAuthQuery({ authUsecase });

  return (
    <QueryContext.Provider value={{ authQuery }}>
      <TokenContext.Provider value={{ token }}>
        <UsecaseContext.Provider value={{ authUsecase }}>
          ...
        </UsecaseContext.Provider>
      </TokenContext.Provider>
    </QueryContext.Provider>
  );

규칙:
  - 새 도메인의 usecase/query를 추가하면 App.tsx의 Provider에 값을 추가한다.
  - widget에서 Context에 직접 접근할 때는 항상 useGuardContext를 사용한다.

---

### 9. feature/shared/routes/path.ts — 경로 상수
파일 경로: src/feature/shared/routes/path.ts
역할: 앱 내 모든 URL 경로를 상수로 정의한다. 문자열 리터럴을 코드 곳곳에 직접 쓰지 않는다.

패턴:
  export const PATH = {
    LANDING: '/',
    SIGN_IN: '/sign-in',
    MY_PAGE: '/my-page',
    // 새 페이지 추가 시 여기에 항목 추가
  };

규칙:
  - 새 페이지를 만들면 PATH에 항목을 먼저 추가한다.
  - 라우터 등록과 내비게이션 함수 모두 이 상수를 참조한다.

---

### 10. feature/shared/routes/use-route-navigation.ts — 내비게이션 훅
파일 경로: src/feature/shared/routes/use-route-navigation.ts
역할:
  - react-router의 useNavigate를 래핑하여 이름 있는 내비게이션 함수를 제공한다.
  - 컴포넌트와 application 레이어 모두에서 사용 가능하다.

패턴:
  export const useRouteNavigation = () => {
    const navigate = useNavigate();

    return {
      toMain: () => { void navigate(PATH.LANDING); },
      toSignIn: () => { void navigate(PATH.SIGN_IN); },
      toMyPage: () => { void navigate(PATH.MY_PAGE); },
      toBack: () => { void navigate(-1); },
      refreshPage: () => { void navigate(0); },
    };
  };

사용 위치:
  - widget: 버튼 클릭 등 UI 이벤트에서 직접 호출
      const { toSignUp } = useRouteNavigation();
      <button onClick={toSignUp}>회원가입하기</button>

  - application(query 훅): mutation 성공 콜백에서 호출
      const { toMain } = useRouteNavigation();
      onSuccess: (response) => {
        if (response.type === 'success') { toMain(); return; }
        ...
      }

규칙:
  - void navigate(...)를 직접 쓰지 않는다. 반드시 useRouteNavigation을 통해 사용한다.
  - 새 페이지가 생기면 useRouteNavigation에 to{페이지명} 함수를 추가한다.

---

### 11. feature/shared/routes/router-provider.tsx — 라우터 등록
파일 경로: src/feature/shared/routes/router-provider.tsx
역할:
  - 모든 페이지 컴포넌트를 PATH 상수와 연결하여 라우트를 등록한다.
  - 공통 레이아웃(GNB 등)과 인증 가드를 중첩 라우트로 조합한다.

현재 구조:
  <Routes>
    {/* 인증 불필요 */}
    <Route path={PATH.SIGN_IN} element={<SignInPage />} />
    <Route path={PATH.SIGN_UP} element={<SignUpPage />} />

    {/* 토큰 재발급 시도 후 진입 (ReissueToken: 마운트 시 토큰 없으면 reissue 시도) */}
    <Route element={<ReissueToken />}>
      <Route path={PATH.LANDING} element={<LandingPage />} />

      {/* 로그인 필수 */}
      <Route element={<ProtectedRoute role="SIGN_IN" />}>
        <Route path={PATH.MY_PAGE} element={<MyPage />} />
      </Route>

      {/* 특정 역할 필수 (예: OWNER만 접근) */}
      <Route element={<ProtectedRoute role="OWNER" />}>
        <Route path={PATH.OWNER_ONLY} element={<OwnerPage />} />
      </Route>
    </Route>
  </Routes>

인증 가드 종류:
  - ReissueToken   : 토큰이 없을 때 refresh 시도 후 Outlet 렌더링. 토큰이 필요한 모든 라우트의 부모로 사용.
  - ProtectedRoute : token 존재 여부 및 role을 검사.
      - role="SIGN_IN" → 로그인만 되어 있으면 통과
      - role="OWNER" | "REVIEWER" → 해당 역할이어야 통과, 아니면 LANDING으로 리다이렉트

새 페이지 추가 체크리스트:
  1. PATH에 경로 상수 추가
  2. useRouteNavigation에 to{페이지명} 함수 추가
  3. router-provider.tsx에 <Route> 등록
     - 인증 불필요 → 최상위에 배치
     - 로그인 필요 → ReissueToken > ProtectedRoute(role="SIGN_IN") 하위에 배치
     - 역할 제한 → ReissueToken > ProtectedRoute(role="OWNER"|"REVIEWER") 하위에 배치

---

## 전체 새 페이지 구현 체크리스트 (업데이트)

  1. domain/ — 필요한 타입 정의
  2. usecase/ — 비즈니스 로직 인터페이스 + implXxxUsecase 구현
  3. application/ — React Query 훅 (useXxxQuery)
  4. presenter/ — 입력 유효성 검사 훅
  5. App.tsx — usecase/query 인스턴스 생성, Context Provider에 추가
  6. context/ — 필요 시 새 Context 정의 (query-context에 필드 추가가 일반적)
  7. widgets/ — UI 컴포넌트 (useGuardContext로 query 주입)
  8. pages/ — 레이아웃 래퍼
  9. PATH — 경로 상수 추가
 10. useRouteNavigation — to{페이지명} 함수 추가
 11. router-provider.tsx — <Route> 등록 (인증 가드 레벨 결정)

