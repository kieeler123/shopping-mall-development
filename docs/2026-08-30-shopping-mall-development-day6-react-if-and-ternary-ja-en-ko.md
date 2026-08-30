# React 조건부 렌더링: `if`, `&&`, 삼항연산자 (`? :`)

------------------------------------------------------------------------

# 日本語

## 1. 全体の考え方

React では `if`、`&&`、三項演算子 (`? :`) を条件によって使い分けます。

``` text
if
→ ロジックの流れを分岐したいとき

&&
→ 条件が true のときだけ UI を表示したいとき

? :
→ 条件によって A または B の UI を表示したいとき
```

> **ヒント**
>
> まずは次のように覚えましょう。
>
> **ロジックの分岐 → `if`**\
> **表示する / しない → `&&`**\
> **A / B のどちらか → 三項演算子**

## 2. `if` 文

基本形：

``` ts
if (condition) {
  // 実行するコード
}
```

例：

``` ts
const age = 20;

if (age >= 19) {
  console.log("Adult");
}
```

`else` を使うと、true / false の両方の処理を書けます。

``` ts
if (age >= 19) {
  console.log("Adult");
} else {
  console.log("Minor");
}
```

``` text
        age >= 19?
             │
       ┌─────┴─────┐
       │           │
      true        false
       │           │
       ▼           ▼
     Adult        Minor
```

> **ヒント**
>
> `if` は UI
> だけではなく、データ処理、バリデーション、関数の終了など、一般的なロジックの分岐に向いています。

## 3. React での `if` と early return

React でも `if` はよく使います。

``` tsx
if (!order) {
  return <p>注文情報がありません。</p>;
}

return (
  <main>
    <h1>注文完了</h1>
    <p>注文番号: {order.id}</p>
  </main>
);
```

条件を満たした時点で早く `return` して処理を終了する方法を early return
と呼びます。

``` text
order がない?
   │
   ├── Yes → 案内 UI を return → 終了
   │
   └── No
        ↓
     続行
        ↓
     注文 UI を return
```

> **ヒント**
>
> 条件が複雑になったり、三項演算子が長くなったりした場合は、`if + return`
> の方が読みやすいことがあります。

## 4. `&&` による条件付きレンダリング

``` tsx
{order && (
  <section>
    <p>注文番号: {order.id}</p>
    <p>名前: {order.name}</p>
  </section>
)}
```

意味：

``` text
order がある
→ section を表示

order がない
→ 何も表示しない
```

`A && B` は、A が truthy の場合に B
が評価されるという性質を利用しています。

> **ヒント**
>
> 「この条件のときだけ、この UI を表示したい」という要求なら `&&`
> がシンプルです。

## 5. 三項演算子 `? :`

基本形：

``` ts
condition ? valueA : valueB
```

React では：

``` tsx
{order ? (
  <p>注文があります。</p>
) : (
  <p>注文がありません。</p>
)}
```

意味：

``` text
        order?
          │
     ┌────┴────┐
     │         │
    true      false
     │         │
     ▼         ▼
   UI A       UI B
```

> **ヒント**
>
> 「条件が true なら A、そうでなければ
> B」と言える場合は、三項演算子が自然です。

## 6. JSX の中で `if` を直接使わない理由

次のような書き方はできません。

``` tsx
return (
  <main>
    {
      if (order) {
        <p>{order.name}</p>
      }
    }
  </main>
);
```

JSX の `{}` の中では、値として評価できる expression（式）が必要です。

`&&` は expression として使えます。

``` tsx
{order && <p>{order.name}</p>}
```

三項演算子も expression です。

``` tsx
{order ? <p>{order.name}</p> : <p>なし</p>}
```

一方、`if` は
statement（文）なので、この位置に直接置くことはできません。

> **ヒント**
>
> 最初は「JSX の `{}` の中では `&&` や三項演算子をよく使い、`if` は JSX
> の外側で使う」と覚えておけば十分です。

## 7. 3つの方法を比較

### `&&`

``` tsx
{order && <OrderInfo />}
```

``` text
注文あり → OrderInfo
注文なし → 何も表示しない
```

### 三項演算子

``` tsx
{order ? <OrderInfo /> : <EmptyOrder />}
```

``` text
注文あり → OrderInfo
注文なし → EmptyOrder
```

### `if`

``` tsx
if (!order) {
  return <EmptyOrder />;
}

return <OrderInfo />;
```

