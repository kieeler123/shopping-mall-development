# Day 26 — 복습 문제와 정답

## 9. 복습 문제

먼저 문제를 풀고, 아래 정답 영역을 펼쳐 확인하세요.

1.  Props는 어느 방향으로 전달되는가?

2.  `order`와 `onStatusChange`의 역할 차이는?

3.  `onClick={onStatusChange(order.id)}`가 부적절한 이유는?

4.  주문 ID 101만 취소하도록 `setOrders`를 작성하라.

5.  취소된 주문의 버튼을 비활성화하는 JSX 속성을 작성하라.

6.  관리자 페이지에서 `onStatusChange={???}`에 들어갈 값은?

7.  `key={order.id}`와 `order={order}`의 차이는?

8.  Next.js에서 `useState`를 사용하는 페이지에 고려할 것은?

## 10. 정답 및 해설

<details><summary>문제 1 정답 보기</summary>

부모 → 자식. 자식 → 부모의 요청은 콜백 호출로 표현한다.

</details>

<details><summary>문제 2 정답 보기</summary>

`order`는 데이터 Props, `onStatusChange`는 함수 Props다.

</details>

<details><summary>문제 3 정답 보기</summary>

렌더링 중 함수가 즉시 실행되기 때문이다.
`onClick={() => onStatusChange(order.id)}`를 사용한다.

</details>

<details><summary>문제 4 정답 보기</summary>

`setOrders(prev => prev.map(order => order.id === 101 ? {...order, status: 'CANCELLED'} : order));`

</details>

<details><summary>문제 5 정답 보기</summary>

`disabled={order.status === 'CANCELLED'}`

</details>

<details><summary>문제 6 정답 보기</summary>

`updateOrderStatus` --- 함수를 호출하지 않고 전달한다.

</details>

<details><summary>문제 7 정답 보기</summary>

`key`는 React 목록 식별용 특수 속성이고, `order`는 자식이 받는 일반
Props다.

</details>

<details><summary>문제 8 정답 보기</summary>

적절한 `'use client'` 경계가 필요하다.

</details>

---

**핵심 암기:** Props는 아래로, 이벤트 요청은 콜백으로, State 변경은
소유자가 수행한다.
