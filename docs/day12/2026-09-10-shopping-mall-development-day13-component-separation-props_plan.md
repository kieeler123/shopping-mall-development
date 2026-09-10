# Day 13 --- Component Separation & Props 학습 계획

> 학습 흐름:
>
> `AdminOrdersPage → 책임 확인 → OrderCard 분리 → props → Props Type → parent/child → callback props → handleStatusChange → OrderItemList → 파일 분리 → 최종 테스트`

------------------------------------------------------------------------

## STEP 1 --- コンポーネント分割が必要な理由 / Why Component Separation Matters / 컴포넌트 분리가 필요한 이유

### 日本語

Day 12までで管理者注文ページは正常に動作する状態になった。

現在の `AdminOrdersPage`
は、注文state管理、注文一覧表示、注文カードUI、商品一覧、合計金額、status
select、status変更ロジックなど複数の責任を1つのページで担当している。

Day 13では新機能を追加せず、既存の動作を保ったまま責任を分離する。

**Tip**

コードが長いから分けるのではなく、「この部分は独立した役割を持つ」と説明できる場所から分離する。

### English

By the end of Day 12, the admin order page is already working.

`AdminOrdersPage` currently manages many responsibilities such as state,
list rendering, order card UI, item rendering, total price, status
selection, and status update logic.

Day 13 focuses on separating responsibilities without changing behavior.

**Tip**

Do not split code only because it is long. Extract a component when its
responsibility is clear.

### 한국어

Day 12까지 관리자 주문 페이지는 정상적으로 동작하는 상태가 되었다.

현재 `AdminOrdersPage` 하나가 주문 state 관리, 주문 목록 렌더링, 주문
카드 UI, 상품 목록, 총 금액, status select, 상태 변경 로직 등 여러
책임을 동시에 가지고 있다.

Day 13에서는 새로운 기능을 추가하지 않고 기존 동작을 그대로 유지하면서
책임을 나누는 연습을 한다.

**팁**

코드가 길다는 이유만으로 나누지 말고
`이 부분은 독립된 역할을 담당한다`고 설명할 수 있는 부분부터 분리한다.

------------------------------------------------------------------------

## STEP 2 --- `OrderCard` を分離 / Extract `OrderCard` / `OrderCard` 분리

### 日本語

`orders.map()` の中にある注文1件分のUIを `OrderCard` として分離する。

``` tsx
{orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
  />
))}
```

**Tip**

最初から細かく分けすぎず、まず注文1件全体を担当する `OrderCard`
だけを分離する。

### English

Extract the UI for one order inside `orders.map()` into an `OrderCard`
component.

``` tsx
{orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
  />
))}
```

**Tip**

Start with one meaningful component instead of splitting every small
part.

### 한국어

`orders.map()` 안에 있는 주문 하나 전체의 UI를 `OrderCard` 컴포넌트로
분리한다.

``` tsx
{orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
  />
))}
```

**팁**

처음부터 모든 요소를 잘게 나누지 말고 주문 하나 전체를 담당하는
`OrderCard`부터 분리한다.

------------------------------------------------------------------------

## STEP 3 --- `props` を理解 / Understand `props` / `props` 이해

### 日本語

`OrderCard`
は自分だけではどの注文を表示するか分からないため、親から注文データを受け取る必要がある。

``` tsx
<OrderCard order={order} />
```

``` text
AdminOrdersPage
↓
order を props で渡す
↓
OrderCard
```

**Tip**

`props` は「親から子へ渡される値」と考える。

### English

`OrderCard` does not know which order to display by itself, so the
parent passes the order through props.

``` tsx
<OrderCard order={order} />
```

**Tip**

Think of props as values passed from a parent component to a child
component.

### 한국어

`OrderCard`는 어떤 주문을 보여줘야 하는지 스스로 알 수 없기 때문에
부모가 주문 데이터를 props로 전달해야 한다.

``` tsx
<OrderCard order={order} />
```

``` text
AdminOrdersPage
↓
order를 props로 전달
↓
OrderCard
```

**팁**

`props = 부모가 자식에게 전달하는 값`이라고 이해한다.

------------------------------------------------------------------------

## STEP 4 --- Props Type を作る / Create a Props Type / Props 타입 작성

### 日本語

TypeScriptでは受け取るpropsにも型を付ける。

