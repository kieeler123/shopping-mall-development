# Day 11 — Admin Order List Plan

> **管理者向け注文一覧画面 / Admin Order List / 관리자 주문 목록 화면**

---

## 0. Day 11 Goal / 学習目標 / 학습 목표

### 日本語

Day 11 の目標は、Day 10 で作成した `Order` と `OrderStatus` を利用して、**管理者が複数の注文を一覧で確認できる画面**を作ることです。

Day 10 では「どの注文状態が存在できるか」を型として表現しました。

Day 11 では、その注文データを複数扱い、管理者画面に表示する方向へ進みます。

```text
Day 10
OrderStatus をモデリング
        ↓
Day 11
複数の注文を管理者画面に表示
        ↓
Day 12
管理者が注文状態を変更
```

Day 11 では注文状態を変更する機能まで進まず、まず **注文一覧を正しく表示すること**に集中します。

### English

The goal of Day 11 is to reuse the `Order` and `OrderStatus` models from Day 10 and build an **admin screen that displays multiple orders**.

Day 10 focused on defining which order statuses can exist.

Day 11 moves to working with multiple orders and displaying them for an administrator.

```text
Day 10
Model OrderStatus
        ↓
Day 11
Display multiple orders
        ↓
Day 12
Update order status
```

The main focus of Day 11 is **displaying order data correctly**, not updating the status yet.

### 한국어

Day 11의 목표는 Day 10에서 만든 `Order`와 `OrderStatus`를 재사용해서 **관리자가 여러 주문을 한 화면에서 확인할 수 있는 주문 목록 화면**을 만드는 것입니다.

Day 10에서는:

```text
어떤 주문 상태가 가능한가?
```

를 다뤘다면 Day 11에서는:

```text
여러 주문을 관리자가 어떻게 확인할 것인가?
```

로 확장합니다.

전체 연결은:

```text
Day 10
OrderStatus 모델링
        ↓
Day 11
관리자 주문 목록
        ↓
Day 12
관리자 주문 상태 변경
```

입니다.

> **팁**
>
> Day 11에서는 관리자 기능을 한꺼번에 완성하려고 하지 않습니다. 먼저 **여러 주문을 정확하게 표시하는 것**을 완료 목표로 잡습니다.

---

# STEP 1 — Understand the Admin Screen

## 管理者画面の役割 / Role of the Admin Screen / 관리자 화면의 역할

### 日本語

一般ユーザーと管理者は同じ `Order` データを利用することができますが、画面の目的は異なります。

```text
一般ユーザー
→ 自分の注文を確認する

管理者
→ 複数の注文を確認・管理する
```

つまり、データ型が同じでも、**誰がそのデータを見るのかによって UI の目的が変わる**ということです。

### English

Customers and administrators may use the same `Order` data, but their screens have different purposes.

```text
Customer
→ View their own order

Admin
→ View and manage multiple orders
```

The underlying data can be the same while the UI changes according to the user and purpose.

### 한국어

고객 화면과 관리자 화면은 같은 `Order` 데이터를 사용할 수 있지만 목적이 다릅니다.

```text
고객
→ 자신의 주문 확인

관리자
→ 여러 주문 확인 및 관리
```

즉:

```text
같은 데이터
≠
항상 같은 UI
```

입니다.

사용자가 누구이고 무엇을 해야 하는지에 따라 화면 구성이 달라질 수 있습니다.

> **팁**
>
> 여기서는 새로운 문법보다 **데이터와 UI의 목적은 서로 구분할 수 있다**는 점을 이해하는 것이 중요합니다.

---

# STEP 2 — From `Order` to `Order[]`

## 複数の注文 / Multiple Orders / 여러 주문

### 日本語

注文一件だけを扱う場合は `Order` を使用できます。

しかし管理者画面では複数の注文を表示する必要があります。

そのため、`Order[]` を使用します。

```tsx
const orders: Order[] = [];
```

