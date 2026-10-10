# Day 25 학습 이론 총정리 (한국어)

## 1. 학습 목표
React + TypeScript로 쇼핑몰 주문 목록을 조회하고 취소하는 기능을 구현한다. 핵심 흐름은 **사용자 변경 → useEffect → GET 요청 → State 갱신 → 화면 렌더링 → 취소 클릭 → POST 요청 → 재조회**이다.

## 2. 핵심 개념

### TypeScript와 useState
```tsx
type Order = { id: number; productName: string; status: "PAID" | "CANCELLED" };
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```
- `Order[]`: 주문 객체 배열.
- `loading`: 요청 진행 여부.
- `error`: 실패 메시지 또는 `null`.
- **팁:** 빈 배열은 '조회 중'과 '주문 없음'을 구별하지 못하므로 상태를 분리한다.

### Promise, async/await, fetch
Promise는 비동기 결과를 나타내며 `pending → fulfilled/rejected` 상태를 갖는다. `async` 함수는 Promise를 반환한다. `await`는 현재 async 함수의 후속 실행을 잠시 미루며 JavaScript 전체를 멈추지 않는다.
```ts
const response = await fetch("/api/orders");
if (!response.ok) throw new Error("조회 실패");
const data: Order[] = await response.json();
setOrders(data);
```
- 첫 번째 `await`: HTTP `Response` 객체 수신.
- 두 번째 `await`: 응답 본문 읽기 및 JSON 파싱.
- `fetch`는 HTTP 404/500만으로 자동 reject되지 않으므로 `response.ok` 확인이 필요하다.
- **팁:** TypeScript의 `Order[]` 표기는 서버 응답의 런타임 구조를 검증하지 않는다.

### Promise 후속 작업과 이벤트 루프
```js
console.log("A");
Promise.resolve().then(() => console.log("B"));
setTimeout(() => console.log("C"), 0);
console.log("D");
// A, D, B, C
```
동기 코드가 먼저 실행되고 Promise의 마이크로태스크가 일반적인 타이머 작업보다 먼저 처리된다.

### useEffect와 의존성
```tsx
useEffect(() => {
  // 사용자별 주문 조회
}, [userId, refreshKey]);
```
- `userId` 변경: 다른 사용자의 주문 재조회.
- `refreshKey` 변경: 주문 취소 후 재조회.
- 의존성 `[]`: 최초 마운트 시 설정(개발 Strict Mode에서는 추가 점검 실행 가능).
- 의존성 생략: 매 커밋 이후 실행.
- **팁:** Effect에서 참조하는 반응형 값을 의존성에 포함한다.

### cleanup과 AbortController
```tsx
useEffect(() => {
  const controller = new AbortController();
  async function load() {
    try {
      const r = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`, {
        signal: controller.signal,
      });
      if (!r.ok) throw new Error("조회 실패");
      const data: Order[] = await r.json();
      if (!controller.signal.aborted) setOrders(data);
    } catch (e) {
      if (!controller.signal.aborted) setError("주문 조회 실패");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }
  setLoading(true);
  setError(null);
  void load();
  return () => controller.abort();
}, [userId]);
```
- cleanup은 의존성이 바뀌어 다음 Effect를 실행하기 전, 언마운트 시 실행된다.
- 개발 Strict Mode에서는 초기 setup → cleanup → setup 점검이 가능하다.
- 취소는 서버에서 이미 시작된 작업의 중단까지 보장하지 않는다.
- **팁:** 이전 요청의 늦은 응답이 현재 사용자 주문을 덮어쓰지 않도록 취소 신호와 상태 갱신 방어를 함께 사용한다.

### 클로저와 Stale Closure
함수는 생성 당시의 렉시컬 환경을 참조한다. React는 렌더링마다 State 스냅샷을 만든다.
```tsx
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000);
  return () => clearInterval(id);
}, []); // 최초 count를 계속 참조할 수 있음
```
해결책: 필요한 의존성 추가, 함수형 State 업데이트, 적절한 `useRef` 사용.
```tsx
setCount(prev => prev + 1);
```
- **팁:** 오래전에 생성된 콜백이 어떤 렌더링의 값을 읽는지 추적한다.

### 이벤트 핸들러와 주문 취소
```tsx
<button onClick={() => void handleCancel(order.id)}>주문 취소</button>
```
`onClick={handleCancel(order.id)}`는 렌더링 중 즉시 실행되므로 잘못된 형태다.
```tsx
async function handleCancel(orderId: number) {
  try {
    const r = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
    if (!r.ok) throw new Error("취소 실패");
    setRefreshKey(prev => prev + 1);
  } catch (e) {
    setCancelError("주문 취소 실패");
  }
}
```
- 취소 중 버튼 비활성화, 중복 요청 방지, 서버 측 권한 검사도 필요하다.
- **팁:** 화면에서 상태만 바꾸는 것은 실제 서버 주문 취소가 아니다.

## 3. 전체 화면 상태 설계
1. 로딩: `loading === true` → 불러오는 중 표시.
2. 오류: `error !== null` → `role="alert"` 오류 표시.
3. 빈 목록: 조회 성공 + `orders.length === 0` → 주문 없음.
4. 정상 목록: `orders.map(...)`과 주문 상태/취소 버튼.
5. 취소 진행: `cancellingId`로 버튼 상태 표시.

## 4. 실무 점검 목록
- `response.ok` 확인 및 JSON 파싱 오류 처리
- 조회 요청 cleanup과 race condition 방어
- 사용자 변경 시 이전 사용자 주문 노출 방지
- 취소 요청 중복 방지와 취소 실패 표시
- 취소 성공과 재조회 성공을 별도 상태로 구분
- 서버의 인증·인가와 주문 소유권 검증
- API 응답 런타임 검증 및 실제 백엔드 명세 확인

## 5. 암기할 한 문장
**조회는 Effect, 취소는 이벤트 핸들러, 결과는 State, 정리는 cleanup, 재조회는 refreshKey.**
