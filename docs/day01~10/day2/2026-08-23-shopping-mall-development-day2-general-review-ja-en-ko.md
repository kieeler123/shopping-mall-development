# Shopping Mall Day 2 — GENERAL Review

# ショッピングモール Day 2 — 総復習

# 쇼핑몰 Day 2 — 총정리

[📝 問題・Quiz・문제](2026-08-23-shopping-mall-development-day2-practice-problems-ja-en-ko.md)\
[✅ 正解・Answers・정답 해설](2026-08-23-shopping-mall-development-day2-answers-explanations-ja-en-ko.md)

> Day 2에서 실제로 진행한 상품 모델링 → 목록 → 이미지 → 컴포넌트 분리 → 상세 라우팅 → 조회 → 404 → 할인율 계산을 복습하기 위한 문서입니다.

---

# 日本語

## 0. 学習情報

- **テーマ:** Next.jsショッピングモール Day 2
- **範囲:** 商品一覧から商品詳細まで
- **技術:** Next.js App Router / TypeScript / React
- **学習焦点:** データモデリング、Semantic HTML、コンポーネント責務、動的ルート、商品検索、404、計算ロジック

> **Tip**  
> 個別の文法を暗記するのではなく、「商品データが一覧から詳細画面までどう移動するか」を1本の流れとして復習する。

## 1. Day 2の一行要約

Day 2では、Mock商品データを型安全に定義し、商品一覧を表示し、各商品から動的な詳細ページへ移動して正しい商品を表示できるところまで完成させた。

```text
Product型
→ productsデータ
→ /products
→ ProductCard
→ Link
→ /products/[id]
→ params
→ find()
→ 商品詳細 / 404
```

> **Tip**  
> 上の流れをコードを見ずに説明できれば、Day 2の中心構造を理解できている。

## 2. Product型

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

- `id`: 商品識別子
- `name`: 商品名
- `description`: 商品説明
- `originalPrice`: 通常価格
- `salePrice`: 販売価格
- `image`: 画像そのものではなく画像パス

`image`が`string`なのは、現在保存している値が画像ファイルそのものではなく`"/images/products/..."`のような文字列のパスだからである。

> **Tip**  
> 型は「その値をアプリ内でどう扱うか」で決める。価格は計算するので`number`、パスは文字列なので`string`。

## 3. `import type`

```ts
import type { Product } from "@/types/product";
```

`Product`は実行時のJavaScript値ではなくTypeScriptの型としてのみ利用するため、`import type`で意図を明確にした。

> **Tip**  
> 「ブラウザ実行時にも必要か？」を考える。型チェックだけなら`import type`を検討する。

## 4. Mock商品データ

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

`Product[]`によって、配列の各要素が`Product`構造を満たすことをTypeScriptに確認させる。

> **Tip**  
> MockデータでもUIから分離しておくと、後でAPIやDBに置き換える責務が見えやすい。

## 5. 商品一覧とSemantic HTML

```tsx
<ul>
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</ul>
```

商品は「順番が意味を持つランキング」ではなく「商品の集合」なので`ul`が自然である。各商品は`li`になる。

- `ul`: 順序に意味がないリスト
- `ol`: 順位・手順など順序に意味があるリスト
- `li`: リスト内の1項目

> **Tip**  
> タグを見た目で選ばない。意味はHTML、見た目はCSSが担当する。

## 6. Empty State

```tsx
{products.length === 0 ? (
  <li className="empty">登録された商品がありません。</li>
) : (
  products.map(...)
)}
```

データが0件の状態もUIの状態の一つとして扱った。

> **Tip**  
> 「データがあるとき」だけでなく「ないときにユーザーへ何を見せるか」も画面設計に含める。

## 7. `next/image`と`public`

```tsx
<Image src={product.image} alt={product.name} width={300} height={300} />
```

静的画像はプロジェクトルートの`public`から公開される。

```text
project/
├─ public/
│  └─ images/products/...
├─ app/
└─ src/
```

`public/images/products/a.png`はコードから`/images/products/a.png`として参照する。

> **Tip**  
> `public`はソースコード用ではなく、ブラウザへそのまま公開する静的ファイルのルートと考える。

