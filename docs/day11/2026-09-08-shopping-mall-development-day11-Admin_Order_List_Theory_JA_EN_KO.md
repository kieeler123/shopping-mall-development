# Day 11 --- 관리자 주문 목록 이론 정리

> 학습 흐름:
> `Order → Order[] → map() → order → Admin UI → order.status → key`

------------------------------------------------------------------------

# 日本語

## STEP 1 --- 管理者画面の役割を理解する

Day 11では、管理者が複数の注文を確認できる「管理者注文一覧画面」を作る。

顧客画面と管理者画面では、同じ `Order` データを使っても目的が異なる。

-   顧客：自分の注文を確認する
-   管理者：複数の注文を一覧で確認・管理する

Day
11では注文ステータスの「変更」はまだ行わず、正しく「表示」することに集中する。

**Tip**

データそのものと、そのデータをどの画面で何のために使うかは分けて考える。同じ
`Order` でもUIの目的によって見せ方が変わる。

------------------------------------------------------------------------

## STEP 2 --- `Order` と `Order[]`

`Order` は「1件の注文」を表す型。

``` ts
type Order = {
  id: number;
  name: string;
  totalPrice: number;
  status: OrderStatus;
};
```

`Order[]` は「複数の注文」を表す。

``` ts
const orders: Order[] = [
  { id: 1, name: "田中", totalPrice: 25000, status: "支払い完了" },
  { id: 2, name: "佐藤", totalPrice: 42000, status: "商品準備中" },
];
```

型の関係：

``` text
Order    → 注文1件
Order[]  → 注文複数件
```

**Tip**

`[]` を見たら「複数」と考える。

``` text
string[]    → 複数の文字列
number[]    → 複数の数値
Order[]     → 複数の注文
```

------------------------------------------------------------------------

## STEP 3 --- 管理者用の注文データを準備する

管理者画面では複数の注文が必要なので、`Order[]` 型のデータを準備する。

``` ts
const orders: Order[] = [
  {
    id: 1,
    name: "田中",
    phone: "090-1111-2222",
    address: "東京都",
    totalPrice: 25000,
    createdAt: "2026-09-09 10:30",
    status: "支払い完了",
  },
];
```

配列の各オブジェクトは `Order` 型のルールに従う必要がある。

**Tip**

最初からDB接続を考えず、まずモックデータで `Order[]`
の構造とUI表示を確認すると理解しやすい。

------------------------------------------------------------------------

## STEP 4 --- `map()` で複数の注文を表示する

`orders` は配列なので、`map()`
を使って注文を1件ずつ取り出し、UIに変換できる。

``` tsx
{orders.map((order) => {
  return (
    <div key={order.id}>
      <p>{order.name}</p>
      <p>{order.totalPrice}</p>
      <p>{order.status}</p>
    </div>
  );
})}
```

型の流れ：

``` text
orders: Order[]
      ↓ map()
order: Order
      ↓
UI
```

`order` という名前は自由だが、複数形 `orders` と単数形 `order`
を使うと意味が分かりやすい。

**Tip**

`map()`
を「配列を1件ずつ見ながら、それぞれから新しい結果（ReactではUI）を作る処理」と考える。

------------------------------------------------------------------------

## STEP 5 --- 注文情報とネストした `map()`

管理者画面では必要に応じて注文番号、注文者、電話番号、住所、商品、合計金額、注文日時、ステータスなどを表示する。

注文の中に商品配列がある場合：

``` ts
type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number;
  items: OrderItem[];
};
```

`order.items` も配列なので、もう一度 `map()` を使える。

``` tsx
{orders.map((order) => {
  return (
    <div key={order.id}>
      {order.items.map((item) => {
        return (
          <div key={item.id}>
            {item.name}
          </div>
        );
      })}
    </div>
  );
})}
```

型の流れ：

``` text
orders       → Order[]
order        → Order
order.items  → OrderItem[]
item         → OrderItem
```

**Tip**

ネストした `map()`
が難しい場合は、先に「どこが配列か」を探す。配列ごとに `map()`
が1段あると考える。

