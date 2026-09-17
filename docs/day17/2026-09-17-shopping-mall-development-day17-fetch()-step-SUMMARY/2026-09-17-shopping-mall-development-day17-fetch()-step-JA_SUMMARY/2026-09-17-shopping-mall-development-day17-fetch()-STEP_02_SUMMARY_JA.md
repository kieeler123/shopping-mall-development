# Day 17 --- STEP 02. fetch()の正体

## このSTEPの目標

`fetch()`はReact機能ではなくWeb
APIであり、Dataそのものではなく`Promise<Response>`を返すことを理解する。

## 中心フロー

``` text
fetch() → Promise<Response> → await → Response
```

## 重要なコード / 表現

``` js
const promise = fetch("/api/orders");
```

## なぜ重要か

HTTP用語をコードと切り離して暗記しない。このSTEPが **Request → Mock API
→ Response → React State → UI** のどこに位置するか確認する。

## Day 15〜17との接続

-   Day 15のMethod / URL / Headers / Body / Response / Status Code /
    JSONをコード内で探す。
-   Day 16のPromise / `async` / `await` / `try/catch`を待機とError
    Handlingへ接続する。
-   Day 17では結果をReact StateとUIまで追跡する。

> **ヒント**
> 文法を暗記するより、何を待っているのか、どんなHTTP情報が移動するのか、その後どのStateが変わるのかを自分の言葉で説明する。

## STEPの核心文

> `fetch()`はReact機能ではなくWeb
> APIであり、Dataそのものではなく`Promise<Response>`を返すことを理解する。
