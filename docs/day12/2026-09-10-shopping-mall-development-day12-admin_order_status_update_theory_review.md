# Day 12 --- 관리자 주문 상태 변경 이론 정리

> 학습 흐름:
>
> `OrderStatus → useState → orders → <select> → onChange → newStatus → map() → id 비교 → 객체 spread → setOrders → 재렌더링`

---

# 日本語

## STEP 1 --- Day 12 の目標を理解する

Day 11では、管理者画面に複数の注文と現在の注文ステータスを表示した。

Day 12では、表示するだけだった `order.status` を管理者が `<select>`
から変更できるようにする。

```text
Day 11
注文状態を表示する

        ↓

Day 12
注文状態を選択して変更する
```

今回の中心となる流れ：

```text
現在の注文データ
↓
<select>
↓
onChange
↓
新しい status
↓
対象の注文を探す
↓
新しい Order[] を作る
↓
setOrders()
↓
再レンダリング
```

Day 12では、まだDBやAPIに保存する処理は行わず、フロントエンドの state
上で注文状態を変更することに集中する。

**Tip**

「画面を直接変更する」のではなく、「stateを変更するとReactが画面を再レンダリングする」と考える。

---

## STEP 2 --- `"use client"` と `useState`

注文状態をユーザー操作によって変更するため、Reactのstateを使用する。

```tsx
"use client";

import { useState } from "react";
```

そして、既存の注文データを初期値としてstateを作る。

```tsx
const initialOrders: Order[] = [
  // ...
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
}
```

役割：

```text
initialOrders
→ 最初に使用する注文データ

orders
→ 現在の注文state

setOrders
→ ordersを新しい値に更新する関数
```

**Tip**

`initialOrders` は「開始時の値」、`orders` は「現在の値」、`setOrders`
は「現在の値を更新する関数」と分けて考える。

---

## STEP 3 --- `OrderStatus` と `<select>`

注文状態は次のようなunion typeで定義している。

```ts
type OrderStatus = "결제완료" | "상품준비중" | "배송중" | "배송완료";
```

Day 11では：

```tsx
<span>{order.status}</span>
```

として表示するだけだった。

Day 12では：

```tsx
<select value={order.status}>
  <option value="결제완료">결제완료</option>
  <option value="상품준비중">상품준비중</option>
  <option value="배송중">배송중</option>
  <option value="배송완료">배송완료</option>
</select>
```

のように変更する。

`value={order.status}` によって、各注文の現在のstatusが `<select>`
の選択値として表示される。

**Tip**

`value={order.status}`
を「このselectが現在表示する値は、この注文のstatus」と読む。

---

## STEP 4 --- `onChange` と `e.target.value`

ユーザーが `<select>` の値を変更すると `onChange` が実行される。

```tsx
onChange={(e) => {
  const newStatus = e.target.value as OrderStatus;
}}
```

流れ：

```text
ユーザーが "배송완료" を選択
↓
onChange
↓
e.target.value
↓
"배송완료"
↓
newStatus
```

`e.target.value` はTypeScript上では一般的な `string`
として扱われるため、今回のコードでは：

```tsx
const newStatus = e.target.value as OrderStatus;
```

とする。

`as OrderStatus`
は実行時の値を変換する処理ではなく、TypeScriptにその値を `OrderStatus`
として扱うよう伝える型アサーション。

**Tip**

`as`
を「値の変換」と考えない。TypeScriptに型を伝えるための表現として理解する。

---

## STEP 5 --- 変更する注文を `id` で探す

注文は複数あるため、どの注文のstatusを変更するのかを特定する必要がある。

画面を作る外側の `map()`：

```tsx
orders.map((order) => {
  // ...
});
```

ここでの `order` は、現在表示している注文。

状態更新のための内側の `map()`：

```tsx
orders.map((currentOrder) => {
  // ...
});
```

ここでの `currentOrder`
は、更新用の新しい配列を作るために現在確認している注文。

比較：

```tsx
currentOrder.id === order.id;
```

注文 #2 を変更する場合：

```text
order.id = 2

currentOrder.id = 1 → false
currentOrder.id = 2 → true
currentOrder.id = 3 → false
```

