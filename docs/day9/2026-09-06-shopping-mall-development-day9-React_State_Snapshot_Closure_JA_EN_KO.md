# React State Snapshot + Closure
## 日本語 → English → 한국어

---

# 1. 日本語

## React State Snapshot と Closure の関係

React で次のコードを見ると、不思議に感じることがあります。

```tsx
setOrders(updatedOrders);

console.log(orders);
```

`setOrders(updatedOrders)` を実行したのに、`console.log(orders)` では以前の値が見えることがあります。

これは React の state が **render ごとの snapshot** として扱われ、イベントハンドラなどの関数が **closure** によってその render の state を参照できるためです。

**Tip**

最初は次のように覚えると理解しやすいです。

```text
render が state の一場面を作る
↓
closure がその場面を覚える
```

---

## 1. Closure とは何か

JavaScript では、関数は自分が作られたときの周囲の変数にアクセスできます。

```tsx
function outer() {
  const message = "こんにちは";

  function inner() {
    console.log(message);
  }

  return inner;
}

const fn = outer();

fn();
```

結果：

```text
こんにちは
```

`outer()` の実行が終わった後でも、`inner()` は `message` にアクセスできます。

概念的には：

```text
inner
↓
作られたときの周囲の環境を覚える
↓
message にアクセスできる
```

これが closure の基本的な考え方です。

**Tip**

Closure は「関数が作られた環境の変数を覚えている」と考えると分かりやすいです。

---

## 2. React コンポーネントも関数

例：

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    console.log(count);
  }

  return (
    <button onClick={handleClick}>
      {count}
    </button>
  );
}
```

最初の render では：

```text
Render #1
count = 0
```

です。

この render 中に：

```tsx
function handleClick() {
  console.log(count);
}
```

も作られます。

したがって、`handleClick` はその render の `count` にアクセスできます。

```text
Render #1
────────────────

count = 0

handleClick #1
└── count = 0 を参照
```

---

## 3. 次の Render では新しい State と新しい関数が作られる

`setCount(1)` によって新しい render が起こると：

```text
Render #2
────────────────

count = 1

handleClick #2
└── count = 1 を参照
```

という考え方になります。

概念的には：

```text
Render #1
count = 0
handleClick #1

Render #2
count = 1
handleClick #2

Render #3
count = 2
handleClick #3
```

のように考えられます。

**Tip**

React コンポーネントが再実行されるたびに、その render に対応したイベントハンドラも新しく作られると考えると理解しやすいです。

---

## 4. `setCount()` の直後に古い値が見える理由

次のコードを見ます。

```tsx
function handleClick() {
  console.log("before:", count);

  setCount(count + 1);

  console.log("after:", count);
}
```

現在：

```text
count = 0
```

だとします。

最初の `console.log`：

```text
before: 0
```

次に：

```tsx
setCount(count + 1);
```

つまり：

```tsx
setCount(1);
```

を呼びます。

しかし現在実行中なのは Render #1 で作られた `handleClick #1` です。

その関数が見ている `count` はまだ：

```text
0
```

です。

そのため：

```text
after: 0
```

になることがあります。

そして次の render で：

```text
Render #2
count = 1
```

になります。

---

## 5. `setState()` は現在の Closure 内の変数を書き換えるわけではない

次のように考えると理解しやすいです。

```text
現在の closure
→ count = 0

setCount(1)
→ React に次の state update を依頼

現在の closure
→ count = 0 のまま

次の render
→ count = 1
```

**Tip**

`setState()` を「現在の変数を直接変更する処理」と考えず、「次の render で使う state を React に渡す処理」と考えます。

---

## 6. Day 9 の注文コードにも同じことが起こる

```tsx
function handleCancelOrder() {
  const updatedOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status: "キャンセル完了",
        }
      : order
  );

  setOrders(updatedOrders);

  console.log(orders);
}
```

現在：

```text
Render #1

orders =
1001 支払い完了
1002 支払い完了
```

だとします。

この render で：

