# Shopping Mall Project Day 5 — 정답·해설

[📝 문제 파일로 돌아가기](2026-08-29-shopping-mall-development-day5-QUIZ_JA_EN_KO.md)  
[📖 GENERAL 총정리 보기](2026-08-29-shopping-mall-development-day5-GENERAL_REVIEW_JA_EN_KO.md)

> **언어 순서:** 日本語 → English → 한국어

---

# 日本語

## 正答表

| 問題 | 正答                                                |
| ---- | --------------------------------------------------- |
| 1    | 2. `<Link>`                                         |
| 2    | 3                                                   |
| 3    | 2. `string \| null`                                 |
| 4    | 2. `JSON.parse()`                                   |
| 5    | 3                                                   |
| 6    | 2                                                   |
| 7    | 2                                                   |
| 8    | 2                                                   |
| 9    | 1                                                   |
| 10   | 2                                                   |
| 11   | `setName(e.target.value)`                           |
| 12   | 1                                                   |
| 13   | 2                                                   |
| 14   | 3                                                   |
| 15   | 4                                                   |
| 16   | B → C → A → D                                       |
| 17   | `const [cart, setCart] = useState<CartItem[]>([]);` |
| 18   | 下記解説参照                                        |

## 問題 1

**正答: 2. `<Link>`**

単純な Next.js 内部ルート移動は `Link` の役割。`button` は基本的に処理を実行する要素。

> **ヒント**
>
> 「目的地へ移動するのか、何かを実行するのか」で判断する。

## 問題 2

**正答: 3**

Checkout は state、effect、イベント、localStorage などクライアント側機能を使うため Client Component 境界が必要。

> **ヒント**
>
> JSX や TypeScript 自体が `"use client"` の理由ではない。

## 問題 3

**正答: 2. `string | null`**

localStorage は文字列を保存し、キーが存在しなければ `null` を返す。

> **ヒント**
>
> だから `if (savedCart)` の確認後に parse する。

## 問題 4

**正答: 2. `JSON.parse()`**

`JSON.stringify()` は JavaScript データ → JSON文字列。`JSON.parse()` は JSON文字列 → JavaScript データ。

> **ヒント**
>
> stringify = 保存方向、parse = 復元方向。

## 問題 5

**正答: 3**

空の依存配列は Day 5 の cart 初期読み込みで、マウント後の初回 effect 実行パターンとして利用した。

> **ヒント**
>
> `[]` は cart の値そのものではなく effect の依存関係を表す。

## 問題 6

**正答: 2**

`CartItem[]` は `CartItem` 型の値を複数持つ配列。

> **ヒント**
>
> `T[] = Array<T>`。

## 問題 7

**正答: 2**

`map()` で各 cart item を処理し、`find()` で `item.productId` と一致する `product.id` を探す。

> **ヒント**
>
> cart の quantity と products の name/salePrice を結合するイメージ。

## 問題 8

**正答: 2**

`find()` は条件に合う要素がなければ `undefined` を返す。そのまま `product.name` などを使うのは安全ではない。

```tsx
if (!product) return null;
```

> **ヒント**
>
> このガード以降、TypeScript は product が存在すると絞り込める。

## 問題 9

**正答: 1**

ブロック `{}` を使う arrow callback は明示的な `return` が必要。返さなければ各結果が `void` になり、`map()` の結果が `void[]` になり得る。

> **ヒント**
>
> `return null` は「描画しない」という有効な React の戻り値だが、return 自体を忘れるのとは違う。

## 問題 10

**正答: 2**

`reduce()` は複数 item の `salePrice * quantity` を累積し、注文全体の `totalPrice` 1つを作る。

> **ヒント**
>
> map = 各要素、find = 1件検索、reduce = 1つに集約。

## 問題 11

**正答**

```tsx
setName(e.target.value);
```

完成：

```tsx
<input value={name} onChange={(e) => setName(e.target.value)} />
```

