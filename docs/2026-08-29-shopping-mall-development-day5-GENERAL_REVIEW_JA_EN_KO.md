# Shopping Mall Project Day 5 — GENERAL 총정리

[📝 Day 5 문제 풀기](2026-08-29-shopping-mall-development-day5-QUIZ_JA_EN_KO.md)  
[✅ Day 5 정답·해설 보기](2026-08-29-shopping-mall-development-day5-ANSWER_JA_EN_KO.md)

> **언어 순서:** 日本語 → English → 한국어  
> **학습 주제:** Next.js Checkout / React Controlled Component / localStorage / useEffect / map·find·reduce / form submit

---

# 日本語

## 0. コンテンツ情報

- **種類:** React / Next.js 実践復習
- **範囲:** Shopping Mall Project Day 5
- **中心テーマ:** Cart → Checkout → 配送情報 → Submit → Order Complete
- **学習焦点:** データフロー、React state、ブラウザ保存、配列メソッド、フォーム
- **前提:** Day 4 で cart と localStorage の基本機能を実装済み

> **ヒント**
>
> Day 5 はコードを暗記する日ではなく、「データがどこから来て、どこへ移動し、何が画面を制御しているか」を追跡する日として復習する。

## 1. Day 5 の一行要約

**localStorage に保存された cart を Checkout で読み込み、商品情報と結合し、配送情報を React state で管理して注文送信の流れを完成させる。**

## 2. 全体フロー

```text
/cart
↓ Link
/checkout
↓
localStorage.getItem("cart")
↓
JSON.parse()
↓
cart state
↓
cart.map()
↓
products.find()
↓
商品名・価格・数量・小計
↓
cart.reduce()
↓
totalPrice
↓
name / phone / address
↓
Controlled Components
↓
<form onSubmit>
↓
handleSubmit
↓
e.preventDefault()
↓
注文完了処理
↓
/order-complete
```

> **ヒント**
>
> 各コードを「移動」「読み込み」「計算」「入力」「送信」の5種類に分類すると整理しやすい。

## 3. Link・a・button

### Link

Next.js アプリ内部のページ移動。

```tsx
<Link href="/checkout">注文する</Link>
```

### a

外部URL、メール、電話、ダウンロードなど一般的なリンク。

### button

数量変更、削除、フォーム送信など「処理・アクション」を実行する。

```text
目的地へ移動 → Link / a
処理を実行 → button
```

処理成功後の結果としてページ移動する場合は `button` + `router.push()` も自然。

> **ヒント**
>
> 見た目ではなく意味で決める。ボタンのように見える Link でも、目的がページ移動なら意味上は Link。

## 4. "use client"

Next.js App Router では Server Component が基本。Checkout では次のブラウザ側機能が必要になる。

```text
useState
useEffect
onChange
onSubmit
localStorage
```

そのため Client Component 境界としてファイル先頭に：

```tsx
"use client";
```

を置く。

> **ヒント**
>
> `"use client"` は「React を使う許可」ではなく、ブラウザ側のインタラクティブ機能を使うコンポーネント境界を宣言するもの。

## 5. localStorage と useEffect

cart は localStorage に JSON 文字列として保存されている。

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    const parsedCart = JSON.parse(savedCart);
    setCart(parsedCart);
  }
}, []);
```

データ変換：

```text
JavaScript array
↓ JSON.stringify()
string
↓ localStorage
string
↓ JSON.parse()
JavaScript array
```

`[]` はこの effect を初回マウント後に実行する意図を表す。

> **ヒント**
>
> `getItem()` は `null` を返す可能性があるため、`if (savedCart)` のように存在確認を行う。

## 6. CartItem と CartItem[]

```ts
type CartItem = {
  productId: number;
  quantity: number;
};
```

- `CartItem` = カート商品1件
- `CartItem[]` = CartItem が複数入る配列

```tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

`CartItem[]` と `Array<CartItem>` は同じ意味。

> **ヒント**
>
> `T` は1件、`T[]` は複数件、と読む習慣をつける。

## 7. map() + find()

cart は数量を持つが、商品名や販売価格は products 側にある。

