# Shopping Mall Project Day 5 — 총정리 문제

[📖 GENERAL 총정리 보기](2026-08-29-shopping-mall-development-day5-GENERAL_REVIEW_JA_EN_KO.md)  
[✅ 정답·해설 보기](2026-08-29-shopping-mall-development-day5-ANSWER_JA_EN_KO.md)

> **언어 순서:** 日本語 → English → 한국어  
> **규칙:** 먼저 문제만 풀고 정답 파일을 확인한다.

---

# 日本語

## 問題 1 — ナビゲーション

Next.js アプリ内部で `/cart` から `/checkout` へ移動するだけの場合、最も適切なものはどれか。

1. `<button>`
2. `<Link>`
3. `localStorage`
4. `useEffect`

## 問題 2 — Client Component

Checkout ページで `"use client"` が必要になる主な理由として最も適切なものはどれか。

1. JSX を書くため
2. CSS を使うため
3. state・effect・イベント・localStorage などブラウザ側の機能を使うため
4. TypeScript の型を書くため

## 問題 3 — localStorage

`localStorage.getItem("cart")` の戻り値として考えるべき型に最も近いものはどれか。

1. 常に `CartItem[]`
2. `string | null`
3. 常に `number`
4. `Product`

## 問題 4 — JSON

localStorage から取得した cart の JSON 文字列を JavaScript の配列に戻す処理はどれか。

1. `JSON.stringify(savedCart)`
2. `JSON.parse(savedCart)`
3. `savedCart.map()`
4. `setCart(JSON.stringify(savedCart))`

## 問題 5 — useEffect

次の `[]` の役割として最も適切な説明はどれか。

```tsx
useEffect(() => {
  // cart を読み込む
}, []);
```

1. cart を空配列にする
2. この effect が毎回のレンダー後に無条件で繰り返されるようにする
3. 初回マウント後に実行するパターンを作る
4. localStorage を削除する

## 問題 6 — TypeScript

`CartItem[]` の意味はどれか。

1. CartItem のプロパティ
2. CartItem 型の値が複数入る配列
3. CartItem を文字列にしたもの
4. CartItem または undefined

## 問題 7 — map + find

Checkout で `map()` と `find()` を一緒に使う理由として最も適切なものはどれか。

1. cart を削除するため
2. 各 cart item を処理し、その productId に対応する商品情報を探すため
3. input を制御するため
4. ページを移動するため

## 問題 8 — undefined

次のコードでガードが必要な理由は何か。

```tsx
const product = products.find((product) => product.id === item.productId);

if (!product) return null;
```

1. `find()` は必ず配列を返すから
2. `find()` は商品を見つけられず `undefined` を返す可能性があるから
3. `map()` は null を要求するから
4. React では product を使えないから

## 問題 9 — void[]

次のコードで JSX の `return` を忘れた場合に起こりやすい問題はどれか。

```tsx
cart.map((item) => {
  <li>{item.quantity}</li>;
});
```

1. `void[]` ができ、ReactNode として描画できない
2. cart が自動削除される
3. localStorage が初期化される
4. product が number になる

## 問題 10 — reduce

`reduce()` の Day 5 での主な役割はどれか。

1. 商品1件を探す
2. 複数の商品金額を累積して totalPrice 1つを作る
3. input の値を変更する
4. checkout へ移動する

## 問題 11 — Controlled Component

空欄を完成させなさい。

```tsx
<input value={name} onChange={(e) => __________} />
```

## 問題 12 — イベント

`e.target.value` は何を表すか。

1. 現在 input に入力されている値
2. React component の名前
3. localStorage の key
4. form の URL

## 問題 13 — form

配送情報 input と注文ボタンを1つの `<form>` にまとめる主な理由は何か。

1. 文字色を統一するため
2. 関連する入力と送信を1つの意味ある提出単位にするため
3. `map()` を使うため
4. localStorage を自動保存するため

## 問題 14 — preventDefault

`e.preventDefault()` の役割はどれか。

1. state 更新を禁止する
2. input 入力を禁止する
3. ブラウザの通常の form submit 動作を防ぎ、React 側で処理できるようにする
4. TypeScript エラーを削除する

## 問題 15 — 構造判断

次のうち `cart.map()` の**外**に置くのが最も自然なものはどれか。

1. 各商品の名前
2. 各商品の数量
3. 各商品の小計
4. 注文全体の totalPrice

## 問題 16 — 流れ復元