> **ヒント**
>
> `e.target.value` が input → state、`value={name}` が state → input。

## 問題 12

**正答: 1**

`e.target.value` はイベントが発生した input の現在値。

> **ヒント**
>
> `e` はイベントオブジェクト、`target` はイベント対象、`value` はその入力値。

## 問題 13

**正答: 2**

配送情報と注文送信は同じ提出処理に属するため、1つの form にまとめるのが意味的にも機能的にも自然。

> **ヒント**
>
> form は単なるレイアウト用の箱ではなく「提出単位」。

## 問題 14

**正答: 3**

`preventDefault()` はブラウザ標準の form submit 動作を止め、React の handler 内で処理を続けられるようにする。

> **ヒント**
>
> state 更新を止める関数ではない。

## 問題 15

**正答: 4**

商品名・数量・小計は商品ごとに異なるので map 内。`totalPrice` は注文全体で1つなので map 外。

> **ヒント**
>
> 「商品ごとに変わるか？」を判定質問にする。

## 問題 16

**正答: B → C → A → D**

```text
localStorage.getItem("cart")
↓
JSON.parse(savedCart)
↓
setCart(parsedCart)
↓
cart state に反映
```

## 問題 17

**正答**

```tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

## 問題 18

**模範解答**

localStorage から cart の JSON 文字列を読み、`JSON.parse()` で配列に戻して `setCart()` で state に保存する。その後 `map()` で各 CartItem を処理し、`find()` で productId に対応する商品情報を探して画面に表示する。

> **ヒント**
>
> `保存場所 → 復元 → state → 반복 → 商品結合` の順で説明できればよい。

---

# English

## Answer Key

| Question | Answer                                              |
| -------- | --------------------------------------------------- |
| 1        | 2. `<Link>`                                         |
| 2        | 3                                                   |
| 3        | 2. `string \| null`                                 |
| 4        | 2. `JSON.parse()`                                   |
| 5        | 3                                                   |
| 6        | 2                                                   |
| 7        | 2                                                   |
| 8        | 2                                                   |
| 9        | 1                                                   |
| 10       | 2                                                   |
| 11       | `setName(e.target.value)`                           |
| 12       | 1                                                   |
| 13       | 2                                                   |
| 14       | 3                                                   |
| 15       | 4                                                   |
| 16       | B → C → A → D                                       |
| 17       | `const [cart, setCart] = useState<CartItem[]>([]);` |

### Core Explanations

**1. Link:** use `Link` for simple internal Next.js navigation. A button represents an action.

**2. Client Component:** Checkout needs state, effects, event handlers, and browser APIs.

**3. localStorage:** `getItem()` returns a string when the key exists and `null` otherwise.

**4. JSON:** `JSON.parse()` restores JavaScript data; `JSON.stringify()` creates a storable string.

**5. useEffect `[]`:** used for the initial mount loading pattern in Day 5.

**6. `CartItem[]`:** an array containing CartItem values.

**7. map + find:** map processes each cart item; find locates the matching product.

**8. undefined guard:** find may return `undefined`, so guard before reading product properties.

**9. void[]:** forgetting `return` in a block callback means the callback returns no renderable value.

**10. reduce:** accumulates item subtotals into one total.

**11. Controlled input:**

```tsx
onChange={(e) => setName(e.target.value)}
```

**12. Event value:** `e.target.value` is the current value of the event target input.

**13. form:** groups related input fields and their submission into one semantic unit.

**14. preventDefault:** stops the browser's default form submission behavior.

**15. map boundary:** per-item values belong inside map; whole-order total belongs outside.

**16. Loading flow:**

```text
getItem → JSON.parse → setCart → state update
```

**17. Typed state:**

```tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

**18. Model explanation:** Read the cart string from localStorage, restore it with `JSON.parse()`, put it into state with `setCart()`, iterate with `map()`, and use `find()` to connect each cart item to its product data.

