# Day 14 学習記録 --- Custom Hook と React ロジックの分離

## 1. 今日の学習目標

Day 14 の中心的な目標は、**コンポーネント内に混在していた React の state
と state 更新ロジックを Custom Hook に分離すること**だった。

Day 13 では、`AdminOrdersPage` 内の UI を `OrderCard` と `OrderItemList`
に分離しながら、**UI の責務分離**を練習した。

Day 14 ではさらに一歩進み、`AdminOrdersPage` に残っていた `orders` state
と注文ステータス更新ロジックを、`useOrders` という Custom Hook
に移動した。

最終的な責務は次のように整理された。

```text
AdminOrdersPage
→ ページ UI を組み立てる

OrderCard
→ 注文カード UI を表示し、ユーザーイベントを伝える

OrderItemList
→ 注文商品一覧 UI を表示する

useOrders
→ orders state と注文ステータス更新ロジックを管理する

types/order.ts
→ 注文関連の TypeScript 型を定義する
```

---

## 2. UI とロジックを区別する

最初は `AdminOrdersPage` の中に UI と React ロジックが一緒に入っていた。

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
    // UI
  );
}
```

ここには二つの責務が混在している。

### UI

ユーザーに何を表示するかを決める部分である。

```tsx
return (
  <main>
    {orders.map((order) => (
      <OrderCard
        key={order.id}
        order={order}
        onStatusChange={handleStatusChange}
      />
    ))}
  </main>
);
```

`map()` という構文自体が UI
またはロジックのどちらかに固定されるわけではない。

上のコードでは `OrderCard`
を繰り返しレンダリングするために使っているので、役割としては UI
側に当たる。

### React ロジック

React の state を保存・更新する部分である。

```tsx
const [orders, setOrders] = useState<Order[]>(initialOrders);
```

また、次のように既存の注文データを加工して state を更新する処理も React
ロジックに当たる。

```tsx
setOrders(
  orders.map(...)
);
```

> **判断基準:** 画面を描画するか？ → UI\
> state を保存または更新するか？ → React ロジック

**ヒント**

コードを見るときは構文の名前よりも、**そのコードが何をするために存在しているのか**を基準に判断する。

---

## 3. UI ロジック、React ロジック、ビジネスロジック

### UI ロジック

画面の表示状態やユーザー操作を扱うロジックである。

例:

```tsx
const [isOpen, setIsOpen] = useState(false);
```

モーダルの開閉、選択中のタブ、ドロップダウンを表示するかどうかなどがこれに近い。

### React ロジック

React の state やライフサイクルの仕組みを利用するロジックである。

例:

```tsx
const [orders, setOrders] = useState<Order[]>(initialOrders);
```

`useState`、`useEffect`、Custom Hook などの React
の機能を利用して、state とレンダリングをつなげる。

### ビジネスロジック

React に依存せず、サービスやドメイン自体に存在するルールである。

例:

```tsx
function canCancelOrder(order: Order) {
  return order.status !== "배송완료";
}
```

React
がなくても、「配送完了済みの注文はキャンセルできない」というルール自体は存在する。

> React がなくなってもこのルールは必要か？\
> 必要なら、ビジネスロジックである可能性が高い。

**ヒント**

Day 14
では、この三つを完璧に分離することよりも、`AdminOrdersPage = UI`、`useOrders = 注文関連の React state / ロジック`
という境界をしっかり理解することが重要である。

---

## 4. 通常の関数と Custom Hook の違い

### 通常の関数

通常の関数は、React に依存しない JavaScript / TypeScript
のロジックを分離するときに使える。

```tsx
function calculateTotal(price: number, quantity: number) {
  return price * quantity;
}
```

また、注文配列を受け取って新しい配列を返すような純粋なデータ変換も通常の関数として作れる。

```tsx
function changeOrderStatus(
  orders: Order[],
  orderId: number,
  newStatus: OrderStatus,
) {
  return orders.map((order) => {
    if (order.id === orderId) {
      return {
        ...order,
        status: newStatus,
      };
    }

    return order;
  });
}
```

### Custom Hook

Custom Hook は React Hook を利用しながら、関連する React
ロジックを一つの責務としてまとめる。

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  return {
    orders,
  };
}
```

