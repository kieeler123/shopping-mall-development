# Shopping Mall Project — Day 1 総復習 / Review / 총복습

> **学習順序 / Study Order / 학습 순서**  
> 日本語 → English → 한국어
>
> Day 1의 목적은 많은 기능을 구현하는 것이 아니라, **Next.js 쇼핑몰의 가장 작은 공통 골격을 직접 만들고 각 코드가 왜 필요한지 이해하는 것**이다.

---

# 🇯🇵 日本語

## 1. Day 1 の目標

Day 1では、ショッピングモールの機能をたくさん実装するのではなく、  
今後すべてのページの土台になる基本構造を作成した。

完成した基本構造は次のとおり。

```text
RootLayout
│
├─ Header
├─ Main
│  └─ Page
└─ Footer
```

実際のプロジェクト構造はおおよそ次のようになる。

```text
src/
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
│
└─ components/
   └─ layout/
      ├─ Header.tsx
      └─ Footer.tsx
```

> **Tip / コツ**  
> 学習用プロジェクトでは、1日に大量のコードを書くよりも、書いたコードを自分の言葉で説明できることを優先する。

---

## 2. `layout.tsx`

`layout.tsx` は複数のページで共有するレイアウトを定義する。

基本構造：

```tsx
<body className="flex min-h-screen flex-col">
  <Header />

  <main className="flex-1">{children}</main>

  <Footer />
</body>
```

ここで `children` には現在表示しているページの内容が入る。

例えば `/` にアクセスすると、概念的には次のようになる。

```text
Header
↓
HomePage
↓
Footer
```

将来 `/products` を作成すると：

```text
Header
↓
ProductsPage
↓
Footer
```

となる。

### 重要な用語

| 日本語 | English | 한국어 |
|---|---|---|
| レイアウト | Layout | 레이아웃 |
| 子要素 | Children / Child elements | 자식 요소 |
| 共通構造 | Shared structure | 공통 구조 |
| ルートレイアウト | Root Layout | 루트 레이아웃 |

> **Tip / コツ**  
> `layout.tsx` は「ページそのもの」ではなく、ページを包む共通の枠として考えると理解しやすい。

---

## 3. Metadata

`layout.tsx` ではサイト全体の基本 Metadata も設定した。

```tsx
export const metadata: Metadata = {
  title: {
    default: "Shopping Mall",
    template: "%s | Shopping Mall",
  },
  description: "実務レベルのショッピングモール学習プロジェクト",
};
```

Metadata はブラウザのタイトルや検索エンジンなどにページ情報を伝えるために使われる。

```text
Basic T-Shirt
        ↓
Basic T-Shirt | Shopping Mall
```

また：

```tsx
<html lang="ko">
```

によって、このサイトの基本言語が韓国語であることをブラウザや検索エンジン、スクリーンリーダーなどに伝える。

> **Tip / コツ**  
> SEOを最初から深く学ぶ必要はない。Day 1では「Metadataという仕組みがある」と理解できれば十分。

---

## 4. `globals.css`

`globals.css` にはサイト全体に適用する最小限のスタイルを定義した。

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #111111;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--foreground);
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea,
select {
  font: inherit;
}

img {
  display: block;
  max-width: 100%;
}
```

### 役割

```text
Tailwind CSS 読み込み
↓
基本カラー
↓
box-sizing
↓
body のデフォルト余白を削除
↓
リンクの基本スタイル
↓
フォーム要素
↓
画像の基本設定
```

> **Tip / コツ**  
> `globals.css` にすべてのスタイルを書かない。サイト全体に本当に必要なルールだけを置く。

---

## 5. Header

Header は次のような構造で作成した。

```text
Header
│
├─ Logo
├─ Navigation
│  ├─ PRODUCTS
│  ├─ MEN
│  └─ WOMEN
│
└─ Actions
   ├─ SEARCH
   └─ CART
