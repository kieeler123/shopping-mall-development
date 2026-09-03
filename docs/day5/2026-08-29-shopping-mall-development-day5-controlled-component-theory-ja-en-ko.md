# Day 5 Theory Notes --- Controlled Components, Events, and React Re-rendering

------------------------------------------------------------------------

# 日本語

## 1. この資料で理解すること

Day 5 では、カートから注文ページへ進む流れを作りながら、React
のフォーム入力を state で管理する **Controlled
Component（制御コンポーネント）** を学ぶ。

特に、次のコードを「暗記する」のではなく、一つひとつ説明できる状態を目標にする。

``` tsx
const [name, setName] = useState("");

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

この短いコードには、Day 5 で重要になる次の概念が含まれている。

-   `useState`
-   state
-   state setter
-   `value`
-   `onChange`
-   イベント
-   イベントオブジェクト `e`
-   `target`
-   `e.target.value`
-   state の更新
-   再レンダー
-   Controlled Component

> **Tip**
>
> 最初からコード全体を一つの塊として覚えない。`value={name}` と
> `onChange` を分け、最後に両者をつなげると理解しやすい。

## 2. 普通の input から考える

HTML の input は、まず次のように書ける。

``` tsx
<input />
```

ユーザーはここに文字を入力できる。

``` text
ユーザー
  ↓ 入力
┌──────────────┐
│ 김철수        │
└──────────────┘
```

しかし注文フォームでは、画面に文字が見えるだけでは足りない。

React 側でも、

``` text
現在入力されている名前は何か？
```

を知り、後で注文情報として扱えるようにしたい。

そこで input の値を React state と接続する。

> **Tip**
>
> Controlled Component は「input
> を特別な部品に変える技術」と考えるより、「input の値を React state
> と接続する仕組み」と考える。

## 3. `useState` で入力値を保存する場所を作る

``` tsx
const [name, setName] = useState("");
```

ここでは三つに分けて考える。

### `name`

現在の state 値。

``` text
name
↓
現在 React が管理している名前
```

最初は空文字列なので、

``` tsx
name === ""
```

となる。

### `setName`

`name` の state を更新するための setter。

``` text
setName("김철수")
↓
React に name の更新を依頼
```

### `""`

state の初期値。

``` tsx
useState("")
```

の `""` は、レンダーのたびに state を空に戻す値ではない。最初の state
を決める初期値である。

> **Tip**
>
> `useState("")` を見たら、`name = ""`
> を毎回実行していると考えない。「この state
> のスタート地点が空文字列」と考える。

## 4. state を作っただけでは input とつながらない

次のコードでは、

``` tsx
const [name, setName] = useState("");

<input />
```

`name` と input は別々に存在している。

``` text
React state
name = ""

      接続なし

<input>
```

`useState` を宣言しただけで、ユーザーの入力が自動的に `name`
に入るわけではない。

そのため、二方向の接続を作る。

``` text
state → input
input → state
```

> **Tip**
>
> Controlled Component
> の理解では、この「二方向」を意識する。表示する方向と、入力を state
> に戻す方向がある。

## 5. `value={name}` --- state から input へ

``` tsx
<input value={name} />
```

この `value` は、input に表示する値を指定する。

``` text
name state
    │
    │ value={name}
    ↓
  <input>
```

たとえば、

``` tsx
const [name, setName] = useState("김철수");
```

なら、概念的には、

``` tsx
<input value="김철수" />
```

のような状態になる。

つまり、

``` tsx
value={name}
```

の方向は、

``` text
React state
    ↓
  input
