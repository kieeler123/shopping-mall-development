# Day 15 — JavaScript 비동기 처리 총정리

## 1. 동기 실행

기본적인 JavaScript 코드는 위에서 아래로 실행됩니다.

```ts
console.log("A");
console.log("B");
console.log("C");
```

결과:

```text
A
B
C
```

기본 원칙은 위에서 아래입니다. 하지만 서버 요청이나 타이머처럼 결과가 나중에 준비되는 작업에서는 비동기 개념이 필요합니다.

> **팁**
> 실행 순서 문제를 만나면 기본은 위→아래에서 출발하세요. 비동기 요소가 있는 지점에서만 흐름을 바꾸면 됩니다.

## 2. setTimeout과 비동기

```ts
console.log("A");

setTimeout(() => {
  console.log("B");
}, 1000);

console.log("C");
```

결과:

```text
A
C
B
```

`setTimeout()` 자체는 지금 실행되지만, 전달한 callback은 나중에 실행됩니다.

> **팁**
> `setTimeout 실행 ≠ callback 실행`입니다.

## 3. Callback

Callback은 다른 함수에 전달해서 특정 시점에 실행하도록 맡긴 함수입니다.

```ts
const printOrder = () => {
  console.log("주문");
};

setTimeout(printOrder, 1000);
```

`printOrder`는 함수 자체이고, `printOrder()`는 지금 함수를 호출하는 것입니다.

React에서도 같은 개념을 사용합니다.

```tsx
<button onClick={handleDelete}>삭제</button>
```

> **팁**
> `함수명 = 함수 자체`, `함수명() = 지금 호출`로 구분하세요.

## 4. return과 undefined

```ts
function getStatus() {
  return "배송중";
}
```

`return`은 값을 호출한 곳으로 돌려주고 현재 함수를 종료합니다.

명시적인 `return`이 없으면 함수의 반환값은 `undefined`입니다.

```ts
function getStatus() {
  console.log("배송중");
}
```

> **팁**
> `console.log()`는 출력, `return`은 반환입니다.

## 5. 비동기 작업과 일반 return의 한계

```ts
function getOrder() {
  setTimeout(() => {
    return "주문 데이터";
  }, 1000);
}

const order = getOrder();
console.log(order);
```

`getOrder()`는 먼저 끝나고 `undefined`를 반환합니다. 1초 후 callback에서 실행되는 `return`은 callback 자신의 반환입니다.

> **팁**
> 비동기 코드에서 `return`을 보면 어느 함수의 return인지 확인하세요.

## 6. Promise

Promise는 미래에 결정될 비동기 작업의 결과를 표현하는 객체입니다.

```ts
function getOrder() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("주문 데이터");
    }, 1000);
  });
}
```

`getOrder()`는 즉시 Promise를 반환하고, 실제 결과는 나중에 정해집니다.

> **팁**
> Promise 자체와 Promise의 결과값을 구분하세요.

## 7. Promise의 상태

| 상태 | 의미 |
|---|---|
| `pending` | 아직 결과가 결정되지 않음 |
| `fulfilled` | 성공 |
| `rejected` | 실패 |

상태 변화는 다음과 같습니다.

```text
pending
  ├─→ fulfilled
  └─→ rejected
```

한번 결정된 Promise 상태는 다시 바뀌지 않습니다.

> **팁**
> 가장 먼저 실행된 `resolve` 또는 `reject`가 Promise의 최종 상태를 결정합니다.

## 8. resolve와 reject

```ts
resolve("주문 데이터");
```

Promise를 `fulfilled`로 만듭니다.

```ts
reject(new Error("조회 실패"));
```

Promise를 `rejected`로 만듭니다.

중요하게도 `resolve()`와 `reject()`는 현재 함수를 종료하지 않습니다.

> **팁**
> `resolve/reject`는 Promise 상태를 결정하고, `return`은 현재 함수를 종료합니다.

## 9. new Promise()의 executor는 즉시 실행

```ts
console.log("A");

const promise = new Promise((resolve) => {
  console.log("B");
  resolve("성공");
  console.log("C");
});

console.log("D");
```

결과:

```text
A
B
C
D
```

Promise를 만든다고 내부 코드 전체가 자동으로 비동기가 되는 것은 아닙니다.

> **팁**
> `Promise = 모든 코드를 비동기로 만드는 장치`라고 생각하면 안 됩니다.

## 10. async

`async` 함수는 항상 Promise를 반환합니다.

```ts
async function getStatus() {
  return "배송중";
}
```

결과적으로 `fulfilled` Promise가 반환됩니다.

```ts
async function getStatus() {
  throw new Error("조회 실패");
}
```

이 경우 `rejected` Promise가 반환됩니다.

```text
return 값 → fulfilled Promise
throw error → rejected Promise
```

> **팁**
> `async`의 핵심은 “항상 Promise를 반환한다”입니다.

## 11. await

`await`는 Promise가 결정될 때까지 현재 async 함수의 이후 진행을 기다리게 하고, 성공하면 결과값을 꺼냅니다.

```ts
const result = await getOrder();
```

중요한 점은 JavaScript 전체가 멈추는 것이 아니라 해당 async 함수의 이후 진행만 기다린다는 것입니다.

