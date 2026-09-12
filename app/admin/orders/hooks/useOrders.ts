import { useState } from "react";
import { Order, OrderStatus } from "../type";

const initialOrders: Order[] = [
  {
    id: 1,
    name: "김철수",
    phone: "010-1111-2222",
    address: "서울특별시 강남구",
    items: [
      {
        id: 101,
        name: "티셔츠",
        price: 20000,
        quantity: 1,
      },
      {
        id: 102,
        name: "모자",
        price: 15000,
        quantity: 2,
      },
    ],
    totalPrice: 50000,
    createdAt: "2026-09-09 10:30",
    status: "결제완료",
  },
  {
    id: 2,
    name: "이영희",
    phone: "010-3333-4444",
    address: "서울특별시 송파구",
    items: [
      {
        id: 103,
        name: "신발",
        price: 42000,
        quantity: 1,
      },
    ],
    totalPrice: 42000,
    createdAt: "2026-09-09 11:10",
    status: "상품준비중",
  },
  {
    id: 3,
    name: "박민수",
    phone: "010-5555-6666",
    address: "대구광역시 중구",
    items: [
      {
        id: 104,
        name: "후드티",
        price: 35000,
        quantity: 1,
      },
    ],
    totalPrice: 35000,
    createdAt: "2026-09-09 12:20",
    status: "배송중",
  },
];

export default function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
    setOrders((prevOrders) =>
      prevOrders.map((currentOrder) => {
        if (currentOrder.id === orderId) {
          return {
            ...currentOrder,
            status: newStatus,
          };
        }

        return currentOrder;
      }),
    );
  }

  return {
    orders,
    updateOrderStatus,
  };
}