```

である。

ただし、これだけではユーザーが新しい値を state に戻せない。その役割を
`onChange` が担当する。

> **Tip**
>
> `value={name}` を見たら「現在の state を input に表示する」と読む。

## 6. `onChange` --- input の変化を受け取る

``` tsx
onChange={(e) => setName(e.target.value)}
```

`onChange` は input の値が変化したときに処理を実行するために使う。

ユーザーが入力を続けると、概念的には次のように値が変化する。

``` text
김
↓
김철
↓
김철수
```

その変化を受け取る入口が `onChange` である。

重要なのは、`onChange` 自体が state を変更するわけではないこと。

``` text
input が変化
↓
onChange の処理が実行
↓
処理の中で setName(...) を呼ぶ
↓
state 更新を依頼
```

> **Tip**
>
> `onChange = state 更新`
> と一つにまとめて覚えず、「変更を検知して関数を実行する場所」と理解する。

## 7. `e` とは何か

``` tsx
onChange={(e) => {
  // ...
}}
```

`e` はイベントに関する情報を受け取るための引数である。

一般的に `event` の頭文字として `e` という名前がよく使われる。

したがって、

``` tsx
(e) => ...
```

は、

``` tsx
(event) => ...
```

と書いてもよい。

`e` という文字そのものが React の特別な命令ではない。

ユーザーが input
を変更すると、その出来事についての情報を関数が受け取る。その情報を扱うための変数が
`e` である。

``` text
ユーザーが input を変更
        ↓
イベント発生
        ↓
イベント情報
        ↓
        e
```

> **Tip**
>
> `e` を文法として丸暗記しない。「イベント情報を受け取った引数」と読む。

## 8. `target` とは何か

次に、

``` tsx
e.target
```

を見る。

ここでは `target` を、イベントの対象となった要素として理解する。

今回のコードでは input の変更を扱っているため、

``` text
e
└─ target
     ↓
   input
```

というイメージになる。

つまり、

``` tsx
e.target
```

によって、イベントに関係する input にアクセスしている。

> **Tip**
>
> Day 5 ではイベントシステム全体を深く掘る必要はない。まず `e.target`
> を「今回の input を見る」と理解すればよい。

## 9. `e.target.value` とは何か

input には現在の値がある。

ユーザーが、

``` text
김철수
```

と入力しているなら、その現在値を取得したい。

そこで、

``` tsx
e.target.value
```

を使う。

分解すると、

``` text
e
↓
イベント情報

e.target
↓
イベント対象の input

e.target.value
↓
その input の現在値
```

今回なら、概念的には、

``` tsx
e.target.value === "김철수"
```

と考えられる。

> **Tip**
>
> Day 5 の段階では `e.target.value` を「ユーザーが現在 input
> に入力している値を取り出す」と読めれば十分。

## 10. `setName(e.target.value)` を読む

ここまで理解すると、

``` tsx
setName(e.target.value)
```

を順番に読める。

まず右側を考える。

``` tsx
e.target.value
```

ユーザーが `김철수` と入力していれば、

``` text
"김철수"
```

という値が得られる。

その値を、

``` tsx
setName(...)
```

に渡す。

したがって概念的には、

``` tsx
setName("김철수");
```

となる。

重要なのは、

``` tsx
name = "김철수";
```

のような普通の変数への直接代入として考えないことである。

`setName` を呼ぶことで React に state 更新を依頼する。

> **Tip**
>
> 関数の中に関数や式があるときは内側から読む。`e.target.value` →
> `"김철수"` → `setName("김철수")` の順に考える。

## 11. state が更新されると再レンダーにつながる

最初は、

``` text
name = ""
```

だったとする。

ユーザーが `김` を入力すると、

``` tsx
setName("김");
```

という更新が発生する。

すると新しい state を使ってコンポーネントが再びレンダーされる。

``` text
最初
name = ""

↓ ユーザー入力

setName("김")

↓ state 更新

name = "김"

↓ 再レンダー
```

そして JSX の、

``` tsx
value={name}
```

も新しい `name` を使うため、input に新しい値が反映される。

> **Tip**
>
> state 更新と UI 更新を別々の出来事として見る。state
> が変わり、その新しい state を基準に UI が再計算される。

## 12. 再レンダーはページ更新ではない

React の再レンダーはブラウザの F5 更新とは違う。

``` text
F5
↓
ページ全体を再読み込み
```

ではない。

概念的には、

``` text
state 更新
↓
コンポーネントを再レンダー
↓
新しい UI の結果を計算
↓
必要な DOM の変更を反映
```

という流れになる。

Day 5 では内部アルゴリズムを深く理解する必要はなく、

``` text
再レンダー ≠ ページ全体のリロード
```

を区別できればよい。

> **Tip**
>
> `setName()` のたびにサイト全体がロードし直される、と考えない。React
> が新しい state に基づいて表示結果を更新すると理解する。

## 13. Controlled Component の完全なデータフロー

これまでの内容を一つにつなげる。

``` tsx
const [name, setName] = useState("");

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

