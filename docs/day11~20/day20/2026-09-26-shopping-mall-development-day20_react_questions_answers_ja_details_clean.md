# Day 20 React基礎統合 --- 問題・解答集

> 範囲: Day 18〜20 / Next.js + TypeScript\
> 解答は各セクションの「解答を見る」をクリックすると表示されます。\
> 先に問題だけを解き、必要なときだけ解答を開く使い方を推奨します。

## JavaScript / Web基礎

### 問題

1.  配列とオブジェクトの違いを説明しなさい。
2.  配列内の`...products`は何をするか。
3.  `const next = ["C", ...["A", "B"]]`の結果は何か。
4.  `map`は元の配列を直接変更するか。
5.  `filter`のcallbackが`true`を返した要素はどうなるか。
6.  文字列`"50000"`を数値へ変換するコードを書きなさい。
7.  `input type="number"`でも`event.target.value`を文字列として扱う理由は何か。
8.  分割代入とは何か。
9.  `const { name } = { id: 1, name: "mouse" };`の`name`は何か。
10. callback関数とは何か。
11. 商品名だけの配列を作るときに使う配列メソッドは何か。
12. idが3ではない要素だけ残すときに使うメソッドと比較演算子は何か。

<details><summary><strong>解答を見る</strong></summary>

1.  配列は複数の値を順序付きで保持し、オブジェクトは関連する値をkey-value形式でまとめる。
2.  既存配列の各要素を新しい配列内へ展開する。
3.  `["C", "A", "B"]`
4.  変更しない。変換結果を新しい配列として返す。
5.  新しい配列に残る。
6.  `Number("50000")`
7.  HTML inputの`value`は文字列として取得されるため。
8.  オブジェクトや配列から必要な値を取り出して変数へ直接代入する構文。
9.  `"mouse"`
10. 別の関数へ渡され、特定のタイミングで実行される関数。
11. `map`
12. `filter`と`!==`

</details>

**ヒント:**
正解を暗記するより、なぜその構文が必要なのかをデータフローの中で説明できるようにする。

---

## State / setter

### 問題

13. Stateとは何か。
14. setterの役割は何か。
15. 通常の変数変更とState更新の重要な違いは何か。
16. `const [count, setCount] = useState(0);`でStateはどれか。
17. 同じコードでsetterはどれか。
18. 前のcountを基準に1増やすコードを書きなさい。
19. なぜ`count = count + 1`ではなくsetterを使うのか。
20. 関数型更新が特に有効なのはどんな場合か。
21. `setCount((prev) => prev + 1)`の`prev`は何か。
22. `useState<Product[]>([])`の`Product[]`は何を表すか。

<details><summary><strong>解答を見る</strong></summary>

13. コンポーネントが保持し、UIへ反映できるデータ。
14. ReactへState更新を依頼する。
15. setterによるState更新はReactの再レンダリング処理につながる。
16. `count`
17. `setCount`
18. `setCount((prevCount) => prevCount + 1);`
19. Reactに変更を認識させ、必要なUIを再レンダリングさせるため。
20. 次のStateが前のStateに依存するとき。
21. 直前のState値。
22. Productオブジェクトの配列。

</details>

**ヒント:**
正解を暗記するより、なぜその構文が必要なのかをデータフローの中で説明できるようにする。

---

## イミュータビリティ / Object / Array / Spread

### 問題

23. React Stateにおけるイミュータブル更新とは何か。
24. 商品追加で`products.push(newProduct)`より`setProducts`を使う理由は何か。
25. `{ ...form, name: "Taro" }`で同じnameが既に存在する場合、最終値は何か。
26. spreadの後ろに同じpropertyを書くと新しい値になる理由は何か。
27. オブジェクトStateのageだけ30へ変える基本形を書きなさい。
28. 新しい商品を配列の先頭へ追加する基本形を書きなさい。
29. 新しい商品を配列の末尾へ追加する基本形を書きなさい。
30. `[]`は何を作るか。
31. `{}`は何を作るか。
32. spreadは元の配列を削除する構文か。

<details><summary><strong>解答を見る</strong></summary>

23. 既存Stateを直接変更せず、新しい配列やオブジェクトを作って置き換える方法。
24. Stateを直接変更せずReactの更新処理を通すため。
25. `"Taro"`
26. 同じkeyが後で再定義されると後の値が採用されるため。
27. `setForm((prev) => ({ ...prev, age: 30 }));`
28. `setProducts((prev) => [newProduct, ...prev]);`
29. `setProducts((prev) => [...prev, newProduct]);`
30. 配列。
31. オブジェクト。
32. 違う。既存要素を新しい構造へ展開する構文。

