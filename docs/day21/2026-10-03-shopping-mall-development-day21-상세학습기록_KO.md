# Day 21 --- 비동기 데이터 흐름 학습 기록 (대화식 상세판)

> 오늘의 목표는 단순히 `fetch` 문법을 외우는 것이 아니라, **Promise →
> async/await → fetch → Response → JSON → 타입이 있는 데이터 → React
> State → UI**가 실제로 어떻게 이어지는지를 이해하는 것이었다.

------------------------------------------------------------------------

## 1. 시작: `fetch()`를 만나면 왜 코드가 기다리지 않을까?

가장 먼저 본 코드는 아주 단순했다.

``` ts
console.log("A");
fetch("/api/products");
console.log("B");
```

여기서 중요한 질문은 이것이었다.

> `fetch()`가 중간에 있는데 왜 JavaScript는 요청이 끝날 때까지
> 기다렸다가 `"B"`를 출력하지 않을까?

`fetch()`는 네트워크 요청이다. 네트워크 응답은 즉시 도착한다고 보장할 수
없다. 만약 JavaScript가 응답이 올 때까지 모든 일을 멈춘다면 화면이나
다른 작업도 함께 멈출 수 있다.

그래서 `fetch()`는 요청의 최종 결과를 즉시 반환하는 대신 **Promise**를
반환한다.

``` ts
const result = fetch("/api/products");
```

이 시점의 `result`는 상품 배열이 아니다.

개념적으로:

``` ts
Promise<Response>
```

이다.

즉:

``` text
fetch()
↓
요청 시작
↓
Promise<Response>를 바로 반환
↓
JavaScript는 다음 코드 계속 실행
```

### 오늘의 첫 번째 핵심

`fetch()`가 반환하는 것은 **데이터 자체가 아니라 미래에 Response를 받을
Promise**다.

------------------------------------------------------------------------

## 2. Promise는 무엇인가?

Promise를 처음 보면 이름부터 추상적이다.

오늘은 Promise를 다음처럼 이해했다.

> **지금은 결과가 없지만, 미래에 성공 결과 또는 실패 결과가 생길 비동기
> 작업을 표현하는 객체**

Promise에는 대표적으로 다음 상태가 있다.

``` text
pending
↓
아직 결과가 정해지지 않음

fulfilled
↓
성공해서 결과가 생김

rejected
↓
실패해서 에러가 생김
```

예를 들어:

``` ts
fetch("/api/products")
```

를 실행한 직후에는 요청이 끝나지 않았을 수 있으므로 Promise는
`pending`일 수 있다.

요청이 정상적으로 진행되어 HTTP 응답을 받으면 Promise는 `fulfilled`가
되고, 그 결과로 `Response`를 얻는다.

네트워크 자체가 실패하는 등의 이유로 요청을 수행하지 못하면 Promise가
`rejected`될 수 있다.

------------------------------------------------------------------------

## 3. `await`은 Promise인가?

여기서 헷갈렸던 중요한 부분이 있었다.

``` ts
const response = await fetch("/api/products");
```

처음 보면 `await`이 어떤 비동기 객체를 만드는 것처럼 보일 수 있다.

하지만 오늘 정리한 핵심은:

> **Promise를 만드는 것은 `fetch()`이고, `await`은 그 Promise의 결과를
> 기다리는 문법이다.**

즉:

``` text
fetch("/api/products")
↓
Promise<Response>
↓
await
↓
Promise가 완료될 때까지 현재 async 함수의 진행을 기다림
↓
Response
↓
response 변수에 할당
```

따라서:

``` ts
const response = await fetch("/api/products");
```

이 한 줄을 읽을 때는:

> "`fetch()`가 `Promise<Response>`를 만들고, `await`이 그 결과를
> 기다려서, 완료된 `Response`가 `response`에 들어간다."

라고 해석하면 된다.

또 하나 중요한 점은 `await`이 JavaScript 전체를 멈추는 것이 아니라는
것이다. 지금 단계에서는 **현재 async 함수의 이어지는 부분이 Promise
결과를 기다린다** 정도로 이해하면 충분하다.

------------------------------------------------------------------------

## 4. 왜 `await`을 했는데 또 `await`이 나올까?

다음 코드를 보면 처음에는 이상하게 느껴질 수 있다.

``` ts
const response = await fetch("/api/products");
const products: Product[] = await response.json();
```

