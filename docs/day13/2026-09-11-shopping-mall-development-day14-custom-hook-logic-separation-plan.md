# Day 14 --- Custom Hook & Logic Separation 学習計画 / Study Plan / 학습 계획

[📝 General](2026-09-11-shopping-mall-development-day13-component-separation-props-review.md)\
[✅ Q&A](2026-09-11-shopping-mall-development-day13-component-separation-props-Q&A.md)

> 学習フロー / Learning Flow / 학습 흐름\
> `Why Custom Hook? → Custom Hook vs Normal Function → useOrders → State Ownership → Logic Separation → Return Values → Callback Props → Data Flow → File Separation → Test`

---

# 日本語

## STEP 1 --- 現在のコードで UI とロジックを区別する

Day 13では、`AdminOrdersPage` に集まっていたUIの責務を `OrderCard` と
`OrderItemList` に分離した。

Day 14では、さらに `AdminOrdersPage`
に残っているReactロジックに注目する。

```tsx
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  function handleStatusChange(
    orderId: number,
    newStatus: OrderStatus,
  ) {
    setOrders(
      orders.map((currentOrder) => {
        if (currentOrder.id === orderId) {
          return {
            ...currentOrder,
            status: newStatus,
          };
        }

        return currentOrder;
      }),
    );
  }

  return (
    // UI...
  );
}
```

ここには大きく2つの責務がある。

```text
UIを表示する責務

注文stateと注文変更ロジックを管理する責務
```

Day 14では、この2つを分ける考え方を学ぶ。

**Tip**

Day 13が「UIをどのコンポーネントに分けるか」だったなら、Day
14は「UIの中にあるReactロジックをどこへ分離するか」と考える。

---

## STEP 2 --- Custom Hook が必要な理由を理解する

Custom Hookを単なる「コードを短くする方法」として覚えない。

現在の `AdminOrdersPage`
は画面を表示しながら、注文stateと注文変更処理も管理している。

目標は次のように責務を分けること。

```text
AdminOrdersPage
→ 管理者注文画面を表示する

useOrders
→ 注文stateと注文関連ロジックを管理する
```

将来的には次のような形を目指す。

```tsx
const { orders, updateOrderStatus } = useOrders();
```

**Tip**

新しい文法を見る前に、「このロジックは本当にUIコンポーネントの中にある必要があるか？」と考える。

---

## STEP 3 --- 普通の関数と Custom Hook の違い

普通の関数は一般的なJavaScriptロジックを分離できる。

```tsx
function calculateTotal() {
  // normal JavaScript logic
}
```

Custom
HookはReactのstateや他のHookを含むReactロジックを再利用・分離するために使える。

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
}
```

Custom Hookの名前は `use` から始める。

```text
useOrders
useCart
useProducts
```

この段階ではRules of Hooksも基本だけ確認する。

**Tip**

`useOrders`
という名前を暗記するより、「注文に関係するReactロジックをまとめる場所」と理解する。

---

## STEP 4 --- 最小の `useOrders()` を作る

最初からすべてのロジックを移動しない。

まずstateだけをCustom Hookへ移動する。

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  return {
    orders,
  };
}
```

ページでは次のように使用する。

```tsx
const { orders } = useOrders();
```

流れ：

```text
useOrders()
↓
ordersをreturn
↓
AdminOrdersPage
↓
UIでordersを使用
```

**Tip**

最初の目標は「Custom
Hookがstateを持ち、そのstateをコンポーネントへ返す」という1つの流れだけを理解すること。

---

## STEP 5 --- State の所有者が変わることを理解する

Day 13までは：

```text
AdminOrdersPage
└─ useState<Order[]>()
```

Day 14では：

```text
AdminOrdersPage
└─ useOrders()
   └─ useState<Order[]>()
```

となる。

つまり、注文stateを管理するReactロジックは `useOrders` に移動する。

`AdminOrdersPage` は `useOrders()` が提供する値を使ってUIを表示する。

**Tip**

Reactコードを見るときは常に「このstateを実際に管理しているロジックはどこにあるか？」を確認する。