------------------------------------------------------------------------

## STEP 6 --- `OrderStatus` を再利用する

Day 10で作った `OrderStatus` を `Order` の `status` に使う。

``` ts
type OrderStatus =
  | "支払い完了"
  | "商品準備中"
  | "配送中"
  | "配送完了";

type Order = {
  id: number;
  status: OrderStatus;
};
```

そして管理者画面では：

``` tsx
<p>{order.status}</p>
```

として現在の状態を表示する。

全体の流れ：

``` text
OrderStatus
    ↓
Order.status
    ↓
order.status
    ↓
管理者画面に表示
```

Day 11は表示まで。状態変更はDay 12で扱う。

**Tip**

`status: string` ではなく `status: OrderStatus`
にすると、許可した注文状態だけを使える。

------------------------------------------------------------------------

## STEP 7 --- React の `key`

`map()` で複数の要素を表示するとき、Reactが各項目を識別できるように
`key` を指定する。

``` tsx
{orders.map((order) => {
  return (
    <div key={order.id}>
      {order.name}
    </div>
  );
})}
```

`id` と `key` は同じものではない。

``` text
id  → データを識別する値
key → Reactがリスト項目を識別するための情報
```

`key={order.id}` は「注文の `id` をReactの `key`
として使う」という意味。

ネストした `map()` では：

``` tsx
<div key={order.id}>
  {order.items.map((item) => (
    <div key={item.id}>{item.name}</div>
  ))}
</div>
```

**Tip**

安定した固有の `id` がある場合は、それを `key` に使う。`key`
は画面に表示するための値ではなく、Reactがリストを追跡するための情報。

------------------------------------------------------------------------

## STEP 8 --- 統合とテスト

Day 11の最終的な流れ：

``` text
Order
↓
Order[]
↓
orders.map()
↓
order
↓
管理者UI
↓
order.items.map()
↓
item
↓
order.status
↓
key
```

確認するポイントは、複数の注文が表示されること、各注文データが正しいこと、現在のステータスが表示されること、リストに適切な
`key` があること。

Day 11の完成条件：

``` text
管理者が複数の注文と
各注文の現在のステータスを確認できる
```

**Tip**

Day
11では「表示できるか」をテストする。ステータスを変更するUIやロジックはDay
12に分ける。

------------------------------------------------------------------------

# English

## STEP 1 --- Understand the Role of the Admin Page

Day 11 focuses on building an admin order list page where an
administrator can view multiple orders.

The same `Order` data can serve different UI purposes:

-   Customer: views their own order.
-   Admin: views and manages multiple orders.

Day 11 focuses on displaying the data correctly. Updating the order
status comes later.

**Tip**

Separate the data model from the purpose of the UI. The same `Order` can
be presented differently depending on who uses the page.

------------------------------------------------------------------------

## STEP 2 --- `Order` vs `Order[]`

`Order` represents one order.

``` ts
type Order = {
  id: number;
  name: string;
  totalPrice: number;
  status: OrderStatus;
};
```

`Order[]` represents multiple orders.

``` ts
const orders: Order[] = [
  { id: 1, name: "John", totalPrice: 25000, status: "PAID" },
  { id: 2, name: "Jane", totalPrice: 42000, status: "PREPARING" },
];
```

The relationship is:

``` text
Order    → one order
Order[]  → multiple orders
```

**Tip**

When you see `[]`, think "multiple values": `string[]`, `number[]`,
`Order[]`.

------------------------------------------------------------------------

## STEP 3 --- Prepare Admin Order Data

The admin page needs multiple orders, so prepare data typed as
`Order[]`.

``` ts
const orders: Order[] = [
  {
    id: 1,
    name: "John",
    phone: "010-1111-2222",
    address: "Seoul",
    totalPrice: 25000,
    createdAt: "2026-09-09 10:30",
    status: "PAID",
  },
];
```

Every object inside the array must follow the `Order` type.

**Tip**

Start with mock data before connecting a database. This makes it easier
to verify the type structure and rendering logic first.

------------------------------------------------------------------------

## STEP 4 --- Render Multiple Orders with `map()`

