"use client";

import { products } from "@/data/products";
import { Order } from "@/types/order";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");

    if (savedOrders) {
      const parsedOrders: Order[] = JSON.parse(savedOrders);

      setOrders(parsedOrders);
    }

    setLoading(false);
  }, []);
  if (loading) {
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
        [...orders].reverse().map((order) => (
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
              {order.items.map((item) => {
                const product = products.find(
                  (product) => product.id === item.productId,
                );

                if (!product) return null;

                return (
                  <li key={item.productId}>
                    <p>상품명: {product.name}</p>
                    <p>가격: {product.salePrice.toLocaleString()}원</p>
                    <p>수량: {item.quantity}</p>
                    <p>
                      소계:{" "}
                      {(product.salePrice * item.quantity).toLocaleString()}원
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </main>
  );
}
