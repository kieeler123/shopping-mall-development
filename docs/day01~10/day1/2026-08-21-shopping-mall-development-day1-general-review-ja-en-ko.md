# Shopping Mall Day 1 — GENERAL Review

# ショッピングモール Day 1 — 総復習

# 쇼핑몰 Day 1 — 총정리

[📝 問題・Quiz・문제](2026-08-21-shopping-mall-development-day1-practice-problems-ja-en-ko.md)  
[✅ 正解・Answers・정답 해설](2026-08-21-shopping-mall-development-day1-answers-explanations-ja-en-ko.md)

> Day 1에서 실제로 진행한 Next.js 기본 구조 정리 → Global CSS → Root Layout → Header/Footer → Home Hero → Path Alias → 검증/Git 흐름을 복습하기 위한 문서입니다.

---

# 日本語

## 0. 学習情報

- **テーマ:** Next.js ショッピングモール Day 1
- **範囲:** プロジェクトの最小共通基盤
- **技術:** Next.js App Router / React / TypeScript / Tailwind CSS / npm
- **学習焦点:** Root Layout、共通UI、`children`、Metadata、Global CSS、Link、Path Alias、最小実装、検証

> **Tip**  
> 個別のコードを暗記するより、「共通レイアウトの中に現在のページが入る」という全体構造を先に理解する。

## 1. Day 1 の一行要約

Day 1では、ショッピングモールの機能を増やす前に、すべてのページの土台となる Root Layout、Header、Footer、Home Page、Global Style を最小構成で作成した。

```text
Browser
→ RootLayout
→ Header
→ children (Page)
→ Footer
```

> **Tip**  
> この流れをコードを見ずに説明できれば Day 1 の中心を理解している。

## 2. プロジェクト構造

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

`app` は Route と Layout を担当し、`components/layout` は複数ページで共有する UI を担当する。

> **Tip**  
> ファイル名だけでなく、それぞれのフォルダの責務を説明できるようにする。

## 3. Root Layout と `children`

```tsx
<body className="flex min-h-screen flex-col">
  <Header />
  <main className="flex-1">{children}</main>
  <Footer />
</body>
```

`layout.tsx` は共通の枠で、`children` には現在の Route に対応する Page が入る。

```text
/          → HomePage
/products  → ProductsPage（将来）
```

> **Tip**  
> `layout = 枠`, `children = 現在のページ` と覚える。

## 4. Metadata と `lang`

`Metadata` で title / description の基本情報を定義し、`<html lang="ko">` で文書の基本言語を指定した。

> **Tip**  
> Day 1 では SEO 全体ではなく、表示内容とは別にページ情報を持てることを理解する。

## 5. `globals.css`

Tailwind CSS の読み込み、CSS Variables、`box-sizing`、body、link、form、image の基本ルールだけを置いた。

> **Tip**  
> 特定の Component にしか必要ない Style を Global CSS に入れすぎない。

## 6. Header

Header を共通 Component として分離し、Logo / Navigation / Actions の最小構造を作った。

内部 Route への移動には `next/link` の `Link` を使用した。

> **Tip**  
> Next.js 内部 Navigation ではまず `Link` を考える。

## 7. Footer

Footer も共通 Component として分離し、Brand / Links / Copyright の最小構造を作った。

`flex-col` と `md:flex-row` で基本的な Responsive Layout も扱った。

> **Tip**  
> 最初から情報を増やさず、必要になった時点で Footer を拡張する。

## 8. Home Hero

Home Page の Hero は `page.tsx` に直接書いた。

```text
HomePage
└─ Hero
   ├─ Label
   ├─ Heading
   ├─ Description
   └─ SHOP NOW
```

まだ小さく、一度しか使わないため `Hero.tsx` には分離しなかった。

> **Tip**  
> 「Component にできるか」ではなく「今、分離する理由があるか」で判断する。

## 9. Path Alias `@/`

`@/*` を `./src/*` に対応させると：

```tsx
import { Header } from "@/components/layout/Header";
```

は `src/components/layout/Header` を参照する。

> **Tip**  
> `@/` の意味は固定ではなく `tsconfig.json` の設定で決まる。

## 10. Tailwind Layout

代表的に使用した Class：

```text
flex
flex-col
flex-1
min-h-screen
mx-auto
max-w-7xl
md:flex-row
```