レンダリング関数の流れ自体を分岐します。

  基準                      `if`   `&&`               三項演算子 `? :`
  ------------------------- ------ ------------------ ------------------
  一般的なロジック分岐      ◎      不向き             簡単な場合は可能
  JSX 内で直接使用          ×      ◎                  ◎
  true のときだけ UI 表示   可能   ◎                  可能
  true / false で別 UI      ◎      不向き             ◎
  early return              ◎      ×                  ×
  複雑な条件                ◎      複雑になりやすい   複雑になりやすい

> **ヒント**
>
> 三項演算子を何重にもネストして読みにくくなった場合は、`if`
> や別コンポーネントへの分離を検討しましょう。

## 8. ショッピングモール Day 6 への適用

ロジックを止めたり分岐したりする場合：

``` ts
if (!savedOrders) {
  return;
}
```

注文があるときだけ表示：

``` tsx
{order && (
  <section>...</section>
)}
```

注文がある場合とない場合で別の UI：

``` tsx
{order ? (
  <OrderInfo />
) : (
  <p>注文情報がありません。</p>
)}
```

> **ヒント**
>
> 文法を先に選ばず、要件を自然言語で考えましょう。
>
> 「データがなければ終了」→ `if`\
> 「あるときだけ表示」→ `&&`\
> 「あれば A、なければ B」→ `? :`

------------------------------------------------------------------------

# English

## 1. Overall idea

In React, `if`, `&&`, and the ternary operator (`? :`) are useful for
different kinds of conditional logic.

``` text
if
→ Branch program logic

&&
→ Render UI only when a condition is true

? :
→ Render either UI A or UI B depending on a condition
```

> **Tip**
>
> A simple rule:
>
> **Logic branch → `if`**\
> **Show or hide → `&&`**\
> **Choose A or B → ternary operator**

## 2. The `if` statement

Basic syntax:

``` ts
if (condition) {
  // code to execute
}
```

Example:

``` ts
const age = 20;

if (age >= 19) {
  console.log("Adult");
}
```

With `else`:

``` ts
if (age >= 19) {
  console.log("Adult");
} else {
  console.log("Minor");
}
```

``` text
        age >= 19?
             │
       ┌─────┴─────┐
       │           │
      true        false
       │           │
       ▼           ▼
     Adult        Minor
```

> **Tip**
>
> `if` is a general-purpose control-flow tool. It works well for data
> processing, validation, early exits, and complex logic---not only UI.

## 3. `if` and early return in React

React components commonly use `if` before returning JSX.

``` tsx
if (!order) {
  return <p>No order information.</p>;
}

return (
  <main>
    <h1>Order Complete</h1>
    <p>Order ID: {order.id}</p>
  </main>
);
```

Returning early when a condition is met is commonly called an early
return.

``` text
No order?
   │
   ├── Yes → return empty-state UI → stop
   │
   └── No
        ↓
     continue
        ↓
     return order UI
```

> **Tip**
>
> If conditional JSX becomes large or nested, `if + return` can be
> easier to read than a long ternary expression.

## 4. Conditional rendering with `&&`

``` tsx
{order && (
  <section>
    <p>Order ID: {order.id}</p>
    <p>Name: {order.name}</p>
  </section>
)}
```

Meaning:

``` text
order exists
→ render section

order does not exist
→ render nothing
```

This uses the behavior of `A && B`: when A is truthy, B is evaluated.

> **Tip**
>
> Use `&&` when the requirement sounds like: "Only show this UI when
> this condition is true."

## 5. The ternary operator `? :`

Basic syntax:

``` ts
condition ? valueA : valueB
```

In React:

``` tsx
{order ? (
  <p>An order exists.</p>
) : (
  <p>No order exists.</p>
)}
```

Conceptually:

``` text
        order?
          │
     ┌────┴────┐
     │         │
    true      false
     │         │
     ▼         ▼
    UI A      UI B
```

> **Tip**
>
> If you can describe the requirement as "If true, show A; otherwise,
> show B," the ternary operator is a natural choice.

## 6. Why `if` is not written directly inside JSX braces

This does not work:

``` tsx
return (
  <main>
    {
      if (order) {
        <p>{order.name}</p>
      }
    }
  </main>
);
```

Inside JSX `{}`, React expects an expression that produces a value.

`&&` can be used as an expression:

``` tsx
{order && <p>{order.name}</p>}
```

A ternary is also an expression:

``` tsx
{order ? <p>{order.name}</p> : <p>None</p>}
```

