import{i as e}from"./preload-helper-B-rJVKt8.js";import{M as t,j as n}from"./iframe-Blc3RJWa.js";import{n as r,t as i}from"./auth-BdycFaGx.js";var a,o,s,c=e((()=>{a=t(),i(),o=n(),s=()=>{let e=(0,a.c)(1),t;return e[0]===Symbol.for(`react.memo_cache_sentinel`)?(t=(0,o.jsx)(`div`,{className:`flex min-h-screen items-center justify-center bg-background px-4 py-8`,children:(0,o.jsx)(r,{})}),e[0]=t):t=e[0],t},s.__docgenInfo={description:``,methods:[],displayName:`SignUpPage`}})),l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w;e((()=>{c(),{expect:l,screen:u,userEvent:d,within:f}=__STORYBOOK_MODULE_TEST__,p=`TestPass1!`,m=`홍길동`,h=`test@example.com`,g=`123456`,_=async(e,t=h)=>{await d.type(e.getByLabelText(`이메일`),t),await d.click(e.getByRole(`button`,{name:`인증 코드 발송`}));let n=await e.findByLabelText(`인증 코드`);await d.type(n,g),await d.click(e.getByRole(`button`,{name:`인증 확인`})),await l(e.findByText(`이메일 인증이 완료되었습니다.`)).resolves.toBeInTheDocument()},v={title:`Pages/SignUpPage`,component:s},y={name:`기본 페이지 렌더링`},b={name:`전체 플로우 — 손님 회원가입 성공`,play:async({canvasElement:e})=>{let t=f(e);await d.type(t.getByLabelText(`실명`),m),await _(t),await d.type(t.getByLabelText(`비밀번호`),p),await d.type(t.getByLabelText(`비밀번호 확인`),p),await d.click(t.getByRole(`button`,{name:`회원가입`}))}},x={name:`전체 플로우 — 사장님 회원가입 성공`,play:async({canvasElement:e})=>{let t=f(e);await d.click(t.getByRole(`tab`,{name:`사장님`})),await d.type(t.getByLabelText(`실명`),m),await _(t,`owner@example.com`),await d.type(t.getByLabelText(`비밀번호`),p),await d.type(t.getByLabelText(`비밀번호 확인`),p),await d.click(t.getByRole(`button`,{name:`회원가입`}))}},S={name:`전체 플로우 — 중복 이메일 → 모달`,play:async({canvasElement:e})=>{let t=f(e);await d.type(t.getByLabelText(`실명`),m),await d.type(t.getByLabelText(`이메일`),`duplicate@example.com`),await d.type(t.getByLabelText(`비밀번호`),p),await d.type(t.getByLabelText(`비밀번호 확인`),p),await d.click(t.getByRole(`button`,{name:`회원가입`})),await l(u.findByText(`이미 가입된 이메일입니다`)).resolves.toBeInTheDocument(),await d.click(u.getByRole(`button`,{name:`로그인하기`}))}},C={name:`전체 플로우 — 이메일 발송 → 코드 인증`,play:async({canvasElement:e})=>{let t=f(e);await d.type(t.getByLabelText(`이메일`),h),await d.click(t.getByRole(`button`,{name:`인증 코드 발송`})),await l(t.findByLabelText(`인증 코드`)).resolves.toBeInTheDocument(),await l(t.findByText(/5:0/)).resolves.toBeInTheDocument();let n=await t.findByLabelText(`인증 코드`);await d.type(n,g),await d.click(t.getByRole(`button`,{name:`인증 확인`})),await l(t.findByText(`이메일 인증이 완료되었습니다.`)).resolves.toBeInTheDocument()}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: '기본 페이지 렌더링'
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: '전체 플로우 — 손님 회원가입 성공',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('실명'), VALID_NAME);
    await completeEmailVerification(canvas);
    await userEvent.type(canvas.getByLabelText('비밀번호'), VALID_PASSWORD);
    await userEvent.type(canvas.getByLabelText('비밀번호 확인'), VALID_PASSWORD);
    await userEvent.click(canvas.getByRole('button', {
      name: '회원가입'
    }));
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: '전체 플로우 — 사장님 회원가입 성공',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', {
      name: '사장님'
    }));
    await userEvent.type(canvas.getByLabelText('실명'), VALID_NAME);
    await completeEmailVerification(canvas, 'owner@example.com');
    await userEvent.type(canvas.getByLabelText('비밀번호'), VALID_PASSWORD);
    await userEvent.type(canvas.getByLabelText('비밀번호 확인'), VALID_PASSWORD);
    await userEvent.click(canvas.getByRole('button', {
      name: '회원가입'
    }));
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: '전체 플로우 — 중복 이메일 → 모달',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('실명'), VALID_NAME);
    await userEvent.type(canvas.getByLabelText('이메일'), 'duplicate@example.com');
    await userEvent.type(canvas.getByLabelText('비밀번호'), VALID_PASSWORD);
    await userEvent.type(canvas.getByLabelText('비밀번호 확인'), VALID_PASSWORD);
    await userEvent.click(canvas.getByRole('button', {
      name: '회원가입'
    }));
    await expect(screen.findByText('이미 가입된 이메일입니다')).resolves.toBeInTheDocument();
    // 로그인하기 버튼 클릭 시 로그인 페이지로 이동
    await userEvent.click(screen.getByRole('button', {
      name: '로그인하기'
    }));
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: '전체 플로우 — 이메일 발송 → 코드 인증',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('이메일'), VALID_EMAIL);
    await userEvent.click(canvas.getByRole('button', {
      name: '인증 코드 발송'
    }));
    // 코드 입력창과 타이머 표시 확인
    await expect(canvas.findByLabelText('인증 코드')).resolves.toBeInTheDocument();
    await expect(canvas.findByText(/5:0/)).resolves.toBeInTheDocument();
    // 코드 인증
    const codeInput = await canvas.findByLabelText('인증 코드');
    await userEvent.type(codeInput, VALID_CODE);
    await userEvent.click(canvas.getByRole('button', {
      name: '인증 확인'
    }));
    await expect(canvas.findByText('이메일 인증이 완료되었습니다.')).resolves.toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w=[`Default`,`FullFlowSuccess`,`FullFlowOwnerSuccess`,`FullFlowDuplicateEmail`,`FullFlowEmailVerification`]}))();export{y as Default,S as FullFlowDuplicateEmail,C as FullFlowEmailVerification,x as FullFlowOwnerSuccess,b as FullFlowSuccess,w as __namedExportsOrder,v as default};