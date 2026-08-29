# Day 5 Theory Notes — Why `"use client"` Is Needed in Next.js

---

# 日本語

## 1. 今回のテーマ

Next.js App Router で、なぜファイルの先頭に次のコードを書くことがあるのかを詳しく理解する。

```tsx
"use client";
```

今回の checkout ページでは、たとえば次の機能を使う。

```tsx
useState()
useEffect()
localStorage
onChange
onClick
```

これらを理解するには、まず Next.js が **Server Component** と **Client Component** を区別していることを知る必要がある。

> **Tip**
>
> `"use client"` を「React を使うための呪文」として暗記しない。「このコンポーネントのどこからクライアント側の機能が必要になるのか」を考える。

---

## 2. `"use client"` は何を意味するのか

Next.js App Router では、`app` 配下のコンポーネントは基本的に Server Component として扱われる。

そこでファイル先頭に、

```tsx
"use client";
```

を書くと、そのファイルが **Client Component の境界** になる。

つまり Next.js に概念的に、

```text
このファイルから下では
クライアント側で必要な React 機能を使います
```

と伝える役割を持つ。

> **Tip**
>
> `"use client"` は「ファイル全体を単純にブラウザだけで動かす」という一言だけで理解するより、**Server/Client の境界を宣言するもの**と理解する方が正確である。

---

## 3. Server Component とは

Server Component はサーバー側の環境を活用して UI を構成できる React コンポーネントである。

App Router では、特にクライアント機能が必要でなければ Server Component のまま使える。

概念的には、

```text
Next.js
↓
サーバー側でコンポーネント処理
↓
結果をクライアントへ
```

という世界である。

Server Component ではブラウザ固有の API を直接使うことはできない。

たとえば、

```tsx
localStorage
window
document
```

はブラウザに存在するものなので、サーバー環境には存在しない。

> **Tip**
>
> 「Server Component が悪い」「Client Component の方が高機能」と考えない。それぞれ役割が違う。

---

## 4. Client Component とは

Client Component は、ブラウザで必要になるインタラクティブな React 機能を使用できるコンポーネントである。

代表例：

```text
useState
useEffect
onClick
onChange
ブラウザ API
```

たとえば Day 5 の名前入力は、

```tsx
const [name, setName] = useState("");

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

となる。

ここではユーザーの入力イベントと state 更新が必要である。

そのため Client Component が必要になる。

> **Tip**
>
> ユーザー操作によって state が変わる UI を見たら Client Component が必要かを考える。

---

# 5. 今回 `"use client"` が必要になる第一の理由 — useState

checkout では cart データを state に入れたい。

```tsx
const [cart, setCart] = useState([]);
```

また、後で配送先情報も state にする。

```tsx
const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
```

`useState` は Client Component で使用する React Hook である。

したがって、このような stateful な対話処理を行うファイルには Client Component の境界が必要になる。

```tsx
"use client";

import { useState } from "react";
```

> **Tip**
>
> `useState` が登場したら `"use client"` が必要か確認する習慣をつける。

---

# 6. 第二の理由 — useEffect

今回の checkout では、

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");
}, []);
```

のような処理を使う。

`useEffect` も Client Component で使用する Hook である。

effect はコンポーネントがクライアント側でレンダリングされた後の処理などに使われる。

今回なら、

```text
CheckoutPage
↓
クライアント側で表示
↓
useEffect
↓
localStorage 読み込み
```

という流れになる。

> **Tip**
>
> `useEffect` を使うファイルでも Client Component の境界が必要になる。

---

# 7. 第三の理由 — localStorage

`localStorage` は React の機能ではない。

これは **Web Browser API** である。

つまり、

```text
Chrome / Safari / Edge など
↓
localStorage が存在
```

する一方、

```text
Node.js / サーバー環境
↓
ブラウザの localStorage は存在しない
```

という違いがある。

そのためサーバー側の処理中に、

```tsx
localStorage.getItem("cart");
```

を実行しようとすると、`localStorage` が存在しないという問題になる。

今回 `useEffect` の中で読み込む理由の一つも、ブラウザ側で読み込み処理を行うためである。

> **Tip**
>
> `localStorage` を「Next.js の保存機能」と思わない。**ブラウザが提供する API** である。

