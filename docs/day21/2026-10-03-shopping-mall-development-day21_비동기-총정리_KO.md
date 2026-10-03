# Day 21 --- 비동기 데이터 흐름 총정리

> 학습 목표: **Promise → async/await → fetch → Response → JSON → 타입이
> 있는 데이터 → React State → UI** 흐름을 이해하고, 실제 Next.js
> 코드에서 찾아낼 수 있다.

------------------------------------------------------------------------

## 1. 오늘의 핵심 흐름

``` text
API
↓
fetch()
↓
Promise<Response>
↓ await
Response
↓
response.ok 확인
↓
response.json()
↓
Promise<Data>
↓ await
Data
↓
React라면 setState
↓
재렌더링
↓
UI
```

오늘 가장 중요하게 가져갈 흐름이다.

------------------------------------------------------------------------

## 2. 동기와 비동기

### 동기

앞의 작업이 끝난 뒤 다음 작업을 실행한다.

``` ts
console.log("A");
console.log("B");
```

결과:

``` text
A
B
```

### 비동기

`fetch()`처럼 결과를 바로 받을 수 없는 작업은 완료를 기다리는 동안 다른
코드가 계속 실행될 수 있다.

``` ts
console.log("A");
fetch("/api/products");
console.log("B");
```

`fetch()`가 끝날 때까지 `console.log("B")`가 기다리는 것이 아니다.

### 핵심

`fetch()`는 HTTP 응답을 즉시 가지고 있는 것이 아니므로 **Promise를
반환한다.**

------------------------------------------------------------------------

## 3. Promise

Promise는 비동기 작업의 미래 결과를 표현하는 객체라고 이해한다.

``` text
pending
  ↓
 ┌─────────────┐
 ↓             ↓
fulfilled    rejected
성공           실패
```

예:

``` ts
const result = fetch("/api/products");
```

`result`는 상품 데이터가 아니라:

``` ts
Promise<Response>
```

이다.

------------------------------------------------------------------------

## 4. async 함수

`async` 함수는 항상 Promise를 반환한다.

``` ts
async function getNames() {
  return ["신발", "바지", "모자"];
}
```

함수 내부에서는 `string[]`을 반환하지만:

``` ts
const a = getNames();
```

`a`의 타입은 개념적으로:

``` ts
Promise<string[]>
```

이다.

반면:

``` ts
const b = await getNames();
```

`b`는:

``` ts
string[]
```

이다.

### 성공과 실패

``` text
async 함수

return 값
↓
Promise fulfilled
↓
값

throw Error
↓
Promise rejected
↓
Error
```

------------------------------------------------------------------------

## 5. await

`await`은 Promise의 결과를 기다린 뒤 그 결과를 사용할 수 있게 한다.

``` ts
const response = await fetch("/api/products");
```

흐름:

``` text
fetch("/api/products")
↓
Promise<Response>
↓
await
↓
Response
↓
response 변수에 할당
```

`await` 자체가 Promise인 것이 아니다.

또한 `await`은 프로그램 전체를 멈추는 것으로 이해하면 안 된다. 현재 학습
단계에서는 **해당 async 함수 안에서 Promise 결과를 기다린다**고 이해하면
충분하다.

------------------------------------------------------------------------

## 6. fetch와 Response

``` ts
const response = await fetch("/api/products");
```

`fetch()`가 반환하는 것은:

``` ts
Promise<Response>
```

이고 `await` 이후에는:

``` ts
Response
```

를 얻는다.

중요한 점은 `Response`가 아직 `Product[]` 자체는 아니라는 것이다.

------------------------------------------------------------------------

## 7. response.ok

HTTP 응답을 받았다고 항상 성공한 것은 아니다.

``` ts
if (!response.ok) {
  throw new Error("상품 요청 실패");
}
```

`response.ok`는 일반적으로 HTTP 상태 코드가 **200\~299** 범위이면
`true`이다.

예를 들어 서버가 404나 500 응답을 보내도 HTTP 응답 자체를 받은 경우
`Response` 객체를 얻을 수 있으므로, 상태 성공 여부를 `response.ok`로
확인하는 패턴을 사용한다.