Because `orders` is an array, `map()` can process each order and return
UI for it.

``` tsx
{orders.map((order) => {
  return (
    <div key={order.id}>
      <p>{order.name}</p>
      <p>{order.totalPrice}</p>
      <p>{order.status}</p>
    </div>
  );
})}
```

Type flow:

``` text
orders: Order[]
      ↓ map()
order: Order
      ↓
UI
```

The callback variable does not have to be named `order`, but using
plural `orders` and singular `order` makes the code easier to
understand.

**Tip**

Think of `map()` as: "Look at each item in an array and create a new
result from each one." In React, that result is often UI.

------------------------------------------------------------------------

## STEP 5 --- Display Order Fields and Use Nested `map()`

An admin order page may display fields such as the order ID, customer
name, phone number, address, items, total price, creation time, and
status.

If an order contains an array of items:

``` ts
type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number;
  items: OrderItem[];
};
```

Then `order.items` can also use `map()`.

``` tsx
{orders.map((order) => {
  return (
    <div key={order.id}>
      {order.items.map((item) => {
        return (
          <div key={item.id}>
            {item.name}
          </div>
        );
      })}
    </div>
  );
})}
```

Type flow:

``` text
orders       → Order[]
order        → Order
order.items  → OrderItem[]
item         → OrderItem
```

**Tip**

When nested `map()` feels confusing, find the arrays first. Each array
can correspond to one level of `map()`.

------------------------------------------------------------------------

## STEP 6 --- Reuse `OrderStatus`

Reuse the `OrderStatus` type created on Day 10.

``` ts
type OrderStatus =
  | "PAID"
  | "PREPARING"
  | "SHIPPING"
  | "DELIVERED";

type Order = {
  id: number;
  status: OrderStatus;
};
```

The admin UI can display it with:

``` tsx
<p>{order.status}</p>
```

The full relationship is:

``` text
OrderStatus
    ↓
Order.status
    ↓
order.status
    ↓
Admin UI
```

Day 11 displays the status. Day 12 will handle changing it.

**Tip**

Using `status: OrderStatus` instead of `status: string` restricts the
value to the allowed order statuses.

------------------------------------------------------------------------

## STEP 7 --- React `key`

When rendering a list with `map()`, React needs a `key` to identify each
list item.

``` tsx
{orders.map((order) => {
  return (
    <div key={order.id}>
      {order.name}
    </div>
  );
})}
```

`id` and `key` are related but are not the same concept.

``` text
id  → identifies the data
key → helps React identify a rendered list item
```

`key={order.id}` means that the order's existing ID is being used as
React's key.

For nested lists:

``` tsx
<div key={order.id}>
  {order.items.map((item) => (
    <div key={item.id}>{item.name}</div>
  ))}
</div>
```

**Tip**

Prefer a stable, unique ID when one exists. A React `key` is for list
tracking; it is not something that is displayed to the user.

------------------------------------------------------------------------

## STEP 8 --- Integration and Testing

The complete Day 11 flow is:

``` text
Order
↓
Order[]
↓
orders.map()
↓
order
↓
Admin UI
↓
order.items.map()
↓
item
↓
order.status
↓
key
```

Verify that multiple orders render, each order displays the correct
data, each current status appears correctly, and each rendered list item
has an appropriate key.

Day 11 completion goal:

``` text
The admin can view multiple orders
and see the current status of each order.
```

**Tip**

Test display behavior on Day 11. Keep status-changing UI and update
logic separate for Day 12.

------------------------------------------------------------------------

# 한국어

## STEP 1 --- 관리자 화면의 역할 이해하기

Day 11에서는 관리자가 여러 주문을 확인할 수 있는 **관리자 주문 목록
화면**을 만든다.

같은 `Order` 데이터라도 사용하는 화면의 목적은 다를 수 있다.

-   고객: 자신의 주문을 확인한다.
-   관리자: 여러 주문을 한 번에 확인하고 관리한다.

Day 11에서는 주문 상태를 변경하지 않고 **올바르게 표시하는 것**에
집중한다.