---

# 8. `"use client"` を書けば localStorage をどこでも安全に読めるのか

ここは重要である。

```tsx
"use client";
```

を書いたからといって、

```tsx
const cart = localStorage.getItem("cart");
```

をコンポーネントのあらゆる場所で無条件に書けばよい、という意味ではない。

今回のような初期読み込みでは、

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");
}, []);
```

のようにブラウザ側で effect が実行されるタイミングに読むパターンが分かりやすく安全である。

つまり役割は別々である。

```text
"use client"
→ Client Component の境界を作る

useEffect
→ ブラウザ側でレンダリング後に処理を実行

localStorage
→ その処理の中でブラウザ保存領域を読む
```

> **Tip**
>
> `"use client"` と `useEffect` を同じ役割だと思わない。それぞれ別の問題を解決している。

---

# 9. 第四の理由 — onClick / onChange のようなイベント

ユーザーがクリックしたり文字を入力したりする UI はイベント処理を必要とする。

```tsx
<button onClick={handleClick}>
  +
</button>
```

または、

```tsx
<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

である。

このようなイベントハンドラはブラウザ上でユーザー操作に反応する。

```text
ユーザー操作
↓
ブラウザでイベント発生
↓
onClick / onChange
↓
JavaScript 処理
↓
state 更新
```

したがって、これらを定義する対話的なコンポーネントは Client Component になる。

> **Tip**
>
> `onClick`, `onChange`, `onSubmit` などが出てきたら「ユーザーとのインタラクションが必要」と判断する。

---

# 10. checkout ページでは複数の理由が重なっている

今回の `/checkout` では Client Component が必要になる理由が一つだけではない。

```text
useState
→ cart / name / phone / address の state

useEffect
→ 初回の cart 読み込み

localStorage
→ ブラウザに保存された cart を取得

onChange
→ 配送先フォーム入力

将来の onSubmit / onClick
→ 注文処理
```

つまり checkout はかなり明確にクライアント側インタラクションを必要とするページである。

そのため、

```tsx
"use client";
```

を使う理由がある。

> **Tip**
>
> 一つの機能だけでなく、そのコンポーネント全体でどんなブラウザ側インタラクションが必要かを見る。

---

# 11. `"use client"` はどこに書くのか

ファイルの先頭に書く。

```tsx
"use client";

import { useEffect, useState } from "react";
```

基本的に import より前に置く。

```tsx
"use client";

import ...
```

という形を覚える。

> **Tip**
>
> Client Component にする場合は、ファイルを作った段階で先頭に配置すると見落としにくい。

---

# 12. すべてのファイルに `"use client"` を書けばよいのか

そうではない。

これは非常に重要である。

```text
"use client" が必要なところ
→ Client Component

必要ないところ
→ Server Component のまま
```

と考える。

たとえば、ユーザー操作も state もブラウザ API も必要ない単純な表示コンポーネントなら、必ずしも `"use client"` は必要ない。

つまり、

```tsx
export default function AboutPage() {
  return <h1>About</h1>;
}
```

のようなページに理由なく付ける必要はない。

> **Tip**
>
> `"use client"` は「とりあえず全部につける設定」ではなく、クライアント機能が必要な境界に付ける。

---

# 13. なぜ必要な範囲だけ Client Component にするのか

Next.js は Server Component と Client Component を分けることで、ブラウザへ送る JavaScript を必要な範囲に抑える設計ができる。

概念的には、

```text
ページ全体
├─ サーバーだけで十分な部分
│   → Server Component
│
└─ ユーザー操作が必要な部分
    → Client Component
```

と分けることができる。

大きなページ全体を何でも Client Component にするより、必要な部分だけ Client Component にする考え方が重要になる。

> **Tip**
>
> 将来的には「ページ全部を client にするか」ではなく「どの部分から client の境界を作るか」を考えられるようになるとよい。

---

# 14. 今回のコードを分解する

```tsx
"use client";

import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  return (
    <main>
      <h1>注文書</h1>
    </main>
  );
}
```

一行ずつ役割を見る。

```tsx
"use client";
```

```text
このファイルを Client Component 境界にする
```

```tsx
useState
```

```text
cart state を管理する
```

```tsx
useEffect
```

```text
初期表示後に読み込み処理を行う
```

