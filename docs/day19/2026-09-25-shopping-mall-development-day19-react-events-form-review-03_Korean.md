# Day 19 React 복습 총정리 --- Events & Forms

## 1. 오늘의 핵심 목표

Day 19의 핵심 흐름은 다음과 같다.

``` text
사용자 입력
→ Event 발생
→ Event에서 입력값 확인
→ React State 변경
→ 재렌더링
→ UI 반영
→ Form 제출
```

학습 층의 역할은 다음처럼 구분한다.

``` text
Vanilla JavaScript
→ 웹/Event의 원리

React JavaScript
→ Event와 State, UI 연결

React + TypeScript
→ 기존 React 코드에 타입 추가

Next.js + TypeScript
→ 실제 프로젝트의 Client Component로 구현
```

> **팁:** 코드가 복잡해 보이면 JavaScript/Web, React, TypeScript,
> Next.js 중 어느 층의 문제인지 먼저 분류한다.

------------------------------------------------------------------------

## 2. Vanilla JavaScript --- Event의 원리

브라우저에서 사용자가 input을 변경하면 Event가 발생한다.

``` js
const input = document.querySelector("input");

input.addEventListener("input", (event) => {
  console.log(event.target.value);
});
```

핵심:

-   `event`: 발생한 Event에 대한 정보
-   `event.target`: Event가 발생한 요소
-   `event.target.value`: 해당 요소의 현재 값
-   Event 객체는 브라우저가 만들어 handler에 전달한다.

흐름:

``` text
사용자 입력
→ 브라우저 Event 발생
→ Event 객체 전달
→ event.target
→ event.target.value
```

### `preventDefault()`

``` js
form.addEventListener("submit", (event) => {
  event.preventDefault();
});
```

`preventDefault()`는 Event 자체를 제거하는 것이 아니라 **브라우저가
수행하려던 기본 동작을 막는다.**

> **팁:** `preventDefault = 새로고침 방지`로만 외우지 말고
> `브라우저의 기본 동작 방지`로 기억한다.

------------------------------------------------------------------------

## 3. React --- onChange와 State

React에서는 JSX에서 Event handler를 연결한다.

``` jsx
const handleChange = (event) => {
  console.log(event.target.value);
};

return <input onChange={handleChange} />;
```

`onChange={handleChange}`는 함수를 즉시 실행하는 것이 아니라 **함수
자체를 전달**한다.

``` jsx
onChange={handleChange}   // 함수 전달
onChange={handleChange()} // 렌더링 과정에서 함수 호출
```

> **팁:** Event handler에서는 보통 `이벤트가 발생하면 실행할 함수`를
> 전달한다고 생각한다.

### 입력값을 State에 저장

``` jsx
const [name, setName] = useState("");

const handleChange = (event) => {
  setName(event.target.value);
};
```

흐름:

``` text
사용자 입력
→ onChange
→ handler
→ event.target.value
→ setName(...)
→ State 변경
→ 재렌더링
→ UI 반영
```

> **팁:** React Form에서 막히면
> `Event → handler → 값 확인 → setter → 재렌더링` 순서로 추적한다.

------------------------------------------------------------------------

## 4. Controlled Component

``` jsx
<input
  value={name}
  onChange={handleChange}
/>
```

두 방향을 구분한다.

``` text
value={name}
State → input

onChange
input → handler → State
```

React State가 input의 값을 제어하고, 사용자의 변경을 `onChange`로 다시
State에 반영하는 형태가 Controlled Component다.

> **팁:** Controlled Component는 `value={state}`와 `onChange → setter`의
> 조합으로 기억한다.

------------------------------------------------------------------------

## 5. 입력 State와 제출 State 분리

입력 중인 값과 마지막으로 제출한 값은 서로 다른 정보다.

``` jsx
const [name, setName] = useState("");
const [submittedName, setSubmittedName] = useState("");
```

예:

``` text
사용자가 "철수" 입력
name = "철수"
submittedName = ""

제출
name = "철수"
submittedName = "철수"

input을 "영희"로 변경, 아직 재제출하지 않음
name = "영희"
submittedName = "철수"
```

