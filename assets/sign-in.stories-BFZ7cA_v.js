import{i as e}from"./preload-helper-B-rJVKt8.js";import{k as t,n,t as r}from"./iframe-BrVlnTNv.js";import{i,t as a}from"./auth-xUxciAHf.js";var o,s,c,l,u,d,f,p,m;e((()=>{r(),a(),{expect:o,userEvent:s,within:c}=__STORYBOOK_MODULE_TEST__,l={title:`Auth/SignInForm`,component:i},u={name:`200 로그인 성공 (손님)`,play:async({canvasElement:e})=>{let t=c(e);await s.type(t.getByLabelText(`이메일`),`reviewer@example.com`),await s.type(t.getByLabelText(`비밀번호`),`TestPass1!`),await s.click(t.getByRole(`button`,{name:`로그인`}))}},d={name:`400 빈 폼 제출 (클라이언트 유효성)`,play:async({canvasElement:e})=>{let t=c(e);await s.click(t.getByRole(`button`,{name:`로그인`})),await o(t.findByText(`올바른 이메일을 입력해 주세요.`)).resolves.toBeInTheDocument(),await o(t.findByText(`비밀번호를 입력해 주세요.`)).resolves.toBeInTheDocument()}},f={name:`401 계정 없음`,parameters:{msw:{handlers:[n.post(`*/api/auth/user/session`,()=>t.json({code:`AUTH_002`,message:`Invalid credentials`},{status:401}))]}},play:async({canvasElement:e})=>{let t=c(e);await s.type(t.getByLabelText(`이메일`),`notfound@example.com`),await s.type(t.getByLabelText(`비밀번호`),`TestPass1!`),await s.click(t.getByRole(`button`,{name:`로그인`})),await o(t.findByText(`이메일 또는 비밀번호가 일치하지 않습니다.`)).resolves.toBeInTheDocument()}},p={name:`401 비밀번호 불일치`,parameters:{msw:{handlers:[n.post(`*/api/auth/user/session`,()=>t.json({code:`AUTH_002`,message:`Invalid credentials`},{status:401}))]}},play:async({canvasElement:e})=>{let t=c(e);await s.type(t.getByLabelText(`이메일`),`valid@example.com`),await s.type(t.getByLabelText(`비밀번호`),`wrongpassword`),await s.click(t.getByRole(`button`,{name:`로그인`})),await o(t.findByText(`이메일 또는 비밀번호가 일치하지 않습니다.`)).resolves.toBeInTheDocument()}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: '200 로그인 성공 (손님)',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('이메일'), 'reviewer@example.com');
    await userEvent.type(canvas.getByLabelText('비밀번호'), 'TestPass1!');
    await userEvent.click(canvas.getByRole('button', {
      name: '로그인'
    }));
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: '400 빈 폼 제출 (클라이언트 유효성)',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: '로그인'
    }));
    await expect(canvas.findByText('올바른 이메일을 입력해 주세요.')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('비밀번호를 입력해 주세요.')).resolves.toBeInTheDocument();
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: '401 계정 없음',
  parameters: {
    msw: {
      handlers: [http.post('*/api/auth/user/session', () => HttpResponse.json({
        code: 'AUTH_002',
        message: 'Invalid credentials'
      }, {
        status: 401
      }))]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('이메일'), 'notfound@example.com');
    await userEvent.type(canvas.getByLabelText('비밀번호'), 'TestPass1!');
    await userEvent.click(canvas.getByRole('button', {
      name: '로그인'
    }));
    await expect(canvas.findByText('이메일 또는 비밀번호가 일치하지 않습니다.')).resolves.toBeInTheDocument();
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: '401 비밀번호 불일치',
  parameters: {
    msw: {
      handlers: [http.post('*/api/auth/user/session', () => HttpResponse.json({
        code: 'AUTH_002',
        message: 'Invalid credentials'
      }, {
        status: 401
      }))]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('이메일'), 'valid@example.com');
    await userEvent.type(canvas.getByLabelText('비밀번호'), 'wrongpassword');
    await userEvent.click(canvas.getByRole('button', {
      name: '로그인'
    }));
    await expect(canvas.findByText('이메일 또는 비밀번호가 일치하지 않습니다.')).resolves.toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m=[`SuccessReviewer`,`ClientValidationError`,`ErrorNotFound`,`ErrorWrongPassword`]}))();export{d as ClientValidationError,f as ErrorNotFound,p as ErrorWrongPassword,u as SuccessReviewer,m as __namedExportsOrder,l as default};