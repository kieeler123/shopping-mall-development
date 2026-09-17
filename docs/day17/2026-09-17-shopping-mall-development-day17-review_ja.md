# Day 17 総まとめ --- HTTP/API 理論から fetch() と Mock API まで

## Day 17 の位置づけ

Day 17 は独立した一つのテーマというより、**Day 15 の HTTP/API 基礎 + Day
16 の非同期 JavaScript + 実際の `fetch()`
利用**を一つにつなげた日である。

``` text
Day 15
HTTP / API
Method / URL / Headers / Body
Response / Status Code / JSON
        ↓
Day 16
Promise / async / await
try / catch / throw
        ↓
Day 17
fetch()
Response
response.json()
Mock API
GET / POST / PATCH / DELETE
React State との接続
```

Day 17 の中心目標は文法暗記ではなく、次の流れを理解すること。

``` text
React
  ↓
fetch()
  ↓
HTTP Request
  ↓
API
  ↓
HTTP Response
  ↓
JSON
  ↓
React State
  ↓
UI
```

> **ヒント** `fetch()` だけを切り離して復習せず、Day 15 の HTTP と Day
> 16 の Promise がどこでつながるのか追跡する。

------------------------------------------------------------------------

## STEP 01 --- localStorage から API へ

以前：

``` text
React → useOrders → localStorage
```

API：

``` text
React → useOrders → fetch() → API
```

localStorage では Browser 内部のデータを読むが、API では Network
を通じて Server に Request を送り、Response を受け取る。

> **ヒント** 最初に「データが Browser 内にあるのか、Network
> の向こう側にあるのか」を区別する。

------------------------------------------------------------------------

## STEP 02 --- fetch() の正体

`fetch()` は React の機能ではなく Browser が提供する Web API。

``` js
const promise = fetch("/api/orders");
```

すぐに返るのは注文データではなく：

``` text
Promise<Response>
```

である。

``` js
const response = await fetch("/api/orders");
```

`await` 後に得られる `response` は HTTP Response を表す。

> **ヒント** `fetch = データ取得`
> ではなく、`HTTP Request を開始して Promise<Response> を返す`
> と理解する。

------------------------------------------------------------------------

## STEP 03 --- GET Request

``` js
const response = await fetch("/api/orders");
```

デフォルト Method は `GET`。

``` text
Method  GET
URL     /api/orders
Headers 必要な場合に使用
Body    なし
```

ここでは注文一覧取得が目的。

> **ヒント** fetch コードではまず Method と URL を探す。

------------------------------------------------------------------------

## STEP 04 --- Response はデータそのものではない

``` js
const response = await fetch("/api/orders");
```

`response` は注文配列ではなく HTTP Response オブジェクト。

``` js
response.ok
response.status
response.headers
```

などを確認できる。

> **ヒント** `response` と実データの `orders` を名前から区別する。

------------------------------------------------------------------------

## STEP 05 --- response.json()

Response Body が JSON の場合：

``` js
const data = await response.json();
```

で読み取る。

