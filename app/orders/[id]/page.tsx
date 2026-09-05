"use client";

import { products } from "@/data/products";
import { Order } from "@/types/order";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = Number(params.id);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  function handleCancelOrder() {
    const confirmed = window.confirm("정말 이 주문을 취소하시겠습니까?");

    if (!confirmed) return;

    const updatedOrders = orders.filter((order) => order.id !== orderId);

    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    setOrders(updatedOrders);

    router.push("/orders");
  }

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");

    if (savedOrders) {
      const parsedOrders: Order[] = JSON.parse(savedOrders);

      setOrders(parsedOrders);
    }

    setLoading(false);
  }, []);

  const order = orders.find((order) => order.id === orderId);

  if (loading) {
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

        <h2>주문 상품</h2>

        <button type="button" onClick={handleCancelOrder}>
          주문 취소
        </button>

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
                  소계: {(product.salePrice * item.quantity).toLocaleString()}원
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