> **팁**
> `await getOrder()`를 `함수 호출 → Promise 반환 → await → 이후 재개`로 나누어 보세요.

## 12. await가 여러 개일 때

```ts
const a = await getA();
const b = await getB();
```

이 코드는 순차 처리입니다.

```text
getA 시작
↓
A 완료
↓
getB 시작
↓
B 완료
```

서로 독립적이라면 Promise를 먼저 만들 수 있습니다.

```ts
const promiseA = getA();
const promiseB = getB();

const a = await promiseA;
const b = await promiseB;
```

> **팁**
> 두 번째 작업이 첫 번째 결과에 의존하는지 확인하세요.

## 13. Promise.all()

독립적인 여러 Promise가 모두 완료되기를 한 번에 기다릴 때 사용합니다.

```ts
const [orders, users] = await Promise.all([
  getOrders(),
  getUsers(),
]);
```

결과 배열은 완료된 순서가 아니라 입력한 순서를 유지합니다.

하나라도 실패하면 `Promise.all()` 전체가 `rejected` 됩니다.

> **팁**
> `Promise.all()`은 서로 의존하지 않는 작업에 적합합니다.

## 14. try/catch

```ts
async function loadOrders() {
  try {
    const orders = await getOrders();
    console.log(orders);
  } catch (error) {
    console.log("조회 실패");
  }
}
```

Promise가 실패하면 `await` 지점에서 정상 흐름이 중단되고 `catch`로 이동합니다.

> **팁**
> `try` 안에서 어디에서 실패했는지 찾으면 실행되지 않는 나머지 코드를 쉽게 판단할 수 있습니다.

## 15. throw

`throw`는 에러를 발생시키고 현재의 정상 실행 흐름을 중단합니다.

```ts
console.log("A");
throw new Error("실패");
console.log("B");
```

`B`는 실행되지 않습니다.

| 코드 | 역할 | 이후 코드 |
|---|---|---|
| `return` | 현재 함수 종료 | 실행 안 됨 |
| `resolve(value)` | Promise 성공 | 실행 가능 |
| `reject(error)` | Promise 실패 | 실행 가능 |
| `throw error` | 에러 발생 | 정상 흐름 중단 |

> **팁**
> `reject`는 Promise 상태 변경, `throw`는 에러 발생 + 정상 흐름 중단입니다.

## 16. Error 객체

```ts
const error = new Error("서버 연결 실패");
```

대표 정보:

```text
error.name
error.message
error.stack
```

`throw new Error("실패")`는 Error 객체를 생성한 뒤 그 객체를 던지는 것입니다.

> **팁**
> `new Error(...)`와 `throw`를 두 단계로 나누어 생각하세요.

## 17. TypeScript의 catch(error)

TypeScript에서는 `catch`의 `error`가 항상 Error 객체라고 보장할 수 없기 때문에 확인이 필요할 수 있습니다.

```ts
try {
  await getOrders();
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
```

> **팁**
> `error.message`에 문제가 생기면 `error instanceof Error`를 떠올리세요.

## 18. finally

`finally`는 성공하든 실패하든 마지막에 실행됩니다.

```ts
async function loadOrders() {
  setLoading(true);

  try {
    const orders = await getOrders();
    setOrders(orders);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}
```

> **팁**
> 성공/실패와 관계없이 반드시 해야 하는 마무리 작업에 `finally`가 잘 맞습니다.

## 19. 실행 순서 예제

```ts
async function getData() {
  console.log("2");
  throw new Error("실패");
}

async function test() {
  console.log("1");

  try {
    await getData();
  } catch {
    console.log("3");
  }

  console.log("4");
}

console.log("A");
test();
console.log("B");
```

결과:

```text
A
1
2
B
3
4
```

핵심은 `await` 이후 진행이 잠시 멈추고 바깥 동기 코드가 먼저 진행될 수 있다는 점입니다.

> **팁**
> 실행 순서는 `함수 호출 → Promise 상태 → await → 바깥 코드 → 재개` 순서로 추적하세요.

## 20. 실제 코드로 연결

```ts
async function loadOrders() {
  setLoading(true);

  try {
    const [orders, users] = await Promise.all([
      fetchOrders(),
      fetchUsers(),
    ]);

    setOrders(orders);
    setUsers(users);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  } finally {
    setLoading(false);
  }
}
```

이 코드에는 Day 15의 핵심 개념이 거의 모두 들어 있습니다.

## Day 15 핵심 지도

```text
비동기 작업
   ↓
Promise
   ↓
pending
 ├─ resolve → fulfilled
 └─ reject  → rejected
          ↓
         await
      ┌────┴────┐
      ↓         ↓
     성공       실패
      ↓         ↓
    결과 사용   catch
      └────┬────┘
           ↓
        finally
```

`async` 함수에서는:

```text
return 값  → fulfilled Promise
throw Error → rejected Promise
```

## 최종 핵심 3문장

1. Promise는 미래의 결과를 표현한다.
2. await는 JavaScript 전체가 아니라 현재 async 함수의 이후 진행을 기다리게 한다.
3. 성공은 fulfilled, 실패는 rejected이며 try/catch로 실패를 처리할 수 있다.

**Day 15 — 비동기 처리 기초: 완료**
