# Day 20 最終復習プラン --- React 基礎の統合

> 復習範囲: Day 18〜20\
> Day 20 の役割: **新しい概念を増やさず、これまで学んだ内容を1つの React
> データフローとして統合する最後の復習**
>
> 最終環境: **Next.js + TypeScript**

## 1. 最終目標

``` text
ユーザー入力
→ Event
→ State
→ オブジェクト作成
→ 配列 State 更新
→ Props
→ map
→ UI
```

Day 18 と Day 19 を統合する。

``` text
Day 18
State / Array / Object / Spread / Props / map / key

        +

Day 19
Event / Form / Controlled Component / Event Type

        ↓

Day 20
小さな機能を最初から最後まで自力で実装
```

> **ヒント:**
> 成功基準は「見れば分かる」ではなく、「空ファイルから自分で構造を決められる」こと。

------------------------------------------------------------------------

## 2. Step A --- JavaScript 基礎の短い再テスト

確認範囲:

-   Array / Object
-   function / callback
-   `map`
-   `filter`
-   spread
-   destructuring
-   `event.target.value`
-   `Number()`

``` js
const products = [
  { id: 1, name: "キーボード", price: 50000 },
  { id: 2, name: "マウス", price: 30000 },
];

const nextProducts = [
  { id: 3, name: "モニター", price: 250000 },
  ...products,
];
```

自分で説明する:

``` text
spread は何をしている？
なぜ既存配列を直接変更しない？
map と filter の違いは？
input の "50000" を数値にするには？
```

> **ヒント:** JavaScript で詰まっている場合、React
> の問題として扱わない。

------------------------------------------------------------------------

## 3. Step B --- State / 不変更新

``` tsx
const [count, setCount] = useState(0);

setCount((prevCount) => prevCount + 1);
```

配列:

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

オブジェクト:

``` tsx
setForm((prevForm) => ({
  ...prevForm,
  name: "太郎",
}));
```

確認:

-   State と setter
-   State 更新 → 再レンダリング
-   前の State を使う関数型更新
-   Object / Array の不変更新

> **ヒント:** setter は単なる代入ではなく、React に State
> 更新を要求する。

------------------------------------------------------------------------

## 4. Step C --- Props / map / key

``` tsx
<ProductList products={products} />
```

``` tsx
products.map((product) => (
  <ProductItem
    key={product.id}
    product={product}
  />
));
```

関数 Props:

``` tsx
<ProductItem
  product={product}
  onDelete={handleDelete}
/>
```

流れ:

``` text
親 State
→ Props
→ 子
→ UI

子の操作
→ 関数 Props
→ 親 handler
→ 親 State 更新
```

> **ヒント:** State
> の場所に迷ったら「誰が変更するか」「誰が必要とするか」を考える。

------------------------------------------------------------------------

## 5. Step D --- Event / Controlled Component / Form

``` tsx
const [productName, setProductName] = useState("");

<input
  value={productName}
  onChange={handleProductNameChange}
/>
```

``` text
入力
→ change Event
→ onChange
→ handler
→ event.target.value
→ setter
→ State
→ 再レンダリング
```

Form:

``` tsx
<form onSubmit={handleSubmit}>
```

``` tsx
const handleSubmit = (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
};
```

> **ヒント:** 入力は `onChange`、送信は `onSubmit` と分けて考える。

------------------------------------------------------------------------

## 6. Step E --- TypeScript 最終確認

``` tsx
type Product = {
  id: number;
  name: string;
  price: number;
};

const [products, setProducts] = useState<Product[]>([]);
```

Event:

``` tsx
ChangeEvent<HTMLInputElement>
FormEvent<HTMLFormElement>
```

Props:

``` tsx
type ProductListProps = {
  products: Product[];
};
```

> **ヒント:** React の構造を先に決め、その値・Event・Props
> に型を付ける。

------------------------------------------------------------------------

## 7. Step F --- Next.js 最終確認

``` tsx
"use client";
```

今日の理解:

``` text
useState
+
Event handler
+
ブラウザでのユーザー操作
↓
Client Component
```

> **ヒント:** Day 20 では Next.js の新しい高度な機能へ進まない。React
> の基礎を現在の Next.js + TypeScript 環境で使えることが目的。

------------------------------------------------------------------------

## 8. メイン課題 --- 商品管理ミニアプリ

``` text
商品名 [             ]
価格   [             ]

[商品登録]

商品一覧
キーボード - 50000円
マウス - 30000円
```

登録すると新商品が一覧に追加される。

使用するもの:

-   `"use client"`
-   `useState`
-   Controlled Component
-   `onChange` / `onSubmit`
-   `preventDefault()`
-   Event types
-   `Product`
-   Array State / spread
-   Props
-   `map` / `key`