> **Tip**
>
> If you can explain Question 18 without code, you understand the central Day 5 data flow.

---

# 한국어

## 정답표

| 문제 | 정답                                                |
| ---- | --------------------------------------------------- |
| 1    | 2. `<Link>`                                         |
| 2    | 3                                                   |
| 3    | 2. `string \| null`                                 |
| 4    | 2. `JSON.parse()`                                   |
| 5    | 3                                                   |
| 6    | 2                                                   |
| 7    | 2                                                   |
| 8    | 2                                                   |
| 9    | 1                                                   |
| 10   | 2                                                   |
| 11   | `setName(e.target.value)`                           |
| 12   | 1                                                   |
| 13   | 2                                                   |
| 14   | 3                                                   |
| 15   | 4                                                   |
| 16   | B → C → A → D                                       |
| 17   | `const [cart, setCart] = useState<CartItem[]>([]);` |
| 18   | 아래 모범답안                                       |

## 문제 1 해설

**정답: 2. `<Link>`**

`/cart → /checkout`처럼 사용자가 목적지를 클릭해 Next.js 내부 페이지로 이동하는 것은 Link의 역할이다.

> **팁**
>
> 이동 자체가 목적이면 Link, 행동 실행이 목적이면 button이라고 먼저 판단하자.

## 문제 2 해설

**정답: 3**

Checkout에서는 `useState`, `useEffect`, 이벤트 처리, localStorage처럼 브라우저 상호작용이 필요하다.

> **팁**
>
> JSX나 TypeScript 때문에 `"use client"`가 필요한 것은 아니다.

## 문제 3 해설

**정답: 2. `string | null`**

localStorage는 문자열을 저장하며 해당 key가 없으면 `null`을 반환한다.

> **팁**
>
> 그래서 `JSON.parse()` 전에 `if (savedCart)` 같은 존재 검사가 필요하다.

## 문제 4 해설

**정답: 2. `JSON.parse()`**

```text
JSON.stringify()
JavaScript → 문자열

JSON.parse()
문자열 → JavaScript
```

> **팁**
>
> 저장할 때 stringify, 다시 사용할 때 parse라고 방향으로 기억하자.

## 문제 5 해설

**정답: 3**

Day 5에서는 빈 의존성 배열을 이용해 컴포넌트가 마운트된 뒤 cart를 초기 로딩하는 effect 패턴을 만들었다.

> **팁**
>
> `[]`는 cart를 뜻하는 배열이 아니라 effect가 의존하는 값의 목록이다.

## 문제 6 해설

**정답: 2**

`CartItem[]`는 CartItem 타입 데이터가 여러 개 들어 있는 배열이다.

```text
CartItem   → 하나
CartItem[] → 여러 개
```

## 문제 7 해설

**정답: 2**

`map()`으로 cart 항목을 하나씩 꺼내고, `find()`로 `item.productId`와 같은 `product.id`를 가진 상품을 찾는다.

```text
cart의 quantity
+
products의 name / salePrice
=
Checkout 상품 정보
```

> **팁**
>
> map = 여러 개 순회, find = 그중 조건에 맞는 한 개 검색.

## 문제 8 해설

**정답: 2**

`find()`는 조건에 맞는 상품이 없으면 `undefined`를 반환할 수 있다.

그래서:

```tsx
if (!product) return null;
```

로 먼저 처리한다.

> **팁**
>
> 이 가드는 런타임 안전성뿐 아니라 TypeScript의 타입 좁히기에도 도움이 된다.

## 문제 9 해설

**정답: 1**

```tsx
cart.map((item) => {
  <li>{item.quantity}</li>;
});
```

처럼 `{}`를 열어놓고 `return`하지 않으면 callback이 값을 반환하지 않아 `void[]` 문제가 생길 수 있다.

정상적인 형태:

```tsx
cart.map((item) => {
  return <li>{item.quantity}</li>;
});
```