## 8. ProductCardへの責務分離

```text
ProductsPage
→ 一覧全体、ul、map、Empty State

ProductCard
→ 商品1件、li、商品情報、詳細へのLink
```

`li`までをカードへ分離し、`ul`は一覧を管理するページ側に残した。

> **Tip**  
> 「このコンポーネントの仕事は何か？」を一文で説明できる境界を探す。

## 9. `Link`による詳細移動

```tsx
<Link href={`/products/${product.id}`}>
```

商品IDをURLへ埋め込むことで、商品ごとの詳細URLを生成した。

```text
id 1 → /products/1
id 2 → /products/2
id 3 → /products/3
```

> **Tip**  
> Next.js内部ページへの移動は`Link`、外部URLへの通常リンクは`a`を基本として整理する。

## 10. `[id]`動的ルート

```text
app/
└─ products/
   ├─ page.tsx
   └─ [id]/
      └─ page.tsx
```

`[id]`は存在する商品だけを許可する機能ではなく、URLの一部を動的な値として受け取る仕組みである。

> **Tip**  
> `/products/999`もルート自体には一致する。商品が存在するかどうかは次のデータ検索で判断する。

## 11. `params` → `Number()` → `find()`

```ts
const { id } = await params;
const productId = Number(id);
const product = products.find((product) => product.id === productId);
```

URLから来る`id`は文字列であり、商品IDは数値なので`Number()`で変換してから`find()`で一致する商品を探す。

> **Tip**  
> `URL → string → number → 商品検索`という型の変化まで追う。

## 12. `notFound()`と型の絞り込み

```ts
if (!product) {
  notFound();
}
```

商品が存在しない場合は404へ送る。これ以降では`product`が存在することが確定するため、`product?.name`のような不要なOptional Chainingを使わずに済む。

> **Tip**  
> 必須データは先に検証し、その後のコードを単純にする。

## 13. 割引率計算

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
);
```

計算順序:

```text
通常価格 - 販売価格
→ 値引き額

値引き額 ÷ 通常価格
→ 元の価格に対する値引き比率

× 100
→ %

Math.round()
→ 最も近い整数へ四捨五入
```

> **Tip**  
> 複雑に見えたら`discountAmount → discountRatio → discountPercentage → discountRate`の4段階へ分解する。

## 14. Day 2最終データフロー

```text
products.ts
↓
Product[]
↓
ProductsPage
↓
map()
↓
ProductCard
↓
Link
↓
/products/[id]
↓
params.id
↓
Number(id)
↓
find()
↓
存在確認
├─ 商品あり → 詳細表示
└─ 商品なし → notFound() → 404
```

> **Tip**  
> Day 2の復習ではこのデータフローを最優先で再現する。

## 15. 最終チェック

- [ ] `Product`各プロパティの型を説明できる
- [ ] `image`が`string`である理由を説明できる
- [ ] `import type`の目的を説明できる
- [ ] `ul`と`ol`を意味で選べる
- [ ] `public`画像のURLを説明できる
- [ ] `ProductsPage`と`ProductCard`の責務を分けられる
- [ ] `[id]`が何をするか説明できる
- [ ] `params`から商品検索まで説明できる
- [ ] `notFound()`が必要な理由を説明できる
- [ ] 割引率の式を自然言語で説明できる

> **Tip**  
> チェックが付いても、説明できなければ△として問題編で再確認する。

---

# English

## 0. Study Information

- **Topic:** Next.js Shopping Mall Day 2
- **Scope:** Product list through product detail
- **Technology:** Next.js App Router / TypeScript / React
- **Focus:** Data modeling, semantic HTML, component responsibility, dynamic routing, lookup, 404 handling, calculation logic

> **Tip**  
> Review Day 2 as one product-data flow rather than as isolated syntax.

## 1. Day 2 in One Sentence

Day 2 defined type-safe mock product data, rendered a product list, linked each item to a dynamic detail route, looked up the matching product, and handled invalid products with a 404.

```text
Product type
→ products data
→ /products
→ ProductCard
→ Link
→ /products/[id]
→ params
→ find()
→ Product detail / 404
```

> **Tip**  
> If you can explain this flow without looking at the code, you understand the core of Day 2.

## 2. Product Type

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

`id` and prices are numbers, textual fields are strings, and `image` is a string because it stores a path rather than the image binary itself.

> **Tip**  
> Select a type based on how the application uses the value.

## 3. `import type`

```ts
import type { Product } from "@/types/product";
```

`Product` is needed for TypeScript type checking rather than as a runtime JavaScript value, so `import type` makes that intent explicit.

> **Tip**  
> Ask whether the imported symbol must exist when JavaScript runs. If not, it may be type-only.

## 4. Mock Product Data

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

`Product[]` tells TypeScript that every array item must follow the `Product` structure.

> **Tip**  
> Keep mock data separate from UI so the future API/database boundary remains clear.

## 5. Product List and Semantic HTML

```tsx
<ul>
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</ul>
```

Products form an unordered collection, so `ul` is appropriate. `ol` is for lists where order itself carries meaning, and `li` represents one item.

> **Tip**  
> HTML describes meaning; CSS describes appearance.

## 6. Empty State

```tsx
{products.length === 0 ? (
  <li className="empty">No products are registered.</li>
) : (
  products.map(...)
)}
```

An empty dataset is also a UI state and should be represented intentionally.

> **Tip**  
> Design both the data-present and data-absent states.

## 7. `next/image` and `public`

```tsx
<Image src={product.image} alt={product.name} width={300} height={300} />
```

Static assets live under the root-level `public` directory.

```text
public/images/products/a.png
→ /images/products/a.png
```

> **Tip**  
> Think of `public` as the browser-facing static asset root.

## 8. Separating `ProductCard`

```text
ProductsPage
→ Collection, ul, map, Empty State

