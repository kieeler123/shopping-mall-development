"use client";

import { useState } from "react";
import { fetchOrderById, type Order } from "../../lib/orders";

export default function OrderSearch() {
  const [id, setId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const result = await fetchOrderById(id);
      setOrder(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>주문 ID 검색</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSearch();
        }}
      >
        <input
          value={id}
          onChange={(event) => setId(event.target.value)}
          placeholder="주문 ID 입력"
          aria-label="주문 ID"
        />

        <button type="submit" disabled={loading}>
          {loading ? "조회 중..." : "주문 조회"}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      {order && (
        <div>
          <p>주문 번호: {order.id}</p>
          <p>상품명: {order.product}</p>
          <p>가격: {order.price.toLocaleString()}원</p>
        </div>
      )}
    </section>
  );
}
