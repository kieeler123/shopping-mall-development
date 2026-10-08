# Day 24 학습 총정리 --- `useEffect`와 외부 시스템 동기화

> 쇼핑몰 주문 페이지 기준 · 핵심 목표: **왜 이 작업을 렌더링이 아닌
> Effect 또는 이벤트 핸들러에서 실행해야 하는가?**

## 1. 핵심 결론

`useEffect = fetch`가 아니다. **Effect는 React 컴포넌트가 외부 시스템과
동기화하도록 만드는 탈출구**다. 외부 시스템에는 서버 API, WebSocket,
브라우저 이벤트, 타이머, 지도·차트 라이브러리 등이 있다.

- **render**: 현재 props와 state로 JSX를 계산한다. 렌더링 중 외부
  시스템에 부수효과를 일으키지 않는다.
- **Effect**: 렌더링 결과가 커밋된 후 외부 시스템과 연결·동기화하고,
  필요하면 정리(cleanup)한다.
- **이벤트 핸들러**: 사용자의 특정 행동에 대한 응답을 실행한다.
- **state**: 데이터 변경을 React에 알리고 UI 재렌더링을 유도한다.

**팁:** API의 GET/POST 방향으로 구분하지 말고 **무엇이 이 작업을
시작하게 했는가**를 물어라.

## 2. 쇼핑몰 주문 페이지의 전체 흐름

```text
OrdersPage 렌더링 (orders = [])
    ↓
React가 DOM 변경을 커밋
    ↓
Effect 설정 실행
    ↓
GET /api/orders 요청
    ↓
응답 수신 → setOrders(data)
    ↓
state 변경 → 재렌더링
    ↓
orders.map(...)으로 주문 목록 표시
```

Effect는 데이터를 직접 화면에 그리지 않는다. **Effect → state 변경 →
render**로 연결된다. 화면에 보여줄 수 있는 값을 기존 props/state에서
계산만 하면 되는 경우에는 Effect 없이 렌더링 중 계산한다.

**팁:** 코드를 읽을 때 `fetch → setOrders → orders.map`을 하나의 선으로
추적해라.

## 3. 왜 렌더링 중 API 호출이 위험한가?

```tsx
function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  loadOrders(); // ❌ 렌더링 중 외부 작업
  return <OrderList orders={orders} />;
}
```

`loadOrders()`가 API 응답마다 `setOrders(newArray)`를 호출한다면 다음
순환이 생길 수 있다.

```text
render → loadOrders → API 응답 → setOrders → render → ...
```

React의 렌더링은 **순수해야 한다**. 렌더링 중 네트워크 요청을 시작하면
중단되거나 재시도되는 렌더링에도 요청이 발생할 수 있다. 모든
`setState`가 무조건 무한 루프를 만드는 것은 아니지만, 이 구조는 반복
호출과 경합을 초래하기 쉽다.

**팁:** 렌더링 중에는 UI를 계산하고, 외부 동기화는 적절한 Effect 또는
프레임워크의 데이터 로딩 기능에 맡겨라.

## 4. 의존성 배열의 정확한 의미

```tsx
useEffect(() => {
  // 외부 시스템 동기화
}, [userId]);
```

React는 이전 커밋의 의존성과 현재 의존성을 **`Object.is`**로 비교한다.

---

형태 동작

---

`useEffect(fn)` 커밋 후 매번 Effect 실행

`useEffect(fn, [])` 마운트 시 설정; 언마운트 시 정리

`useEffect(fn, [userId])` 마운트 시 및 `userId`가 달라졌을 때
재동기화

---

의존성 배열은 **개발자가 Effect에서 읽는 반응형 값(props, state,
컴포넌트 내부 선언 값 등)을 선언**하는 것이다. 값을 배열에 '전달해서'
실행하는 것이 아니라 React가 **이전 값과 비교**한다. 의존성을 임의로
빼서 실행을 억제하면 오래된 값(stale closure)을 읽을 수 있다.

개발 환경의 **Strict Mode**에서는 버그 검출을 위해 설정 → 정리 → 설정을
추가 실행할 수 있다. 따라서 `[] = 언제나 정확히 한 번`은 틀린 암기다.

**팁:** '몇 번 실행할까?'보다 '어떤 값이 달라지면 외부 연결을 다시
맞춰야 할까?'를 먼저 판단해라.

## 5. 함수 참조가 반복 실행을 만드는 이유

```tsx
function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const loadOrders = async () => {
    const res = await fetch("/api/orders");
    setOrders(await res.json());
  };
  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);
  return <OrderList orders={orders} />;
}
```

컴포넌트 **본문에서 정의한 함수**는 렌더링마다 새 함수 객체가 된다.

```tsx
const a = () => {};
const b = () => {};
Object.is(a, b); // false
```

새 함수 참조 → `[loadOrders]` 변경 → Effect 재실행 → 새 배열로 state
업데이트 → 재렌더링 → 새 함수 참조...가 이어질 수 있다.

정확한 표현: **'의존성 배열 밖에 선언해서'가 아니라 '컴포넌트 본문에서
렌더링마다 새로 생성되어서'**다. 모듈 최상위에 정의한 함수와는 다르다.

**팁:** 함수의 코드가 같은지보다 함수 **객체의 참조**가 같은지를
생각해라.

## 6. 해결책 A: Effect 내부에 함수 두기 (Effect 전용이면 우선 고려)

```tsx
function OrdersPage({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadOrders() {
      const res = await fetch(
        `/api/orders?userId=${encodeURIComponent(userId)}`,
      );
      if (!res.ok) throw new Error("주문 조회 실패");
      setOrders(await res.json());
    }
    void loadOrders();
  }, [userId]);

  return <OrderList orders={orders} />;
}
```

