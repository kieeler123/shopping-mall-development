# Shopping Mall Day 2 — Answers & Explanations

# ショッピングモール Day 2 — 解答・解説

# 쇼핑몰 Day 2 — 정답·해설

[📖 GENERAL](2026-08-23-shopping-mall-development-day2-general-review-ja-en-ko.md)\
[📝 問題・Quiz・문제](2026-08-23-shopping-mall-development-day2-practice-problems-ja-en-ko.md)

---

# 日本語

## 正答表

| 問題 | 正答                                                                          |
| ---- | ----------------------------------------------------------------------------- |
| 1    | 2. `string`                                                                   |
| 2    | 3. `import type`                                                              |
| 3    | 2. `ul`                                                                       |
| 4    | 2. 商品1件の`li`と情報                                                        |
| 5    | 3. `/images/products/a.png`                                                   |
| 6    | 2. 動的URL部分を受け取る                                                      |
| 7    | 3. `Number(id)`                                                               |
| 8    | IDが一致する商品1件を検索                                                     |
| 9    | ルート一致と商品存在確認は別責務                                              |
| 10   | `notFound()`後は商品存在が保証される                                          |
| 11   | 20%                                                                           |
| 12   | 3. 最も近い整数へ丸める                                                       |
| 13   | `Product[] → ProductCard → Link → params.id → Number(id) → find() → 商品詳細` |
| 14   | ``<Link href={`/products/${product.id}`}>``                                   |
| 15   | 一覧全体と商品1件の責務を分離するため                                         |

> **Tip**  
> 正解番号だけでなく、理由を説明できなかった問題を重点的に読む。

## 問題 1 解説

**正答: 2. `string`**

画像そのものをTypeScriptオブジェクトへ保存しているのではなく、`"/images/products/item.png"`というパス文字列を保存しているため`string`である。

> **Tip**  
> 型はデータの実体を見る。現在の値は「画像」ではなく「画像の場所を表す文字列」。

## 問題 2 解説

**正答: 3.**

```ts
import type { Product } from "@/types/product";
```

`Product`を型としてのみ利用する意図を明示できる。通常のnamed importが常に間違いという意味ではなく、type-onlyであることをコード上で明確にするのがポイントである。

> **Tip**  
> 「型だけか、実行時の値も必要か」を判断する。

## 問題 3 解説

**正答: 2. `ul`**

通常の商品一覧では順番自体に意味がない。ランキングや手順なら`ol`が適する。

> **Tip**  
> CSSで番号を消せるかではなく、コンテンツの意味で判断する。

## 問題 4 解説

**正答: 2. 商品1件の`li`と商品情報**

`ProductsPage`は一覧全体、`ProductCard`は商品1件を担当する。`ul`までカードへ入れると「商品1件」という責務を越える。

> **Tip**  
> コンポーネント名を主語にして「ProductCardは商品1件を表示する」と言える境界を保つ。

## 問題 5 解説

**正答: 3.**

```text
/images/products/a.png
```

`public`は公開ルートなのでURLには`public`を書かない。

> **Tip**  
> ファイルシステム上の場所とブラウザから見えるURLを区別する。

## 問題 6 解説

**正答: 2. URLの動的部分を`id`として受け取る**

`[id]`は`/products/1`だけでなく`/products/999`や`/products/abc`にもマッチし得る。存在確認はデータ検索の責務である。

> **Tip**  
> `routing ≠ validation`と覚える。

## 問題 7 解説

**正答: 3. `Number(id)`**

URLパラメータは文字列で、商品IDは`number`なので、`===`で比較する前に数値へ変換した。

> **Tip**  
> `"2" === 2`は`false`。値だけでなく型を見る。

## 問題 8 解説

```ts
const product = products.find((product) => product.id === productId);
```

`products`配列を前から確認し、`product.id`が`productId`と一致する最初の商品を返す。一致しなければ`undefined`になる。

> **Tip**  
> `find()`は「条件に一致する1件」、`map()`は「各要素を変換して新しい配列」という役割の違いを意識する。

## 問題 9 解説

`[id]`はURLの値を受け取るだけなので、`999`が実在する商品IDかは知らない。`find()`で商品を検索し、結果がなければ`notFound()`を呼ぶことで初めて「存在しない商品 → 404」が完成する。

> **Tip**  
> URLを受け取る層とデータの存在を判断する層を分けて考える。

## 問題 10 解説

```ts
if (!product) {
  notFound();
}
```

商品がない場合はその地点で通常のページ処理を継続しない。したがって後続コードへ到達した時点では`product`が存在するため、`product.name`として扱える。

