# Shopping Mall Development — Day 8 Plan

## Topic — Order Cancellation

Day 7 completed the order detail page with Dynamic Routes, `useParams()`, `Number()`, `find()`, and Loading / Not Found / Success. Day 8 focuses on **cancelling an order and updating persisted data**.

## 1. Goal
```text
Order Detail → Cancel button → Confirmation → filter()
→ Update localStorage → Update state → Navigate to /orders
```
> **Tip**  
> Think of Day 7 as reading data and Day 8 as modifying and persisting data.

## 2. Reused Concepts
| Concept | Role |
|---|---|
| `Order`, `Order[]` | Order type |
| `[id]`, `useParams()` | 취소 대상 ID |
| `Number()` | ID 타입 변환 |
| `find()` | 현재 주문 찾기 |
| `localStorage` | 주문 저장 |
| `JSON.parse/stringify` | 저장 데이터 변환 |
| `useState()` | 화면 상태 |
| Loading / Not Found / Success | 상세 상태 |

> **Tip**  
> 새 기능에서도 Day 7 지식이 어디에서 재사용되는지 확인하세요.

## 3. New Concepts
### `filter()`
```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```
`find()` selects one matching element; `filter()` creates a new array of elements that pass its condition.

### `!==`
Day 7의 `order.id === orderId`는 같은 주문 찾기, Day 8의 `order.id !== orderId`는 취소 대상이 아닌 주문 남기기입니다.

### `window.confirm()`
```tsx
const confirmed = window.confirm("정말 이 주문을 취소하시겠습니까?");
```

### `useRouter()`
```tsx
const router = useRouter();
router.push("/orders");
```

> **Tip**  
> `find()`와 `filter()`, `===`와 `!==`를 서로 비교하면서 학습하세요.

## STEP 1 — Verify the Day 7 Detail Page
실제 ID는 Success, 없는 ID와 잘못된 ID는 Not Found가 되는지 확인합니다.

> **Tip**  
> 새 기능 추가 전 기존 기능을 테스트하면 오류 원인을 구분하기 쉽습니다.

## STEP 2 — Add a Cancel Button
```tsx
<button type="button">주문 취소</button>
```
아직 데이터는 변경하지 않습니다.

> **Tip**  
> UI와 데이터 로직을 단계별로 구현하세요.

## STEP 3 — Connect the Click Handler
```tsx
function handleCancelOrder() {
  console.log("취소할 주문:", orderId);
}
```
```tsx
<button type="button" onClick={handleCancelOrder}>주문 취소</button>
```

> **Tip**  
> 먼저 `console.log()`로 `onClick` 연결을 검증하세요.

## STEP 4 — Ask for Confirmation
```tsx
const confirmed = window.confirm("정말 이 주문을 취소하시겠습니까?");
if (!confirmed) return;
```
취소를 선택하면 early return으로 종료합니다.

> **Tip**  
> 삭제·취소 같은 파괴적 동작에는 확인 단계를 둡니다.

## STEP 5 — Exclude the Target with `filter()`
```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```
```text
[1001, 1002, 1003] - 1002
↓
[1001, 1003]
```

> **Tip**  
> 기존 state 배열을 직접 수정하지 않고 새 배열을 만드는 패턴에 집중하세요.

## STEP 6 — Update localStorage
```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

> **Tip**  
> `parse`는 저장 문자열 → JS 데이터, `stringify`는 JS 데이터 → 저장 문자열입니다.

## STEP 7 — Update React State
```tsx
setOrders(updatedOrders);
```
```text
updatedOrders[]
├→ localStorage
└→ React state
```

> **Tip**  
> localStorage와 state는 별개이므로 각각의 역할을 구분하세요.

## STEP 8 — Navigate to Order History
```tsx
import { useRouter } from "next/navigation";
const router = useRouter();
```
취소 완료 후:
```tsx
router.push("/orders");
```

> **Tip**  
> `Link`는 이동 UI, `router.push()`는 로직 완료 후 코드에서 이동할 때 유용합니다.

## Core Completed Handler
```tsx
function handleCancelOrder() {
  const confirmed = window.confirm(
    "정말 이 주문을 취소하시겠습니까?"
  );

  if (!confirmed) return;

  const updatedOrders = orders.filter(
    (order) => order.id !== orderId
  );

  localStorage.setItem(
    "orders",
    JSON.stringify(updatedOrders)
  );

  setOrders(updatedOrders);
  router.push("/orders");
}
```

## Completion Checklist
| 항목 | 기준 |
|---|---|
| 버튼 | 상세 페이지에 표시 |
| 이벤트 | `onClick` 실행 |
| 확인 | 거절 시 처리 중단 |
| `filter()` | 대상 주문 제외 |
| localStorage | 수정 배열 저장 |
| state | `setOrders()` 반영 |
| router | `/orders` 이동 |
| 테스트 | 새로고침 후에도 취소 주문이 없음 |

## Out of Scope for Day 8
서버 DB, 실제 결제 취소, 배송 상태 제한, 취소 사유, 관리자 승인, API, 인증/권한은 아직 다루지 않습니다.

> **Tip**  
> Day 8은 클라이언트 데이터 변경의 기본 원리에 집중합니다.

## Mental Model
```text
Day 7: URL → ID → find() → Order 하나

Day 8:
Order
↓
Cancel Button
↓
onClick
↓
confirm
↓
filter(order.id !== orderId)
↓
updatedOrders[]
↓
JSON.stringify()
↓
localStorage
↓
setOrders()
↓
router.push("/orders")
```

**핵심:** Day 8은 특정 주문을 `filter()`로 제외한 새 배열을 만들고, 저장소와 React state를 갱신한 뒤 목록으로 이동하는 데이터 변경 흐름을 학습합니다.


> **Tip**
>
> Final target: explain why `filter()`, localStorage, React state, and `router.push()` are each needed.