``` text
Response
↓
response.ok ?
├─ true  → 계속 진행
└─ false → throw Error
```

------------------------------------------------------------------------

## 8. response.json()에도 await이 필요한 이유

``` ts
const products: Product[] = await response.json();
```

`response.json()`도 Promise를 반환한다.

따라서 전체 흐름은:

``` text
fetch()
↓
Promise<Response>
↓ await
Response
↓
response.json()
↓
Promise<Data>
↓ await
Data
```

그래서 흔히 `await`이 두 번 등장한다.

``` ts
const response = await fetch("/api/products");
const products: Product[] = await response.json();
```

첫 번째 `await`은 HTTP 응답을 기다리고, 두 번째 `await`은 응답 본문을
JSON에서 JavaScript 데이터로 읽고 변환하는 작업을 기다린다.

------------------------------------------------------------------------

## 9. Product\[\]와 UI 연결

``` ts
type Product = {
  id: number;
  title: string;
  price: number;
};
```

데이터를 가져오는 함수:

``` ts
async function getProducts() {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new Error("상품 요청 실패");
  }

  const products: Product[] = await response.json();

  return products;
}
```

`getProducts()`를 그냥 호출하면:

``` ts
const result = getProducts();
```

개념적으로:

``` ts
Promise<Product[]>
```

이다.

따라서 실제 배열이 필요하면:

``` ts
const products = await getProducts();
```

이후 `products`는:

``` ts
Product[]
```

로 사용할 수 있다.

------------------------------------------------------------------------

## 10. Next.js Server Component에서 사용

App Router의 Server Component에서는 다음처럼 비동기 데이터를 기다린 뒤
렌더링할 수 있다.

``` tsx
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main>
      <h1>상품 목록</h1>

      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.title}</h2>
          <p>{product.price.toLocaleString()}원</p>
        </div>
      ))}
    </main>
  );
}
```

흐름:

``` text
getProducts()
↓
Promise<Product[]>
↓ await
Product[]
↓
products.map()
↓
각 Product
↓
JSX
```

------------------------------------------------------------------------

## 11. Server Component와 Client Component

오늘은 세부 규칙보다 역할 차이를 중심으로 이해했다.

### Server Component 쪽을 먼저 고려하는 경우

-   페이지를 만들 때 처음부터 필요한 데이터
-   서버에서 상품/주문 데이터를 가져오는 작업
-   브라우저 상호작용이 필요 없는 UI

### Client Component가 필요한 대표적인 경우

-   `useState`, `useEffect` 같은 Client Hook 사용
-   `onClick`, `onChange` 등 사용자 상호작용
-   사용자의 행동에 따라 브라우저에서 상태 변경

예:

``` text
쇼핑몰 페이지
│
├─ Server Component
│   └─ 초기 상품 데이터 가져오기
│
└─ Client Component
    ├─ 장바구니 버튼
    ├─ 수량 + / -
    └─ 상태 변경
```

`"use client"`는 모든 자식 파일에 무조건 반복해서 붙이는 것으로 보기보다
**Client 경계가 시작되는 진입점**이라는 관점으로 이해한다.

------------------------------------------------------------------------

## 12. 실제 프로젝트의 useOrders 흐름

실제 프로젝트에서는 다음 State가 있었다.

``` ts
const [orders, setOrders] = useState<Order[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

각 역할:

  State         역할
  ------------- -------------------------------
  `orders`      주문 데이터
  `isLoading`   현재 데이터를 가져오는 중인지
  `error`       오류 메시지

핵심 비동기 부분은 학습용 코드와 거의 같다.

``` ts
const response = await fetch("/api/orders");

if (!response.ok) {
  throw new Error(`주문 목록 조회 실패: ${response.status}`);
}

const data: Order[] = await response.json();

