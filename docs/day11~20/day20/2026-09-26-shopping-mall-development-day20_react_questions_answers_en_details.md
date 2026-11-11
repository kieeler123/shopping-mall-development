# Day 20 React Fundamentals Integration --- Large Exercise & Answer Bank

> Click **Show answers** to expand each answer section. Scope: Days
> 18--20 / Next.js + TypeScript\
> Structure: concepts → code reading → fill-in-the-blank → debugging →
> coding → integrated design\
> Recommended: solve the questions first, then check the answers below
> each section.

## Part 1. JavaScript / Web Fundamentals

### Questions

1.  Explain the difference between an array and an object.
2.  What does `...products` do inside an array?
3.  What is the resulting array order?

```ts
const products = ["A", "B"];
const next = ["C", ...products];
```

4.  Does `map` directly mutate the original array?
5.  What happens to an element when a `filter` callback returns `true`?
6.  Convert the string `"50000"` to the number `50000`.
7.  `input type="number"`의 `event.target.value`를 왜 숫자라고 가정하면
    안 되는가?
8.  구조 분해 할당의 의미를 설명하라.
9.  다음 코드에서 `name`의 값은?

```ts
const product = { id: 1, name: "mouse" };
const { name } = product;
```

10. What is a callback function?
11. 다음 코드를 완성하라.

```ts
const names = products.____((product) => product.name);
```

12. id가 3이 아닌 항목만 남기는 코드를 완성하라.

```ts
products.____((product) => product.id ____ 3);
```

<details><summary><strong>Show answers</strong></summary>

1.  배열은 여러 값을 순서대로 보관하는 자료구조이고, 객체는 key-value
    형태로 관련 데이터를 묶는다.
2.  기존 배열의 요소를 현재 배열 안에 펼친다.
3.  `["C", "A", "B"]`
4.  아니다. `map`은 변환된 새 배열을 반환한다.
5.  새 배열에 남는다.
6.  `Number("50000")`
7.  HTML input의 `value`는 문자열로 다루기 때문이다.
8.  객체/배열에서 필요한 값을 꺼내 변수에 바로 할당하는 문법이다.
9.  `"mouse"`
10. 다른 함수에 전달되어 특정 시점에 실행되는 함수.
11. `map`
12. `filter`, `!==`

</details>

**Tip:** React Questions처럼 보여도 `map`, `filter`, `spread`,
`Number()`에서 막혔다면 먼저 JavaScript Questions로 분리한다.

---

## Part 2. State / Setter

### Questions

13. What is State?
14. What is the role of a setter?
15. What is the key difference between changing a normal variable and
    updating State?
16. 다음 코드에서 State와 setter를 각각 말하라.

```tsx
const [count, setCount] = useState(0);
```

17. Write code that increments count by 1 based on the previous count.
18. Why use a setter instead of `count = count + 1`?
19. When is a functional State update especially useful?
20. 다음 빈칸을 채워라.

```tsx
setCount((____) => ____ + 1);
```

21. `useState<Product[]>([])`에서 `Product[]`는 무엇을 뜻하는가?
22. `useState("")`로 만든 State의 초기 타입은 보통 무엇으로 추론되는가?

<details><summary><strong>Show answers</strong></summary>

13. 컴포넌트가 기억하고 UI에 반영할 수 있는 데이터.
14. React에 State 업데이트를 요청한다.
15. State는 setter로 업데이트할 때 React의 렌더링 흐름과 연결된다.
16. State=`count`, setter=`setCount`
17. `setCount((prevCount) => prevCount + 1);`
18. React가 State 변경을 처리하고 필요한 UI를 재렌더링하도록 하기
    위해서다.
19. 다음 State가 이전 State에 의존할 때.
20. `prevCount`, `prevCount`
21. `Product` 객체들의 배열.
22. `string`

</details>

**Tip:** `setState(prev => next)`를 하나의 기본 뼈대로 익혀두면 배열
추가·삭제에도 그대로 적용할 수 있다.

---

## Part 3. Immutability / Object / Array / Spread

### Questions

23. What is an immutable update in React State?
24. 다음 중 올바른 배열 추가 방식은?

