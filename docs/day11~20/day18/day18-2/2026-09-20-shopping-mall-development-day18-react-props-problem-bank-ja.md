# Day 18 React 復習問題集 --- 日本語

> 範囲: `useState`, Events, 배열 State, 関数 Props, State 위치, Props
> 구조 분해, `map`, `filter`, Object Spread, `key`, 요구사항 해석,
> 컴포넌트 흐름\
> 答えは各問題の下にある `<details>`
> を開いて確認できます。まず自分で解いてから確認するのがおすすめです。

---

## Part 1. 概念ウォームアップ

### 問題 1

React の `useState` が返す2つの値の役割を説明してください。

<details><summary>答えを見る</summary>

```js
const [value, setValue] = useState(initialValue);
```

- `value`: 現在の State 値
- `setValue`: State の更新を要求する Setter 関数

**ヒント:** `value = 현재 데이터`, `setValue = 변경 요청 関数`로
구분하세요.

</details>

### 問題 2

次のコードで `count` と `setCount` の型・役割を説明してください。

```jsx
const [count, setCount] = useState(0);
```

<details><summary>答えを見る</summary>

- `count`: 現在の数値 State
- `setCount`: `count` を更新する関数

초기값이 `0`이므로 현재 `count`의 초기 자료형은 number입니다.

</details>

### 問題 3

次のうち、React の Event handler を正しく渡しているのはどれですか？

```jsx
A. <button onClick={handleClick}>클릭</button>
B. <button onClick={handleClick()}>클릭</button>
```

<details><summary>答えを見る</summary>

通常の「クリック時に実行」という目的なら **A** です。

```jsx
<button onClick={handleClick}>클릭</button>
```

B はレンダリング中に関数を即時実行します。

</details>

### 問題 4

次のコードでは、なぜアロー関数を使っていますか？

```jsx
<button onClick={() => addToCart(product)}>
```

<details><summary>答えを見る</summary>

クリック前には実行せず、クリック時に `product` を引数として
`addToCart(product)` を実行するためです。

</details>

### 問題 5

State は常に `App` に置くべきですか？理由も説明してください。

<details><summary>答えを見る</summary>

いいえ。 State는 해당 데이터를 필요로 하는 컴포넌트들의 **적절한 공통
부모**에 두는 것이 기본 원칙입니다.

**ヒント:** 가장 높은 컴포넌트를 찾지 말고, 데이터를 공유해야 하는
컴포넌트들의 공통 부모를 찾으세요.

</details>

---

## Part 2. Props 基礎

### 問題 6

親コンポーネントが次のように Props を渡します。

```jsx
<UserCard name="철수" age={20} />
```

`UserCard` で分割代入を使って Props を受け取ってください。

<details><summary>答えを見る</summary>

```jsx
function UserCard({ name, age }) {
  // ...
}
```

</details>

### 問題 7

次のコードの問題点を説明し、修正してください。

```jsx
function ProductCard(product, onAdd) {}
```

<details><summary>答えを見る</summary>

React 関数 컴포넌트는 기본적으로 Props 객체 하나를 받습니다.

```jsx
function ProductCard({ product, onAdd }) {}
```

또는:

```jsx
function ProductCard(props) {}
```

</details>

### 問題 8

次の JSX で `title`、`price`、`onBuy` がどの種類の Props
か説明してください。

```jsx
<Product title="키보드" price={50000} onBuy={handleBuy} />
```

<details><summary>答えを見る</summary>

- `title`: 文字列データ Props
- `price`: 数値データ Props
- `onBuy`: 関数 Props

</details>

### 問題 9

子コンポーネントが `onDelete`
を実行するようにボタンを完成させてください。

```jsx
function Item({ id, onDelete }) {
  return <button>삭제</button>;
}
```

<details><summary>答えを見る</summary>

```jsx
function Item({ id, onDelete }) {
  return <button onClick={() => onDelete(id)}>삭제</button>;
}
```

</details>

### 問題 10

부모에서:

```jsx
<List onRemove={handleRemove} />
```

と渡しました。`List` が受け取った関数を同じ名前で `Item`
に渡してください。

<details><summary>答えを見る</summary>

```jsx
function List({ onRemove }) {
  return <Item onRemove={onRemove} />;
}
```

</details>

---

## Part 3. 関数 Props の流れ

### 問題 11

구조가 다음과 같습니다.

