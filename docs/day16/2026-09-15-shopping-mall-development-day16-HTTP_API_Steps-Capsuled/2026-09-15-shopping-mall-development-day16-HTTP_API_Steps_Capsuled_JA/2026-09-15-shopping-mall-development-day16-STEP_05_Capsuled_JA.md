# Day 16 --- STEP 05. URL・Path・Endpoint・Query Parameter

## この STEP の目標

Request の宛先を表す URL と、API 内の具体的な Request 地点である
Endpoint を理解する。

## URL

例：

``` text
https://api.myshop.com/orders/10
```

初級段階では：

``` text
https://api.myshop.com + /orders/10
└──── Base URL ─────┘   └─ Path ─┘
```

と分けて考えられる。

## Endpoint

Orders API が次の機能を提供するとする。

``` text
GET    /orders
GET    /orders/:id
POST   /orders
PATCH  /orders/:id
DELETE /orders/:id
```

API が大きなインターフェースなら、Endpoint はその中の具体的な Request
地点である。実務上は Method + URL/Path の組み合わせを Endpoint
として説明する文書もある。

## `:id` の意味

``` text
/orders/:id
```

の `:id` は実際の URL 文字列ではなく placeholder である。

``` text
/orders/:id  ← Route Template
/orders/10   ← 実際の Path
/orders/25   ← 実際の Path
```

## Query Parameter

一覧取得に条件を追加する場合：

``` http
GET /orders?status=shipping
```

複数なら：

``` text
/orders?status=shipping&page=2
```

`?` から Query が始まり、複数の Parameter は一般的に `&` でつなぐ。

## Path と Query

``` text
/orders/10
→ 特定 Resource を識別する用途によく使う

/orders?status=shipping
→ 一覧取得の条件・オプションなどによく使う
```

ただし正確な意味は API Contract が決める。

**ヒント**

初級段階では `Path = どの対象？`, `Query = どんな条件・オプション？`
と考えると整理しやすい。

## STEP 05 の重要ポイント

> URL は Request の宛先を示し、Endpoint は API 内の具体的な Request
> 地点である。Query Parameter は条件やオプションなどを URL
> に追加できる。
