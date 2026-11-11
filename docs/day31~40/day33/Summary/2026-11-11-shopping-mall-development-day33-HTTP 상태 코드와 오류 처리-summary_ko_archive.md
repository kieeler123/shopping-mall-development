# Day 33 --- HTTP 상태 코드와 오류 처리

> 쇼핑몰 프로젝트 \| 핵심: `Request` / `Response`, `response.ok`, `200/400/404/500`, `try/catch`

## 학습 목표

-   성공·잘못된 요청·찾을 수 없음·서버 오류를 HTTP 상태 코드로 구분한다.
-   `response.ok`와 `try/catch`를 이용해 요청 함수를 개선한다.
-   API 실패 시 사용자에게 오류 UI와 재시도 버튼을 표시한다.

## 1. 상태 코드 이해

  -------------------------------------------------------------------------------------------
  코드                    의미                                       쇼핑몰 예시
  ----------------------- ------------------------------------------ ------------------------
  200                     OK --- 요청 성공                           주문 목록 조회 성공

  400                     Bad Request --- 요청 형식/값 오류          잘못된 주문 ID

  404                     Not Found --- 리소스를 찾을 수 없음        존재하지 않는 주문

  500                     Internal Server Error --- 서버 내부 오류   주문 조회 처리 중 예외
  -------------------------------------------------------------------------------------------

**팁:** `400`은 클라이언트 요청 문제, `500`은 서버 내부 문제다. 인증 오류는 상황에 따라 `401` 또는 `403`을 사용한다.

## 2. GET API 성공/실패 응답 개선

`app/api/orders/route.ts`에 넣을 학습용 예시:

``` ts
const orders = [
  { id: 1, product: "무선 키보드", price: 59000 },
  { id: 2, product: "게이밍 마우스", price: 35000 },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");

    if (idParam !== null) {
      const id = Number(idParam);
      if (!Number.isInteger(id) || id <= 0) {
        return Response.json(
          { success: false, error: "올바른 주문 ID를 입력하세요." },
          { status: 400 }
        );
      }
      const order = orders.find((item) => item.id === id);
      if (!order) {
        return Response.json(
          { success: false, error: "주문을 찾을 수 없습니다." },
          { status: 404 }
        );
      }
      return Response.json({ success: true, order }, { status: 200 });
    }

    return Response.json(
      { success: true, count: orders.length, orders },
      { status: 200 }
    );
  } catch (error) {
    console.error("주문 조회 오류:", error);
    return Response.json(
      { success: false, error: "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
```

**주의:** `500`은 실제 예외가 발생할 때만 반환된다. 학습을 위해 오류를 의도적으로 발생시키는 코드는 운영 환경에 배포하지 않는다.

## 3. `response.ok` + `try/catch` 요청 함수

`lib/orders.ts` 예시:

``` ts
export type Order = { id: number; product: string; price: number };

export async function fetchOrders(): Promise<Order[]> {
  let response: Response;
  try {
    response = await fetch("/api/orders");
  } catch {
    throw new Error("네트워크 연결에 실패했습니다.");
  }

  if (!response.ok) {
    let message = `요청 실패 (${response.status})`;
    try {
      const body: { error?: string } = await response.json();
      if (body.error) message = body.error;
    } catch {
      // JSON이 아닌 오류 응답도 처리
    }
    throw new Error(message);
  }

  try {
    const data: { orders: Order[] } = await response.json();
    if (!Array.isArray(data.orders)) throw new Error("응답 형식 오류");
    return data.orders;
  } catch {
    throw new Error("주문 응답을 읽을 수 없습니다.");
  }
}
```

**중요:** `fetch()`는 HTTP 404/500만으로 자동으로 예외를 던지지 않는다. `response.ok`로 확인해야 한다. `try/catch`는 네트워크 오류나 JSON 파싱 오류 등을 처리한다.

## 4. 오류 UI와 재시도 버튼

`app/orders/page.tsx` 학습용 예시:

``` tsx
"use client";

import { useEffect, useState } from "react";
import { fetchOrders, type Order } from "../../lib/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = await fetchOrders();
        if (active) setOrders(result);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "알 수 없는 오류");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [retry]);

  if (loading) return <p>주문 목록을 불러오는 중...</p>;
  if (error) return (
    <div role="alert">
      <p>{error}</p>
      <button onClick={() => setRetry((n) => n + 1)}>다시 시도</button>
    </div>
  );
  return <ul>{orders.map((order) => (
    <li key={order.id}>{order.product} — {order.price.toLocaleString()}원</li>
  ))}</ul>;
}
```

**팁:** 위 import 경로는 루트 `app/orders/page.tsx`와 루트 `lib/orders.ts`를 가정한다. 프로젝트 폴더에 맞게 수정한다.

## 5. API 테스트 시나리오

  요청                         기대 상태      이유
  ---------------------------- -------------- -------------------------
  `/api/orders`                200            전체 주문 조회
  `/api/orders?id=1`           200            존재하는 주문
  `/api/orders?id=abc`         400            잘못된 ID
  `/api/orders?id=999`         404            주문 없음
  서버 종료 후 화면 새로고침   연결 실패 UI   네트워크/서버 접근 불가

500은 실제 서버 예외가 발생할 때 관찰한다. 클라이언트 오류와 서버 오류를 혼동하지 않는다.

## 6. 객관식

**Q1. `fetch()`가 404를 받으면 일반적으로 어떻게 되는가?** - A. 반드시 자동으로 예외 발생 - B. `Response`를 반환하며 `response.ok`는 `false` - C. 브라우저가 종료됨 - D. 자동으로 200으로 변환

**Q2. 존재하지 않는 주문 ID를 요청했을 때 적절한 상태 코드는?** - A. 200 - B. 400 - C. 404 - D. 500

**Q3. 서버 내부에서 예기치 않은 예외가 발생했을 때 적절한 코드는?** - A. 500 - B. 200 - C. 301 - D. 404

## 7. 주관식 / 코딩테스트

**S1.** `response.ok`와 `try/catch`의 역할 차이를 설명하라.

**S2.** `/api/orders?id=abc`는 400, `/api/orders?id=999`는 404를 반환해야 하는 이유를 설명하라.

**S3.** 오류 메시지와 다시 시도 버튼을 표시하는 UI 처리 흐름을 서술하라.

**S4.** `fetch("/api/orders")` 호출 결과가 실패한 경우 사용자에게 오류를 보여주는 코드를 작성하라.

## 8. 정답과 해설

-   Q1 **B** --- `fetch()`는 일반적으로 HTTP 오류 상태만으로 reject되지 않는다.
-   Q2 **C** --- 형식은 유효하지만 대상 리소스가 없을 때 404.
-   Q3 **A** --- 처리되지 않은 서버 내부 오류는 500.
-   S1 예시: `response.ok`는 HTTP 2xx 여부를 확인한다. `try/catch`는 네트워크 오류, 파싱 실패, 직접 던진 예외를 잡는다.
-   S2 예시: `abc`는 정수 ID 형식이 아니므로 400, `999`는 형식은 유효하지만 존재하지 않으므로 404.
-   S3 예시: 로딩 시작 → fetch → 상태 검사 → 실패 시 에러 저장 → 오류 메시지 출력 → 재시도 버튼으로 재요청.
-   S4 예시:

``` ts
try {
  const res = await fetch("/api/orders");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  console.log(data);
} catch (error) {
  console.error(error);
  // React에서는 error 상태를 갱신해 오류 UI를 표시한다.
}
```

## 9. 완료 체크리스트

-   [ ] 200/400/404/500을 상황에 맞게 구분한다.
-   [ ] API에서 성공/실패 상태 코드를 반환한다.
-   [ ] `response.ok`와 `try/catch`를 적용한다.
-   [ ] 오류 UI와 재시도 동작을 확인한다.
-   [ ] 객관식 및 주관식을 풀었다.
