# Day 18 React 복습 문제집 --- 한국어

> 범위: `useState`, Events, 배열 State, 함수 Props, State 위치, Props
> 구조 분해, `map`, `filter`, Object Spread, `key`, 요구사항 해석,
> 컴포넌트 흐름\
> 정답은 각 문제 아래 `<details>`를 펼쳐 확인하세요. 먼저 직접 풀고
> 확인하는 것을 권장합니다.

---

## Part 1. 개념 워밍업

### 문제 1

React에서 `useState`가 반환하는 두 값의 역할을 설명하세요.

<details><summary>정답 보기</summary>

```js
const [value, setValue] = useState(initialValue);
```

- `value`: 현재 State 값
- `setValue`: State를 새로운 값으로 변경하도록 요청하는 Setter 함수

**팁:** `value = 현재 데이터`, `setValue = 변경 요청 함수`로 구분하세요.

</details>

### 문제 2

다음 코드에서 `count`와 `setCount`의 자료형/역할을 설명하세요.

```jsx
const [count, setCount] = useState(0);
```

<details><summary>정답 보기</summary>

- `count`: 현재 숫
  자 State
- `setCount`: `count`를 업데이트하는 함수

초기값이 `0`이므로 현재 `count`의 초기 자료형은 number입니다.

</details>

### 문제 3

다음 중 React Event handler를 올바르게 전달한 것은 무엇인가요?

```jsx
A. <button onClick={handleClick}>클릭</button>
B. <button onClick={handleClick()}>클릭</button>
```

<details><summary>정답 보기</summary>
일반적인 클릭 시
 실행 목적이라면 **A**입니다.

```jsx
<button onClick={handleClick}>클릭</button>
```

B는 렌더링 과정에서 함수를 즉시 호출합니다.

</details>

### 문제 4

다음 코드는 왜 화살표 함수를 사용하나요?

```jsx
<button onClick={() => addToCart(product)}>
```

<details><summary>정답 보기</summary>

클릭하기 전에는
실행하지 않고, 클릭했을 때 `product`를 인자로 전달하여
`addToCart(product)`를 실행하기 위해서입니다.

</details>

### 문제 5

State를 항상 `App`에 두어야 하나요? 이유와 함께 답하세요.

<details><summary>정답 보기</summary>

아닙니다. State는
해당 데이터를 필요로 하는 컴포넌트들의 **적절한 공통
부모**에 두는 것이 기본 원칙입니다.

**팁:** 가장 높은 컴포넌트를 찾지 말고, 데이터를 공유해야 하는
컴포넌트들의 공통 부모를 찾으세요.

</details>

---

## Part 2. Props 기본

### 문제 6

부모가 다음과 같이 Props를 전달합니다.

```jsx
<UserCard name="철수" age={20} />
```

`UserCard`에서 구조 분해로 Props를 받으세요.

<details><summary>정답 보기</summary>

```jsx
function UserCard({ name, age }) {
  // ...
}
```

</details>

### 문제 7

다음 코드의 문제점을 설명하고 수정하세요.

```jsx
function ProductCard(product, onAdd) {}
```

<details><summary>정답 보기</summary>
React 함수 컴포
넌트는 기본적으로 Props 객체 하나를 받습니다.

```jsx
function ProductCard({ product, onAdd }) {}
```

또는:

```jsx
function ProductCard(props) {}
```

</details>

### 문제 8

다음 JSX에서 `title`, `price`, `onBuy`는 어떤 종류의 Props인지
설명하세요.

```jsx
<Product title="키보드" price={50000} onBuy={handleBuy} />
```

<details><summary>정답 보기</summary>
-   `title`: 문자
열 데이터 Props
-   `price`: 숫자 데이터 Props
-   `onBuy`: 함수 Props

</details>

### 문제 9

다음 코드에서 자식 컴포넌트가 `onDelete`를 실행하도록 버튼을 완성하세요.

```jsx
function Item({ id, onDelete }) {
  return <button>삭제</button>;
}
```

<details><summary>정답 보기</summary>
`
`` jsx
function Item({ id, onDelete }) {
  return (
    <button onClick={() => onDelete(id)}>
      삭제
    </button>
  );
}
```