</details>

**ヒント:**
正解を暗記するより、なぜその構文が必要なのかをデータフローの中で説明できるようにする。

---

## Product型 / TypeScript

### 問題

33. id:number、name:string、price:numberの`Product`型を書きなさい。
34. `Product`と`Product[]`の違いは何か。
35. `{ id: 1, name: "mouse", price: 30000 }`はProductとして正しいか。
36. `price: "50000"`がProductでエラーになる理由は何か。
37. `const newProduct: Product`の`: Product`は何のためか。
38. 空のProduct配列Stateを宣言しなさい。
39. `(id: number) => void`を説明しなさい。
40. `void`は空配列を意味するか。
41. Props型の`products: Product[]`は何を意味するか。
42. `type Product = [id: number, name: string, price: number]`は何型か。

<details><summary><strong>解答を見る</strong></summary>

33. `type Product = { id: number; name: string; price: number };`
34. 前者は商品1件、後者は商品オブジェクトの配列。
35. 正しい。
36. `price`の型がnumberなのにstringを渡しているため。
37. 値がProduct型の構造を満たすかTypeScriptに検査させるため。
38. `const [products, setProducts] = useState<Product[]>([]);`
39. numberを1つ受け取り、利用する戻り値がない関数型。
40. 意味しない。
41. products PropがProduct配列であることを意味する。
42. tuple型であり、オブジェクト型ではない。

</details>

**ヒント:**
正解を暗記するより、なぜその構文が必要なのかをデータフローの中で説明できるようにする。

---

## Controlled Component / Event

### 問題

43. Controlled Componentとは何か。
44. `<input value={productName} ...>`で表示値を制御するStateは何か。
45. 入力からStateまでの流れを答えなさい。
46. input変更Eventの型を書きなさい。
47. form Eventの型を書きなさい。
48. `event.target.value`とは何か。
49. 商品名変更handlerで呼ぶsetterは何か。
50. Controlled inputを空にするには何を変更するか。
51. 商品名と価格を初期化するコードを書きなさい。
52. `onChange`と`onSubmit`の役割の違いは何か。

<details><summary><strong>解答を見る</strong></summary>

43. React
    Stateがinput値を制御し、ユーザー変更をEvent経由でStateへ戻す方式。
44. `productName`
45. 入力 → change Event → onChange → handler → target.value → setter →
    State。
46. `ChangeEvent<HTMLInputElement>`
47. `FormEvent<HTMLFormElement>`
48. 現在のinputの文字列値。
49. `setProductName(e.target.value)`
50. inputに接続されたStateを空文字列へ更新する。
51. `setProductName(""); setPrice("");`
52. onChangeは入力変化、onSubmitはform送信を処理する。

</details>

**ヒント:**
正解を暗記するより、なぜその構文が必要なのかをデータフローの中で説明できるようにする。

---

## Form / Submit

### 問題

53. form送信handlerはどこへ接続するか。
54. なぜ`preventDefault()`を使うのか。
55. form handlerのEvent型は何か。
56. 複数入力をまとめて送信するときformを使う利点は何か。
57. `button type="submit"`の役割は何か。
58. 現在のproductNameとpriceからProductを作るときpriceに必要な処理は何か。
59. `Date.now()`は今回どこで使うか。
60. submit後に新商品を先頭へ追加するコードを書きなさい。

<details><summary><strong>解答を見る</strong></summary>

53. `<form onSubmit={handleSubmit}>`
54. ブラウザ既定のform送信動作を止めるため。
55. `FormEvent<HTMLFormElement>`
56. 入力群を1つの送信単位として扱え、form本来の送信動作も利用できる。
57. 所属するformのsubmitを発生させる。
58. `Number(price)`による数値変換。
59. 新しいProductのid生成。
60. `setProducts((prev) => [newProduct, ...prev]);`

</details>

**ヒント:**
正解を暗記するより、なぜその構文が必要なのかをデータフローの中で説明できるようにする。

---

## Props

### 問題

61. Propsの役割は何か。
62. `<ProductList products={products} />`を説明しなさい。
63. `products={products}`の左側は何か。
64. 同じ式の右側`{products}`は何か。
65. ProductListがProduct配列を受ける型を書きなさい。
66. Propsを分割代入で受け取るProductList宣言を書きなさい。
67. Product1件をProductItemへ渡すJSXを書きなさい。
68. ProductItemPropsの基本形を書きなさい。
69. 親Stateから子UIまでの流れを答えなさい。
70. Propsは子が自由に書き換える値として扱うか。

