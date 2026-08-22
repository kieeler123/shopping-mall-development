# Dynamic Route Data Lookup and 404 Handling
# 動的ルートのデータ検索と404処理
# 동적 라우트 데이터 조회와 404 처리

---

# 日本語

## 1. 今回経験した流れ

商品詳細ページでは、`[id]`という動的ルートを使ってURLから商品IDを受け取った。

```text
/products/1
/products/2
/products/3
/products/4
```

`[id]`は「存在する商品IDだけを許可する機能」ではなく、URLの1セグメントを値として受け取る仕組みである。

そのため、最初の段階では存在しない`/products/4`や`/products/999`でもページ自体は表示された。

> **Tip**  
> 動的ルートはURL値を受け取る機能であり、その値が実際のデータとして存在するかどうかは別途確認する必要がある。

## 2. URLの`id`は文字列として受け取る

動的ルートから受け取る`id`は文字列である。

```ts
const { id } = await params;
```

例えば、

```text
/products/2
```

へアクセスすると、

```ts
id === "2"
```

となる。

一方、今回の商品データでは`id`を`number`として定義している。

```ts
type Product = {
  id: number;
  // ...
};
```

そのため、比較する前にURLの文字列を数値へ変換する。

```ts
const productId = Number(id);
```

> **Tip**  
> URLパラメータは文字列として扱われると考え、データ側の型と比較する前に型が一致しているか確認する。

## 3. `find()`で商品1件を検索する

商品詳細ページでは、複数の商品から特定の商品1件だけを取得したい。

そのため、`find()`を使用する。

```ts
const product = products.find(
  (product) => product.id === productId
);
```

`find()`は条件に一致した最初の要素を返す。

```text
id = 2
↓
productsを検索
↓
product.id === 2
↓
該当する商品を返す
```

該当する商品が存在しない場合は`undefined`を返す。

> **Tip**  
> 詳細ページのように「条件に一致する1件を取得する」場合は`find()`が自然である。

## 4. 商品が存在しない場合

例えば商品データが次の3件だけ存在するとする。

```text
id: 1
id: 2
id: 3
```

この状態で、

```text
/products/4
```

へアクセスすると、

```ts
products.find(...)
```

は一致する商品を見つけられない。

結果は、

```ts
undefined
```

になる。

これはエラーではなく、`find()`が正常に「該当データなし」と判断した結果である。

> **Tip**  
> `undefined`が返ったとき、「findが壊れた」のではなく「検索条件に一致するデータが存在しなかった」と理解する。

## 5. Optional Chainingは一時的な確認には使える

最初の確認では次のように書くことができる。

```tsx
<p>{product?.name}</p>
```

`product`が`undefined`でもエラーにならず、何も表示されない。

ただし、実際の商品詳細ページで存在しない商品を空白のまま表示するのは自然ではない。

```text
商品あり
→ 商品詳細を表示

商品なし
→ 空白ページ
```

よりも、

```text
商品あり
→ 商品詳細を表示

商品なし
→ 404
```

のほうが適切である。

> **Tip**  
> Optional Chainingは「存在しなくても処理を続ける」ための機能であり、存在必須のデータに対する最終的なエラー処理の代わりではない。

## 6. `notFound()`で404処理を行う

Next.js App Routerでは`notFound()`を使って404処理へ移行できる。

```ts
import { notFound } from "next/navigation";
```

商品検索後に次の条件を追加する。

```ts
if (!product) {
  notFound();
}
```

全体の流れは次のようになる。

```text
URL
↓
params.id
↓
Number(id)
↓
products.find()
↓
商品あり？
├─ Yes → 商品詳細表示
└─ No  → notFound()
          ↓
         404
```

> **Tip**  
> 「取得できなかった場合にどうするか」まで含めて1つのデータ取得フローとして考える。

## 7. `notFound()`の後は`product`を安全に使える

次のコードでは、

```ts
if (!product) {
  notFound();
}
```

を通過した後、TypeScriptは`product`が存在することを判断できる。

そのため、

```tsx
<p>{product?.name}</p>
```

ではなく、

```tsx
<p>{product.name}</p>
```

と書ける。

```text
find()
↓
Product | undefined
↓
if (!product)
↓
undefinedの場合はnotFound()で処理終了
↓
それ以降はProductとして扱える
```

> **Tip**  
> エラー処理はユーザー体験だけでなく、TypeScriptの型を安全に絞り込む役割も持つ。

## 8. `/products/abc`も404になる理由

URLには数字以外も直接入力できる。

```text
/products/abc
```

この場合、

```ts
Number("abc")
```

