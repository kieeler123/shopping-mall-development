# Day 18 React Review Problem Bank --- English

> Scope: `useState`, Events, 배열 State, function Prop, State 위치,
> Props 구조 분해, `map`, `filter`, Object Spread, `key`, 요구사항 해석,
> 컴포넌트 흐름\
> Answers are hidden under `<details>` below each question. Try each
> problem yourself before opening the answer.

---

## Part 1. Concept Warm-up

### Problem 1

Explain the roles of the two values returned by React's `useState`.

<details><summary>Show answer</summary>

```js
const [value, setValue] = useState(initialValue);
```

- `value`: current State value
- `setValue`: Setter function that requests a State update

**Tip:** `value = 현재 데이터`, `setValue = 변경 요청 function`로
구분하세요.

</details>

### Problem 2

Explain the type/role of `count` and `setCount` in the following code.

```jsx
const [count, setCount] = useState(0);
```

<details><summary>Show answer</summary>

- `count`: current numeric State
- `setCount`: function that updates `count`

초기값이 `0`이므로 현재 `count`의 초기 자료형은 number.

</details>

### Problem 3

Which of the following correctly passes a React event handler?

```jsx
A. <button onClick={handleClick}>클릭</button>
B. <button onClick={handleClick()}>클릭</button>
```

<details><summary>Show answer</summary>

For the normal case of running the function on click, **A** is correct.

```jsx
<button onClick={handleClick}>클릭</button>
```

B calls the function immediately during rendering.

</details>

### Problem 4

Why does the following code use an arrow function?

```jsx
<button onClick={() => addToCart(product)}>
```

<details><summary>Show answer</summary>

It delays execution until the click, then calls `addToCart(product)`
with `product` as the argument.

</details>

### Problem 5

Should State always live in `App`? Explain why or why not.

<details><summary>Show answer</summary>

No. State는 해당 데이터를 필요로 하는 컴포넌트들의 **적절한 공통
부모**에 두는 것이 기본 원칙.

**Tip:** 가장 높은 컴포넌트를 찾지 말고, 데이터를 공유해야 하는
컴포넌트들의 공통 부모를 찾으세요.

</details>

---

## Part 2. Props Basics

### Problem 6

The parent passes Props as follows.

```jsx
<UserCard name="철수" age={20} />
```

Receive the Props in `UserCard` using destructuring.

<details><summary>Show answer</summary>

```jsx
function UserCard({ name, age }) {
  // ...
}
```

</details>

### Problem 7

Explain the problem in the following code and fix it.

```jsx
function ProductCard(product, onAdd) {}
```

<details><summary>Show answer</summary>

React function 컴포넌트는 기본적으로 Props 객체 하나를 받습니다.

```jsx
function ProductCard({ product, onAdd }) {}
```

또는:

```jsx
function ProductCard(props) {}
```

</details>

### Problem 8

Explain what kinds of Props `title`, `price`, and `onBuy` are.

```jsx
<Product title="키보드" price={50000} onBuy={handleBuy} />
```

<details><summary>Show answer</summary>

- `title`: string data Prop
- `price`: numeric data Prop
- `onBuy`: function Prop

</details>

### Problem 9

Complete the button so the child component executes `onDelete`.

```jsx
function Item({ id, onDelete }) {
  return <button>삭제</button>;
}
```

<details><summary>Show answer</summary>

```jsx
function Item({ id, onDelete }) {
  return <button onClick={() => onDelete(id)}>삭제</button>;
}
```

</details>

### Problem 10

부모에서:

```jsx
<List onRemove={handleRemove} />
```

was passed. Pass the received function from `List` to `Item` using the
same prop name.

<details><summary>Show answer</summary>

```jsx
function List({ onRemove }) {
  return <Item onRemove={onRemove} />;
}
```

</details>

---

## Part 3. Function Props Flow

### Problem 11

구조가 다음과 같습니다.

```text
App
└─ ProductList
   └─ ProductCard
      └─ Button
```

The `cart` State lives in `App`. Clicking the `ProductCard` button must
update the cart.

Which component is the natural place to create the `addToCart` handler?

<details><summary>Show answer</summary>

`App`. `App`이 `cart`와 `setCart`를 가지고 있기 때문.