```text
App
└─ ProductList
   └─ ProductCard
      └─ Button
```

`cart` State は `App` にあります。`ProductCard` のボタンを押すと cart
を変更する必要があります。

`addToCart` handler はどのコンポーネントで作るのが自然ですか？

<details><summary>答えを見る</summary>

`App`입니다. `App`이 `cart`와 `setCart`를 가지고 있기 때문입니다.

</details>

### 問題 12

上の問題で、関数 Props
の受け渡し経路をコンポーネント名で書いてください。

<details><summary>答えを見る</summary>

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

### 問題 13

次のコードを完成させてください。

```jsx
function App() {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (product) => {
    setFavorites((prev) => [...prev, product]);
  };

  return <ProductList ________ />;
}
```

<details><summary>答えを見る</summary>

```jsx
<ProductList onAdd={addFavorite} />
```

Props 이름은 다른 이름도 가능하지만 전달과 수신에서 일관되어야 합니다.

</details>

### 問題 14

問題13の Props を `ProductList` で受け取ってください。

<details><summary>答えを見る</summary>

```jsx
function ProductList({ onAdd }) {
  // ...
}
```

</details>

### 問題 15

`ProductList` が受け取った `onAdd` を `ProductCard` に渡してください。

<details><summary>答えを見る</summary>

```jsx
<ProductCard product={product} onAdd={onAdd} />
```

</details>

### 問題 16

`ProductCard` でクリック時に商品全体を渡して `onAdd`
を実行してください。

<details><summary>答えを見る</summary>

```jsx
function ProductCard({ product, onAdd }) {
  return <button onClick={() => onAdd(product)}>찜하기</button>;
}
```

</details>

### 問題 17

次の実行フローの空欄を埋めてください。

```text
버튼 클릭
→ ProductCard에서 ______ 실행
→ App에서 만든 handler 실행
→ ______ 호출
→ State 변경
→ 재렌더링
```

<details><summary>答えを見る</summary>

```text
버튼 클릭
→ ProductCard에서 関数 Props 실행
→ App에서 만든 handler 실행
→ Setter(setState) 호출
→ State 변경
→ 재렌더링
```

</details>

### 問題 18

`Header` と `ProductCard` は兄弟関係です。`ProductCard` で cart
を変更した後、`Header` が cart の個数を表示します。`ProductCard` から
`Header` に直接値を渡す必要がありますか？

<details><summary>答えを見る</summary>

いいえ。

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

## Part 4. State の配置判断

### 問題 19

다음 구조에서 `searchText`를 `SearchInput`만 사용합니다.

```text
App
└─ SearchInput
```

必ず `App` に State を置く必要がありますか？

<details><summary>答えを見る</summary>

いいえ。 다른 컴포넌트가 필요로 하지 않는다면 `SearchInput` 내부 State로
둘 수 있습니다.

</details>

### 問題 20

다음 구조에서 `SearchInput`은 검색어를 변경하고 `ProductList`는 그
검색어로 목록을 필터링합니다.

```text
App
├─ SearchInput
└─ ProductList
```

検索語 State の自然な配置場所はどこですか？

<details><summary>答えを見る</summary>

두 컴포넌트의 공통 부모인 `App`입니다.

</details>

### 問題 21

다음 구조에서 `CartCount`와 `CartList` 모두 cart가 필요합니다.

```text
ShopPage
├─ CartCount
└─ CartList
```

cart State の配置場所を選んでください。

<details><summary>答えを見る</summary>

`ShopPage`가 자연스럽습니다.

</details>

### 問題 22

State の配置を決めるときに最も重要な質問を一文で書いてください。

<details><summary>答えを見る</summary>

例: **이 데이터를 사용하는 컴포넌트들의 적절한 공통 부모는 어디인가?**

</details>

---

## Part 5. map における変数の役割

### 問題 23

次を見て3つの変数の役割を説明してください。

```js
const numbers = [1, 2, 3];

const doubledNumbers = numbers.map((number) => {
  return number * 2;
});
```

- `numbers`
- `number`
- `doubledNumbers`

<details><summary>答えを見る</summary>

- `numbers`: 元の配列全体
- `number`: `map`이 現在処理している要素1つ
- `doubledNumbers`: `map`이 반환한 新しい配列全体

</details>

### 問題 24

次を見て役割を説明してください。

```js
const updatedProducts = products.map((product) => {
  // ...
});
```

<details><summary>答えを見る</summary>

