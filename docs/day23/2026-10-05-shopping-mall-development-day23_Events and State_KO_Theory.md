# Day 23 --- 이벤트와 State

## 이론 총정리

### 핵심 질문

> 사용자의 행동은 어떻게 State 변경으로 이어지는가?

``` text
사용자 행동
↓
이벤트 발생
↓
onClick / onChange
↓
이벤트 핸들러 실행
↓
함수 호출
↓
State Setter 호출
↓
State 업데이트
↓
컴포넌트 재렌더링
↓
JSX 다시 계산
↓
UI 변경
```

> **팁:** React 이벤트 코드는
> `사용자 → Event → Handler → Setter → State → UI` 순서로 추적한다.

------------------------------------------------------------------------

### 1. onClick

``` tsx
const handleClick = () => {
  console.log("clicked");
};

<button onClick={handleClick}>클릭</button>
```

`onClick={handleClick}`은 함수를 호출하는 것이 아니라 **함수 자체를
전달**한다. 사용자가 클릭하면 그때 함수가 실행된다.

``` tsx
onClick={handleClick}          // 함수 전달
onClick={handleClick()}        // 즉시 함수 호출
onClick={() => handleClick()}  // 화살표 함수 전달
```

인자를 전달하면서 클릭할 때 실행하려면 다음 패턴을 자주 사용한다.

``` tsx
onClick={() => handleStatusChange("completed")}
```

> **팁:** `handleClick`은 함수 자체, `handleClick()`은 함수 호출이다.
> `() => handleClick()`은 실행을 이벤트 발생 시점까지 미루는 함수를
> 만든다.

------------------------------------------------------------------------

### 2. onChange와 Event

``` tsx
<select
  onChange={(e) => {
    console.log(e.target.value);
  }}
>
  <option value="pending">대기</option>
  <option value="completed">완료</option>
</select>
```

``` text
e → 이벤트 객체
e.target → 이벤트가 발생한 요소
e.target.value → 해당 요소의 현재 value
```

`완료`를 선택하면 `e.target.value`는 `"completed"`이다.

> **팁:** 화면에 보이는 텍스트와 `value` 속성은 다를 수 있다.

------------------------------------------------------------------------

### 3. 인자와 매개변수

``` tsx
const handleStatusChange = (
  orderId: number,
  newStatus: string
) => {};

handleStatusChange(7, "cancelled");
```

-   `orderId`, `newStatus` → 매개변수(Parameter)
-   `7`, `"cancelled"` → 인자(Argument)

함수가 호출되면:

``` text
orderId = 7
newStatus = "cancelled"
```

> **팁:** 함수 정의에서 받는 이름은 매개변수, 호출할 때 넣는 실제 값은
> 인자다.

------------------------------------------------------------------------

### 4. State 업데이트

``` tsx
const [status, setStatus] = useState("pending");

const handleStatusChange = (newStatus: string) => {
  setStatus(newStatus);
};
```

``` text
handleStatusChange("completed")
↓
newStatus = "completed"
↓
setStatus("completed")
↓
State 업데이트
↓
컴포넌트 재렌더링
↓
JSX 다시 계산
↓
UI 변경
```

`handleStatusChange`가 State를 직접 변경하는 것이 아니라 `setStatus()`가
State 업데이트를 요청한다.

> **팁:** `setStatus`, `setOrders` 같은 setter를 찾으면 실제 State
> 업데이트 지점을 찾은 것이다.

------------------------------------------------------------------------

### 5. 배열 State 업데이트

``` tsx
const handleStatusChange = (
  orderId: number,
  newStatus: OrderStatus
) => {
  setOrders((prevOrders) =>
    prevOrders.map((order) =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    )
  );
};
```

``` tsx
handleStatusChange(20, "cancelled");
```

이면:

``` text
orderId = 20
newStatus = "cancelled"

10 === 20 → false → 기존 order
20 === 20 → true  → status 변경
30 === 20 → false → 기존 order
```

결과:

``` tsx
[
  { id: 10, status: "pending" },
  { id: 20, status: "cancelled" },
  { id: 30, status: "completed" },
]
```

> **팁:** `orderId`는 고정되고 `order.id`가 `map()` 순회 중 계속
> 바뀐다고 생각한다.

------------------------------------------------------------------------

### 6. Spread 문법

``` tsx
{ ...order, status: newStatus }
```

기존 `order`의 속성을 복사한 뒤 `status`만 새로운 값으로 덮어쓴다.

``` tsx
{ id: 20, status: "shipping" }
```

에 `newStatus = "cancelled"`를 적용하면:

``` tsx
{ id: 20, status: "cancelled" }
```

이 된다.

> **팁:** `{ ...기존객체, 변경할속성: 새로운값 }` 패턴을 기억한다.

------------------------------------------------------------------------

### 7. `as OrderStatus`

``` tsx
e.target.value as OrderStatus
```

`as OrderStatus`는 실제 값을 변경하지 않는다. TypeScript에게 해당 값을
`OrderStatus` 타입으로 취급하라고 알려주는 **타입 단언(Type
Assertion)**이다.

> **팁:** `as`는 값 변환보다 TypeScript 타입 정보와 관련된 표현이라고
> 생각한다.

------------------------------------------------------------------------

### 8. 실제 프로젝트 흐름

``` tsx
onChange={(e) => {
  onStatusChange(
    order.id,
    e.target.value as OrderStatus
  );
}}
```

20번 주문에서 `취소`를 선택하면:

``` text
사용자가 "취소" 선택
↓
onChange
↓
이벤트 객체 e
↓
e.target.value = "cancelled"
↓
order.id = 20
↓
onStatusChange(20, "cancelled")
↓
State 변경 함수
↓
setOrders(...)
↓
20번 주문의 status 변경
↓
State 업데이트
↓
재렌더링
↓
JSX 다시 계산
↓
UI 변경
```

> **팁:** 복잡한 코드는 `order.id → 20`,
> `e.target.value → "cancelled"`처럼 실제 값으로 치환해서 읽는다.

------------------------------------------------------------------------

## 핵심 압축

``` text
사용자
→ 이벤트
→ 이벤트 핸들러
→ 함수
→ Setter
→ State
→ 재렌더링
→ JSX 재계산
→ UI 변경
```
