# Day 25 — 데이터 흐름 통합 학습 플랜

> **주제:** 쇼핑몰 주문 내역 조회 + 주문 취소  
> **목표:** Day 21~24의 비동기, State, Event, Effect를 하나의 데이터 흐름으로 연결한다.  
> **예상 학습 시간:** 90~120분  
> **선행 지식:** `async/await`, `fetch`, `useState`, 이벤트 핸들러, `useEffect`, 의존성 배열

## 1. 오늘의 핵심 질문

**API에서 가져온 데이터가 어떻게 UI가 되고, 사용자의 행동이 어떻게 서버와 UI를 다시 바꾸는가?**

```text
[초기 조회]
페이지 렌더링 → useEffect → fetch(GET) → 서버 응답
→ setOrders(새 데이터) → 재렌더링 → 주문 목록 UI

[주문 취소]
취소 버튼 클릭 → 이벤트 핸들러 → fetch(POST)
→ 서버의 취소 처리 → 갱신된 주문 데이터 조회
→ setOrders(갱신 데이터) → 재렌더링 → 변경된 UI
```

**팁:** 데이터의 **출처(서버)**, **저장 위치(State)**, **표시 위치(UI)**, **변경 원인(Event)**을 따로 표시해 본다.

## 2. Day 21~24 연결 지도

| 이전 학습 | 오늘의 역할 | 실제 코드 |
|---|---|---|
| Day 21 — 비동기 | 서버 응답을 기다리고 실패를 처리 | `async/await`, `fetch` |
| Day 22 — State | 주문 데이터와 로딩·에러 상태 저장 | `useState` |
| Day 23 — Event | 주문 취소 버튼 클릭 처리 | `onClick`, `handleCancel` |
| Day 24 — Effect | 페이지 표시·사용자 변경에 따라 주문 조회 | `useEffect`, `[userId]` |

**팁:** 각 코드 줄에 “비동기 / State / Event / Effect” 중 하나를 주석으로 붙여 본다.

## 3. 오늘의 완성 기능

**기능 요구사항**
1. 주문 페이지를 열면 해당 사용자의 주문을 불러온다.
2. 로딩 중에는 안내 문구를 보여 준다.
3. 주문 목록을 화면에 표시한다.
4. 취소 가능한 주문에는 취소 버튼을 보여 준다.
5. 버튼을 누르면 서버에 취소 요청을 보낸다.
6. 취소 성공 후 최신 주문 데이터를 다시 조회해 UI를 갱신한다.
7. 오류가 발생하면 사용자에게 메시지를 표시한다.

**실습용 API 계약(예시):**
- `GET /api/orders?userId=...` → `Order[]`
- `POST /api/orders/:orderId/cancel` → 성공 시 2xx 응답

> 위 API 주소와 응답 구조는 **학습용 가정**이다. 실제 프로젝트의 API에 맞게 수정해야 한다. 서버는 클라이언트가 보낸 `userId`만 신뢰하지 말고 인증·권한을 검증해야 한다.

**팁:** 구현 전에 API의 요청 방식, 응답 형태, 실패 시 동작을 먼저 정리한다.

## 4. 단계별 학습 일정

| 단계 | 시간 | 학습·실습 | 완료 기준 |
|---|---:|---|---|
| 1. 흐름 그리기 | 10분 | 조회와 취소 흐름을 각각 그리기 | 두 흐름의 시작점 구분 |
| 2. 타입·State | 15분 | `Order`, `orders`, `loading`, `error` 선언 | 각 State의 역할 설명 |
| 3. 초기 조회 | 20분 | `useEffect`에서 GET 요청 | 페이지 진입 시 주문 표시 |
| 4. 취소 이벤트 | 20분 | `handleCancel`에서 POST 요청 | 클릭할 때만 취소 실행 |
| 5. UI 동기화 | 15분 | 취소 성공 후 재조회 | 서버와 화면 상태 일치 |
| 6. 예외 처리 | 15분 | 오류·로딩·중복 클릭 처리 | 실패 시 UI 유지·안내 |
| 7. 복습 | 10분 | 데이터 흐름 설명 및 문제 풀이 | 코드 흐름을 말로 설명 |

**팁:** 코드를 한 번에 작성하지 말고 단계마다 브라우저에서 결과를 확인한다.

## 5. 통합 실습 코드 (React + TypeScript)

