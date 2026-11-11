# TypeScript Type vs Runtime Data — JSON.parse()와 Order[] 타입 지정

## 日本語 → English → 한국어

---

# 1. 日本語

## `JSON.parse()` に `Order[]` を付けても検証されない理由

たとえば、次のコードがあります。

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

一見すると、

```text
JSON.parse(savedOrders)
        ↓
Order[] 型を指定
        ↓
TypeScript がデータを検証
        ↓
安全な Order[] に変換
```

のように見えるかもしれません。

しかし、実際にはそうではありません。

---

## 1. `JSON.parse()` の役割

`localStorage` には JavaScript のオブジェクトや配列をそのまま保存するのではなく、文字列として保存します。

例：

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(orders)
);
```

流れは次の通りです。

```text
JavaScript の配列・オブジェクト
        ↓
JSON.stringify()
        ↓
JSON 文字列
        ↓
localStorage
```

そして、取り出すとき：

```tsx
const savedOrders = localStorage.getItem("orders");
```

`localStorage` から取り出した値は文字列です。

そのため、

```tsx
JSON.parse(savedOrders);
```

を使って、

```text
JSON 文字列
     ↓
JSON.parse()
     ↓
JavaScript の値
```

に戻します。

**Tip**

`JSON.parse()` の役割は **JSON文字列をJavaScriptの値に変換すること**です。

`Order` 型かどうかを検証する関数ではありません。

---

## 2. `: Order[]` は何をしているのか

次のコード：

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

左側：

```tsx
const parsedOrders: Order[]
```

これは TypeScript に、

> `parsedOrders` は `Order[]` として扱う

と伝えています。

右側：

```tsx
JSON.parse(savedOrders)
```

は、JSON文字列を実際のJavaScript値に変換しています。

しかし、このコードには、

```text
id は number か？
name は string か？
status は存在するか？
items は配列か？
```

を確認する処理はありません。

つまり、

```text
: Order[]
→ TypeScript の型情報

実データのプロパティ検証
→ Runtime Validation
```

であり、別の処理です。

**Tip**

「型指定」と「データ検証」は同じものではありません。

---

## 3. 間違ったデータでも `JSON.parse()` は成功する

たとえば `localStorage` に次のデータが保存されているとします。

```json
[
  {
    "banana": "delicious"
  }
]
```

しかしコードでは：

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

とします。

`Order` 型が：

```tsx
type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: string;
};
```

だったとしても、`JSON.parse()` は失敗しない可能性があります。

なぜなら、

```json
[
  {
    "banana": "delicious"
  }
]
```

は文法的に正しい JSON だからです。

`JSON.parse()` が確認するのは、

```text
この文字列は有効な JSON か？
```

であって、

```text
このデータは Order 型か？
```

ではありません。

**Tip**

`parse` は「JSON構文を解析する」という意味で、アプリケーションの型まで検証するという意味ではありません。

---

## 4. TypeScript がエラーを出さない理由

`JSON.parse()` の戻り値は、TypeScript 上では非常に緩い型として扱われます。

概念的には：

```tsx
JSON.parse(text: string): any
```

のようなイメージです。

重要なのは：

```tsx
any
```

です。

`any` は TypeScript の型チェックを大きく弱めます。

そのため：

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

と書いても、

```text
status があるか？
items が配列か？
totalPrice が number か？
```

を厳密には確認してくれません。

**Tip**

TypeScript で `any` を見たら、

```text
型安全性が弱くなる領域
```

と考えると分かりやすいです。

---

## 5. `Order[]` を付ける意味はある

もちろん、意味はあります。

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

とすると、それ以降のコードでは `parsedOrders` を `Order[]` として扱えます。

たとえば：

```tsx
parsedOrders.map((order) => {
  console.log(order.status);
});
```

TypeScript は `order` を `Order` と認識します。

そのため、

```text
order.id
order.name
order.phone
order.items
order.status
```

などの補完が使えるようになります。

ただし、

```text
実際の JSON データが本当に Order[] かどうか
```

を検証したわけではありません。

**Tip**

型指定は「この後コード内でどう扱うか」に役立ちます。

しかし、実データが正しいことを保証するものではありません。

---

## 6. TypeScript の世界と Runtime の世界がずれる

たとえば実際の `localStorage` データが：

```json
[
  {
    "id": 1001,
    "name": "Kim"
  }
]
```

だったとします。

しかし、

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

と書いた場合、TypeScript は：

```tsx
parsedOrders[0].status
```

を `string` と考えるかもしれません。

しかし実際の Runtime では：

```tsx
parsedOrders[0].status
```

は、

```tsx
undefined
```

になります。

つまり：

```text
TypeScript が考えている世界
────────────────────
order.status
→ string


