# JavaScript 배열 업데이트: `push()` vs Spread (`...`) --- React 관점

------------------------------------------------------------------------

# 日本語

## 1. 核心概念

`push()` と spread 構文 (`...`)
は、どちらも配列に新しい要素を追加するために使えます。

しかし、最も重要な違いは次のとおりです。

-   `push()`：既存の配列そのものを変更する
-   spread：既存の配列を変更せず、新しい配列を作る

``` ts
parsedOrders.push(order);
```

``` ts
const updatedOrders = [...parsedOrders, order];
```

> **ヒント**
>
> `push()` は「既存の箱の中身を変える」、spread
> は「既存の箱はそのままにして、新しい箱を作る」と考えると理解しやすいです。

## 2. `push()` は既存の配列を変更する

``` ts
const fruits = ["apple", "banana"];

fruits.push("orange");

console.log(fruits);
// ["apple", "banana", "orange"]
```

`push()` を実行すると、元の `fruits` 配列そのものが変更されます。

``` text
変更前
fruits → ["apple", "banana"]

push("orange")

変更後
fruits → ["apple", "banana", "orange"]
```

これは mutation（ミューテーション、直接変更）と呼ばれる考え方です。

> **ヒント**
>
> `push`, `pop`, `splice`, `sort`, `reverse`
> などを見るときは、「元の配列を直接変更するメソッドか？」を確認する習慣をつけましょう。

## 3. spread は新しい配列を作る

``` ts
const fruits = ["apple", "banana"];

const newFruits = [...fruits, "orange"];
```

結果：

``` ts
console.log(fruits);
// ["apple", "banana"]

console.log(newFruits);
// ["apple", "banana", "orange"]
```

元の `fruits` は変更されません。

``` text
fruits
  └─→ ["apple", "banana"]

newFruits
  └─→ ["apple", "banana", "orange"]
```

`...fruits` は、`fruits` の各要素を新しい配列の中に展開します。

> **ヒント**
>
> `[...fruits, "orange"]` は「fruits の中身を展開し、その後ろに orange
> を追加して新しい配列を作る」と読んでみましょう。

## 4. React ではなぜ重要なのか

React の state を考えてみます。

``` ts
const [orders, setOrders] = useState<Order[]>([]);
```

新しい注文 `order` が作られたとき、次のように state
配列を直接変更するのは避けます。

``` ts
orders.push(order);
```

React では通常、setter に新しい値を渡します。

``` ts
setOrders([...orders, order]);
```

基本的な流れ：

``` text
既存の state
↓
新しい state を計算
↓
setState(新しい state)
↓
React が更新を処理
↓
UI が再レンダリング
```

> **ヒント**
>
> React の state
> は「直接書き換える値」ではなく、「現在の値から次の値を作り、setter
> で更新する値」と考えると理解しやすくなります。

## 5. 配列の内容と参照（reference）

JavaScript
の配列はオブジェクトです。変数は配列への参照を持つと考えることができます。

``` ts
const orders = [order1, order2];
```

概念的には：

``` text
orders
   │
   │ reference
   ▼
┌─────────────────┐
│ order1, order2  │
└─────────────────┘
```

`push()` の場合：

``` ts
orders.push(order3);
```

``` text
orders
   │
   ▼
┌─────────────────────────┐
│ order1, order2, order3  │
└─────────────────────────┘
```

同じ配列を直接変更しています。

spread の場合：

``` ts
const updatedOrders = [...orders, order3];
```

``` text
orders
   │
   ▼
┌─────────────────┐
│ order1, order2  │
└─────────────────┘

updatedOrders
   │
   ▼
┌─────────────────────────┐
│ order1, order2, order3  │
└─────────────────────────┘
```

新しい配列が作られます。

> **ヒント**
>
> spread を理解するときは、単に `...`
> の文法を覚えるだけでなく、「新しい配列＝新しい参照を作る」という点までつなげて理解しましょう。

## 6. React state で避けたいパターン

``` ts
orders.push(order);
setOrders(orders);
```

このコードでは、まず既存の state 配列を直接変更し、その同じ配列を setter
に渡しています。

``` text
orders
↓
既存の配列を直接変更
↓
push()
↓
同じ配列参照
↓
setOrders(orders)
```

React は state
更新時に値の同一性を判断します。同じ配列オブジェクトを再び渡すと、期待どおりの更新にならない可能性があります。

そのため、通常は次のように新しい配列を渡します。

``` ts
setOrders([...orders, order]);
```

> **ヒント**
>
> React の配列 state では「push してから
> setter」ではなく、「新しい配列を作って setter」に慣れましょう。

## 7. Day 6 の `parsedOrders` は少し違う

今回の Checkout コード：

``` ts
const parsedOrders: Order[] = savedOrders
  ? JSON.parse(savedOrders)
  : [];
```

