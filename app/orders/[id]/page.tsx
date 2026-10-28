"use client";

import { useOrdersStorage } from "@/hooks/useOrdersStorage";
import type { Order } from "@/types/order";
import { useParams, useRouter } from "next/navigation";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = Number(params.id);
  const { orders, isReady } = useOrdersStorage();

  const order = orders.find((item) => item.id === orderId);

  function handleCancelOrder() {
    if (!order || order.status === "취소완료") {
      return;
    }

    const confirmed = window.confirm("정말 이 주문을 취소하시겠습니까?");

    if (!confirmed) return;

    const updatedOrders: Order[] = orders.map((item) =>
      item.id === orderId ? { ...item, status: "취소완료" } : item,
    );

    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    window.dispatchEvent(new Event("orders-updated"));

    router.push("/orders");
  }

  if (!isReady) {
    return (
      <main>
        <h1>주문 상세</h1>
        <p>주문 정보를 확인하는 중입니다.</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main>
        <h1>주문 상세</h1>
        <p>해당 주문을 찾을 수 없습니다.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>주문 상세</h1>

      <section>
        <p>주문번호: {order.id}</p>
        <p>이름: {order.name}</p>
        <p>전화번호: {order.phone}</p>
        <p>주소: {order.address}</p>
        <p>총 주문금액: {order.totalPrice.toLocaleString()}원</p>
        <p>주문시간: {new Date(order.createdAt).toLocaleString("ko-KR")}</p>
        <p>주문상태: {order.status}</p>

        <button
          type="button"
          onClick={handleCancelOrder}
          disabled={order.status === "취소완료"}
        >
          주문 취소
        </button>

        <h2>주문 상품</h2>

        <ul>
          {order.items.map((item) => (
            <li key={item.productId}>
              <p>상품명: {item.name}</p>
              <p>가격: {item.price.toLocaleString()}원</p>
              <p>수량: {item.quantity}</p>
              <p>소계: {(item.price * item.quantity).toLocaleString()}원</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
