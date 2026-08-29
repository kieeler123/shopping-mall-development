# Day 5 — TypeScript `CartItem[]` 배열 타입 이해하기
## 日本語 → English → 한국어

---

# 1. 日本語

## `CartItem` は何か

```tsx
type CartItem = {
  productId: number;
  quantity: number;
};
```

`CartItem` はカート全体ではなく、**カートの中の商品1件**を表す型です。

```tsx
const item: CartItem = {
  productId: 1,
  quantity: 2,
};
```

### ポイント
`CartItem` = カートの1行、と考えると理解しやすいです。

## `CartItem[]` は何か

実際のカートには複数の商品を入れられます。

```tsx
const cart: CartItem[] = [
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 },
];
```

TypeScript では型の後ろの `[]` は、**その型の値が複数入る配列**を意味します。

```text
number[]   = number の配列
string[]   = string の配列
CartItem[] = CartItem の配列
```

### ポイント
`T` は1つ、`T[]` は T が複数、と読むと簡単です。

## `useState<CartItem[]>([])` を分解する

```tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

一般形は次のように考えられます。

```tsx
useState<型>(初期値)
```

ここでは型が `CartItem[]`、初期値が `[]` です。

つまり、

> `CartItem` の配列を保存する state を作り、最初は空配列から開始する

という意味です。

### ポイント
`<CartItem[]>` は、この state に何が入るのかを TypeScript に教える部分、と考えてください。

## なぜ `useState([])` だけでは不十分なのか

```tsx
const [cart, setCart] = useState([]);
```

空配列 `[]` だけでは、中に将来何が入るのかという情報がありません。

そのため、後で

```tsx
cart.map((item) => item.productId);
```

と書いたとき、TypeScript が `item` の構造を理解できない原因になります。

そこで、

```tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

と明示します。

### ポイント
初期値が空配列の state では、要素の型を明示すると TypeScript が理解しやすくなります。

## `CartItem[]` と `Array<CartItem>`

次の2つは同じ意味です。

```tsx
CartItem[]
Array<CartItem>
```

学習初期は短い `CartItem[]` を使えば十分です。

### ポイント
`Array<CartItem>` を見ても「CartItem の配列」と読めればOKです。

## `{}` と `[]`

```tsx
const item: CartItem = {
  productId: 1,
  quantity: 2,
};
```

これはオブジェクト1つです。

```tsx
const cart: CartItem[] = [
  { productId: 1, quantity: 2 },
];
```

これは配列です。

```text
{ ... } → オブジェクト1つ
[ ... ] → 配列
```

### ポイント
型エラーが出たら、まず値の外側が `{}` なのか `[]` なのか確認すると整理しやすいです。

## `map()` と型推論

```tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

TypeScript は `cart` が `CartItem[]` だと知っています。

そのため、

```tsx
cart.map((item) => {
  return item.productId;
});
```

では `item` を自動的に `CartItem` と推論できます。

```text
cart: CartItem[]
↓
map() で1件取り出す
↓
item: CartItem
↓
item.productId / item.quantity が使える
```

### ポイント
**配列の型が分かれば、map の1要素の型も推論できる**という関係が重要です。

## `Product[]` でも同じ

```tsx
type Product = {
  id: number;
  name: string;
  price: number;
};
```

`Product` は商品1件、`Product[]` は商品一覧です。

```tsx
const products: Product[] = [
  { id: 1, name: "T-shirt", price: 20000 },
  { id: 2, name: "Jeans", price: 50000 },
];
```

```tsx
products.map((product) => (
  <p>{product.name}</p>
));
```

ここでは `product` が `Product` と推論されます。

### ポイント
`Product / Product[]`、`CartItem / CartItem[]` のように単数と一覧をセットで考えましょう。

## 日本語まとめ

```text
T     = T型の値1つ
T[]   = T型の値の配列

CartItem   = カート項目1件
CartItem[] = カート項目の配列
```

```tsx
useState<CartItem[]>([])
```

は「CartItem の配列を保存する state を空配列で開始する」という意味です。

---

# 2. English

## What is `CartItem`?

```tsx
type CartItem = {
  productId: number;
  quantity: number;
};
```

`CartItem` represents **one item inside the shopping cart**, not the entire cart.

```tsx
const item: CartItem = {
  productId: 1,
  quantity: 2,
};
```

### Tip
Think of `CartItem` as one row in the cart.

## What does `CartItem[]` mean?

A cart can contain multiple items.

```tsx
const cart: CartItem[] = [
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 },
];
```

In TypeScript, `[]` after a type means an array containing values of that type.

```text
number[]   = array of numbers
string[]   = array of strings
CartItem[] = array of CartItem objects
```

### Tip
Read `T` as one T and `T[]` as multiple T values.

## Breaking down `useState<CartItem[]>([])`

```tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

A useful mental model is:

```tsx
useState<Type>(initialValue)
```