> **Tip**  
> 必須値を先にguardすると後続コードの型とロジックが簡潔になる。

## 問題 11 解説

**正答: 20%**

```text
69,000 - 55,200
= 13,800

13,800 / 69,000
= 0.2

0.2 × 100
= 20

Math.round(20)
= 20
```

> **Tip**  
> 「値引き額 → 比率 → % → 丸め」の4段階で計算する。

## 問題 12 解説

**正答: 3. 最も近い整数へ丸める**

```ts
Math.round(10.4); // 10
Math.round(10.5); // 11
```

`floor()`は下側、`ceil()`は上側への丸めであり、`round()`とは異なる。

> **Tip**  
> 実務ではサービスの丸め規則を確認して関数を選ぶ。

## 問題 13 解説

**正答**

```text
Product[]
↓
ProductCard
↓
Link
↓
params.id
↓
Number(id)
↓
find()
↓
商品詳細
```

一覧データから商品カードを作り、リンク先URLのIDを詳細ページで受け取り、型変換して商品を検索する流れである。

> **Tip**  
> Day 2で最も重要な復元問題。コードなしで書けるまで繰り返す。

## 問題 14 解説

例:

```tsx
<Link href={`/products/${product.id}`}>商品を見る</Link>
```

テンプレートリテラルを使って商品ごとに異なるURLを生成する。

> **Tip**  
> 固定文字列`/products/`と動的値`${product.id}`を分けて読む。

## 問題 15 解説

`ProductsPage`は商品一覧全体を管理し、`ProductCard`は商品1件の表示を担当する。責務を分けることで、一覧ロジックと商品1件のUIが混ざりにくくなり、再利用・修正・読解がしやすくなる。

> **Tip**  
> 「分けた方がきれいだから」ではなく「異なる責務だから」と説明できるようにする。

---

# English

## Answer Key

| Problem | Answer                                                                              |
| ------- | ----------------------------------------------------------------------------------- |
| 1       | 2. `string`                                                                         |
| 2       | 3. `import type`                                                                    |
| 3       | 2. `ul`                                                                             |
| 4       | 2. One product `li` and information                                                 |
| 5       | 3. `/images/products/a.png`                                                         |
| 6       | 2. Capture a dynamic URL segment                                                    |
| 7       | 3. `Number(id)`                                                                     |
| 8       | Find one product with a matching ID                                                 |
| 9       | Route matching and data existence are separate                                      |
| 10      | Product existence is guaranteed after the guard                                     |
| 11      | 20%                                                                                 |
| 12      | 3. Round to the nearest integer                                                     |
| 13      | `Product[] → ProductCard → Link → params.id → Number(id) → find() → Product detail` |
| 14      | ``<Link href={`/products/${product.id}`}>``                                         |
| 15      | Separate collection and single-item responsibilities                                |

> **Tip**  
> Focus on questions where you guessed correctly but could not explain the reason.

## Problem 1 Explanation

**Answer: 2. `string`**

The stored value is a path such as `"/images/products/item.png"`, not the image binary itself.

> **Tip**  
> Type the actual stored value, not the real-world concept it refers to.

## Problem 2 Explanation

**Answer: 3.**

```ts
import type { Product } from "@/types/product";
```

It explicitly communicates that `Product` is used only by TypeScript's type system.

> **Tip**  
> Distinguish type-only dependencies from runtime values.

## Problem 3 Explanation

**Answer: 2. `ul`**

A normal product collection has no meaningful ranking. `ol` is appropriate when order carries meaning.

> **Tip**  
> Choose semantic HTML by meaning, not appearance.

## Problem 4 Explanation

**Answer: 2. One product's `li` and information**

`ProductsPage` owns the collection; `ProductCard` owns one product. Moving the entire `ul` into the card would cross that responsibility boundary.

> **Tip**  
> A component boundary is strong when its responsibility can be stated in one sentence.

## Problem 5 Explanation

**Answer: 3. `/images/products/a.png`**

`public` acts as the web root for those static assets, so `public` is omitted from the URL.

> **Tip**  
> Distinguish filesystem paths from browser URLs.

## Problem 6 Explanation

**Answer: 2. Capture a dynamic URL segment**

`[id]` can match values such as `1`, `999`, or `abc`. It does not validate product existence.

> **Tip**  
> Remember: routing is not validation.

## Problem 7 Explanation

**Answer: 3. `Number(id)`**

Route parameters are strings while the product IDs are numbers. Conversion allows strict numeric comparison.

> **Tip**  
> `"2" === 2` is false; track types as well as values.