</details>

### 문제 10

부모에서:

```jsx
<List onRemove={handleRemove} />
```

라고 전달했습니다. `List`에서 받은 함수를 `Item`에 같은 이름으로
전달하세요.

<details><summary>정답 보기</summary>

```jsx
function List({ onRemove }) {
  return <Item onRemove={onRemove} />;
}
```

</details>

---

## Part 3. 함수 Props 흐름

### 문제 11

구조가 다음과 같습니다.

```text
App
└─ ProductList
   └─ ProductCard
      └─ Button
```

`cart` State가 `App`에 있습니다. `ProductCard` 버튼을 누르면 cart를
변경해야 합니다.

`addToCart` handler는 어느 컴포넌트에 만드는 것이 자연스러운가요?

<details><summary>정답 보기</summary>
`App`입니다. `App`이 
`cart`와 `setCart`를 가지고 있기 때문입니다.
</details>

### 문제 12

위 문제에서 함수 Props의 전달 경로를 컴포넌트 이름으로 작성하세요.

<details><summary>정답 보기</summary>

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

### 문제 13

다음 코드를 완성하세요.

```jsx
function App() {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (product) => {
    setFavorites((prev) => [...prev, product]);
  };

  return <ProductList ________ />;
}
```

<details><summary>정답 보기</summary>

```jsx
<ProductList onAdd={addFavorite} />
```

Props 이름은 다른 이름도 가능하지만 전달과 수신에서 일관되어야 합니다.

</details>

### 문제 14

문제 13의 Props를 `ProductList`에서 받으세요.

<details><summary>정답 보기</summary>

```jsx
function ProductList({ onAdd }) {
  // ...
}
```

</details>

### 문제 15

`ProductList`가 받은 `onAdd`를 `ProductCard`로 전달하세요.

<details><summary>정답 보기</summary>

```jsx
<ProductCard product={product} onAdd={onAdd} />
```

</details>

### 문제 16

`ProductCard`에서 상품 전체를 전달하며 `onAdd`를 클릭 시 실행하세요.

<details><summary>정답 보기</summary>
`
`` jsx
function ProductCard({ product, onAdd }) {
  return (
    <button onClick={() => onAdd(product)}>
      찜하기
    </button>
  );
}
```

</details>

### 문제 17

다음 실행 흐름의 빈칸을 채우세요.

```text
버튼 클릭
→ ProductCard에서 ______ 실행
→ App에서 만든 handler 실행
→ ______ 호출
→ State 변경
→ 재렌더링
```

<details><summary>정답 보기</summary>
``
` text
버튼 클릭
→ ProductCard에서 함수 Props 실행
→ App에서 만든 handler 실행
→ Setter(setState) 호출
→ State 변경
→ 재렌더링
```

</details>

### 문제 18

`Header`와 `ProductCard`가 형제 관계이고 `ProductCard`에서 cart를 변경한
뒤 `Header`가 cart 개수를 표시합니다. `ProductCard`가 `Header`에 직접
값을 전달해야 하나요?

<details><summary>정답 보기</summary>

아닙니다.

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

## Part 4. State 위치 판단

### 문제 19

다음 구조에서 `searchText`를 `SearchInput`만 사용합니다.

```text
App
└─ SearchInput
```

반드시 `App`에 State를 둘 필요가 있나요?

<details><summary>정답 보기</summary>
아닙니다. 다른 
컴포넌트가 필요로 하지 않는다면 `SearchInput` 내부
State로 둘 수 있습니다.
</details>

### 문제 20

다음 구조에서 `SearchInput`은 검색어를 변경하고 `ProductList`는 그
검색어로 목록을 필터링합니다.

```text
App
├─ SearchInput
└─ ProductList
```

검색어 State의 자연스러운 위치는?

<details><summary>정답 보기</summary>
두 컴포넌트의 공통
 부모인 `App`입니다.
</details>

### 문제 21

다음 구조에서 `CartCount`와 `CartList` 모두 cart가 필요합니다.

```text
ShopPage
├─ CartCount
└─ CartList
```

cart State 위치를 고르세요.

<details><summary>정답 보기</summary>
`ShopPage`가 자
연스럽습니다.
</details>