`parsedOrders` は React state ではなく、`handleSubmit`
内の通常のローカル変数です。

そのため、技術的には次のコードでも今回の保存処理は実装できます。

``` ts
parsedOrders.push(order);
```

しかし、今回は次の形を使います。

``` ts
const updatedOrders: Order[] = [...parsedOrders, order];
```

理由は、既存のデータを直接変更しないため意図が明確であり、React の state
更新パターンにもそのままつながるからです。

> **ヒント**
>
> `push()`
> 自体が悪いわけではありません。重要なのは「何を直接変更しているのか」です。特に
> React の state や props を扱うときは、直接変更を避けることが重要です。

## 8. 比較

  コード                            元の配列を変更   新しい配列を作成   React state 更新に推奨
  --------------------------------- ---------------- ------------------ ------------------------
  `orders.push(order)`              O                X                  X
  `[...orders, order]`              X                O                  O
  `setOrders([...orders, order])`   X                O                  O

今回の Day 6：

``` ts
const updatedOrders: Order[] = [...parsedOrders, order];
```

意味：

``` text
1. parsedOrders はそのまま残す
2. ...parsedOrders で既存の注文を展開する
3. order を最後に追加した新しい配列を作る
```

> **ヒント**
>
> React
> で配列を扱うときは、「元の配列を直接変更しているか？それとも新しい配列を作っているか？」を確認しましょう。

------------------------------------------------------------------------

# English

## 1. Core concept

Both `push()` and spread syntax (`...`) can be used when adding an item
to an array.

The key difference is:

-   `push()` modifies the existing array.
-   spread leaves the existing array unchanged and creates a new array.

``` ts
parsedOrders.push(order);
```

``` ts
const updatedOrders = [...parsedOrders, order];
```

> **Tip**
>
> Think of `push()` as changing the contents of the existing box, while
> spread keeps the old box and creates a new one.

## 2. `push()` modifies the existing array

``` ts
const fruits = ["apple", "banana"];

fruits.push("orange");

console.log(fruits);
// ["apple", "banana", "orange"]
```

The original `fruits` array itself has changed.

``` text
Before
fruits → ["apple", "banana"]

push("orange")

After
fruits → ["apple", "banana", "orange"]
```

This is a form of mutation.

> **Tip**
>
> When you encounter methods such as `push`, `pop`, `splice`, `sort`, or
> `reverse`, ask whether the method mutates the original array.

## 3. Spread creates a new array

``` ts
const fruits = ["apple", "banana"];

const newFruits = [...fruits, "orange"];
```

Result:

``` ts
console.log(fruits);
// ["apple", "banana"]

console.log(newFruits);
// ["apple", "banana", "orange"]
```

The original `fruits` array remains unchanged.

``` text
fruits
  └─→ ["apple", "banana"]

newFruits
  └─→ ["apple", "banana", "orange"]
```

`...fruits` expands the elements of `fruits` into the new array.

> **Tip**
>
> Read `[...fruits, "orange"]` as: "spread all existing fruit elements
> into a new array, then add orange at the end."

## 4. Why this matters in React

Consider React state:

``` ts
const [orders, setOrders] = useState<Order[]>([]);
```

When a new `order` is created, avoid directly mutating the state array:

``` ts
orders.push(order);
```

The normal React pattern is to pass a new value to the setter:

``` ts
setOrders([...orders, order]);
```

Conceptually:

``` text
Existing state
↓
Calculate new state
↓
setState(new state)
↓
React processes the update
↓
UI re-renders
```

> **Tip**
>
> Think of React state as a value from which you calculate the next
> value, rather than something you directly edit.

## 5. Array contents and references

JavaScript arrays are objects. A variable can be understood as holding a
reference to an array.

``` ts
const orders = [order1, order2];
```

Conceptually:

``` text
orders
   │
   │ reference
   ▼
┌─────────────────┐
│ order1, order2  │
└─────────────────┘
```

With `push()`:

``` ts
orders.push(order3);
```

``` text
orders
   │
   ▼
┌─────────────────────────┐
│ order1, order2, order3  │
└─────────────────────────┘
```

The same array has been mutated.

With spread:

``` ts
const updatedOrders = [...orders, order3];
```

``` text
orders
   │
   ▼
┌─────────────────┐
│ order1, order2  │
└─────────────────┘

updatedOrders
   │
   ▼
┌─────────────────────────┐
│ order1, order2, order3  │
└─────────────────────────┘
```

A new array is created.

> **Tip**
>
> When learning spread syntax, connect it to the idea of creating a new
> array and therefore a new array reference.

## 6. A pattern to avoid with React state

``` ts
orders.push(order);
setOrders(orders);
```

This first mutates the existing state array and then passes that same
array to the setter.

