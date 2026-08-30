"use client";

import { products } from "@/data/products";
import { Order } from "@/types/order";
import { useEffect, useState } from "react";

export default function OrderCompletePage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");

    if (!savedOrders) {
      return;
    }

    const parsedOrders: Order[] = JSON.parse(savedOrders);

    const lastOrder = parsedOrders[parsedOrders.length - 1];

    setOrder(lastOrder);
  }, []);

  return (
    <main>
      <h1>주문 완료</h1>

      {order && (
        <section>
          <p>주문번호: {order.id}</p>
          <p>이름: {order.name}</p>
          <p>전화번호: {order.phone}</p>
          <p>주소: {order.address}</p>
          <p>총 주문금액: {order.totalPrice}원</p>
          <p>주문시간: {new Date(order.createdAt).toLocaleString("ko-KR")}</p>

          <h2>주문 상품</h2>

          <ul>
            {order.items.map((item) => {
              const product = products.find(
                (product) => product.id === item.productId,
              );

              if (!product) return null;

              return (
                <li key={item.productId}>
                  <p>상품명: {product.name}</p>
                  <p>가격: {product.salePrice}원</p>
                  <p>수량: {item.quantity}</p>
                  <p>소계: {product.salePrice * item.quantity}원</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}
