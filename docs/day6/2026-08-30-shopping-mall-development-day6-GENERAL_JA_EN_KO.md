# Day 6 총정리 --- GENERAL / 総整理 / Comprehensive Review

[📝 Day 5 문제 풀기](2026-08-30-shopping-mall-development-day6-QUESTIONS_JA_EN_KO.md)  
[✅ Day 5 정답·해설 보기](2026-08-30-shopping-mall-development-day6-ANSWERS_JA_EN_KO.md)

> 범위: 오늘 학습한 쇼핑몰 Day 6의 주문 저장 구조와 JavaScript/React
> 핵심 개념을 일본어 → 영어 → 한국어 순서로 복습합니다.

---

# 日本語

## 0. 学習情報

- **テーマ:** Next.js ショッピングモール Day 6
- **学習範囲:** `Order`, `Order[]`, localStorage, JSON, React state,
  条件付きレンダリング, Truthy/Falsy, `reverse()` / `toReversed()`,
  `sort()` / `toSorted()`, 比較関数, `Date.getTime()`
- **最終目標:**
  注文を保存し、注文完了画面と注文履歴画面に表示し、最新の注文から並べられるようにする。

## 1. 今日の全体フロー

```text
Cart
↓
Checkout
↓
配送情報を入力
↓
Order オブジェクトを作成
↓
既存の orders[] を読み込む
↓
新しい Order を追加
↓
localStorage に保存
↓
cart だけ削除
↓
Order Complete
↓
Orders History
```

> **ヒント**
>
> `cart` は進行中の買い物、`orders`
> は完了した注文履歴です。役割を混ぜないことが最重要です。

## 2. `Order` と `Order[]`

```ts
export type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
};
```

- `Order` = 1件の注文
- `Order[]` = 複数の注文
- `items: CartItem[]` = 注文に含まれる複数の商品情報

実際の値を入れるときは型ではなくデータを使います。

```ts
items: cart;
```

`items: CartItem[]` はオブジェクトの値としては使えません。

> **ヒント**
>
> TypeScript の型は「データの形」、`cart` は「実際のデータ」です。

## 3. 注文オブジェクトを作る

```ts
const order: Order = {
  id: Date.now(),
  name,
  phone,
  address,
  items: cart,
  totalPrice,
  createdAt: new Date().toISOString(),
};
```

`Date.now()` は学習用の簡単な注文 ID として使い、`toISOString()`
は保存に適した標準日時文字列を作ります。

> **ヒント**
>
> 保存形式と表示形式を分けます。保存は ISO、表示は
> `toLocaleString("ko-KR")` のようにローカライズできます。

## 4. localStorage と JSON

読み込み：

```ts
const savedOrders = localStorage.getItem("orders");

const parsedOrders: Order[] = savedOrders ? JSON.parse(savedOrders) : [];
```

追加：

```ts
const updatedOrders: Order[] = [...parsedOrders, order];
```

保存：

```ts
localStorage.setItem("orders", JSON.stringify(updatedOrders));
```

注文保存後：

```ts
localStorage.removeItem("cart");
setCart([]);
```

> **ヒント**
>
> 読み込みは `string → JSON.parse() → JavaScript`、保存は
> `JavaScript → JSON.stringify() → string` と覚えます。

## 5. State が必要なデータとローカル変数

Checkout では `cart` を画面に表示するため state
が必要です。一方、保存処理だけに使う `parsedOrders` や `updatedOrders`
は普通のローカル変数で十分です。

```tsx
const [orders, setOrders] = useState<Order[]>([]);
```

は `/orders` のように注文一覧を画面に表示するときに意味があります。

> **ヒント**
>
> state は単なる保存場所ではなく、「値が変わったら React
> に再レンダリングしてほしいデータ」に使います。

## 6. 注文完了画面

```tsx
const [order, setOrder] = useState<Order | null>(null);
```

最後の注文：

```ts
const lastOrder = parsedOrders[parsedOrders.length - 1];
```

条件付き表示：

```tsx
{
  order && <section>...</section>;
}
```

> **ヒント**
>
> `Order | null`
> は「まだ注文を読み込んでいない可能性」を型で表しています。

## 7. 注文履歴と loading

```tsx
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);
```

- `orders` = 何のデータがあるか
- `loading` = もう確認が終わったか