---

## STEP 6 --- `handleStatusChange` のロジックを移動する

現在の状態変更関数：

```tsx
function handleStatusChange(orderId: number, newStatus: OrderStatus) {
  setOrders(
    orders.map((currentOrder) => {
      if (currentOrder.id === orderId) {
        return {
          ...currentOrder,
          status: newStatus,
        };
      }

      return currentOrder;
    }),
  );
}
```

この関数はJSXを表示しない。

役割は：

```text
orderIdを受け取る
↓
newStatusを受け取る
↓
対象注文を探す
↓
新しいOrder[]を作る
↓
setOrders
```

なので、注文ロジックとして `useOrders` に移動する。

目標：

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
    // order update logic
  }

  return {
    orders,
    updateOrderStatus,
  };
}
```

**Tip**

「この関数はUIを描画しているか、それともデータを処理しているか？」を分離判断の基準にする。

---

## STEP 7 --- Custom Hook の戻り値を理解する

Hookの内部にstateや関数を作っただけでは、外側のコンポーネントから使用できない。

必要な値をreturnする。

```tsx
return {
  orders,
  updateOrderStatus,
};
```

そして：

```tsx
const { orders, updateOrderStatus } = useOrders();
```

と受け取る。

```text
useOrders内部
↓
必要な値・関数をreturn
↓
AdminOrdersPage
↓
UIで使用
```

**Tip**

Custom Hookの `return` を「このHookを使う側に何を公開するか」と考える。

---

## STEP 8 --- Day 13 の Callback Props と接続する

Day 13では：

```tsx
<OrderCard order={order} onStatusChange={handleStatusChange} />
```

としていた。

Day 14ではCustom Hookから受け取った関数を渡す。

```tsx
const { orders, updateOrderStatus } = useOrders();
```

```tsx
<OrderCard order={order} onStatusChange={updateOrderStatus} />
```

`OrderCard` は引き続き：

```tsx
onStatusChange(order.id, newStatus);
```

と呼び出す。

`OrderCard` はその関数がどこで実装されているかを知る必要はない。

**Tip**

propsの契約を保てば、内部ロジックの場所を変更しても子コンポーネントの役割を大きく変えずに済む。

---

## STEP 9 --- 全体のデータフローを確認する

Day 13：

```text
AdminOrdersPage
├─ useState
├─ handleStatusChange
└─ OrderCard
   └─ OrderItemList
```

Day 14の目標：

```text
AdminOrdersPage
│
├─ useOrders()
│  ├─ orders state
│  └─ updateOrderStatus()
│
└─ OrderCard
   └─ OrderItemList
```

状態変更：

```text
ユーザーがselectを変更
↓
OrderCard
↓
onStatusChange(order.id, newStatus)
↓
updateOrderStatus()
↓
useOrders内部のsetOrders()
↓
orders変更
↓
AdminOrdersPage再レンダリング
↓
新しいorderがpropsで下へ
```

**Tip**

Custom
Hookを作ってもデータフローが消えるわけではない。Reactロジックの置き場所が明確になるだけ。

---

## STEP 10 --- Component Separation と Logic Separation を区別する

Day 13 Day 14

---

Component Separation Logic Separation
UIの責務を分離 Reactロジックの責務を分離
`OrderCard` `useOrders`
`OrderItemList` `updateOrderStatus`
Props Hookの戻り値
Parent / Child Component / Hook

`OrderCard` と `useOrders` は同じ種類ではない。

`OrderCard` はJSXを返すUIコンポーネント。

`useOrders` は注文に関係するReactロジックを提供するCustom Hook。

**Tip**

「UIを分けたいのか、ロジックを分けたいのか」を先に判断する。

---

## STEP 11 --- ロジック分離とファイル分離を区別する

Custom Hookを作ったからといって、最初から別ファイルにする必要はない。

最初は：

```text
page.tsx