```tsx
localStorage.getItem("cart")
```

```text
ブラウザ保存領域から cart を読む
```

```tsx
setCart(...)
```

```text
state を更新して再レンダリングする
```

> **Tip**
>
> `"use client"` 一行だけを見るのではなく、その下にある `useState`, `useEffect`, `localStorage` とセットで「なぜ client なのか」を説明する。

---

# 15. 最終データフロー

```text
/checkout を開く
↓
CheckoutPage は Client Component
↓
最初の render
↓
useEffect 実行
↓
ブラウザの localStorage にアクセス
↓
cart 文字列取得
↓
JSON.parse()
↓
setCart()
↓
state 更新
↓
再レンダリング
↓
注文商品を表示
```

> **Tip**
>
> この流れの中で `"use client"` は「クライアント側 React 機能を使える境界を作る」、`useEffect` は「いつ処理するか」、`localStorage` は「どこからデータを読むか」を担当する。

---

# 16. 核心まとめ

```text
"use client"
→ Client Component の境界を宣言

useState
→ クライアント側 state / インタラクション

useEffect
→ クライアント側 effect

onClick / onChange
→ ブラウザで発生するユーザーイベント

localStorage
→ ブラウザ API
```

今回の checkout はこれらを使うため Client Component が必要になる。

最も大切なのは、

> **`"use client"` は単なるエラー回避コードではなく、Server Component と Client Component の境界を Next.js に伝える宣言である。**

という理解である。

> **Tip**
>
> `"use client"` を見たら「この下で、どのクライアント機能が必要だから付いているのか？」を探す習慣をつける。

---

# English

## 1. Topic

This note explains in detail why a Next.js App Router file may begin with:

```tsx
"use client";
```

Our checkout page needs features such as:

```tsx
useState()
useEffect()
localStorage
onChange
onClick
```

To understand why `"use client"` is needed, we first need to understand the distinction between **Server Components** and **Client Components**.

> **Tip**
>
> Do not memorize `"use client"` as a magic line required for React. Ask which client-side capability makes the boundary necessary.

---

## 2. What Does `"use client"` Mean?

In the Next.js App Router, components under `app` are Server Components by default.

Placing:

```tsx
"use client";
```

at the top of a file establishes a **Client Component boundary**.

Conceptually, it tells Next.js:

```text
from this module boundary,
client-side React capabilities are needed
```

> **Tip**
>
> A more accurate mental model is “declare a server/client boundary,” rather than simply “make everything run only in the browser.”

---

## 3. What Is a Server Component?

A Server Component can use the server environment to build UI without requiring client-side interactivity for that component.

Conceptually:

```text
Next.js
↓
process component using the server environment
↓
send the result toward the client
```

Browser-only APIs are not available in the server environment.

Examples include:

```tsx
localStorage
window
document
```

> **Tip**
>
> Do not think Server Components are inferior to Client Components. They solve different problems.

---

## 4. What Is a Client Component?

A Client Component is needed when a component uses interactive React features that operate on the client.

Typical examples:

```text
useState
useEffect
onClick
onChange
browser APIs
```

For example:

```tsx
const [name, setName] = useState("");

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

requires state and user input handling.

> **Tip**
>
> When the UI must react to user interaction and update state, consider whether a Client Component is required.

---

# 5. Reason 1 — useState

The checkout page stores cart data in state:

```tsx
const [cart, setCart] = useState([]);
```

Later it may also contain:

```tsx
const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
```

`useState` is a React Hook used in Client Components.

Therefore the module needs a Client Component boundary.

```tsx
"use client";

import { useState } from "react";
```

> **Tip**
>
> When you add `useState`, check whether the component is already inside a Client Component boundary.

---

# 6. Reason 2 — useEffect

The checkout page may load cart data with:

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");
}, []);
```

`useEffect` is also a Client Component Hook.

Conceptually:

```text
CheckoutPage
↓
client rendering
↓
useEffect
↓
read localStorage
```

> **Tip**
>
> `useEffect` is another strong signal that client-side behavior is required.

---

# 7. Reason 3 — localStorage

`localStorage` is not a React feature. It is a **browser Web API**.

It exists in browsers such as:

```text
Chrome
Safari
Edge
```

