# Day 21 --- 非同期データフロー学習記録（会話ベース詳細版）

> 今日の目標は、単に `fetch` の書き方を暗記することではなく、**Promise →
> async/await → fetch → Response → JSON → 型付きデータ → React State →
> UI** が実際のコードでどうつながっているのかを理解することだった。

------------------------------------------------------------------------

## 1. 出発点：なぜ `fetch()` があっても JavaScript は待たないのか？

最初に見たのは、とてもシンプルなコードだった。

``` ts
console.log("A");
fetch("/api/products");
console.log("B");
```

ここで重要だった疑問は：

> 真ん中に `fetch()` があるのに、なぜリクエストが終わるまで待ってから
> `"B"` を表示しないのか？

`fetch()`
はネットワーク通信を行う。ネットワークのレスポンスがすぐ届く保証はない。もしレスポンスが来るまで
JavaScript
のすべての処理を止めてしまうと、画面や他の処理まで止まる可能性がある。

そのため `fetch()` は最終結果をその場で返すのではなく、**Promise**
を返す。

``` ts
const result = fetch("/api/products");
```

この時点の `result` は商品配列ではない。

概念的には：

``` ts
Promise<Response>
```

である。

流れは：

``` text
fetch()
↓
リクエスト開始
↓
Promise<Response> をすぐ返す
↓
JavaScript は次のコードを続けられる
```

### 今日の最初の核心

`fetch()` が返すのは **データそのものではなく、将来 Response を受け取る
Promise** である。

------------------------------------------------------------------------

## 2. Promise とは何か？

Promise という言葉は最初は抽象的に感じやすい。

今日は次のように理解した。

> **今はまだ結果がないが、将来「成功した値」または「失敗したエラー」が決まる非同期処理を表すオブジェクト**

代表的な状態：

``` text
pending
↓
まだ結果が決まっていない

fulfilled
↓
成功して結果が得られた

rejected
↓
失敗してエラーになった
```

たとえば：

``` ts
fetch("/api/products")
```

を実行した直後は、まだ通信が終わっていないため `pending`
の可能性がある。

HTTP レスポンスを正常に受け取れば Promise は `fulfilled`
になり、その結果として `Response` を得る。

ネットワーク自体の失敗などでリクエストを実行できなければ `rejected`
になることがある。

------------------------------------------------------------------------

## 3. `await` 自体が Promise なのか？

ここは特に混乱しやすかったポイント。

``` ts
const response = await fetch("/api/products");
```

一見すると `await` が非同期オブジェクトを作っているようにも見える。

しかし核心は：

> **Promise を返すのは `fetch()` であり、`await` はその Promise
> の結果を待つための構文。**

つまり：

``` text
fetch("/api/products")
↓
Promise<Response>
↓
await
↓
現在の async 関数の続きが結果を待つ
↓
Response
↓
response に代入
```

この一行：

``` ts
const response = await fetch("/api/products");
```

は、

> 「`fetch()` が `Promise<Response>` を返し、`await`
> がその完了を待ち、完成した `Response` が `response` に入る」

と読むとよい。

また `await` が JavaScript 全体を止めるわけではない。今の段階では
**現在の async 関数の続きが Promise の結果を待つ** と理解すれば十分。

------------------------------------------------------------------------

## 4. 一度 `await` したのに、なぜまた `await` するのか？

次のコードは最初、不思議に見える。

``` ts
const response = await fetch("/api/products");
const products: Product[] = await response.json();
```

1行目ですでに待ったのに、なぜ2行目でも待つのか？

理由は、**別々の非同期処理**だから。

まず：

``` ts
fetch("/api/products")
```

の戻り値は：

``` ts
Promise<Response>
```

なので：

``` ts
const response = await fetch("/api/products");
```

で `Response` を得る。

しかし `Response` はまだ `Product[]` そのものではない。

次にレスポンス本文を読み取り、JSON を JavaScript
データに変換する必要がある。

``` ts
response.json()
```

これも Promise を返す。

``` text
response.json()
↓
Promise<Data>
```

そのため：

``` ts
const products: Product[] = await response.json();
```