```tsx
if (loading) {
  return <p>注文履歴を確認しています。</p>;
}
```

その後：

```tsx
orders.length === 0
  ? <p>注文履歴がありません。</p>
  : orders.map(...)
```

> **ヒント**
>
> 「未確認」と「確認済みだが0件」は別の UI 状態です。

## 8. Truthy / Falsy

代表的な falsy:

```text
false, 0, "", null, undefined, NaN
```

一方：

```ts
[];
{
}
("0");
("false");
(" ");
```

は truthy です。

そのため空配列チェックは：

```ts
orders.length === 0;
```

が明確です。

> **ヒント**
>
> `!orders` では空配列を判定できません。`[]` 自体は truthy だからです。

## 9. `reverse()` と `toReversed()`

```ts
const result = arr.reverse();
```

`reverse()` は元の配列を変更します。

```ts
const result = arr.toReversed();
```

`toReversed()` は元の配列を維持し、新しい配列を返します。

React で従来の方法なら：

```tsx
[...orders].reverse();
```

> **ヒント**
>
> React state では mutation
> を避け、「新しい配列を作る」考え方を優先します。

## 10. `sort()` と `toSorted()`

`sort()` は元の配列を変更します。

```ts
arr.sort(compareFn);
```

`toSorted()` は新しいソート済み配列を返します。

```ts
arr.toSorted(compareFn);
```

> **ヒント**
>
> `reverse()` / `sort()` は mutation、`toReversed()` / `toSorted()` は
> immutable な新配列生成、とペアで覚えます。

## 11. 比較関数

```ts
(a, b) => a - b;
```

- 負数 → `a` が前
- 正数 → `b` が前
- 0 → このソート基準では同等

数値：

```ts
(a, b) => a - b // 昇順
(a, b) => b - a // 降順
```

> **ヒント**
>
> 比較関数の具体的な返り値ではなく、符号が負・0・正のどれかを見ます。

## 12. 注文を最新順にする

```tsx
orders.toSorted((a, b) => {
  const aTime = new Date(a.createdAt).getTime();
  const bTime = new Date(b.createdAt).getTime();

  return bTime - aTime;
});
```

新しい日時ほど timestamp が大きいため、`bTime - aTime`
で新しい注文を前にできます。

> **ヒント**
>
> 分からなくなったら `aTime = 1000`, `bTime = 2000`
> を代入して比較してください。

## 13. 今日の核心

```text
Order = 1件
Order[] = 複数件

cart = 進行中
orders = 完了履歴

JSON.parse = string → JavaScript
JSON.stringify = JavaScript → string

state = UI の再レンダリングと結びつくデータ

reverse/sort = 元を変更
toReversed/toSorted = 新配列

a - b = 昇順
b - a = 降順
```

---

# English

## 0. Study Scope

- **Theme:** Next.js shopping mall Day 6
- **Topics:** `Order`, `Order[]`, localStorage, JSON, React state,
  conditional rendering, Truthy/Falsy, array reversing/sorting,
  comparators, and `Date.getTime()`.
- **Goal:** Save completed orders, display the latest order and order
  history, and sort history newest first.

## 1. Overall Flow

```text
Cart → Checkout → shipping info → create Order
→ read orders[] → append Order → save localStorage
→ clear cart only → Order Complete → Orders History
```

> **Tip**
>
> `cart` is current shopping data. `orders` is completed history. Their
> lifecycles are different.

## 2. `Order` and `Order[]`

`Order` represents one completed order, while `Order[]` represents
multiple completed orders. `items: CartItem[]` describes the type, but
the runtime value is `items: cart`.

> **Tip**
>
> A TypeScript type describes a shape; it is not the runtime data
> itself.

## 3. Creating an Order

```ts
const order: Order = {
  id: Date.now(),
  name,
  phone,
  address,
  items: cart,
  totalPrice,
  createdAt: new Date().toISOString(),
};
```

`Date.now()` gives a simple learning-project ID, and `toISOString()`
produces a standardized timestamp for storage.

> **Tip**
>
> Keep storage format and display format separate.

## 4. localStorage and JSON

```ts
const savedOrders = localStorage.getItem("orders");
const parsedOrders: Order[] = savedOrders ? JSON.parse(savedOrders) : [];
const updatedOrders = [...parsedOrders, order];

localStorage.setItem("orders", JSON.stringify(updatedOrders));
```