useOrders()
OrderItemList()
OrderCard()
AdminOrdersPage()
```

でもよい。

動作と責務が理解できた後：

```text
app/admin/orders/
├─ page.tsx
├─ components/
│  ├─ OrderCard.tsx
│  └─ OrderItemList.tsx
└─ hooks/
   └─ useOrders.ts
```

のように分ける。

**Tip**

`責務分離 → 動作確認 → ファイル分離` の順番で進める。

---

## STEP 12 --- Day 14 最終テスト

Day 14は新機能追加ではなくリファクタリングが中心。

確認項目：

```text
注文一覧が表示される
商品一覧が表示される
現在の注文状態が表示される
注文状態を変更できる
変更対象の注文だけ変わる
他の注文は変わらない
```

構造：

```text
UI
↓
useOrders
↓
注文state / 注文変更ロジック
```

**Tip**

リファクタリング後は「コード構造は変わったが、ユーザーから見た動作は同じか？」を確認する。

---

## Day 14 完了基準

```text
Custom Hookが必要な理由を説明できる
↓
普通の関数とCustom Hookの違いを説明できる
↓
useOrdersを作れる
↓
useStateをuseOrdersへ移動できる
↓
ordersをreturnできる
↓
updateOrderStatusをHookへ移動できる
↓
関数をreturnできる
↓
AdminOrdersPageで構造分解して使用できる
↓
OrderCardのcallback propsと接続できる
↓
既存機能が変わっていないことを確認できる
↓
責務分離とファイル分離を区別できる
```

**Tip**

最終的に `const { orders, updateOrderStatus } = useOrders();`
を見て、なぜこの構造にしたのか自分の言葉で説明できればDay 14の目的達成。

---

# English

## STEP 1 --- Separate UI from Logic in the Current Code

Day 13 separated UI responsibilities into `OrderCard` and
`OrderItemList`.

Day 14 focuses on the React logic still inside `AdminOrdersPage`.

```tsx
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  function handleStatusChange(
    orderId: number,
    newStatus: OrderStatus,
  ) {
    setOrders(
      orders.map((currentOrder) => {
        if (currentOrder.id === orderId) {
          return {
            ...currentOrder,
            status: newStatus,
          };
        }

        return currentOrder;
      }),
    );
  }

  return (
    // UI...
  );
}
```

There are two broad responsibilities:

```text
render the UI

manage order state and order-update logic
```

Day 14 separates these responsibilities.

**Tip**

Think of Day 13 as separating UI pieces and Day 14 as separating React
logic from the UI.

---

## STEP 2 --- Understand Why a Custom Hook Is Needed

Do not learn a Custom Hook merely as a way to reduce lines of code.

The goal is to separate responsibilities:

```text
AdminOrdersPage
→ render the admin order UI

useOrders
→ manage order state and order-related logic
```

Target shape:

```tsx
const { orders, updateOrderStatus } = useOrders();
```

**Tip**

Before learning syntax, ask whether a piece of logic truly belongs
inside the UI component.

---

## STEP 3 --- Normal Function vs Custom Hook

A normal function can separate ordinary JavaScript logic.

```tsx
function calculateTotal() {
  // normal JavaScript logic
}
```

A Custom Hook can contain React state and other Hooks.

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
}
```

Custom Hook names start with `use`.

```text
useOrders
useCart
useProducts
```

We will also review the basic Rules of Hooks without going too deep.

**Tip**

Think of `useOrders` as a place that groups React logic related to
orders, rather than memorizing its name or syntax.

---

## STEP 4 --- Build the Smallest `useOrders()`

Do not move everything at once.

First, move only the state.

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  return {
    orders,
  };
}
```

Use it in the page:

```tsx
const { orders } = useOrders();
```

Flow:

```text
useOrders()
↓
return orders
↓
AdminOrdersPage
↓
use orders in the UI
```

**Tip**

Focus first on one idea: the Custom Hook owns state and returns that
state to the component.

---

## STEP 5 --- Understand the Change in State Ownership

Before Day 14:

```text
AdminOrdersPage
└─ useState<Order[]>()
```

After moving the logic:

```text
AdminOrdersPage
└─ useOrders()
   └─ useState<Order[]>()