### 문제 22

State 위치를 결정할 때 가장 중요한 질문을 한 문장으로 작성하세요.

<details><summary>정답 보기</summary>
예: **이 데이터를
 사용하는 컴포넌트들의 적절한 공통 부모는 어디인가?**
</details>

---

## Part 5. map 변수 역할

### 문제 23

다음을 보고 세 변수의 역할을 설명하세요.

```js
const numbers = [1, 2, 3];

const doubledNumbers = numbers.map((number) => {
  return number * 2;
});
```

- `numbers`
- `number`
- `doubledNumbers`

<details><summary>정답 보기</summary>
-   `numbers`: 기
존 전체 배열
-   `number`: `map`이 현재 처리하는 요소 하나
-   `doubledNumbers`: `map`이 반환한 새로운 전체 배열

</details>

### 문제 24

다음을 보고 역할을 설명하세요.

```js
const updatedProducts = products.map((product) => {
  // ...
});
```

<details><summary>정답 보기</summary>
-   `products`: 
기존 전체 배열
-   `product`: 현재 처리 중인 상품 객체 하나
-   `updatedProducts`: `map`이 만든 새로운 전체 배열

</details>

### 문제 25

다음 중 `setProducts()`에 일반적으로 넣어야 할 것은 무엇인가요?

```text
products
product
updatedProducts
updateProduct
```

단, `updateProduct`는 이벤트 handler 함수라고 가정합니다.

<details><summary>정답 보기</summary>
새로운 전
체 배열인:

```js
setProducts(updatedProducts);
```

입니다.

</details>

### 문제 26

`map` callback에서 `return`한 값들은 어떻게 되나요?

<details><summary>정답 보기</summary>
각 callback의 `retu
rn` 결과를 `map`이 모아 **새로운 배열**을 만듭니다.
</details>

---

## Part 6. Object Spread와 불변 업데이트

### 문제 27

다음 객체의 `active`만 `true`로 바꾼 새로운 객체를 만드세요.

```js
const user = {
  id: 1,
  name: "A",
  active: false,
};
```

<details><summary>정답 보기</summary>

```js
const updatedUser = {
  ...user,
  active: true,
};
```

</details>

### 문제 28

다음 코드는 무엇이 잘못되었나요?

```js
[...user, { active: true }];
```

`user`는 일반 객체입니다.

<details><summary>정답 보기</summary>
배열 Spread 문법
을 사용하고 있습니다. 객체를 복사하려면 `{}`를 사용해야
합니다.

```js
{ ...user, active: true }
```

</details>

### 문제 29

다음 코드에서 왜 `active: true`가 `...user` 뒤에 있어야 하나요?

```js
{
  ...user,
  active: true
}
```

<details><summary>정답 보기</summary>
같은 속성 이름이 
뒤에 다시 등장하면 뒤의 값이 앞의 값을 덮어쓰기
때문입니다.

반대로:

```js
{
  active: true,
  ...user
}
```

라면 기존 `user.active`가 다시 덮어쓸 수 있습니다.

</details>

### 문제 30

id가 2인 사용자만 활성화하세요.

```js
const users = [
  { id: 1, name: "A", active: false },
  { id: 2, name: "B", active: false },
];
```

<details><summary>정답 보기</summary>

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

### 문제 31

문제 30의 결과를 React State에 반영하는 한 줄을 작성하세요.

<details><summary>정답 보기</summary>

```js
setUsers(updatedUsers);
```

</details>

### 문제 32

다음 코드의 논리적 문제를 설명하세요.

```js
return { ...user, active: false };
```

이 코드가 `id !== 2`인 모든 사용자에게 실행됩니다.

<details><summary>정답 보기</summary>
원래 `active: tru
e`였던 다른 사용자까지 강제로 `false`로 바뀔 수
있습니다.

변경 대상이 아니라면:

```js
return user;
```

로 기존 객체를 유지하는 것이 적절합니다.

</details>

---

## Part 7. 오늘 실제 패턴 재시험

### 문제 33

다음 State에서 id가 2인 사용자만 `active: true`로 변경하는
`activateUser`를 완성하세요.

