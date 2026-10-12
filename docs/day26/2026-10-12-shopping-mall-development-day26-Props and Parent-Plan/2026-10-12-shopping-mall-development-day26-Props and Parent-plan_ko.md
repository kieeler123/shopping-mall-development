# Day 27 --- 컴포넌트 분리와 책임

**핵심 질문:** 이 코드는 누구의 책임인가?

오늘의 목표는 디자인 패턴을 외우는 것이 아니라, 실제 Next.js 주문 관리
화면에서 코드를 어디에 배치할지 스스로 판단하는 것입니다.

## 1. 학습 목표

- 페이지, 목록, 카드, 아이템의 책임을 구분한다.
- 중복되거나 지나치게 긴 JSX를 의미 있는 컴포넌트로 분리한다.
- 데이터 소유와 UI 표현의 차이를 설명한다.
- 기존 관리자 주문 기능을 망가뜨리지 않고 구조를 점검한다.

## 2. 학습 범위

**포함:** 컴포넌트 책임, 페이지/목록/카드/아이템, UI 분리, Props 경계.

**제외:** 복잡한 디자인 패턴, 새로운 상태 관리 라이브러리, 서버 API
재설계, Lifting State Up 심화.

## 3. 프로젝트 구조

```text
AdminOrdersPage
├── 페이지 전체 구성
├── 로딩 / 오류 / 빈 목록 처리
└── OrderCard (주문마다 하나)
    ├── 주문 정보 표시
    ├── 상태 변경 UI
    └── OrderItemList (해당 주문의 상품 목록)
        └── 각 주문 상품 표시
```

**주의:** `OrderItemList`는 `AdminOrdersPage`의 직접 자식이 아니라
`OrderCard` 내부에 있습니다.

## 4. 책임 분담표

| 위치                  | 담당할 일                                                        | 담당하지 않을 일                     |
| --------------------- | ---------------------------------------------------------------- | ------------------------------------ |
| `AdminOrdersPage`     | 페이지 레이아웃, 주문 목록 순회, 로딩/오류/빈 목록 처리, 훅 연결 | 주문 카드의 세부 마크업              |
| `OrderCard`           | 주문 한 건의 정보와 상태 변경 UI, `OrderItemList` 연결           | 전체 주문 목록 관리                  |
| `OrderItemList`       | 한 주문의 상품 목록 표시                                         | 주문 전체 상태 변경, 페이지 레이아웃 |
| `useOrders` (기존 훅) | 주문 데이터 및 상태 변경 로직 제공                               | 카드 디자인과 HTML 구조              |

## 5. 70분 학습 일정

| 단계             | 시간 | 활동                                 | 결과물          |
| ---------------- | ---- | ------------------------------------ | --------------- |
| 1. 구조 읽기     | 10분 | 세 컴포넌트의 JSX와 Props 확인       | 책임 지도       |
| 2. 책임 판별     | 15분 | 코드 조각 8개를 담당 컴포넌트에 배정 | 분류표          |
| 3. 분리 기준     | 15분 | 길이·반복·의미·재사용성 검토         | 분리 후보 1~2개 |
| 4. 최소 리팩터링 | 20분 | 기존 동작을 유지하며 작은 UI만 분리  | 변경 코드       |
| 5. 검증과 회고   | 10분 | 타입 검사·화면 확인·설명             | 완료 체크리스트 |

## 6. 단계별 학습과 실습

### 1단계 --- 현재 구조 관찰

`AdminOrdersPage`에서 `useOrders()`를 호출하는 곳과 `orders.map()`을
찾으세요. `OrderCard`에서 주문 한 건의 표시와 상태 변경 `select`를 찾고,
`OrderItemList`가 `items` Props를 받는 지점을 확인하세요.

**팁:** 기존 파일을 새 학습 예제로 덮어쓰지 말고, 먼저 현재 파일들의
역할을 메모하세요.

### 2단계 --- 책임 분류 연습

다음 코드의 담당자를 `AdminOrdersPage`, `OrderCard`, `OrderItemList`,
`useOrders` 중에서 선택하세요.

1.  `orders.map(order => ...)`
2.  `order.name`, `order.phone`, `order.address` 표시
3.  `items.map(item => ...)`
4.  `isLoading`일 때 안내 문구 표시
5.  `<select value={order.status}>` 표시
6.  주문 상태 변경 로직을 제공하는 함수
7.  주문 전체가 없을 때 빈 목록 문구 표시
8.  각 상품의 수량·가격 표시