ProductCard
→ One product, li, product information, Link
```

The list container stays with the list page while the individual list item becomes the card component.

> **Tip**  
> Extract by responsibility, not simply because a file has become long.

## 9. Detail Navigation with `Link`

```tsx
<Link href={`/products/${product.id}`}>
```

The product ID becomes part of the URL.

```text
1 → /products/1
2 → /products/2
3 → /products/3
```

> **Tip**  
> Use Next.js `Link` as the default for internal application navigation.

## 10. Dynamic `[id]` Route

```text
app/products/[id]/page.tsx
```

`[id]` captures a dynamic URL segment. It does not validate whether a product with that ID actually exists.

> **Tip**  
> Routing accepts the value; data lookup decides whether it represents a real product.

## 11. `params` → `Number()` → `find()`

```ts
const { id } = await params;
const productId = Number(id);
const product = products.find((product) => product.id === productId);
```

The route ID is a string, while product IDs are numbers. It is converted before strict comparison and lookup.

> **Tip**  
> Track both the value and its type through the data flow.

## 12. `notFound()` and Narrowing

```ts
if (!product) {
  notFound();
}
```

Missing products produce a 404. After this guard, the remaining code can treat `product` as existing and avoid unnecessary optional chaining.

> **Tip**  
> Validate required data early so the rest of the component stays simple.

## 13. Discount Rate

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
);
```

```text
original price - sale price
→ discount amount

discount amount / original price
→ discount ratio

× 100
→ percentage

Math.round()
→ nearest integer
```

> **Tip**  
> Expand a difficult expression into meaningful intermediate variables before compressing it.

## 14. Final Day 2 Data Flow

```text
products.ts
↓
Product[]
↓
ProductsPage
↓
map()
↓
ProductCard
↓
Link
↓
/products/[id]
↓
params.id
↓
Number(id)
↓
find()
↓
Validation
├─ Found → Detail
└─ Missing → notFound() → 404
```

> **Tip**  
> This is the main diagram to reproduce when reviewing Day 2.

## 15. Final Checklist

- [ ] Explain every `Product` field type
- [ ] Explain why `image` is a string
- [ ] Explain `import type`
- [ ] Choose `ul` vs `ol` semantically
- [ ] Explain `public` image paths
- [ ] Separate page and card responsibilities
- [ ] Explain `[id]`
- [ ] Trace `params` through product lookup
- [ ] Explain `notFound()`
- [ ] Explain the discount formula

