# Shopping Mall Development Summary — Day 1–2
# ショッピングモール開発まとめ — Day 1–2
# 쇼핑몰 개발 정리 — Day 1–2

---

# 日本語

## 1. Day 1–2の全体像

Day 1ではショッピングモールプロジェクトを開発できる土台を作り、Day 2ではその土台の上に商品一覧から商品詳細までの最初の実用的なユーザーフローを構築した。

```text
Day 1
プロジェクトの土台
↓
Day 2
商品データ
↓
商品一覧
↓
商品カード
↓
商品詳細
```

Day 1が「開発を始められる状態」を作る日なら、Day 2は「実際に商品を見る機能」を作る日だった。

> **Tip**  
> Dayごとのコード量だけで比較せず、Day 1は基盤、Day 2は最初の機能フローという役割の違いで振り返る。

## 2. Day 1 — プロジェクトの土台

Day 1ではNext.jsプロジェクトの基本構造を確認し、今後機能を追加していくためのベースを整えた。

プロジェクトではルーティングを担当する`app`と、再利用するコードを置く`src`を役割で分けて扱う構成にした。

```text
project/
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
└─ src/
   ├─ components/
   ├─ data/
   ├─ types/
   └─ lib/
```

> **Tip**  
> フォルダ名だけを暗記せず、`app = route`、`components = UI`、`data = data`、`types = type`、`lib = logic/helper`という責務で覚える。

## 3. `app`と`src`の役割

今回の構造では`app`をプロジェクトルート側に置き、`src`にはコンポーネント、データ、型、共通ロジックなどを整理した。

```text
app/
→ URLとページ

src/components/
→ 再利用するUI

src/data/
→ Mockデータ

src/types/
→ TypeScript型

src/lib/
→ 共通ロジック
```

後から商品機能を追加しても、それぞれのコードをどこに置くべきか判断しやすい構造を目指した。

> **Tip**  
> プロジェクトが大きくなると「文法を知っているか」だけでなく「コードがどこにあるか分かるか」が重要になるため、責務による整理を早い段階から習慣にする。

## 4. Day 2 — `Product`型の作成

Day 2では最初に商品データの形をTypeScriptで定義した。

```ts
export type Product = {
  id: number;
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  image: string;
};
```

価格は計算可能な`number`、文字情報は`string`、画像は画像そのものではなく参照するパスを保存するため`string`を使用した。

> **Tip**  
> 型は値の見た目だけではなく、アプリケーション内でその値をどう利用するかを考えて決める。

## 5. `type`、`interface`、`import type`

これまでの学習経験を振り返りながら、`type`と`interface`の役割を整理した。

今回の商品型は`type`で定義した。

さらに型だけを読み込む場合は次のように`import type`を使用した。

```ts
import type { Product } from "@/types/product";
```

小さなコードでは通常の`import`でも問題が見えにくい場合があるが、型と実行時の値を明確に区別するため`import type`を使用する習慣を取り入れた。

> **Tip**  
> `Product`がブラウザで実行される値なのか、TypeScriptの型チェックだけに必要なのかを考えると`import type`の意味を理解しやすい。

## 6. Mock商品データ

`src/data/products.ts`に実際の商品を想定したMockデータを作成した。

```ts
export const products: Product[] = [
  {
    id: 1,
    name: "...",
    description: "...",
    originalPrice: 39900,
    salePrice: 19900,
    image: "/images/products/...",
  },
];
```

商品データをコンポーネント内へ直接書かず、データファイルとして分離した。

> **Tip**  
> MockデータでもUIと分離しておくと、後でAPIやDBへ置き換えるときに変更範囲を理解しやすい。

## 7. 商品一覧とSemantic HTML

`app/products/page.tsx`を作り、`products.map()`を利用して商品一覧を表示した。

商品は順番そのものに意味があるランキングではなく商品の集合なので、`ol`ではなく`ul`を使用した。

```text
ul
└─ li
   ├─ 商品名
   ├─ 価格
   ├─ 説明
   └─ 画像
```