```jsx
const [users, setUsers] = useState([
  { id: 1, name: "A", active: false },
  { id: 2, name: "B", active: false },
]);

const activateUser = () => {
  // 작성
};
```

<details><summary>정답 보기</summary>

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

### 문제 34

다음 상품 중 id가 20인 상품의 가격을 **기존 가격에서 10,000
증가**시키세요.

```jsx
const [products, setProducts] = useState([
  { id: 10, name: "키보드", price: 50000 },
  { id: 20, name: "마우스", price: 30000 },
  { id: 30, name: "모니터", price: 200000 },
]);
```

<details><summary>정답 보기</summary>

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

**팁:** `price: 40000`도 현재 데이터에서는 같은 결과지만, 요구사항인
"기존 가격에서 10,000 증가"를 일반적으로 구현하려면 기존 값을 이용해야
합니다.

</details>

### 문제 35

id가 30인 상품의 가격을 20,000 감소시키세요.

<details><summary>정답 보기</summary>

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

### 문제 36

id가 10인 상품의 이름을 `"기계식 키보드"`로 변경하세요.

<details><summary>정답 보기</summary>

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

## Part 8. filter와 삭제

### 문제 37

다음 배열에서 id가 2인 사용자를 제거하세요.

```js
const users = [
  { id: 1, name: "A" },
  { id: 2, name: "B" },
  { id: 3, name: "C" },
];
```

<details><summary>정답 보기</summary>

```js
const updatedUsers = users.filter((user) => user.id !== 2);
```

</details>

### 문제 38

React State에서 id를 받아 해당 상품을 삭제하는 함수를 작성하세요.

<details><summary>정답 보기</summary>

```js
const deleteProduct = (id) => {
  setProducts((prevProducts) =>
    prevProducts.filter((product) => product.id !== id),
  );
};
```

</details>

### 문제 39

왜 삭제할 id와 **같지 않은** 요소를 남기나요?

```js
product.id !== id;
```

<details><summary>정답 보기</summary>
`filter`는 조건이 `t
rue`인 요소를 새 배열에 남깁니다. 삭제 대상만
`false`가 되도록 해야 나머지가 유지됩니다.
</details>

### 문제 40

`map`과 `filter`를 각각 언제 주로 사용하는지 설명하세요.

<details><summary>정답 보기</summary>
-   `map`: 배열의
 각 요소를 변환하거나 특정 요소를 수정하면서 배열
    구조를 유지할 때
-   `filter`: 조건에 맞는 요소만 남겨 배열의 항목을 제거/선별할 때

</details>

---

## Part 9. key vs Props

### 문제 41

다음 코드에서 `key`의 역할을 설명하세요.

```jsx
products.map((product) => <ProductCard key={product.id} product={product} />);
```

<details><summary>정답 보기</summary>
`key`는 React가 
목록의 각 항목을 식별하고 변경 사항을 추적하는 데
사용하는 특별한 값입니다.
</details>

### 문제 42

`ProductCard`에서 다음처럼 받을 수 있나요?

```jsx
function ProductCard({ key, product }) {
```

<details><summary>정답 보기</summary>
일반적으로 안 됩니다.
 `key`는 React가 내부적으로 사용하는 특별한
속성으로 일반 Props처럼 컴포넌트에 전달되지 않습니다.

필요하다면 별도의 Props를 전달합니다.

```jsx
<ProductCard key={product.id} productId={product.id} product={product} />
```

</details>

### 문제 43

목록의 `key`로 안정적인 고유 `id`가 있다면 무엇을 사용하는 것이 좋나요?

<details><summary>정답 보기</summary>
`
`` jsx
key={product.id}
```

처럼 안정적인 고유 id를 사용하는 것이 일반적으로 적절합니다.

</details>

### 문제 44

`key`와 일반 Props의 가장 큰 차이를 한 문장으로 설명하세요.

<details><summary>정답 보기</summary>
`key`는 React가 
목록 항목을 식별하기 위해 사용하는 특별한 값이고, 일반
Props는 자식 컴포넌트가 실제 데이터나 함수를 사용하도록 전달하는
값입니다.
</details>

---

## Part 10. 코드 오류 찾기