```text
cart item
├─ productId
└─ quantity

product
├─ id
├─ name
└─ salePrice
```

そのため `map()` で cart を1件ずつ処理し、`find()` で対応する商品を探す。

```tsx
cart.map((item) => {
  const product = products.find((product) => product.id === item.productId);

  if (!product) return null;

  return (
    <li key={item.productId}>
      <h2>{product.name}</h2>
      <p>価格: {product.salePrice}</p>
      <p>数量: {item.quantity}</p>
      <p>小計: {product.salePrice * item.quantity}</p>
    </li>
  );
});
```

> **ヒント**
>
> `map()` = 複数を順番に処理。`find()` = 条件に合う1件を探す。

## 8. find() の undefined と map() の void[]

`find()` は見つからない可能性がある。

```ts
Product | undefined;
```

そのため：

```tsx
if (!product) return null;
```

のようなガードを置く。

一方、`map((item) => { ... })` の `{}` 内で JSX を `return` し忘れると、コールバックは `void` を返し、結果は `void[]` になる。React の children は `ReactNode` を期待するためエラーになる。

```text
find のガード不足
→ product is possibly undefined

map の return 不足
→ void[]
→ ReactNode にできない
```

> **ヒント**
>
> `return null` は React で「何も描画しない」という有効な値。`return;` は `undefined/void` になり、意味が異なる。

## 9. reduce() と totalPrice

注文全体の合計は `reduce()` で1つの値にまとめる。

```tsx
const totalPrice = cart.reduce((total, item) => {
  const product = products.find((product) => product.id === item.productId);

  if (!product) {
    return total;
  }

  return total + product.salePrice * item.quantity;
}, 0);
```

```text
map    → 各商品を表示
find   → 商品情報を1件探す
reduce → 全商品から合計値1つを作る
```

> **ヒント**
>
> `totalPrice` は注文全体に1つだけなので `map()` の外で表示する。

## 10. Controlled Component

```tsx
const [name, setName] = useState("");

<input value={name} onChange={(e) => setName(e.target.value)} />;
```

データフロー：

```text
ユーザー入力
↓
onChange
↓
e.target.value
↓
setName()
↓
name state 更新
↓
再レンダリング
↓
value={name}
↓
input 表示
```

- `value={name}` = state → input
- `e.target.value` = input → state

> **ヒント**
>
> Controlled Component の核心は「画面の input 値を React state が制御する」こと。

## 11. e・target・value

```tsx
onChange={(e) => setName(e.target.value)}
```

- `e`: イベントオブジェクト
- `e.target`: イベントが発生した input
- `e.target.value`: 現在 input に入力されている値

> **ヒント**
>
> `e` は特別な予約語ではなくパラメータ名。`event` と書いてもよい。

## 12. form・onSubmit・preventDefault

配送情報と注文ボタンは1つの form にまとめる。

```tsx
<form onSubmit={handleSubmit}>
  <input value={name} onChange={(e) => setName(e.target.value)} />
  <input value={phone} onChange={(e) => setPhone(e.target.value)} />
  <input value={address} onChange={(e) => setAddress(e.target.value)} />
  <button type="submit">注文する</button>
</form>
```

```tsx
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  console.log({
    name,
    phone,
    address,
    cart,
    totalPrice,
  });
};
```

`preventDefault()` は通常の form submit によるページ再読み込みを防ぐ。

> **ヒント**
>
> 入力送信は `button onClick` だけで考えず、`form + onSubmit + button type="submit"` を基本形として覚える。

## 13. Day 5 最終チェック

- [ ] `/cart` から `/checkout` へ移動できる
- [ ] localStorage から cart を読み込める
- [ ] `CartItem[]` の意味を説明できる
- [ ] `map()` で商品を繰り返せる
- [ ] `find()` で product を結合できる
- [ ] `undefined` ガードを説明できる
- [ ] 商品小計を計算できる
- [ ] `reduce()` で総額を計算できる
- [ ] name / phone / address を state で管理できる
- [ ] Controlled Component の流れを説明できる
- [ ] form submit と `preventDefault()` を説明できる
- [ ] 注文完了ページへ移動できる

