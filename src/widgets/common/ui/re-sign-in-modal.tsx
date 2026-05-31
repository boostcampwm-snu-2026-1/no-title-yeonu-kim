import { createPortal } from 'react-dom';
import { useRouteNavigation } from '@/feature/shared/routes/use-route-navigation';
import { Button } from './button';

export function ReSignInModal() {
  const { toSignIn } = useRouteNavigation();

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm rounded-xl border bg-background p-6 shadow-lg">
        <h2 className="mb-2 font-semibold text-base">세션이 만료되었습니다</h2>
        <p className="mb-6 text-muted-foreground text-sm">
          로그인 세션이 만료되었습니다. 다시 로그인해 주세요.
        </p>
        <div className="flex justify-end">
          <Button size="sm" onClick={toSignIn}>
            로그인하기
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