``` tsx
type OrderCardProps = {
  order: Order;
};

function OrderCard({ order }: OrderCardProps) {
  return <section>{order.name}</section>;
}
```

**Tip**

Props Typeはコンポーネントの「入力仕様」と考える。

### English

In TypeScript, define a type for the props the component receives.

``` tsx
type OrderCardProps = {
  order: Order;
};

function OrderCard({ order }: OrderCardProps) {
  return <section>{order.name}</section>;
}
```

**Tip**

Think of the props type as the component's input contract.

### 한국어

TypeScript에서는 컴포넌트가 받는 props에도 타입을 지정한다.

``` tsx
type OrderCardProps = {
  order: Order;
};

function OrderCard({ order }: OrderCardProps) {
  return <section>{order.name}</section>;
}
```

**팁**

Props Type은 해당 컴포넌트가 받을 수 있는 `입력 규칙`이라고 생각한다.

------------------------------------------------------------------------

## STEP 5 --- Parent / Child 関係 / Parent and Child Components / 부모와 자식 관계

### 日本語

`AdminOrdersPage` が `OrderCard`
をレンダリングするため、親子関係になる。

``` text
AdminOrdersPage
↓ parent

OrderCard
↓ child
```

**Tip**

親子関係はファイル位置ではなくレンダリング関係で判断する。

### English

Because `AdminOrdersPage` renders `OrderCard`, they form a parent-child
relationship.

**Tip**

Parent and child are determined by rendering relationships, not folder
locations.

### 한국어

`AdminOrdersPage`가 `<OrderCard />`를 렌더링하므로 둘은 부모와 자식
관계가 된다.

``` text
AdminOrdersPage
↓ 부모

OrderCard
↓ 자식
```

**팁**

부모/자식은 폴더 위치가 아니라 누가 누구를 렌더링하는지로 판단한다.

------------------------------------------------------------------------

## STEP 6 --- 状態変更ロジックを親に整理 / Keep Status Update Logic in the Parent / 상태 변경 로직을 부모에 정리

### 日本語

`orders` stateを持つ `AdminOrdersPage` に状態変更ロジックを整理する。

``` tsx
function handleStatusChange(
  orderId: number,
  newStatus: OrderStatus
) {
  const updatedOrders = orders.map((currentOrder) => {
    if (currentOrder.id === orderId) {
      return {
        ...currentOrder,
        status: newStatus,
      };
    }

    return currentOrder;
  });

  setOrders(updatedOrders);
}
```

**Tip**

最初は「stateを持つ親が、そのstateを更新する中心ロジックも持つ」と考える。

### English

Keep the main update logic in `AdminOrdersPage`, which owns the `orders`
state.

``` tsx
function handleStatusChange(
  orderId: number,
  newStatus: OrderStatus
) {
  const updatedOrders = orders.map((currentOrder) => {
    if (currentOrder.id === orderId) {
      return {
        ...currentOrder,
        status: newStatus,
      };
    }

    return currentOrder;
  });

  setOrders(updatedOrders);
}
```

**Tip**

A useful beginner model is: the component that owns the state also owns
the main update logic.

### 한국어

`orders` state를 가진 `AdminOrdersPage`에 상태 변경 로직을 정리한다.

``` tsx
function handleStatusChange(
  orderId: number,
  newStatus: OrderStatus
) {
  const updatedOrders = orders.map((currentOrder) => {
    if (currentOrder.id === orderId) {
      return {
        ...currentOrder,
        status: newStatus,
      };
    }

    return currentOrder;
  });

  setOrders(updatedOrders);
}
```

**팁**

처음에는 `state를 가진 부모가 그 state를 변경하는 중심 로직도 가진다`고
이해하면 좋다.

------------------------------------------------------------------------

## STEP 7 --- Callback Props / Callback Props / 함수를 props로 전달

### 日本語

`OrderCard` 内の `<select>`
から親のstate更新を依頼するため、親の関数をpropsで渡す。

``` tsx
<OrderCard
  order={order}
  onStatusChange={handleStatusChange}
/>
```

``` tsx
type OrderCardProps = {
  order: Order;
  onStatusChange: (
    orderId: number,
    newStatus: OrderStatus
  ) => void;
};
```

子側：

``` tsx
onChange={(e) => {
  const newStatus = e.target.value as OrderStatus;
  onStatusChange(order.id, newStatus);
}}
```

**Tip**

callback propsは「子が親に処理を依頼するための関数」。