첫 번째 줄에서 이미 기다렸는데 왜 두 번째 줄에서 또 기다릴까?

이유는 서로 다른 비동기 작업이기 때문이다.

첫 번째:

``` ts
fetch("/api/products")
```

의 반환값은:

``` ts
Promise<Response>
```

이다.

그래서:

``` ts
const response = await fetch("/api/products");
```

를 통해 `Response`를 얻는다.

하지만 `Response`는 아직 `Product[]` 자체가 아니다.

이제 응답 본문을 읽고 JSON을 JavaScript 데이터로 변환해야 한다.

``` ts
response.json()
```

이 작업도 Promise를 반환한다.

개념적으로:

``` text
response.json()
↓
Promise<Data>
```

따라서 다시:

``` ts
const products: Product[] = await response.json();
```

처럼 기다려야 한다.

전체를 연결하면:

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

### 오늘 굉장히 중요했던 부분

`await`이 두 번 있는 것은 같은 것을 두 번 기다리는 것이 아니다.

첫 번째는 **HTTP 응답**, 두 번째는 **응답 본문을 읽고 JSON 데이터를
만드는 작업**을 기다린다.

------------------------------------------------------------------------

## 5. 변수에는 정확히 언제 값이 들어갈까?

다음 코드도 중요한 질문이었다.

``` ts
const products: Product[] = await response.json();
```

`response.json()`이 아직 끝나지 않았다면 `products`에 무언가 임시 값이
들어가는 것이 아니다.

개념적으로:

``` text
response.json()
↓
Promise
↓
await가 기다림
↓
Promise 완료
↓
파싱된 데이터 생성
↓
그제야 products에 할당
```

즉 해당 줄이 완료된 이후부터 `products`를 `Product[]`처럼 사용할 수
있다.

------------------------------------------------------------------------

## 6. `async` 함수에서 배열을 return했는데 왜 밖에서는 Promise일까?

다음 함수를 생각해보자.

``` ts
async function getProducts() {
  const response = await fetch("/api/products");
  const products: Product[] = await response.json();

  return products;
}
```

함수 안에서는:

``` ts
return products;
```

이므로 `Product[]`를 반환하는 것처럼 보인다.

하지만 `async` 함수에는 중요한 규칙이 있다.

> **async 함수는 항상 Promise를 반환한다.**

따라서:

``` ts
const result = getProducts();
```

에서 `result`는 개념적으로:

``` ts
Promise<Product[]>
```

이다.

반면:

``` ts
const products = await getProducts();
```

라고 하면 Promise의 완료 결과를 기다리므로:

``` ts
Product[]
```

을 얻게 된다.

흐름으로 보면:

``` text
getProducts 내부
↓
return Product[]
↓
async 함수이므로
↓
Promise<Product[]> fulfilled
```

호출하는 쪽에서:

``` text
getProducts()
↓
Promise<Product[]>
↓ await
Product[]
```

이 된다.

------------------------------------------------------------------------

## 7. `.then()`과 `await`은 어떤 관계일까?

Promise를 처리하는 방식은 `await`만 있는 것이 아니다.

예를 들어:

``` ts
fetch("/api/products")
  .then((response) => {
    return response.json();
  })
  .then((products) => {
    console.log(products);
  });
```

첫 번째 `.then()`이 받는 것은 `Response`다.

``` text
fetch()
↓
Promise<Response>
↓
첫 번째 then
↓
Response
```

그리고:

``` ts
return response.json();
```

을 하면 `response.json()`이 반환하는 Promise가 다음 체인으로 이어진다.

그래서 다음 `.then()`에서는 파싱된 데이터를 받을 수 있다.

``` text
response.json()
↓
Promise<Data>
↓
다음 then
↓
Data
```

`async/await`으로 쓰면:

``` ts
const response = await fetch("/api/products");
const products = await response.json();
```

같은 비동기 흐름을 좀 더 위에서 아래로 읽기 쉬운 형태로 표현할 수 있다.

------------------------------------------------------------------------

## 8. 화살표 함수의 `return`도 중요했다

`.then()`을 볼 때 다음 차이도 확인했다.

``` ts
.then((response) => response.json())
```

중괄호가 없는 expression body에서는 결과가 암묵적으로 반환된다.

반면:

``` ts
.then((response) => {
  response.json();
})
```

