# Shopping Mall Development Log — Day 2
# ショッピングモール開発記録 — Day 2
# 쇼핑몰 개발 기록 — Day 2

---

# 日本語

## 1. Day 2の目標

Day 1で作成したプロジェクトの土台の上に、Day 2では「商品一覧から商品詳細へ移動できる基本的な商品閲覧フロー」を構築した。

今回の完成フローは次の通り。

```text
商品データ
↓
商品一覧
↓
ProductCard
↓
Link
↓
/products/[id]
↓
商品検索
↓
商品詳細
```

単に画面へ商品を表示するだけではなく、データ型、コンポーネント責務、ルーティング、存在しない商品への404処理まで含めて実装した。

> **Tip**  
> Day単位の記録では、作った画面の数より「どのユーザーフローが完成したか」を基準に振り返る。

## 2. Product型の定義

商品データの形をTypeScriptで定義した。

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

価格は計算に使用するため`number`、商品名と説明は`string`、画像は画像ファイルそのものではなく参照先のパスを保存するため`string`とした。

> **Tip**  
> 型を決めるときは見た目ではなく、その値をアプリケーションでどのように使用するかを考える。

## 3. Mock商品データの作成

`src/data/products.ts`に`Product[]`型の商品データを作成した。

```ts
import type { Product } from "@/types/product";

export const products: Product[] = [
  // product data
];
```

型だけを読み込む場合は`import type`を使用した。

これにより、商品データの構造が`Product`型と一致しているかTypeScriptで確認できる。

> **Tip**  
> Mockデータでも型を適用しておくと、後でAPIやDBへ移行するときにUI側のデータ構造を維持しやすい。

## 4. 商品一覧ページ

`app/products/page.tsx`で商品配列を`map()`し、複数の商品を一覧として表示した。

商品が存在しない場合のEmpty Stateも条件分岐で用意した。

```text
products.length === 0
→ 登録された商品がありません

商品あり
→ products.map(...)
```

リスト全体は`ul`、各商品は`li`として構成した。

> **Tip**  
> HTMLタグはデザインのためだけではなく、コンテンツの意味と構造を表すために選択する。

## 5. `next/image`と`public`

商品画像はNext.jsの`Image`コンポーネントで表示した。

```tsx
<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={300}
/>
```

この過程で、`public`は`src/public`ではなくプロジェクトルートに配置する必要があることを確認した。

```text
project/
├─ public/
│  └─ images/
└─ src/
```

`public/images/products/...`のファイルはブラウザから`/images/products/...`として参照した。

> **Tip**  
> `src`は主にアプリケーションコード、`public`はURLから参照する静的ファイルという役割で区別する。

## 6. `ProductCard`への責務分離

最初は商品1件のJSXも`products/page.tsx`内に存在していたが、「商品1件を表示する」という独立した責務が明確になったため`ProductCard`へ分離した。

```text
ProductsPage
→ 商品一覧を管理
→ ul
→ map

ProductCard
→ 商品1件を表示
→ li
→ 商品名 / 価格 / 説明 / 画像
```

`key`は`map()`で繰り返しを生成する親側に配置した。

> **Tip**  
> コンポーネントは行数ではなく「一文で説明できる独立した責務」が生まれたタイミングで分離する。

## 7. `Link`による商品詳細への移動

`ProductCard`にNext.jsの`Link`を追加し、商品IDをURLへ渡した。

```tsx
<Link href={`/products/${product.id}`}>
  ...
</Link>
```

これにより、

```text
id = 1 → /products/1
id = 2 → /products/2
id = 3 → /products/3
```

のように商品ごとの詳細URLへ移動できるようになった。

> **Tip**  
> Next.jsアプリ内部のページ移動では`Link`を使い、UIとNext.js Routerを接続する。

## 8. `[id]`動的ルート

商品詳細用に次の構造を作成した。

```text
app/
└─ products/
   ├─ page.tsx
   └─ [id]/
      └─ page.tsx
```

`[id]`は存在する商品だけを許可するものではなく、URLの値を動的に受け取るルートである。

```text
/products/1   → id = "1"
/products/4   → id = "4"
/products/abc → id = "abc"
```

> **Tip**  
> 動的ルートは値を受け取る仕組みであり、その値が有効なデータかどうかの確認は別の処理として考える。

## 9. `params`と商品検索

詳細ページでは`params`から`id`を取得した。

```ts
const { id } = await params;
```

