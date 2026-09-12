"use client";
import useOrders from "./hooks/useOrders";
import OrderCard from "./components/OrderCard";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrders();

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
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={updateOrderStatus}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