``` text
orders
↓
Mutate existing array
↓
push()
↓
Same array reference
↓
setOrders(orders)
```

React checks state value identity when processing updates. Passing the
same array object again can prevent the update from behaving as
expected.

The common pattern is:

``` ts
setOrders([...orders, order]);
```

> **Tip**
>
> For React array state, build the habit of "create a new array, then
> pass it to the setter."

## 7. Day 6's `parsedOrders` is slightly different

In the current Checkout code:

``` ts
const parsedOrders: Order[] = savedOrders
  ? JSON.parse(savedOrders)
  : [];
```

`parsedOrders` is not React state. It is simply a local variable inside
`handleSubmit`.

Therefore, technically, this can work for the current storage operation:

``` ts
parsedOrders.push(order);
```

However, we use:

``` ts
const updatedOrders: Order[] = [...parsedOrders, order];
```

This makes the intent clearer because it does not mutate the existing
array, and it also matches the immutable update pattern commonly used
with React state.

> **Tip**
>
> `push()` is not inherently bad. The important question is what you are
> mutating. Direct mutation is especially important to avoid when
> working with React state and props.

## 8. Comparison

  ---------------------------------------------------------------------------------------
  Code                              Mutates original  Creates new array Recommended for
                                    array                               React state
                                                                        updates
  --------------------------------- ----------------- ----------------- -----------------
  `orders.push(order)`              Yes               No                No

  `[...orders, order]`              No                Yes               Yes

  `setOrders([...orders, order])`   No                Yes               Yes
  ---------------------------------------------------------------------------------------

For Day 6:

``` ts
const updatedOrders: Order[] = [...parsedOrders, order];
```

This means:

``` text
1. Keep parsedOrders unchanged
2. Expand all existing orders with ...parsedOrders
3. Create a new array with the new order appended
```

> **Tip**
>
> Whenever you work with arrays in React, ask: "Am I changing the
> original array, or creating a new one?"

------------------------------------------------------------------------

# 한국어

## 1. 핵심 개념

`push()`와 spread 문법(`...`)은 둘 다 배열에 새로운 요소를 추가할 때
사용할 수 있습니다.

하지만 가장 중요한 차이는 다음과 같습니다.

-   `push()`는 기존 배열 자체를 변경합니다.
-   spread는 기존 배열을 변경하지 않고 새로운 배열을 만듭니다.

``` ts
parsedOrders.push(order);
```

``` ts
const updatedOrders = [...parsedOrders, order];
```

> **팁**
>
> `push()`는 "기존 상자의 내용물을 바꾼다", spread는 "기존 상자는 그대로
> 두고 새로운 상자를 만든다"라고 생각하면 쉽습니다.

## 2. `push()`는 기존 배열 자체를 변경합니다

``` ts
const fruits = ["apple", "banana"];

fruits.push("orange");

console.log(fruits);
// ["apple", "banana", "orange"]
```

`push()`를 실행하면 원래 `fruits` 배열 자체가 변경됩니다.

``` text
변경 전
fruits → ["apple", "banana"]

push("orange")

변경 후
fruits → ["apple", "banana", "orange"]
```

이처럼 기존 값을 직접 변경하는 것을 mutation이라고 합니다.

> **팁**
>
> `push`, `pop`, `splice`, `sort`, `reverse` 같은 메서드를 볼 때는 "원본
> 배열을 직접 변경하는가?"를 확인하는 습관을 들이세요.

## 3. spread는 새로운 배열을 만듭니다

``` ts
const fruits = ["apple", "banana"];

const newFruits = [...fruits, "orange"];
```

결과:

``` ts
console.log(fruits);
// ["apple", "banana"]

console.log(newFruits);
// ["apple", "banana", "orange"]
```

기존 `fruits`는 그대로 유지됩니다.

``` text
fruits
  └─→ ["apple", "banana"]

newFruits
  └─→ ["apple", "banana", "orange"]
```

`...fruits`는 기존 배열의 요소들을 새로운 배열 안에 펼쳐 넣습니다.

> **팁**
>
> `[...fruits, "orange"]`를 "기존 fruits의 내용물을 펼치고 마지막에
> orange를 추가한 새로운 배열을 만든다"라고 읽어보세요.

## 4. React에서는 왜 중요할까요?

React state를 생각해봅시다.

``` ts
const [orders, setOrders] = useState<Order[]>([]);
```

새로운 `order`가 생겼다고 해서 state 배열을 직접 변경하는 것은 피해야
합니다.

``` ts
orders.push(order);
```

React에서는 일반적으로 setter에 새로운 값을 전달합니다.

``` ts
setOrders([...orders, order]);
```

기본적인 흐름은 다음과 같습니다.

``` text
기존 state
↓
새 state 계산
↓
setState(새 state)
↓
React가 업데이트 처리
↓
UI 재렌더링
```

