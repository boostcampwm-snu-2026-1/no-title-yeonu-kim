import { Check, Eye, EyeOff, X } from 'lucide-react';
import { useState } from 'react';
import { useSignUp } from '@/feature/auth/application/auth-query';
import type { UserRole } from '@/feature/auth/domain/user-role';
import { authFormPresenter } from '@/feature/auth/presenter/auth-form-presenter';
import { authInputPresenter } from '@/feature/auth/presenter/auth-input-presenter';
import { useRouteNavigation } from '@/feature/shared/routes/use-route-navigation';
import { Button } from '@/widgets/common/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/widgets/common/ui/card';
import { Input } from '@/widgets/common/ui/input';
import { Label } from '@/widgets/common/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/widgets/common/ui/tabs';

export function SignUpForm() {
  const { toSignIn } = useRouteNavigation();
  const [role, setRole] = useState<UserRole>('REVIEWER');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

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

  const { signUp, isPending } = useSignUp({ setResponseMessage });

  const handleSendCode = () => {
    if (formStates.mail.isError) {
      setSubmitted(true);
      return;
    }
    setCodeSent(true);
    // TODO: API call to send verification code
  };

  const handleVerifyCode = () => {
    if (code.isError) {
      return;
    }
    emailVerifySuccessCode.onChange(code.value);
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

  return (
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
                    setCodeSent(false);
                    emailVerifySuccessCode.onChange('');
                  }}
                  aria-invalid={submitted && mail.isError}
                  autoComplete="email"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendCode}
                  className="shrink-0 px-3 text-xs"
                >
                  {codeSent ? '재발송' : '인증 코드 발송'}
                </Button>
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
                <Label htmlFor="verification-code">인증 코드</Label>
                <div className="flex gap-2">
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="6자리 숫자를 입력하세요"
                    value={code.value}
                    onChange={(e) => code.onChange(e.target.value)}
                    aria-invalid={submitted && code.isError}
                    maxLength={6}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVerifyCode}
                    className="shrink-0 px-3 text-xs"
                  >
                    인증 확인
                  </Button>
                </div>
                {submitted && code.isError && (
                  <p className="text-destructive text-xs">
                    6자리 숫자 인증 코드를 입력해 주세요.
                  </p>
                )}
              </div>
            )}

            {/* 비밀번호 */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signup-password">비밀번호</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력하세요"
                  value={password.value}
                  onChange={(e) => password.onChange(e.target.value)}
                  aria-invalid={submitted && password.isError}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
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
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 다시 입력하세요"
                  value={passwordConfirm.value}
                  onChange={(e) => passwordConfirm.onChange(e.target.value)}
                  aria-invalid={submitted && passwordConfirm.isError}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {submitted && passwordConfirm.isError && (
                <p className="text-destructive text-xs">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>

            {responseMessage && (
              <p className="text-center text-destructive text-sm">
                {responseMessage}
              </p>
            )}

            <Button className="mt-1 w-full" disabled={isPending} type="submit">
              {isPending ? '가입 중입니다...' : '회원가입'}
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
  );
}

type RequirementItemProps = {
  label: string;
  met: boolean;
};

function RequirementItem({ label, met }: RequirementItemProps) {
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
}