ともう一度待つ。

全体：

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

### とても重要なポイント

2つの `await` は同じものを2回待っているのではない。

1つ目は **HTTP レスポンス**、2つ目は **レスポンス本文を読み取り JSON を
JavaScript データに変換する処理**を待っている。

------------------------------------------------------------------------

## 5. 変数にはいつ値が入るのか？

``` ts
const products: Product[] = await response.json();
```

`response.json()` がまだ終わっていない間、`products`
に仮の値が先に入るわけではない。

概念的には：

``` text
response.json()
↓
Promise
↓
await が待つ
↓
Promise 完了
↓
パースされたデータができる
↓
その時点で products に代入
```

この行が完了した後、`products` を結果データとして使える。

------------------------------------------------------------------------

## 6. async 関数で配列を return したのに、なぜ外では Promise なのか？

``` ts
async function getProducts() {
  const response = await fetch("/api/products");
  const products: Product[] = await response.json();

  return products;
}
```

関数内部では：

``` ts
return products;
```

なので `Product[]` を返しているように見える。

しかし重要なルールがある。

> **async 関数は必ず Promise を返す。**

したがって：

``` ts
const result = getProducts();
```

の `result` は概念的には：

``` ts
Promise<Product[]>
```

になる。

一方：

``` ts
const products = await getProducts();
```

なら Promise の完了を待つので：

``` ts
Product[]
```

を得る。

関数内部：

``` text
return Product[]
↓
async 関数なので
↓
Promise<Product[]> fulfilled
```

呼び出し側：

``` text
getProducts()
↓
Promise<Product[]>
↓ await
Product[]
```

------------------------------------------------------------------------

## 7. `.then()` と `await` の関係

Promise の扱い方は `await` だけではない。

``` ts
fetch("/api/products")
  .then((response) => {
    return response.json();
  })
  .then((products) => {
    console.log(products);
  });
```

最初の `.then()` が受け取るのは `Response`。

``` text
fetch()
↓
Promise<Response>
↓
最初の then
↓
Response
```

そこで：

``` ts
return response.json();
```

とすると、`response.json()` が返す Promise が次のチェーンにつながる。

``` text
response.json()
↓
Promise<Data>
↓
次の then
↓
Data
```

`async/await` なら同じ大きな流れを：

``` ts
const response = await fetch("/api/products");
const products = await response.json();
```

のように上から下へ読みやすく書ける。

------------------------------------------------------------------------

## 8. アロー関数の `return` も重要だった

``` ts
.then((response) => response.json())
```

中括弧のない expression body では式の結果が暗黙的に return される。

一方：

``` ts
.then((response) => {
  response.json();
})
```

では中括弧を使っているのに明示的な `return` がない。

そのため次の `.then()` に渡る値が `undefined` になる可能性がある。

必要なら：

``` ts
.then((response) => {
  return response.json();
})
```

と書く。

------------------------------------------------------------------------

## 9. `.catch()` とエラーの流れ

Promise が失敗した場合は `.catch()` で処理できる。

``` ts
fetch("/api/products")
  .then(...)
  .catch((error) => {
    console.error(error);
  });
```

`async/await` では：

``` ts
try {
  // await ...
} catch (error) {
  // エラー処理
}
```

という形で考えられる。

------------------------------------------------------------------------

## 10. 404 や 500 なら `fetch()` は自動的に失敗するのか？

ここでは重要な誤解を整理した。

サーバーが 404 や 500 を返したからといって、通常 `fetch()` の Promise
が自動的に `rejected` になるわけではない。

HTTP レスポンス自体を受け取れていれば `Response`
オブジェクトを得られる。

そのため：

``` ts
const response = await fetch("/api/products");

if (!response.ok) {
  throw new Error("商品の取得に失敗しました");
}
```

のように確認する。

`response.ok` は一般的に HTTP ステータスコード 200〜299 で `true`。

``` text
fetch()
↓
Response を受信
↓
response.ok を確認
├─ true  → 通常処理を続行
└─ false → 自分で throw
```

ネットワーク接続そのものの失敗などは `fetch()` の Promise が reject
する代表例。

