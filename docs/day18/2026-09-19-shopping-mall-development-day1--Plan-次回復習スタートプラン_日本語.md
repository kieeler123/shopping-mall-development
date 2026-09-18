# Day 18 次回復習スタートプラン

## 目的

次回は最初からやり直すのではなく、今回の復習で確認できた地点から再開する。

現在の重要な診断ポイント：

-   基本的な `useState`、Event、`map`、`filter` は使用できる。
-   配列Stateの追加・削除は自力実装できる。
-   `map + 条件 + Object Spread`
    によるオブジェクト配列更新は最初に詰まったが、再テストでは自力実装できた。
-   `key` はReactのリスト識別用であり、通常のPropsではない。
-   データPropsの基本は理解している。
-   **関数Propsは明確な強化ポイント。**
-   Stateは常に最上位ではなく、そのStateを必要とするコンポーネントの適切な共通親に置く。
-   コードは書けても、各構文の正確な役割を説明するときに時間がかかる。
-   要件の細かいUI条件を実装時に少し変えてしまうことがある。

> **ヒント:**
> 次回は説明を読み直してからではなく、まず問題を解く。思い出せない部分だけ前回のまとめを確認する。

## STEP 1 --- 関数Propsの再テスト

新しい例で、ヒントなしに次を判断する。

``` text
親Component
├─ State
├─ Stateを変更するhandler
└─ 子Component
   └─ 実際のButton
```

確認事項：Stateの場所、handlerを作る場所、子へ渡すProps、子で関数を実行する場所、最終的に変更されるState。

``` text
親でhandler作成
↓
関数をPropsで子へ渡す
↓
子のEventで実行
↓
親のhandler実行
↓
親State更新
↓
Re-render
```

> **ヒント:** `onDelete={handleDelete}`
> を暗記せず、Stateを持つ場所とEventが起きる場所が違うため関数を渡す、と考える。

## STEP 2 --- Stateの位置を自分で決める

``` text
このデータを誰が使う？
↓
1つのComponentだけ？
→ そのComponent付近

複数Component？
↓
共通親はどこ？
→ 必要なところまでStateを上げる
```

Local State、共通親、Lifting State
Up、データProps、関数Propsを再確認する。

> **ヒント:** 「最上位に置く」ではなく **必要な分だけ上に置く**。

## STEP 3 --- `map + 条件 + Object Spread` の再テスト

``` js
const users = [
  { id: 1, name: "A", active: false },
  { id: 2, name: "B", active: false },
];
```

要件：id 2 の `active` だけ `true`
にし、元の配列・オブジェクトは直接変更しない。

``` text
id + map + 条件 + Object Spread + property override + Setter
```

> **ヒント:** **対象を探す → 新しいデータを作る → Stateを更新する**
> の順で考える。

## STEP 4 --- `key` と通常Propsの再確認

``` jsx
<Item key={item.id} item={item} onDelete={handleDelete} />
```

``` text
key → React用。通常Propsではない
item → データProps
onDelete → 関数Props
```

> **ヒント:** `key={id}` と `onDelete(id)`
> は同じidを使っていても役割が違う。

## STEP 5 --- 要件から設計する

コードを書く前に、画面、変化するデータ、Event、Component分割、State位置、データProps、関数Propsを自分で決める。

> **ヒント:**
> 空のプロジェクトで詰まる原因を調べるため、JSXを書く前の設計段階を観察する。

## STEP 6 --- 小さなComponent分割課題

``` text
商品一覧
- 商品名
- 価格
- [+10]
- [削除]
```

最低限：

``` text
App
└─ ProductList
   └─ ProductCard
```

`products`
State、`onDelete`、`onPriceIncrease`、`key`、Eventから親State更新までを設計する。

> **ヒント:**
> 完成コードだけでなく、なぜStateとhandlerをその場所に置いたか説明する。

## STEP 7 --- 説明力の再テスト

``` text
① 機能の目的
② 変化するデータ
③ Stateの位置と理由
④ 対象の識別
⑤ データ変換
⑥ State更新
⑦ Re-renderとUI反映
```

> **ヒント:** **目的 → データ → 変換 → 更新 → UI** の流れで説明する。

## STEP 8 --- 次へ進む基準

関数Props、State位置、immutableなオブジェクト配列更新、`key`とPropsの区別、要件からのComponent設計が安定したら次へ進む。

``` text
Events / Forms
↓
Custom Hooks
↓
localStorage
↓
Product → Cart → Order
↓
TypeScript
↓
Next.js
↓
HTTP / API
↓
Async JavaScript
↓
HTTP → React State
↓
useEffect
```

> **ヒント:** 再テストで使えれば進み、後の問題で再登場させる。

## 次回最初の一問

``` text
App
├─ cart State
├─ Header
│  └─ cartの商品数を表示
└─ ProductList
   └─ ProductCard
      └─ [カートに追加] Button
```

1.  cart Stateはどこに置く？
2.  Headerへ何をPropsで渡す？
3.  ProductCardから追加する関数はどこで作り、どう渡す？
4.  Button clickからUI更新までを説明する。

**最初はコードを書かず、設計を説明する。**

> **ヒント:**
> 次回も正解・不正解だけでなく、どこで考える時間が長くなるかを記録する。
