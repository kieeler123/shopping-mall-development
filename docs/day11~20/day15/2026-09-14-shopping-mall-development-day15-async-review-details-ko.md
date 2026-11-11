# Day 15 복습문제 — JavaScript 비동기 처리

> 각 STEP의 정답은 `<details>`를 열어서 확인할 수 있습니다.

## STEP 1

**Q1. 다음 코드의 출력 순서는 무엇인가요?**

```ts
console.log("A");
console.log("B");
console.log("C");
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A1.** `A → B → C`입니다.

특별한 비동기 동작이 없다면 JavaScript는 기본적으로 위에서 아래로 실행됩니다.

**팁:** 기본 출발점은 항상 `위 → 아래`입니다.

</details>

## STEP 2

**Q2. 다음 코드의 출력 순서는 무엇인가요?**

```ts
console.log("A");

setTimeout(() => {
  console.log("B");
}, 1000);

console.log("C");
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A2.** `A → C → B`입니다.

`setTimeout()`은 callback을 나중에 실행하도록 등록하고, 현재 코드는 계속 진행됩니다.

**팁:** `setTimeout 실행`과 `callback 실행`을 분리해서 생각하세요.

</details>

## STEP 3

**Q3. `printOrder`와 `printOrder()`의 차이는 무엇인가요?**

```ts
const printOrder = () => {
  console.log("주문");
};

setTimeout(printOrder, 1000);
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A3.** `printOrder`는 함수 자체를 값으로 전달하는 것이고, `printOrder()`는 그 자리에서 함수를 호출하는 것입니다.

**팁:** `함수명 = 함수 자체`, `함수명() = 지금 호출`입니다.

</details>

## STEP 4

**Q4. 명시적인 `return`이 없는 함수는 무엇을 반환하나요?**

```ts
function getStatus() {
  console.log("배송중");
}

const result = getStatus();
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A4.** `undefined`를 반환합니다. `console.log()`로 값을 출력하는 것과 함수가 값을 반환하는 것은 서로 다른 동작입니다.

**팁:** `console.log = 출력`, `return = 반환`으로 구분하세요.

</details>

## STEP 5

**Q5. 왜 `order`에는 `"주문 데이터"`가 들어가지 않나요?**

```ts
function getOrder() {
  setTimeout(() => {
    return "주문 데이터";
  }, 1000);
}

const order = getOrder();
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A5.** 바깥 `getOrder()`가 먼저 종료되어 `undefined`를 반환하기 때문입니다. 1초 후의 `return "주문 데이터"`는 `setTimeout` callback 자신의 return입니다.

**팁:** `return`을 보면 항상 어느 함수의 return인지 확인하세요.

</details>

## STEP 6

**Q6. Promise는 무엇을 표현하는 객체인가요?**

```ts
function getOrder() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("주문 데이터");
    }, 1000);
  });
}
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A6.** Promise는 미래에 결정될 비동기 작업의 결과를 표현하는 객체입니다. 호출 직후에는 Promise를 받고, 실제 결과는 나중에 결정될 수 있습니다.

**팁:** `Promise 객체`와 `Promise의 최종 결과값`을 구분하세요.

</details>

## STEP 7

**Q7. Promise의 세 가지 상태와 가능한 상태 변화를 설명해보세요.**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A7.** 상태는 `pending`, `fulfilled`, `rejected`입니다.

```text
pending
├─→ fulfilled
└─→ rejected
```

한번 fulfilled 또는 rejected가 되면 다른 상태로 다시 바뀌지 않습니다.

**팁:** Promise는 처음에는 `pending`, 이후 성공 또는 실패 중 하나로 확정됩니다.

</details>

## STEP 8

**Q8. `resolve()`와 `reject()`는 현재 함수를 종료하나요?**

```ts
new Promise((resolve, reject) => {
  resolve("성공");
  console.log("A");
});
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A8.** 아닙니다. `resolve()`와 `reject()`는 Promise의 상태를 결정하지만 현재 함수 자체를 종료하지 않습니다. 따라서 위 코드의 `A`도 실행됩니다.

**팁:** `resolve/reject = Promise 상태 결정`, `return = 함수 종료`입니다.

</details>

## STEP 9

**Q9. 다음 코드의 출력 순서와 Promise 상태는 무엇인가요?**

```ts
console.log("A");