```tsx
A.products.push(newProduct);
B.setProducts((prev) => [newProduct, ...prev]);
```

25. 다음 객체 업데이트 결과에서 `name`은 무엇인가?

```tsx
const form = { name: "영희", age: 20 };
const next = { ...form, name: "철수" };
```

26. 왜 spread 뒤에 같은 속성을 쓰면 새 값이 적용되는가?
27. 다음 코드를 완성하라.

```tsx
setForm((prevForm) => ({
  ____,
  age: 30,
}));
```

28. 배열 State에 새 상품을 맨 앞에 추가하라.
29. 새 상품을 맨 뒤에 추가하려면 spread 순서를 어떻게 바꾸는가?
30. `[]`와 `{}`가 각각 어떤 데이터 구조를 만드는가?

<details><summary><strong>Show answers</strong></summary>

23. 기존 State를 직접 수정하지 않고 새로운 객체/배열을 만들어 State를
    교체하는 방식.
24. B
25. `"철수"`
26. 객체에서 같은 key가 뒤에 다시 나오면 뒤의 값이 최종 값이 되기
    때문이다.
27. `...prevForm`
28. `setProducts((prev) => [newProduct, ...prev]);`
29. `[...prev, newProduct]`
30. `[]`는 배열, `{}`는 객체.

</details>

**Tip:** 객체 spread에서는 순서가 중요하다.
`{ ...old, name: newName }`은 기존 값을 복사한 뒤 `name`만 덮어쓴다.

---

## Part 4. Product Types / TypeScript

### Questions

31. 다음 타입을 작성하라: id는 number, name은 string, price는 number인
    `Product`.
32. What is the difference between `Product` and `Product[]`?
33. 다음 중 올바른 값은?

```ts
type Product = { id: number; name: string; price: number };
A. { id: 1, name: "mouse", price: 30000 }
B. { id: "1", name: "mouse", price: "30000" }
```

34. `price: "50000"`이 잘못된 이유는?
35. `const newProduct: Product = ...`에서 `: Product`의 역할은?
36. 빈 Product 배열 State를 선언하라.
37. `(id: number) => void`를 말로 설명하라.
38. `void`는 빈 배열이라는 뜻인가?
39. Props 타입에서 `products: Product[]`가 의미하는 것은?
40. 다음 코드의 오류를 설명하라.

```ts
type Product = [id: number, name: string, price: number];
```

상품을 `{ id, name, price }` 형태 객체로 사용하려고 한다.

<details><summary><strong>Show answers</strong></summary>

31. `type Product = { id: number; name: string; price: number };`
32. 전자는 객체 하나, 후자는 그 객체들의 배열.
33. A
34. `Product.price`는 `number`인데 문자열을 넣었기 때문.
35. `newProduct`가 `Product` 구조를 만족하는지 TypeScript가 검사하도록
    한다.
36. `const [products, setProducts] = useState<Product[]>([]);`
37. number 하나를 받고, 사용하는 반환값이 없는 함수.
38. 아니다.
39. `products` Props가 Product 객체 배열이어야 한다는 뜻.
40. 해당 문법은 객체 타입이 아니라 tuple 타입을 정의한다.

</details>

**Tip:** TypeScript 오류를 만나면 먼저
`지금 필요한 것은 객체인가, 배열인가, 함수인가?`를 분류한다.

---

## Part 5. Controlled Components / Events

### Questions

41. What is a Controlled Component?
42. 다음 input에서 State는 무엇인가?

```tsx
<input value={productName} onChange={handleChangeProductName} />
```

43. 사용자가 input에 타이핑한 뒤 State까지 가는 순서를 설명하라.
44. input 변경 Event 타입을 작성하라.
45. form Event 타입을 작성하라.
46. What is `event.target.value`?
47. 다음 handler를 완성하라.

```tsx
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  ____(e.target.value);
};
```

setter 이름은 `setProductName`이다. 48. input을 비우기 위해 Controlled
Component에서 무엇을 변경해야 하는가? 49. 상품 등록 후 상품명과 가격을
모두 초기화하는 코드를 작성하라. 50. What is the difference between
`onChange` and `onSubmit`?

<details><summary><strong>Show answers</strong></summary>

