# Day 31 — 学習記録
> 既存プロジェクトの点検とServer / Clientの区別

**学習日:** 2026-11-05  |  **予定学習時間:** 120 min  |  **Score:** 94/100 (PASS)

## 実施内容
- 商品データ(products.ts)を参照
- カートをlocalStorage["cart"]から取得
- チェックアウトでname・price・quantityのスナップショットを作成
- localStorage["orders"]へ保存しorders-updatedを通知
- カートを削除してcart-updatedを通知
- 注文完了ページへ遷移
- 注文履歴・詳細の表示とキャンセル

- 16 files checked: 14 present, 2 missing
- Multiple choice: B, 20/20
- Project analysis: 50/50
- Coding challenge: 24/30

## 検証記録
```powershell
npx tsc --noEmit
npx eslint .
```
ターミナルのスクリーンショットではエラー・警告が表示されず、プロンプトに戻った。終了コードは別途確認しておらず、ブラウザでの全機能テストは未実施。

## 発見した課題
管理者APIのRoute Handlerが2件存在せず、ユーザーの注文はブラウザのlocalStorageに保存されます。

## 振り返り
サーバーAPIとブラウザストレージは自動的には連携しません。

実行環境とデータの保存場所を先に確認しましょう。