setOrders(data);
```

흐름:

``` text
fetch("/api/orders")
↓
Promise<Response>
↓ await
Response
↓
response.ok
↓
response.json()
↓
Promise<Order[]>
↓ await
Order[]
↓
setOrders(data)
↓
orders State 변경
↓
React 재렌더링
↓
orders.map()
↓
OrderCard
```

------------------------------------------------------------------------

## 13. return과 setOrders의 차이

순수한 데이터 함수에서는:

``` ts
const products: Product[] = await response.json();
return products;
```

호출한 곳으로 데이터를 전달한다.

``` text
Product[]
↓
return
↓
호출한 곳
```

Client React 코드에서는:

``` ts
const data: Order[] = await response.json();
setOrders(data);
```

State를 업데이트한다.

``` text
Order[]
↓
setOrders(data)
↓
State 변경
↓
재렌더링
↓
UI 갱신
```

`setOrders(data)`를 사용하는 이유는 React의 State를 setter를 통해
업데이트하여 새로운 상태를 기준으로 다시 렌더링하게 하기 위해서다.

------------------------------------------------------------------------

## 14. try / catch / finally

### try / catch

``` ts
try {
  // 비동기 작업
} catch (error) {
  // 에러 처리
}
```

`try` 내부에서 에러가 발생하거나 `throw`하면 `catch`에서 처리할 수 있다.

async 함수 내부에서 발생한 에러를 잡지 않으면 해당 async 함수가 반환하는
Promise가 `rejected`된다.

### finally

``` ts
finally {
  setIsLoading(false);
}
```

`finally`는 성공/실패 여부와 관계없이 마지막에 실행된다.

그래서 로딩 상태 처리와 잘 어울린다.

``` text
요청 시작
↓
isLoading = true
↓
성공 또는 실패
↓
finally
↓
isLoading = false
```

------------------------------------------------------------------------

## 15. useEffect --- 오늘 이해할 범위

실제 코드:

``` ts
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

오늘은 다음 정도로 이해한다.

-   `loadOrders` 함수를 정의하는 것만으로는 실행되지 않는다.
-   Client Component가 렌더링된 뒤 주문 데이터를 불러오는 작업을
    실행한다.
-   Effect는 외부 시스템과 컴포넌트를 동기화하는 데 사용한다.
-   현재 코드에서는 `/api/orders`와 데이터를 동기화하는 역할을 한다.
-   `[loadOrders]`는 이 Effect가 `loadOrders`에 의존한다는 의미이다.

`useEffect = fetch`라고 외우지 않는다. fetch는 Effect의 활용 사례 중
하나이다.

------------------------------------------------------------------------

## 16. useCallback --- 오늘은 여기까지만

실제 코드에는:

``` ts
const loadOrders = useCallback(async () => {
  // ...
}, []);
```

가 있었다.

오늘은 다음 정도만 기억한다.

> `loadOrders` 함수 참조를 렌더링 사이에서 안정적으로 유지하고, 이
> 함수가 `useEffect`의 의존성으로 사용되고 있다.

`useCallback`의 세부 최적화 원리나 함수 참조 비교까지는 오늘의 핵심 학습
범위로 잡지 않는다.

------------------------------------------------------------------------

# 오늘의 최종 핵심 암기

``` text
fetch()
→ Promise<Response>

await fetch()
→ Response

response.json()
→ Promise<Data>

await response.json()
→ Data

async 함수의 return
→ Promise fulfilled

async 함수에서 잡히지 않은 throw
→ Promise rejected

setState(data)
→ State 변경
→ React 재렌더링
→ UI 갱신
```

그리고 실제 프로젝트 코드를 볼 때:

``` text
1. fetch가 어디 있는가?
2. await은 무엇을 기다리는가?
3. response.ok를 확인하는가?
4. response.json() 결과 타입은 무엇인가?
5. 받은 데이터를 return하는가, State에 저장하는가?
6. 그 State는 JSX 어디에서 사용되는가?
```

순서로 추적한다.

------------------------------------------------------------------------

------------------------------------------------------------------------

## 학습 마무리

오늘의 핵심은 **비동기 데이터가 API에서 출발해 React UI까지 도달하는 큰
흐름**을 이해하는 것이다.