```

Next.js 内部のページ移動には：

```tsx
import Link from "next/link";
```

を利用する。

```tsx
<Link href="/products">PRODUCTS</Link>
```

### なぜ `Link` を使うのか

ショッピングモール内部のページへ移動する場合、Next.js のルーティング機能と連携できるためである。

> **Tip / コツ**  
> 自分のNext.jsアプリ内部への移動では、まず `Link` を思い出す。

---

## 6. Footer

Footer は最小限の構造で作成した。

```text
Footer
│
├─ Brand
├─ Description
├─ Links
│  ├─ ABOUT
│  ├─ TERMS
│  └─ PRIVACY
└─ Copyright
```

レスポンシブ対応として：

```tsx
flex-col
md:flex-row
```

のような Tailwind CSS クラスも使用した。

小さい画面：

```text
Brand
↓
Links
```

大きい画面：

```text
Brand          Links
```

> **Tip / コツ**  
> 最初から完璧なレスポンシブデザインを作る必要はない。まずモバイルでも壊れない程度の基本構造を作る。

---

## 7. Home Page

`page.tsx` には最初の Hero Section を直接記述した。

```text
HomePage
└─ Hero
   ├─ Label
   ├─ Heading
   ├─ Description
   └─ SHOP NOW
```

現在は `Hero.tsx` に分離していない。

理由は、現時点では Hero が `page.tsx` で一度しか使われず、構造もまだ小さいからである。

将来ホームページが：

```text
HomePage
├─ Hero
├─ NewProducts
├─ BestProducts
├─ CategoryBanner
└─ Promotion
```

のように大きくなった時点で分離を検討する。

> **Tip / コツ**  
> 「コンポーネントにできるか」ではなく、**「今、分離する理由があるか」**を考える。

---

## 8. Import Alias `@/`

次のような Import を使用した。

```tsx
import { Header } from "@/components/layout/Header";
```

`@/` を `src/` として設定している場合：

```text
@/components/layout/Header

=

src/components/layout/Header
```

となる。

`tsconfig.json` の例：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### メリット

```text
../../../components/...
```

のような長い相対パスを減らすことができる。

> **Tip / コツ**  
> Aliasが動作しない場合は、まず `tsconfig.json` の `paths` と実際のディレクトリ構造が一致しているか確認する。

---

## 9. Tailwind CSS で学んだクラス

Day 1で使用した代表的なクラス：

```text
flex
flex-col
flex-1
items-center
justify-between

mx-auto
px-6
py-4

max-w-7xl
min-h-screen

border-b
border-t

text-sm
text-xl
font-bold

sm:
md:
```

特に Root Layout では：

```tsx
<body className="flex min-h-screen flex-col">
```

と：

```tsx
<main className="flex-1">
```

を組み合わせた。

これにより、コンテンツが少なくても Footer が不自然に上へ移動しにくい構造になる。

> **Tip / コツ**  
> Tailwind CSS のクラスを暗記する必要はない。使用頻度の高いものから自然に覚える。

---

## 10. Day 1 完了チェック

- [x] Next.js プロジェクト確認
- [x] `globals.css` 整理
- [x] `layout.tsx` 整理
- [x] Metadata 設定
- [x] Header 作成
- [x] Footer 作成
- [x] Home Hero 作成
- [x] `@/` Alias 理解
- [ ] `npm run lint` 確認
- [ ] `npm run build` 確認
- [ ] Git Commit

> **Tip / コツ**  
> チェック項目は実際のプロジェクト状態に合わせて更新する。

---

# 🇺🇸 English

## 1. Day 1 Goal

The goal of Day 1 was not to build many shopping features.

The goal was to create the **smallest reusable foundation** for the shopping mall.

```text
RootLayout
│
├─ Header
├─ Main
│  └─ Page
└─ Footer
```

Project structure:

```text
src/
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
│
└─ components/
   └─ layout/
      ├─ Header.tsx
      └─ Footer.tsx