41. React State가 input 값을 제어하고 사용자 변경을 Event로 다시 State에
    반영하는 방식.
42. `productName`
43. 사용자 입력 → change Event → onChange → handler → `e.target.value` →
    setter → State → 재렌더링.
44. `ChangeEvent<HTMLInputElement>`
45. `FormEvent<HTMLFormElement>`
46. 현재 input의 문자열 값.
47. `setProductName`
48. 연결된 State를 변경한다.
49. `setProductName(""); setPrice("");`
50. `onChange`는 입력 변화, `onSubmit`은 form 제출을 처리한다.

</details>

**Tip:** Controlled input은 `value + onChange + State` 세 요소를 한
세트로 본다.

---

## Part 6. Forms / Submit

### Questions

51. form 제출 handler는 어디에 연결하는가?
52. Why do we use `preventDefault()`?
53. 다음 코드를 완성하라.

```tsx
const handleSubmit = (e: ____) => {
  e.____();
};
```

54. 상품 등록을 `button onClick`만으로 처리하는 것보다 form `onSubmit`이
    자연스러운 이유를 설명하라.
55. `button type="submit"`의 역할은?
56. 현재 `productName`과 `price`로 Product를 만들어라.
57. `price`가 `"30000"`일 때 Product의 price를 number로 만들려면?
58. submit 후 새 상품을 배열 앞에 추가하는 코드를 작성하라.

<details><summary><strong>Show answers</strong></summary>

51. `<form onSubmit={handleSubmit}>`
52. 브라우저의 기본 form 제출 동작을 막기 위해.
53. `FormEvent<HTMLFormElement>`, `preventDefault`
54. 여러 입력값을 하나의 form 단위로 제출하는 의미와 키보드 제출 등의
    기본 form 동작을 활용할 수 있기 때문.
55. form submit을 발생시키는 버튼.
56.

```tsx
const newProduct: Product = {
  id: Date.now(),
  name: productName,
  price: Number(price),
};
```

57. `Number(price)`
58. `setProducts((prev) => [newProduct, ...prev]);`

</details>

**Tip:** 제출 handler 안에서는
`기본 동작 차단 → 입력 State 확인 → 객체 생성 → State 업데이트 → 입력 초기화`
순서로 생각한다.

---

## Part 7. Props

### Questions

59. What is the role of Props?
60. 다음 코드를 말로 읽어라.

```tsx
<ProductList products={products} />
```

61. 왼쪽 `products`와 오른쪽 `{products}`의 차이는?
62. `ProductList`가 Product 배열을 받는 Props 타입을 작성하라.
63. 구조 분해로 `products`를 받는 함수 선언을 작성하라.
64. Product 하나를 `ProductItem`에 전달하는 JSX를 작성하라.
65. `ProductItemProps`를 작성하라.
66. 부모 State가 자식 UI까지 전달되는 흐름을 설명하라.
67. Props는 자식이 직접 변경하는 값인가?
68. 컴포넌트 분리 후 어떤 Props가 필요한지 판단하는 기준은?

<details><summary><strong>Show answers</strong></summary>

59. 부모 컴포넌트가 자식에게 값이나 함수를 전달하는 통로.
60. 부모의 `products` 값을 `products`라는 Props 이름으로 ProductList에
    전달한다.
61. 왼쪽은 Props 이름, 오른쪽은 실제 전달할 JavaScript 값.
62. `type ProductListProps = { products: Product[] };`
63. `function ProductList({ products }: ProductListProps) {}`
64. `<ProductItem product={product} />`
65. `type ProductItemProps = { product: Product };`
66. 부모 State → Props → 자식 → 렌더링 → UI.
67. 일반적으로 Props는 부모에서 받은 읽기 전용 입력처럼 다룬다.
68. 해당 자식 컴포넌트가 외부에서 어떤 데이터/함수를 필요로 하는지 본다.

</details>

**Tip:** `propName={value}`를 볼 때 항상 `이름`과 `실제 값`을 분리해서
읽는다.

---

## Part 8. map / key / Rendering

### Questions