------------------------------------------------------------------------

## 11. `new Error()` と `throw` は役割が違う

``` ts
throw new Error("商品の取得に失敗しました");
```

この一行には2つの処理がある。

``` ts
new Error("商品の取得に失敗しました")
```

は Error オブジェクトを作る。

そして：

``` ts
throw
```

はその Error をエラーの流れに投げる。

``` text
new Error(...)
↓
Error オブジェクト作成

throw
↓
その Error を投げる
```

`try/catch` があれば：

``` ts
try {
  throw new Error("失敗");
} catch (error) {
  console.log(error);
}
```

`catch` で受け取れる。

------------------------------------------------------------------------

## 12. async 関数で throw するとどうなるのか？

``` ts
async function getProducts() {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new Error("商品の取得に失敗しました");
  }

  return await response.json();
}
```

内部で `throw` が実行され、それを内部で catch しなければ：

``` text
async 関数
↓
throw
↓
返される Promise
↓
rejected
```

になる。

つまり：

``` text
return 値
→ fulfilled

未処理の throw
→ rejected
```

とつながる。

------------------------------------------------------------------------

## 13. `try / catch / finally`

実際のプロジェクトでは：

``` ts
try {
  const response = await fetch("/api/orders");

  if (!response.ok) {
    throw new Error(`注文一覧の取得に失敗: ${response.status}`);
  }

  const data: Order[] = await response.json();

  setOrders(data);
} catch (error: unknown) {
  setError(getErrorMessage(error));
} finally {
  setIsLoading(false);
}
```

成功時：

``` text
try
↓
fetch
↓
response.ok
↓
json()
↓
Order[]
↓
setOrders(data)
↓
finally
↓
setIsLoading(false)
```

失敗時：

``` text
try
↓
エラー / throw
↓
catch
↓
setError(...)
↓
finally
↓
setIsLoading(false)
```

`finally` は成功・失敗に関係なく必要な後処理に向いている。

------------------------------------------------------------------------

## 14. 最初の getProducts で見落としやすかった点

最初は：

``` ts
async function getProducts() {
  const res = await fetch("/api/products");

  if (res.ok) {
    const products: Product[] = await res.json();
    return products;
  }
}
```

のように書くこともできる。

しかし `res.ok` が `false` の場合、明示的に値を返さないため `undefined`
の可能性が出る。

そこで：

``` ts
async function getProducts() {
  const res = await fetch("/api/products");

  if (!res.ok) {
    throw new Error("商品データを取得できませんでした。");
  }

  const products: Product[] = await res.json();

  return products;
}
```

のように失敗を先に処理すると分かりやすい。

成功なら `Product[]`、失敗なら Error の流れになる。

------------------------------------------------------------------------

## 15. Product\[\] が実際の UI まで届く流れ

Next.js ページに接続した。

``` tsx
type Product = {
  id: number;
  title: string;
  price: number;
};

async function getProducts() {
  const res = await fetch("/api/products");

  if (!res.ok) {
    throw new Error("商品リクエスト失敗");
  }

  const products: Product[] = await res.json();

  return products;
}

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

全体：

``` text
API
↓
fetch
↓
Promise<Response>
↓ await
Response
↓
response.json()
↓
Promise<Product[]>
↓ await
Product[]
↓
return
↓
getProducts() の Promise<Product[]>
↓ await
Product[]
↓
products.map()
↓
JSX
↓
UI
```

ここで今日の非同期理論が実際の Next.js レンダリングにつながった。

------------------------------------------------------------------------

## 16. Server Component と Client Component

Next.js の Server / Client の違いも確認した。

今日の判断基準：

### Server をまず考える場合

ページの初期表示時から必要で、サーバー側で取得してレンダリングできるデータ。

``` text
商品ページに入る
↓
商品データが必要
↓
サーバーで取得
↓
HTML/UI を生成
```

### Client が必要な場合

ブラウザ上でユーザー操作を処理する機能。

``` tsx
<button onClick={...}>カートに追加</button>
```

または：

``` tsx
<select onChange={...}>
```

`useState`, `useEffect` のような Client Hook を使う場合も Client
領域が必要。

ただし `Link` や `Image` を使うだけで自動的に Client Component
になるわけではない。

------------------------------------------------------------------------

## 17. ProductCard と OrderCard の比較

`ProductCard` は商品情報を受け取り、主に表示する役割だった。

``` tsx
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <li>
      <Link href={`/products/${product.id}`}>
        <h2>{product.name}</h2>
        <span>{product.salePrice.toLocaleString()}円</span>
        <p>{product.description}</p>
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
        />
      </Link>
    </li>
  );
}
```

自身に `onClick`, `onChange`, `useState` などのブラウザ操作はなかった。

一方 `OrderCard` には：

``` tsx
<select
  value={order.status}
  onChange={(e) => {
    onStatusChange(order.id, e.target.value as OrderStatus);
  }}
