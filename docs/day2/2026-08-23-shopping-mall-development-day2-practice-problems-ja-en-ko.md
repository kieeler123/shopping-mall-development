# Shopping Mall Day 2 — Practice Problems

# ショッピングモール Day 2 — 復習問題

# 쇼핑몰 Day 2 — 복습 문제

[📖 GENERAL](2026-08-24-shopping-mall-development-day3-GENERAL_JA_EN_KO.md)\
[✅ 正解・Answers・정답 해설](2026-08-24-shopping-mall-development-day3-ANSWER_JA_EN_KO.md)

---

# 日本語

## 問題 1 — Product型

商品画像を`public/images/products/item.png`に置き、商品データには画像の参照先だけを保存する。`image`の型として最も適切なものはどれか。

1. `number`
2. `string`
3. `boolean`
4. `Product`

## 問題 2 — `import type`

次のうち、`Product`を型としてのみ使用する場合に最も意図が明確なコードはどれか。

1. `import Product from "@/types/product";`
2. `import { Product } from "@/types/product";`
3. `import type { Product } from "@/types/product";`
4. `require("@/types/product")`

## 問題 3 — Semantic HTML

一般の商品一覧のように、順番そのものに意味がないリストに最も適切な要素はどれか。

1. `ol`
2. `ul`
3. `table`
4. `section`

## 問題 4 — コンポーネント責務

現在の構造で`ProductCard`へ分離する責務として最も自然なのはどれか。

1. 商品一覧全体の`ul`と全商品の`map()`
2. 商品1件の`li`と商品情報
3. 全ページ共通の`layout.tsx`
4. Mockデータ配列そのもの

## 問題 5 — `public`

`public/images/products/a.png`をNext.jsの`Image`で参照するとき、基本的な`src`はどれか。

1. `"public/images/products/a.png"`
2. `"./public/images/products/a.png"`
3. `"/images/products/a.png"`
4. `"src/public/images/products/a.png"`

## 問題 6 — Dynamic Route

`app/products/[id]/page.tsx`における`[id]`の説明として正しいものはどれか。

1. products配列に存在するIDだけを自動的に許可する
2. URLの動的部分を`id`として受け取れるようにする
3. IDを自動的にnumberへ変換する
4. 存在しない商品を自動的に404へ送る

## 問題 7 — 型変換

`params`から取得した`id`が`"2"`で、商品側の`id`が`number`の場合、`find()`で厳密比較する前に行った処理は何か。

1. `String(id)`
2. `Boolean(id)`
3. `Number(id)`
4. `Math.round(id)`

## 問題 8 — `find()`

次のコードの目的を説明しなさい。

```ts
const product = products.find((product) => product.id === productId);
```

## 問題 9 — `notFound()`

なぜ`[id]`ルートを作っただけでは`/products/999`を防げず、`notFound()`による確認が必要なのか説明しなさい。

## 問題 10 — Optional Chaining

次の処理の後で`product?.name`ではなく`product.name`を使用できる理由を説明しなさい。

```ts
if (!product) {
  notFound();
}
```

## 問題 11 — 割引率

通常価格69,000、販売価格55,200の商品について、次の式の計算過程と結果を書きなさい。

```ts
Math.round(((69000 - 55200) / 69000) * 100);
```

## 問題 12 — `Math.round()`

`Math.round()`の役割として最も適切なものはどれか。

1. 常に小さい整数へ切り捨てる
2. 常に大きい整数へ切り上げる
3. 最も近い整数へ丸める
4. 数値を文字列へ変換する

## 問題 13 — データフロー復元

次の語を正しい順番に並べ、Day 2の商品詳細表示フローを完成させなさい。

```text
find()
ProductCard
params.id
Product[]
Number(id)
Link
商品詳細
```

## 問題 14 — コード作成

`product.id`を利用して`/products/3`のような詳細URLへ移動する`Link`を1行で書きなさい。

## 問題 15 — 説明問題

Day 2で`ProductsPage`と`ProductCard`を分離した理由を「責務」という言葉を使って説明しなさい。

> **Tip**  
> 選択問題で正解できても、理由を口頭で説明できない問題には△を付ける。

---

# English

## Problem 1 — Product Type

A product image is stored at `public/images/products/item.png`, while product data stores only its reference path. Which type is most appropriate for `image`?

1. `number`
2. `string`
3. `boolean`
4. `Product`

## Problem 2 — `import type`

Which import most clearly expresses that `Product` is used only as a type?

1. `import Product from "@/types/product";`
2. `import { Product } from "@/types/product";`
3. `import type { Product } from "@/types/product";`
4. `require("@/types/product")`

## Problem 3 — Semantic HTML

Which element is most appropriate for a normal product collection where ordering itself has no meaning?

1. `ol`
2. `ul`
3. `table`
4. `section`

## Problem 4 — Component Responsibility

Which responsibility most naturally belongs in the current `ProductCard`?

1. The entire `ul` and mapping of all products
2. One product's `li` and product information
3. The global `layout.tsx`
4. The mock data array itself

## Problem 5 — `public`

What is the basic `src` path for `public/images/products/a.png`?

1. `"public/images/products/a.png"`
2. `"./public/images/products/a.png"`
3. `"/images/products/a.png"`
4. `"src/public/images/products/a.png"`

## Problem 6 — Dynamic Route

What does `[id]` in `app/products/[id]/page.tsx` do?

1. Automatically accepts only IDs existing in `products`
2. Captures a dynamic URL segment as `id`
3. Automatically converts the ID to a number
4. Automatically sends missing products to 404

