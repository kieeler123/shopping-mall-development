# Day 18\~20 React 복습 플랜

> 배경: Day 17까지 `fetch` 진도를 진행한 뒤, Day 18\~20을 React 핵심
> 복습 구간으로 사용한다.\
> 현재 프로젝트 환경: **Next.js + TypeScript**
>
> 복습 전략: **개념은 Vanilla JavaScript / React JavaScript에서 단순하게
> 이해하고, 필요한 타입을 추가한 뒤 최종 코드는 Next.js + TypeScript로
> 작성한다.**

------------------------------------------------------------------------

# 전체 원칙

## 1. 네 기술을 동시에 새로 배우지 않는다

``` text
Vanilla JavaScript
→ 웹/JavaScript 원리 확인

React JavaScript
→ React 개념의 중심

React + TypeScript
→ 타입을 추가

Next.js + TypeScript
→ 실제 프로젝트 형태로 최종 구현
```

모든 문제를 네 버전으로 반복하지 않는다.

개념마다 필요한 층만 사용한다.

> **팁:** 복잡한 코드를 만나면 각 줄을
> `JavaScript / React / TypeScript / Next.js`로 분류한다.

------------------------------------------------------------------------

# Day 18 --- 복습 ①: State / Props / 배열 State

## 상태

**완료**

## 핵심 범위

-   `useState`
-   State 위치 판단
-   데이터 Props
-   함수 Props
-   Props 객체 구조 분해
-   컴포넌트 간 handler 전달
-   `map`
-   `filter`
-   Object Spread
-   배열 State 불변 업데이트
-   `key` vs 일반 Props
-   기존 값 기반 업데이트

## 핵심 정신 모델

``` text
기존 전체 배열
→ 현재 요소 하나
→ 조건 확인
→ 필요한 요소만 새 객체
→ 새로운 전체 배열
→ Setter
```

그리고 함수 Props:

``` text
State 소유 컴포넌트
→ handler 생성
→ Props로 전달
→ 자식에서 실행
→ 부모 State 변경
→ 재렌더링
```

## Day 18에서 확인된 포인트

개별 개념 자체보다 여러 개념이 한 번에 결합되었을 때:

-   전체 배열
-   요소 하나
-   새 배열
-   handler 함수

의 역할을 구분하는 것이 중요하다.

### 앞으로의 처리

Day 18 문제를 바로 다시 반복하지 않는다.

Day 19\~20에서 `map`, Spread, 함수 Props 등이 자연스럽게 필요해질 때
기억해서 적용하는지 확인한다.

> **팁:** Day 18은 개념별 보강 단계다. 이후에는 같은 문제 암기 여부가
> 아니라 다른 상황으로 전이되는지를 본다.

------------------------------------------------------------------------

# Day 19 --- 복습 ②: Events / Forms

Day 19는 별도 상세 플랜을 따른다.

## 학습 구조

``` text
Vanilla JS
Event 원리
↓
React JS
onChange / State / Controlled Component / Form
↓
React + TypeScript
ChangeEvent / FormEvent
↓
Next.js + TypeScript
Client Component에서 최종 구현
```

## 핵심 범위

-   `<input>`
-   `onChange`
-   Event 객체
-   `event.target.value`
-   입력값 State
-   `value={state}`
-   Controlled Component
-   여러 input
-   `<form>`
-   `onSubmit`
-   `preventDefault()`
-   `ChangeEvent<HTMLInputElement>`
-   `FormEvent<HTMLFormElement>`
-   `"use client"`

## Day 18과 연결

가능하면 Form에서 데이터를 만들어 배열 State에 추가하는 문제까지
연결한다.

``` text
Form
→ 사용자 입력
→ 새 객체 생성
→ 배열 State 추가
→ map 렌더링
```

그러면 Day 18의:

-   Spread
-   배열 추가
-   Props
-   `map`
-   `key`

가 자연스럽게 다시 등장한다.

## Day 19 최종 결과

간단한 상품 등록 Form을 **Next.js + TypeScript**로 구현한다.

> **팁:** 최종 코드가 TSX라고 해서 처음부터 타입과 Next.js를 동시에
> 고민하지 않는다. React 동작을 먼저 설계한 뒤 타입과 환경을 얹는다.

------------------------------------------------------------------------

# Day 20 --- 복습 ③: 종합 미니 프로젝트

Day 20은 개념별 퀴즈보다 **작은 기능을 처음부터 설계하고 구현하는
날**이다.

## 프로젝트 예시 --- Product Manager

최종 구현 환경:

``` text
Next.js
+
TypeScript
```

예상 UI:

``` text
상품명 [              ]
가격   [              ]

[상품 추가]

-----------------------

키보드
50,000원
[+10,000] [삭제]

마우스
30,000원
[+10,000] [삭제]
```

## 요구 기능

### 상품 추가

``` text
Form 입력
→ submit
→ 상품 객체 생성
→ products State에 추가
```

### 가격 변경

``` text
상품 id
→ map
→ 조건
→ Object Spread
→ 기존 price + 10000
→ 새 배열
→ Setter
```

