# Day 20 React 기초 통합 --- 이론 총정리

> 범위: Day 18\~20\
> 환경: Next.js + TypeScript\
> 핵심 목표: 사용자 입력부터 UI 렌더링까지 React의 데이터 흐름을 하나로
> 연결한다.

## 1. 전체 데이터 흐름

``` text
사용자 입력
→ Event
→ handler
→ State
→ Product 객체 생성
→ products 배열 State 업데이트
→ Props
→ map
→ ProductItem
→ UI
```

삭제처럼 자식에서 행동이 시작되면:

``` text
자식 Event
→ 함수 Props
→ 부모 handler
→ 부모 State 변경
→ Props
→ 자식 UI 재렌더링
```

**팁:** 문법을 일렬로 외우기보다
`입력 → State → 객체 → 배열 → Props → 렌더링`이라는 큰 흐름을 먼저
잡는다.

## 2. State와 setter

``` tsx
const [productName, setProductName] = useState("");
const [price, setPrice] = useState("");
const [products, setProducts] = useState<Product[]>([]);
```

-   State는 컴포넌트가 기억해야 하는 값이다.
-   setter는 State 업데이트를 React에 요청하는 함수다.
-   State가 변경되면 React는 필요한 UI를 다시 렌더링한다.
-   이전 State를 기반으로 다음 State를 계산할 때 함수형 업데이트를
    사용한다.

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

**팁:** 일반 변수 대입과 State 업데이트를 구분한다. React UI에
반영되어야 하는 값은 setter를 통해 변경한다.

## 3. 불변 업데이트와 spread

배열이나 객체 State를 직접 수정하지 않고 새로운 배열/객체를 만든다.

배열 추가:

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

객체 업데이트:

``` tsx
setForm((prevForm) => ({
  ...prevForm,
  name: "철수",
}));
```

`...prevProducts`는 기존 배열의 요소를 새 배열 안에 펼친다.
`...prevForm`은 기존 객체의 속성을 새 객체에 복사한다.

**팁:** `setState(prev => 다음 값)`을 뼈대로 기억하고, 그 안에서 새 배열
또는 새 객체를 만든다.

## 4. Array: map과 filter

### map

`map`은 배열의 각 요소를 다른 값으로 변환하여 새 배열을 반환한다.

``` tsx
products.map((product) => (
  <ProductItem
    key={product.id}
    product={product}
  />
));
```

여기서는 `Product → JSX`로 변환한다.

### filter

`filter`는 조건이 `true`인 요소만 모아 새 배열을 반환한다.

``` tsx
setProducts((prevProducts) =>
  prevProducts.filter((product) => product.id !== id)
);
```

삭제 대상과 id가 다른 상품은 `true`이므로 남고, 같은 상품은
`false`이므로 제외된다.

**팁:** `filter = 삭제 함수`가 아니다.
`조건을 통과한 요소로 새 배열 생성`이 정확한 의미다.

## 5. Product와 Product\[\]

``` tsx
type Product = {
  id: number;
  name: string;
  price: number;
};
```

-   `Product`: 상품 객체 하나
-   `Product[]`: Product 객체 여러 개가 들어 있는 배열

``` tsx
const [products, setProducts] = useState<Product[]>([]);
```

**팁:** 단수 `product`는 하나, 복수 `products`는 배열이라고 연결하면
타입을 읽기 쉽다.

## 6. 입력값에서 Product 객체 만들기

``` tsx
const newProduct: Product = {
  id: Date.now(),
  name: productName,
  price: Number(price),
};
```

`input type="number"`를 사용해도 `event.target.value`는 문자열로 다룬다.
따라서 최종 `Product.price`가 `number`라면 `Number(price)`처럼 변환한다.

**팁:** 입력 단계의 타입과 최종 데이터 모델의 타입은 다를 수 있다.

## 7. Controlled Component

``` tsx
<input
  type="text"
  value={productName}
  onChange={handleChangeProductName}
/>
```

흐름:

``` text
사용자 입력
→ change Event
→ onChange
→ handler
→ event.target.value
→ setter
→ State
→ 재렌더링
→ value={State}
```

State가 input의 표시 값을 제어하고, 사용자 입력은 Event를 통해 다시
State에 반영된다.

입력 초기화:

``` tsx
setProductName("");
setPrice("");
```

State가 빈 문자열이 되면 `value={State}`인 input도 비워진다.

**팁:** Controlled Component에서는 DOM을 직접 지우기보다 원본인 State를
변경한다.

## 8. Event와 Event 타입

input 변경:

``` tsx
const handleChangeProductName = (
  e: ChangeEvent<HTMLInputElement>
) => {
  setProductName(e.target.value);
};
```

Form 제출:

``` tsx
const handleSubmit = (
  e: FormEvent<HTMLFormElement>
) => {
  e.preventDefault();
};
```

-   `ChangeEvent<HTMLInputElement>`: input 변경 Event
-   `FormEvent<HTMLFormElement>`: form 제출 Event
-   `preventDefault()`: 브라우저의 기본 form 제출 동작을 막는다.

**팁:** `입력 = onChange`, `제출 = onSubmit`으로 먼저 나눈다.

## 9. onSubmit과 onClick

Form 전체를 제출할 때:

``` tsx
<form onSubmit={handleSubmit}>
```

특정 버튼의 클릭 행동을 처리할 때:

``` tsx
<button onClick={() => handleDelete(product.id)}>
  삭제
</button>
```

`onClick={() => handleDelete(product.id)}`는 클릭 시 현재 상품의 id를
삭제 함수에 전달한다.

**팁:** 함수를 인수와 함께 클릭 시점에 호출해야 한다면
`() => 함수(인수)` 패턴을 떠올린다.

## 10. Props

부모가 자식에게 데이터를 전달한다.

``` tsx
<ProductList products={products} />
```

읽는 법:

``` text
products={products}
    ↑         ↑
Props 이름   전달할 값
```

즉 `products`라는 Props 이름으로 부모의 `products` State 값을 전달한다.

**팁:** JSX의 `xxx={yyy}`는 `xxx라는 이름으로 yyy 값을 전달한다`라고
읽는다.

## 11. Props 타입과 구조 분해

``` tsx
type ProductListProps = {
  products: Product[];
};

function ProductList({ products }: ProductListProps) {
  // ...
}
```

`{ products }`는 Props 객체에서 `products`를 꺼내는 구조 분해 할당이다.

상품 하나를 받는 컴포넌트:

``` tsx
type ProductItemProps = {
  product: Product;
};

function ProductItem({ product }: ProductItemProps) {
  return (
    <div>
      <p>{product.name}</p>
      <p>{product.price}</p>
    </div>
  );
}
```

**팁:** 컴포넌트가 실제로 필요한 외부 값이 무엇인지 찾으면 Props 후보가
보인다.

## 12. 함수 Props

함수도 Props로 전달할 수 있다.

``` tsx
type ProductItemProps = {
  product: Product;
  handleDelete: (id: number) => void;
};
```

함수 타입:

``` text
(id: number) => void
```

-   `id: number`: 함수가 받는 값
-   `void`: 사용하는 반환값이 없음

전달 흐름:

``` text
App의 handleDelete
→ ProductList의 함수 Props
→ ProductItem의 함수 Props
→ 버튼 클릭
→ handleDelete(product.id)
→ App의 handler 실행
```

**팁:** 함수 Props 타입은 항상 `(무엇을 받는가) => 무엇을 반환하는가`로
나누어 읽는다.

## 13. Component 분리

최종 구조:

``` text
App
├── ProductForm
├── ProductList
│   └── ProductItem
```

역할:

-   `App`: State와 주요 handler 관리
-   `ProductForm`: 입력과 제출 UI
-   `ProductList`: `Product[]`를 받아 `map`
-   `ProductItem`: `Product` 하나를 받아 UI 출력