実際の Runtime
────────────────────
order.status
→ undefined
```

というズレが発生します。

**Tip**

TypeScriptエラーがないのにブラウザで `undefined` が出る場合は、

> TypeScript が信じているデータと Runtime の実データが違うのでは？

と考えてみてください。

---

## 7. 本当に検証したい場合

実際の値を確認するコードが必要です。

簡単な例：

```tsx
const data = JSON.parse(savedOrders);

if (
  Array.isArray(data) &&
  data.every(
    (order) =>
      typeof order.id === "number" &&
      typeof order.status === "string"
  )
) {
  // 安全に使う
}
```

ここでは Runtime で実際に、

```tsx
typeof order.id === "number"
```

や、

```tsx
typeof order.status === "string"
```

を確認しています。

これは単なる：

```tsx
: Order[]
```

とは違います。

```text
: Order[]
→ TypeScript の型情報

typeof / Array.isArray
→ Runtime の実データ検証
```

**Tip**

今の学習段階では完全な検証ライブラリまで使わなくても大丈夫です。

まずは **型指定とRuntime検証は別物** と理解することが重要です。

---

## 8. `any` と `unknown`

外部データを扱うときは `any` と `unknown` の違いも重要です。

### `any`

```text
何か分からないけど
そのまま使ってよい
```

に近い考え方です。

### `unknown`

```text
何か分からない
だから確認してから使う
```

という考え方です。

概念的には：

```tsx
const data: unknown = JSON.parse(savedOrders);
```

とすると、データを使う前に確認する必要があります。

| 型 | イメージ |
|---|---|
| `any` | 検査せずに使う |
| `unknown` | 確認してから使う |
| `Order[]` | Order配列として扱う |

**Tip**

API、localStorage、ユーザー入力など、外部から来るデータは最初から完全には信用しない、という考え方が重要です。

---

## 9. 今回の問題の正体

コード：

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

TypeScript の型：

```tsx
type Order = {
  // ...
  status: string;
};
```

しかし過去の localStorage データ：

```json
{
  "id": 1001,
  "name": "Kim"
}
```

には `status` がありませんでした。

そのため：

```text
TypeScript
status は string だと考える

        ↓

localStorage 実データ
status が存在しない

        ↓

JSON.parse()

        ↓

order.status

        ↓

undefined
```

となりました。

---

## 最終 Mental Model

```text
TypeScript Type
────────────────────────
データがどうあるべきかを説明する

しかし

実際のデータを自動修正しない
実際のデータを自動検証しない

        ↓

Runtime Data
────────────────────────
localStorage
API
ユーザー入力
JavaScript オブジェクト

実際の値が重要
```

### 最重要ポイント

> **`JSON.parse()` は JSON を JavaScript の値に変換するだけで、`Order[]` 型かどうかは検証しない。**

> **`: Order[]` は TypeScript にその値を Order 配列として扱うよう伝えるだけで、実データを変換・検証しない。**

> **外部データが本当に期待する構造か確認したい場合は Runtime Validation が必要。**

---

# 2. English

## Why `Order[]` does not validate the result of `JSON.parse()`

Consider this code:

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

It may look like this:

```text
JSON.parse(savedOrders)
        ↓
assign Order[] type
        ↓