> **팁:** State를 설계할 때 `이 State는 무엇을 기억해야 하는가?`를 먼저
> 문장으로 설명한다.

------------------------------------------------------------------------

## 6. 여러 input과 하나의 Form

이름과 이메일처럼 한 번에 제출되는 데이터는 하나의 Form으로 묶을 수
있다.

``` jsx
<form onSubmit={handleSubmit}>
  <input value={name} onChange={handleName} />
  <input value={email} onChange={handleEmail} />
  <button type="submit">가입하기</button>
</form>
```

Submit handler 하나에서 여러 값을 처리한다.

``` jsx
const handleSubmit = (event) => {
  event.preventDefault();

  setSubmittedName(name);
  setSubmittedEmail(email);
};
```

핵심 흐름:

``` text
submit 버튼
→ form submit Event
→ onSubmit
→ handleSubmit
→ preventDefault()
→ State 변경
→ 재렌더링
→ 제출 결과 UI 반영
```

### `onClick`과 `onSubmit`

-   `onClick`: 특정 요소의 클릭 Event
-   `onSubmit`: Form 전체의 제출 Event

Form 제출 기능을 구현할 때는 `<form onSubmit={...}>`을 중심으로
설계한다.

> **팁:** 버튼이 있다고 무조건 `onClick`부터 생각하지 말고, 사용자의
> 행동이 `Form 제출`인지 먼저 판단한다.

------------------------------------------------------------------------

## 7. React + TypeScript --- Event 타입 추가

React의 동작은 바뀌지 않는다. 기존 Event 매개변수에 타입 정보를
추가한다.

### ChangeEvent

JavaScript:

``` jsx
const handleName = (event) => {
  setName(event.target.value);
};
```

TypeScript:

``` tsx
import type { ChangeEvent } from "react";

const handleName = (
  event: ChangeEvent<HTMLInputElement>
) => {
  setName(event.target.value);
};
```

분해:

``` text
ChangeEvent
→ React의 change Event 타입

HTMLInputElement
→ HTML <input> 요소
```

즉 `ChangeEvent<HTMLInputElement>`는 **input 요소와 관련된 React change
Event의 타입**이다.

> **팁:** `무슨 Event인가? + 어느 HTML 요소인가?`라는 두 질문으로 Event
> 타입을 판단한다.

### FormEvent

``` tsx
import type { FormEvent } from "react";

const handleSubmit = (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
};
```

분해:

``` text
FormEvent
→ Form Event 타입

HTMLFormElement
→ HTML <form> 요소
```

> **팁:** `onChange`는 handler를 연결하는 React 기능이고,
> `ChangeEvent<HTMLInputElement>`는 handler가 받는 Event 매개변수의 타입
> 정보다.

------------------------------------------------------------------------

## 8. State 타입 추론

``` tsx
const [name, setName] = useState("");
```

초기값 `""`가 문자열이므로 TypeScript가 State를 `string`으로 추론할 수
있다.

따라서 항상 다음처럼 명시할 필요는 없다.

``` tsx
const [name, setName] = useState<string>("");
```

> **팁:** TypeScript가 명확하게 추론할 수 있는 타입은 불필요하게
> 반복해서 작성하지 않아도 된다.

------------------------------------------------------------------------

## 9. `input type="number"`와 문자열

``` tsx
<input type="number" />
```

이어도 다음 값은 기본적으로 문자열이다.

``` tsx
event.target.value
```

예:

``` text
화면 입력: 50000
State 값: "50000"
```

숫자 계산이 필요하면 필요 시점에 `Number(price)` 등의 변환을 고려한다.

> **팁:** HTML의 `type="number"`와 JavaScript/TypeScript의 `number`
> 타입을 동일하게 생각하지 않는다.

------------------------------------------------------------------------

## 10. Next.js + TypeScript --- `"use client"`

Next.js App Router에서 `useState`와 Event handler를 이용해 브라우저에서
사용자와 상호작용해야 하는 컴포넌트는 Client Component 경계가 필요하다.

