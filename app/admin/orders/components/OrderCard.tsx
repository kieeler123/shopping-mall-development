import OrderItemList from "./OrderItemList";
import { Order, OrderStatus } from "@/types/order";

export default function OrderCard({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: (id: number, status: OrderStatus) => void;
}) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            주문 #{order.id}
          </h2>

          <p className="mt-1 text-sm text-gray-500">{order.createdAt}</p>
        </div>

        <select
          value={order.status}
          onChange={(e) => {
            onStatusChange(order.id, e.target.value as OrderStatus);
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
        <h3 className="mb-3 font-semibold text-gray-900">주문 상품</h3>

        <div className="space-y-3">
          <OrderItemList items={order.items} />
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
}