> **팁**
>
> React state는 "직접 고치는 값"보다는 "현재 값을 바탕으로 다음 값을
> 만든 뒤 setter로 교체하는 값"이라고 생각하세요.

## 5. 배열의 내용과 참조(reference)

JavaScript 배열은 객체입니다. 변수에는 배열 자체에 접근할 수 있는 참조가
있다고 이해할 수 있습니다.

``` ts
const orders = [order1, order2];
```

개념적으로:

``` text
orders
   │
   │ 참조
   ▼
┌─────────────────┐
│ order1, order2  │
└─────────────────┘
```

`push()`를 사용하면:

``` ts
orders.push(order3);
```

``` text
orders
   │
   ▼
┌─────────────────────────┐
│ order1, order2, order3  │
└─────────────────────────┘
```

기존 배열 자체가 변경됩니다.

spread를 사용하면:

``` ts
const updatedOrders = [...orders, order3];
```

``` text
orders
   │
   ▼
┌─────────────────┐
│ order1, order2  │
└─────────────────┘

updatedOrders
   │
   ▼
┌─────────────────────────┐
│ order1, order2, order3  │
└─────────────────────────┘
```

새로운 배열이 만들어집니다.

> **팁**
>
> spread를 배울 때는 단순히 `...` 문법만 외우지 말고 "새로운 배열을
> 만들어 새로운 참조를 만든다"는 개념까지 연결하세요.

## 6. React state에서 피해야 할 패턴

``` ts
orders.push(order);
setOrders(orders);
```

이 코드는 기존 state 배열을 먼저 직접 변경하고, 같은 배열을 다시
setter에 전달합니다.

``` text
orders
↓
기존 배열 직접 변경
↓
push()
↓
같은 배열 참조
↓
setOrders(orders)
```

React는 state 업데이트를 처리할 때 값의 동일성을 확인합니다. 같은 배열
객체를 다시 전달하면 기대한 방식으로 업데이트되지 않을 수 있습니다.

따라서 일반적으로 다음 패턴을 사용합니다.

``` ts
setOrders([...orders, order]);
```

> **팁**
>
> React의 배열 state에서는 "push하고 setter"보다 "새 배열을 만들어
> setter에 전달한다"는 패턴을 습관화하세요.

## 7. Day 6의 `parsedOrders`는 조금 다릅니다

현재 Checkout 코드:

``` ts
const parsedOrders: Order[] = savedOrders
  ? JSON.parse(savedOrders)
  : [];
```

여기서 `parsedOrders`는 React state가 아닙니다. `handleSubmit` 안에서
사용하는 일반 로컬 변수입니다.

따라서 기술적으로는 다음 코드도 현재 저장 기능에서는 사용할 수 있습니다.

``` ts
parsedOrders.push(order);
```

하지만 우리는 다음 방식을 사용합니다.

``` ts
const updatedOrders: Order[] = [...parsedOrders, order];
```

기존 배열을 직접 변경하지 않아 의도가 명확하고, 앞으로 React state
배열을 업데이트하는 방식과 자연스럽게 연결되기 때문입니다.

> **팁**
>
> `push()` 자체가 나쁜 것은 아닙니다. 중요한 것은 "무엇을 직접 변경하고
> 있는가?"입니다. 특히 React의 state와 props를 다룰 때는 직접 변경을
> 피하는 것이 중요합니다.

## 8. 비교 정리

  코드                              원본 배열 변경   새 배열 생성   React state 업데이트에 권장
  --------------------------------- ---------------- -------------- -----------------------------
  `orders.push(order)`              O                X              X
  `[...orders, order]`              X                O              O
  `setOrders([...orders, order])`   X                O              O

Day 6에서는:

``` ts
const updatedOrders: Order[] = [...parsedOrders, order];
```

를 사용합니다.

의미는 다음과 같습니다.

``` text
1. parsedOrders는 그대로 둔다
2. ...parsedOrders로 기존 주문들을 펼친다
3. 마지막에 새 order를 추가한 새로운 배열을 만든다
```

> **팁**
>
> 앞으로 React에서 배열을 다룰 때마다 "원본 배열을 직접 바꾸고 있는가,
> 아니면 새로운 배열을 만들고 있는가?"를 먼저 확인해보세요.

## 최종 기억 포인트

``` ts
orders.push(order);
```

``` text
기존 상자 자체의 내용물을 변경
```

반면:

``` ts
const updatedOrders = [...orders, order];
```

``` text
기존 상자는 유지
+
새로운 상자를 생성
```

React의 state를 다룰 때는 기본적으로 두 번째 사고방식이 잘 맞습니다.

> **팁**
>
> 한 문장으로 기억하세요: **React state 배열은 직접 수정하지 말고,
> 새로운 배열을 만들어 업데이트한다.**
