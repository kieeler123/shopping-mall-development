# Day 23 --- 이벤트와 State

## 문제 + 정답

### 문제 1

다음 세 코드의 차이를 설명하시오.

``` tsx
onClick={handleClick}
onClick={handleClick()}
onClick={() => handleClick()}
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 보기
```{=html}
</summary>
```
`onClick={handleClick}`은 함수 자체를 전달하고 클릭할 때 실행한다.

`onClick={handleClick()}`은 렌더링 과정에서 함수를 즉시 호출한다.

`onClick={() => handleClick()}`은 화살표 함수를 전달하고 클릭 시 그 함수
안에서 `handleClick()`을 호출한다.

```{=html}
</details>
```
> **팁:** 함수 이름 뒤의 `()` 유무와 화살표 함수로 감싸져 있는지를
> 확인한다.

------------------------------------------------------------------------

### 문제 2

``` tsx
<option value="shipping">배송중</option>
```

사용자가 `배송중`을 선택했다. `e.target.value`는 무엇인가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 보기
```{=html}
</summary>
```
`"shipping"`

화면의 `배송중`이 아니라 `value` 속성의 값이다.

```{=html}
</details>
```
> **팁:** 화면 텍스트와 실제 `value`를 구분한다.

------------------------------------------------------------------------

### 문제 3

``` tsx
const handleStatusChange = (
  orderId: number,
  newStatus: string
) => {};

handleStatusChange(15, "completed");
```

`orderId`, `newStatus`의 값은 무엇이며 인자와 매개변수는 각각 무엇인가?

```{=html}
<details>
```
```{=html}
<summary>
```
정답 보기
```{=html}
</summary>
```
``` text
orderId = 15
newStatus = "completed"
```

`15`, `"completed"`는 인자(Argument)이고 `orderId`, `newStatus`는
매개변수(Parameter)다.

```{=html}
</details>
```
> **팁:** 호출문의 값을 함수 정의의 매개변수에 왼쪽부터 순서대로
> 대응시킨다.

------------------------------------------------------------------------

### 문제 4

``` tsx
handleStatusChange(20, "cancelled");
```

다음 조건에서 `order.id`가 `10`, `20`, `30`이면 각각 어떻게 처리되는가?

``` tsx
order.id === orderId
  ? { ...order, status: newStatus }
  : order
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 보기
```{=html}
</summary>
```
``` text
10 === 20 → false → 기존 order
20 === 20 → true  → status를 "cancelled"로 변경
30 === 20 → false → 기존 order
```

20번 주문만 변경된다.

```{=html}
</details>
```
> **팁:** `orderId = 20`은 고정이고 `order.id`만 순회하면서 바뀐다.

------------------------------------------------------------------------

### 문제 5

다음 코드의 전체 흐름을 설명하시오.

``` tsx
onChange={(e) => {
  handleStatusChange(
    order.id,
    e.target.value as OrderStatus
  );
}}
```

```{=html}
<details>
```
```{=html}
<summary>
```
정답 보기
```{=html}
</summary>
```
``` text
사용자가 값 변경
↓
onChange
↓
이벤트 객체 e
↓
e.target.value
↓
order.id + 새로운 value
↓
handleStatusChange(...)
↓
State setter
↓
State 업데이트
↓
컴포넌트 재렌더링
↓
JSX 다시 계산
↓
UI 변경
```

`as OrderStatus`는 값을 변경하지 않고 TypeScript에게 해당 값을
`OrderStatus` 타입으로 취급하도록 알려주는 타입 단언이다.

```{=html}
</details>
```
> **팁:** Event에서 시작해서 State setter와 UI까지 순서대로 추적한다.
