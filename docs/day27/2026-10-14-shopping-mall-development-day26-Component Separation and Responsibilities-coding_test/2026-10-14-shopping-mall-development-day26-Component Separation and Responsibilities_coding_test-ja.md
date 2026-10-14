# Day 28 — Custom Hook コーディングテスト15問

> 復習3問・応用変形3問・新規基礎4問・実践応用3問・エラー修正2問

解答は含みません。実際の `useOrders` 実装に合わせて検証してください。

## 01. Props 型の復習

**Review · 2 points**

**課題:** 親から渡された `order` と `onStatusChange` を分割代入し、型付きの `OrderCard` 関数シグネチャを書いてください。

**ヒント:** `Order` と `OrderStatus` を使用。

**コード・説明記入欄:**

```tsx
// TODO
```

<details>
<summary>解答と解説を表示</summary>

```tsx
type Props = {
  order: Order;
  onStatusChange: (id: number, status: OrderStatus) => void;
};
function OrderCard({ order, onStatusChange }: Props) {
  return <div>{order.id}</div>;
}
```

**解説:** 分割代入した引数の後に `: Props` を付けます。関数本体は例です。

</details>

---

## 02. 一覧描画の復習

**Review · 2 points**

**課題:** `orders.map()` で `OrderCard` の一覧を描画してください。

**ヒント:** `key`、`order`、`onStatusChange` を渡す。

**コード・説明記入欄:**

```tsx
// TODO
```

<details>
<summary>解答と解説を表示</summary>

```tsx
{orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
    onStatusChange={updateOrderStatus}
  />
))}
```

**解説:** `key` は各要素を識別し、コールバックは実行せずに渡します。

</details>

---

## 03. 商品一覧の復習

**Review · 2 points**

**課題:** `items.map()` で商品名・数量・価格を表示してください。

**ヒント:** `key` と `toLocaleString()` を使う。

**コード・説明記入欄:**

```tsx
// TODO
```

<details>
<summary>解答と解説を表示</summary>

```tsx
{items.map((item) => (
  <div key={item.id}>
    {item.name} · {item.quantity}개 · {item.price.toLocaleString()}원
  </div>
))}
```

**解説:** 各商品に一意の `id` と `price` がある想定です。実際の型に合わせて調整してください。

</details>

---

## 04. 状態の型指定

**Variation · 2 points**

**課題:** 初期値 `[]` の `Order[]` 状態を宣言してください。

**ヒント:** `useState<Order[]>([])` を参考に。

**コード・説明記入欄:**

```tsx
// TODO
```

<details>
<summary>解答と解説を表示</summary>

```tsx
const [orders, setOrders] = useState<Order[]>([]);
```

**解説:** ジェネリクスで配列要素の型を指定します。

</details>

---

## 05. 読み込み状態

**Variation · 2 points**

**課題:** 初期値 `true` の `isLoading` と setter を宣言してください。

**ヒント:** boolean 型を指定。

**コード・説明記入欄:**

```tsx
// TODO
```

<details>
<summary>解答と解説を表示</summary>

```tsx
const [isLoading, setIsLoading] = useState<boolean>(true);
```

**解説:** この例では読み込み中の初期値を `true` にします。

</details>

---

## 06. エラー状態

**Variation · 2 points**

**課題:** 文字列または `null` を保持する `error` 状態を宣言してください。

**ヒント:** ユニオン型を使う。

**コード・説明記入欄:**

```tsx
// TODO
```

<details>
<summary>解答と解説を表示</summary>

```tsx
const [error, setError] = useState<string | null>(null);
```

**解説:** ユニオン型でエラー文とエラーなしを表現します。

</details>

---

## 07. Hook の戻り値

**Basics · 2 points**

**課題:** `useOrders()` の4つの戻り値を分割代入してください。

**ヒント:** `orders`、`isLoading`、`error`、`updateOrderStatus`。

**コード・説明記入欄:**

```tsx
// TODO
```

<details>
<summary>解答と解説を表示</summary>

```tsx
const {
  orders,
  isLoading,
  error,
  updateOrderStatus,
} = useOrders();
```

**解説:** オブジェクトの分割代入で Hook の戻り値を受け取ります。

</details>

---

## 08. 読み込み UI

**Basics · 2 points**

**課題:** 読み込み中だけ案内文を描画してください。

**ヒント:** 条件付き JSX。

**コード・説明記入欄:**

```tsx
// TODO
```

<details>
<summary>解答と解説を表示</summary>

```tsx
{isLoading && <p>주문을 불러오는 중입니다.</p>}
```

**解説:** `isLoading` が true のときだけ表示します。

</details>

---

## 09. 空一覧 UI

