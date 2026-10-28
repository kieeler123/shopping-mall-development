"use client";

import { useOrdersStorage } from "@/hooks/useOrdersStorage";

export default function OrderCompletePage() {
  const { orders, isReady } = useOrdersStorage();

  const order = orders[orders.length - 1];

  if (!isReady) {
    return (
      <main>
        <h1>주문 완료</h1>
        <p>주문 정보를 확인하는 중입니다.</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main>
        <h1>주문 완료</h1>
        <p>주문 정보를 찾을 수 없습니다.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>주문 완료</h1>

      <section>
        <p>주문번호: {order.id}</p>
        <p>이름: {order.name}</p>
        <p>전화번호: {order.phone}</p>
        <p>주소: {order.address}</p>
        <p>총 주문금액: {order.totalPrice.toLocaleString()}원</p>
        <p>주문시간: {new Date(order.createdAt).toLocaleString("ko-KR")}</p>

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