const promise = new Promise((resolve) => {
  console.log("B");
  resolve("성공");
  console.log("C");
});

console.log("D");
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A9.** 출력은 `A → B → C → D`이고 Promise는 `fulfilled`, 결과는 `"성공"`입니다. Promise executor는 Promise를 생성하는 순간 즉시 실행됩니다.

**팁:** `new Promise()` 내부가 전부 자동으로 비동기가 되는 것은 아닙니다.

</details>

## STEP 10

**Q10. `async` 함수가 일반 값을 return하면 호출 결과는 무엇인가요?**

```ts
async function getStatus() {
  return "배송중";
}

const result = getStatus();
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A10.** `result`는 문자열 자체가 아니라 `fulfilled` Promise입니다. 그 Promise의 성공 결과가 `"배송중"`입니다.

**팁:** `async 함수는 항상 Promise를 반환한다`를 핵심 규칙으로 기억하세요.

</details>

## STEP 11

**Q11. `await`는 JavaScript 전체를 멈추나요?**

```ts
async function test() {
  const result = await getOrder();
  console.log(result);
}
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A11.** 아닙니다. `await`는 현재 async 함수의 이후 진행을 기다리게 합니다. JavaScript 전체가 멈추는 것은 아닙니다.

**팁:** `함수 호출 → Promise → await → 나중에 재개`로 읽으세요.

</details>

## STEP 12

**Q12. 다음 두 작업은 기본적으로 순차 실행일까요, 동시에 시작될까요?**

```ts
const a = await getA();
const b = await getB();
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A12.** 순차 실행입니다. `getA()`가 완료되어 첫 번째 await가 끝난 뒤 `getB()`가 호출됩니다.

**팁:** 두 번째 작업이 첫 번째 결과에 의존하지 않는다면 함께 시작할 방법을 고려할 수 있습니다.

</details>

## STEP 13

**Q13. `Promise.all()`은 언제 사용하며 하나가 실패하면 어떻게 되나요?**

```ts
const [orders, users] = await Promise.all([
  getOrders(),
  getUsers(),
]);
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A13.** 서로 독립적인 여러 Promise를 함께 시작하고 모두 완료되기를 기다릴 때 유용합니다. 하나라도 reject되면 `Promise.all()`이 반환한 Promise도 reject됩니다. 결과 배열은 입력 순서를 유지합니다.

**팁:** 작업 사이에 의존성이 없는지 먼저 확인하세요.

</details>

## STEP 14

**Q14. await한 Promise가 reject되면 `try` 안의 이후 코드는 어떻게 되나요?**

```ts
try {
  const orders = await getOrders();
  console.log(orders);
  console.log("완료");
} catch (error) {
  console.log("조회 실패");
}
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A14.** reject가 발생한 await 지점에서 `try`의 정상 흐름이 중단되고 `catch`로 이동합니다. 따라서 그 이후의 `console.log(orders)`와 `console.log("완료")`는 실행되지 않습니다.

**팁:** `try` 안에서 정확히 어디에서 실패했는지 찾으세요.

</details>

## STEP 15

**Q15. `throw`와 `reject()`의 중요한 차이는 무엇인가요?**

```ts
reject("실패");
console.log("A");

// 비교
throw new Error("실패");
console.log("B");
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A15.** `reject()`는 Promise를 rejected로 만들지만 현재 함수를 자동 종료하지 않습니다. `throw`는 에러를 발생시키며 현재의 정상 실행 흐름을 중단합니다.

**팁:** `reject = Promise 상태`, `throw = 에러 발생 + 정상 흐름 중단`입니다.

</details>

## STEP 16

**Q16. `new Error("서버 연결 실패")`와 `throw`의 역할을 각각 설명해보세요.**

```ts
throw new Error("서버 연결 실패");
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A16.** `new Error(...)`는 Error 객체를 만들고, `throw`는 그 객체를 던져 에러를 발생시킵니다. 대표 속성으로 `name`, `message`, `stack`이 있습니다.

**팁:** `Error 객체 생성`과 `에러를 던지는 행위`를 분리해서 생각하세요.

</details>

## STEP 17

**Q17. TypeScript에서 catch한 `error`의 `message`를 안전하게 사용하려면 어떻게 할 수 있나요?**

```ts
try {
  await getOrders();
} catch (error) {
  // ?
}
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A17.** 예를 들어 `error instanceof Error`로 확인할 수 있습니다.