ユーザーが `김철수` と入力するまでの基本的な流れは、

``` text
ユーザーが入力
↓
input の値が変化
↓
onChange
↓
イベント情報 e
↓
e.target
↓
e.target.value
↓
現在の入力値を取得
↓
setName(...)
↓
name state 更新
↓
再レンダー
↓
value={name}
↓
新しい state が input に反映
```

となる。

これが Controlled Component の中心となるデータフローである。

> **Tip**
>
> この流れを一度、自分の言葉で説明してみる。「入力したら state
> が変わる」だけで終わらず、`onChange → e.target.value → setName → 再レンダー → value`
> まで言えれば理解が深い。

## 14. 二つの `value` を区別する

コードには `value` が二つの形で登場する。

``` tsx
<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

### `value={name}`

state の値を input に表示する。

``` text
state → input
```

### `e.target.value`

input の現在値を取得する。

``` text
input → state 更新処理
```

二つを合わせると、

``` text
          name state
          ↓       ↑
 value={name}     │
          ↓       │
        input     │
          ↓       │
 e.target.value   │
          ↓       │
       setName ───┘
```

となる。

> **Tip**
>
> 同じ `value` という単語だけを見ない。「どこに書かれている value
> か」で役割を判断する。

## 15. `console.log()` で実物を見る

理解を固めるには、実際の値を見るとよい。

``` tsx
<input
  value={name}
  onChange={(e) => {
    console.log(e);
    console.log(e.target);
    console.log(e.target.value);

    setName(e.target.value);
  }}
/>
```

入力しながらコンソールを確認する。

``` text
김
김철
김철수
```

のように、現在値が変化することを観察できる。

> **Tip**
>
> 分からない値を推測だけで理解しようとしない。`console.log()`
> で確認する習慣は React
> の学習だけでなく、実際のデバッグでも非常に重要。

## 16. Day 5 での実際の利用

注文ページでは同じ考え方を名前だけでなく、連絡先や住所にも広げられる。

``` text
名前 input
↕
name state

連絡先 input
↕
phone state

住所 input
↕
address state
```

最終的には、

``` text
カートの商品情報
+
name
+
phone
+
address
↓
注文に必要な情報
```

という形を考えられる。

ただし Day 5 では、最初からすべてを一度に実装せず、名前 input 一つで
Controlled Component の流れを確認してから増やす。

> **Tip**
>
> 機能を増やす前に、名前 input 一つで
> `value`、`onChange`、`e.target.value`、`setName`
> の流れを説明できるか確認する。

## 17. 一文でまとめる

Controlled Component の中心は、

> **イベントが state の更新につながり、更新された state が再び input
> の表示値を決める。**

という循環である。

``` text
ユーザー入力
↓
onChange
↓
e.target.value
↓
setName
↓
state
↓
再レンダー
↓
value={name}
↓
input
```

> **Tip**
>
> コードそのものより「データがどこからどこへ動くか」を追えるようになることを
> Day 5 の目標にする。

------------------------------------------------------------------------

# English

## 1. What This Note Explains

The main new concept for Day 5 is the React **Controlled Component**:
connecting a form input to React state so that React manages the value
displayed by the input.

The central example is:

``` tsx
const [name, setName] = useState("");

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

Rather than memorizing this code, the goal is to understand each part:

-   `useState`
-   state
-   the state setter
-   `value`
-   `onChange`
-   events
-   the event object `e`
-   `target`
-   `e.target.value`
-   state updates
-   re-rendering
-   Controlled Components

> **Tip**
>
> Do not memorize the whole expression at once. First understand the
> state-to-input direction and then the input-to-state direction.

## 2. Start With a Normal Input

A basic input can be written as:

``` tsx
<input />
```

A user can type text into it. For an order form, however, displaying
text is not enough. We also want React to know and manage the current
name so that it can later become part of the order information.

That is why the input is connected to React state.

> **Tip**
>
> Think of a Controlled Component as an input whose displayed value is
> connected to React state.

## 3. Create State With `useState`

``` tsx
const [name, setName] = useState("");
```

`name` is the current state value.

`setName` is the setter used to request an update to that state.

`""` is the initial state value.

