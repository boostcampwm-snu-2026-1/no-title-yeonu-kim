export type MockRole = 'OWNER' | 'REVIEWER' | null;

export function getRole(request: Request): MockRole {
  const auth = request.headers.get('Authorization');
  if (auth === 'Bearer mock-owner-token') {
    return 'OWNER';
  }
  if (auth === 'Bearer mock-reviewer-token') {
    return 'REVIEWER';
  }
  return null;
}

// 특수 케이스 트리거 값
export const CLOSED_EVENT_ID = 'closed-event-001';
export const ALREADY_APPLIED_EVENT_ID = 'applied-event-001';
export const ALREADY_SUBMITTED_APP_ID = 'submitted-app-001';
// reward 값이 이 이상이면 예치금 부족 에러
export const INSUFFICIENT_DEPOSIT_REWARD = 999_999_999;
// 이 토큰으로 GET /deposit 시 404 반환 (예치금 정보 없는 사장님)
export const NO_DEPOSIT_OWNER_TOKEN = 'Bearer mock-no-deposit-owner-token';