> **ヒント**
>
> コードを見ずに上の流れを口頭で説明できれば、Day 5 の理解はかなり定着している。

---

# English

## 1. Day 5 Summary

Day 5 connects cart data to checkout, enriches cart items with product data, calculates totals, manages shipping inputs with React state, and handles form submission.

```text
/cart → /checkout
→ localStorage → cart state
→ map + find → item UI
→ reduce → totalPrice
→ controlled shipping inputs
→ form submit
→ order-complete
```

> **Tip**
>
> Track data rather than memorizing code: where it starts, how it changes, and what renders it.

## 2. Link, a, and button

- `Link`: internal Next.js navigation.
- `a`: external/general hyperlinks.
- `button`: actions such as quantity changes, deletion, or submission.
- `router.push()`: useful when navigation happens after business logic.

> **Tip**
>
> Choose by semantics, not appearance: destination = link; action = button.

## 3. Client Component

Checkout needs browser-side interaction:

```text
useState / useEffect / events / localStorage
```

Therefore it uses:

```tsx
"use client";
```

> **Tip**
>
> `"use client"` marks a Client Component boundary; it is not a general permission switch for React.

## 4. localStorage + useEffect

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    setCart(JSON.parse(savedCart));
  }
}, []);
```

`localStorage` stores strings, so objects/arrays are converted with JSON.

> **Tip**
>
> `getItem()` may return `null`. Check that data exists before parsing it.

## 5. CartItem[]

```tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

`CartItem` means one item. `CartItem[]` means an array of those items.

> **Tip**
>
> Read `T[]` as “many values of type T.”

## 6. map + find

`map()` processes every cart item. `find()` locates the corresponding product using the ID.

```tsx
const product = products.find((product) => product.id === item.productId);
```

Because `find()` may fail, its result can be `undefined`.

```tsx
if (!product) return null;
```

> **Tip**
>
> `map` handles many; `find` searches for one.

## 7. map return and ReactNode

If a block-bodied `map()` callback forgets `return`, it produces `void[]`. JSX children must be renderable React values, so `void[]` causes a ReactNode type error.

> **Tip**
>
> Distinguish two errors: missing `find` guard → possibly undefined; missing `map` return → void[].

## 8. reduce

`reduce()` combines many cart items into one total.

```tsx
const totalPrice = cart.reduce((total, item) => {
  // find product
  // add salePrice * quantity
  return total;
}, 0);
```

> **Tip**
>
> `map` produces per-item output; `reduce` produces one accumulated result.

## 9. Controlled Components

```tsx
const [name, setName] = useState("");

<input value={name} onChange={(e) => setName(e.target.value)} />;
```

```text
input → onChange → e.target.value
→ setName → state → render → value
```

> **Tip**
>
> `value={name}` sends state to the input; `e.target.value` reads the input back into state.

## 10. Form Submission

```tsx
<form onSubmit={handleSubmit}>
  ...
  <button type="submit">Order</button>
</form>
```

```tsx
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
```

> **Tip**
>
> `preventDefault()` prevents the browser's normal form navigation/reload so React can handle the submission.

## 11. Day 5 Completion

You should be able to explain and implement:

```text
Link
"use client"
localStorage
useEffect + []
CartItem[]
map
find
undefined guard
reduce
Controlled Component
e.target.value
form
onSubmit
preventDefault
order-complete navigation
```

> **Tip**
>
> If you can reconstruct the complete data flow without looking at the code, Day 5 is ready for review questions.

---

# 한국어

## 1. Day 5 한 줄 총정리

Day 5는 **장바구니 데이터를 Checkout으로 가져와 상품 데이터와 연결하고, 배송 정보를 React state로 관리한 뒤 주문 제출 흐름까지 완성하는 날**이다.

```text
/cart
↓
/checkout
↓
localStorage
↓
cart state
↓
map + find
↓
상품 정보 / 수량 / 소계
↓
reduce
↓
totalPrice
↓
배송 정보 Controlled Component
↓
form submit
↓
주문 완료
```

