const ERROR_MESSAGES: Record<string, string> = {
  // Auth
  AUTH_001: '인증 헤더가 없거나 형식이 올바르지 않습니다.',
  AUTH_002: '이메일 또는 비밀번호가 일치하지 않습니다.',
  AUTH_003: '리프레시 토큰이 유효하지 않습니다.',
  AUTH_004: '액세스 토큰이 유효하지 않습니다.',
  AUTH_005: '토큰 정보가 일치하지 않습니다.',
  AUTH_006: 'OAuth 인증에 실패했습니다.',
  AUTH_007: '이 작업을 수행할 권한이 없습니다.',
  // User
  USER_001: '이미 사용 중인 이메일입니다.',
  USER_002: '이미 사용 중인 아이디입니다.',
  USER_004: '사용자를 찾을 수 없습니다.',
  USER_006: '이메일 인증 코드가 유효하지 않거나 만료되었습니다.',
  USER_007: '이메일 인증에 실패했습니다.',
  // General
  GEN_002: '지원하지 않는 기능입니다.',
  GEN_003: '잘못된 요청입니다.',
  GEN_004: '필수 항목을 모두 입력해 주세요.',
  GEN_005: '요청 형식이 올바르지 않습니다.',
  // Store
  STORE_001: '가게를 찾을 수 없습니다.',
  // Event
  EVENT_001: '이벤트를 찾을 수 없습니다.',
  // Application
  APPLICATION_001: '이 신청에 접근할 권한이 없습니다.',
  APPLICATION_002: '신청 내역을 찾을 수 없습니다.',
  APPLICATION_003: '이미 제출된 신청입니다.',
  // Deposit
  DEPOSIT_001: '예치금이 부족합니다.',
  DEPOSIT_002: '예치금 정보를 찾을 수 없습니다.',
  // S3
  S3_001: '파일 업로드 URL 생성에 실패했습니다.',
  // Mail
  MAIL_001: '이메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.',
};

const FALLBACK_MESSAGE = '오류가 발생했습니다. 다시 시도해 주세요.';

export const createErrorMessage = (
  code: string,
  fallback = FALLBACK_MESSAGE
): string => {
  return ERROR_MESSAGES[code] ?? fallback;
};