**Basics · 2 points**

**課題:** 読み込み中でもエラーでもなく、注文が0件のときだけ表示してください。

**ヒント:** 3条件を確認。

**コード・説明記入欄:**

```tsx
// TODO
```

<details>
<summary>解答と解説を表示</summary>

```tsx
{!isLoading && !error && orders.length === 0 && <p>주문이 없습니다.</p>}
```

**解説:** 3条件を確認し、読み込み中の空表示を防ぎます。

</details>

---

## 10. Effect の基本

**Basics · 2 points**

**課題:** マウント時に `loadOrders` を呼び出す Effect を書いてください。

**ヒント:** 依存配列と関数参照の安定性を説明。

**コード・説明記入欄:**

```tsx
// TODO
```

<details>
<summary>解答と解説を表示</summary>

```tsx
useEffect(() => {
  // Assume loadOrders is defined inside this Effect or stable.
  void loadOrders();
}, [loadOrders]);
```

**解説:** `loadOrders` が毎回再生成される場合は `useCallback` で安定化するか Effect 内で定義します。依存関係の警告は無視しません。

</details>

---

## 11. fetch の応答確認

**Application · 4 points**

**課題:** `fetch('/api/orders')` の応答が失敗なら例外を投げる非同期関数を書いてください。

**ヒント:** `response.ok` を確認。

**コード・説明記入欄:**

```tsx
// TODO
```

<details>
<summary>解答と解説を表示</summary>

```tsx
async function fetchOrders(): Promise<Order[]> {
  const response = await fetch("/api/orders");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return (await response.json()) as Order[];
}
```

**解説:** API が `Order[]` を直接返す想定です。実行時の検証は別途必要です。

</details>

---

## 12. Hook の責務

**Application · 4 points**

**課題:** `AdminOrdersPage` の fetch 処理を `useOrders` に移す最小設計を擬似コードで示してください。

**ヒント:** UI とデータ処理を分離。

**コード・説明記入欄:**

```tsx
// TODO
```

<details>
<summary>解答と解説を表示</summary>

```tsx
// useOrders: owns fetching and state
function useOrders() {
  // state + Effect + fetch + update logic
  return { orders, isLoading, error, updateOrderStatus };
}
// AdminOrdersPage: calls Hook and renders JSX
```

**解説:** 実行可能なコードではなく設計用の擬似コードです。通信は Hook、表示はページに置きます。

</details>

---

## 13. 状態変更コールバック

**Application · 4 points**

**課題:** select の変更時に `onStatusChange(order.id, status)` を呼ぶコードを書いてください。

**ヒント:** `OrderStatus` を使用。

**コード・説明記入欄:**

```tsx
// TODO
```

<details>
<summary>解答と解説を表示</summary>

```tsx
<select
  value={order.status}
  onChange={(e) =>
    onStatusChange(order.id, e.target.value as OrderStatus)
  }
>
  <option value="결제완료">결제완료</option>
  <option value="상품준비중">상품준비중</option>
  <option value="배송중">배송중</option>
  <option value="배송완료">배송완료</option>
</select>
```

**解説:** 選択肢の値が `OrderStatus` と一致する前提の型アサーションです。外部入力なら検証が必要です。

</details>

---

## 14. エラー修正

**Debugging · 4 points**

**課題:** 誤ったコードを修正: `function OrderCard({order: Order}) { return <p>{order.id}</p> }`

**ヒント:** 型注釈と分割代入を区別。

**コード・説明記入欄:**

```tsx
// TODO
```

<details>
<summary>解答と解説を表示</summary>

```tsx
function OrderCard({ order }: { order: Order }) {
  return <p>{order.id}</p>;
}
```

**解説:** `{ order: Order }` は型指定ではなく変数名の変更です。型は引数の分割代入の後に書きます。

</details>

---

## 15. 実践フロー

**Debugging · 4 points**

**課題:** 状態選択から `updateOrderStatus`、API/状態反映、再描画までを擬似コードで表現してください。

**ヒント:** 未確認の実装は仮定と明記。

**コード・説明記入欄:**

```tsx
// TODO
```

<details>
<summary>解答と解説を表示</summary>

```tsx
// 1. User selects a status in OrderCard.
// 2. onStatusChange(order.id, selectedStatus) runs.
// 3. AdminOrdersPage passes through updateOrderStatus.
// 4. useOrders updates via API and/or local state.
// 5. State change triggers React re-render.
// Exact request/optimistic-update order depends on implementation.
```

**解説:** API 成功後の更新か楽観的更新かは実際の Hook を確認するまで断定できません。

</details>

---

## 採点の目安

構文・型の正確さ、責務の分離、既存動作の維持を評価します。
