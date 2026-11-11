# Day 21 학습 플랜 --- Promise 복습부터 fetch까지, 쇼핑몰 데이터 연결 준비

> 환경: Next.js + TypeScript\
> 출발점: Promise를 배우다가 마지막 `fetch` 부분에서 중단\
> Day 21 역할: React 기초 복습에서 비동기 데이터 처리로 넘어가 쇼핑몰
> 개발에 필요한 API 데이터 흐름을 연결한다.\
> 원칙: 새로운 개념을 한꺼번에 늘리지 않고
> `Promise → async/await → fetch → JSON → 상품 데이터` 순서로 진행한다.

## 1. Day 21 최종 목표

``` text
쇼핑몰 상품 데이터가 필요함
→ fetch()
→ Promise
→ await
→ Response
→ response.json()
→ JavaScript 데이터
→ Product[]
→ 화면에서 사용
```

Day 20까지 배운 흐름과 연결하면:

``` text
Day 20
사용자 행동 → Event → State → Props → Rendering → UI

Day 21
서버/API → fetch → Promise → await → JSON → 데이터 → UI

최종 연결
외부 데이터 → React에서 사용할 데이터 → 쇼핑몰 UI
```

> **팁:** Day 21의 핵심은 Promise 문법 자체를 많이 외우는 것이 아니라,
> `fetch가 왜 바로 데이터를 주지 않는지`를 이해하는 것이다.

------------------------------------------------------------------------

## 2. Step A --- 동기와 비동기 빠른 복습

확인할 내용:

-   동기 코드의 실행 순서
-   비동기 작업이 필요한 이유
-   네트워크 요청은 즉시 끝나지 않는다는 점
-   결과가 나중에 도착하는 작업을 어떻게 다룰지

간단한 사고 문제:

``` ts
console.log("A");

fetch("/api/products");

console.log("B");
```

질문:

``` text
왜 네트워크 요청 결과를 일반 변수처럼 즉시 사용할 수 없는가?
```

> **팁:** 비동기는 먼저 `시간이 걸리는 작업`이라고 이해한다. 복잡한 내부
> 동작부터 파고들 필요는 없다.

------------------------------------------------------------------------

## 3. Step B --- Promise 핵심 복습

확인:

-   Promise가 무엇인지
-   pending
-   fulfilled
-   rejected
-   `.then()`
-   `.catch()`

기본 흐름:

``` ts
const promise = fetch("/api/products");
```

``` text
fetch 실행
→ Promise 반환
→ 아직 결과를 기다림
→ 성공 또는 실패
```

`.then()` 형태도 읽을 수 있게 복습한다.

``` ts
fetch("/api/products")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
```

Day 21에서는 `.then()`을 완벽하게 숙달하는 것보다 Promise의 흐름을
이해하는 데 사용한다.

> **팁:** `Promise = 미래에 결과가 정해질 비동기 작업을 다루는 객체`
> 정도로 먼저 잡고 간다.

------------------------------------------------------------------------

## 4. Step C --- async / await

Promise를 더 읽기 쉬운 형태로 다룬다.

``` ts
async function getProducts() {
  const response = await fetch("/api/products");
}
```

확인:

-   `async` 함수
-   `await`
-   await 뒤에는 Promise가 오는 경우가 많음
-   Promise가 처리될 때까지 해당 async 함수 안에서 기다림

비교:

``` ts
fetch("/api/products").then((response) => {
  // ...
});
```

``` ts
const response = await fetch("/api/products");
```

> **팁:** 처음에는 `.then()`과 `await`를 서로 완전히 다른 기능이라고
> 생각하지 않는다. 둘 다 Promise 결과를 다루는 방법이다.

------------------------------------------------------------------------

## 5. Step D --- fetch 집중

Day 21의 핵심 구간.

``` ts
const response = await fetch("API 주소");
```

여기서 바로 상품 배열이 나오는 것이 아니다.

``` text
fetch()
→ Promise<Response>
→ await
→ Response 객체
```

확인:

-   `fetch()`는 Promise를 반환
-   `await fetch()` 결과는 `Response`
-   Response에는 HTTP 응답 정보가 들어 있음
-   실제 JSON 데이터는 아직 별도로 읽어야 함

> **팁:** `response = 상품 데이터`라고 생각하지 않는 것이 매우 중요하다.

------------------------------------------------------------------------

## 6. Step E --- response.json()

``` ts
const response = await fetch("API 주소");
const data = await response.json();
```

흐름:

``` text
fetch
→ Response
→ response.json()
→ Promise
→ await
→ JavaScript 데이터
```

확인:

-   JSON이 무엇인지
-   `response.json()`도 비동기 처리라는 점
-   JSON 문자열/응답 본문이 JavaScript에서 사용할 데이터로 변환됨

> **팁:** `await`가 두 번 등장하는 이유를 설명할 수 있어야 한다. 첫
> 번째는 HTTP 응답, 두 번째는 응답 body를 JSON으로 읽는 과정이다.

------------------------------------------------------------------------

## 7. Step F --- TypeScript와 상품 데이터

쇼핑몰에서 사용할 타입을 만든다.

``` ts
type Product = {
  id: number;
  title: string;
  price: number;
};
```

목표:

``` ts
const products: Product[] = ...
```

확인:

-   Product
-   Product\[\]
-   API 데이터 구조 확인
-   API 데이터와 TypeScript 타입의 관계

> **팁:** API 데이터를 보기 전에 타입을 무조건 추측하지 않는다. 실제
> 응답 구조를 확인한 뒤 필요한 타입을 정의한다.

------------------------------------------------------------------------

## 8. Step G --- 에러 처리 기초

``` ts
async function getProducts() {
  try {
    const response = await fetch("API 주소");
    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

확인:

-   `try`
-   `catch`
-   네트워크 요청은 실패할 수 있음

추가로 확인:

``` ts
if (!response.ok) {
  throw new Error("상품 데이터를 불러오지 못했습니다.");
}
```

> **팁:** 처음부터 복잡한 에러 UI를 만들지 않는다. 우선 `성공 데이터`와
> `실패 가능성`을 구분할 수 있으면 된다.

------------------------------------------------------------------------

## 9. Step H --- 쇼핑몰 상품 데이터와 연결

연습 목표:

``` text
API
→ fetch
→ Response
→ json
→ Product[]
→ map
→ 상품 목록
```

Day 20에서 배운 `map`을 다시 사용한다.

``` tsx
products.map((product) => (
  <div key={product.id}>
    <p>{product.title}</p>
    <p>{product.price}</p>
  </div>
));
```

새로운 부분은 `map`이 아니라 products가 어디에서 왔는지다.

``` text
Day 20
직접 만든 products State

Day 21
서버/API에서 받아온 products
```

> **팁:** 이미 배운 `Product[] → map → UI`에 `fetch`라는 데이터 입구가
> 하나 추가된다고 생각한다.

------------------------------------------------------------------------

## 10. Step I --- Next.js에서 어디서 fetch할지 구분

Day 21에서는 너무 깊게 들어가지 않고 다음 차이만 인식한다.

``` text
Server 쪽에서 데이터 가져오기
vs
Client Component에서 데이터 가져오기
```

먼저 단순한 `async/await + fetch` 자체를 확실히 이해한 뒤 Next.js의
데이터 fetching 방식으로 연결한다.

확인 질문:

``` text
이 코드는 왜 async인가?
fetch는 무엇을 반환하는가?
await fetch의 결과는 무엇인가?
response.json()은 왜 필요한가?
최종 products는 어떤 타입인가?
```

> **팁:** React의 `useEffect`까지 한꺼번에 섞으면 fetch 자체가 다시
> 헷갈릴 수 있다. Day 21 초반에는 순수한 fetch 흐름을 먼저 확실히 한다.

------------------------------------------------------------------------

## 11. 메인 과제 --- 상품 API 읽기

최소 목표:

``` ts
type Product = {
  id: number;
  title: string;
  price: number;
};

async function getProducts() {
  const response = await fetch("API 주소");

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const products: Product[] = await response.json();

  return products;
}
```

스스로 설명:

1.  왜 함수에 `async`가 붙는가?
2.  `fetch()`가 반환하는 것은?
3.  첫 번째 `await`는 무엇을 기다리는가?
4.  `response`는 상품 배열인가?
5.  `response.json()`은 무엇을 하는가?
6.  두 번째 `await`는 왜 필요한가?
7.  `products`는 무슨 타입인가?
8.  `return products` 후 이 데이터는 어디에 사용할 수 있는가?

> **팁:** 코드를 외우기 전에 각 줄의 `입력 → 결과`를 설명한다.

------------------------------------------------------------------------

## 12. 선택 과제 --- 실제 상품 목록 UI

fetch가 이해된 뒤에만 진행한다.

``` text
getProducts()
→ Product[]
→ 상품 목록
→ map
→ ProductItem
```

표시할 최소 정보:

-   상품명
-   가격
-   id 또는 이미지 등 API에서 필요한 필드

Day 20과 연결:

``` text
Product[]
→ ProductList
→ map
→ ProductItem
```

> **팁:** UI 디자인에 시간을 쓰지 않는다. Day 21의 목적은 데이터가
> API에서 UI까지 도착하는지 확인하는 것이다.

------------------------------------------------------------------------

## 13. 디버깅 층 분류

``` text
JavaScript
→ Promise / async / await / JSON