but the server environment does not have the browser's `localStorage`.

Therefore:

```tsx
localStorage.getItem("cart");
```

must be executed in an appropriate browser-side context.

> **Tip**
>
> Remember: localStorage belongs to the browser, not to Next.js itself.

---

# 8. Does `"use client"` Make Every localStorage Access Automatically Safe?

No.

Writing:

```tsx
"use client";
```

does not mean that you should access browser APIs anywhere without considering execution timing.

For initial cart loading, a clear pattern is:

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");
}, []);
```

The responsibilities are different:

```text
"use client"
→ creates the Client Component boundary

useEffect
→ controls when the side effect runs

localStorage
→ provides the browser-stored data
```

> **Tip**
>
> Do not treat `"use client"` and `useEffect` as interchangeable. They solve different problems.

---

# 9. Reason 4 — Event Handlers

Interactive UI often needs browser events.

```tsx
<button onClick={handleClick}>
  +
</button>
```

or:

```tsx
<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

The flow is:

```text
user interaction
↓
browser event
↓
onClick / onChange
↓
JavaScript logic
↓
state update
```

Such interactive event handlers belong in client-side interactive components.

> **Tip**
>
> `onClick`, `onChange`, and `onSubmit` are useful clues that the component needs client-side interactivity.

---

# 10. The Checkout Page Has Several Reasons

The checkout page does not need client behavior for only one reason.

```text
useState
→ cart, name, phone, address state

useEffect
→ initial cart loading

localStorage
→ read browser-stored cart

onChange
→ shipping form inputs

future onSubmit / onClick
→ order processing
```

This makes checkout a clear example of a component that needs client-side interactivity.

> **Tip**
>
> Look at the component as a whole and identify all the browser-side interactions it requires.

---

# 11. Where Should `"use client"` Be Written?

At the top of the module, before imports:

```tsx
"use client";

import { useEffect, useState } from "react";
```

> **Tip**
>
> If a file needs to be a Client Component entry point, place the directive immediately at the top so its purpose is obvious.

---

# 12. Should Every File Use `"use client"`?

No.

A component that does not require client-side hooks, browser APIs, or interactive event handlers may remain a Server Component.

For example:

```tsx
export default function AboutPage() {
  return <h1>About</h1>;
}
```

does not automatically need `"use client"`.

> **Tip**
>
> Do not add `"use client"` everywhere “just in case.” Add a client boundary where client capabilities are actually needed.

---

# 13. Why Keep the Client Boundary Limited?

Next.js allows an application to combine Server Components and Client Components.

Conceptually:

```text
page
├─ server-only/non-interactive area
│  → Server Component
│
└─ interactive area
   → Client Component
```

Keeping client boundaries focused can avoid unnecessarily making larger parts of the component tree part of the client bundle.

> **Tip**
>
> As you advance, ask not only “Does this page need client code?” but “What is the smallest useful client boundary?”

---

# 14. Breaking Down the Checkout Code

```tsx
"use client";

import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  return (
    <main>
      <h1>Checkout</h1>
    </main>
  );
}
```

Meaning:

```text
"use client"
→ declare Client Component boundary

useState
→ hold cart state

useEffect
→ run initial loading effect

localStorage.getItem()
→ read browser storage

setCart()
→ update state and trigger re-render
```

> **Tip**
>
> Explain `"use client"` together with the client features below it. That makes the reason concrete instead of abstract.

---

# 15. Full Data Flow

```text
open /checkout
↓
CheckoutPage is inside a Client Component boundary
↓
initial render
↓
useEffect runs
↓
access browser localStorage
↓
read cart string
↓
JSON.parse()
↓
setCart()
↓
state update
↓
re-render
↓
display order items
```

> **Tip**
>
> Separate the responsibilities: `"use client"` defines the boundary, `useEffect` controls the effect timing, and `localStorage` is the browser data source.

---

# 16. Core Summary

```text
"use client"
→ declares a Client Component boundary

useState
→ client-side state/interactivity

useEffect
→ client-side effect

onClick / onChange
→ user events in the browser

localStorage
→ browser API
```

The checkout page needs these capabilities, so a Client Component boundary is appropriate.

The most important idea is:

> **`"use client"` is not merely an error-fixing line. It declares a boundary between server-oriented and client-interactive component code in Next.js.**

