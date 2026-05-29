import { Route, Routes } from 'react-router';
import { LandingPage } from '../pages/landing';
import { SignInPage } from '../pages/sign-in';
import { SignUpPage } from '../pages/sign-up';
import { PATH } from './path';

export const RouterProvider = () => {
  return (
    <Routes>
      <Route path={PATH.LANDING} element={<LandingPage />} />
      <Route path={PATH.SIGN_IN} element={<SignInPage />} />
      <Route path={PATH.SIGN_UP} element={<SignUpPage />} />
    </Routes>
  );
};