URLのIDは`string`なので、商品データの`number`型IDと比較するため変換した。

```ts
const productId = Number(id);
```

その後`find()`で商品1件を検索した。

```ts
const product = products.find(
  (product) => product.id === productId
);
```

> **Tip**  
> 詳細ページの基本フローを`URL → params → 型変換 → データ検索`として覚える。

## 10. `notFound()`による404処理

`find()`で商品が見つからなかった場合は`undefined`になる。

そのためNext.jsの`notFound()`を使用した。

```ts
if (!product) {
  notFound();
}
```

結果として存在しない商品IDや不正なURLは404として処理できる。

```text
/products/1   → 商品詳細
/products/4   → 404
/products/abc → 404
```

> **Tip**  
> URLはユーザーが自由に変更できるため、URLの値を信頼せず実際のデータが存在するか確認する。

## 11. 商品詳細ページ

検索した商品を利用して、詳細ページに次の情報を表示した。

```text
商品画像
商品名
商品説明
通常価格
販売価格
割引率
```

割引率は保存せず、通常価格と販売価格から計算した。

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
);
```

> **Tip**  
> 既存データから計算できる値は、必要性がない限り重複して保存せず計算する方法を検討する。

## 12. Day 2で完成した全体フロー

```text
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
next/image
↓
Link
↓
/products/${product.id}
↓
[id]/page.tsx
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

Day 2では、商品データが一覧から詳細ページまで流れる基本構造を完成させた。

> **Tip**  
> 個別の文法より、ユーザーが商品をクリックして詳細情報を見るまでの一連のデータとルーティングの流れを復習する。

## 13. Day 2終了時のプロジェクト構造

```text
project/
├─ app/
│  └─ products/
│     ├─ page.tsx
│     └─ [id]/
│        └─ page.tsx
├─ public/
│  └─ images/
│     └─ products/
└─ src/
   ├─ components/
   │  └─ product/
   │     └─ ProductCard.tsx
   ├─ data/
   │  └─ products.ts
   └─ types/
      └─ product.ts
```

> **Tip**  
> フォルダ構造もコードと同様に責務で覚える。`app = route`、`components = UI`、`data = data`、`types = type`、`public = static assets`と考える。

## 14. Day 3へ

Day 2では商品の閲覧フローを完成させた。

Day 3ではこの商品詳細を基盤に、ショッピングモールらしい次の機能を追加していく。

候補は商品オプション、数量、カート追加、カート状態などである。

```text
Day 2
商品を見る
↓
Day 3
商品を選択してカートへ追加する
```

> **Tip**  
> Day 3でも一度に多くの機能を追加せず、「商品をカートへ入れる」という1つのユーザーフローを小さく分解して実装する。

---

# English

## 1. Day 2 Goal

Building on the project foundation created on Day 1, Day 2 focused on creating the basic product-browsing flow from the product list to a product detail page.

The completed flow is:

```text
Product data
↓
Product list
↓
ProductCard
↓
Link
↓
/products/[id]
↓
Product lookup
↓
Product detail
```

The work included not only rendering products, but also data typing, component responsibility separation, routing, and 404 handling for missing products.

> **Tip**  
> In a daily development log, review which user flow was completed rather than only counting how many screens were created.

## 2. Defining the Product Type

The shape of product data was defined with TypeScript.

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

Prices use `number` because they are used in calculations. The name and description use `string`, and the image uses `string` because it stores the path to the image rather than the image file itself.

> **Tip**  
> Choose a type based on how the value will be used by the application, not only on how the value looks.

## 3. Creating Mock Product Data

Product data typed as `Product[]` was created in `src/data/products.ts`.

```ts
import type { Product } from "@/types/product";

export const products: Product[] = [
  // product data
];
```

Because `Product` is used only as a type, it is imported with `import type`.

This allows TypeScript to verify that the mock product data follows the `Product` structure.

> **Tip**  
> Apply types even to mock data. It makes it easier to preserve the UI data contract when moving to an API or database later.

## 4. Product List Page

In `app/products/page.tsx`, the product array is rendered as a list using `map()`.

An Empty State was also added for the case where no products exist.

```text
products.length === 0
→ No registered products

Products exist
→ products.map(...)
```

The entire collection uses `ul`, while each product is represented by `li`.

> **Tip**  
> Choose HTML elements for the meaning and structure of the content, not only for visual styling.

## 5. `next/image` and `public`

Product images were rendered with the Next.js `Image` component.

