# Day 16 --- STEP 01. なぜ HTTP と API が必要なのか？

## この STEP の目標

これまでの React ショッピングモールでは、注文データをブラウザの
`localStorage` に保存していた。ここでは、データを Server
側で管理する構成に変わると、なぜ HTTP と API
が必要になるのかを理解する。

## これまでの構造

``` text
React
↓
useOrders
↓
localStorage
```

`localStorage` はブラウザ内部にあるため、React はネットワーク越しの
Server と通信しなくてもデータを保存・取得できた。

概念的には次の流れだった。

``` text
React
↓
localStorage から orders を取得
↓
JavaScript の値として利用
↓
React State
↓
UI
```

## Server を使うと何が変わるのか？

実際のサービスでは、注文を Server で検証したり、複数の Client
から利用したり、Database に永続化したりする必要がある。

``` text
React
↓
HTTP Request
↓
API
↓
Server
↓
Database
```

結果は逆方向に戻る。

``` text
Database
↓
Server
↓
HTTP Response
↓
React
↓
State
↓
UI
```

ここで重要な問いが生まれる。

> ブラウザ上の React と Server
> は、どのようなルールでデータをやり取りするのか？

この通信ルールに関係するのが **HTTP** であり、Server の機能やデータを
Client が利用できるようにするインターフェースが **API** である。

## Day 15 とのつながり

Server 通信には待ち時間がある。

``` text
Request
↓
Network
↓
Server 処理
↓
Database
↓
Response
```

そのため Promise、`async`、`await`、`try/catch`
といった非同期処理が実際の API 通信で重要になる。

**ヒント**

`HTTP/API を学ぶ = React を全部作り直す` と考えないこと。まずは
**データへのアクセス経路が localStorage から Server に変わる**
と理解しよう。

## STEP 01 の重要ポイント

``` text
これまで:
React → useOrders → localStorage

これから:
React → HTTP Request → API/Server → Database
React ← HTTP Response ← API/Server
```
