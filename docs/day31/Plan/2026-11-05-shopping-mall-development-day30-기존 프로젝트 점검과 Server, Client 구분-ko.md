# Day 31 학습 플랜 — 기존 프로젝트 점검과 Server / Client 구분

**Duration / 학습 시간 / 学習時間:** 120 min
**Topics:** Next.js App Router · Server Components · Client Components · Route Handlers

## 1. 학습 목표
기존 쇼핑몰의 파일 구조와 주문 흐름을 파악하고 Client Component와 Route Handler의 책임을 구분합니다.

**팁:** 코드를 수정하기 전에 파일마다 실행 환경, 데이터 원본, 책임을 적으세요.

## 2. 시간표
| Time | 학습 내용 | 결과물 |
|---|---|---|
| 00–20 min | 개념 복습 | 1 |
| 20–40 min | 파일 구조 점검 | 2 |
| 40–65 min | 주문 흐름 추적 | 3 |
| 65–85 min | 관리자 API 분석 | 4 |
| 85–105 min | 코딩 실습 | 5 |
| 105–120 min | 퀴즈 및 회고 | 6 |

## 3. 핵심 개념
Server Component는 서버 데이터 조회와 UI 구성을, Client Component는 사용자 상호작용을, Route Handler는 HTTP 요청 처리와 서버 검증을 담당합니다. Client Component도 초기 서버 렌더링이 가능하므로 렌더링 중 window/localStorage 접근에 주의해야 합니다.

| Type | Responsibility |
|---|---|
| Server Component | Server-side data and UI composition |
| Client Component | Hooks, state, browser interactions |
| Route Handler | GET/PATCH, authorization, server data |

## 4. 파일 구조 점검
```text
app/
├── cart/page.tsx
├── checkout/page.tsx
├── orders/page.tsx
├── orders/[id]/page.tsx
├── order-complete/page.tsx
├── admin/orders/hooks/useOrders.ts
└── api/orders/
    ├── route.ts
    └── [id]/route.ts
hooks/
├── useCartStorage.ts
└── useOrdersStorage.ts
```
이전 점검에서 주문 API 파일 두 개가 발견되지 않았습니다. 현재 프로젝트에서 다시 확인하세요.

- [ ] `app/cart/page.tsx`
- [ ] `app/checkout/page.tsx`
- [ ] `app/orders/page.tsx`
- [ ] `app/orders/[id]/page.tsx`
- [ ] `app/admin/orders/hooks/useOrders.ts`
- [ ] `app/api/orders/route.ts`
- [ ] `app/api/orders/[id]/route.ts`
- [ ] `useCartStorage` and `useOrdersStorage`

## 5. 주문 데이터 흐름
장바구니 → 체크아웃 → 주문 저장 → 주문 내역 → 관리자 API

1. `app/cart/page.tsx` → `useCartStorage()` → `localStorage["cart"]`
2. `app/checkout/page.tsx` → order snapshot → `localStorage["orders"]`
3. `app/order-complete/page.tsx` → show completed order; verify its ID
4. `app/orders/page.tsx` → `useOrdersStorage()`
5. `app/admin/orders/hooks/useOrders.ts` → `GET /api/orders` and `PATCH /api/orders/[id]`

### 주의할 구조적 문제
브라우저 localStorage의 orders는 서버 API와 자동으로 연결되지 않습니다.

## 6. 실습
### A. Reuse the existing cart Hook
```tsx
"use client";
import { useCartStorage } from "@/hooks/useCartStorage";
export default function CartCount() {
  const cart = useCartStorage();
  return <p>상품 종류: {cart.length}</p>;
}
```
### B. Explain Route Handler responsibilities
```ts
// Example only: this endpoint is NOT implemented yet.
import { NextResponse } from "next/server";
export async function GET() {
  // TODO: authorization and server-side order lookup
  return NextResponse.json({message:"Not implemented"}, {status:501});
}
```
HTTP 501 indicates an intentionally unimplemented exercise endpoint.

## 7. 이해도 점검
1. Route Handler와 Client Component의 차이는?
2. "use client"가 있어도 localStorage 접근이 위험한 경우는?
3. useSyncExternalStore는 무엇을 해결하는가?
4. 관리자 API가 고객 localStorage를 직접 읽을 수 없는 이유는?
5. 마지막 저장 주문이 방금 완료한 주문과 다를 수 있는 이유는?

## 8. 최종 제출물
- [ ] File-by-file responsibility table
- [ ] Cart-to-order flow diagram
- [ ] Admin API and storage boundary analysis
- [ ] Hook reuse exercise
- [ ] Learning reflection

**팁:** 코드를 수정하기 전에 파일마다 실행 환경, 데이터 원본, 책임을 적으세요.