69. `map`을 React 목록 렌더링에서 사용하는 이유는?
70. `products.map` callback의 `product` 타입은 무엇인가?
71. `products`의 타입은 무엇인가?
72. 다음 빈칸을 채워라.

```tsx
products.____((product) => <ProductItem key={____} product={____} />);
```

73. Why is `key` needed?
74. `key={product.id}`가 좋은 이유는?
75. `key`는 `ProductItemProps`에 자동으로 들어오는가?
76. `map`이 여기서 Product 객체 자체를 수정하는가?
77. ProductList와 ProductItem의 역할 차이를 설명하라.

<details><summary><strong>Show answers</strong></summary>

69. 배열의 각 데이터를 JSX 요소로 변환하기 위해.
70. `Product`
71. `Product[]`
72. `map`, `product.id`, `product`
73. React가 목록의 각 항목을 안정적으로 식별하도록 돕기 위해.
74. 각 상품의 고유하고 안정적인 식별자이기 때문.
75. 아니다.
76. 아니다. 여기서는 Product를 JSX로 변환한다.
77. ProductList는 배열 전체를 받고 map하며, ProductItem은 상품 하나를
    받아 표시한다.

</details>

**Tip:** `Product[] → map → Product → ProductItem`을 하나의 고정
흐름처럼 익힌다.

---

## Part 9. Function Props

### Questions

78. Can a function be passed through Props?
79. `(id: number) => void`를 다시 설명하라.
80. `handleDelete`를 ProductList에 전달하는 JSX를 작성하라.
81. ProductListProps에 `handleDelete` 타입을 추가하라.
82. ProductList가 받은 `handleDelete`를 ProductItem으로 전달하라.
83. ProductItemProps에 `handleDelete` 타입을 추가하라.
84. 현재 상품 id를 클릭 시 전달하는 버튼을 작성하라.
85. 왜 `onClick={handleDelete(product.id)}`라고 바로 쓰면 의도와 다르게
    동작할 수 있는가?
86. `() => handleDelete(product.id)`에서 화살표 함수의 역할은?
87. 자식의 행동이 부모 State를 변경하는 흐름을 설명하라.

<details><summary><strong>Show answers</strong></summary>

78. 가능하다.
79. number를 하나 받고 사용하는 반환값이 없는 함수.
80. `<ProductList products={products} handleDelete={handleDelete} />`
81. `handleDelete: (id: number) => void;`
82. `<ProductItem product={product} handleDelete={handleDelete} />`
83. `handleDelete: (id: number) => void;`
84. `<button onClick={() => handleDelete(product.id)}>삭제</button>`
85. 렌더링 중 함수를 즉시 호출하게 되기 때문이다.
86. 클릭 시점까지 실제 호출을 미루고 현재 product.id를 전달한다.
87. 자식 Event → Function Props → 부모 handler → setter → 부모 State
    변경 → Props → 재렌더링.

</details>

**Tip:** Function Props도 결국 값 전달이다. 차이는 자식이 그 함수를
나중에 실행한다는 점이다.

---

## Part 10. Deletion / filter

### Questions

88. 다음 코드만으로 UI에서 삭제가 되지 않는 이유는?

```tsx
products.filter((product) => product.id !== id);
```

89. 올바른 삭제 handler를 작성하라.
90. 삭제 대상 id가 2일 때 `product.id !== id`가 `false`가 되는 상품은?
91. Does `filter` directly mutate the original array?
92. 삭제에서 함수형 State 업데이트를 쓰는 이유는?
93. 다음 빈칸을 채워라.

```tsx
setProducts((prevProducts) =>
  prevProducts.____((product) => product.id ____ id)
);
```

94. 삭제 버튼부터 UI 변경까지 전체 순서를 작성하라.

<details><summary><strong>Show answers</strong></summary>

88. filter가 만든 새 배열을 State에 저장하지 않았기 때문.
89.

```tsx
const handleDelete = (id: number) => {
  setProducts((prevProducts) =>
    prevProducts.filter((product) => product.id !== id),
  );
};
```

90. id가 2인 상품.
91. 아니다.
92. 다음 products가 이전 products를 기반으로 계산되기 때문.
93. `filter`, `!==`
94. 클릭 → `product.id` → Function Props → 부모 `handleDelete` →
    `filter` → 새 배열 → `setProducts` → State 변경 → 재렌더링 → UI.