特に `body` の `flex + min-h-screen + flex-col` と `main` の `flex-1` によって、内容が少ないページでも Footer が上へ詰まりにくくなる。

> **Tip**  
> Tailwind は Class 名だけでなく、画面上の変化と結び付けて覚える。

## 11. 検証と Git

```bash
npm run lint
npm run build
git status
git add .
git commit -m "feat: create base shopping mall layout"
```

> **Tip**  
> `git add .` の前に `git status` で変更内容を確認する。

## 12. Day 1 最終フロー

```text
Next.js App Router
↓
RootLayout
├─ Header
├─ children → page.tsx → Hero
└─ Footer
↓
globals.css / Tailwind CSS
↓
lint / build
↓
Git Commit
```

> **Tip**  
> Day 1 の復習ではこの図を最初に再現する。

---

# English

## 0. Study Information

- **Topic:** Next.js Shopping Mall Day 1
- **Scope:** Minimal shared project foundation
- **Technology:** Next.js App Router / React / TypeScript / Tailwind CSS / npm
- **Focus:** Root Layout, shared UI, `children`, Metadata, Global CSS, Link, Path Alias, minimal implementation, verification

> **Tip**  
> Learn Day 1 as one application structure rather than as isolated syntax.

## 1. Day 1 in One Sentence

Day 1 created the smallest shared foundation for the shopping mall: Root Layout, Header, Footer, Home Page, and global styling.

```text
Browser
→ RootLayout
→ Header
→ children (Page)
→ Footer
```

> **Tip**  
> If you can explain this flow without looking at code, you understand the core of Day 1.

## 2. Project Structure

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

`app` owns routes/layouts, while `components/layout` contains shared layout UI.

> **Tip**  
> Explain responsibilities, not only file names.

## 3. Root Layout and `children`

`layout.tsx` is the shared frame. `children` receives the Page for the current Route.

> **Tip**  
> Remember: `layout = frame`, `children = current page`.

## 4. Metadata and `lang`

Basic title/description metadata was defined, and `<html lang="ko">` declares Korean as the document language.

> **Tip**  
> Focus on the concept of page information before studying SEO in depth.

## 5. `globals.css`

We kept only application-wide basics such as Tailwind import, CSS variables, `box-sizing`, and common body/link/form/image rules.

> **Tip**  
> Keep component-specific styling out of global CSS unless it is genuinely global.

## 6. Header and Footer

Header and Footer were extracted because they are shared across pages. Internal navigation uses Next.js `Link`.

> **Tip**  
> Shared responsibility belongs in shared UI.

## 7. Home Hero

The Hero remains directly in `page.tsx` because it is still small and used only once.

> **Tip**  
> Extract a component when extraction solves a real problem.

## 8. Path Alias

When `@/*` maps to `./src/*`, `@/components/...` refers to `src/components/...`.

> **Tip**  
> The alias meaning comes from project configuration.

## 9. Tailwind Layout

`flex`, `flex-col`, `flex-1`, `min-h-screen`, `mx-auto`, `max-w-7xl`, and responsive prefixes such as `md:` were introduced.

> **Tip**  
> Associate each utility with the layout change it produces.

## 10. Verification and Git

```bash
npm run lint
npm run build
git status
git add .
git commit -m "feat: create base shopping mall layout"
```

> **Tip**  
> A working dev server is not the only completion check.

## 11. Final Day 1 Flow

```text
Next.js App Router
↓
RootLayout
├─ Header
├─ children → page.tsx → Hero
└─ Footer
↓
globals.css / Tailwind CSS
↓
lint / build
↓
Git Commit
```

> **Tip**  
> Reproduce this diagram from memory during review.

---

# 한국어

## 0. 학습 정보

- **주제:** Next.js 쇼핑몰 Day 1
- **범위:** 프로젝트의 최소 공통 기반
- **기술:** Next.js App Router / React / TypeScript / Tailwind CSS / npm
- **학습 초점:** Root Layout, 공통 UI, `children`, Metadata, Global CSS, Link, Path Alias, 최소 구현, 검증

> **팁**  
> 개별 문법을 외우기보다 공통 Layout 안에 현재 Page가 들어오는 전체 흐름으로 이해합니다.

## 1. Day 1 한 줄 요약

Day 1에서는 쇼핑몰 기능을 늘리기 전에 모든 페이지의 기반이 되는 Root Layout, Header, Footer, Home Page, Global Style을 최소한으로 구성했습니다.