```

> **Tip**  
> For a study project, understanding a small amount of code deeply is more valuable than producing a large amount of code quickly.

---

## 2. Root Layout

`layout.tsx` defines UI that is shared across pages.

```tsx
<body className="flex min-h-screen flex-col">
  <Header />

  <main className="flex-1">{children}</main>

  <Footer />
</body>
```

`children` represents the page currently being rendered.

For `/`:

```text
Header
↓
HomePage
↓
Footer
```

For a future `/products` route:

```text
Header
↓
ProductsPage
↓
Footer
```

### Key vocabulary

| English | 日本語 | 한국어 |
|---|---|---|
| Layout | レイアウト | 레이아웃 |
| Children | 子要素 | 자식 요소 |
| Shared UI | 共通UI | 공통 UI |
| Root Layout | ルートレイアウト | 루트 레이아웃 |
| Route | ルート | 경로 / 라우트 |

> **Tip**  
> Think of the Root Layout as a frame. The `children` content changes inside that frame.

---

## 3. Metadata

We added basic site metadata.

```tsx
export const metadata: Metadata = {
  title: {
    default: "Shopping Mall",
    template: "%s | Shopping Mall",
  },
  description: "A practical shopping mall learning project",
};
```

Metadata can provide information such as:

```text
Page title
Description
Search information
Social sharing information
```

We also used:

```tsx
<html lang="ko">
```

to indicate that the primary language of the document is Korean.

> **Tip**  
> You do not need to master SEO now. Remember that metadata is part of the page information rather than visible page content.

---

## 4. Global Styles

`globals.css` contains styles that should apply across the entire application.

Important concepts covered:

```text
Tailwind import
CSS variables
box-sizing
body reset
link reset
form font inheritance
responsive images
```

> **Tip**  
> Keep global CSS small. Component-specific styling should normally stay close to the component.

---

## 5. Header

The Header contains three main areas:

```text
Header
│
├─ Logo
├─ Navigation
└─ Actions
```

We used Next.js `Link`:

```tsx
import Link from "next/link";

<Link href="/products">PRODUCTS</Link>
```

This is used for navigation inside the Next.js application.

> **Tip**  
> When navigating to an internal route, think of `Link` before using a plain anchor element.

---

## 6. Footer

The Footer currently contains:

```text
Brand
Description
Navigation links
Copyright
```

We also introduced simple responsive classes:

```tsx
flex-col
md:flex-row
```

This lets the layout change depending on screen size.

> **Tip**  
> Responsive design does not need to be perfect on Day 1. Start with a layout that remains usable on both small and large screens.

---

## 7. Home Page and Hero

The initial Hero is still written directly inside `page.tsx`.

That is intentional.

Current structure:

```text
HomePage
└─ Hero
```

There is currently no strong reason to create a separate `Hero.tsx`.

Later:

```text
HomePage
├─ Hero
├─ NewProducts
├─ BestProducts
└─ Promotion
```

At that point, extracting components may improve readability and responsibility separation.

> **Tip**  
> Do not ask only, “Can I extract this component?” Ask, **“What problem would extracting it solve?”**

---

## 8. Path Alias

Instead of:

```tsx
import { Header } from "../components/layout/Header";
```

we can use:

```tsx
import { Header } from "@/components/layout/Header";
```

when `@/` maps to `src/`.

Example:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

> **Tip**  
> Path aliases become more useful as the directory structure gets deeper.

---

## 9. Verification Commands

At the end of a development session, check the project with:

```bash
npm run lint
npm run build
```

`lint` checks for code-quality and rule violations.

`build` verifies that the application can produce a production build.

Then inspect Git changes:

```bash
git status
```

and commit when the current unit of work is complete.

Example:

```bash
git add .
git commit -m "feat: create base shopping mall layout"
```

> **Tip**  
> Run `git status` before `git add .` so you know exactly what you are about to commit.

---

# 🇰🇷 한국어

## 1. Day 1에서 무엇을 했는가?

Day 1의 목표는 쇼핑몰 기능을 많이 만드는 것이 아니었습니다.

앞으로 모든 기능이 올라갈 **가장 작은 공통 기반**을 만들었습니다.

```text
RootLayout
│
├─ Header
├─ Main
│  └─ Page
└─ Footer
```

현재 구조:

```text
src/
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
│
└─ components/
   └─ layout/
      ├─ Header.tsx
      └─ Footer.tsx