**Tip**

`order` = 変更対象、`currentOrder` = 現在確認中の注文、と覚える。

---

## STEP 6 --- `map()` で新しい `Order[]` を作る

`setOrders` に必要なのは注文1件ではなく、新しい `Order[]` 全体。

そのため `map()` を使う。

```tsx
const updatedOrders = orders.map((currentOrder) => {
  if (currentOrder.id === order.id) {
    // 変更対象
  }

  return currentOrder;
});
```

注文 #2だけを変更する場合：

```text
既存 orders

[#1, #2, #3]

↓ map()

新しい updatedOrders

[既存 #1, 更新された #2, 既存 #3]
```

`map()` は各繰り返しの `return` を集めて新しい配列を作る。

**Tip**

`map()`
を単なる繰り返しではなく、「既存の配列から新しい配列を作る処理」と考える。

---

## STEP 7 --- Object Spread で対象注文だけ更新する

変更対象を見つけたら、既存オブジェクトを直接変更せず、新しいオブジェクトを作る。

```tsx
return {
  ...currentOrder,
  status: newStatus,
};
```

意味：

```text
...currentOrder
→ 既存の注文情報をコピー

status: newStatus
→ statusだけ新しい値で上書き
```

順番も重要。

```tsx
{
  ...currentOrder,
  status: newStatus,
}
```

なら新しいstatusが最後に適用される。

**Tip**

`{ ...既存オブジェクト, 変更するプロパティ: 新しい値 }`
をReactの基本更新パターンとして覚える。

---

## STEP 8 --- Immutability と Shallow Copy

次のような直接変更は避ける。

```tsx
currentOrder.status = newStatus;
```

代わりに：

```tsx
const updatedOrder = {
  ...currentOrder,
  status: newStatus,
};
```

とする。

このとき外側のオブジェクトは新しい。

```tsx
currentOrder === updatedOrder;
// false
```

しかし `items`
のようなネストした配列は、別途コピーしていなければ同じ参照を共有できる。

```tsx
currentOrder.items === updatedOrder.items;
// true になることがある
```

これがshallow copy（浅いコピー）。

Day 12ではトップレベルの `status`
だけを変更するため、この浅いコピーで十分。

**Tip**

ネストしたstateを変更するときは「実際に変更する経路」に沿って新しいオブジェクトや配列を作る。

---

## STEP 9 --- `setOrders()` と再レンダリング

新しい配列を作ったらstateに保存する。

```tsx
setOrders(updatedOrders);
```

全体：

```tsx
onChange={(e) => {
  const newStatus = e.target.value as OrderStatus;

  const updatedOrders = orders.map((currentOrder) => {
    if (currentOrder.id === order.id) {
      return {
        ...currentOrder,
        status: newStatus,
      };
    }

    return currentOrder;
  });

  setOrders(updatedOrders);
}}
```

流れ：

```text
<select>変更
↓
onChange
↓
newStatus
↓
orders.map()
↓
idが一致する注文だけ新しいオブジェクト
↓
新しい Order[]
↓
setOrders()
↓
state変更
↓
React再レンダリング
↓
value={order.status} に新しい値が表示
```

**Tip**

学習中は `setOrders(orders.map(...))` と短く書くより、`updatedOrders`
を別変数にすると処理の流れが見やすい。

---

## STEP 10 --- Day 12 統合とテスト

Day 12の完成形：

```tsx
<select
  value={order.status}
  onChange={(e) => {
    const newStatus = e.target.value as OrderStatus;

    const updatedOrders = orders.map((currentOrder) => {
      if (currentOrder.id === order.id) {
        return {
          ...currentOrder,
          status: newStatus,
        };
      }

      return currentOrder;
    });

    setOrders(updatedOrders);
  }}
>
  <option value="결제완료">결제완료</option>
  <option value="상품준비중">상품준비중</option>
  <option value="배송중">배송중</option>
  <option value="배송완료">배송완료</option>
</select>
```

確認するポイント：

```text
注文 #1 のstatusを変更できる
注文 #2 のstatusを変更できる
注文 #3 のstatusを変更できる
他の注文のstatusは勝手に変わらない
変更後の値がselectに表示される
```

