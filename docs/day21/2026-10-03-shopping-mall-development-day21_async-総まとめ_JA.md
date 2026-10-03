# Day 21 --- 非同期データフロー総まとめ

> 学習目標：**Promise → async/await → fetch → Response → JSON →
> 型付きデータ → React State → UI** の流れを理解し、実際の Next.js
> コードの中でも見つけられるようになる。

------------------------------------------------------------------------

## 1. 今日の核心フロー

``` text
API
↓
fetch()
↓
Promise<Response>
↓ await
Response
↓
response.ok を確認
↓
response.json()
↓
Promise<Data>
↓ await
Data
↓
React なら setState
↓
再レンダリング
↓
UI
```

これが今日の学習で最も重要な流れ。

------------------------------------------------------------------------

## 2. 同期と非同期

### 同期

前の処理が終わってから次の処理を実行する。

``` ts
console.log("A");
console.log("B");
```

結果：

``` text
A
B
```

### 非同期

`fetch()`
のように結果をすぐ受け取れない処理では、完了を待っている間にも他のコードを進められる。

``` ts
console.log("A");
fetch("/api/products");
console.log("B");
```

`console.log("B")` は `fetch()` の完了を待たない。

### 核心

`fetch()` は HTTP レスポンスをすぐには取得できないため、**Promise
を返す**。

------------------------------------------------------------------------

## 3. Promise

Promise は、非同期処理の「未来の結果」を表すオブジェクトとして理解する。

``` text
pending
  ↓
 ┌─────────────┐
 ↓             ↓
fulfilled    rejected
成功           失敗
```

例：

``` ts
const result = fetch("/api/products");
```

`result` は商品データではなく：

``` ts
Promise<Response>
```

である。

------------------------------------------------------------------------

## 4. async 関数

`async` 関数は常に Promise を返す。

``` ts
async function getNames() {
  return ["靴", "パンツ", "帽子"];
}
```

関数内部では `string[]` を return していても：

``` ts
const a = getNames();
```

`a` は概念的には：

``` ts
Promise<string[]>
```

になる。

一方：

``` ts
const b = await getNames();
```

`b` は：

``` ts
string[]
```

になる。

### 成功と失敗

``` text
async 関数

return 値
↓
Promise fulfilled
↓
値

throw Error
↓
Promise rejected
↓
Error
```

------------------------------------------------------------------------

## 5. await

`await` は Promise の結果を待ち、その結果を使えるようにする。

``` ts
const response = await fetch("/api/products");
```

流れ：

``` text
fetch("/api/products")
↓
Promise<Response>
↓
await
↓
Response
↓
response に代入
```

`await` 自体が Promise なのではない。

また、`await`
がプログラム全体を停止させると考えない。今の段階では、**現在の async
関数の中で Promise の結果を待つ**と理解すれば十分。

------------------------------------------------------------------------

## 6. fetch と Response

``` ts
const response = await fetch("/api/products");
```

`fetch()` が返すもの：

``` ts
Promise<Response>
```

`await` の後に得られるもの：

``` ts
Response
```

ここで重要なのは、`Response` はまだ `Product[]`
そのものではないということ。

------------------------------------------------------------------------

## 7. response.ok

HTTP レスポンスを受け取ったからといって、必ず成功とは限らない。

``` ts
if (!response.ok) {
  throw new Error("商品の取得に失敗しました");
}
```

`response.ok` は一般的に HTTP ステータスコードが **200〜299** の場合に
`true` になる。

サーバーが 404 や 500 を返しても、HTTP レスポンス自体を受け取れた場合は
`Response` オブジェクトを取得できる。そのため `response.ok` を確認する。

``` text
Response
↓
response.ok ?
├─ true  → 続行
└─ false → throw Error
```

------------------------------------------------------------------------

## 8. response.json() にも await が必要な理由

``` ts
const products: Product[] = await response.json();
```

`response.json()` も Promise を返す。

したがって：

``` text
fetch()
↓
Promise<Response>
↓ await
Response
↓
response.json()
↓
Promise<Data>
↓ await
Data
```

そのため、よく `await` が2回登場する。

``` ts
const response = await fetch("/api/products");
const products: Product[] = await response.json();
```

最初の `await` は HTTP
レスポンスを待ち、2つ目はレスポンス本文を読み取って JSON から JavaScript
データへ変換する処理を待つ。

------------------------------------------------------------------------

## 9. Product\[\] と UI の接続

``` ts
type Product = {
  id: number;
  title: string;
  price: number;
};
```

データ取得関数：

``` ts
async function getProducts() {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new Error("商品の取得に失敗しました");
  }

  const products: Product[] = await response.json();

  return products;
}
```

`await` なしで呼び出すと：

``` ts
const result = getProducts();
```

概念的には：

``` ts
Promise<Product[]>
```

実際の配列が必要なら：

``` ts
const products = await getProducts();
```

この後 `products` は：

``` ts
Product[]
```

として使える。

------------------------------------------------------------------------

## 10. Next.js Server Component での使用

App Router の Server Component
では、非同期データを待ってからレンダリングできる。