## Problem 8 Explanation

`find()` returns the first product whose `id` equals `productId`. If no product matches, the result is `undefined`.

> **Tip**  
> `find()` searches for one matching item; `map()` transforms every item.

## Problem 9 Explanation

The route only captures the ID. It has no knowledge of the contents of `products`. The page must perform a lookup and call `notFound()` when no matching product exists.

> **Tip**  
> Separate URL parsing from data validation.

## Problem 10 Explanation

If `product` is missing, `notFound()` prevents the normal page flow from continuing. Therefore code after the guard can treat `product` as present.

> **Tip**  
> Early guards simplify both TypeScript types and later logic.

## Problem 11 Explanation

**Answer: 20%**

```text
69,000 - 55,200 = 13,800
13,800 / 69,000 = 0.2
0.2 × 100 = 20
Math.round(20) = 20
```

> **Tip**  
> Think: discount amount → ratio → percentage → rounding.

## Problem 12 Explanation

**Answer: 3. Round to the nearest integer**

`Math.round(10.4)` gives `10`, while `Math.round(10.5)` gives `11`.

> **Tip**  
> Do not confuse `round()` with `floor()` or `ceil()`.

## Problem 13 Explanation

```text
Product[]
↓
ProductCard
↓
Link
↓
params.id
↓
Number(id)
↓
find()
↓
Product detail
```

This traces data from the list through navigation into detail lookup.

> **Tip**  
> This is the most important Day 2 flow to reproduce from memory.

## Problem 14 Explanation

```tsx
<Link href={`/products/${product.id}`}>View product</Link>
```

The template literal combines the fixed route with the dynamic product ID.

> **Tip**  
> Read the URL as a fixed part plus a dynamic value.

## Problem 15 Explanation

`ProductsPage` manages the product collection, while `ProductCard` renders one product. Separating these responsibilities reduces mixed logic and improves reuse, maintenance, and readability.

> **Tip**  
> Explain component extraction in terms of responsibility rather than merely file size.

---

# 한국어

## 정답표

| 문제 | 정답                                                                           |
| ---- | ------------------------------------------------------------------------------ |
| 1    | 2. `string`                                                                    |
| 2    | 3. `import type`                                                               |
| 3    | 2. `ul`                                                                        |
| 4    | 2. 상품 하나의 `li`와 정보                                                     |
| 5    | 3. `/images/products/a.png`                                                    |
| 6    | 2. 동적 URL 부분을 받는다                                                      |
| 7    | 3. `Number(id)`                                                                |
| 8    | ID가 일치하는 상품 하나를 찾는다                                               |
| 9    | 라우트 매칭과 상품 존재 확인은 별개다                                          |
| 10   | guard 이후 상품 존재가 보장된다                                                |
| 11   | 20%                                                                            |
| 12   | 3. 가장 가까운 정수로 반올림                                                   |
| 13   | `Product[] → ProductCard → Link → params.id → Number(id) → find() → 상품 상세` |
| 14   | ``<Link href={`/products/${product.id}`}>``                                    |
| 15   | 목록 전체와 상품 하나의 책임을 분리하기 위해                                   |

> **팁**  
> 정답 번호만 맞히는 것보다 왜 그 답인지 설명하지 못했던 문제를 집중해서 본다.

## 문제 1 해설

**정답: 2. `string`**

상품 데이터에 저장되는 값은 이미지 자체가 아니라 `"/images/products/item.png"` 같은 이미지 경로 문자열이므로 `string`이 적절하다.

> **팁**  
> 현실에서 무엇을 가리키는지가 아니라 실제 변수에 무엇이 저장되는지를 보고 타입을 정한다.

## 문제 2 해설

**정답: 3.**

```ts
import type { Product } from "@/types/product";
```

`Product`가 TypeScript 타입 검사에만 사용된다는 의도를 명확하게 표현한다.

> **팁**  
> 타입 전용 의존성과 실행 시 필요한 값을 구분하는 습관을 만든다.

## 문제 3 해설

**정답: 2. `ul`**

일반적인 상품 목록은 순서 자체가 의미를 갖지 않는다. 순위나 절차처럼 순서가 중요하면 `ol`이 적절하다.

> **팁**  
> 번호 표시 여부가 아니라 콘텐츠 의미로 선택한다.

## 문제 4 해설

**정답: 2. 상품 하나의 `li`와 상품 정보**

`ProductsPage`는 상품 목록 전체를, `ProductCard`는 상품 하나를 담당한다. `ul`까지 카드로 옮기면 상품 하나라는 책임 범위를 넘어간다.