The empty string is not reapplied on every render. It defines the
starting value of the state.

> **Tip**
>
> Read `useState("")` as "this state starts as an empty string," not
> "reset this state to an empty string every time."

## 4. State and Input Are Not Automatically Connected

This code:

``` tsx
const [name, setName] = useState("");

<input />
```

creates state and an input, but it does not connect them.

A Controlled Component needs both directions:

``` text
state → input
input → state
```

> **Tip**
>
> Always ask two questions: "How does state reach the input?" and "How
> does user input return to state?"

## 5. `value={name}` --- State to Input

``` tsx
<input value={name} />
```

The `value` prop tells the input which value to display.

``` text
name state
    ↓
value={name}
    ↓
input
```

If `name` contains `"김철수"`, the input displays that value.

This is the **state → input** direction.

> **Tip**
>
> Read `value={name}` as "show the current `name` state in this input."

## 6. `onChange` --- Responding to Input Changes

``` tsx
onChange={(e) => setName(e.target.value)}
```

`onChange` runs the provided handler when the input value changes.

It is useful to separate the steps:

``` text
input changes
↓
onChange handler runs
↓
handler reads the new value
↓
setName(...) requests a state update
```

`onChange` itself is not the state. It is the place where the change is
handled.

> **Tip**
>
> Think of `onChange` as the entry point for reacting to user input.

## 7. What Is `e`?

In:

``` tsx
onChange={(e) => {
  // ...
}}
```

`e` is the parameter receiving event information.

The name `e` is conventional shorthand for `event`. It could also be
written as:

``` tsx
onChange={(event) => {
  // ...
}}
```

The letter `e` is not special React syntax.

Conceptually:

``` text
user changes input
↓
event occurs
↓
event information
↓
e
```

> **Tip**
>
> Do not memorize `e` as a React keyword. Think of it as a variable
> holding event information.

## 8. What Is `target`?

``` tsx
e.target
```

For this Day 5 example, `target` can be understood as the element
associated with the event---the input we are working with.

``` text
e
└─ target
     ↓
   input
```

> **Tip**
>
> You do not need the entire browser event model yet. For this lesson,
> connect `e.target` with the relevant input element.

## 9. What Is `e.target.value`?

The input has a current value.

If the user has typed:

``` text
김철수
```

then:

``` tsx
e.target.value
```

gives the current input value we need.

Break it down:

``` text
e
↓
event information

e.target
↓
the relevant input

e.target.value
↓
the input's current value
```

> **Tip**
>
> For Day 5, a useful mental translation is: `e.target.value` = "the
> text currently entered by the user."

## 10. Reading `setName(e.target.value)`

Suppose:

``` tsx
e.target.value
```

currently evaluates to:

``` text
"김철수"
```

Then:

``` tsx
setName(e.target.value)
```

can be understood conceptually as:

``` tsx
setName("김철수");
```

This requests a React state update.

It should not be treated as ordinary direct assignment such as:

``` tsx
name = "김철수";
```

> **Tip**
>
> Read nested expressions from the inside out: get `e.target.value`
> first, then pass the result to `setName`.

## 11. State Update and Re-rendering

Suppose the state starts as:

``` text
name = ""
```

The user types `김`, so the handler eventually requests:

``` tsx
setName("김");
```

The state is updated, and React can render the component again using the
new state.

``` text
name = ""
↓
setName("김")
↓
name = "김"
↓
re-render
↓
value={name}
↓
input reflects "김"
```

> **Tip**
>
> Separate state changes from UI changes: the state updates first, and
> the UI is then calculated from the new state.

## 12. Re-rendering Is Not a Full Page Reload

A React re-render is not the same as pressing F5.

Conceptually:

``` text
state update
↓
component renders again
↓
new UI result is calculated
↓
necessary DOM changes are reflected
```

For Day 5, the essential distinction is:

``` text
React re-render ≠ browser page reload
```

> **Tip**
>
> Do not imagine the entire website reloading whenever `setName()` runs.

## 13. The Full Controlled Component Flow

