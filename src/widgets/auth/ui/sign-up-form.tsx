import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { useSignUp } from '@/feature/auth/application/auth-query';
import type { UserRole } from '@/feature/auth/domain/user-role';
import { authFormPresenter } from '@/feature/auth/presenter/auth-form-presenter';
import { authInputPresenter } from '@/feature/auth/presenter/auth-input-presenter';
import { useRouteNavigation } from '@/feature/shared/routes/use-route-navigation';
import { PasswordInput } from '@/widgets/auth/ui/password-input';
import {
  formatTimer,
  useEmailVerification,
} from '@/widgets/auth/ui/use-email-verification';
import { Button } from '@/widgets/common/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/widgets/common/ui/card';
import { Dialog } from '@/widgets/common/ui/dialog';
import { Input } from '@/widgets/common/ui/input';
import { Label } from '@/widgets/common/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/widgets/common/ui/tabs';

export function SignUpForm() {
  const { toSignIn } = useRouteNavigation();
  const [role, setRole] = useState<UserRole>('REVIEWER');
  const [submitted, setSubmitted] = useState(false);
  const [signUpMessage, setSignUpMessage] = useState('');
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const { inputStates, formStates } = authFormPresenter.useValidator({
    authInputPresenter,
  });
  const {
    mail,
    username,
    password,
    passwordConfirm,
    code,
    emailVerifySuccessCode,
  } = inputStates;
  const isEmailVerified = !formStates.emailVerifySuccessCode.isError;

  const {
    codeSent,
    expirySeconds,
    resendCooldown,
    codeError,
    setCodeError,
    isSendingEmail,
    isValidatingCode,
    responseMessage: verificationMessage,
    sendCode,
    verifyCode,
    resetVerification,
  } = useEmailVerification({
    onVerified: (token) => emailVerifySuccessCode.onChange(token),
  });

  const { signUp, isPending: isSigningUp } = useSignUp({
    setResponseMessage: setSignUpMessage,
    onDuplicateEmail: () => setShowDuplicateModal(true),
  });

  const isPending = isSendingEmail || isValidatingCode || isSigningUp;

  const handleSendCode = () => {
    if (formStates.mail.isError) {
      setSubmitted(true);
      return;
    }
    emailVerifySuccessCode.onChange('');
    sendCode(mail.value);
  };

  const handleVerifyCode = () => {
    if (code.isError) {
      setCodeError('6자리 숫자 인증 코드를 입력해 주세요.');
      return;
    }
    verifyCode(mail.value, code.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (
      username.isError ||
      mail.isError ||
      password.isError ||
      passwordConfirm.isError
    ) {
      return;
    }
    signUp({
      role,
      username: username.value,
      email: mail.value,
      password: password.value,
    });
  };

  const { detailedError } = password;
  const showPasswordRequirements = password.value.length > 0;

  const getSendCodeButtonLabel = (
    isSendingEmail: boolean,
    codeSent: boolean,
    resendCooldown: number
  ): string => {
    if (isSendingEmail) {
      return '발송 중...';
    }
    if (!codeSent) {
      return '인증 코드 발송';
    }
    return resendCooldown > 0 ? `재발송 (${resendCooldown}s)` : '재발송';
  };

  return (
    <>
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-center font-semibold text-xl">
            회원가입
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <TabsList className="w-full">
                <TabsTrigger value="REVIEWER" className="flex-1">
                  손님
                </TabsTrigger>
                <TabsTrigger value="OWNER" className="flex-1">
                  사장님
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* 실명 */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signup-username">실명</Label>
                <Input
                  id="signup-username"
                  type="text"
                  placeholder="실명을 입력하세요"
                  value={username.value}
                  onChange={(e) => username.onChange(e.target.value)}
                  aria-invalid={submitted && username.isError}
                  autoComplete="name"
                />
                {submitted && username.isError && (
                  <p className="text-destructive text-xs">
                    한글 2~6자 또는 영문 2~20자로 입력해 주세요.
                  </p>
                )}
              </div>

              {/* 이메일 + 인증 코드 발송 */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signup-email">이메일</Label>
                <div className="flex gap-2">
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={mail.value}
                    onChange={(e) => {
                      mail.onChange(e.target.value);
                      emailVerifySuccessCode.onChange('');
                      resetVerification();
                    }}
                    aria-invalid={submitted && mail.isError}
                    autoComplete="email"
                    className="flex-1"
                  />
                  {!isEmailVerified && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSendCode}
                      disabled={isPending || resendCooldown > 0}
                      className="shrink-0 px-3 text-xs"
                    >
                      {getSendCodeButtonLabel(
                        isSendingEmail,
                        codeSent,
                        resendCooldown
                      )}
                    </Button>
                  )}
                </div>
                {submitted && formStates.mail.isError && (
                  <p className="text-destructive text-xs">
                    올바른 이메일을 입력해 주세요.
                  </p>
                )}
                {isEmailVerified && (
                  <p className="flex items-center gap-1 text-green-600 text-xs">
                    <Check className="size-3" />
                    이메일 인증이 완료되었습니다.
                  </p>
                )}
              </div>

              {/* 인증 코드 입력 (발송 후, 미인증 시) */}
              {codeSent && !isEmailVerified && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="verification-code">인증 코드</Label>
                    {expirySeconds > 0 && (
                      <span className="text-muted-foreground text-xs tabular-nums">
                        {formatTimer(expirySeconds)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="verification-code"
                      type="text"
                      placeholder="6자리 숫자를 입력하세요"
                      value={code.value}
                      onChange={(e) => {
                        code.onChange(e.target.value);
                        setCodeError('');
                      }}
                      maxLength={6}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleVerifyCode}
                      disabled={isPending}
                      className="shrink-0 px-3 text-xs"
                    >
                      {isValidatingCode ? '확인 중...' : '인증 확인'}
                    </Button>
                  </div>
                  {codeError && (
                    <p className="text-destructive text-xs">{codeError}</p>
                  )}
                </div>
              )}

              {/* 비밀번호 */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signup-password">비밀번호</Label>
                <PasswordInput
                  id="signup-password"
                  placeholder="비밀번호를 입력하세요"
                  value={password.value}
                  onChange={password.onChange}
                  aria-invalid={submitted && password.isError}
                  autoComplete="new-password"
                />
                {submitted && password.isError && (
                  <p className="text-destructive text-xs">
                    비밀번호 필수 조건을 만족해 주세요.
                  </p>
                )}

                {/* 비밀번호 요구사항 */}
                {showPasswordRequirements && (
                  <div className="mt-1 flex flex-col gap-2 rounded-lg border bg-muted/40 p-3">
                    <div className="flex flex-col gap-1">
                      <p className="mb-0.5 font-medium text-foreground/70 text-xs">
                        필수 조건
                      </p>
                      <RequirementItem
                        label="8자리 이상, 64자리 이하"
                        met={!detailedError.lengthError}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="mb-0.5 font-medium text-foreground/70 text-xs">
                        권고 조건
                      </p>
                      <RequirementItem
                        label="숫자 포함"
                        met={!detailedError.numberError}
                      />
                      <RequirementItem
                        label="영문 대소문자 포함"
                        met={!detailedError.englishError}
                      />
                      <RequirementItem
                        label="특수문자 포함"
                        met={!detailedError.specialCharError}
                      />
                      <RequirementItem
                        label="연속된 문자열이나 숫자 없음"
                        met={!detailedError.patternError}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirm-password">비밀번호 확인</Label>
                <PasswordInput
                  id="confirm-password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={passwordConfirm.value}
                  onChange={passwordConfirm.onChange}
                  aria-invalid={submitted && passwordConfirm.isError}
                  autoComplete="new-password"
                />
                {submitted && passwordConfirm.isError && (
                  <p className="text-destructive text-xs">
                    비밀번호가 일치하지 않습니다.
                  </p>
                )}
              </div>

              {(verificationMessage || signUpMessage) && (
                <p className="text-center text-destructive text-sm">
                  {verificationMessage || signUpMessage}
                </p>
              )}

              <Button
                className="mt-1 w-full"
                disabled={isPending}
                type="submit"
              >
                {isSigningUp ? '가입 중입니다...' : '회원가입'}
              </Button>
            </form>

            <p className="text-center text-muted-foreground text-sm">
              이미 계정이 있으신가요?{' '}
              <button
                type="button"
                onClick={toSignIn}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                로그인하기
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={showDuplicateModal}
        title="이미 가입된 이메일입니다"
        description="입력하신 이메일로 이미 가입된 계정이 존재합니다. 로그인 페이지로 이동하시겠습니까?"
        confirmLabel="로그인하기"
        cancelLabel="취소"
        onConfirm={toSignIn}
        onCancel={() => setShowDuplicateModal(false)}
      />
    </>
  );
}

const RequirementItem = ({ label, met }: { label: string; met: boolean }) => {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
      {met ? (
        <Check className="size-3 shrink-0 text-foreground/50" />
      ) : (
        <X className="size-3 shrink-0" />
      )}
      <span>{label}</span>
    </div>
  );
};
