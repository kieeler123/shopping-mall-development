# Day 28 — 데이터 흐름과 상태 업데이트

핵심 질문: Custom Hook이 제공한 상태와 함수를 UI에서 어떻게 안전하게 사용하고 변경 결과를 반영하는가?

**Stack:** Next.js · React · TypeScript  
**Duration:** 90 min

## 1. 학습 목표

- Props와 Callback의 데이터 흐름 설명
- `useOrders()`에서 `updateOrderStatus`까지 호출 흐름 추적
- 불변성을 지키는 `map()` 기반 상태 업데이트 이해
- API 성공/실패와 UI 반영 방식 설명
- 함수 Props의 TypeScript 타입 작성

## 2. 학습 범위

**포함:** 단방향 데이터 흐름, Callback Props, 상태 불변성, 비동기 업데이트, 오류 처리, TypeScript.

**제외:** 상태 관리 라이브러리 도입, API 재설계, 대규모 리팩터링.

## 3. 90분 학습 일정

| 단계             |     시간 | 활동                 |
| ---------------- | -------: | -------------------- |
| Day 27~28 복습   |     10분 | 컴포넌트와 Hook 책임 |
| 데이터 흐름      |     15분 | Props와 Callback     |
| 상태 업데이트    |     15분 | 배열/객체 불변성     |
| API 변경 흐름    |     15분 | 성공과 실패          |
| 프로젝트 실습    |     15분 | 기존 함수 분석       |
| 개념·코딩 테스트 |     20분 | 15문제 풀이          |
| **합계**         | **90분** |                      |

## 4. 실습 계획

1. **Callback 추적:** `AdminOrdersPage` → `OrderCard` → `onStatusChange` → `updateOrderStatus`.
2. **불변성:** 직접 수정과 `map()`·전개 문법 비교.
3. **비동기:** API 실패와 UI 동기화 확인.
4. **타입:** Props 구조 분해 할당과 타입 선언 복습.

기존 기능이 정상이라면 불필요하게 수정하지 않는다.

### Reference code (illustrative)

```tsx
const { orders, isLoading, error, updateOrderStatus } = useOrders();

<OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} />;
```

```tsx
setOrders((prev) =>
  prev.map((order) =>
    order.id === targetId ? { ...order, status: newStatus } : order,
  ),
);
```

## 5. 코딩 테스트 계획 (15문제)

| 유형           | 문항 수 |
| -------------- | ------: |
| 이전 학습 복습 |       3 |
| 기존 개념 변형 |       3 |
| 신규 기본 문제 |       4 |
| 실전 응용      |       3 |
| 오류 수정      |       2 |
| **합계**       |  **15** |

별도 HTML 문제집에서 직접 작성, 접이식 정답, 답안 비교, 자동 저장을 제공할 계획이다.

## 6. 완료 기준

- [ ] Callback과 Props 흐름 설명
- [ ] `updateOrderStatus` 호출 경로 추적
- [ ] 직접 State 변경의 문제점 설명
- [ ] `map()`으로 불변 업데이트 작성
- [ ] API 오류 처리 흐름 설명
- [ ] 함수 Props 타입 작성
- [ ] 15문제 완료
- [ ] 기존 주문 관리 기능 확인

## 7. 학습 팁

**팁:** 코드를 수정하기 전에 실제 `useOrders()` 구현을 읽고 서버 요청과 로컬 상태 갱신 순서를 확인한다.

## 8. 학습 팁