``` tsx
const [name, setName] = useState("");

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

The complete learning flow is:

``` text
user types
↓
input changes
↓
onChange
↓
event object e
↓
e.target
↓
e.target.value
↓
read current input value
↓
setName(...)
↓
name state updates
↓
re-render
↓
value={name}
↓
updated state is reflected in the input
```

This is the central Day 5 Controlled Component data flow.

> **Tip**
>
> Practice explaining the entire chain aloud. If you can explain why
> each arrow exists, you understand more than someone who only memorized
> the syntax.

## 14. Distinguishing the Two Uses of `value`

The code contains two appearances related to `value`:

``` tsx
<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

`value={name}` means:

``` text
state → input
```

`e.target.value` means:

``` text
input's current value → state update logic
```

Together:

``` text
          name state
          ↓       ↑
 value={name}     │
          ↓       │
        input     │
          ↓       │
 e.target.value   │
          ↓       │
       setName ───┘
```

> **Tip**
>
> When the two `value`s feel confusing, identify their location first.
> One is an input prop; the other reads a value from the event target.

## 15. Inspect the Values With `console.log()`

A useful experiment is:

``` tsx
<input
  value={name}
  onChange={(e) => {
    console.log(e);
    console.log(e.target);
    console.log(e.target.value);

    setName(e.target.value);
  }}
/>
```

As you type, observe how the current value changes.

> **Tip**
>
> Logging real values is often more effective than trying to memorize an
> abstract explanation. Make `console.log()` part of your debugging
> habit.

## 16. Applying the Same Idea to Checkout

The same pattern can later be extended to:

``` text
name input ↔ name state
phone input ↔ phone state
address input ↔ address state
```

Then the checkout can conceptually combine:

``` text
cart information
+
name
+
phone
+
address
↓
order information
```

For Day 5, however, it is better to make one name input work first
before adding all fields.

> **Tip**
>
> Build one controlled input correctly, verify it, and only then repeat
> the pattern for the other fields.

## 17. One-Sentence Summary

The central idea of a Controlled Component is:

> **An event leads to a state update, and the updated state determines
> the value displayed by the input.**

``` text
user input
↓
onChange
↓
e.target.value
↓
setName
↓
state
↓
re-render
↓
value={name}
↓
input
```

> **Tip**
>
> Focus on the movement of data rather than memorizing syntax. That
> mental model will transfer to search fields, login forms, checkout
> forms, and many other React features.

------------------------------------------------------------------------

# 한국어

## 1. 이번 이론에서 이해할 것

Day 5의 새로운 핵심은 React의 **Controlled Component(제어 컴포넌트)**다.

기준이 되는 코드는 다음과 같다.

``` tsx
const [name, setName] = useState("");

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

이 코드를 외우는 것이 아니라 다음 요소를 각각 설명할 수 있는 상태가
목표다.

-   `useState`
-   state
-   setter 함수
-   `value`
-   `onChange`
-   이벤트
-   이벤트 객체 `e`
-   `target`
-   `e.target.value`
-   state 업데이트
-   재렌더링
-   Controlled Component

> **팁**
>
> 전체 코드를 한 덩어리로 외우지 말고 `state → input`, `input → state`
> 두 방향으로 나눠서 이해한다.

## 2. 일반적인 input부터 생각하기

가장 단순한 input은 다음과 같다.

``` tsx
<input />
```

사용자는 여기에 글자를 입력할 수 있다.

하지만 쇼핑몰 주문서라면 화면에 글자가 보이는 것만으로는 부족하다.

React도 다음 정보를 알고 있어야 한다.

``` text
현재 주문자가 입력한 이름은 무엇인가?
```

그래야 나중에 이름, 연락처, 주소 등을 주문 정보로 다룰 수 있다.

그래서 input을 React state와 연결한다.

> **팁**
>
> Controlled Component를 어렵게 생각하지 말고 **input에 표시되는 값을
> React state가 관리하도록 연결하는 것**이라고 먼저 이해한다.

## 3. `useState`로 입력값을 보관할 state 만들기

``` tsx
const [name, setName] = useState("");
```

세 부분으로 나눠보자.

### `name`

현재 state 값이다.

``` text
name
↓
현재 React가 기억하고 있는 이름
```

처음에는 빈 문자열이므로:

``` tsx
name === ""
```

이다.

### `setName`

`name` state의 업데이트를 요청할 때 사용하는 setter 함수다.

``` tsx
setName("김철수");
```

라고 하면 React에게 `name`을 새로운 값으로 업데이트해 달라고 요청하는
것이다.

### `""`

초기값이다.

``` tsx
useState("")
```

에서 `""`는 렌더링할 때마다 `name`을 빈 문자열로 만드는 값이 아니다.

state가 처음 만들어질 때 사용하는 시작값이라고 이해하면 된다.

> **팁**
>
> `useState("")`를 볼 때 `name을 계속 빈 문자열로 만든다`가 아니라
> **name state는 처음에 빈 문자열에서 시작한다**라고 읽는다.

## 4. state와 input은 자동으로 연결되지 않는다

다음 코드만 작성했다고 하자.

``` tsx
const [name, setName] = useState("");

