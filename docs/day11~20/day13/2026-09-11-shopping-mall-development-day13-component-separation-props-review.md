# Day 13 --- Component Separation & Props 총정리

[📝 PLAN](2026-09-11-shopping-mall-development-day14-custom-hook-logic-separation-plan.md)\
[✅ Q&A](2026-09-11-shopping-mall-development-day13-component-separation-props-Q&A.md)

> 학습 흐름: `Component Separation → Props → Props Type → Callback Props → Parent/Child Data Flow → OrderItemList → key`

---

# 日本語

## STEP 1 --- コンポーネント分割の目的

Day 13では新しい機能を追加するのではなく、Day 12で1つのページコンポーネントに集まっていた責務を分けた。

最上位のコンポーネントは `AdminOrdersPage` で、注文一覧のstateを所有する。

```text
AdminOrdersPage
├─ orders state
├─ handleStatusChange
└─ OrderCard
   └─ OrderItemList
```

コンポーネントはコードの長さではなく、独立した責務を基準に分ける。

**Tip**

「このUIは何を担当しているか？」を一文で説明できる単位を探す。

## STEP 2 --- `OrderCard` の分離

`orders.map()` では注文を1件ずつ取り出し、それぞれについて `OrderCard` を生成する。

```tsx
{
  orders.map((order) => {
    return (
      <OrderCard
        key={order.id}
        order={order}
        onStatusChange={handleStatusChange}
      />
    );
  });
}
```

`OrderCard` は「注文1件のUI」を担当する。

**Tip**

`orders` は複数、`order` はその中の1件、と区別する。

## STEP 3 --- Props と Props Type

親から子へ値を渡す仕組みがprops。

```tsx
type OrderCardProps = {
  order: Order;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
};
```

Props Typeは、そのコンポーネントが必要とする入力の契約になる。

**Tip**

Props Typeを見て「このコンポーネントに何が必要か」を説明できるか確認する。

## STEP 4 --- Callback Props

stateを所有するのは `AdminOrdersPage` なので、実際の更新処理も親に置く。

```tsx
function handleStatusChange(orderId: number, newStatus: OrderStatus) {
  setOrders(
    orders.map((currentOrder) => {
      if (currentOrder.id === orderId) {
        return { ...currentOrder, status: newStatus };
      }
      return currentOrder;
    }),
  );
}
```

親は関数を子へ渡す。

```tsx
<OrderCard onStatusChange={handleStatusChange} />
```

子は必要なときにその関数を呼ぶ。

```tsx
onStatusChange(order.id, e.target.value as OrderStatus);
```

`handleStatusChange` は親側の実装名、`onStatusChange` は子が受け取るprops名。

**Tip**

`onSomething` = イベントを受け取るprops、`handleSomething` = 実際に処理する関数、という命名を覚えると読みやすい。

## STEP 5 --- データは下へ、イベントは上へ

```text
AdminOrdersPage
   │ order / onStatusChange
   ▼
OrderCard
   │ ユーザーがselectを変更
   ▼
onStatusChange(order.id, newStatus)
   │
   ▼
handleStatusChange
   ▼
setOrders
   ▼
再レンダリング
```

子が親のstateを直接変更するのではなく、callbackを呼んで変更を依頼する。

**Tip**

「データはpropsで下へ、変更要求はcallbackで上へ」と覚える。

## STEP 6 --- `OrderItemList` の分離

商品一覧の表示責務を `OrderCard` から分離した。

```tsx
type OrderItemListProps = {
  items: OrderItem[];
};

<OrderItemList items={order.items} />;
```

`OrderItemList` は配列全体を受け取り、その内部で `map()` を実行する。

```tsx
function OrderItemList({ items }: OrderItemListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        return <div key={item.id}>{item.name}</div>;
      })}
    </div>
  );
}
```

`items` は複数の商品、`item` はその中の1件。

**Tip**

リスト全体を担当するコンポーネントに、配列と `map()` の責務をまとめる。

## STEP 7 --- `map()` と `key`

現在は2種類のリストがある。

```text
AdminOrdersPage
└─ orders.map()
   └─ OrderCard

OrderItemList
└─ items.map()
   └─ 商品UI
```

