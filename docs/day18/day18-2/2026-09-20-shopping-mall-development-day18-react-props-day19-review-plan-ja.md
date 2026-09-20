# Day 19 React 復習プラン --- Events & Forms

> 復習期間: Day 18〜20\
> Day 19 の役割: **Events / Forms の復習 + Vanilla → React → TypeScript
> → Next.js TypeScript の接続**
>
> 原則:
> 同じ内容を4回繰り返さない。**概念は最も単純な層で理解し、最終実装は現在のプロジェクト環境である
> Next.js + TypeScript に接続する。**

------------------------------------------------------------------------

## 1. 今日の主要目標

Day 19 終了時に、次の流れを自分で説明・実装できることを目標とする。

``` text
ユーザー入力
→ Event 発生
→ 入力値を確認
→ React State を更新
→ UI に反映
→ Form を送信
```

さらに、同じ機能を4つの層に分けて見られるようにする。

``` text
Vanilla JavaScript
→ Web / Event の原理

React JavaScript
→ State と UI の接続

React + TypeScript
→ 既存 React コードに型を追加

Next.js + TypeScript
→ 実際のプロジェクト環境で最終実装
```

> **ヒント:** 詰まったら、今の問題が
> JavaScript・React・TypeScript・Next.js
> のどの層なのかを最初に分類する。

------------------------------------------------------------------------

# 2. Step A --- Vanilla JavaScript で Event の原理を確認

Vanilla の学習は短くする。

確認する内容:

-   `<input>` の値
-   `input` / `change` Event
-   Event オブジェクト
-   `event.target`
-   input 要素の `value`
-   form の標準 submit 動作
-   `preventDefault()`

例:

``` js
const input = document.querySelector("input");

input.addEventListener("input", (event) => {
  console.log(event.target.value);
});
```

理解する流れ:

``` text
ユーザーが入力
→ ブラウザ Event
→ Event が発生した要素
→ 現在の value
```

### 確認

-   `event.target.value` は React 専用なのか？
-   Event は誰が作って渡すのか？
-   input の値はどこから読むのか？

> **ヒント:** Vanilla DOM コードを完全に暗記する必要はない。React Event
> の下にあるブラウザの仕組みを理解できれば十分。

------------------------------------------------------------------------

# 3. Step B --- React JavaScript で核心を復習

Day 19 で最も時間を使う部分。

## 3-1. onChange

``` jsx
function App() {
  const handleChange = (event) => {
    console.log(event.target.value);
  };

  return <input onChange={handleChange} />;
}
```

流れ:

``` text
入力
→ onChange
→ handler
→ event
→ event.target.value
```

## 3-2. 入力値を State に保存

``` jsx
const [text, setText] = useState("");

const handleChange = (event) => {
  setText(event.target.value);
};
```

``` text
input
→ onChange
→ setText
→ State 更新
→ 再レンダリング
```

## 3-3. Controlled Component

``` jsx
<input
  value={text}
  onChange={handleChange}
/>
```

2つの方向を分ける。

``` text
value={text}
State → input

onChange
input → State
```

## 3-4. 複数 input

最初は別々の State で管理する。

``` jsx
const [name, setName] = useState("");
const [email, setEmail] = useState("");
```

Object State は基本の流れが安定してから扱う。

## 3-5. form / onSubmit

``` jsx
<form onSubmit={handleSubmit}>
```

``` jsx
const handleSubmit = (event) => {
  event.preventDefault();
};
```

違いを説明する。

``` text
onClick
→ 特定要素のクリック Event

onSubmit
→ Form 全体の送信 Event
```

> **ヒント:** React JS の流れが曖昧なら TypeScript へ進まない。React
> の概念問題と型問題を同時に解決しようとしない。

------------------------------------------------------------------------

# 4. React JS ミニ練習

## 練習1 --- 名前をリアルタイム表示

``` text
名前 [          ]

現在の入力: Taro
```

使用するもの:

-   `useState`
-   `value`
-   `onChange`
-   `event.target.value`

## 練習2 --- 名前を送信

``` text
名前 [          ]

[登録]

登録された名前: Taro
```

使用するもの:

-   Controlled input
-   `<form>`
-   `onSubmit`
-   `preventDefault()`
-   入力中の State
-   送信結果の State

## 練習3 --- 名前 + メール

``` text
名前   [          ]
メール [          ]

[登録]
```

送信後に2つの値を表示する。

> **ヒント:** 一度に全部書かず、`名前 input → email input → submit`
> の順に拡張する。

------------------------------------------------------------------------

# 5. Step C --- React + TypeScript に変換

React JS の実装を理解した後、**型だけを追加**する。

## ChangeEvent

JavaScript:

``` jsx
const handleChange = (event) => {
  setText(event.target.value);
};
```

TypeScript:

``` tsx
import type { ChangeEvent } from "react";

const handleChange = (
  event: ChangeEvent<HTMLInputElement>
) => {
  setText(event.target.value);
};
```

確認:

``` text
ChangeEvent
→ React の change Event 型

HTMLInputElement
→ Event が発生する input 要素の型
```

## FormEvent

``` tsx
import type { FormEvent } from "react";

const handleSubmit = (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
};
```

React の動作自体は変わらない。

``` text
React JS
handleSubmit(event)

React + TS
handleSubmit(event: FormEvent<HTMLFormElement>)
```

### 型の目標

-   `ChangeEvent<HTMLInputElement>`
-   `FormEvent<HTMLFormElement>`
-   State の型推論
-   必要な場合の Object 型

> **ヒント:** TypeScript では「新しい React
> 文法は何？」ではなく「既存の値の型をどう表現した？」を見る。

------------------------------------------------------------------------

# 6. Object Form State --- 必要な場合のみ

基本の input の流れが安定したら:

``` tsx
type FormData = {
  name: string;
  email: string;
};

const [form, setForm] = useState<FormData>({
  name: "",
  email: "",
});
```

更新:

``` tsx
setForm((prevForm) => ({
  ...prevForm,
  name: event.target.value,
}));
```

ここで Day 18 の **Object Spread** が自然に再登場する。

``` text
既存オブジェクト
→ Spread でコピー
→ 変更するプロパティを上書き
→ 新しいオブジェクト
→ Setter
```

> **ヒント:** Object Form を覚えることだけが目的ではない。Day 18
> のイミュータブル更新を別の状況でも思い出せるか確認する。

------------------------------------------------------------------------

# 7. Step D --- Next.js + TypeScript で最終適用

最終版は実際のプロジェクト環境に合わせる。

``` tsx
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

export default function UserForm() {
  const [name, setName] = useState("");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setName(event.target.value);
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    console.log(name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={handleChange}
      />

      <button type="submit">
        登録
      </button>
    </form>
  );
}
```

## Next.js で確認すること

-   なぜ `"use client"` が必要なのか？
-   `useState` と Event handler を使うコンポーネントが Client Component
    になる理由は？
-   React で学んだ State / Event の原理は Next.js でもどう維持されるか？

高度な Next.js 機能には広げない。

> **ヒント:** Day 19 は App Router 全体を学ぶ日ではない。React Form
> を実際の Next.js プロジェクトファイルで使えるようにする日。

------------------------------------------------------------------------

# 8. Day 18 の自然な再テスト

Day 19 で次のような処理が必要になったら:

``` text
Form 入力
→ 商品オブジェクト作成
→ products 配列に追加
→ ProductList に渡す
→ map で表示
```

自然に次を確認する:

-   配列 State
-   Spread
-   Props
-   関数 Props
-   `map`
-   `key`

答えを見る前に思い出して適用する。

------------------------------------------------------------------------

# 9. Day 19 最終課題

## 簡単な商品登録 Form

最終コードは **Next.js + TypeScript** で作成する。

要件:

``` text
商品名 [          ]
価格   [          ]

[商品登録]

登録結果
商品名: キーボード
価格: 50000
```

実装前に決める:

1.  必要な State は？
2.  必要な Event は？
3.  必要な handler は？
4.  必要な型は？
5.  なぜ Client Component なのか？

実装順序:

``` text
React の観点で設計
↓
React JS レベルで動作を理解
↓
必要な型を追加
↓
Next.js Client Component として最終実装
```

------------------------------------------------------------------------

# 10. Day 19 完了基準

次を自分で説明できること:

-   ブラウザ Event と React Event の関係
-   `onChange`
-   `event.target.value`
-   State と input の接続
-   Controlled Component
-   `onSubmit`
-   `preventDefault()`
-   `ChangeEvent<HTMLInputElement>`
-   `FormEvent<HTMLFormElement>`
-   `"use client"` が必要な理由

コードが複雑に見えたら:

``` text
JavaScript?
React?
TypeScript?
Next.js?
```

と分類できること。

------------------------------------------------------------------------

# 11. Day 19 学習順序

``` text
Vanilla JS
Event の原理だけ短く確認
↓
React JS
Forms の核心に集中
↓
React + TypeScript
Event 型を追加
↓
Next.js + TypeScript
最終 Form 実装
```

同じ内容を4回繰り返すわけではない。

``` text
Vanilla = 原理
React = 核心理解
TypeScript = 型
Next.js TS = 最終実践
```

> **ヒント:** Day 19 の中心は React JS。最終コードは Next.js + TS
> でも、理解の中心は React の State / Event の流れに置く。
