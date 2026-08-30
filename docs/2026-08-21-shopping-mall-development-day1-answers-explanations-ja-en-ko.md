# Shopping Mall Day 1 — Answers & Explanations

# ショッピングモール Day 1 — 正解・解説

# 쇼핑몰 Day 1 — 정답·해설

[📖 GENERAL Review・総復習・총정리](2026-08-21-shopping-mall-development-day1-general-review-ja-en-ko.md)  
[📝 問題・Quiz・문제](2026-08-21-shopping-mall-development-day1-practice-problems-ja-en-ko.md)

> 문제를 먼저 풀고 채점할 때 사용하는 파일입니다.

---

# 日本語

## 正解 1

`layout.tsx` は複数 Page で共有する構造、`page.tsx` は特定 Route の内容を定義する。

> **Tip**  
> `layout = 枠`, `page = 中身`。

## 正解 2

現在の Route に対応する Page が `children` に入る。

> **Tip**  
> `children` を「共通 Layout に差し込まれる現在の Page」と考える。

## 正解 3

共通 UI の重複を避け、一箇所で管理するため。

> **Tip**  
> 複数ページで同じ UI を使うなら共通責務を検討する。

## 正解 4

Next.js の内部 Routing と連携した Navigation を行うため。

> **Tip**  
> 内部 Route と外部 URL を区別する。

## 正解 5

`src/components/layout/Header` を指す。

> **Tip**  
> `@/` の意味は `tsconfig.json` の設定で決まる。

## 正解 6

Hero はまだ小さく一度しか使用せず、分離しても明確な利益がないため。

> **Tip**  
> 必要になってから Refactoring する。

## 正解 7

- `flex`: Flexbox
- `flex-col`: 縦方向
- `flex-1`: 残り領域を占有
- `min-h-screen`: 最小画面高
- `mx-auto`: 左右 auto margin
- `max-w-7xl`: 最大幅制限
- `md:flex-row`: md 以上で横方向

> **Tip**  
> Class を削除して画面変化を確認すると理解しやすい。

## 正解 8

全ページに共通する基礎 Style。Tailwind import、基本色、reset、link/form/image の基本ルールなど。

> **Tip**  
> 特定 Component 専用 Style は Global に置かない。

## 正解 9

`lint` はコード規則・潜在問題を検査し、`build` は Production Build が成立するか確認する。

> **Tip**  
> Dev Server が動くだけで完成と判断しない。

## 正解 10

```text
src/
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
└─ components/
   └─ layout/
      ├─ Header.tsx
      └─ Footer.tsx
```

## 正解 11

`body` が最低でも画面高を持つ縦 Flex Container になり、`main.flex-1` が残り領域を占有するため。

> **Tip**  
> 4つの Class を一つの Layout Pattern として覚える。

## 正解 12

必要性のない Dependency は複雑さを増やし、「なぜ必要か」を学びにくくするため。

> **Tip**  
> 問題が発生してから、その問題を解決する Tool を追加する。

---

# English

## Answer 1

`layout.tsx` defines shared structure; `page.tsx` defines route-specific content.

## Answer 2

The Page for the current Route is rendered as `children`.

## Answer 3

To avoid duplicated shared UI and maintain it in one place.

## Answer 4

`Link` integrates internal navigation with Next.js routing.

## Answer 5

With the stated alias mapping, it means `src/components/layout/Header`.

## Answer 6

The Hero is still small and used once, so extraction does not yet solve a meaningful problem.

## Answer 7

- `flex`: Flexbox
- `flex-col`: vertical direction
- `flex-1`: occupy remaining flexible space
- `min-h-screen`: minimum viewport-height layout
- `mx-auto`: automatic horizontal margins
- `max-w-7xl`: maximum width constraint
- `md:flex-row`: horizontal Flex direction from the md breakpoint

## Answer 8

Truly application-wide base styles belong in `globals.css`.

## Answer 9

`lint` checks code rules and potential issues; `build` verifies that a production build can be produced.

## Answer 10

The structure is the `src/app` directory plus `src/components/layout/Header.tsx` and `Footer.tsx`, as shown in the GENERAL file.

## Answer 11

The body fills at least the viewport, and `main.flex-1` grows into the remaining space between Header and Footer.

## Answer 12

