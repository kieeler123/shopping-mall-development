# Day 19 React Events & Forms --- 문제 + 정답

> 범위: Vanilla JavaScript → React → TypeScript → Next.js + TypeScript\
> 사용법: 먼저 문제를 풀고, 각 문제 아래의 `<details>`를 펼쳐 정답을
> 확인하세요.

## Part 1. 핵심 개념

### 1. 브라우저에서 Event 객체는 누가 만들어 handler에 전달하는가?

<details><summary>정답 보기</summary>

브라우저가 Event가 발생했을 때 Event 객체를 만들고 등록된 handler에
전달한다.

</details>

### 2. `event`, `event.target`, `event.target.value`를 각각 설명하라.

<details><summary>정답 보기</summary>

- `event`: 발생한 Event에 대한 정보
- `event.target`: Event가 발생한 요소
- `event.target.value`: 해당 요소의 현재 값

</details>

### 3. `event.target.value`는 React만의 문법인가?

<details><summary>정답 보기</summary>

아니다. 브라우저/Web Event의 기본 원리에서 나온다. React에서도 이 개념을
사용한다.

</details>

### 4. `preventDefault()`의 역할은?

<details><summary>정답 보기</summary>

해당 Event에 대해 브라우저가 수행하려던 기본 동작을 막는다.

</details>

### 5. `preventDefault()`는 Event 자체를 삭제하는가?

<details><summary>정답 보기</summary>

아니다. Event는 발생하며, 그 Event에 연결된 브라우저의 기본 동작만
막는다.

</details>

### 6. React에서 `onChange={handleChange}`는 무엇을 의미하는가?

<details><summary>정답 보기</summary>

change Event가 발생했을 때 실행할 함수 `handleChange` 자체를 React에
전달한다.

</details>

### 7. `onChange={handleChange}`와 `onChange={handleChange()}`의 차이는?

<details><summary>정답 보기</summary>

`onChange={handleChange}`는 함수를 전달한다.\
`onChange={handleChange()}`는 렌더링 과정에서 함수를 즉시 호출하고 그
반환값을 전달하려는 형태다.

</details>

### 8. React에서 State가 변경되면 일반적으로 어떤 과정이 이어지는가?

<details><summary>정답 보기</summary>

State 업데이트 → 재렌더링 → 새로운 State를 기준으로 UI 계산 및 반영.

</details>

### 9. Controlled Component란 무엇인가?

<details><summary>정답 보기</summary>

React State가 input의 값을 제어하고, `onChange`를 통해 사용자의 변경을
다시 State에 반영하는 형태다.

</details>

### 10. Controlled input에서 `value={name}`의 방향은?

<details><summary>정답 보기</summary>

`State → input` 방향이다.

</details>

### 11. Controlled input에서 `onChange`의 핵심 방향은?

<details><summary>정답 보기</summary>

`input → handler → State` 방향이다.

</details>

### 12. 입력 중인 값과 마지막 제출값을 서로 다른 State로 관리하는 이유는?

<details><summary>정답 보기</summary>

사용자가 제출 후 input을 수정해도 마지막으로 제출된 결과는 그대로
유지해야 할 수 있기 때문이다.

</details>

### 13. 이름과 이메일을 한 번에 가입 정보로 제출한다면 Form을 몇 개 사용하는 것이 자연스러운가?

<details><summary>정답 보기</summary>

하나의 제출 단위이므로 일반적으로 하나의 `<form>`으로 묶는 것이
자연스럽다.

</details>

### 14. Form 제출 기능에서 `onClick`보다 `onSubmit`을 중심으로 설계하는 이유는?

<details><summary>정답 보기</summary>

`onSubmit`은 버튼의 클릭 자체가 아니라 Form 전체의 제출이라는 의미와
동작을 처리하기 때문이다.

</details>

### 15. `<button type="submit">`의 역할은?

<details><summary>정답 보기</summary>

해당 버튼이 Form 제출을 발생시키는 submit 버튼임을 명시한다.

</details>

## Part 2. 흐름 추적

### 16. 다음 빈칸을 채워라.

```text
사용자 입력
→ ______ Event
→ onChange
→ handler
→ event.target.value
→ ______
→ State 변경
→ ______
→ UI 반영
```

<details><summary>정답 보기</summary>

```text
사용자 입력
→ change Event
→ onChange
→ handler
→ event.target.value
→ setter 실행
→ State 변경
→ 재렌더링
→ UI 반영
```

