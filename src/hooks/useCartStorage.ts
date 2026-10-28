"use client";

import { useSyncExternalStore } from "react";
import type { CartItem } from "@/types/cart";

const EMPTY_CART: CartItem[] = [];
const SERVER_SNAPSHOT = "[]";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("cart-updated", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("cart-updated", callback);
  };
}

function getSnapshot() {
  return localStorage.getItem("cart") ?? "[]";
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function useCartStorage(): CartItem[] {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (snapshot === "[]") {
    return EMPTY_CART;
  }

  try {
    return JSON.parse(snapshot) as CartItem[];
  } catch {
    return EMPTY_CART;
  }
}