```ts
if (error instanceof Error) {
  console.log(error.message);
}
```

**팁:** `error.message`에서 타입 문제가 생기면 `instanceof Error`를 떠올리세요.

</details>

## STEP 18

**Q18. `finally`는 언제 실행되며 React에서 어떤 작업에 유용한가요?**

```ts
setLoading(true);

try {
  const orders = await getOrders();
  setOrders(orders);
} catch (error) {
  console.error(error);
} finally {
  setLoading(false);
}
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A18.** `finally`는 성공과 실패에 관계없이 마지막에 실행됩니다. 따라서 로딩 종료처럼 성공해도 실패해도 반드시 수행해야 하는 마무리 작업에 유용합니다.

**팁:** `성공해도 해야 하고 실패해도 해야 하는가?`를 finally 판단 기준으로 사용하세요.

</details>

## STEP 19

**Q19. 다음 코드의 출력 순서를 맞혀보세요.**

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

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A19.** `A → 1 → 2 → B → 3 → 4`입니다.

`getData()`의 본문은 호출되면서 실행되어 `2`가 출력됩니다. async 함수 내부의 `throw`는 rejected Promise로 이어지고, `await` 이후 `test()`의 진행은 잠시 미뤄집니다. 그 사이 바깥의 `B`가 먼저 실행되고 이후 `catch`의 `3`, 마지막으로 `4`가 실행됩니다.

**팁:** `함수 호출 → Promise 상태 → await → 바깥 동기 코드 → async 함수 재개` 순서로 추적하세요.

</details>

## STEP 20

**Q20. 다음 코드에서 Day 15의 핵심 개념들을 각각 설명해보세요.**

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

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A20.** `async`는 함수가 Promise를 반환하게 하고, `Promise.all()`은 독립적인 Promise들을 함께 기다립니다. `await`는 그 Promise의 결과가 결정될 때까지 `loadOrders`의 이후 진행을 기다리게 합니다. 성공하면 state를 갱신하고, 실패하면 `catch`에서 처리하며, `finally`에서 성공/실패와 관계없이 로딩을 종료합니다.

**팁:** 이 코드를 `로딩 시작 → 요청 → 기다림 → 성공/실패 처리 → 마무리`라는 업무 흐름으로 읽어보세요.

</details>

## STEP 21

**Q21. `setTimeout(..., 0)`의 출력 순서는 무엇인가요?**

```ts
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A21.** `A → C → B`입니다. 0ms여도 callback은 현재 동기 코드가 끝난 뒤 실행될 기회를 얻습니다.

**팁:** `0ms`를 현재 줄에서 즉시 실행된다는 뜻으로 해석하지 마세요.

</details>

## STEP 22

**Q22. executor에서 `return "성공"`만 하면 Promise가 fulfilled가 되나요?**

```ts
const promise = new Promise((resolve) => {
  return "성공";
});
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A22.** 아닙니다. executor의 일반 return 값은 Promise 결과로 사용되지 않습니다. `resolve()`가 없으므로 Promise는 `pending` 상태로 남습니다.

**팁:** Promise 결과는 executor의 return이 아니라 `resolve/reject`가 결정합니다.

</details>

## STEP 23

**Q23. 최종 Promise 상태는 무엇인가요?**

```ts
new Promise((resolve, reject) => {
  reject("실패");
  resolve("성공");
});
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A23.** 최종 상태는 `rejected`이고 실패 이유는 `"실패"`입니다. 먼저 실행된 settlement가 최종 상태를 결정합니다.

**팁:** Promise는 한 번 settled되면 뒤의 resolve/reject가 상태를 바꾸지 못합니다.

</details>

## STEP 24

**Q24. 출력 순서와 `C`의 실행 여부는?**

