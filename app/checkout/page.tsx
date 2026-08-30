"use client";

import { products } from "@/data/products";
import { CartItem } from "@/types/cart";
import { Order } from "@/types/order";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
    }
  }, []);

  const totalPrice = cart.reduce((total, item) => {
    const product = products.find((product) => product.id === item.productId);

    if (!product) {
      return total;
    }

    return total + product.salePrice * item.quantity;
  }, 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const order: Order = {
      id: Date.now(),
      name,
      phone,
      address,
      items: cart,
      totalPrice,
      createdAt: new Date().toISOString(),
    };

    const savedOrders = localStorage.getItem("orders");

    const parsedOrders: Order[] = savedOrders ? JSON.parse(savedOrders) : [];

    const updatedOrders: Order[] = [...parsedOrders, order];

    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    localStorage.removeItem("cart");
    setCart([]);

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
