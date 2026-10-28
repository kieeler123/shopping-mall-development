"use client";

import { products } from "@/data/products";
import { Order } from "@/types/order";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStorage } from "@/hooks/useCartStorage";

export default function CheckoutPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const cart = useCartStorage();

  const totalPrice = cart.reduce((total, item) => {
    const product = products.find((product) => product.id === item.productId);

    if (!product) {
      return total;
    }

    return total + product.salePrice * item.quantity;
  }, 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }

    const orderItems: Order["items"] = [];

    for (const item of cart) {
      const product = products.find((product) => product.id === item.productId);

      if (!product) {
        alert("상품 정보를 찾을 수 없습니다.");
        return;
      }

      orderItems.push({
        productId: item.productId,
        name: product.name,
        price: product.salePrice,
        quantity: item.quantity,
      });
    }

    const order: Order = {
      id: Date.now(),
      name,
      phone,
      address,
      items: orderItems,
      totalPrice: orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
      createdAt: new Date().toISOString(),
      status: "결제완료",
    };

    const savedOrders = localStorage.getItem("orders");

    const parsedOrders: Order[] = savedOrders ? JSON.parse(savedOrders) : [];

    const updatedOrders: Order[] = [...parsedOrders, order];

    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    window.dispatchEvent(new Event("orders-updated"));

    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cart-updated"));

    router.push("/order-complete");
  };

  return (
    <main>
      <h1>주문서</h1>

      <ul>
        {cart.map((item) => {
          const product = products.find(
            (product) => product.id === item.productId,
          );

          if (!product) return null;

          return (
            <li key={item.productId}>
              <h2>{product.name}</h2>
              <p>가격: {product.salePrice}원</p>
              <p>수량: {item.quantity}</p>
              <p>소계: {product.salePrice * item.quantity}원</p>
            </li>
          );
        })}
      </ul>

      <p>총 주문금액: {totalPrice}원</p>

      <form onSubmit={handleSubmit}>
        <h2>배송 정보</h2>

        <label>
          이름
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          전화번호
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>

        <label>
          주소
          <input value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>

        <button type="submit">주문하기</button>
      </form>
    </main>
  );
}