Day
12ではDB/APIに保存していないため、ページを再読み込みすると初期データに戻る。

**Tip**

Day
12のテスト基準は「フロントエンドstate上で、対象の注文だけ正しく変更されるか」。

---

# English

## STEP 1 --- Understand the Goal of Day 12

Day 11 displayed multiple orders and their current statuses. Day 12
makes `order.status` editable through a `<select>`.

```text
Day 11
display status

↓

Day 12
select and update status
```

Core flow:

```text
current orders
→ <select>
→ onChange
→ new status
→ find target order
→ create new Order[]
→ setOrders()
→ re-render
```

Day 12 focuses on frontend state only; it does not persist the change to
a database or API yet.

**Tip**

Think "update state, then React updates the UI," not "manually change
the screen."

---

## STEP 2 --- `"use client"` and `useState`

The page now needs interactive React state.

```tsx
"use client";

import { useState } from "react";
```

```tsx
const initialOrders: Order[] = [
  // ...
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
}
```

Roles:

```text
initialOrders → initial data
orders        → current state
setOrders     → function that updates the state
```

**Tip**

Separate "initial value," "current value," and "function that updates
the current value."

---

## STEP 3 --- `OrderStatus` and `<select>`

```ts
type OrderStatus = "결제완료" | "상품준비중" | "배송중" | "배송완료";
```

Day 11:

```tsx
<span>{order.status}</span>
```

Day 12:

```tsx
<select value={order.status}>
  <option value="결제완료">결제완료</option>
  <option value="상품준비중">상품준비중</option>
  <option value="배송중">배송중</option>
  <option value="배송완료">배송완료</option>
</select>
```

`value={order.status}` makes the select display the current status of
each order.

**Tip**

Read it as: "the current value of this select comes from
`order.status`."

---

## STEP 4 --- `onChange` and `e.target.value`

```tsx
onChange={(e) => {
  const newStatus = e.target.value as OrderStatus;
}}
```

Flow:

```text
user selects a status
→ onChange
→ e.target.value
→ newStatus
```

`as OrderStatus` is a TypeScript type assertion. It does not convert the
runtime string.

**Tip**

`as` changes how TypeScript treats the value; it does not transform the
actual value.

---

## STEP 5 --- Find the Target Order by `id`

The outer render loop has:

```tsx
orders.map((order) => {
```

Here, `order` is the order being rendered and changed by the user.

The update loop has:

```tsx
orders.map((currentOrder) => {
```

Here, `currentOrder` is each order currently being checked.

```tsx
currentOrder.id === order.id;
```

means:

> Is the order currently being checked the order the user changed?

**Tip**

`order` = target order. `currentOrder` = order currently being checked.

---

## STEP 6 --- Build a New `Order[]` with `map()`

`setOrders` needs a complete `Order[]`, so we rebuild the array with
`map()`.

```tsx
const updatedOrders = orders.map((currentOrder) => {
  if (currentOrder.id === order.id) {
    // update target
  }

  return currentOrder;
});
```

```text
old orders
[#1, #2, #3]

→ map()

updatedOrders
[old #1, updated #2, old #3]
```

**Tip**

Think of `map()` as "build a new array from the old array."

---

## STEP 7 --- Update One Order with Object Spread

```tsx
return {
  ...currentOrder,
  status: newStatus,
};
```

This means:

```text
...currentOrder → keep existing fields
status: newStatus → overwrite only status
```

Property order matters because later properties overwrite earlier ones.

**Tip**

Remember the pattern: `{ ...oldObject, changedProperty: newValue }`.

---

## STEP 8 --- Immutability and Shallow Copy

Avoid direct mutation:

```tsx
currentOrder.status = newStatus;
```

Create a new object instead:

```tsx
const updatedOrder = {
  ...currentOrder,
  status: newStatus,
};
```

The outer object is new:

```tsx
currentOrder === updatedOrder;
// false
```

A nested array can still share the same reference:

```tsx
currentOrder.items === updatedOrder.items;
// can be true
```

This is a shallow copy.

**Tip**

Create new objects and arrays along the path that is actually being
changed.

---

## STEP 9 --- `setOrders()` and Re-rendering

