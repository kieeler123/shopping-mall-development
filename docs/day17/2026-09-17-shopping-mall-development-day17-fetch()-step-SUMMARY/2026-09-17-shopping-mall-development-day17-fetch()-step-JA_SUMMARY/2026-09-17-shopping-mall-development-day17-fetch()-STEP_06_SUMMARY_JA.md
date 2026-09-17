# Day 17 --- STEP 06. response.okとHTTP Error

## このSTEPの目標

HTTP
404/500とNetworkレベルのfetch失敗を区別し、`response.ok`確認の理由を理解する。

## 中心フロー

``` text
Response到着 → response.ok確認 → non-2xxを失敗フローへ
```

## 重要なコード / 表現

``` js
if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
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

> HTTP
> 404/500とNetworkレベルのfetch失敗を区別し、`response.ok`確認の理由を理解する。
