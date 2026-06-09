# 트러블슈팅: 버튼 패딩이 적용되지 않는 문제

## 증상

`WeekNav`의 "오늘" 버튼에 Tailwind `px-*` 클래스를 아무리 바꿔도 브라우저 DevTools에서 `padding: 0px`으로 표시되며 변화가 없었다.
`완료 / 수정 / 삭제` 버튼은 패딩이 정상적으로 적용된 것처럼 보였다.

---

## 원인

`src/index.css`에 작성한 전역 CSS 리셋이 문제였다.

```css
/* ❌ 문제의 코드 */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;   /* ← 이 줄이 Tailwind utility를 덮어씀 */
}
```

Tailwind v4는 내부적으로 `@layer base`, `@layer utilities` 등 **CSS 레이어**를 사용한다.
`px-7` 같은 utility 클래스는 `@layer utilities` 안에 들어간다.

CSS 레이어 규칙상 **레이어 바깥(unlayered)에 선언된 CSS는 레이어 안의 CSS보다 항상 우선**한다.
따라서 위의 `* { padding: 0 }` 리셋이 `px-7`, `px-6` 등 모든 패딩 utility를 덮어쓴 것이다.

```
우선순위 (높음 → 낮음)
unlayered CSS  >  @layer utilities  >  @layer base
     ↑                  ↑
* { padding: 0 }      .px-7 { padding: ... }
```

### 완료/수정/삭제가 정상처럼 보인 이유

이 버튼들에는 `min-w-[76px]`가 적용되어 있었다.
패딩이 실제로는 0이지만 최소 너비가 강제되어 텍스트 양옆에 공간이 생긴 것처럼 **착각**하게 만들었다.

---

## 해결

Tailwind v4는 preflight(기본 리셋)를 `@import "tailwindcss"` 안에 이미 포함하고 있다.
중복이자 충돌의 원인인 수동 리셋을 제거했다.

```css
/* ✅ 수정 후 */
@import "tailwindcss";

@theme {
  /* 커스텀 색상 변수 */
}

body {
  font-family: var(--font-family-sans);
}
```

---

## 교훈

- Tailwind v4에서 `@import "tailwindcss"` 이외에 별도로 CSS 리셋을 추가하면 안 된다.
- 커스텀 base 스타일이 필요하면 반드시 `@layer base { ... }` 안에 작성해야 utility 클래스가 정상적으로 덮어쓸 수 있다.
- `min-w`로 강제된 너비는 패딩이 없어도 패딩처럼 보일 수 있어 디버깅을 어렵게 만든다.