TypeScript validates data
        ↓
safe Order[] result
```

But that is not what actually happens.

---

## 1. What `JSON.parse()` does

`localStorage` stores strings, not JavaScript objects or arrays directly.

Example:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(orders)
);
```

Flow:

```text
JavaScript object / array
        ↓
JSON.stringify()
        ↓
JSON string
        ↓
localStorage
```

When we read it:

```tsx
const savedOrders = localStorage.getItem("orders");
```

the result is a string.

We then use:

```tsx
JSON.parse(savedOrders);
```

to convert it back:

```text
JSON string
     ↓
JSON.parse()
     ↓
JavaScript value
```

**Tip**

`JSON.parse()` converts a JSON string into a JavaScript value.

It does not validate whether the result matches your `Order` type.

---

## 2. What `: Order[]` actually does

In this code:

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

the left side:

```tsx
const parsedOrders: Order[]
```

tells TypeScript:

> Treat `parsedOrders` as an array of `Order`.

The right side:

```tsx
JSON.parse(savedOrders)
```

converts the JSON string into an actual JavaScript value.

But no code checks:

```text
Is id a number?
Is name a string?
Does status exist?
Is items an array?
```

So:

```text
: Order[]
→ TypeScript type information

actual property checking
→ Runtime Validation
```

These are different things.

**Tip**

Type annotation and data validation are not the same operation.

---

## 3. Invalid application data can still be valid JSON

Suppose localStorage contains:

```json
[
  {
    "banana": "delicious"
  }
]
```

and the code says:

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

while `Order` is:

```tsx
type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: string;
};
```

`JSON.parse()` may still succeed.

Why?

Because:

```json
[
  {
    "banana": "delicious"
  }
]
```

is syntactically valid JSON.

`JSON.parse()` checks:

```text
Is this valid JSON syntax?
```

It does not check:

```text
Does this data match the Order type?
```

**Tip**

Think of `parse` as parsing JSON syntax, not validating your application's domain model.

---

## 4. Why TypeScript may not report an error

`JSON.parse()` has a very permissive return type.

Conceptually, it behaves like:

```tsx
JSON.parse(text: string): any
```

The important part is:

```tsx
any
```

`any` weakens TypeScript's type safety.

So with:

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

TypeScript does not necessarily verify:

```text
Does status exist?
Is items an array?
Is totalPrice a number?
```

**Tip**

Whenever you see `any`, think:

```text
TypeScript's safety net is weaker here.
```

---

## 5. `Order[]` is still useful

It still has value.

After:

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

TypeScript treats `parsedOrders` as `Order[]`.

For example:

```tsx
parsedOrders.map((order) => {
  console.log(order.status);
});
```

TypeScript understands `order` as an `Order`.

That gives you autocomplete for:

```text
order.id
order.name
order.phone
order.items
order.status
```

But it still does not prove that the original JSON actually matched `Order[]`.

**Tip**

A type annotation helps with how code is handled afterward.

It does not guarantee that incoming runtime data is correct.

---

## 6. TypeScript's world can differ from Runtime

Suppose localStorage actually contains:

```json
[
  {
    "id": 1001,
    "name": "Kim"
  }
]
```

but we write:

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

TypeScript may treat:

```tsx
parsedOrders[0].status
```

as a string.

But at runtime:

```tsx
parsedOrders[0].status
```

may actually be:

```tsx
undefined
```

So we can have:

```text
TypeScript's view
────────────────────
order.status
→ string


Actual Runtime
────────────────────
order.status
→ undefined
```

**Tip**

If TypeScript shows no error but the browser produces `undefined`, ask:

> Is the actual runtime data different from what TypeScript assumes?

---

## 7. Real Runtime Validation

To truly validate data, we need runtime checks.

Simple example:

```tsx
const data = JSON.parse(savedOrders);

if (
  Array.isArray(data) &&
  data.every(
    (order) =>
      typeof order.id === "number" &&
      typeof order.status === "string"
  )
) {
  // safe to continue
}
```

