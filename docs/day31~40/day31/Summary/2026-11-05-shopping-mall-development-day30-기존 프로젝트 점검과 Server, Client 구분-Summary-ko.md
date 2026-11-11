# Day 31 — 총정리
> 기존 프로젝트 점검과 Server / Client 구분

**학습일:** 2026-11-05  |  **계획 학습 시간:** 120 min  |  **Score:** 94/100 (PASS)

## 학습 목표
Next.js App Router의 컴포넌트 경계와 쇼핑몰 주문 데이터 흐름을 이해한다.

## 핵심 개념
### Server Component
서버 데이터 접근과 렌더링. App Router의 기본 컴포넌트 유형.

### Client Component
"use client" 경계. 이벤트·React 상태·브라우저 API 사용.

### Route Handler
app/api/**/route.ts에서 GET·POST·PATCH 요청 처리.

### useSyncExternalStore
외부 저장소 구독과 SSR/하이드레이션 스냅샷 관리.

## 파일별 책임
- `app/cart/page.tsx`
- `app/checkout/page.tsx`
- `app/order-complete/page.tsx`
- `app/orders/page.tsx`
- `app/orders/[id]/page.tsx`
- `src/hooks/useCartStorage.ts`
- `src/hooks/useOrdersStorage.ts`
- `app/admin/orders/hooks/useOrders.ts`

## 주문 데이터 흐름
1. 상품 데이터(products.ts) 확인
2. 장바구니 localStorage["cart"] 읽기
3. 체크아웃에서 name·price·quantity 주문 스냅샷 생성
4. localStorage["orders"] 저장 및 orders-updated 알림
5. 장바구니 삭제 및 cart-updated 알림
6. 주문 완료 페이지로 이동
7. 주문 목록·상세에서 조회 및 취소

## 발견 사항
관리자 API Route Handler 두 개가 존재하지 않으며, 사용자 주문은 브라우저 localStorage에 저장됩니다.

## 개선 과제
- 관리자 API 및 공통 서버 저장소 설계
- 주문 ID로 완료 페이지 조회
- 체크아웃 JSON 파싱 예외 처리
- 장바구니 준비 상태 분리
- 서버 측 권한·주문 상태 검증
