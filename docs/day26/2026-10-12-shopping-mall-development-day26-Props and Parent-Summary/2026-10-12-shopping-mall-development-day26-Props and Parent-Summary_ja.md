# Day 26 --- Propsと親子コンポーネントのデータフロー

React +
TypeScriptの基礎を、既存のNext.js管理者向け注文プロジェクトに結び付けた復習ノートです。

> **学習範囲:** ローカルStateの演習と実際の管理画面を区別します。

## 1. 学習目標

親子コンポーネント、データProps、コールバックProps、イベント、Stateの所有者、TypeScriptの型を理解する。

## 2. 基本原理

親が`order`と`onStatusChange`を渡す → 子がクリック時にコールバックを呼ぶ
→ 親が`setOrders`で新しい配列を作る → Reactが再レンダリングする →
新しいPropsが子に渡る。

## 3. TypeScriptのProps型

`Order`は注文データの形を定義し、`OrderCardProps`は子が受け取るPropsの契約を定義する。ユニオン型で`status`の値を制限できる。

## 4. データPropsと関数Props

`order`は表示用データ、`onStatusChange`は子から親へ変更を依頼する関数。`onClick={() => onStatusChange(order.id)}`ならクリック時に呼び出される。

### OrderCard.tsx

``` tsx
type Order = {
  id: number;
  productName: string;
  price: number;
  status: "PAID" | "CANCELLED";
};

type OrderCardProps = {
  order: Order;
  onStatusChange: (id: number) => void;
};

function OrderCard({ order, onStatusChange }: OrderCardProps) {
  return (
    <article>
      <h3>{order.productName}</h3>
      <p>{order.price}</p>
      <p>{order.status}</p>
      <button
        disabled={order.status === "CANCELLED"}
        onClick={() => onStatusChange(order.id)}
      >
        Cancel
      </button>
    </article>
  );
}
```

## 5. 親のStateとイミュータブルな更新

`setOrders(prev => prev.map(...))`は新しい配列を作り、対象の注文だけ新しいオブジェクトに置き換える。`...order`でほかの項目を保持し、対象外は元の`order`を返す。

### Parent update example

``` tsx
function handleCancel(id: number) {
  setOrders((prev) =>
    prev.map((order) =>
      order.id === id
        ? { ...order, status: "CANCELLED" }
        : order
    )
  );
}

// In the parent's JSX:
{orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
    onStatusChange={handleCancel}
  />
))}
```

## 6. イベントとdisabled

`disabled={order.status === 'CANCELLED'}`でキャンセル済みのボタンを無効化できる。実際の管理画面ではボタンではなく`select`の`onChange`を使う。

## 7. Next.jsプロジェクトとの対応

実際の`AdminOrdersPage`は`useOrders()`から`orders`、`isLoading`、`error`、`updateOrderStatus`を取得し、`OrderCard`に`order={order}`と`onStatusChange={updateOrderStatus}`を渡す。子は`onStatusChange(order.id, e.target.value as OrderStatus)`を呼ぶ。顧客向け注文履歴ページは別に維持する。

``` tsx
const { orders, isLoading, error, updateOrderStatus } = useOrders();

{orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
    onStatusChange={updateOrderStatus}
  />
) )}
```

## 8. 注意点

Next.js App
Routerで`useState`、`useEffect`、ブラウザーイベントを使う場合は適切なClient
Component境界が必要。`as OrderStatus`は実行時検証ではない。ローカルStateの変更はサーバーでの注文キャンセルではなく、権限確認・リクエスト・エラー処理・同期が必要。`useOrders`の内部実装は未提示のため保存方法は断定できない。
