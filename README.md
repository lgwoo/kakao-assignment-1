# 📝 과제 1. Vanilla JS로 Todo 앱 만들기

Vanilla JS만을 사용해 Todo 웹 앱을 직접 만들어보는 과제예요.  
AI 도구를 활용해 코드를 생성하고, 직접 수정하며 완성했어요.

---

## 🚀 실행 방법

1. 저장소를 클론해요
```bash
git clone 저장소 주소
cd kakao-assignment-1
```
2. VS Code에서 `index.html` 파일을 열어요
3. Live Server 확장을 실행해요 (index.html 우클릭 → Open with Live Server)

---

## 📁 프로젝트 구조

```
kakao-assignment-1/
├── index.html   # 화면 레이아웃
├── style.css    # 스타일
└── app.js       # 기능 구현
```

---

## ✅ 구현 기능

### 기본 미션
- **Todo CRUD** — 할 일 생성 / 인라인 수정 / 완료 처리 / 삭제 (삭제 시 확인창)
- **상태별 필터링** — 전체 / 진행 중 / 완료 탭, 탭별 Todo 개수 표시
- **일간 뷰** — 날짜별 Todo 분리 저장 및 표시
- **로컬스토리지 연동** — 새로고침 후에도 데이터 유지, 저장 실패 시 알림 처리

### 도전 미션
- **주간 뷰** — 이번 주 월~일 날짜 셀 표시, 날짜 클릭으로 이동, 이전/다음 주 네비게이션, 오늘로 돌아오기 버튼, 날짜별 Todo 개수 뱃지

---

## 🛠️ 활용 스택

- `HTML` / `CSS` / `Vanilla JS`
- `Web Storage API` (localStorage)

---

## 📌 참고사항

- 본 과제는 AI 도구(Claude)를 활용해 구현했어요