- `products`: 元の配列全体
- `product`: 現在処理中の商品オブジェクト1つ
- `updatedProducts`: `map`이 만든 新しい配列全体

</details>

### 問題 25

次のうち、通常 `setProducts()` に渡すべきものはどれですか？

```text
products
product
updatedProducts
updateProduct
```

ただし `updateProduct` はイベント handler 関数だとします。

<details><summary>答えを見る</summary>

新しい配列全体인:

```js
setProducts(updatedProducts);
```

입니다.

</details>

### 問題 26

`map` callback で `return` した値はどうなりますか？

<details><summary>答えを見る</summary>

各 callback の `return` 結果を `map` が集めて **新しい配列**
を作ります。

</details>

---

## Part 6. Object Spread とイミュータブル更新

### 問題 27

次のオブジェクトの `active` だけを `true`
に変えた新しいオブジェクトを作ってください。

```js
const user = {
  id: 1,
  name: "A",
  active: false,
};
```

<details><summary>答えを見る</summary>

```js
const updatedUser = {
  ...user,
  active: true,
};
```

</details>

### 問題 28

次のコードのどこが間違っていますか？

```js
[...user, { active: true }];
```

`user` は通常のオブジェクトです。

<details><summary>答えを見る</summary>

配列 Spread の構文になっています。オブジェクトをコピーするには `{}`
を使います。

```js
{ ...user, active: true }
```

</details>

### 問題 29

次のコードで、なぜ `active: true` は `...user`
の後に置く必要がありますか？

```js
{
  ...user,
  active: true
}
```

<details><summary>答えを見る</summary>

同じプロパティ名が後に出ると、後の値が前の値を上書きするためです。

반대로:

```js
{
  active: true,
  ...user
}
```

라면 기존 `user.active`가 다시 덮어쓸 수 있습니다.

</details>

### 問題 30

id が2のユーザーだけを有効化してください。

```js
const users = [
  { id: 1, name: "A", active: false },
  { id: 2, name: "B", active: false },
];
```

<details><summary>答えを見る</summary>

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

### 問題 31

問題30の結果を React State に反映する1行を書いてください。

<details><summary>答えを見る</summary>

```js
setUsers(updatedUsers);
```

</details>

### 問題 32

次のコードの論理的な問題を説明してください。

```js
return { ...user, active: false };
```

このコードは `id !== 2` のすべてのユーザーに実行されます。

<details><summary>答えを見る</summary>

원래 `active: true`였던 다른 사용자까지 강제로 `false`로 바뀔 수
있습니다.

변경 대상이 아니라면:

```js
return user;
```

로 기존 객체를 유지하는 것이 적절합니다.

</details>

---

## Part 7. 今日の実践パターン再テスト

### 問題 33

次の State で id が2のユーザーだけを `active: true` にする
`activateUser` を完成させてください。

```jsx
const [users, setUsers] = useState([
  { id: 1, name: "A", active: false },
  { id: 2, name: "B", active: false },
]);

const activateUser = () => {
  // 작성
};
```

<details><summary>答えを見る</summary>

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

### 問題 34

次の商品で id が20の商品価格を
**現在の価格から10,000増やして**ください。

```jsx
const [products, setProducts] = useState([
  { id: 10, name: "키보드", price: 50000 },
  { id: 20, name: "마우스", price: 30000 },
  { id: 30, name: "모니터", price: 200000 },
]);
```

<details><summary>答えを見る</summary>

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

**ヒント:** `price: 40000`도 현재 데이터에서는 같은 결과지만, 요구사항인
"기존 가격에서 10,000 증가"를 일반적으로 구현하려면 기존 값을 이용해야
합니다.

</details>

### 問題 35

id が30の商品価格を20,000減らしてください。

<details><summary>答えを見る</summary>

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

### 問題 36

id が10の商品の名前を `"メカニカルキーボード"` に変更してください。

<details><summary>答えを見る</summary>

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

## Part 8. filter と削除

### 問題 37

次の配列から id が2のユーザーを削除してください。

```js
const users = [
  { id: 1, name: "A" },
  { id: 2, name: "B" },
  { id: 3, name: "C" },
];
```

<details><summary>答えを見る</summary>

```js
const updatedUsers = users.filter((user) => user.id !== 2);
```

</details>

### 問題 38

id を受け取り、その商品を React State から削除する関数を書いてください。

<details><summary>答えを見る</summary>