> **Tip**
>
> Whenever you see `"use client"`, ask which client-side feature below it makes the directive necessary.

---

# 한국어

## 1. 이번 이론의 핵심

Next.js App Router를 사용하다 보면 파일 맨 위에 다음 코드를 작성하는 경우가 있다.

```tsx
"use client";
```

현재 우리가 만드는 `/checkout`에서는 앞으로 다음 기능을 사용한다.

```tsx
useState()
useEffect()
localStorage
onChange
onClick
```

그렇다면 왜 이런 기능을 사용할 때 `"use client"`가 필요할까?

이걸 제대로 이해하려면 먼저 Next.js의:

```text
Server Component
Client Component
```

구분을 알아야 한다.

> **팁**
>
> `"use client"`를 **React를 쓰기 위한 주문**처럼 외우지 않는다. **이 컴포넌트에 어떤 클라이언트 기능이 필요해서 경계를 선언하는가?**를 생각한다.

---

## 2. `"use client"`의 정확한 역할

Next.js App Router에서는 `app` 아래의 컴포넌트가 기본적으로 Server Component다.

그런데 파일 맨 위에:

```tsx
"use client";
```

를 작성하면 해당 파일이 **Client Component 경계(boundary)** 가 된다.

개념적으로 Next.js에게:

```text
이 파일부터는
클라이언트에서 필요한 React 기능을 사용하겠습니다.
```

라고 알려주는 것이다.

여기서 중요한 표현이 **경계**다.

단순히:

```text
"use client"
= 이 파일을 브라우저에서만 실행
```

이라고만 외우면 실제 Next.js 동작을 지나치게 단순화하게 된다.

더 좋은 이해는:

```text
Server Component 영역
        ↓
"use client" 경계
        ↓
Client Component로 사용할 모듈 영역
```

이다.

> **팁**
>
> `"use client"`를 **서버 영역과 클라이언트 상호작용 영역을 나누는 표시**라고 생각하면 이후 Next.js 구조를 이해하기 쉬워진다.

---

# 3. Server Component란?

Server Component는 서버 환경을 활용해서 UI를 구성할 수 있는 React 컴포넌트다.

App Router에서는 특별히 클라이언트 기능이 필요하지 않으면 Server Component로 둘 수 있다.

개념적으로:

```text
Next.js
↓
서버 환경에서 컴포넌트 처리
↓
결과를 클라이언트 쪽으로 전달
```

하는 영역이다.

그런데 서버에는 브라우저가 없다.

따라서 브라우저 전용 API인:

```tsx
localStorage
window
document
```

등을 서버 환경에서 그대로 사용할 수 없다.

> **팁**
>
> Server Component를 **기능이 부족한 컴포넌트**라고 생각하면 안 된다. 서버에서 처리하는 데 적합한 역할과 클라이언트에서 처리하는 데 적합한 역할이 다를 뿐이다.

---

# 4. Client Component란?

Client Component는 브라우저에서 사용자와 상호작용해야 하는 React 기능을 사용할 수 있는 컴포넌트다.

대표적으로:

```text
useState
useEffect
onClick
onChange
브라우저 API
```

같은 것들이 관련된다.

예를 들어 우리가 배운 Controlled Component:

```tsx
const [name, setName] = useState("");

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

를 생각해보자.

사용자가 키보드로 입력한다.

```text
사용자 입력
↓
onChange
↓
e.target.value
↓
setName()
↓
state 변경
↓
재렌더링
```

이건 명백히 브라우저에서 사용자와 상호작용하는 기능이다.

그래서 Client Component가 필요하다.

> **팁**
>
> **사용자 행동 → 이벤트 → state 변경 → 화면 변경** 구조가 보이면 Client Component가 필요한지 확인한다.

---

# 5. checkout에서 `"use client"`가 필요한 이유 1 — useState

checkout에서는 cart 데이터를 React state에 넣을 예정이다.

```tsx
const [cart, setCart] = useState([]);
```

그리고 이후에는 이름, 연락처, 주소도 state로 관리한다.

```tsx
const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
```

`useState`는 Client Component에서 사용하는 React Hook이다.

그래서 해당 컴포넌트에서 직접 `useState`를 사용하려면 Client Component 경계가 필요하다.

```tsx
"use client";