```ts
new Promise((resolve) => {
  console.log("A");
  resolve("성공");
  console.log("B");
  return;
  console.log("C");
});
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A24.** `A → B`입니다. `resolve()`는 함수를 종료하지 않지만 `return`은 종료하므로 `C`는 실행되지 않습니다.

**팁:** `resolve = Promise 상태 결정`, `return = 현재 함수 종료`로 분리하세요.

</details>

## STEP 25

**Q25. async 함수를 선언만 하면 본문이 실행되나요?**

```ts
async function getOrder() {
  console.log("A");
}
console.log("B");
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A25.** 아닙니다. 함수는 호출해야 실행됩니다. 따라서 출력은 `B`뿐입니다.

**팁:** `async`는 반환 방식을 바꾸지만 함수 선언 자체를 실행시키지는 않습니다.

</details>

## STEP 26

**Q26. 출력 순서와 `result`의 정체는?**

```ts
async function getStatus() {
  console.log("A");
  return "배송중";
}
console.log("B");
const result = getStatus();
console.log("C");
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A26.** `B → A → C`입니다. `result`는 `"배송중"`을 결과로 가진 fulfilled Promise입니다.

**팁:** async 함수도 호출되면 await를 만나기 전까지 본문이 바로 진행될 수 있습니다.

</details>

## STEP 27

**Q27. `result`에는 Promise와 문자열 중 무엇이 들어가나요?**

```ts
async function getStatus() {
  return "배송중";
}
async function test() {
  const result = await getStatus();
  console.log(result);
}
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A27.** `"배송중"`이 들어갑니다. `getStatus()`는 Promise를 반환하지만 await가 fulfilled 결과값을 꺼냅니다.

**팁:** `함수 호출 결과 = Promise`, `await 결과 = 성공 값`을 구분하세요.

</details>

## STEP 28

**Q28. `getOrder()`가 나중에 완료된다면 핵심 출력 순서는?**

```ts
async function printOrder() {
  console.log("A");
  const result = await getOrder();
  console.log("B");
}
console.log("C");
printOrder();
console.log("D");
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A28.** `C → A → D → B`입니다. `printOrder()`는 await에서 이후 진행을 미루고 바깥 동기 코드 `D`가 먼저 실행됩니다.

**팁:** async 함수를 `await 이전`과 `await 이후 재개` 두 구간으로 나누세요.

</details>

## STEP 29

**Q29. 각 `getOrder()`가 약 2초라면 전체는 대략 몇 초인가요?**

```ts
await getOrder();
await getOrder();
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A29.** 약 4초입니다. 첫 번째 await가 끝난 뒤 두 번째 `getOrder()`가 호출되는 순차 처리입니다.

**팁:** 두 번째 함수의 호출 시점이 첫 번째 완료 뒤인지 확인하세요.

</details>

## STEP 30

**Q30. 앞 문제와 달리 두 작업은 언제 시작되나요?**

```ts
const p1 = getOrder();
const p2 = getOrder();
await p1;
await p2;
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A30.** 두 함수가 await 전에 호출되므로 두 작업이 먼저 시작됩니다. 각각 약 2초라면 전체도 대략 2초 수준일 수 있습니다.

**팁:** 동시 시작 여부는 await보다 함수 호출 위치를 먼저 보세요.

</details>

## STEP 31

**Q31. `result` 배열은 완료 순서인가요, 입력 순서인가요?**

```ts
const result = await Promise.all([
  getOrder1(), // 2초
  getOrder2(), // 1초
]);
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A31.** 입력 순서입니다. 두 번째 작업이 먼저 끝나도 `[order1 결과, order2 결과]` 순서를 유지합니다.

**팁:** 완료 순서와 결과 배열 순서를 혼동하지 마세요.

</details>

## STEP 32

**Q32. 이 두 작업을 `Promise.all()`로 무조건 묶으면 안 되는 이유는?**

```ts
const user = await getUser();
const orders = await getOrders(user.id);
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A32.** `getOrders()`가 `user.id`에 의존하기 때문입니다. 두 번째 작업은 첫 번째 결과가 있어야 시작할 수 있습니다.

**팁:** `B가 A의 결과 없이 시작 가능한가?`를 먼저 물어보세요.

</details>

## STEP 33

**Q33. 출력 순서는 무엇인가요?**

```ts
async function getOrder() {
  console.log("A");
  throw new Error("조회 실패");
}
async function test() {
  try {
    console.log("B");
    await getOrder();
    console.log("C");
  } catch {
    console.log("D");
  }
  console.log("E");
}
test();
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A33.** `B → A → D → E`입니다. `C`는 실행되지 않습니다. async 함수의 throw는 rejected Promise로 이어지고 await 실패가 catch로 전달됩니다.