```text
Order
→ 一件の注文

Order[]
→ 複数の注文
```

### English

A single order can be represented with:

```tsx
Order
```

An admin screen needs to work with multiple orders, so we use:

```tsx
Order[]
```

```text
Order
→ one order

Order[]
→ multiple orders
```

### 한국어

지금까지 주문 하나를 생각할 때는:

```tsx
Order
```

를 사용했습니다.

하지만 관리자 화면에서는 여러 주문을 다뤄야 합니다.

따라서:

```tsx
Order[]
```

관점으로 확장합니다.

```text
Order
→ 주문 하나

Order[]
→ Order가 여러 개 들어 있는 배열
```

> **팁**
>
> `Order[]`를 새로운 어려운 타입으로 생각하지 마세요. **이미 알고 있는 `Order`가 여러 개 있다**고 생각하면 됩니다.

---

# STEP 3 — Prepare Order List Data

## 注文一覧データ / Order List Data / 주문 목록 데이터

### 日本語

管理者画面に表示するため、複数の注文データを準備します。

基本的な形は次のようになります。

```tsx
const orders: Order[] = [
  // Order
  // Order
  // Order
];
```

配列の各要素は `Order` 型のルールに従う必要があります。

### English

We need multiple order objects for the admin screen.

The basic structure is:

```tsx
const orders: Order[] = [
  // Order
  // Order
  // Order
];
```

Every item inside the array must follow the `Order` type.

### 한국어

관리자 화면에 표시할 여러 주문을 준비합니다.

기본 구조는:

```tsx
const orders: Order[] = [
  // 주문 1
  // 주문 2
  // 주문 3
];
```

입니다.

여기서 중요한 것은:

```text
orders
↓
Order[]
↓
배열 안의 각 데이터
↓
Order 타입을 따라야 함
```

이라는 점입니다.

> **팁**
>
> `Order[]`를 보면 **배열 전체의 타입**과 **배열 안에 들어가는 하나의 데이터 타입**을 구분해서 생각하세요.

---

# STEP 4 — Render Orders with `map()`

## リストレンダリング / List Rendering / 목록 렌더링

### 日本語

複数の注文を React の画面に表示するため、`map()` を使います。

基本的な考え方は次の通りです。

```tsx
orders.map((order) => {
  // 一件の注文 UI
});
```

```text
Order[]
↓
map()
↓
Order を一件ずつ取り出す
↓
UI に変換する
```

### English

We can use `map()` to render every order in the array.

```tsx
orders.map((order) => {
  // UI for one order
});
```

Conceptually:

```text
Order[]
↓
map()
↓
one Order at a time
↓
convert each Order into UI
```

### 한국어

여러 주문을 React 화면에 반복해서 표시하기 위해 `map()`을 사용합니다.

```tsx
orders.map((order) => {
  // 주문 하나의 UI
});
```

핵심 흐름은:

```text
orders
↓
map()
↓
order 하나씩 접근
↓
각 order를 UI로 변환
```

입니다.

> **팁**
>
> `map()`을 복잡한 함수로 외우기보다 **배열 데이터를 하나씩 UI로 바꿔주는 과정**이라고 이해하세요.

---

# STEP 5 — Display Admin Order Information

## 注文情報を表示 / Display Order Information / 주문 정보 표시

### 日本語

管理者が注文を確認できるように、`Order` に保存されている必要な情報を画面に表示します。

例えば次のような情報です。

```text
注文番号
注文者
電話番号
住所
商品
合計金額
注文日時
注文状態
```

### English

The admin screen should display useful information from each `Order`.

For example:

```text
Order ID
Customer
Phone
Address
Items
Total price
Created time
Order status
```

### 한국어

관리자가 주문을 확인하려면 `Order`에 들어 있는 필요한 정보를 화면에 표시해야 합니다.

현재 `Order` 구조를 기준으로 보면:

```text
id
name
phone
address
items
totalPrice
createdAt
status
```

등을 활용할 수 있습니다.

