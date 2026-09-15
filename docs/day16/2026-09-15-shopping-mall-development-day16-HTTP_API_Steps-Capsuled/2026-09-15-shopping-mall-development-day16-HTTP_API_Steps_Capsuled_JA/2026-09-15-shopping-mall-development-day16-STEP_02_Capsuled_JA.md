# Day 16 --- STEP 02. Client と Server

## この STEP の目標

HTTP を理解する前に、「誰が Request を送り、誰が Response
を返すのか」を明確にする。

## Client

Client は Server に Request
を送る側である。このプロジェクトではブラウザ上で動く React
アプリケーションが Client の役割を持つ。

``` text
React (Client)
↓
Request
↓
Server
```

Client は React に限定されない。モバイルアプリや別の Server
プログラムなども API の Client になれる。

## Server

Server は Request を受け取り、必要な処理を行い、Response を返す。

``` text
Server
├─ Request を解釈
├─ Authentication
├─ Authorization
├─ Validation
├─ Business Logic
├─ Database へのアクセス
└─ Response を生成
```

すべての API が必ずこれら全部を行うわけではないが、Server
が単なるデータ置き場ではないことが重要である。

## Server と Database は別物

``` text
Client
↓
Server
↓
Database
```

Database はデータを保存・検索・更新・削除するシステムである。一方 Server
は Request を処理し、必要に応じて Database を利用して Client
に返す結果を作る。

例：

``` text
GET /orders/10
↓
Server
↓
ユーザーを確認
↓
閲覧権限を確認
↓
Database から注文を取得
↓
Response 用データを作る
↓
Response
```

## Request と Response の方向

``` text
Client
   │
   │ Request
   ▼
Server
   │
   │ Response
   ▼
Client
```

**ヒント**

Request と Response が混乱したら、まず矢印を書くこと。`Client → Server`
が Request、`Server → Client` が Response である。

## STEP 02 の重要ポイント

> Client は Request を送り、Server はそれを処理して Response
> を返す。Server と Database は同じ概念ではない。