>
```

があった。

`onChange` はブラウザ上でユーザーが選択を変更したときに動くので Client
環境が必要。

ただし重要なのは、**OrderCard ファイル自体に必ず `"use client"`
が必要という意味ではない**こと。

Client Component の親から import されていれば、その Client module graph
の中で使われる。

------------------------------------------------------------------------

## 18. 実際の AdminOrdersPage

親ページ：

``` tsx
"use client";

export default function AdminOrdersPage() {
  const { orders, isLoading, error, updateOrderStatus } = useOrders();

  // ...
}
```

すでに `"use client"` がある。

そして：

``` ts
const { orders, isLoading, error, updateOrderStatus } = useOrders();
```

で注文データや更新関数を取得する。

``` tsx
orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
    onStatusChange={updateOrderStatus}
  />
))
```

で各注文を表示する。

------------------------------------------------------------------------

## 19. 実際の useOrders の中から今日の理論を探す

実際のコードは最初、学習用コードとは違って見えた。

しかし React の周辺コードを一旦外して見ると：

``` ts
const response = await fetch("/api/orders");

if (!response.ok) {
  throw new Error(`注文一覧の取得に失敗: ${response.status}`);
}

const data: Order[] = await response.json();

setOrders(data);
```

今日の理論コード：

``` ts
const response = await fetch("/api/products");

if (!response.ok) {
  throw new Error("商品リクエスト失敗");
}

const products: Product[] = await response.json();

return products;
```

対応させると：

``` text
理論                           実プロジェクト

fetch("/api/products")    →    fetch("/api/orders")
await                     →    await
Response                  →    Response
response.ok               →    response.ok
throw                     →    throw
response.json()           →    response.json()
Product[]                 →    Order[]
return products           →    setOrders(data)
```

つまり今日学んだ非同期理論は、すでに実際の Next.js
プロジェクトに使われていた。

------------------------------------------------------------------------

## 20. `return products` と `setOrders(data)` が違って見えた理由

理論では：

``` ts
return products;
```

実際の Client コードでは：

``` ts
setOrders(data);
```

しかしデータを取得する部分までは同じ。

``` text
fetch
↓
await
↓
Response
↓
json
↓
await
↓
Data
```

違うのは **取得したデータをその後どう使うか**。

通常のデータ関数：

``` text
Product[]
↓
return
↓
呼び出し元へ渡す
```

React Client State：

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

## 21. なぜ `setOrders(data)` が必要なのか？

``` ts
const [orders, setOrders] = useState<Order[]>([]);
```

ここで：

``` text
orders
→ 現在の State を読む

setOrders
→ State 更新を要求する
```

API から `Order[]` を受け取っただけでは React の UI
が自動的にそのデータを使うわけではない。

``` ts
const data: Order[] = await response.json();
setOrders(data);
```

で State を更新する。

その後：

``` text
Order[]
↓
setOrders(data)
↓
orders State 変更
↓
React 再レンダリング
↓
AdminOrdersPage が新しい orders を使う
↓
orders.map()
↓
OrderCard
```

となる。

------------------------------------------------------------------------

## 22. なぜ `useEffect` が登場したのか？

`loadOrders` を定義しただけでは実行されない。

``` ts
const loadOrders = async () => {
  // fetch...
};
```

実行するには呼び出す必要がある。

``` ts
loadOrders();
```

しかしコンポーネントのレンダリング中に State
を変更する非同期処理を直接始めると、繰り返しレンダリングなどの問題につながり得る。

実際のコードでは：

``` ts
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