商品が0件の場合のEmpty Stateも条件分岐で用意した。

> **Tip**  
> HTMLタグはデザインではなく文書構造と意味で選択する。見た目はCSSで変更する。

## 8. `next/image`と`public`

商品画像にはNext.jsの`Image`を使用した。

```tsx
<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={300}
/>
```

画像を表示する過程で、`public`を`src`内部ではなくプロジェクトルートへ配置する必要があることを確認した。

```text
project/
├─ public/
│  └─ images/
│     └─ products/
├─ app/
└─ src/
```

`public`内のファイルはURLでは`public`を含めず、`/images/...`として参照する。

> **Tip**  
> `public`はソースコード用フォルダではなく、ブラウザから参照する静的アセットのルートとして理解する。

## 9. `ProductCard`へのコンポーネント分離

最初は商品1件分のJSXを商品一覧ページに直接書いた。

その後、「商品1件を表示する」という責務が明確になったため`ProductCard`へ分離した。

```text
ProductsPage
→ 商品一覧
→ ul
→ map

ProductCard
→ 商品1件
→ li
→ 商品情報
```

`ul`までカードへ移動させず、一覧の責務はページ側、商品1件の責務はカード側に残した。

> **Tip**  
> コンポーネントを分離するときはコードの長さより「このコンポーネントの仕事を一文で説明できるか」を基準にする。

## 10. `Link`で詳細ページへ移動

商品カードをクリックして詳細へ移動できるようにNext.jsの`Link`を追加した。

```tsx
<Link href={`/products/${product.id}`}>
  ...
</Link>
```

商品IDによって異なるURLが生成される。

```text
1 → /products/1
2 → /products/2
3 → /products/3
```

HTMLの`<a>`が標準リンクであるのに対し、Next.js内部ページの移動にはRouterと統合された`Link`を利用する。

> **Tip**  
> 学習段階では「Next.jsアプリ内部 = Link、外部サイト = a」を基本ルールとして覚える。

## 11. `[id]`動的ルート

商品ごとの詳細ページを作るため、次の構造を追加した。

```text
app/
└─ products/
   ├─ page.tsx
   └─ [id]/
      └─ page.tsx
```

`[id]`は存在する商品だけを許可する仕組みではなく、URLの一部分を動的な値として受け取る仕組みである。

```text
/products/1   → id = "1"
/products/4   → id = "4"
/products/abc → id = "abc"
```

> **Tip**  
> `[id]`は「商品を探す機能」ではなく「URLから値を受け取る機能」と分けて理解する。

## 12. `params`、`Number()`、`find()`

詳細ページではURLから受け取ったIDを使って商品を検索した。

```ts
const { id } = await params;

const productId = Number(id);

const product = products.find(
  (product) => product.id === productId
);
```

URLから受け取る`id`は`string`なので、商品の`number`型IDと比較する前に`Number()`で変換した。

> **Tip**  
> `URL → params → 型変換 → find()`を商品詳細ページの基本データフローとしてまとめて覚える。

## 13. `notFound()`と404

動的ルートは`/products/4`や`/products/abc`のようなURLも受け取るため、商品が実際に存在するか確認した。

```ts
if (!product) {
  notFound();
}
```

これによって、

```text
存在するID
→ 商品詳細

存在しないID
→ 404
```

という処理が完成した。

また、このチェック以降は`product`が存在することが保証されるため、`product?.name`のようなOptional Chainingを不要にできることも確認した。

> **Tip**  
> 必須データは`?.`で問題を隠すより、先に存在確認をして以降のコードでは確定した値として扱う。

## 14. 商品詳細ページ

最終的な商品詳細では次の情報を表示した。

```text
商品画像
商品名
商品説明
通常価格
販売価格
割引率
```