The type is `CartItem[]` and the initial value is `[]`.

Therefore it means:

> Create state that stores an array of `CartItem` objects and start with an empty array.

### Tip
For now, think of `<CartItem[]>` as the place where we tell TypeScript what kind of data the state will contain.

## Why not just `useState([])`?

```tsx
const [cart, setCart] = useState([]);
```

An empty array does not provide useful information about what its future elements should look like.

Later:

```tsx
cart.map((item) => item.productId);
```

TypeScript needs to know that every `item` has a `productId`.

So we explicitly write:

```tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

### Tip
When state starts with an empty array, explicitly declaring its element type is especially useful.

## `CartItem[]` vs `Array<CartItem>`

These mean the same thing:

```tsx
CartItem[]
Array<CartItem>
```

### Tip
`CartItem[]` is shorter and convenient while learning. Just recognize `Array<CartItem>` as equivalent syntax.

## Object versus array

```text
{ ... } → one object
[ ... ] → an array
```

A `CartItem` is one object, while `CartItem[]` is an array of those objects.

### Tip
When debugging a type mismatch, first check whether the actual value is an object or an array.

## How `map()` infers the item type

If:

```tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

then TypeScript knows `cart` is `CartItem[]`.

Therefore:

```tsx
cart.map((item) => {
  return item.productId;
});
```

allows TypeScript to infer that `item` is a `CartItem`.

```text
cart: CartItem[]
↓
map() takes one element
↓
item: CartItem
↓
item.productId and item.quantity are known
```

### Tip
If TypeScript knows the array element type, it can usually infer the callback item type in `map()`.

## The same idea with `Product[]`

```tsx
type Product = {
  id: number;
  name: string;
  price: number;
};
```

`Product` means one product. `Product[]` means an array of products.

```tsx
const products: Product[] = [
  { id: 1, name: "T-shirt", price: 20000 },
  { id: 2, name: "Jeans", price: 50000 },
];
```

In:

```tsx
products.map((product) => (
  <p>{product.name}</p>
));
```

`product` is inferred as `Product`.

### Tip
Pair these concepts:

```text
Product  ↔ Product[]
CartItem ↔ CartItem[]
```

## English summary

```text
T   = one value of type T
T[] = an array of values of type T
```

So:

```text
CartItem   = one cart item
CartItem[] = an array of cart items
```

And:

```tsx
useState<CartItem[]>([])
```

means creating React state that stores a `CartItem` array and starts as an empty array.

---

# 3. 한국어

## `CartItem`은 무엇일까?

```tsx
type CartItem = {
  productId: number;
  quantity: number;
};
```

`CartItem`은 장바구니 전체가 아니라 **장바구니 안의 상품 한 항목**을 의미한다.

```tsx
const item: CartItem = {
  productId: 1,
  quantity: 2,
};
```

즉 `CartItem`은 이런 객체 하나의 모양을 정의한 타입이다.

### 팁
`CartItem`을 장바구니 전체가 아니라 **장바구니 한 줄**이라고 생각하면 쉽다.

## `CartItem[]`는 왜 배열 타입일까?

실제 장바구니에는 여러 상품이 들어갈 수 있다.

```tsx
const cart: CartItem[] = [
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 },
];
```

TypeScript에서 타입 뒤에 `[]`가 붙으면 **그 타입의 값들이 들어있는 배열**이라는 뜻이다.

```text
number[]   = 숫자 배열
string[]   = 문자열 배열
CartItem[] = CartItem 배열
```

### 팁
`타입[]`을 보면 바로 **그 타입 여러 개**라고 읽어보자.

## 하나와 여러 개 비교

```tsx
const age: number = 20;
const ages: number[] = [20, 25, 30];

const name: string = "철수";
const names: string[] = ["철수", "영희", "민수"];
```

마찬가지로:

```tsx
const item: CartItem = {
  productId: 1,
  quantity: 2,
};
```

는 하나이고,

```tsx
const cart: CartItem[] = [
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 },
];
```

는 여러 개다.

### 팁
`CartItem`과 `CartItem[]`의 차이는 **항목 하나냐, 항목 목록이냐**다.

## `useState<CartItem[]>([])` 분해하기

```tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

다음 형태로 읽으면 된다.

```tsx
useState<타입>(초기값)
```

여기서:

```text
타입   = CartItem[]
초기값 = []
```

이다.

따라서 전체 의미는:

> `CartItem` 객체들의 배열을 저장하는 state를 만들고, 처음에는 빈 배열로 시작한다.

### 팁
지금은 `<...>`를 복잡한 제네릭 이론보다 **state의 데이터 타입을 TypeScript에게 알려주는 자리**라고 이해하면 충분하다.

## 왜 `useState([])`만 쓰면 문제가 될까?

```tsx
const [cart, setCart] = useState([]);
```

초기값 `[]`는 비어 있기 때문에 배열 안에 앞으로 무엇이 들어올지에 대한 정보가 부족하다.

그런데 나중에:

```tsx
cart.map((item) => {
  return item.productId;
});
```

라고 하면 TypeScript는 `item`에 `productId`가 존재한다는 사실을 알아야 한다.

그래서:

```tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

