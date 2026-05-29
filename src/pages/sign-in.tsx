import { useRouteNavigation } from '../routes/use-route-navigation';

export const SignInPage = () => {
  const { toMain } = useRouteNavigation();

  return (
    <div>
      <p>로그인 페이지입니다.</p>
      <button onClick={toMain}>메인으로</button>
    </div>
  );
};
