# Day 33 デバッグ記録

Next.jsの注文取得APIについてHTTPステータスとクライアント側のエラー処理を検証した。

## Verified observations

- GET /api/ordersで注文一覧を表示した。
- 注文ID 0でHTTP 400と入力エラーを確認した。
- 注文ID 1でHTTP 200と注文詳細を確認した。
- 注文ID abcでHTTP 400と入力エラーを確認した。
- 注文ID 999でHTTP 404と注文なしのメッセージを確認した。
- Chrome DevToolsのNetworkで各ステータスを確認した。

## Context

- Day 32ではAPIをsrc/appではなくルートのapp/api/orders/route.tsに置いてパスの404問題を解決した。
- 以前の500応答は内部例外の原因を確認したものではなく、意図的に500を返したテストだった。
- 過去のTurbopack関連エラーはnpm run dev -- --webpackで回避した。

## Lessons

- 400: 数字以外や0以下のIDなど、リクエスト自体が不正。
- 404: IDの形式は正しいが注文が存在しない。
- 200: 正常に取得できた。
- 500: 予期しないサーバー内部エラー。原因は未確認なら断定しない。
- fetchは400や404だけではrejectされない。response.okを確認する。
- Reactではローディング、成功、失敗を分けて再試行できるようにする。

## 問題と再現手順

(Add your notes here.)

## 観察結果とHTTPステータス

(Add your notes here.)

## 原因の仮説と根拠

(Add your notes here.)

## 修正内容と再検証

(Add your notes here.)

## 学びと再発防止

(Add your notes here.)