割引率は保存せず、価格から計算した。

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
);
```

これにより商品一覧から詳細まで実際の商品データがつながった。

> **Tip**  
> 元データから計算できる値は、重複保存が本当に必要か考えてからデータモデルへ追加する。

## 15. Day 1–2で完成した全体フロー

```text
Day 1
プロジェクトの土台
↓
app / srcの責務整理
↓
Day 2
Product type
↓
Mock products
↓
/products
↓
products.map()
↓
ProductCard
↓
Image
↓
Link
↓
/products/${product.id}
↓
[id]
↓
params.id
↓
Number(id)
↓
products.find()
↓
商品あり？
├─ Yes → 商品詳細
└─ No  → notFound() → 404
```

> **Tip**  
> Day 1–2を復習するときは個別の文法一覧ではなく、この1本の流れを上から説明できるか確認する。

## 16. Day 2終了時点

Day 2終了時点では、ユーザーが商品一覧を見て、商品を選び、その商品の詳細情報を確認できるところまで完成した。

次のDay 3ではこの流れをさらに進める。

```text
Day 1
開発できる土台

Day 2
商品を見る

Day 3
商品を選択してカートへ入れる
```

> **Tip**  
> 新しいDayを始める前に前日の完成地点を確認すると、「次に何を作るべきか」が機能の流れとして自然につながる。

---

# English

## 1. Day 1–2 Overview

Day 1 established the foundation for developing the shopping mall project, and Day 2 built the first practical user flow on top of that foundation: moving from a product list to a product detail page.

```text
Day 1
Project foundation
↓
Day 2
Product data
↓
Product list
↓
Product card
↓
Product detail
```

Day 1 created a state where development could begin, while Day 2 created the first real product-browsing feature.

> **Tip**  
> Do not compare the days only by the amount of code. Review them by responsibility: Day 1 was foundation work, while Day 2 completed the first feature flow.

## 2. Day 1 — Project Foundation

Day 1 focused on understanding the basic Next.js project structure and preparing a base that could grow as more features were added.

The project separates the routing-oriented `app` directory from reusable application code organized under `src`.

```text
project/
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
└─ src/
   ├─ components/
   ├─ data/
   ├─ types/
   └─ lib/
```

> **Tip**  
> Remember directories by responsibility: `app = routes`, `components = UI`, `data = data`, `types = types`, and `lib = logic/helpers`.

## 3. Responsibilities of `app` and `src`

In this project structure, `app` remains at the project root, while reusable components, data, types, and shared logic are organized under `src`.

```text
app/
→ URLs and pages

src/components/
→ Reusable UI

src/data/
→ Mock data

src/types/
→ TypeScript types

src/lib/
→ Shared logic
```

This makes it easier to decide where code belongs as the project becomes larger.

> **Tip**  
> In larger projects, knowing syntax is not enough. Being able to locate responsibilities quickly is equally important.

## 4. Day 2 — Creating the `Product` Type

Day 2 began by defining the structure of product data with TypeScript.

```ts
export type Product = {
  id: number;
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  image: string;
};
```

Prices use `number` because calculations are required. Textual values use `string`, and the image also uses `string` because it stores a path rather than the image file itself.

> **Tip**  
> Choose types based on how values are used by the application, not only on how they visually appear.

## 5. `type`, `interface`, and `import type`

Previous experience with both `interface` and `type` was reviewed, and the product model in this project was defined with `type`.

When a module is imported only for TypeScript type checking, `import type` is used.

```ts
import type { Product } from "@/types/product";
```

Small projects may make the distinction less noticeable, but explicitly separating types from runtime values improves clarity as a project grows.

> **Tip**  
> Ask whether `Product` is a runtime JavaScript value or something needed only by TypeScript. That distinction makes `import type` easier to understand.

## 6. Mock Product Data

Mock products were created in `src/data/products.ts`.

```ts
export const products: Product[] = [
  {
    id: 1,
    name: "...",
    description: "...",
    originalPrice: 39900,
    salePrice: 19900,
    image: "/images/products/...",
  },
];
```

Product data was separated from UI components instead of being written directly inside them.

> **Tip**  
> Keeping mock data separate from UI makes the later transition to an API or database easier to reason about.

## 7. Product List and Semantic HTML

`app/products/page.tsx` was created, and `products.map()` renders multiple products.

Because the products are a collection rather than an ordered ranking, `ul` was used instead of `ol`.

```text
ul
└─ li
   ├─ Product name
   ├─ Price
   ├─ Description
   └─ Image