Then clear only the cart.

> **Tip**
>
> Read: string → `JSON.parse()` → JS value. Write: JS value →
> `JSON.stringify()` → string.

## 5. State vs Local Variables

Use state when the data participates in rendering and changes should
update the UI. Temporary values used only during a submit operation can
remain local variables.

> **Tip**
>
> State is not merely storage; it connects data changes to React
> rendering.

## 6. Order Complete

```tsx
const [order, setOrder] = useState<Order | null>(null);
```

The latest order can be obtained from the last element of `orders[]`,
then rendered with:

```tsx
{order && (...)}
```

> **Tip**
>
> `Order | null` models the fact that no order has been loaded yet.

## 7. Orders and Loading

```tsx
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);
```

This distinguishes three states: checking, checked-but-empty, and
checked-with-orders.

> **Tip**
>
> "No data yet" and "checked and found zero records" are different UI
> states.

## 8. Truthy and Falsy

Falsy values include `false`, `0`, `""`, `null`, `undefined`, and `NaN`.
Empty arrays and empty objects are truthy.

Therefore:

```ts
orders.length === 0;
```

is a clear empty-array check.

> **Tip**
>
> `!orders` does not test whether an array is empty because `[]` is
> truthy.

## 9. Reverse Methods

`reverse()` mutates the original array. `toReversed()` returns a new
reversed array.

```tsx
[...orders].reverse();
```

is the traditional copy-then-reverse pattern.

> **Tip**
>
> With React state, prefer deriving a new array rather than mutating the
> original state array.

## 10. Sort Methods

`sort()` mutates the original. `toSorted()` creates a sorted copy.

> **Tip**
>
> Pair them mentally: `reverse/sort` mutate; `toReversed/toSorted`
> return new arrays.

## 11. Comparator

```ts
(a, b) => a - b;
```

Negative means `a` comes first, positive means `b` comes first, and zero
means equal according to the sorting criterion.

```ts
(a, b) => a - b // ascending
(a, b) => b - a // descending
```

> **Tip**
>
> Focus on the sign of the result, not its exact numeric value.

## 12. Newest Orders First

```tsx
orders.toSorted((a, b) => {
  const aTime = new Date(a.createdAt).getTime();
  const bTime = new Date(b.createdAt).getTime();

  return bTime - aTime;
});
```

Newer dates have larger timestamps, so descending timestamp order means
newest first.

> **Tip**
>
> Substitute simple values such as 1000 and 2000 whenever the direction
> is confusing.

## 13. Core Review

```text
Order = one order
Order[] = many orders
cart = current shopping
orders = completed history
JSON.parse = string → JS
JSON.stringify = JS → string
state = data connected to rendering
reverse/sort = mutate
toReversed/toSorted = new array
a - b = ascending
b - a = descending
```

---

# 한국어

## 0. 학습 범위

- **주제:** Next.js 쇼핑몰 Day 6
- **범위:** `Order`, `Order[]`, localStorage, JSON, React state,
  조건부 렌더링, Truthy/Falsy, 배열 뒤집기·정렬, 비교 함수,
  `Date.getTime()`
- **목표:** 주문을 저장하고 주문 완료·주문 내역에 표시하며 최신
  주문부터 정렬하기

## 1. 전체 흐름

```text
Cart → Checkout → 배송정보
→ Order 생성 → 기존 orders[] 읽기
→ 새 Order 추가 → localStorage 저장
→ cart만 삭제 → 주문 완료 → 주문 내역
```

> **팁**
>
> `cart`와 `orders`의 생명주기를 분리하는 것이 Day 6의 가장 중요한
> 구조입니다.

## 2. `Order`와 `Order[]`

`Order`는 주문 한 건, `Order[]`는 여러 주문입니다. `items: CartItem[]`는
타입 설명이고 실제 주문을 만들 때는 `items: cart`처럼 실제 값을
넣습니다.

> **팁**
>
> 타입과 값을 구별하세요. `CartItem[]`는 설계도이고 `cart`는 실제
> 데이터입니다.

## 3. 주문 객체 생성

```ts
const order: Order = {
  id: Date.now(),
  name,
  phone,
  address,
  items: cart,
  totalPrice,
  createdAt: new Date().toISOString(),
};
```