```tsx
setOrders(updatedOrders);
```

Complete update:

```tsx
onChange={(e) => {
  const newStatus = e.target.value as OrderStatus;

  const updatedOrders = orders.map((currentOrder) => {
    if (currentOrder.id === order.id) {
      return {
        ...currentOrder,
        status: newStatus,
      };
    }

    return currentOrder;
  });

  setOrders(updatedOrders);
}}
```

```text
select change
→ onChange
→ newStatus
→ map()
→ replace matching order
→ new Order[]
→ setOrders()
→ state update
→ re-render
→ new status appears
```

**Tip**

While learning, keep `updatedOrders` as a separate variable so the data
flow stays visible.

---

## STEP 10 --- Integration and Testing

Core code:

```tsx
<select
  value={order.status}
  onChange={(e) => {
    const newStatus = e.target.value as OrderStatus;

    const updatedOrders = orders.map((currentOrder) => {
      if (currentOrder.id === order.id) {
        return {
          ...currentOrder,
          status: newStatus,
        };
      }

      return currentOrder;
    });

    setOrders(updatedOrders);
  }}
>
  <option value="결제완료">결제완료</option>
  <option value="상품준비중">상품준비중</option>
  <option value="배송중">배송중</option>
  <option value="배송완료">배송완료</option>
</select>
```

Check that each order can be updated independently and that changing one
order does not change the others.

Because Day 12 does not persist data to a DB/API, refreshing the page
restores the initial data.

**Tip**

The Day 12 test is: "Does only the target order change correctly in
frontend state?"

---

# 한국어

## STEP 1 --- Day 12의 목표 이해하기

Day 11에서는 관리자가 여러 주문과 각 주문의 현재 상태를 확인할 수 있도록
했다.

Day 12에서는 단순히 표시하던 `order.status`를 관리자가 `<select>`를
이용해 직접 변경할 수 있도록 만든다.

```text
Day 11
주문 상태 표시

↓

Day 12
주문 상태 선택 및 변경
```

오늘의 핵심 흐름:

```text
현재 주문 데이터
↓
<select>
↓
onChange
↓
새로운 status
↓
변경할 주문 찾기
↓
새로운 Order[] 생성
↓
setOrders()
↓
재렌더링
```

Day 12에서는 아직 DB/API 저장을 하지 않고 프론트엔드 state에서 상태를
변경하는 것에 집중한다.

**팁**

화면을 직접 고친다고 생각하지 말고,
`state를 변경하면 React가 화면을 다시 그린다`고 이해하자.

---

## STEP 2 --- `"use client"`와 `useState`

사용자가 주문 상태를 변경하면 화면의 데이터도 바뀌어야 하므로 React
state를 사용한다.

```tsx
"use client";

import { useState } from "react";
```

기존 주문 데이터를 초기값으로 사용한다.

```tsx
const initialOrders: Order[] = [
  // ...
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
}
```

역할:

```text
initialOrders
→ 최초 주문 데이터

orders
→ 현재 주문 state

setOrders
→ orders를 새로운 값으로 변경하는 함수
```

**팁**

`initialOrders` = 시작값, `orders` = 현재값, `setOrders` = 현재값을
바꾸는 함수로 구분하자.

---

## STEP 3 --- `OrderStatus`와 `<select>`

주문 상태 타입:

```ts
type OrderStatus = "결제완료" | "상품준비중" | "배송중" | "배송완료";
```

Day 11에서는:

```tsx
<span>{order.status}</span>
```

로 상태를 표시하기만 했다.

Day 12에서는:

```tsx
<select value={order.status}>
  <option value="결제완료">결제완료</option>
  <option value="상품준비중">상품준비중</option>
  <option value="배송중">배송중</option>
  <option value="배송완료">배송완료</option>
</select>
```

로 바꾼다.

```tsx
value={order.status}
```

는 각 주문의 현재 상태를 `<select>`의 선택값으로 연결한다.

**팁**

`value={order.status}`를
`이 select가 보여줄 현재 값은 order.status다`라고 읽어보자.

---

## STEP 4 --- `onChange`와 `e.target.value`

