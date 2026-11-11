# Day 19 React 복습 플랜 --- Events & Forms

> 복습 구간: Day 18\~20\
> Day 19 역할: **Events / Forms 복습 + Vanilla → React → TypeScript →
> Next.js TypeScript 연결**
>
> 원칙: 모든 내용을 네 번 반복하지 않는다. **개념은 가장 단순한 층에서
> 이해하고, 최종 구현은 현재 프로젝트 환경인 Next.js + TypeScript로
> 연결한다.**

------------------------------------------------------------------------

## 1. 오늘의 핵심 목표

Day 19가 끝났을 때 다음 흐름을 스스로 설명하고 구현할 수 있는 것이
목표다.

``` text
사용자 입력
→ Event 발생
→ 입력값 확인
→ React State 변경
→ UI 반영
→ Form 제출
```

그리고 같은 기능을 다음 네 층으로 구분해서 볼 수 있어야 한다.

``` text
Vanilla JavaScript
→ 웹/Event의 원리

React JavaScript
→ State와 UI 연결

React + TypeScript
→ 기존 React 코드에 타입 추가

Next.js + TypeScript
→ 실제 프로젝트 형태로 최종 구현
```

> **팁:** 막힐 때는 현재 문제가 JavaScript, React, TypeScript, Next.js
> 중 어느 층의 문제인지 먼저 분류한다.

------------------------------------------------------------------------

# 2. Step A --- Vanilla JavaScript로 Event 원리 확인

## 학습 범위

Vanilla 단계는 길게 하지 않는다.

확인할 핵심:

-   `<input>`의 값
-   `input` 또는 `change` Event
-   Event 객체
-   `event.target`
-   입력 요소의 `value`
-   form의 기본 submit 동작
-   `preventDefault()`

예시 개념:

``` js
const input = document.querySelector("input");

input.addEventListener("input", (event) => {
  console.log(event.target.value);
});
```

여기서 이해할 것:

``` text
사용자 입력
→ 브라우저 Event
→ Event가 발생한 요소
→ 현재 value
```

### 체크

-   `event.target.value`가 React만의 문법인가?
-   Event는 누가 만들어 전달하는가?
-   input 값은 어디에서 읽는가?

> **팁:** Vanilla 코드를 완벽하게 암기하는 것이 목적이 아니다. React
> Event 뒤에 있는 브라우저 원리를 확인하면 충분하다.

------------------------------------------------------------------------

# 3. Step B --- React JavaScript로 핵심 복습

Day 19에서 가장 많은 시간을 쓰는 구간이다.

## 3-1. onChange

``` jsx
function App() {
  const handleChange = (event) => {
    console.log(event.target.value);
  };

  return <input onChange={handleChange} />;
}
```

흐름:

``` text
입력
→ onChange
→ handler
→ event
→ event.target.value
```

## 3-2. 입력값을 State에 저장

``` jsx
const [text, setText] = useState("");

const handleChange = (event) => {
  setText(event.target.value);
};
```

``` text
input
→ onChange
→ setText
→ State 변경
→ 재렌더링
```

## 3-3. Controlled Component

``` jsx
<input
  value={text}
  onChange={handleChange}
/>
```

두 방향을 구분한다.

``` text
value={text}
State → input

onChange
input → State
```

## 3-4. 여러 input

처음에는 각각 State로 관리한다.

``` jsx
const [name, setName] = useState("");
const [email, setEmail] = useState("");
```

객체 State는 기본 흐름이 안정된 뒤 진행한다.

## 3-5. form / onSubmit

``` jsx
<form onSubmit={handleSubmit}>
```

``` jsx
const handleSubmit = (event) => {
  event.preventDefault();
};
```

이 단계에서 다음 차이를 설명한다.

``` text
onClick
→ 특정 요소의 클릭 Event

onSubmit
→ Form 전체의 제출 Event
```

> **팁:** React JS 단계에서 흐름이 헷갈리면 TypeScript로 넘어가지
> 않는다. React 개념과 타입 문제를 동시에 해결하려 하지 않는다.

------------------------------------------------------------------------

# 4. React JS 미니 실습

## 실습 1 --- 실시간 이름 표시

요구사항:

``` text
이름 [          ]

현재 입력: 철수
```

사용할 것:

-   `useState`
-   `value`
-   `onChange`
-   `event.target.value`

## 실습 2 --- 이름 제출

``` text
이름 [          ]

[등록]

등록된 이름: 철수
```

사용할 것:

-   Controlled input
-   `<form>`
-   `onSubmit`
-   `preventDefault()`
-   입력 중 State
-   제출 결과 State

## 실습 3 --- 이름 + 이메일

``` text
이름   [          ]
이메일 [          ]

[가입하기]
```

제출 후 두 값을 화면에 표시한다.

> **팁:** 한 번에 전체 코드를 작성하지 않는다.
> `이름 input → email input → submit` 순으로 확장한다.

------------------------------------------------------------------------

# 5. Step C --- React + TypeScript로 변환

React JS 구현이 이해된 뒤 **타입만 추가**한다.

## ChangeEvent

JavaScript:

``` jsx
const handleChange = (event) => {
  setText(event.target.value);
};
```

TypeScript:

``` tsx
import type { ChangeEvent } from "react";

const handleChange = (
  event: ChangeEvent<HTMLInputElement>
) => {
  setText(event.target.value);
};
```