Unneeded dependencies increase complexity and make it harder to understand what problem each library is meant to solve.

> **Tip**  
> If you can explain every answer without memorized wording, the concept is becoming yours.

---

# 한국어

## 정답 1

`layout.tsx`는 여러 Page가 공유하는 구조를 정의하고, `page.tsx`는 특정 Route에서 보여줄 실제 내용을 정의합니다.

> **팁**  
> `layout = 액자`, `page = 액자 안의 내용`으로 기억하세요.

## 정답 2

현재 Route에 해당하는 Page가 `children`으로 들어옵니다.

> **팁**  
> `children`을 공통 Layout 안에 끼워지는 현재 페이지라고 생각하세요.

## 정답 3

Header와 Footer가 여러 페이지에서 공유되는 UI이므로 중복을 없애고 한 곳에서 관리하기 위해서입니다.

> **팁**  
> 반복되는 UI를 발견하면 무조건 복사하지 말고 공통 책임인지 먼저 판단합니다.

## 정답 4

Next.js 내부 Routing과 연동되는 Navigation을 하기 위해 `Link`를 사용합니다.

> **팁**  
> 우리 앱 내부 Route와 외부 URL을 구분하세요.

## 정답 5

현재 설정이 `@/* → ./src/*`라면 `src/components/layout/Header`를 의미합니다.

> **팁**  
> `@/`의 의미는 프로젝트 설정에 따라 달라집니다.

## 정답 6

Hero가 아직 작고 한 번만 사용되므로 별도 Component로 분리해도 얻는 이점이 크지 않기 때문입니다.

> **팁**  
> 필요가 생겼을 때 리팩터링하는 경험도 공부의 일부입니다.

## 정답 7

- `flex`: Flexbox 사용
- `flex-col`: 자식 요소 세로 배치
- `flex-1`: 남은 공간을 차지하도록 확장
- `min-h-screen`: 최소 화면 높이 확보
- `mx-auto`: 좌우 margin auto
- `max-w-7xl`: 최대 너비 제한
- `md:flex-row`: md 이상에서 가로 Flex 배치

> **팁**  
> Tailwind는 암기보다 실제 화면 변화와 연결해서 이해하세요.

## 정답 8

모든 페이지에 적용할 기본 전역 규칙을 둡니다. Tailwind 불러오기, 기본 색상, reset, 링크·폼·이미지 기본 규칙 등이 해당합니다.

> **팁**  
> 특정 Component만 사용하는 스타일은 전역으로 올리지 않는 것을 우선 고려합니다.

## 정답 9

`npm run lint`는 코드 규칙과 잠재 문제를 검사하고, `npm run build`는 프로덕션 결과물을 정상 생성할 수 있는지 확인합니다.

> **팁**  
> 하나의 기능 단위가 끝날 때 lint와 build를 함께 확인하세요.

## 정답 10

```text
src/
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
└─ components/
   └─ layout/
      ├─ Header.tsx
      └─ Footer.tsx
```

> **팁**  
> 구조를 외우는 것보다 `app`과 `components/layout`의 책임 차이를 설명하는 것이 중요합니다.

## 정답 11

`body`가 세로 Flex Container로 최소 화면 높이를 확보하고 `main.flex-1`이 Header와 Footer 사이의 남은 공간을 채우기 때문입니다.

> **팁**  
> `flex + flex-col + min-h-screen + flex-1`을 하나의 Layout 패턴으로 기억하세요.

## 정답 12

아직 필요하지 않은 Dependency를 추가하면 복잡성만 커지고, 각 라이브러리가 실제로 어떤 문제를 해결하기 위해 필요한지 학습하기 어려워지기 때문입니다.

> **팁**  
> 도구가 유명해서 추가하는 것이 아니라 실제 문제가 생겼을 때 해결책으로 도입합니다.

## 오답 복습 방법

1. 틀린 문제 번호를 표시합니다.
2. GENERAL에서 해당 개념을 다시 읽습니다.
3. 정답 문장을 외우지 말고 자신의 말로 설명합니다.
4. 실제 프로젝트 파일을 열어 코드와 연결합니다.
5. 다음날 문제집만 다시 풀어봅니다.

> **팁**  
> 맞혔지만 이유를 설명하지 못한 문제도 오답과 동일하게 복습하면 좋습니다.