import { useState } from "react";
```

> **팁**
>
> 코드에 `useState`를 추가했는데 Next.js에서 Client Component 관련 오류가 발생한다면 `"use client"` 경계를 먼저 확인한다.

---

# 6. 이유 2 — useEffect

이번 checkout에서는 localStorage의 cart를 처음 불러오기 위해:

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");
}, []);
```

를 사용한다.

`useEffect` 역시 Client Component에서 사용하는 Hook이다.

흐름은:

```text
CheckoutPage
↓
클라이언트 쪽에서 렌더링/마운트
↓
useEffect 실행
↓
localStorage 읽기
```

가 된다.

따라서 `useEffect`를 직접 사용하는 checkout 컴포넌트에도 Client Component 경계가 필요하다.

> **팁**
>
> `useEffect`가 보이면 **렌더링 이후 클라이언트에서 수행해야 할 effect가 있구나**라고 생각한다.

---

# 7. 이유 3 — localStorage

`localStorage`는 React 기능도 아니고 Next.js 기능도 아니다.

정확히는 **브라우저가 제공하는 Web API**다.

즉:

```text
Chrome
Safari
Edge
등의 브라우저
↓
localStorage 존재
```

하지만 서버 환경에는 브라우저의 localStorage가 없다.

```text
서버
↓
브라우저 아님
↓
브라우저 localStorage 없음
```

따라서 서버에서:

```tsx
localStorage.getItem("cart");
```

를 그대로 실행하려 하면 문제가 생긴다.

이번에는 Client Component 안에서 `useEffect`를 이용해 브라우저 쪽에서 cart를 읽는 패턴을 사용하는 것이다.

> **팁**
>
> `localStorage`를 **Next.js가 만들어준 저장소**라고 생각하지 않는다. **사용자의 브라우저가 제공하는 저장 공간**이다.

---

# 8. `"use client"`만 쓰면 localStorage를 아무 데서나 써도 될까?

아니다.

이 부분은 꽤 중요하다.

```tsx
"use client";
```

를 작성했다고 해서:

```tsx
const savedCart = localStorage.getItem("cart");
```

를 아무 위치에서나 무조건 안전하게 실행해도 된다는 뜻은 아니다.

현재 우리가 사용하는 패턴은:

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");
}, []);
```

이다.

각자의 역할을 분리해서 보자.

```text
"use client"
↓
Client Component 경계 선언


useEffect
↓
렌더링 이후 effect를 실행할 시점 관리


localStorage
↓
브라우저 저장소에서 실제 데이터 읽기
```

세 개는 서로 다른 일을 한다.

> **팁**
>
> `"use client"`와 `useEffect`를 같은 목적으로 사용하는 것으로 생각하지 않는다. **하나는 컴포넌트 경계**, **하나는 effect 실행 방식**이다.

---

# 9. 이유 4 — onClick, onChange 같은 이벤트

브라우저에서 사용자가 버튼을 클릭한다고 해보자.

```tsx
<button onClick={handleClick}>
  +
</button>
```

또는 이름을 입력한다.

```tsx
<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

이때:

```text
사용자가 브라우저에서 행동
↓
이벤트 발생
↓
onClick / onChange 실행
↓
JavaScript 함수 실행
↓
state 변경
↓
UI 변경
```

이라는 상호작용이 필요하다.

이런 이벤트 핸들러가 있는 상호작용 UI는 클라이언트 쪽 JavaScript가 필요하다.

> **팁**
>
> `onClick`, `onChange`, `onSubmit` 같은 이벤트가 등장하면 **사용자의 브라우저 행동에 반응해야 하는 컴포넌트**라는 신호로 본다.

---

# 10. 지금 checkout에는 이유가 여러 개 겹쳐 있다

현재 `/checkout`을 앞으로 완성하면:

```text
useState
→ cart state
→ name state
→ phone state
→ address state

useEffect
→ 페이지를 열었을 때 cart 읽기

localStorage
→ 브라우저에 저장된 cart 가져오기

onChange
→ 이름/전화번호/주소 입력 처리

추후 onSubmit 또는 onClick
→ 실제 주문 처리
```

가 들어간다.

