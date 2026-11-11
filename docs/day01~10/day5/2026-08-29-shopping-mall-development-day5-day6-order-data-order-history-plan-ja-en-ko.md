# 쇼핑몰 프로젝트 Day 6 개발 계획
> 언어 순서: 日本語 → English → 한국어  
> 주제: 주문 데이터 구조와 주문 내역

---

# 日本語

## 1. Day 6 の目標

Day 5 では、カートからチェックアウトへ移動し、注文商品を確認し、配送情報を入力して注文完了ページへ進む流れを作成した。

Day 6 では、その注文情報を **1つの Order オブジェクト** にまとめ、`localStorage` に保存し、注文完了ページや注文履歴ページで再び表示できるようにする。

```text
Cart
↓
Checkout
↓
配送情報
↓
Order オブジェクト作成
↓
orders[] に追加
↓
localStorage に保存
↓
cart を空にする
↓
注文完了
↓
注文履歴
```

> **ヒント**
>
> Day 6 は新しい文法を大量に増やすより、これまで学んだオブジェクト、配列、TypeScript、`useState`、`useEffect`、`map()`、localStorage を1つの機能に統合することが重要。

## 2. Step 1 — Order 型を作る

Day 5 では `name`、`phone`、`address`、`cart`、`totalPrice` が別々に存在していた。これらはすべて1件の注文に属するため、Day 6 では1つの型にまとめる。

```ts
type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
};
```

```text
Order
├─ id
├─ name
├─ phone
├─ address
├─ items: CartItem[]
├─ totalPrice
└─ createdAt
```

`CartItem` は商品1件、`CartItem[]` は複数の商品を意味する。

> **ヒント**
>
> オブジェクトを設計するときは「このオブジェクト1つは何を表すか？」を考える。`Order` 1つは注文1件を表す。

## 3. Step 2 — handleSubmit で Order オブジェクトを作る

Day 5 では値を `console.log()` で確認した。Day 6 ではそれを明確な注文オブジェクトにする。

```ts
const order = {
  id: Date.now(),
  name,
  phone,
  address,
  items: cart,
  totalPrice,
  createdAt: new Date().toISOString(),
};
```

`items: cart` は現在のカート内容を完成した注文の商品一覧として保存するという意味。

まずは保存せず、

```ts
console.log(order);
```

で構造を確認する。

> **ヒント**
>
> 「オブジェクト作成」と「保存」を一度に実装せず、最初に Console で正しい形になっているか確認するとデバッグしやすい。

## 4. Step 3 — orders を localStorage に保存する

`cart` と `orders` の役割は異なる。

```text
cart
→ 現在購入しようとしている商品

orders
→ 完了した注文の履歴
```

注文は複数回発生するので、`orders` は配列として保存する。

```text
orders
[
  Order 1,
  Order 2,
  Order 3
]
```

必要になる処理：

```ts
localStorage.getItem("orders");
JSON.parse(...);
JSON.stringify(...);
localStorage.setItem("orders", ...);
```

データの流れ：

```text
既存 orders を読む
↓
JSON.parse()
↓
既存 Order[] を取得
↓
新しい order を追加
↓
JSON.stringify()
↓
localStorage に保存
```

> **ヒント**
>
> `cart` は作業中のデータ、`orders` は完了した記録として区別する。

## 5. Step 4 — 注文保存後に cart を空にする

注文を保存した後でカートを空にする。

```ts
localStorage.removeItem("cart");
setCart([]);
```

順番は次のように考える。

```text
Order 作成
↓
orders に保存
↓
cart 削除
↓
注文完了ページへ移動
```

> **ヒント**
>
> Order を保存する前に cart を削除しないこと。注文商品の情報が必要だからである。

## 6. Step 5 — 注文完了ページに情報を表示する

単純な完了メッセージだけでなく、最後の注文情報を表示できるようにする。

```text
注文が完了しました。

注文番号: ...
注文者: ...
配送先: ...
合計金額: ...
```