```js
const deleteProduct = (id) => {
  setProducts((prevProducts) =>
    prevProducts.filter((product) => product.id !== id),
  );
};
```

</details>

### 問題 39

なぜ削除する id と **等しくない** 要素を残すのですか？

```js
product.id !== id;
```

<details><summary>答えを見る</summary>

`filter`는 조건이 `true`인 요소를 새 배열에 남깁니다. 삭제 대상만
`false`가 되도록 해야 나머지가 유지됩니다.

</details>

### 問題 40

`map` と `filter` をそれぞれ主にいつ使うか説明してください。

<details><summary>答えを見る</summary>

- `map`: 배열의 각 요소를 변환하거나 특정 요소를 수정하면서 배열
  구조를 유지할 때
- `filter`: 조건에 맞는 요소만 남겨 배열의 항목을 제거/선별할 때

</details>

---

## Part 9. key vs Props

### 問題 41

次のコードで `key` の役割を説明してください。

```jsx
products.map((product) => <ProductCard key={product.id} product={product} />);
```

<details><summary>答えを見る</summary>

`key`는 React가 목록의 각 항목을 식별하고 변경 사항을 추적하는 데
사용하는 특별한 값입니다.

</details>

### 問題 42

`ProductCard` で次のように受け取れますか？

```jsx
function ProductCard({ key, product }) {
```

<details><summary>答えを見る</summary>

일반적으로 안 됩니다. `key`는 React가 내부적으로 사용하는 특별한
속성으로 일반 Props처럼 컴포넌트에 전달되지 않습니다.

필요하다면 별도의 Props를 전달합니다.

```jsx
<ProductCard key={product.id} productId={product.id} product={product} />
```

</details>

### 問題 43

リストに安定した一意の `id` がある場合、`key`
には何を使うのがよいですか？

<details><summary>答えを見る</summary>

```jsx
key={product.id}
```

처럼 안정적인 고유 id를 사용하는 것이 일반적으로 적절합니다.

</details>

### 問題 44

`key` と通常の Props の最大の違いを一文で説明してください。

<details><summary>答えを見る</summary>

`key`는 React가 목록 항목을 식별하기 위해 사용하는 특별한 값이고, 일반
Props는 자식 컴포넌트가 실제 데이터나 関数를 사용하도록 전달하는
값입니다.

</details>

---

## Part 10. コードの間違い探し

### 問題 45

間違いを見つけてください。

```jsx
const [favorites, setFavorites] = useState([]);

const addFavorite = (product) => {
  setFavorite((prev) => [...prev, product]);
};
```

<details><summary>答えを見る</summary>

Setter 이름 오타입니다.

```jsx
setFavorites((prev) => [...prev, product]);
```

</details>

### 問題 46

間違いを見つけてください。

```jsx
function ProductCard({ product, onAdd }) {
  return <button onClick={() => onadd(product)}>추가</button>;
}
```

<details><summary>答えを見る</summary>

JavaScript 식별자는 대소문자를 구분합니다.

```jsx
onAdd(product);
```

이어야 합니다.

</details>

### 問題 47

JSX の文法問題を修正してください。

```jsx
return (
  <Header count={cart.length} />
  <Shop onAdd={addToCart} />
);
```

<details><summary>答えを見る</summary>

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

### 問題 48

JSX を修正してください。

```jsx
<ItemCard item={item} onAdd={onAdd}>
```

자식 콘텐츠가 없습니다.

<details><summary>答えを見る</summary>

```jsx
<ItemCard item={item} onAdd={onAdd} />
```

</details>

### 問題 49

논리 間違いを見つけてください。

```js
const updatedUsers = users.map((user) => {
  if (user.id === 2) {
    return { ...user, active: true };
  }
});

setUsers(updatedUsers);
```

<details><summary>答えを見る</summary>

条件に一致しない要素の `return` がないため、その位置に `undefined`
が入る可能性があります。

```js
const updatedUsers = users.map((user) => {
  if (user.id === 2) {
    return { ...user, active: true };
  }

  return user;
});
```

</details>

### 問題 50

논리 間違いを見つけてください。

```js
const updatedUsers = users.map((user) => {
  if (user.id === 2) {
    return { ...user, active: true };
  }

  return user;
});

setUsers(users);
```

<details><summary>答えを見る</summary>

新しい配列 `updatedUsers` を作ったのに、古い `users` を Setter
に渡しています。

