# Day 15 --- 비동기 처리 기초 학습 계획

## 학습 목표

Day 14에서 `useOrders`로 React state와 관련 로직을 분리했다. Day
15에서는 서버 통신으로 바로 넘어가기 전에 JavaScript의 **비동기 처리**가
무엇인지 작은 예제로 이해한다.

오늘의 핵심 흐름:

``` text
동기 처리와 비동기 처리의 차이
↓
Promise
↓
async
↓
await
↓
try / catch
↓
비동기 함수의 실행 흐름 설명
```

> Day 15에서는 실제 API 통신을 본격적으로 구현하지 않는다. 먼저 비동기
> JavaScript의 실행 방식을 이해하는 데 집중한다.

------------------------------------------------------------------------

## STEP 1 --- 동기 처리부터 이해하기

JavaScript 코드는 기본적으로 작성된 순서를 따라 실행되는 흐름을 생각할
수 있다.

``` ts
console.log("1");
console.log("2");
console.log("3");
```

결과:

``` text
1
2
3
```

먼저 이런 단순한 흐름을 기준점으로 잡고, 시간이 걸리는 작업이 들어왔을
때 무엇이 달라지는지 비교한다.

**팁:** 비동기를 바로 외우지 말고 먼저
`지금 코드가 순서대로 실행된다면 어떤 결과가 나올까?`를 예측한다.

------------------------------------------------------------------------

## STEP 2 --- 비동기 처리가 왜 필요한지 이해하기

실제 애플리케이션에는 바로 끝나지 않는 작업이 있다.

``` text
서버에서 주문 가져오기
파일 읽기
타이머 기다리기
데이터 저장 결과 기다리기
```

이런 작업이 끝날 때까지 프로그램 전체가 아무것도 하지 못한다면 사용자
경험이 나빠질 수 있다.

Day 15에서는 비동기 처리를
`결과가 나중에 준비되는 작업을 다루는 방법`이라는 관점에서 시작한다.

**팁:** 처음에는 비동기를 `동시에 여러 일을 한다`라고만 외우기보다
`결과를 지금 바로 받을 수 없는 작업을 다루는 흐름`이라고 이해한다.

------------------------------------------------------------------------

## STEP 3 --- 작은 비동기 예제로 실행 순서 관찰하기

`setTimeout`을 이용해 실행 순서를 관찰한다.

``` ts
console.log("시작");

setTimeout(() => {
  console.log("나중에 실행");
}, 1000);

console.log("끝");
```

예상 결과:

``` text
시작
끝
나중에 실행
```

코드에서 `setTimeout`이 가운데 있어도 callback의 실행 결과는 나중에
나타난다.

**팁:** 코드를 실행하기 전에 출력 순서를 직접 적어본 뒤 실제 결과와
비교한다.

------------------------------------------------------------------------

## STEP 4 --- Promise의 역할 이해하기

`Promise`는 비동기 작업의 결과를 다루기 위한 JavaScript 객체다.

초기에는 복잡한 내부 동작보다 다음 세 상태를 중심으로 이해한다.

``` text
pending
→ 아직 결과가 정해지지 않음

fulfilled
→ 작업 성공

rejected
→ 작업 실패
```

작은 예제:

``` ts
const orderPromise = new Promise((resolve) => {
  setTimeout(() => {
    resolve("주문 데이터");
  }, 1000);
});
```

이 시점에서 중요한 것은
`Promise = 미래에 성공하거나 실패할 결과를 표현한다`는 개념이다.

**팁:** Promise 문법을 한 번에 외우지 말고
`pending → fulfilled/rejected` 흐름을 먼저 그림으로 기억한다.

------------------------------------------------------------------------

## STEP 5 --- `async` 이해하기

함수 앞에 `async`를 붙이면 비동기 흐름을 다루는 함수로 만들 수 있으며,
`async` 함수는 Promise를 반환한다.

``` ts
async function loadOrders() {
  return "주문 데이터";
}
```

호출:

``` ts
const result = loadOrders();
console.log(result);
```

`result`를 단순 문자열이 아니라 Promise 관점에서 확인한다.

**팁:** `async = 기다린다`라고 외우지 않는다. 실제로 기다리는 표현은
다음 STEP의 `await`이고, `async`는 함수가 Promise 기반으로 동작하도록
만드는 핵심 키워드다.

------------------------------------------------------------------------

## STEP 6 --- `await` 이해하기

`await`는 Promise의 결과가 준비될 때까지 해당 `async` 함수 내부의 다음
진행을 기다리는 형태로 코드를 작성하게 해준다.

``` ts
function getOrder() {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("주문 데이터");
    }, 1000);
  });
}

async function loadOrder() {
  const order = await getOrder();
  console.log(order);
}
```

핵심 구조:

``` text
Promise를 반환하는 작업
↓
await
↓
완료된 결과
↓
다음 코드
```