Web
→ HTTP / Response / response.ok

TypeScript
→ Product / Product[] / API 데이터 타입

React
→ map / Props / 필요 시 State

Next.js
→ Server / Client / fetch 위치
```

> **팁:** `fetch가 안 된다`고 한 덩어리로 보지 말고 어느 층에서 데이터
> 흐름이 끊겼는지 찾는다.

------------------------------------------------------------------------

## 14. Day 21 구두 시험

코드를 보지 않고 설명한다.

1.  동기와 비동기
2.  Promise
3.  pending / fulfilled / rejected
4.  `.then()`
5.  `.catch()`
6.  `async`
7.  `await`
8.  `fetch()`
9.  `Response`
10. `response.ok`
11. `response.json()`
12. JSON
13. `try / catch`
14. Product와 Product\[\]
15. API → Product\[\] 흐름
16. Product\[\] → map → UI 흐름
17. fetch에서 await가 필요한 이유
18. response.json()에서 await가 필요한 이유
19. Day 20의 products와 Day 21의 products 차이
20. 쇼핑몰에서 fetch가 필요한 이유

> **팁:** `fetch → await → response → json → data`를 막힘없이 말할 수
> 있으면 핵심 흐름이 연결된 것이다.

------------------------------------------------------------------------

## 15. Day 21 코딩 시험

``` text
Level 1
Promise 코드를 읽고 실행 흐름 설명

Level 2
async / await로 간단한 Promise 처리

Level 3
fetch → Response

Level 4
fetch → response.json() → data

Level 5
Product 타입 연결

Level 6
에러 처리

Level 7
Product[] → map → UI

Level 8
쇼핑몰 상품 데이터 흐름을 빈 파일에서 재구현
```

> **팁:** Level 4까지 막힘없이 구현한 다음 React UI와 연결한다.

------------------------------------------------------------------------

## 16. 완료 기준

-   [ ] 동기와 비동기를 설명한다.
-   [ ] Promise의 역할을 설명한다.
-   [ ] pending / fulfilled / rejected를 설명한다.
-   [ ] `.then()` 코드를 읽을 수 있다.
-   [ ] async / await를 설명한다.
-   [ ] `fetch()`가 Promise를 반환한다는 것을 안다.
-   [ ] `await fetch()` 결과가 Response라는 것을 안다.
-   [ ] `response.json()`이 필요한 이유를 설명한다.
-   [ ] `response.ok`를 확인할 수 있다.
-   [ ] try/catch의 역할을 설명한다.
-   [ ] API 데이터에 Product 타입을 연결한다.
-   [ ] Product\[\]를 map으로 UI에 출력한다.
-   [ ] API → fetch → JSON → Product\[\] → UI 흐름을 설명한다.

------------------------------------------------------------------------

## 17. 권장 학습 순서

``` text
1. 동기 / 비동기 복습
2. Promise 복습
3. then / catch 읽기
4. async / await
5. fetch
6. Response
7. response.json()
8. response.ok + try/catch
9. Product 타입 연결
10. 상품 데이터 map 출력
11. 구두 시험
12. 빈 파일에서 fetch 흐름 다시 작성
```

예상 핵심 비중:

``` text
Promise 복습          15%
async / await         20%
fetch / Response      25%
JSON / Error          15%
TypeScript Product    10%
쇼핑몰 UI 연결        15%
```

> **팁:** Day 21을 끝낸 뒤에는 쇼핑몰의 실제 상품 목록 페이지로
> 넘어가면서 데이터 fetching을 반복 적용하는 방향이 좋다.

------------------------------------------------------------------------

## 18. Day 20 → Day 21 → 쇼핑몰

``` text
Day 20
React 내부 데이터 흐름
Event → State → Props → UI

        ↓

Day 21
외부 데이터 흐름
API → fetch → Promise → await → JSON → Product[]

        ↓

쇼핑몰
Product[]
→ 상품 목록
→ 상품 카드
→ 상세 페이지
→ 이후 장바구니 등 기능으로 확장
```

Day 21의 최종 사고 흐름:

``` text
데이터가 어디에 있는가?
→ 어떻게 요청하는가?
→ 언제 결과가 오는가?
→ 어떤 형태로 변환하는가?
→ 어떤 타입인가?
→ React UI에서 어떻게 사용하는가?
```