### 문제 45

오류를 찾으세요.

```jsx
const [favorites, setFavorites] = useState([]);

const addFavorite = (product) => {
  setFavorite((prev) => [...prev, product]);
};
```

<details><summary>정답 보기</summary>
Setter 이름 
오타입니다.

```jsx
setFavorites((prev) => [...prev, product]);
```

</details>

### 문제 46

오류를 찾으세요.

```jsx
function ProductCard({ product, onAdd }) {
  return <button onClick={() => onadd(product)}>추가</button>;
}
```

<details><summary>정답 보기</summary>
JavaScript 식별
자는 대소문자를 구분합니다.

```jsx
onAdd(product);
```

이어야 합니다.

</details>

### 문제 47

JSX 문법 문제를 수정하세요.

```jsx
return (
  <Header count={cart.length} />
  <Shop onAdd={addToCart} />
);
```

<details><summary>정답 보기</summary>
형제 요소를 하나
의 부모로 감싸야 합니다.

```jsx
return (
  <>
    <Header count={cart.length} />
    <Shop onAdd={addToCart} />
  </>
);
```

</details>

### 문제 48

JSX를 수정하세요.

```jsx
<ItemCard item={item} onAdd={onAdd}>
```

자식 콘텐츠가 없습니다.

<details><summary>정답 보기</summary>
`
`` jsx
<ItemCard item={item} onAdd={onAdd} />
```

</details>

### 문제 49

논리 오류를 찾으세요.

```js
const updatedUsers = users.map((user) => {
  if (user.id === 2) {
    return { ...user, active: true };
  }
});

setUsers(updatedUsers);
```

<details><summary>정답 보기</summary>
조건에 해당하지 
않는 요소에 대한 `return`이 없습니다. 해당 위치에
`undefined`가 들어갈 수 있습니다.

```js
const updatedUsers = users.map((user) => {
  if (user.id === 2) {
    return { ...user, active: true };
  }

  return user;
});
```

</details>

### 문제 50

논리 오류를 찾으세요.

```js
const updatedUsers = users.map((user) => {
  if (user.id === 2) {
    return { ...user, active: true };
  }

  return user;
});

setUsers(users);
```

<details><summary>정답 보기</summary>
새 배열 `updatedUse
rs`를 만들었지만 기존 배열 `users`를 다시 Setter에
넣고 있습니다.

```js
setUsers(updatedUsers);
```

</details>

### 문제 51

오류를 설명하세요.

```js
setUsers(user);
```

<details><summary>정답 보기</summary>
`users` State가 
배열이라면 `user` 객체 하나가 아니라 새로운 사용자
**배열 전체**를 넣어야 합니다.
</details>

### 문제 52

다음 코드가 의미하는 것을 설명하세요.

```js
setUsers(activateUser);
```

`activateUser`는 일반 이벤트 handler라고 가정합니다.

<details><summary>정답 보기</summary>
함수 자체를 Sette
r에 전달하고 있습니다. React의 함수형 State 업데이트와
혼동될 수도 있으며, 여기서 원하는 것은 `map`으로 만든 새로운 배열을
전달하는 것입니다.

```js
setUsers(updatedUsers);
```

</details>

---

## Part 11. 요구사항 읽기

### 문제 53

요구사항:

> 현재 수량에서 1 증가

다음 중 요구사항을 더 정확하게 표현한 코드는?

```js
A. quantity: 6
B. quantity: product.quantity + 1
```

<details><summary>정답 보기</summary>

**B**

현재 데이터에서 수량이 5라면 둘 다 6이 되지만, B가 "현재 값에서 1
증가"라는 동작 자체를 구현합니다.

</details>

### 문제 54

요구사항:

> id가 3인 사용자만 `admin: true`로 변경하고 나머지는 그대로 유지

비대상 사용자에게 다음 코드를 실행해도 될까요?

```js
return { ...user, admin: false };
```

<details><summary>정답 보기</summary>
권장되지 않습니다.
 기존에 `admin: true`인 다른 사용자가 있다면 값이
바뀝니다.

```js
return user;
```

로 그대로 유지해야 합니다.

</details>

### 문제 55

요구사항:

> 가격을 10% 할인

`price: 9000`으로 고정하는 것보다 기존 값을 이용해 작성하세요.

<details><summary>정답 보기</summa
ry>
예:

```js
price: product.price * 0.9;
```

</details>

### 문제 56

요구사항:

> 클릭한 상품만 수량을 1 증가

handler가 `id`를 받는 형태로 핵심 코드를 작성하세요.

<details><summary>정답 보기</summary>

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

## Part 12. 컴포넌트 설계 문제

### 문제 57

UI 요구사항:

- 상단에 장바구니 상품 개수 표시
- 아래에 상품 목록
- 각 상품에 `장바구니 추가` 버튼
- 버튼 클릭 시 장바구니 개수 변경

다음 구조가 있다고 할 때 State 위치와 함수 Props 흐름을 설계하세요.

```text
App
├─ Header
└─ ProductList
   └─ ProductCard
```

<details><summary>정답 보기</summary>

예시 설계:

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

### 문제 58

다음 요구사항의 컴포넌트 구조를 자유롭게 설계하세요.

- 상품 목록
- 상품명과 가격 표시
- 가격 +10,000원 버튼
- 삭제 버튼

State는 어디에 둘지, handler는 어디에서 만들지 설명하세요.

<details><summary>정답 보기</summary>
한
 가지 예:

```text
App 또는 ProductPage
└─ ProductList
   └─ ProductCard
```

상품 배열 State를 `ProductList`와 그 부모 외의 다른 컴포넌트도 필요로
한다면 공통 부모에 둡니다. 단순히 `ProductList` 내부에서만 필요하면
그곳에 둘 수도 있습니다.

State를 가진 컴포넌트에서 `increasePrice`, `deleteProduct` handler를
만들고 필요한 자식에게 함수 Props로 전달합니다.

</details>

### 문제 59

`Header`에는 cart 개수만 필요합니다. 다음 중 어느 Props가 더 직접적인
설계인지 설명하세요.

```jsx
A. <Header cart={cart} />
B. <Header count={cart.length} />
```

<details><summary>정답 보기</summary>
요구사항이 단순히
 개수 표시뿐이라면 B가 더 직접적입니다.

```jsx
<Header count={cart.length} />
```

자식에게 필요한 최소한의 데이터를 명확하게 전달할 수 있습니다.

</details>

### 문제 60

`ProductCard`는 상품 정보와 추가 함수가 필요합니다. Props를 설계하세요.

<details><summary>정답 보기</summa
ry>
예:

```jsx
<ProductCard product={product} onAdd={addToCart} />
```

받는 쪽:

```jsx
function ProductCard({ product, onAdd }) {
  // ...
}
```

</details>

---

## Part 13. 코드 작성 종합

### 문제 61

상품 추가 기능을 완성하세요.

```jsx
const [cart, setCart] = useState([]);

const addToCart = (product) => {
  // 작성
};
```

<details><summary>정답 보기</summary>
`
`` jsx
const addToCart = (product) => {
  setCart(prevCart => [...prevCart, product]);
};
```

</details>

### 문제 62

새 사용자를 배열 끝에 추가하세요.

```jsx
const [users, setUsers] = useState([]);
const newUser = { id: 1, name: "A" };
```

<details><summary>정답 보기</summary>

```js
setUsers((prevUsers) => [...prevUsers, newUser]);
```

</details>

### 문제 63

id가 5인 항목을 삭제하세요.

<details><summary>정답 보기</summary>

```js
setItems((prevItems) => prevItems.filter((item) => item.id !== 5));
```

</details>

### 문제 64

id가 7인 todo의 `done` 값을 무조건 `true`로 변경하세요.

<details><summary>정답 보기</summary>

```js
setTodos((prevTodos) =>
  prevTodos.map((todo) => (todo.id === 7 ? { ...todo, done: true } : todo)),
);
```

</details>

### 문제 65

id가 7인 todo의 `done` 값을 현재 값의 반대로 토글하세요.

<details><summary>정답 보기</summary>

```js
setTodos((prevTodos) =>
  prevTodos.map((todo) =>
    todo.id === 7 ? { ...todo, done: !todo.done } : todo,
  ),
);
```