</details>

**Tip:** 삭제를 `제거`라고 생각하기보다
`남길 항목들로 새 배열 만들기`라고 생각한다.

---

## Part 11. Next.js / "use client"

### Questions

95. `"use client";`는 파일 어디에 두는가?
96. 현재 학습 범위에서 왜 Client Component가 필요한가?
97. `useState`와 사용자 Event handler를 사용하는 컴포넌트는 어느 쪽에서
    실행되는 상호작용이 필요한가?
98. Day 20에서 Next.js 고급 기능까지 확장하지 않는 이유는?

<details><summary><strong>Show answers</strong></summary>

95. 파일 최상단.
96. State와 브라우저 사용자 상호작용을 사용하기 위해.
97. 브라우저/클라이언트.
98. 현재 목표가 Next.js 고급 기능이 아니라 React 데이터 흐름 통합이기
    때문.

</details>

**Tip:** `"use client"`를 단순 암기하지 말고
`State + Event + 브라우저 상호작용`과 연결한다.

---

## Part 12. Find and Fix Errors

### Questions

99. 오류를 찾아 수정하라.

```tsx
type Product = [id: number, name: string, price: number];
```

100. 오류를 찾아 수정하라.

```tsx
const [products, setProducts] = useState<[]>([]);
```

101. 오류를 찾아 수정하라.

```tsx
const newProduct: Product = {
  id: Date.now(),
  name: productName,
  price: Number,
};
```

102. 의도한 초기화가 되지 않는 이유는?

```tsx
setProductName(productName);
setPrice(price);
```

103. 삭제가 반영되지 않는 이유는?

```tsx
const handleDelete = (id: number) => {
  products.filter((product) => product.id !== id);
};
```

104. 다음 타입의 Questions를 설명하라.

```tsx
type ProductItemProps = {
  id: number;
  name: string;
  price: number;
};

function ProductItem({ product }: { product: ProductItemProps }) {}
```

`Product` 타입이 이미 존재한다고 가정한다. 105. 다음 함수 타입에서
`void`를 빈 배열이라고 설명하는 것이 왜 틀렸는가?

```ts
(id: number) => void
```

106. 다음 코드에서 잘못된 setter 이름을 찾아라.

```tsx
const [products, setProducts] = useState<Product[]>([]);
setProduct((prev) => [newProduct, ...prev]);
```

<details><summary><strong>Show answers</strong></summary>

99. `type Product = { id: number; name: string; price: number };`
100. `useState<Product[]>([])`
101. `price: Number(price)`
102. 현재 값을 다시 넣고 있으므로 값이 바뀌지 않는다. `""`로 설정해야
     한다.
103. 새 배열을 State에 넣지 않았기 때문. `setProducts(...)`가 필요하다.
104. 중복 구조 타입을 만들기보다
     `type ProductItemProps = { product: Product };`로 표현하는 것이
     명확하다.
105. `void`는 함수의 반환값을 사용하지 않는다는 뜻이며 배열과 관계없다.
106. `setProduct` → `setProducts`

</details>

**Tip:** 오류 수정에서는 코드를 통째로 다시 쓰기보다 `타입`, `State`,
`변환`, `setter`, `Props` 중 어느 층의 오류인지 먼저 찾는다.

---

## Part 13. Write the Code

### Questions

107. `Product` 타입을 작성하라.
108. `productName`, `price`, `products` State를 작성하라.
109. 상품명 change handler를 타입까지 포함해 작성하라.
110. 가격 change handler를 작성하라.
111. submit handler의 시작 부분(`preventDefault`)을 작성하라.
112. submit 안에서 `newProduct`를 작성하라.
113. `newProduct`를 배열 앞에 추가하라.
114. 입력값을 초기화하라.
115. ProductListProps를 작성하라.
116. ProductList에서 map으로 ProductItem을 렌더링하라.
117. ProductItemProps를 작성하라.
118. ProductItem에서 이름과 가격을 렌더링하라.
119. `handleDelete`를 작성하라.
120. ProductList와 ProductItem의 Props 타입에 삭제 함수를 추가하라.
121. 삭제 버튼을 작성하라.