<input />
```

현재는:

``` text
React
name = ""

      연결 X

<input>
```

상태다.

`useState`를 만들었다고 사용자가 input에 입력한 값이 자동으로 `name`에
들어가는 것이 아니다.

우리가 직접 두 방향을 연결해야 한다.

``` text
state → input
input → state
```

> **팁**
>
> Controlled Component를 볼 때 항상 두 질문을 한다. **state를 input에
> 어떻게 보여주지?**, **input의 새 값을 state로 어떻게 가져오지?**

## 5. `value={name}` --- state에서 input으로

``` tsx
<input value={name} />
```

여기서 `value`는 input에 어떤 값을 표시할지를 결정한다.

``` text
name state
    │
    │ value={name}
    ↓
  <input>
```

예를 들어:

``` tsx
const [name, setName] = useState("김철수");
```

라면 개념적으로 input에는 `"김철수"`가 표시된다.

따라서:

``` tsx
value={name}
```

의 데이터 방향은:

``` text
React state
    ↓
  input
```

이다.

> **팁**
>
> `value={name}`을 보면 **현재 name state를 input에 보여줘**라고
> 해석한다.

## 6. `onChange` --- input의 변경을 처리하기

``` tsx
onChange={(e) => setName(e.target.value)}
```

`onChange`는 input 값이 바뀔 때 연결된 처리를 실행한다.

사용자가 계속 입력하면 값은 예를 들어:

``` text
김
↓
김철
↓
김철수
```

처럼 바뀐다.

그 변화를 처리하는 입구가 `onChange`다.

정확히는:

``` text
input 변경
↓
onChange에 연결된 함수 실행
↓
새 입력값 확인
↓
setName(...) 호출
↓
state 업데이트 요청
```

이다.

`onChange` 그 자체가 state는 아니며, state를 직접 의미하지도 않는다.

> **팁**
>
> `onChange = state 변경`으로 통째로 외우지 않는다. **값이 바뀌었을 때
> 내가 작성한 처리를 실행시키는 지점**이라고 이해한다.

## 7. `e`는 무엇인가?

``` tsx
onChange={(e) => {
  // ...
}}
```

여기서 `e`는 이벤트에 대한 정보를 전달받는 매개변수다.

보통 `event`를 줄여 `e`라고 많이 작성한다.

따라서:

``` tsx
(e) => ...
```

대신:

``` tsx
(event) => ...
```

라고 작성해도 된다.

즉 `e`라는 글자 자체가 React의 특별한 문법은 아니다.

흐름으로 보면:

``` text
사용자가 input 변경
↓
이벤트 발생
↓
이벤트에 대한 정보
↓
e로 전달
```

이다.

> **팁**
>
> `e`를 React 명령어라고 외우지 않는다. **이벤트 정보를 받아놓은
> 변수**라고 이해한다.

## 8. `target`은 무엇인가?

이제:

``` tsx
e.target
```

을 보자.

Day 5의 현재 예제에서는 `target`을 이벤트와 관련된 대상 요소, 즉 우리가
값을 읽고 있는 input이라고 이해하면 된다.

``` text
e
└── target
      ↓
    input
```

따라서:

``` tsx
e.target
```

을 통해 해당 input에 접근한다고 생각할 수 있다.

> **팁**
>
> 지금 이벤트 시스템 전체를 깊게 공부할 필요는 없다. Day 5에서는
> **e.target → 지금 다루고 있는 input**이라는 연결부터 확실히 잡는다.

## 9. `e.target.value`는 무엇인가?

input에는 현재 사용자가 입력해 놓은 값이 있다.

예를 들어:

``` text
김철수
```

가 입력되어 있다면 우리가 원하는 것은 그 현재 문자열이다.

이를:

``` tsx
e.target.value
```

로 읽는다.

하나씩 보면:

``` text
e
↓
이벤트 정보