```

An Empty State was also added for an empty product array.

> **Tip**  
> Choose HTML elements according to document meaning and structure. Use CSS for visual appearance.

## 8. `next/image` and `public`

Product images were rendered using Next.js `Image`.

```tsx
<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={300}
/>
```

While implementing images, it was confirmed that `public` belongs at the project root rather than inside `src`.

```text
project/
├─ public/
│  └─ images/
│     └─ products/
├─ app/
└─ src/
```

Files inside `public` are referenced without including `public` in the browser URL, such as `/images/...`.

> **Tip**  
> Think of `public` as the root for static assets exposed to the browser rather than as a source-code directory.

## 9. Extracting `ProductCard`

Initially, the JSX for one product lived directly in the product list page.

Once “render one product” became a clear responsibility, it was extracted into `ProductCard`.

```text
ProductsPage
→ Product collection
→ ul
→ map

ProductCard
→ One product
→ li
→ Product information
```

The `ul` remains with the list page while `li` belongs to the individual card.

> **Tip**  
> Extract components based on independently describable responsibilities rather than file length alone.

## 10. Navigating with `Link`

Next.js `Link` was added so that clicking a product card can open its detail page.

```tsx
<Link href={`/products/${product.id}`}>
  ...
</Link>
```

Different product IDs generate different URLs.

```text
1 → /products/1
2 → /products/2
3 → /products/3
```

While HTML `<a>` is the standard web link element, `Link` integrates with the Next.js router for internal navigation.

> **Tip**  
> At this stage, a useful basic rule is `inside the Next.js app = Link`, `external website = a`.

## 11. The `[id]` Dynamic Route

A dynamic route was added for product-specific detail pages.

```text
app/
└─ products/
   ├─ page.tsx
   └─ [id]/
      └─ page.tsx
```

`[id]` does not mean that only existing products are accepted. It captures a dynamic part of the URL.

```text
/products/1   → id = "1"
/products/4   → id = "4"
/products/abc → id = "abc"
```

> **Tip**  
> Separate the responsibilities: `[id]` captures a URL value; it does not perform the product lookup itself.

## 12. `params`, `Number()`, and `find()`

The detail page uses the ID from the URL to locate a product.

```ts
const { id } = await params;

const productId = Number(id);

const product = products.find(
  (product) => product.id === productId
);
```

Because the URL ID is a `string`, it is converted with `Number()` before comparison with numeric product IDs.

> **Tip**  
> Remember the detail-page data flow as `URL → params → type conversion → find()`.

## 13. `notFound()` and 404 Handling

Because a dynamic route also accepts URLs such as `/products/4` and `/products/abc`, the page verifies that a matching product actually exists.

```ts
if (!product) {
  notFound();
}
```

The resulting behavior is:

```text
Existing ID
→ Product detail

Missing ID
→ 404
```

After this check, `product` is known to exist, so unnecessary Optional Chaining such as `product?.name` can be removed.

> **Tip**  
> For required data, validate it first rather than hiding missing-data cases with `?.`.

## 14. Product Detail Page

The final detail page displays:

```text
Product image
Product name
Product description
Original price
Sale price
Discount rate
```

The discount rate is calculated rather than stored separately.

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
);
```

This completed the connection between the product list and the actual data shown on each detail page.

> **Tip**  
> Before storing a derived value, consider whether it can be calculated reliably from existing source data.

## 15. Complete Day 1–2 Flow

```text
Day 1
Project foundation
↓
Organize app / src responsibilities
↓
Day 2
Product type
↓
Mock products
↓
/products
↓
products.map()
↓
ProductCard
↓
Image
↓
Link
↓
/products/${product.id}
↓
[id]
↓
params.id
↓
Number(id)
↓
products.find()
↓
Product exists?
├─ Yes → Product detail
└─ No  → notFound() → 404
```

