# Day 12 --- Admin Order Status Update Plan

> Day 11에서 만든 관리자 주문 목록을 이어서, Day 12에서는 관리자가 각
> 주문의 상태를 직접 변경할 수 있도록 만든다.
>
> 핵심 흐름:
> `OrderStatus → useState → select/onChange → setOrders → 새로운 Order[] → UI 재렌더링`

------------------------------------------------------------------------

# 日本語

## Day 12 の目標

Day 11では、管理者画面で複数の注文と現在の注文ステータスを表示した。

Day 12では、その画面に「注文ステータスを変更する機能」を追加する。

``` text
Day 11
注文を表示する
    ↓
Day 12
注文ステータスを変更する
```

Day
12では、まずフロントエンド上で状態変更の流れを理解することに集中する。DBへの保存やAPI通信は別の段階として考える。

**Tip**

最初からDB更新まで実装しようとせず、「画面上の状態が正しく変更される」ことを先に確認する。

------------------------------------------------------------------------

## STEP 1 --- Day 11 の `OrderStatus` を再利用する

Day 10〜11で使った `OrderStatus` をそのまま再利用する。

``` ts
type OrderStatus =
  | "支払い完了"
  | "商品準備中"
  | "配送中"
  | "配送完了";
```

`Order` の `status` も引き続き `OrderStatus` 型にする。

``` ts
type Order = {
  id: number;
  name: string;
  status: OrderStatus;
};
```

これにより、注文ステータスとして許可された値だけを使用できる。

**Tip**

Day 12のために別のステータス型を作らない。同じデータを扱うなら既存の
`OrderStatus` を再利用する。

------------------------------------------------------------------------

## STEP 2 --- なぜ `useState` が必要なのか理解する

Day 11の `orders` は表示するだけだった。

Day
12ではユーザー操作によって注文データが変化するため、Reactにその変化を管理してもらう必要がある。

``` tsx
const [orders, setOrders] = useState<Order[]>(initialOrders);
```

意味：

``` text
orders
→ 現在の注文一覧

setOrders
→ 注文一覧を更新する関数

useState<Order[]>
→ 複数の注文をReactの状態として管理
```

**Tip**

`orders` は「現在値」、`setOrders` は「その値を変更する入口」と考える。

------------------------------------------------------------------------

## STEP 3 --- Next.js の `"use client"` を理解する

Next.js App Routerの `page.tsx` はデフォルトではServer Component。

しかし `useState` や `onChange`
のようなブラウザ上のインタラクションを使うコンポーネントにはClient
Componentが必要になる。

学習用にページ全体をClient Componentにする場合：

``` tsx
"use client";

import { useState } from "react";
```

ファイルの先頭に `"use client"` を置く。

**Tip**

`"use client"` はTailwindのためではない。`useState`
やイベント処理など、クライアント側のインタラクションが必要だから使う。

------------------------------------------------------------------------

## STEP 4 --- ステータス変更UIを作る

現在のステータスを表示するだけでなく、管理者が選択できるUIを作る。

例：

``` tsx
<select value={order.status}>
  <option value="支払い完了">支払い完了</option>
  <option value="商品準備中">商品準備中</option>
  <option value="配送中">配送中</option>
  <option value="配送完了">配送完了</option>
</select>
```

`value={order.status}` により、現在の注文ステータスが選択状態になる。

**Tip**

最初はデザインよりも「現在のstatusがselectに正しく反映されるか」を確認する。

------------------------------------------------------------------------

## STEP 5 --- `onChange` で変更された値を受け取る

管理者が `<select>` の値を変更すると `onChange` イベントが発生する。

``` tsx
onChange={(e) => {
  const newStatus = e.target.value as OrderStatus;
}}
```

流れ：

``` text
管理者が選択
    ↓
onChange
    ↓
e.target.value
    ↓
新しいステータス
```

**Tip**

イベント処理を読むときは「何が起きたか →
どの値を受け取ったか」の順番で追う。

------------------------------------------------------------------------

## STEP 6 --- 変更する注文を `id` で見つける

