# Day 26 — Propsと親子コンポーネントのデータフロー

Day 21〜25：データはどう流れる？ Day 26：その流れを使うコードをどう構造化する？

## 学習目標

親子コンポーネント、データProps、関数Props、子のイベント、Stateの所有者、TypeScriptのProps型

## 学習スケジュール

親子関係15分; データProps20分; 関数Props20分; イベントとState20分; リファクタリング25分; 復習15分

## 重要な原理

```text
Parent (OrdersPage)
  | order + onStatusChange (props)
  v
Child (OrderCard)
  | user click -> callback(order.id)
  v
Parent updates State -> React re-renders -> new props
```

`order`は表示用データ。`onStatusChange`は子が親にState変更を依頼するコールバック。Propsは親から子へ流れ、State更新は親が担当する。

## OrderCard.tsx

```tsx
type Order = { id: number; productName: string; status: "PAID" | "CANCELLED" };
type OrderCardProps = {
  order: Order;
  onStatusChange: (orderId: number) => void;
};
function OrderCard({ order, onStatusChange }: OrderCardProps) {
  return <article>
    <h3>{order.productName}</h3>
    <p>{order.status}</p>
    <button disabled={order.status === "CANCELLED"}
      onClick={() => onStatusChange(order.id)}>Cancel</button>
  </article>;
}
```

## OrdersPage.tsx

```tsx
function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    { id: 101, productName: "Keyboard", status: "PAID" },
    { id: 102, productName: "Mouse", status: "PAID" }
  ]);
  function updateOrderStatus(orderId: number) {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: "CANCELLED" } : order
    ));
  }
  return <section>{orders.map(order =>
    <OrderCard key={order.id} order={order}
      onStatusChange={updateOrderStatus} />
  )}</section>;
}
```

> This is a local-State demonstration. A real cancellation requires a server-side POST request, authorization checks, error handling, and refetching authoritative order data.

## 実習課題

OrderCardを分離; Propsの型定義; 親で注文配列をmap; ボタンからコールバックを呼ぶ; 親のStateを更新; キャンセル済みボタンを無効化

## 確認問題

Propsはどの方向に流れる？; 子は親のState変更をどう依頼する？; レンダリング中にハンドラを直接呼ぶとどうなる？

## 解答

親から子へ; 親が渡したコールバックを呼ぶ; レンダリング中に実行されてしまう

## ヒント

まずローカルStateでPropsの流れを確認し、次にDay 25のキャンセルPOST APIと接続しよう。

## Next

Day 27: Lifting State Up · Day 28: Reusable Components · Day 29: Custom Hooks
