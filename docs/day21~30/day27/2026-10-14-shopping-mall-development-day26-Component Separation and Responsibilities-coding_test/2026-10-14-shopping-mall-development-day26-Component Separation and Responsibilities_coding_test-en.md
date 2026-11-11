# Day 28 — 15 Custom Hook Coding Challenges

> 3 reviews · 3 variations · 4 new basics · 3 practical applications · 2 debugging challenges

Answers are collapsed below each challenge. Solve first, then expand. Validate against your actual `useOrders` implementation.

## 01. Props typing review

**Review · 2 points**

**Task:** Write a typed `OrderCard` function signature destructuring `order` and `onStatusChange`.

**Hint:** Use `Order` and `OrderStatus`.

**Your code / explanation:**

```tsx
// TODO
```

<details>
<summary>Show answer and explanation</summary>

```tsx
type Props = {
  order: Order;
  onStatusChange: (id: number, status: OrderStatus) => void;
};
function OrderCard({ order, onStatusChange }: Props) {
  return <div>{order.id}</div>;
}
```

**Explanation:** Props type goes after the destructured parameter; the function body is illustrative.

</details>

---

## 02. List rendering review

**Review · 2 points**

**Task:** Render a list of `OrderCard` components using `orders.map()`.

**Hint:** Pass `key`, `order`, and `onStatusChange`.

**Your code / explanation:**

```tsx
// TODO
```

<details>
<summary>Show answer and explanation</summary>

```tsx
{orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
    onStatusChange={updateOrderStatus}
  />
))}
```

**Explanation:** The key identifies each list entry, and the callback is passed without invoking it.

</details>

---

## 03. Item list review

**Review · 2 points**

**Task:** Render each item's name, quantity, and price with `items.map()`.

**Hint:** Use `key` and `toLocaleString()`.

**Your code / explanation:**

```tsx
// TODO
```

<details>
<summary>Show answer and explanation</summary>

```tsx
{items.map((item) => (
  <div key={item.id}>
    {item.name} · {item.quantity}개 · {item.price.toLocaleString()}원
  </div>
))}
```

**Explanation:** Assumes each item has a unique id and price; adapt fields to the actual OrderItem type.

</details>

---

## 04. State typing variation

**Variation · 2 points**

**Task:** Declare an `Order[]` state initialized to `[]`.

**Hint:** Consider `useState<Order[]>([])`.

**Your code / explanation:**

```tsx
// TODO
```

<details>
<summary>Show answer and explanation</summary>

```tsx
const [orders, setOrders] = useState<Order[]>([]);
```

**Explanation:** The generic type defines the element type of the array.

</details>

---

## 05. Loading state variation

**Variation · 2 points**

**Task:** Declare `isLoading` and its setter, initially `true`.

**Hint:** Specify the boolean type.

**Your code / explanation:**

```tsx
// TODO
```

<details>
<summary>Show answer and explanation</summary>

```tsx
const [isLoading, setIsLoading] = useState<boolean>(true);
```

**Explanation:** Loading begins as true in this example.

</details>

---

## 06. Error state variation

**Variation · 2 points**

**Task:** Declare an `error` state holding a string or `null`.

**Hint:** Use a union type.

**Your code / explanation:**

```tsx
// TODO
```

<details>
<summary>Show answer and explanation</summary>

```tsx
const [error, setError] = useState<string | null>(null);
```

**Explanation:** A union type allows both an error message and no error.

</details>

---

## 07. Hook return values

**Basics · 2 points**

**Task:** Destructure the four values returned by `useOrders()`.

**Hint:** `orders`, `isLoading`, `error`, `updateOrderStatus`.

**Your code / explanation:**

```tsx
// TODO
```

<details>
<summary>Show answer and explanation</summary>

```tsx
const {
  orders,
  isLoading,
  error,
  updateOrderStatus,
} = useOrders();
```

**Explanation:** Object destructuring extracts the values returned by the Hook.

</details>

---

## 08. Loading UI

**Basics · 2 points**

**Task:** Render a message only while loading.

**Hint:** Use conditional JSX.

**Your code / explanation:**

```tsx
// TODO
```

<details>
<summary>Show answer and explanation</summary>

```tsx
{isLoading && <p>주문을 불러오는 중입니다.</p>}
```