複数の注文の中から、どの注文を変更するのか区別する必要がある。

そのために注文の `id` を使う。

``` ts
order.id
```

例えば注文IDが `2` の注文だけを変更したい場合：

``` text
Order #1 → そのまま
Order #2 → status変更
Order #3 → そのまま
```

**Tip**

Day 11で `id` を `key` に使ったが、Day
12ではデータ更新対象を識別するためにも `id` が重要になる。

------------------------------------------------------------------------

## STEP 7 --- `map()` と `setOrders()` で注文状態を更新する

既存の `orders` 配列を直接書き換えるのではなく、新しい配列を作る。

``` tsx
setOrders(
  orders.map((currentOrder) => {
    if (currentOrder.id === order.id) {
      return {
        ...currentOrder,
        status: newStatus,
      };
    }

    return currentOrder;
  })
);
```

重要な流れ：

``` text
orders
↓
map()
↓
注文を1件ずつ確認
↓
idが一致？
├─ Yes → 新しいstatusを持つ注文を返す
└─ No  → 元の注文をそのまま返す
↓
新しい Order[]
↓
setOrders()
```

`...currentOrder` は既存の注文情報をコピーし、`status`
だけを新しい値で上書きする。

**Tip**

「全部変更する」のではなく、「配列全体をmapしながら対象の1件だけ変更する」と考える。

------------------------------------------------------------------------

## STEP 8 --- UIの再レンダリングを確認する

`setOrders()` に新しい `Order[]`
を渡すとReactの状態が更新され、UIも新しい状態に合わせて再レンダリングされる。

``` text
select変更
↓
onChange
↓
newStatus
↓
orders.map()
↓
新しい Order[]
↓
setOrders()
↓
再レンダリング
↓
変更後の order.status が表示
```

Day 12の完成条件：

``` text
管理者が注文ごとのステータスを選択できる
+
選択した注文だけ状態が変わる
+
変更後の状態が画面に反映される
```

**Tip**

複数の注文を用意し、1件だけ変更したときに他の注文が変化していないか必ず確認する。

------------------------------------------------------------------------

## Day 12 日本語まとめ

``` text
OrderStatus
↓
Order.status
↓
useState<Order[]>
↓
orders.map()
↓
order
↓
<select>
↓
onChange
↓
newStatus
↓
idで対象注文を確認
↓
新しいOrderを作成
↓
setOrders()
↓
UI再レンダリング
```

------------------------------------------------------------------------

# English

## Day 12 Goal

Day 11 displayed multiple orders and their current statuses on the admin
page.

Day 12 adds the ability for an admin to change the status of an
individual order.

``` text
Day 11
Display orders
    ↓
Day 12
Update an order status
```

The initial goal is to understand the frontend state-update flow.
Persisting the change to a database or API can be handled later.

**Tip**

First make sure the status changes correctly in the UI. Keep database
persistence separate while learning the React state flow.

------------------------------------------------------------------------

## STEP 1 --- Reuse `OrderStatus`

Reuse the existing `OrderStatus` type instead of creating a new type.

``` ts
type OrderStatus =
  | "PAID"
  | "PREPARING"
  | "SHIPPING"
  | "DELIVERED";
```

The `Order` type continues to use it:

``` ts
type Order = {
  id: number;
  name: string;
  status: OrderStatus;
};
```

**Tip**

If the same domain value already has a type, reuse that type. This keeps
the data model consistent.

------------------------------------------------------------------------

## STEP 2 --- Understand Why `useState` Is Needed

On Day 11, the orders were only displayed.

On Day 12, user interaction changes the order data, so React needs to
manage that changing state.

``` tsx
const [orders, setOrders] = useState<Order[]>(initialOrders);
```

Meaning:

``` text
orders
→ current order list

setOrders
→ function used to update the list

useState<Order[]>
→ React state containing multiple orders
```

**Tip**

Think of `orders` as the current value and `setOrders` as the official
way to replace that value with a new one.

------------------------------------------------------------------------

## STEP 3 --- Understand Next.js `"use client"`