```

> **팁**  
> 공부 프로젝트에서는 오늘 작성한 코드를 직접 설명할 수 있으면 충분합니다. 기능 수를 늘리는 것보다 이해도를 우선합니다.

---

## 2. `layout.tsx`

`layout.tsx`는 여러 페이지에서 반복해서 사용할 공통 구조를 담당합니다.

```tsx
<body className="flex min-h-screen flex-col">
  <Header />

  <main className="flex-1">{children}</main>

  <Footer />
</body>
```

여기에서 핵심은:

```tsx
{children}
```

입니다.

`children` 자리에는 현재 URL에 해당하는 페이지가 들어옵니다.

홈 `/`:

```text
Header
↓
HomePage
↓
Footer
```

향후 `/products`:

```text
Header
↓
ProductsPage
↓
Footer
```

즉:

```text
layout = 바뀌지 않는 공통 틀
children = 현재 경로에 따라 바뀌는 페이지
```

라고 이해할 수 있습니다.

> **팁**  
> `layout + children` 개념은 나중에 관리자 레이아웃, 마이페이지 레이아웃 등을 만들 때 다시 사용되므로 확실히 이해해두는 것이 좋습니다.

---

## 3. Metadata

다음과 같은 기본 Metadata도 설정했습니다.

```tsx
export const metadata: Metadata = {
  title: {
    default: "Shopping Mall",
    template: "%s | Shopping Mall",
  },
  description: "실무형 쇼핑몰 학습 프로젝트",
};
```

역할은 페이지에 대한 정보를 브라우저와 검색엔진 등에 전달하는 것입니다.

또한:

```tsx
<html lang="ko">
```

를 사용하여 HTML 문서의 기본 언어가 한국어임을 명시했습니다.

> **팁**  
> 지금 SEO 전체를 공부할 필요는 없습니다. Metadata가 화면 내용과 별개로 페이지 정보를 표현한다는 정도만 확실히 이해하면 됩니다.

---

## 4. `globals.css`

사이트 전체에 공통으로 적용할 최소 스타일을 정리했습니다.

주요 내용:

```text
Tailwind CSS 불러오기
CSS 변수
box-sizing
body 기본 여백 제거
링크 기본 스타일
폼 요소 폰트
이미지 기본 크기 처리
```

특히:

```css
* {
  box-sizing: border-box;
}
```

를 통해 width와 padding 등의 크기 계산을 다루기 쉽게 했습니다.

> **팁**  
> `globals.css`는 전역 규칙만 담당하게 합니다. 특정 상품 카드에만 필요한 스타일 같은 것은 여기에 넣지 않는 것이 좋습니다.

---

## 5. Header

Header를 별도의 컴포넌트로 만들었습니다.

```text
Header
│
├─ Logo
├─ Navigation
│  ├─ PRODUCTS
│  ├─ MEN
│  └─ WOMEN
└─ Actions
   ├─ SEARCH
   └─ CART
