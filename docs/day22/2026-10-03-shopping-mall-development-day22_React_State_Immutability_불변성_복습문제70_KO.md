# Day 22 --- React State 업데이트와 불변성 복습 문제 70제

> 먼저 문제를 스스로 풀고, 각 문제 아래의 `<details>`를 열어 정답과
> 해설을 확인한다.

> 먼저 스스로 답한 뒤 `<details>`를 열어 정답과 해설을 확인한다.

## Part 1. 핵심 개념

### 문제 1

다음 코드에서 `orders`의 역할은 무엇인가?

``` ts
const [orders, setOrders] = useState<Order[]>([]);
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
`orders`는 현재 렌더링에서 사용하는 State 값이다. 타입은 `Order[]`이며
초기값은 빈 배열 `[]`이다.

**팁:** `orders = 현재 State`라고 먼저 떠올린다.

```{=html}
</details>
```
### 문제 2

`setOrders`의 역할은 무엇인가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
`setOrders`는 React에게 `orders` State 업데이트를 요청하는 setter
함수다. 새로운 State를 직접 변수에 대입하는 대신 setter를 사용한다.

**팁:** `setOrders = 값`이 아니라
`setOrders = State 업데이트를 요청하는 함수`다.

```{=html}
</details>
```
### 문제 3

`setOrders` 실행 후의 흐름을 순서대로 설명하라.

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
대표적인 흐름은 다음과 같다.

``` text
setOrders 실행
↓
State 업데이트
↓
컴포넌트 재렌더링
↓
새로운 State를 기준으로 JSX 계산
↓
UI 반영
```

**팁:** setter를 보면 UI까지 한 번에 연결해서 생각한다.

```{=html}
</details>
```
### 문제 4

React State에서 불변성이란 무엇인가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
기존 State를 직접 수정하지 않고 변경 결과를 반영한 새로운 배열이나
객체를 만들어 State를 업데이트하는 방식이다.

``` text
기존 State 직접 수정 X
→ 새로운 값 생성
→ setter에 전달
```

**팁:** `기존 것 수정 X → 새것 생성 → setter`로 압축한다.

```{=html}
</details>
```
### 문제 5

다음 코드가 State 업데이트 방식으로 권장되지 않는 이유는?

``` ts
orders[0].status = "SHIPPED";
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
기존 State 내부의 객체를 직접 수정하기 때문이다. 오늘 학습 범위에서는
기존 State를 직접 변경하지 않고 변경된 결과를 담은 새로운 배열/객체를
만들어 setter에 전달하는 방식을 사용한다.

**팁:** 코드를 볼 때 `기존 State를 직접 건드리는가?`를 먼저 확인한다.

```{=html}
</details>
```
### 문제 6

`Order[]`와 `Order`의 차이를 설명하라.

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
`Order[]`는 여러 `Order` 객체를 담은 배열이고, `Order`는 주문 객체
하나다.

``` ts
prevOrders   // Order[]
order        // Order
updatedOrder // Order
newOrder     // Order
```

**팁:** 복수형과 단수형 변수명을 활용해 타입을 구분한다.

```{=html}
</details>
```
### 문제 7

`prevOrders`는 React의 예약어인가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
아니다. updater 함수의 매개변수 이름일 뿐이다.

``` ts
setOrders((currentOrders) => {
  return [...currentOrders, newOrder];
});
```

처럼 다른 이름을 사용해도 된다.

**팁:** 이름은 바꿀 수 있지만 역할이 드러나는 이름을 사용한다.

```{=html}
</details>
```
### 문제 8

`prevOrders` 값은 누가 전달하는가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
`setOrders`에 updater 함수를 전달하면 React가 updater 함수를 호출하면서
이전 State 값을 인자로 전달한다.

**팁:** `React → updater 호출 → 이전 State 전달 → prevOrders가 받음`
순서로 기억한다.