In the Next.js App Router, a `page.tsx` is a Server Component by
default.

A component that uses client-side interaction such as `useState` and
`onChange` needs a Client Component boundary.

For a simple learning example:

``` tsx
"use client";

import { useState } from "react";
```

**Tip**

`"use client"` is not related to Tailwind. It is needed because the
component uses browser-side React interactivity.

------------------------------------------------------------------------

## STEP 4 --- Create the Status Update UI

Instead of only displaying the current status, provide a control that
lets the admin select a status.

``` tsx
<select value={order.status}>
  <option value="PAID">PAID</option>
  <option value="PREPARING">PREPARING</option>
  <option value="SHIPPING">SHIPPING</option>
  <option value="DELIVERED">DELIVERED</option>
</select>
```

`value={order.status}` makes the current status the selected value.

**Tip**

Before styling the select, verify that it correctly reflects each
order's current status.

------------------------------------------------------------------------

## STEP 5 --- Receive the New Value with `onChange`

Changing the `<select>` triggers an `onChange` event.

``` tsx
onChange={(e) => {
  const newStatus = e.target.value as OrderStatus;
}}
```

Flow:

``` text
Admin selects a value
↓
onChange
↓
e.target.value
↓
new status
```

**Tip**

When reading event code, trace it as: user action → event → value →
update logic.

------------------------------------------------------------------------

## STEP 6 --- Identify the Order by `id`

The application needs to know which order should be updated.

Use the order's `id`.

``` ts
order.id
```

For example:

``` text
Order #1 → unchanged
Order #2 → update status
Order #3 → unchanged
```

**Tip**

On Day 11, `id` was also useful as a React `key`. On Day 12, it becomes
important for identifying the data that should be updated.

------------------------------------------------------------------------

## STEP 7 --- Update State with `map()` and `setOrders()`

Instead of directly mutating the existing array, create a new array.

``` tsx
setOrders(
  orders.map((currentOrder) => {
    if (currentOrder.id === order.id) {
      return {
        ...currentOrder,
        status: newStatus,
      };
    }

    return currentOrder;
  })
);
```

Flow:

``` text
orders
↓
map()
↓
check each order
↓
Does the id match?
├─ Yes → return an order with the new status
└─ No  → return the existing order
↓
new Order[]
↓
setOrders()
```

`...currentOrder` copies the existing order fields, and
`status: newStatus` replaces only the status.

**Tip**

Think: "map over the whole array, but replace only the matching order."

------------------------------------------------------------------------

## STEP 8 --- Verify React Re-rendering

When `setOrders()` receives the new `Order[]`, React updates the state
and renders the UI again with the new values.

``` text
select change
↓
onChange
↓
newStatus
↓
orders.map()
↓
new Order[]
↓
setOrders()
↓
re-render
↓
updated order.status
```

Day 12 completion goal:

``` text
The admin can select a status for an order
+
only the selected order changes
+
the new status appears in the UI
```

**Tip**

Test with multiple orders. Changing one order should not accidentally
change the others.

------------------------------------------------------------------------

## Day 12 English Summary

``` text
OrderStatus
↓
Order.status
↓
useState<Order[]>
↓
orders.map()
↓
order
↓
<select>
↓
onChange
↓
newStatus
↓
find target by id
↓
create updated Order
↓
setOrders()
↓
UI re-render
```

------------------------------------------------------------------------

# 한국어

## Day 12 목표

Day 11에서는 관리자 화면에서 여러 주문과 각 주문의 현재 상태를
**조회**했다.

Day 12에서는 여기서 한 단계 더 나아가 관리자가 특정 주문의 상태를
**변경**할 수 있도록 만든다.

``` text
Day 11
주문 목록 조회
    ↓
Day 12
주문 상태 변경
```

이번 단계에서는 먼저 React 화면 안에서 상태가 변경되는 원리를 이해한다.
DB 저장이나 API 요청은 이후 단계로 분리해서 생각한다.

**팁**

처음부터 서버와 DB까지 한꺼번에 연결하지 말자. 우선 브라우저 화면에서
주문 상태가 정확히 바뀌는지 이해하는 것이 핵심이다.