ここでは再び、

```text
localStorage
↓
getItem
↓
JSON.parse
↓
state
↓
JSX
```

という Day 5 で学んだ流れを利用する。

> **ヒント**
>
> 新しい画面でも「データを読む → state に入れる → JSX で表示する」と分解すると理解しやすい。

## 7. Step 6 — /orders 注文履歴ページ

ルート：

```text
/orders
```

構造：

```text
app/
└─ orders/
   └─ page.tsx
```

保存した `orders` は配列なので `map()` で表示できる。

```tsx
orders.map((order) => {
  return (
    <div key={order.id}>
      {/* 注文情報 */}
    </div>
  );
});
```

Day 5:

```text
cart.map() → 商品を繰り返す
```

Day 6:

```text
orders.map() → 注文を繰り返す
```

> **ヒント**
>
> `map()` は商品専用ではなく、どんな配列にも使える。配列の要素の型が `CartItem` から `Order` に変わっただけ。

## 8. Day 6 完了チェックリスト

- [ ] `Order` 型を作る
- [ ] `handleSubmit` で Order オブジェクトを作る
- [ ] 配送情報を Order に含める
- [ ] `CartItem[]` を Order に含める
- [ ] `totalPrice` を含める
- [ ] 注文 ID と作成日時を追加する
- [ ] `orders` を localStorage に保存する
- [ ] 以前の注文を残したまま新しい注文を追加する
- [ ] 注文後に cart を空にする
- [ ] 注文完了ページで注文情報を表示する
- [ ] `/orders` で複数注文を表示する
- [ ] リロード後も注文履歴が残ることを確認する

> **ヒント**
>
> 1項目ずつ実装し、その都度ブラウザと Console で確認する。

## 9. Day 6 ではまだ扱わないもの

```text
実際の決済 API
サーバーデータベース
ユーザー認証
本番用の注文番号生成
在庫管理
管理者向け注文管理
```

localStorage は学習用であり、本番ECサイトの注文DBの代わりではない。

> **ヒント**
>
> Day 6 の目的は本番バックエンドではなく、「注文データの構造・保存・取得・表示」の流れを理解すること。

---

# English

## 1. Day 6 Goal

Day 5 created the checkout flow: cart → checkout → review items → enter shipping information → submit → order-complete page.

Day 6 turns those separate values into a single **Order object**, stores completed orders in `localStorage`, and displays them later.

```text
Cart
↓
Checkout
↓
Shipping information
↓
Create Order object
↓
Append to orders[]
↓
Save to localStorage
↓
Clear cart
↓
Order complete
↓
Order history
```

> **Tip**
>
> Day 6 is mainly about combining concepts already learned—objects, arrays, TypeScript, `useState`, `useEffect`, `map()`, and localStorage—into one realistic feature.

## 2. Step 1 — Create an Order Type

The Day 5 values `name`, `phone`, `address`, `cart`, and `totalPrice` all belong to one order.

```ts
type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
};
```

```text
Order
├─ id
├─ name
├─ phone
├─ address
├─ items: CartItem[]
├─ totalPrice
└─ createdAt
```

> **Tip**
>
> Ask what one instance of the object represents. One `Order` object represents one completed order.

## 3. Step 2 — Create the Order Object in handleSubmit

Create a meaningful object from the current checkout state.

```ts
const order = {
  id: Date.now(),
  name,
  phone,
  address,
  items: cart,
  totalPrice,
  createdAt: new Date().toISOString(),
};
```

Before saving it, inspect it:

```ts
console.log(order);
```

> **Tip**
>
> Separate “creating the object” from “saving the object.” This makes debugging much easier.

## 4. Step 3 — Store orders in localStorage

Keep `cart` and `orders` conceptually separate.

```text
cart
→ current shopping data

orders
→ completed order history
```

Because multiple orders can exist, store `orders` as an array.

```text
orders
[
  Order 1,
  Order 2,
  Order 3
]
```

Main operations:

```ts
localStorage.getItem("orders");
JSON.parse(...);
JSON.stringify(...);
localStorage.setItem("orders", ...);
```

Flow:

```text
Read existing orders
↓
JSON.parse()
↓
Get existing Order[]
↓
Add the new order
↓
JSON.stringify()
↓
Save back to localStorage
```

> **Tip**
>
> Think of `cart` as temporary work-in-progress data and `orders` as completed historical data.

## 5. Step 4 — Clear the Cart After Saving

```ts
localStorage.removeItem("cart");
setCart([]);
```

Recommended order of operations:

```text
Create Order
↓
Save Order
↓
Clear cart
↓
Navigate to order-complete
```

> **Tip**
>
> Do not clear the cart before the Order has been created and saved, because the cart contains the item data needed by the order.

## 6. Step 5 — Display the Completed Order

Extend the order-complete page so it can display information such as:

```text
Order completed.

Order ID: ...
Customer: ...
Shipping address: ...
Total: ...
```

This reuses the familiar pattern:

```text
localStorage
↓
getItem
↓
JSON.parse
↓
state
↓
JSX
```

> **Tip**
>
> When a new feature feels complicated, break it into data flow: read → state → render.

## 7. Step 6 — Create `/orders`

Create an order-history route:

```text
/orders
```

```text
app/
└─ orders/
   └─ page.tsx
```

Since `orders` is an array, render it with `map()`.

```tsx
orders.map((order) => {
  return (
    <div key={order.id}>
      {/* order information */}
    </div>
  );
});
```

Day 5:

```text
cart.map() → iterate over products
```

Day 6:

```text
orders.map() → iterate over orders
```

> **Tip**
>
> `map()` is not specific to products. It works with any array; only the type of each element changes.

## 8. Day 6 Completion Checklist

- [ ] Create the `Order` type
- [ ] Create an Order object in `handleSubmit`
- [ ] Include shipping information
- [ ] Include `CartItem[]`
- [ ] Include `totalPrice`
- [ ] Add an order ID and creation time
- [ ] Store `orders` in localStorage
- [ ] Append new orders without deleting previous orders
- [ ] Clear cart after the order is saved
- [ ] Display order information on the order-complete page
- [ ] Display multiple orders on `/orders`
- [ ] Verify history remains after refresh

> **Tip**
>
> Implement one checkbox at a time and verify each step in the browser and Console.

## 9. Not Included Yet

```text
Real payment APIs
Server databases
Authentication
Production order-number generation
Inventory management
Admin order management
```

> **Tip**
>
> localStorage is useful for learning but is not a production database. The Day 6 goal is to understand order data structure and data flow.

---

# 한국어

## 1. Day 6 목표

Day 5에서는 다음 흐름까지 만들었다.

```text
장바구니
↓
Checkout
↓
주문 상품 확인
↓
배송 정보 입력
↓
주문 제출
↓
주문 완료 페이지
```

Day 6에서는 여기서 한 단계 더 나아가 **주문에 필요한 여러 데이터를 하나의 `Order` 객체로 묶고, 완료된 주문들을 localStorage에 저장하고, 다시 읽어서 화면에 보여주는 것**을 목표로 한다.

```text
Cart
↓
Checkout
↓
배송 정보
↓
Order 객체 생성
↓
orders[]에 추가
↓
localStorage 저장
↓
cart 비우기
↓
주문 완료
↓
주문 내역
```

> **팁**
>
> Day 6의 핵심은 새로운 문법을 많이 배우는 것이 아니라 지금까지 배운 객체, 배열, TypeScript, `useState`, `useEffect`, `map()`, localStorage를 하나의 실제 기능으로 연결하는 것이다.

## 2. Step 1 — `Order` 타입 만들기

Day 5에서는 다음 값들이 각각 따로 있었다.

```text
name
phone
address
cart
totalPrice
```

하지만 모두 주문 한 건에 속하는 데이터다. 따라서 하나의 타입으로 묶는다.