Now JavaScript actually checks:

```tsx
typeof order.id === "number"
```

and:

```tsx
typeof order.status === "string"
```

This is different from:

```tsx
: Order[]
```

```text
: Order[]
→ TypeScript type information

typeof / Array.isArray
→ Runtime data validation
```

**Tip**

At this stage, you do not need a full validation library.

The important concept is that type annotation and runtime validation are separate.

---

## 8. `any` vs `unknown`

When handling external data, the difference between `any` and `unknown` is useful.

### `any`

Conceptually:

```text
I do not know what this is,
but let me use it anyway.
```

### `unknown`

Conceptually:

```text
I do not know what this is,
so I should check it before using it.
```

Example:

```tsx
const data: unknown = JSON.parse(savedOrders);
```

| Type | Mental model |
|---|---|
| `any` | use without checking |
| `unknown` | check before use |
| `Order[]` | treat as an array of Order |

**Tip**

Data coming from APIs, localStorage, user input, files, or other external sources should not always be blindly trusted.

---

## 9. What happened in our project

We had:

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

and:

```tsx
type Order = {
  // ...
  status: string;
};
```

but the old localStorage data did not contain `status`.

So:

```text
TypeScript
assumes status is string

        ↓

actual localStorage data
has no status

        ↓

JSON.parse()

        ↓

order.status

        ↓

undefined
```

That was the exact cause of the issue.

---

## Final Mental Model

```text
TypeScript Type
────────────────────────
describes what data should look like

but does not

automatically modify data
automatically validate runtime data

        ↓

Runtime Data
────────────────────────
localStorage
API
user input
JavaScript objects

actual values matter
```

### Key Takeaways

> **`JSON.parse()` converts JSON into a JavaScript value. It does not validate the result against `Order[]`.**

> **`: Order[]` tells TypeScript to treat the value as an Order array. It does not transform or validate the actual data.**

> **If you need to guarantee the structure of external data, you need Runtime Validation.**

---

# 3. 한국어

## `JSON.parse()`에 `Order[]`를 붙여도 검증되지 않는 이유

예를 들어 다음 코드가 있습니다.

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

처음 보면 이렇게 생각하기 쉽습니다.

```text
JSON.parse(savedOrders)
        ↓
Order[] 타입 지정
        ↓
TypeScript가 데이터 검사
        ↓
안전한 Order[]로 변환
```

하지만 실제 동작은 그렇지 않습니다.

---

## 1. `JSON.parse()`의 역할

`localStorage`에는 JavaScript 객체나 배열을 그대로 저장하지 않고 문자열 형태로 저장합니다.

예:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(orders)
);
```

흐름:

```text
JavaScript 객체 / 배열
        ↓
JSON.stringify()
        ↓
JSON 문자열
        ↓
localStorage
```

다시 꺼낼 때:

```tsx
const savedOrders = localStorage.getItem("orders");
```

`localStorage`에서 가져온 값은 문자열입니다.

그래서:

```tsx
JSON.parse(savedOrders);
```

를 사용해서:

```text
JSON 문자열
     ↓
JSON.parse()
     ↓
JavaScript 값
```

으로 바꿉니다.

**팁**

`JSON.parse()`의 역할은 **JSON 문자열을 JavaScript 값으로 바꾸는 것**입니다.

그 값이 `Order` 타입인지 검사하는 함수는 아닙니다.

---

## 2. `: Order[]`는 실제로 무엇을 하는가

다음 코드:

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

왼쪽:

```tsx
const parsedOrders: Order[]
```

은 TypeScript에게:

> `parsedOrders`를 `Order[]`로 다루겠다.

라고 알려주는 것입니다.

오른쪽:

```tsx
JSON.parse(savedOrders)
```

은 JSON 문자열을 실제 JavaScript 값으로 바꾸는 역할만 합니다.

그런데 이 코드 어디에도:

```text
id가 number인가?
name이 string인가?
status가 존재하는가?
items가 배열인가?
```

를 검사하는 과정은 없습니다.

즉:

```text
: Order[]
→ TypeScript 타입 정보