</details>

### 17. 처음 상태가 다음과 같다.

```text
name = ""
submittedName = ""
```

사용자가 `철수`를 입력했지만 아직 제출하지 않았다. 두 State의 값은?

<details><summary>정답 보기</summary>

```text
name = "철수"
submittedName = ""
```

</details>

### 18. 17번 상태에서 Form을 제출했다. `setSubmittedName(name)`이 실행된 후 값은?

<details><summary>정답 보기</summary>

```text
name = "철수"
submittedName = "철수"
```

</details>

### 19. 18번 이후 input을 `영희`로 수정했지만 재제출하지 않았다. 값은?

<details><summary>정답 보기</summary>

```text
name = "영희"
submittedName = "철수"
```

</details>

### 20. 다음 Submit 흐름의 잘못된 부분을 찾아 수정하라.

```text
button
→ form submit
→ onSubmit
→ handler
→ preventDefault()
→ UI 반영
→ State 변경
→ 재렌더링
```

<details><summary>정답 보기</summary>

`UI 반영`과 `State 변경`의 순서가 잘못됐다.

```text
button
→ form submit
→ onSubmit
→ handler
→ preventDefault()
→ State 변경
→ 재렌더링
→ UI 반영
```

</details>

## Part 3. 코드 읽기

### 21. 다음 코드에서 사용자가 `React`를 입력하면 `name`에는 무엇이 저장되는가?

```jsx
const [name, setName] = useState("");

const handleChange = (e) => {
  setName(e.target.value);
};
```

<details><summary>정답 보기</summary>

`"React"` 문자열이 저장된다.

</details>

### 22. 다음 코드가 Controlled Component인 이유를 설명하라.

```jsx
<input value={name} onChange={handleChange} />
```

<details><summary>정답 보기</summary>

`value={name}`으로 State가 input 값을 제어하고, `onChange`를 통해 input
변경값을 다시 State에 반영하기 때문이다.

</details>

### 23. 다음 코드에서 버튼을 눌렀을 때 실행되는 handler는?

```jsx
<form onSubmit={handleSubmit}>
  <button type="submit">등록</button>
</form>
```

<details><summary>정답 보기</summary>

`handleSubmit`이 Form의 submit Event handler로 실행된다.

</details>

### 24. 다음 코드에서 `e.preventDefault()`를 제거하면 무엇이 달라질 수 있는가?

```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  setSubmittedName(name);
};
```

<details><summary>정답 보기</summary>

브라우저의 기본 Form 제출 동작이 수행될 수 있다. React에서 직접 제출
로직을 처리하려면 일반적으로 기본 동작을 막는다.

</details>

### 25. 다음 State 설계에서 `submitName`은 문자열인가 배열인가?

```jsx
const [submitName, setSubmitName] = useState("");
```

<details><summary>정답 보기</summary>

초기값이 `""`이므로 문자열 State로 사용하는 설계다.

</details>

### 26. 25번 State에 다음 업데이트가 어색한 이유는?

```jsx
setSubmitName((prev) => [newItem, ...prev]);
```

<details><summary>정답 보기</summary>

`submitName`을 문자열로 설계했는데 갑자기 배열처럼 spread하고 배열을
저장하려 하기 때문이다.

</details>

### 27. 여러 상품을 누적하려면 어떤 초기 State가 더 자연스러운가?

<details><summary>정답 보기</summary>

예:

```jsx
const [products, setProducts] = useState([]);
```

</details>

## Part 4. TypeScript

### 28. `<input>`의 `onChange` handler Event 타입을 작성하라.

<details><summary>정답 보기</summary>

`ChangeEvent<HTMLInputElement>`

</details>

### 29. `<form>`의 `onSubmit` handler Event 타입을 작성하라.

<details><summary>정답 보기</summary>

`FormEvent<HTMLFormElement>`

</details>

### 30. `ChangeEvent<HTMLInputElement>`를 두 부분으로 나누어 설명하라.

<details><summary>정답 보기</summary>

`ChangeEvent`는 React의 change Event 타입, `HTMLInputElement`는 HTML
`<input>` 요소 타입이다.

</details>

### 31. `FormEvent<HTMLFormElement>`를 두 부분으로 나누어 설명하라.

<details><summary>정답 보기</summary>