``` tsx
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main>
      <h1>商品一覧</h1>

      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.title}</h2>
          <p>{product.price.toLocaleString()}円</p>
        </div>
      ))}
    </main>
  );
}
```

流れ：

``` text
getProducts()
↓
Promise<Product[]>
↓ await
Product[]
↓
products.map()
↓
各 Product
↓
JSX
```

------------------------------------------------------------------------

## 11. Server Component と Client Component

今日は細かな規則より役割の違いを中心に理解する。

### Server Component をまず検討する場合

-   ページの初期表示時から必要なデータ
-   サーバー側で商品・注文データを取得する処理
-   ブラウザでの操作が不要な UI

### Client Component が必要になる代表例

-   `useState`, `useEffect` などの Client Hook
-   `onClick`, `onChange` などのユーザー操作
-   ユーザー操作によるブラウザ側の状態変更

``` text
ショッピングページ
│
├─ Server Component
│   └─ 初期商品データを取得
│
└─ Client Component
    ├─ カート追加ボタン
    ├─ 数量 + / -
    └─ 状態変更
```

`"use client"` をすべての子ファイルに必ず書くものと考えるより、**Client
境界を作る入口**として理解する。

------------------------------------------------------------------------

## 12. 実際の useOrders の流れ

プロジェクトでは次の State があった。

``` ts
const [orders, setOrders] = useState<Order[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

  State         役割
  ------------- ----------------------
  `orders`      注文データ
  `isLoading`   データ取得中かどうか
  `error`       エラーメッセージ

核心となる非同期コードは学習用コードとほぼ同じ。

``` ts
const response = await fetch("/api/orders");

if (!response.ok) {
  throw new Error(`注文一覧の取得に失敗: ${response.status}`);
}

const data: Order[] = await response.json();

setOrders(data);
```

流れ：

``` text
fetch("/api/orders")
↓
Promise<Response>
↓ await
Response
↓
response.ok
↓
response.json()
↓
Promise<Order[]>
↓ await
Order[]
↓
setOrders(data)
↓
orders State 変更
↓
React 再レンダリング
↓
orders.map()
↓
OrderCard
```

------------------------------------------------------------------------

## 13. return と setOrders の違い

通常のデータ関数では：

``` ts
const products: Product[] = await response.json();
return products;
```

呼び出し元へデータを返す。

``` text
Product[]
↓
return
↓
呼び出し元
```

React Client コードでは：

``` ts
const data: Order[] = await response.json();
setOrders(data);
```

State を更新する。

``` text
Order[]
↓
setOrders(data)
↓
State 変更
↓
再レンダリング
↓
UI 更新
```

------------------------------------------------------------------------

## 14. try / catch / finally

### try / catch

``` ts
try {
  // 非同期処理
} catch (error) {
  // エラー処理
}
```

`try` 内でエラーが発生したり `throw` が実行されたりすると、`catch`
で処理できる。

async 関数内部のエラーを捕まえなければ、その async 関数が返す Promise は
`rejected` になる。

### finally

``` ts
finally {
  setIsLoading(false);
}
```

`finally`
は成功・失敗に関係なく最後に実行されるため、ローディング状態の終了処理と相性がよい。

------------------------------------------------------------------------

## 15. useEffect --- 今日理解する範囲

実際のコード：

``` ts
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

今日は次の程度まで理解する。

-   `loadOrders` を定義しただけでは実行されない。
-   Client Component のレンダリング後に注文データ取得処理を開始する。
-   Effect はコンポーネントと外部システムを同期するために使う。
-   このコードでは `/api/orders` API と同期している。
-   `[loadOrders]` は、この Effect が `loadOrders`
    に依存していることを表す。

`useEffect = fetch` と暗記しない。fetch は Effect の利用例の一つ。

------------------------------------------------------------------------

## 16. useCallback --- 今日はここまで

実際のコード：

``` ts
const loadOrders = useCallback(async () => {
  // ...
}, []);
```

今日は次だけ覚える。

> `useCallback` はレンダリング間で `loadOrders`
> の関数参照を安定させ、その関数が `useEffect`
> の依存値として使われている。

細かな最適化の仕組みや関数参照の比較は今日の中心範囲ではない。

------------------------------------------------------------------------

# 今日の最終核心

``` text
fetch()
→ Promise<Response>

await fetch()
→ Response

response.json()
→ Promise<Data>

await response.json()
→ Data

async 関数の return
→ Promise fulfilled

async 関数内の未処理 throw
→ Promise rejected

setState(data)
→ State 変更
→ React 再レンダリング
→ UI 更新
```

実際のプロジェクトコードを見るときは：

``` text
1. fetch はどこにあるか？
2. await は何を待っているか？
3. response.ok を確認しているか？
4. response.json() の結果型は何か？
5. データを return するのか、State に保存するのか？
6. その State は JSX のどこで使われているか？
```

の順に追う。

------------------------------------------------------------------------

## 学習のまとめ

今日は **非同期データが API から React UI
までどのように流れるか**という大きな流れを理解することが最優先。
