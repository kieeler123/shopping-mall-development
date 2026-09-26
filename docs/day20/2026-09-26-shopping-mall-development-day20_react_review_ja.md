# Day 20 React基礎統合 --- 理論総まとめ

> 範囲: Day 18〜20\
> 環境: Next.js + TypeScript\
> 目標:
> ユーザー入力からUIレンダリングまで、Reactのデータフローを一つにつなげて理解する。

## 1. 全体のデータフロー

``` text
ユーザー入力
→ Event
→ handler
→ State
→ Productオブジェクト作成
→ products配列Stateを更新
→ Props
→ map
→ ProductItem
→ UI
```

削除のように子コンポーネントから操作が始まる場合:

``` text
子のEvent
→ 関数Props
→ 親のhandler
→ 親のState更新
→ Props
→ 子UIの再レンダリング
```

**ヒント:** 文法を一列で暗記するより、まず
`入力 → State → オブジェクト → 配列 → Props → レンダリング`
という大きな流れをつかむ。

## 2. Stateとsetter

``` tsx
const [productName, setProductName] = useState("");
const [price, setPrice] = useState("");
const [products, setProducts] = useState<Product[]>([]);
```

-   Stateはコンポーネントが覚えておく値。
-   setterはReactにState更新を依頼する関数。
-   Stateが変わると、Reactは必要なUIを再レンダリングする。
-   前のStateを使って次のStateを計算するときは関数型更新を使う。

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

**ヒント:**
通常の変数代入とState更新を区別する。UIに反映させたい値はsetterで更新する。

## 3. イミュータブル更新とspread

配列やオブジェクトのStateを直接変更せず、新しい配列・オブジェクトを作る。

配列への追加:

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

オブジェクト更新:

``` tsx
setForm((prevForm) => ({
  ...prevForm,
  name: "Taro",
}));
```

`...prevProducts`は既存配列の要素を新しい配列に展開する。`...prevForm`は既存オブジェクトのプロパティを新しいオブジェクトへコピーする。

**ヒント:** `setState(prev => 次の値)`
を骨格として覚え、その中で新しい配列・オブジェクトを作る。

## 4. Array: mapとfilter

### map

`map`は配列の各要素を別の値へ変換し、新しい配列を返す。

``` tsx
products.map((product) => (
  <ProductItem
    key={product.id}
    product={product}
  />
));
```

ここでは `Product → JSX` に変換している。

### filter

`filter`は条件が`true`になった要素だけを集め、新しい配列を返す。

``` tsx
setProducts((prevProducts) =>
  prevProducts.filter((product) => product.id !== id)
);
```

削除対象とidが異なる商品は残り、同じidの商品は除外される。

**ヒント:**
`filter = 削除`ではない。正確には「条件を通過した要素だけで新しい配列を作る」。

## 5. ProductとProduct\[\]

``` tsx
type Product = {
  id: number;
  name: string;
  price: number;
};
```

-   `Product`: 商品オブジェクト1件
-   `Product[]`: Productオブジェクトが複数入った配列

``` tsx
const [products, setProducts] = useState<Product[]>([]);
```

**ヒント:**
単数の`product`は1件、複数形の`products`は配列、と結び付けると読みやすい。

## 6. 入力値からProductを作る

``` tsx
const newProduct: Product = {
  id: Date.now(),
  name: productName,
  price: Number(price),
};
```

`input type="number"`でも`event.target.value`は文字列として扱う。最終的な`Product.price`が`number`なら`Number(price)`で変換する。

**ヒント:**
入力中のデータ型と、完成したデータモデルの型は同じでなくてもよい。

## 7. Controlled Component

``` tsx
<input
  type="text"
  value={productName}
  onChange={handleChangeProductName}
/>
```

流れ:

``` text
ユーザー入力
→ change Event
→ onChange
→ handler
→ event.target.value
→ setter
→ State
→ 再レンダリング
→ value={State}
```

Stateがinputの表示値を制御し、ユーザーの変更はEventを通してStateへ戻る。

入力のリセット:

``` tsx
setProductName("");
setPrice("");
```

`value={State}`なのでStateを空文字列に戻すとinputも空になる。

**ヒント:** Controlled
ComponentではDOMを直接操作せず、値の元であるStateを変更する。

## 8. EventとEvent型

input変更:

``` tsx
const handleChangeProductName = (
  e: ChangeEvent<HTMLInputElement>
) => {
  setProductName(e.target.value);
};
```

Form送信:

``` tsx
const handleSubmit = (
  e: FormEvent<HTMLFormElement>
) => {
  e.preventDefault();
};
```

-   `ChangeEvent<HTMLInputElement>`: input変更Event
-   `FormEvent<HTMLFormElement>`: form Event
-   `preventDefault()`: ブラウザ既定のform送信動作を止める

**ヒント:** まず `入力 = onChange`、`送信 = onSubmit` と分けて考える。

## 9. onSubmitとonClick

Form全体を送信するとき:

``` tsx
<form onSubmit={handleSubmit}>
```

特定ボタンのクリック処理:

``` tsx
<button onClick={() => handleDelete(product.id)}>
  削除
</button>
```

`onClick={() => handleDelete(product.id)}`はクリック時に現在の商品idを削除関数へ渡す。

**ヒント:** クリック時に引数付きで関数を呼ぶなら `() => 関数(引数)`
を思い出す。

## 10. Props

親から子へデータを渡す。

``` tsx
<ProductList products={products} />
```

