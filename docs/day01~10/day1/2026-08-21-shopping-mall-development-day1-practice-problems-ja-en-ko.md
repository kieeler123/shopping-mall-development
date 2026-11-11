# Shopping Mall Day 1 — Practice Problems

# ショッピングモール Day 1 — 問題

# 쇼핑몰 Day 1 — 문제집

[📖 GENERAL Review・総復習・총정리](2026-08-21-shopping-mall-development-day1-general-review-ja-en-ko.md)  
[✅ 正解・Answers・정답 해설](2026-08-21-shopping-mall-development-day1-answers-explanations-ja-en-ko.md)

> 이 파일에는 문제만 수록합니다. 먼저 GENERAL 문서를 닫고 풀어보세요.

---

# 日本語

## 問題 1

`layout.tsx` と `page.tsx` の役割の違いを説明してください。

## 問題 2

次の `children` には何が入りますか？

```tsx
<main>{children}</main>
```

## 問題 3

Header と Footer を各 `page.tsx` に書かず Root Layout に置いた理由は何ですか？

## 問題 4

Next.js アプリ内部の移動で `Link` を使う理由を説明してください。

## 問題 5

`@/*` が `./src/*` に設定されている場合、次はどこを指しますか？

```tsx
@/components/layout/Header
```

## 問題 6

Day 1 で Hero を `Hero.tsx` に分離しなかった理由を説明してください。

## 問題 7

次の Tailwind CSS Class の役割を説明してください。

```text
flex
flex-col
flex-1
min-h-screen
mx-auto
max-w-7xl
md:flex-row
```

## 問題 8

`globals.css` にはどのような Style を置くべきですか？

## 問題 9

`npm run lint` と `npm run build` の目的の違いは何ですか？

## 問題 10

Day 1 の Directory Structure を見ずに書いてください。

## 問題 11

なぜ `body.flex.min-h-screen.flex-col` と `main.flex-1` の組み合わせで Footer が上へ詰まりにくくなりますか？

## 問題 12

まだ必要のない Library を Day 1 から大量導入しない理由を説明してください。

> **Tip**  
> 正解を思い出すのではなく「なぜ？」まで声に出して説明する。

---

# English

## Question 1

Explain the difference between `layout.tsx` and `page.tsx`.

## Question 2

What is rendered as `children`?

## Question 3

Why are Header and Footer placed in the Root Layout instead of repeated in every Page?

## Question 4

Why use Next.js `Link` for internal navigation?

## Question 5

If `@/*` maps to `./src/*`, what does this path mean?

```tsx
@/components/layout/Header
```

## Question 6

Why did we not extract the Hero into `Hero.tsx` on Day 1?

## Question 7

Explain these Tailwind classes:

```text
flex
flex-col
flex-1
min-h-screen
mx-auto
max-w-7xl
md:flex-row
```

## Question 8

What kind of styles belong in `globals.css`?

## Question 9

What is the difference between `npm run lint` and `npm run build`?

## Question 10

Recreate the Day 1 directory structure from memory.

## Question 11

Why does the combination of a full-height Flex body and `main.flex-1` help keep the Footer near the bottom?

## Question 12

Why should we avoid installing many libraries before we actually need them?

> **Tip**  
> Try to explain the reason, not only the definition.

---

# 한국어

## 문제 1

`layout.tsx`와 `page.tsx`의 역할 차이를 설명하세요.

## 문제 2

다음 `children`에는 무엇이 들어오나요?

```tsx
<main>{children}</main>
```

## 문제 3

Header와 Footer를 모든 `page.tsx`에 반복하지 않고 Root Layout에 둔 이유는 무엇인가요?

## 문제 4

Next.js 내부 페이지 이동에 `Link`를 사용하는 이유는 무엇인가요?

## 문제 5

`@/*`가 `./src/*`로 설정되어 있을 때 다음 경로는 어디를 의미하나요?

```tsx
@/components/layout/Header
```

## 문제 6

Day 1에서 Hero를 `Hero.tsx`로 분리하지 않은 이유를 설명하세요.

## 문제 7

다음 Tailwind CSS 클래스의 역할을 설명하세요.

```text
flex
flex-col
flex-1
min-h-screen
mx-auto
max-w-7xl
md:flex-row
```

## 문제 8

`globals.css`에는 어떤 종류의 스타일을 두는 것이 좋나요?

## 문제 9

`npm run lint`와 `npm run build`의 목적 차이는 무엇인가요?

## 문제 10

Day 1 폴더 구조를 보지 않고 직접 작성하세요.

## 문제 11

`body`의 `flex min-h-screen flex-col`과 `main`의 `flex-1` 조합이 Footer 배치에 어떻게 도움이 되나요?

## 문제 12

Day 1부터 아직 필요하지 않은 라이브러리를 잔뜩 설치하지 않는 이유는 무엇인가요?

> **팁**  
> 맞혔더라도 이유를 설명하지 못했다면 △로 표시하고 정답 해설에서 다시 확인하세요.

## 복습 체크

- [ ] 혼자 답할 수 있었다
- [ ] 이유까지 설명할 수 있었다
- [ ] 코드를 보지 않고 구조를 그릴 수 있었다
- [ ] 헷갈린 문제를 표시했다