> **팁**  
> `ProductCard는 상품 하나를 표시한다`라는 문장이 유지되는지 확인한다.

## 문제 5 해설

**정답: 3.**

```text
/images/products/a.png
```

`public`이 공개 루트 역할을 하므로 브라우저 URL에는 `public`을 쓰지 않는다.

> **팁**  
> 실제 폴더 경로와 브라우저가 접근하는 URL 경로를 구분한다.

## 문제 6 해설

**정답: 2. URL의 동적인 부분을 `id`로 받는다**

`[id]`는 `/products/1`뿐 아니라 `/products/999`, `/products/abc` 같은 값도 받을 수 있다. 실제 상품 존재 여부는 별도의 데이터 조회가 판단한다.

> **팁**  
> `라우팅 ≠ 데이터 검증`으로 기억한다.

## 문제 7 해설

**정답: 3. `Number(id)`**

URL 파라미터는 문자열이고 상품 ID는 `number`이므로 엄격 비교 전에 숫자로 변환했다.

> **팁**  
> `"2" === 2`는 `false`다. 값뿐 아니라 타입도 따라간다.

## 문제 8 해설

```ts
const product = products.find((product) => product.id === productId);
```

`products` 배열에서 `product.id`와 `productId`가 같은 첫 번째 상품을 찾아 반환한다. 일치하는 상품이 없으면 `undefined`가 된다.

> **팁**  
> `find()`는 조건에 맞는 한 항목을 찾고, `map()`은 모든 항목을 변환한다는 차이를 함께 기억한다.

## 문제 9 해설

`[id]`는 URL 값을 받아올 뿐 `products` 배열에 그 상품이 실제 존재하는지는 알지 못한다. 따라서 `find()`로 조회한 뒤 상품이 없다면 `notFound()`를 호출해야 `존재하지 않는 상품 → 404` 흐름이 완성된다.

> **팁**  
> URL을 받는 단계와 데이터가 실제 존재하는지 판단하는 단계를 별개의 책임으로 본다.

## 문제 10 해설

```ts
if (!product) {
  notFound();
}
```

상품이 없으면 이 지점에서 정상적인 페이지 실행이 계속되지 않는다. 따라서 이후 코드에 도달했다면 `product`가 존재하는 경우이므로 `product.name`처럼 사용할 수 있다.

> **팁**  
> 필수 데이터를 앞에서 guard하면 이후 타입과 코드가 단순해진다.

## 문제 11 해설

**정답: 20%**

```text
69,000 - 55,200
= 13,800

13,800 / 69,000
= 0.2

0.2 × 100
= 20

Math.round(20)
= 20
```

즉 정상가 대비 20% 할인이다.

> **팁**  
> `할인 금액 → 비율 → 퍼센트 → 반올림` 네 단계로 읽는다.

## 문제 12 해설

**정답: 3. 가장 가까운 정수로 반올림한다**

```ts
Math.round(10.4); // 10
Math.round(10.5); // 11
```

`Math.floor()`는 아래쪽 정수, `Math.ceil()`은 위쪽 정수로 처리하므로 역할이 다르다.

> **팁**  
> 실제 서비스에서는 반올림·버림·올림 중 어떤 정책을 사용하는지 요구사항을 확인해야 한다.

## 문제 13 해설

**정답**

```text
Product[]
↓
ProductCard
↓
Link
↓
params.id
↓
Number(id)
↓
find()
↓
상품 상세
```

상품 목록 데이터에서 카드가 만들어지고, 링크를 통해 상세 URL로 이동한 뒤 URL의 ID를 받아 숫자로 바꾸고 실제 상품을 찾는 흐름이다.

> **팁**  
> Day 2에서 가장 중요한 복원 문제다. 코드를 보지 않고 직접 그릴 수 있을 때까지 반복한다.

## 문제 14 해설

예:

```tsx
<Link href={`/products/${product.id}`}>상품 보기</Link>
```

템플릿 리터럴로 고정 경로 `/products/`와 동적인 `product.id`를 합친다.

> **팁**  
> URL을 `고정 부분 + 동적 값`으로 나눠 읽는다.

## 문제 15 해설

`ProductsPage`는 상품 목록 전체를 관리하고 `ProductCard`는 상품 하나의 표시를 담당한다. 서로 다른 책임을 분리하면 목록 로직과 개별 상품 UI가 섞이지 않고, 재사용·수정·읽기가 쉬워진다.

> **팁**  
> `코드가 길어서`가 아니라 `서로 다른 책임이기 때문에` 분리했다고 설명할 수 있어야 한다.