```

The order-related React state logic now lives in `useOrders`, while
`AdminOrdersPage` consumes the values it provides.

**Tip**

Keep asking: "Where is the logic that actually manages this state?"

---

## STEP 6 --- Move the `handleStatusChange` Logic

The current function:

```tsx
function handleStatusChange(orderId: number, newStatus: OrderStatus) {
  setOrders(
    orders.map((currentOrder) => {
      if (currentOrder.id === orderId) {
        return {
          ...currentOrder,
          status: newStatus,
        };
      }

      return currentOrder;
    }),
  );
}
```

does not render JSX. It processes order data.

Its flow is:

```text
receive orderId
↓
receive newStatus
↓
find the target order
↓
create a new Order[]
↓
setOrders
```

So it is a good candidate for `useOrders`.

Target:

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
    // order update logic
  }

  return {
    orders,
    updateOrderStatus,
  };
}
```

**Tip**

Ask whether a function renders UI or processes data. Data-processing
functions are strong candidates for logic separation.

---

## STEP 7 --- Understand Custom Hook Return Values

Values created inside a Hook must be returned if the component needs
them.

```tsx
return {
  orders,
  updateOrderStatus,
};
```

Then:

```tsx
const { orders, updateOrderStatus } = useOrders();
```

Flow:

```text
inside useOrders
↓
return required values/functions
↓
AdminOrdersPage
↓
use them in the UI
```

**Tip**

Think of the Hook's return value as its public interface: what does it
expose to the component using it?

---

## STEP 8 --- Connect It to Day 13 Callback Props

Day 13:

```tsx
<OrderCard order={order} onStatusChange={handleStatusChange} />
```

Day 14:

```tsx
const { orders, updateOrderStatus } = useOrders();
```

```tsx
<OrderCard order={order} onStatusChange={updateOrderStatus} />
```

`OrderCard` can still call:

```tsx
onStatusChange(order.id, newStatus);
```

The child does not need to know where that function is implemented.

**Tip**

If the props contract stays stable, implementation details can move
without forcing major changes in the child component.

---

## STEP 9 --- Review the Full Data Flow

Day 13:

```text
AdminOrdersPage
├─ useState
├─ handleStatusChange
└─ OrderCard
   └─ OrderItemList
```

Day 14 target:

```text
AdminOrdersPage
│
├─ useOrders()
│  ├─ orders state
│  └─ updateOrderStatus()
│
└─ OrderCard
   └─ OrderItemList
```

Status update flow:

```text
user changes select
↓
OrderCard
↓
onStatusChange(order.id, newStatus)
↓
updateOrderStatus()
↓
setOrders() inside useOrders
↓
orders changes
↓
AdminOrdersPage re-renders
↓
updated order flows down through props
```

**Tip**

A Custom Hook does not remove the data flow. It gives the React logic a
clearer home.

---

## STEP 10 --- Component Separation vs Logic Separation

Day 13 Day 14

---

Component Separation Logic Separation
Separate UI responsibilities Separate React logic responsibilities
`OrderCard` `useOrders`
`OrderItemList` `updateOrderStatus`
Props Hook return values
Parent / Child Component / Hook

`OrderCard` and `useOrders` are not the same kind of abstraction.

`OrderCard` is a UI component that returns JSX.

`useOrders` is a Custom Hook that provides order-related React logic.

**Tip**

First decide whether you are trying to separate UI or logic.

---

## STEP 11 --- Logic Separation vs File Separation

Creating a Custom Hook does not mean it must immediately be moved into
another file.

Start with:

```text
page.tsx

useOrders()
OrderItemList()
OrderCard()
AdminOrdersPage()
```

After the responsibilities and behavior are clear:

```text
app/admin/orders/
├─ page.tsx
├─ components/
│  ├─ OrderCard.tsx
│  └─ OrderItemList.tsx
└─ hooks/
   └─ useOrders.ts
```

**Tip**

Follow this order: separate responsibility → verify behavior → separate
files.

---

## STEP 12 --- Day 14 Final Test