------------------------------------------------------------------------

## STEP 1 --- `OrderStatus` 재사용하기

Day 10\~11에서 만든 `OrderStatus`를 그대로 재사용한다.

``` ts
type OrderStatus =
  | "결제완료"
  | "상품준비중"
  | "배송중"
  | "배송완료";
```

`Order`의 `status` 역시 그대로 `OrderStatus`를 사용한다.

``` ts
type Order = {
  id: number;
  name: string;
  status: OrderStatus;
};
```

이렇게 하면 허용된 주문 상태만 사용할 수 있다.

**팁**

Day 12라고 새로운 상태 타입을 만들 필요는 없다. 같은 주문 데이터를
다루고 있으므로 기존 타입을 이어서 사용하는 것이 핵심이다.

------------------------------------------------------------------------

## STEP 2 --- 왜 `useState`가 필요한지 이해하기

Day 11에서는 `orders` 데이터를 화면에 보여주기만 했다.

하지만 Day 12에서는 사용자의 행동으로 주문 데이터가 변한다.

React가 변경되는 값을 관리하도록 `useState`를 사용한다.

``` tsx
const [orders, setOrders] = useState<Order[]>(initialOrders);
```

각각의 의미:

``` text
orders
→ 현재 주문 목록

setOrders
→ 주문 목록을 변경하는 함수

useState<Order[]>
→ 여러 주문을 React 상태로 관리
```

**팁**

`orders`는 현재 값, `setOrders`는 그 값을 새로운 값으로 교체하는
통로라고 이해하면 쉽다.

------------------------------------------------------------------------

## STEP 3 --- Next.js의 `"use client"` 이해하기

Next.js App Router에서 `page.tsx`는 기본적으로 Server Component다.

하지만 `useState`, `onChange`처럼 브라우저에서 사용자와 상호작용하는
기능을 사용하는 컴포넌트에는 Client Component가 필요하다.

학습 단계에서 페이지 전체를 Client Component로 만든다면 파일 위쪽에:

``` tsx
"use client";

import { useState } from "react";
```

를 작성할 수 있다.

**팁**

`"use client"`는 Tailwind를 사용하기 위해 붙이는 것이 아니다.
`useState`나 이벤트 처리처럼 클라이언트 상호작용이 필요하기 때문에
사용하는 것이다.

------------------------------------------------------------------------

## STEP 4 --- 주문 상태 변경 UI 만들기

Day 11에서는:

``` tsx
<p>{order.status}</p>
```

처럼 상태를 보여주기만 했다.

Day 12에서는 관리자가 선택할 수 있도록 `<select>`를 사용할 수 있다.

``` tsx
<select value={order.status}>
  <option value="결제완료">결제완료</option>
  <option value="상품준비중">상품준비중</option>
  <option value="배송중">배송중</option>
  <option value="배송완료">배송완료</option>
</select>
```

`value={order.status}`는 현재 주문의 상태를 선택된 값으로 보여준다.

**팁**

처음에는 디자인보다 각 주문의 현재 `status`가 `<select>`에 정확히
나타나는지부터 확인하자.

------------------------------------------------------------------------

## STEP 5 --- `onChange`로 변경된 값 받기

관리자가 `<select>`에서 다른 상태를 선택하면 `onChange` 이벤트가
발생한다.

``` tsx
onChange={(e) => {
  const newStatus = e.target.value as OrderStatus;
}}
```

흐름:

``` text
관리자가 새로운 상태 선택
↓
onChange 발생
↓
e.target.value
↓
newStatus
```

**팁**

이벤트 코드는 `사용자 행동 → 이벤트 → 새로운 값` 순서로 추적하면
이해하기 쉽다.

------------------------------------------------------------------------

## STEP 6 --- `id`로 변경할 주문 찾기

`orders`에는 주문이 여러 개 있다.

따라서 어떤 주문의 상태를 변경할 것인지 구분해야 한다.

여기서 `order.id`를 사용한다.

``` text
주문 #1 → 그대로
주문 #2 → 상태 변경
주문 #3 → 그대로
```