<details><summary><strong>解答を見る</strong></summary>

61. 親コンポーネントから子へ値や関数を渡す。
62. 親のproducts値をproductsというProp名でProductListへ渡す。
63. Prop名。
64. 実際に渡すJavaScript値。
65. `type ProductListProps = { products: Product[] };`
66. `function ProductList({ products }: ProductListProps) {}`
67. `<ProductItem product={product} />`
68. `type ProductItemProps = { product: Product };`
69. 親State → Props → 子コンポーネント → Rendering → UI。
70. 通常は親から受け取る読み取り用の入力として扱う。

</details>

**ヒント:**
正解を暗記するより、なぜその構文が必要なのかをデータフローの中で説明できるようにする。

---

## map / key / Rendering

### 問題

71. Reactのリスト表示で`map`を使う理由は何か。
72. `products.map((product) => ...)`のproduct型は何か。
73. productsの型は何か。
74. `products.map`でProductItemを返すときkeyには何を使えるか。
75. `key`が必要な理由は何か。
76. `product.id`がkeyに向いている理由は何か。
77. `key`は通常のPropとしてProductItemへ自動で渡されるか。
78. 今回の`map`はProduct自体を変更するか。
79. ProductListの主な役割は何か。
80. ProductItemの主な役割は何か。

<details><summary><strong>解答を見る</strong></summary>

71. 配列の各データをJSXへ変換するため。
72. `Product`
73. `Product[]`
74. `product.id`
75. Reactがリスト内の各項目を安定して識別するため。
76. 各商品を一意かつ安定して識別できるため。
77. 渡されない。
78. 変更しない。ProductをJSXへ変換する。
79. Product\[\]を受け取りmapで一覧を作る。
80. Product1件を受け取りUIとして表示する。

</details>

**ヒント:**
正解を暗記するより、なぜその構文が必要なのかをデータフローの中で説明できるようにする。

---

## 関数Props

### 問題

81. 関数もPropsとして渡せるか。
82. 削除関数の型`(id: number) => void`を説明しなさい。
83. AppのhandleDeleteをProductListへ渡すJSXを書きなさい。
84. ProductListPropsへ削除関数を追加しなさい。
85. ProductListからProductItemへ削除関数を渡すPropを書きなさい。
86. ProductItemPropsへ削除関数を追加しなさい。
87. 現在の商品idをクリック時に渡すbuttonを書きなさい。
88. なぜ`onClick={handleDelete(product.id)}`ではなくarrow
    functionを使うのか。
89. `() => handleDelete(product.id)`のarrow functionの役割は何か。
90. 子の操作が親Stateを変える流れを答えなさい。

<details><summary><strong>解答を見る</strong></summary>

81. 渡せる。
82. 削除対象idをnumberで受け取り、利用する戻り値がない関数。
83. `<ProductList products={products} handleDelete={handleDelete} />`
84. `handleDelete: (id: number) => void;`
85. `handleDelete={handleDelete}`
86. `handleDelete: (id: number) => void;`
87. `<button onClick={() => handleDelete(product.id)}>削除</button>`
88. レンダリング時の即時実行を避け、クリック時に呼び出すため。
89. 実際の削除呼び出しをクリック時まで遅らせる。
90. 子Event → 関数Props → 親handler → setter → 親State → Props → UI。

</details>

**ヒント:**
正解を暗記するより、なぜその構文が必要なのかをデータフローの中で説明できるようにする。

---

## 削除 / filter

### 問題

91. `products.filter(...)`だけでReact UIの削除が反映されない理由は何か。
92. 正しいhandleDeleteの基本形を書きなさい。
93. 削除対象idが2のとき`product.id !== id`がfalseになるのはどの商品か。
94. `filter`は元の配列を直接変更するか。
95. 削除で関数型更新を使う理由は何か。
96. 削除条件で`!==`を使う意味は何か。
97. filterが返すものは何か。
98. 削除buttonからUI更新までの流れを答えなさい。

<details><summary><strong>解答を見る</strong></summary>