처럼 중괄호를 사용하면 명시적인 `return`이 없다.

그러면 다음 `.then()`으로 전달할 값이 `undefined`가 될 수 있다.

따라서:

``` ts
.then((response) => {
  return response.json();
})
```

처럼 작성해야 한다.

------------------------------------------------------------------------

## 9. `.catch()`와 에러 흐름

Promise가 실패하면 `.catch()`로 처리할 수 있다.

``` ts
fetch("/api/products")
  .then(...)
  .catch((error) => {
    console.error(error);
  });
```

`async/await`에서는 보통:

``` ts
try {
  // await ...
} catch (error) {
  // 에러 처리
}
```

형태로 연결해서 볼 수 있다.

------------------------------------------------------------------------

## 10. 404나 500이면 `fetch()`가 자동으로 실패할까?

여기서 중요한 오해를 하나 정리했다.

`fetch()`에서 서버가 404나 500을 반환했다고 해서 일반적으로 Promise가
자동으로 `rejected`되는 것은 아니다.

HTTP 응답 자체를 정상적으로 받았다면 `Response`를 얻을 수 있다.

그래서:

``` ts
const response = await fetch("/api/products");

if (!response.ok) {
  throw new Error("상품 요청 실패");
}
```

처럼 상태를 확인한다.

`response.ok`는 일반적으로 HTTP 상태 코드가 200\~299이면 `true`다.

즉:

``` text
fetch()
↓
Response를 받음
↓
response.ok 확인
├─ true  → 정상 흐름 계속
└─ false → 직접 throw
```

네트워크 연결 자체의 실패 등은 `fetch()` Promise가 reject되는 대표적인
경우다.

------------------------------------------------------------------------

## 11. `new Error()`와 `throw`는 다른 역할이다

``` ts
throw new Error("상품 요청 실패");
```

이 한 줄에는 두 동작이 있다.

먼저:

``` ts
new Error("상품 요청 실패")
```

는 Error 객체를 만든다.

그리고:

``` ts
throw
```

는 그 Error를 실제 에러 흐름으로 던진다.

즉:

``` text
new Error(...)
↓
Error 객체 생성

throw
↓
그 Error를 던짐
```

`try/catch`가 있다면:

``` ts
try {
  throw new Error("실패");
} catch (error) {
  console.log(error);
}
```

`catch`에서 그 에러를 받을 수 있다.

------------------------------------------------------------------------

## 12. async 함수에서 throw하면 어떻게 될까?

다음처럼 내부에서 에러를 잡지 않는다고 해보자.

``` ts
async function getProducts() {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new Error("상품 요청 실패");
  }

  return await response.json();
}
```

`throw`가 실행되고 내부에서 처리되지 않으면:

``` text
async 함수
↓
throw
↓
반환 Promise
↓
rejected
```

가 된다.

즉 async 함수의 성공과 실패는 Promise의 상태와 연결된다.

``` text
return 값
→ fulfilled

잡히지 않은 throw
→ rejected
```

------------------------------------------------------------------------

## 13. `try / catch / finally`

실제 프로젝트에서는 다음 구조를 사용했다.

``` ts
try {
  const response = await fetch("/api/orders");

  if (!response.ok) {
    throw new Error(`주문 목록 조회 실패: ${response.status}`);
  }

  const data: Order[] = await response.json();

  setOrders(data);
} catch (error: unknown) {
  setError(getErrorMessage(error));
} finally {
  setIsLoading(false);
}
```

성공하면:

``` text
try
↓
fetch
↓
response.ok 확인
↓
json()
↓
Order[]
↓
setOrders(data)
↓
finally
↓
setIsLoading(false)
```

실패하면:

``` text
try
↓
에러 발생 또는 throw
↓
catch
↓
setError(...)
↓
finally
↓
setIsLoading(false)
```

`finally`는 성공과 실패 어느 쪽이든 마지막 정리 작업이 필요할 때
유용하다.

------------------------------------------------------------------------

## 14. 처음 작성했던 getProducts에서 놓친 부분

처음에는 다음처럼 작성할 수도 있었다.

``` ts
async function getProducts() {
  const res = await fetch("/api/products");

  if (res.ok) {
    const products: Product[] = await res.json();
    return products;
  }
}
```

문제는 `res.ok`가 `false`일 때다.