### English

Pass the parent's update function to the child as a callback prop.

``` tsx
<OrderCard
  order={order}
  onStatusChange={handleStatusChange}
/>
```

``` tsx
type OrderCardProps = {
  order: Order;
  onStatusChange: (
    orderId: number,
    newStatus: OrderStatus
  ) => void;
};
```

**Tip**

A callback prop is a function the child uses to request an action from
the parent.

### 한국어

`OrderCard` 안의 `<select>`에서 부모의 state 변경을 요청할 수 있도록
부모 함수를 props로 전달한다.

``` tsx
<OrderCard
  order={order}
  onStatusChange={handleStatusChange}
/>
```

``` tsx
type OrderCardProps = {
  order: Order;
  onStatusChange: (
    orderId: number,
    newStatus: OrderStatus
  ) => void;
};
```

자식에서는:

``` tsx
onChange={(e) => {
  const newStatus = e.target.value as OrderStatus;
  onStatusChange(order.id, newStatus);
}}
```

**팁**

callback props를 `자식이 부모에게 처리를 요청하기 위한 함수`라고
이해한다.

------------------------------------------------------------------------

## STEP 8 --- `OrderItemList` を分離 / Extract `OrderItemList` / `OrderItemList` 분리

### 日本語

`OrderCard` の動作確認後、商品一覧部分を分離する。

``` tsx
<OrderItemList items={order.items} />
```

``` tsx
type OrderItemListProps = {
  items: OrderItem[];
};
```

**Tip**

1つ分離するたびに動作確認する。

### English

After confirming `OrderCard` works, extract the item list.

``` tsx
<OrderItemList items={order.items} />
```

``` tsx
type OrderItemListProps = {
  items: OrderItem[];
};
```

**Tip**

Extract one component at a time and test after every change.

### 한국어

`OrderCard`가 정상 동작하는 것을 확인한 뒤 상품 목록을 `OrderItemList`로
분리한다.

``` tsx
<OrderItemList items={order.items} />
```

``` tsx
type OrderItemListProps = {
  items: OrderItem[];
};
```

**팁**

컴포넌트 하나를 분리할 때마다 기존 기능이 그대로 동작하는지 확인한다.

------------------------------------------------------------------------

## STEP 9 --- `OrderStatusSelect` 分離を判断 / Decide on `OrderStatusSelect` / `OrderStatusSelect` 분리 여부 판단

### 日本語

status選択UIも独立したコンポーネントにできる。

``` tsx
<OrderStatusSelect
  status={order.status}
  onChange={(newStatus) => {
    onStatusChange(order.id, newStatus);
  }}
/>
```

ただしDay 13では必須ではない。

**Tip**

「分けられる」と「今分けるべき」は同じではない。

### English

The status select can also be extracted into its own component.

``` tsx
<OrderStatusSelect
  status={order.status}
  onChange={(newStatus) => {
    onStatusChange(order.id, newStatus);
  }}
/>
```

This is optional for Day 13.

**Tip**

Something being extractable does not mean it must be extracted
immediately.

### 한국어

상태 선택 UI도 `OrderStatusSelect`로 분리할 수 있다.

``` tsx
<OrderStatusSelect
  status={order.status}
  onChange={(newStatus) => {
    onStatusChange(order.id, newStatus);
  }}
/>
```

하지만 Day 13의 필수 목표는 아니다.

**팁**

`분리할 수 있다`와 `지금 반드시 분리해야 한다`는 다르다.

------------------------------------------------------------------------

## STEP 10 --- Component Separation と File Separation / Component vs File Separation / 컴포넌트 분리와 파일 분리

### 日本語

コンポーネント分割とファイル分割は同じではない。

最初は同じファイル内でコンポーネントを分け、その後ファイルを整理してもよい。

``` text
app/
└─ admin/
   └─ orders/
      ├─ page.tsx
      └─ components/
         ├─ OrderCard.tsx
         ├─ OrderItemList.tsx
         └─ OrderStatusSelect.tsx
```

**Tip**

責任を分けてからファイル位置を整理する。

### English

Component separation and file separation are different concepts.

First separate responsibilities, then organize the files.

``` text
app/
└─ admin/
   └─ orders/
      ├─ page.tsx
      └─ components/
         ├─ OrderCard.tsx
         ├─ OrderItemList.tsx
         └─ OrderStatusSelect.tsx
```