**팁:** `await`를 보면
`이 표현식은 어떤 Promise의 결과를 기다리고 있는가?`를 확인한다.

------------------------------------------------------------------------

## STEP 7 --- `async / await` 실행 흐름 직접 추적하기

다음 코드의 출력 순서를 먼저 예상한다.

``` ts
console.log("A");

async function loadOrders() {
  console.log("B");

  const result = await Promise.resolve("orders");

  console.log("C");
  return result;
}

loadOrders();

console.log("D");
```

오늘의 목적은 정답을 암기하는 것이 아니라 `await` 전후에서 함수의 실행
흐름이 어떻게 달라지는지 관찰하는 것이다.

**팁:** 비동기 코드는 머릿속으로만 이해하기 어려울 수 있다.
`console.log()`를 여러 위치에 넣고 실행 순서를 눈으로 확인한다.

------------------------------------------------------------------------

## STEP 8 --- 실패하는 비동기 작업과 `try / catch`

서버 통신 같은 비동기 작업은 항상 성공한다고 가정할 수 없다.

``` ts
async function loadOrders() {
  try {
    const orders = await getOrders();
    console.log(orders);
  } catch (error) {
    console.error("주문을 불러오지 못했습니다.", error);
  }
}
```

역할:

``` text
try
→ 성공할 수도 실패할 수도 있는 작업 시도

await
→ 비동기 결과 기다리기

catch
→ 발생한 오류 처리
```

**팁:** `try / catch`를 단순 문법으로 보지 말고
`성공 경로와 실패 경로를 나누는 구조`라고 생각한다.

------------------------------------------------------------------------

## STEP 9 --- 쇼핑몰 프로젝트와 연결해서 생각하기

Day 15에서는 API를 본격 구현하지 않지만 앞으로 주문 데이터를 서버에서
가져온다고 가정해 흐름을 생각한다.

``` text
현재

useOrders
↓
로컬 데이터 / state
↓
AdminOrdersPage

앞으로

useOrders
↓
비동기 주문 요청
↓
Promise
↓
await
↓
orders state 업데이트
↓
AdminOrdersPage
```

Day 14에서 만든 로직 분리가 이후 비동기 데이터 처리와 연결될 수 있다는
큰 그림을 확인한다.

**팁:** 아직 `fetch()` 구현에 욕심내지 않는다. Day 15의 목표는 API가
아니라 `비동기 결과를 어떻게 기다리고 처리하는가`를 이해하는 것이다.

------------------------------------------------------------------------

## STEP 10 --- Day 15 최종 실습

작은 가짜 주문 요청 함수를 만든다.

``` ts
type SimpleOrder = {
  id: number;
  status: string;
};

function getOrders(): Promise<SimpleOrder[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, status: "결제완료" },
        { id: 2, status: "배송중" },
      ]);
    }, 1000);
  });
}

async function loadOrders() {
  try {
    console.log("주문 요청 시작");

    const orders = await getOrders();

    console.log("주문 요청 완료");
    console.log(orders);
  } catch (error) {
    console.error("주문 요청 실패", error);
  }
}

loadOrders();
```

이 실습에서는 실제 서버 대신 `Promise + setTimeout`으로 서버 응답을 흉내
낸다.

**팁:** 코드를 복사해서 끝내지 말고 `getOrders()`가 무엇을 반환하는지,
`await`가 무엇을 기다리는지, 성공하면 어디로 가고 실패하면 어디로 가는지
한 줄씩 설명한다.

------------------------------------------------------------------------

## Day 15 완료 체크리스트

``` text
[ ] 동기와 비동기의 차이를 자기 말로 설명할 수 있다
[ ] 비동기 처리가 왜 필요한지 설명할 수 있다
[ ] setTimeout 예제의 실행 순서를 예상할 수 있다
[ ] Promise가 무엇을 표현하는지 설명할 수 있다
[ ] pending / fulfilled / rejected를 구분할 수 있다
[ ] async 함수가 Promise를 반환한다는 것을 이해한다
[ ] await의 역할을 설명할 수 있다
[ ] try / catch가 필요한 이유를 설명할 수 있다
[ ] 작은 Promise 예제를 async / await로 처리할 수 있다
[ ] Day 14의 useOrders와 미래의 비동기 주문 요청이 어떻게 연결될지 설명할 수 있다
```

**팁:** 모든 문법을 암기했는지가 아니라
`Promise → async → await → try/catch`의 관계를 말로 설명할 수 있는지를
완료 기준으로 삼는다.

------------------------------------------------------------------------

## Day 15 핵심 한 문장

> **비동기 처리는 결과가 즉시 준비되지 않는 작업을 다루는 방식이며,
> Promise는 그 미래의 결과를 표현하고 `async / await`는 그 결과를 읽기
> 쉬운 흐름으로 다루게 해주며 `try / catch`는 실패를 처리한다.**

다음 Day에서는 이 기초를 HTTP와 API 개념으로 연결할 준비를 한다.