그 경우 함수가 명시적으로 값을 반환하지 않으므로 `undefined` 가능성이
생긴다.

그래서 다음처럼 실패를 먼저 처리하는 형태가 더 명확하다.

``` ts
async function getProducts() {
  const res = await fetch("/api/products");

  if (!res.ok) {
    throw new Error("상품 데이터를 불러오지 못했습니다.");
  }

  const products: Product[] = await res.json();

  return products;
}
```

이제 성공하면 `Product[]`, 실패하면 Error 흐름으로 간다.

------------------------------------------------------------------------

## 15. Product\[\]가 실제 UI까지 가는 과정

이론을 Next.js 페이지에 연결했다.

``` tsx
type Product = {
  id: number;
  title: string;
  price: number;
};

async function getProducts() {
  const res = await fetch("/api/products");

  if (!res.ok) {
    throw new Error("상품 요청 실패");
  }

  const products: Product[] = await res.json();

  return products;
}

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

전체 흐름은:

``` text
API
↓
fetch
↓
Promise<Response>
↓ await
Response
↓
response.json()
↓
Promise<Product[]>
↓ await
Product[]
↓
return
↓
getProducts()의 Promise<Product[]>
↓ await
Product[]
↓
products.map()
↓
JSX
↓
UI
```

여기서 오늘 배운 이론이 실제 Next.js 렌더링과 연결되었다.

------------------------------------------------------------------------

## 16. Server Component와 Client Component

여기서 Next.js의 Server/Client 구분도 살펴봤다.

오늘은 다음 기준으로 이해했다.

### Server 쪽을 먼저 생각할 상황

페이지가 처음 만들어질 때 필요한 데이터처럼, 서버에서 미리 가져와
렌더링할 수 있는 데이터.

예:

``` text
상품 목록 페이지 진입
↓
상품 데이터 필요
↓
서버에서 가져오기
↓
HTML/UI 생성
```

### Client가 필요한 상황

브라우저에서 사용자가 직접 상호작용하는 기능.

예:

``` tsx
<button onClick={...}>장바구니</button>
```

또는:

``` tsx
<select onChange={...}>
```

`useState`, `useEffect`처럼 Client Hook을 사용하는 경우도 Client 영역이
필요하다.

하지만 `Link`, `Image`를 사용한다고 해서 그 컴포넌트가 자동으로 Client
Component가 되는 것은 아니다.

------------------------------------------------------------------------

## 17. ProductCard와 OrderCard를 비교했다

`ProductCard`는 상품 정보를 받아 화면에 보여주는 역할이었다.

``` tsx
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <li>
      <Link href={`/products/${product.id}`}>
        <h2>{product.name}</h2>
        <span>{product.salePrice.toLocaleString()}원</span>
        <p>{product.description}</p>
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
        />
      </Link>
    </li>
  );
}
```

자체적으로 `onClick`, `onChange`, `useState` 같은 브라우저 상호작용을
가지고 있지 않다.

반면 `OrderCard`에는:

``` tsx
<select
  value={order.status}
  onChange={(e) => {
    onStatusChange(order.id, e.target.value as OrderStatus);
  }}
>
```

가 있었다.

`onChange`는 브라우저에서 사용자가 선택을 변경할 때 실행되는
이벤트이므로 Client 영역에서 동작해야 한다.

여기서 중요한 세부점은 **OrderCard 파일 자체에 반드시 `"use client"`를
써야 한다는 뜻은 아니라는 것**이다.

부모가 이미 Client Component이고 그 부모가 `OrderCard`를 import하면
`OrderCard`도 그 Client module graph 안에서 사용될 수 있다.

------------------------------------------------------------------------

## 18. 실제 AdminOrdersPage

부모 페이지는 다음 구조였다.

``` tsx
"use client";

export default function AdminOrdersPage() {
  const { orders, isLoading, error, updateOrderStatus } = useOrders();

  // ...
}
```

여기에는 `"use client"`가 있다.

그리고:

``` ts
const { orders, isLoading, error, updateOrderStatus } = useOrders();
```

를 통해 주문 데이터와 상태 변경 함수를 가져온다.

이 페이지에서:

``` tsx
orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
    onStatusChange={updateOrderStatus}
  />
))
```

처럼 각 주문을 `OrderCard`로 렌더링한다.

------------------------------------------------------------------------

## 19. 실제 useOrders 훅에서 오늘 이론 찾기

실제 프로젝트 코드가 처음에는 이론 예제와 다르게 보여서 헷갈렸다.

하지만 React 코드를 잠깐 걷어내면 오늘 배운 구조가 그대로 있었다.

``` ts
const response = await fetch("/api/orders");