처럼 타입을 알려준다.

### 팁
`useState([])`처럼 **빈 배열을 초기값으로 사용하는 state**에서는 배열 요소의 타입을 명시하는 습관이 특히 유용하다.

## `CartItem[]`와 `Array<CartItem>`

둘은 같은 의미다.

```tsx
CartItem[]
```

```tsx
Array<CartItem>
```

예를 들어:

```tsx
const cart1: CartItem[] = [];
const cart2: Array<CartItem> = [];
```

둘 다 `CartItem` 배열이다.

### 팁
처음에는 짧은 `CartItem[]`에 익숙해져도 충분하다.

## `{}`와 `[]`를 구분하자

```text
{ ... } → 객체 하나
[ ... ] → 배열
```

따라서:

```tsx
const item: CartItem = {
  productId: 1,
  quantity: 2,
};
```

는 객체 하나이고,

```tsx
const cart: CartItem[] = [
  { productId: 1, quantity: 2 },
];
```

는 배열이다.

### 팁
TypeScript 오류를 만났을 때 **실제 값이 객체인지 배열인지** 먼저 보면 문제를 찾기 쉬워진다.

## `map()`에서 item 타입은 어떻게 결정될까?

```tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

라고 선언하면 TypeScript는 `cart`가 `CartItem[]`라는 것을 알고 있다.

그래서:

```tsx
cart.map((item) => {
  return item.productId;
});
```

에서 배열의 요소 하나인 `item`을 자동으로 `CartItem`이라고 추론한다.

```text
cart
타입 = CartItem[]
↓
map()으로 하나 꺼냄
↓
item
타입 = CartItem
↓
item.productId
item.quantity
사용 가능
```

따라서 보통:

```tsx
cart.map((item: CartItem) => {
```

처럼 매번 타입을 다시 적을 필요가 없다.

### 팁
**배열의 타입을 정확하게 정해두면 map 안의 item 타입도 따라온다.** 이 관계가 핵심이다.

## `Product[]`도 같은 원리

```tsx
type Product = {
  id: number;
  name: string;
  price: number;
};
```

여기서:

```text
Product   = 상품 하나
Product[] = 상품 목록
```

이다.

```tsx
const products: Product[] = [
  { id: 1, name: "티셔츠", price: 20000 },
  { id: 2, name: "청바지", price: 50000 },
];
```

그러면:

```tsx
products.map((product) => (
  <p>{product.name}</p>
));
```

에서 `product`는 자동으로 `Product` 타입으로 추론된다.

### 팁
`Product / Product[]`, `CartItem / CartItem[]`처럼 **단수 타입과 목록 타입을 한 쌍으로 기억**하면 좋다.

## checkout 코드와 연결하기

checkout에서는 localStorage에서 cart를 읽는다.

```tsx
const savedCart = localStorage.getItem("cart");
```

문자열을 JavaScript 데이터로 변환한다.

```tsx
const parsedCart = JSON.parse(savedCart);
```

그리고 state에 넣는다.

```tsx
setCart(parsedCart);
```

우리가 의도하는 실제 cart 데이터가 `CartItem` 객체들의 배열이라면:

```tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

이라고 선언할 수 있다.

그 후:

```tsx
cart.map((item) => (
  <div key={item.productId}>
    <p>상품 ID: {item.productId}</p>
    <p>수량: {item.quantity}</p>
  </div>
));
```

처럼 사용할 수 있다.

### 팁
타입은 임의로 만드는 것이 아니라 **실제 localStorage에 저장된 데이터 구조와 일치해야 한다.** 실제 cart가 `{ id, quantity }` 구조라면 타입도 `productId`가 아니라 `id`를 사용해야 한다.

## 최종 핵심 공식

```text
T
= T 타입의 값 하나

T[]
= T 타입의 값들이 들어있는 배열
```

따라서:

```text
CartItem
= 장바구니 항목 하나

CartItem[]
= 장바구니 항목 배열
```

그리고:

```tsx
useState<CartItem[]>([])
```

는:

> CartItem 배열을 저장하는 React state를 만들고 초기값을 빈 배열로 설정한다.

라는 의미다.

## 기억해야 할 연결

```text
type CartItem 정의
↓
CartItem = 항목 하나
↓
CartItem[] = 항목 여러 개
↓
useState<CartItem[]>([])
↓
cart의 타입은 CartItem[]
↓
cart.map(...)
↓
item은 CartItem으로 추론
```

이 구조를 이해하면 앞으로 `Product[]`, `User[]`, `Order[]` 같은 타입도 같은 방식으로 읽을 수 있다.
