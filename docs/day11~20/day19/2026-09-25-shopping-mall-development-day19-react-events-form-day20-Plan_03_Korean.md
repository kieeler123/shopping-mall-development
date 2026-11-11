# Day 20 최종 복습 플랜 --- React 기초 통합

> 복습 구간: Day 18\~20\
> Day 20 역할: **새 개념을 늘리지 않고, 지금까지 배운 내용을 하나의
> React 데이터 흐름으로 통합하는 마지막 복습**
>
> 최종 환경: **Next.js + TypeScript**

## 1. 최종 목표

``` text
사용자 입력
→ Event
→ State
→ 객체 생성
→ 배열 State 업데이트
→ Props
→ map
→ UI
```

Day 18과 Day 19를 합친다.

``` text
Day 18
State / Array / Object / Spread / Props / map / key

        +

Day 19
Event / Form / Controlled Component / Event Type

        ↓

Day 20
작은 React 기능을 처음부터 끝까지 스스로 구현
```

> **팁:** 성공 기준은 `보면 이해된다`가 아니라
> `빈 파일에서 구조를 스스로 결정할 수 있다`이다.

------------------------------------------------------------------------

## 2. Step A --- JavaScript 기초 빠른 재시험

확인:

-   Array / Object
-   함수 / callback
-   `map`
-   `filter`
-   spread
-   destructuring
-   `event.target.value`
-   `Number()`

``` js
const products = [
  { id: 1, name: "키보드", price: 50000 },
  { id: 2, name: "마우스", price: 30000 },
];

const nextProducts = [
  { id: 3, name: "모니터", price: 250000 },
  ...products,
];
```

스스로 설명:

``` text
spread는 무엇을 하는가?
왜 기존 배열을 직접 수정하지 않는가?
map과 filter의 차이는?
"50000"을 숫자로 바꾸려면?
```

> **팁:** JavaScript에서 막힌 문제를 React 문제로 착각하지 않는다.

------------------------------------------------------------------------

## 3. Step B --- State / 불변 업데이트

``` tsx
const [count, setCount] = useState(0);

setCount((prevCount) => prevCount + 1);
```

배열:

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

객체:

``` tsx
setForm((prevForm) => ({
  ...prevForm,
  name: "철수",
}));
```

확인:

-   State와 setter
-   State 변경 → 재렌더링
-   이전 State를 사용하는 함수형 업데이트
-   Object / Array 불변 업데이트

> **팁:** setter는 일반 변수 대입이 아니라 React에 State 업데이트를
> 요청하는 함수로 이해한다.

------------------------------------------------------------------------

## 4. Step C --- Props / map / key

``` tsx
<ProductList products={products} />
```

``` tsx
products.map((product) => (
  <ProductItem
    key={product.id}
    product={product}
  />
));
```

함수 Props:

``` tsx
<ProductItem
  product={product}
  onDelete={handleDelete}
/>
```

``` text
부모 State
→ Props
→ 자식
→ UI

자식의 사용자 행동
→ 함수 Props
→ 부모 handler
→ 부모 State 변경
```

> **팁:** State 위치가 헷갈리면 `누가 변경하는가?`,
> `누가 이 데이터를 필요로 하는가?`를 묻는다.

------------------------------------------------------------------------

## 5. Step D --- Event / Controlled Component / Form

``` tsx
const [productName, setProductName] = useState("");

<input
  value={productName}
  onChange={handleProductNameChange}
/>
```

``` text
사용자 입력
→ change Event
→ onChange
→ handler
→ event.target.value
→ setter
→ State
→ 재렌더링
```

Form:

``` tsx
<form onSubmit={handleSubmit}>
```

``` tsx
const handleSubmit = (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
};
```

> **팁:** Form은 `입력 = onChange`, `제출 = onSubmit`으로 먼저 나눈다.

------------------------------------------------------------------------

## 6. Step E --- TypeScript 최종 확인

``` tsx
type Product = {
  id: number;
  name: string;
  price: number;
};

const [products, setProducts] = useState<Product[]>([]);
```

Event:

``` tsx
ChangeEvent<HTMLInputElement>
FormEvent<HTMLFormElement>
```

Props:

``` tsx
type ProductListProps = {
  products: Product[];
};
```

> **팁:** React 구조를 먼저 설계하고, 그 값·Event·Props에 TypeScript
> 타입을 붙인다.

------------------------------------------------------------------------

## 7. Step F --- Next.js 최종 확인

``` tsx
"use client";
```

오늘 범위에서는:

``` text
useState
+
Event handler
+
브라우저 사용자 상호작용
↓
Client Component
```

> **팁:** Day 20에서는 Next.js 고급 기능으로 확장하지 않는다. React
> 기초를 현재 Next.js + TypeScript 환경에서 사용할 수 있으면 된다.

------------------------------------------------------------------------

## 8. 메인 과제 --- 상품 관리 미니 앱

``` text
상품명 [             ]
가격   [             ]

[상품 등록]

상품 목록
키보드 - 50000원
마우스 - 30000원
```

상품을 제출하면 목록에 새 상품이 추가된다.

사용:

-   `"use client"`
-   `useState`
-   Controlled Component
-   `onChange` / `onSubmit`
-   `preventDefault()`
-   Event 타입
-   `Product`
-   배열 State / spread
-   Props
-   `map` / `key`