```text
handleCancelOrder #1
└── Render #1 の orders を参照
```

という関係ができます。

ボタンをクリックすると：

```text
handleCancelOrder #1
↓
orders.map()
↓
updatedOrders 作成
↓
1002 キャンセル完了
↓
setOrders(updatedOrders)
```

となります。

しかし現在実行中の `handleCancelOrder #1` が見ている `orders` は Render #1 の snapshot です。

次の render で：

```text
Render #2

orders =
1001 支払い完了
1002 キャンセル完了
```

になります。

---

## 7. 図で見る Snapshot + Closure

```text
Render #1
────────────────────────────

orders = [支払い完了, 支払い完了]

handleCancelOrder #1
        │
        └────→ Render #1 の orders を参照


ボタンクリック
↓
updatedOrders
↓
[支払い完了, キャンセル完了]
↓
setOrders(updatedOrders)


              React update
                   ↓


Render #2
────────────────────────────

orders = [支払い完了, キャンセル完了]

handleCancelOrder #2
        │
        └────→ Render #2 の orders を参照
```

---

## 8. 非同期コードではもっと分かりやすく現れる

例：

```tsx
function handleClick() {
  setTimeout(() => {
    console.log(count);
  }, 3000);
}
```

ボタンをクリックした時点で：

```text
count = 0
```

だったとします。

その後 3 秒の間に `count` が 5 になっても、`setTimeout` の callback が Render #1 で作られたものなら、その callback は Render #1 の `count` にアクセスする可能性があります。

```text
Render #1
count = 0
↓
callback 作成
↓
closure が count = 0 の環境を保持
↓
3 秒後 callback 実行
↓
0 が見えることがある
```

**Tip**

`setTimeout`, Promise, event listener などで state が古く見える場合は closure を疑います。

---

## 9. Stale State / Stale Closure

古い render の state を closure が見続けていて、最新 state とズレが生じる状況を：

```text
stale state
stale closure
```

と呼ぶことがあります。

`stale` は：

```text
古い
最新ではない
```

という意味です。

例：

```text
現在の count = 5

古い callback が見ている count = 0
```

---

## 10. Functional Update が重要になる理由

次のコード：

```tsx
setCount(count + 1);
```

の代わりに：

```tsx
setCount((prevCount) => prevCount + 1);
```

と書くことができます。

ここで：

```tsx
prevCount
```

は React が state update の計算のために渡してくれる前の state です。

概念：

```text
closure が持っている count を使う
```

よりも：

```text
React が渡す previous state を基準に計算
```

できます。

**Tip**

次の state が previous state に依存する場合は：

```tsx
setState((prev) => ...)
```

を思い出すと良いです。

---

## 11. 注文コードでも Functional Update は使える

例えば：

```tsx
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status: "キャンセル完了",
        }
      : order
  )
);
```

この場合：

```tsx
prevOrders
```

をもとに新しい注文配列を作ります。

ただし Day 9 では `updatedOrders` を `localStorage` にも保存しているため：

```tsx
const updatedOrders = orders.map(...);
```

と先に作る形の方が、学習時には流れを理解しやすいです。

---

## 12. Closure 自体が悪いわけではない

Closure は JavaScript の正常で重要な機能です。

React のイベントハンドラも closure によって：

```tsx
orderId
```

や：

```tsx
orders
```

などの周囲の値にアクセスできます。

問題は closure そのものではなく：

```text
この関数はどの render で作られたか？
その render の state は何だったか？
```

を意識せずに使うときに起こります。

---

## Final Mental Model

```text
① React state は render ごとの snapshot

② 各 render で関数が作られる

③ 関数は closure によって
   その render の state にアクセスできる

④ setState() は現在の closure の変数を直接変更しない

⑤ 新しい state は次の render で使われる
```

覚え方：

```text
render が snapshot を作る
↓
closure がその snapshot を覚える
↓
setState()
↓
次の render
↓
新しい snapshot
```

---

# 2. English

## Relationship Between React State Snapshots and Closures

This code can look confusing:

```tsx
setOrders(updatedOrders);

console.log(orders);
```

Even after calling `setOrders(updatedOrders)`, `console.log(orders)` may still show the previous value.

The reason is that React state behaves like a **snapshot for each render**, while functions such as event handlers can access values from the render in which they were created through **JavaScript closures**.

**Tip**

A useful mental model is:

```text
a render creates a state snapshot
↓
a closure remembers that render environment
```

---

## 1. What Is a Closure?

In JavaScript, a function can access variables from the environment where it was created.

```tsx
function outer() {
  const message = "Hello";

  function inner() {
    console.log(message);
  }

  return inner;
}

const fn = outer();

fn();
```

Result:

```text
Hello
```

Even after `outer()` finishes, `inner()` can still access `message`.

Conceptually:

```text
inner
↓
remembers its surrounding environment
↓
can access message
```

That is the basic idea of a closure.

**Tip**

A simple definition is: a function can remember and access variables from the environment where it was created.

---

## 2. React Components Are Functions

Example:

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    console.log(count);
  }

  return (
    <button onClick={handleClick}>
      {count}
    </button>
  );
}
```

On the first render:

```text
Render #1
count = 0
```

During that render, React also creates:

```tsx
function handleClick() {
  console.log(count);
}
```

So the handler can access the `count` value from that render.

```text
Render #1
────────────────

count = 0

handleClick #1
└── sees count = 0
```

---

## 3. A New Render Gets New State Values and New Functions

After:

```tsx
setCount(1);
```

a later render can be thought of as:

```text
Render #2
────────────────

count = 1

handleClick #2
└── sees count = 1
```

Conceptually:

```text
Render #1
count = 0
handleClick #1

Render #2
count = 1
handleClick #2

Render #3
count = 2
handleClick #3
```

**Tip**

When a component function runs again, think of the event handlers inside it as being created again for that render.

---

## 4. Why Does the Old Value Appear Right After `setCount()`?

Consider:

```tsx
function handleClick() {
  console.log("before:", count);

  setCount(count + 1);

  console.log("after:", count);
}
```

Suppose the current render has:

```text
count = 0
```

The first log prints:

```text
before: 0
```

Then:

```tsx
setCount(count + 1);
```

effectively requests:

```tsx
setCount(1);
```

But the currently running handler is still the function created in Render #1.

That handler still sees the Render #1 value:

```text
count = 0
```

So the second log can still show:

```text
after: 0
```

A later render then has:

```text
Render #2
count = 1
```

---

## 5. `setState()` Does Not Rewrite the Current Closure Variable

A useful model is:

```text
current closure
→ count = 0

setCount(1)
→ request a React state update

current closure
→ still sees count = 0

next render
→ count = 1
```

**Tip**

Do not think of `setState()` as directly changing the current local variable. Think of it as providing state for a future render.

---

## 6. The Same Thing Happens in the Day 9 Order Code

```tsx
function handleCancelOrder() {
  const updatedOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status: "Cancelled",
        }
      : order
  );

  setOrders(updatedOrders);

  console.log(orders);
}
```

Suppose:

```text
Render #1

orders =
1001 Paid
1002 Paid
```

The handler from that render can be modeled as:

```text
handleCancelOrder #1
└── sees Render #1 orders
```

When the user clicks:

```text
handleCancelOrder #1
↓
orders.map()
↓
create updatedOrders
↓
1002 Cancelled
↓
setOrders(updatedOrders)
```

The currently running handler still sees the Render #1 `orders` snapshot.

On the next render:

```text
Render #2

orders =
1001 Paid
1002 Cancelled
```

---

## 7. Snapshot + Closure Diagram

```text
Render #1
────────────────────────────

orders = [Paid, Paid]

handleCancelOrder #1
        │
        └────→ sees Render #1 orders


user clicks
↓
updatedOrders
↓
[Paid, Cancelled]
↓
setOrders(updatedOrders)


              React update
                   ↓


Render #2
────────────────────────────

orders = [Paid, Cancelled]