読み方:

``` text
products={products}
    ↑         ↑
Props名      渡す値
```

親の`products` Stateを`products`というProps名で渡している。

**ヒント:**
JSXの`xxx={yyy}`は「`xxx`というProps名で`yyy`を渡す」と読む。

## 11. Props型と分割代入

``` tsx
type ProductListProps = {
  products: Product[];
};

function ProductList({ products }: ProductListProps) {
  // ...
}
```

`{ products }`はPropsオブジェクトから`products`を取り出す分割代入。

商品1件を受け取るコンポーネント:

``` tsx
type ProductItemProps = {
  product: Product;
};

function ProductItem({ product }: ProductItemProps) {
  return (
    <div>
      <p>{product.name}</p>
      <p>{product.price}</p>
    </div>
  );
}
```

**ヒント:**
コンポーネント内で必要だが、そのコンポーネント自身が持っていない値を探すとProps候補が見える。

## 12. 関数Props

関数もPropsとして渡せる。

``` tsx
type ProductItemProps = {
  product: Product;
  handleDelete: (id: number) => void;
};
```

関数型:

``` text
(id: number) => void
```

-   `id: number`: 受け取る値
-   `void`: 利用する戻り値がない

流れ:

``` text
AppのhandleDelete
→ ProductListの関数Props
→ ProductItemの関数Props
→ ボタンクリック
→ handleDelete(product.id)
→ Appのhandler実行
```

**ヒント:** 関数型は `(何を受け取るか) => 何を返すか` に分けて読む。

## 13. Component分割

最終構造:

``` text
App
├── ProductForm
├── ProductList
│   └── ProductItem
```

役割:

-   `App`: Stateと主要handlerを管理
-   `ProductForm`: 入力・送信UI
-   `ProductList`: `Product[]`を受け取り`map`
-   `ProductItem`: `Product`1件を受け取りUI表示

**ヒント:**
最初から細かく分割しすぎない。まず動作させ、必要なPropsが見えてから分ける。

## 14. mapとkey

``` tsx
products.map((product) => (
  <ProductItem
    key={product.id}
    product={product}
  />
));
```

-   `map`: 各ProductをJSXへ変換
-   `key`: Reactがリスト項目を識別するための特別な値
-   `key`は通常のPropsのように子で受け取るデータではない

**ヒント:**
安定して一意な識別子である`product.id`をkeyに使うパターンを覚える。

## 15. 商品追加パターン

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

共通の流れ:

``` text
前のState
→ 新しい配列を計算
→ setter
→ State変更
→ 再レンダリング
```

**ヒント:** 追加は「新しい項目 + 既存項目」で新しい配列を作ると考える。

## 16. 商品削除パターン

``` tsx
const handleDelete = (id: number) => {
  setProducts((prevProducts) =>
    prevProducts.filter((product) => product.id !== id)
  );
};
```

流れ:

``` text
削除ボタン
→ product.id
→ 関数Props
→ 親のhandleDelete
→ filter
→ 新しいProduct[]
→ setProducts
→ 再レンダリング
```

`products.filter(...)`だけでは新しい配列を作るだけでStateは変わらないため、UIも変化しない。

**ヒント:**
Reactで新しいデータを計算したら「この結果をどのsetterへ渡すか？」まで考える。

## 17. Next.jsの"use client"

``` tsx
"use client";
```

今回の範囲では、`useState`、Event
handler、ブラウザ上のユーザー操作を使うコンポーネントはClient
Componentとして扱う。

**ヒント:** Day 20ではNext.jsの高度な機能より、Next.js +
TypeScript環境でReact基礎を正しく使うことに集中する。

## 18. デバッグをレイヤーで分類

``` text
JavaScript / Web
→ value, Number, spread, map, filter

React
→ State, setter, Props, Controlled Component, key

TypeScript
→ Product, Product[], Event型, Props型, 関数型

Next.js
→ "use client"
```

**ヒント:**
エラーが出たら無作為にコードを変えず、まずどのレイヤーの問題か分類する。

## 19. 重要コードパターン6個

### 入力

``` tsx
onChange={handleChange}

const handleChange = (
  e: ChangeEvent<HTMLInputElement>
) => {
  setState(e.target.value);
};
```

### オブジェクト作成

``` tsx
const newProduct: Product = {
  id: Date.now(),
  name: productName,
  price: Number(price),
};
```

### 配列へ追加

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

### Propsを渡す

``` tsx
<ProductList products={products} />
```

### リスト表示

``` tsx
products.map((product) => (
  <ProductItem
    key={product.id}
    product={product}
  />
));
```

### 削除

``` tsx
setProducts((prevProducts) =>
  prevProducts.filter((product) => product.id !== id)
);
```

**ヒント:**
アプリ全体を暗記せず、この6パターンがそれぞれ何の問題を解決するか結び付けて覚える。

## 20. 最終的な思考モデル

``` text
入力
→ State
→ オブジェクト
→ 配列State
→ Props
→ map
→ UI
```

さらに詳しく:

``` text
ユーザー操作
→ Event
→ handler
→ setter
→ State変更
→ データ構造変更
→ Props
→ Rendering
→ UI
```

子から親のStateを変更したい場合:

``` text
子のEvent
→ 関数Props
→ 親のhandler
→ 親のState
→ Props
→ 子UI
```

**ヒント:**
詰まったら完成コードをすぐ探すのではなく、「今はこのデータフローのどの段階を書いているのか？」を先に確認する。