> **팁:** 처음부터 전체 코드를 작성하지 않는다.

------------------------------------------------------------------------

## 9. 구현 순서

### 1 --- Product 타입

``` tsx
type Product = {
  id: number;
  name: string;
  price: number;
};
```

### 2 --- 입력 State

``` text
productName
price
```

### 3 --- Controlled input

상품명과 가격 input을 각각 State에 연결한다.

### 4 --- Form submit

``` text
onSubmit
→ preventDefault()
→ 현재 입력 State 확인
```

### 5 --- `newProduct`

input의 가격은 문자열이라는 점을 기억한다.

``` tsx
const newProduct: Product = {
  id: Date.now(),
  name: productName,
  price: Number(price),
};
```

### 6 --- products에 추가

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

### 7 --- `map`으로 출력

### 8 --- 동작한 뒤 Component 분리

``` text
ProductForm
ProductList
ProductItem
```

### 9 --- Props 연결

``` text
부모 → ProductList → ProductItem
```

> **팁:** Component 분리를 먼저 하지 않는다. 데이터 흐름이 동작한 뒤
> 나누면 어떤 Props가 필요한지 명확해진다.

------------------------------------------------------------------------

## 10. 선택 과제 --- 삭제

``` text
삭제 버튼
→ product.id
→ 부모 handler
→ filter
→ 새 배열
→ setProducts
→ 재렌더링
```

``` tsx
const handleDelete = (id: number) => {
  setProducts((prevProducts) =>
    prevProducts.filter((product) => product.id !== id)
  );
};
```

> **팁:** 상품 등록을 정답 없이 구현할 수 있을 때만 삭제 기능으로
> 확장한다.

------------------------------------------------------------------------

## 11. 디버깅 층 분류

``` text
JavaScript/Web
→ value / spread / map / filter / Number

React
→ State / setter / Props / Controlled / key

TypeScript
→ Event / Product / Product[] / Props 타입

Next.js
→ Client Component / "use client"
```

> **팁:** 에러가 나면 추측으로 코드를 계속 바꾸지 말고 어느 층의
> 문제인지 먼저 분류한다.

------------------------------------------------------------------------

## 12. 최종 구두 시험

코드를 보지 않고 설명한다.

1.  State와 Props
2.  불변 업데이트
3.  spread
4.  `map` / `key`
5.  Controlled Component
6.  `onChange`
7.  `onSubmit` vs `onClick`
8.  `preventDefault()`
9.  `ChangeEvent<HTMLInputElement>`
10. `FormEvent<HTMLFormElement>`
11. number input의 value
12. `"use client"`
13. Form → Product → products → UI
14. 함수 Props
15. 삭제 → id → filter → State

> **팁:** 정의 암기보다 데이터가 실제로 어떤 순서로 이동하는지를
> 설명한다.

------------------------------------------------------------------------

## 13. 최종 코딩 시험

``` text
Level 1
input → State → UI

Level 2
이름 + 이메일 → Form → 제출 결과

Level 3
상품명 + 가격
→ Product
→ products State
→ map

Level 4
ProductForm / ProductList / ProductItem
→ Props 연결

Level 5 (선택)
삭제
→ 함수 Props
→ id
→ filter
→ State
```

> **팁:** Level 3을 정답 없이 구현할 수 있다면 Day 18\~20의 핵심 데이터
> 흐름은 상당히 연결된 것이다.

------------------------------------------------------------------------

## 14. 완료 기준

-   [ ] State를 직접 설계한다.
-   [ ] Object / Array를 불변 업데이트한다.
-   [ ] Props / 함수 Props를 설명한다.
-   [ ] `map` / `key`를 사용한다.
-   [ ] Controlled input을 만든다.
-   [ ] Form submit을 처리한다.
-   [ ] Event 타입을 작성한다.
-   [ ] Product / Product\[\] / Props 타입을 작성한다.
-   [ ] `"use client"`를 설명한다.
-   [ ] Form 입력으로 객체를 만든다.
-   [ ] 객체를 배열 State에 추가한다.
-   [ ] Component를 분리하고 Props를 연결한다.
-   [ ] 기술 층을 분류해서 디버깅한다.

------------------------------------------------------------------------

## 15. Day 18 → 19 → 20

``` text
Day 18
데이터 관리 / 전달 / 출력
↓
State / Object / Array / Spread / Props / map / key

Day 19
사용자로부터 데이터 입력
↓
Event / Controlled input / Form / Event Type

Day 20
전부 연결
↓
Form
→ State
→ Product
→ products
→ Props
→ map
→ UI
```

최종 사고 흐름:

``` text
사용자 행동
→ Event
→ State 변경
→ 데이터 구조 변경
→ Props
→ Rendering
→ UI
```

------------------------------------------------------------------------

## 16. 권장 학습 순서

``` text
1. JavaScript 재시험 10~15분
2. State / Object / Array / Spread
3. Props / map / key
4. Event / Form
5. TypeScript 타입
6. 상품 관리 미니 앱
7. Component 분리
8. 선택: 삭제 기능
9. 구두 시험
10. 빈 파일에서 다시 구현
```

> **팁:** Day 20이 끝난 뒤에는 문법 복습 중심에서 작은 기능과 미니
> 프로젝트를 직접 만드는 연습으로 넘어가는 것이 좋다.
