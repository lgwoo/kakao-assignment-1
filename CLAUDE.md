# CLAUDE.md

Next.js Todo 앱 (카카오테크 캠퍼스 과제 3) 프로젝트 규칙 **진입점**.
세부 명세는 아래 docs를 세션 시작 시 @import로 자동 로드합니다.

@docs/architecture.md
@docs/api_spec.md
@docs/migration.md
@docs/progress.md

---

## ⚠️ 작업 원칙 (가장 중요 — 반드시 지킬 것)


1. **한 번에 전체를 생성하지 마세요.** `docs/architecture.md`의 빌드 플랜(미션 0~6)을 한 단계씩 진행합니다.
2. **전체 코드를 바로 주지 마세요.** 막힌 부분에 대해 "접근 방향/힌트" 위주로 안내하고, 코드는 내가 직접 작성하게 둡니다. (과제가 요구하는 방식)
3. 코드의 **"왜"를 한국어로 짧게** 설명: 특히 Server/Client 구분, `route.ts` vs `actions.ts` 선택 이유.
4. **새 개념**(예: `"use client"`, `useSearchParams`, Server Action)이 나오면 한 줄 개념 설명.
5. 큰 변경 전 **요약 후 확인**. 내가 **"다음 단계"** 라고 하기 전까지 다음 미션으로 넘어가지 마세요.


---

## 🛠️ 활용 스택 (버전 고정)

- **Frontend**: Next.js 15+, React 18+, TypeScript 5, Tailwind CSS 4, Axios
- **Backend**: FastAPI 0.111+, Uvicorn, SQLAlchemy 2, SQLite, Pydantic 2
- **create-next-app 옵션**: TypeScript=Yes, ESLint=Yes, Tailwind=Yes, `src/`=**No**, App Router=Yes, Turbopack=No, import alias=No(`@/*` 기본 유지)

---

## 📁 폴더 구조 (과제 지정 — 그대로 따를 것)

```
kakao-assignment-3/
├── frontend/
│   ├── app/
│   │   ├── api/todos/route.ts        # Route Handler (백엔드 프록시)
│   │   ├── todos/
│   │   │   ├── [todoId]/page.tsx     # 수정 페이지
│   │   │   ├── new/page.tsx          # 생성 페이지
│   │   │   ├── error.tsx             # 에러 UI (★"use client" 필수)
│   │   │   ├── loading.tsx           # 로딩 UI
│   │   │   └── page.tsx              # 목록 페이지
│   │   ├── actions.ts                # Server Actions (주로 읽기)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                  # 루트 페이지
│   └── .env.local
└── backend/
    ├── main.py                       # FastAPI 전부 (라우터+DB+모델+스키마)
    ├── requirements.txt
    └── .env.local
```
> ※ `src/` 디렉토리는 사용하지 않습니다.

---

## 📌 핵심 규칙 (요약 — 상세는 docs 참조)

- **Server Component가 기본.** `"use client"`는 인터랙션(`onClick`/`onChange`/`useState`/`useSearchParams`)에만.
- **서버 코드 두 종류, 역할 구분** (과제 권장 분담):
  - `actions.ts` (Server Action): Server Component에서 직접 호출. **읽기(목록/상세)** → FastAPI 직접 호출.
  - `route.ts` (Route Handler): 클라이언트가 `fetch('/api/todos')`로 호출하는 **프록시**. **생성/수정/삭제**.
- 클라이언트는 **FastAPI 직접 호출 금지**(CORS) → `route.ts` 경유. 백업으로 FastAPI에 CORS 설정.
- **DB**: SQLAlchemy + SQLite, `backend/main.py` 단일 파일.
- **API**: `GET`/`POST` `/todos`, `PUT`/`DELETE` `/todos/{id}`. id는 정수.
- **환경변수** (이름 고정):
  - `frontend/.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:3000/api`, `BACKEND_URL=http://localhost:8000`
  - `backend/.env.local`: `DATABASE_URL=sqlite:///./todos.db`
  - `NEXT_PUBLIC_` = 브라우저 노출(클라이언트→Next route용). 접두사 없는 `BACKEND_URL` = 서버 전용(노출 금지).
  - 환경변수 변경 후 **dev 서버 재시작**.

---

## 🚫 하지 말 것
- 전체 코드 한 번에 받아쓰기 / 프로젝트 한 번에 생성.
- 모든 컴포넌트에 무지성 `"use client"`.
- 클라이언트에서 FastAPI 직접 호출.
- `BACKEND_URL`에 `NEXT_PUBLIC_` 붙이기(브라우저 노출됨).
- `.env.local`, `todos.db`, `node_modules`, `.venv`, `.DS_Store` 커밋.
- 내가 이해 못 한 채 코드만 쌓기.