handleCancelOrder #2
        │
        └────→ sees Render #2 orders
```

---

## 8. Async Code Makes This More Visible

Example:

```tsx
function handleClick() {
  setTimeout(() => {
    console.log(count);
  }, 3000);
}
```

Suppose:

```text
count = 0
```

when the user clicks.

Even if `count` later becomes 5, a callback created in Render #1 may still have access to the Render #1 `count` value.

```text
Render #1
count = 0
↓
callback created
↓
closure retains the render environment
↓
3 seconds later
↓
old value may be observed
```

**Tip**

When state appears unexpectedly old inside `setTimeout`, Promises, or event listeners, check the closure and the render in which the function was created.

---

## 9. Stale State / Stale Closure

When a function continues using state from an older render while newer state exists, people often describe it as:

```text
stale state
stale closure
```

`stale` means:

```text
old
not current
```

Example:

```text
current count = 5

old callback sees count = 0
```

---

## 10. Why Functional Updates Matter

Instead of:

```tsx
setCount(count + 1);
```

you can write:

```tsx
setCount((prevCount) => prevCount + 1);
```

Here:

```tsx
prevCount
```

is the previous state value React provides for the update calculation.

This lets you compute the next state from the previous state without relying on a possibly old value captured by the current closure.

**Tip**

When the next state depends on the previous state, remember:

```tsx
setState((prev) => ...)
```

---

## 11. Functional Update for Orders

The order state can also be updated like this:

```tsx
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status: "Cancelled",
        }
      : order
  )
);
```

Here:

```tsx
prevOrders
```

is used to calculate the next state.

However, in Day 9 we also need the computed `updatedOrders` value for `localStorage`, so calculating it first is easier to understand:

```tsx
const updatedOrders = orders.map(...);
```

---

## 12. Closures Are Not Bad

Closures are a normal and important JavaScript feature.

They allow React event handlers to access surrounding values such as:

```tsx
orderId
```

and:

```tsx
orders
```

The important questions are:

```text
which render created this function?
what state values existed in that render?
```

---

## Final Mental Model

```text
① React state is a snapshot for each render

② functions are created during renders

③ closures let those functions access
   values from the render environment

④ setState() does not directly rewrite
   the variables inside the current closure

⑤ the new state is used in a later render
```

A compact model:

```text
render creates snapshot
↓
closure remembers render environment
↓
setState()
↓
next render
↓
new snapshot
```

---

# 3. 한국어

## React State Snapshot과 Closure의 관계

다음 코드는 처음 보면 이상하게 느껴질 수 있다.

```tsx
setOrders(updatedOrders);

console.log(orders);
```

`setOrders(updatedOrders)`를 호출했는데도 `console.log(orders)`에서 이전 값이 보일 수 있다.

그 이유는 React state를 **각 render의 snapshot**처럼 이해할 수 있고, 이벤트 핸들러 같은 함수가 **closure**를 통해 자신이 만들어진 render의 값을 참조할 수 있기 때문이다.

**팁**

처음에는 다음 문장으로 기억하면 된다.

```text
render가 state의 한 장면을 만들고
↓
closure가 그 장면을 기억한다
```

---

## 1. Closure란 무엇인가

JavaScript에서 함수는 자신이 만들어졌을 당시의 주변 변수에 접근할 수 있다.

```tsx
function outer() {
  const message = "안녕";

  function inner() {
    console.log(message);
  }

  return inner;
}

const fn = outer();

fn();
```

결과:

```text
안녕
```

`outer()` 실행이 끝난 뒤에도 `inner()`는 `message`에 접근할 수 있다.

개념적으로:

```text
inner 함수
↓
자신이 만들어진 주변 환경을 기억
↓
message에 접근 가능
```

이것이 closure의 기본 개념이다.

**팁**

Closure를 어렵게 외우지 말고 **함수가 자신이 만들어진 환경의 변수에 계속 접근할 수 있는 성질**이라고 이해하면 된다.

---

## 2. React 컴포넌트도 함수다

예:

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    console.log(count);
  }

  return (
    <button onClick={handleClick}>
      {count}
    </button>
  );
}
```