`key` は `map()` が直接返す最上位要素につける。

```tsx
orders.map((order) => <OrderCard key={order.id} ... />)

items.map((item) => <div key={item.id}>...</div>)
```

**Tip**

「mapのreturnで一番外側にある要素は何か？」を探すとkeyの位置が分かる。

## STEP 8 --- Day 13 最終データフロー

```text
initialOrders
↓
useState
↓
orders
↓
orders.map(order)
↓
OrderCard
├─ order
└─ onStatusChange
↓
order.items
↓
OrderItemList
↓
items.map(item)
↓
商品UI
```

状態変更時：

```text
select変更
↓
OrderCard
↓
onStatusChange(order.id, newStatus)
↓
AdminOrdersPage.handleStatusChange
↓
setOrders
↓
再レンダリング
↓
更新されたorderが再びpropsで下へ
```

**Tip**

Day 13の核心は `Component → Props → Callback Props → Parent/Child Data Flow`。

---

# English

## STEP 1 --- Why Component Separation Matters

Day 13 adds no new feature. Instead, it separates responsibilities that were previously concentrated in one page component.

`AdminOrdersPage` is the top-level component and owns the order state.

```text
AdminOrdersPage
├─ orders state
├─ handleStatusChange
└─ OrderCard
   └─ OrderItemList
```

Components should be separated by independent responsibility, not simply by line count.

**Tip**

Ask, “What single responsibility does this UI have?”

## STEP 2 --- Extracting `OrderCard`

`orders.map()` takes one order at a time and creates one `OrderCard`.

```tsx
{
  orders.map((order) => {
    return (
      <OrderCard
        key={order.id}
        order={order}
        onStatusChange={handleStatusChange}
      />
    );
  });
}
```

`OrderCard` is responsible for the UI of one order.

**Tip**

Read `orders` as many orders and `order` as one order.

## STEP 3 --- Props and Props Type

Props are values passed from a parent component to a child component.

```tsx
type OrderCardProps = {
  order: Order;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
};
```

The props type is the input contract of the component.

**Tip**

You should be able to inspect the Props Type and explain everything the component needs.

## STEP 4 --- Callback Props

Because `AdminOrdersPage` owns the state, the state update logic stays in the parent.

```tsx
function handleStatusChange(orderId: number, newStatus: OrderStatus) {
  setOrders(
    orders.map((currentOrder) => {
      if (currentOrder.id === orderId) {
        return { ...currentOrder, status: newStatus };
      }
      return currentOrder;
    }),
  );
}
```

The parent passes the function down:

```tsx
<OrderCard onStatusChange={handleStatusChange} />
```

The child calls it when needed:

```tsx
onStatusChange(order.id, e.target.value as OrderStatus);
```

`handleStatusChange` is the parent's implementation name; `onStatusChange` is the prop name exposed to the child.

**Tip**

A useful convention is `onSomething` for event-facing props and `handleSomething` for handler implementations.

## STEP 5 --- Data Down, Events Up

```text
AdminOrdersPage
   │ order / onStatusChange
   ▼
OrderCard
   │ select changes
   ▼
onStatusChange(order.id, newStatus)
   ▼
handleStatusChange
   ▼
setOrders
   ▼
re-render
```

The child does not directly modify the parent's state. It requests the change through a callback.

**Tip**

Remember: data goes down through props; change requests go up through callbacks.

## STEP 6 --- Extracting `OrderItemList`

The responsibility for rendering the product list is moved out of `OrderCard`.

```tsx
type OrderItemListProps = {
  items: OrderItem[];
};

<OrderItemList items={order.items} />;
```

`OrderItemList` receives the whole array and performs the `map()` internally.

```tsx
function OrderItemList({ items }: OrderItemListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        return <div key={item.id}>{item.name}</div>;
      })}
    </div>
  );
}
```

`items` means multiple products; `item` means one product.

**Tip**

Keep the array and the responsibility for iterating over it in the component that owns the list UI.

## STEP 7 --- `map()` and `key`

There are now two different list iterations.

```text
AdminOrdersPage
└─ orders.map()
   └─ OrderCard

OrderItemList
└─ items.map()
   └─ product UI
```