```{=html}
</details>
```
### 문제 9

현재 `orders`가 `Order[]`라면 `prevOrders`의 타입은 무엇인가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
`Order[]`다. `prevOrders`는 이전 `orders` State를 전달받기 때문이다.

**팁:** State의 타입과 updater가 전달받는 이전 State의 타입은 연결되어
있다.

```{=html}
</details>
```
### 문제 10

다음 코드에서 updater 함수는 어느 부분인가?

``` ts
setOrders((prevOrders) => [
  ...prevOrders,
  newOrder,
]);
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
다음 전체 함수가 updater 함수다.

``` ts
(prevOrders) => [
  ...prevOrders,
  newOrder,
]
```

`prevOrders`만 updater가 아니다. `prevOrders`는 updater 함수의
매개변수다.

**팁:** `매개변수`와 `함수 전체`를 구분한다.

```{=html}
</details>
```

------------------------------------------------------------------------

## Part 2. spread와 추가

### 문제 11

다음 코드에서 `...prevOrders`의 역할은?

``` ts
[
  ...prevOrders,
  newOrder,
]
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
기존 `prevOrders` 배열의 요소들을 새로운 배열 안에 펼친다.

**팁:** spread는 `추가` 자체가 아니라 `기존 요소를 펼치는 것`이다.

```{=html}
</details>
```
### 문제 12

`...prevOrders` 자체가 새로운 주문을 추가하는 기능인가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
아니다. `...prevOrders`는 기존 요소들을 펼친다. 새로운 주문이 추가되는
이유는 뒤에 `newOrder`를 별도로 작성했기 때문이다.

``` ts
[...prevOrders, newOrder]
```

**팁:** spread와 추가되는 값을 따로 본다.

```{=html}
</details>
```
### 문제 13

다음 코드의 결과를 쓰시오.

``` ts
const prevOrders = [{ id: 1 }, { id: 2 }];
const newOrder = { id: 3 };

const result = [...prevOrders, newOrder];
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
``` ts
[
  { id: 1 },
  { id: 2 },
  { id: 3 },
]
```

`prevOrders` 자체를 수정한 것이 아니라 새로운 배열을 만든다.

**팁:** 결과 배열과 기존 배열을 구분한다.

```{=html}
</details>
```
### 문제 14

다음 두 코드의 결과 순서는 어떻게 다른가?

``` ts
[...prevOrders, newOrder]
```

``` ts
[newOrder, ...prevOrders]
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
첫 번째는 `newOrder`가 마지막에 추가되고, 두 번째는 `newOrder`가 처음에
추가된다.

**팁:** spread가 쓰인 위치와 새 요소의 위치를 그대로 읽는다.

```{=html}
</details>
```
### 문제 15

`[...prevOrders]`만 작성하면 어떤 결과가 생기는가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
기존 배열의 요소들을 가진 새로운 배열이 만들어진다. 새로운 요소는
추가되지 않는다.

**팁:** spread 뒤에 추가 값이 없으면 요소 추가가 일어나지 않는다.

```{=html}
</details>
```
### 문제 16

추가 코드가 불변성을 유지하는 이유를 설명하라.

``` ts
setOrders((prevOrders) => [...prevOrders, newOrder]);
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
기존 `prevOrders`를 직접 수정하지 않고 기존 요소와 `newOrder`를 담은
새로운 배열을 만들어 다음 State로 사용하기 때문이다.

**팁:** `기존 배열 유지 → 새 배열 생성`을 반드시 포함해 설명한다.

```{=html}
</details>
```

------------------------------------------------------------------------

## Part 3. `map()`과 수정

### 문제 17

`map()`의 기본 역할을 설명하라.

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
기존 배열의 각 요소를 하나씩 처리하고 각 실행에서 반환한 값을 모아
새로운 배열을 만드는 메서드다.

**팁:** `각 요소 → 반환값 → 새 배열` 세 단계로 기억한다.

```{=html}
</details>
```
### 문제 18

`map()`은 기존 배열 자체를 반환하는가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
아니다. `map()`은 새로운 배열을 반환한다.

**팁:** `map = 새 배열`을 기본 전제로 둔다.

```{=html}
</details>
```
### 문제 19

다음 배열에서 `map()` 콜백은 몇 번 실행되는가?

``` ts
[
  { id: 1 },
  { id: 2 },
  { id: 3 },
]
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
3번 실행된다. 배열 요소가 3개이기 때문이다.