```js
setUsers(updatedUsers);
```

</details>

### 問題 51

エラーを説明してください。

```js
setUsers(user);
```

<details><summary>答えを見る</summary>

`users` State が配列なら、`user` オブジェクト1つではなく新しいユーザー
**配列全体** を渡す必要があります。

</details>

### 問題 52

다음 코드가 의미하는 것을 설명하세요.

```js
setUsers(activateUser);
```

`activateUser`는 일반 이벤트 handler라고 가정합니다.

<details><summary>答えを見る</summary>

関数 자체를 Setter에 전달하고 있습니다. React의 関数형 State 업데이트와
혼동될 수도 있으며, 여기서 원하는 것은 `map`으로 만든 새로운 배열을
전달하는 것입니다.

```js
setUsers(updatedUsers);
```

</details>

---

## Part 11. 要件を読む

### 問題 53

要件:

> 現在の数量から1増やす

次のうち、要件をより正確に表しているコードはどれですか？

```js
A. quantity: 6
B. quantity: product.quantity + 1
```

<details><summary>答えを見る</summary>

**B**

현재 데이터에서 수량이 5라면 둘 다 6이 되지만, B가 "현재 값에서 1
증가"라는 동작 자체를 구현합니다.

</details>

### 問題 54

要件:

> id が3のユーザーだけ `admin: true` にし、他はそのまま維持

対象外のユーザーに次のコードを実行してもよいですか？

```js
return { ...user, admin: false };
```

<details><summary>答えを見る</summary>

권장되지 않습니다. 기존에 `admin: true`인 다른 사용자가 있다면 값이
바뀝니다.

```js
return user;
```

로 그대로 유지해야 합니다.

</details>

### 問題 55

要件:

> 価格を10%割引

`price: 9000` と固定せず、既存値を使って書いてください。

<details><summary>答えを見る</summary>

例:

```js
price: product.price * 0.9;
```

</details>

### 問題 56

要件:

> クリックした商品だけ数量を1増やす

handler が `id` を受け取る形で主要コードを書いてください。

<details><summary>答えを見る</summary>

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

## Part 12. コンポーネント設計

### 問題 57

UI 要件:

- 上部にカートの商品数を表示
- 下に商品一覧を表示
- 各商品に `カートに追加` ボタン
- ボタンクリックでカート数を変更

次の構造がある場合、State の配置と関数 Props の流れを設計してください。

```text
App
├─ Header
└─ ProductList
   └─ ProductCard
```

<details><summary>答えを見る</summary>

設計例:

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

### 問題 58

次の要件に対するコンポーネント構造を自由に設計してください。

- 상품 목록
- 商品名と価格を表示
- 価格 +10,000 ボタン
- 削除ボタン

State をどこに置き、handler をどこで作るか説明してください。

<details><summary>答えを見る</summary>

한 가지 例:

```text
App 또는 ProductPage
└─ ProductList
   └─ ProductCard
```

상품 배열 State를 `ProductList`와 그 부모 외의 다른 컴포넌트도 필요로
한다면 공통 부모에 둡니다. 단순히 `ProductList` 내부에서만 필요하면
그곳에 둘 수도 있습니다.

State를 가진 컴포넌트에서 `increasePrice`, `deleteProduct` handler를
만들고 필요한 자식에게 関数 Props로 전달합니다.

</details>

### 問題 59

`Header` には cart の個数だけが必要です。どちらの Props
設計がより直接的か説明してください。

```jsx
A. <Header cart={cart} />
B. <Header count={cart.length} />
```

<details><summary>答えを見る</summary>

요구사항이 단순히 개수 표시뿐이라면 B가 더 직접적입니다.

```jsx
<Header count={cart.length} />
```

자식에게 필요한 최소한의 데이터를 명확하게 전달할 수 있습니다.

</details>

### 問題 60

`ProductCard` には商品情報と追加関数が必要です。Props
を設計してください。

<details><summary>答えを見る</summary>

例:

```jsx
<ProductCard product={product} onAdd={addToCart} />
```

受け取る側:

```jsx
function ProductCard({ product, onAdd }) {
  // ...
}
```

</details>

---

## Part 13. コーディング総合

### 問題 61

商品追加機能を完成させてください。

```jsx
const [cart, setCart] = useState([]);

const addToCart = (product) => {
  // 작성
};
```

<details><summary>答えを見る</summary>