if (!response.ok) {
  throw new Error(`주문 목록 조회 실패: ${response.status}`);
}

const data: Order[] = await response.json();

setOrders(data);
```

이론 예제:

``` ts
const response = await fetch("/api/products");

if (!response.ok) {
  throw new Error("상품 요청 실패");
}

const products: Product[] = await response.json();

return products;
```

둘을 비교하면:

``` text
이론                           실제 프로젝트

fetch("/api/products")    →    fetch("/api/orders")
await                     →    await
Response                  →    Response
response.ok               →    response.ok
throw                     →    throw
response.json()           →    response.json()
Product[]                 →    Order[]
return products           →    setOrders(data)
```

즉 오늘 배운 비동기 이론은 이미 실제 Next.js 프로젝트에 적용되어 있었다.

------------------------------------------------------------------------

## 20. `return products`와 `setOrders(data)`가 달라서 헷갈렸다

이론에서는:

``` ts
return products;
```

를 사용했다.

실제 Client 코드에서는:

``` ts
setOrders(data);
```

를 사용했다.

하지만 비동기 데이터를 얻는 부분까지는 같다.

``` text
fetch
↓
await
↓
Response
↓
json
↓
await
↓
Data
```

그다음 데이터를 **어떻게 사용할 것인가**가 다른 것이다.

순수 데이터 함수:

``` text
Product[]
↓
return
↓
호출한 사람에게 전달
```

React Client State:

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

------------------------------------------------------------------------

## 21. `setOrders(data)`가 왜 필요한가?

React에서는 State 값을 직접 바꾸는 것이 아니라 setter를 사용한다.

``` ts
const [orders, setOrders] = useState<Order[]>([]);
```

여기서:

``` text
orders
→ 현재 State를 읽는 값

setOrders
→ State 업데이트를 요청하는 함수
```

이다.

API에서 `Order[]`를 받아도 그것만으로 React UI가 자동으로 그 데이터를
사용하는 것은 아니다.

``` ts
const data: Order[] = await response.json();
setOrders(data);
```

를 통해 State를 업데이트한다.

그러면:

``` text
Order[]
↓
setOrders(data)
↓
orders State 변경
↓
React 재렌더링
↓
AdminOrdersPage가 새로운 orders 사용
↓
orders.map()
↓
OrderCard
```

로 이어진다.

------------------------------------------------------------------------

## 22. `useEffect`는 왜 등장했을까?

`loadOrders`를 정의했다고 자동으로 실행되지는 않는다.

``` ts
const loadOrders = async () => {
  // fetch...
};
```

함수는 호출해야 실행된다.

``` ts
loadOrders();
```

하지만 컴포넌트 렌더링 본문에서 무작정 호출하고 그 안에서 State를 바꾸는
구조를 만들면 반복 렌더링 문제로 이어질 수 있다.

그래서 실제 코드에서는:

``` ts
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

를 사용했다.

오늘 단계에서는 `useEffect`를 다음처럼 이해했다.

> **렌더링 이후 외부 시스템과 동기화해야 하는 작업을 실행하는 React
> Hook**

현재 프로젝트에서는 외부 시스템이 `/api/orders` API이고, Effect 안에서
`loadOrders()`를 실행한다.

``` text
Client Component 렌더링
↓
useEffect
↓
loadOrders()
↓
fetch()
↓
Order[]
↓
setOrders()
↓
재렌더링
```

중요한 것은 `useEffect = fetch`로 외우지 않는 것이다.

fetch는 Effect를 사용하는 한 가지 사례다.

------------------------------------------------------------------------

## 23. `[loadOrders]`는 무엇인가?