확인할 것:

``` text
ChangeEvent
→ React의 change Event 타입

HTMLInputElement
→ Event가 발생하는 input 요소 타입
```

## FormEvent

``` tsx
import type { FormEvent } from "react";

const handleSubmit = (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
};
```

여기서 React 동작 자체는 바뀌지 않는다.

``` text
React JS
handleSubmit(event)

React + TS
handleSubmit(event: FormEvent<HTMLFormElement>)
```

### 타입 학습 목표

-   `ChangeEvent<HTMLInputElement>`
-   `FormEvent<HTMLFormElement>`
-   State의 타입 추론
-   필요한 경우 객체 타입 정의

> **팁:** TypeScript 단계에서는 "React 코드가 어떻게 달라졌지?"보다
> "기존 값의 타입을 어떻게 표현했지?"를 본다.

------------------------------------------------------------------------

# 6. 객체 Form은 필요할 때만

기본 input 흐름이 안정되면 다음 구조를 확인한다.

``` tsx
type FormData = {
  name: string;
  email: string;
};

const [form, setForm] = useState<FormData>({
  name: "",
  email: "",
});
```

업데이트:

``` tsx
setForm((prevForm) => ({
  ...prevForm,
  name: event.target.value,
}));
```

여기서 Day 18의 Object Spread가 다시 등장한다.

``` text
기존 객체
→ Spread로 복사
→ 변경할 속성 덮어쓰기
→ 새 객체
→ Setter
```

> **팁:** 객체 Form 자체보다 Day 18에서 배운 불변 업데이트가 새로운
> 상황에서도 기억나는지를 확인한다.

------------------------------------------------------------------------

# 7. Step D --- Next.js + TypeScript 최종 적용

마지막 결과물은 현재 프로젝트 환경에 맞춘다.

예:

``` tsx
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

export default function UserForm() {
  const [name, setName] = useState("");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setName(event.target.value);
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    console.log(name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={handleChange}
      />

      <button type="submit">
        등록
      </button>
    </form>
  );
}
```

## Next.js에서 추가로 확인할 것

-   왜 `"use client"`가 필요한가?
-   `useState`와 Event handler를 사용하는 컴포넌트는 왜 Client
    Component인가?
-   React에서 배운 State/Event 원리는 Next.js에서도 어떻게 유지되는가?

Next.js 자체의 고급 기능까지 확장하지 않는다.

> **팁:** Day 19의 Next.js 목표는 App Router 전체를 공부하는 것이
> 아니다. React Form을 실제 Next.js 프로젝트 파일에서 사용할 수 있게
> 만드는 것이다.

------------------------------------------------------------------------

# 8. Day 18 내용 자연스러운 재시험

Day 19에서 다음이 필요해지면 Day 18 내용을 다시 사용한다.

예:

``` text
Form 입력
→ 상품 객체 생성
→ products 배열에 추가
→ ProductList에 Props
→ map으로 출력
```

여기서 자연스럽게 확인:

-   배열 State
-   Spread
-   Props
-   함수 Props
-   `map`
-   `key`

정답을 먼저 보지 않고 기억해서 적용한다.

------------------------------------------------------------------------

# 9. Day 19 최종 과제

## 간단한 상품 등록 Form

최종 코드는 **Next.js + TypeScript**로 작성한다.

요구사항:

``` text
상품명 [          ]
가격   [          ]

[상품 등록]

등록 결과
상품명: 키보드
가격: 50000
```

### 구현 전 먼저 결정

1.  필요한 State는?
2.  어떤 Event가 필요한가?
3.  어떤 handler가 필요한가?
4.  어떤 타입이 필요한가?
5.  왜 Client Component인가?

### 구현 순서

``` text
React 관점에서 구조 설계
↓
React JS 수준으로 동작 이해
↓
필요한 타입 추가
↓
Next.js Client Component로 최종 작성
```

------------------------------------------------------------------------

# 10. Day 19 완료 기준

다음을 스스로 설명할 수 있어야 한다.

-   브라우저 Event와 React Event의 관계
-   `onChange`
-   `event.target.value`
-   State와 input 연결
-   Controlled Component
-   `onSubmit`
-   `preventDefault()`
-   `ChangeEvent<HTMLInputElement>`
-   `FormEvent<HTMLFormElement>`
-   `"use client"`가 필요한 이유

그리고 코드가 복잡해 보이면:

``` text
JavaScript인가?
React인가?
TypeScript인가?
Next.js인가?
```

를 구분할 수 있어야 한다.

------------------------------------------------------------------------

# 11. Day 19 학습 순서 요약

``` text
Vanilla JS
Event 원리만 짧게 확인
↓
React JS
Forms 핵심 집중
↓
React + TypeScript
Event 타입 추가
↓
Next.js + TypeScript
최종 Form 구현
```

**중요:** 네 환경을 네 번 반복하는 것이 아니다.

``` text
Vanilla = 원리
React = 핵심 이해
TypeScript = 타입 추가
Next.js TS = 최종 실전
```

이 역할 분담을 유지한다.

> **팁:** Day 19에서 가장 중요한 구간은 React JS다. 최종 코드는
> Next.js + TS지만, 이해의 중심은 React의 State/Event 흐름이다.