**팁:** 처음부터 컴포넌트를 과도하게 나누지 말고 기능이 동작한 뒤 필요한
Props가 보일 때 분리한다.

## 14. map과 key

``` tsx
products.map((product) => (
  <ProductItem
    key={product.id}
    product={product}
  />
));
```

-   `map`: 각 Product를 JSX로 변환
-   `key`: React가 목록의 각 항목을 식별하는 데 사용하는 특별한 값
-   `key`는 일반 Props처럼 자식 컴포넌트에서 받는 데이터가 아니다.

**팁:** 안정적이고 고유한 식별자인 `product.id`를 key로 사용하는 패턴을
기억한다.

## 15. 상품 추가 패턴

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

공통 뼈대:

``` text
이전 State
→ 새로운 배열 계산
→ setter
→ State 변경
→ 재렌더링
```

**팁:** 추가는 `새 항목 + 기존 항목`으로 새 배열을 만든다고 생각한다.

## 16. 상품 삭제 패턴

``` tsx
const handleDelete = (id: number) => {
  setProducts((prevProducts) =>
    prevProducts.filter((product) => product.id !== id)
  );
};
```

흐름:

``` text
삭제 버튼
→ product.id
→ 함수 Props
→ 부모 handleDelete
→ filter
→ 새 Product[]
→ setProducts
→ 재렌더링
```

`products.filter(...)`만 호출하면 새 배열은 만들어지지만 State가 바뀌지
않으므로 UI도 변경되지 않는다.

**팁:** React에서 새 데이터를 계산했다면
`그 결과를 어떤 setter에 넣어야 하는가?`까지 생각한다.

## 17. Next.js의 "use client"

``` tsx
"use client";
```

현재 학습 범위에서 `useState`, Event handler, 브라우저 사용자 상호작용이
필요한 컴포넌트는 Client Component로 작성한다.

**팁:** Day 20에서는 Next.js 고급 기능보다 React 기초 데이터 흐름을
Next.js + TypeScript 환경에서 정확히 사용하는 데 집중한다.

## 18. 디버깅 층 분류

``` text
JavaScript / Web
→ value, Number, spread, map, filter

React
→ State, setter, Props, Controlled Component, key

TypeScript
→ Product, Product[], Event 타입, Props 타입, 함수 타입

Next.js
→ "use client"
```

**팁:** 에러가 나면 코드를 무작정 바꾸지 말고 어느 층의 문제인지 먼저
분류한다.

## 19. 핵심 코드 패턴 6개

### 입력

``` tsx
onChange={handleChange}

const handleChange = (
  e: ChangeEvent<HTMLInputElement>
) => {
  setState(e.target.value);
};
```

### 객체 생성

``` tsx
const newProduct: Product = {
  id: Date.now(),
  name: productName,
  price: Number(price),
};
```

### 배열 추가

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

### Props 전달

``` tsx
<ProductList products={products} />
```

### 목록 출력

``` tsx
products.map((product) => (
  <ProductItem
    key={product.id}
    product={product}
  />
));
```

### 삭제

``` tsx
setProducts((prevProducts) =>
  prevProducts.filter((product) => product.id !== id)
);
```

**팁:** 전체 코드를 외우지 말고 이 6개 패턴이 어떤 문제를 해결하는지
연결해서 기억한다.

## 20. 최종 사고 흐름

``` text
입력
→ State
→ 객체
→ 배열 State
→ Props
→ map
→ UI
```

조금 더 자세히:

``` text
사용자 행동
→ Event
→ handler
→ setter
→ State 변경
→ 데이터 구조 변경
→ Props
→ Rendering
→ UI
```

자식에서 부모의 State를 변경해야 할 때:

``` text
자식 Event
→ 함수 Props
→ 부모 handler
→ 부모 State
→ Props
→ 자식 UI
```

**팁:** 코딩 중 막히면 전체 정답을 찾기 전에
`지금 나는 이 흐름의 어느 단계에 있는가?`부터 확인한다.