Day 14 is mainly a refactoring day, not a feature day.

Verify:

```text
order list renders
product list renders
current status renders
status can be changed
only the selected order changes
other orders remain unchanged
```

Architecture:

```text
UI
↓
useOrders
↓
order state / order update logic
```

**Tip**

After refactoring, verify that the code structure changed while
user-visible behavior stayed the same.

---

## Day 14 Completion Criteria

```text
Explain why a Custom Hook is useful
↓
Explain normal function vs Custom Hook
↓
Create useOrders
↓
Move useState into useOrders
↓
Return orders
↓
Move updateOrderStatus into the Hook
↓
Return the update function
↓
Destructure and use them in AdminOrdersPage
↓
Connect the function to OrderCard callback props
↓
Verify existing behavior
↓
Distinguish responsibility separation from file separation
```

**Tip**

Day 14 is complete when you can look at
`const { orders, updateOrderStatus } = useOrders();` and explain why the
project uses that structure.

---

# 한국어

## STEP 1 --- 현재 코드에서 UI와 로직 구분하기

Day 13에서는 `AdminOrdersPage`에 모여 있던 UI 책임을 `OrderCard`,
`OrderItemList`로 분리했다.

Day 14에서는 `AdminOrdersPage`에 아직 남아 있는 React 로직을 살펴본다.

```tsx
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  function handleStatusChange(
    orderId: number,
    newStatus: OrderStatus,
  ) {
    setOrders(
      orders.map((currentOrder) => {
        if (currentOrder.id === orderId) {
          return {
            ...currentOrder,
            status: newStatus,
          };
        }

        return currentOrder;
      }),
    );
  }

  return (
    // UI...
  );
}
```

여기에는 크게 두 책임이 있다.

```text
화면을 렌더링하는 책임

주문 state와 주문 변경 로직을 관리하는 책임
```

Day 14에서는 이 두 책임을 분리하는 방법을 배운다.

**팁**

Day 13이 `UI를 어떤 컴포넌트로 나눌까?`였다면 Day 14는
`UI 안에 있는 React 로직을 어디로 분리할까?`라고 생각하자.

---

## STEP 2 --- Custom Hook이 필요한 이유 이해하기

Custom Hook을 단순히 코드를 짧게 만드는 기술로 배우지 않는다.

목표는 책임을 다음처럼 구분하는 것이다.

```text
AdminOrdersPage
→ 관리자 주문 화면을 보여주는 책임

useOrders
→ 주문 state와 주문 관련 로직을 관리하는 책임
```

목표 형태:

```tsx
const { orders, updateOrderStatus } = useOrders();
```

**팁**

문법부터 외우지 말고 `이 로직이 정말 UI 컴포넌트 안에 있어야 하는가?`를
먼저 생각한다.

---

## STEP 3 --- 일반 함수와 Custom Hook 차이 이해하기

일반 함수는 일반적인 JavaScript 로직을 분리할 수 있다.

```tsx
function calculateTotal() {
  // 일반 JavaScript 로직
}
```

Custom Hook은 React state와 다른 Hook을 포함하는 React 로직을 분리할 수
있다.

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
}
```

Custom Hook 이름은 `use`로 시작한다.

```text
useOrders
useCart
useProducts
```

이 단계에서 Rules of Hooks의 기본 개념도 너무 깊지 않게 확인한다.

**팁**

`useOrders`라는 이름 자체보다
`주문과 관련된 React 로직을 묶어둔 곳`이라고 이해하자.

---

## STEP 4 --- 가장 작은 `useOrders()` 만들기

처음부터 모든 로직을 한꺼번에 이동하지 않는다.

먼저 state만 Custom Hook으로 이동한다.

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  return {
    orders,
  };
}
```

페이지에서는:

```tsx
const { orders } = useOrders();
```

로 사용한다.

```text
useOrders()
↓
orders 반환
↓
AdminOrdersPage
↓
UI에서 orders 사용
```

**팁**

첫 목표는
`Custom Hook이 state를 가지고 그 state를 컴포넌트에 반환한다`는 한 가지
흐름만 이해하는 것이다.

