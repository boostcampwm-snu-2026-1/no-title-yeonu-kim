import { useNavigate } from 'react-router';
import { PATH } from './path';

export const useRouteNavigation = () => {
  const navigate = useNavigate();
  const { LANDING, SIGN_IN, SIGN_UP, SIGN_UP_COMPLETE } = PATH;

  return {
    toMain: () => {
      void navigate(LANDING);
    },
    toSignIn: () => {
      void navigate(SIGN_IN);
    },
    toSignUp: () => {
      void navigate(SIGN_UP);
    },
    toSignUpComplete: () => {
      void navigate(SIGN_UP_COMPLETE);
    },
    toBack: () => {
      void navigate(-1);
    },
    refreshPage: () => {
      void navigate(0);
    },
  };
};