첫 번째 render에서는:

```text
Render #1
count = 0
```

이다.

이 render 과정에서:

```tsx
function handleClick() {
  console.log(count);
}
```

도 만들어진다.

그래서 이 함수는 자신이 만들어진 render의 `count`에 접근할 수 있다.

```text
Render #1
────────────────

count = 0

handleClick #1
└── count = 0을 바라봄
```

---

## 3. 다음 Render에서는 새로운 State 값과 새로운 함수가 생긴다

예를 들어:

```tsx
setCount(1);
```

이후 새로운 render가 발생하면 개념적으로:

```text
Render #2
────────────────

count = 1

handleClick #2
└── count = 1을 바라봄
```

이라고 생각할 수 있다.

즉:

```text
Render #1
count = 0
handleClick #1

Render #2
count = 1
handleClick #2

Render #3
count = 2
handleClick #3
```

처럼 이해할 수 있다.

**팁**

React 컴포넌트 함수가 다시 실행되면 그 안에 선언된 이벤트 핸들러도 그 render에 맞게 다시 만들어진다고 생각하면 이해가 쉽다.

---

## 4. `setCount()` 직후 왜 이전 값이 보일까?

다음 코드를 보자.

```tsx
function handleClick() {
  console.log("before:", count);

  setCount(count + 1);

  console.log("after:", count);
}
```

현재 render에서:

```text
count = 0
```

이라고 하자.

첫 번째 로그는:

```text
before: 0
```

이다.

그다음:

```tsx
setCount(count + 1);
```

즉:

```tsx
setCount(1);
```

을 호출한다.

하지만 현재 실행 중인 함수는 Render #1에서 만들어진 `handleClick #1`이다.

이 함수가 바라보는 `count`는 아직:

```text
0
```

이다.

따라서 두 번째 로그도:

```text
after: 0
```

처럼 보일 수 있다.

그리고 다음 render에서:

```text
Render #2
count = 1
```

이 된다.

---

## 5. `setState()`는 현재 Closure 내부의 변수를 직접 바꾸지 않는다

개념적으로:

```text
현재 closure
→ count = 0

setCount(1)
→ React에 state update 요청

현재 closure
→ count = 0을 계속 봄

다음 render
→ count = 1
```

이라고 이해하면 된다.

**팁**

`setState()`를 현재 변수 값을 직접 덮어쓰는 일반 대입처럼 생각하지 말고, **다음 render에서 사용할 state를 React에 전달하는 과정**으로 이해하면 된다.

---

## 6. Day 9 주문 코드에도 그대로 적용된다

```tsx
function handleCancelOrder() {
  const updatedOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status: "취소완료",
        }
      : order
  );

  setOrders(updatedOrders);

  console.log(orders);
}
```

현재:

```text
Render #1

orders =
1001 결제완료
1002 결제완료
```

라고 하자.

그 render에서 만들어진 함수는:

```text
handleCancelOrder #1
└── Render #1의 orders를 바라봄
```

이라고 생각할 수 있다.

버튼 클릭:

```text
handleCancelOrder #1 실행
↓
orders.map()
↓
updatedOrders 생성
↓
1002 취소완료
↓
setOrders(updatedOrders)
```

하지만 현재 실행 중인 `handleCancelOrder #1`이 바라보는 `orders`는 Render #1의 snapshot이다.

다음 render에서:

```text
Render #2

orders =
1001 결제완료
1002 취소완료
```

가 된다.

---

## 7. Snapshot + Closure 그림

```text
Render #1
────────────────────────────

orders = [결제완료, 결제완료]

handleCancelOrder #1
        │
        └────→ Render #1의 orders를 바라봄


사용자 클릭
↓
updatedOrders
↓
[결제완료, 취소완료]
↓
setOrders(updatedOrders)


              React update
                   ↓


Render #2
────────────────────────────

orders = [결제완료, 취소완료]

handleCancelOrder #2
        │
        └────→ Render #2의 orders를 바라봄
```