```tsx
<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={300}
/>
```

During this step, we confirmed that `public` belongs at the project root rather than under `src/public`.

```text
project/
├─ public/
│  └─ images/
└─ src/
```

A file stored at `public/images/products/...` is referenced from the browser as `/images/products/...`.

> **Tip**  
> Think of `src` mainly as application source code and `public` as static files exposed through URLs.

## 6. Separating the `ProductCard` Responsibility

Initially, the JSX for one product was also inside `products/page.tsx`.

Once “render one product” became a clear independent responsibility, it was extracted into `ProductCard`.

```text
ProductsPage
→ Manage the product list
→ ul
→ map

ProductCard
→ Render one product
→ li
→ Name / price / description / image
```

The `key` remains on the parent side where `map()` creates repeated components.

> **Tip**  
> Split a component when an independently describable responsibility appears, not simply when the file reaches a certain number of lines.

## 7. Navigating to Product Details with `Link`

Next.js `Link` was added to `ProductCard`, passing the product ID through the URL.

```tsx
<Link href={`/products/${product.id}`}>
  ...
</Link>
```

This creates product-specific detail URLs.

```text
id = 1 → /products/1
id = 2 → /products/2
id = 3 → /products/3
```

> **Tip**  
> For navigation inside a Next.js application, use `Link` to connect the UI to the Next.js Router.

## 8. The `[id]` Dynamic Route

The product detail route was created with this structure:

```text
app/
└─ products/
   ├─ page.tsx
   └─ [id]/
      └─ page.tsx
```

`[id]` does not restrict the route to existing products. It dynamically captures a value from the URL.

```text
/products/1   → id = "1"
/products/4   → id = "4"
/products/abc → id = "abc"
```

> **Tip**  
> A dynamic route captures a value. Validating whether that value represents real data is a separate responsibility.

## 9. `params` and Product Lookup

The detail page receives the `id` through `params`.

```ts
const { id } = await params;
```

Because a URL ID is a `string`, it is converted before comparing it with the numeric product ID.

```ts
const productId = Number(id);
```

Then `find()` retrieves one matching product.

```ts
const product = products.find(
  (product) => product.id === productId
);
```

> **Tip**  
> Remember the basic detail-page flow as `URL → params → type conversion → data lookup`.

## 10. 404 Handling with `notFound()`

When `find()` cannot find a product, the result is `undefined`.

Next.js `notFound()` was used for this case.

```ts
if (!product) {
  notFound();
}
```

Missing product IDs and invalid URL values can therefore be handled as 404 responses.

```text
/products/1   → Product detail
/products/4   → 404
/products/abc → 404
```

> **Tip**  
> A URL is user-controlled input. Do not trust the value directly; verify that corresponding data actually exists.

## 11. Product Detail Page

The retrieved product is used to display:

```text
Product image
Product name
Product description
Original price
Sale price
Discount rate
```

The discount rate is calculated from the original price and sale price instead of being stored separately.

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
);
```

> **Tip**  
> If a value can be reliably derived from existing data, consider calculating it instead of storing duplicate data unnecessarily.

## 12. Complete Day 2 Flow

```text
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
next/image
↓
Link
↓
/products/${product.id}
↓
[id]/page.tsx
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

Day 2 completed the basic structure that moves product data from the product list into the corresponding detail page.

> **Tip**  
> Review the complete data and routing flow from clicking a product to seeing its details instead of memorizing each syntax feature independently.

## 13. Project Structure at the End of Day 2

```text
project/
├─ app/
│  └─ products/
│     ├─ page.tsx
│     └─ [id]/
│        └─ page.tsx
├─ public/
│  └─ images/
│     └─ products/
└─ src/
   ├─ components/
   │  └─ product/
   │     └─ ProductCard.tsx
   ├─ data/
   │  └─ products.ts
   └─ types/
      └─ product.ts
```

> **Tip**  
> Remember folders by responsibility: `app = routes`, `components = UI`, `data = data`, `types = types`, and `public = static assets`.

## 14. Moving to Day 3

Day 2 completed the product-browsing flow.

Day 3 can build on the product detail page by adding shopping behavior such as product options, quantity, adding to cart, and cart state.

```text
Day 2
View a product
↓
Day 3
Select a product and add it to the cart
```

> **Tip**  
> On Day 3, continue to break one user flow—“add a product to the cart”—into small implementation steps instead of adding many features at once.

---

# 한국어