실제 데이터의 property 검사
→ Runtime Validation
```

둘은 서로 다른 작업입니다.

**팁**

`타입 지정`과 `데이터 검증`은 같은 개념이 아닙니다.

---

## 3. 이상한 데이터라도 `JSON.parse()`는 성공할 수 있다

예를 들어 localStorage에 다음 데이터가 저장되어 있다고 해봅시다.

```json
[
  {
    "banana": "맛있음"
  }
]
```

그런데 코드에서는:

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

라고 작성합니다.

우리의 `Order` 타입이:

```tsx
type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: string;
};
```

라고 하더라도 `JSON.parse()` 자체는 성공할 수 있습니다.

왜냐하면:

```json
[
  {
    "banana": "맛있음"
  }
]
```

은 문법적으로 올바른 JSON이기 때문입니다.

`JSON.parse()`가 검사하는 것은:

```text
이 문자열이 올바른 JSON인가?
```

이지,

```text
이 데이터가 Order 타입인가?
```

가 아닙니다.

**팁**

`JSON.parse()`의 `parse`는 **JSON 문법을 해석한다**는 의미이지, 애플리케이션의 타입까지 검증한다는 의미는 아닙니다.

---

## 4. TypeScript가 왜 에러를 내지 않는가

`JSON.parse()`의 반환값은 TypeScript에서 매우 느슨하게 다뤄집니다.

개념적으로는:

```tsx
JSON.parse(text: string): any
```

처럼 생각할 수 있습니다.

중요한 것은:

```tsx
any
```

입니다.

`any`는 TypeScript의 타입 검사를 크게 약화시킵니다.

그래서:

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

라고 작성해도 TypeScript가 실제로:

```text
status가 있는가?
items가 배열인가?
totalPrice가 number인가?
```

를 하나씩 검사하지는 않습니다.

**팁**

TypeScript 코드에서 `any`를 보면:

```text
타입 안전망이 약해지는 구간
```

이라고 생각하면 좋습니다.

---

## 5. 그렇다면 `Order[]`는 아무 의미가 없는가?

아닙니다.

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

라고 작성하면 그 이후 코드에서는 `parsedOrders`를 `Order[]`로 다루게 됩니다.

예:

```tsx
parsedOrders.map((order) => {
  console.log(order.status);
});
```

TypeScript는 `order`를 `Order`로 이해합니다.

그래서 자동완성에서도:

```text
order.id
order.name
order.phone
order.items
order.status
```

같은 속성을 사용할 수 있습니다.

하지만 이것은:

```text
실제 JSON 데이터가 정말 Order[]인지 검사했다
```

라는 뜻은 아닙니다.

**팁**

타입 지정은 **그 이후 코드에서 값을 어떻게 사용할지**에 도움을 줍니다.

하지만 외부에서 들어온 실제 데이터가 올바른 구조라는 것을 보장하지는 않습니다.

---

## 6. TypeScript가 생각하는 세계와 Runtime이 다를 수 있다

실제 localStorage 데이터가:

```json
[
  {
    "id": 1001,
    "name": "Kim"
  }
]
```

이라고 해봅시다.

그런데 코드에서는:

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

라고 작성했습니다.

TypeScript는:

```tsx
parsedOrders[0].status
```

를 `string`이라고 생각할 수 있습니다.

그러나 실제 Runtime에서는:

```tsx
parsedOrders[0].status
```

의 결과가:

```tsx
undefined
```

일 수 있습니다.

즉:

```text
TypeScript가 생각하는 세계
─────────────────────
order.status
→ string


실제 Runtime 세계
─────────────────────
order.status
→ undefined
```

라는 차이가 생길 수 있습니다.

**팁**

TypeScript 에러가 없는데 브라우저에서 `undefined`가 나온다면:

> TypeScript가 믿고 있는 데이터와 실제 Runtime 데이터가 서로 다른 건 아닐까?

를 먼저 의심해볼 수 있습니다.

---

## 7. 실제 데이터를 검증하려면

실제 JavaScript 코드로 Runtime에서 데이터를 확인해야 합니다.

간단한 예:

```tsx
const data = JSON.parse(savedOrders);

