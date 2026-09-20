# Day 18〜20 React 復習プラン

> 背景: Day 17 まで `fetch` を進め、その後 Day 18〜20 を React
> の核心復習期間として使う。\
> 現在のプロジェクト環境: **Next.js + TypeScript**
>
> 復習戦略: **概念は Vanilla JavaScript / React JavaScript
> で単純に理解し、必要な型を追加して、最終コードは Next.js + TypeScript
> で作成する。**

------------------------------------------------------------------------

# 全体原則

## 1. 4つの技術を同時に新しく学ばない

``` text
Vanilla JavaScript
→ Web / JavaScript の原理確認

React JavaScript
→ React の核心理解

React + TypeScript
→ 型を追加

Next.js + TypeScript
→ 実際のプロジェクト形式で最終実装
```

すべての問題を4バージョンで繰り返さない。

概念ごとに必要な層だけを使う。

> **ヒント:** コードが複雑になったら、各部分を
> `JavaScript / React / TypeScript / Next.js` に分類する。

------------------------------------------------------------------------

# Day 18 --- 復習①: State / Props / 配列 State

## 状態

**完了**

## 核心範囲

-   `useState`
-   State の配置判断
-   データ Props
-   関数 Props
-   Props の分割代入
-   コンポーネント間の handler 受け渡し
-   `map`
-   `filter`
-   Object Spread
-   配列 State のイミュータブル更新
-   `key` vs 通常 Props
-   既存値を使った更新

## 核心メンタルモデル

``` text
既存の配列全体
→ 現在の要素1つ
→ 条件確認
→ 対象だけ新しいオブジェクト
→ 新しい配列全体
→ Setter
```

関数 Props:

``` text
State を所有するコンポーネント
→ handler 作成
→ Props で渡す
→ 子で実行
→ 親 State 更新
→ 再レンダリング
```

## Day 18 で確認されたポイント

個別概念よりも、複数の概念が組み合わさったときに:

-   配列全体
-   要素1つ
-   新しい配列
-   handler 関数

の役割を区別することが重要。

### 今後

Day 18 の問題をすぐ繰り返さない。

Day 19〜20 で `map`、Spread、関数 Props
が自然に必要になったとき、思い出して使えるか確認する。

> **ヒント:** Day 18
> は概念ごとの補強段階。その後は同じ問題の暗記ではなく、別の状況への応用を見る。

------------------------------------------------------------------------

# Day 19 --- 復習②: Events / Forms

Day 19 は別の詳細プランに従う。

## 学習構造

``` text
Vanilla JS
Event の原理
↓
React JS
onChange / State / Controlled Component / Form
↓
React + TypeScript
ChangeEvent / FormEvent
↓
Next.js + TypeScript
Client Component で最終実装
```

## 核心範囲

-   `<input>`
-   `onChange`
-   Event オブジェクト
-   `event.target.value`
-   入力値 State
-   `value={state}`
-   Controlled Component
-   複数 input
-   `<form>`
-   `onSubmit`
-   `preventDefault()`
-   `ChangeEvent<HTMLInputElement>`
-   `FormEvent<HTMLFormElement>`
-   `"use client"`

## Day 18 との接続

可能なら Form からデータを作り、配列 State
に追加するところまでつなげる。

``` text
Form
→ ユーザー入力
→ 新しいオブジェクト作成
→ 配列 State に追加
→ map でレンダリング
```

これにより Day 18 の:

-   Spread
-   配列追加
-   Props
-   `map`
-   `key`

が自然に再登場する。

## Day 19 最終結果

簡単な商品登録 Form を **Next.js + TypeScript** で実装する。

> **ヒント:** 最終コードが TSX でも、最初から型と Next.js
> を同時に考えない。まず React
> の動作を設計し、その後に型と環境を追加する。

------------------------------------------------------------------------

# Day 20 --- 復習③: 総合ミニプロジェクト

Day 20 は個別クイズより、**小さな機能を最初から設計して実装する日**。

## プロジェクト例 --- Product Manager

最終実装環境:

``` text
Next.js
+
TypeScript
```

想定 UI:

``` text
商品名 [              ]
価格   [              ]

[商品追加]

-----------------------

キーボード
50,000
[+10,000] [削除]

マウス
30,000
[+10,000] [削除]
```

## 必要機能

### 商品追加

``` text
Form 入力
→ submit
→ 商品オブジェクト作成
→ products State に追加
```

### 価格変更