91. 新しい配列を作るだけでStateへ保存していないため。
92. `setProducts((prev) => prev.filter((product) => product.id !== id));`
93. idが2の商品。
94. 変更しない。
95. 次のproductsが前のproductsから計算されるため。
96. 削除対象と異なるidだけを残すため。
97. 条件を通過した要素からなる新しい配列。
98. クリック → id → 関数Props → handleDelete → filter → setProducts →
    State → 再レンダリング → UI。

</details>

**ヒント:**
正解を暗記するより、なぜその構文が必要なのかをデータフローの中で説明できるようにする。

---

## Next.js / "use client"

### 問題

99. `"use client";`はどこに置くか。
100. 今回の学習範囲でClient Componentが必要な理由は何か。
101. StateとEventを使う今回の操作は主にどこで行われるか。
102. Day 20でNext.jsの高度な機能まで広げない理由は何か。

<details><summary><strong>解答を見る</strong></summary>

99. ファイルの先頭。
100. useStateやEvent handlerなどブラウザ上のユーザー操作を扱うため。
101. クライアント、つまりブラウザ側。
102. 目標がReact基礎のデータフロー統合だから。

</details>

**ヒント:**
正解を暗記するより、なぜその構文が必要なのかをデータフローの中で説明できるようにする。

---

## エラー修正

### 問題

103. 商品をオブジェクトとして扱うのにtuple型を書いてしまった。どう直すか。
104. `useState<[]>([])`をProduct配列Stateへ直しなさい。
105. `price: Number`の問題点は何か。
106. `setProductName(productName)`で入力が初期化されない理由は何か。
107. 削除handler内でfilterだけ呼ぶ問題点は何か。
108. Product型が既にある場合、ProductItemPropsでid/name/priceを再定義する必要はあるか。
109. `void`を空配列と説明するのはなぜ誤りか。
110. `setProduct`と`setProducts`を混同した場合、何を確認すべきか。

<details><summary><strong>解答を見る</strong></summary>

103. `type Product = { id: number; name: string; price: number };`
104. `useState<Product[]>([])`
105. Number関数そのものを入れている。`Number(price)`と呼び出す必要がある。
106. 現在値をそのまま再設定しているため。
107. 結果をsetterへ渡していないためStateが変わらない。
108. 通常は`product: Product`として再利用できる。
109. voidは関数の戻り値に関する型で、配列とは無関係。
110. useState宣言時のsetter名を確認する。

</details>

**ヒント:**
正解を暗記するより、なぜその構文が必要なのかをデータフローの中で説明できるようにする。

---

## コード作成

### 問題

111. Product型を書きなさい。
112. productName Stateを書きなさい。
113. price Stateを書きなさい。
114. products Stateを書きなさい。
115. 商品名change handlerのEvent型は何か。
116. 商品名change handlerでStateへ入れる値は何か。
117. 価格change handlerで呼ぶsetterは何か。
118. submit handlerのEvent型は何か。
119. submit handlerの最初に呼ぶ基本処理は何か。
120. newProductのidに使える値は何か。
121. newProductのnameには何を入れるか。
122. newProductのpriceには何を入れるか。
123. newProductを先頭へ追加するコードを書きなさい。
124. 入力初期化コードを書きなさい。
125. ProductListPropsを書きなさい。
126. mapでProductItemを表示する基本形を書きなさい。
127. ProductItemPropsを書きなさい。
128. ProductItemで商品名を表示する式は何か。
129. ProductItemで価格を表示する式は何か。
130. handleDeleteのState更新式を書きなさい。
131. 削除関数Propsの型を書きなさい。
132. 削除buttonのonClickを書きなさい。

<details><summary><strong>解答を見る</strong></summary>

111. `type Product = { id: number; name: string; price: number };`
112. `const [productName, setProductName] = useState("");`
113. `const [price, setPrice] = useState("");`
114. `const [products, setProducts] = useState<Product[]>([]);`
115. `ChangeEvent<HTMLInputElement>`
116. `e.target.value`
117. `setPrice`
118. `FormEvent<HTMLFormElement>`
119. `e.preventDefault()`
120. `Date.now()`
121. `productName`
122. `Number(price)`
123. `setProducts((prev) => [newProduct, ...prev]);`
124. `setProductName(""); setPrice("");`
125. `type ProductListProps = { products: Product[] };`
126. `products.map((product) => <ProductItem key={product.id} product={product} />)`
127. `type ProductItemProps = { product: Product };`
128. `{product.name}`
129. `{product.price}`
130. `setProducts((prev) => prev.filter((product) => product.id !== id));`
131. `handleDelete: (id: number) => void;`
132. `onClick={() => handleDelete(product.id)}`