> **ヒント:** 全部を一度に書かない。

------------------------------------------------------------------------

## 9. 実装順序

### 1 --- Product 型

``` tsx
type Product = {
  id: number;
  name: string;
  price: number;
};
```

### 2 --- 入力 State

``` text
productName
price
```

### 3 --- Controlled input

商品名と価格を State に接続する。

### 4 --- Form submit

``` text
onSubmit
→ preventDefault()
→ 現在の入力値確認
```

### 5 --- newProduct

``` tsx
const newProduct: Product = {
  id: Date.now(),
  name: productName,
  price: Number(price),
};
```

### 6 --- 配列に追加

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

### 7 --- `map`

products を画面に表示する。

### 8 --- 動作後に Component 分割

``` text
ProductForm
ProductList
ProductItem
```

### 9 --- Props 接続

``` text
親 → ProductList → ProductItem
```

> **ヒント:** Component 分割はデータフロー完成後に行う。必要な Props
> が見えやすくなる。

------------------------------------------------------------------------

## 10. 選択課題 --- 削除

``` text
削除ボタン
→ product.id
→ 親 handler
→ filter
→ 新しい配列
→ setProducts
→ 再レンダリング
```

``` tsx
const handleDelete = (id: number) => {
  setProducts((prevProducts) =>
    prevProducts.filter((product) => product.id !== id)
  );
};
```

> **ヒント:** 登録機能を自力で作れない場合、削除機能は後回しにする。

------------------------------------------------------------------------

## 11. デバッグ分類

``` text
JavaScript/Web
→ value / spread / map / filter / Number

React
→ State / setter / Props / Controlled / key

TypeScript
→ Event / Product / Product[] / Props types

Next.js
→ Client Component / "use client"
```

> **ヒント:**
> エラーが出たらコードをランダムに変えず、まずどのレイヤーの問題か分類する。

------------------------------------------------------------------------

## 12. 最終口頭テスト

コードを見ずに説明する:

1.  State と Props
2.  不変更新
3.  spread
4.  `map` / `key`
5.  Controlled Component
6.  `onChange`
7.  `onSubmit` vs `onClick`
8.  `preventDefault()`
9.  `ChangeEvent<HTMLInputElement>`
10. `FormEvent<HTMLFormElement>`
11. number input の value
12. `"use client"`
13. Form → Product → products → UI
14. 関数 Props
15. 削除 → id → filter → State

> **ヒント:** 定義ではなく、データがどの順番で移動するかを説明する。

------------------------------------------------------------------------

## 13. 最終コーディングテスト

``` text
Level 1
input → State → UI

Level 2
name + email → Form → 送信結果

Level 3
product + price
→ Product
→ products State
→ map

Level 4
ProductForm / ProductList / ProductItem
→ Props 接続

Level 5（選択）
Delete
→ function Props
→ id
→ filter
→ State
```

> **ヒント:** Level 3 を答えなしで作れれば、Day 18〜20
> の中心フローはかなり定着している。

------------------------------------------------------------------------

## 14. 完了基準

-   [ ] State を自分で設計できる
-   [ ] Object / Array を不変更新できる
-   [ ] Props / function Props を説明できる
-   [ ] `map` / `key`を使える
-   [ ] Controlled input を作れる
-   [ ] Form submit を処理できる
-   [ ] Event type を書ける
-   [ ] Product / Product\[\] / Props に型を付けられる
-   [ ] `"use client"`を説明できる
-   [ ] Form 入力からオブジェクトを作れる
-   [ ] オブジェクトを配列 State に追加できる
-   [ ] Component を分割し Props を接続できる
-   [ ] 技術レイヤーを分類してデバッグできる

------------------------------------------------------------------------

## 15. Day 18 → 19 → 20

``` text
Day 18
データを管理・伝達・描画
↓
State / Object / Array / Spread / Props / map / key

Day 19
ユーザーからデータを受け取る
↓
Event / Controlled input / Form / Event Type

Day 20
全部を接続
↓
Form
→ State
→ Product
→ products
→ Props
→ map
→ UI
```

最終メンタルモデル:

``` text
ユーザー操作
→ Event
→ State 更新
→ データ構造更新
→ Props
→ Rendering
→ UI
```

------------------------------------------------------------------------

## 16. 推奨順序

``` text
1. JavaScript 再テスト 10〜15分
2. State / Object / Array / Spread
3. Props / map / key
4. Event / Form
5. TypeScript 型
6. 商品管理ミニアプリ
7. Component 分割
8. 選択: Delete
9. 口頭試験
10. 空ファイルから再実装
```

> **ヒント:** Day 20
> が終わったら、文法中心の復習から小さな機能・ミニプロジェクト中心の練習へ移る。