Put `key` on the top-level element directly returned by `map()`.

```tsx
orders.map((order) => <OrderCard key={order.id} ... />)

items.map((item) => <div key={item.id}>...</div>)
```

**Tip**

Find the outermost element returned by each `map()`; that is where the `key` belongs.

## STEP 8 --- Final Day 13 Data Flow

```text
initialOrders
↓
useState
↓
orders
↓
orders.map(order)
↓
OrderCard
├─ order
└─ onStatusChange
↓
order.items
↓
OrderItemList
↓
items.map(item)
↓
product UI
```

On a status change:

```text
select change
↓
OrderCard
↓
onStatusChange(order.id, newStatus)
↓
AdminOrdersPage.handleStatusChange
↓
setOrders
↓
re-render
↓
updated order flows down again through props
```

**Tip**

The core sequence is `Component → Props → Callback Props → Parent/Child Data Flow`.

---

# 한국어

## STEP 1 --- 컴포넌트 분리의 목적

Day 13에서는 새로운 기능을 추가한 것이 아니라 Day 12에서 한 페이지에 모여 있던 책임을 나눴다.

가장 큰 부모는 `AdminOrdersPage`이며 주문 목록 state를 소유한다.

```text
AdminOrdersPage
├─ orders state
├─ handleStatusChange
└─ OrderCard
   └─ OrderItemList
```

컴포넌트는 코드 길이보다 독립적인 책임을 기준으로 분리한다.

**팁**

이 UI가 담당하는 일을 한 문장으로 설명해보고, 독립된 책임이 보이면 분리 후보로 생각하자.

## STEP 2 --- `OrderCard` 분리

`AdminOrdersPage`의 `orders.map()`은 주문을 하나씩 꺼내 각각의 `OrderCard`를 만든다.

```tsx
{
  orders.map((order) => {
    return (
      <OrderCard
        key={order.id}
        order={order}
        onStatusChange={handleStatusChange}
      />
    );
  });
}
```

`OrderCard`는 주문 하나의 UI를 담당한다.

**팁**

`orders` = 주문 여러 개, `order` = 그중 주문 하나로 읽자.

## STEP 3 --- Props와 Props Type

props는 부모가 자식에게 전달하는 값이다.

```tsx
type OrderCardProps = {
  order: Order;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
};
```

Props Type은 해당 컴포넌트가 어떤 입력을 필요로 하는지 보여주는 계약서다.

**팁**

Props Type만 보고도 해당 컴포넌트가 무엇을 필요로 하는지 설명할 수 있는지 확인하자.

## STEP 4 --- Callback Props

`orders` state를 가진 컴포넌트는 `AdminOrdersPage`이므로 실제 state 변경 로직도 부모에 둔다.

```tsx
function handleStatusChange(orderId: number, newStatus: OrderStatus) {
  setOrders(
    orders.map((currentOrder) => {
      if (currentOrder.id === orderId) {
        return { ...currentOrder, status: newStatus };
      }

      return currentOrder;
    }),
  );
}
```

부모는 이 함수를 자식에게 전달한다.

```tsx
<OrderCard onStatusChange={handleStatusChange} />
```

자식은 상태 변경이 필요할 때 전달받은 함수를 호출한다.

```tsx
onStatusChange(order.id, e.target.value as OrderStatus);
```

`handleStatusChange`는 부모가 실제로 정의한 함수 이름이고, `onStatusChange`는 자식에게 전달할 때 사용하는 prop 이름이다.

**팁**

`onSomething`은 이벤트용 prop, `handleSomething`은 실제 처리 함수라는 네이밍 관례를 기억하면 코드를 읽기 쉬워진다.

## STEP 5 --- 데이터는 아래로, 이벤트 요청은 위로

```text
AdminOrdersPage
   │ order / onStatusChange
   ▼
OrderCard
   │ 사용자가 select 변경
   ▼
onStatusChange(order.id, newStatus)
   ▼
handleStatusChange
   ▼
setOrders
   ▼
재렌더링
```

자식이 부모의 `setOrders`를 직접 사용하는 것이 아니라 callback을 호출하여 변경을 요청한다.

**팁**

