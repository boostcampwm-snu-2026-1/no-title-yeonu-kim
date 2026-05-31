import{i as e}from"./preload-helper-B-rJVKt8.js";import{k as t,n,t as r}from"./iframe-BrVlnTNv.js";import{n as i,t as a}from"./auth-xUxciAHf.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D;e((()=>{r(),a(),{expect:o,screen:s,userEvent:c,within:l}=__STORYBOOK_MODULE_TEST__,u=`TestPass1!`,d=`홍길동`,f=`test@example.com`,p=`123456`,m=async(e,t=f)=>{await c.type(e.getByLabelText(`이메일`),t),await c.click(e.getByRole(`button`,{name:`인증 코드 발송`}));let n=await e.findByLabelText(`인증 코드`);await c.type(n,p),await c.click(e.getByRole(`button`,{name:`인증 확인`})),await o(e.findByText(`이메일 인증이 완료되었습니다.`)).resolves.toBeInTheDocument()},h={title:`Auth/SignUpForm`,component:i},g={name:`인증 이메일 발송 → 코드 입력창 표시`,play:async({canvasElement:e})=>{let t=l(e);await c.type(t.getByLabelText(`이메일`),f),await c.click(t.getByRole(`button`,{name:`인증 코드 발송`})),await o(t.findByLabelText(`인증 코드`)).resolves.toBeInTheDocument()}},_={name:`재발송 버튼 쿨다운 (30초)`,play:async({canvasElement:e})=>{let t=l(e);await c.type(t.getByLabelText(`이메일`),f),await c.click(t.getByRole(`button`,{name:`인증 코드 발송`})),await o(await t.findByRole(`button`,{name:/재발송/})).toBeDisabled()}},v={name:`500 인증 이메일 발송 실패`,parameters:{msw:{handlers:[n.post(`*/api/auth/email/verify`,()=>t.json({code:`MAIL_001`,message:`Failed to send email`},{status:500}))]}},play:async({canvasElement:e})=>{let t=l(e);await c.type(t.getByLabelText(`이메일`),`fail-send@example.com`),await c.click(t.getByRole(`button`,{name:`인증 코드 발송`})),await o(t.findByText(`이메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.`)).resolves.toBeInTheDocument()}},y={name:`인증 코드 확인 성공 → 인증 완료 표시`,play:async({canvasElement:e})=>{let t=l(e);await c.type(t.getByLabelText(`이메일`),f),await c.click(t.getByRole(`button`,{name:`인증 코드 발송`}));let n=await t.findByLabelText(`인증 코드`);await c.type(n,p),await c.click(t.getByRole(`button`,{name:`인증 확인`})),await o(t.findByText(`이메일 인증이 완료되었습니다.`)).resolves.toBeInTheDocument()}},b={name:`400 잘못된 인증 코드 → 에러 메시지`,play:async({canvasElement:e})=>{let t=l(e);await c.type(t.getByLabelText(`이메일`),f),await c.click(t.getByRole(`button`,{name:`인증 코드 발송`}));let n=await t.findByLabelText(`인증 코드`);await c.type(n,`000000`),await c.click(t.getByRole(`button`,{name:`인증 확인`})),await o(t.findByText(`이메일 인증 코드가 유효하지 않거나 만료되었습니다.`)).resolves.toBeInTheDocument()}},x={name:`200 회원가입 성공 (손님)`,play:async({canvasElement:e})=>{let t=l(e);await c.type(t.getByLabelText(`실명`),d),await m(t),await c.type(t.getByLabelText(`비밀번호`),u),await c.type(t.getByLabelText(`비밀번호 확인`),u),await c.click(t.getByRole(`button`,{name:`회원가입`}))}},S={name:`200 회원가입 성공 (사장님)`,play:async({canvasElement:e})=>{let t=l(e);await c.click(t.getByRole(`tab`,{name:`사장님`})),await c.type(t.getByLabelText(`실명`),d),await m(t,`owner@example.com`),await c.type(t.getByLabelText(`비밀번호`),u),await c.type(t.getByLabelText(`비밀번호 확인`),u),await c.click(t.getByRole(`button`,{name:`회원가입`}))}},C={name:`400 빈 폼 제출 (클라이언트 유효성)`,play:async({canvasElement:e})=>{let t=l(e);await c.click(t.getByRole(`button`,{name:`회원가입`})),await o(t.findByText(`한글 2~6자 또는 영문 2~20자로 입력해 주세요.`)).resolves.toBeInTheDocument(),await o(t.findByText(`올바른 이메일을 입력해 주세요.`)).resolves.toBeInTheDocument(),await o(t.findByText(`비밀번호 필수 조건을 만족해 주세요.`)).resolves.toBeInTheDocument()}},w={name:`409 중복 이메일 → 로그인 유도 모달`,play:async({canvasElement:e})=>{let t=l(e);await c.type(t.getByLabelText(`실명`),d),await c.type(t.getByLabelText(`이메일`),`duplicate@example.com`),await c.type(t.getByLabelText(`비밀번호`),u),await c.type(t.getByLabelText(`비밀번호 확인`),u),await c.click(t.getByRole(`button`,{name:`회원가입`})),await o(s.findByText(`이미 가입된 이메일입니다`)).resolves.toBeInTheDocument()}},T={name:`400 이메일 인증 코드 만료 (손님)`,play:async({canvasElement:e})=>{let t=l(e);await c.type(t.getByLabelText(`실명`),d),await m(t,`test+fail@snu.ac.kr`),await c.type(t.getByLabelText(`비밀번호`),u),await c.type(t.getByLabelText(`비밀번호 확인`),u),await c.click(t.getByRole(`button`,{name:`회원가입`})),await o(t.findByText(`이메일 인증 코드가 유효하지 않거나 만료되었습니다.`)).resolves.toBeInTheDocument()}},E={name:`401 비밀번호 불일치 (사장님)`,play:async({canvasElement:e})=>{let t=l(e);await c.click(t.getByRole(`tab`,{name:`사장님`})),await c.type(t.getByLabelText(`실명`),d),await m(t,`owner@example.com`),await c.type(t.getByLabelText(`비밀번호`),`wrong-owner-secret`),await c.type(t.getByLabelText(`비밀번호 확인`),`wrong-owner-secret`),await c.click(t.getByRole(`button`,{name:`회원가입`})),await o(t.findByText(`이메일 또는 비밀번호가 일치하지 않습니다.`)).resolves.toBeInTheDocument()}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: '인증 이메일 발송 → 코드 입력창 표시',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('이메일'), VALID_EMAIL);
    await userEvent.click(canvas.getByRole('button', {
      name: '인증 코드 발송'
    }));
    await expect(canvas.findByLabelText('인증 코드')).resolves.toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: '재발송 버튼 쿨다운 (30초)',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('이메일'), VALID_EMAIL);
    await userEvent.click(canvas.getByRole('button', {
      name: '인증 코드 발송'
    }));
    const resendBtn = await canvas.findByRole('button', {
      name: /재발송/
    });
    await expect(resendBtn).toBeDisabled();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: '500 인증 이메일 발송 실패',
  parameters: {
    msw: {
      handlers: [http.post('*/api/auth/email/verify', () => HttpResponse.json({
        code: 'MAIL_001',
        message: 'Failed to send email'
      }, {
        status: 500
      }))]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('이메일'), 'fail-send@example.com');
    await userEvent.click(canvas.getByRole('button', {
      name: '인증 코드 발송'
    }));
    await expect(canvas.findByText('이메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.')).resolves.toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: '인증 코드 확인 성공 → 인증 완료 표시',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('이메일'), VALID_EMAIL);
    await userEvent.click(canvas.getByRole('button', {
      name: '인증 코드 발송'
    }));
    const codeInput = await canvas.findByLabelText('인증 코드');
    await userEvent.type(codeInput, VALID_CODE);
    await userEvent.click(canvas.getByRole('button', {
      name: '인증 확인'
    }));
    await expect(canvas.findByText('이메일 인증이 완료되었습니다.')).resolves.toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: '400 잘못된 인증 코드 → 에러 메시지',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('이메일'), VALID_EMAIL);
    await userEvent.click(canvas.getByRole('button', {
      name: '인증 코드 발송'
    }));
    const codeInput = await canvas.findByLabelText('인증 코드');
    await userEvent.type(codeInput, '000000');
    await userEvent.click(canvas.getByRole('button', {
      name: '인증 확인'
    }));
    await expect(canvas.findByText('이메일 인증 코드가 유효하지 않거나 만료되었습니다.')).resolves.toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: '200 회원가입 성공 (손님)',
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: '200 회원가입 성공 (사장님)',
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: '400 빈 폼 제출 (클라이언트 유효성)',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: '회원가입'
    }));
    await expect(canvas.findByText('한글 2~6자 또는 영문 2~20자로 입력해 주세요.')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('올바른 이메일을 입력해 주세요.')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('비밀번호 필수 조건을 만족해 주세요.')).resolves.toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: '409 중복 이메일 → 로그인 유도 모달',
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
    // 모달은 document.body에 portal로 렌더링됨
    await expect(screen.findByText('이미 가입된 이메일입니다')).resolves.toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: '400 이메일 인증 코드 만료 (손님)',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('실명'), VALID_NAME);
    await completeEmailVerification(canvas, 'test+fail@snu.ac.kr');
    await userEvent.type(canvas.getByLabelText('비밀번호'), VALID_PASSWORD);
    await userEvent.type(canvas.getByLabelText('비밀번호 확인'), VALID_PASSWORD);
    await userEvent.click(canvas.getByRole('button', {
      name: '회원가입'
    }));
    await expect(canvas.findByText('이메일 인증 코드가 유효하지 않거나 만료되었습니다.')).resolves.toBeInTheDocument();
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: '401 비밀번호 불일치 (사장님)',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', {
      name: '사장님'
    }));
    await userEvent.type(canvas.getByLabelText('실명'), VALID_NAME);
    await completeEmailVerification(canvas, 'owner@example.com');
    await userEvent.type(canvas.getByLabelText('비밀번호'), 'wrong-owner-secret');
    await userEvent.type(canvas.getByLabelText('비밀번호 확인'), 'wrong-owner-secret');
    await userEvent.click(canvas.getByRole('button', {
      name: '회원가입'
    }));
    await expect(canvas.findByText('이메일 또는 비밀번호가 일치하지 않습니다.')).resolves.toBeInTheDocument();
  }
}`,...E.parameters?.docs?.source}}},D=[`SendVerificationEmail`,`ResendCooldown`,`SendEmailFailed`,`VerifyCodeSuccess`,`VerifyCodeError`,`SuccessReviewer`,`SuccessOwner`,`ClientValidationError`,`ErrorDuplicateEmail`,`ErrorReviewerExpiredCode`,`ErrorOwnerWrongPassword`]}))();export{C as ClientValidationError,w as ErrorDuplicateEmail,E as ErrorOwnerWrongPassword,T as ErrorReviewerExpiredCode,_ as ResendCooldown,v as SendEmailFailed,g as SendVerificationEmail,S as SuccessOwner,x as SuccessReviewer,b as VerifyCodeError,y as VerifyCodeSuccess,D as __namedExportsOrder,h as default};