export type OrderStatus = "결제완료" | "상품준비중" | "배송중" | "배송완료";

export type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;
};

export type OrderCardProps = {
  order: Order;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
};

export type OrderItemListProps = {
  items: OrderItem[];
};
