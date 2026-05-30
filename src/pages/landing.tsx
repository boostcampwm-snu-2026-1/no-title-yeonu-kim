import { useRouteNavigation } from '../feature/shared/routes/use-route-navigation';

export const LandingPage = () => {
  const { toSignIn, toSignUp } = useRouteNavigation();

  return (
    <div>
      <p>랜딩 페이지입니다.</p>
      <button onClick={toSignIn}>로그인</button>
      <button onClick={toSignUp}>회원가입</button>
    </div>
  );
};