```text
Browser
→ RootLayout
→ Header
→ children (Page)
→ Footer
```

> **팁**  
> 코드를 보지 않고 이 흐름을 설명할 수 있으면 Day 1 핵심을 이해한 것입니다.

## 2. 프로젝트 구조

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

`app`은 Route와 Layout을 담당하고, `components/layout`은 여러 페이지가 공유하는 UI를 담당합니다.

> **팁**  
> 폴더 이름을 외우는 것보다 각 폴더가 왜 존재하는지 설명해보세요.

## 3. Root Layout과 `children`

`layout.tsx`는 공통 틀이며 `children`에는 현재 Route에 해당하는 Page가 들어옵니다.

```text
/          → HomePage
/products  → ProductsPage (향후)
```

> **팁**  
> `layout = 액자`, `children = 현재 페이지`로 이해하면 쉽습니다.

## 4. Metadata와 `lang`

기본 title / description을 설정하고 `<html lang="ko">`로 문서의 기본 언어를 지정했습니다.

> **팁**  
> Day 1에서는 SEO 전체보다 화면 내용과 별개의 페이지 정보가 있다는 개념을 잡습니다.

## 5. `globals.css`

Tailwind 불러오기, CSS 변수, `box-sizing`, body, link, form, image의 기본 전역 규칙만 정리했습니다.

> **팁**  
> 특정 컴포넌트에만 필요한 스타일을 전역 CSS에 넣지 않습니다.

## 6. Header / Footer

Header와 Footer는 여러 페이지가 공유하므로 `components/layout`에 분리했습니다. 내부 페이지 이동에는 `next/link`의 `Link`를 사용했습니다.

> **팁**  
> 여러 페이지에서 공유하는가를 컴포넌트 책임 분리의 기준 중 하나로 사용하세요.

## 7. Home Hero

Hero는 아직 작고 한 번만 사용하므로 `page.tsx`에 직접 작성했습니다.

> **팁**  
> 분리할 수 있다는 이유만으로 파일을 늘리지 말고, 분리가 실제 문제를 해결할 때 리팩터링합니다.

## 8. `@/` Path Alias

`@/*`가 `./src/*`에 연결되어 있다면 `@/components/layout/Header`는 `src/components/layout/Header`를 의미합니다.

> **팁**  
> Alias 오류가 나면 `tsconfig.json`과 실제 폴더 구조를 비교합니다.

## 9. Tailwind Layout

주요 클래스:

```text
flex
flex-col
flex-1
min-h-screen
mx-auto
max-w-7xl
md:flex-row
```

`body`가 최소 화면 높이를 확보하고 `main.flex-1`이 남은 공간을 채워 콘텐츠가 적어도 Footer가 위로 붙기 어렵게 구성했습니다.

> **팁**  
> 클래스를 제거했다가 다시 넣어보면서 실제 레이아웃 변화를 확인하면 기억하기 쉽습니다.

## 10. 검증과 Git

```bash
npm run lint
npm run build
git status
git add .
git commit -m "feat: create base shopping mall layout"
```

> **팁**  
> 하나의 학습 단위를 마칠 때 lint/build를 확인하고 Git으로 기준점을 남깁니다.

## 11. Day 1 최종 흐름

```text
Next.js App Router
↓
RootLayout
├─ Header
├─ children → page.tsx → Hero
└─ Footer
↓
globals.css / Tailwind CSS
↓
lint / build
↓
Git Commit
```

> **팁**  
> Day 1 복습에서는 이 데이터·화면 구조를 보지 않고 다시 그려보세요.

## 12. 최종 체크

- [ ] Root Layout과 Page의 차이를 설명할 수 있다
- [ ] `children`의 역할을 설명할 수 있다
- [ ] Header/Footer를 공통화한 이유를 설명할 수 있다
- [ ] `Link`를 사용하는 이유를 설명할 수 있다
- [ ] `@/` Path Alias를 설명할 수 있다
- [ ] Hero를 아직 분리하지 않은 이유를 설명할 수 있다
- [ ] 주요 Tailwind 클래스를 설명할 수 있다
- [ ] lint와 build의 차이를 설명할 수 있다
- [ ] Day 1 폴더 구조를 보지 않고 그릴 수 있다

> **팁**  
> 체크는 본 적이 있을 때가 아니라 이유를 자기 말로 설명할 수 있을 때 완료합니다.