즉 `/checkout`은 단순히 글자만 보여주는 정적인 페이지가 아니라:

```text
저장 데이터 읽기
+
state 관리
+
사용자 입력
+
이벤트 처리
```

가 필요한 상호작용 페이지다.

그래서 `"use client"`를 사용할 구체적인 이유가 충분하다.

> **팁**
>
> `"use client"`가 필요한 이유를 하나만 찾지 않아도 된다. 컴포넌트가 사용하는 **전체 클라이언트 기능**을 살펴본다.

---

# 11. `"use client"`는 어디에 작성하는가

파일의 맨 위에 작성한다.

```tsx
"use client";

import { useEffect, useState } from "react";
```

즉 일반적으로 import보다 위다.

전체 구조는:

```tsx
"use client";

import { useEffect, useState } from "react";

export default function CheckoutPage() {
  // ...
}
```

처럼 된다.

> **팁**
>
> Client Component 파일이라면 가장 위를 확인하는 습관을 들이면 디버깅할 때 편하다.

---

# 12. 그러면 모든 page.tsx에 `"use client"`를 붙이면 편하지 않을까?

그렇게 하지 않는 것이 좋다.

다음처럼 아무 상호작용이 없는 단순 페이지가 있다고 하자.

```tsx
export default function AboutPage() {
  return <h1>About</h1>;
}
```

여기에는:

```text
useState 없음
useEffect 없음
onClick 없음
onChange 없음
localStorage 없음
```

이다.

그렇다면 특별한 이유 없이 Client Component로 만들 필요가 없다.

Next.js에서는:

```text
클라이언트 기능 필요 없음
→ Server Component 유지

클라이언트 기능 필요
→ 필요한 위치에 "use client"
```

라는 사고방식이 중요하다.

> **팁**
>
> `"use client"`를 **에러 방지를 위해 모든 파일에 붙이는 코드**로 사용하지 않는다.

---

# 13. 왜 필요한 부분만 Client Component로 만드는가

Next.js는 Server Component와 Client Component를 함께 사용할 수 있다.

예를 들어 큰 페이지가:

```text
상품 페이지
├─ 상품 설명
├─ 상품 정보
├─ 서버에서 가져온 데이터
└─ 수량 조절 버튼
```

으로 되어 있다고 해보자.

모든 부분이 사용자 이벤트를 필요로 하는 것은 아니다.

개념적으로:

```text
페이지
├─ 서버에서 처리해도 되는 부분
│   → Server Component
│
└─ 사용자 상호작용이 필요한 부분
    → Client Component
```

으로 나눌 수 있다.

이렇게 하면 클라이언트 쪽 JavaScript가 필요한 범위를 불필요하게 크게 만들지 않는 설계를 할 수 있다.

> **팁**
>
> 실력이 올라가면 **페이지 전체에 `"use client"`를 붙일까?**보다 **어디부터 Client Component 경계를 만들까?**를 고민하게 된다.

---

# 14. 현재 checkout 코드와 연결해서 이해하기

현재 우리가 만들 코드가:

```tsx
"use client";

import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  return (
    <main>
      <h1>주문서</h1>
    </main>
  );
}
```

라고 해보자.

각 부분의 책임은 다음과 같다.

### `"use client"`

```text
Client Component 경계 선언
```

### `useState`

```text
현재 화면에서 사용할 cart 데이터 관리
```

### `useEffect`

```text
초기 렌더링 이후 cart 읽기 작업 실행
```

### `localStorage.getItem()`

```text
브라우저에 저장되어 있던 cart 문자열 읽기
```

### `JSON.parse()`

```text
문자열 → JavaScript 데이터
```

### `setCart()`

```text
React state 변경
↓
재렌더링
```

> **팁**
>
> `"use client"`의 이유를 물었을 때 단순히 **localStorage 때문에요**라고 끝내기보다 **useState/useEffect/브라우저 API/이벤트가 필요한 Client Component이기 때문**이라고 설명할 수 있으면 좋다.

---

# 15. 전체 실행 흐름

```text
사용자가 /checkout으로 이동
↓
CheckoutPage는 Client Component 경계 안에 있음
↓
초기 렌더링
↓
컴포넌트 mount
↓
useEffect 실행
↓
브라우저 localStorage 접근
↓
"cart" 데이터 읽기
↓
JSON.parse()
↓
JavaScript 배열 복구
↓
setCart()
↓
cart state 변경
↓
React 재렌더링
↓
주문 상품 화면 출력
```