**팁:** 기본적으로 요소 하나당 콜백 한 번이라고 생각한다.

```{=html}
</details>
```
### 문제 20

다음 코드에서 `order`에는 무엇이 들어오는가?

``` ts
prevOrders.map((order) => ...)
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
`prevOrders` 배열의 각 요소인 `Order` 객체 하나가 순서대로 들어온다.

`order`에 배열 전체가 들어오는 것이 아니다.

**팁:** `prevOrders = Order[]`, `order = Order`.

```{=html}
</details>
```
### 문제 21

`map()`이 `order` 객체를 새로 생성하는가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
아니다. `map()`의 콜백 매개변수 `order`는 기존 배열의 각 요소를
전달받는다.

**팁:** `map이 객체 생성`이 아니라 `기존 요소를 하나씩 받음`이다.

```{=html}
</details>
```
### 문제 22

다음 코드의 결과는 기존 배열과 같은 배열인가?

``` ts
const result = prevOrders.map((order) => order);
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
배열 자체는 새로운 배열이다. 각 요소로 기존 `order` 객체를 그대로
반환했기 때문에 내부 객체는 기존 객체를 그대로 사용할 수 있지만,
`result` 배열 자체는 `prevOrders`와 다른 배열이다.

**팁:** `배열 자체`와 `배열 안 객체`를 분리해서 생각한다.

```{=html}
</details>
```
### 문제 23

다음 비교식의 목적은?

``` ts
order.id === updatedOrder.id
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
현재 `map()`에서 보고 있는 주문이 수정하려는 주문과 같은 주문인지
식별하기 위한 것이다.

**팁:** `이 order가 수정 대상인가?`라고 읽는다.

```{=html}
</details>
```
### 문제 24

왜 `status`보다 `id`를 사용해 수정 대상을 찾는가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
`status`는 여러 주문이 같은 값을 가질 수 있지만, `id`는 각 주문을
구별하는 고유 식별값으로 사용할 수 있기 때문이다.

**팁:** 수정 대상 탐색에는 `값의 상태`보다 `대상의 정체성`을 나타내는
식별자가 필요하다.

```{=html}
</details>
```
### 문제 25

다음 식에서 조건이 참이면 무엇을 반환하는가?

``` ts
order.id === updatedOrder.id
  ? updatedOrder
  : order
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
`updatedOrder`를 반환한다. 현재 주문이 수정 대상이므로 수정된 주문
객체로 교체하기 위해서다.

**팁:** `?` 뒤는 조건이 참일 때의 값이다.

```{=html}
</details>
```
### 문제 26

조건이 거짓이면 왜 기존 `order`를 반환하는가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
수정 대상이 아닌 주문은 그대로 유지해야 하기 때문이다. `map()`은
반환값을 새 배열에 넣으므로 기존 주문을 유지하려면 기존 `order`를
반환한다.

**팁:** `: order = 수정하지 않는 데이터 보존`.

```{=html}
</details>
```
### 문제 27

다음 삼항 연산자를 `if/else`로 바꾸시오.