</details>

### Problem 12

Write the function-prop path from the previous problem using component
names.

<details><summary>Show answer</summary>

```text
App
↓
ProductList
↓
ProductCard
↓
Button에서 실행
```

</details>

### Problem 13

Complete the following code.

```jsx
function App() {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (product) => {
    setFavorites((prev) => [...prev, product]);
  };

  return <ProductList ________ />;
}
```

<details><summary>Show answer</summary>

```jsx
<ProductList onAdd={addFavorite} />
```

Props 이름은 다른 이름도 가능하지만 전달과 수신에서 일관되어야 합니다.

</details>

### Problem 14

Receive the Prop from Problem 13 in `ProductList`.

<details><summary>Show answer</summary>

```jsx
function ProductList({ onAdd }) {
  // ...
}
```

</details>

### Problem 15

Pass the `onAdd` received by `ProductList` down to `ProductCard`.

<details><summary>Show answer</summary>

```jsx
<ProductCard product={product} onAdd={onAdd} />
```

</details>

### Problem 16

In `ProductCard`, execute `onAdd` on click and pass the whole product.

<details><summary>Show answer</summary>

```jsx
function ProductCard({ product, onAdd }) {
  return <button onClick={() => onAdd(product)}>찜하기</button>;
}
```

</details>

### Problem 17

Fill in the blanks in the following execution flow.

```text
버튼 클릭
→ ProductCard에서 ______ 실행
→ App에서 만든 handler 실행
→ ______ 호출
→ State 변경
→ 재렌더링
```

<details><summary>Show answer</summary>

```text
버튼 클릭
→ ProductCard에서 function Prop 실행
→ App에서 만든 handler 실행
→ Setter(setState) 호출
→ State 변경
→ 재렌더링
```

</details>

### Problem 18

`Header` and `ProductCard` are siblings. After `ProductCard` updates the
cart, `Header` displays the cart count. Does `ProductCard` need to pass
the value directly to `Header`?

<details><summary>Show answer</summary>

No.

공통 부모의 State가 변경되고 부모가 재렌더링되면서 최신 값을 다시
`Header`에 Props로 전달하는 구조가 자연스럽습니다.

```text
ProductCard 이벤트
→ 부모 State 변경
→ 부모 재렌더링
→ Header에 최신 count Props 전달
```

</details>

---

## Part 4. Choosing State Location

### Problem 19

다음 구조에서 `searchText`를 `SearchInput`만 사용합니다.

```text
App
└─ SearchInput
```

Does the State necessarily need to live in `App`?

<details><summary>Show answer</summary>

No. 다른 컴포넌트가 필요로 하지 않는다면 `SearchInput` 내부 State로 둘
수 있습니다.

</details>

### Problem 20

다음 구조에서 `SearchInput`은 검색어를 변경하고 `ProductList`는 그
검색어로 목록을 필터링합니다.

```text
App
├─ SearchInput
└─ ProductList
```

What is the natural location for the search-text State?

<details><summary>Show answer</summary>

두 컴포넌트의 공통 부모인 `App`.

</details>

### Problem 21

다음 구조에서 `CartCount`와 `CartList` 모두 cart가 필요합니다.

```text
ShopPage
├─ CartCount
└─ CartList
```

Choose the location for the cart State.

<details><summary>Show answer</summary>

`ShopPage`가 자연스럽습니다.

</details>

### Problem 22

Write the most important question to ask when deciding where State
should live.

<details><summary>Show answer</summary>

Example: **이 데이터를 사용하는 컴포넌트들의 적절한 공통 부모는
어디인가?**

</details>

---

## Part 5. Variable Roles in map

### Problem 23

Explain the roles of the three variables below.

```js
const numbers = [1, 2, 3];

const doubledNumbers = numbers.map((number) => {
  return number * 2;
});
```

- `numbers`
- `number`
- `doubledNumbers`

<details><summary>Show answer</summary>

- `numbers`: original whole array
- `number`: `map`이 one element currently being processed
- `doubledNumbers`: `map`이 반환한 new whole array

</details>

### Problem 24

Explain the roles shown below.

```js
const updatedProducts = products.map((product) => {
  // ...
});
```

<details><summary>Show answer</summary>

