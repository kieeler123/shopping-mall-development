# Day 26 — 実践コーディングテスト (React · TypeScript · Next.js)

全15問 · 基礎5問 / 応用5問 / 実践5問。まず自分で実装してから解答を開いてください。解答は一例で、同等の実装も正解です。

> 注意: ローカルStateでのキャンセルはサーバー注文のキャンセルではありません。実際の変更にはAPI、権限確認、エラー処理、データ同期が必要です。

## 1. 基礎 — 1–5

**Tip:** Propsの型定義とJSXで表示する値を区別しましょう。

### 問題 1

`id`と`productName`、`price`、PAID/CANCELLEDの`status`を持つ`Order`型と、`order`を受け取る`OrderCardProps`型を定義してください。

<details>
<summary>解答コードと解説を見る</summary>

```tsx
type Order = { id: number; productName: string; price: number; status: "PAID" | "CANCELLED" };
type OrderCardProps = { order: Order };
```

データ構造とコンポーネントの契約を別々に定義します。

</details>

### 問題 2

`order`から商品名と価格を表示する`OrderCard`を作成してください。

<details>
<summary>解答コードと解説を見る</summary>

```tsx
function OrderCard({ order }: OrderCardProps) {
  return <article><h3>{order.productName}</h3><p>{order.price}</p></article>;
}
```

分割代入で受け取ったオブジェクトの値をJSXに表示します。

</details>

### 問題 3

注文IDを受け取り`void`を返す関数Propsを追加してください。

<details>
<summary>解答コードと解説を見る</summary>

```tsx
type OrderCardProps = {
  order: Order;
  onStatusChange: (id: number) => void;
};
```

コールバックの引数型と戻り値型を指定します。

</details>

### 問題 4

ボタンクリック時だけ現在の注文IDをコールバックに渡してください。

<details>
<summary>解答コードと解説を見る</summary>

```tsx
<button onClick={() => onStatusChange(order.id)}>Cancel</button>
```

アロー関数でクリック時まで実行を遅らせます。

</details>

### 問題 5

キャンセル済みの注文ではCancelボタンを無効にしてください。

<details>
<summary>解答コードと解説を見る</summary>

```tsx
<button disabled={order.status === "CANCELLED"} onClick={() => onStatusChange(order.id)}>Cancel</button>
```

比較結果がtrueならボタンが無効になります。

</details>

## 2. 応用 — 6–10

**Tip:** 配列をイミュータブルに更新し、関数は実行せず参照を渡しましょう。

### 問題 6

注文ごとに`OrderCard`を描画し、安定したkeyとコールバックを渡してください。

<details>
<summary>解答コードと解説を見る</summary>

```tsx
{orders.map((order) => (
  <OrderCard key={order.id} order={order} onStatusChange={handleCancel} />
))}
```

mapで注文ごとにコンポーネントを生成しkeyを指定します。

</details>

### 問題 7

Stateを直接変更せず、一致する注文だけCANCELLEDに更新してください。

<details>
<summary>解答コードと解説を見る</summary>

```tsx
function handleCancel(id: number) {
  setOrders((prev) =>
    prev.map((order) =>
      order.id === id ? { ...order, status: "CANCELLED" } : order
    )
  );
}
```

mapとスプレッド構文でStateを直接変更しません。

</details>

### 問題 8

`orders`配列からキャンセル済み件数を算出してください。

<details>
<summary>解答コードと解説を見る</summary>

```tsx
const cancelledCount = orders.filter((order) => order.status === "CANCELLED").length;
```

Stateから算出できる件数は別のStateにする必要はありません。

</details>

### 問題 9

管理画面の`OrderCard`で、選択した状態と注文IDをコールバックで渡してください。`OrderStatus`には選択肢の値が含まれるものとします。

<details>
<summary>解答コードと解説を見る</summary>

```tsx
<select
  value={order.status}
  onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
>
  <option value="결제완료">결제완료</option>
  <option value="배송중">배송중</option>
</select>
```

変更イベントで注文IDと選択値を渡します。型アサーションは実行時検証ではありません。

</details>

### 問題 10

`useOrders()`の`updateOrderStatus`を子の`onStatusChange`に渡してください。

<details>
<summary>解答コードと解説を見る</summary>

```tsx
<OrderCard
  key={order.id}
  order={order}
  onStatusChange={updateOrderStatus}
/>
```

親の関数参照を子のPropsに渡します。

</details>

## 3. 実践 — 11–15

**Tip:** 管理画面の構成とClient Componentの境界を確認しましょう。

### 問題 11

`@/types/order`から`Order`型を型専用importで読み込んでください。

<details>
<summary>解答コードと解説を見る</summary>

```tsx
import type { Order } from "@/types/order";
```

型専用importと実行時の値のimportを区別します。

</details>

### 問題 12

一覧表示の前に、読み込み中・エラー・空の状態を順に処理してください。

<details>
<summary>解答コードと解説を見る</summary>

```tsx
if (isLoading) return <p>Loading orders...</p>;
if (error) return <p role="alert">{error}</p>;
if (orders.length === 0) return <p>No orders found.</p>;
```

一覧の前に状態メッセージを表示します。

</details>

### 問題 13

管理画面でカードのJSXを重複させず、既存の`OrderCard`に注文を渡してください。importと読み込み・エラー処理は既にあるものとします。

<details>
<summary>解答コードと解説を見る</summary>

```tsx
function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrders();
  return (
    <main>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onStatusChange={updateOrderStatus}
        />
      ))}
    </main>
  );
}
```

ページは一覧を管理し、カードは各注文の表示を担当します。

</details>

### 問題 14

すでにキャンセル済みの注文は`handleCancel`で変更しないようにしてください。

<details>
<summary>解答コードと解説を見る</summary>

```tsx
function handleCancel(id: number) {
  setOrders((prev) =>
    prev.map((order) =>
      order.id === id && order.status !== "CANCELLED"
        ? { ...order, status: "CANCELLED" }
        : order
    )
  );
}
```

すでにキャンセル済みの注文は更新しません。UIの無効化と併用します。

</details>

### 問題 15

`useState`とクリックイベントを使う最小限のNext.js App Router Client Componentを作成してください。

<details>
<summary>解答コードと解説を見る</summary>

```tsx
"use client";

import { useState } from "react";

export default function AdminOrdersPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  return <button onClick={() => setSelectedId(101)}>{selectedId ?? "Select"}</button>;
}
```

Stateとイベントを使うファイルには適切なClient Component境界が必要です。

</details>
