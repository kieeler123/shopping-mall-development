# Day 31 — 코딩 테스트
> 기존 프로젝트 점검과 Server / Client 구분

**학습일:** 2026-11-05  |  **계획 학습 시간:** 120 min  |  **Score:** 94/100 (PASS)

## 문제
```tsx
export default function CartPage() {
  const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
  return <p>상품 종류: {cart.length}</p>;
}
```

## 요구사항
- "use client" 선언
- 기존 useCartStorage Hook 재사용
- 렌더링 중 localStorage 직접 접근 금지
- SSR·하이드레이션 고려

## 제출한 코드
```tsx
"use client";

import { useCartStorage } from "@/hooks/useCartStorage";
import { CartItem } from "@/types/cart";

export default function CartPage() {
  const cart = useCartStorage();
  const updateCart = (updatedCart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));
    updateCart(updatedCart);
  };

  return <p>상품 종류: {cart.length}</p>;
}
```

## 채점 및 피드백
**24 / 30** — 5/5 + 10/10 + 5/5 + 4/10

사용하지 않는 updateCart 함수가 자기 자신을 종료 조건 없이 호출한다. 현재 호출되지 않아 즉시 오류는 발생하지 않지만, 호출 시 스택 초과가 발생할 수 있다. 미사용 함수와 import도 제거한다.

## 수정된 정답
```tsx
"use client";

import { useCartStorage } from "@/hooks/useCartStorage";

export default function CartPage() {
  const cart = useCartStorage();

  return <p>상품 종류: {cart.length}</p>;
}
```

실행 위치와 데이터 저장 위치를 먼저 확인하세요.