e.target
↓
이벤트와 관련된 input

e.target.value
↓
그 input의 현재 값
```

이다.

따라서 현재 예제에서 사용자가 `김철수`까지 입력했다면 개념적으로:

``` tsx
e.target.value === "김철수"
```

라고 이해할 수 있다.

> **팁**
>
> Day 5에서는 `e.target.value`를 **사용자가 지금 input에 입력해 놓은
> 값을 꺼낸다**라고 번역해서 읽어도 좋다.

## 10. `setName(e.target.value)`를 해석하기

이제 이 코드를 읽어보자.

``` tsx
setName(e.target.value)
```

먼저 안쪽의:

``` tsx
e.target.value
```

를 계산한다고 생각한다.

현재 값이 `"김철수"`라면:

``` tsx
setName("김철수");
```

처럼 이해할 수 있다.

그러면 React에게 새로운 `name` state를 `"김철수"`로 업데이트해 달라고
요청하게 된다.

여기서 다음과 혼동하면 안 된다.

``` tsx
name = "김철수";
```

React state를 일반 변수처럼 직접 대입하는 개념이 아니다.

> **팁**
>
> 복잡한 코드가 나오면 안쪽부터 읽는다. **e.target.value 확인 → 실제
> 문자열 획득 → setName에 전달** 순서다.

## 11. `setName()` 이후에는 무엇이 일어날까?

처음 상태가:

``` text
name = ""
```

라고 해보자.

사용자가 `김`을 입력하면 결과적으로:

``` tsx
setName("김");
```

이라는 업데이트 요청이 발생한다.

그 결과 새로운 state를 기준으로 컴포넌트가 다시 렌더링된다.

``` text
처음
name = ""

↓ 사용자 입력

setName("김")

↓ state 업데이트

name = "김"

↓ 재렌더링
```

그리고 JSX의:

``` tsx
value={name}
```

도 새로운 `name`을 기준으로 계산된다.

따라서 input에도 `"김"`이 반영된다.

> **팁**
>
> `setName()`이 화면의 input 글자를 직접 수정한다고 생각하지 않는다.
> **state를 업데이트하고, 새로운 state를 기준으로 UI가 다시 계산된다**고
> 생각한다.

## 12. `useState("")`인데 왜 재렌더링할 때 다시 빈 문자열이 되지 않을까?

초보 단계에서 자주 생길 수 있는 의문이다.

``` tsx
const [name, setName] = useState("");
```

컴포넌트가 다시 렌더링된다면 `""`가 다시 적용될 것처럼 보일 수 있다.

하지만 여기서 `""`는 초기값이다.

흐름은 다음처럼 이해한다.

``` text
첫 렌더링
↓
초기값 ""
↓
name = ""

사용자 입력
↓
setName("김")

다음 렌더링
↓
React가 관리하는 현재 state 사용
↓
name = "김"
```

> **팁**
>
> `useState`의 초기값과 현재 state를 구분한다. 초기값은 시작점을 정하고,
> 이후에는 React가 현재 state를 관리한다.

## 13. 재렌더링은 브라우저 새로고침이 아니다

React에서:

``` text
재렌더링
```

이라는 말을 들었다고 해서:

``` text
F5
↓
페이지 전체 새로고침
```

을 떠올리면 안 된다.

개념적으로는:

``` text
state 업데이트
↓
컴포넌트 다시 렌더링
↓
새로운 UI 결과 계산
↓
필요한 DOM 변경 반영
```

의 흐름이다.

Day 5에서는 내부 알고리즘을 깊게 파기보다:

``` text
React 재렌더링 ≠ 브라우저 페이지 전체 새로고침
```

을 확실하게 구분하는 것이 중요하다.

> **팁**
>
> `setName()`을 호출할 때마다 사이트가 처음부터 다시 로딩된다고 생각하지
> 않는다.

## 14. Controlled Component 전체 흐름

이제 처음 코드를 다시 보자.

``` tsx
const [name, setName] = useState("");

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

