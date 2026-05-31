import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import { useEffect, useRef, useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';

import { useAuthQuery } from '@/feature/auth/application/auth-query';
import { implAuthUsecase } from '@/feature/auth/usecase/auth-usecase';
import { QueryContext } from '@/feature/shared/context/query-context';
import { TokenContext } from '@/feature/shared/context/token-context';
import { UsecaseContext } from '@/feature/shared/context/usecase-context';
import { externalCall, implApi } from '@/infrastructure/api';
import { implTokenRepository } from '@/infrastructure/token/token-repository';
import { GlobalNavigationBar } from '@/widgets/common/ui/global-navigation-bar';

const MOCK_TOKEN = 'mock-reviewer-token';

/**
 * 랜딩 진입 시 refresh token을 자동 시도한 뒤 GNB를 렌더하는 래퍼.
 * ReissueToken 컴포넌트의 동작을 인라인으로 재현한다.
 */
const GnbWrapper = () => {
  const [token, setToken] = useState<string | null>(null);

  const api = implApi({ externalCall });
  const tokenRepository = implTokenRepository({ setToken });
  const authUsecase = implAuthUsecase({ api, tokenRepository });
  const authQuery = useAuthQuery({ authUsecase });

  const hasReissued = useRef(false);
  const { reissueToken } = authQuery.useRefreshToken();

  useEffect(() => {
    if (!hasReissued.current) {
      hasReissued.current = true;
      reissueToken();
    }
  }, [reissueToken]);

  return (
    <QueryContext.Provider value={{ authQuery }}>
      <TokenContext.Provider value={{ token }}>
        <UsecaseContext.Provider value={{ authUsecase }}>
          <GlobalNavigationBar />
        </UsecaseContext.Provider>
      </TokenContext.Provider>
    </QueryContext.Provider>
  );
};

const meta: Meta<typeof GnbWrapper> = {
  title: 'Common/GlobalNavigationBar',
  component: GnbWrapper,
};

export default meta;
type Story = StoryObj<typeof GnbWrapper>;

export const NotLoggedIn: Story = {
  name: '비로그인 — 로그인/회원가입 버튼 표시',
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/token', () =>
          HttpResponse.json(
            { code: 'AUTH_001', message: 'Unauthorized' },
            { status: 401 }
          )
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.findByRole('button', { name: '로그인' })
    ).resolves.toBeInTheDocument();
    await expect(
      canvas.findByRole('button', { name: '회원가입' })
    ).resolves.toBeInTheDocument();
  },
};

export const LoggedIn: Story = {
  name: '로그인 상태 — 로그아웃 버튼 표시',
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/token', () =>
          HttpResponse.json({ accessToken: MOCK_TOKEN }, { status: 200 })
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.findByRole('button', { name: '로그아웃' })
    ).resolves.toBeInTheDocument();
  },
};

export const LogoutFlow: Story = {
  name: '로그아웃 플로우',
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/token', () =>
          HttpResponse.json({ accessToken: MOCK_TOKEN }, { status: 200 })
        ),
        http.delete('*/api/auth/user/session', () =>
          HttpResponse.json(null, { status: 200 })
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const logoutButton = await canvas.findByRole('button', { name: '로그아웃' });
    await userEvent.click(logoutButton);

    await expect(
      canvas.findByRole('button', { name: '로그인' })
    ).resolves.toBeInTheDocument();
  },
};