``` ts
order.id === updatedOrder.id
  ? updatedOrder
  : order
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
``` ts
if (order.id === updatedOrder.id) {
  return updatedOrder;
} else {
  return order;
}
```

**팁:** 삼항 연산자가 읽히지 않으면 `if/else`로 풀어본다.

```{=html}
</details>
```
### 문제 28

`===`는 무엇을 비교하는가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
값과 타입이 모두 같은지 비교한다.

``` ts
2 === 2   // true
2 === "2" // false
```

**팁:** `엄격한 동등 비교`라고 기억한다.

```{=html}
</details>
```
### 문제 29

다음 코드에서 `updatedOrder.id`가 `2`일 때 `map()`의 각 비교 결과를
쓰시오.

``` ts
[
  { id: 1 },
  { id: 2 },
  { id: 3 },
]
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
``` text
1 === 2 → false → 기존 order
2 === 2 → true  → updatedOrder
3 === 2 → false → 기존 order
```

**팁:** 요소마다 조건식을 실제 값으로 치환해서 읽는다.

```{=html}
</details>
```
### 문제 30

다음 코드의 최종 결과를 쓰시오.

``` ts
const prevOrders = [
  { id: 1, status: "PAID" },
  { id: 2, status: "PREPARING" },
  { id: 3, status: "SHIPPED" },
];

const updatedOrder = {
  id: 2,
  status: "SHIPPED",
};

const result = prevOrders.map((order) =>
  order.id === updatedOrder.id
    ? updatedOrder
    : order
);
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
``` ts
[
  { id: 1, status: "PAID" },
  { id: 2, status: "SHIPPED" },
  { id: 3, status: "SHIPPED" },
]
```

`id: 2`인 요소만 `updatedOrder`로 교체된다.

**팁:** 먼저 ID 비교 결과를 적고 최종 배열을 만든다.

```{=html}
</details>
```

------------------------------------------------------------------------

## Part 4. `null`, 반환값, 새 배열

### 문제 31

`map()`에서 `return null`은 아무것도 반환하지 않는다는 뜻인가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
아니다. `null`이라는 값을 반환하는 것이다.

``` ts
[1, 2, 3].map(() => null);
// [null, null, null]
```

**팁:** `null`도 하나의 반환값이다.

```{=html}
</details>
```
### 문제 32

다음 코드에서 `updatedOrder.id = 2`라면 결과는?

``` ts
prevOrders.map((order) =>
  order.id === updatedOrder.id
    ? updatedOrder
    : null
);
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
개념적으로:

``` ts
[
  null,
  updatedOrder,
  null,
]
```

이 된다. ID가 다른 요소는 사라지는 것이 아니라 `null`로 바뀐다.

**팁:** `map()`은 각 실행의 반환값을 새 배열에 넣는다.

```{=html}
</details>
```
### 문제 33

요소를 새 배열에서 완전히 제외하고 싶다면 `map()`과 `filter()` 중 어느
것이 더 적합한가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
`filter()`가 적합하다. `filter()`는 조건이 `true`인 요소만 새 배열에
남긴다.

**팁:** `map = 무엇으로 바꿀까`, `filter = 남길까 제외할까`.

```{=html}
</details>
```
### 문제 34

`newOrders === prevOrders`가 `false`인 이유는?

``` ts
const newOrders = prevOrders.map((order) => order);
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
`map()`이 새로운 배열을 생성하기 때문이다. 내부 요소로 같은 객체들을
반환해도 배열 자체는 별개의 배열이다.

**팁:** 컨테이너인 배열과 내부 요소의 참조를 구분한다.

```{=html}
</details>
```
### 문제 35

새로운 배열을 만들었다는 말은 배열 안의 모든 객체도 반드시 새 객체라는
뜻인가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
아니다. 예를 들어 수정하지 않는 요소에 기존 `order`를 반환하면 그 객체는
그대로 사용된다. 배열 자체만 새 배열일 수 있다.

**팁:** `새 배열 ≠ 모든 내부 객체가 새 객체`.

```{=html}
</details>
```

------------------------------------------------------------------------

## Part 5. `filter()`와 삭제

### 문제 36

`filter()`의 기본 역할을 설명하라.

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
배열의 각 요소에 조건을 적용하고 조건이 `true`인 요소만 모아 새로운
배열을 만든다.

**팁:** `true = 유지`, `false = 제외`.

```{=html}
</details>
```
### 문제 37

다음 코드에서 왜 `!==`를 사용하는가?

``` ts
order.id !== deleteId
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
삭제하려는 ID와 **다른** 주문들만 `true`가 되어 남도록 하기 위해서다.
삭제 대상과 같은 ID는 `false`가 되어 새 배열에서 제외된다.