- `products`: original whole array
- `product`: one product object currently being processed
- `updatedProducts`: `map`이 만든 new whole array

</details>

### Problem 25

Which value should generally be passed to `setProducts()`?

```text
products
product
updatedProducts
updateProduct
```

Assume `updateProduct` is an event handler function.

<details><summary>Show answer</summary>

new whole array인:

```js
setProducts(updatedProducts);
```

.

</details>

### Problem 26

What happens to the values returned by the `map` callback?

<details><summary>Show answer</summary>

`map` collects each callback's returned value into a **new array**.

</details>

---

## Part 6. Object Spread and Immutable Updates

### Problem 27

Create a new object with only `active` changed to `true`.

```js
const user = {
  id: 1,
  name: "A",
  active: false,
};
```

<details><summary>Show answer</summary>

```js
const updatedUser = {
  ...user,
  active: true,
};
```

</details>

### Problem 28

What is wrong with the following code?

```js
[...user, { active: true }];
```

`user` is a regular object.

<details><summary>Show answer</summary>

This uses array-spread syntax. To copy an object, use `{}`.

```js
{ ...user, active: true }
```

</details>

### Problem 29

Why should `active: true` come after `...user`?

```js
{
  ...user,
  active: true
}
```

<details><summary>Show answer</summary>

같은 속성 이름이 뒤에 다시 등장하면 뒤의 값이 앞의 값을 덮어쓰기 때문.

반대로:

```js
{
  active: true,
  ...user
}
```

라면 기존 `user.active`가 다시 덮어쓸 수 있습니다.

</details>

### Problem 30

Activate only the user whose id is 2.

```js
const users = [
  { id: 1, name: "A", active: false },
  { id: 2, name: "B", active: false },
];
```

<details><summary>Show answer</summary>

```js
const updatedUsers = users.map((user) => {
  if (user.id === 2) {
    return {
      ...user,
      active: true,
    };
  }

  return user;
});
```

</details>

### Problem 31

Write one line that applies the result of Problem 30 to React State.

<details><summary>Show answer</summary>

```js
setUsers(updatedUsers);
```

</details>

### Problem 32

Explain the logical problem in the following code.

```js
return { ...user, active: false };
```

This code runs for every user whose `id !== 2`.

<details><summary>Show answer</summary>

원래 `active: true`였던 다른 사용자까지 강제로 `false`로 바뀔 수
있습니다.

변경 대상이 아니라면:

```js
return user;
```

로 기존 객체를 유지하는 것이 적절합니다.

</details>

---

## Part 7. Retest of Today's Actual Patterns

### Problem 33

Complete `activateUser` so only the user with id 2 changes to
`active: true`.

```jsx
const [users, setUsers] = useState([
  { id: 1, name: "A", active: false },
  { id: 2, name: "B", active: false },
]);

const activateUser = () => {
  // 작성
};
```

<details><summary>Show answer</summary>

```jsx
const activateUser = () => {
  const updatedUsers = users.map((user) => {
    if (user.id === 2) {
      return {
        ...user,
        active: true,
      };
    }

    return user;
  });

  setUsers(updatedUsers);
};
```

</details>

### Problem 34

Increase the price of the product with id 20 by **10,000 from its
current price**.

```jsx
const [products, setProducts] = useState([
  { id: 10, name: "키보드", price: 50000 },
  { id: 20, name: "마우스", price: 30000 },
  { id: 30, name: "모니터", price: 200000 },
]);
```

<details><summary>Show answer</summary>

```jsx
const increasePrice = () => {
  const updatedProducts = products.map((product) => {
    if (product.id === 20) {
      return {
        ...product,
        price: product.price + 10000,
      };
    }

    return product;
  });

  setProducts(updatedProducts);
};
```

**Tip:** `price: 40000`도 현재 데이터에서는 같은 결과지만, 요구사항인
"기존 가격에서 10,000 증가"를 일반적으로 구현하려면 you should use the
existing value.

</details>

### Problem 35

Decrease the price of the product with id 30 by 20,000.

<details><summary>Show answer</summary>

```js
const updatedProducts = products.map((product) => {
  if (product.id === 30) {
    return {
      ...product,
      price: product.price - 20000,
    };
  }

  return product;
});

setProducts(updatedProducts);
```

