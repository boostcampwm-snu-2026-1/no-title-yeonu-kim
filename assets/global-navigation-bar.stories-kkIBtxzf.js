import{i as e,s as t}from"./preload-helper-B-rJVKt8.js";import{N as n,S as r,_ as i,a,b as o,d as s,f as c,g as l,h as u,i as d,j as f,k as p,l as m,m as h,n as g,o as _,p as v,s as y,t as b,v as x,x as S,y as C}from"./iframe-Blc3RJWa.js";import{S as w,_ as T,g as E,h as D,m as O,n as k,p as A,t as j,v as M}from"./button-Dr2mjWNP.js";var N,P,F,I=e((()=>{T(),N=t(n(),1),l(),h(),D(),S(),O(),k(),P=f(),F=()=>{let{token:e}=E(v),{authQuery:t}=E(u),{logout:n}=t.useLogout(),{toMain:i,toSignIn:a,toSignUp:o}=r(),[s,c]=(0,N.useState)(!1),l=()=>{e!==null&&n({token:e})},d=()=>c(!1);return(0,P.jsx)(`header`,{className:`sticky top-0 z-50 flex w-full justify-center bg-white shadow-md`,children:(0,P.jsxs)(`div`,{className:`flex w-full items-center justify-between px-6 py-4`,children:[(0,P.jsx)(`h1`,{onClick:i,className:`cursor-pointer font-bold text-gray-800 text-xl transition-colors duration-150 hover:text-blue-600`,children:`VLSI`}),(0,P.jsx)(`div`,{className:`hidden items-center gap-5 sm:flex`,children:e===null?(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(j,{onClick:o,variant:`ghost`,children:`회원가입`}),(0,P.jsx)(j,{onClick:a,variant:`ghost`,children:`로그인`})]}):(0,P.jsx)(j,{onClick:l,variant:`ghost`,children:`로그아웃`})}),(0,P.jsxs)(`div`,{className:`flex sm:hidden`,children:[(0,P.jsx)(j,{variant:`ghost`,size:`icon`,onClick:()=>c(e=>!e),children:(0,P.jsx)(w,{})}),s&&(0,P.jsx)(`div`,{className:`fixed inset-0 z-40 bg-black/30 sm:hidden`,onClick:d}),(0,P.jsxs)(`div`,{className:A(`fixed top-0 right-0 z-50 h-full w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out sm:hidden`,s?`translate-x-0`:`translate-x-full`),children:[(0,P.jsx)(`div`,{className:`flex justify-start px-2 py-4`,children:(0,P.jsx)(j,{variant:`ghost`,size:`icon`,onClick:d,children:(0,P.jsx)(M,{})})}),(0,P.jsx)(`div`,{className:`flex flex-col space-y-6 px-6`,children:e===null?(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(j,{onClick:()=>{o(),d()},variant:`ghost`,className:`justify-between`,children:`회원가입`}),(0,P.jsx)(j,{onClick:()=>{a(),d()},variant:`ghost`,className:`justify-between`,children:`로그인`})]}):(0,P.jsx)(j,{onClick:()=>{l(),d()},variant:`ghost`,className:`justify-between`,children:`로그아웃`})})]})]})]})})},F.__docgenInfo={description:``,methods:[],displayName:`GlobalNavigationBar`}})),L,R,z,B,V,H,U,W,G,K,q,J;e((()=>{b(),L=t(n(),1),C(),x(),l(),h(),c(),_(),a(),I(),R=f(),{expect:z,userEvent:B,within:V}=__STORYBOOK_MODULE_TEST__,H=`mock-reviewer-token`,U=()=>{let[e,t]=(0,L.useState)(null),n=i({api:m({externalCall:y}),tokenRepository:d({setToken:t})}),r=o({authUsecase:n}),a=(0,L.useRef)(!1),{reissueToken:c}=r.useRefreshToken();return(0,L.useEffect)(()=>{a.current||(a.current=!0,c())},[c]),(0,R.jsx)(u.Provider,{value:{authQuery:r},children:(0,R.jsx)(v.Provider,{value:{token:e},children:(0,R.jsx)(s.Provider,{value:{authUsecase:n},children:(0,R.jsx)(F,{})})})})},W={title:`Common/GlobalNavigationBar`,component:U},G={name:`비로그인 — 로그인/회원가입 버튼 표시`,parameters:{msw:{handlers:[g.get(`*/api/auth/token`,()=>p.json({code:`AUTH_001`,message:`Unauthorized`},{status:401}))]}},play:async({canvasElement:e})=>{let t=V(e);await z(t.findByRole(`button`,{name:`로그인`})).resolves.toBeInTheDocument(),await z(t.findByRole(`button`,{name:`회원가입`})).resolves.toBeInTheDocument()}},K={name:`로그인 상태 — 로그아웃 버튼 표시`,parameters:{msw:{handlers:[g.get(`*/api/auth/token`,()=>p.json({accessToken:H},{status:200}))]}},play:async({canvasElement:e})=>{await z(V(e).findByRole(`button`,{name:`로그아웃`})).resolves.toBeInTheDocument()}},q={name:`로그아웃 플로우`,parameters:{msw:{handlers:[g.get(`*/api/auth/token`,()=>p.json({accessToken:H},{status:200})),g.delete(`*/api/auth/user/session`,()=>p.json(null,{status:200}))]}},play:async({canvasElement:e})=>{let t=V(e),n=await t.findByRole(`button`,{name:`로그아웃`});await B.click(n),await z(t.findByRole(`button`,{name:`로그인`})).resolves.toBeInTheDocument()}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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