`FormEvent`는 Form Event 타입, `HTMLFormElement`는 HTML `<form>` 요소
타입이다.

</details>

### 32. `<input type="email">`의 handler 타입은 무엇인가?

<details><summary>정답 보기</summary>

`ChangeEvent<HTMLInputElement>`. 이메일 입력이어도 요소 자체는
`<input>`이다.

</details>

### 33. `<input type="number">`의 handler 타입은 무엇인가?

<details><summary>정답 보기</summary>

`ChangeEvent<HTMLInputElement>`. `type="number"`여도 HTML 요소는
input이다.

</details>

### 34. `input type="number"`에서 `e.target.value`의 기본 타입은?

<details><summary>정답 보기</summary>

`string`이다.

</details>

### 35. `useState("")`에서 State 타입을 `string`으로 명시하지 않아도 되는 이유는?

<details><summary>정답 보기</summary>

초기값 `""`를 보고 TypeScript가 `string`으로 타입 추론할 수 있기
때문이다.

</details>

### 36. 다음 두 import를 역할에 따라 설명하라.

```tsx
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
```

<details><summary>정답 보기</summary>

`useState`는 실제 React Hook 값이고, `ChangeEvent`와 `FormEvent`는
TypeScript에서 타입 정보로 사용한다.

</details>

### 37. 다음 코드의 빈칸을 채워라.

```tsx
const handlePrice = (e: __________________) => {
  setPrice(e.target.value);
};
```

<details><summary>정답 보기</summary>

`ChangeEvent<HTMLInputElement>`

</details>

### 38. 다음 코드의 빈칸을 채워라.

```tsx
const handleSubmit = (e: __________________) => {
  e.preventDefault();
};
```

<details><summary>정답 보기</summary>

`FormEvent<HTMLFormElement>`

</details>

## Part 5. Next.js

### 39. Next.js App Router에서 `"use client"`는 무엇을 선언하는가?

<details><summary>정답 보기</summary>

해당 파일을 기준으로 Client Component 경계를 선언한다.

</details>

### 40. `"use client"`를 단순히 `React를 사용하기 위한 문법`이라고 설명하면 부정확한 이유는?

<details><summary>정답 보기</summary>

React를 사용하는 모든 컴포넌트가 Client Component일 필요는 없기
때문이다. 클라이언트 측 State, Event handler, 브라우저 상호작용 등이
필요한 경계를 표시하는 것이 핵심이다.

</details>

### 41. 다음 중 React 영역을 모두 고르라.

A. `useState`\
B. `onChange`\
C. State 변경 후 재렌더링\
D. `"use client"`

<details><summary>정답 보기</summary>

A, B, C. `"use client"`는 Next.js의 Client Component 경계와 관련된다.

</details>

### 42. 다음을 층별로 분류하라.

```text
"use client"
useState
ChangeEvent<HTMLInputElement>
event.target.value
```

<details><summary>정답 보기</summary>

- `"use client"` → Next.js
- `useState` → React
- `ChangeEvent<HTMLInputElement>` → React 타입 + TypeScript
- `event.target.value` → Web/JavaScript Event 원리

</details>

## Part 6. 오류 찾기

### 43. 다음 코드의 문제를 찾아라.

```tsx
const [name, setName] = useState("");

const handleChange = (e: FormEvent<HTMLFormElement>) => {
  setName(e.target.value);
};
```

<details><summary>정답 보기</summary>

input change handler라면 `FormEvent<HTMLFormElement>`가 아니라
`ChangeEvent<HTMLInputElement>`가 적절하다.

</details>

### 44. 다음 코드의 문제를 찾아라.

```tsx
const handleSubmit = (e: ChangeEvent<HTMLInputElement>) => {
  e.preventDefault();
};
```

<details><summary>정답 보기</summary>

Form submit handler라면 `FormEvent<HTMLFormElement>`가 적절하다.

</details>

### 45. 다음 코드의 문제를 찾아라.

```jsx
<input value={name} />
```

<details><summary>정답 보기</summary>

React State로 `value`를 고정하면서 값을 변경할 `onChange`가 없다. 편집
가능한 Controlled input을 원한다면 `onChange`와 setter가 필요하다.

</details>

### 46. 다음 코드에서 Form 제출보다 버튼 클릭 자체만 처리하는 부분을 찾아 더 적절하게 수정하라.