---

## STEP 5 --- state의 소유자가 바뀐다는 것 이해하기

Day 13까지:

```text
AdminOrdersPage
└─ useState<Order[]>()
```

Day 14:

```text
AdminOrdersPage
└─ useOrders()
   └─ useState<Order[]>()
```

즉 주문 state를 관리하는 React 로직이 `useOrders`로 이동한다.

`AdminOrdersPage`는 `useOrders()`가 제공한 값을 사용해서 UI를
렌더링한다.

**팁**

항상 `이 state를 실제로 관리하는 로직은 어디에 있는가?`를 확인하는
습관을 들이자.

---

## STEP 6 --- `handleStatusChange` 로직 이동하기

현재 함수:

```tsx
function handleStatusChange(orderId: number, newStatus: OrderStatus) {
  setOrders(
    orders.map((currentOrder) => {
      if (currentOrder.id === orderId) {
        return {
          ...currentOrder,
          status: newStatus,
        };
      }

      return currentOrder;
    }),
  );
}
```

이 함수는 JSX를 렌더링하지 않고 주문 데이터를 처리한다.

```text
orderId 받기
↓
newStatus 받기
↓
대상 주문 찾기
↓
새 Order[] 만들기
↓
setOrders
```

따라서 주문 로직으로 보고 `useOrders`에 이동한다.

목표:

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
    // 주문 상태 변경 로직
  }

  return {
    orders,
    updateOrderStatus,
  };
}
```

**팁**

함수를 분리할 때 `이 함수가 UI를 그리는가, 데이터를 처리하는가?`를
물어보자.

---

## STEP 7 --- Custom Hook의 반환값 이해하기

Hook 내부에 state나 함수를 만들었다고 해서 바깥 컴포넌트가 자동으로
사용할 수 있는 것은 아니다.

필요한 값과 함수를 반환한다.

```tsx
return {
  orders,
  updateOrderStatus,
};
```

그리고:

```tsx
const { orders, updateOrderStatus } = useOrders();
```

로 받는다.

```text
useOrders 내부
↓
필요한 값/함수 반환
↓
AdminOrdersPage
↓
UI에서 사용
```

**팁**

Custom Hook의 `return`을
`이 Hook을 사용하는 컴포넌트에게 무엇을 공개할 것인가?`라고 생각하자.

---

## STEP 8 --- Day 13의 Callback Props와 연결하기

Day 13에서는:

```tsx
<OrderCard order={order} onStatusChange={handleStatusChange} />
```

였다.

Day 14에서는:

```tsx
const { orders, updateOrderStatus } = useOrders();
```

로 Hook에서 함수와 데이터를 받고:

```tsx
<OrderCard order={order} onStatusChange={updateOrderStatus} />
```

로 전달한다.

`OrderCard`에서는 여전히:

```tsx
onStatusChange(order.id, newStatus);
```

라고 호출할 수 있다.

`OrderCard`는 그 함수가 페이지에서 만들어졌는지 Custom Hook에서
만들어졌는지 알 필요가 없다.

**팁**

props 계약을 유지하면 내부 구현 위치가 바뀌어도 자식 컴포넌트를 크게
변경하지 않아도 된다.

---

## STEP 9 --- 전체 데이터 흐름 다시 그리기

Day 13:

```text
AdminOrdersPage
├─ useState
├─ handleStatusChange
└─ OrderCard
   └─ OrderItemList
```

Day 14 목표:

```text
AdminOrdersPage
│
├─ useOrders()
│  ├─ orders state
│  └─ updateOrderStatus()
│
└─ OrderCard
   └─ OrderItemList
