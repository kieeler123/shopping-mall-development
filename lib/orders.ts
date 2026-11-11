export type Order = {
  id: number;
  product: string;
  price: number;
};

export async function fetchOrders(): Promise<Order[]> {
  let response: Response;

  // 1. 서버 연결 시도
  try {
    response = await fetch("/api/orders");
  } catch {
    throw new Error("서버에 연결할 수 없습니다.");
  }

  // 2. HTTP 상태 코드 확인
  if (!response.ok) {
    let message = `요청 실패 (HTTP ${response.status})`;

    try {
      const body: { error?: string } = await response.json();

      if (body.error) {
        message = body.error;
      }
    } catch {
      // JSON이 아닌 오류 응답도 있을 수 있음
    }

    throw new Error(message);
  }

  // 3. 성공 응답 JSON 확인
  try {
    const data: { orders: Order[] } = await response.json();

    if (!Array.isArray(data.orders)) {
      throw new Error("잘못된 응답 형식");
    }

    return data.orders;
  } catch {
    throw new Error("주문 응답 데이터를 읽을 수 없습니다.");
  }
}

export async function fetchOrderById(id: string): Promise<Order> {
  let response: Response;

  try {
    response = await fetch(`/api/orders?id=${encodeURIComponent(id)}`);
  } catch {
    throw new Error("서버에 연결할 수 없습니다.");
  }

  if (!response.ok) {
    let message = `요청 실패 (HTTP ${response.status})`;

    try {
      const body: { error?: string } = await response.json();

      if (body.error) {
        message = body.error;
      }
    } catch {
      // JSON 형식이 아닌 오류 응답 처리
    }

    throw new Error(message);
  }

  try {
    const data: { order?: Order } = await response.json();

    if (!data.order) {
      throw new Error("주문 데이터 없음");
    }

    return data.order;
  } catch {
    throw new Error("주문 응답 데이터를 읽을 수 없습니다.");
  }
}