</details>

### Problem 36

Change the name of the product with id 10 to `"Mechanical Keyboard"`.

<details><summary>Show answer</summary>

```js
const updatedProducts = products.map((product) => {
  if (product.id === 10) {
    return {
      ...product,
      name: "기계식 키보드",
    };
  }

  return product;
});

setProducts(updatedProducts);
```

</details>

---

## Part 8. filter and Deletion

### Problem 37

Remove the user with id 2 from the following array.

```js
const users = [
  { id: 1, name: "A" },
  { id: 2, name: "B" },
  { id: 3, name: "C" },
];
```

<details><summary>Show answer</summary>

```js
const updatedUsers = users.filter((user) => user.id !== 2);
```

</details>

### Problem 38

Write a function that receives an id and deletes that product from React
State.

<details><summary>Show answer</summary>

```js
const deleteProduct = (id) => {
  setProducts((prevProducts) =>
    prevProducts.filter((product) => product.id !== id),
  );
};
```

</details>

### Problem 39

Why do we keep elements whose id is **not equal** to the id being
deleted?

```js
product.id !== id;
```

<details><summary>Show answer</summary>

`filter`는 조건이 `true`인 요소를 새 배열에 남깁니다. 삭제 대상만
`false`가 되도록 해야 나머지가 유지됩니다.

</details>

### Problem 40

Explain when `map` and `filter` are typically used.

<details><summary>Show answer</summary>

- `map`: 배열의 각 요소를 변환하거나 특정 요소를 수정하면서 배열
  구조를 유지할 때
- `filter`: 조건에 맞는 요소만 남겨 배열의 항목을 제거/선별할 때

</details>

---

## Part 9. key vs Props

### Problem 41

Explain the role of `key` in the following code.

```jsx
products.map((product) => <ProductCard key={product.id} product={product} />);
```

<details><summary>Show answer</summary>

`key`는 React가 목록의 각 항목을 식별하고 변경 사항을 추적하는 데
사용하는 특별한 값.

</details>

### Problem 42

Can `ProductCard` receive it like this?

```jsx
function ProductCard({ key, product }) {
```

<details><summary>Show answer</summary>

일반적으로 안 됩니다. `key`는 React가 내부적으로 사용하는 특별한
속성으로 일반 Props처럼 컴포넌트에 전달되지 않습니다.

필요하다면 별도의 Props를 전달합니다.

```jsx
<ProductCard key={product.id} productId={product.id} product={product} />
```

</details>

### Problem 43

If the list has a stable unique `id`, what should generally be used as
the `key`?

<details><summary>Show answer</summary>

```jsx
key={product.id}
```

처럼 안정적인 고유 id를 사용하는 것이 일반적으로 적절합니다.

</details>

### Problem 44

Explain the main difference between `key` and normal Props in one
sentence.

<details><summary>Show answer</summary>

`key`는 React가 목록 항목을 식별하기 위해 사용하는 특별한 값이고, 일반
Props는 자식 컴포넌트가 실제 데이터나 function를 사용하도록 전달하는 값.

</details>

---

## Part 10. Find the Code Error

### Problem 45

Find the error.

```jsx
const [favorites, setFavorites] = useState([]);

const addFavorite = (product) => {
  setFavorite((prev) => [...prev, product]);
};
```

<details><summary>Show answer</summary>

Setter 이름 오타.

```jsx
setFavorites((prev) => [...prev, product]);
```

</details>

### Problem 46

Find the error.

```jsx
function ProductCard({ product, onAdd }) {
  return <button onClick={() => onadd(product)}>추가</button>;
}
```

<details><summary>Show answer</summary>

JavaScript 식별자는 대소문자를 구분합니다.

```jsx
onAdd(product);
```

이어야 합니다.

</details>

### Problem 47

Fix the JSX syntax problem.

```jsx
return (
  <Header count={cart.length} />
  <Shop onAdd={addToCart} />
);
```

<details><summary>Show answer</summary>

형제 요소를 하나의 부모로 감싸야 합니다.

```jsx
return (
  <>
    <Header count={cart.length} />
    <Shop onAdd={addToCart} />
  </>
);
```

</details>

### Problem 48

Fix the JSX.