## 1. Day 2 목표

Day 1에서 만든 프로젝트 밑바탕 위에 Day 2에서는 **상품 목록에서 상품 상세 페이지까지 이동할 수 있는 기본 상품 탐색 흐름**을 만들었다.

이번에 완성한 흐름은 다음과 같다.

```text
상품 데이터
↓
상품 목록
↓
ProductCard
↓
Link
↓
/products/[id]
↓
상품 조회
↓
상품 상세
```

단순히 화면에 상품을 출력하는 데서 끝내지 않고 데이터 타입, 컴포넌트 책임 분리, 라우팅, 존재하지 않는 상품에 대한 404 처리까지 구현했다.

> **팁**  
> Day 단위 개발 기록에서는 화면을 몇 개 만들었는지보다 어떤 사용자 흐름 하나를 완성했는지를 기준으로 돌아본다.

## 2. Product 타입 정의

상품 데이터의 형태를 TypeScript로 정의했다.

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

가격은 계산에 사용해야 하므로 `number`, 상품명과 설명은 `string`, 이미지는 이미지 파일 자체가 아니라 이미지 위치를 나타내는 경로를 저장하므로 `string`으로 정의했다.

> **팁**  
> 타입을 정할 때는 값이 어떻게 생겼는지만 보지 말고 애플리케이션에서 그 값을 어떻게 사용할지를 기준으로 생각한다.

## 3. Mock 상품 데이터 작성

`src/data/products.ts`에 `Product[]` 타입의 상품 데이터를 만들었다.

```ts
import type { Product } from "@/types/product";

export const products: Product[] = [
  // product data
];
```

`Product`는 실행 시 필요한 값이 아니라 타입으로만 사용하므로 `import type`을 사용했다.

이를 통해 Mock 상품 데이터가 `Product` 구조에 맞는지 TypeScript가 검사할 수 있게 했다.

> **팁**  
> Mock 데이터 단계에서도 타입을 적용하면 나중에 API나 DB로 전환할 때 UI에서 사용하는 데이터 계약을 유지하기 쉬워진다.

## 4. 상품 목록 페이지

`app/products/page.tsx`에서 상품 배열을 `map()`으로 반복하여 여러 상품을 목록으로 표시했다.

상품이 존재하지 않는 경우를 위한 Empty State도 조건 분기로 만들었다.

```text
products.length === 0
→ 등록된 상품이 없습니다

상품 있음
→ products.map(...)
```

목록 전체는 `ul`, 상품 하나는 `li`로 구성했다.

> **팁**  
> HTML 태그는 디자인을 위해서만 고르는 것이 아니라 콘텐츠의 의미와 문서 구조를 표현하기 위해 선택한다.

## 5. `next/image`와 `public`

상품 이미지는 Next.js의 `Image` 컴포넌트를 사용해 표시했다.

```tsx
<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={300}
/>
```

이 과정에서 `public`은 `src/public`이 아니라 프로젝트 루트에 위치해야 한다는 것도 직접 확인했다.

```text
project/
├─ public/
│  └─ images/
└─ src/
```

`public/images/products/...`에 있는 파일은 브라우저에서 `/images/products/...` 경로로 사용한다.

> **팁**  
> `src`는 주로 애플리케이션 소스 코드, `public`은 URL로 접근하는 정적 파일이라는 역할로 구분한다.

## 6. `ProductCard`로 책임 분리

처음에는 상품 하나를 표시하는 JSX도 `products/page.tsx` 안에 있었다.

개발하면서 **상품 하나를 표시한다**는 독립적인 책임이 명확해져 해당 부분을 `ProductCard`로 분리했다.

```text
ProductsPage
→ 상품 목록 관리
→ ul
→ map

ProductCard
→ 상품 하나 표시
→ li
→ 상품명 / 가격 / 설명 / 이미지
```

`key`는 `map()`으로 반복 컴포넌트를 만드는 부모 쪽에 위치시켰다.

> **팁**  
> 컴포넌트는 코드 줄 수가 많아졌다는 이유보다 한 문장으로 설명 가능한 독립적인 책임이 생겼을 때 분리한다.

## 7. `Link`로 상품 상세 이동

`ProductCard`에 Next.js의 `Link`를 추가하고 상품 ID를 URL로 전달했다.

```tsx
<Link href={`/products/${product.id}`}>
  ...
</Link>
```

이를 통해 상품별 상세 URL을 만들었다.