<details><summary><strong>Show answers</strong></summary>

107.

```tsx
type Product = {
  id: number;
  name: string;
  price: number;
};
```

108.

```tsx
const [productName, setProductName] = useState("");
const [price, setPrice] = useState("");
const [products, setProducts] = useState<Product[]>([]);
```

109.

```tsx
const handleChangeProductName = (e: ChangeEvent<HTMLInputElement>) => {
  setProductName(e.target.value);
};
```

110.

```tsx
const handleChangePrice = (e: ChangeEvent<HTMLInputElement>) => {
  setPrice(e.target.value);
};
```

111.

```tsx
const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
```

112.

```tsx
const newProduct: Product = {
  id: Date.now(),
  name: productName,
  price: Number(price),
};
```

113. `setProducts((prev) => [newProduct, ...prev]);`
114. `setProductName(""); setPrice("");`
115. `type ProductListProps = { products: Product[] };`
116.

```tsx
products.map((product) => <ProductItem key={product.id} product={product} />);
```

117. `type ProductItemProps = { product: Product };`
118.

```tsx
<p>상품명: {product.name}</p>
<p>가격: {product.price}</p>
```

119.

```tsx
const handleDelete = (id: number) => {
  setProducts((prev) => prev.filter((product) => product.id !== id));
};
```

120. `handleDelete: (id: number) => void;`
121. `<button onClick={() => handleDelete(product.id)}>삭제</button>`

</details>

**Tip:** 이 파트는 Answers을 외우지 말고, Answers을 가린 상태에서 여러
번 직접 타이핑한다.

---

## Part 14. Data Flow Oral Review

### Questions

122. 입력이 State로 들어가는 흐름을 설명하라.
123. State 값으로 Product가 만들어지는 흐름을 설명하라.
124. Product가 Product\[\]에 들어가는 흐름을 설명하라.
125. Product\[\]가 UI가 되는 흐름을 설명하라.
126. 자식의 삭제 클릭이 부모 State까지 가는 흐름을 설명하라.
127. 입력 초기화가 실제 input UI를 비우는 이유를 설명하라.
128. `Number(price)`는 전체 흐름 중 어느 시점에 필요한가?
129. spread는 어느 시점에 필요한가?
130. map은 어느 시점에 필요한가?
131. filter는 어느 시점에 필요한가?
132. Props는 어느 시점에 필요한가?

<details><summary><strong>Show answers</strong></summary>

122. 입력 → Event → onChange → handler → `e.target.value` → setter →
     State.
123. submit handler에서 현재 입력 State를 읽어 `newProduct` 객체를
     만든다.
124. `setProducts(prev => [newProduct, ...prev])`.
125. products State → Props → ProductList → map → ProductItem → UI.
126. ProductItem 클릭 → `handleDelete(product.id)` → Function Props →
     App handler → filter → setProducts → 재렌더링.
127. input의 `value`가 State에 연결되어 있기 때문.
128. 문자열 price로 number 타입의 Product를 만들 때.
129. 새 Product를 기존 배열과 합쳐 새 배열을 만들 때.
130. Product\[\]를 JSX 목록으로 바꿀 때.
131. 삭제 대상을 제외한 새 Product\[\]를 만들 때.
132. 부모 데이터를 자식 컴포넌트로 전달할 때.

</details>

**Tip:** 긴 문장을 외우지 말고 단계별 화살표를 직접 그려본다.

---

## Part 15. 통합 실전 Questions

### Questions 133 --- Level 1

이름 input 하나를 만들고 Controlled Component로 구현하라. 입력한 이름을
바로 `<p>`에 출력한다.

### Questions 134 --- Level 2

이름과 이메일을 State로 관리하고 form 제출 시 제출 결과를 별도 UI에
출력하라.

### Questions 135 --- Level 3

상품명과 가격을 입력받아 `Product`를 만들고 `products` State에 추가한 뒤
`map`으로 출력하라.

### Questions 136 --- Level 4

135번을 `ProductForm`, `ProductList`, `ProductItem`으로 분리하고 Props를
연결하라.