```

Next.js 내부 페이지 이동에는:

```tsx
import Link from "next/link";
```

를 사용했습니다.

```tsx
<Link href="/products">PRODUCTS</Link>
```

> **팁**  
> 우리 Next.js 애플리케이션 내부 경로로 이동한다면 `Link`를 우선 떠올리면 됩니다.

---

## 6. Footer

Footer 역시 여러 페이지에서 반복되므로 별도 컴포넌트로 만들었습니다.

```text
Footer
│
├─ Brand
├─ Description
├─ Links
└─ Copyright
```

또한:

```tsx
flex-col
md:flex-row
```

같은 Tailwind 반응형 클래스를 처음 사용했습니다.

> **팁**  
> Day 1에서는 완벽한 모바일 디자인보다 화면 크기가 바뀌어도 레이아웃이 심하게 깨지지 않는 정도면 충분합니다.

---

## 7. 왜 `Hero.tsx`는 만들지 않았는가?

현재 Hero는 `page.tsx`에서 한 번만 사용하고 있으며 크기도 작습니다.

따라서:

```text
page.tsx
└─ Hero 내용
```

으로 유지했습니다.

지금부터:

```text
page.tsx
└─ Hero.tsx
```

로 무조건 나누면 파일은 증가하지만 얻는 이점이 크지 않습니다.

나중에 홈이 커지면:

```text
HomePage
├─ Hero
├─ NewProducts
├─ BestProducts
├─ CategoryBanner
└─ Promotion
```

그 시점에:

```text
components/
└─ home/
   ├─ Hero.tsx
   ├─ NewProducts.tsx
   └─ BestProducts.tsx
```

처럼 분리할 수 있습니다.

> **팁**  
> **컴포넌트로 만들 수 있다는 것과 컴포넌트로 만들어야 한다는 것은 다릅니다.** 분리할 명확한 이유가 생겼을 때 리팩터링합니다.

---

## 8. `@/` Path Alias

다음 Import를 사용했습니다.

```tsx
import { Header } from "@/components/layout/Header";
```

`@/`가 `src/`를 의미하도록 설정했다면:

```text
@/components/layout/Header
```

는:

```text
src/components/layout/Header
```

와 같습니다.

예:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

프로젝트가 커졌을 때:

```text
../../../components/...
```

같은 복잡한 상대경로를 줄이는 데 도움이 됩니다.

> **팁**  
> Alias 오류가 발생하면 `tsconfig.json`의 `paths`와 실제 `src` 폴더 구조를 먼저 비교합니다.

---

## 9. Tailwind에서 오늘 사용한 핵심 개념

```text
flex
flex-col
flex-1

items-center
justify-between

mx-auto
max-w-7xl

px-6
py-4

min-h-screen

border-t
border-b

text-sm
text-xl

font-bold

sm:
md:
```

특히:

```tsx
<body className="flex min-h-screen flex-col">
```

와:

```tsx
<main className="flex-1">
```

의 조합으로 Header / Main / Footer 구조를 만들었습니다.

```text
Header
│
├───────────────
│
│ Main
│
├───────────────
Footer
```

> **팁**  
> Tailwind를 암기 과목으로 공부하지 마세요. 오늘 사용한 클래스가 실제 화면에서 어떤 역할을 했는지 연결해서 기억하는 편이 좋습니다.

---

# Day 1 핵심 개발 용어

| 日本語 | English | 한국어 |
|---|---|---|
| レイアウト | Layout | 레이아웃 |
| コンポーネント | Component | 컴포넌트 |
| ルーティング | Routing | 라우팅 |
| ルート | Route | 경로 / 라우트 |
| 子要素 | Children | 자식 요소 |
| 共通 | Shared / Common | 공통 |
| 相対パス | Relative Path | 상대 경로 |
| パスエイリアス | Path Alias | 경로 별칭 |
| メタデータ | Metadata | 메타데이터 |
| レスポンシブデザイン | Responsive Design | 반응형 디자인 |
| 本番ビルド | Production Build | 프로덕션 빌드 |
| 依存関係 | Dependency | 의존성 |

> **팁**  
> 영어 용어는 코드를 읽기 위해 익히고, 일본어는 일본 개발 문서나 개발자 커뮤니케이션에서 자연스럽게 알아볼 수 있는 수준을 목표로 합니다.

---

# Day 1 코드 흐름 복습

브라우저가 `/`에 접근하면 현재 구조를 개념적으로 다음과 같이 생각할 수 있다.

```text
Browser
   ↓
