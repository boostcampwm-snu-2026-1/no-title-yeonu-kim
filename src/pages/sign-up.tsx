import { useRouteNavigation } from '../routes/use-route-navigation';

export const SignUpPage = () => {
  const { toMain } = useRouteNavigation();

  return (
    <div>
      <p>회원가입 페이지입니다.</p>
      <button onClick={toMain}>메인으로</button>
    </div>
  );
};