次を正しい順番に並べなさい。

```text
A. setCart(parsedCart)
B. localStorage.getItem("cart")
C. JSON.parse(savedCart)
D. cart state に反映
```

## 問題 17 — コード復元

Day 5 の基本的な cart state 宣言を書きなさい。

条件：

- state 名は `cart`
- setter は `setCart`
- 型は `CartItem[]`
- 初期値は空配列

## 問題 18 — 総合説明

次のキーワードをすべて使って、Checkout の商品表示までのデータフローを短く説明しなさい。

```text
localStorage / JSON.parse / setCart / map / find
```

---

# English

## Question 1

For simple internal navigation from `/cart` to `/checkout` in Next.js, which is most appropriate?

1. `<button>`
2. `<Link>`
3. `localStorage`
4. `useEffect`

## Question 2

Why does the Checkout page need a Client Component boundary?

1. To write JSX
2. To use CSS
3. To use state, effects, events, and browser APIs such as localStorage
4. To define TypeScript types

## Question 3

What can `localStorage.getItem("cart")` return?

1. Always `CartItem[]`
2. `string | null`
3. Always `number`
4. `Product`

## Question 4

Which converts a stored JSON string back into JavaScript data?

1. `JSON.stringify()`
2. `JSON.parse()`
3. `map()`
4. `reduce()`

## Question 5

What is the main purpose of `[]` in the Day 5 loading effect?

1. Clear cart
2. Intentionally run the effect after every render
3. Use the effect as an initial mount loading pattern
4. Delete localStorage

## Question 6

What does `CartItem[]` mean?

1. A CartItem property
2. An array of CartItem values
3. A CartItem string
4. CartItem or undefined

## Question 7

Why combine `map()` and `find()`?

1. Delete the cart
2. Process each cart item and locate its matching product
3. Control an input
4. Navigate pages

## Question 8

Why guard the result of `find()`?

1. It always returns an array
2. It may return `undefined`
3. map requires null
4. Product cannot be rendered in React

## Question 9

What happens if a block-bodied `map()` callback forgets to return JSX?

1. It may produce `void[]`, which is not valid ReactNode content
2. Cart is deleted
3. localStorage resets
4. Product becomes a number

## Question 10

What was the main role of `reduce()`?

1. Find one product
2. Accumulate many item amounts into one `totalPrice`
3. Change input state
4. Navigate to checkout

## Question 11

Complete:

```tsx
<input value={name} onChange={(e) => __________} />
```

## Question 12

What does `e.target.value` represent?

1. The current value of the input that triggered the event
2. Component name
3. localStorage key
4. Form URL

## Question 13

Why group shipping inputs and the submit button inside a form?

1. Styling
2. To make related inputs and submission one semantic submission unit
3. To use map
4. To automatically save localStorage

## Question 14

What does `e.preventDefault()` do in the submit handler?

1. Prevents state changes
2. Prevents typing
3. Prevents the browser's default form submission behavior
4. Removes TypeScript errors

## Question 15

Which belongs outside `cart.map()`?

1. Each product name
2. Each quantity
3. Each item subtotal
4. The whole-order `totalPrice`

## Question 16

Put these in the correct order:

```text
A. setCart(parsedCart)
B. localStorage.getItem("cart")
C. JSON.parse(savedCart)
D. cart state reflects the data
```

## Question 17

Write the Day 5 cart state declaration using `CartItem[]` and an empty initial array.

## Question 18

Using all of these terms, explain the Checkout item-data flow:

```text
localStorage / JSON.parse / setCart / map / find
```

---

# 한국어

## 문제 1 — 이동

Next.js 내부에서 `/cart`에서 `/checkout`으로 단순 이동할 때 가장 적절한 것은?

1. `<button>`
2. `<Link>`
3. `localStorage`
4. `useEffect`

## 문제 2 — Client Component

Checkout에서 `"use client"`가 필요한 핵심 이유는?

1. JSX를 쓰기 위해
2. CSS를 쓰기 위해
3. state, effect, 이벤트, localStorage 같은 브라우저 기능을 사용하기 위해
4. TypeScript 타입을 만들기 위해

## 문제 3 — localStorage

`localStorage.getItem("cart")`의 반환 가능성을 가장 잘 표현한 것은?

1. 항상 `CartItem[]`
2. `string | null`
3. 항상 `number`
4. `Product`

## 문제 4 — JSON

저장된 JSON 문자열을 다시 JavaScript 데이터로 바꾸는 것은?

