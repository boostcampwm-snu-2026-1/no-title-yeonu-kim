import { Route, Routes } from 'react-router';
import { LandingPage } from '../pages/landing';
import { SignInPage } from '../pages/sign-in';
import { SignUpPage } from '../pages/sign-up';

export const RouterProvider = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
    </Routes>
  );
};
