# 코딩테스트 — 2026-10-29

1. `calculateTotal`: 상품별 price × quantity의 합계를 반환하시오.
2. `cancelOrder`: 기존 배열을 변경하지 않고 해당 ID의 상태를 취소완료로 바꾸시오.
3. `getLastOrder`: 빈 배열이면 null, 아니면 마지막 요소를 반환하시오.

## 모범답안

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