> **Tip**  
> Mark an item as incomplete if you cannot explain the reason behind it.

---

# 한국어

## 0. 학습 정보

- **주제:** Next.js 쇼핑몰 Day 2
- **범위:** 상품 목록부터 상품 상세까지
- **기술:** Next.js App Router / TypeScript / React
- **학습 초점:** 데이터 모델링, 시맨틱 HTML, 컴포넌트 책임, 동적 라우팅, 상품 조회, 404, 계산 로직

> **팁**  
> Day 2를 문법 조각으로 외우지 말고 상품 데이터가 목록에서 상세 화면까지 이동하는 하나의 흐름으로 복습한다.

## 1. Day 2 한 줄 요약

Day 2에서는 Mock 상품 데이터를 타입 안전하게 정의하고 상품 목록을 출력한 뒤, 상품별 동적 상세 페이지로 이동하여 올바른 상품을 조회하고 존재하지 않는 상품은 404로 처리하는 흐름까지 완성했다.

```text
Product 타입
→ products 데이터
→ /products
→ ProductCard
→ Link
→ /products/[id]
→ params
→ find()
→ 상품 상세 / 404
```

> **팁**  
> 코드를 보지 않고 이 흐름을 처음부터 끝까지 설명할 수 있으면 Day 2의 핵심 구조를 이해한 것이다.

## 2. Product 타입

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

- `id`: 상품 식별자
- `name`: 상품명
- `description`: 상품 설명
- `originalPrice`: 정상가
- `salePrice`: 판매가
- `image`: 이미지 자체가 아니라 이미지 경로

`image`가 `string`인 이유는 현재 저장하는 값이 이미지 파일 자체가 아니라 `"/images/products/..."` 같은 경로 문자열이기 때문이다.

> **팁**  
> 타입은 값의 모양보다 애플리케이션에서 어떻게 사용할지를 기준으로 정한다. 가격은 계산하므로 `number`, 경로는 문자이므로 `string`이다.

## 3. `import type`

```ts
import type { Product } from "@/types/product";
```

`Product`는 실행 시 사용하는 JavaScript 값이 아니라 TypeScript의 타입 검사에만 사용하므로 `import type`으로 의도를 명확하게 표현했다.

> **팁**  
> `이 값이 브라우저에서 실행될 때도 필요한가?`를 생각한다. 타입 검사에만 필요하다면 type-only import를 고려한다.

## 4. Mock 상품 데이터

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

`Product[]`를 사용해 배열의 모든 요소가 `Product` 구조를 만족하는지 TypeScript가 검사하도록 했다.

> **팁**  
> Mock 데이터도 UI와 분리하면 나중에 API나 DB로 교체할 경계를 이해하기 쉬워진다.

## 5. 상품 목록과 시맨틱 HTML

```tsx
<ul>
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</ul>
```

상품은 순위처럼 순서 자체가 중요한 데이터가 아니라 상품의 집합이므로 `ul`이 자연스럽다.

- `ul`: 순서에 의미가 없는 목록
- `ol`: 순위·절차처럼 순서에 의미가 있는 목록
- `li`: 목록 안의 한 항목

> **팁**  
> 태그를 디자인으로 선택하지 않는다. 의미와 구조는 HTML, 모양은 CSS가 담당한다.

## 6. Empty State

```tsx
{products.length === 0 ? (
  <li className="empty">등록된 상품이 없습니다.</li>
) : (
  products.map(...)
)}
```

상품이 하나도 없는 경우도 하나의 UI 상태로 보고 별도로 처리했다.

> **팁**  
> 데이터가 있을 때뿐 아니라 없을 때 사용자가 무엇을 보게 되는지도 화면 설계의 일부다.

## 7. `next/image`와 `public`

```tsx
<Image src={product.image} alt={product.name} width={300} height={300} />
```

정적 이미지는 프로젝트 루트의 `public` 아래에 두었다.

```text
project/
├─ public/
│  └─ images/products/...
├─ app/
└─ src/
```

`public/images/products/a.png`는 코드에서 `/images/products/a.png`로 접근한다.

> **팁**  
> `public`을 소스 코드 폴더가 아니라 브라우저에 공개되는 정적 파일의 루트로 이해한다.

