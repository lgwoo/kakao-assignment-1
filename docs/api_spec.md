# API 명세 (api_spec.md)

> FastAPI 엔드포인트, route.ts/actions.ts 분담, 스키마를 정의합니다. (과제 스펙 기준)

---

## 1. FastAPI 엔드포인트

| Method | URL | 설명 | 요청 본문 | 응답 |
|---|---|---|---|---|
| GET | `/todos?date=YYYY-MM-DD` | **특정 날짜**의 목록 조회 (date 필수) | - | `TodoResponse[]` |
| POST | `/todos` | 생성 (본문에 date 포함) | `TodoCreate` | `TodoResponse` |
| PUT | `/todos/{id}` | 수정 | `TodoUpdate` | `TodoResponse` |
| DELETE | `/todos/{id}` | 삭제 | - | 204 / 결과 |

날짜 처리: 클라이언트가 `selectedDate`(state)를 `?date=`로 넘기면 서버가 그 날짜만 DB에서 조회.
기존 2차 과제의 클라이언트 측 `t.date === selectedDate` 필터를 **서버로 이전**하는 셈.

(도전) 여기에 `&filter=active|completed`, `&search=키워드`를 더해 서버에서 함께 필터링.

> 수정은 PATCH가 아니라 **PUT**입니다. id는 **정수(Integer)**.

---

## 2. route.ts vs actions.ts 분담

| | `route.ts` (Route Handler) | `actions.ts` (Server Action) |
|---|---|---|
| 역할 | HTTP 요청 받아 FastAPI로 전달(프록시) | 컴포넌트에서 직접 호출하는 서버 함수 |
| 호출 | `fetch('/api/todos')` | `import { getTodos } from '@/app/actions'` |
| 주 용도 | 클라이언트의 생성/수정/삭제 | Server Component의 읽기(목록/상세) |
| 환경변수 | `process.env.BACKEND_URL` | `process.env.BACKEND_URL` |

> 두 곳 모두 서버에서 실행되며 `BACKEND_URL`로 FastAPI에 접근. 클라이언트는 절대 FastAPI 직접 호출 X.

---

## 3. 스키마 (2차 과제 Todo 기준 — 확정)

> 2차 과제 Todo 필드: `id`, `text`(본문), `completed`, `date`. (`TodoList`·`TodoItem`에서 확인)
> 관찰된 규칙: 본문 최대 **200자**(maxLength), **빈 값 금지**(trim 후 거부) → 검증에 반영.
> ※ `text`가 싫으면 `content`로 바꿔도 됨(단, 5군데 통일). SQLite에서 `text` 컬럼명은 사용 가능.

### SQLAlchemy 모델
```python
class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)                 # 할 일 본문
    completed = Column(Boolean, default=False, nullable=False)
    date = Column(String, nullable=False)                 # "YYYY-MM-DD"
```

### Pydantic 스키마 (v2)
```python
from pydantic import BaseModel, Field

class TodoCreate(BaseModel):
    text: str = Field(min_length=1, max_length=200)
    date: str                                  # "YYYY-MM-DD"

class TodoUpdate(BaseModel):                    # 내용 수정 / 완료 토글 모두 커버
    text: str | None = Field(default=None, max_length=200)
    completed: bool | None = None
    date: str | None = None

class TodoResponse(BaseModel):
    id: int
    text: str
    completed: bool
    date: str
    model_config = {"from_attributes": True}   # ORM 객체 → 응답 변환
```

### TypeScript 타입 (frontend, 백엔드와 1:1)
```ts
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string;   // "YYYY-MM-DD"
}
```

> 2차 과제는 `date`로 날짜별 분류, `completed`로 전체/진행중/완료 필터를 했어요.
> 도전 미션의 서버 필터링은 `completed`(와 필요시 `date`)를 쿼리 파라미터로 받아 처리하면 됩니다.

---

## 4. CORS / 에러
- 클라이언트가 route.ts를 거치면 CORS 이슈가 적지만, 안전하게 FastAPI에 CORS 설정:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"], allow_headers=["*"],
)
```
- 잘못된 입력 → 400, 없는 id → 404. route.ts는 FastAPI 상태코드를 그대로 전달.
- 빈 입력값 제출, 데이터 없는 상태 등 예외도 오류 없이 동작해야 함(제출 체크리스트).