모든 정보를 무조건 표시하는 것이 아니라 관리자 화면에 필요한 정보를 선택해서 보여주는 방향으로 진행합니다.

> **팁**
>
> 화면부터 상상해서 데이터를 만드는 것보다 **현재 `Order` 타입에 실제로 어떤 데이터가 있는지 먼저 확인**하는 습관을 들이면 좋습니다.

---

# STEP 6 — Reuse `OrderStatus`

## 注文状態の表示 / Display Order Status / 주문 상태 표시

### 日本語

Day 10 で作成した `OrderStatus` を Day 11 でも利用します。

各注文には現在の状態があります。

```tsx
order.status
```

例えば:

```text
注文 #1 → 결제완료
注文 #2 → 상품준비중
注文 #3 → 배송중
```

のように、管理者が現在の状態を確認できるようにします。

### English

The `OrderStatus` model from Day 10 can now be reused.

Each order has its own current status:

```tsx
order.status
```

For example:

```text
Order #1 → 결제완료
Order #2 → 상품준비중
Order #3 → 배송중
```

The admin can therefore see the current state of every order.

### 한국어

여기서 Day 10에서 만든 `OrderStatus`가 다시 사용됩니다.

각 주문에는:

```tsx
order.status
```

가 있기 때문에 관리자 목록에서:

```text
주문 #1 → 결제완료
주문 #2 → 상품준비중
주문 #3 → 배송중
```

처럼 현재 주문 상태를 보여줄 수 있습니다.

흐름을 연결하면:

```text
Day 10
OrderStatus 정의
↓
Order.status에 적용
↓
Day 11
관리자 주문 목록에서 order.status 표시
```

입니다.

> **팁**
>
> 새로운 기능을 만들 때 이전에 만든 타입이 다시 등장하는 것을 눈여겨보세요. 이것이 **타입을 재사용 가능한 규칙으로 만드는 이유** 중 하나입니다.

---

# STEP 7 — React `key`

## リストの識別 / List Identification / 목록 식별

### 日本語

React で `map()` を使ってリストをレンダリングするとき、各要素を識別するために `key` を指定します。

注文の `id` が一意なら、次のように使用できます。

```tsx
key={order.id}
```

### English

When rendering a list with `map()`, React needs a `key` to identify each rendered item.

If each order has a unique `id`, we can use:

```tsx
key={order.id}
```

### 한국어

React에서 `map()`으로 목록을 렌더링할 때는 각 항목을 구별하기 위한 `key`가 필요합니다.

주문의 `id`가 고유하다면:

```tsx
key={order.id}
```

처럼 사용할 수 있습니다.

개념적으로:

```text
여러 주문 UI
↓
React가 각각을 구별해야 함
↓
key 필요
↓
고유한 order.id 활용
```

이라고 이해할 수 있습니다.

> **팁**
>
> `key`를 단순히 React 경고를 없애기 위해 넣는 코드로 외우지 마세요. **목록의 각 항목을 React가 식별하기 위한 값**이라고 이해하는 것이 중요합니다.

---

# STEP 8 — Integration & Test

## 統合・確認 / Integration & Testing / 통합 및 테스트

### 日本語

最後に、Day 11 で作成した注文一覧画面を確認します。

確認する主なポイントは:

```text
複数の注文が表示されるか
↓
各注文の情報が正しいか
↓
注文状態が正しく表示されるか
↓
リストの key が設定されているか
```

です。

Day 11 の完成目標は、**管理者が複数の注文と現在の状態を確認できること**です。

### English

Finally, we verify the admin order list.

The main checks are:

```text
Are multiple orders rendered?
↓
Does each order show the correct data?
↓
Is the current status displayed correctly?
↓
Does each rendered item have an appropriate key?
```

The completion goal for Day 11 is:

> **The admin can view multiple orders and their current statuses.**

### 한국어

마지막에는 지금까지 만든 내용을 하나로 연결하고 확인합니다.

