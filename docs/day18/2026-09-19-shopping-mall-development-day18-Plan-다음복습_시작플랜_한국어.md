# Day 18 다음 복습 시작 플랜

## 목적

다음 복습은 처음부터 다시 하지 않고 **이번 복습에서 끝난 정확한 위치부터
이어서 시작한다.**

현재까지의 핵심 진단:

-   기본 `useState`, Event, `map`, `filter`는 사용할 수 있다.
-   배열 State의 추가/삭제는 독립 구현이 가능했다.
-   `map + 조건 + Object Spread` 객체 배열 수정은 처음 막혔지만
    재시험에서는 힌트 없이 구현했다.
-   `key`는 React의 리스트 식별용이며 일반 Props가 아니다.
-   데이터 Props의 기본은 이해했다.
-   **함수 Props는 가장 명확하게 발견된 보강 포인트 중 하나다.**
-   State는 무조건 최상위가 아니라 그 State가 필요한 컴포넌트들의 적절한
    공통 부모에 둔다.
-   코드는 작성할 수 있어도 각 문법의 정확한 역할을 설명하는 속도가 느린
    편이다.
-   요구사항의 작은 UI 조건을 구현 과정에서 조금 다르게 바꾸는 경우가
    있었다.

> **팁:** 다음날에는 총정리를 먼저 외우듯 읽지 않는다. 문제부터 풀고,
> 기억이 나지 않는 부분만 이전 정리를 확인한다.

## STEP 1 --- 함수 Props 재시험

새로운 예제를 보고 힌트 없이 판단한다.

``` text
부모 Component
├─ State
├─ State를 변경하는 handler
└─ 자식 Component
   └─ 실제 Button
```

State 위치, handler 생성 위치, 자식에게 전달할 Props, 자식에서 함수가
실행되는 위치, 최종적으로 변경되는 State를 설명한다.

``` text
부모에서 handler 생성
↓
함수를 Props로 자식에게 전달
↓
자식 Event에서 실행
↓
부모 handler 실행
↓
부모 State 업데이트
↓
Re-render
```

> **팁:** `onDelete={handleDelete}`를 외우지 말고 **State가 있는 위치와
> Event가 발생하는 위치가 다르기 때문에 함수를 전달한다**고 이해한다.

## STEP 2 --- State 위치 스스로 결정하기

``` text
이 데이터를 누가 사용하는가?
↓
한 Component만 사용?
→ 그 Component 가까이에 둔다

여러 Component가 사용?
↓
공통 부모가 어디인가?
→ 필요한 만큼 State를 올린다
```

Local State, 공통 부모, Lifting State Up, 데이터 Props, 함수 Props를
재확인한다.

> **팁:** `State는 최상위에 둔다`가 아니라 **필요한 만큼만 위로
> 올린다**.

## STEP 3 --- `map + 조건 + Object Spread` 재시험

``` js
const users = [
  { id: 1, name: "A", active: false },
  { id: 2, name: "B", active: false },
];
```

요구사항: id가 2인 user의 `active`만 `true`로 변경하고 기존 배열과
객체는 직접 수정하지 않는다.

``` text
id + map + 조건 + Object Spread + 속성 덮어쓰기 + Setter
```

> **팁:** 코드 전에 **대상 찾기 → 새로운 데이터 만들기 → State
> 업데이트**를 먼저 설계한다.

## STEP 4 --- `key`와 일반 Props 재확인

``` jsx
<Item key={item.id} item={item} onDelete={handleDelete} />
```

``` text
key → React용, 일반 Props가 아님
item → 데이터 Props
onDelete → 함수 Props
```

> **팁:** 같은 `id`를 사용해도 `key={id}`와 `onDelete(id)`는 역할이
> 다르다.

## STEP 5 --- 요구사항에서 설계하기

코드를 바로 작성하지 않고 화면, 변하는 데이터, Event, Component 분리,
State 위치, 데이터 Props, 함수 Props를 먼저 결정한다.

> **팁:** 빈 프로젝트에서 왜 막히는지를 찾기 위해 JSX를 작성하기 전
> **설계 단계에서 생각이 멈추는 지점**을 확인한다.

## STEP 6 --- 작은 컴포넌트 분리 실전

``` text
상품 목록
- 상품명
- 가격
- [+10]
- [삭제]
```

최소 구조:

``` text
App
└─ ProductList
   └─ ProductCard
```

`products` State, `onDelete`, `onPriceIncrease`, `key`, Event에서 부모
State 업데이트까지의 흐름을 설계한다.

> **팁:** 완성 코드보다 **왜 State와 handler를 그 컴포넌트에
> 배치했는지** 설명할 수 있는지를 중요하게 본다.

## STEP 7 --- 코드 설명 능력 재시험

``` text
① 기능의 목적
② 변하는 데이터
③ State 위치와 이유
④ 변경 대상 식별
⑤ 데이터 변환
⑥ State 업데이트
⑦ Re-render와 UI 반영
```

> **팁:** 코드를 줄 단위로 읽지 말고 **목적 → 데이터 → 변환 → 업데이트 →
> UI** 순서로 설명한다.

## STEP 8 --- 다음으로 넘어갈 기준

함수 Props, State 위치, 객체 배열 불변 업데이트, `key`와 Props 구분,
요구사항에서 Component 구조 설계가 안정적으로 나오면 다음으로 진행한다.

``` text
Events / Forms
↓
Custom Hooks
↓
localStorage
↓
Product → Cart → Order
↓
TypeScript
↓
Next.js
↓
HTTP / API
↓
비동기 JavaScript
↓
HTTP → React State
↓
useEffect
```

> **팁:** 재시험에서 사용할 수 있으면 진행하고, 이후 다른 문제에서 다시
> 등장시킨다.

## 다음 복습의 첫 문제

``` text
App
├─ cart State
├─ Header
│   └─ 장바구니 상품 개수 표시
└─ ProductList
    └─ ProductCard
        └─ [장바구니 추가] Button
```

1.  cart State는 어디에 두는가?
2.  Header에는 무엇을 Props로 전달하는가?
3.  ProductCard에서 상품을 cart에 추가하려면 함수는 어디에서 만들고
    어떻게 전달하는가?
4.  Button 클릭부터 UI 업데이트까지의 흐름을 설명한다.

**처음부터 코드를 작성하지 않고 먼저 설계를 설명한다.**

> **팁:** 다음 복습에서도 정답/오답만 보지 않고 **어느 단계에서 생각
> 시간이 갑자기 길어지는지, 어느 지점에서 힌트가 필요한지**를 계속
> 진단한다.