```

상태 변경 흐름:

```text
사용자가 select 변경
↓
OrderCard
↓
onStatusChange(order.id, newStatus)
↓
updateOrderStatus()
↓
useOrders 내부 setOrders()
↓
orders 변경
↓
AdminOrdersPage 재렌더링
↓
변경된 order가 props로 다시 내려감
```

**팁**

Custom Hook을 만들었다고 데이터 흐름이 사라지는 것이 아니다. 주문 관련
React 로직의 위치가 더 명확해진 것이다.

---

## STEP 10 --- 컴포넌트 분리 vs 로직 분리 구분하기

Day 13 Day 14

---

Component Separation Logic Separation
UI 책임 분리 React 로직 책임 분리
`OrderCard` `useOrders`
`OrderItemList` `updateOrderStatus`
Props Hook 반환값
부모 / 자식 Component / Hook

`OrderCard`와 `useOrders`는 같은 종류가 아니다.

`OrderCard`는 JSX를 반환하는 UI 컴포넌트이고 `useOrders`는 주문 관련
React 로직을 제공하는 Custom Hook이다.

**팁**

분리하기 전에 `지금 UI를 분리하려는가, 로직을 분리하려는가?`를 먼저
판단한다.

---

## STEP 11 --- 로직 분리와 파일 분리 구분하기

Custom Hook을 만들었다고 바로 파일까지 나눠야 하는 것은 아니다.

처음에는:

```text
page.tsx

useOrders()
OrderItemList()
OrderCard()
AdminOrdersPage()
```

로 진행할 수 있다.

책임과 동작을 이해한 뒤:

```text
app/admin/orders/
├─ page.tsx
├─ components/
│  ├─ OrderCard.tsx
│  └─ OrderItemList.tsx
└─ hooks/
   └─ useOrders.ts
```

처럼 파일을 분리한다.

**팁**

이번에도 `책임 분리 → 동작 확인 → 파일 분리` 순서로 진행한다.

---

## STEP 12 --- Day 14 최종 테스트

Day 14는 새로운 기능 추가보다 리팩터링이 중심이다.

확인할 내용:

```text
주문 목록 정상 표시
상품 목록 정상 표시
현재 주문 상태 정상 표시
주문 상태 변경 가능
선택한 주문만 변경
다른 주문에는 영향 없음
```

구조는:

```text
UI
↓
useOrders
↓
주문 state / 주문 변경 로직
```

으로 분리되어 있어야 한다.

**팁**

리팩터링 후에는
`코드 구조는 바뀌었지만 사용자가 보는 동작은 그대로인가?`를 확인한다.

---

## Day 14 완료 기준

```text
Custom Hook이 필요한 이유를 설명할 수 있다
↓
일반 함수와 Custom Hook 차이를 설명할 수 있다
↓
useOrders를 만들 수 있다
↓
useState를 useOrders로 이동할 수 있다
↓
orders를 반환할 수 있다
↓
updateOrderStatus를 Hook으로 이동할 수 있다
↓
상태 변경 함수를 반환할 수 있다
↓
AdminOrdersPage에서 구조 분해하여 사용할 수 있다
↓
OrderCard callback props와 연결할 수 있다
↓
기존 기능이 동일하게 동작하는지 확인할 수 있다
↓
로직 분리와 파일 분리를 구분할 수 있다
```

**팁**

최종적으로 다음 코드를 보고:

```tsx
const { orders, updateOrderStatus } = useOrders();
```

`왜 이렇게 분리했는가?`를 자기 말로 설명할 수 있으면 Day 14의 목표를
달성한 것이다.

---

# Day 14 핵심 흐름

```text
Day 13
Component Separation
UI 책임 분리
        ↓
Day 14
Logic Separation
        ↓
useOrders()
        ↓
orders state
+
updateOrderStatus()
        ↓
필요한 값과 함수를 return
        ↓
AdminOrdersPage
        ↓
OrderCard에 props 전달
        ↓
사용자 이벤트
        ↓
callback
        ↓
useOrders의 상태 변경 로직
        ↓
React 재렌더링
```

> **Day 14 핵심 문장:** Custom Hook은 단순히 코드를 줄이기 위한 문법이
> 아니라, 컴포넌트 안에 섞여 있는 React state와 관련 로직을 하나의
> 책임으로 분리하고 필요한 값과 함수를 컴포넌트에 제공하기 위한 구조다.