## 8. ProductCard로 책임 분리

```text
ProductsPage
→ 상품 목록 전체, ul, map, Empty State

ProductCard
→ 상품 하나, li, 상품 정보, 상세 Link
```

`li`까지 상품 카드로 분리하고 `ul`은 목록 전체를 관리하는 페이지에 남겼다.

> **팁**  
> 파일 길이보다 `이 컴포넌트가 하는 일을 한 문장으로 설명할 수 있는가?`를 기준으로 분리한다.

## 9. `Link`로 상세 페이지 이동

```tsx
<Link href={`/products/${product.id}`}>
```

상품 ID를 URL에 넣어 상품별 상세 주소를 만들었다.

```text
id 1 → /products/1
id 2 → /products/2
id 3 → /products/3
```

> **팁**  
> Next.js 앱 내부 이동에는 `Link`를 기본으로 사용한다고 정리해두면 좋다.

## 10. `[id]` 동적 라우트

```text
app/
└─ products/
   ├─ page.tsx
   └─ [id]/
      └─ page.tsx
```

`[id]`는 존재하는 상품만 허용하는 기능이 아니다. URL의 한 부분을 동적인 값으로 받아오는 기능이다.

> **팁**  
> `/products/999`도 라우트에는 들어올 수 있다. 실제 상품 존재 여부는 데이터 조회 단계에서 판단한다.

## 11. `params` → `Number()` → `find()`

```ts
const { id } = await params;
const productId = Number(id);
const product = products.find((product) => product.id === productId);
```

URL에서 받은 `id`는 문자열이고 상품의 `id`는 숫자이므로 `Number()`로 변환한 뒤 `find()`로 같은 ID의 상품을 찾았다.

> **팁**  
> 값만 따라가지 말고 `URL string → number → 상품 조회`처럼 타입이 어떻게 변하는지도 함께 추적한다.

## 12. `notFound()`와 타입 좁히기

```ts
if (!product) {
  notFound();
}
```

상품이 없으면 404로 처리한다. 이 검사 이후에는 `product`가 존재한다는 것이 확정되므로 `product?.name` 같은 불필요한 Optional Chaining을 쓰지 않아도 된다.

> **팁**  
> 반드시 필요한 데이터는 초반에 검증해 이후 코드를 단순하게 만든다.

## 13. 할인율 계산

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
);
```

계산 순서는 다음과 같다.

```text
정상가 - 판매가
→ 할인된 금액

할인된 금액 ÷ 정상가
→ 정상가에 대한 할인 비율

× 100
→ 퍼센트

Math.round()
→ 가장 가까운 정수로 반올림
```

> **팁**  
> 식이 복잡해 보이면 `discountAmount → discountRatio → discountPercentage → discountRate`로 나눠서 이해한다.

## 14. Day 2 최종 데이터 흐름

```text
products.ts
↓
Product[]
↓
ProductsPage
↓
map()
↓
ProductCard
↓
Link
↓
/products/[id]
↓
params.id
↓
Number(id)
↓
find()
↓
존재 확인
├─ 상품 있음 → 상세 표시
└─ 상품 없음 → notFound() → 404
```

> **팁**  
> Day 2 복습에서는 이 데이터 흐름을 가장 먼저 다시 그려본다.

## 15. 최종 체크

- [ ] `Product` 각 속성의 타입을 설명할 수 있다
- [ ] `image`가 `string`인 이유를 설명할 수 있다
- [ ] `import type`의 목적을 설명할 수 있다
- [ ] `ul`과 `ol`을 의미로 선택할 수 있다
- [ ] `public` 이미지 경로를 설명할 수 있다
- [ ] `ProductsPage`와 `ProductCard` 책임을 구분할 수 있다
- [ ] `[id]`의 역할을 설명할 수 있다
- [ ] `params`부터 상품 조회까지 설명할 수 있다
- [ ] `notFound()`가 필요한 이유를 설명할 수 있다
- [ ] 할인율 계산식을 말로 설명할 수 있다

> **팁**  
> 체크는 단순히 본 적이 있다는 뜻이 아니라 이유까지 설명할 수 있을 때 완료로 표시한다.
