"use client";

import { useCallback, useEffect, useState } from "react";

import type { Order, OrderStatus } from "@/types/order";

export default function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/orders");

      if (!response.ok) {
        throw new Error(`주문 목록 조회 실패: ${response.status}`);
      }

      const data: Order[] = await response.json();

      setOrders(data);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(
    async (id: number, status: OrderStatus): Promise<Order | null> => {
      setError(null);

      try {
        const response = await fetch(`/api/orders/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          throw new Error(`주문 상태 변경 실패: ${response.status}`);
        }

        const updatedOrder: Order = await response.json();

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order,
          ),
        );

        return updatedOrder;
      } catch (error: unknown) {
        setError(getErrorMessage(error));

        return null;
      }
    },
    [],
  );

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  return {
    orders,
    isLoading,
    error,
    updateOrderStatus,
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "알 수 없는 오류가 발생했습니다.";
}
