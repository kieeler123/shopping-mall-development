"use client";

import { useState } from "react";
import type { CartItem } from "@/types/cart";

type AddToCartProps = {
  productId: number;
};

export default function AddToCart({ productId }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    const savedCart = localStorage.getItem("cart");

    const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

    const existingItem = cart.find((item) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <div>
      <div>
        <button
          type="button"
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
        >
          -
        </button>

        <span>{quantity}</span>

        <button type="button" onClick={() => setQuantity((prev) => prev + 1)}>
          +
        </button>
      </div>

      <button type="button" onClick={handleAddToCart}>
        장바구니 담기
      </button>
    </div>
  );
}
