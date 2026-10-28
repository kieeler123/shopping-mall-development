"use client";

import { useSyncExternalStore } from "react";
import type { Order } from "@/types/order";

const EMPTY_ORDERS: Order[] = [];
const EMPTY_SNAPSHOT = "[]";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("orders-updated", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("orders-updated", callback);
  };
}

function getSnapshot() {
  return localStorage.getItem("orders") ?? EMPTY_SNAPSHOT;
}

function getServerSnapshot(): string | null {
  return null;
}

export function useOrdersStorage() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isReady = snapshot !== null;

  let orders: Order[] = EMPTY_ORDERS;

  if (snapshot !== null) {
    try {
      const parsed: unknown = JSON.parse(snapshot);
      if (Array.isArray(parsed)) {
        orders = parsed as Order[];
      }
    } catch {
      orders = EMPTY_ORDERS;
    }
  }

  return { orders, isReady };
}