### 상품 삭제

``` text
상품 id
→ filter
→ 새 배열
→ Setter
```

### 목록 렌더링

``` text
products
→ map
→ ProductCard
→ key
```

------------------------------------------------------------------------

# Day 20 구현 단계

## Step 1 --- 요구사항만 보고 설계

코드를 작성하기 전에 답한다.

-   필요한 State는?
-   State는 어디에 둘까?
-   어떤 컴포넌트가 필요한가?
-   어떤 handler가 필요한가?
-   어떤 Props가 필요한가?
-   어떤 데이터 타입이 필요한가?

## Step 2 --- React 관점에서 데이터 흐름 설계

예:

``` text
ProductManager
├─ ProductForm
└─ ProductList
   └─ ProductCard
```

가능한 흐름:

``` text
ProductForm
→ onAdd
→ 부모 State 변경

ProductCard
→ onIncrease
→ 부모 State 변경

ProductCard
→ onDelete
→ 부모 State 변경
```

## Step 3 --- React JS 수준에서 핵심 로직 작성

먼저 타입 문법 없이 논리를 확인한다.

-   추가
-   수정
-   삭제
-   Props 전달

## Step 4 --- TypeScript 타입 추가

예:

``` tsx
type Product = {
  id: number;
  name: string;
  price: number;
};
```

함수 Props도 타입으로 표현한다.

예:

``` tsx
type ProductCardProps = {
  product: Product;
  onIncrease: (id: number) => void;
  onDelete: (id: number) => void;
};
```

## Step 5 --- Next.js 구조에 배치

State와 Event handler를 사용하는 경계를 보고 Client Component를
결정한다.

필요한 곳에:

``` tsx
"use client";
```

를 사용한다.

Next.js 고급 기능을 억지로 추가하지 않는다.

## Step 6 --- 최종 TSX 구현

최종 결과는 **Next.js + TypeScript 코드**로 완성한다.

## Step 7 --- 코드 설명

완성 후 각 코드를 분류한다.

``` text
이 부분은 JavaScript
이 부분은 React
이 부분은 TypeScript
이 부분은 Next.js
```

그리고 데이터 흐름을 설명한다.

------------------------------------------------------------------------

# Day 20 평가 기준

단순히 앱이 실행되는지만 보지 않는다.

다음을 확인한다.

### React

-   State 위치를 설명할 수 있는가?
-   함수 Props 흐름을 설명할 수 있는가?
-   `map`과 `filter`를 적절히 선택하는가?
-   직접 mutation하지 않는가?
-   Form 흐름을 이해하는가?

### TypeScript

-   데이터 타입을 정의할 수 있는가?
-   Props 타입을 읽고 작성할 수 있는가?
-   함수 Props 타입을 이해하는가?

### Next.js

-   Client Component가 필요한 이유를 설명할 수 있는가?
-   React 개념과 Next.js 기능을 구분할 수 있는가?

> **팁:** TypeScript 오류가 발생했을 때 React 로직까지 틀렸다고 판단하지
> 않는다. 문제의 층을 먼저 분리한다.

------------------------------------------------------------------------

# Day 18\~20 전체 흐름

``` text
Day 17
fetch까지 기존 진도
        ↓
────────────────────
복습 구간
────────────────────
        ↓
Day 18
State / Props / 배열 State
개념별 약점 점검
        ↓
Day 19
Events / Forms
Vanilla → React → TS → Next.js TS
        ↓
Day 20
종합 미니 프로젝트
설계 → React 로직 → 타입 → Next.js TS 최종 구현
        ↓
────────────────────
복습 종료
────────────────────
        ↓
Day 21
기존 진도 복귀
fetch 이후 과정
```

------------------------------------------------------------------------

# 학습량 조절 원칙

다음처럼 하지 않는다.

``` text
Vanilla로 완성 앱
+
React JS로 같은 완성 앱
+
React TS로 같은 완성 앱
+
Next.js TS로 같은 완성 앱
```

대신:

``` text
Vanilla
→ 원리 확인용 작은 코드

React JS
→ 개념 학습과 핵심 연습

TypeScript
→ 타입 차이만 추가

Next.js TS
→ 최종 결과물
```

로 진행한다.

이렇게 하면 학습량을 크게 늘리지 않으면서 현재 프로젝트 스택과 기본
개념을 연결할 수 있다.

------------------------------------------------------------------------

# 복습 종료 후

Day 21부터는 복습용으로 기술을 따로 분리하기보다 실제 진도에서 필요할 때
적용한다.

``` text
fetch
→ 응답 데이터
→ TypeScript 타입
→ React State
→ 렌더링
→ 사용자 Event
→ UI 변경
```

이 과정에서 Day 18\~20의 개념이 기억나는지 계속 확인한다.

> **팁:** 복습의 최종 목표는 문제집을 잘 푸는 것이 아니라 실제 Next.js +
> TypeScript 프로젝트 코드 안에서 React와 JavaScript 원리를 구분하며
> 사용할 수 있게 되는 것이다.