の結果は、

```ts
NaN
```

となる。

商品IDと一致しないため、

```ts
products.find(...)
```

は`undefined`を返し、最終的に`notFound()`へ進む。

> **Tip**  
> URLはユーザーが自由に変更できる入力値である。正しい形式だけが来ると仮定せず、検索結果の存在確認を必ず行う。

## 9. 現在と将来の実務構造

現在はローカル配列から商品を検索している。

```text
URL
↓
id
↓
products.find()
↓
商品
```

将来DBやAPIを使っても考え方は同じである。

```text
URL
↓
id
↓
DB / API Query
↓
商品あり？
├─ Yes → 詳細表示
└─ No  → 404
```

変わるのはデータの取得元であり、`URL → 識別子 → 検索 → 存在確認 → 表示または404`という流れはそのまま残る。

> **Tip**  
> モックデータでも実務のデータ取得フローを意識して作ると、後でDBへ移行するとき理解しやすい。

## 10. 覚え方

```text
[id]
→ URLの値を受け取る

params.id
→ string

Number(id)
→ numberへ変換

find()
→ 商品1件を検索

商品なし
→ undefined

notFound()
→ 404へ移行
```

今回の学習ポイントは、動的ルートを作ることだけではなく、「URLに入ってきた値を信頼せず、実際のデータを検索して存在確認する」ところまで含めて理解することである。

> **Tip**  
> 詳細ページでは「URLが存在するか」ではなく「そのURLに対応するデータが存在するか」を確認する。

---

# English

## 1. What We Experienced

On the product detail page, we used a dynamic route named `[id]` to receive a product ID from the URL.

```text
/products/1
/products/2
/products/3
/products/4
```

`[id]` does not mean “only allow IDs that exist in the product data.” It simply captures one URL segment as a value.

That is why `/products/4` and `/products/999` could still render the page during the first step even though those products did not exist.

> **Tip**  
> A dynamic route captures a URL value. Checking whether that value exists in your actual data is a separate responsibility.

## 2. The `id` from the URL Is a String

The `id` received from a dynamic route is a string.

```ts
const { id } = await params;
```

For example, visiting:

```text
/products/2
```

gives:

```ts
id === "2"
```

Our product data, however, defines `id` as a number.

```ts
type Product = {
  id: number;
  // ...
};
```

So the URL string should be converted before comparison.

```ts
const productId = Number(id);
```

> **Tip**  
> Treat URL parameters as strings and check that their type matches your data before comparing values.

## 3. Use `find()` to Retrieve One Product

A product detail page needs one matching product from a collection.

That makes `find()` a natural choice.

```ts
const product = products.find(
  (product) => product.id === productId
);
```

`find()` returns the first item that matches the condition.

```text
id = 2
↓
Search products
↓
product.id === 2
↓
Return the matching product
```

If no product matches, it returns `undefined`.

> **Tip**  
> Use `find()` when the goal is to retrieve a single item that matches a condition, such as one product detail record.

## 4. When the Product Does Not Exist

Assume the product data contains only:

```text
id: 1
id: 2
id: 3
```

If the user visits:

```text
/products/4
```

then:

```ts
products.find(...)
```

cannot find a matching item.

The result is:

```ts
undefined
```

This is not a failure of `find()`. It is the normal result for “no matching data.”

> **Tip**  
> When `find()` returns `undefined`, understand it as “no item matched the condition,” not “the method failed.”

## 5. Optional Chaining Is Useful for Temporary Checks

During an early test, you can write:

```tsx
<p>{product?.name}</p>
```

If `product` is `undefined`, the page does not throw an error and simply renders nothing there.

However, a real product detail page should not silently show an empty page for a missing product.

```text
Product exists
→ Show product detail

Product missing
→ Blank content
```

is less appropriate than:

```text
Product exists
→ Show product detail

Product missing
→ 404
```

> **Tip**  
> Optional chaining means “continue even if this value is missing.” It is not a replacement for proper error handling when the data is required.

## 6. Use `notFound()` for 404 Handling

In the Next.js App Router, `notFound()` can transition the request into a 404 response.

```ts
import { notFound } from "next/navigation";
```

After looking up the product:

```ts
if (!product) {
  notFound();
}
```

The full flow becomes:

```text
URL
↓
params.id
↓
Number(id)
↓
products.find()
↓
Product exists?
├─ Yes → Render product detail
└─ No  → notFound()
          ↓
         404
```

> **Tip**  
> Treat “what should happen when the lookup fails?” as part of the same data-fetching flow.

## 7. After `notFound()`, `product` Can Be Used Safely

