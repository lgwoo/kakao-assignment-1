# 마이그레이션 명세 (migration.md)

> 2차 과제(Vite + localStorage) → 이번 과제(Next.js + FastAPI/SQLite) 전환 계획.
> 이 과제의 핵심 학습목표입니다.

---

## 1. Vite → Next.js 매핑

| 2차 과제 (Vite) | 이번 과제 (Next.js) | 메모 |
|---|---|---|
| `src/main.jsx`, `index.html` | (제거) `app/layout.tsx` | 프레임워크가 진입점 대체 |
| `src/App.jsx` | `app/page.tsx` / `app/todos/page.tsx` | 라우팅이 파일 기반으로 |
| 컴포넌트(`src/components/*`) | `app/...` 내 컴포넌트 | UI 최대한 재사용 |
| 모든 컴포넌트 = 클라이언트 | Server 기본 + 필요한 곳만 `"use client"` | 렌더링 위치 분리 |
| `useState`로 필터 관리 | (도전) URL 파라미터 `?filter=` | 새로고침/공유에도 유지 |
| `selectedDate` (useState) | **그대로 useState 유지** | 단, 날짜별 조회는 서버로 (`?date=`) |

> TODO: 2차 과제 실제 폴더/컴포넌트를 보고 행 채우기.

---

## 2. localStorage → 서버 API + DB

| 동작 | 2차 과제 (localStorage) | 이번 과제 (서버) |
|---|---|---|
| 목록 로드(날짜별) | `localStorage` + `t.date === selectedDate` 필터 | Client → `route.ts` → `GET /todos?date=` (서버에서 필터) |
| 상세 로드(수정 페이지) | 배열에서 id로 찾기 | Server Component → `actions.ts` → `GET /todos/{id}` |
| 생성 | 배열 push 후 저장 | Client → `route.ts` → `POST /todos` |
| 수정 | 배열 수정 후 저장 | Client → `route.ts` → `PUT /todos/{id}` |
| 삭제 | 배열 필터 후 저장 | Client → `route.ts` → `DELETE /todos/{id}` |
| 영속성 | 브라우저 localStorage | FastAPI + SQLite(`todos.db`) |

---

## 3. 두 방식의 차이 (직접 작성 — 과제 목표)

> 본인 언어로 채우세요. README/회고에 그대로 쓰입니다.

- **데이터 위치**: 브라우저 localStorage vs 서버 DB →
- **여러 기기/브라우저 공유**: →
- **데이터 흐름**: 클라이언트 단방향 vs 클라이언트↔서버 왕복 →
- **네트워크 의존성 / 로딩·에러 상태 처리**(`loading.tsx`/`error.tsx`): →
- **보안(URL 등 민감값 노출)**: →

---

## 4. 안전한 전환 순서
1. FastAPI CRUD부터 완성하고 `/docs`로 검증.
2. 읽기 연결 — 날짜별 목록은 Client→`route.ts`(`?date=`), 수정 페이지 상세는 Server Component→`actions.ts`. 목록 표시 확인.
3. `route.ts`로 생성/수정/삭제를 하나씩 교체하며 그때마다 확인.
4. 전부 서버 기반으로 동작하면 localStorage 코드 완전 제거.
5. 회귀 확인: 새로고침, 빈 입력, 데이터 없는 상태, 콘솔 에러 0.