### Questions 137 --- Level 5

136번에 삭제 기능을 추가하라. 삭제 함수는 App에 두고 Function Props로
ProductItem까지 전달하라.

### Questions 138 --- 변형

새 상품을 목록의 뒤에 추가하도록 수정하라.

### Questions 139 --- 변형

가격이 0 이하인 상품은 등록하지 않도록 submit handler에 조건을 추가하라.

### Questions 140 --- 변형

상품명이 빈 문자열이면 등록하지 않도록 하라.

### Questions 141 --- 읽기

다음 흐름에서 빠진 단어를 채워라.

```text
사용자 입력 → Event → ____ → State → Product → ____ State → Props → map → UI
```

### Questions 142 --- 설계

`ProductForm`이 반드시 받아야 할 값 Props와 Function Props를 현재 구조
기준으로 나열하라.

<details><summary><strong>Show answers</strong></summary>

/ Example Direction

133. `useState("")`, `value`, `onChange`, `e.target.value`,
     `<p>{name}</p>`를 사용한다.
134. 입력용 State와 제출 결과용 State를 분리하거나 제출 객체를 만들 수
     있다.
135. 핵심은 `Product`, `Number(price)`, `setProducts`, spread, map.
136. App이 State/handler를 관리하고 Form/List/Item으로 필요한 Props를
     전달한다.
137. `handleDelete(id)` → `filter` → `setProducts`; Function Props를
     List를 거쳐 Item까지 전달한다.
138. `setProducts((prev) => [...prev, newProduct]);`
139. 예: `if (Number(price) <= 0) return;`
140. 예: `if (productName.trim() === "") return;`
141. `handler`, `products`
142. 값: `productName`, `price`; 함수: 상품명 change handler, 가격
     change handler, submit handler.

</details>

**Tip:** 133\~137은 Answers을 읽는 것보다 빈 파일에서 직접 완성하는 것이
시험의 핵심이다.

---

## Part 16. 최종 체크 20Questions

143. State와 Props의 차이는?
144. setter가 필요한 이유는?
145. 불변성이란?
146. spread는?
147. map은?
148. filter는?
149. Controlled Component는?
150. `event.target.value`의 타입은 보통?
151. `Number(price)`가 필요한 이유는?
152. `preventDefault()`는?
153. `ChangeEvent<HTMLInputElement>`는?
154. `FormEvent<HTMLFormElement>`는?
155. `Product[]`는?
156. Function Props는?
157. `(id: number) => void`는?
158. key는?
159. `"use client"`는 왜 필요한가?
160. 추가 State 업데이트 패턴은?
161. 삭제 State 업데이트 패턴은?
162. 최종 데이터 흐름을 한 줄로 말하라.

<details><summary><strong>Show answers</strong></summary>

143. State는 컴포넌트가 관리하는 상태, Props는 부모가 자식에게 전달하는
     입력값.
144. React가 상태 변경과 렌더링을 처리하게 하기 위해.
145. 기존 State를 직접 바꾸지 않고 새 데이터 구조를 만드는 원칙.
146. 기존 배열 요소/객체 속성을 새 구조에 펼치는 문법.
147. 각 요소를 변환해 새 배열 반환.
148. 조건이 true인 요소만 모아 새 배열 반환.
149. State가 input 값을 제어하고 Event로 변경을 State에 반영하는 방식.
150. `string`
151. Product의 price가 number이기 때문.
152. 브라우저 기본 동작 방지.
153. React input change Event 타입.
154. React form Event 타입.
155. Product 객체 배열.
156. 자식에게 전달되는 함수.
157. number를 받고 사용하는 반환값이 없는 함수.
158. React가 목록 항목을 식별하기 위한 특별한 값.
159. State/Event 기반 브라우저 상호작용이 필요한 Client Component를
     사용하기 위해.
160. `setProducts(prev => [newProduct, ...prev])`
161. `setProducts(prev => prev.filter(product => product.id !== id))`
162. `사용자 행동 → Event → handler → State → 데이터 변경 → Props → Rendering → UI`

</details>

**Tip:** 143\~162를 코드 없이 답하고, 막힌 항목만 해당 파트로 돌아가
복습한다.