を使っていた。

今日の理解：

> **レンダリング後に、コンポーネントと外部システムを同期する処理を実行する
> React Hook**

このプロジェクトでは外部システムが `/api/orders` API。

``` text
Client Component レンダリング
↓
useEffect
↓
loadOrders()
↓
fetch()
↓
Order[]
↓
setOrders()
↓
再レンダリング
```

`useEffect = fetch` と暗記しない。fetch は Effect の利用例の一つ。

------------------------------------------------------------------------

## 23. `[loadOrders]` は何か？

``` ts
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

Effect 内部で外側の `loadOrders` を使っている。

そのため dependency array に：

``` ts
[loadOrders]
```

がある。

今日は：

> **この Effect が `loadOrders` に依存しているという宣言**

として理解した。

------------------------------------------------------------------------

## 24. `useCallback` は今日どこまで分かればよいか？

実際のコード：

``` ts
const loadOrders = useCallback(async (): Promise<void> => {
  // ...
}, []);
```

しかし今日の中心は Promise、async/await、fetch、JSON、データフロー。

そのため `useCallback` は深く掘らなかった。

現時点では：

> `loadOrders` の関数参照をレンダリング間で安定させ、その関数が
> `useEffect` の dependency として使われている。

程度で十分。

関数参照、最適化、stale closure などは必要になった時に学ぶ。

------------------------------------------------------------------------

## 25. `void loadOrders()` の `void`

`loadOrders` は async 関数なので、呼び出すと Promise を返す。

``` ts
loadOrders();
```

概念的には：

``` ts
Promise<void>
```

Effect では：

``` ts
void loadOrders();
```

と書いていた。

今日は：

> `loadOrders()` を実行するが、ここでは返される Promise
> の値を利用しないことを明示している。

と理解した。

`void` を付けても `loadOrders` が同期関数になるわけではない。

------------------------------------------------------------------------

## 26. `Promise<void>` とは？

`loadOrders` は非同期処理を行うが、呼び出し元へ `Order[]` を return せず
State を更新する。

``` ts
const loadOrders = async (): Promise<void> => {
  // ...
  setOrders(data);
};
```

したがって：

``` text
非同期処理
↓
State 更新
↓
データ値の return はない
↓
Promise<void>
```

データを返す関数なら：

``` ts
async function getProducts(): Promise<Product[]> {
  return products;
}
```

のように `Promise<Product[]>` になる。

------------------------------------------------------------------------

## 27. 注文状態の更新では PATCH が登場した

実際のコード：

``` ts
const response = await fetch(`/api/orders/${id}`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ status }),
});
```

今日は PATCH 自体を深く学んではいないが、Promise の流れは同じ。

``` text
fetch()
↓
Promise<Response>
↓ await
Response
↓
response.ok
↓
response.json()
↓ await
updatedOrder
```

違いは、単にデータを取得するのではなく、注文の一部を更新するようサーバーに依頼していること。

------------------------------------------------------------------------

## 28. State 内の注文を1件だけ置き換えるコード

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order,
  ),
);
```

この部分は今日、深掘りする前の段階として残した。

大きな意味：

``` text
既存の Order[] を取得
↓
map ですべて確認
↓
updatedOrder.id と一致
→ updatedOrder に置き換える

一致しない
→ 元の order を維持
↓
新しい Order[] を作る
↓
setOrders
```

`prevOrders` や functional state update
の詳しい理由は次の学習段階で扱える。

------------------------------------------------------------------------

# 29. なぜ実際のコードは理論より難しく見えたのか？

後半では：

> 「理論で見たコードと実際の Next.js コードが違って見えるので混乱する」

という感覚があった。

実際のコードには非同期だけでなく React の概念も同時に入っている。

``` text
useState
useCallback
useEffect
Promise
async
await
fetch
try/catch
finally
setOrders
```