Custom Hook も本質的には JavaScript の関数だが、React Hook
を使用し、Hooks のルールに従う。

```text
Custom Hook
= JavaScript の関数
+ React Hook の利用
+ Hooks のルール
```

Hook の名前は `useOrders`、`useCart`、`useProducts` のように `use`
で始める。

**ヒント**

「React
の外でもそのまま実行できる計算か？」と考える。そうであればまず通常の関数を検討し、`useState`
のような React Hook が必要なら Custom Hook を検討する。

---

## 5. `useOrders` を作る --- まず state を移動する

最初は `AdminOrdersPage` が直接 state を持っていた。

```tsx
const [orders, setOrders] = useState<Order[]>(initialOrders);
```

この state を `useOrders` に移動した。

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  return {
    orders,
  };
}
```

ページ側では次のように使用する。

```tsx
const { orders } = useOrders();
```

この時点で `setOrders` は `useOrders`
の内部にしか存在しない。そのため、既存の `handleStatusChange` が
`AdminOrdersPage` に残ったまま `setOrders`
を使おうとすると、スコープエラーが発生する。

これは間違ったリファクタリングではなく、**state
だけを先に移動したことで生じる自然な途中段階**だった。

**ヒント**

リファクタリングを一度に完成させようとせず、小さな単位で移動し、発生したエラーの理由を理解してから次の段階へ進む。

---

## 6. state 更新ロジックも `useOrders` に移動する

state と密接に関係する `handleStatusChange` も Hook 内へ移動した。

このとき名前を `updateOrderStatus` に変更した。

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
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

  return {
    orders,
    updateOrderStatus,
  };
}
```

`handleStatusChange`
はイベントハンドラーらしい名前だが、`updateOrderStatus`
は「注文ステータスを更新する」というデータ操作の意味をより明確に表している。

ページでは次のように使う。

```tsx
const { orders, updateOrderStatus } = useOrders();
```

そして `OrderCard` に callback prop として渡す。

```tsx
<OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} />
```

**ヒント**

関数名は実装方法よりも、**その関数が何をするのか**を表すようにすると役割が読み取りやすくなる。

---

## 7. Custom Hook の `return` は公開インターフェース

`useOrders` の内部には次の値が存在する。

```text
orders
setOrders
updateOrderStatus
```

しかし外部には次の二つだけを返す。

```tsx
return {
  orders,
  updateOrderStatus,
};
```

そのため `AdminOrdersPage` では次の二つだけを利用できる。

```tsx
const { orders, updateOrderStatus } = useOrders();
```

`setOrders` は Hook の内部に隠されたままである。

この `return` オブジェクトは、**Custom Hook
が外部に提供する公開インターフェース**と考えることができる。

```text
useOrders の内部
├─ orders
├─ setOrders
└─ updateOrderStatus

外部に公開
├─ orders
└─ updateOrderStatus
```

**ヒント**

Custom Hook の `return` を見るときは、「この Hook
を使うコンポーネントに、どの値や機能を使わせるのか？」と考える。

---

## 8. `setOrders` を隠すこととカプセル化

もし `setOrders` まで返した場合:

```tsx
return {
  orders,
  setOrders,
  updateOrderStatus,
};
```

外部から注文 state を直接変更できる。

```tsx
setOrders([]);
```

そうすると、`useOrders` が注文 state
の更新を担当するという責務の境界が弱くなる。

一方、次のように必要な機能だけを公開する。

```tsx
return {
  orders,
  updateOrderStatus,
};
```

すると外部は決められた操作を通して state を変更する。

```tsx
updateOrderStatus(1, "배송중");
```

つまり:

```text
setOrders
→ 内部実装のための手段

updateOrderStatus
→ 外部に公開する意味のある操作
```

内部実装を隠し、外部には決められた利用方法だけを提供する考え方は、**カプセル化**につながる。

**ヒント**

カプセル化を単に「隠すこと」と覚えるのではなく、**内部実装を保護し、必要な入口だけを公開すること**と理解する。

---

## 9. `setOrders` を呼んでも現在の `orders` がすぐ変わらない理由

React の state
は、現在のレンダリングにおけるスナップショットのように考えられる。

```tsx
console.log(orders);

setOrders(newOrders);

console.log(orders);
```

このコードでは、二つ目の `console.log(orders)`
でも現在のレンダリングが持っている以前の `orders`
が表示されることがある。