여기서 각각 담당하는 문제가 다르다.

```text
"use client"
→ 어디가 클라이언트 상호작용 영역인가?

useEffect
→ 언제 읽을 것인가?

localStorage
→ 어디에서 데이터를 가져오는가?

JSON.parse
→ 저장 문자열을 어떻게 JS 데이터로 바꾸는가?

setCart
→ React UI에 어떻게 연결하는가?
```

> **팁**
>
> 여러 기술이 한 코드에 같이 나와도 **각 기술이 해결하는 문제를 하나씩 분리**하면 복잡하지 않다.

---

# 16. Server와 Client를 이렇게 비교해보자

| 질문 | Server Component | Client Component |
|---|---|---|
| App Router 기본값인가? | 예 | `"use client"` 경계 필요 |
| `useState` 직접 사용 | 아니오 | 가능 |
| `useEffect` 직접 사용 | 아니오 | 가능 |
| 브라우저 `localStorage` 접근 | 서버에는 없음 | 브라우저 시점에서 가능 |
| `onClick` 같은 상호작용 | 직접적인 클라이언트 상호작용 용도 아님 | 가능 |
| 단순 정적/서버 중심 UI | 적합 | 필요할 때만 사용 |
| 사용자 입력/state UI | 적합하지 않음 | 적합 |

> **팁**
>
> 이 표에서 가장 중요한 기준은 **사용자와 실시간으로 상호작용해야 하는가?**이다.

---

# 17. 자주 생기는 오해

## 오해 1: React 파일이면 전부 `"use client"`가 필요하다

아니다.

Next.js App Router에서는 React 컴포넌트여도 Server Component일 수 있다.

---

## 오해 2: `"use client"`는 localStorage 전용이다

아니다.

`useState`, `useEffect`, 이벤트 처리 등 클라이언트 기능을 위한 경계 선언이다.

---

## 오해 3: `"use client"`를 쓰면 useEffect가 필요 없다

아니다.

둘은 역할이 다르다.

```text
"use client"
→ 컴포넌트 경계

useEffect
→ effect 실행 시점/의존성 관리
```

---

## 오해 4: 모든 컴포넌트를 Client Component로 만들면 더 좋다

아니다.

필요한 곳에만 클라이언트 경계를 두는 것이 Next.js 구조를 이해하는 데 중요하다.

> **팁**
>
> 오류가 날 때 무조건 `"use client"`부터 붙이는 습관보다 **왜 이 코드가 클라이언트 기능을 필요로 하는가**를 먼저 확인한다.

---

# 18. 최종 핵심 요약

현재 Day 5 checkout에서 `"use client"`가 필요한 구체적인 이유는 다음과 같다.

```text
1. useState를 사용한다
   ↓
   cart / name / phone / address state 관리

2. useEffect를 사용한다
   ↓
   초기 cart 로딩

3. localStorage를 사용한다
   ↓
   브라우저 전용 API

4. onChange를 사용하게 된다
   ↓
   사용자 입력 이벤트

5. 이후 onClick/onSubmit도 사용할 수 있다
   ↓
   주문 관련 사용자 상호작용
```

따라서:

```tsx
"use client";
```

는 단순한 오류 해결용 코드가 아니라:

> **Next.js에게 이 모듈이 클라이언트 상호작용이 필요한 Client Component 경계라는 것을 알려주는 선언이다.**

그리고 이번 checkout에서는:

```text
"use client"
↓
useState / useEffect 사용 가능
↓
useEffect에서 브라우저 localStorage 읽기
↓
setCart
↓
재렌더링
↓
Controlled Component로 배송 정보 관리
```

라는 흐름으로 이어진다.

> **팁**
>
> 앞으로 `"use client"`를 작성하기 전에 스스로 질문해본다.
>
> **이 컴포넌트에서 브라우저 API, React state/effect, 사용자 이벤트 중 무엇이 필요한가?**
>
> 이유를 하나라도 명확하게 설명할 수 있다면 Client Component 경계를 이해하고 있는 것이다.
