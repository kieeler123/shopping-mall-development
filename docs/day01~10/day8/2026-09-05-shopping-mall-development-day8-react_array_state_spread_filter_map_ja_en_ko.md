# React 배열 State 핵심 이론 --- Spread / Filter / Map

> 언어 순서: 日本語 → English → 한국어

------------------------------------------------------------------------

# 1. 日本語 --- React 配列 State の追加・削除・更新

## 1.1 基本概念

React で配列の State
を扱うときは、既存の配列を直接変更するのではなく、**新しい配列を作成して
State を更新する**のが基本です。

  やりたいこと   主に使う方法   考え方
  -------------- -------------- -------------------------
  追加           Spread `...`   既存の要素 + 新しい要素
  削除           `filter()`     対象を除外して残す
  更新           `map()`        対象だけ変更する

> **ヒント**\
> 「追加 = spread / 削除 = filter / 更新 =
> map」を1セットとして覚えると理解しやすくなります。

## 1.2 追加 --- Spread `...`

``` tsx
const orders = [
  { id: 1001, name: "ノートパソコン" },
  { id: 1002, name: "キーボード" },
];

const newOrder = {
  id: 1003,
  name: "マウス",
};

const updatedOrders = [
  ...orders,
  newOrder,
];
```

結果:

``` text
[1001, 1002]
      +
     1003
      ↓
[1001, 1002, 1003]
```

React State では次のように使えます。

``` tsx
setOrders([
  ...orders,
  newOrder,
]);
```

> **ヒント**\
> Spread
> は既存の配列を直接変更せず、その内容を新しい配列に展開して新しい要素を追加します。

## 1.3 削除 --- `filter()`

1002 番の注文を除外する場合:

``` tsx
const updatedOrders = orders.filter(
  (order) => order.id !== 1002
);
```

`filter()` は条件が `true` の要素だけを新しい配列に残します。

``` text
1001 !== 1002 → true  → 残す
1002 !== 1002 → false → 除外
1003 !== 1002 → true  → 残す

結果 → [1001, 1003]
```

React では:

``` tsx
setOrders(
  orders.filter(
    (order) => order.id !== orderId
  )
);
```

> **ヒント**\
> `filter()`
> 自体がデータを削除するのではありません。「対象以外を残した新しい配列」を作るため、結果的に削除処理として使えます。

## 1.4 更新 --- `map()`

1002 番の注文だけステータスを変更する場合:

``` tsx
const updatedOrders = orders.map((order) =>
  order.id === 1002
    ? { ...order, status: "キャンセル済み" }
    : order
);
```

考え方:

``` text
1001 → 対象ではない → そのまま
1002 → 対象         → status を変更
1003 → 対象ではない → そのまま
```

`{ ...order, status: "キャンセル済み" }`
は既存の注文情報をコピーし、`status` だけを新しい値で上書きします。

> **ヒント**\
> `map()`
> は配列の要素数を維持しながら、特定の要素の内容を変更したいときによく使います。

## 1.5 不変性（Immutability）

React では既存の State
を直接変更するより、新しい配列やオブジェクトを作って `setState()`
に渡すパターンが重要です。

``` text
既存 State
    ↓
新しい配列を作成
    ↓
setOrders(新しい配列)
    ↓
新しい State
```

例えば `filter()` は元の `orders` を直接変更しません。

``` tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);

setOrders(updatedOrders);
```

> **ヒント**\
> React では「既存データを直接修正する」より「新しい値を作って State
> を置き換える」と考えると理解しやすいです。

## 1.6 ショッピングモールへの応用

``` text
カート商品追加     → spread
カート商品削除     → filter()
カート数量変更     → map()
注文追加           → spread
注文削除           → filter()
注文ステータス変更 → map()
```

学習用の Day 8 では注文キャンセルを `filter()` で注文自体を除外します。

``` tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

実際のショッピングモールでは注文履歴を削除せず、`map()`
で状態を「キャンセル」に変更する設計も一般的です。

``` tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? { ...order, status: "キャンセル" }
    : order
);
```

> **ヒント**\
> 今は `filter()` で「削除」の基本を学び、後で `map()`
> による注文ステータス管理へ発展させると理解しやすくなります。

------------------------------------------------------------------------

# 2. English --- React Array State: Add, Delete, and Update

## 2.1 Core Concept

When working with array state in React, a common pattern is to **create
a new array instead of directly modifying the existing state array**.

  Goal     Common Tool    Mental Model
  -------- -------------- -----------------------------------
  Add      Spread `...`   Existing items + new item
  Delete   `filter()`     Keep everything except the target
  Update   `map()`        Change only the target item

> **Tip**\
> Remember these as one set: **Add = spread / Delete = filter / Update =
> map**.

## 2.2 Add --- Spread `...`

``` tsx
const orders = [
  { id: 1001, name: "Laptop" },
  { id: 1002, name: "Keyboard" },
];