```text
Order
↓
Order[]
↓
orders 데이터
↓
map()
↓
order 하나씩 접근
↓
관리자용 주문 UI
↓
order.status 표시
↓
key 설정
↓
관리자 주문 목록 완성
```

Day 11의 완료 기준은:

> **관리자가 여러 주문과 각 주문의 현재 상태를 확인할 수 있는 화면을 만든다.**

입니다.

주문 상태를 실제로 변경하는 기능까지 Day 11에서 구현하지 않습니다.

그 기능은 다음 단계인 **Day 12 — 관리자 주문 상태 변경**으로 연결합니다.

> **팁**
>
> Day 11 완료 여부는 `관리자 기능을 많이 만들었는가?`가 아니라 **여러 주문 데이터를 올바르게 목록으로 표현했는가?**를 기준으로 판단하세요.

---

# Day 10 → Day 11 → Day 12

```text
Day 10
OrderStatus

어떤 주문 상태가 가능한가?
        ↓

Day 11
Admin Order List

여러 주문과 현재 상태를
관리자에게 어떻게 보여줄 것인가?
        ↓

Day 12
Admin Status Update

관리자가 주문 상태를
어떻게 변경할 것인가?
```

---

# Day 11 Core Flow

### 日本語

```text
Order
↓
Order[]
↓
map()
↓
order
↓
管理者向け UI
↓
order.status
```

### English

```text
Order
↓
Order[]
↓
map()
↓
one order
↓
Admin UI
↓
order.status
```

### 한국어

```text
Order
↓
Order[]
↓
map()
↓
주문 하나씩 접근
↓
관리자용 UI 생성
↓
현재 주문 상태 표시
```

---

# Development Vocabulary

| 日本語 | English | 한국어 |
|---|---|---|
| 管理者 | Admin / Administrator | 관리자 |
| 管理者画面 | Admin Screen | 관리자 화면 |
| 注文 | Order | 주문 |
| 注文一覧 | Order List | 주문 목록 |
| 配列 | Array | 배열 |
| 注文配列 | Order Array | 주문 배열 |
| リスト | List | 목록 |
| リストレンダリング | List Rendering | 목록 렌더링 |
| 繰り返し処理 | Iteration | 반복 처리 |
| 識別子 | Identifier | 식별자 |
| 注文状態 | Order Status | 주문 상태 |
| 表示する | Render / Display | 표시하다 |
| 再利用する | Reuse | 재사용하다 |

---

# Day 11 Final Key Point

### 日本語

> **Day 10 で定義した一つの注文の構造を、Day 11 では複数の注文へ拡張し、管理者向け UI として表示する。**

### English

> **Day 11 expands the single-order model from Day 10 into a list of orders and renders that data as an admin UI.**

### 한국어

> **Day 10에서 정의한 주문 하나의 구조를 Day 11에서는 여러 주문으로 확장하고, 그 데이터를 관리자용 UI로 표현한다.**

---

## Day 11 Completion Check

- [ ] `Order`와 `Order[]`의 차이를 설명할 수 있다.
- [ ] 관리자 화면과 고객 화면의 목적 차이를 설명할 수 있다.
- [ ] `orders.map()`의 역할을 설명할 수 있다.
- [ ] `map()` 안의 `order`가 무엇인지 설명할 수 있다.
- [ ] 주문 데이터를 화면에 표시할 수 있다.
- [ ] Day 10의 `OrderStatus`를 재사용할 수 있다.
- [ ] `order.status`를 관리자 목록에 표시할 수 있다.
- [ ] React 목록에서 `key`가 왜 필요한지 설명할 수 있다.
- [ ] Day 11과 Day 12의 역할 차이를 설명할 수 있다.

> **팁**
>
> Day 11 수업을 시작하기 전에 모든 항목을 이해할 필요는 없습니다. 이 체크리스트는 **Day 11이 끝났을 때 설명할 수 있으면 되는 목표**입니다.