# Day 21〜25 総合コーディングテスト（日本語）

## 課題
React + TypeScriptで注文一覧取得とキャンセル機能を完成させよう。TODO 1〜8を埋め、読み込み・エラー・二重クリック・通信の後片付けに対応する。

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

## 採点基準（100点）
- GET通信とAbortControllerのsignal：20点
- response.ok・JSON解析・setOrders：20点
- try/catch/finallyと中断済み通信のState更新防止：20点
- Effectのcleanup：10点
- キャンセルPOSTとrefreshKey更新：20点
- 二重クリック防止とエラー表示：10点

## 模範解答

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

## 解説・注意点
- HTTP 404/500だけではfetchは自動的にrejectされない。
- GET通信の中断と注文自体のキャンセルは別物。
- ユーザー変更時に前のユーザーの注文を表示しないようにする。
- APIエンドポイントは例示であり、バックエンドが必要。
- 実務ではサーバー側の認可、レスポンスの実行時検証、キャンセル中のユーザー変更も考慮する。

**ヒント:** 模範解答を見る前にTODOを完成させよう。