```ts
type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
};
```

구조:

```text
Order
├─ id
├─ name
├─ phone
├─ address
├─ items: CartItem[]
├─ totalPrice
└─ createdAt
```

`CartItem`은 상품 한 개의 장바구니 정보이고 `CartItem[]`는 여러 상품이다.

> **팁**
>
> 타입을 만들 때 “이 타입의 객체 하나가 무엇 하나를 의미하는가?”를 생각하자. 여기서는 `Order` 하나가 주문 한 건을 의미한다.

## 3. Step 2 — `handleSubmit`에서 Order 객체 만들기

Day 5에서 따로 가지고 있던 state들을 하나의 객체로 묶는다.

```ts
const order = {
  id: Date.now(),
  name,
  phone,
  address,
  items: cart,
  totalPrice,
  createdAt: new Date().toISOString(),
};
```

여기서:

```ts
items: cart
```

는 현재 장바구니를 완료된 주문의 상품 목록으로 넣는다는 의미다.

바로 저장하기 전에:

```ts
console.log(order);
```

로 구조를 먼저 확인한다.

> **팁**
>
> `Order 객체 만들기 → Console 확인 → 저장하기` 순서로 나누면 문제가 생겼을 때 어느 단계가 잘못됐는지 찾기 쉽다.

## 4. Step 3 — `orders`를 localStorage에 저장하기

`cart`와 `orders`의 역할을 구분한다.

```text
cart
→ 현재 구매 중인 장바구니

orders
→ 이미 완료된 주문 기록
```

주문은 여러 번 발생할 수 있기 때문에 `orders`는 배열이 된다.

```text
orders
[
  Order 1,
  Order 2,
  Order 3
]
```

필요한 기능:

```ts
localStorage.getItem("orders");
JSON.parse(...);
JSON.stringify(...);
localStorage.setItem("orders", ...);
```

전체 흐름:

```text
기존 orders 읽기
↓
JSON.parse()
↓
기존 Order[] 얻기
↓
새로운 order 추가
↓
JSON.stringify()
↓
localStorage에 다시 저장
```

> **팁**
>
> `cart = 진행 중`, `orders = 완료 기록`이라고 기억하면 둘의 역할이 명확해진다.

## 5. Step 4 — 주문 저장 후 cart 비우기

주문을 정상적으로 저장한 다음 장바구니를 비운다.

```ts
localStorage.removeItem("cart");
setCart([]);
```

순서:

```text
Order 객체 생성
↓
orders에 저장
↓
cart 삭제
↓
주문 완료 페이지 이동
```

> **팁**
>
> cart를 먼저 삭제하면 주문에 필요한 상품 데이터가 사라질 수 있다. 그래서 **주문 저장이 먼저, 장바구니 초기화가 나중**이다.

## 6. Step 5 — 주문 완료 페이지에서 주문 정보 표시

기존의:

```text
주문이 완료되었습니다.
```

에서 조금 발전시켜:

```text
주문이 완료되었습니다.

주문번호: ...
주문자: ...
배송지: ...
총 주문금액: ...
```

등을 표시한다.

이때 Day 5에서 배운 패턴이 다시 등장한다.

```text
localStorage
↓
getItem()
↓
JSON.parse()
↓
state
↓
JSX
```

> **팁**
>
> 새로운 페이지라고 해서 완전히 새로운 원리를 배우는 것은 아니다. “데이터 읽기 → state 저장 → JSX 출력”으로 분해하면 익숙한 구조다.

## 7. Step 6 — `/orders` 주문 내역 페이지 만들기

라우트:

```text
/orders
```

파일 구조:

```text
app/
└─ orders/
   └─ page.tsx
```

`orders`는 여러 주문을 담은 배열이므로 `map()`으로 출력한다.

```tsx
orders.map((order) => {
  return (
    <div key={order.id}>
      {/* 주문 정보 */}
    </div>
  );
});
```

Day 5에서는:

```text
cart.map()
→ 상품 여러 개 반복
```

Day 6에서는:

```text
orders.map()
→ 주문 여러 개 반복
```

이다.

> **팁**
>
> `map()`을 상품 출력용 문법으로 외우지 말자. `map()`은 배열의 각 요소를 처리하는 메서드이므로 `CartItem[]`, `Order[]` 등 어떤 배열에도 사용할 수 있다.

## 8. Day 6에서 복습하는 개념

### TypeScript

```text
CartItem
CartItem[]
Order
Order[]
```

### React

```text
useState
useEffect
state
재렌더링
```

### JavaScript

```text
객체
배열
map()
JSON.parse()
JSON.stringify()
Date
```

### Browser API

```text
localStorage.getItem()
localStorage.setItem()
localStorage.removeItem()
```

### Next.js

```text
"use client"
Client Component
페이지 라우팅
/order-complete
/orders
```

> **팁**
>
> 코드를 통째로 외우기보다 “데이터가 지금 어디에 있고, 다음에는 어디로 가는가?”를 계속 추적하는 습관을 들이자.

## 9. Day 6 완료 체크리스트

- [ ] `Order` 타입 만들기
- [ ] `handleSubmit`에서 Order 객체 만들기
- [ ] 배송 정보를 Order에 포함하기
- [ ] `CartItem[]`를 Order에 포함하기
- [ ] `totalPrice` 포함하기
- [ ] 주문 ID 추가하기
- [ ] 주문 생성 시각 추가하기
- [ ] 기존 `orders` 불러오기
- [ ] 기존 주문을 유지하면서 새로운 주문 추가하기
- [ ] `orders`를 localStorage에 저장하기
- [ ] 주문 저장 후 cart 비우기
- [ ] 주문 완료 페이지에서 주문 정보 보여주기
- [ ] `/orders` 페이지 만들기
- [ ] `orders.map()`으로 여러 주문 보여주기
- [ ] 새로고침 후에도 주문 내역이 유지되는지 테스트하기

> **팁**
>
> 한꺼번에 구현하지 말고 `Order 타입 → Order 객체 → 저장 → 읽기 → 출력` 순서대로 하나씩 완성하자.

## 10. Day 6에서는 아직 하지 않을 것

```text
실제 결제 API
서버 데이터베이스
로그인/사용자 인증
실서비스용 주문번호 생성
재고 관리
관리자 주문 관리
```

> **팁**
>
> localStorage는 학습용으로는 매우 좋지만 실제 쇼핑몰의 주문 DB를 대신할 수 없다. 지금은 주문 데이터 구조와 프론트엔드 데이터 흐름을 익히는 데 집중한다.

## 11. Day 6 최종 구조

```text
상품
↓
장바구니
↓
Checkout
↓
배송 정보
↓
Order 객체
↓
orders[]
↓
localStorage
├─ 주문 완료 페이지
└─ 주문 내역 페이지
```

Day 6의 핵심을 한 문장으로 정리하면:

> **서로 떨어져 있던 주문 관련 값들을 하나의 의미 있는 `Order` 데이터 구조로 묶고, 그 데이터를 저장하고, 다시 읽고, 화면에 출력하는 방법을 익힌다.**

## 12. 권장 진행 순서

```text
1. Order 타입 정의
↓
2. handleSubmit에서 Order 객체 생성
↓
3. console.log(order)로 구조 확인
↓
4. 기존 orders 불러오기
↓
5. 새로운 order 추가
↓
6. localStorage에 orders 저장
↓
7. cart 비우기
↓
8. 주문 완료 페이지에서 주문 확인
↓
9. /orders 페이지 생성
↓
10. orders.map()으로 주문 내역 출력
↓
11. 처음부터 끝까지 전체 흐름 테스트
```

> **팁**
>
> Day 6도 완성 코드를 한 번에 복사하기보다 각 단계를 직접 작성하고 확인하는 방식으로 진행하는 것이 좋다.