> **Tip**  
> When reviewing Day 1–2, try to explain this complete flow from top to bottom instead of memorizing a list of isolated syntax features.

## 16. Status at the End of Day 2

By the end of Day 2, the user can view the product list, select a product, and see that product's detail information.

Day 3 naturally continues this flow.

```text
Day 1
Build the development foundation

Day 2
View products

Day 3
Select a product and add it to the cart
```

> **Tip**  
> Before starting a new day, identify the exact completion point from the previous day. The next feature then becomes a natural continuation of the user flow.

---

# 한국어

## 1. Day 1–2 전체 흐름

Day 1에서는 쇼핑몰 프로젝트를 개발할 수 있는 밑바탕을 만들었고, Day 2에서는 그 위에 **상품 목록에서 상품 상세까지 이어지는 첫 번째 실질적인 사용자 흐름**을 만들었다.

```text
Day 1
프로젝트 밑바탕
↓
Day 2
상품 데이터
↓
상품 목록
↓
상품 카드
↓
상품 상세
```

Day 1이 `개발을 시작할 수 있는 상태`를 만드는 날이었다면 Day 2는 실제로 `상품을 볼 수 있는 기능`을 만드는 날이었다.

> **팁**  
> Day별 코드 양만 비교하지 말고 Day 1은 기반, Day 2는 첫 기능 흐름이라는 역할의 차이로 복습한다.

## 2. Day 1 — 프로젝트 밑바탕

Day 1에서는 Next.js 프로젝트의 기본 구조를 확인하고 앞으로 기능을 하나씩 추가할 수 있도록 기반을 정리했다.

프로젝트에서는 라우팅을 담당하는 `app`과 재사용할 코드를 정리하는 `src`를 역할에 따라 나누는 구조를 사용했다.

```text
project/
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
└─ src/
   ├─ components/
   ├─ data/
   ├─ types/
   └─ lib/
```

> **팁**  
> 폴더 이름만 외우지 말고 `app = 라우트`, `components = UI`, `data = 데이터`, `types = 타입`, `lib = 공통 로직/도우미`처럼 책임으로 기억한다.

## 3. `app`과 `src`의 역할

현재 프로젝트에서는 `app`을 프로젝트 루트에 두고 `src`에는 컴포넌트, 데이터, 타입, 공통 로직 등을 정리했다.

```text
app/
→ URL과 페이지

src/components/
→ 재사용 UI

src/data/
→ Mock 데이터

src/types/
→ TypeScript 타입

src/lib/
→ 공통 로직
```

프로젝트가 커지더라도 코드가 어디에 있어야 하는지 판단하기 쉬운 구조를 목표로 했다.

> **팁**  
> 프로젝트가 커지면 문법을 알고 있는 것뿐 아니라 `어디에 무엇이 있는지` 빠르게 파악하는 능력이 중요해지므로 책임에 따라 코드를 정리하는 습관을 만든다.

## 4. Day 2 — `Product` 타입 작성

Day 2에서는 먼저 상품 데이터의 형태를 TypeScript로 정의했다.

```ts
export type Product = {
  id: number;
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  image: string;
};
```

가격은 계산할 수 있어야 하므로 `number`, 상품명과 설명은 `string`, 이미지는 이미지 자체가 아니라 이미지 위치를 나타내는 경로를 저장하므로 `string`으로 정의했다.

> **팁**  
> 타입은 값이 어떻게 보이는지만 보고 결정하지 말고 애플리케이션에서 그 값을 어떻게 사용할지를 기준으로 정한다.

## 5. `type`, `interface`, `import type`

기존 학습에서 사용했던 `interface`와 `type`의 차이를 다시 정리했고 이번 상품 모델은 `type`으로 정의했다.

또한 실행 시 필요한 값이 아니라 타입만 가져올 때는 다음처럼 `import type`을 사용했다.

```ts
import type { Product } from "@/types/product";
```

