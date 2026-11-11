# Day 21 学習プラン --- Promiseの復習からfetch、ECサイトの商品データへ

> 環境: Next.js + TypeScript\
> 開始地点: Promiseを学習していた途中で、最後の`fetch`付近で中断。\
> Day 21の役割:
> React基礎から非同期データ処理へ進み、ECサイト開発に必要なデータフローをつなげる。\
> 方針:
> 新しい概念を一度に増やさず、`Promise → async/await → fetch → JSON → 商品データ`の順に進める。

## 1. Day 21の最終目標

``` text
商品データが必要
→ fetch()
→ Promise
→ await
→ Response
→ response.json()
→ JavaScriptデータ
→ Product[]
→ UI
```

Day 20との接続:

``` text
Day 20
ユーザー操作 → Event → State → Props → Rendering → UI

Day 21
Server/API → fetch → Promise → await → JSON → data → UI
```

> **ヒント:**
> Promiseの構文を大量に暗記するより、`fetch`がなぜ最終データをすぐ返さないのかを理解することが重要。

------------------------------------------------------------------------

## 2. Step A --- 同期・非同期の復習

確認内容:

-   同期コードの実行順序
-   非同期処理が必要な理由
-   ネットワーク通信には時間がかかること
-   後から届く結果をどう扱うか

``` ts
console.log("A");
fetch("/api/products");
console.log("B");
```

確認問題:

``` text
なぜネットワーク通信の結果を通常の変数のように即座に使えないのか。
```

> **ヒント:**
> 最初は非同期処理を「完了まで時間がかかる処理」と理解すれば十分。内部実装まで一気に掘り下げない。

------------------------------------------------------------------------

## 3. Step B --- Promiseの重要部分を復習

確認:

-   Promiseとは何か
-   pending
-   fulfilled
-   rejected
-   `.then()`
-   `.catch()`

``` ts
const promise = fetch("/api/products");
```

``` text
fetchを実行
→ Promiseを受け取る
→ 結果を待つ
→ fulfilled または rejected
```

`.then()`形式も読めるようにする。

``` ts
fetch("/api/products")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
```

Day
21では`.then()`の全パターンを覚えるのではなく、Promiseの流れを理解するために使う。

> **ヒント:**
> Promiseは「将来、成功または失敗という結果が決まる非同期処理を扱うオブジェクト」というイメージから始める。

------------------------------------------------------------------------

## 4. Step C --- async / await

Promiseを読みやすい形で扱う。

``` ts
async function getProducts() {
  const response = await fetch("/api/products");
}
```

確認:

-   `async`関数
-   `await`
-   `await`の対象にはPromiseが来ることが多い
-   async関数内でPromiseの結果を待つ

比較:

``` ts
fetch("/api/products").then((response) => {
  // ...
});
```

``` ts
const response = await fetch("/api/products");
```

> **ヒント:**
> `.then()`と`await`を完全に別物として覚えない。どちらもPromiseの結果を扱う方法。

------------------------------------------------------------------------

## 5. Step D --- fetchを重点的に学ぶ

Day 21の中心部分。

``` ts
const response = await fetch("API URL");
```

この時点では商品配列そのものではない。

``` text
fetch()
→ Promise<Response>
→ await
→ Responseオブジェクト
```

確認:

-   `fetch()`はPromiseを返す
-   `await fetch()`の結果は`Response`
-   ResponseにはHTTPレスポンスの情報が含まれる
-   実際のJSONデータは別途読み取る必要がある

> **ヒント:** `response = 商品データ`と考えないことが重要。

------------------------------------------------------------------------

## 6. Step E --- response.json()

``` ts
const response = await fetch("API URL");
const data = await response.json();
```

流れ:

``` text
fetch
→ Response
→ response.json()
→ Promise
→ await
→ JavaScriptデータ
```

確認:

-   JSONとは何か
-   `response.json()`も非同期処理
-   response bodyをJavaScriptで扱えるデータへ変換する

> **ヒント:**
> `await`が2回ある理由を説明できるようにする。1回目はHTTPレスポンス、2回目はresponse
> bodyの解析を待つ。

------------------------------------------------------------------------

## 7. Step F --- TypeScriptと商品データ

ECサイトで使う型を定義する。

``` ts
type Product = {
  id: number;
  title: string;
  price: number;
};
```

目標:

``` ts
const products: Product[] = ...
```

確認:

-   Product
-   Product\[\]
-   実際のAPIレスポンス構造
-   APIデータとTypeScript型の関係

> **ヒント:**
> APIの構造を先に想像して型を決めつけない。実際のレスポンスを確認してから必要な型を定義する。

------------------------------------------------------------------------

## 8. Step G --- 基本的なエラー処理

``` ts
async function getProducts() {
  try {
    const response = await fetch("API URL");
    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

さらに確認:

``` ts
if (!response.ok) {
  throw new Error("Failed to fetch products");
}
```

> **ヒント:**
> 最初から複雑なエラーUIを作らない。まず成功時のデータと失敗経路を区別できればよい。

------------------------------------------------------------------------

## 9. Step H --- ECサイトの商品データへ接続

練習目標:

``` text
API
→ fetch
→ Response
→ json
→ Product[]
→ map
→ 商品一覧
```

Day 20で学んだ`map`を再利用する。

``` tsx
products.map((product) => (
  <div key={product.id}>
    <p>{product.title}</p>
    <p>{product.price}</p>
  </div>
));
```

新しい部分は`products`の取得元。

``` text
Day 20
アプリ内で作ったproducts

Day 21
Server/APIから取得したproducts
```

> **ヒント:**
> 既に知っている`Product[] → map → UI`の前に、`fetch`というデータの入口が追加されたと考える。

------------------------------------------------------------------------

## 10. Step I --- Next.jsでfetchする場所を区別

Day 21では深く入りすぎず、次の違いを認識する。

``` text
Server側でデータ取得
vs
Client Componentでデータ取得
```

まず`async/await + fetch`そのものを理解し、その後Next.jsのデータ取得方法へ接続する。

確認問題:

``` text
なぜこの関数はasyncなのか。
fetchは何を返すのか。
await fetchの結果は何か。
response.json()はなぜ必要か。
最終的なproductsの型は何か。
```

> **ヒント:**
> 最初から`useEffect`まで混ぜるとfetch自体が分かりにくくなりやすい。まず純粋なfetchの流れを固める。

------------------------------------------------------------------------

## 11. メイン課題 --- 商品APIを読み取る

``` ts
type Product = {
  id: number;
  title: string;
  price: number;
};

async function getProducts() {
  const response = await fetch("API URL");

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const products: Product[] = await response.json();

  return products;
}
```

コードを見ずに説明する:

1.  なぜ関数に`async`が付くのか。
2.  `fetch()`は何を返すのか。
3.  最初の`await`は何を待つのか。
4.  `response`は商品配列なのか。
5.  `response.json()`は何をするのか。
6.  2回目の`await`はなぜ必要か。
7.  `products`の型は何か。
8.  returnされたproductsをどこで利用できるか。

> **ヒント:** コード全体を暗記せず、各行の「入力 → 出力」を説明する。

------------------------------------------------------------------------

## 12. 選択課題 --- 商品一覧UI

fetchの流れを理解してから進める。

``` text
getProducts()
→ Product[]
→ 商品一覧
→ map
→ ProductItem
```

Day 20の構造を再利用:

``` text
Product[]
→ ProductList
→ map
→ ProductItem
```

> **ヒント:** デザインには時間をかけない。Day
> 21の目的はAPIからUIまでデータが届くことを確認すること。

------------------------------------------------------------------------

## 13. デバッグの層を分類

``` text
JavaScript
→ Promise / async / await / JSON