**팁**

데이터와 UI의 목적을 분리해서 생각하자. 같은 `Order`라도 누가 어떤
목적으로 보느냐에 따라 UI가 달라질 수 있다.

------------------------------------------------------------------------

## STEP 2 --- `Order`와 `Order[]`

`Order`는 주문 하나를 나타내는 타입이다.

``` ts
type Order = {
  id: number;
  name: string;
  totalPrice: number;
  status: OrderStatus;
};
```

`Order[]`는 주문 여러 개를 의미한다.

``` ts
const orders: Order[] = [
  { id: 1, name: "김철수", totalPrice: 25000, status: "결제완료" },
  { id: 2, name: "이영희", totalPrice: 42000, status: "상품준비중" },
];
```

관계는 다음과 같다.

``` text
Order    → 주문 하나
Order[]  → 주문 여러 개
```

**팁**

`[]`를 보면 우선 "여러 개"라고 생각하자.

``` text
string[]    → 문자열 여러 개
number[]    → 숫자 여러 개
Order[]     → 주문 여러 개
```

------------------------------------------------------------------------

## STEP 3 --- 관리자용 주문 데이터 준비하기

관리자는 여러 주문을 확인해야 하므로 `Order[]` 타입의 데이터를 준비한다.

``` ts
const orders: Order[] = [
  {
    id: 1,
    name: "김철수",
    phone: "010-1111-2222",
    address: "서울특별시 강남구",
    totalPrice: 25000,
    createdAt: "2026-09-09 10:30",
    status: "결제완료",
  },
];
```

배열 안의 각 객체는 `Order` 타입의 구조를 따라야 한다.

**팁**

처음부터 DB 연결까지 생각하지 말고 임시 데이터로 `Order[]` 구조와 화면
렌더링부터 확인하면 이해하기 쉽다.

------------------------------------------------------------------------

## STEP 4 --- `map()`으로 여러 주문 렌더링하기

`orders`는 배열이므로 `map()`을 사용해 주문을 하나씩 접근하고 UI를 만들
수 있다.

``` tsx
{orders.map((order) => {
  return (
    <div key={order.id}>
      <p>{order.name}</p>
      <p>{order.totalPrice}</p>
      <p>{order.status}</p>
    </div>
  );
})}
```

타입 흐름:

``` text
orders: Order[]
      ↓ map()
order: Order
      ↓
UI
```

`order`라는 이름 자체는 자유지만 `orders`처럼 복수형 배열과 `order`처럼
단수형 요소를 구분하면 읽기 쉽다.

**팁**

`map()`을 "배열의 데이터를 하나씩 보면서 각각 새로운 결과를 만든다"라고
이해하자. React에서는 그 결과가 UI인 경우가 많다.

------------------------------------------------------------------------

## STEP 5 --- 주문 정보 표시와 중첩 `map()`

관리자 주문 화면에서는 필요에 따라 주문번호, 주문자, 전화번호, 주소,
상품, 총 금액, 주문일시, 상태 등을 표시할 수 있다.

주문 하나 안에 상품 배열이 있다면:

``` ts
type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number;
  items: OrderItem[];
};
```

`order.items` 역시 배열이므로 다시 `map()`을 사용할 수 있다.

``` tsx
{orders.map((order) => {
  return (
    <div key={order.id}>
      {order.items.map((item) => {
        return (
          <div key={item.id}>
            {item.name}
          </div>
        );
      })}
    </div>
  );
})}
```

타입 관계:

``` text
orders       → Order[]
order        → Order
order.items  → OrderItem[]
item         → OrderItem
```

**팁**

중첩 `map()`이 헷갈리면 먼저 배열부터 찾자. `orders`가 배열이라 바깥
`map()`, `order.items`도 배열이라 안쪽 `map()`이 있는 것이다.

------------------------------------------------------------------------

## STEP 6 --- `OrderStatus` 재사용하기

Day 10에서 만든 `OrderStatus`를 `Order`의 `status` 타입으로 사용한다.