const newOrder = {
  id: 1003,
  name: "Mouse",
};

const updatedOrders = [
  ...orders,
  newOrder,
];
```

Result:

``` text
[1001, 1002]
      +
     1003
      ↓
[1001, 1002, 1003]
```

With React state:

``` tsx
setOrders([
  ...orders,
  newOrder,
]);
```

> **Tip**\
> Spread copies the existing elements into a new array and lets you add
> another item without directly changing the original array.

## 2.3 Delete --- `filter()`

To remove order `1002`:

``` tsx
const updatedOrders = orders.filter(
  (order) => order.id !== 1002
);
```

`filter()` keeps elements for which the condition returns `true`.

``` text
1001 !== 1002 → true  → keep
1002 !== 1002 → false → exclude
1003 !== 1002 → true  → keep

Result → [1001, 1003]
```

In React:

``` tsx
setOrders(
  orders.filter(
    (order) => order.id !== orderId
  )
);
```

> **Tip**\
> `filter()` does not literally delete an element from the original
> array. It creates a new array containing the elements you want to
> keep.

## 2.4 Update --- `map()`

To update only order `1002`:

``` tsx
const updatedOrders = orders.map((order) =>
  order.id === 1002
    ? { ...order, status: "Canceled" }
    : order
);
```

Mental model:

``` text
1001 → not target → keep unchanged
1002 → target     → change status
1003 → not target → keep unchanged
```

The expression below copies the existing order and overwrites only
`status`.

``` tsx
{
  ...order,
  status: "Canceled"
}
```

> **Tip**\
> Use `map()` when the number of items should stay the same but one or
> more items need updated values.

## 2.5 Immutability

Immutability means avoiding direct modification of existing state and
instead creating a new value.

``` text
Existing State
     ↓
Create New Array
     ↓
setOrders(newArray)
     ↓
New State
```

For example:

``` tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);

setOrders(updatedOrders);
```

`filter()` creates the new array, while `setOrders()` updates the React
state.

> **Tip**\
> Separate the responsibilities: `filter()` / `map()` / spread create
> new data; the state setter such as `setOrders()` updates React state.

## 2.6 Shopping Mall Examples

``` text
Add cart item       → spread
Remove cart item    → filter()
Change quantity     → map()
Create order        → spread
Remove order        → filter()
Change order status → map()
```

In the Day 8 learning version, order cancellation removes the target
order:

``` tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

In a more realistic store, you may keep the order record and change its
status instead:

``` tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? { ...order, status: "Canceled" }
    : order
);
```

> **Tip**\
> First learn deletion with `filter()`. Later, upgrading cancellation to
> a status change with `map()` is a natural next step.

------------------------------------------------------------------------

# 3. 한국어 --- React 배열 State 추가·삭제·수정

## 3.1 핵심 개념

React에서 배열 State를 다룰 때는 기존 배열을 직접 수정하기보다 **새로운
배열을 만들어 State를 갱신하는 패턴**이 중요합니다.

  하고 싶은 것   주로 사용하는 것   핵심 생각
  -------------- ------------------ ---------------------------
  추가           Spread `...`       기존 것 + 새로운 것
  삭제           `filter()`         삭제할 것 빼고 남기기
  수정           `map()`            대상을 찾아 내용만 바꾸기

> **팁**\
> **추가 = spread / 삭제 = filter / 수정 = map**을 하나의 세트로
> 기억하세요.

## 3.2 추가 --- Spread `...`

``` tsx
const orders = [
  { id: 1001, name: "노트북" },
  { id: 1002, name: "키보드" },
];

const newOrder = {
  id: 1003,
  name: "마우스",
};

const updatedOrders = [
  ...orders,
  newOrder,
];
```

결과:

``` text
[1001, 1002]
      +
     1003
      ↓
[1001, 1002, 1003]
```

React State에서는:

``` tsx
setOrders([
  ...orders,
  newOrder,
]);
```

> **팁**\
> Spread는 기존 배열을 직접 수정하는 것이 아니라, 기존 요소들을 새
> 배열에 펼쳐 넣고 새로운 요소를 추가한다고 이해하세요.

## 3.3 삭제 --- `filter()`

1002번 주문을 제외하고 싶다면:

``` tsx
const updatedOrders = orders.filter(
  (order) => order.id !== 1002
);
```

`filter()`에서는 조건식이 `true`인 요소가 새로운 배열에 남습니다.

``` text
1001 !== 1002 → true  → 남김
1002 !== 1002 → false → 제외
1003 !== 1002 → true  → 남김

결과 → [1001, 1003]
```

React에서는:

``` tsx
setOrders(
  orders.filter(
    (order) => order.id !== orderId
  )
);
```

> **팁**\
> `filter()`를 "삭제한다"라고만 외우기보다 **삭제 대상을 제외한 새로운
> 배열을 만든다**라고 이해하세요.

## 3.4 수정 --- `map()`

1002번 주문의 상태만 수정한다고 해보겠습니다.

``` tsx
const updatedOrders = orders.map((order) =>
  order.id === 1002
    ? { ...order, status: "취소완료" }
    : order
);
```

동작 방식:

``` text
1001 → 대상 아님 → 그대로
1002 → 대상 맞음 → status 변경
1003 → 대상 아님 → 그대로
```

다음 코드는 기존 `order`의 데이터를 복사하고 `status`만 덮어씁니다.

``` tsx
{
  ...order,
  status: "취소완료"
}
```

> **팁**\
> `map()`은 배열의 개수는 유지하면서 특정 항목의 내용을 수정할 때 자주
> 사용합니다.

## 3.5 불변성 --- Immutability

불변성이란 기존 State를 직접 수정하기보다 새로운 값을 만들어 교체하는
방식입니다.

``` text
기존 State
    ↓
새 배열 생성
    ↓
setOrders(새 배열)
    ↓
새로운 State
```

예를 들어:

``` tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);

setOrders(updatedOrders);
```

여기서 역할은 서로 다릅니다.

``` text
filter()
→ 새로운 배열 생성

setOrders()
→ React State 갱신
```

> **팁**\
> React에서는 "기존 배열 수정"보다 **새 배열 만들기 → setter로
> 교체하기**를 기본 사고방식으로 잡으세요.

## 3.6 쇼핑몰 기능과 연결

``` text
장바구니 상품 추가 → spread
장바구니 상품 삭제 → filter()
장바구니 수량 변경 → map()
주문 생성           → spread
주문 삭제           → filter()
주문 상태 변경      → map()
```

Day 8에서는 주문 취소를 `filter()`를 이용한 제거 방식으로 학습합니다.

``` tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

즉:

``` text
기존 주문
[1001, 1002, 1003]

       ↓ filter()

1002 제외

       ↓

새 주문 배열
[1001, 1003]
```

하지만 실제 쇼핑몰에서는 주문 기록을 완전히 제거하기보다 주문 상태를
변경하는 방식도 일반적입니다.

``` tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? { ...order, status: "주문취소" }
    : order
);
```

> **팁**\
> 현재 Day 8에서는 `filter()`를 이용해 배열 삭제와 State 갱신 원리를
> 익히고, 이후에는 `map()`을 이용한 주문 상태 관리로 확장하면 좋습니다.

## 3.7 최종 Mental Model

``` text
React 배열 State
        │
        ├── 추가
        │     ↓
        │   spread
        │
        ├── 삭제
        │     ↓
        │   filter()
        │
        └── 수정
              ↓
            map()
```

세 방법의 공통점:

``` text
기존 State
    ↓
새로운 배열 생성
    ↓
setState(새로운 배열)
    ↓
React State 갱신
```

> **팁**\
> 코드를 작성하기 전에 먼저 **지금 하려는 작업이 추가인지, 삭제인지,
> 수정인지** 판단하세요. 그러면 `spread`, `filter()`, `map()` 중 무엇을
> 사용할지 훨씬 쉽게 결정할 수 있습니다.

------------------------------------------------------------------------

# 핵심 암기표 / Quick Reference / クイックリファレンス

  ------------------------------------------------------------------------------------------------------------------------------
  작업                    Pattern                 대표 코드
  ----------------------- ----------------------- ------------------------------------------------------------------------------
  추가 / Add / 追加       Spread                  `[...orders, newOrder]`

  삭제 / Delete / 削除    `filter()`              `orders.filter(order => order.id !== orderId)`

  수정 / Update / 更新    `map()`                 `orders.map(order => order.id === orderId ? {...order, ...changes} : order)`
  ------------------------------------------------------------------------------------------------------------------------------

> **팁**\
> **Spread → 추가, Filter → 제외, Map → 변환**이라는 세 단어로 마지막에
> 정리해두면 복습할 때 빠르게 기억할 수 있습니다.