``` ts
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

Effect 내부에서 `loadOrders`라는 외부 함수를 사용하고 있다.

그래서 dependency array에:

``` ts
[loadOrders]
```

가 들어가 있다.

오늘은 이것을:

> **이 Effect가 `loadOrders`에 의존하고 있다는 선언**

정도로 이해했다.

------------------------------------------------------------------------

## 24. `useCallback`은 오늘 어디까지 알면 될까?

실제 코드에는:

``` ts
const loadOrders = useCallback(async (): Promise<void> => {
  // ...
}, []);
```

도 있었다.

하지만 오늘의 중심 주제는 Promise, async/await, fetch, JSON, 데이터
흐름이었다.

따라서 `useCallback`은 오늘 완벽하게 파고들지 않았다.

현재는:

> `loadOrders` 함수 참조를 렌더링 사이에서 안정적으로 유지하고, 이
> 함수가 `useEffect`의 dependency로 사용되고 있다.

정도로만 기억한다.

함수 참조, 최적화, stale closure 같은 더 깊은 주제는 필요할 때 다시
공부한다.

------------------------------------------------------------------------

## 25. `void loadOrders()`의 void

`loadOrders`는 async 함수이므로 호출하면 Promise를 반환한다.

``` ts
loadOrders();
```

개념적으로:

``` ts
Promise<void>
```

를 반환한다.

Effect에서는:

``` ts
void loadOrders();
```

라고 작성했다.

오늘은 이것을:

> `loadOrders()`를 실행하지만, 여기에서는 반환되는 Promise 값을 사용하지
> 않는다는 의도를 명시한다.

정도로 이해했다.

`void`를 붙였다고 `loadOrders`가 동기 함수로 바뀌는 것은 아니다.

------------------------------------------------------------------------

## 26. `Promise<void>`는 무슨 뜻일까?

`loadOrders`는 데이터를 return하지 않고 State를 변경한다.

``` ts
const loadOrders = async (): Promise<void> => {
  // ...
  setOrders(data);
};
```

따라서 비동기 작업은 하지만 호출자에게 `Order[]`를 반환하지 않는다.

``` text
async 작업 수행
↓
State 업데이트
↓
명시적인 데이터 return 없음
↓
Promise<void>
```

반면 데이터를 반환하는 함수라면:

``` ts
async function getProducts(): Promise<Product[]> {
  // ...
  return products;
}
```

처럼 `Promise<Product[]>`가 된다.

------------------------------------------------------------------------

## 27. 주문 상태 변경에서는 PATCH가 등장했다

실제 코드에는 주문 목록을 가져오는 GET뿐 아니라 상태를 수정하는 요청도
있었다.

``` ts
const response = await fetch(`/api/orders/${id}`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ status }),
});
```

오늘 깊게 파지는 않았지만 큰 흐름은 동일하다.

``` text
fetch()
↓
Promise<Response>
↓ await
Response
↓
response.ok
↓
response.json()
↓ await
updatedOrder
```

차이는 서버에 단순히 데이터를 요청하는 것이 아니라 주문의 일부 상태를
변경하도록 요청한다는 것이다.

------------------------------------------------------------------------

## 28. 한 주문만 State에서 바꾸는 코드

실제 코드에는 다음 부분도 있었다.

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order,
  ),
);
```

오늘 이 부분은 깊게 학습하기 전 단계로 남겨두었다.

큰 의미만 보면:

``` text
기존 Order[]를 가져옴
↓
map으로 모든 주문 확인
↓
updatedOrder와 id가 같은 주문
→ updatedOrder로 교체

다른 주문
→ 기존 order 유지
↓
새 Order[] 생성
↓
setOrders
```

이다.

`prevOrders`와 functional state update를 왜 쓰는지는 다음 단계에서 더
자세히 공부할 수 있다.

------------------------------------------------------------------------

# 29. 오늘 실제로 헷갈렸던 이유

오늘 후반부에는 이런 느낌이 들었다.

> "이론에서 본 코드와 실제 Next.js 코드가 달라 보여서 헷갈린다."

이건 실제 코드에 오늘 배운 비동기 이론 외에도 React 개념이 함께 들어
있기 때문이다.

실제 코드에는:

``` text
useState
useCallback
useEffect
Promise
async
await
fetch
try/catch
finally
setOrders
```

가 동시에 등장한다.

하지만 층을 나누면:

``` text
React
│
├─ useEffect
│   ↓
│  loadOrders 실행
│
├─ 비동기 핵심
│   fetch
│   ↓
│   Promise<Response>
│   ↓ await
│   Response
│   ↓
│   json()
│   ↓ await
│   Order[]
│
└─ React
    setOrders
    ↓
    재렌더링
    ↓
    UI
```

처럼 오늘 배운 이론이 가운데 그대로 들어 있다.