**Tip**

Separate responsibilities first, then file locations.

### 한국어

컴포넌트 분리와 파일 분리는 같은 개념이 아니다.

먼저 한 파일 안에서 컴포넌트만 나눈 뒤, 동작 확인 후 파일을 정리해도
된다.

``` text
app/
└─ admin/
   └─ orders/
      ├─ page.tsx
      └─ components/
         ├─ OrderCard.tsx
         ├─ OrderItemList.tsx
         └─ OrderStatusSelect.tsx
```

**팁**

먼저 책임을 나누고, 그다음 파일 위치를 나눈다.

------------------------------------------------------------------------

## STEP 11 --- データフロー確認 / Review the Data Flow / 데이터 흐름 확인

### 日本語

分離後の流れ：

``` text
AdminOrdersPage
↓
orders.map()
↓
order + onStatusChange
↓
OrderCard
↓
<select>
↓
order.id + newStatus
↓
onStatusChange(...)
↓
handleStatusChange()
↓
setOrders()
↓
再レンダリング
```

**Tip**

コンポーネントを分けてもデータは消えない。propsを通じて流れが明確になる。

### English

After separation:

``` text
AdminOrdersPage
↓
orders.map()
↓
order + onStatusChange
↓
OrderCard
↓
<select>
↓
order.id + newStatus
↓
onStatusChange(...)
↓
handleStatusChange()
↓
setOrders()
↓
re-render
```

**Tip**

Component separation does not remove the data flow. Props make the path
clearer.

### 한국어

분리 후 전체 흐름:

``` text
AdminOrdersPage
↓
orders.map()
↓
order + onStatusChange
↓
OrderCard
↓
<select>
↓
order.id + newStatus
↓
onStatusChange(...)
↓
handleStatusChange()
↓
setOrders()
↓
재렌더링
```

**팁**

컴포넌트를 분리해도 데이터 흐름이 사라지는 것이 아니라 props를 통해 이동
경로가 더 명확해진다.

------------------------------------------------------------------------

## STEP 12 --- Day 13 最終テスト / Day 13 Final Test / Day 13 최종 테스트

### 日本語

``` text
[ ] 注文一覧が表示される
[ ] 注文者情報が表示される
[ ] 商品一覧が表示される
[ ] 合計金額が表示される
[ ] 現在のstatusがselectに表示される
[ ] 各注文のstatusを変更できる
[ ] 1件を変更しても他の注文は変わらない
[ ] 分割前と同じ動作をする
```

**Tip**

リファクタリング後はまず機能が壊れていないか確認する。

### English

``` text
[ ] order list renders
[ ] customer information renders
[ ] item list renders
[ ] total price renders
[ ] current status appears in the select
[ ] each order status can be changed
[ ] changing one order does not affect the others
[ ] behavior matches the pre-refactoring version
```

**Tip**

After refactoring, verify behavior before judging code cleanliness.

### 한국어

``` text
[ ] 주문 목록이 정상 표시된다
[ ] 주문자 정보가 정상 표시된다
[ ] 상품 목록이 정상 표시된다
[ ] 총 주문금액이 정상 표시된다
[ ] 현재 status가 select에 표시된다
[ ] 각 주문의 status를 변경할 수 있다
[ ] 한 주문을 변경해도 다른 주문은 그대로다
[ ] 컴포넌트 분리 전과 동일하게 동작한다
```

**팁**

리팩터링 후에는 코드가 예뻐졌는지보다 먼저 기존 기능이 깨지지 않았는지
확인한다.

------------------------------------------------------------------------

# Day 13 완료 기준

``` text
1. 컴포넌트를 왜 분리하는지 설명할 수 있다.
2. OrderCard를 분리할 수 있다.
3. order: Order를 props로 전달할 수 있다.
4. Props Type을 작성할 수 있다.
5. 부모와 자식 관계를 설명할 수 있다.
6. 함수를 props로 전달할 수 있다.
7. 자식에서 부모의 상태 변경 함수를 호출할 수 있다.
8. OrderItemList를 추가로 분리할 수 있다.
9. 컴포넌트 분리와 파일 분리의 차이를 설명할 수 있다.
10. 분리 전과 동일하게 관리자 주문 상태 변경 기능이 동작한다.
```

**팁**

Day 13의 가장 중요한 흐름은
`Component → Props → Callback Props → Parent/Child Data Flow`다.