if (
  Array.isArray(data) &&
  data.every(
    (order) =>
      typeof order.id === "number" &&
      typeof order.status === "string"
  )
) {
  // 안전하게 사용
}
```

여기서는 실제 Runtime에서:

```tsx
typeof order.id === "number"
```

와:

```tsx
typeof order.status === "string"
```

을 직접 검사합니다.

이것은 단순히:

```tsx
: Order[]
```

라고 타입을 붙이는 것과 다릅니다.

```text
: Order[]
→ TypeScript 타입 정보

typeof / Array.isArray
→ Runtime 실제 데이터 검증
```

**팁**

지금 단계에서는 완전한 검증 시스템을 구현할 필요는 없습니다.

핵심은 **타입 선언과 Runtime Validation은 별개의 개념**이라는 것을 이해하는 것입니다.

---

## 8. `any`와 `unknown`

외부 데이터를 다룰 때는 `any`와 `unknown`의 차이도 중요합니다.

### `any`

개념적으로:

```text
뭔지 모르겠지만
그냥 사용하자
```

에 가깝습니다.

### `unknown`

개념적으로:

```text
뭔지 모르겠다
그러니 확인한 뒤 사용하자
```

에 가깝습니다.

예:

```tsx
const data: unknown = JSON.parse(savedOrders);
```

| 타입 | 의미 |
|---|---|
| `any` | 검사하지 않고 사용 |
| `unknown` | 확인한 뒤 사용 |
| `Order[]` | Order 배열이라고 TypeScript에 알려줌 |

**팁**

API, localStorage, 사용자 입력, 파일 등 외부에서 들어온 값은 처음부터 완전히 믿지 않는다는 감각이 중요합니다.

---

## 9. 이번 프로젝트에서 실제로 일어난 일

우리 코드는:

```tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

였습니다.

그리고 타입에는:

```tsx
type Order = {
  // ...
  status: string;
};
```

이 있었지만, 과거 localStorage 데이터에는 `status`가 없었습니다.

그래서:

```text
TypeScript
status를 string이라고 생각함

        ↓

실제 localStorage 데이터
status 없음

        ↓

JSON.parse()

        ↓

order.status

        ↓

undefined
```

가 된 것입니다.

이것이 주문상태가 화면에 나오지 않았던 정확한 이유입니다.

---

## Final Mental Model

```text
TypeScript Type
────────────────────────
데이터가 어떻게 생겨야 하는지 설명

하지만

실제 데이터를 자동 수정하지 않음
실제 데이터를 자동 검증하지 않음

        ↓

Runtime Data
────────────────────────
localStorage
API
사용자 입력
JavaScript 객체

실제로 들어 있는 값이 중요
```

## 최종 핵심 정리

> **`JSON.parse()`는 JSON 문자열을 JavaScript 값으로 바꿀 뿐, 그 값이 `Order[]`인지 검증하지 않는다.**

> **`: Order[]`는 TypeScript에게 해당 값을 Order 배열로 다루겠다고 알려주는 것이지, 실제 데이터를 변환하거나 검증하는 것이 아니다.**

> **외부 데이터가 실제로 원하는 구조인지 보장하려면 Runtime Validation이 따로 필요하다.**

---

## 핵심 공식

```text
JSON.parse()
→ JSON 문자열을 JavaScript 값으로 변환

: Order[]
→ TypeScript 타입 정보

Runtime Validation
→ 실제 데이터 구조 검사
```

**팁**

앞으로 `localStorage`, API, 사용자 입력처럼 외부에서 들어온 데이터를 볼 때는 항상 다음 질문을 해보세요.

> **TypeScript가 이렇게 믿고 있는 것인가, 아니면 실제 Runtime에서도 정말 그런 값이 존재하는가?**
