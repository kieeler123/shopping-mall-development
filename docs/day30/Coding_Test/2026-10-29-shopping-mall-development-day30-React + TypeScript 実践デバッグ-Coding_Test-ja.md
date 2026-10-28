# 코딩테스트 — 2026-10-29

1. 商品のprice × quantityの合計を求める。
2. 元の配列を変更せず指定IDの注文をキャンセルする。
3. 空配列ならnull、それ以外なら最後の注文を返す。

## 解答例

```ts
type Item = { price: number; quantity: number };
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

type Order = { id: number; status: "결제완료" | "취소완료" };
function cancelOrder(orders: Order[], targetId: number): Order[] {
  return orders.map(order => order.id === targetId
    ? { ...order, status: "취소완료" } : order);
}

function getLastOrder<T>(orders: T[]): T | null {
  return orders[orders.length - 1] ?? null;
}
```

**팁:** 빈 배열과 없는 ID도 테스트하자.
