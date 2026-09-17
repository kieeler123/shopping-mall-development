import { OrderItem } from "@/types/order";

export default function OrderItemList({ items }: { items: OrderItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        return (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
          >
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>

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
  );
}
