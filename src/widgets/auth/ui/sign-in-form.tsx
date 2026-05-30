import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { authFormPresentation } from '@/feature/auth/presenter/authFormPresentation';
import { authInputPresentation } from '@/feature/auth/presenter/authInputPresentation';
import { useRouteNavigation } from '@/routes/use-route-navigation';
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

type Role = 'OWNER' | 'REVIEWER';

export function SignInForm() {
  const { toSignUp } = useRouteNavigation();
  const [role, setRole] = useState<Role>('REVIEWER');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { inputStates, formStates } = authFormPresentation.useValidator({
    authInputPresentation,
  });

  const { mail, password } = inputStates;

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError('');
    if (formStates.mail.isError || password.isError) {
      return;
    }
    setIsLoading(true);
    // TODO: call signIn usecase
    setIsLoading(false);
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
          <Tabs value={role} onValueChange={(v) => setRole(v as Role)}>
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
              <div className="relative">
                <Input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력하세요"
                  value={password.value}
                  onChange={(e) => password.onChange(e.target.value)}
                  aria-invalid={submitted && password.isError}
                  autoComplete="current-password"
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
                  비밀번호를 입력해 주세요.
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-center text-destructive text-sm">
                {serverError}
              </p>
            )}

            <Button className="mt-1 w-full" disabled={isLoading} type="submit">
              {isLoading ? '로그인 중...' : '로그인'}
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
}