`if`, however, is a statement, so it cannot be inserted directly in that
position.

> **Tip**
>
> A practical beginner rule is: use `&&` or a ternary inside JSX braces,
> and use `if` outside the JSX when controlling the component's flow.

## 7. Comparing all three

### `&&`

``` tsx
{order && <OrderInfo />}
```

``` text
Order exists → OrderInfo
No order     → nothing
```

### Ternary

``` tsx
{order ? <OrderInfo /> : <EmptyOrder />}
```

``` text
Order exists → OrderInfo
No order     → EmptyOrder
```

### `if`

``` tsx
if (!order) {
  return <EmptyOrder />;
}

return <OrderInfo />;
```

This branches the rendering flow itself.

  -----------------------------------------------------------------------
  Use case          `if`              `&&`              Ternary `? :`
  ----------------- ----------------- ----------------- -----------------
  General logic     Excellent         Poor fit          Fine for simple
  branching                                             cases

  Directly inside   No                Yes               Yes
  JSX                                                   

  Render only when  Possible          Excellent         Possible
  true                                                  

  Render different  Excellent         Poor fit          Excellent
  true/false UI                                         

  Early return      Excellent         No                No

  Complex           Good              Can become messy  Can become messy
  conditions                                            
  -----------------------------------------------------------------------

> **Tip**
>
> Avoid deeply nested ternaries. When the condition becomes difficult to
> read, consider `if`, early returns, or extracting a component.

## 8. Applying this to Shopping Mall Day 6

For stopping or branching logic:

``` ts
if (!savedOrders) {
  return;
}
```

For rendering only when an order exists:

``` tsx
{order && (
  <section>...</section>
)}
```

For showing different UI depending on whether an order exists:

``` tsx
{order ? (
  <OrderInfo />
) : (
  <p>No order information.</p>
)}
```

> **Tip**
>
> Start from the requirement instead of the syntax:
>
> "Stop if there is no data" → `if`\
> "Show only when it exists" → `&&`\
> "Show A if it exists, otherwise B" → `? :`

------------------------------------------------------------------------

# 한국어

## 1. 전체 개념

React에서는 `if`, `&&`, 삼항연산자(`? :`)를 조건의 목적에 따라 구분해서
사용할 수 있습니다.

``` text
if
→ 로직의 흐름을 나누고 싶을 때

&&
→ 조건이 참일 때만 UI를 보여주고 싶을 때

? :
→ 조건에 따라 A 또는 B UI를 보여주고 싶을 때
```

> **팁**
>
> 먼저 다음 기준으로 기억하세요.
>
> **로직 분기 → `if`**\
> **보일까 말까 → `&&`**\
> **A일까 B일까 → 삼항연산자**

## 2. `if`문

기본 문법:

``` ts
if (조건) {
  // 실행할 코드
}
```

예:

``` ts
const age = 20;

if (age >= 19) {
  console.log("성인입니다.");
}
```

`else`를 사용하면 참과 거짓의 두 방향을 처리할 수 있습니다.

``` ts
if (age >= 19) {
  console.log("성인입니다.");
} else {
  console.log("미성년자입니다.");
}
```

``` text
        age >= 19?
             │
       ┌─────┴─────┐
       │           │
      true        false
       │           │
       ▼           ▼
     성인        미성년자
```

> **팁**
>
> `if`는 UI뿐 아니라 데이터 처리, 유효성 검사, 함수 종료 등 일반적인
> 로직 분기에 적합합니다.

## 3. React에서 `if`와 early return

React에서도 `if`를 매우 자주 사용합니다.

``` tsx
if (!order) {
  return <p>주문 정보가 없습니다.</p>;
}

return (
  <main>
    <h1>주문 완료</h1>
    <p>주문번호: {order.id}</p>
  </main>
);
```

조건을 확인한 뒤 함수의 앞부분에서 바로 `return`하는 방식을 early
return이라고 합니다.

``` text
order 없음?
   │
   ├── Yes → 안내 UI return → 종료
   │
   └── No
        ↓
     계속 진행
        ↓
     주문 UI return
```

> **팁**
>
> 조건부 JSX가 너무 커지거나 삼항연산자가 복잡해지면 `if + return`
> 방식이 더 읽기 쉬울 수 있습니다.

## 4. `&&` 조건부 렌더링

``` tsx
{order && (
  <section>
    <p>주문번호: {order.id}</p>
    <p>이름: {order.name}</p>
  </section>
)}
```