`setOrders()` は現在の変数をその場で直接変更する関数ではなく、**次の
state 更新と再レンダリングを React
に要求する関数**と考えると理解しやすい。

流れは次のとおり。

```text
現在のレンダリング
↓
現在の orders を使用
↓
setOrders(...) を呼び出す
↓
React が state 更新を処理
↓
AdminOrdersPage を再レンダリング
↓
useOrders を再実行
↓
新しい orders を使用
```

値がすぐ変わらない理由は `const`
だからではない。各レンダリングには、そのレンダリングが参照する state
のスナップショットがあるためである。

**ヒント**

`setState`
系の関数を見たら、「今の変数を変更する」ではなく、**次のレンダリングで使う
state を要求する**と考える。

---

## 10. `useOrders` 内の `useState` と再レンダリング

重要なのは、`useOrders`
自体が独立したコンポーネントのように再レンダリングされるわけではないという点である。

レンダリングの流れは次のとおり。

```text
React
↓
AdminOrdersPage を実行
↓
useOrders() を実行
↓
useState() を呼び出す
↓
orders を返す
↓
AdminOrdersPage が JSX を生成
```

ユーザーが注文ステータスを変更すると:

```text
ユーザーが select を変更
↓
OrderCard
↓
onStatusChange(order.id, newStatus)
↓
updateOrderStatus()
↓
setOrders()
↓
state 更新
↓
AdminOrdersPage を再レンダリング
↓
useOrders() を再実行
↓
新しい orders を使って UI を生成
```

`map()` 自体が再レンダリングを発生させるわけではない。`setOrders()`
による state 更新が、再レンダリングが必要であることを React に伝える。

また、再レンダリング時にコード上では `useState(initialOrders)`
が再び呼ばれても、毎回 `initialOrders` に初期化されるわけではない。React
はその Hook の位置に保持している現在の state を返す。

**ヒント**

Custom Hook
を独立した小さなコンポーネントだと考えず、**コンポーネントがレンダリングされるときに一緒に実行される
React ロジックのまとまり**と考える。

---

## 11. Callback Props と Custom Hook を接続する

`OrderCard` は次の callback prop を受け取る。

```tsx
type OrderCardProps = {
  order: Order;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
};
```

ユーザーが `<select>` を変更すると:

```tsx
onChange={(e) => {
  onStatusChange(
    order.id,
    e.target.value as OrderStatus,
  );
}}
```

が実行される。

重要なのは、`OrderCard` が `onStatusChange`
の実際の実装場所を知る必要がないという点である。

ページ側で:

```tsx
<OrderCard order={order} onStatusChange={updateOrderStatus} />
```

と渡しているため、実際には `useOrders` 内の `updateOrderStatus`
が実行される。

```text
OrderCard
→ ステータス変更を要求する

useOrders
→ 実際に orders state を更新する
```

**ヒント**

子コンポーネントは callback
関数の内部実装を知る必要はなく、**どの引数を渡して呼び出せばよいか**だけを知っていればよい。

---

## 12. 全体のデータフロー

Day 14 終了時点での注文ステータス変更の全体フローは次のとおり。

```text
1. ユーザーが OrderCard の select を変更する。
        ↓
2. OrderCard の onChange が実行される。
        ↓
3. onStatusChange(order.id, newStatus) を呼び出す。
        ↓
4. 渡されていた updateOrderStatus が実行される。
        ↓
5. useOrders 内部で setOrders を呼び出す。
        ↓
6. 新しい orders state が作られる。
        ↓
7. AdminOrdersPage が再レンダリングされる。
        ↓
8. 新しい orders を使って OrderCard を再びレンダリングする。
        ↓
9. 更新された注文ステータスが画面に反映される。
```

この流れは React の基本的なデータフローとつながっている。

```text
state
↓
UI
↓
ユーザーイベント
↓
callback
↓
state 更新
↓
再レンダリング
↓
新しい UI
```

**ヒント**

コードが複雑になったときは関数を一つずつ見るだけでなく、**データがどこから始まり、どこへ移動するのか**を矢印で描いてみる。

---

## 13. コンポーネント分離とロジック分離の違い

### Day 13 --- コンポーネント / UI の責務分離