사용자가 `<select>`를 변경하면 `onChange`가 실행된다.

```tsx
onChange={(e) => {
  const newStatus = e.target.value as OrderStatus;
}}
```

예:

```text
사용자가 "배송완료" 선택
↓
onChange 실행
↓
e.target.value
↓
"배송완료"
↓
newStatus
```

`e.target.value`는 TypeScript에서 일반적인 `string`으로 취급되므로 오늘
코드에서는:

```tsx
const newStatus = e.target.value as OrderStatus;
```

라고 작성한다.

`as OrderStatus`는 실제 문자열을 변환하는 것이 아니라 TypeScript에게 이
값을 `OrderStatus`로 취급하겠다고 알려주는 타입 단언이다.

**팁**

`as`를 데이터 변환으로 외우지 말고
`TypeScript에게 타입을 알려주는 표현`으로 이해하자.

---

## STEP 5 --- `id`로 변경할 주문 찾기

현재 주문 목록은 여러 주문을 가지고 있다.

화면을 렌더링하는 바깥 `map()`:

```tsx
orders.map((order) => {
```

여기서 `order`는 현재 화면에서 렌더링하고 있고 사용자가 조작한 주문이다.

상태 업데이트에 사용하는 안쪽 `map()`:

```tsx
orders.map((currentOrder) => {
```

여기서 `currentOrder`는 전체 주문을 순회하면서 현재 검사 중인 주문이다.

그래서:

```tsx
currentOrder.id === order.id;
```

로 비교한다.

주문 #2를 변경한다면:

```text
order.id = 2

currentOrder.id = 1 → false
currentOrder.id = 2 → true
currentOrder.id = 3 → false
```

**팁**

`order` = 변경 대상, `currentOrder` = 현재 검사 대상이라고 기억하면 두
변수의 역할을 구분하기 쉽다.

---

## STEP 6 --- `map()`으로 새로운 `Order[]` 만들기

우리는 주문 하나만 바꾸지만 `orders` state 자체는 `Order[]`다.

따라서 `setOrders()`에 전달할 새로운 전체 배열이 필요하다.

```tsx
const updatedOrders = orders.map((currentOrder) => {
  if (currentOrder.id === order.id) {
    // 변경 대상
  }

  return currentOrder;
});
```

주문 #2를 바꾼다고 하면:

```text
기존 orders

[#1, #2, #3]

↓ map()

새로운 updatedOrders

[기존 #1, 변경된 #2, 기존 #3]
```

`map()`은 각 반복에서 `return`한 값을 모아서 새로운 배열을 만든다.

**팁**

`map()`을 단순 반복문으로만 생각하지 말고
`기존 배열을 이용해 새로운 배열을 만드는 도구`라고 이해하자.

---

## STEP 7 --- 객체 Spread로 대상 주문만 변경하기

변경할 주문을 찾으면 기존 객체를 직접 수정하는 대신 새로운 객체를
만든다.

```tsx
return {
  ...currentOrder,
  status: newStatus,
};
```

의미:

```text
...currentOrder
→ 기존 주문 정보 유지

status: newStatus
→ status만 새로운 값으로 덮어쓰기
```

순서도 중요하다.

```tsx
{
  ...currentOrder,
  status: newStatus,
}
```

처럼 새로 적용할 값을 뒤에 두어야 기존 `status`를 덮어쓸 수 있다.

**팁**

React에서 객체를 업데이트할 때 `{ ...기존객체, 변경할속성: 새값 }`
패턴을 자주 만나게 된다.

---

## STEP 8 --- 불변성과 얕은 복사

다음과 같은 직접 수정은 피한다.

```tsx
currentOrder.status = newStatus;
```

대신:

```tsx
const updatedOrder = {
  ...currentOrder,
  status: newStatus,
};
```

처럼 새 객체를 만든다.

바깥 객체는 새 객체이므로:

```tsx
currentOrder === updatedOrder;
// false
```

다만 `items` 같은 중첩 배열은 별도로 복사하지 않았기 때문에 같은 참조를
공유할 수 있다.

```tsx
currentOrder.items === updatedOrder.items;
// true일 수 있음
```

이것이 얕은 복사(Shallow Copy)다.