의미:

``` text
order 있음
→ section 출력

order 없음
→ 아무것도 출력하지 않음
```

`A && B`에서 A가 truthy이면 B까지 평가되는 성질을 활용합니다.

> **팁**
>
> 요구사항이 "이 조건일 때만 이 UI를 보여줘"라면 `&&`가 간단하고
> 자연스럽습니다.

## 5. 삼항연산자 `? :`

기본 문법:

``` ts
조건 ? 참일_때 : 거짓일_때
```

React에서는:

``` tsx
{order ? (
  <p>주문이 있습니다.</p>
) : (
  <p>주문이 없습니다.</p>
)}
```

흐름:

``` text
        order?
          │
     ┌────┴────┐
     │         │
    true      false
     │         │
     ▼         ▼
    UI A      UI B
```

> **팁**
>
> "조건이 참이면 A, 아니면 B"라고 표현할 수 있다면 삼항연산자를
> 생각해보세요.

## 6. JSX 안에서 `if`를 직접 사용하지 않는 이유

다음처럼 작성할 수는 없습니다.

``` tsx
return (
  <main>
    {
      if (order) {
        <p>{order.name}</p>
      }
    }
  </main>
);
```

JSX의 `{}` 안에서는 값으로 평가될 수 있는 expression(표현식)이
필요합니다.

`&&`는 표현식으로 사용할 수 있습니다.

``` tsx
{order && <p>{order.name}</p>}
```

삼항연산자도 표현식입니다.

``` tsx
{order ? <p>{order.name}</p> : <p>없음</p>}
```

하지만 `if`는 statement(문)이므로 이 위치에 직접 넣을 수 없습니다.

> **팁**
>
> 처음에는 "JSX `{}` 안에서는 `&&`와 삼항연산자를 자주 사용하고, `if`는
> JSX 바깥에서 사용한다"고 기억하면 충분합니다.

## 7. 세 가지 방식 비교

### `&&`

``` tsx
{order && <OrderInfo />}
```

``` text
주문 있음 → OrderInfo
주문 없음 → 아무것도 출력하지 않음
```

### 삼항연산자

``` tsx
{order ? <OrderInfo /> : <EmptyOrder />}
```

``` text
주문 있음 → OrderInfo
주문 없음 → EmptyOrder
```

### `if`

``` tsx
if (!order) {
  return <EmptyOrder />;
}

return <OrderInfo />;
```

렌더링 함수의 흐름 자체를 분기합니다.

  기준                   `if`        `&&`               삼항연산자 `? :`
  ---------------------- ----------- ------------------ ------------------
  일반 로직 분기         매우 좋음   부적합             간단한 경우 가능
  JSX 안에서 직접 사용   X           좋음               좋음
  참일 때만 UI 표시      가능        가장 간단          가능
  참/거짓 각각 다른 UI   좋음        부적합             좋음
  early return           좋음        X                  X
  복잡한 조건            좋음        복잡해질 수 있음   복잡해질 수 있음

> **팁**
>
> 삼항연산자를 여러 겹 중첩해서 읽기 어려워지면 `if`, early return, 또는
> 컴포넌트 분리를 고려하세요.

## 8. 쇼핑몰 Day 6에 적용

로직을 중단하거나 분기할 때:

``` ts
if (!savedOrders) {
  return;
}
```

주문이 있을 때만 UI를 보여줄 때:

``` tsx
{order && (
  <section>...</section>
)}
```

주문이 있을 때와 없을 때 서로 다른 UI를 보여줄 때:

``` tsx
{order ? (
  <OrderInfo />
) : (
  <p>주문 정보가 없습니다.</p>
)}
```

> **팁**
>
> 문법을 먼저 선택하지 말고 요구사항을 한국어로 바꿔보세요.
>
> **데이터가 없으면 종료 → `if`**\
> **있을 때만 보여줘 → `&&`**\
> **있으면 A, 없으면 B → `? :`**

## 9. 핵심 공식

``` text
if
└─ 로직을 분기한다

&&
└─ 조건이 맞을 때만 보여준다

? :
└─ 조건에 따라 둘 중 하나를 보여준다
```

> **팁**
>
> React에서 조건문을 만났을 때 문법 이름부터 생각하지 말고 "지금 코드가
> 로직을 분기하는가, UI를 숨기고 보여주는가, 두 UI 중 하나를
> 선택하는가?"를 먼저 판단하세요.
