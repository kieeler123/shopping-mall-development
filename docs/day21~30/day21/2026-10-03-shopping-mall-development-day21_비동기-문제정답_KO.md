# Day 21 --- 비동기 데이터 흐름 복습 문제 & 정답

> 먼저 문제를 직접 풀어본 뒤 `<details>`를 열어 정답과 해설을 확인한다.

---

# 복습 문제

## 문제 1

다음 코드에서 `result`는 `Product[]`일까, `Promise<Product[]>`일까?

```ts
async function getProducts() {
  return [{ id: 1, title: "운동화", price: 59000 }];
}

const result = getProducts();
```

<details><summary>정답 및 해설 보기</summary>

### 정답

`Promise<Product[]>`

### 해설

`async` 함수는 항상 Promise를 반환한다.

함수 내부에서 `Product[]`를 `return`하더라도 외부에서 그냥 호출하면:

```ts
getProducts();
```

결과는 개념적으로:

```ts
Promise<Product[]>;
```

이다.

실제 배열을 얻으려면:

```ts
const result = await getProducts();
```

처럼 `await`해야 한다.

</details>

---

## 문제 2

다음 코드에서 `response`와 `products`의 타입 역할을 각각 설명하라.

```ts
const response = await fetch("/api/products");
const products: Product[] = await response.json();
```

<details><summary>정답 및 해설 보기</summary>

### 정답

- `response` → `Response`
- `products` → `Product[]`

### 해설

첫 번째 줄:

```text
fetch()
→ Promise<Response>
→ await
→ Response
```

두 번째 줄:

```text
response.json()
→ Promise
→ await
→ JavaScript 데이터
→ Product[]
```

`Response`와 최종 상품 데이터를 구분하는 것이 중요하다.

</details>

---

## 문제 3

왜 다음 코드에는 `await`이 두 번 필요한가?

```ts
const response = await fetch("/api/products");
const products = await response.json();
```

<details><summary>정답 및 해설 보기</summary>

### 정답

`fetch()`와 `response.json()`이 각각 Promise를 반환하기 때문이다.

### 해설

첫 번째 `await`:

```text
Promise<Response>
→ Response
```

두 번째 `await`:

```text
response.json()의 Promise
→ 파싱된 JavaScript 데이터
```

즉 서로 다른 비동기 작업을 기다리고 있다.

</details>

---

## 문제 4

서버가 404를 반환했다. 다음 코드에서 왜 `response.ok`를 확인해야 할까?

```ts
const response = await fetch("/api/products");

if (!response.ok) {
  throw new Error("상품 요청 실패");
}
```

<details><summary>정답 및 해설 보기</summary>

### 정답

HTTP 404/500 응답을 받았다는 것과 네트워크 수준에서 응답 자체를 받지
못한 것은 다르기 때문이다.

### 해설

404나 500이어도 HTTP `Response`를 받을 수 있다.

따라서:

```ts
response.ok;
```

를 확인하고 실패 상태라면 직접:

```ts
throw new Error(...)
```

하여 에러 흐름으로 전환한다.

</details>

---

## 문제 5

다음 async 함수에서 `throw`가 실행되고 함수 내부에 `catch`가 없다면
어떻게 될까?

```ts
async function getProducts() {
  throw new Error("실패");
}
```

<details><summary>정답 및 해설 보기</summary>

### 정답

`getProducts()`가 반환하는 Promise가 `rejected`된다.

### 해설

```text
async 함수
↓
throw Error
↓
내부 catch 없음
↓
Promise rejected
```

따라서 호출하는 쪽에서:

```ts
try {
  await getProducts();
} catch (error) {
  console.error(error);
}
```

처럼 처리할 수 있다.

</details>

---

## 문제 6

다음 두 코드의 차이를 설명하라.

### A

```ts
const products: Product[] = await response.json();
return products;
```

### B

```ts
const orders: Order[] = await response.json();
setOrders(orders);
```

<details><summary>정답 및 해설 보기</summary>

### 정답

A는 데이터를 **호출한 곳으로 반환**하고, B는 데이터를 **React State에
저장**한다.

### 해설

A:

```text
Product[]
→ return
→ 호출자에게 전달
```

B:

```text
Order[]
→ setOrders
→ State 변경
→ 재렌더링
→ UI 갱신
```

둘 다 `response.json()`까지의 비동기 원리는 동일하다. 데이터를 얻은
이후의 사용 방법이 다르다.

</details>

---

## 문제 7

`setOrders(data)`가 실행된 후 React에서는 어떤 흐름이 일어나는가?

<details><summary>정답 및 해설 보기</summary>

### 정답

`orders` State가 업데이트되고 React가 새로운 상태를 기준으로 컴포넌트를
다시 렌더링한다.