```jsx
<form>
  <input value={name} onChange={handleChange} />
  <button onClick={handleSubmit}>등록</button>
</form>
```

<details><summary>정답 보기</summary>

Form 제출이 목적이라면 다음처럼 구성한다.

```jsx
<form onSubmit={handleSubmit}>
  <input value={name} onChange={handleChange} />
  <button type="submit">등록</button>
</form>
```

</details>

### 47. 다음 코드가 의도와 다르게 즉시 실행될 수 있는 이유는?

```jsx
<input onChange={handleChange()} />
```

<details><summary>정답 보기</summary>

`handleChange()`가 함수 전달이 아니라 함수 호출이기 때문이다. 일반적인
handler 연결은 `onChange={handleChange}`다.

</details>

### 48. 다음 코드에서 가격 State가 자동으로 number가 되지 않는 이유는?

```tsx
<input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
```

<details><summary>정답 보기</summary>

HTML input의 `value`는 `type="number"`여도 기본적으로 문자열로 읽히기
때문이다.

</details>

## Part 7. 코드 완성

### 49. 이름을 실시간 표시하는 Controlled input을 완성하라.

```jsx
const [name, setName] = useState("");

const handleChange = (e) => {
  // TODO
};

return (
  <>
    <input
    // TODO
    />
    <p>현재 입력: {name}</p>
  </>
);
```

<details><summary>정답 보기</summary>

```jsx
const [name, setName] = useState("");

const handleChange = (e) => {
  setName(e.target.value);
};

return (
  <>
    <input value={name} onChange={handleChange} />
    <p>현재 입력: {name}</p>
  </>
);
```

</details>

### 50. 이름을 제출하여 별도 State에 저장하는 handler를 완성하라.

```jsx
const [name, setName] = useState("");
const [submittedName, setSubmittedName] = useState("");

const handleSubmit = (e) => {
  // TODO 1
  // TODO 2
};
```

<details><summary>정답 보기</summary>

```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  setSubmittedName(name);
};
```

</details>

### 51. 이름과 이메일을 한 번에 제출하도록 작성하라.

<details><summary>정답 보기</summary>

```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  setSubmittedName(name);
  setSubmittedEmail(email);
};
```

</details>

### 52. 다음 JavaScript handler를 TypeScript로 변환하라.

```jsx
const handleEmail = (e) => {
  setEmail(e.target.value);
};
```

<details><summary>정답 보기</summary>

```tsx
const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
  setEmail(e.target.value);
};
```

</details>

### 53. 다음 JavaScript submit handler를 TypeScript로 변환하라.

```jsx
const handleSubmit = (e) => {
  e.preventDefault();
};
```

<details><summary>정답 보기</summary>

```tsx
const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
```

</details>

## Part 8. 설계 문제

### 54. 상품명과 가격을 입력하고 제출 결과를 따로 보여주려 한다. 필요한 State 4개를 설계하라.

<details><summary>정답 보기</summary>

예:

```tsx
const [productName, setProductName] = useState("");
const [price, setPrice] = useState("");
const [submitProduct, setSubmitProduct] = useState("");
const [submitPrice, setSubmitPrice] = useState("");
```

</details>

### 55. 54번 Form에 필요한 사용자 행동과 Event를 연결하라.

<details><summary>정답 보기</summary>

- 상품명 변경 → `onChange`
- 가격 변경 → `onChange`
- Form 제출 → `onSubmit`

</details>

### 56. 54번 Form에 필요한 handler 3개를 예시로 이름 지어라.

<details><summary>정답 보기</summary>

예: - `handleProductNameChange` - `handlePriceChange` - `handleSubmit`

</details>

### 57. 위 3개 handler의 TypeScript Event 타입을 각각 작성하라.

<details><summary>정답 보기</summary>

- 상품명 → `ChangeEvent<HTMLInputElement>`
- 가격 → `ChangeEvent<HTMLInputElement>`
- 제출 → `FormEvent<HTMLFormElement>`

</details>

### 58. 이 상품 Form에 `"use client"`가 필요한 이유를 설명하라.

<details><summary>정답 보기</summary>

`useState`와 Event handler를 사용해 브라우저에서 사용자 입력과
상호작용해야 하는 Client Component이기 때문이다.

</details>

## Part 9. Day 18 연결

### 59. 단일 `submitProduct` 문자열 State와 `products` 배열 State의 차이는?