**Explanation:** The message appears only when isLoading is truthy.

</details>

---

## 09. Empty-state UI

**Basics · 2 points**

**Task:** Show a message only when not loading, no error, and zero orders.

**Hint:** Check all three conditions.

**Your code / explanation:**

```tsx
// TODO
```

<details>
<summary>Show answer and explanation</summary>

```tsx
{!isLoading && !error && orders.length === 0 && <p>주문이 없습니다.</p>}
```

**Explanation:** Check all three conditions so the empty state does not flash during loading.

</details>

---

## 10. Effect basics

**Basics · 2 points**

**Task:** Write an Effect that calls `loadOrders` on mount.

**Hint:** Discuss dependencies and stable function references.

**Your code / explanation:**

```tsx
// TODO
```

<details>
<summary>Show answer and explanation</summary>

```tsx
useEffect(() => {
  // Assume loadOrders is defined inside this Effect or stable.
  void loadOrders();
}, [loadOrders]);
```

**Explanation:** If loadOrders is recreated every render, memoize it with useCallback or define the async function inside the Effect. Avoid suppressing dependency warnings.

</details>

---

## 11. Checking fetch responses

**Application · 4 points**

**Task:** Write an async function that throws on an unsuccessful `fetch('/api/orders')` response.

**Hint:** Check `response.ok`.

**Your code / explanation:**

```tsx
// TODO
```

<details>
<summary>Show answer and explanation</summary>

```tsx
async function fetchOrders(): Promise<Order[]> {
  const response = await fetch("/api/orders");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return (await response.json()) as Order[];
}
```

**Explanation:** This assumes the API returns Order[] directly. Runtime validation is a separate concern.

</details>

---

## 12. Hook responsibility

**Application · 4 points**

**Task:** Show minimal pseudocode for moving fetch logic from `AdminOrdersPage` into `useOrders`.

**Hint:** Separate UI from data operations.

**Your code / explanation:**

```tsx
// TODO
```

<details>
<summary>Show answer and explanation</summary>

```tsx
// useOrders: owns fetching and state
function useOrders() {
  // state + Effect + fetch + update logic
  return { orders, isLoading, error, updateOrderStatus };
}
// AdminOrdersPage: calls Hook and renders JSX
```

**Explanation:** This is architecture pseudocode, not executable implementation. Keep fetch logic in the Hook and presentation in the page.

</details>

---

## 13. Status change callback

**Application · 4 points**

**Task:** Write a select change handler calling `onStatusChange(order.id, status)`.

**Hint:** Use `OrderStatus`.

**Your code / explanation:**

```tsx
// TODO
```

<details>
<summary>Show answer and explanation</summary>

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

**Explanation:** The cast assumes option values match OrderStatus. A runtime check is preferable if values can be untrusted.

</details>

---

## 14. Fix a typing error

**Debugging · 4 points**

**Task:** Fix: `function OrderCard({order: Order}) { return <p>{order.id}</p> }`

**Hint:** Distinguish destructuring from type annotations.

**Your code / explanation:**

```tsx
// TODO
```

<details>
<summary>Show answer and explanation</summary>

```tsx
function OrderCard({ order }: { order: Order }) {
  return <p>{order.id}</p>;
}
```

**Explanation:** In `{ order: Order }`, Order would rename the local variable rather than declare a type. Put the annotation after the parameter pattern.

</details>

---

## 15. End-to-end flow

**Debugging · 4 points**

**Task:** Express the path from selecting a status through `updateOrderStatus`, API/state update, and rerender.

**Hint:** Label unverified implementation details as assumptions.

**Your code / explanation:**

```tsx
// TODO
```

<details>
<summary>Show answer and explanation</summary>

```tsx
// 1. User selects a status in OrderCard.
// 2. onStatusChange(order.id, selectedStatus) runs.
// 3. AdminOrdersPage passes through updateOrderStatus.
// 4. useOrders updates via API and/or local state.
// 5. State change triggers React re-render.
// Exact request/optimistic-update order depends on implementation.
```

**Explanation:** The API-first versus optimistic-update order cannot be determined without inspecting the real Hook.

</details>

---

## Suggested scoring

Assess syntax/types, separation of responsibilities, and preservation of behavior.