**팁:** 삭제 대상만 `false`가 되도록 조건을 읽는다.

```{=html}
</details>
```
### 문제 38

`deleteId = 2`일 때 각 조건의 결과를 쓰시오.

``` text
1 !== 2
2 !== 2
3 !== 2
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
``` text
1 !== 2 → true
2 !== 2 → false
3 !== 2 → true
```

따라서 ID 1과 3만 남는다.

**팁:** `filter()`에서는 Boolean 결과를 먼저 계산한다.

```{=html}
</details>
```
### 문제 39

다음 코드의 결과를 쓰시오.

``` ts
const orders = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
];

const deleteId = 2;

const result = orders.filter(
  (order) => order.id !== deleteId
);
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
``` ts
[
  { id: 1 },
  { id: 3 },
]
```

**팁:** `false`인 요소는 결과 배열에 포함되지 않는다.

```{=html}
</details>
```
### 문제 40

`filter()`가 기존 배열에서 요소를 직접 삭제하는가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
아니다. 조건을 통과한 요소들로 새로운 배열을 만든다.

**팁:** `삭제`라는 결과보다 `새 배열 생성`이라는 동작 원리를 먼저
생각한다.

```{=html}
</details>
```
### 문제 41

삭제 코드가 불변성을 유지하는 이유를 설명하라.

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
기존 배열에서 직접 요소를 제거하지 않고, 삭제 대상을 제외한 새로운
배열을 만들어 다음 State로 사용하기 때문이다.

**팁:** 추가·수정·삭제 모두 `기존 State 직접 수정 X`가 공통점이다.

```{=html}
</details>
```

------------------------------------------------------------------------

## Part 6. 코드 읽기

### 문제 42

다음 코드를 한 문장으로 설명하라.

``` ts
setOrders((prevOrders) => [
  ...prevOrders,
  newOrder,
]);
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
React가 전달한 이전 주문 배열의 요소들을 새 배열에 펼치고 `newOrder`를
추가한 새로운 배열을 다음 State로 사용한다.

**팁:** `이전 State → 새 배열 → 새 요소 추가 → 다음 State` 순서로
설명한다.

```{=html}
</details>
```
### 문제 43

다음 코드를 한 문장으로 설명하라.

``` ts
setOrders((prevOrders) =>
  prevOrders.filter((order) =>
    order.id !== deleteId
  )
);
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
이전 주문 배열에서 `deleteId`와 ID가 다른 주문만 남긴 새로운 배열을
만들어 다음 State로 사용한다.

**팁:** `삭제한다`보다 `삭제 대상을 제외한 새 배열을 만든다`가 정확하다.

```{=html}
</details>
```
### 문제 44

다음 코드를 처음부터 끝까지 설명하라.

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id
      ? updatedOrder
      : order,
  ),
);
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
`setOrders`에 updater 함수를 전달하면 React가 이전 `orders` State인
`Order[]`를 `prevOrders`로 전달한다. `map()`은 각 `Order` 객체를
`order`로 받아 `order.id`와 `updatedOrder.id`를 비교한다. ID가 같으면
수정 대상이므로 `updatedOrder`를 반환하고, 다르면 기존 `order`를
반환한다. `map()`은 반환값들을 모아 새로운 `Order[]`를 만들고, updater
함수가 이를 반환하면 React가 그 배열을 다음 State로 사용한다. 이후
컴포넌트가 재렌더링되고 새로운 State를 기준으로 JSX가 계산되어 UI에
반영된다.

