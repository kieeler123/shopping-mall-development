"use client";

import { useEffect, useState } from "react";
import { fetchOrders, type Order } from "../../lib/orders";

import OrderSearch from "./OrderSearch";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchOrders();

        if (active) {
          setOrders(result);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "알 수 없는 오류가 발생했습니다.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [retry]);

  if (loading) {
    return <p>주문 목록을 불러오는 중...</p>;
  }

  if (error) {
    return (
      <div role="alert">
        <p>{error}</p>
        <button onClick={() => setRetry((n) => n + 1)}>다시 시도</button>
      </div>
    );
  }

  return (
    <div>
      <h1>주문 목록</h1>

      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.product} — {order.price.toLocaleString()}원
          </li>
        ))}
      </ul>
      <OrderSearch />
    </div>
  );
}