> **팁**
>
> Day 5 코드를 외우기보다 이 데이터 흐름을 머릿속에서 재생할 수 있는지를 확인하자.

## 2. `Link` / `<a>` / `<button>`

- `Link`: Next.js 내부 페이지 이동
- `<a>`: 외부 사이트, mailto, tel, download 등의 일반 링크
- `<button>`: 수량 변경, 삭제, 제출 같은 행동
- `router.push()`: 어떤 로직이 성공한 뒤 코드로 페이지를 이동할 때 유용

판단법:

```text
목적이 이동인가?
YES → 링크 계열
NO  → button

내부 Next.js 경로인가?
YES → Link
```

> **팁**
>
> 생김새가 아니라 의미를 기준으로 선택한다. CSS로 Link를 버튼처럼 꾸며도 역할은 이동이다.

## 3. `"use client"`

Next.js App Router는 Server Component가 기본이지만 Checkout에서는:

```text
useState
useEffect
onChange
onSubmit
localStorage
```

같은 브라우저 상호작용이 필요하다.

그래서:

```tsx
"use client";
```

를 사용한다.

> **팁**
>
> `"use client"`는 React 사용 허가가 아니라 **Client Component 경계 선언**이라고 이해하자.

## 4. localStorage + useEffect + `[]`

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    const parsedCart = JSON.parse(savedCart);
    setCart(parsedCart);
  }
}, []);
```

localStorage에는 문자열만 저장되므로:

```text
배열
→ JSON.stringify()
→ 문자열
→ localStorage

localStorage
→ 문자열
→ JSON.parse()
→ 배열
```

과정을 거친다.

빈 의존성 배열 `[]`은 이 effect가 마운트 이후 초기 실행되는 패턴을 만든다.

> **팁**
>
> `getItem()`은 데이터가 없으면 `null`을 반환할 수 있으므로 존재 여부를 확인한 뒤 `JSON.parse()`한다.

## 5. `CartItem[]`

```ts
type CartItem = {
  productId: number;
  quantity: number;
};
```

```tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

- `CartItem` = 장바구니 항목 하나
- `CartItem[]` = 장바구니 항목 여러 개
- `CartItem[]` = `Array<CartItem>`

> **팁**
>
> `T`는 하나, `T[]`는 여러 개라는 규칙을 익혀두면 `Product[]`, `Order[]`도 같은 방식으로 읽을 수 있다.

## 6. `map()`과 `find()`

cart에는 보통:

```text
productId
quantity
```

가 있고 products에는:

```text
id
name
salePrice
```

등이 있다.

따라서:

```tsx
cart.map((item) => {
  const product = products.find((product) => product.id === item.productId);
});
```

처럼 ID를 기준으로 연결한다.

> **팁**
>
> `map()` = 여러 항목을 하나씩 처리, `find()` = 조건에 맞는 한 항목 찾기.

## 7. `find()`의 `undefined`

`find()`는 상품을 못 찾을 수도 있기 때문에 결과 타입에는 `undefined` 가능성이 포함된다.

```tsx
if (!product) return null;
```

이 가드는 그 아래 코드에서 product가 실제로 존재한다고 TypeScript가 판단할 수 있게 해준다.

> **팁**
>
> `product is possibly undefined`가 나오면 “왜 TypeScript가 못 믿지?”보다 “실제로 못 찾는 경우가 가능한가?”부터 생각하자.

## 8. `map()`의 return과 `void[]`

```tsx
cart.map((item) => {
  // JSX를 만들었지만 return을 안 함
});
```

처럼 `{}`를 사용하는 callback에서 `return`을 빠뜨리면 각 callback 결과가 `void`가 되어 `void[]`가 만들어질 수 있다.

React JSX children은 `ReactNode`가 필요하므로 오류가 발생한다.

```text
find guard 없음
→ possibly undefined

map return 없음
→ void[]
→ ReactNode 오류
```

> **팁**
>
> `return null`은 React에서 정상적인 “렌더링하지 않음” 결과다. `return;`과 구별하자.

## 9. 상품 소계와 `reduce()`