**팁:**
`setter → updater → prevState → map → ID 비교 → 새 배열 → 새 State → 재렌더링`
순서를 사용한다.

```{=html}
</details>
```
### 문제 45

다음 설명에서 틀린 부분을 찾고 고쳐라.

> `map()`이 새로운 `order` 객체를 하나씩 만들어 `order` 매개변수에
> 넣는다.

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
틀렸다. `map()`이 새로운 `order` 객체를 만드는 것이 아니라 기존 배열의
각 요소를 하나씩 `order` 매개변수로 전달한다.

**팁:** `map()`의 새로 생성되는 결과는 기본적으로 **결과 배열**이라고
생각한다.

```{=html}
</details>
```
### 문제 46

다음 설명에서 틀린 부분을 찾고 고쳐라.

> `setOrders`가 `map()`의 각 반환값을 모아 새로운 배열을 만든다.

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
틀렸다. 각 반환값을 모아 새로운 배열을 만드는 것은 `map()`이다. updater
함수가 그 새 배열을 반환하고 React가 다음 State로 사용한다.

**팁:** `map = 새 배열`, `setOrders = State 업데이트 요청`으로 역할을
분리한다.

```{=html}
</details>
```
### 문제 47

다음 설명에서 틀린 부분을 찾고 고쳐라.

> `null`을 반환하면 `map()` 결과에서 그 요소가 사라진다.

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
틀렸다. `null`을 반환하면 결과 배열의 해당 위치에 `null`이 들어간다.
요소를 조건에 따라 제외하려면 `filter()`가 적합하다.

**팁:** `null`도 값이다.

```{=html}
</details>
```
### 문제 48

다음 설명에서 틀린 부분을 찾고 고쳐라.

> spread는 배열에 요소를 추가하는 메서드다.

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
틀렸다. spread(`...`)는 메서드가 아니며 배열 등의 요소를 펼치는
문법이다. `[...prevOrders, newOrder]`에서 추가가 일어나는 이유는 펼친
기존 요소 뒤에 `newOrder`를 작성했기 때문이다.

**팁:** `spread = 펼치기`, `newOrder = 추가할 값`.

```{=html}
</details>
```

------------------------------------------------------------------------

## Part 7. 빈칸 채우기

### 문제 49

빈칸을 채워 주문을 추가하라.

``` ts
setOrders((prevOrders) => [
  __________,
  newOrder,
]);
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
``` ts
...prevOrders
```

전체:

``` ts
setOrders((prevOrders) => [
  ...prevOrders,
  newOrder,
]);
```

**팁:** 기존 요소를 유지한 채 새 요소를 뒤에 넣는다.

```{=html}
</details>
```
### 문제 50

빈칸을 채워 수정 대상을 찾으라.

``` ts
prevOrders.map((order) =>
  __________
    ? updatedOrder
    : order
);
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
``` ts
order.id === updatedOrder.id
```

**팁:** 현재 요소의 ID와 수정된 객체의 ID를 비교한다.

```{=html}
</details>
```
### 문제 51

빈칸을 채워 수정 대상이 아닌 주문을 유지하라.

``` ts
order.id === updatedOrder.id
  ? updatedOrder
  : __________
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
``` ts
order
```

**팁:** 기존 요소를 유지하려면 기존 요소 자체를 반환한다.

```{=html}
</details>
```
### 문제 52

빈칸을 채워 `deleteId`와 같은 주문을 제외하라.

``` ts
prevOrders.filter(
  (order) => order.id __________ deleteId
);
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
``` ts
!==
```

전체:

``` ts
prevOrders.filter(
  (order) => order.id !== deleteId
);
```

**팁:** 삭제 대상과 `다른 것`만 true로 남긴다.