전체 데이터 흐름은:

``` text
사용자가 입력
↓
input 값 변경
↓
onChange
↓
이벤트 정보 e
↓
e.target
↓
e.target.value
↓
현재 input 값 획득
↓
setName(...)
↓
name state 업데이트
↓
재렌더링
↓
value={name}
↓
업데이트된 state가 input에 반영
```

이다.

이것이 Day 5에서 이해해야 할 Controlled Component의 핵심이다.

> **팁**
>
> 이 순서를 눈으로만 읽지 말고 한 번 소리 내서 설명해 본다. 각 화살표가
> 왜 필요한지 설명할 수 있다면 문법 암기보다 훨씬 깊게 이해한 것이다.

## 15. 코드에 나오는 두 `value`의 차이

다시 코드를 보면:

``` tsx
<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

`value`라는 표현이 서로 다른 위치에서 보인다.

### `value={name}`

현재 React state를 input에 보여준다.

``` text
state → input
```

### `e.target.value`

현재 input에 입력된 값을 읽는다.

``` text
input → state 업데이트 로직
```

둘을 합치면:

``` text
          name state
          ↓       ↑
 value={name}     │
          ↓       │
        input     │
          ↓       │
 e.target.value   │
          ↓       │
       setName ───┘
```

이라는 순환 구조가 만들어진다.

> **팁**
>
> 두 `value`가 헷갈리면 방향을 확인한다. **`value={name}`은 state →
> input, `e.target.value`는 input의 현재 값 읽기**다.

## 16. `console.log()`로 직접 확인하기

이론이 추상적으로 느껴지면 실제 값을 출력해본다.

``` tsx
<input
  value={name}
  onChange={(e) => {
    console.log(e);
    console.log(e.target);
    console.log(e.target.value);

    setName(e.target.value);
  }}
/>
```

사용자가 입력하면서 콘솔을 보면:

``` text
김
김철
김철수
```

처럼 현재 값이 변하는 것을 직접 확인할 수 있다.

이 과정을 통해:

-   `e`에는 무엇이 들어오는지
-   `e.target`은 무엇을 가리키는지
-   `e.target.value`는 실제로 어떤 문자열인지

를 확인할 수 있다.

> **팁**
>
> 모르는 객체나 값이 나오면 무조건 암기하려 하지 말고 직접 출력해 본다.
> `console.log()`는 학습 도구이면서 동시에 실무 디버깅 도구다.

## 17. checkout에서는 어떻게 확장할까?

Day 5의 주문서에서는 이 패턴을 나중에 다음과 같이 확장할 수 있다.

``` text
이름 input
↕
name state

연락처 input
↕
phone state

주소 input
↕
address state
```

그러면 개념적으로:

``` text
장바구니 상품 정보
+
name
+
phone
+
address
↓
주문에 필요한 정보
```

로 연결할 수 있다.

하지만 처음부터 세 input을 한꺼번에 만드는 것보다 이름 하나부터 만드는
것이 중요하다.

``` text
이름 input 하나 생성
↓
value 연결
↓
onChange 연결
↓
e.target.value 확인
↓
setName 실행
↓
state 변경 확인
↓
그다음 연락처와 주소로 확장
```

> **팁**
>
> 기능을 복사해서 늘리기 전에 이름 input 하나를 보고 전체 데이터 흐름을
> 설명할 수 있는지 확인한다.

## 18. 최종 핵심 문장

Controlled Component를 한 문장으로 정리하면:

> **사용자 이벤트가 state 업데이트로 이어지고, 업데이트된 state가 다시
> input에 표시될 값을 결정한다.**

전체 흐름:

``` text
사용자 입력
↓
onChange
↓
e
↓
e.target
↓
e.target.value
↓
setName
↓
state 업데이트
↓
재렌더링
↓
value={name}
↓
input 표시
```

Day 5에서 중요한 것은 코드를 외우는 것이 아니라 이 데이터 이동을
머릿속에서 추적할 수 있게 되는 것이다.

> **팁**
>
> 다음 실제 구현에서는 먼저 `/checkout`에 이름 input 하나를 만들고
> `console.log(e.target.value)`로 값을 확인한 뒤 `setName`과 `value`를
> 연결하면 이론과 코드가 자연스럽게 이어진다.
