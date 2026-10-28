# Day 31 — 기존 프로젝트 점검과 Server / Client 구분

**학습 시간 / 学習時間 / Study time:** 120 minutes

> 기존 Next.js + TypeScript 쇼핑몰 프로젝트의 파일별 책임과 주문 데이터 흐름을 설명하고, 브라우저 전용 코드를 Client Component에 배치한다.

## 학습 순서

핵심 이론 20분 → 객관식 5분 → 프로젝트 실습 65분 → 코딩 테스트 20분 → 검사 및 기록 10분

### 핵심 이론 (20분)
- **App Router:** `app/` 폴더의 파일·폴더 구조로 페이지와 API 경로를 정의한다.
- **Server Component:** App Router에서 기본값. 서버에서 데이터 접근 및 렌더링을 담당할 수 있으며 `useState`, `useEffect`, `window`, `localStorage`를 직접 사용하지 않는다.
- **Client Component:** 파일 맨 위의 `"use client"`로 지정한다. 사용자 이벤트, React 상태, 브라우저 API를 사용하는 컴포넌트에 필요하다.
- **Route Handler:** `app/api/**/route.ts`에서 `GET`, `POST`, `PATCH` 등의 HTTP 요청을 처리한다. 화면을 그리는 Client Component와 다르다.
- **중요:** `"use client"`가 붙었다고 모든 코드가 브라우저에서만 실행된다고 가정하면 안 된다. 브라우저 API는 이벤트 처리나 안전한 클라이언트 경계에서 접근한다.

**팁:** `localStorage`를 쓰는 코드를 발견하면 먼저 실행 위치와 SSR/하이드레이션 영향을 확인한다.

### 객관식 1문제 (5분)
**Q. Next.js Route Handler와 Client Component의 차이를 가장 정확히 설명한 것은?**

A. Route Handler는 브라우저에서만 실행되고 Client Component는 서버 API를 처리한다.  
B. Route Handler는 HTTP 요청·응답을 처리하고, Client Component는 사용자 상호작용과 브라우저 상태를 담당한다.  
C. 둘 다 반드시 `"use client"`를 선언해야 한다.  
D. Client Component만 데이터베이스에 직접 접근할 수 있다.

<details><summary>정답과 해설</summary>

**정답: B.** Route Handler는 서버의 API 엔드포인트이고 Client Component는 UI 상호작용을 담당한다. 민감한 데이터 접근은 서버 측에 둔다.

</details>

### 프로젝트 실습 (65분)
**0–10분 | 구조 확인**
- `app/layout.tsx`, `app/page.tsx`, `app/cart/page.tsx`, `app/checkout/page.tsx`
- `app/orders/page.tsx`, `app/orders/[id]/page.tsx`, `app/order-complete/page.tsx`
- `app/admin/orders/hooks/useOrders.ts`, `app/api/orders/route.ts`, `app/api/orders/[id]/route.ts` (존재 여부 확인)
- `src/hooks/useCartStorage.ts`, `src/hooks/useOrdersStorage.ts`, `src/types/{cart,order,product}.ts`

**10–25분 | 역할 분류**
각 파일을 **Server Component / Client Component / Route Handler / Custom Hook / Type·Data**로 분류한다. 실제 코드의 `"use client"`, Hook, 브라우저 API 사용 여부를 확인한다.

**25–45분 | 주문 흐름 추적**
1. `src/data/products.ts` → 상품 표시
2. 장바구니 → `cart` 저장
3. 체크아웃 → 주문 상품 스냅샷(`name`, `price`, `quantity`) 생성
4. 주문 저장 → `orders` 및 `orders-updated` 알림
5. 주문 완료 / 목록 / 상세 → 주문 조회
6. 관리자 화면 → `/api/orders` GET 및 `/api/orders/[id]` PATCH 확인

**45–55분 | 저장소 경계 확인**
현재 사용자 주문 페이지는 `localStorage`를, 관리자 Hook은 서버 API를 사용할 수 있다. **동일한 데이터 저장소인지 검증하기 전에는 하나로 연결되어 있다고 가정하지 않는다.**

**55–65분 | 작은 수정 1개**
브라우저 전용 상태를 사용하는 파일의 Client 경계를 점검한다. 필요하다면 UI와 데이터 조회 코드를 분리하되 오늘은 대규모 리팩터링을 하지 않는다.

**팁:** `app/layout.tsx`의 `{children}` 중복과 중첩 `<main>` 여부도 함께 확인한다.

### 코딩 테스트 1문제 (20분)
**문제:** 다음은 서버 컴포넌트에서 `localStorage`를 읽으려는 코드다. 클라이언트 전용 로직을 올바르게 분리하라.

```tsx
// app/cart/page.tsx — 잘못된 예
export default function CartPage() {
  const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
  return <p>상품 종류: {cart.length}</p>;
}
```

**요구사항**
1. `"use client"`와 기존 `useCartStorage` Hook을 적절히 사용한다.
2. `localStorage`를 렌더링 중 직접 읽지 않는다.
3. 서버 렌더링·하이드레이션을 고려한다.
4. 가능한 한 기존 Hook을 재사용한다.

<details><summary>예시 정답 (실제 Hook 반환형에 맞게 조정)</summary>

```tsx
"use client";

import { useCartStorage } from "@/hooks/useCartStorage";

export default function CartPage() {
  const { cart, isReady } = useCartStorage();

  if (!isReady) return <p>장바구니 불러오는 중...</p>;

  return <p>상품 종류: {cart.length}</p>;
}
```

`useCartStorage`가 배열만 반환한다면 `const cart = useCartStorage()` 등 실제 인터페이스에 맞게 수정한다. `isReady`도 Hook에서 제공할 때만 사용한다.

</details>

**팁:** 코딩 테스트는 VS Code에서 먼저 작성하고 Hook의 실제 타입 정의를 확인한다.

### 검사 및 학습 기록 (10분)
```powershell
cd H:\shopping-mall-development
npx tsc --noEmit
npx eslint .
```

- [ ] 파일별 책임 분류표 작성
- [ ] 장바구니 → 주문 완료 → 목록/상세 흐름을 파일 이름으로 설명
- [ ] `localStorage`와 서버 API의 저장소 관계 확인
- [ ] 객관식 1문제 풀이
- [ ] 코딩 문제 1개 작성
- [ ] TypeScript·ESLint 결과 기록 (오류가 남아도 실제 결과를 기록)

**완료 기준:** 주문 데이터 흐름을 파일별로 설명할 수 있다.

**평가:** 객관식 20점 + 프로젝트 구현·검증 50점 + 코딩 30점 = 100점. 권장 통과 점수 80점.

