# 📝 과제 3. Next.js + FastAPI로 Todo 앱 만들기

과제 2에서 Vite + localStorage로 만든 Todo 앱을 **Next.js 16 (App Router) + FastAPI + SQLite**로 재구현한 과제예요.  
Server/Client Component 분리, Route Handler, Server Action, DB 연동을 직접 경험했어요.

> 과제 2 (Vite + localStorage)는 **week-03-이건우** 브랜치에 있어요.  
> 이 과제는 **week-04-geonu** 브랜치예요.

---

## 🚀 실행 방법

### 백엔드 (FastAPI)

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1   # Windows PowerShell
pip install -r requirements.txt
uvicorn main:app --reload
```

`http://localhost:8000/docs` 에서 Swagger UI 확인

### 프론트엔드 (Next.js)

```bash
cd frontend
npm install
npm run dev
```

`http://localhost:3000` 접속 (자동으로 `/todos` 로 이동)

---

## 📁 프로젝트 구조

```
kakao-assignment-1/
├── frontend/
│   ├── app/
│   │   ├── api/todos/
│   │   │   ├── route.ts          # Route Handler — GET, POST 프록시
│   │   │   └── [todoId]/
│   │   │       └── route.ts      # Route Handler — PUT, DELETE 프록시
│   │   ├── todos/
│   │   │   ├── page.tsx          # 목록 페이지
│   │   │   ├── new/page.tsx      # 생성 페이지
│   │   │   ├── [todoId]/page.tsx # 수정 페이지
│   │   │   ├── error.tsx         # 에러 UI
│   │   │   └── loading.tsx       # 로딩 UI
│   │   ├── actions.ts            # Server Actions (읽기)
│   │   └── page.tsx              # 루트 → /todos 리다이렉트
│   ├── components/               # UI 컴포넌트
│   ├── types/todo.ts             # Todo 타입 정의
│   └── utils/dateUtils.ts        # 날짜 유틸
└── backend/
    ├── main.py                   # FastAPI 전체 (모델/스키마/라우터)
    └── requirements.txt
```

---

## ✅ 구현 기능

### 필수 미션
- **Todo CRUD** — 생성 / 수정 / 완료 처리 / 삭제
- **날짜별 관리** — 주간 달력에서 날짜 선택 → 해당 날짜 Todo 조회
- **상태별 필터링** — 전체 / 진행 중 / 완료
- **DB 영속성** — FastAPI + SQLite, 새로고침 후 데이터 유지
- **Server/Client 분리** — 읽기는 Server Action, 쓰기는 Route Handler 프록시

---

## 🛠️ 활용 스택

| 분류 | 기술 |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4 |
| Backend | FastAPI 0.111, SQLAlchemy 2, SQLite, Pydantic 2 |

---

## 📌 localStorage → 서버 DB 전환 포인트

| 항목 | 과제 2 (localStorage) | 과제 3 (서버 DB) |
|---|---|---|
| 데이터 저장 | 브라우저 로컬 | SQLite DB |
| 여러 기기 공유 | ❌ | ✅ |
| 날짜 필터링 | 클라이언트 | 서버 쿼리 |
| id 관리 | nextId state | DB auto-increment |