`response.json()` も非同期で Promise を返す。

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
JavaScript Data
```

> **ヒント** `await` が2回必要な理由を説明できるようにする。Response
> 到着と Body の読み取り・解析は別の非同期段階。

------------------------------------------------------------------------

## STEP 06 --- response.ok と HTTP Error

重要な違い：

``` text
404 / 500
≠
fetch Promise が必ず reject
```

HTTP Response が到着していれば `fetch()` は Response を返せる。

そのため明示的に確認する。

``` js
if (!response.ok) {
  throw new Error(`HTTP Error: ${response.status}`);
}
```

> **ヒント** Network Failure と HTTP Failure を同じものとして扱わない。

------------------------------------------------------------------------

## STEP 07 --- try / catch と throw

``` js
try {
  const response = await fetch("/api/orders");

  if (!response.ok) {
    throw new Error("注文取得失敗");
  }

  const orders = await response.json();
} catch (error) {
  console.error(error);
}
```

``` text
HTTP non-2xx
↓
response.ok === false
↓
throw
↓
async の失敗フロー
↓
catch
```

> **ヒント** `throw`
> は単なるメッセージ表示ではなく、正常フローを失敗フローへ切り替える。

------------------------------------------------------------------------

## STEP 08 --- Mock API

Mock API は単なる偽物の配列ではなく、**実際の Server API のように
Request を受け、Response を返す練習用 API**。

目的：

-   実際の HTTP 通信を練習
-   API Contract を練習
-   Server / DB 完成前の Frontend 開発
-   GET / POST / PATCH / DELETE の流れを確認

> **ヒント** Mock API でも Method、URL、Status Code、Response Body を実
> API と同じように扱う。

------------------------------------------------------------------------

## STEP 09 --- `/orders` API Contract

  機能       Method   URL             成功
  ---------- -------- --------------- ----------------------------
  一覧取得   GET      `/orders`       `200` + `Order[]`
  1件取得    GET      `/orders/:id`   `200` + `Order`
  作成       POST     `/orders`       `201` + 作成された `Order`
  更新       PATCH    `/orders/:id`   `200` + 更新された `Order`
  削除       DELETE   `/orders/:id`   `204`

存在しない注文では代表的に `404` が返る。

> **ヒント** API は URL だけでなく Request と Response
> 全体の約束として見る。

------------------------------------------------------------------------

## STEP 10 --- React で注文一覧 GET

``` js
async function loadOrders() {
  const response = await fetch("/api/orders");

  if (!response.ok) {
    throw new Error("注文取得失敗");
  }

  const data = await response.json();
  setOrders(data);
}
```

``` text
GET
↓
Response
↓
JSON
↓
setOrders
↓
State 変更
↓
Re-render
↓
注文一覧 UI
```

> **ヒント** Server Data を受け取っただけでは UI は変わらない。React
> State に反映することで UI とつながる。

------------------------------------------------------------------------

## STEP 11 --- Loading State

Network Request には時間が必要。

``` js
const [isLoading, setIsLoading] = useState(true);
```

``` text
Request 開始
↓
isLoading = true
↓
Request 終了
↓
isLoading = false
```

> **ヒント** Loading は付加機能ではなく Server Data UI
> の正常な状態の一つ。

------------------------------------------------------------------------

## STEP 12 --- Error State

``` js
const [error, setError] = useState(null);
```

失敗を State に反映できる。

``` js
catch (error) {
  setError(error.message);
}
```

Server Data を使う UI では通常：

``` text
Loading
Error
Empty
Data
```

を考える。

> **ヒント** 成功画面だけでなく、通信中・失敗・空データも UI
> 状態として扱う。

------------------------------------------------------------------------

## STEP 13 --- 特定注文の GET

``` text
GET /orders/3
```

成功：

``` text
200 + Order
```

存在しない：

``` text
404
```

> **ヒント** `/orders` Collection と `/orders/:id` 個別 Resource
> の違いを見る。

------------------------------------------------------------------------

## STEP 14 --- POST

``` js
const response = await fetch("/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(input),
});
```

``` text
Method   POST
URL      /api/orders
Headers  Content-Type: application/json
Body     JSON
```

> **ヒント** POST は Method だけでなく Headers と Body まで一緒に読む。

------------------------------------------------------------------------

## STEP 15 --- createdOrder

POST 成功後：

``` js
const createdOrder = await response.json();

setOrders((prevOrders) => [
  ...prevOrders,
  createdOrder,
]);
```

Client が送った入力値をそのまま State に入れるのではなく、**Server
が実際に生成して返した結果**を使う。

> **ヒント** ID や作成日時などを Server が決める場合があるため Request
> Body と Response Body が同じとは限らない。

------------------------------------------------------------------------

## STEP 16 --- PATCH

注文の一部、たとえば status のみ変更する。

``` js
const response = await fetch(`/api/orders/${id}`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    status: newStatus,
  }),
});
```

`updatedOrder` を受け取った後：

``` js
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id
      ? updatedOrder
      : order
  )
);
```

> **ヒント** 変更 Request → Server 処理 → 更新済み Resource → State
> 置換という往復で理解する。

------------------------------------------------------------------------

## STEP 17 --- DELETE と 204 No Content

``` js
const response = await fetch(`/api/orders/${id}`, {
  method: "DELETE",
});
```

削除成功時：

``` text
204 No Content
```

のように Body がない場合がある。

したがって無条件で：

``` js
await response.json();
```

を実行してはいけない。

成功後：

``` js
setOrders((prevOrders) =>
  prevOrders.filter((order) => order.id !== id)
);
```

> **ヒント** Status Code は Response Body
> が存在するかどうかにも関係する。

------------------------------------------------------------------------

## STEP 18 --- useOrders を HTTP ベースで考える

以前：

``` text
Component
↓
useOrders
↓
localStorage
```

変更後：

``` text
Component
↓
useOrders
↓
fetch()
↓
HTTP API
```

Component 側のインターフェースは可能な限り維持しながら Hook 内部の Data
Source を変更する。

``` js
const {
  orders,
  updateOrderStatus,
} = useOrders();
```

> **ヒント** Component が知る必要のあるものと Hook
> 内部に隠す実装詳細を分ける。

------------------------------------------------------------------------

# Day 17 深掘り復習 1 --- async 関数と Promise の状態

`async` 関数は常に Promise を返す。

``` js
async function example() {
  return 10;
}
```

概念的には：

``` text
Promise fulfilled with 10
```

未処理の `throw` は rejection につながる。

``` js
async function example() {
  throw new Error("失敗");
}
```

内部 `catch` で処理し正常値を return
すれば正常フローへ回復することもできる。

> **ヒント** async 関数内の `return` / `throw` と Promise の fulfilled /
> rejected をつなげて考える。

------------------------------------------------------------------------

# Day 17 深掘り復習 2 --- useEffect callback を直接 async にしない理由

避ける形：

``` js
useEffect(async () => {
  // ...
}, []);
```

Effect callback は cleanup
関数または何も返さないことが期待される一方、`async` 関数は常に Promise
を返す。

通常の callback の中から非同期処理を呼び出す。

> **ヒント** `useEffect` と `async` が一緒に出たら Effect callback の
> return value を考える。

------------------------------------------------------------------------

# Day 17 深掘り復習 3 --- useEffect cleanup

cleanup は代表的に：

``` text
dependency 変更により Effect が再実行される前
または
Component が unmount するとき
```

実行される。

開発環境の React Strict Mode では Effect の問題を検出するため setup /
cleanup が追加で見える場合がある。

> **ヒント** cleanup を unmount 専用として暗記しない。

------------------------------------------------------------------------

# 実プロジェクトとの接続で見つかった問題

管理者注文コードへ接続する過程で次の問題が見えた。

-   `src/types/order.ts` と `app/admin/orders/type.tsx` に重複 `Order`
    Type
-   `CartItem[]` と `OrderItem[]` の意味が異なる
-   実際の Order ID は `number` だが一部関数では `string`
-   `page.tsx` が期待する `updateOrderStatus` と Hook Interface の不一致
-   default / named export の不一致可能性
-   HTTP 移行後の `initialOrders` が不要

これらは `fetch()` 自体の問題ではなく、実際の HTTP
境界を導入したことで見えた Domain Model / Project Structure の問題。

> **ヒント** Type Error を `as` で隠す前に、異なる Domain Concept
> を誤って同じ Type として扱っていないか確認する。

------------------------------------------------------------------------

# CartItem と OrderItem

``` ts
type CartItem = {
  productId: number;
  quantity: number;
};
```

``` ts
type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};
```

``` text
CartItem
→ 現在の商品を参照し購入数量を管理

