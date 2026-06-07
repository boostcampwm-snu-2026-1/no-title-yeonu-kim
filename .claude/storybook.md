# Storybook MSW 케이스 작성 가이드

컴포넌트의 API 연동 시나리오를 Storybook에서 시각적으로 검증할 수 있도록,
MSW resolver에 정의된 성공/실패 케이스를 스토리로 변환한다.

---

## 프로젝트 구조

```
src/
├── mocks/
│   ├── handlers.ts               # 전체 핸들러 집계
│   ├── utils.ts                  # getRole(), 특수 트리거 상수
│   └── [domain]/
│       ├── handler.ts            # http.method('*/api/...', resolver) 목록
│       ├── resolvers.ts          # 실제 응답 로직 (성공/실패 분기)
│       └── data.ts               # 목 데이터
└── stories/
    └── *.stories.tsx
```

**MSW 전역 설정 (`.storybook/preview.tsx`)**
- `initialize({ onUnhandledRequest: 'bypass' })`로 초기화
- `parameters.msw.handlers`에 전체 핸들러 등록 → 모든 스토리의 기본값
- 개별 스토리에서 `parameters.msw.handlers`를 선언하면 해당 엔드포인트만 덮어씀

---

## 작업 순서

### 1단계: 대상 파악

사용자가 컴포넌트를 명시하면 아래를 순서대로 읽는다.

```
1. src/stories/[컴포넌트명].stories.tsx   → 기존 스토리 파악 (중복 방지)
2. src/mocks/[domain]/resolvers.ts        → 성공/실패 케이스 추출
3. src/mocks/[domain]/handler.ts          → 엔드포인트 URL 패턴 확인
4. src/mocks/utils.ts                     → 트리거 상수 확인
```

도메인이 불분명하면 컴포넌트가 호출하는 API URL로 역추적한다.

### 2단계: 케이스 목록 추출

`resolvers.ts`에서 분기를 분석해 케이스를 정리한다.

트리거 유형:
- **입력값 기반**: 특정 이메일(`duplicate@example.com`), 특정 코드(`000000`), 특정 ID
- **헤더 기반**: `Authorization: Bearer mock-owner-token` → OWNER, `Bearer mock-reviewer-token` → REVIEWER
- **상수 기반**: `src/mocks/utils.ts`의 `CLOSED_EVENT_ID`, `ALREADY_APPLIED_EVENT_ID`, `INSUFFICIENT_DEPOSIT_REWARD` 등
- **필드 누락**: 필수 필드 없을 때 400 GEN_004

### 3단계: 스토리 작성

#### 성공 케이스 — 전역 핸들러 사용
`parameters.msw` 없이 작성. 글로벌 핸들러가 정상 응답을 반환한다.

```tsx
export const Success: Story = {
  name: '200 성공 설명',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('필드명'), '정상값');
    await userEvent.click(canvas.getByRole('button', { name: '버튼명' }));
    await expect(canvas.findByText('성공 메시지')).resolves.toBeInTheDocument();
  },
};
```

#### API 에러 케이스 — 핸들러 오버라이드
`parameters.msw.handlers`로 해당 엔드포인트를 덮어쓴다.
오버라이드하지 않은 엔드포인트는 전역 핸들러가 그대로 처리한다.

```tsx
export const ErrorSomething: Story = {
  name: '4xx 에러 설명',
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/path', () =>
          HttpResponse.json(
            { code: 'DOMAIN_001', message: 'Error message' },
            { status: 400 }
          )
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '버튼명' }));
    await expect(canvas.findByText('UI에 표시되는 에러 메시지')).resolves.toBeInTheDocument();
  },
};
```

#### 클라이언트 유효성 검사 케이스
MSW 오버라이드 없이 작성. 빈 폼 제출 또는 잘못된 형식 입력 후 검증한다.

```tsx
export const ClientValidationError: Story = {
  name: '400 빈 폼 제출 (클라이언트 유효성)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '제출' }));
    await expect(canvas.findByText('유효성 메시지')).resolves.toBeInTheDocument();
  },
};
```

#### Portal로 렌더링되는 모달 검증
`canvas.findByText` 대신 `screen.findByText`를 사용한다.

```tsx
import { screen } from 'storybook/test';

await expect(screen.findByText('모달 텍스트')).resolves.toBeInTheDocument();
```

---

## 파일 구조 템플릿

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import { expect, screen, userEvent, within } from 'storybook/test';
import { ComponentName } from '@/path/to/component';

// 반복 사용되는 입력값은 상수로 추출
const VALID_EMAIL = 'test@example.com';

// 여러 스토리에서 반복되는 인터랙션은 helper 함수로 추출
const fillForm = async (canvas: ReturnType<typeof within>, email = VALID_EMAIL) => {
  await userEvent.type(canvas.getByLabelText('이메일'), email);
};

const meta: Meta<typeof ComponentName> = {
  title: 'Domain/ComponentName',
  component: ComponentName,
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// ─── 성공 케이스 ──────────────────────────────────────
export const Success: Story = { /* ... */ };

// ─── 에러 케이스 ──────────────────────────────────────
export const ErrorA: Story = { /* ... */ };
```

---

## 네이밍 규칙

| 케이스 유형 | `name` | export 이름 |
|-------------|--------|-------------|
| 성공 (단일) | `'200 동작 설명'` | `Success` |
| 성공 (역할별) | `'200 동작 설명 (손님/사장님)'` | `SuccessReviewer`, `SuccessOwner` |
| API 에러 | `'4xx 에러 원인'` | `ErrorNotFound`, `ErrorDuplicateEmail` |
| 클라이언트 유효성 | `'400 빈 폼 제출 (클라이언트 유효성)'` | `ClientValidationError` |
| 플로우 | `'동작 설명 플로우'` | `LogoutFlow` |

---

## 주의사항

1. **엔드포인트 URL**: `handler.ts`에서 `'*/api/...'` 패턴을 그대로 복사한다.
2. **오버라이드 범위**: 에러 핸들러는 해당 엔드포인트만 덮어쓴다. 멀티스텝 플로우에서 일부 API만 실패시킬 때도 동일하게 적용한다.
3. **`findBy` vs `getBy`**: 비동기 응답 후 나타나는 요소는 반드시 `findBy`를 사용한다 (`await canvas.findByText(...)`).
4. **중복 금지**: 작성 전에 기존 스토리를 확인해 중복을 피한다.
5. **역할 시뮬레이션**: Authorization 헤더가 필요한 케이스는 핸들러 오버라이드에서 역할을 직접 반환하거나, 이미 로그인된 상태를 전제로 한다.