상품 한 종류의 소계:

```tsx
product.salePrice * item.quantity;
```

전체 주문금액:

```tsx
const totalPrice = cart.reduce((total, item) => {
  const product = products.find((product) => product.id === item.productId);

  if (!product) {
    return total;
  }

  return total + product.salePrice * item.quantity;
}, 0);
```

역할:

```text
map    → 상품별 화면
find   → 상품 한 개 검색
reduce → 전체를 하나의 값으로 누적
```

> **팁**
>
> 상품별 정보는 `map()` 안, 전체 주문금액은 주문 전체에 하나이므로 `map()` 밖에 두는 구조를 기억하자.

## 10. Controlled Component

```tsx
const [name, setName] = useState("");

<input value={name} onChange={(e) => setName(e.target.value)} />;
```

전체 흐름:

```text
사용자 입력
↓
onChange
↓
e.target.value
↓
setName()
↓
name state 변경
↓
재렌더링
↓
value={name}
↓
input 화면 반영
```

두 `value` 관련 흐름을 구분한다.

```text
value={name}
state → input

e.target.value
input → state
```

> **팁**
>
> Controlled Component의 핵심은 input이 자기 값을 독립적으로 관리하는 것이 아니라 React state가 화면 값을 제어하도록 연결하는 것이다.

## 11. `e`, `target`, `value`

```tsx
onChange={(e) => setName(e.target.value)}
```

- `e`: 이벤트 객체
- `e.target`: 이벤트가 발생한 input
- `e.target.value`: 현재 입력값

> **팁**
>
> `e`는 이름일 뿐이다. `(event) => setName(event.target.value)`처럼 작성해도 원리는 같다.

## 12. `<form>`과 `onSubmit`

배송 정보 input과 주문하기 버튼은 하나의 form으로 묶는 것이 자연스럽다.

```tsx
<form onSubmit={handleSubmit}>
  {/* name */}
  {/* phone */}
  {/* address */}

  <button type="submit">주문하기</button>
</form>
```

```tsx
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  console.log({
    name,
    phone,
    address,
    cart,
    totalPrice,
  });
};
```

`e.preventDefault()`는 브라우저의 기본 form 제출 동작으로 인한 페이지 이동/새로고침을 막는다.

> **팁**
>
> 폼 제출에서는 `button onClick`만 떠올리지 말고 `form + onSubmit + type="submit"`을 기본 구조로 생각하자.

## 13. Day 5 최종 복습 체크리스트

- [ ] `/cart → /checkout` 흐름을 설명할 수 있다.
- [ ] Link와 button의 역할 차이를 설명할 수 있다.
- [ ] `"use client"`가 필요한 이유를 설명할 수 있다.
- [ ] localStorage가 문자열을 저장한다는 것을 이해한다.
- [ ] `JSON.stringify()`와 `JSON.parse()`의 방향을 구별한다.
- [ ] `useEffect(..., [])`의 목적을 설명할 수 있다.
- [ ] `CartItem[]`를 읽을 수 있다.
- [ ] `map()`과 `find()`의 협업을 설명할 수 있다.
- [ ] `find()`가 `undefined`를 반환할 수 있음을 안다.
- [ ] `return null` 가드의 이유를 설명할 수 있다.
- [ ] `map()`에서 return을 빼면 왜 `void[]` 문제가 생기는지 이해한다.
- [ ] 상품 소계와 전체 `totalPrice`를 구별한다.
- [ ] `reduce()`의 누적 역할을 설명할 수 있다.
- [ ] Controlled Component의 데이터 흐름을 설명할 수 있다.
- [ ] `e.target.value`가 무엇인지 설명할 수 있다.
- [ ] form / onSubmit / submit button의 관계를 이해한다.
- [ ] `preventDefault()`가 필요한 이유를 설명할 수 있다.
- [ ] 주문 완료 페이지까지 전체 흐름을 테스트할 수 있다.

> **팁**
>
> 체크만 하지 말고 각 항목을 한 문장으로 직접 설명해보자. 설명이 막히는 항목이 실제 복습 대상이다.
