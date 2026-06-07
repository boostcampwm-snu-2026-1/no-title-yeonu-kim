import { Route, Routes } from 'react-router';
import { ProtectedRoute } from '@/widgets/auth/ui/protected-route';
import { ReissueToken } from '@/widgets/auth/ui/reissue-token';
import { GlobalNavigationBar } from '@/widgets/common/ui/global-navigation-bar';
import { LandingPage } from '../../../pages/landing';
import { MyPage } from '../../../pages/my-page';
import { SignInPage } from '../../../pages/sign-in';
import { SignUpPage } from '../../../pages/sign-up';
import { SubmitPage } from '../../../pages/submit';
import { PATH } from './path';

export const RouterProvider = () => {
  return (
    <>
      <GlobalNavigationBar />
      <Routes>
        <Route path={PATH.SIGN_IN} element={<SignInPage />} />
        <Route path={PATH.SIGN_UP} element={<SignUpPage />} />
        <Route path={PATH.SUBMIT} element={<SubmitPage />} />
        <Route element={<ReissueToken />}>
          <Route path={PATH.LANDING} element={<LandingPage />} />
          <Route element={<ProtectedRoute role="SIGN_IN" />}>
            <Route path={'/test'} element={<MyPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};
