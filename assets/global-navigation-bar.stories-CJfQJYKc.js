import{i as e,s as t}from"./preload-helper-B-rJVKt8.js";import{$ as n,A as r,C as i,D as a,E as o,M as s,O as c,S as l,T as u,W as d,Z as f,a as p,c as m,d as h,j as g,k as _,l as v,m as y,o as b,u as x,w as S,x as C}from"./iframe-Ce9oT3n4.js";import{E as w,_ as T,g as E,h as D,m as O,n as k,p as A,t as j,v as M}from"./button-CAEJdT3Q.js";var N,P,F,I=e((()=>{T(),N=t(n(),1),o(),S(),D(),g(),O(),k(),P=f(),F=()=>{let{token:e}=E(i),{authQuery:t}=E(u),{logout:n}=t.useLogout(),{toMain:r,toSignIn:a,toSignUp:o}=s(),[c,l]=(0,N.useState)(!1),d=()=>{e!==null&&n({token:e})},f=()=>l(!1);return(0,P.jsx)(`header`,{className:`sticky top-0 z-50 flex w-full justify-center bg-white shadow-md`,children:(0,P.jsxs)(`div`,{className:`flex w-full items-center justify-between px-6 py-4`,children:[(0,P.jsx)(`h1`,{onClick:r,className:`cursor-pointer font-bold text-gray-800 text-xl transition-colors duration-150 hover:text-blue-600`,children:`VLSI`}),(0,P.jsx)(`div`,{className:`hidden items-center gap-5 sm:flex`,children:e===null?(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(j,{onClick:o,variant:`ghost`,children:`회원가입`}),(0,P.jsx)(j,{onClick:a,variant:`ghost`,children:`로그인`})]}):(0,P.jsx)(j,{onClick:d,variant:`ghost`,children:`로그아웃`})}),(0,P.jsxs)(`div`,{className:`flex sm:hidden`,children:[(0,P.jsx)(j,{variant:`ghost`,size:`icon`,onClick:()=>l(e=>!e),children:(0,P.jsx)(w,{})}),c&&(0,P.jsx)(`div`,{className:`fixed inset-0 z-40 bg-black/30 sm:hidden`,onClick:f}),(0,P.jsxs)(`div`,{className:A(`fixed top-0 right-0 z-50 h-full w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out sm:hidden`,c?`translate-x-0`:`translate-x-full`),children:[(0,P.jsx)(`div`,{className:`flex justify-start px-2 py-4`,children:(0,P.jsx)(j,{variant:`ghost`,size:`icon`,onClick:f,children:(0,P.jsx)(M,{})})}),(0,P.jsx)(`div`,{className:`flex flex-col space-y-6 px-6`,children:e===null?(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(j,{onClick:()=>{o(),f()},variant:`ghost`,className:`justify-between`,children:`회원가입`}),(0,P.jsx)(j,{onClick:()=>{a(),f()},variant:`ghost`,className:`justify-between`,children:`로그인`})]}):(0,P.jsx)(j,{onClick:()=>{d(),f()},variant:`ghost`,className:`justify-between`,children:`로그아웃`})})]})]})]})})},F.__docgenInfo={description:``,methods:[],displayName:`GlobalNavigationBar`}})),L,R,z,B,V,H,U,W,G,K,q,J;e((()=>{p(),L=t(n(),1),_(),c(),o(),S(),l(),x(),v(),I(),R=f(),{expect:z,userEvent:B,within:V}=__STORYBOOK_MODULE_TEST__,H=`mock-reviewer-token`,U=()=>{let[e,t]=(0,L.useState)(null),n=a({api:y({externalCall:h}),tokenRepository:m({setToken:t})}),o=r({authUsecase:n}),s=(0,L.useRef)(!1),{reissueToken:c}=o.useRefreshToken();return(0,L.useEffect)(()=>{s.current||(s.current=!0,c())},[c]),(0,R.jsx)(u.Provider,{value:{authQuery:o},children:(0,R.jsx)(i.Provider,{value:{token:e},children:(0,R.jsx)(C.Provider,{value:{authUsecase:n},children:(0,R.jsx)(F,{})})})})},W={title:`Common/GlobalNavigationBar`,component:U},G={name:`비로그인 — 로그인/회원가입 버튼 표시`,parameters:{msw:{handlers:[b.get(`*/api/auth/token`,()=>d.json({code:`AUTH_001`,message:`Unauthorized`},{status:401}))]}},play:async({canvasElement:e})=>{let t=V(e);await z(t.findByRole(`button`,{name:`로그인`})).resolves.toBeInTheDocument(),await z(t.findByRole(`button`,{name:`회원가입`})).resolves.toBeInTheDocument()}},K={name:`로그인 상태 — 로그아웃 버튼 표시`,parameters:{msw:{handlers:[b.get(`*/api/auth/token`,()=>d.json({accessToken:H},{status:200}))]}},play:async({canvasElement:e})=>{await z(V(e).findByRole(`button`,{name:`로그아웃`})).resolves.toBeInTheDocument()}},q={name:`로그아웃 플로우`,parameters:{msw:{handlers:[b.get(`*/api/auth/token`,()=>d.json({accessToken:H},{status:200})),b.delete(`*/api/auth/user/session`,()=>d.json(null,{status:200}))]}},play:async({canvasElement:e})=>{let t=V(e),n=await t.findByRole(`button`,{name:`로그아웃`});await B.click(n),await z(t.findByRole(`button`,{name:`로그인`})).resolves.toBeInTheDocument()}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  name: '비로그인 — 로그인/회원가입 버튼 표시',
  parameters: {
    msw: {
      handlers: [http.get('*/api/auth/token', () => HttpResponse.json({
        code: 'AUTH_001',
        message: 'Unauthorized'
      }, {
        status: 401
      }))]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.findByRole('button', {
      name: '로그인'
    })).resolves.toBeInTheDocument();
    await expect(canvas.findByRole('button', {
      name: '회원가입'
    })).resolves.toBeInTheDocument();
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  name: '로그인 상태 — 로그아웃 버튼 표시',
  parameters: {
    msw: {
      handlers: [http.get('*/api/auth/token', () => HttpResponse.json({
        accessToken: MOCK_TOKEN
      }, {
        status: 200
      }))]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.findByRole('button', {
      name: '로그아웃'
    })).resolves.toBeInTheDocument();
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  name: '로그아웃 플로우',
  parameters: {
    msw: {
      handlers: [http.get('*/api/auth/token', () => HttpResponse.json({
        accessToken: MOCK_TOKEN
      }, {
        status: 200
      })), http.delete('*/api/auth/user/session', () => HttpResponse.json(null, {
        status: 200
      }))]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const logoutButton = await canvas.findByRole('button', {
      name: '로그아웃'
    });
    await userEvent.click(logoutButton);
    await expect(canvas.findByRole('button', {
      name: '로그인'
    })).resolves.toBeInTheDocument();
  }
}`,...q.parameters?.docs?.source}}},J=[`NotLoggedIn`,`LoggedIn`,`LogoutFlow`]}))();export{K as LoggedIn,q as LogoutFlow,G as NotLoggedIn,J as __namedExportsOrder,W as default};