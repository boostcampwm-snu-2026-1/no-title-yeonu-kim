import{i as e,s as t}from"./preload-helper-B-rJVKt8.js";import{$ as n,E as r,M as i,Q as a,T as o,W as s,Z as c,a as l,j as u,o as d}from"./iframe-Ce9oT3n4.js";import{_ as f,g as p,h as m,n as h,t as g,w as _}from"./button-CAEJdT3Q.js";import{a as v,c as y,i as ee,n as b,o as x,r as S,s as C,t as te}from"./input-mGPotc5R.js";var w,T,E=e((()=>{w=t(n(),1),T=(0,w.createContext)(null)})),D,O,k,A,j,M,N=e((()=>{D=a(),f(),O=t(n(),1),r(),E(),m(),u(),h(),y(),b(),k=c(),A=(e,t)=>{let n=(0,D.c)(4),[r,i]=(0,O.useState)(e),a,o;return n[0]!==t||n[1]!==e?(a=()=>{let n=setTimeout(()=>i(e),t);return()=>clearTimeout(n)},o=[e,t],n[0]=t,n[1]=e,n[2]=a,n[3]=o):(a=n[2],o=n[3]),(0,O.useEffect)(a,o),r},j={RESTAURANT:`음식점`,CAFE:`카페`,FASHION:`패션`,BEAUTY:`뷰티`,ETC:`기타`},M=()=>{let{storeQuery:e}=p(o),{storeId:t,eventId:n,setStore:r,setEvent:a}=p(T),{toSubmit:s}=i(),[c,l]=(0,O.useState)(``),u=A(c,300),{storeList:d,isLoading:f}=e.useGetStores({name:u}),{eventList:m}=e.useGetStoreEvents({storeId:t}),h=d?.stores??[],y=h.find(e=>e.id===t),b=m?.events??y?.events??[];return(0,k.jsxs)(`div`,{className:`space-y-6`,children:[(0,k.jsx)(`h1`,{className:`font-semibold text-xl`,children:`가게 검색`}),(0,k.jsxs)(`div`,{className:`relative`,children:[(0,k.jsx)(_,{className:`pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground`}),(0,k.jsx)(te,{placeholder:`가게 이름을 검색하세요`,value:c,onChange:e=>{l(e.target.value)},className:`pl-8`})]}),f?(0,k.jsx)(`p`,{className:`py-8 text-center text-muted-foreground text-sm`,children:`검색 중...`}):h.length===0?(0,k.jsx)(`p`,{className:`py-8 text-center text-muted-foreground text-sm`,children:`검색 결과가 없습니다.`}):(0,k.jsx)(`div`,{className:`space-y-2`,children:h.map(e=>(0,k.jsx)(`button`,{type:`button`,className:`w-full text-left`,onClick:()=>{r(e.id)},children:(0,k.jsx)(S,{className:`cursor-pointer transition-colors hover:ring-primary/50 ${t===e.id?`ring-2 ring-primary`:``}`,children:(0,k.jsxs)(x,{children:[(0,k.jsxs)(`div`,{className:`flex items-start justify-between gap-2`,children:[(0,k.jsx)(C,{children:e.name}),(0,k.jsx)(`span`,{className:`shrink-0 rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs`,children:j[e.category]??e.category})]}),(0,k.jsx)(v,{children:e.address})]})})},e.id))}),t!==null&&(0,k.jsxs)(`div`,{className:`space-y-3`,children:[(0,k.jsxs)(`h2`,{className:`font-medium text-base`,children:[y?.name,`의 이벤트`]}),b.length===0?(0,k.jsx)(`p`,{className:`text-muted-foreground text-sm`,children:`등록된 이벤트가 없습니다.`}):(0,k.jsx)(`div`,{className:`space-y-2`,children:b.filter(e=>e.isActive).map(e=>(0,k.jsx)(`button`,{type:`button`,className:`w-full text-left`,onClick:()=>{a(e.id)},children:(0,k.jsxs)(S,{className:`cursor-pointer transition-colors hover:ring-primary/50 ${n===e.id?`ring-2 ring-primary`:``}`,children:[(0,k.jsx)(x,{children:(0,k.jsxs)(`div`,{className:`flex items-start justify-between gap-2`,children:[(0,k.jsx)(C,{children:e.title}),(0,k.jsxs)(`span`,{className:`shrink-0 font-semibold text-primary text-sm`,children:[e.reward,` ETH`]})]})}),(0,k.jsx)(ee,{children:(0,k.jsx)(`p`,{className:`text-muted-foreground text-sm`,children:e.condition})})]})},e.id))})]}),(0,k.jsx)(g,{className:`w-full`,disabled:t===null||n===null,onClick:()=>{t!==null&&n!==null&&s({storeId:t,eventId:n})},children:`다음 단계`})]})},M.__docgenInfo={description:``,methods:[],displayName:`StoreSearch`}})),P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$;e((()=>{P=a(),l(),F=t(n(),1),E(),N(),I=c(),{expect:L,userEvent:R,waitFor:z,within:B}=__STORYBOOK_MODULE_TEST__,V=`기절초풍왕순대`,H=`신규 메뉴 불닭볶음면 먹고 리뷰 달기`,U=()=>{let e=(0,P.c)(7),[t,n]=(0,F.useState)(null),[r,i]=(0,F.useState)(null),a;e[0]===Symbol.for(`react.memo_cache_sentinel`)?(a=e=>{n(e),i(null)},e[0]=a):a=e[0];let o;e[1]!==r||e[2]!==t?(o={storeId:t,eventId:r,setStore:a,setEvent:i},e[1]=r,e[2]=t,e[3]=o):o=e[3];let s;e[4]===Symbol.for(`react.memo_cache_sentinel`)?(s=(0,I.jsx)(M,{}),e[4]=s):s=e[4];let c;return e[5]===o?c=e[6]:(c=(0,I.jsx)(T.Provider,{value:o,children:s}),e[5]=o,e[6]=c),c},W={title:`Landing/StoreSearch`,component:U},G=async(e,t=V)=>{let n=await e.findByText(t);await R.click(n)},K={name:`200 가게 목록 로드`,play:async({canvasElement:e})=>{let t=B(e);await L(t.findByText(V)).resolves.toBeInTheDocument(),await L(t.findByText(`어저구 베이커리`)).resolves.toBeInTheDocument()}},q={name:`200 가게 선택 후 이벤트 표시`,play:async({canvasElement:e})=>{let t=B(e);await G(t),await L(t.findByText(H)).resolves.toBeInTheDocument()}},J={name:`200 가게·이벤트 선택 후 다음 단계 활성화`,play:async({canvasElement:e})=>{let t=B(e);await G(t);let n=await t.findByText(H);await R.click(n),L(t.getByRole(`button`,{name:`다음 단계`})).not.toBeDisabled()}},Y={name:`200 검색어로 가게 필터링`,play:async({canvasElement:e})=>{let t=B(e);await L(t.findByText(`어저구 베이커리`)).resolves.toBeInTheDocument();let n=t.getByPlaceholderText(`가게 이름을 검색하세요`);await R.type(n,`순대`),await z(()=>L(t.queryByText(`어저구 베이커리`)).not.toBeInTheDocument(),{timeout:2e3}),await z(()=>L(t.getByText(V)).toBeInTheDocument(),{timeout:2e3}),L(t.queryByText(`어저구 베이커리`)).not.toBeInTheDocument()}},X={name:`검색 결과 없음`,play:async({canvasElement:e})=>{let t=B(e);await t.findByText(V);let n=t.getByPlaceholderText(`가게 이름을 검색하세요`);await R.type(n,`없는가게이름`),await L(t.findByText(`검색 결과가 없습니다.`)).resolves.toBeInTheDocument()}},Z={name:`500 가게 목록 조회 실패`,parameters:{msw:{handlers:[d.get(`*/api/store`,()=>s.json({code:`SERVER_ERROR`,message:`Internal server error`},{status:500}))]}},play:async({canvasElement:e})=>{await L(B(e).findByText(`검색 결과가 없습니다.`)).resolves.toBeInTheDocument()}},Q={name:`404 이벤트 목록 조회 실패`,parameters:{msw:{handlers:[d.get(`*/api/store`,()=>s.json({stores:[{id:`store-001`,name:V,address:`서울특별시 관악구 봉천동 1620-38`,category:`RESTAURANT`,description:`이 순대를 먹으면 기절해요.`,events:[],totalEventCount:0}],totalCount:1,currentPage:0,totalPages:1,hasNext:!1})),d.get(`*/api/store/:storeId/events`,()=>s.json({code:`STORE_001`,message:`Store not found`},{status:404}))]}},play:async({canvasElement:e})=>{let t=B(e);await G(t),await L(t.findByText(`등록된 이벤트가 없습니다.`)).resolves.toBeInTheDocument()}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  name: '200 가게 목록 로드',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.findByText(STORE_NAME)).resolves.toBeInTheDocument();
    await expect(canvas.findByText('어저구 베이커리')).resolves.toBeInTheDocument();
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  name: '200 가게 선택 후 이벤트 표시',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await selectStore(canvas);
    await expect(canvas.findByText(EVENT_NAME)).resolves.toBeInTheDocument();
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  name: '200 가게·이벤트 선택 후 다음 단계 활성화',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await selectStore(canvas);
    const eventCard = await canvas.findByText(EVENT_NAME);
    await userEvent.click(eventCard);
    const button = canvas.getByRole('button', {
      name: '다음 단계'
    });
    expect(button).not.toBeDisabled();
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  name: '200 검색어로 가게 필터링',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.findByText('어저구 베이커리')).resolves.toBeInTheDocument();
    const searchInput = canvas.getByPlaceholderText('가게 이름을 검색하세요');
    await userEvent.type(searchInput, '순대');
    // 1단계: 디바운스(300ms) 후 이전 목록이 사라질 때까지 대기
    await waitFor(() => expect(canvas.queryByText('어저구 베이커리')).not.toBeInTheDocument(), {
      timeout: 2000
    });
    // 2단계: 쿼리 완료 후 필터링 결과가 나타날 때까지 대기 (이 시점에 "검색 중..." 상태일 수 있음)
    await waitFor(() => expect(canvas.getByText(STORE_NAME)).toBeInTheDocument(), {
      timeout: 2000
    });
    expect(canvas.queryByText('어저구 베이커리')).not.toBeInTheDocument();
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  name: '검색 결과 없음',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await canvas.findByText(STORE_NAME);
    const searchInput = canvas.getByPlaceholderText('가게 이름을 검색하세요');
    await userEvent.type(searchInput, '없는가게이름');
    await expect(canvas.findByText('검색 결과가 없습니다.')).resolves.toBeInTheDocument();
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  name: '500 가게 목록 조회 실패',
  parameters: {
    msw: {
      handlers: [http.get('*/api/store', () => HttpResponse.json({
        code: 'SERVER_ERROR',
        message: 'Internal server error'
      }, {
        status: 500
      }))]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.findByText('검색 결과가 없습니다.')).resolves.toBeInTheDocument();
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  name: '404 이벤트 목록 조회 실패',
  parameters: {
    msw: {
      handlers: [
      // events: [] 로 반환해 fallback도 비어있도록 설정
      http.get('*/api/store', () => HttpResponse.json({
        stores: [{
          id: 'store-001',
          name: STORE_NAME,
          address: '서울특별시 관악구 봉천동 1620-38',
          category: 'RESTAURANT',
          description: '이 순대를 먹으면 기절해요.',
          events: [],
          totalEventCount: 0
        }],
        totalCount: 1,
        currentPage: 0,
        totalPages: 1,
        hasNext: false
      })), http.get('*/api/store/:storeId/events', () => HttpResponse.json({
        code: 'STORE_001',
        message: 'Store not found'
      }, {
        status: 404
      }))]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await selectStore(canvas);
    await expect(canvas.findByText('등록된 이벤트가 없습니다.')).resolves.toBeInTheDocument();
  }
}`,...Q.parameters?.docs?.source}}},$=[`Default`,`SelectStore`,`SelectStoreAndEvent`,`SearchFilter`,`NoSearchResults`,`ErrorGetStoresFailed`,`ErrorGetStoreEventsFailed`]}))();export{K as Default,Q as ErrorGetStoreEventsFailed,Z as ErrorGetStoresFailed,X as NoSearchResults,Y as SearchFilter,q as SelectStore,J as SelectStoreAndEvent,$ as __namedExportsOrder,W as default};