```jsx
<ItemCard item={item} onAdd={onAdd}>
```

자식 콘텐츠가 없습니다.

<details><summary>Show answer</summary>

```jsx
<ItemCard item={item} onAdd={onAdd} />
```

</details>

### Problem 49

논리 Find the error.

```js
const updatedUsers = users.map((user) => {
  if (user.id === 2) {
    return { ...user, active: true };
  }
});

setUsers(updatedUsers);
```

<details><summary>Show answer</summary>

There is no `return` for non-matching elements, so `undefined` can
appear at those positions.

```js
const updatedUsers = users.map((user) => {
  if (user.id === 2) {
    return { ...user, active: true };
  }

  return user;
});
```

</details>

### Problem 50

논리 Find the error.

```js
const updatedUsers = users.map((user) => {
  if (user.id === 2) {
    return { ...user, active: true };
  }

  return user;
});

setUsers(users);
```

<details><summary>Show answer</summary>

A new array `updatedUsers` was created, but the old `users` array is
passed to the Setter.

```js
setUsers(updatedUsers);
```

</details>

### Problem 51

Explain the error.

```js
setUsers(user);
```

<details><summary>Show answer</summary>

If `users` State is an array, pass the new **whole user array**, not one
`user` object.

</details>

### Problem 52

다음 코드가 의미하는 것을 설명하세요.

```js
setUsers(activateUser);
```

`activateUser`는 일반 이벤트 handler라고 가정합니다.

<details><summary>Show answer</summary>

This passes the function itself to the Setter. React의 function형 State
업데이트와 혼동될 수도 있으며, 여기서 원하는 것은 `map`으로 만든 새로운
배열을 전달하는 것.

```js
setUsers(updatedUsers);
```

</details>

---

## Part 11. Reading Requirements

### Problem 53

Requirement:

> Increase the current quantity by 1

Which code more accurately represents the requirement?

```js
A. quantity: 6
B. quantity: product.quantity + 1
```

<details><summary>Show answer</summary>

**B**

현재 데이터에서 수량이 5라면 둘 다 6이 되지만, B가 "현재 값에서 1
증가"라는 동작 자체를 구현합니다.

</details>

### Problem 54

Requirement:

> Change only user id 3 to `admin: true` and leave all others unchanged

Should the following code run for non-target users?

```js
return { ...user, admin: false };
```

<details><summary>Show answer</summary>

권장되지 않습니다. 기존에 `admin: true`인 다른 사용자가 있다면 값이
바뀝니다.

```js
return user;
```

로 그대로 유지해야 합니다.

</details>

### Problem 55

Requirement:

> Discount the price by 10%

Use the existing value instead of hard-coding `price: 9000`.

<details><summary>Show answer</summary>

Example:

```js
price: product.price * 0.9;
```

</details>

### Problem 56

Requirement:

> Increase only the clicked product's quantity by 1

Write the core code with a handler that receives an `id`.

<details><summary>Show answer</summary>

```js
const increaseQuantity = (id) => {
  setProducts((prevProducts) =>
    prevProducts.map((product) =>
      product.id === id
        ? { ...product, quantity: product.quantity + 1 }
        : product,
    ),
  );
};
```

</details>

---

## Part 12. Component Design

### Problem 57

UI Requirement:

- Display cart item count at the top
- Display a product list below
- Each product has an `Add to Cart` button
- Clicking the button changes the cart count

Given the following structure, design the State location and
function-prop flow.

```text
App
├─ Header
└─ ProductList
   └─ ProductCard
```

<details><summary>Show answer</summary>

Example design:

- `cart` State: `App`
- `addToCart` handler: `App`
- `Header`: `count={cart.length}` 전달
- `ProductList`: `onAdd={addToCart}` 전달
- `ProductList → ProductCard`: `onAdd` 재전달
- `ProductCard`: 버튼 클릭 시 `onAdd(product)` 실행

```text
ProductCard 클릭
→ App의 addToCart 실행
→ cart State 변경
→ App 재렌더링
→ Header에 새로운 count 전달
```

</details>

### Problem 58

Freely design a component structure for the following requirements.

- 상품 목록
- Display product name and price
- Price +10,000 button
- Delete button

Explain where State should live and where handlers should be created.

