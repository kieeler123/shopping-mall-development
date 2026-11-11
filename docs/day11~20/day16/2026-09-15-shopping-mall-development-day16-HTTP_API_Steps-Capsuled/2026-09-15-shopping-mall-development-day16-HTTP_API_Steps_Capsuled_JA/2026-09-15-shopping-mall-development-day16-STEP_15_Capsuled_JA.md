# Day 16 --- STEP 15. HTTP と Promise / async / await / try-catch

## この STEP の目標

Day 15 で学んだ非同期 JavaScript と HTTP 通信を接続する。

## Server 通信には時間がかかる

``` text
React
↓
Request
↓
Network
↓
Server
↓
Database
↓
Response
```

結果は即座には得られない。

## HTTP と fetch() を区別する

``` text
HTTP
→ 通信 Protocol

fetch()
→ Browser の JavaScript Web API
→ Promise を返す
```

HTTP 自体が Promise を返すわけではない。

``` text
fetch()
↓
Promise pending
↓
HTTP 通信
↓
Promise settlement
↓
Response または rejection
```

## await

``` js
const response = await fetch("/orders");
```

`await` は Promise ベースの結果を待つ。

ブラウザ全体を停止するのではなく、現在の async function の続きが Promise
の完了まで待つ。

## response は注文データではない

``` text
response
→ HTTP Response を表す object

data
→ Response Body を処理して得る JavaScript Value
```

例：

``` js
const response = await fetch("/orders");
const data = await response.json();
```

`response.json()` による Body の読み取り・Parsing も非同期である。

## try/catch

``` js
try {
  // awaited async work
} catch (error) {
  // thrown error / Promise rejection
}
```

ここで重要なのが HTTP Error Status と Promise rejection の違いである。

### 404 / 500

Server が 404 や 500 Response を返した場合、Response 自体は届いている。

そのため `fetch()` は通常、4xx/5xx という理由だけでは reject しない。

``` js
if (!response.ok) {
  throw new Error("Request failed");
}
```

のように HTTP 成功状態を確認する。

### Network Failure

ネットワークや通信レベルの失敗では Promise が reject され、`catch`
に入る可能性がある。

**ヒント**

``` text
HTTP Error Status
→ Response がある
→ response.ok / status を確認

Network/Promise Failure
→ reject の可能性
→ catch
```

この二つを分けよう。

## STEP 15 の重要ポイント

> `fetch()` は Promise を返し、`await` で Response を待てる。HTTP
> 4xx/5xx と Promise rejection は同じものではない。
