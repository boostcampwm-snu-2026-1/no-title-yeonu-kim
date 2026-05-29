# API 케이스별 접근 조건

## Auth 토큰 규칙 (모든 인증 API 공통)

| Authorization 헤더 | 역할 |
|---|---|
| `Bearer mock-owner-token` | 사장 계정 |
| `Bearer mock-reviewer-token` | 리뷰어 계정 |
| 없음 또는 그 외 | `401` |

---

# 회원가입

## POST `/api/auth/user`

| 케이스 | 조건 |
|---|---|
| `201` 성공 | 정상 body |
| `400` 필드 누락 | `role`, `username`, `email`, `password` 중 하나 누락 |
| `409` 중복 이메일 | `email: "duplicate@example.com"` |
| `400` 인증코드 만료 (리뷰어) | `role: "REVIEWER"` + `email`에 `+fail` 포함 (예: `test+fail@snu.ac.kr`) |
| `401` 비밀번호 불일치 (사장님) | `role: "OWNER"` + `password: "wrong-owner-secret"` |

---

# 로그인

## POST `/api/auth/user/session`

| 케이스 | 조건 |
|---|---|
| `200` 성공 (리뷰어) | 정상 body |
| `200` 성공 (사장님) | `mail`에 `"owner"` 포함 |
| `400` 필드 누락 | `mail` 또는 `password` 누락 |
| `401` 계정 없음/비밀번호 불일치 | `mail: "notfound@example.com"` 또는 `password: "wrongpassword"` |

---

# Store

| 엔드포인트 | 케이스 | 조건 |
|---|---|---|
| `POST /api/store` | `201` | owner 토큰 |
|  | `401` | 토큰 없음 |
|  | `403` | reviewer 토큰 |
| `GET /api/store` | `200` | 항상 (`?category=CAFE` 등 필터 가능) |
| `PATCH /api/store/:storeId` | `200` | `storeId: "store-001"` or `"store-002"`, owner 토큰 |
|  | `404` | 그 외 `storeId` |
| `DELETE /api/store/:storeId` | `200` | `storeId: "store-001"` or `"store-002"`, owner 토큰 |
|  | `404` | 그 외 `storeId` |
| `GET /api/store/:storeId/events` | `200` | `storeId: "store-001"` or `"store-002"` |
|  | `404` | 그 외 `storeId` |

---

# Event

| 엔드포인트 | 케이스 | 조건 |
|---|---|---|
| `POST /api/event` | `201` | owner 토큰, 정상 body |
|  | `400` 예치금 부족 | `reward >= 999999999` |
| `GET /api/event/owner` | `200` | owner 토큰 |
| `PATCH /api/event/:eventId` | `200` | `eventId: "event-001" ~ "event-003"`, owner 토큰 |
|  | `400` 이미 마감 | `eventId: "closed-event-001"` + `isActive: false` |
|  | `404` | 그 외 `eventId` |
| `DELETE /api/event/:eventId` | `200` | `eventId: "event-001" ~ "event-003"` |
|  | `404` | 그 외 `eventId` |

---

# Application

| 엔드포인트 | 케이스 | 조건 |
|---|---|---|
| `GET /api/event/:eventId/applications` | `200` | owner 토큰, 알려진 `eventId` / `?status=pending` 필터 가능 |
|  | `404` | 알 수 없는 `eventId` |
| `POST /api/application/:eventId` | `200` | reviewer 토큰, 알려진 활성 이벤트 |
|  | `400` 마감 이벤트 | `eventId: "closed-event-001"` |
|  | `409` 이미 신청 | `eventId: "applied-event-001"` |
|  | `404` | 그 외 `eventId` |
| `GET /api/application` | `200` | reviewer 토큰 |
| `DELETE /api/application/:applicationId` | `200` | reviewer 토큰, `applicationId: "app-001" ~ "app-003"` |
|  | `403` | owner 토큰 |
|  | `404` | 그 외 `applicationId` |
| `POST /api/application/:applicationId/submission` | `200` | reviewer 토큰, 알려진 `applicationId` |
|  | `409` 이미 제출 | `applicationId: "submitted-app-001"` |
|  | `404` | 그 외 `applicationId` |
| `PATCH /api/application/:applicationId/status` | `200` | owner 토큰, 알려진 `applicationId` |
|  | `404` | 그 외 `applicationId` |

---

# Deposit

| 엔드포인트 | 케이스 | 조건 |
|---|---|---|
| `GET /api/deposit` | `200` | owner 토큰 |
|  | `404` 예치금 없음 | `Authorization: Bearer mock-no-deposit-owner-token` |
| `POST /api/deposit` | `201` | owner 토큰, `amount > 0` |
|  | `400` | `amount <= 0` 또는 누락 |

---

# S3

| 엔드포인트 | 케이스 | 조건 |
|---|---|---|
| `POST /api/s3` | `200` | 로그인 토큰 (`owner` or `reviewer`), `fileType: "REVIEW"` or `"STORE"` |
|  | `401` | 토큰 없음 |
|  | `400` | `fileName` 또는 `fileType` 누락 |