<details><summary>Show answer</summary>

한 가지 Example:

```text
App 또는 ProductPage
└─ ProductList
   └─ ProductCard
```

상품 배열 State를 `ProductList`와 그 부모 외의 다른 컴포넌트도 필요로
한다면 공통 부모에 둡니다. 단순히 `ProductList` 내부에서만 필요하면
그곳에 둘 수도 있습니다.

State를 가진 컴포넌트에서 `increasePrice`, `deleteProduct` handler를
만들고 필요한 자식에게 function Prop로 전달합니다.

</details>

### Problem 59

`Header` only needs the cart count. Explain which Prop design is more
direct.

```jsx
A. <Header cart={cart} />
B. <Header count={cart.length} />
```

<details><summary>Show answer</summary>

요구사항이 단순히 개수 표시뿐이라면 B가 더 직접적.

```jsx
<Header count={cart.length} />
```

자식에게 필요한 최소한의 데이터를 명확하게 전달할 수 있습니다.

</details>

### Problem 60

`ProductCard` needs product data and an add function. Design its Props.

<details><summary>Show answer</summary>

Example:

```jsx
<ProductCard product={product} onAdd={addToCart} />
```

Receiving side:

```jsx
function ProductCard({ product, onAdd }) {
  // ...
}
```

</details>

---

## Part 13. Comprehensive Coding

### Problem 61

Complete the product-add function.

```jsx
const [cart, setCart] = useState([]);

const addToCart = (product) => {
  // 작성
};
```

<details><summary>Show answer</summary>

```jsx
const addToCart = (product) => {
  setCart((prevCart) => [...prevCart, product]);
};
```

</details>

### Problem 62

Add the new user to the end of the array.

```jsx
const [users, setUsers] = useState([]);
const newUser = { id: 1, name: "A" };
```

<details><summary>Show answer</summary>

```js
setUsers((prevUsers) => [...prevUsers, newUser]);
```

</details>

### Problem 63

Delete the item whose id is 5.

<details><summary>Show answer</summary>

```js
setItems((prevItems) => prevItems.filter((item) => item.id !== 5));
```

</details>

### Problem 64

Set the `done` value of the todo with id 7 to `true`.

<details><summary>Show answer</summary>

```js
setTodos((prevTodos) =>
  prevTodos.map((todo) => (todo.id === 7 ? { ...todo, done: true } : todo)),
);
```

</details>

### Problem 65

Toggle the `done` value of the todo with id 7.

<details><summary>Show answer</summary>

```js
setTodos((prevTodos) =>
  prevTodos.map((todo) =>
    todo.id === 7 ? { ...todo, done: !todo.done } : todo,
  ),
);
```

</details>

### Problem 66

Write a function that receives an id and toggles that todo's completion
state.

<details><summary>Show answer</summary>

```js
const toggleTodo = (id) => {
  setTodos((prevTodos) =>
    prevTodos.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : todo,
    ),
  );
};
```

</details>

### Problem 67

Write a button in `TodoItem` that executes the following function.

```jsx
onToggle;
```

It must pass the current todo's id.

<details><summary>Show answer</summary>

```jsx
<button onClick={() => onToggle(todo.id)}>완료 변경</button>
```

</details>

### Problem 68

Decrease `stock` by 1 for the matching product, using its existing
value.

<details><summary>Show answer</summary>

```js
const decreaseStock = (id) => {
  setProducts((prevProducts) =>
    prevProducts.map((product) =>
      product.id === id ? { ...product, stock: product.stock - 1 } : product,
    ),
  );
};
```

</details>

### Problem 69

Change the matching user's `name` to the `newName` argument.

<details><summary>Show answer</summary>

```js
const changeName = (id, newName) => {
  setUsers((prevUsers) =>
    prevUsers.map((user) =>
      user.id === id ? { ...user, name: newName } : user,
    ),
  );
};
```

</details>

### Problem 70

Design a component that can toggle a product's `selected` value and
delete products. Write two State update functions.

<details><summary>Show answer</summary>

Example:

```js
const toggleSelected = (id) => {
  setProducts((prevProducts) =>
    prevProducts.map((product) =>
      product.id === id ? { ...product, selected: !product.selected } : product,
    ),
  );
};

const deleteProduct = (id) => {
  setProducts((prevProducts) =>
    prevProducts.filter((product) => product.id !== id),
  );
};
```