오늘은 `Order`의 최상위 속성인 `status`만 변경하므로 이 정도의 얕은
복사로 충분하다.

**팁**

중첩된 state를 수정할 때는
`실제로 변경되는 경로를 따라 새 객체/배열을 만든다`는 원칙을 기억하자.

---

## STEP 9 --- `setOrders()`와 재렌더링

새로운 배열을 만들었으면:

```tsx
setOrders(updatedOrders);
```

로 state를 변경한다.

전체 코드:

```tsx
onChange={(e) => {
  const newStatus = e.target.value as OrderStatus;

  const updatedOrders = orders.map((currentOrder) => {
    if (currentOrder.id === order.id) {
      return {
        ...currentOrder,
        status: newStatus,
      };
    }

    return currentOrder;
  });

  setOrders(updatedOrders);
}}
```

전체 흐름:

```text
<select> 변경
↓
onChange
↓
e.target.value
↓
newStatus
↓
orders.map()
↓
id가 같은 주문 찾기
↓
새 Order 객체 생성
↓
새 Order[] 생성
↓
setOrders()
↓
orders state 변경
↓
React 재렌더링
↓
value={order.status}
↓
변경된 상태 표시
```

**팁**

`setOrders(orders.map(...))`가 복잡하게 느껴지면 항상
`const updatedOrders = orders.map(...)`로 중간 변수를 만들어서 해석하자.

---

## STEP 10 --- 통합 및 테스트

Day 12의 핵심 완성 코드:

```tsx
<select
  value={order.status}
  onChange={(e) => {
    const newStatus = e.target.value as OrderStatus;

    const updatedOrders = orders.map((currentOrder) => {
      if (currentOrder.id === order.id) {
        return {
          ...currentOrder,
          status: newStatus,
        };
      }

      return currentOrder;
    });

    setOrders(updatedOrders);
  }}
  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
>
  <option value="결제완료">결제완료</option>
  <option value="상품준비중">상품준비중</option>
  <option value="배송중">배송중</option>
  <option value="배송완료">배송완료</option>
</select>
```

테스트할 내용:

```text
주문 #1 상태 변경 가능
주문 #2 상태 변경 가능
주문 #3 상태 변경 가능

한 주문을 바꿔도 다른 주문은 그대로 유지

변경한 상태가 즉시 select에 표시
```

Day 12에서는 아직 DB/API에 저장하지 않으므로 새로고침하면
`initialOrders`를 기준으로 다시 시작한다.

Day 12 완료 기준:

```text
관리자가 각 주문의 상태를 선택할 수 있고
선택한 주문의 status만 프론트엔드 state에서 변경되며
React가 변경된 상태를 화면에 다시 표시한다.
```

**팁**

오늘 테스트의 기준은
`특정 주문 하나를 변경했을 때 그 주문만 정확하게 변경되는가?`이다.

---

# Day 12 핵심 요약

```text
"use client"
→ 클라이언트 상호작용을 사용하는 컴포넌트

initialOrders
→ 최초 주문 데이터

useState<Order[]>(initialOrders)
→ 주문 목록을 state로 관리

orders
→ 현재 주문 배열

setOrders
→ 새로운 주문 배열로 state 변경

<select value={order.status}>
→ 현재 주문 상태 표시

onChange
→ 사용자의 상태 변경 감지

e.target.value
→ 새로 선택한 값

as OrderStatus
→ TypeScript 타입 단언

orders.map()
→ 새로운 Order[] 생성

currentOrder.id === order.id
→ 변경할 주문 찾기

{ ...currentOrder, status: newStatus }
→ 기존 정보는 유지하고 status만 변경한 새 객체 생성

setOrders(updatedOrders)
→ 새 배열을 state에 저장

재렌더링
→ 변경된 status가 UI에 반영
```

Day 12 핵심 문장:

> **사용자가 `<select>`에서 새로운 주문 상태를 선택하면 `onChange`에서
> 값을 받고, `orders.map()`으로 `id`가 일치하는 주문만 새 객체로 변경한
> 뒤 새로운 `Order[]`를 `setOrders()`에 전달하여 React가 변경된 상태를
> 다시 렌더링한다.**