```jsx
const addToCart = (product) => {
  setCart((prevCart) => [...prevCart, product]);
};
```

</details>

### 問題 62

新しいユーザーを配列の末尾に追加してください。

```jsx
const [users, setUsers] = useState([]);
const newUser = { id: 1, name: "A" };
```

<details><summary>答えを見る</summary>

```js
setUsers((prevUsers) => [...prevUsers, newUser]);
```

</details>

### 問題 63

id が5の項目を削除してください。

<details><summary>答えを見る</summary>

```js
setItems((prevItems) => prevItems.filter((item) => item.id !== 5));
```

</details>

### 問題 64

id が7の todo の `done` を必ず `true` に変更してください。

<details><summary>答えを見る</summary>

```js
setTodos((prevTodos) =>
  prevTodos.map((todo) => (todo.id === 7 ? { ...todo, done: true } : todo)),
);
```

</details>

### 問題 65

id が7の todo の `done` を現在値の反対にトグルしてください。

<details><summary>答えを見る</summary>

```js
setTodos((prevTodos) =>
  prevTodos.map((todo) =>
    todo.id === 7 ? { ...todo, done: !todo.done } : todo,
  ),
);
```

</details>

### 問題 66

id を引数として受け取り、その todo
の完了状態をトグルする関数を書いてください。

<details><summary>答えを見る</summary>

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

### 問題 67

`TodoItem` で次の関数を実行するボタンを書いてください。

```jsx
onToggle;
```

現在の todo の id を渡す必要があります。

<details><summary>答えを見る</summary>

```jsx
<button onClick={() => onToggle(todo.id)}>완료 변경</button>
```

</details>

### 問題 68

id が一致する商品の `stock` を既存値から1減らしてください。

<details><summary>答えを見る</summary>

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

### 問題 69

id が一致するユーザーの `name` を引数 `newName` に変更してください。

<details><summary>答えを見る</summary>

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

### 問題 70

商品の `selected`
をトグルし、削除もできるコンポーネントを設計してください。State
更新関数を2つ書いてください。

<details><summary>答えを見る</summary>

例:

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

## Part 14. 実行結果の予測

### 問題 71

結果を予測してください。

```js
const numbers = [1, 2, 3];

const result = numbers.map((number) => number + 10);
```

<details><summary>答えを見る</summary>

```js
[11, 12, 13];
```

</details>

### 問題 72

結果を予測してください。

```js
const numbers = [1, 2, 3, 4];

const result = numbers.filter((number) => number % 2 === 0);
```

<details><summary>答えを見る</summary>

```js
[2, 4];
```

</details>

### 問題 73

結果を予測してください。

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

<details><summary>答えを見る</summary>

```js
[
  { id: 1, active: true },
  { id: 2, active: true },
];
```

</details>

### 問題 74

元の `users` 配列の id 1 オブジェクトは自動的に変更されますか？

<details><summary>答えを見る</summary>

위 코드에서는 id 1에 대해 Object Spread로 **새 객체**를 반환하므로 원래
객체를 직접 수정하지 않습니다.

</details>

### 問題 75

次の `result` の長さはいくつですか？

```js
const result = products.filter((product) => product.price >= 50000);
```

条件を満たす商品が3つあるとします。

<details><summary>答えを見る</summary>

```js
result.length === 3;
```

</details>

---

## Part 15. 説明力テスト

### 問題 76

次のコードを初心者に教えるように1行ずつ説明してください。

```js
const updatedUsers = users.map((user) => {
  if (user.id === 2) {
    return { ...user, active: true };
  }

  return user;
});

setUsers(updatedUsers);
```

<details><summary>答えを見る</summary>

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

### 問題 77

`onClick={() => onAdd(product)}` を言葉で説明してください。

<details><summary>答えを見る</summary>

버튼이 클릭되었을 때 화살표 関数가 실행되고, 그 안에서 関数 Props인
`onAdd`를 현재 `product`와 함께 호출합니다.

</details>

### 問題 78

なぜ `setProducts(product)` ではなく `setProducts(updatedProducts)`
なのか説明してください。

<details><summary>答えを見る</summary>

`products` State는 상품 **배열 전체**이므로, 要素1つ인 `product`가
아니라 수정 작업이 끝난 새로운 상품 배열 전체 `updatedProducts`를
전달해야 하기 때문입니다.

</details>

### 問題 79

なぜ State
を直接変更せず、新しい配列・オブジェクトを作るのか説明してください。