OrderItem
→ 注文時点の商品情報を保存
```

> **ヒント** Type
> を統合する前にデータの責任とライフサイクルが同じか確認する。

------------------------------------------------------------------------

# Day 17 全体フロー

``` text
AdminOrdersPage
      ↓
useOrders
      ↓
fetch()
      ↓
Promise<Response>
      ↓
HTTP Request
      ↓
Mock API
      ↓
HTTP Response
      ↓
response.ok
      ↓
response.json()
      ↓
Order Data
      ↓
setOrders
      ↓
React State
      ↓
Re-render
      ↓
OrderCard
```

Status 変更：

``` text
User
↓
OrderCard
↓
updateOrderStatus
↓
PATCH Request
↓
Mock API
↓
updatedOrder Response
↓
setOrders(map)
↓
UI 更新
```

------------------------------------------------------------------------

# Day 17 完了基準

次を説明できれば Day 17 の中心学習は完了。

-   HTTP Request と Response の関係
-   Method / URL / Headers / Body の役割
-   `fetch()` が `Promise<Response>` を返す理由
-   `Response` と JSON Data の違い
-   `response.json()` に `await` が必要な理由
-   HTTP 404/500 と Network Failure の違い
-   `response.ok` → `throw` → `catch`
-   GET / POST / PATCH / DELETE の役割
-   `201 Created` と `204 No Content`
-   Server Response を React State に反映する理由
-   Loading / Error / Empty / Data
-   `useEffect` と非同期処理の関係
-   Custom Hook の Data Source を localStorage から HTTP
    に変更できる理由
-   CartItem と OrderItem が異なる Domain Data である理由

------------------------------------------------------------------------

# Day 17 で止める地点

元の計画には：

``` text
STEP 19 → API Layer (`ordersApi`)
STEP 20 → 全体統合
```

もあったが Day 17 では無理に進めない。

まず Day 18 で JavaScript / React / TypeScript / Next.js / HTTP
の学習内容を総復習する。

その後、実プロジェクトで：

``` text
GET /api/orders
↓
PATCH /api/orders/:id
↓
実際の HTTP 往復を確認
```

を実装する。

HTTP 処理の重複や Hook の責任増加を実際に体験した後で API Layer を学ぶ。

> **ヒント** Architecture
> を先に暗記せず、それが解決する問題を実コードで先に経験する。

------------------------------------------------------------------------

# Day 17 を一文でまとめると

> **Day 17 は Day 15 の HTTP/API と Day 16 の非同期 JavaScript を
> `fetch()` で接続し、Server の結果が React State を経て UI
> になる一連の往復フローを理解した日である。**

次の Day 18 では、新機能を急いで追加するのではなく、これまでの内容を
**React + JavaScript の原理 → すぐ TypeScript と接続 → 実際の Next.js
Project と接続**する方式で復習する。