**팁:** await 실패 뒤에는 정상 다음 줄이 아니라 catch 흐름을 확인하세요.

</details>

## STEP 34

**Q34. 일반 함수의 `throw`와 async 함수 내부의 `throw`는 호출자에게 어떻게 다르게 보이나요?**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A34.** 일반 함수의 throw는 호출 중 동기적으로 에러를 발생시킵니다. async 함수의 throw는 그 함수가 반환하는 Promise를 rejected로 만듭니다.

**팁:** throw를 보면 먼저 해당 함수가 async인지 확인하세요.

</details>

## STEP 35

**Q35. 출력 순서는 무엇인가요?**

```ts
function getOrder() {
  console.log("A");
  throw new Error("조회 실패");
}
async function test() {
  console.log("B");
  try {
    await getOrder();
  } catch {
    console.log("C");
  }
  console.log("D");
}
console.log("E");
test();
console.log("F");
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A35.** `E → B → A → C → D → F`입니다. 일반 함수 호출 자체에서 동기적으로 throw가 발생하고 try가 즉시 잡습니다.

**팁:** `await`가 보여도 오른쪽 함수 호출에서 먼저 동기 에러가 날 수 있습니다.

</details>

## STEP 36

**Q36. 출력 순서는 무엇인가요?**

```ts
async function getOrder() {
  console.log("A");
  throw new Error("조회 실패");
}
async function test() {
  console.log("B");
  try {
    await getOrder();
  } catch {
    console.log("C");
  }
  console.log("D");
}
console.log("E");
test();
console.log("F");
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A36.** `E → B → A → F → C → D`입니다. async `getOrder()`의 `A`는 즉시 실행되지만 throw는 rejected Promise가 되고 test는 await에서 이후 진행을 미룹니다.

**팁:** 바로 앞 일반 함수 버전과 비교하면 차이가 선명합니다.

</details>

## STEP 37

**Q37. `catch(error)`가 받는 것은 문자열 메시지만인가요?**

```ts
try {
  throw new Error("조회 실패");
} catch (error) {
  // error는 무엇인가?
}
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A37.** 아닙니다. 여기서는 던져진 Error 객체 전체를 받습니다. ``error.message``가 `"조회 실패"`입니다.

**팁:** `throw new Error(...)`는 메시지만이 아니라 Error 객체를 던집니다.

</details>

## STEP 38

**Q38. `finally`는 성공과 실패 중 언제 실행되나요?**

```ts
try {
  await getOrders();
} catch (error) {
  console.error(error);
} finally {
  console.log("정리");
}
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A38.** 둘 다 실행됩니다. 성공해도 실행되고, 실패하여 catch를 거친 뒤에도 실행됩니다.

**팁:** 성공/실패 공통 마무리 작업이면 finally를 떠올리세요.

</details>

## STEP 39

**Q39. 정확한 출력 순서를 맞혀보세요.**

```ts
async function getOrder() {
  console.log("A");
  throw new Error("조회 실패");
}
async function test() {
  console.log("B");
  try {
    console.log("C");
    await getOrder();
    console.log("D");
  } catch {
    console.log("E");
  } finally {
    console.log("F");
  }
  console.log("G");
}
console.log("H");
test();
console.log("I");
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A39.** `H → B → C → A → I → E → F → G`입니다. async 함수 호출 시 `A`까지 즉시 실행되고, rejected Promise를 await하면서 test의 이후 진행이 미뤄져 `I`가 먼저 나옵니다.

**팁:** `async 본문 즉시 시작 + throw→rejected + await 이후 재개`를 함께 추적하세요.

</details>

## STEP 40

**Q40. Day 15 전체 비동기 흐름을 하나의 흐름으로 설명해보세요.**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A40.** `비동기 작업 → Promise(pending) → resolve/reject → fulfilled/rejected → await → 성공 결과 사용 또는 catch → finally 공통 마무리`입니다. async 함수의 return은 fulfilled 결과가 되고 throw는 반환 Promise를 rejected로 만듭니다.

**팁:** `Promise 상태`와 `실행 순서` 두 축으로 설명할 수 있으면 충분합니다.

</details>