<details><summary>答えを見る</summary>

React에서는 State를 불변하게 다루는 패턴을 사용하면 변경 전후의 참조가
명확해지고 업데이트를 예측하기 쉬워집니다. 배열에는 `map`, `filter`,
Spread 등을 사용해 새 값을 만드는 방식이 일반적입니다.

</details>

### 問題 80

今日学んだ配列内オブジェクト更新パターンを、コードなしで順番だけ説明してください。

<details><summary>答えを見る</summary>

```text
元の配列全体
→ 요소를 하나씩 확인
→ 변경 대상을 조건으로 찾기
→ 대상은 새 객체로 변경
→ 비대상은 그대로 반환
→ map이 新しい配列全体 생성
→ Setter에 新しい配列全体 전달
```

</details>

---

## Part 16. 長期復習用の応用問題

### 問題 81

学生配列で id が4の学生の点数を5点上げてください。

<details><summary>答えを見る</summary>

```js
setStudents((prevStudents) =>
  prevStudents.map((student) =>
    student.id === 4 ? { ...student, score: student.score + 5 } : student,
  ),
);
```

</details>

### 問題 82

注文配列で id が100の注文ステータスを `"shipped"` に変更してください。

<details><summary>答えを見る</summary>

```js
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === 100 ? { ...order, status: "shipped" } : order,
  ),
);
```

</details>

### 問題 83

コメント配列から id が8のコメントを削除してください。

<details><summary>答えを見る</summary>

```js
setComments((prevComments) =>
  prevComments.filter((comment) => comment.id !== 8),
);
```

</details>

### 問題 84

本の配列でクリックした本の `favorite` をトグルしてください。

<details><summary>答えを見る</summary>

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

### 問題 85

カート商品の id を受け取り、その商品の `quantity` を1増やしてください。

<details><summary>答えを見る</summary>

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

### 問題 86

カート商品の数量が1なら削除し、2以上なら1減らす機能を設計してください。

<details><summary>答えを見る</summary>

一つの方法:

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

### 問題 87

親の `orders` State を子の `OrderCard`
ボタンから変更する必要があります。必要な設計要素を4つ書いてください。

<details><summary>答えを見る</summary>

例:

1.  부모가 `orders` State를 가진다.
2.  부모가 주문 변경 handler를 만든다.
3.  handler를 `OrderCard`까지 関数 Props로 전달한다.
4.  `OrderCard` 버튼 이벤트에서 필요한 id와 함께 handler를 실행한다.

</details>

### 問題 88

다음 구조에서 `ProfileName`과 `ProfileEditor`가 같은 이름 State를
사용합니다.

```text
ProfilePage
├─ ProfileName
└─ ProfileEditor
```

State の配置場所と理由を説明してください。

<details><summary>答えを見る</summary>

공통 부모인 `ProfilePage`가 자연스럽습니다. 두 자식이 같은 State를
읽거나 변경해야 하기 때문입니다.

</details>

### 問題 89

次の Props の受け渡しを完成させてください。

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

<details><summary>答えを見る</summary>

例:

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

### 問題 90

次の各名前を `配列全体 / 要素1つ / 新しい配列全体 / 関数`
に分類してください。

```js
const changeStatus = () => {
  const nextOrders = orders.map((order) => {
    // ...
  });

  setOrders(nextOrders);
};
```

<details><summary>答えを見る</summary>

- `orders`: 配列全体
- `order`: 要素1つ
- `nextOrders`: 새 配列全体
- `changeStatus`: 関数

</details>

---

# 最終チェック

問題を解くとき、次の順序を自分で思い出せるか確認してください。

```text
State는 어디에 있어야 하는가?
↓
누가 State를 변경해야 하는가?
↓
handler는 어디에서 만들어야 하는가?
↓
어떤 Props를 어디로 내려보내야 하는가?
↓
현재 다루는 값은 配列全体인가, 要素1つ인가?
↓
map / filter 중 무엇이 필요한가?
↓
기존 객체를 직접 수정하지 않았는가?
↓
新しい配列全体이 만들어졌는가?
↓
Setter에 올바른 값을 전달했는가?
↓
요구사항을 정확히 구현했는가?
```

> **復習のヒント:**
> 90問を一度に繰り返すより、数日後に問題番号をランダムに選んで解いてみてください。特に33〜36、45〜56、57〜70、81〜90は長期復習に向いています。