```text
id = 1 → /products/1
id = 2 → /products/2
id = 3 → /products/3
```

> **팁**  
> Next.js 애플리케이션 내부 페이지 이동에서는 `Link`를 사용해 UI와 Next.js Router를 연결한다.

## 8. `[id]` 동적 라우트

상품 상세 페이지를 위해 다음 구조를 만들었다.

```text
app/
└─ products/
   ├─ page.tsx
   └─ [id]/
      └─ page.tsx
```

`[id]`는 존재하는 상품만 허용하는 기능이 아니라 URL에서 값을 동적으로 받아오는 라우트다.

```text
/products/1   → id = "1"
/products/4   → id = "4"
/products/abc → id = "abc"
```

> **팁**  
> 동적 라우트는 값을 받아오는 역할이고, 그 값이 실제로 유효한 데이터인지를 확인하는 것은 별도의 책임이다.

## 9. `params`와 상품 조회

상세 페이지에서는 `params`를 통해 `id`를 받았다.

```ts
const { id } = await params;
```

URL에서 받은 ID는 `string`이므로 상품 데이터의 `number` ID와 비교하기 전에 변환했다.

```ts
const productId = Number(id);
```

그다음 `find()`로 해당 상품 하나를 찾았다.

```ts
const product = products.find(
  (product) => product.id === productId
);
```

> **팁**  
> 상세 페이지의 기본 흐름을 `URL → params → 타입 변환 → 데이터 조회` 순서로 기억한다.

## 10. `notFound()`로 404 처리

`find()`로 상품을 찾지 못하면 결과는 `undefined`가 된다.

그래서 Next.js의 `notFound()`를 사용했다.

```ts
if (!product) {
  notFound();
}
```

이제 존재하지 않는 상품 ID나 잘못된 URL 값은 404로 처리할 수 있다.

```text
/products/1   → 상품 상세
/products/4   → 404
/products/abc → 404
```

> **팁**  
> URL은 사용자가 직접 변경할 수 있는 입력값이므로 URL의 값을 그대로 믿지 말고 실제 데이터가 존재하는지 확인한다.

## 11. 상품 상세 페이지

찾은 상품을 사용해 상세 페이지에 다음 정보를 표시했다.

```text
상품 이미지
상품명
상품 설명
정상가
판매가
할인율
```

할인율은 별도의 데이터로 저장하지 않고 정상가와 판매가를 이용해 계산했다.

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
);
```

> **팁**  
> 기존 데이터로 안정적으로 계산할 수 있는 값이라면 필요하지 않은 중복 저장보다 계산해서 사용하는 방법을 먼저 검토한다.

## 12. Day 2에서 완성한 전체 흐름

```text
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
next/image
↓
Link
↓
/products/${product.id}
↓
[id]/page.tsx
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

Day 2에서는 상품 데이터가 상품 목록에서 해당 상품 상세 페이지까지 흘러가는 기본 구조를 완성했다.

> **팁**  
> 각각의 문법을 따로 외우기보다 사용자가 상품을 클릭하고 상세 정보를 볼 때까지 데이터와 라우팅이 어떻게 이어지는지를 복습한다.

## 13. Day 2 종료 시점의 프로젝트 구조

```text
project/
├─ app/
│  └─ products/
│     ├─ page.tsx
│     └─ [id]/
│        └─ page.tsx
├─ public/
│  └─ images/
│     └─ products/
└─ src/
   ├─ components/
   │  └─ product/
   │     └─ ProductCard.tsx
   ├─ data/
   │  └─ products.ts
   └─ types/
      └─ product.ts
```

> **팁**  
> 폴더 구조도 코드처럼 책임으로 기억한다. `app = 라우트`, `components = UI`, `data = 데이터`, `types = 타입`, `public = 정적 파일`로 연결하면 된다.

## 14. Day 3로 이어갈 작업

Day 2에서는 **상품을 보는 흐름**을 완성했다.

Day 3에서는 상품 상세 페이지를 기반으로 상품 옵션, 수량, 장바구니 추가, 장바구니 상태 같은 쇼핑몰 기능을 하나씩 추가할 수 있다.

```text
Day 2
상품을 본다
↓
Day 3
상품을 선택해서 장바구니에 담는다
```

> **팁**  
> Day 3에서도 여러 기능을 한꺼번에 만들기보다 `상품을 장바구니에 담는다`라는 사용자 흐름 하나를 작은 단계로 나누어 구현한다.