``` ts
type OrderStatus =
  | "결제완료"
  | "상품준비중"
  | "배송중"
  | "배송완료";

type Order = {
  id: number;
  status: OrderStatus;
};
```

관리자 화면에서는:

``` tsx
<p>{order.status}</p>
```

로 현재 상태를 표시할 수 있다.

전체 흐름:

``` text
OrderStatus
    ↓
Order.status
    ↓
order.status
    ↓
관리자 UI에 표시
```

Day 11은 상태를 **표시**하는 단계이고, 상태 **변경**은 Day 12에서
진행한다.

**팁**

`status: string`보다 `status: OrderStatus`를 사용하면 미리 허용한 주문
상태만 사용할 수 있어 타입 안정성이 높아진다.

------------------------------------------------------------------------

## STEP 7 --- React의 `key`

`map()`으로 여러 요소를 렌더링할 때 React가 각 항목을 식별할 수 있도록
`key`를 제공한다.

``` tsx
{orders.map((order) => {
  return (
    <div key={order.id}>
      {order.name}
    </div>
  );
})}
```

`id`와 `key`는 같은 개념이 아니다.

``` text
id  → 데이터 자체를 식별하는 값
key → React가 렌더링된 목록 항목을 식별하는 정보
```

따라서:

``` tsx
key={order.id}
```

는 `id`와 `key`가 같다는 뜻이 아니라 **주문의 `id` 값을 React의 `key`로
사용한다**는 뜻이다.

중첩된 목록에서는:

``` tsx
<div key={order.id}>
  {order.items.map((item) => (
    <div key={item.id}>{item.name}</div>
  ))}
</div>
```

처럼 각 배열의 항목을 구별할 수 있는 값을 사용한다.

**팁**

고유하고 안정적인 `id`가 있다면 `key`로 사용하는 것이 자연스럽다.
`key`는 화면에 보여주는 값이 아니라 React가 목록을 추적하기 위한 정보다.

------------------------------------------------------------------------

## STEP 8 --- 통합 및 테스트

Day 11의 전체 흐름은 다음과 같다.

``` text
Order
↓
Order[]
↓
orders.map()
↓
order
↓
관리자 UI
↓
order.items.map()
↓
item
↓
order.status
↓
key
```

최종적으로 여러 주문이 표시되는지, 각 주문 데이터가 정확한지, 각 주문의
현재 상태가 보이는지, `map()`으로 만든 목록에 적절한 `key`가 있는지
확인한다.

Day 11 완료 기준:

``` text
관리자가 여러 주문을 확인할 수 있고
각 주문의 현재 상태를 볼 수 있다.
```

**팁**

Day 11 테스트의 기준은 "잘 표시되는가?"이다. 상태를 변경하는 버튼과
업데이트 로직은 Day 12로 분리해서 생각하자.

------------------------------------------------------------------------

# Day 11 핵심 요약

``` text
Order
→ 주문 하나의 타입

Order[]
→ 주문 여러 개

orders.map((order) => ...)
→ 여러 주문에서 주문 하나씩 접근

order.items: OrderItem[]
→ 주문 하나가 가진 여러 상품

order.items.map((item) => ...)
→ 상품 하나씩 접근

order.status: OrderStatus
→ 현재 주문 상태

key={order.id}
→ 주문의 id를 React 목록 식별용 key로 사용
```

Day 11의 핵심 문장:

> **여러 주문(`Order[]`)을 `map()`으로 하나씩 렌더링하고, 각 주문의
> 정보와 현재 상태를 관리자 화면에 표시한다.**

------------------------------------------------------------------------

# Day 11 復習問題 / Review Questions / Day 11 복습문제

## 日本語 --- 復習問題

### STEP 1

**Q1.** 顧客画面と管理者画面で同じ `Order`
データを使っても、UIの目的が異なる理由を説明してください。

### STEP 2

**Q2.** `Order` と `Order[]` の違いは何ですか？

``` ts
const orders: Order[] = [...]
```

このコードの `orders` は注文1件ですか、それとも複数件ですか？

### STEP 3

**Q3.** `orders: Order[]`
の配列内にある各オブジェクトは、どの型のルールに従う必要がありますか？

