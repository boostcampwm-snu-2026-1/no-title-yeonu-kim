import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import { QueryContext } from '@/feature/shared/context/query-context';
import { TokenContext } from '@/feature/shared/context/token-context';
import { useGuardContext } from '@/feature/shared/context/use-gaurd-context';
import { useRouteNavigation } from '@/feature/shared/routes/use-route-navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/widgets/common/ui/button';

export const GlobalNavigationBar = () => {
  const { token } = useGuardContext(TokenContext);
  const { authQuery } = useGuardContext(QueryContext);
  const { logout } = authQuery.useLogout();
  const { toMain, toSignIn, toSignUp } = useRouteNavigation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    if (token !== null) {
      logout({ token });
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 flex w-full justify-center bg-white shadow-md">
      <div className="flex w-full items-center justify-between px-6 py-4">
        <h1
          onClick={toMain}
          className="cursor-pointer font-bold text-gray-800 text-xl transition-colors duration-150 hover:text-blue-600"
        >
          VLSI
        </h1>

        {/* Desktop nav */}
        <div className="hidden items-center gap-5 sm:flex">
          {token === null ? (
            <>
              <Button onClick={toSignUp} variant="ghost">
                회원가입
              </Button>
              <Button onClick={toSignIn} variant="ghost">
                로그인
              </Button>
            </>
          ) : (
            <Button onClick={handleLogout} variant="ghost">
              로그아웃
            </Button>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex sm:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <Menu />
          </Button>

          {menuOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/30 sm:hidden"
              onClick={closeMenu}
            />
          )}

          <div
            className={cn(
              'fixed top-0 right-0 z-50 h-full w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out sm:hidden',
              menuOpen ? 'translate-x-0' : 'translate-x-full'
            )}
          >
            <div className="flex justify-start px-2 py-4">
              <Button variant="ghost" size="icon" onClick={closeMenu}>
                <X />
              </Button>
            </div>
            <div className="flex flex-col space-y-6 px-6">
              {token === null ? (
                <>
                  <Button
                    onClick={() => {
                      toSignUp();
                      closeMenu();
                    }}
                    variant="ghost"
                    className="justify-between"
                  >
                    회원가입
                  </Button>
                  <Button
                    onClick={() => {
                      toSignIn();
                      closeMenu();
                    }}
                    variant="ghost"
                    className="justify-between"
                  >
                    로그인
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  variant="ghost"
                  className="justify-between"
                >
                  로그아웃
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