<details><summary>정답 보기</summary>

`submitProduct`는 하나의 제출 결과를 저장하고, `products`는 여러 상품을
누적해서 저장하는 용도다.

</details>

### 60. 여러 상품을 배열 앞쪽에 추가하는 불변 업데이트를 작성하라.

<details><summary>정답 보기</summary>

```tsx
setProducts((prevProducts) => [newProduct, ...prevProducts]);
```

</details>

### 61. 위 코드에서 spread가 필요한 이유는?

<details><summary>정답 보기</summary>

기존 배열을 직접 변경하지 않고 기존 항목을 복사해 새로운 배열을 만들기
위해서다.

</details>

### 62. Form → 상품 객체 → products 배열 → ProductList의 전체 흐름을 설명하라.

<details><summary>정답 보기</summary>

Form에서 입력값을 State로 관리하고, 제출 시 상품 객체를 만든 뒤 products
배열 State에 불변 방식으로 추가한다. 이후 products를 Props로
ProductList에 전달하고 `map`으로 렌더링할 수 있다.

</details>

## Part 10. 최종 종합 테스트

### 63. 다음 코드의 각 줄이 어느 층에 해당하는지 설명하라.

```tsx
"use client";

const [productName, setProductName] = useState("");

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  setProductName(e.target.value);
};
```

<details><summary>정답 보기</summary>

- `"use client"` → Next.js
- `useState` / `setProductName` → React
- `ChangeEvent<HTMLInputElement>` → React 타입 + TypeScript
- `e.target.value` → Web/Event 원리

</details>

### 64. Day 19 전체를 한 줄 흐름으로 작성하라.

<details><summary>정답 보기</summary>

```text
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

</details>

### 65. Vanilla / React / TypeScript / Next.js의 역할을 각각 한 문장으로 설명하라.

<details><summary>정답 보기</summary>

- Vanilla/Web: Event가 어떻게 발생하고 값을 어떻게 읽는지 이해한다.
- React: Event를 State와 UI에 연결한다.
- TypeScript: Event와 값에 타입 정보를 표현한다.
- Next.js: 상호작용이 필요한 컴포넌트를 Client Component 경계에
  배치한다.

</details>

### 66. 실전 구현 문제

아래 요구사항을 정답을 보지 않고 처음부터 구현하라.

```text
상품명 [          ]
가격   [          ]

[상품 등록]

등록 결과
상품명: ...
가격: ...
```

조건:

- Next.js + TypeScript
- `"use client"`
- Controlled inputs
- `ChangeEvent<HTMLInputElement>`
- `FormEvent<HTMLFormElement>`
- `onSubmit`
- `preventDefault()`
- 입력 State와 제출 State 분리

<details><summary>정답 보기</summary>

```tsx
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

export default function ProductForm() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [submitProduct, setSubmitProduct] = useState("");
  const [submitPrice, setSubmitPrice] = useState("");

  const handleProductNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

      <input type="number" value={price} onChange={handlePriceChange} />

      <button type="submit">상품 등록</button>

      <p>상품명: {submitProduct}</p>
      <p>가격: {submitPrice}</p>
    </form>
  );
}
```

</details>

---

## 최종 체크리스트

- [ ] Event 객체가 어디서 오는지 설명할 수 있다.
- [ ] `event.target.value`를 설명할 수 있다.
- [ ] `onChange={handler}`와 `onChange={handler()}`를 구분할 수 있다.
- [ ] Controlled Component를 설명할 수 있다.
- [ ] 입력 State와 제출 State를 분리할 수 있다.
- [ ] `onClick`과 `onSubmit`을 구분할 수 있다.
- [ ] `preventDefault()`를 설명할 수 있다.
- [ ] `ChangeEvent<HTMLInputElement>`를 설명할 수 있다.
- [ ] `FormEvent<HTMLFormElement>`를 설명할 수 있다.
- [ ] `input type="number"`의 value가 문자열임을 안다.
- [ ] `"use client"`의 역할을 설명할 수 있다.
- [ ] JavaScript / React / TypeScript / Next.js 층을 구분할 수 있다.
- [ ] Next.js + TypeScript로 Form을 직접 구현할 수 있다.

> **팁:** 정답을 읽어서 이해되는 것보다 `<details>`를 열기 전에 입으로
> 설명하거나 직접 코드를 작성할 수 있는지를 기준으로 복습하세요.