------------------------------------------------------------------------

# 30. 개발 공부를 어떻게 해야 할까?

오늘 마지막에는 공부 방법 자체에 대한 고민도 정리했다.

두 극단 모두 문제가 있을 수 있다.

### 이론을 전부 완벽하게 끝낸 뒤 실전으로 가기

Promise 하나를 배우면서 처음부터:

``` text
Promise
Event Loop
Call Stack
Web APIs
Microtask Queue
ECMAScript 내부 동작
...
```

까지 모두 끝내려고 하면 실제 코드를 작성하기까지 너무 오래 걸릴 수 있다.

### 이해 없이 일단 따라 만들기만 하기

반대로:

``` ts
const response = await fetch(url);
const data = await response.json();
setProducts(data);
```

를 계속 따라 작성하면서 왜 그런지는 모르면, 코드 형태가 조금만 달라져도
다시 막힐 수 있다.

### 오늘 정리한 학습 방식

가장 현실적인 흐름은:

``` text
얕은 핵심 이론
↓
작은 코드 실습
↓
왜 이렇게 되지?라는 질문 발생
↓
필요한 이론을 한 단계 더 공부
↓
실제 프로젝트에서 발견
↓
직접 사용
↓
다시 복습
```

즉:

> **이론 → 실전 → 이론 → 실전**

을 반복하면서 같은 개념을 점점 깊게 이해하는 방식이다.

------------------------------------------------------------------------

# 31. "내가 뭘 모르는지 모르겠다"에서 벗어나는 과정

처음에는 비동기 전체가 하나의 큰 덩어리처럼 느껴질 수 있다.

``` text
비동기?
Promise?
async?
await?
fetch?
다 비슷하게 헷갈림
```

하지만 공부하면서 모르는 부분이 나뉘기 시작했다.

``` text
Promise       → 어느 정도 이해
async         → 어느 정도 이해
await         → 어느 정도 이해
fetch         → 어느 정도 이해
Response      → 어느 정도 이해
json()        → 어느 정도 이해
throw/catch   → 어느 정도 이해
setState      → 연결하기 시작
useEffect     → 이제 배우기 시작
useCallback   → 아직 깊게 공부하지 않음
```

모르는 것이 없어지는 것만 발전은 아니다.

> **무엇을 모르는지 더 정확하게 말할 수 있게 되는 것도 중요한
> 발전이다.**

------------------------------------------------------------------------

# 32. 오늘은 어디까지 알면 충분할까?

오늘 반드시 가져갈 핵심:

``` text
fetch()
→ Promise<Response>

await fetch()
→ Response

response.json()
→ Promise<Data>

await response.json()
→ Data

async 함수
→ 항상 Promise 반환

async 함수의 return
→ fulfilled 결과

잡히지 않은 throw
→ rejected

response.ok
→ HTTP 성공 상태 확인

setOrders(data)
→ State 변경
→ 재렌더링
→ UI
```

`useEffect`는:

> 렌더링 이후 외부 시스템과 동기화할 작업을 실행한다.

정도.

`useCallback`은:

> 현재는 완벽하게 몰라도 된다.

정도면 오늘은 충분하다.

------------------------------------------------------------------------

# 33. 최종 전체 흐름

오늘 공부한 내용을 하나로 연결하면:

``` text
사용자가 페이지 접근
↓
컴포넌트 렌더링
↓
필요한 시점에 데이터 로딩 함수 실행
↓
fetch("/api/...")
↓
Promise<Response>
↓
await
↓
Response
↓
response.ok 확인
↓
response.json()
↓
Promise<Data>
↓
await
↓
Product[] / Order[]
↓
Server라면 return하여 렌더링에 사용
또는
Client라면 setState(data)
↓
React가 데이터를 사용
↓
map()
↓
컴포넌트 생성
↓
UI
```

## 오늘의 한 문장

> **비동기 데이터를 가져온다는 것은
> `fetch → Promise → await → Response → json → await → Data`의 흐름을
> 거치는 것이고, Next.js/React에서는 그 데이터를 Server 렌더링에
> 사용하거나 Client State에 저장하여 UI로 연결한다.**

오늘은 이 큰 흐름을 이해한 것으로 충분하며, 세부 이론은 실제로 다시
필요해질 때 한 단계씩 깊게 들어가면 된다.