</details>

### 문제 66

id를 인자로 받아 해당 todo의 완료 상태를 토글하는 함수를 작성하세요.

<details><summary>정답 보기</summary>

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

### 문제 67

`TodoItem`에서 다음 함수를 실행하는 버튼을 작성하세요.

```jsx
onToggle;
```

현재 todo의 id를 전달해야 합니다.

<details><summary>정답 보기</summary>
`
`` jsx
<button onClick={() => onToggle(todo.id)}>
  완료 변경
</button>
```

</details>

### 문제 68

id가 일치하는 상품의 `stock`을 1 감소시키되 기존 값을 이용하세요.

<details><summary>정답 보기</summary>

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

### 문제 69

id가 일치하는 회원의 `name`을 함수 인자로 받은 `newName`으로 변경하세요.

<details><summary>정답 보기</summary>

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

### 문제 70

상품의 `selected` 값을 토글하고, 삭제 기능도 가진 컴포넌트를 설계하세요.
State 변경 함수 2개를 작성하세요.

<details><summary>정답 보기</summa
ry>
예:

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

## Part 14. 실행 결과 예측

### 문제 71

결과를 예측하세요.

```js
const numbers = [1, 2, 3];

const result = numbers.map((number) => number + 10);
```

<details><summary>정답 보기</summary>

```js
[11, 12, 13];
```

</details>

### 문제 72

결과를 예측하세요.

```js
const numbers = [1, 2, 3, 4];

const result = numbers.filter((number) => number % 2 === 0);
```

<details><summary>정답 보기</summary>

```js
[2, 4];
```

</details>

### 문제 73

결과를 예측하세요.

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

<details><summary>정답 보기</summary>

```js
[
  { id: 1, active: true },
  { id: 2, active: true },
];
```

</details>

### 문제 74

원래 `users` 배열의 id 1 객체가 자동으로 수정되나요?

<details><summary>정답 보기</summary>
위 코드에서는 id 1
에 대해 Object Spread로 **새 객체**를 반환하므로 원래
객체를 직접 수정하지 않습니다.
</details>

### 문제 75

다음에서 `result`의 길이는?

```js
const result = products.filter((product) => product.price >= 50000);
```

`products`에 조건을 만족하는 상품이 3개 있다고 가정합니다.

<details><summary>정답 보기</summary>

```js
result.length === 3;
```

</details>

---

## Part 15. 설명 능력 테스트

### 문제 76

다음 코드를 초보자에게 설명하듯 한 줄씩 설명하세요.

```js
const updatedUsers = users.map((user) => {
  if (user.id === 2) {
    return { ...user, active: true };
  }

  return user;
});

setUsers(updatedUsers);
```

<details><summary>정답 보기</summar
y>
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

### 문제 77

`onClick={() => onAdd(product)}`를 말로 설명하세요.

<details><summary>정답 보기</summary>
버튼이 클릭되었을
 때 화살표 함수가 실행되고, 그 안에서 함수 Props인
`onAdd`를 현재 `product`와 함께 호출합니다.
</details>

### 문제 78

왜 `setProducts(product)`가 아니라 `setProducts(updatedProducts)`인지
설명하세요.

<details><summary>정답 보기</summary>
`products` State는
 상품 **배열 전체**이므로, 요소 하나인 `product`가
아니라 수정 작업이 끝난 새로운 상품 배열 전체 `updatedProducts`를
전달해야 하기 때문입니다.
</details>

### 문제 79

왜 State를 직접 수정하지 않고 새 배열/새 객체를 만드는지 설명해보세요.

<details><summary>정답 보기</summary>
React에서는 Stat
e를 불변하게 다루는 패턴을 사용하면 변경 전후의 참조가
명확해지고 업데이트를 예측하기 쉬워집니다. 배열에는 `map`, `filter`,
Spread 등을 사용해 새 값을 만드는 방식이 일반적입니다.
</details>

### 문제 80

오늘 배운 배열 객체 수정 패턴을 코드 없이 순서만 설명하세요.