> **팁**
>
> `find()`의 undefined 문제와 `map()`의 void[] 문제는 서로 다른 원인이다.

## 문제 10 해설

**정답: 2**

`reduce()`는 각 상품의:

```tsx
product.salePrice * item.quantity;
```

를 누적해 전체 `totalPrice` 하나를 만든다.

```text
map    → 각각
find   → 하나 찾기
reduce → 전체를 하나로
```

## 문제 11 해설

**정답**

```tsx
setName(e.target.value);
```

완성:

```tsx
<input value={name} onChange={(e) => setName(e.target.value)} />
```

흐름:

```text
사용자 입력
→ e.target.value
→ setName()
→ name state
→ value={name}
```

> **팁**
>
> `e.target.value`는 input → state, `value={name}`은 state → input이다.

## 문제 12 해설

**정답: 1**

`e.target.value`는 이벤트가 발생한 input의 현재 입력값이다.

```text
e        → 이벤트 객체
target   → 이벤트가 발생한 요소
value    → 그 요소의 현재 입력값
```

## 문제 13 해설

**정답: 2**

배송 정보와 주문 버튼은 하나의 주문 제출 과정이므로 같은 `<form>` 안에 두는 것이 의미적으로 자연스럽다.

> **팁**
>
> form은 레이아웃 박스가 아니라 **입력과 제출의 단위**다.

## 문제 14 해설

**정답: 3**

`e.preventDefault()`는 브라우저의 기본 form 제출 동작을 막는다. 그러면 React의 `handleSubmit` 안에서 우리가 원하는 로직을 실행할 수 있다.

> **팁**
>
> state 업데이트를 막는 것이 아니다.

## 문제 15 해설

**정답: 4. 전체 `totalPrice`**

```text
상품명   → 상품마다 다름 → map 안
수량     → 상품마다 다름 → map 안
소계     → 상품마다 다름 → map 안
totalPrice → 주문 전체 하나 → map 밖
```

> **팁**
>
> “이 값이 상품마다 다른가?”를 물어보면 위치를 결정하기 쉽다.

## 문제 16 해설

**정답: B → C → A → D**

```text
localStorage.getItem("cart")
↓
JSON.parse(savedCart)
↓
setCart(parsedCart)
↓
cart state에 반영
```

## 문제 17 해설

**정답**

```tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

분해:

```text
cart        → 현재 state
setCart     → state 변경 함수
CartItem[]  → state의 데이터 타입
[]          → 초기값
```

## 문제 18 해설

**모범답안**

localStorage에서 `"cart"`에 저장된 JSON 문자열을 읽고, `JSON.parse()`로 JavaScript 배열로 복원한다. 복원한 데이터를 `setCart()`로 cart state에 넣는다. 이후 `map()`으로 각 CartItem을 하나씩 처리하면서 `find()`를 사용해 `productId`와 일치하는 실제 상품 정보를 찾아 상품명, 가격, 수량, 소계 등을 화면에 표시한다.

전체 흐름:

```text
localStorage
↓
JSON.parse
↓
setCart
↓
cart state
↓
map
↓
item.productId
↓
find
↓
product
↓
JSX
```

> **팁**
>
> 이 문제를 코드 없이 말로 설명할 수 있으면 Day 5의 가장 중요한 데이터 흐름을 이해한 것이다.

---

## 오답 복습 순서

1. 틀린 문제 번호를 기록한다.
2. 정답 이유를 자신의 말로 다시 설명한다.
3. 가장 헷갈린 오답과 정답의 차이를 한 문장으로 적는다.
4. GENERAL에서 해당 개념을 다시 확인한다.
5. 다음날 문제 파일만 다시 풀어본다.

> **팁**
>
> 점수만 기록하지 말고 “왜 헷갈렸는가”를 기록하면 다음 복습 효율이 훨씬 좋아진다.