### STEP 4

**Q4.** 次のコードで `orders` と `order` の型をそれぞれ答えてください。

``` tsx
orders.map((order) => {
  return <p>{order.name}</p>;
});
```

### STEP 5

**Q5.** `order.items` の型が `OrderItem[]`
の場合、`order.items.map((item) => ...)` の `item` は何を表しますか？

### STEP 6

**Q6.** `status: string` ではなく `status: OrderStatus`
を使う利点は何ですか？

### STEP 7

**Q7.** `id` と React の `key` の違いを説明してください。

また、次のコードの意味を説明してください。

``` tsx
<div key={order.id}>
```

### STEP 8

**Q8.** Day 11の完成条件を説明してください。Day
11では注文ステータスを変更しますか？

### 日本語 --- 解答


<details>
<summary><strong>解答を見る</strong></summary>

**A1.**
同じ注文データでも、顧客は自分の注文を確認するために使い、管理者は複数の注文を一覧で確認・管理するために使うため、UIの目的が異なる。

**A2.** `Order` は注文1件、`Order[]`
は複数の注文を表す。`orders: Order[]` は複数の注文。

**A3.** 配列内の各オブジェクトは `Order` 型のルールに従う。

**A4.** `orders` は `Order[]`、`order` は `Order`。

**A5.** `item` は現在処理している1件の `OrderItem` を表す。

**A6.**
許可された注文ステータスだけを使用でき、誤った文字列を防ぎやすくなる。

**A7.** `id` はデータ自体を識別する値で、`key`
はReactがレンダリングされたリスト項目を識別するための情報。`key={order.id}`
は注文の `id` をReactの `key` として使用するという意味。

**A8.** 管理者が複数の注文と各注文の現在のステータスを確認できればDay
11の目標達成。Day 11ではステータスを表示するだけで、変更はDay 12で行う。

</details>

------------------------------------------------------------------------

## English --- Review Questions

### STEP 1

**Q1.** Why can the same `Order` data serve a different UI purpose on a
customer page and an admin page?

### STEP 2

**Q2.** What is the difference between `Order` and `Order[]`?

``` ts
const orders: Order[] = [...]
```

Does `orders` represent one order or multiple orders?

### STEP 3

**Q3.** In an `orders: Order[]` array, which type must each object
follow?

### STEP 4

**Q4.** Identify the types of `orders` and `order` in the following
code.

``` tsx
orders.map((order) => {
  return <p>{order.name}</p>;
});
```

### STEP 5

**Q5.** If `order.items` has the type `OrderItem[]`, what does `item`
represent inside `order.items.map((item) => ...)`?

### STEP 6

**Q6.** What is the advantage of using `status: OrderStatus` instead of
`status: string`?

### STEP 7

**Q7.** Explain the difference between a data `id` and a React `key`.

Also explain:

``` tsx
<div key={order.id}>
```

### STEP 8

**Q8.** What is the completion goal for Day 11? Does Day 11 include
changing the order status?

### English --- Answers


<details>
<summary><strong>Show answers</strong></summary>

**A1.** A customer uses the data to view their own order, while an admin
uses it to view and manage multiple orders. The same data can therefore
serve different UI purposes.

**A2.** `Order` represents one order, while `Order[]` represents
multiple orders. `orders: Order[]` represents multiple orders.

**A3.** Each object must follow the `Order` type.

**A4.** `orders` is `Order[]`, and `order` is `Order`.

**A5.** `item` represents one current `OrderItem`.

**A6.** It restricts the value to the allowed order statuses and helps
prevent invalid status strings.

**A7.** An `id` identifies the data itself. A React `key` helps React
identify a rendered list item. `key={order.id}` means the order's ID is
being used as the React key.

**A8.** Day 11 is complete when the admin can view multiple orders and
the current status of each order. Day 11 only displays the status;
changing it belongs to Day 12.

</details>

------------------------------------------------------------------------

## 한국어 --- 복습문제

### STEP 1

