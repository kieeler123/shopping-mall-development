# Day 19 React 復習まとめ --- Events & Forms

## 1. 今日の核心目標

Day 19で最も重要な流れは次の通り。

``` text
ユーザー入力
→ Event 発生
→ Event から入力値を確認
→ React State を更新
→ 再レンダリング
→ UI に反映
→ Form を送信
```

各レイヤーの役割を分けて考える。

``` text
Vanilla JavaScript
→ Web / Event の原理を理解する

React JavaScript
→ Event・State・UI をつなぐ

React + TypeScript
→ 既存の React コードに型を追加する

Next.js + TypeScript
→ 実際の Client Component として実装する
```

> **ヒント:** コードが複雑に見えたら、まず
> JavaScript/Web・React・TypeScript・Next.js
> のどのレイヤーの問題かを分類する。

------------------------------------------------------------------------

## 2. Vanilla JavaScript --- Event の原理

ユーザーが input を変更すると、ブラウザが Event を発生させる。

``` js
const input = document.querySelector("input");

input.addEventListener("input", (event) => {
  console.log(event.target.value);
});
```

核心:

-   `event`: 発生した Event に関する情報
-   `event.target`: Event が発生した要素
-   `event.target.value`: その要素の現在値
-   Event オブジェクトはブラウザが作成し、handler に渡す。

``` text
ユーザー入力
→ ブラウザで Event 発生
→ Event オブジェクトを handler に渡す
→ event.target
→ event.target.value
```

### `preventDefault()`

``` js
form.addEventListener("submit", (event) => {
  event.preventDefault();
});
```

`preventDefault()`は Event 自体を消すのではなく、**その Event
に対してブラウザが行おうとするデフォルト動作を止める。**

> **ヒント:**
> `preventDefault = ページ更新を止める`だけで覚えず、`ブラウザのデフォルト動作を止める`と理解する。

------------------------------------------------------------------------

## 3. React --- `onChange` と State

React では JSX から Event handler を接続する。

``` jsx
const handleChange = (event) => {
  console.log(event.target.value);
};

return <input onChange={handleChange} />;
```

`onChange={handleChange}`は関数をその場で実行するのではなく、**関数そのものを渡す。**

``` jsx
onChange={handleChange}   // 関数を渡す
onChange={handleChange()} // レンダリング中に関数を呼び出す
```

> **ヒント:** 「Event が発生したときに実行してほしい関数を React
> に渡す」と考える。

### 入力値を State に保存する

``` jsx
const [name, setName] = useState("");

const handleChange = (event) => {
  setName(event.target.value);
};
```

流れ:

``` text
ユーザー入力
→ onChange
→ handler
→ event.target.value
→ setName(...)
→ State 更新
→ 再レンダリング
→ UI に反映
```

> **ヒント:** React Form で迷ったら
> `Event → handler → 値 → setter → 再レンダリング`の順に追跡する。

------------------------------------------------------------------------

## 4. Controlled Component

``` jsx
<input
  value={name}
  onChange={handleChange}
/>
```

2つの方向を区別する。

``` text
value={name}
State → input

onChange
input → handler → State
```

React State が input の表示値を制御し、ユーザーの変更を `onChange`
経由で State に戻す形が Controlled Component。

> **ヒント:** `value={state}` と `onChange → setter` のセットで覚える。

------------------------------------------------------------------------

## 5. 入力中の State と送信済み State を分ける

現在編集中の値と最後に送信した値は別の情報。

``` jsx
const [name, setName] = useState("");
const [submittedName, setSubmittedName] = useState("");
```

例:

``` text
ユーザーが「철수」と入力
name = "철수"
submittedName = ""

送信
name = "철수"
submittedName = "철수"

input を「영희」に変更、まだ再送信していない
name = "영희"
submittedName = "철수"
```

> **ヒント:** State を作る前に「この State
> は何を記憶するためのものか」を一文で説明する。

------------------------------------------------------------------------

## 6. 複数の input と1つの Form

名前とメールのように一度に送信するデータは1つの Form にまとめられる。

``` jsx
<form onSubmit={handleSubmit}>
  <input value={name} onChange={handleName} />
  <input value={email} onChange={handleEmail} />
  <button type="submit">登録</button>
</form>
```

1つの submit handler で複数の値を処理する。

``` jsx
const handleSubmit = (event) => {
  event.preventDefault();

  setSubmittedName(name);
  setSubmittedEmail(email);
};
```

流れ:

``` text
submit ボタン
→ form submit Event
→ onSubmit
→ handleSubmit
→ preventDefault()
→ State 更新
→ 再レンダリング
→ 送信結果を UI に反映
```

### `onClick` と `onSubmit`

-   `onClick`: 特定要素のクリック Event
-   `onSubmit`: Form 全体の送信 Event

Form 送信を実装するときは `<form onSubmit={...}>`を中心に設計する。

> **ヒント:** ボタンがあるからといって必ず
> `onClick`を選ぶのではなく、ユーザーの目的が「Form
> の送信」かを先に判断する。

------------------------------------------------------------------------

## 7. React + TypeScript --- Event の型を追加する

React の動作自体は変わらない。既存の Event 引数に型情報を追加する。

### `ChangeEvent`

JavaScript:

``` jsx
const handleName = (event) => {
  setName(event.target.value);
};
```

TypeScript:

``` tsx
import type { ChangeEvent } from "react";

const handleName = (
  event: ChangeEvent<HTMLInputElement>
) => {
  setName(event.target.value);
};
```

分解:

``` text
ChangeEvent
→ React の change Event 型

HTMLInputElement
→ HTML の <input> 要素
```

つまり `ChangeEvent<HTMLInputElement>` は **input 要素に関連する React
change Event の型**。

> **ヒント:** Event 型は「どんな Event か？」＋「どの HTML
> 要素か？」の2つの質問で判断する。

### `FormEvent`

``` tsx
import type { FormEvent } from "react";

const handleSubmit = (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
};
```

分解:

``` text
FormEvent
→ Form Event の型

HTMLFormElement
→ HTML の <form> 要素
```

> **ヒント:** `onChange`は handler を接続する React
> の仕組みで、`ChangeEvent<HTMLInputElement>`は handler が受け取る Event
> 引数の型情報。

------------------------------------------------------------------------

## 8. State の型推論

``` tsx
const [name, setName] = useState("");
```

初期値 `""` が文字列なので、TypeScript はこの State を `string`
と推論できる。

そのため常に次のように書く必要はない。

``` tsx
const [name, setName] = useState<string>("");
```

> **ヒント:** TypeScript
> が明確に推論できる型は、理由なく重複して記述しなくてもよい。

------------------------------------------------------------------------

## 9. `input type="number"`でも value は文字列

``` tsx
<input type="number" />
```

でも、次の値は基本的に文字列。

``` tsx
event.target.value
```

例:

``` text
画面入力: 50000
State の値: "50000"
```

数値計算が必要になった時点で `Number(price)` などを使って変換する。

> **ヒント:** HTML の `type="number"` と JavaScript/TypeScript の
> `number` 型を同じものだと考えない。

------------------------------------------------------------------------

## 10. Next.js + TypeScript --- `"use client"`

Next.js App Router で `useState` や Event handler
を使い、ブラウザ上でユーザーとやり取りするコンポーネントには Client
Component の境界が必要。

``` tsx
"use client";
```

例:

``` tsx
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
```

React の基本的な流れは変わらない。

``` text
input
→ onChange
→ handler
→ setState
→ 再レンダリング
→ UI に反映
```

> **ヒント:**
> `"use client" = React を使う`ではなく、`"use client" = Client Component の境界を宣言する`と覚える。

------------------------------------------------------------------------

## 11. 最終実習 --- 商品登録 Form

``` tsx
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

export default function UserForm() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");

  const [submitProduct, setSubmitProduct] = useState("");
  const [submitPrice, setSubmitPrice] = useState("");

  const handleProductNameChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setProductName(event.target.value);
  };

  const handlePriceChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setPrice(event.target.value);
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSubmitProduct(productName);
    setSubmitPrice(price);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={productName}
        onChange={handleProductNameChange}
      />

      <input
        type="number"
        value={price}
        onChange={handlePriceChange}
      />

      <button type="submit">商品登録</button>

      <p>商品名: {submitProduct}</p>
      <p>価格: {submitPrice}</p>
    </form>
  );
}
```

全体の流れ:

``` text
商品名 / 価格を入力
→ onChange
→ ChangeEvent<HTMLInputElement>
→ event.target.value
→ 入力 State 更新
→ 再レンダリング

商品登録
→ form submit
→ FormEvent<HTMLFormElement>
→ preventDefault()
→ 送信済み State 更新
→ 再レンダリング
→ 登録結果を表示
```

> **ヒント:** Form が複雑になったら、まず `入力 State` と
> `送信・結果処理` の2つに分ける。

------------------------------------------------------------------------

## 12. JavaScript / React / TypeScript / Next.js の分類

  ---------------------------------------------------------------------------------
  コード / 概念                     レイヤー                役割
  --------------------------------- ----------------------- -----------------------
  `event.target.value`              Web / JavaScript Event  input の現在値を取得

  `useState`                        React                   State 管理

  `setProductName`                  React                   State 更新を要求

  `onChange`, `onSubmit`            React                   Event handler を接続

  `ChangeEvent<HTMLInputElement>`   React の型 + TypeScript change Event 引数の型

  `FormEvent<HTMLFormElement>`      React の型 + TypeScript Form Event 引数の型

  `"use client"`                    Next.js                 Client Component の境界
  ---------------------------------------------------------------------------------

> **ヒント:**
> エラーが出たら、この分類を使って最初に調べるレイヤーを絞り込む。

------------------------------------------------------------------------

## 13. Day 18 と Day 19 の接続

Day 18:

``` text
配列 State
オブジェクト
Spread
Props
関数 Props
map
key
```

Day 19:

``` text
ユーザー入力
→ Form
→ Event
→ State
→ UI
```

2日分をつなげると:

``` text
商品 Form 入力
→ 商品オブジェクト作成
→ products 配列 State に追加
→ ProductList に Props で渡す
→ map で表示
```

ここで Day 18 のイミュータブルな配列更新が再登場する。

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

> **ヒント:**
> 「1件の送信値を保存する」問題と「複数の商品を配列に蓄積する」問題を区別する。前者は単純な
> State 更新、後者は配列のイミュータブル更新が必要。

------------------------------------------------------------------------

## 14. Day 19 の最終メンタルモデル

``` text
Vanilla
→ Event から値をどう読むか？

React
→ その値を State と UI にどうつなぐか？

TypeScript
→ Event と値の型をどう表現するか？

Next.js
→ このインタラクティブなコンポーネントを
   Client Component としてどう配置するか？
```

最終的な核心フロー:

``` text
ユーザー入力
→ Event
→ handler
→ event.target.value
→ setter
→ State 更新
→ 再レンダリング
→ UI 反映
→ Form Submit
```
