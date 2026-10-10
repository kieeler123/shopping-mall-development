# Day 21~25 종합 코딩 테스트 (한국어)

## 과제
React + TypeScript로 주문 조회 및 취소 기능을 완성하자. `TODO 1~8`을 채우고 로딩·오류·중복 클릭·요청 취소를 처리한다.

## Starter Code

```tsx
import { useEffect, useState } from "react";

type Order = {
  id: number;
  productName: string;
  status: "PAID" | "CANCELLED";
};

export default function OrdersPage({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders() {
      setLoading(true);
      setError(null);
      try {
        // TODO 1: GET orders using userId and controller.signal
        // TODO 2: check response.ok, parse JSON, update orders
      } catch (err) {
        // TODO 3: report errors only if not aborted
      } finally {
        // TODO 4: stop loading only if not aborted
      }
    }

    void loadOrders();
    // TODO 5: return cleanup
  }, [userId, refreshKey]);

  async function handleCancel(orderId: number) {
    // TODO 6: POST cancellation and check response.ok
    // TODO 7: increment refreshKey on success
    // TODO 8: prevent duplicate clicks and handle errors
  }

  return (
    <section>
      <h1>Orders</h1>
      {error && <p role="alert">{error}</p>}
      {loading ? <p>Loading...</p> : orders.length === 0 ? (
        <p>No orders.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              {order.productName} — {order.status}
              <button
                type="button"
                disabled={order.status === "CANCELLED" || cancellingId !== null}
                onClick={() => void handleCancel(order.id)}
              >
                {cancellingId === order.id ? "Cancelling..." : "Cancel"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

## 채점 기준 (총 100점)
- GET 요청과 `AbortController.signal` 연결: 20점
- `response.ok`와 JSON 파싱, `setOrders`: 20점
- `try/catch/finally` 및 취소된 요청의 State 갱신 방지: 20점
- Effect cleanup 구현: 10점
- 취소 POST와 `refreshKey` 갱신: 20점
- 중복 클릭 방지 및 오류 표시: 10점

## 모범 답안

```tsx
import { useEffect, useRef, useState } from "react";

type Order = {
  id: number;
  productName: string;
  status: "PAID" | "CANCELLED";
};

export default function OrdersPage({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const cancelLock = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/orders?userId=${encodeURIComponent(userId)}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data: Order[] = await response.json();
        if (!controller.signal.aborted) {
          setOrders(data);
          setLoadedUserId(userId);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadOrders();
    return () => controller.abort();
  }, [userId, refreshKey]);

  async function handleCancel(orderId: number) {
    if (cancelLock.current || loadedUserId !== userId || loading) return;
    cancelLock.current = true;
    setCancellingId(orderId);
    setCancelError(null);
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to cancel order");
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      cancelLock.current = false;
      setCancellingId(null);
    }
  }

  const showLoading = loading || loadedUserId !== userId;
  return (
    <section>
      <h1>Orders</h1>
      {cancelError && <p role="alert">{cancelError}</p>}
      {showLoading && !error ? (
        <p>Loading...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              {order.productName} — {order.status}
              <button
                type="button"
                disabled={order.status === "CANCELLED" || cancellingId !== null || loading}
                onClick={() => void handleCancel(order.id)}
              >
                {cancellingId === order.id ? "Cancelling..." : "Cancel"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

## 해설 및 주의사항
- `fetch`의 404/500은 자동으로 reject되지 않는다.
- `controller.abort()`는 서버의 주문 취소와 다른 기능이다.
- 사용자가 바뀔 때 이전 사용자 주문이 표시되지 않도록 로딩/소유자 상태를 확인한다.
- 예제 API는 가상 엔드포인트이며 백엔드 구현이 필요하다.
- 서버 측 인증·인가, 런타임 응답 검증, 취소 중 사용자 변경 시나리오는 실서비스에서 추가 보완한다.

**팁:** 먼저 모범 답안을 보지 않고 TODO를 완성한 뒤 비교해 보자.