---

## 8. 비동기 코드에서는 더 잘 보인다

예:

```tsx
function handleClick() {
  setTimeout(() => {
    console.log(count);
  }, 3000);
}
```

버튼 클릭 당시:

```text
count = 0
```

이었다고 하자.

그 뒤 3초 동안 `count`가 5가 되더라도, `setTimeout` callback이 Render #1에서 만들어졌다면 Render #1의 값을 참조할 수 있다.

```text
Render #1
count = 0
↓
callback 생성
↓
closure가 해당 render 환경을 기억
↓
3초 뒤 실행
↓
예전 count 값이 보일 수 있음
```

**팁**

`setTimeout`, Promise, event listener 등에서 state가 생각보다 오래된 값으로 보이면 closure와 함수가 만들어진 render를 확인해본다.

---

## 9. Stale State / Stale Closure

이전 render의 state를 closure가 계속 사용해서 최신 state와 차이가 생기는 상황을 흔히:

```text
stale state
stale closure
```

라고 표현한다.

`stale`은:

```text
오래된
최신이 아닌
```

정도로 이해하면 된다.

예:

```text
현재 최신 count = 5

오래된 callback이 보는 count = 0
```

---

## 10. 그래서 Functional Update가 중요하다

다음 코드:

```tsx
setCount(count + 1);
```

대신:

```tsx
setCount((prevCount) => prevCount + 1);
```

처럼 사용할 수 있다.

여기서:

```tsx
prevCount
```

는 React가 이전 state를 기반으로 다음 state를 계산할 수 있도록 전달해주는 값이다.

즉:

```text
현재 closure에 잡힌 count를 기준으로 계산
```

하는 대신:

```text
React가 제공하는 previous state를 기준으로 계산
```

하는 방식이다.

**팁**

다음 state가 이전 state에 의존한다면:

```tsx
setState((prev) => ...)
```

패턴을 떠올리면 좋다.

---

## 11. 주문 코드에서도 Functional Update를 사용할 수 있다

예:

```tsx
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status: "취소완료",
        }
      : order
  )
);
```

여기서:

```tsx
prevOrders
```

를 기준으로 다음 state를 만든다.

다만 현재 Day 9에서는 동일한 `updatedOrders`를 `localStorage`에도 저장해야 하므로:

```tsx
const updatedOrders = orders.map(...);
```

로 먼저 계산하는 방식이 학습 흐름상 더 이해하기 쉽다.

---

## 12. Closure 자체가 문제인 것은 아니다

Closure는 JavaScript의 정상적이고 중요한 기능이다.

React 이벤트 핸들러도 closure 덕분에:

```tsx
orderId
```

나:

```tsx
orders
```

같은 주변 값에 접근할 수 있다.

중요한 것은:

```text
이 함수는 어느 render에서 만들어졌는가?
그 render 당시 state는 무엇이었는가?
```

를 파악하는 것이다.

**팁**

Closure를 피하려고 하지 말고, 함수가 어떤 값을 capture하고 있는지 확인하는 습관을 들이면 된다.

---

## 최종 Mental Model

```text
① React state는 render마다 하나의 snapshot처럼 이해할 수 있다.

② 각 render에서 이벤트 핸들러 같은 함수가 만들어진다.

③ 그 함수는 closure를 통해
   자신이 만들어진 render의 state에 접근한다.

④ setState()는 현재 closure 안의 변수를 직접 수정하지 않는다.

⑤ 새로운 state는 다음 render에서 사용된다.
```

최종 흐름:

```text
render
↓
state snapshot
↓
함수 생성
↓
closure가 해당 render 환경에 접근
↓
setState()
↓
React update
↓
다음 render
↓
새로운 state snapshot
```

**팁**

React에서 state가 오래된 값처럼 보이면 아래 두 질문을 해보면 좋다.

```text
1. 이 함수는 어느 render에서 만들어졌지?
2. 그 render 당시 state 값은 뭐였지?
```