작은 프로젝트에서는 일반 `import`와의 차이가 잘 드러나지 않을 수 있지만 프로젝트가 커질수록 타입과 런타임 값을 명확하게 구분하는 습관을 적용하기로 했다.

> **팁**  
> `Product`가 브라우저에서 실제로 실행되는 JavaScript 값인지, TypeScript의 타입 검사에만 필요한 것인지 생각하면 `import type`을 이해하기 쉽다.

## 6. Mock 상품 데이터

`src/data/products.ts`에 실제 쇼핑몰 상품을 가정한 Mock 데이터를 만들었다.

```ts
export const products: Product[] = [
  {
    id: 1,
    name: "...",
    description: "...",
    originalPrice: 39900,
    salePrice: 19900,
    image: "/images/products/...",
  },
];
```

상품 데이터를 컴포넌트 내부에 직접 작성하지 않고 별도의 데이터 파일로 분리했다.

> **팁**  
> Mock 데이터 단계에서도 UI와 데이터를 분리해두면 나중에 API나 DB로 바꿀 때 어떤 부분을 교체해야 하는지 이해하기 쉬워진다.

## 7. 상품 목록과 시맨틱 HTML

`app/products/page.tsx`를 만들고 `products.map()`을 사용해 여러 상품을 목록으로 표시했다.

상품 목록은 순위처럼 순서 자체가 중요한 데이터가 아니므로 `ol`이 아니라 `ul`을 사용했다.

```text
ul
└─ li
   ├─ 상품명
   ├─ 가격
   ├─ 설명
   └─ 이미지
```

상품이 하나도 없을 경우를 위한 Empty State도 조건 분기로 만들었다.

> **팁**  
> HTML 태그는 디자인을 기준으로 선택하지 않고 문서 구조와 콘텐츠의 의미를 기준으로 선택한다. 모양은 CSS의 책임이다.

## 8. `next/image`와 `public`

상품 이미지는 Next.js의 `Image` 컴포넌트를 사용했다.

```tsx
<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={300}
/>
```

이미지를 띄우는 과정에서 `public`은 `src` 내부가 아니라 프로젝트 루트에 위치해야 한다는 것도 직접 확인했다.

```text
project/
├─ public/
│  └─ images/
│     └─ products/
├─ app/
└─ src/
```

`public` 안의 파일은 URL에서 `public`을 제외하고 `/images/...` 형태로 접근한다.

> **팁**  
> `public`은 소스 코드를 넣는 폴더가 아니라 브라우저에서 URL로 접근할 정적 파일의 루트라고 이해한다.

## 9. `ProductCard`로 컴포넌트 책임 분리

처음에는 상품 하나를 출력하는 JSX도 상품 목록 페이지 안에 직접 작성했다.

이후 `상품 하나를 표시한다`라는 독립적인 책임이 명확해지면서 `ProductCard`로 분리했다.

```text
ProductsPage
→ 상품 목록
→ ul
→ map

ProductCard
→ 상품 하나
→ li
→ 상품 정보
```

`ul`까지 카드 안으로 옮기지 않고 목록의 책임은 페이지에, 상품 하나의 책임은 카드에 두었다.

> **팁**  
> 컴포넌트를 나눌 때 코드 줄 수보다 `이 컴포넌트가 하는 일을 한 문장으로 설명할 수 있는가?`를 기준으로 판단한다.

## 10. `Link`로 상품 상세 이동

상품 카드를 클릭해서 상세 페이지로 이동할 수 있도록 Next.js의 `Link`를 사용했다.

```tsx
<Link href={`/products/${product.id}`}>
  ...
</Link>
```

상품 ID에 따라 서로 다른 상세 URL이 만들어진다.

```text
1 → /products/1
2 → /products/2
3 → /products/3
```

HTML의 `<a>`가 웹의 기본 링크라면 Next.js 애플리케이션 내부 페이지 이동에는 Router와 통합된 `Link`를 사용한다.

> **팁**  
> 현재 단계에서는 `Next.js 앱 내부 = Link`, `외부 사이트 = a`를 기본 규칙으로 기억하면 충분하다.