### 해설

```text
setOrders(data)
↓
orders State 변경
↓
재렌더링
↓
새로운 orders 사용
↓
orders.map()
↓
OrderCard 출력
```

</details>

---

## 문제 8

다음 기능을 Server / Client 역할로 구분하라.

1.  페이지에 처음 들어왔을 때 필요한 상품 데이터 가져오기
2.  장바구니 버튼의 `onClick`
3.  `+ / -` 버튼으로 수량 변경
4.  초기 상품 목록 렌더링

<details><summary>정답 및 해설 보기</summary>

### 정답

현재 학습한 기준에서는:

- 1 → Server를 먼저 고려
- 2 → Client
- 3 → Client
- 4 → 초기 데이터 기반이라면 Server를 먼저 고려

### 해설

사용자의 브라우저 상호작용과 State 변경이 필요하면 Client Component가
필요하다.

반면 페이지를 만들 때 처음부터 필요한 데이터는 Server Component에서
가져오는 방식을 먼저 고려할 수 있다.

중요한 것은 `버튼 = Client`를 단순 암기하는 것이 아니라 **브라우저에서
사용자 상호작용을 처리해야 하는가?**를 판단하는 것이다.

</details>

---

## 문제 9

다음 `useEffect`는 현재 프로젝트에서 무슨 역할을 하는가?

```ts
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

<details><summary>정답 및 해설 보기</summary>

### 정답

컴포넌트 렌더링 이후 `loadOrders()`를 실행하여 주문 데이터를 불러오는
작업을 시작한다.

### 해설

`loadOrders` 함수를 정의하는 것만으로는 실행되지 않는다.

현재 프로젝트에서는:

```text
렌더링
↓
useEffect
↓
loadOrders()
↓
fetch("/api/orders")
↓
Order[]
↓
setOrders()
↓
재렌더링
```

으로 이어진다.

`[loadOrders]`는 이 Effect가 `loadOrders`에 의존한다는 의미로 이해한다.

</details>

---

## 문제 10

아래 실제 프로젝트 흐름의 빈칸을 채워라.

```text
fetch("/api/orders")
↓
( ① )
↓ await
Response
↓
response.json()
↓
( ② )
↓ await
Order[]
↓
( ③ )
↓
State 변경
↓
( ④ )
↓
orders.map()
↓
OrderCard
```

<details><summary>정답 및 해설 보기</summary>

### 정답

1.  `Promise<Response>`
2.  `Promise<Order[]>`로 이해할 수 있는 JSON 변환의 비동기 결과
3.  `setOrders(data)`
4.  React 재렌더링

전체 흐름:

```text
fetch("/api/orders")
↓
Promise<Response>
↓ await
Response
↓
response.json()
↓
Promise<Order[]>
↓ await
Order[]
↓
setOrders(data)
↓
State 변경
↓
재렌더링
↓
orders.map()
↓
OrderCard
```

</details>

---

# 마지막 자가 점검

아래 질문에 코드 없이 말로 답할 수 있으면 오늘 목표는 충분하다.

- `fetch()`는 왜 Promise를 반환하는가?
- `await fetch()` 이후에는 무엇을 얻는가?
- `response.json()`에는 왜 다시 `await`이 필요한가?
- async 함수에서 `return`과 `throw`는 Promise 상태와 어떻게
  연결되는가?
- `response.ok`는 왜 확인하는가?
- `Product[]` 또는 `Order[]`가 어떻게 UI까지 연결되는가?
- `setOrders(data)`를 하면 왜 화면이 바뀌는가?
- Server Component와 Client Component의 역할을 어떤 기준으로
  구분하는가?
- 현재 프로젝트의 `useEffect`가 왜 `loadOrders()`를 호출하는가?

---

## 오늘은 여기까지만 알아도 되는 것

아래 내용은 실제 코드에 등장했지만 오늘 완벽하게 파고들 필요는 없다.

- `useCallback`의 세부 동작과 최적화
- 함수 참조 동일성의 세부 원리
- Event Loop / Microtask Queue의 깊은 내부 동작
- Next.js 데이터 캐싱의 세부 전략
- `useEffect` cleanup의 다양한 활용
- API 응답의 런타임 스키마 검증

오늘은 **비동기 데이터가 API에서 출발해 React UI까지 도달하는 큰
흐름**을 이해하는 것이 우선이다.

---

## 한 줄 요약

> **비동기 데이터를 가져온다는 것은
> `fetch → Promise → await → Response → json → await → Data`의 흐름이고,
> React Client 코드에서는 그 Data를 State에 저장하면 재렌더링을 통해
> UI로 연결된다.**
