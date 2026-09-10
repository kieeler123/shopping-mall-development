"use client";

import { useState } from "react";

type OrderStatus = "결제완료" | "상품준비중" | "배송중" | "배송완료";

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;
};

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">관리자 주문 목록</h1>

          <p className="mt-2 text-sm text-gray-500">
            전체 주문과 현재 배송 상태를 확인할 수 있습니다.
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            return (
              <section
                key={order.id}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      주문 #{order.id}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {order.createdAt}
                    </p>
                  </div>

                  <select
                    value={order.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as OrderStatus;

                      setOrders(
                        orders.map((currentOrder) => {
                          if (currentOrder.id === order.id) {
                            return {
                              ...currentOrder,
                              status: newStatus,
                            };
                          }

                          return currentOrder;
                        }),
                      );
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
                  >
                    <option value="결제완료">결제완료</option>
                    <option value="상품준비중">상품준비중</option>
                    <option value="배송중">배송중</option>
                    <option value="배송완료">배송완료</option>
                  </select>
                </div>

                <div className="grid gap-3 border-b border-gray-200 pb-5 text-sm md:grid-cols-2">
                  <p>
                    <span className="font-medium text-gray-500">주문자</span>
                    <span className="ml-2 text-gray-900">{order.name}</span>
                  </p>

                  <p>
                    <span className="font-medium text-gray-500">전화번호</span>
                    <span className="ml-2 text-gray-900">{order.phone}</span>
                  </p>

                  <p className="md:col-span-2">
                    <span className="font-medium text-gray-500">배송지</span>
                    <span className="ml-2 text-gray-900">{order.address}</span>
                  </p>
                </div>

                <div className="py-5">
                  <h3 className="mb-3 font-semibold text-gray-900">
                    주문 상품
                  </h3>

                  <div className="space-y-3">
                    {order.items.map((item) => {
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.name}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              수량 {item.quantity}개
                            </p>
                          </div>

                          <p className="font-medium text-gray-900">
                            {item.price.toLocaleString()}원
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-5">
                  <span className="font-medium text-gray-500">총 주문금액</span>

                  <strong className="text-xl text-gray-900">
                    {order.totalPrice.toLocaleString()}원
                  </strong>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