```{=html}
</details>
```
### 문제 53

빈칸을 채우시오.

``` text
Create → __________
Update → __________
Delete → __________
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
``` text
Create → spread
Update → map()
Delete → filter()
```

**팁:** 단순 암기 후 반드시 각 도구가 `어떤 새 배열을 만드는가`까지
설명할 수 있어야 한다.

```{=html}
</details>
```

------------------------------------------------------------------------

## Part 8. 참/거짓

### 문제 54

`prevOrders`는 React가 정한 예약어다. (O/X)

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
**X**

일반적인 매개변수 이름이다.

**팁:** `currentOrders`, `ordersBeforeUpdate` 등 다른 이름도 가능하다.

```{=html}
</details>
```
### 문제 55

`map()`은 기존 배열을 직접 수정한 뒤 같은 배열을 반환한다. (O/X)

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
**X**

`map()`은 새로운 배열을 반환한다.

**팁:** `map → new array`.

```{=html}
</details>
```
### 문제 56

`filter()`은 조건이 `true`인 요소를 결과 배열에 남긴다. (O/X)

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
**O**

`false`인 요소는 결과 배열에서 제외된다.

**팁:** `true = 통과`.

```{=html}
</details>
```
### 문제 57

`return null`은 아무 값도 반환하지 않는 것과 같다. (O/X)

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
**X**

`null`이라는 값을 반환한다.

**팁:** `null`도 결과 배열에 들어갈 수 있는 값이다.

```{=html}
</details>
```
### 문제 58

`[...prevOrders, newOrder]`는 기존 `prevOrders`를 직접 수정한다. (O/X)

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
**X**

새로운 배열을 만든다.

**팁:** spread를 사용하는 핵심 이유 중 하나가 기존 배열을 직접 수정하지
않는 것이다.

```{=html}
</details>
```
### 문제 59

수정하지 않는 주문에 `order`를 반환하면 결과 배열 자체도 기존 배열과
동일하다. (O/X)

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
**X**

`map()`이 만든 결과 배열 자체는 새로운 배열이다. 다만 수정하지 않은
요소는 기존 객체를 그대로 참조할 수 있다.

**팁:** 배열과 내부 객체를 구분한다.

```{=html}
</details>
```
### 문제 60

`order.id === updatedOrder.id`는 현재 주문이 수정 대상인지 확인하는
조건이다. (O/X)

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
**O**

ID가 같으면 수정하려는 바로 그 주문으로 판단한다.

**팁:** 조건식을 자연어 질문으로 바꿔 읽는다.

```{=html}
</details>
```

------------------------------------------------------------------------

## Part 9. 실전 사고 문제

### 문제 61

현재 주문이 다음과 같다.

``` ts
[
  { id: 10, status: "PAID" },
  { id: 20, status: "PREPARING" },
  { id: 30, status: "PAID" },
]
```

다음 객체가 서버에서 돌아왔다.

``` ts
const updatedOrder = {
  id: 30,
  status: "SHIPPED",
};
```

`map()` 수정 코드의 최종 배열을 작성하라.

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
``` ts
[
  { id: 10, status: "PAID" },
  { id: 20, status: "PREPARING" },
  { id: 30, status: "SHIPPED" },
]
```

`id: 30`인 요소만 `updatedOrder`로 교체된다.

**팁:** `status: "PAID"`가 두 개여도 ID로 찾기 때문에 정확한 대상을
수정할 수 있다.

```{=html}
</details>
```
### 문제 62

위 문제에서 `status === "PAID"`를 기준으로 수정하면 왜 문제가 생길 수
있는가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
`status: "PAID"`인 주문이 여러 개이므로 수정하려는 특정 주문 하나를
정확하게 식별할 수 없기 때문이다.

**팁:** 상태값과 식별값을 구분한다.

```{=html}
</details>
```
### 문제 63

현재 주문이 `[Order1, Order2, Order3]`이고 `Order2`만 수정한다.
`map()`에서 각 요소가 무엇을 반환해야 하는지 쓰시오.

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
``` text
Order1 → 기존 Order1
Order2 → updatedOrder
Order3 → 기존 Order3
```

이 반환값들이 모여 새 배열이 된다.

**팁:** `유지 / 교체 / 유지` 패턴을 떠올린다.

```{=html}
</details>
```
### 문제 64

현재 주문이 `[Order1, Order2, Order3]`이고 `Order2`를 삭제한다.
`filter()`의 조건 결과를 쓰시오.

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
``` text
Order1 → true  → 유지
Order2 → false → 제외
Order3 → true  → 유지
```

결과는 `[Order1, Order3]`이다.

**팁:** 삭제 대상 하나만 false가 되도록 조건을 만든다.

```{=html}
</details>
```
### 문제 65

`map()`과 `filter()`의 가장 중요한 차이를 한 문장씩 설명하라.

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
-   `map()`은 각 요소에서 무엇을 반환할지 결정하고 그 반환값들로 새로운
    배열을 만든다.
-   `filter()`는 조건이 `true`인 요소만 남겨 새로운 배열을 만든다.

**팁:** `map = 변환/교체`, `filter = 선택/제외`라고 연결한다.

```{=html}
</details>
```
### 문제 66

추가, 수정, 삭제 코드의 공통점은 무엇인가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
모두 기존 State 배열을 직접 수정하지 않고 기존 State를 기반으로 새로운
배열을 만들어 State를 업데이트한다. 즉 불변성을 유지한다.

**팁:** 문법은 달라도 공통 원리는 `새 배열 생성`이다.

```{=html}
</details>
```
### 문제 67

다음 흐름의 빈칸을 채우시오.

``` text
기존 State
↓
직접 수정하지 않음
↓
__________
↓
setOrders / updater 반환
↓
__________
↓
재렌더링
↓
UI 반영
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
``` text
기존 State
↓
직접 수정하지 않음
↓
새로운 배열/객체 생성
↓
setOrders / updater 반환
↓
State 업데이트
↓
재렌더링
↓
UI 반영
```