```tsx
import { useEffect, useState } from "react";

type OrderStatus = "PAID" | "CANCELLED";
type Order = {
  id: number;
  productName: string;
  status: OrderStatus;
};

type OrdersPageProps = { userId: string };

export default function OrdersPage({ userId }: OrdersPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Day 24: 사용자 변경 또는 취소 성공 후 주문 데이터 동기화
  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders() {
      setLoading(true);
      setError(null);
      setOrders([]);

      try {
        // Day 21: 비동기 API 조회
        const response = await fetch(
          `/api/orders?userId=${encodeURIComponent(userId)}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("주문 조회에 실패했습니다.");

        const data: Order[] = await response.json();
        if (!controller.signal.aborted) {
          // Day 22: State 갱신 → 재렌더링
          setOrders(data);
        }
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
  }, [userId, refreshKey]);

  // Day 23: 사용자 클릭으로 시작하는 작업
  async function handleCancel(orderId: number) {
    if (cancellingId !== null) return;
    setCancellingId(orderId);
    setError(null);

    try {
      // Day 21: 비동기 API 수정 요청
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("주문 취소에 실패했습니다.");

      // 서버가 확정한 최신 상태를 다시 조회하도록 요청
      setRefreshKey((key) => key + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <section>
      <h1>주문 내역</h1>
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p>주문을 불러오는 중...</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              {order.productName} — {order.status}
              {order.status === "PAID" && (
                <button
                  disabled={cancellingId !== null}
                  onClick={() => void handleCancel(order.id)}
                >
                  {cancellingId === order.id ? "취소 중..." : "주문 취소"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

### 코드 흐름 해설

1. 컴포넌트가 렌더링되면 React가 화면을 커밋한다.
2. Effect가 `userId`와 `refreshKey`에 맞춰 주문 데이터를 조회한다.
3. 응답이 오면 `setOrders`가 실행되고 주문 목록이 재렌더링된다.
4. 사용자가 취소 버튼을 클릭하면 **Effect가 아니라** `handleCancel`이 실행된다.
5. 서버 취소 요청이 성공하면 `refreshKey`를 변경한다.
6. Effect가 다시 실행되어 **서버에서 최신 주문 목록**을 받아온다.
7. `setOrders`가 최신 데이터를 저장하면 UI가 갱신된다.

**주의:** `refreshKey`는 **학습을 위한 간단한 재조회 신호**다. 실무에서는 서버 상태 관리 라이브러리의 무효화(invalidation)나 라우터 데이터 재검증 기능을 사용할 수 있다. 취소 직후 재조회가 완료되기 전까지는 이전 목록이 잠시 보일 수 있다.

**팁:** `setRefreshKey`는 주문을 직접 취소하지 않는다. **서버 취소는 이벤트 핸들러**, **최신 주문 조회는 Effect**가 담당한다.

## 6. 검증 체크리스트

- [ ] 최초 진입 시 GET 요청이 실행되는가?
- [ ] `userId` 변경 시 새 사용자의 주문을 조회하는가?
- [ ] 취소 버튼을 누르지 않았는데 POST가 실행되지는 않는가?
- [ ] 취소 성공 후 GET을 다시 실행해 최신 상태를 보여 주는가?
- [ ] 취소 실패 시 성공한 것처럼 UI를 바꾸지 않는가?
- [ ] 로딩·에러 메시지가 보이는가?
- [ ] 중복 취소 클릭을 방지하는가?
- [ ] 페이지 이탈 또는 `userId` 변경 시 이전 GET 요청이 중단되는가?

**팁:** 개발자 도구 Network 탭에서 **GET → POST → GET** 순서를 직접 확인해 본다. 개발 환경의 React Strict Mode에서는 Effect 점검을 위한 추가 요청이 나타날 수 있다.

## 7. 이해도 점검 문제

**문제 1.** 주문 페이지 진입 시 GET을 실행하는 위치는?  
① render 본문 ② `useEffect` ③ 취소 버튼 `onClick`

**문제 2.** 주문 취소 POST는 언제 실행해야 하는가?  
① 매 렌더링 ② `userId`가 바뀔 때마다 ③ 사용자가 취소 버튼을 클릭할 때

**문제 3.** `setOrders(data)`의 주된 역할은?  
① 서버 DB를 직접 변경 ② State를 바꾸고 UI 재렌더링 유도 ③ 네트워크 연결 종료

**문제 4.** 취소 성공 후 `setRefreshKey((n) => n + 1)`을 실행하는 이유는?  
① Effect 재실행으로 최신 주문 목록 조회 ② 취소 요청 자동 재전송 ③ React 앱 종료

**문제 5.** 다음 설명 중 옳은 것은?  
① GET은 언제나 Effect에서만 실행한다.  
② POST는 언제나 render에서 실행한다.  
③ Effect와 이벤트 핸들러는 **실행 원인**으로 구분한다.

<details>
<summary>정답 및 간단 해설</summary>

1. **②** — 페이지 표시·`userId` 변경에 따른 외부 동기화.
2. **③** — 주문 취소는 사용자 행동으로 시작된다.
3. **②** — State 변경은 React의 재렌더링을 유도한다.
4. **①** — 의존성 `refreshKey`가 바뀌면 Effect가 다시 실행된다.
5. **③** — GET/POST가 아니라 실행 원인이 판단 기준이다.

</details>

**팁:** 선택지만 맞히지 말고 **왜 다른 선택지가 틀렸는지** 한 문장씩 설명해 본다.

## 8. 오늘의 완료 기준

- [ ] `API → fetch → Data → State → UI`를 설명할 수 있다.
- [ ] `UI → Event → API 수정 → 최신 Data → State → UI`를 설명할 수 있다.
- [ ] Effect와 이벤트 핸들러의 역할을 구분한다.
- [ ] 오류가 나도 화면이 거짓 성공 상태를 보여 주지 않게 한다.
- [ ] 통합 예제에서 Day 21~24 개념이 쓰인 위치를 찾을 수 있다.

### 최종 한 문장

**서버의 데이터를 Effect로 동기화하고 State로 UI에 반영하며, 사용자의 이벤트로 서버를 변경한 뒤 최신 데이터를 다시 동기화한다.**

**팁:** 오늘의 최종 과제는 코드를 보지 않고 **GET → State → UI → 클릭 → POST → 재조회 → State → UI**를 설명하는 것이다.
