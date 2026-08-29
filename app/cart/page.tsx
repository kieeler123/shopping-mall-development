"use client";

import { useEffect, useState } from "react";
import { products } from "@/data/products";
import type { CartItem } from "@/types/cart";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      const parsedCart: CartItem[] = JSON.parse(savedCart);

      setCart(parsedCart);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, isLoaded]);

  const totalPrice = cart.reduce((total, item) => {
    const product = products.find((product) => product.id === item.productId);

    if (!product) {
      return total;
    }

    return total + product.salePrice * item.quantity;
  }, 0);

  const handleIncrease = (productId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.min(10, item.quantity + 1),
            }
          : item,
      ),
    );
  };

  const handleDecrease = (productId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity - 1),
            }
          : item,
      ),
    );
  };

  const handleRemove = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

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

              <div>
                <button onClick={() => handleDecrease(item.productId)}>
                  -
                </button>

                <span>{item.quantity}</span>

                <button onClick={() => handleIncrease(item.productId)}>
                  +
                </button>
              </div>

              <p>가격: {product.salePrice.toLocaleString()}원</p>

              <p>
                소계: {(product.salePrice * item.quantity).toLocaleString()}원
              </p>

              <button onClick={() => handleRemove(item.productId)}>삭제</button>
            </li>
          );
        })}
      </ul>
      <p>총액: {totalPrice.toLocaleString()}원</p>

      <Link href="/checkout">주문하기</Link>
    </main>
  );
}
