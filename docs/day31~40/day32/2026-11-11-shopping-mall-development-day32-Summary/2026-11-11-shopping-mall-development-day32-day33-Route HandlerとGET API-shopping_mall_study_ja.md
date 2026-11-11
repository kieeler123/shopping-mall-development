# Day 32 --- Route HandlerとGET API

> ECサイト開発 \| Next.js App Router \| `route.ts`・`GET()`・`Response.json()`

## 学習目標

-   GET Route Handlerの役割を説明できる。
-   `/api/orders`から注文配列をJSONで返せる。
-   ブラウザーと開発者ツールでAPIのレスポンスを確認できる。

## 1. 基本概念

  用語                役割
  ------------------- -------------------------------------------------
  `route.ts`          App RouterのAPIエンドポイントを定義するファイル
  `GET()`             HTTP GETリクエストを処理するエクスポート関数
  `Response.json()`   JavaScriptの値をJSONレスポンスとして返す
  `200 OK`            リクエストが正常に処理されたことを示す

**GET Route Handlerの主な役割は？** クライアントからのGETリクエストを受け取り、取得したデータをHTTPレスポンスとして返すことです。GETは原則としてデータ取得に用います。

**実践のヒント:** URLはフォルダー構造に対応します。今回のプロジェクトではルート直下の`app`を使用するため、`app/api/orders/route.ts`に配置します。

## 2. 実習：注文一覧API

ファイル：`app/api/orders/route.ts`

``` ts
const orders = [
  { id: 1, product: "ワイヤレスキーボード", price: 59000, quantity: 1, status: "配送中" },
  { id: 2, product: "ゲーミングマウス", price: 35000, quantity: 2, status: "配達完了" },
  { id: 3, product: "USB-Cハブ", price: 29000, quantity: 1, status: "決済完了" },
];

export async function GET() {
  return Response.json(
    { success: true, message: "注文一覧を取得しました", count: orders.length, orders },
    { status: 200 }
  );
}
```

1.  `npm run dev`で開発サーバーを起動する。
2.  `http://localhost:3000/api/orders`にアクセスする。
3.  `success: true`、`count: 3`、`orders`配列を確認する。
4.  DevToolsのNetworkでHTTP 200とJSONのContent-Typeを確認する。

**実践のヒント:** 配列は学習用の仮データです。実サービスでは認証と注文データへのアクセス権限の確認が必要です。

## 3. Day 32のデバッグ記録

  ----------------------------------------------------------------------------------------------------------------------------------------------------------
  症状                                                 考えられる意味                                          対応
  ---------------------------------------------------- ------------------------------------------------------- ---------------------------------------------
  `Failed to open database` / `Invalid magic number`   Turbopackの内部保存データに問題がある可能性（未確定）   `.next`の削除を試行

  キャッシュ削除失敗                                   ファイルが存在しない、または使用中の可能性              切り分けを優先

  `ERR_CONNECTION_REFUSED`                             開発サーバーに接続できない                              サーバーの起動状態を確認

  Webpackで起動成功                                    Turbopack経由の実行を回避                               `npm run dev -- --webpack`

  `/api/orders`で404                                   サーバーは動作するがルートが認識されていない            `route.ts`をルートの`app/api/orders/`へ移動

  `/api/orders`で200                                   修正後にAPIが正常応答                                   注文3件のJSONを確認
  ----------------------------------------------------------------------------------------------------------------------------------------------------------

**重要:** キャッシュ破損は確定した根本原因ではありません。一方、404は今回のプロジェクトの有効な`app`ディレクトリとファイル配置が一致していなかったことが原因で、移動後に解消しました。

**実践のヒント:** 接続拒否と404は別問題です。前者はサーバー起動、後者はルーティング設定を確認します。

## 4. 選択式問題

**Q1. GET Route Handlerの主な役割は？** - A. CSSの適用 - B. GETリクエストを処理してデータを返す - C. データベースの自動削除 - D. 画像の圧縮

**Q2. 今回の`/api/orders`に対応するファイルは？** - A. `public/orders.json` - B. `app/api/orders/page.tsx` - C. `app/api/orders/route.ts` - D. `components/orders.tsx`

**Q3. リクエストされたルートが見つからない状態コードは？** - A. 200 - B. 404 - C. 500 - D. 201

## 5. 記述式・コーディング問題

**S1.** GET Route Handlerの役割を注文一覧APIの例で3文以上説明してください。

**S2.** `Response.json()`を使って`success`、`count`、`orders`を返すGET関数を書いてください。

**S3.** `ERR_CONNECTION_REFUSED`と404の違い、および今回の404の解決方法を説明してください。

## 6. 模範解答と解説

-   Q1 **B** --- GETリクエストを処理してレスポンスを返します。
-   Q2 **C** --- App Routerでは`route.ts`がHTTPメソッドを処理します。
-   Q3 **B** --- 404は対象のリソースまたはルートが見つからない状態です。
-   S1例：クライアントが`/api/orders`にアクセスします。サーバーは`GET()`を実行します。注文一覧を`Response.json()`で返します。
-   S2例：

``` ts
export async function GET() {
  return Response.json(
    { success: true, count: orders.length, orders },
    { status: 200 }
  );
}
```

-   S3例：接続拒否はサーバーとの通信自体が成立していない状態です。404はサーバーが応答したものの、対象ルートが見つからない状態です。`route.ts`を`app/api/orders/`に移動して解決しました。

## 7. 完了チェックリスト

-   [ ] GETと`route.ts`の役割を説明できる。
-   [ ] 注文3件をJSONで返せる。
-   [ ] Networkで200とJSONを確認した。
-   [ ] 選択式と記述式の問題を解いた。
