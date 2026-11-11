# Day 27 — コンポーネントの分割と責務：総まとめ

## 今日の結論
**コンポーネントは小さくするためではなく、責務を明確にするために分割する。** 今回の管理者向け注文画面は、すでに適切に分割されているため、必須のリファクタリングはない。

## 現在の構成
```text
AdminOrdersPage
└── OrderCard（注文ごと）
    └── OrderItemList（その注文の商品一覧）

useOrders：注文データと更新関数を提供
```

| 場所 | 担当すること | 担当しないこと |
|---|---|---|
| AdminOrdersPage | レイアウト、読み込み・エラー・空状態、orders.map、フックの接続 | 注文カードの詳細表示 |
| OrderCard | 1件の注文情報、状態変更select、商品一覧の接続、合計金額 | 全注文の管理、データ更新の実装 |
| OrderItemList | items.map、商品名・数量・価格の表示 | 注文状態の変更 |
| useOrders | 注文データとupdateOrderStatusの提供 | HTMLとデザイン |

## データとイベントの流れ
```tsx
const { orders, isLoading, error, updateOrderStatus } = useOrders();

{orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
    onStatusChange={updateOrderStatus}
  />
))}
```
`OrderCard` は `onStatusChange(order.id, status)` を呼び出す。実際のデータ更新処理は `useOrders` 側に残す。

## 分割を判断する4つの基準
1. **意味**：独立した名前を付けられるUIか。
2. **重複**：同じJSXが複数箇所にあるか。
3. **変更理由**：他の部分と独立して変更されそうか。
4. **Props境界**：必要なデータとイベントを簡潔に渡せるか。

`OrderCustomerInfo` は分割候補だが、現時点では必須ではない。`OrderItemList` を重複して作らない。

## Propsの分割代入と型
**誤り**：
```tsx
function UserCard({ name: string, age: number }) {}
```
これは型注釈ではなく、変数名を `string` と `number` に変更する構文。

**正解**：
```tsx
function UserCard({
  name,
  age,
}: {
  name: string;
  age: number;
}) {
  return <div>{name} — {age}</div>;
}
```

コールバックも同じ原則：
```tsx
function OrderStatusButton({
  orderId,
  onStatusChange,
}: {
  orderId: number;
  onStatusChange: (id: number, status: OrderStatus) => void;
}) {
  return <button onClick={() => onStatusChange(orderId, "배송중")}>発送開始</button>;
}
```
※ `OrderStatus` は `@/types/order` からインポートする。状態値は既存プロジェクトの韓国語リテラルを維持する。

## JSXのmap構文
```tsx
{items.map((item) => {
  return (
    <div key={item.id}>
      <p>{item.name}</p>
      <p>数量：{item.quantity}</p>
      <p>{item.price.toLocaleString()}원</p>
    </div>
  );
})}
```
閉じる順序は `}`（関数本体）→ `)`（map呼び出し）→ `}`（JSX式）。

## 実際に確認した小さな改善点
`OrderCard` にある `space-y-3` の外側ラッパーは、子要素が `OrderItemList` 1つだけなら余分。商品の間隔は `OrderItemList` 内で管理できる。削除は任意。

## 検証
- `npm run lint`
- `npx tsc --noEmit`（プロジェクトの設定に合わせる）
- 注文一覧、読み込み・エラー・空状態、状態変更、商品表示を確認する。

**ヒント：** 変更の前に「このコードは画面全体、注文1件、商品一覧、データ操作のどれを担当するか」と問いかけよう。