In this code:

```ts
if (!product) {
  notFound();
}
```

once execution continues past the condition, TypeScript can understand that `product` exists.

So instead of:

```tsx
<p>{product?.name}</p>
```

you can write:

```tsx
<p>{product.name}</p>
```

The type flow is:

```text
find()
↓
Product | undefined
↓
if (!product)
↓
undefined case exits through notFound()
↓
After that, product is treated as Product
```

> **Tip**  
> Error handling improves not only the user experience but also TypeScript's ability to narrow types safely.

## 8. Why `/products/abc` Also Becomes a 404

Users can type non-numeric values directly into the URL.

```text
/products/abc
```

Then:

```ts
Number("abc")
```

produces:

```ts
NaN
```

No product ID matches that value, so:

```ts
products.find(...)
```

returns `undefined`, and the flow eventually reaches `notFound()`.

> **Tip**  
> A URL is user-controlled input. Never assume that only correctly formatted values will arrive.

## 9. Current Structure vs Future Production Structure

Right now, the product is retrieved from a local array.

```text
URL
↓
id
↓
products.find()
↓
Product
```

Later, when the project uses an API or database, the same concept remains.

```text
URL
↓
id
↓
DB / API Query
↓
Product exists?
├─ Yes → Render detail
└─ No  → 404
```

Only the data source changes. The flow `URL → identifier → lookup → existence check → render or 404` stays the same.

> **Tip**  
> Even with mock data, model the flow after real production data access. This makes the later transition to a database easier to understand.

## 10. A Simple Way to Remember

```text
[id]
→ Capture a URL value

params.id
→ string

Number(id)
→ Convert to number

find()
→ Look up one product

No product
→ undefined

notFound()
→ Go to 404
```

The key lesson is not only how to create a dynamic route, but also how to validate the route value by looking up real data instead of trusting the URL itself.

> **Tip**  
> On a detail page, do not ask only whether the URL pattern exists. Ask whether data corresponding to that URL actually exists.

---

# 한국어

## 1. 이번에 경험한 흐름

상품 상세 페이지에서는 `[id]`라는 동적 라우트를 사용해서 URL에서 상품 ID를 받았다.

```text
/products/1
/products/2
/products/3
/products/4
```

`[id]`는 실제로 존재하는 상품 ID만 허용하는 기능이 아니라 URL의 한 구간을 값으로 받아오는 기능이다.

그래서 처음에는 존재하지 않는 `/products/4`, `/products/999` 같은 주소도 페이지 자체는 계속 표시됐다.

> **팁**  
> 동적 라우트는 URL 값을 받아오는 기능이고, 그 값이 실제 데이터에 존재하는지는 별도로 확인해야 한다.

## 2. URL에서 받은 `id`는 문자열이다

동적 라우트에서 받는 `id`는 문자열이다.

```ts
const { id } = await params;
```

예를 들어:

```text
/products/2
```

에 접속하면:

```ts
id === "2"
```

가 된다.

반면 현재 상품 데이터에서는 `id`를 `number`로 정의했다.

```ts
type Product = {
  id: number;
  // ...
};
```

그래서 비교하기 전에 URL 문자열을 숫자로 변환한다.

```ts
const productId = Number(id);
```

> **팁**  
> URL 파라미터는 문자열이라고 생각하고, 실제 데이터의 타입과 비교하기 전에 타입이 일치하는지 확인한다.

## 3. `find()`로 상품 하나를 찾는다

상품 상세 페이지에서는 여러 상품 중 특정 상품 하나만 가져와야 한다.

그래서 `find()`가 자연스럽다.

```ts
const product = products.find(
  (product) => product.id === productId
);
```

`find()`는 조건에 맞는 첫 번째 요소 하나를 반환한다.

```text
id = 2
↓
products 검색
↓
product.id === 2
↓
해당 상품 반환
```

조건에 맞는 상품이 없으면 `undefined`를 반환한다.

> **팁**  
> 상세 페이지처럼 조건에 맞는 데이터 하나를 찾는 상황에서는 `find()`가 잘 맞는다.

## 4. 상품이 존재하지 않을 때

상품 데이터가 다음 세 개만 있다고 가정한다.

```text
id: 1
id: 2
id: 3
```

이 상태에서:

```text
/products/4
```

에 접속하면:

```ts
products.find(...)
```

는 일치하는 상품을 찾지 못한다.

결과는:

```ts
undefined
```

다.

이것은 `find()`가 실패한 것이 아니라 정상적으로 일치하는 데이터가 없다고 판단한 결과다.