**팁:** Day 22 전체를 관통하는 흐름이다.

```{=html}
</details>
```
### 문제 68

다음 코드에서 새로운 배열을 실제로 만드는 주체는 누구인가?

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order
  )
);
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
`map()`이다. `map()`이 각 콜백의 반환값을 모아 새로운 배열을 만든다.

**팁:** `setOrders가 배열을 만든다`고 혼동하지 않는다.

```{=html}
</details>
```
### 문제 69

위 코드에서 다음 State를 계산해서 반환하는 것은 무엇인가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
`(prevOrders) => ...` 형태의 updater 함수다. 이 함수의 표현식 결과인
`map()`의 새 배열이 반환되어 다음 State로 사용된다.

**팁:** `map()`의 결과가 updater의 반환값이 되는 구조를 본다.

```{=html}
</details>
```
### 문제 70

Day 22의 최종 코드를 20초 안에 자기 말로 설명하라.

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order,
  ),
);
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 및 해설

```{=html}
</summary>
```
예시 답안:

> `setOrders`에 updater 함수를 전달하면 React가 이전 주문 State를
> `prevOrders`로 전달한다. `map()`으로 각 주문을 확인하면서 수정된
> 주문과 ID가 같으면 `updatedOrder`로 교체하고, 다르면 기존 `order`를
> 유지한다. `map()`이 이 결과들로 새로운 배열을 만들고 그 배열이 다음
> State가 되어 재렌더링과 UI 갱신으로 이어진다.

**팁:** 이 답을 통째로 외우기보다 코드의 데이터 흐름을 보면서 즉석에서
설명하는 것이 목표다.

```{=html}
</details>
```

------------------------------------------------------------------------
