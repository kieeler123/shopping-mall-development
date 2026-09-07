import { CartItem } from "./cart";

export type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;
};

export type OrderStatus =
  | "결제완료"
  | "상품준비중"
  | "배송중"
  | "배송완료"
  | "취소완료"
  | "주문완료";