しかし層を分けると：

``` text
React
│
├─ useEffect
│   ↓
│  loadOrders を呼ぶ
│
├─ 非同期の核心
│   fetch
│   ↓
│   Promise<Response>
│   ↓ await
│   Response
│   ↓
│   json()
│   ↓ await
│   Order[]
│
└─ React
    setOrders
    ↓
    再レンダリング
    ↓
    UI
```

となり、今日学んだ理論は中央にそのまま存在している。

------------------------------------------------------------------------

# 30. 開発はどう勉強するのがよいか？

最後には学習方法そのものについても整理した。

両極端にはそれぞれ問題がある。

### 理論を全部完璧にしてから実践する

Promise を学ぶだけで最初から：

``` text
Promise
Event Loop
Call Stack
Web APIs
Microtask Queue
ECMAScript 内部動作
...
```

まで全部終わらせようとすると、実際にコードを書くまで非常に時間がかかる。

### 理解せず、とにかく真似して作る

逆に：

``` ts
const response = await fetch(url);
const data = await response.json();
setProducts(data);
```

を理由を知らずに繰り返すだけだと、少しコードの形が変わった時にまた止まりやすい。

### 今日整理した学習ループ

現実的なのは：

``` text
浅い核心理論
↓
小さなコード
↓
「なぜ？」が生まれる
↓
必要な理論を一段深く学ぶ
↓
実プロジェクトで見つける
↓
自分で使う
↓
再び復習
```

つまり：

> **理論 → 実践 → 理論 → 実践**

を繰り返し、同じ概念を少しずつ深く理解する。

------------------------------------------------------------------------

# 31. 「何が分からないのかも分からない」状態から進む

最初は：

``` text
非同期？
Promise？
async？
await？
fetch？
全部混ざって分からない
```

という状態になりやすい。

しかし学習すると：

``` text
Promise       → ある程度理解
async         → ある程度理解
await         → ある程度理解
fetch         → ある程度理解
Response      → ある程度理解
json()        → ある程度理解
throw/catch   → ある程度理解
setState      → 接続し始めた
useEffect     → 今学び始めた
useCallback   → まだ深く学んでいない
```

のように、分からない範囲を分けて言えるようになる。

進歩とは、分からないことが完全になくなることだけではない。

> **自分が何を分かっていないのかを、より正確に言えるようになることも大きな進歩。**

------------------------------------------------------------------------

# 32. 今日はどこまで分かれば十分か？

今日必ず持ち帰る内容：

``` text
fetch()
→ Promise<Response>

await fetch()
→ Response

response.json()
→ Promise<Data>

await response.json()
→ Data

async 関数
→ 必ず Promise を返す

async 関数の return
→ fulfilled の結果

未処理の throw
→ rejected

response.ok
→ HTTP 成功状態を確認

setOrders(data)
→ State 変更
→ 再レンダリング
→ UI
```

`useEffect` は：

> レンダリング後、外部システムと同期するための処理を実行する。

程度。

`useCallback` は：

> 今は完全に理解していなくてもよい。

程度で今日は十分。

------------------------------------------------------------------------

# 33. 最終的な全体フロー

今日の内容を全部つなげると：

``` text
ユーザーがページにアクセス
↓
コンポーネントをレンダリング
↓
必要なタイミングでデータ取得関数を実行
↓
fetch("/api/...")
↓
Promise<Response>
↓
await
↓
Response
↓
response.ok を確認
↓
response.json()
↓
Promise<Data>
↓
await
↓
Product[] / Order[]
↓
Server なら return / レンダリングに利用
または
Client なら setState(data)
↓
React がデータを利用
↓
map()
↓
コンポーネント生成
↓
UI
```

## 今日の一文まとめ

> **非同期データ取得とは
> `fetch → Promise → await → Response → json → await → Data`
> という流れであり、Next.js/React ではそのデータを Server
> レンダリングに使うか Client State に保存して UI へつなげる。**

今日はこの大きな流れを理解できていれば十分。細かな理論は、実際に再び必要になった時に一段ずつ深く学んでいけばよい。