```text
AdminOrdersPage
↓
OrderCard
↓
OrderItemList
```

主に学んだ概念:

- コンポーネントの責務
- Props
- Parent / Child
- Callback Props
- UI の分離

### Day 14 --- React ロジックの責務分離

```text
AdminOrdersPage
↓
useOrders
↓
useState
```

主に学んだ概念:

- Custom Hook
- React state の責務
- state 更新関数
- Hook の戻り値
- カプセル化
- コンポーネントと Hook の役割の違い

**ヒント**

現在の段階では、`Component` は主に **何を表示するか**、`Custom Hook`
は主に **React state
と関連する操作をどのように管理するか**に集中すると考えると理解しやすい。

---

## 14. ロジック分離とファイル分離は同じではない

最初に `useOrders` を作ったときは、同じ `page.tsx`
の中にあってもすでに責務の分離は始まっていた。

```tsx
function useOrders() {
  // React logic
}

export default function AdminOrdersPage() {
  // UI
}
```

つまり、**ロジック分離は必ずしもファイル分離を意味しない**。

まず責務を分けて動作を確認し、その後でファイルも分離した。

最終的な構成は次のとおり。

```text
app/admin/orders/
├─ page.tsx
├─ components/
│  ├─ OrderCard.tsx
│  └─ OrderItemList.tsx
└─ hooks/
   └─ useOrders.ts

types/
└─ order.ts
```

**ヒント**

リファクタリングは次の順番で進めると、問題が起きたときに原因を見つけやすい。

```text
責務を分離
↓
動作を確認
↓
ファイルを分離
```

---

## 15. ファイルごとの最終的な責務

### `page.tsx`

ページ全体の UI を組み立てる。

中心となるコードは非常にシンプルになった。

```tsx
const { orders, updateOrderStatus } = useOrders();
```

そして:

```tsx
{
  orders.map((order) => {
    return (
      <OrderCard
        key={order.id}
        order={order}
        onStatusChange={updateOrderStatus}
      />
    );
  });
}
```

ページは `setOrders`
や注文ステータス更新の内部実装を知る必要がなくなった。

### `hooks/useOrders.ts`

注文 state とその更新ロジックを担当する。

```tsx
export default function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
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

  return {
    orders,
    updateOrderStatus,
  };
}
```

### `components/OrderCard.tsx`

一つの注文情報を表示し、ステータス変更イベントを伝える。

```tsx
onChange={(e) => {
  onStatusChange(
    order.id,
    e.target.value as OrderStatus,
  );
}}
```

### `components/OrderItemList.tsx`

注文に含まれる商品配列を受け取り、商品一覧 UI をレンダリングする。

### `types/order.ts`

注文に関する共通型を定義する。

```tsx
export type OrderStatus = "결제완료" | "상품준비중" | "배송중" | "배송완료";

export type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;
};
```

上の韓国語の文字列は説明文ではなく、実際のプロジェクトで使用している
`OrderStatus` の値なので意図的にそのまま残している。

**ヒント**

各ファイルを開いて、その役割を一文で説明できるか確認する。説明が長くなりすぎる場合は、複数の責務が再び混ざっていないか確認する。

---

## 16. ファイル分離中に遭遇した TypeScript の自動 import 問題

ファイル分離中に次のエラーが発生した。

```text
Object literal may only specify known properties,
and 'id' does not exist in type 'CartItem'.
```

最初は `initialOrders` のデータや `OrderItem` 型の問題に見えたが、実際の
`OrderItem` には `id` が正しく存在していた。

```tsx
export type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};
```

原因は、**自動 import
によって意図した型ではなく別の型を参照していたこと**だった。

この経験から得たデバッグの基準:

```text
期待している型には明らかにそのプロパティが存在する
しかし TypeScript は存在しないと言っている
        ↓
エラーメッセージに表示された型名を確認
        ↓
現在の import を確認
        ↓
Ctrl + クリックで型を開く
        ↓
実際の型定義の場所を確認
```

特に、予想していなかった `CartItem`
という名前がエラーメッセージに表示されたことが重要な手がかりだった。

**ヒント**

自動 import をそのまま信用せず、import
が追加された直後にパスと型名を一度確認する。同じ名前や似た構造の型が増えるほど重要になる。

---

## 17. `import type` も学習

TypeScript の型だけを import する場合:

```tsx
import type { Order, OrderStatus } from "@/types/order";
```

のように `import type` を使用できる。

通常の import でも状況によっては動作するが、`import type` を使うと、その
import がランタイムの値ではなく TypeScript
の型であることを明確に表現できる。

**ヒント**

`Order`、`OrderStatus`、`OrderCardProps`
のように型としてのみ使用するものは、`import type` で書く習慣をつけると
import の目的が読み取りやすくなる。

---

## 18. 関数形式の state 更新 --- 今後の発展ポイント

現在のコードは次のとおり。

```tsx
setOrders(
  orders.map((currentOrder) => {
    // ...
  }),
);
```

現在の学習コードでは動作するが、新しい state を以前の state
を基準に作る場合は、関数形式の更新も使用できる。

```tsx
setOrders((prevOrders) =>
  prevOrders.map((currentOrder) => {
    if (currentOrder.id === orderId) {
      return {
        ...currentOrder,
        status: newStatus,
      };
    }

    return currentOrder;
  }),
);
```

この形式では、React が渡す以前の state を基準に次の state を計算する。

**ヒント**

次の関係になっている場合:

```text
新しい state
= 以前の state を使って計算
```

`setState((prev) => ...)` のパターンを思い出す。ただし Day 14
の中心テーマは Custom Hook
の分離なので、これは別の発展ポイントとして覚えておけばよい。

---

## 19. Day 14 完了チェックリスト

- [x] UI と React ロジックを区別できる。
- [x] UI ロジック / React ロジック / ビジネスロジックの違いを学んだ。
- [x] 通常の関数と Custom Hook の違いを理解した。
- [x] `useOrders` Custom Hook を作成した。
- [x] `orders` state を `useOrders` に移動した。
- [x] 注文ステータス更新ロジックを `updateOrderStatus` に移動した。
- [x] Hook から `orders` を返した。
- [x] Hook から `updateOrderStatus` を返した。
- [x] `AdminOrdersPage` で戻り値を分割代入した。
- [x] `OrderCard` の Callback Props と `updateOrderStatus`
      を接続した。
- [x] `setOrders` を隠すこととカプセル化の関係を学んだ。
- [x] `setOrders` を呼んだ後、現在のレンダリングの state
      がすぐに変わらない理由を学んだ。
- [x] state 更新と再レンダリングの流れを学んだ。
- [x] ロジック分離とファイル分離の違いを理解した。
- [x] `OrderCard`、`OrderItemList`、`useOrders`
      を責務ごとにファイル分離した。
- [x] 注文関連の型を別の型ファイルで管理した。
- [x] 自動 import によって間違った型を参照した TypeScript
      エラーをデバッグした。
- [x] 既存の注文一覧とステータス変更の動作を維持した。

---

## 20. 今日の核心文

> **Custom Hook は単にコードを短くするための道具ではない。React state
> とその state
> に関連するロジックを一つの責務として分離し、コンポーネントに必要な値と機能だけを公開するための構造である。**

今日書いたコードでは、次の一行がその構造を最もよく表している。

```tsx
const { orders, updateOrderStatus } = useOrders();
```

`AdminOrdersPage` は、注文 state
が内部でどのように保存・更新されるのかを知る必要がなくなった。

ページは `orders`
を受け取って画面を描画し、ステータスを変更する必要があるときに
`updateOrderStatus` を使えばよい。

---

## 21. Day 14 以降に覚えておくデバッグ / 設計基準

```text
画面を描画するか？
→ UI / Component

React state を保存または更新するか？
→ React ロジック / Custom Hook の候補

React がなくても存在するサービス・ドメインのルールか？
→ ビジネスロジックの候補

Hook 内部の何を外部で使えるようにするか？
→ return で公開する

外部から直接触る必要のない実装詳細か？
→ Hook 内部に隠す

ファイル分離後に不自然な型エラーが出たか？
→ import と実際の型定義の場所を確認する

リファクタリング後にエラーがないか？
→ 実際の UI の動作まで再テストする
```

**ヒント**

Day 15
以降、コードが複雑になってもこの基準を繰り返し使う。最初からすべてのコードを完璧に分類することが目標ではない。重要なのは、**コードが大きくなったときに責務の境界を見つけ、改善できる力を身につけること**である。