예를 들어 현재 변경 중인 주문이 `order.id === 2`라면 ID가 2인 주문만
새로운 상태로 바꿔야 한다.

**팁**

Day 11에서는 `id`를 `key`의 값으로 사용했다. Day 12에서는 여기에 더해
**어떤 데이터를 변경할 것인지 찾는 식별자** 역할도 한다.

------------------------------------------------------------------------

## STEP 7 --- `map()`과 `setOrders()`로 주문 상태 업데이트하기

기존 `orders` 배열을 직접 수정하는 대신 새로운 배열을 만든다.

``` tsx
setOrders(
  orders.map((currentOrder) => {
    if (currentOrder.id === order.id) {
      return {
        ...currentOrder,
        status: newStatus,
      };
    }

    return currentOrder;
  })
);
```

핵심 흐름:

``` text
orders
↓
map()
↓
주문 하나씩 확인
↓
currentOrder.id === order.id ?
├─ 맞음 → status가 변경된 새로운 주문 반환
└─ 아님 → 기존 주문 그대로 반환
↓
새로운 Order[]
↓
setOrders()
```

여기서:

``` tsx
{
  ...currentOrder,
  status: newStatus,
}
```

는 기존 주문 정보를 복사하고 `status`만 새로운 값으로 덮어쓴다는 뜻이다.

**팁**

`map()`을 Day 11에서는 **UI를 만들기 위해** 사용했다면, Day 12에서는
**새로운 배열을 만들기 위해** 사용할 수도 있다는 점을 주목하자.

------------------------------------------------------------------------

## STEP 8 --- 상태 변경과 재렌더링 확인하기

`setOrders()`로 새로운 `Order[]`가 들어가면 React 상태가 변경된다.

그러면 React가 새로운 상태를 기준으로 UI를 다시 렌더링한다.

``` text
<select> 변경
↓
onChange
↓
newStatus
↓
orders.map()
↓
새로운 Order[]
↓
setOrders()
↓
React 상태 변경
↓
재렌더링
↓
변경된 order.status 표시
```

Day 12 완료 조건:

``` text
관리자가 주문별 상태를 선택할 수 있다
+
선택한 주문 하나만 상태가 변경된다
+
변경된 상태가 화면에 즉시 반영된다
```

**팁**

주문을 최소 2\~3개 준비하고 하나만 변경해보자. 선택한 주문만 변경되고
다른 주문은 그대로라면 업데이트 로직을 제대로 이해한 것이다.

------------------------------------------------------------------------

# Day 12 핵심 이론

Day 11과 Day 12를 연결하면:

``` text
Day 11

Order[]
↓
map()
↓
order
↓
UI 표시

────────────────────

Day 12

Order[]
↓
useState<Order[]>
↓
orders
↓
map()
↓
order
↓
<select>
↓
onChange
↓
newStatus
↓
id 비교
↓
새로운 Order[]
↓
setOrders()
↓
재렌더링
```

특히 Day 12에서 기억할 핵심 관계:

``` text
OrderStatus
→ 허용되는 주문 상태

orders
→ 현재 Order[]

setOrders
→ 새로운 Order[]로 상태 업데이트

order.id
→ 변경할 주문 식별

map()
→ 기존 배열을 기준으로 새로운 배열 생성

...currentOrder
→ 기존 주문 데이터 복사

status: newStatus
→ status만 변경

React re-render
→ 변경된 상태를 UI에 반영
```

## Day 12 완료 기준

> **관리자가 여러 주문 중 특정 주문의 상태를 선택해 변경할 수 있고,
> 선택한 주문만 새로운 상태로 바뀌어 화면에 반영되는 구조를 이해하고
> 구현한다.**

**팁**

Day 12의 가장 중요한 코드를 한 줄로 압축하면
`setOrders(orders.map(...))`이다. 이 코드를 외우기보다 **기존 배열 →
대상 찾기 → 새 객체 → 새 배열 → 상태 업데이트** 흐름을 설명할 수 있는
것을 목표로 하자.
