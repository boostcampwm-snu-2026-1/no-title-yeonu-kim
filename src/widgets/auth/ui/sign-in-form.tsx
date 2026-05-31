import { useState } from 'react';
import type { UserRole } from '@/feature/auth/domain/user-role';
import { authFormPresenter } from '@/feature/auth/presenter/auth-form-presenter';
import { authInputPresenter } from '@/feature/auth/presenter/auth-input-presenter';
import { QueryContext } from '@/feature/shared/context/query-context';
import { useGuardContext } from '@/feature/shared/context/use-gaurd-context';
import { useRouteNavigation } from '@/feature/shared/routes/use-route-navigation';
import { PasswordInput } from '@/widgets/auth/ui/password-input';
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

export const SignInForm = () => {
  const [role, setRole] = useState<UserRole>('REVIEWER');
  const [submitted, setSubmitted] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const { toSignUp } = useRouteNavigation();

  const { inputStates, formStates } = authFormPresenter.useValidator({
    authInputPresenter,
  });
  const { mail, password } = inputStates;

  const { authQuery } = useGuardContext(QueryContext);
  const { useSignIn } = authQuery;
  const { signIn, isPending } = useSignIn({ setResponseMessage });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (formStates.mail.isError || password.isError) {
      return;
    }
    signIn({ role, mail: mail.value, password: password.value });
  };

  return (
    <Card className="w-full max-w-sm shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-center font-semibold text-xl">
          로그인
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
            {/* 이메일 */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signin-email">이메일</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={mail.value}
                onChange={(e) => mail.onChange(e.target.value)}
                aria-invalid={submitted && mail.isError}
                autoComplete="email"
              />
              {submitted && formStates.mail.isError && (
                <p className="text-destructive text-xs">
                  올바른 이메일을 입력해 주세요.
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signin-password">비밀번호</Label>
              <PasswordInput
                id="signin-password"
                placeholder="비밀번호를 입력하세요"
                value={password.value}
                onChange={password.onChange}
                aria-invalid={submitted && password.isError}
                autoComplete="current-password"
              />
              {submitted && password.isError && (
                <p className="text-destructive text-xs">
                  비밀번호를 입력해 주세요.
                </p>
              )}
            </div>

            {responseMessage && (
              <p className="text-center text-destructive text-sm">
                {responseMessage}
              </p>
            )}

            <Button className="mt-1 w-full" disabled={isPending} type="submit">
              {isPending ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm">
            계정이 없으신가요?{' '}
            <button
              type="button"
              onClick={toSignUp}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              회원가입하기
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