Next.js App Router
   ↓
RootLayout
   │
   ├─ Header
   │
   ├─ children
   │     ↓
   │   page.tsx
   │     ↓
   │   HomePage / Hero
   │
   └─ Footer
```

스타일 측면에서는:

```text
globals.css
    ↓
전체 애플리케이션 기본 스타일

Tailwind CSS
    ↓
각 컴포넌트의 레이아웃 및 디자인
```

Import에서는:

```text
@/
↓
src/
```

별칭을 사용한다.

> **팁**  
> 파일을 하나씩 외우기보다 **브라우저 요청 → Layout → Page → Component → Style**의 흐름으로 연결해서 이해하면 좋습니다.

---

# Day 1 자기 점검 문제

## Q1

`layout.tsx`와 `page.tsx`의 차이를 설명할 수 있는가?

## Q2

`children`은 무엇이며 왜 필요한가?

## Q3

Header와 Footer를 각각 모든 `page.tsx`에 작성하지 않은 이유는 무엇인가?

## Q4

Next.js 내부 페이지 이동에서 `Link`를 사용하는 이유는 무엇인가?

## Q5

`@/components/layout/Header`에서 `@/`는 무엇을 의미하는가?

## Q6

왜 현재 Hero를 별도의 `Hero.tsx`로 분리하지 않았는가?

## Q7

다음 클래스가 각각 어떤 역할을 하는가?

```text
flex
flex-col
flex-1
min-h-screen
mx-auto
max-w-7xl
md:flex-row
```

## Q8

`globals.css`에는 어떤 종류의 스타일을 두는 것이 좋은가?

## Q9

`npm run lint`와 `npm run build`는 각각 왜 실행하는가?

## Q10

오늘 만든 프로젝트 구조를 보지 않고 직접 그릴 수 있는가?

> **팁**  
> 답을 바로 확인하지 말고 먼저 자신의 말로 설명해본다. 막히는 항목이 오늘 다시 볼 부분이다.

---

# Day 1 완료 체크리스트

- [x] Next.js 기본 프로젝트 구조 확인
- [x] `globals.css` 정리
- [x] Root Layout 구성
- [x] Metadata 기본 설정
- [x] Header 컴포넌트 생성
- [x] Footer 컴포넌트 생성
- [x] Header / Footer를 Root Layout에 연결
- [x] Home Hero 작성
- [x] `@/` Path Alias 개념 학습
- [x] Tailwind 기본 레이아웃 클래스 사용
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `git status`
- [ ] Git Commit

---

# Day 1 마무리

Day 1에서는 쇼핑몰의 상품, 장바구니, 로그인, DB를 만들지 않았다.

대신 앞으로 모든 기능이 올라갈 기반을 만들었다.

```text
Day 1

Next.js
   ↓
Root Layout
   ↓
Header + Main + Footer
   ↓
Home Page
   ↓
Global Style
   ↓
Path Alias
   ↓
Lint / Build
   ↓
Git Commit
```

다음 단계에서는 이 기반 위에 상품이라는 첫 번째 도메인을 추가한다.

```text
Day 2

Product Type
     ↓
Mock Product Data
     ↓
ProductCard
     ↓
상품 UI
```

하지만 새로운 기능을 추가하기 전에 Day 1의 코드를 자신의 말로 설명할 수 있는지 먼저 확인한다.

> **팁**  
> 이 프로젝트의 목표는 코드를 빨리 많이 만드는 것이 아니라, **작은 기능을 직접 만들고 왜 그렇게 만들었는지 설명할 수 있는 개발자가 되는 것**이다.