<details><summary>정답 보기</summary>
``
` text
기존 전체 배열
→ 요소를 하나씩 확인
→ 변경 대상을 조건으로 찾기
→ 대상은 새 객체로 변경
→ 비대상은 그대로 반환
→ map이 새로운 전체 배열 생성
→ Setter에 새로운 전체 배열 전달
```

</details>

---

## Part 16. 장기 복습용 변형 문제

### 문제 81

학생 배열에서 id가 4인 학생의 점수를 5점 올리세요.

<details><summary>정답 보기</summary>

```js
setStudents((prevStudents) =>
  prevStudents.map((student) =>
    student.id === 4 ? { ...student, score: student.score + 5 } : student,
  ),
);
```

</details>

### 문제 82

주문 배열에서 id가 100인 주문의 상태를 `"shipped"`로 변경하세요.

<details><summary>정답 보기</summary>

```js
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === 100 ? { ...order, status: "shipped" } : order,
  ),
);
```

</details>

### 문제 83

댓글 배열에서 id가 8인 댓글을 삭제하세요.

<details><summary>정답 보기</summary>

```js
setComments((prevComments) =>
  prevComments.filter((comment) => comment.id !== 8),
);
```

</details>

### 문제 84

책 배열에서 클릭한 책의 `favorite` 값을 토글하세요.

<details><summary>정답 보기</summary>

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

### 문제 85

장바구니 상품의 id를 받아 해당 상품의 `quantity`를 1 증가시키세요.

<details><summary>정답 보기</summary>

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

### 문제 86

장바구니 상품의 수량이 1일 때 삭제하고, 2 이상이면 1 감소시키는 기능을
설계해보세요.

<details><summary>정답 보기</summary>
한 
가지 방법:

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

### 문제 87

부모의 `orders` State를 자식 `OrderCard` 버튼에서 변경해야 합니다.
필요한 설계 요소 4가지를 적으세요.

<details><summary>정답 보기</summa
ry>
예:

1.  부모가 `orders` State를 가진다.
2.  부모가 주문 변경 handler를 만든다.
3.  handler를 `OrderCard`까지 함수 Props로 전달한다.
4.  `OrderCard` 버튼 이벤트에서 필요한 id와 함께 handler를 실행한다.

</details>

### 문제 88

다음 구조에서 `ProfileName`과 `ProfileEditor`가 같은 이름 State를
사용합니다.

```text
ProfilePage
├─ ProfileName
└─ ProfileEditor
```

State 위치와 이유를 설명하세요.

<details><summary>정답 보기</summary>
공통 부모인 `Profile
Page`가 자연스럽습니다. 두 자식이 같은 State를
읽거나 변경해야 하기 때문입니다.
</details>

### 문제 89

다음 Props 전달을 완성하세요.

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

<details><summary>정답 보기</summa
ry>
예:

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

### 문제 90

다음 코드의 각 이름을 `전체 배열 / 요소 하나 / 새 전체 배열 / 함수`로
분류하세요.

```js
const changeStatus = () => {
  const nextOrders = orders.map((order) => {
    // ...
  });

  setOrders(nextOrders);
};
```

<details><summary>정답 보기</summary>
-   `orders`:
 전체 배열
-   `order`: 요소 하나
-   `nextOrders`: 새 전체 배열
-   `changeStatus`: 함수

</details>

---

# 최종 체크

문제를 풀 때 아래 순서를 스스로 떠올릴 수 있는지 확인하세요.

```text
State는 어디에 있어야 하는가?
↓
누가 State를 변경해야 하는가?
↓
handler는 어디에서 만들어야 하는가?
↓
어떤 Props를 어디로 내려보내야 하는가?
↓
현재 다루는 값은 전체 배열인가, 요소 하나인가?
↓
map / filter 중 무엇이 필요한가?
↓
기존 객체를 직접 수정하지 않았는가?
↓
새로운 전체 배열이 만들어졌는가?
↓
Setter에 올바른 값을 전달했는가?
↓
요구사항을 정확히 구현했는가?
```

> **복습 팁:** 한 번에 90문제를 반복하기보다, 며칠 뒤 문제 번호를
> 무작위로 골라 풀어보세요. 특히 33\~36, 45\~56, 57\~70, 81\~90은 장기
> 복습에 적합합니다.