</details>

**ヒント:**
正解を暗記するより、なぜその構文が必要なのかをデータフローの中で説明できるようにする。

---

## データフロー口頭試験

### 問題

133. 入力がStateへ入る流れを答えなさい。
134. StateからProductが作られる流れを答えなさい。
135. ProductがProduct\[\]へ入る流れを答えなさい。
136. Product\[\]がUIになる流れを答えなさい。
137. 削除クリックが親Stateへ届く流れを答えなさい。
138. Stateを空文字列へ戻すとinputも空になる理由は何か。
139. `Number(price)`はどの段階で必要か。
140. spreadはどの段階で必要か。
141. mapはどの段階で必要か。
142. filterはどの段階で必要か。
143. Propsはどの段階で必要か。

<details><summary><strong>解答を見る</strong></summary>

133. 入力 → Event → onChange → handler → target.value → setter → State。
134. submit → handler → 現在の入力State → Number変換 → newProduct。
135. newProduct → spreadで新配列 → setProducts → products State。
136. products → Props → ProductList → map → ProductItem → UI。
137. ProductItem → onClick → id → 関数Props → App handleDelete →
     setProducts。
138. inputのvalueがそのStateに接続されているため。
139. 入力Stateからnumber型priceを持つProductを作る段階。
140. 新Productと既存Product\[\]を新しい配列へまとめる段階。
141. Product\[\]をJSX一覧へ変換する段階。
142. 削除対象を除いた新しいProduct\[\]を作る段階。
143. 親のデータや関数を子へ渡す段階。

</details>

**ヒント:**
正解を暗記するより、なぜその構文が必要なのかをデータフローの中で説明できるようにする。

---

## 統合実践

### 問題

144. Level 1: 名前inputをControlled
     Componentで作り、入力値を`<p>`へ即時表示しなさい。
145. Level 2:
     名前とメールをState管理し、form送信後に結果を表示しなさい。
146. Level 3:
     商品名と価格からProductを作り、productsへ追加してmap表示しなさい。
147. Level 4: Level
     3をProductForm/ProductList/ProductItemへ分割しなさい。
148. Level 5: 削除機能を追加しなさい。
149. 新商品を一覧の末尾へ追加するにはどうするか。
150. 価格が0以下なら登録しない条件を書きなさい。
151. 商品名が空なら登録しない条件を書きなさい。
152. `入力 → Event → ____ → State → Product → ____ State → Props → map → UI`を埋めなさい。
153. ProductFormが必要とする主な値Propsを答えなさい。
154. ProductFormが必要とする主な関数Propsを答えなさい。

<details><summary><strong>解答を見る</strong></summary>

144. `useState("")`、`value`、`onChange`、`e.target.value`を使う。
145. 入力Stateと送信結果Stateを分ける方法などで実装できる。
146. Product型、Number(price)、setProducts、spread、mapを組み合わせる。
147. AppでState/handlerを管理し、必要なPropsを各子へ渡す。
148. AppのhandleDeleteを関数PropsでProductItemまで渡し、filterで更新する。
149. `setProducts((prev) => [...prev, newProduct]);`
150. 例: `if (Number(price) <= 0) return;`
151. 例: `if (productName.trim() === "") return;`
152. `handler`、`products`
153. `productName`と`price`。
154. 商品名change、価格change、submitの各handler。

</details>

**ヒント:**
正解を暗記するより、なぜその構文が必要なのかをデータフローの中で説明できるようにする。

---

## 最終チェック

### 問題

155. StateとPropsの違いは何か。
156. setterが必要な理由は何か。
157. イミュータビリティとは何か。
158. spreadとは何か。
159. mapとは何か。
160. filterとは何か。
161. Controlled Componentとは何か。
162. `event.target.value`の型は通常何か。

<details><summary><strong>解答を見る</strong></summary>

155. Stateはコンポーネントが管理する状態、Propsは親から子へ渡される入力。
156. ReactのState更新と再レンダリングにつなげるため。
157. 既存データを直接変更せず新しいデータ構造を作る考え方。
158. 既存の配列要素やオブジェクトpropertyを新しい構造へ展開する構文。
159. 各要素を変換して新しい配列を返すメソッド。
160. 条件がtrueの要素だけで新しい配列を返すメソッド。
161. Stateがinput値を制御するReactの入力管理方式。
162. `string`

</details>

**ヒント:**
正解を暗記するより、なぜその構文が必要なのかをデータフローの中で説明できるようにする。

---
