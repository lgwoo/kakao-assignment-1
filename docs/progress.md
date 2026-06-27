# 진행 상황 (progress.md)

> 세션 시작 시 먼저 읽고, 끝낼 때 갱신. 기능 단위마다 Issue 템플릿에도 기록할 것.

## 필수 미션
- [x] 0. 구조 잡기 — 프로젝트 생성, 프론트/백 분리, 기능 배치 정리
- [x] 1. 프론트 세팅 — create-next-app(옵션 준수), localhost:3000 확인
- [x] 2. 백엔드 세팅 — venv + requirements, localhost:8000 + /docs 확인
- [x] 3. FastAPI CRUD — SQLAlchemy 모델/Pydantic 스키마/CORS/4개 엔드포인트, todos.db 생성
- [x] 4. Next 페이지 — 목록/생성/수정 + loading.tsx/error.tsx, Server/Client 구분
- [x] 5. 연동 — route.ts(프록시) + actions.ts(Server Action), CRUD 전체 흐름
- [x] 6. 환경변수 — .env.local 분리, 하드코딩 URL 제거

## 도전 미션 (선택)
- [ ] 상태별 필터링 (URL 파라미터 + 서버 필터링)
- [ ] 검색 (URL 파라미터 + debounce + 서버 검색)

## 제출 전 체크리스트
- [x] README 작성 (기능 설명)
- [x] 예외 상황(빈 입력, 데이터 없음)에서도 오류 없음
- [x] 새로고침 후 데이터 유지 / 의도대로 초기화
- [x] console.log·죽은 주석 제거, 명확한 네이밍, 중복 로직 함수화
- [x] 크롬 콘솔 에러 0, E2E 흐름 직접 확인
- [ ] node_modules / .DS_Store / .venv / todos.db / .env.local 미포함 (.venv이 gitignore 수정전 이미 올라가 버림)

## 결정 로그
> 중요한 설계 결정 + 이유 한 줄씩
-

## 현재 막힌 것 / 다음 할 일
- 필수 미션 전체 완료. 도전 미션(필터링/검색) 선택적 진행.