``` tsx
"use client";
```

예:

``` tsx
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
```

React의 핵심 원리는 그대로 유지된다.

``` text
input
→ onChange
→ handler
→ setState
→ 재렌더링
→ UI 반영
```

> **팁:** `"use client" = React를 사용한다`가 아니라
> `"use client" = Client Component 경계를 선언한다`로 기억한다.

------------------------------------------------------------------------

## 11. 최종 실습 --- 상품 등록 Form

``` tsx
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

export default function UserForm() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");

  const [submitProduct, setSubmitProduct] = useState("");
  const [submitPrice, setSubmitPrice] = useState("");

  const handleProductNameChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setProductName(event.target.value);
  };

  const handlePriceChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setPrice(event.target.value);
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSubmitProduct(productName);
    setSubmitPrice(price);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={productName}
        onChange={handleProductNameChange}
      />

      <input
        type="number"
        value={price}
        onChange={handlePriceChange}
      />

      <button type="submit">상품 등록</button>

      <p>상품명: {submitProduct}</p>
      <p>가격: {submitPrice}</p>
    </form>
  );
}
```

전체 흐름:

``` text
상품명/가격 입력
→ onChange
→ ChangeEvent<HTMLInputElement>
→ event.target.value
→ 입력 State 변경
→ 재렌더링

상품 등록
→ form submit
→ FormEvent<HTMLFormElement>
→ preventDefault()
→ 제출 State 변경
→ 재렌더링
→ 등록 결과 표시
```

> **팁:** Form이 복잡해지면 `입력 State`와 `제출/결과 처리`를 먼저 두
> 덩어리로 분리한다.

------------------------------------------------------------------------

## 12. JavaScript / React / TypeScript / Next.js 분류

  ---------------------------------------------------------------------------------
  코드/개념                         영역                    역할
  --------------------------------- ----------------------- -----------------------
  `event.target.value`              Web / JavaScript Event  input의 현재 값 확인

  `useState`                        React                   State 관리

  `setProductName`                  React                   State 업데이트 요청

  `onChange`, `onSubmit`            React                   Event handler 연결

  `ChangeEvent<HTMLInputElement>`   React 타입 + TypeScript change Event 매개변수
                                                            타입

  `FormEvent<HTMLFormElement>`      React 타입 + TypeScript form Event 매개변수
                                                            타입

  `"use client"`                    Next.js                 Client Component 경계
  ---------------------------------------------------------------------------------

> **팁:** 에러가 발생하면 먼저 이 분류를 이용해 문제 영역을 좁힌다.

------------------------------------------------------------------------

## 13. Day 18과 Day 19 연결

Day 18:

``` text
배열 State
객체
Spread
Props
함수 Props
map
key
```

Day 19:

``` text
사용자 입력
→ Form
→ Event
→ State
→ UI
```

두 내용을 합치면:

``` text
상품 Form 입력
→ 상품 객체 생성
→ products 배열 State에 추가
→ ProductList에 Props 전달
→ map으로 출력
```

이때 Day 18의 불변 업데이트가 다시 사용된다.

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

> **팁:** 단일 제출값을 저장하는 문제와 여러 상품을 배열에 누적하는
> 문제를 구분한다. 전자는 문자열 State 업데이트, 후자는 배열 State 불변
> 업데이트가 필요하다.

------------------------------------------------------------------------

## 14. Day 19 핵심 암기 문장

``` text
Vanilla
→ Event에서 값을 어떻게 읽는가?

React
→ 그 값을 State와 UI에 어떻게 연결하는가?

TypeScript
→ 그 Event와 값의 타입을 어떻게 표현하는가?

Next.js
→ 이 상호작용 컴포넌트를 Client Component로 어떻게 배치하는가?
```

최종 핵심:

``` text
사용자 입력
→ Event
→ handler
→ event.target.value
→ setter
→ State 변경
→ 재렌더링
→ UI 반영
→ Form Submit
```