``` text
商品 id
→ map
→ 条件
→ Object Spread
→ 現在の price + 10000
→ 新しい配列
→ Setter
```

### 商品削除

``` text
商品 id
→ filter
→ 新しい配列
→ Setter
```

### 一覧表示

``` text
products
→ map
→ ProductCard
→ key
```

------------------------------------------------------------------------

# Day 20 実装ステップ

## Step 1 --- 要件だけを見て設計

コードを書く前に答える。

-   必要な State は？
-   State はどこに置く？
-   必要なコンポーネントは？
-   必要な handler は？
-   必要な Props は？
-   必要なデータ型は？

## Step 2 --- React 観点でデータフローを設計

例:

``` text
ProductManager
├─ ProductForm
└─ ProductList
   └─ ProductCard
```

可能な流れ:

``` text
ProductForm
→ onAdd
→ 親 State 更新

ProductCard
→ onIncrease
→ 親 State 更新

ProductCard
→ onDelete
→ 親 State 更新
```

## Step 3 --- React JS レベルで核心ロジックを書く

まず型構文に集中せず、ロジックを確認する。

-   追加
-   更新
-   削除
-   Props の受け渡し

## Step 4 --- TypeScript の型を追加

例:

``` tsx
type Product = {
  id: number;
  name: string;
  price: number;
};
```

関数 Props:

``` tsx
type ProductCardProps = {
  product: Product;
  onIncrease: (id: number) => void;
  onDelete: (id: number) => void;
};
```

## Step 5 --- Next.js 構造に配置

State / Event handler の境界を見て Client Component を決める。

必要な場所に:

``` tsx
"use client";
```

を使う。

高度な Next.js 機能を無理に追加しない。

## Step 6 --- 最終 TSX 実装

最終結果を **Next.js + TypeScript コード**として完成させる。

## Step 7 --- コード説明

完成後、各部分を分類する。

``` text
ここは JavaScript
ここは React
ここは TypeScript
ここは Next.js
```

そしてデータフローを説明する。

------------------------------------------------------------------------

# Day 20 評価基準

アプリが動くかだけでは評価しない。

### React

-   State の配置を説明できるか？
-   関数 Props の流れを説明できるか？
-   `map` と `filter` を適切に選べるか？
-   直接 mutation していないか？
-   Form の流れを理解しているか？

### TypeScript

-   データ型を定義できるか？
-   Props 型を読んで書けるか？
-   関数 Props の型を理解しているか？

### Next.js

-   Client Component が必要な理由を説明できるか？
-   React の概念と Next.js の機能を区別できるか？

> **ヒント:** TypeScript エラーが出ても React
> ロジックまで間違っているとは限らない。まず問題の層を分離する。

------------------------------------------------------------------------

# Day 18〜20 全体の流れ

``` text
Day 17
fetch まで既存進度
        ↓
────────────────────
復習期間
────────────────────
        ↓
Day 18
State / Props / 配列 State
概念別の弱点確認
        ↓
Day 19
Events / Forms
Vanilla → React → TS → Next.js TS
        ↓
Day 20
総合ミニプロジェクト
設計 → React ロジック → 型 → Next.js TS 最終実装
        ↓
────────────────────
復習終了
────────────────────
        ↓
Day 21
既存進度へ復帰
fetch 以降を継続
```

------------------------------------------------------------------------

# 学習量を増やしすぎない原則

次のようにはしない。

``` text
Vanilla で完成アプリ
+
React JS で同じ完成アプリ
+
React TS で同じ完成アプリ
+
Next.js TS で同じ完成アプリ
```

代わりに:

``` text
Vanilla
→ 原理確認用の小さなコード

React JS
→ 概念学習と核心練習

TypeScript
→ 型の違いだけ追加

Next.js TS
→ 最終成果物
```

とする。

これなら学習量を大きく増やさず、基本概念と現在のプロジェクトスタックを接続できる。

------------------------------------------------------------------------

# 復習終了後

Day 21
以降は復習のために技術を分離するのではなく、実際の進度で必要に応じて使う。

``` text
fetch
→ レスポンスデータ
→ TypeScript 型
→ React State
→ レンダリング
→ ユーザー Event
→ UI 更新
```

この流れの中で Day 18〜20 の内容を思い出せるか確認する。

> **ヒント:** 復習の最終目的は問題集が得意になることではない。実際の
> Next.js + TypeScript プロジェクトコードの中で React と JavaScript
> の原理を区別しながら使えるようになること。