</details>

---

## Part 14. Predict the Result

### Problem 71

Predict the result.

```js
const numbers = [1, 2, 3];

const result = numbers.map((number) => number + 10);
```

<details><summary>Show answer</summary>

```js
[11, 12, 13];
```

</details>

### Problem 72

Predict the result.

```js
const numbers = [1, 2, 3, 4];

const result = numbers.filter((number) => number % 2 === 0);
```

<details><summary>Show answer</summary>

```js
[2, 4];
```

</details>

### Problem 73

Predict the result.

```js
const users = [
  { id: 1, active: false },
  { id: 2, active: true },
];

const result = users.map((user) => {
  if (user.id === 1) {
    return { ...user, active: true };
  }
  return user;
});
```

<details><summary>Show answer</summary>

```js
[
  { id: 1, active: true },
  { id: 2, active: true },
];
```

</details>

### Problem 74

Is the id 1 object in the original `users` array automatically mutated?

<details><summary>Show answer</summary>

위 코드에서는 id 1에 대해 Object Spread로 **새 객체**를 반환하므로 원래
객체를 직접 수정하지 않습니다.

</details>

### Problem 75

What is the length of `result`?

```js
const result = products.filter((product) => product.price >= 50000);
```

Assume three products satisfy the condition.

<details><summary>Show answer</summary>

```js
result.length === 3;
```

</details>

---

## Part 15. Explanation Skills

### Problem 76

Explain the following code line by line as if teaching a beginner.

```js
const updatedUsers = users.map((user) => {
  if (user.id === 2) {
    return { ...user, active: true };
  }

  return user;
});

setUsers(updatedUsers);
```

<details><summary>Show answer</summary>

예시:

1.  `users.map(...)`으로 기존 사용자 배열을 한 명씩 확인한다.
2.  현재 사용자를 `user`라는 변수로 받는다.
3.  `user.id === 2`인지 검사한다.
4.  맞으면 기존 user 속성을 복사하고 `active`만 `true`로 바꾼 새 객체를
    반환한다.
5.  대상이 아니면 기존 `user`를 그대로 반환한다.
6.  `map`이 각 반환값을 모아 새 배열 `updatedUsers`를 만든다.
7.  `setUsers(updatedUsers)`로 새 배열을 State에 반영한다.

</details>

### Problem 77

Explain `onClick={() => onAdd(product)}` in words.

<details><summary>Show answer</summary>

버튼이 클릭되었을 때 화살표 function가 실행되고, 그 안에서 function
Prop인 `onAdd`를 현재 `product`와 함께 호출합니다.

</details>

### Problem 78

Explain why we use `setProducts(updatedProducts)` instead of
`setProducts(product)`.

<details><summary>Show answer</summary>

`products` State는 상품 **배열 전체**이므로, one element인 `product`가
아니라 수정 작업이 끝난 새로운 상품 배열 전체 `updatedProducts`를
전달해야 하기 때문.

</details>

### Problem 79

Explain why we create new arrays/objects instead of directly mutating
State.

<details><summary>Show answer</summary>

React에서는 State를 불변하게 다루는 패턴을 사용하면 변경 전후의 참조가
명확해지고 업데이트를 예측하기 쉬워집니다. 배열에는 `map`, `filter`,
Spread 등을 사용해 새 값을 만드는 방식이 일반적.

</details>

### Problem 80

Explain today's array-object update pattern as a sequence without code.

<details><summary>Show answer</summary>

```text
original whole array
→ 요소를 하나씩 확인
→ 변경 대상을 조건으로 찾기
→ 대상은 새 객체로 변경
→ 비대상은 그대로 반환
→ map이 new whole array 생성
→ Setter에 new whole array 전달
```

</details>

---

## Part 16. Long-term Review Variations

### Problem 81

Increase the score of the student with id 4 by 5.

<details><summary>Show answer</summary>

```js
setStudents((prevStudents) =>
  prevStudents.map((student) =>
    student.id === 4 ? { ...student, score: student.score + 5 } : student,
  ),
);
```

</details>

### Problem 82

Change the status of order id 100 to `"shipped"`.

