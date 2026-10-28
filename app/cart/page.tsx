"use client";

import { useCartStorage } from "@/hooks/useCartStorage";
import { products } from "@/data/products";
import type { CartItem } from "@/types/cart";
import Link from "next/link";

export default function CartPage() {
  const cart = useCartStorage();

  const totalPrice = cart.reduce((total, item) => {
    const product = products.find((product) => product.id === item.productId);

    if (!product) {
      return total;
    }

    return total + product.salePrice * item.quantity;
  }, 0);

  const updateCart = (updatedCart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleIncrease = (productId: number) => {
    const updatedCart = cart.map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.min(10, item.quantity + 1) }
        : item,
    );

    updateCart(updatedCart);
  };

  const handleDecrease = (productId: number) => {
    const updatedCart = cart.map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item,
    );

    updateCart(updatedCart);
  };

  const handleRemove = (productId: number) => {
    const updatedCart = cart.filter((item) => item.productId !== productId);

    updateCart(updatedCart);
  };

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