Web
→ HTTP / Response / response.ok

TypeScript
→ Product / Product[] / APIデータ型

React
→ map / Props / 必要に応じてState

Next.js
→ Server / Client / fetchする場所
```

> **ヒント:**
> 「fetchが動かない」と一括りにせず、どの層でデータフローが止まったかを確認する。

------------------------------------------------------------------------

## 14. Day 21 口頭試験

コードを見ずに説明する。

1.  同期と非同期
2.  Promise
3.  pending / fulfilled / rejected
4.  `.then()`
5.  `.catch()`
6.  `async`
7.  `await`
8.  `fetch()`
9.  `Response`
10. `response.ok`
11. `response.json()`
12. JSON
13. `try / catch`
14. ProductとProduct\[\]
15. API → Product\[\]
16. Product\[\] → map → UI
17. fetchでawaitが必要な理由
18. response.json()でawaitが必要な理由
19. Day 20のproductsとDay 21のproductsの違い
20. ECサイトでfetchが必要な理由

> **ヒント:**
> `fetch → await → response → json → data`を止まらず説明できれば中心的な流れは理解できている。

------------------------------------------------------------------------

## 15. Day 21 コーディング試験

``` text
Level 1
Promiseコードを読んで実行の流れを説明

Level 2
async / awaitで簡単なPromiseを処理

Level 3
fetch → Response

Level 4
fetch → response.json() → data

Level 5
Product型を接続

Level 6
基本的なエラー処理

Level 7
Product[] → map → UI

Level 8
空ファイルからECサイトの商品データフローを再構築
```

> **ヒント:** Level 4まで迷わず書けるようになってからReact
> UIと組み合わせる。

------------------------------------------------------------------------

## 16. 完了基準

-   [ ] 同期と非同期を説明できる。
-   [ ] Promiseの役割を説明できる。
-   [ ] pending / fulfilled / rejectedを説明できる。
-   [ ] `.then()`のコードを読める。
-   [ ] async / awaitを説明できる。
-   [ ] `fetch()`がPromiseを返すことを理解している。
-   [ ] `await fetch()`の結果がResponseだと理解している。
-   [ ] `response.json()`が必要な理由を説明できる。
-   [ ] `response.ok`を確認できる。
-   [ ] try/catchの役割を説明できる。
-   [ ] APIデータへProduct型を接続できる。
-   [ ] Product\[\]をmapでUIへ表示できる。
-   [ ] API → fetch → JSON → Product\[\] → UIを説明できる。

------------------------------------------------------------------------

## 17. 推奨学習順序

``` text
1. 同期 / 非同期の復習
2. Promiseの復習
3. then / catchを読む
4. async / await
5. fetch
6. Response
7. response.json()
8. response.ok + try/catch
9. Product型
10. 商品データをmapで表示
11. 口頭試験
12. 空ファイルからfetchの流れを再実装
```

重点の目安:

``` text
Promise復習          15%
async / await        20%
fetch / Response     25%
JSON / Error         15%
TypeScript Product   10%
ECサイトUI接続       15%
```

> **ヒント:** Day
> 21終了後は実際の商品一覧ページへ進み、同じデータ取得フローを繰り返し使うとよい。

------------------------------------------------------------------------

## 18. Day 20 → Day 21 → ECサイト

``` text
Day 20
React内部のデータフロー
Event → State → Props → UI

        ↓

Day 21
外部データの流れ
API → fetch → Promise → await → JSON → Product[]

        ↓

ECサイト
Product[]
→ 商品一覧
→ 商品カード
→ 商品詳細
→ その後、カートなどへ拡張
```

Day 21の最終的な思考手順:

``` text
データはどこにあるか。
→ どうやって取得するか。
→ 結果はいつ届くか。
→ どのように変換するか。
→ 型は何か。
→ React UIでどう使うか。
```
