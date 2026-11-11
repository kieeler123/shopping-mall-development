# Day 33 --- HTTPステータスコードとエラーハンドリング

> ECサイト開発 \| `Request` / `Response`・`response.ok`・`200/400/404/500`・`try/catch`

## 学習目標

-   成功、入力エラー、リソース未発見、サーバー内部エラーを区別する。
-   `response.ok`と`try/catch`を使って通信処理を改善する。
-   取得失敗時にエラー表示と再試行ボタンを実装する。

## 1. HTTPステータスコード

  コード   意味                                        ECサイトでの例
  -------- ------------------------------------------- --------------------
  200      OK：成功                                    注文一覧の取得
  400      Bad Request：不正な入力                     注文IDが不正
  404      Not Found：対象がない                       注文が存在しない
  500      Internal Server Error：サーバー内部エラー   予期しない処理例外

**実践のヒント:** 400はクライアントの入力問題、500はサーバー内部の問題です。認証・権限エラーには401・403などを使います。

## 2. GET APIの成功・失敗レスポンスを改善

ファイル：`app/api/orders/route.ts`

``` ts
const orders = [
  { id: 1, product: "Wireless keyboard", price: 59000 },
  { id: 2, product: "Gaming mouse", price: 35000 },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");

    if (idParam !== null) {
      const id = Number(idParam);
      if (!Number.isInteger(id) || id <= 0) {
        return Response.json(
          { success: false, error: "Invalid order ID" },
          { status: 400 }
        );
      }
      const order = orders.find((item) => item.id === id);
      if (!order) {
        return Response.json(
          { success: false, error: "Order not found" },
          { status: 404 }
        );
      }
      return Response.json({ success: true, order }, { status: 200 });
    }

    return Response.json(
      { success: true, count: orders.length, orders },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order lookup failed:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

`?id=abc`なら400、`?id=999`なら404、存在するIDなら200を返します。予期しない例外が発生した場合は500を返します。

**実践のヒント:** 500は実際のサーバー例外を表します。意図的に例外を発生させるテスト用処理を本番環境に残さないでください。

## 3. `response.ok`と`try/catch`を使う

ファイル：`lib/orders.ts`

``` ts
export type Order = { id: number; product: string; price: number };

export async function fetchOrders(): Promise<Order[]> {
  let response: Response;
  try {
    response = await fetch("/api/orders");
  } catch {
    throw new Error("Could not connect to the server.");
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body: { error?: string } = await response.json();
      if (body.error) message = body.error;
    } catch {
      // A non-JSON error response is possible.
    }
    throw new Error(message);
  }

  try {
    const data: { orders: Order[] } = await response.json();
    if (!Array.isArray(data.orders)) throw new Error("Invalid response");
    return data.orders;
  } catch {
    throw new Error("Unable to read the orders response.");
  }
}
```

**重要:** `fetch()`はHTTP 404や500だけでは通常rejectされません。`response.ok`で2xxかどうかを確認します。`try/catch`は通信エラー、JSON解析エラー、明示的に投げた例外を処理します。

## 4. エラーUIと再試行ボタン

ファイル：`app/orders/page.tsx`

``` tsx
"use client";

import { useEffect, useState } from "react";
import { fetchOrders, type Order } from "../../lib/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = await fetchOrders();
        if (active) setOrders(result);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [retry]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return (
    <div role="alert">
      <p>{error}</p>
      <button onClick={() => setRetry((n) => n + 1)}>Retry</button>
    </div>
  );
  return <ul>{orders.map((order) => (
    <li key={order.id}>{order.product} — {order.price}</li>
  ))}</ul>;
}
```

**実践のヒント:** importの相対パスはルート直下の`app/orders/page.tsx`と`lib/orders.ts`を想定しています。実際のディレクトリ構造に合わせて修正してください。

## 5. テストシナリオ

  リクエスト                   期待する結果
  ---------------------------- ----------------
  `/api/orders`                200：全件取得
  `/api/orders?id=1`           200：既存注文
  `/api/orders?id=abc`         400：不正なID
  `/api/orders?id=999`         404：注文なし
  サーバー停止後に画面を更新   通信エラー表示

500は実際にサーバー内部で例外が発生した場合に確認します。

## 6. 選択式問題

**Q1. `fetch()`が404を受け取った場合、通常どうなりますか？** - A. 必ず自動で例外が発生する - B. `Response`が返り、`response.ok`は`false`になる - C. ブラウザーが終了する - D. 自動的に200へ変換される

**Q2. 正しい形式のIDだが注文が存在しない場合のコードは？** - A. 200 - B. 400 - C. 404 - D. 500

**Q3. サーバー内部で予期しない例外が発生した場合のコードは？** - A. 500 - B. 200 - C. 301 - D. 404

## 7. 記述式・コーディング問題

**S1.** `response.ok`と`try/catch`の役割の違いを説明してください。

**S2.** `id=abc`が400、`id=999`が404になる理由を説明してください。

**S3.** 読み込み開始からエラー表示・再試行までのUIの流れを説明してください。

**S4.** `fetch("/api/orders")`で失敗を検知してエラーを処理するコードを書いてください。

## 8. 模範解答と解説

-   Q1 **B** --- HTTPエラーのステータスだけでは通常Promiseはrejectされません。
-   Q2 **C** --- 形式は正しいものの対象リソースがないため404です。
-   Q3 **A** --- サーバー内部の予期しない失敗は500です。
-   S1例：`response.ok`はHTTPステータスが2xxかを判定します。`try/catch`は通信・解析・明示的な例外を捕捉します。
-   S2例：`abc`は整数IDとして不正なので400、`999`は形式が正しいものの存在しないため404です。
-   S3例：ローディング開始 → API呼び出し → ステータス確認 → 成功ならデータ表示、失敗ならエラー表示 → 再試行。
-   S4例：

``` ts
try {
  const res = await fetch("/api/orders");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  console.log(data);
} catch (error) {
  console.error(error);
  // Update the UI's error state in React.
}
```

## 9. 完了チェックリスト

-   [ ] 200・400・404・500を使い分けられる。
-   [ ] APIで成功と失敗のレスポンスを返せる。
-   [ ] `response.ok`と`try/catch`を実装した。
-   [ ] エラーUIと再試行を確認した。
-   [ ] 選択式と記述式の問題を解いた。
