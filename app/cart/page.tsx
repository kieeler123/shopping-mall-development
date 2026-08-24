"use client";

import { useEffect, useState } from "react";
import { products } from "@/data/products";
import type { CartItem } from "@/types/cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (!savedCart) {
      return;
    }

    const parsedCart: CartItem[] = JSON.parse(savedCart);

    setCart(parsedCart);
  }, []);

  if (cart.length === 0) {
    return (
      <main>
        <h1>장바구니</h1>
        <p>장바구니가 비어 있습니다.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>장바구니</h1>

      <ul>
        {cart.map((item) => {
          const product = products.find(
            (product) => product.id === item.productId,
          );

          if (!product) {
            return null;
          }

          return (
            <li key={item.productId}>
              <h2>{product.name}</h2>
              <p>수량: {item.quantity}</p>
              <p>가격: {product.salePrice.toLocaleString()}원</p>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
