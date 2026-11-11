# Day 32 | Next.js GET API デバッグ・コーディングテスト問題集

ECサイト開発で実際に起きたトラブルを題材にした演習です。まず設問を解き、その後で模範解答と実務のポイントを確認してください。

## Part A — Questions / 문제 / 設問

### Q01 [基礎知識]

GET Route Handlerの役割は何ですか。`route.ts`、`GET()`、`Response.json()`をそれぞれ説明してください。

### Q02 [障害解析]

`ERR_CONNECTION_REFUSED`とHTTP 404の違いは何ですか。

### Q03 [障害解析]

`Failed to open database`と`Invalid magic number`が出ました。何が分かり、何は断定できませんか。

### Q04 [デバッグ]

`.next`の削除時にファイルが見つからないというエラーが出ました。安全な対応は何ですか。

### Q05 [デバッグ]

`npm run dev -- --webpack`で起動できました。この結果から何が言えますか。

### Q06 [ルーティング]

ルート直下に`app/`があるのに`src/app/api/orders/route.ts`を作ると404になるのはなぜですか。

### Q07 [コーディング]

2件の注文を返すGETハンドラを書いてください。レスポンスには`success`、`count`、`orders`を含めます。

### Q08 [コード修正]

次のコードを修正してください: `export function GET() { return { orders: [] }; }`

### Q09 [動作確認]

DevToolsで`/api/orders`の動作をどう確認しますか。

### Q10 [面接対策]

Day 32のデバッグ経緯を5文以内で説明してください。

---

## Part B — Answers & Explanations / 정답 및 해설 / 模範解答

### A01

GET Route HandlerはHTTPのGETリクエストを処理します。`route.ts`はApp Routerのルートハンドラを定義するファイル、exportされた`GET()`はGETリクエストの処理関数、`Response.json()`はJSON本文と適切なContent-Typeを持つHTTPレスポンスを生成します。

**Tip / 팁 / ポイント:** GETは基本的にデータ取得用とし、意図しない状態変更を避けます。

### A02

接続拒否は指定したホスト・ポートへの接続が確立できない状態です。404はサーバーから応答があったものの、要求したパスが見つからない状態です。

**Tip / 팁 / ポイント:** ルーティングを疑う前に開発サーバーの起動状態を確認します。

### A03

Turbopackの永続化データやキャッシュの読み込みに問題が生じた可能性があります。ただし、このログだけで正確な原因やアプリケーションの業務用DBの破損を断定することはできません。

**Tip / 팁 / ポイント:** ビルドツール内部の保存領域と業務データベースを区別しましょう。

### A04

開発サーバーを停止し、削除対象が`.next`だけであることを確認します。ファイルの変更やロックの可能性を調べ、無関係なフォルダを繰り返し削除しないようにします。

**Tip / 팁 / ポイント:** ソースコードや依存パッケージをむやみに削除しないことが大切です。

### A05

Webpackを使った開発モードでは起動できると分かります。Turbopack側の問題を回避できたものの、根本原因の特定やキャッシュ修復の証明にはなりません。

**Tip / 팁 / ポイント:** 暫定回避策と恒久対策は分けて記録します。

### A06

ルート直下の`app/`が存在すると、Next.jsは通常そちらをApp Routerの基準として扱うため、`src/app/`のルートが認識されない場合があります。今回のケースでは`app/api/orders/route.ts`へ移動すると200になりました。

**Tip / 팁 / ポイント:** APIを追加する前に、実際に使われているappディレクトリを確認します。

### A07

```ts
const orders = [
  { id: 1, product: "キーボード", price: 59000 },
  { id: 2, product: "マウス", price: 35000 },
];

export async function GET() {
  return Response.json({ success: true, count: orders.length, orders });
}
```

**Tip / 팁 / ポイント:** 本番の注文APIでは認証とアクセス権限の確認が必要です。

### A08

通常のオブジェクトではなくResponseを返します。
```ts
export function GET() {
  return Response.json({ orders: [] });
}
```

**Tip / 팁 / ポイント:** 非同期処理がなければ`async`は必須ではありません。

### A09

NetworkタブでURL、GETメソッド、HTTP 200、`Content-Type: application/json`、JSONの項目と注文件数を確認します。

**Tip / 팁 / ポイント:** 200だけでなくレスポンスの内容も検証しましょう。

### A10

GET APIの開発中、Turbopackの永続化データに関するエラーと接続拒否が発生しました。`.next`の削除を試しましたが、一部ファイルが見つからず完了しませんでした。Webpackモードで起動し、サーバー接続の問題を回避しました。その後の404は`src/app/`とルート直下の`app/`の配置が原因でした。ハンドラを`app/api/orders/route.ts`へ移動し、HTTP 200と注文3件の返却を確認しました。

**Tip / 팁 / ポイント:** 事実・仮説・対応・検証結果を分けて説明しましょう。

---

## Practical checklist

- Verify the development server is running / 개발 서버 실행 확인 / 開発サーバーの起動確認
- Confirm the active `app/` directory / 실제 라우트 경로 확인 / 使用中の `app/` を確認
- Check GET `/api/orders`, HTTP 200 and JSON / API 응답 검증 / APIレスポンスを確認
- Keep hypotheses separate from verified causes / 추정과 사실 구분 / 推測と確認済み事実を区別