## 11. `[id]` 동적 라우트

상품별 상세 페이지를 만들기 위해 다음 구조를 추가했다.

```text
app/
└─ products/
   ├─ page.tsx
   └─ [id]/
      └─ page.tsx
```

`[id]`는 존재하는 상품만 허용하는 기능이 아니라 URL 일부를 동적인 값으로 받아오는 기능이다.

```text
/products/1   → id = "1"
/products/4   → id = "4"
/products/abc → id = "abc"
```

> **팁**  
> `[id]`는 상품을 찾는 기능이 아니라 `URL의 값을 받는 기능`이라고 분리해서 이해한다.

## 12. `params`, `Number()`, `find()`

상세 페이지에서는 URL에서 받은 ID를 이용해 실제 상품을 조회했다.

```ts
const { id } = await params;

const productId = Number(id);

const product = products.find(
  (product) => product.id === productId
);
```

URL의 `id`는 `string`이므로 `number`인 상품 ID와 비교하기 전에 `Number()`로 변환했다.

> **팁**  
> 상품 상세의 기본 흐름을 `URL → params → 타입 변환 → find()`라는 하나의 데이터 흐름으로 기억한다.

## 13. `notFound()`와 404

동적 라우트는 `/products/4`, `/products/abc` 같은 주소도 받을 수 있기 때문에 해당 상품이 실제로 존재하는지 확인했다.

```ts
if (!product) {
  notFound();
}
```

결과적으로:

```text
존재하는 ID
→ 상품 상세

존재하지 않는 ID
→ 404
```

가 되었다.

또한 이 검사 이후에는 `product`가 존재한다는 것이 확정되므로 `product?.name`처럼 불필요한 Optional Chaining을 제거할 수 있다는 것도 확인했다.

> **팁**  
> 반드시 있어야 하는 데이터라면 `?.`로 문제를 숨기기보다 앞에서 존재 여부를 검사하고 이후에는 확정된 값으로 사용한다.

## 14. 상품 상세 페이지

최종 상품 상세 페이지에서는 다음 데이터를 모두 표시했다.

```text
상품 이미지
상품명
상품 설명
정상가
판매가
할인율
```

할인율은 별도로 저장하지 않고 가격을 이용해 계산했다.

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
);
```

이를 통해 상품 목록에서 실제 상품 상세 데이터까지 연결되는 흐름을 완성했다.

> **팁**  
> 기존 데이터로 계산 가능한 값은 데이터 모델에 중복 저장하기 전에 정말 저장할 필요가 있는지 먼저 판단한다.

## 15. Day 1–2에서 완성한 전체 흐름

```text
Day 1
프로젝트 밑바탕
↓
app / src 책임 정리
↓
Day 2
Product type
↓
Mock products
↓
/products
↓
products.map()
↓
ProductCard
↓
Image
↓
Link
↓
/products/${product.id}
↓
[id]
↓
params.id
↓
Number(id)
↓
products.find()
↓
상품이 있는가?
├─ Yes → 상품 상세
└─ No  → notFound() → 404
```

> **팁**  
> Day 1–2를 복습할 때 개별 문법 목록을 외우기보다 위 흐름을 처음부터 끝까지 자신의 말로 설명할 수 있는지 확인한다.

## 16. Day 2 종료 시점과 다음 단계

Day 2 종료 시점에는 사용자가 상품 목록을 보고, 원하는 상품을 선택하고, 해당 상품의 상세 정보를 확인할 수 있는 단계까지 완성했다.

이제 Day 3는 이 흐름에서 자연스럽게 이어진다.

```text
Day 1
개발할 수 있는 밑바탕

Day 2
상품을 볼 수 있음

Day 3
상품을 선택해서 장바구니에 담음
```

> **팁**  
> 새로운 Day를 시작하기 전에 이전 Day의 정확한 완료 지점을 확인하면 다음 기능이 별개의 공부가 아니라 하나의 서비스 흐름으로 연결된다.