1. `JSON.stringify()`
2. `JSON.parse()`
3. `map()`
4. `reduce()`

## 문제 5 — useEffect 의존성 배열

```tsx
useEffect(() => {
  // cart 불러오기
}, []);
```

여기서 `[]`의 Day 5 기준 핵심 역할은?

1. cart를 빈 배열로 만든다
2. 매 렌더링마다 effect를 반복한다
3. 마운트 이후 초기 로딩용 effect 패턴을 만든다
4. localStorage를 삭제한다

## 문제 6 — 타입

`CartItem[]`의 의미는?

1. CartItem의 속성
2. CartItem 타입 값 여러 개가 들어가는 배열
3. CartItem을 문자열로 만든 것
4. CartItem 또는 undefined

## 문제 7 — map + find

Checkout에서 `map()`과 `find()`를 함께 사용한 이유는?

1. cart를 삭제하기 위해
2. cart 항목을 하나씩 처리하면서 productId에 맞는 상품 정보를 찾기 위해
3. input을 제어하기 위해
4. 페이지 이동을 위해

## 문제 8 — undefined

`find()` 결과에 다음 가드가 필요한 이유는?

```tsx
if (!product) return null;
```

1. find는 항상 배열을 반환해서
2. 조건에 맞는 상품이 없으면 `undefined`가 될 수 있어서
3. map은 반드시 null이 필요해서
4. React에서는 product를 사용할 수 없어서

## 문제 9 — void[]

`map((item) => { ... })`에서 JSX의 `return`을 빼먹으면 발생할 수 있는 핵심 문제는?

1. `void[]`가 만들어져 ReactNode로 렌더링할 수 없다
2. cart가 자동 삭제된다
3. localStorage가 초기화된다
4. product가 number가 된다

## 문제 10 — reduce

Day 5에서 `reduce()`의 역할은?

1. 상품 한 개 찾기
2. 여러 상품 금액을 누적해 `totalPrice` 하나 만들기
3. input 값 변경하기
4. checkout 이동하기

## 문제 11 — Controlled Component

빈칸을 완성하시오.

```tsx
<input value={name} onChange={(e) => __________} />
```

## 문제 12 — 이벤트 객체

`e.target.value`는 무엇인가?

1. 이벤트가 발생한 input의 현재 입력값
2. React 컴포넌트 이름
3. localStorage key
4. form URL

## 문제 13 — form

배송정보 input과 주문하기 버튼을 하나의 `<form>`으로 묶는 가장 중요한 이유는?

1. 글자색을 맞추기 위해
2. 관련 입력과 제출을 하나의 의미 있는 제출 단위로 만들기 위해
3. map을 사용하기 위해
4. localStorage가 자동 저장되게 하기 위해

## 문제 14 — preventDefault

`e.preventDefault()`의 역할은?

1. state 변경 방지
2. input 입력 방지
3. 브라우저 기본 form 제출 동작을 막고 React에서 제출을 처리하도록 하기
4. TypeScript 오류 제거

## 문제 15 — map 안/밖

다음 중 `cart.map()` 바깥에 두는 것이 가장 자연스러운 것은?

1. 각 상품명
2. 각 상품 수량
3. 각 상품 소계
4. 주문 전체 `totalPrice`

## 문제 16 — 순서 복원

올바른 순서로 배열하시오.

```text
A. setCart(parsedCart)
B. localStorage.getItem("cart")
C. JSON.parse(savedCart)
D. cart state에 데이터 반영
```

## 문제 17 — 코드 복원

다음 조건을 만족하는 state 선언을 직접 작성하시오.

```text
state: cart
setter: setCart
type: CartItem[]
initial value: []
```

## 문제 18 — 종합 서술

아래 단어를 모두 사용하여 Checkout에서 상품이 표시되기까지의 흐름을 설명하시오.

```text
localStorage / JSON.parse / setCart / map / find
```

---

## 복습 체크

- [ ] 정답을 보지 않고 먼저 풀었다.
- [ ] 맞혔지만 확신이 없던 문제에 △ 표시를 했다.
- [ ] 틀린 문제는 ANSWER의 오답 비교까지 읽는다.
- [ ] 마지막 서술 문제를 코드 없이 설명할 수 있다.

> **팁**
>
> 객관식 점수보다 문제 16~18을 스스로 복원할 수 있는지가 Day 5 이해도를 더 잘 보여준다.
