import{i as e,s as t}from"./preload-helper-B-rJVKt8.js";import{$ as n,A as r,B as i,C as a,D as o,E as s,F as c,I as l,J as u,K as d,L as f,O as p,Q as m,R as h,T as ee,U as g,V as _,W as v,X as y,Z as b,_ as x,a as S,b as te,c as C,d as ne,f as re,g as ie,h as w,i as ae,k as oe,l as se,m as ce,n as T,o as E,p as le,r as ue,t as de,u as fe,v as pe,w as me,y as he}from"./iframe-CcWaiica.js";import{O as ge,P as _e,S as ve,_ as ye,b as be,g as xe,h as Se,n as Ce,t as D,v as O}from"./button-CrAaKVTR.js";import{c as we,i as k,n as Te,o as A,r as j,s as Ee,t as De}from"./input-B7LzIyuV.js";import{n as Oe,t as ke}from"./label-KQrOuH0R.js";var Ae,je=e((()=>{d(),l(),Ae=({applicationUsecase:e})=>({useGetStore:({storeId:t})=>{let{data:n,isLoading:r}=y({queryKey:[`store`,t],queryFn:async()=>{let n=await e.getStore({storeId:t});if(n.type===`success`)return n.data;throw Error(n.message)}});return{store:n,isLoading:r}},useGetEvent:({eventId:t})=>{let{data:n,isLoading:r}=y({queryKey:[`event`,t],queryFn:async()=>{let n=await e.getEvent({eventId:t});if(n.type===`success`)return n.data;throw Error(n.message)}});return{event:n,isLoading:r}},useSubmitApplication:({setResponseMessage:t,onSuccess:n})=>{let{mutate:r,isPending:i}=u({mutationFn:async({eventId:t,walletAddress:n,imageFile:r,token:i})=>await e.submitApplication({eventId:t,walletAddress:n,imageFile:r,token:i}),onSuccess:e=>{if(e.type===`success`){n();return}t(c(e.code,`제출에 실패했습니다. 다시 시도해 주세요.`))}});return{submitApplication:r,isPending:i}}})})),Me,Ne=e((()=>{Me=({api:e,fileUsecase:t})=>({getStore:async({storeId:t})=>{let{status:n,data:r}=await e[`GET /api/store/:storeId`]({query:{storeId:t}});if(n===200)return{type:`success`,data:r};let i=r;return{type:`error`,code:i.code,message:i.message}},getEvent:async({eventId:t})=>{let{status:n,data:r}=await e[`GET /api/event/:eventId`]({query:{eventId:t}});if(n===200)return{type:`success`,data:r};let i=r;return{type:`error`,code:i.code,message:i.message}},submitApplication:async({eventId:n,walletAddress:r,imageFile:i,token:a})=>{let o=await t.getUploadPresignedUrl({fileName:i.name,fileType:`REVIEW`,contentType:i.type});if(o.type===`error`)return o;let s=await t.uploadFile({presignedUrl:o.data.url,file:i});if(s.type===`error`)return s;let{status:c,data:l}=await e[`POST /api/applications`]({body:{eventId:n,walletAddress:r,imageKey:o.data.s3Key},token:a});if(c===200)return{type:`success`,data:null};let u=l;return{type:`error`,code:u.code,message:u.message}}})})),Pe,Fe=e((()=>{Pe=({api:e,storageApi:t})=>({getUploadPresignedUrl:async({fileName:t,fileType:n,contentType:r})=>{let{status:i,data:a}=await e[`POST /api/s3`]({body:{fileName:t,fileType:n,contentType:r}});if(i===200)return{type:`success`,data:a};let o=a;return{type:`error`,code:o.code,message:o.message}},uploadFile:async({presignedUrl:e,file:n})=>{let{status:r}=await t[`PUT upload-file`]({path:e,body:n,contentType:n.type});return r===200?{type:`success`,data:null}:{type:`error`,code:`S3_001`,message:`이미지 업로드에 실패했습니다.`}}})})),Ie,Le=e((()=>{Ie={useValidator:({applicationInputPresenter:e})=>{let{walletAddress:t,imageFile:n}=e.useValidator();return{inputStates:{walletAddress:t,imageFile:n},formStates:{walletAddress:t,imageFile:n}}}}})),M,Re,ze,Be,Ve,He=e((()=>{M=t(n(),1),Re=/^0x[0-9a-fA-F]{40}$/,ze=[`image/jpeg`,`image/png`,`image/webp`],Be=10*1024*1024,Ve={useValidator:()=>{let[e,t]=(0,M.useState)(``),[n,r]=(0,M.useState)(null);return{walletAddress:{value:e,isError:!Re.test(e),onChange:t},imageFile:{value:n,isError:n===null||!ze.includes(n.type)||n.size>Be,onChange:r}}}}})),N,P,Ue,F,We=e((()=>{ye(),N=t(n(),1),f(),Le(),He(),s(),me(),Se(),Ce(),we(),Te(),Oe(),P=b(),Ue=`.jpg,.jpeg,.png,.webp`,F=()=>{let{storeId:e,eventId:t}=g(),{applicationQuery:n}=xe(ee),{token:r}=xe(a),{store:i}=n.useGetStore({storeId:e??``}),{event:o}=n.useGetEvent({eventId:t??``}),{inputStates:s,formStates:c}=Ie.useValidator({applicationInputPresenter:Ve}),[l,u]=(0,N.useState)(!1),[d,f]=(0,N.useState)(``),[p,m]=(0,N.useState)(null),[h,_]=(0,N.useState)(!1),[v,y]=(0,N.useState)(``),[b,x]=(0,N.useState)(!1),S=(0,N.useRef)(null),{submitApplication:te,isPending:C}=n.useSubmitApplication({setResponseMessage:y,onSuccess:()=>{x(!0)}}),ne=async()=>{if(f(``),window.ethereum===void 0){f(`MetaMask가 설치되어 있지 않습니다. metamask.io에서 설치해 주세요.`);return}try{let e=(await window.ethereum.request({method:`eth_requestAccounts`}))[0];e!==void 0&&(s.walletAddress.onChange(e),u(!0))}catch{f(`MetaMask 연결에 실패했습니다.`)}},re=()=>{s.walletAddress.onChange(``),u(!1),f(``)},ie=e=>{l&&u(!1),s.walletAddress.onChange(e),f(``)},w=e=>{s.imageFile.onChange(e),p!==null&&URL.revokeObjectURL(p),m(URL.createObjectURL(e))};return b?(0,P.jsxs)(`div`,{className:`flex flex-col items-center gap-6 py-12 text-center`,children:[(0,P.jsx)(_e,{className:`size-16 text-primary`}),(0,P.jsxs)(`div`,{className:`space-y-2`,children:[(0,P.jsx)(`h2`,{className:`font-semibold text-xl`,children:`제출 완료`}),(0,P.jsx)(`p`,{className:`text-muted-foreground text-sm`,children:`신청이 접수되었습니다. 사장님이 인증을 검토한 후 리워드가 지급됩니다.`})]})]}):(0,P.jsxs)(`div`,{className:`space-y-6`,children:[(0,P.jsx)(`h1`,{className:`font-semibold text-xl`,children:`이벤트 참여 신청`}),(0,P.jsxs)(j,{children:[(0,P.jsx)(A,{children:(0,P.jsx)(Ee,{className:`text-base`,children:`가게 정보`})}),(0,P.jsx)(k,{className:`space-y-1 text-sm`,children:i===void 0?(0,P.jsx)(`p`,{className:`text-muted-foreground`,children:`불러오는 중...`}):(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(`p`,{className:`font-medium`,children:i.name}),(0,P.jsx)(`p`,{className:`text-muted-foreground`,children:i.address})]})})]}),(0,P.jsxs)(j,{children:[(0,P.jsx)(A,{children:(0,P.jsx)(Ee,{className:`text-base`,children:`이벤트 정보`})}),(0,P.jsx)(k,{className:`space-y-2 text-sm`,children:o===void 0?(0,P.jsx)(`p`,{className:`text-muted-foreground`,children:`불러오는 중...`}):(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(`p`,{className:`font-medium`,children:o.title}),(0,P.jsx)(`p`,{className:`text-muted-foreground`,children:o.condition}),(0,P.jsxs)(`p`,{className:`font-semibold text-primary`,children:[o.reward,` ETH`]})]})})]}),(0,P.jsxs)(`div`,{className:`space-y-3`,children:[(0,P.jsx)(ke,{className:`font-medium text-sm`,children:`지갑 주소`}),l?(0,P.jsxs)(`div`,{className:`flex items-center gap-2 rounded-md border bg-muted px-3 py-2 text-sm`,children:[(0,P.jsx)(be,{className:`size-4 shrink-0 text-primary`}),(0,P.jsx)(`span`,{className:`flex-1 truncate font-mono text-xs`,children:s.walletAddress.value}),(0,P.jsx)(`button`,{type:`button`,onClick:re,className:`text-muted-foreground hover:text-foreground`,children:(0,P.jsx)(O,{className:`size-3.5`})})]}):(0,P.jsxs)(D,{type:`button`,variant:`outline`,className:`w-full`,onClick:()=>{ne()},children:[(0,P.jsx)(be,{className:`mr-2 size-4`}),`MetaMask 연결`]}),d.length>0&&(0,P.jsx)(`p`,{className:`text-destructive text-xs`,children:d}),(0,P.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,P.jsx)(`div`,{className:`h-px flex-1 bg-border`}),(0,P.jsx)(`span`,{className:`text-muted-foreground text-xs`,children:`또는`}),(0,P.jsx)(`div`,{className:`h-px flex-1 bg-border`})]}),(0,P.jsxs)(`div`,{className:`space-y-1`,children:[(0,P.jsx)(De,{placeholder:`지갑 주소 직접 입력 (0x...)`,value:l?``:s.walletAddress.value,onChange:e=>{ie(e.target.value)}}),!l&&s.walletAddress.value.length>0&&c.walletAddress.isError&&(0,P.jsx)(`p`,{className:`text-destructive text-xs`,children:`올바른 이더리움 주소를 입력해 주세요 (0x 시작, 42자)`})]})]}),(0,P.jsxs)(`div`,{className:`space-y-3`,children:[(0,P.jsx)(ke,{className:`font-medium text-sm`,children:`인증 사진`}),p===null?(0,P.jsxs)(`div`,{className:`flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors ${h?`border-primary bg-primary/5`:`border-muted-foreground/30 hover:border-primary/50`}`,onClick:()=>{S.current?.click()},onKeyDown:e=>{(e.key===`Enter`||e.key===` `)&&S.current?.click()},onDragOver:e=>{e.preventDefault(),_(!0)},onDragLeave:()=>{_(!1)},onDrop:e=>{e.preventDefault(),_(!1);let t=e.dataTransfer.files[0];t!==void 0&&w(t)},role:`button`,tabIndex:0,children:[h?(0,P.jsx)(ve,{className:`size-8 text-primary`}):(0,P.jsx)(ge,{className:`size-8 text-muted-foreground`}),(0,P.jsxs)(`div`,{className:`text-center`,children:[(0,P.jsx)(`p`,{className:`text-sm`,children:`클릭하거나 파일을 끌어다 놓으세요`}),(0,P.jsx)(`p`,{className:`text-muted-foreground text-xs`,children:`JPG, PNG, WEBP · 최대 10MB`})]})]}):(0,P.jsxs)(`div`,{className:`relative`,children:[(0,P.jsx)(`img`,{src:p,alt:`인증 사진 미리보기`,className:`h-48 w-full rounded-lg object-cover`}),(0,P.jsx)(`button`,{type:`button`,onClick:()=>{s.imageFile.onChange(null),p!==null&&(URL.revokeObjectURL(p),m(null)),S.current!==null&&(S.current.value=``)},className:`absolute top-2 right-2 rounded-full bg-background/80 p-1 hover:bg-background`,children:(0,P.jsx)(O,{className:`size-4`})}),c.imageFile.isError&&(0,P.jsx)(`p`,{className:`mt-1 text-destructive text-xs`,children:`jpg, jpeg, png, webp 파일만 가능하며 크기는 10MB 이하여야 합니다.`})]}),(0,P.jsx)(`input`,{ref:S,type:`file`,accept:Ue,className:`hidden`,onChange:e=>{let t=e.target.files?.[0];t!==void 0&&w(t)}})]}),v.length>0&&(0,P.jsx)(`p`,{className:`rounded-md bg-destructive/10 px-3 py-2 text-center text-destructive text-sm`,children:v}),(0,P.jsx)(D,{className:`w-full`,disabled:C||c.walletAddress.isError||c.imageFile.isError,onClick:()=>{if(!(e===void 0||t===void 0)&&!(c.walletAddress.isError||c.imageFile.isError)){if(s.imageFile.value===null){y(`인증 사진을 업로드해 주세요.`);return}if(r===null){y(`로그인이 필요합니다.`);return}te({eventId:t,walletAddress:s.walletAddress.value,imageFile:s.imageFile.value,token:r})}},children:C?`제출 중...`:`제출하기`})]})},F.__docgenInfo={description:``,methods:[],displayName:`SubmitForm`}})),Ge,Ke,I,L,qe,R,Je,z,Ye,Xe,Ze,B,V,Qe,H,U,W,G,K,q,J,Y,X,Z,Q,$;e((()=>{Ge=m(),S(),Ke=t(n(),1),f(),je(),Ne(),oe(),p(),Fe(),s(),he(),pe(),fe(),ie(),le(),se(),ae(),de(),We(),I=b(),{expect:L,fireEvent:qe,userEvent:R,waitFor:Je,within:z}=__STORYBOOK_MODULE_TEST__,Ye=`0xAbCdEf1234567890AbCdEf1234567890AbCdEf12`,Xe=`https://mock-s3.example.com/presigned`,Ze=()=>{let e=(0,Ge.c)(10),[,t]=(0,Ke.useState)(null),n=ce({externalCall:ne}),a=w({externalStorageCall:re}),s=r({authUsecase:o({api:n,tokenRepository:C({setToken:t})})}),c=te({storeUsecase:x({api:n})}),l=Me({api:n,fileUsecase:Pe({api:n,storageApi:a})}),u;e[0]===l?u=e[1]:(u={applicationUsecase:l},e[0]=l,e[1]=u);let d=Ae(u),f;e[2]!==d||e[3]!==s||e[4]!==c?(f={authQuery:s,storeQuery:c,applicationQuery:d},e[2]=d,e[3]=s,e[4]=c,e[5]=f):f=e[5];let p;e[6]===Symbol.for(`react.memo_cache_sentinel`)?(p=(0,I.jsx)(i,{path:`/store/:storeId/event/:eventId`,element:(0,I.jsx)(F,{})}),e[6]=p):p=e[6];let m;e[7]===Symbol.for(`react.memo_cache_sentinel`)?(m=(0,I.jsxs)(_,{children:[p,(0,I.jsx)(i,{path:`*`,element:(0,I.jsx)(h,{to:`/store/store-001/event/event-001`,replace:!0})})]}),e[7]=m):m=e[7];let g;return e[8]===f?g=e[9]:(g=(0,I.jsx)(ee.Provider,{value:f,children:m}),e[8]=f,e[9]=g),g},B=(e,t)=>{let n=e.querySelector(`input[type="file"]`),r=new DataTransfer;r.items.add(t),Object.defineProperty(n,"files",{value:r.files,configurable:!0}),qe.change(n)},V=async e=>{let t=z(e);await R.type(t.getByPlaceholderText(`지갑 주소 직접 입력 (0x...)`),Ye),B(e,new File([`img`],`review.jpg`,{type:`image/jpeg`})),await Je(()=>L(t.getByRole(`button`,{name:`제출하기`})).not.toBeDisabled())},Qe={title:`Application/SubmitForm`,component:Ze},H={name:`200 폼 초기 렌더 — 가게·이벤트 정보 표시`,play:async({canvasElement:e})=>{let t=z(e);await L(t.findByText(`기절초풍왕순대`)).resolves.toBeInTheDocument(),await L(t.findByText(`신규 메뉴 불닭볶음면 먹고 리뷰 달기`)).resolves.toBeInTheDocument()}},U={name:`200 제출 성공 — 완료 화면 전환`,play:async({canvasElement:e})=>{await V(e);let t=z(e);await R.click(t.getByRole(`button`,{name:`제출하기`})),await L(t.findByText(`제출 완료`)).resolves.toBeInTheDocument()}},W={name:`MetaMask 미설치 — 설치 안내 메시지`,play:async({canvasElement:e})=>{let t=window.ethereum;window.ethereum=void 0;let n=z(e);await R.click(n.getByRole(`button`,{name:`MetaMask 연결`})),await L(n.findByText(`MetaMask가 설치되어 있지 않습니다. metamask.io에서 설치해 주세요.`)).resolves.toBeInTheDocument(),window.ethereum=t}},G={name:`MetaMask 연결 거부 — 에러 메시지`,play:async({canvasElement:e})=>{let t=window.ethereum;window.ethereum={request:()=>Promise.reject(Error(`User rejected the request`))};let n=z(e);await R.click(n.getByRole(`button`,{name:`MetaMask 연결`})),await L(n.findByText(`MetaMask 연결에 실패했습니다.`)).resolves.toBeInTheDocument(),window.ethereum=t}},K={name:`400 잘못된 지갑 주소 형식 (클라이언트 유효성)`,play:async({canvasElement:e})=>{let t=z(e);await R.type(t.getByPlaceholderText(`지갑 주소 직접 입력 (0x...)`),`0xinvalid`),await L(t.findByText(`올바른 이더리움 주소를 입력해 주세요 (0x 시작, 42자)`)).resolves.toBeInTheDocument()}},q={name:`400 허용되지 않는 파일 형식 (클라이언트 유효성)`,play:async({canvasElement:e})=>{B(e,new File([`pdf content`],`document.pdf`,{type:`application/pdf`})),await L(z(e).findByText(`jpg, jpeg, png, webp 파일만 가능하며 크기는 10MB 이하여야 합니다.`)).resolves.toBeInTheDocument()}},J={name:`500 presigned URL 발급 실패`,parameters:{msw:{handlers:[E.post(`*/api/s3`,()=>v.json({code:`S3_001`,message:`Failed to generate presigned URL`},{status:500}))]}},play:async({canvasElement:e})=>{await V(e);let t=z(e);await R.click(t.getByRole(`button`,{name:`제출하기`})),await L(t.findByText(`파일 업로드 URL 생성에 실패했습니다.`)).resolves.toBeInTheDocument()}},Y={name:`500 S3 파일 업로드 실패`,parameters:{msw:{handlers:[E.put(`${Xe}/*`,()=>new v(null,{status:500})),...T]}},play:async({canvasElement:e})=>{await V(e);let t=z(e);await R.click(t.getByRole(`button`,{name:`제출하기`})),await L(t.findByText(`파일 업로드 URL 생성에 실패했습니다.`)).resolves.toBeInTheDocument()}},X={name:`400 마감된 이벤트 신청`,parameters:{msw:{handlers:[E.post(`*/api/applications`,()=>v.json({code:`GEN_003`,message:`Event is already closed`},{status:400})),...T]}},play:async({canvasElement:e})=>{await V(e);let t=z(e);await R.click(t.getByRole(`button`,{name:`제출하기`})),await L(t.findByText(`잘못된 요청입니다.`)).resolves.toBeInTheDocument()}},Z={name:`404 존재하지 않는 이벤트`,parameters:{msw:{handlers:[E.post(`*/api/applications`,()=>v.json({code:`EVENT_001`,message:`Event not found`},{status:404})),...T]}},play:async({canvasElement:e})=>{await V(e);let t=z(e);await R.click(t.getByRole(`button`,{name:`제출하기`})),await L(t.findByText(`이벤트를 찾을 수 없습니다.`)).resolves.toBeInTheDocument()}},Q={name:`404 가게 정보 조회 실패 — 로딩 유지`,parameters:{msw:{handlers:[E.get(`*/api/store/:storeId`,()=>v.json({code:`STORE_001`,message:`Store not found`},{status:404})),...ue]}},play:async({canvasElement:e})=>{let t=z(e);await L(t.findByText(`신규 메뉴 불닭볶음면 먹고 리뷰 달기`)).resolves.toBeInTheDocument(),L(t.getAllByText(`불러오는 중...`)).toHaveLength(1)}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  name: '200 폼 초기 렌더 — 가게·이벤트 정보 표시',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.findByText('기절초풍왕순대')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('신규 메뉴 불닭볶음면 먹고 리뷰 달기')).resolves.toBeInTheDocument();
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  name: '200 제출 성공 — 완료 화면 전환',
  play: async ({
    canvasElement
  }) => {
    await fillForm(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: '제출하기'
    }));
    await expect(canvas.findByText('제출 완료')).resolves.toBeInTheDocument();
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  name: 'MetaMask 미설치 — 설치 안내 메시지',
  play: async ({
    canvasElement
  }) => {
    // 브라우저에 MetaMask가 설치돼 있어도 미설치 케이스를 재현하기 위해 임시 제거
    const originalEthereum = window.ethereum;
    window.ethereum = undefined;
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'MetaMask 연결'
    }));
    await expect(canvas.findByText('MetaMask가 설치되어 있지 않습니다. metamask.io에서 설치해 주세요.')).resolves.toBeInTheDocument();
    window.ethereum = originalEthereum;
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  name: 'MetaMask 연결 거부 — 에러 메시지',
  play: async ({
    canvasElement
  }) => {
    const originalEthereum = window.ethereum;
    window.ethereum = {
      request: () => Promise.reject(new Error('User rejected the request')) as Promise<string[]>
    };
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'MetaMask 연결'
    }));
    await expect(canvas.findByText('MetaMask 연결에 실패했습니다.')).resolves.toBeInTheDocument();
    window.ethereum = originalEthereum;
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  name: '400 잘못된 지갑 주소 형식 (클라이언트 유효성)',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByPlaceholderText('지갑 주소 직접 입력 (0x...)'), '0xinvalid');
    await expect(canvas.findByText('올바른 이더리움 주소를 입력해 주세요 (0x 시작, 42자)')).resolves.toBeInTheDocument();
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  name: '400 허용되지 않는 파일 형식 (클라이언트 유효성)',
  play: async ({
    canvasElement
  }) => {
    uploadFileToInput(canvasElement, new File(['pdf content'], 'document.pdf', {
      type: 'application/pdf'
    }));
    const canvas = within(canvasElement);
    await expect(canvas.findByText('jpg, jpeg, png, webp 파일만 가능하며 크기는 10MB 이하여야 합니다.')).resolves.toBeInTheDocument();
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  name: '500 presigned URL 발급 실패',
  parameters: {
    msw: {
      handlers: [
      // POST /api/s3를 오버라이드 — 이 시점에서 플로우가 멈추므로 S3 PUT은 불필요
      http.post('*/api/s3', () => HttpResponse.json({
        code: 'S3_001',
        message: 'Failed to generate presigned URL'
      }, {
        status: 500
      }))]
    }
  },
  play: async ({
    canvasElement
  }) => {
    await fillForm(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: '제출하기'
    }));
    await expect(canvas.findByText('파일 업로드 URL 생성에 실패했습니다.')).resolves.toBeInTheDocument();
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  name: '500 S3 파일 업로드 실패',
  parameters: {
    msw: {
      handlers: [
      // PUT 오버라이드를 먼저 등록해 s3Handlers의 PUT보다 우선 적용
      http.put(\`\${MOCK_S3_BASE_URL}/*\`, () => new HttpResponse(null, {
        status: 500
      })),
      // presigned URL 발급(POST /api/s3)은 정상 동작 필요
      ...s3Handlers]
    }
  },
  play: async ({
    canvasElement
  }) => {
    await fillForm(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: '제출하기'
    }));
    await expect(canvas.findByText('파일 업로드 URL 생성에 실패했습니다.')).resolves.toBeInTheDocument();
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  name: '400 마감된 이벤트 신청',
  parameters: {
    msw: {
      handlers: [http.post('*/api/applications', () => HttpResponse.json({
        code: 'GEN_003',
        message: 'Event is already closed'
      }, {
        status: 400
      })),
      // fillForm의 업로드 플로우(POST /api/s3 + PUT S3)에 필요
      ...s3Handlers]
    }
  },
  play: async ({
    canvasElement
  }) => {
    await fillForm(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: '제출하기'
    }));
    await expect(canvas.findByText('잘못된 요청입니다.')).resolves.toBeInTheDocument();
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  name: '404 존재하지 않는 이벤트',
  parameters: {
    msw: {
      handlers: [http.post('*/api/applications', () => HttpResponse.json({
        code: 'EVENT_001',
        message: 'Event not found'
      }, {
        status: 404
      })), ...s3Handlers]
    }
  },
  play: async ({
    canvasElement
  }) => {
    await fillForm(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: '제출하기'
    }));
    await expect(canvas.findByText('이벤트를 찾을 수 없습니다.')).resolves.toBeInTheDocument();
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  name: '404 가게 정보 조회 실패 — 로딩 유지',
  parameters: {
    msw: {
      handlers: [http.get('*/api/store/:storeId', () => HttpResponse.json({
        code: 'STORE_001',
        message: 'Store not found'
      }, {
        status: 404
      })),
      // 이벤트 쿼리는 글로벌 핸들러와 독립적으로 병렬 실행되므로 별도 포함
      ...eventHandlers]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    // 이벤트 카드는 성공적으로 로드되고, 가게 카드만 로딩 상태로 남는지 확인
    await expect(canvas.findByText('신규 메뉴 불닭볶음면 먹고 리뷰 달기')).resolves.toBeInTheDocument();
    expect(canvas.getAllByText('불러오는 중...')).toHaveLength(1);
  }
}`,...Q.parameters?.docs?.source}}},$=[`Default`,`Success`,`MetaMaskNotInstalled`,`MetaMaskConnectionFailed`,`ClientValidationErrorInvalidWallet`,`ClientValidationErrorInvalidFileType`,`ErrorPresignedUrlFail`,`ErrorS3UploadFail`,`ErrorEventClosed`,`ErrorEventNotFound`,`ErrorStoreLoadFail`]}))();export{q as ClientValidationErrorInvalidFileType,K as ClientValidationErrorInvalidWallet,H as Default,X as ErrorEventClosed,Z as ErrorEventNotFound,J as ErrorPresignedUrlFail,Y as ErrorS3UploadFail,Q as ErrorStoreLoadFail,G as MetaMaskConnectionFailed,W as MetaMaskNotInstalled,U as Success,$ as __namedExportsOrder,Qe as default};