`데이터는 props로 아래로, 변경 요청은 callback으로 위로`를 핵심 문장으로 기억하자.

## STEP 6 --- `OrderItemList` 분리

`OrderCard`가 직접 담당하던 상품 목록 렌더링 책임을 `OrderItemList`로 분리했다.

```tsx
type OrderItemListProps = {
  items: OrderItem[];
};

<OrderItemList items={order.items} />;
```

`OrderItemList`는 상품 배열 전체를 받고 그 내부에서 `map()`을 실행한다.

```tsx
function OrderItemList({ items }: OrderItemListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        return <div key={item.id}>{item.name}</div>;
      })}
    </div>
  );
}
```

`items`는 여러 상품이 들어 있는 배열이고 `item`은 `map()`에서 하나씩 꺼낸 상품이다.

**팁**

목록 전체를 담당하는 컴포넌트가 배열과 `map()`까지 함께 책임지게 하면 역할이 명확해진다.

## STEP 7 --- `map()` 위치와 `key`

현재 코드에는 서로 다른 목적의 `map()`이 두 개 있다.

```text
AdminOrdersPage
└─ orders.map()
   └─ OrderCard 생성

OrderItemList
└─ items.map()
   └─ 상품 UI 생성
```

`key`는 `map()`이 직접 반환하는 가장 바깥 요소에 둔다.

```tsx
orders.map((order) => (
  <OrderCard key={order.id} ... />
))

items.map((item) => (
  <div key={item.id}>...</div>
))
```

따라서 `map()`이 어디에 있는지와 무엇을 직접 반환하는지 확인하면 `key`의 위치도 알 수 있다.

**팁**

`map 안의 return에서 가장 바깥에 있는 요소가 무엇인가?`를 먼저 찾자.

## STEP 8 --- Day 13 전체 데이터 흐름

```text
initialOrders
↓
useState
↓
orders
↓
orders.map(order)
↓
OrderCard
├─ order
└─ onStatusChange
↓
order.items
↓
OrderItemList
↓
items.map(item)
↓
상품 UI
```

상태 변경은 반대 방향의 요청 흐름을 가진다.

```text
select 변경
↓
OrderCard
↓
onStatusChange(order.id, newStatus)
↓
AdminOrdersPage의 handleStatusChange
↓
setOrders
↓
재렌더링
↓
변경된 order가 다시 props로 아래로 전달
```

Day 13의 핵심은 `Component → Props → Callback Props → Parent/Child Data Flow`다.

**팁**

컴포넌트 분리 연습을 더 할 때는 먼저 `누가 state를 소유하는가`, `각 컴포넌트가 어떤 데이터만 필요한가`, `목록의 map은 누가 책임지는가` 세 가지를 확인하자.

---

# Day 13 핵심 요약

```text
AdminOrdersPage
→ 가장 큰 부모, orders state 소유

orders.map()
→ 주문 하나씩 꺼내 OrderCard 생성

OrderCard
→ 주문 하나의 UI 담당

order={order}
→ 부모가 자식에게 주문 데이터 전달

onStatusChange={handleStatusChange}
→ 부모가 자식에게 상태 변경 함수를 callback prop으로 전달

OrderItemList
→ 상품 목록 렌더링 담당

items={order.items}
→ OrderCard가 필요한 상품 배열만 전달

items.map()
→ 상품 하나씩 꺼내 상품 UI 생성

key
→ 각 map이 직접 반환하는 최상위 요소에 배치

데이터
→ 부모에서 자식으로 내려감

이벤트/변경 요청
→ 자식이 callback을 호출하여 부모로 전달
```

> **Day 13 핵심 문장:** `AdminOrdersPage`가 주문 state를 소유하고 `orders.map()`으로 `OrderCard`를 만들며, 필요한 데이터와 callback을 props로 내려준다. `OrderCard`는 상품 배열을 `OrderItemList`에 전달하고, `OrderItemList`가 `items.map()`으로 상품 목록을 렌더링한다. 상태 변경 요청은 `OrderCard`에서 callback을 호출해 부모로 전달되고, 부모가 state를 변경하면 React가 재렌더링하여 새로운 데이터가 다시 아래로 흐른다.
