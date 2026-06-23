# 아키텍처 명세 (architecture.md)

> 구조, Server/Client 경계, 데이터 흐름, 빌드 순서를 정의합니다. (과제 스펙 기준)

---

## 1. 폴더 구조 (과제 지정)

```
frontend/app/
├── api/todos/route.ts      # Route Handler (프록시)
├── todos/
│   ├── [todoId]/page.tsx   # 수정 페이지
│   ├── new/page.tsx        # 생성 페이지
│   ├── error.tsx           # 에러 UI
│   ├── loading.tsx         # 로딩 UI
│   └── page.tsx            # 목록 페이지
├── actions.ts              # Server Actions
├── globals.css
├── layout.tsx
└── page.tsx                # 루트 페이지

backend/
└── main.py                 # FastAPI 전부 (라우터+DB+모델+스키마)
```
파일 위치 = URL 경로. (`app/todos/new/page.tsx` → `/todos/new`)

---

## 2. Server vs Client Component 경계

**원칙**: 기본 Server. 인터랙션이 필요한 *가장 작은 단위*만 Client로 분리.

| 파일/컴포넌트 | Server / Client | 비고 |
|---|---|---|
| `layout.tsx` | Server | |
| `app/page.tsx` (루트) | Server | |
| `todos/page.tsx` (목록) | Server 셸 + Client | 선택 날짜=**클라이언트 state** → 목록은 Client에서 `?date=`로 fetch |
| 날짜 선택기/이동 | Client | `useState`로 `selectedDate` 관리 |
| `todos/new/page.tsx` | Server 페이지 + Client 폼 | 폼은 입력/제출 → Client |
| `todos/[todoId]/page.tsx` | Server(상세 읽기) + Client 수정 폼 | |
| `error.tsx` | **Client 필수** | Next 규칙: `error.tsx`는 `"use client"` 강제 |
| `loading.tsx` | Server | UI만, 자동 Suspense fallback |
| 항목 토글/삭제 버튼, 입력 폼 | Client | `onClick`/`onChange` |
| (도전) 필터·검색 | Client | `useSearchParams` → Suspense 경계 필요 |

> "이유" 칸은 직접 채우세요. 회고/평가에서 설명할 수 있어야 합니다.
> - 날짜별 목록이 Client인 이유(=`selectedDate`가 클라이언트 state) → (선택 날짜를 useState로 들고 있기 때문이다.)
> - `error.tsx`가 Client여야 하는 이유 → (reset같은 인터랙션을 다루기 때문이다.)

---

## 3. 데이터 흐름 (두 경로)

**목록 읽기 (날짜별)** — 선택 날짜가 클라이언트 state → Client에서 읽기
```
[Client 컴포넌트: selectedDate state + 목록]
   │  fetch(`${NEXT_PUBLIC_API_URL}/todos?date=${selectedDate}`)
   ▼
[route.ts (서버)] ── fetch(`${BACKEND_URL}/todos?date=...`) ──▶ [FastAPI] ──▶ [SQLite]
```
> 날짜를 URL(`?date=`)에 두면 Server Component가 `searchParams`로 읽어 actions.ts로 부를 수 있음(선택지).

**상세 읽기 (수정 페이지)** — id가 URL 파라미터 → Server Component + actions.ts
```
[Server Component: todos/[todoId]/page.tsx]
   │  getTodo(todoId)  (actions.ts)
   ▼
[actions.ts (서버)] ── fetch(`${BACKEND_URL}/todos/{id}`) ──▶ [FastAPI] ──▶ [SQLite]
```

**쓰기 (생성/수정/삭제)** — Client → Route Handler 프록시
```
[Client 컴포넌트: 폼/버튼]
   │  fetch(`${NEXT_PUBLIC_API_URL}/todos`)   (= /api/todos)
   ▼
[route.ts (서버)] ── fetch(`${BACKEND_URL}/todos`) ──▶ [FastAPI] ──▶ [SQLite]
```

핵심: `BACKEND_URL`은 서버(`actions.ts`/`route.ts`)에서만 쓰여 브라우저에 노출되지 않음.
→ 환경변수로 민감값을 분리하는 이유.

> 과제 안내: 두 방식이 언제 쓰이는지 "구현하면서 직접 확인"하라고 명시돼 있어요. 위 분담을 기본으로 하되, 막히면 한 경로씩 검증.

---

## 4. 빌드 플랜 (미션 0~6, 한 단계씩)

- **미션 0 — 구조 잡기**: 프로젝트 생성, frontend/backend 분리. 2차 과제 기능 중 프론트에 남길 것 / 백엔드로 보낼 것 정리.
- **미션 1 — 프론트 세팅**: create-next-app(옵션 준수), `localhost:3000` 확인.
- **미션 2 — 백엔드 세팅**: venv + requirements.txt, `localhost:8000` + `/docs` 확인.
- **미션 3 — FastAPI CRUD**: SQLAlchemy 모델 + Pydantic 스키마 + CORS + 4개 엔드포인트. `todos.db` 생성 확인.
- **미션 4 — Next 페이지**: 목록/생성/수정 + `loading.tsx`/`error.tsx`. Server/Client 구분.
- **미션 5 — 연동**: `route.ts`(프록시) + `actions.ts`(Server Action). CRUD 전체 흐름 연결.
- **미션 6 — 환경변수**: `.env.local` 분리, 하드코딩 URL 제거.
- **(도전) 필터/검색**: URL 파라미터(`?filter=`, `?search=`) + FastAPI 서버 측 필터링. 검색은 debounce 고려.