함수 참조를 외부 의존성으로 넣지 않아도 된다. 단, 위 코드는
**개념용**이므로 요청 취소와 오류 처리 UI가 완전하지 않다.

**팁:** Effect에서만 쓰는 도우미 함수는 Effect 안으로 옮기는 것이 간단한
경우가 많다.

## 7. 해결책 B: `useCallback`으로 함수 참조 안정화

```tsx
const loadOrders = useCallback(async () => {
  const res = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error("주문 조회 실패");
  setOrders(await res.json());
}, [userId]);

useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

`useCallback`은 의존성이 같을 때 이전 함수 참조를 재사용한다. `userId`가
달라지면 새 함수가 되고 Effect가 재동기화한다. `useCallback` 자체가 API
호출을 캐시하거나 중복 요청을 제거하지는 않는다.

---

비교 Effect 내부 함수 `useCallback`

---

적합한 상황 Effect 안에서만 사용 새로고침 버튼 등에서도
재사용

의존성 `[userId]` callback에 `[userId]`,
Effect에 `[loadOrders]`

장점 단순하고 의존성 추적이 함수 재사용·전달 가능
쉬움

주의 다른 이벤트에서 직접 불필요한 메모이제이션은
사용 불가 복잡성 증가

---

**팁:** 모든 함수를 `useCallback`으로 감싸지 말고 필요할 때만 써라.

## 8. Effect vs 이벤트 핸들러: 문제 4의 핵심 교정

- **A. 페이지가 표시되거나 `userId`가 바뀌어 주문을 조회한다** → 화면
  상태에 따른 동기화이므로 Effect가 적절할 수 있다.
- **B. 주문 취소 버튼을 눌러 취소 요청을 보낸다** → 사용자의 특정
  행동이 원인이므로 클릭 이벤트 핸들러가 적절하다.

**잘못된 구분:** '받는 요청(GET)은 Effect, 보내는 요청(POST)은 이벤트'.
**정확한 구분:** '컴포넌트의 표시/의존성 변화에 맞춰야 하는가, 사용자의
특정 행동 때문인가?'

```tsx
// 사용자 행동: 이벤트 핸들러
async function handleCancel(orderId: number) {
  const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
  if (!res.ok) throw new Error("주문 취소 실패");
}
<button onClick={() => void handleCancel(1001)}>주문 취소</button>;
```

검색 버튼 클릭으로 **GET**을 실행할 수도 있고, 외부 연결의 상태를 맞추기
위해 Effect에서 데이터를 **전송**할 수도 있다. 요청 방향은 기준이
아니다.

**팁:** '사용자가 아무것도 클릭하지 않아도 이 작업이 필요한가?'를 먼저
물어라. 단, 라우터·서버 데이터 로딩 도구가 더 적합할 수도 있다.

## 9. 실무용 안전한 주문 조회 예시: 취소·오류·로딩

```tsx
import { useEffect, useState } from "react";

type Order = { id: number; productName: string };

function OrdersPage({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders() {
      setLoading(true);
      setError(null);
      setOrders([]);
      try {
        const res = await fetch(
          `/api/orders?userId=${encodeURIComponent(userId)}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Order[] = await res.json();
        if (!controller.signal.aborted) setOrders(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "알 수 없는 오류");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadOrders();
    return () => controller.abort();
  }, [userId]);

  if (loading) return <p>주문을 불러오는 중...</p>;
  if (error) return <p role="alert">오류: {error}</p>;
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>{order.productName}</li>
      ))}
    </ul>
  );
}
```

이 예제는 학습용이다. 실무에서는 인증·권한 확인, 서버의 사용자 식별,
요청 캐시, 재시도, 오류 로깅, 접근성, API 응답 검증 등을 추가 검토해야
한다. **`userId` 쿼리만으로 서버 접근 권한을 결정하면 안 된다.**

**팁:** cleanup의 역할은 'Effect를 한 번만 실행'하는 것이 아니라, 이전
동기화의 연결이나 요청을 **정리**하는 것이다.

## 10. 오늘의 4문제와 이해 보완

| 문제   | 정답 | 핵심 이유                                                                   | 보완 포인트                                                            |
| ------ | ---- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 문제 1 | ①    | 렌더링 중 API 호출 → State 변경 → 반복 렌더링 발생 가능                     | React의 렌더링은 순수해야 한다.                                        |
| 문제 2 | ②    | userId 변경을 Object.is로 비교하여 Effect 재동기화                          | 의존성 배열은 값을 전달하는 것이 아니라 변경 여부를 비교하는 기준이다. |
| 문제 3 | ②    | 렌더링마다 새로운 함수 참조 생성 → 의존성 변경 → Effect 재실행              | 함수의 선언 위치뿐 아니라 생성 시점과 참조 동일성이 중요하다.          |
| 문제 4 | ②    | 페이지 상태에 따른 동기화는 Effect, 사용자 클릭에 따른 작업은 이벤트 핸들러 | GET/POST가 아니라 작업의 실행 원인으로 구분해야 한다.                  |

### 최종 셀프 체크

1.  주문 조회를 렌더링 중 직접 호출하면 왜 위험한가?
2.  `[userId]`와 `[]`는 무엇이 다른가?
3.  `loadOrders`를 매번 새로 정의하면 어떤 일이 생기는가?
4.  주문 취소는 왜 Effect보다 이벤트 핸들러가 자연스러운가?
5.  cleanup은 무엇을 정리하는가?

**한 문장 요약:** render는 UI를 계산하고, Effect는 외부 시스템과
동기화하며, 이벤트 핸들러는 사용자 행동에 응답한다.