**Q1.** 고객 페이지와 관리자 페이지에서 같은 `Order` 데이터를
사용하더라도 UI의 목적이 달라질 수 있는 이유를 설명해보세요.

### STEP 2

**Q2.** `Order`와 `Order[]`의 차이는 무엇인가요?

``` ts
const orders: Order[] = [...]
```

위 코드의 `orders`는 주문 하나인가요, 여러 개인가요?

### STEP 3

**Q3.** `orders: Order[]` 배열 안에 들어가는 각각의 객체는 어떤 타입의
규칙을 따라야 하나요?

### STEP 4

**Q4.** 다음 코드에서 `orders`와 `order`의 타입을 각각 적어보세요.

``` tsx
orders.map((order) => {
  return <p>{order.name}</p>;
});
```

### STEP 5

**Q5.** `order.items`의 타입이 `OrderItem[]`라면 다음 코드의 `item`은
무엇을 의미하나요?

``` tsx
order.items.map((item) => ...)
```

### STEP 6

**Q6.** `status: string` 대신 `status: OrderStatus`를 사용하는 이유는
무엇인가요?

### STEP 7

**Q7.** 데이터의 `id`와 React의 `key`는 어떤 차이가 있나요?

그리고 다음 코드를 말로 설명해보세요.

``` tsx
<div key={order.id}>
```

### STEP 8

**Q8.** Day 11의 완료 조건은 무엇인가요? Day 11에서 관리자가 주문
상태까지 변경하나요?

### 한국어 --- 정답 및 해설


<details>
<summary><strong>정답 및 해설 보기</strong></summary>

**A1.** 고객은 자신의 주문을 확인하기 위해 데이터를 사용하고, 관리자는
여러 주문을 한 번에 확인하고 관리하기 위해 사용한다. 같은 `Order`라도
사용 목적에 따라 UI가 달라질 수 있다.

**A2.** `Order`는 주문 하나, `Order[]`는 주문 여러 개를 의미한다.
`orders: Order[]`는 여러 주문이다.

**A3.** 배열 안의 각 객체는 `Order` 타입의 구조와 규칙을 따라야 한다.

**A4.** `orders`는 `Order[]`, `order`는 `Order`다.

``` text
orders: Order[]
      ↓ map()
order: Order
```

**A5.** `item`은 현재 `map()`이 처리하고 있는 상품 하나이며 타입은
`OrderItem`이다.

``` text
order.items: OrderItem[]
          ↓ map()
item: OrderItem
```

**A6.** `OrderStatus`를 사용하면 미리 허용한 주문 상태만 사용할 수 있기
때문에 잘못된 상태 문자열이 들어가는 것을 막는 데 도움이 된다.

**A7.** `id`는 데이터 자체를 식별하는 값이고, `key`는 React가 렌더링된
목록 항목을 식별하고 추적하기 위한 정보다.

``` tsx
key={order.id}
```

는 `id`와 `key`가 같은 개념이라는 뜻이 아니라, **주문의 `id` 값을
React의 `key`로 사용한다**는 뜻이다.

**A8.** 관리자가 여러 주문과 각 주문의 현재 상태를 확인할 수 있으면 Day
11의 목표를 달성한 것이다. Day 11에서는 상태를 표시하기만 하고, 상태
변경은 Day 12에서 진행한다.

</details>

------------------------------------------------------------------------

## 최종 확인 문제

다음 타입 관계를 직접 설명해보자.

``` text
orders       → Order[]
order        → Order
order.items  → OrderItem[]
item         → OrderItem
order.status → OrderStatus
```

그리고 다음 코드를 한 문장으로 설명해보자.

``` tsx
{orders.map((order) => {
  return (
    <div key={order.id}>
      <p>{order.name}</p>
      <p>{order.status}</p>
    </div>
  );
})}
```

**정답 예시**


<details>
<summary><strong>정답 예시 보기</strong></summary>

`Order[]` 타입의 `orders`에서 `map()`으로 주문 하나인 `order`에 차례대로
접근하고, 각 주문의 `id`를 React의 `key`로 사용하면서 주문자 이름과 현재
주문 상태를 화면에 렌더링한다.

</details>

