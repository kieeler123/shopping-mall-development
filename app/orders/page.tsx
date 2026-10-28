"use client";

import type { Order } from "@/types/order";
import { useOrdersStorage } from "@/hooks/useOrdersStorage";
import Link from "next/link";

export default function OrdersPage() {
  const { orders, isReady } = useOrdersStorage();

  if (!isReady) {
    return (
      <main>
        <h1>주문 내역</h1>
        <p>주문 내역을 확인하는 중입니다.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>주문 내역</h1>

      {orders.length === 0 ? (
        <p>주문 내역이 없습니다.</p>
      ) : (
        [...orders].reverse().map((order: Order) => (
          <section key={order.id}>
            <p>주문번호: {order.id}</p>
            <p>이름: {order.name}</p>
            <p>전화번호: {order.phone}</p>
            <p>주소: {order.address}</p>
            <p>총 주문금액: {order.totalPrice.toLocaleString()}원</p>
            <p>주문시간: {new Date(order.createdAt).toLocaleString("ko-KR")}</p>

            <Link href={`/orders/${order.id}`}>상세보기</Link>

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
        ))
      )}
    </main>
  );
}
