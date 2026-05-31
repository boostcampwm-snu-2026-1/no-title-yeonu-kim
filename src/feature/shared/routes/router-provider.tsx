import { Route, Routes } from 'react-router';
import { ReissueToken } from '@/widgets/auth/ui/reissue-token';
import { LandingPage } from '../../../pages/landing';
import { SignInPage } from '../../../pages/sign-in';
import { SignUpPage } from '../../../pages/sign-up';
import { PATH } from './path';

export const RouterProvider = () => {
  return (
    <Routes>
      <Route path={PATH.SIGN_IN} element={<SignInPage />} />
      <Route path={PATH.SIGN_UP} element={<SignUpPage />} />
      <Route element={<ReissueToken />}>
        <Route path={PATH.LANDING} element={<LandingPage />} />
      </Route>
    </Routes>
  );
};
