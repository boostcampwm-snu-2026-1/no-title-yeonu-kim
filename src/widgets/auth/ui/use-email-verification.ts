import { useEffect, useReducer, useState } from 'react';
import { QueryContext } from '@/feature/shared/context/query-context';
import { useGuardContext } from '@/feature/shared/context/use-gaurd-context';

const RESEND_COOLDOWN_SEC = 30;
const CODE_EXPIRY_SEC = 300;

export const formatTimer = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

type EmailVerificationState = {
  codeSent: boolean;
  resendCooldown: number;
  expirySeconds: number;
  responseMessage: string;
};

type EmailVerificationAction =
  | { type: 'SEND_CODE'; expirySeconds: number; resendCooldown: number }
  | { type: 'TICK_RESEND' }
  | { type: 'TICK_EXPIRY' }
  | { type: 'SET_RESPONSE_MESSAGE'; message: string }
  | { type: 'RESET' };

const initialState: EmailVerificationState = {
  codeSent: false,
  resendCooldown: 0,
  expirySeconds: 0,
  responseMessage: '',
};

const emailVerificationReducer = (
  state: EmailVerificationState,
  action: EmailVerificationAction
): EmailVerificationState => {
  switch (action.type) {
    case 'SEND_CODE':
      return {
        codeSent: true,
        resendCooldown: action.resendCooldown,
        expirySeconds: action.expirySeconds,
        responseMessage: '',
      };
    case 'TICK_RESEND':
      return {
        ...state,
        resendCooldown: Math.max(0, state.resendCooldown - 1),
      };
    case 'TICK_EXPIRY': {
      const next = Math.max(0, state.expirySeconds - 1);
      const expired = next === 0 && state.codeSent;
      return {
        ...state,
        expirySeconds: next,
        ...(expired && {
          codeSent: false,
          responseMessage:
            '인증 코드가 만료되었습니다. 인증 이메일을 다시 발송해 주세요.',
        }),
      };
    }
    case 'SET_RESPONSE_MESSAGE':
      return { ...state, responseMessage: action.message };
    case 'RESET':
      return initialState;
  }
};

export const useEmailVerification = ({
  onVerified,
}: {
  onVerified: (token: string) => void;
}) => {
  const [state, dispatch] = useReducer(emailVerificationReducer, initialState);
  const [codeError, setCodeError] = useState('');

  const { authQuery } = useGuardContext(QueryContext);
  const { useSendVerificationEmail, useValidateEmailCode } = authQuery;

  useEffect(() => {
    if (state.resendCooldown <= 0) {
      return;
    }
    const t = setTimeout(() => dispatch({ type: 'TICK_RESEND' }), 1000);
    return () => clearTimeout(t);
  }, [state.resendCooldown]);

  useEffect(() => {
    if (state.expirySeconds <= 0) {
      return;
    }
    const t = setTimeout(() => dispatch({ type: 'TICK_EXPIRY' }), 1000);
    return () => clearTimeout(t);
  }, [state.expirySeconds]);

  const { sendVerificationEmail, isPending: isSendingEmail } =
    useSendVerificationEmail({
      onSuccess: () => {
        dispatch({
          type: 'SEND_CODE',
          expirySeconds: CODE_EXPIRY_SEC,
          resendCooldown: RESEND_COOLDOWN_SEC,
        });
        setCodeError('');
      },
      setResponseMessage: (message) =>
        dispatch({ type: 'SET_RESPONSE_MESSAGE', message }),
    });

  const { validateEmailCode, isPending: isValidatingCode } =
    useValidateEmailCode({
      onSuccess: (token) => {
        onVerified(token);
        dispatch({ type: 'RESET' });
        setCodeError('');
      },
      setCodeError,
    });

  return {
    codeSent: state.codeSent,
    expirySeconds: state.expirySeconds,
    resendCooldown: state.resendCooldown,
    responseMessage: state.responseMessage,
    codeError,
    setCodeError,
    isSendingEmail,
    isValidatingCode,
    sendCode: (email: string) => sendVerificationEmail({ email }),
    verifyCode: (email: string, code: string) =>
      validateEmailCode({ email, code }),
    resetVerification: () => dispatch({ type: 'RESET' }),
  };
};