> **팁**  
> `undefined`가 나왔다고 해서 `find()`가 잘못된 것이 아니다. 조건에 맞는 데이터가 없다는 정상적인 결과다.

## 5. Optional Chaining은 임시 확인에는 사용할 수 있다

초기 테스트에서는 다음처럼 작성할 수 있다.

```tsx
<p>{product?.name}</p>
```

`product`가 `undefined`여도 에러가 나지 않고 해당 부분에 아무것도 표시되지 않는다.

하지만 실제 상품 상세 페이지에서 없는 상품을 빈 화면처럼 보여주는 것은 자연스럽지 않다.

```text
상품 있음
→ 상품 상세 표시

상품 없음
→ 빈 화면
```

보다는:

```text
상품 있음
→ 상품 상세 표시

상품 없음
→ 404
```

가 더 적절하다.

> **팁**  
> Optional Chaining은 값이 없어도 계속 진행하기 위한 기능이다. 반드시 존재해야 하는 데이터에 대한 최종 예외 처리 수단은 아니다.

## 6. `notFound()`로 404를 처리한다

Next.js App Router에서는 `notFound()`를 사용해서 404 처리로 보낼 수 있다.

```ts
import { notFound } from "next/navigation";
```

상품을 찾은 다음 다음 조건을 넣는다.

```ts
if (!product) {
  notFound();
}
```

전체 흐름은 다음과 같다.

```text
URL
↓
params.id
↓
Number(id)
↓
products.find()
↓
상품이 있는가?
├─ Yes → 상품 상세 표시
└─ No  → notFound()
          ↓
         404
```

> **팁**  
> 데이터를 가져오는 것뿐 아니라 가져오지 못했을 때 어떻게 처리할지도 하나의 조회 흐름으로 생각한다.

## 7. `notFound()` 이후에는 `product`를 안전하게 사용할 수 있다

다음 코드에서:

```ts
if (!product) {
  notFound();
}
```

이 조건을 통과한 뒤에는 TypeScript도 `product`가 존재한다고 판단할 수 있다.

그래서:

```tsx
<p>{product?.name}</p>
```

대신:

```tsx
<p>{product.name}</p>
```

으로 사용할 수 있다.

타입 흐름은 다음과 같다.

```text
find()
↓
Product | undefined
↓
if (!product)
↓
undefined면 notFound()에서 처리 종료
↓
그 이후에는 Product로 취급
```

> **팁**  
> 예외 처리는 사용자 경험뿐 아니라 TypeScript가 타입을 안전하게 좁히도록 만드는 역할도 한다.

## 8. `/products/abc`도 404가 되는 이유

사용자는 URL에 숫자가 아닌 값도 직접 입력할 수 있다.

```text
/products/abc
```

이 경우:

```ts
Number("abc")
```

의 결과는:

```ts
NaN
```

이다.

어떤 상품 ID와도 일치하지 않기 때문에:

```ts
products.find(...)
```

는 `undefined`를 반환하고 최종적으로 `notFound()`로 이동한다.

> **팁**  
> URL은 사용자가 직접 변경할 수 있는 입력값이다. 항상 올바른 형식만 들어올 것이라고 믿으면 안 된다.

## 9. 현재 구조와 앞으로의 실무 구조

현재는 로컬 배열에서 상품을 찾는다.

```text
URL
↓
id
↓
products.find()
↓
상품
```

나중에 API나 DB를 사용하더라도 생각하는 흐름은 같다.

```text
URL
↓
id
↓
DB / API 조회
↓
상품이 있는가?
├─ Yes → 상세 표시
└─ No  → 404
```

달라지는 것은 데이터를 가져오는 위치이고, `URL → 식별자 → 조회 → 존재 확인 → 표시 또는 404`라는 흐름은 그대로 유지된다.

> **팁**  
> Mock 데이터 단계에서도 실무 데이터 조회 흐름을 그대로 연습하면 나중에 DB로 전환할 때 구조를 이해하기 쉬워진다.

## 10. 기억하는 방법

```text
[id]
→ URL 값 받기

params.id
→ string

Number(id)
→ number로 변환

find()
→ 상품 하나 조회

상품 없음
→ undefined

notFound()
→ 404 처리
```

이번 학습의 핵심은 동적 라우트를 만드는 것뿐 아니라, URL에 들어온 값을 그대로 신뢰하지 않고 실제 데이터를 조회해서 존재 여부까지 확인하는 것이다.

> **팁**  
> 상세 페이지에서는 URL 형식이 맞는지만 보는 것이 아니라 그 URL에 대응하는 실제 데이터가 존재하는지 확인한다.