## Problem 7 — Type Conversion

If `params.id` is `"2"` while product IDs are numbers, what conversion was used before strict comparison?

1. `String(id)`
2. `Boolean(id)`
3. `Number(id)`
4. `Math.round(id)`

## Problem 8 — `find()`

Explain the purpose of:

```ts
const product = products.find((product) => product.id === productId);
```

## Problem 9 — `notFound()`

Explain why creating a `[id]` route does not by itself prevent `/products/999`, and why an explicit product-existence check is required.

## Problem 10 — Optional Chaining

Explain why `product.name` can be used instead of `product?.name` after:

```ts
if (!product) {
  notFound();
}
```

## Problem 11 — Discount Rate

For an original price of 69,000 and sale price of 55,200, show the calculation and result of:

```ts
Math.round(((69000 - 55200) / 69000) * 100);
```

## Problem 12 — `Math.round()`

Which best describes `Math.round()`?

1. Always round downward
2. Always round upward
3. Round to the nearest integer
4. Convert a number to a string

## Problem 13 — Rebuild the Data Flow

Put these items in the correct order for the Day 2 detail flow:

```text
find()
ProductCard
params.id
Product[]
Number(id)
Link
Product detail
```

## Problem 14 — Write Code

Write one line of `Link` code that uses `product.id` to navigate to a URL such as `/products/3`.

## Problem 15 — Explanation

Explain why `ProductsPage` and `ProductCard` were separated, using the concept of component responsibility.

> **Tip**  
> Mark a question △ even when correct if you cannot explain why the answer is correct.

---

# 한국어

## 문제 1 — Product 타입

상품 이미지는 `public/images/products/item.png`에 있고 상품 데이터에는 이미지의 참조 경로만 저장한다고 하자. `image`에 가장 적절한 타입은?

1. `number`
2. `string`
3. `boolean`
4. `Product`

## 문제 2 — `import type`

`Product`를 타입으로만 사용할 때 의도가 가장 명확한 코드는?

1. `import Product from "@/types/product";`
2. `import { Product } from "@/types/product";`
3. `import type { Product } from "@/types/product";`
4. `require("@/types/product")`

## 문제 3 — 시맨틱 HTML

일반적인 상품 목록처럼 순서 자체에 의미가 없는 목록에 가장 적절한 태그는?

1. `ol`
2. `ul`
3. `table`
4. `section`

## 문제 4 — 컴포넌트 책임

현재 구조에서 `ProductCard`로 분리하는 책임으로 가장 자연스러운 것은?

1. 상품 목록 전체의 `ul`과 모든 상품의 `map()`
2. 상품 하나의 `li`와 상품 정보
3. 전역 `layout.tsx`
4. Mock 데이터 배열 자체

## 문제 5 — `public`

`public/images/products/a.png`를 Next.js `Image`에서 참조할 때 기본적인 `src`는?

1. `"public/images/products/a.png"`
2. `"./public/images/products/a.png"`
3. `"/images/products/a.png"`
4. `"src/public/images/products/a.png"`

## 문제 6 — 동적 라우트

`app/products/[id]/page.tsx`의 `[id]`가 하는 일은?

1. products 배열에 실제 존재하는 ID만 자동 허용한다
2. URL의 동적인 부분을 `id`로 받을 수 있게 한다
3. ID를 자동으로 number로 변환한다
4. 없는 상품을 자동으로 404 처리한다

## 문제 7 — 타입 변환

`params`에서 받은 `id`가 `"2"`이고 상품 `id`가 `number`일 때 엄격 비교 전에 사용한 처리는?

1. `String(id)`
2. `Boolean(id)`
3. `Number(id)`
4. `Math.round(id)`

## 문제 8 — `find()`

다음 코드가 무엇을 하는지 설명하시오.

```ts
const product = products.find((product) => product.id === productId);
```

## 문제 9 — `notFound()`

`[id]` 라우트를 만들었다고 해서 `/products/999`가 막히지 않는 이유와 `notFound()`를 이용한 존재 확인이 필요한 이유를 설명하시오.

## 문제 10 — Optional Chaining

다음 처리 이후 `product?.name`이 아니라 `product.name`을 사용할 수 있는 이유를 설명하시오.

```ts
if (!product) {
  notFound();
}
```

## 문제 11 — 할인율

정상가 69,000원, 판매가 55,200원인 상품에서 다음 계산의 과정과 결과를 작성하시오.

```ts
Math.round(((69000 - 55200) / 69000) * 100);
```

## 문제 12 — `Math.round()`

`Math.round()`의 역할로 가장 적절한 것은?

1. 항상 아래 정수로 내린다
2. 항상 위 정수로 올린다
3. 가장 가까운 정수로 반올림한다
4. 숫자를 문자열로 바꾼다

## 문제 13 — 데이터 흐름 복원

다음 항목을 올바른 순서로 배열해 Day 2 상품 상세 표시 흐름을 완성하시오.

```text
find()
ProductCard
params.id
Product[]
Number(id)
Link
상품 상세
```

## 문제 14 — 코드 작성

`product.id`를 사용해 `/products/3` 같은 상세 URL로 이동하는 `Link`를 한 줄로 작성하시오.

## 문제 15 — 설명 문제

Day 2에서 `ProductsPage`와 `ProductCard`를 분리한 이유를 `책임`이라는 개념을 사용해 설명하시오.

> **팁**  
> 객관식에서 맞혔더라도 왜 그 답인지 설명하지 못한다면 △로 표시하고 해답 문서에서 다시 확인한다.