**팁:** '화면 전체인가, 주문 한 건인가, 상품 여러 개인가, 데이터
동작인가?' 순서로 판단하세요.

### 3단계 --- 분리 기준 4가지

① **의미:** 독립적으로 이름 붙일 수 있는 UI인가?

② **반복:** 같은 JSX가 여러 곳에 반복되는가?

③ **변경 이유:** 다른 부분과 독립적으로 수정될 가능성이 있는가?

④ **Props 경계:** 필요한 데이터와 이벤트를 간결하게 전달할 수 있는가?

단순히 코드가 10줄 이상이라는 이유만으로 분리하지 마세요.

**팁:** 분리한 뒤 Props가 오히려 복잡해지면 아직 분리할 시점이 아닐 수
있습니다.

### 4단계 --- 최소 리팩터링

**실습 A:** `OrderCard` 안의 주문 상품 목록이 `OrderItemList`로 분리되어
있는지 확인하고, 그렇다면 중복 구현하지 마세요.

**실습 B:** `OrderCard` 안에 독립적인 표시 영역이 있다면 작은
`OrderCustomerInfo` 컴포넌트로 분리하는 방안을 검토하세요. 꼭 새 파일을
만들 필요는 없습니다.

**실습 C:** 기존 `onStatusChange={updateOrderStatus}` 연결을 유지하세요.

**팁:** 한 번에 한 영역만 옮기고 렌더링·타입 오류를 바로 확인하세요.

### 5단계 --- 검증과 회고

`npm run lint`와 프로젝트에서 사용 중인 타입 검사 명령(예:
`npx tsc --noEmit`)을 실행하세요. 관리자 주문 목록, 주문 상태 선택, 상품
목록 표시가 이전과 같은지 확인하세요.

**팁:** '컴포넌트 개수가 늘었다'가 아니라 '각 컴포넌트의 역할이 더
분명해졌다'가 성공 기준입니다.

## 7. 책임 흐름 코드 예시

아래는 **역할 설명용 예시**입니다. 실제 프로젝트의 타입과 JSX를 대체하는
완성 코드가 아닙니다.

```tsx
// AdminOrdersPage: page-level states and the order list
const { orders, isLoading, error, updateOrderStatus } = useOrders();

{
  orders.map((order) => (
    <OrderCard
      key={order.id}
      order={order}
      onStatusChange={updateOrderStatus}
    />
  ));
}

// OrderCard: one order, including its item list
<OrderItemList items={order.items} />;

// OrderItemList: renders items for this one order
```

## 8. 자가 점검 질문

1.  로딩 화면을 보여 주는 조건문은 어디에 두는 것이 자연스러운가?

2.  주문 하나의 배송 상태 `select`는 누가 렌더링하는가?

3.  주문 상품의 수량과 가격을 반복 출력하는 UI는 누구의 책임인가?

4.  `updateOrderStatus`의 내부 데이터 갱신 코드를 `OrderCard`로 옮겨야
    하는가?

5.  `OrderItemList`를 이미 사용한다면 똑같은 목록 컴포넌트를 새로
    만들어야 하는가?

## 9. 정답과 해설

<details><summary>문제 1 정답 보기</summary>

`AdminOrdersPage` --- 페이지 전체의 로딩 상태를 처리합니다.

</details>

<details><summary>문제 2 정답 보기</summary>

`OrderCard` --- 주문 한 건의 상태 변경 UI입니다.

</details>

<details><summary>문제 3 정답 보기</summary>

`OrderItemList` --- 한 주문의 상품 목록 표현을 담당합니다.

</details>

<details><summary>문제 4 정답 보기</summary>

아니요. 데이터 변경 로직은 기존 `useOrders`에 두고, 카드는 콜백을
호출합니다.

</details>

<details><summary>문제 5 정답 보기</summary>

아니요. 기존 분리가 적절한지 확인하고 필요한 부분만 개선합니다.

</details>
## 10. 완료 체크리스트

- [ ] 페이지/카드/상품 목록의 책임을 말할 수 있다.
- [ ] 실제 코드에서 `orders.map`, `OrderCard`, `OrderItemList`를
      찾았다.
- [ ] 코드 조각 8개의 책임을 분류했다.
- [ ] 불필요한 분리를 피하면서 개선 후보를 설명했다.
- [ ] 주문 목록·상태 변경·상품 목록의 기존 동작을 유지했다.

---

**오늘의 한 문장:** 컴포넌트는 무조건 작게 쪼개는 것이 아니라, 하나의
명확한 책임을 갖도록 나눈다.