> **팁**
>
> 날짜는 표준 형태로 저장하고 화면에서 사용자 지역에 맞게 변환하는
> 방식이 좋습니다.

## 4. localStorage와 JSON

```ts
const savedOrders = localStorage.getItem("orders");
const parsedOrders: Order[] = savedOrders ? JSON.parse(savedOrders) : [];
const updatedOrders = [...parsedOrders, order];

localStorage.setItem("orders", JSON.stringify(updatedOrders));
```

그 후 `cart`만 제거합니다.

> **팁**
>
> 읽기는 `string → parse → JS`, 저장은 `JS → stringify → string`으로
> 외우세요.

## 5. state와 일반 변수

화면에 렌더링되고 변경 시 UI 갱신이 필요한 데이터는 state가 적합합니다.
제출 처리 중 잠깐 계산·저장에만 사용하는 `parsedOrders`,
`updatedOrders`는 일반 변수면 충분합니다.

> **팁**
>
> state를 단순 저장 공간이라고 생각하지 말고 **React 렌더링과 연결된
> 데이터**라고 이해하세요.

## 6. 주문 완료 페이지

```tsx
const [order, setOrder] = useState<Order | null>(null);
```

마지막 주문을 가져와:

```tsx
{order && (...)}
```

로 주문이 존재할 때만 표시할 수 있습니다.

> **팁**
>
> `Order | null`은 아직 주문을 불러오지 않은 상태까지 타입으로
> 표현합니다.

## 7. 주문 내역과 loading

```tsx
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);
```

이를 통해 로딩 중 / 확인 완료 후 0건 / 주문 존재의 세 상태를 구분할 수
있습니다.

> **팁**
>
> 빈 배열 하나만으로는 "아직 확인 전"인지 "확인했지만 0건"인지 구분하기
> 어렵습니다.

## 8. Truthy / Falsy

대표적인 falsy는 `false`, `0`, `""`, `null`, `undefined`, `NaN`입니다.
하지만 `[]`, `{}`는 비어 있어도 truthy입니다.

```ts
orders.length === 0;
```

처럼 확인하는 것이 명확합니다.

> **팁**
>
> `!orders`는 빈 배열 검사 방법이 아닙니다.

## 9. `reverse()`와 `toReversed()`

`reverse()`는 원본 배열을 변경하고 `toReversed()`는 새로운 역순 배열을
만듭니다.

```tsx
[...orders].reverse();
```

는 복사 후 복사본을 뒤집는 방식입니다.

> **팁**
>
> React에서는 state 원본 mutation을 피하는 습관을 들이세요.

## 10. `sort()`와 `toSorted()`

`sort()`는 원본을 변경하고 `toSorted()`는 정렬된 새 배열을 반환합니다.

> **팁**
>
> `reverse/sort = 원본 변경`, `toReversed/toSorted = 새 배열`로 묶어서
> 기억하세요.

## 11. 비교 함수

```ts
(a, b) => a - b;
```

- 음수: `a`가 앞
- 양수: `b`가 앞
- 0: 현재 정렬 기준에서 동등

```ts
(a, b) => a - b // 오름차순
(a, b) => b - a // 내림차순
```

> **팁**
>
> 반환값의 정확한 숫자보다 부호를 보세요.

## 12. 최신 주문순 정렬

```tsx
orders.toSorted((a, b) => {
  const aTime = new Date(a.createdAt).getTime();
  const bTime = new Date(b.createdAt).getTime();

  return bTime - aTime;
});
```

최신 시간일수록 timestamp가 크기 때문에 `bTime - aTime`을 사용하면 최신
주문이 앞에 옵니다.

> **팁**
>
> 방향이 헷갈리면 `1000`, `2000`을 직접 대입해서 비교하세요.

## 13. 오늘의 핵심

```text
Order = 주문 1건
Order[] = 주문 여러 건
cart = 진행 중 쇼핑
orders = 완료된 주문 기록
JSON.parse = 문자열 → JS 값
JSON.stringify = JS 값 → 문자열
state = 렌더링과 연결된 데이터
reverse/sort = 원본 변경
toReversed/toSorted = 새 배열
a - b = 오름차순
b - a = 내림차순
```

> **팁**
>
> 문제를 풀기 전에 이 마지막 핵심 표를 가리고 스스로 설명해보면 복습
> 효과가 좋습니다.