<details><summary>Show answer</summary>

```js
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === 100 ? { ...order, status: "shipped" } : order,
  ),
);
```

</details>

### Problem 83

Delete the comment with id 8.

<details><summary>Show answer</summary>

```js
setComments((prevComments) =>
  prevComments.filter((comment) => comment.id !== 8),
);
```

</details>

### Problem 84

Toggle the `favorite` value of the clicked book.

<details><summary>Show answer</summary>

```js
const toggleFavorite = (id) => {
  setBooks((prevBooks) =>
    prevBooks.map((book) =>
      book.id === id ? { ...book, favorite: !book.favorite } : book,
    ),
  );
};
```

</details>

### Problem 85

Receive a cart item id and increase that item's `quantity` by 1.

<details><summary>Show answer</summary>

```js
const increaseQuantity = (id) => {
  setCart((prevCart) =>
    prevCart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
    ),
  );
};
```

</details>

### Problem 86

Design a function that removes a cart item when its quantity is 1,
otherwise decreases the quantity by 1.

<details><summary>Show answer</summary>

One approach:

```js
const decreaseQuantity = (id) => {
  setCart((prevCart) =>
    prevCart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
      )
      .filter((item) => item.quantity > 0),
  );
};
```

또는 조건에 따라 `filter`와 `map`을 별도로 선택하는 방식도 가능합니다.

</details>

### Problem 87

The parent's `orders` State must be updated from an `OrderCard` button.
List four required design elements.

<details><summary>Show answer</summary>

Example:

1.  부모가 `orders` State를 가진다.
2.  부모가 주문 변경 handler를 만든다.
3.  handler를 `OrderCard`까지 function Prop로 전달한다.
4.  `OrderCard` 버튼 이벤트에서 필요한 id와 함께 handler를 실행한다.

</details>

### Problem 88

다음 구조에서 `ProfileName`과 `ProfileEditor`가 같은 이름 State를
사용합니다.

```text
ProfilePage
├─ ProfileName
└─ ProfileEditor
```

Explain the State location and why.

<details><summary>Show answer</summary>

공통 부모인 `ProfilePage`가 자연스럽습니다. 두 자식이 같은 State를
읽거나 변경해야 하기 때문.

</details>

### Problem 89

Complete the following Prop passing.

```jsx
function App() {
  const handleDelete = (id) => {
    // ...
  };

  return <List ______ />;
}

function List({ onDelete }) {
  return <Card ______ />;
}

function Card({ onDelete }) {
  return <button onClick={() => ______}>삭제</button>;
}
```

<details><summary>Show answer</summary>

Example:

```jsx
function App() {
  const handleDelete = (id) => {
    // ...
  };

  return <List onDelete={handleDelete} />;
}

function List({ onDelete }) {
  return <Card onDelete={onDelete} />;
}

function Card({ onDelete }) {
  return <button onClick={() => onDelete(id)}>삭제</button>;
}
```

실제 코드에서는 `Card`가 `id`도 Props로 받아야 합니다.

</details>

### Problem 90

Classify each name as
`whole array / one element / new whole array / function`.

```js
const changeStatus = () => {
  const nextOrders = orders.map((order) => {
    // ...
  });

  setOrders(nextOrders);
};
```

<details><summary>Show answer</summary>

- `orders`: whole array
- `order`: one element
- `nextOrders`: 새 whole array
- `changeStatus`: function

</details>

---

# Final Checklist

Check whether you can recall the following sequence while solving
problems.

```text
State는 어디에 있어야 하는가?
↓
누가 State를 변경해야 하는가?
↓
handler는 어디에서 만들어야 하는가?
↓
어떤 Props를 어디로 내려보내야 하는가?
↓
현재 다루는 값은 whole array인가, one element인가?
↓
map / filter 중 무엇이 필요한가?
↓
기존 객체를 직접 수정하지 않았는가?
↓
new whole array이 만들어졌는가?
↓
Setter에 올바른 값을 전달했는가?
↓
요구사항을 정확히 구현했는가?
```

> **Review Tip:** Instead of repeating all 90 questions at once, return
> a few days later and choose random problem numbers. Problems 33--36,
> 45--56, 57--70, and 81--90 are especially useful for long-term review.
