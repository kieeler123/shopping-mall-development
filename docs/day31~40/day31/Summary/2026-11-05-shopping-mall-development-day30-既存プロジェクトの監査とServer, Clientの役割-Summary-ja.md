# Day 31 — 総まとめ
> 既存プロジェクトの点検とServer / Clientの区別

**学習日:** 2026-11-05  |  **予定学習時間:** 120 min  |  **Score:** 94/100 (PASS)

## 学習目標
Next.js App Routerのコンポーネント境界とECサイトの注文データフローを理解する。

## 重要な概念
### Server Component
サーバー側のデータ取得とレンダリング。App Routerの既定。

### Client Component
"use client"境界。イベント、Reactの状態、ブラウザAPIを扱う。

### Route Handler
app/api/**/route.tsでGET・POST・PATCHを処理。

### useSyncExternalStore
外部ストアを購読し、SSRとハイドレーションのスナップショットを管理。

## ファイル別の責務
- `app/cart/page.tsx`
- `app/checkout/page.tsx`
- `app/order-complete/page.tsx`
- `app/orders/page.tsx`
- `app/orders/[id]/page.tsx`
- `src/hooks/useCartStorage.ts`
- `src/hooks/useOrdersStorage.ts`
- `app/admin/orders/hooks/useOrders.ts`

## 注文データの流れ
1. 商品データ(products.ts)を参照
2. カートをlocalStorage["cart"]から取得
3. チェックアウトでname・price・quantityのスナップショットを作成
4. localStorage["orders"]へ保存しorders-updatedを通知
5. カートを削除してcart-updatedを通知
6. 注文完了ページへ遷移
7. 注文履歴・詳細の表示とキャンセル

## 発見した課題
管理者APIのRoute Handlerが2件存在せず、ユーザーの注文はブラウザのlocalStorageに保存されます。

## 改善項目
- 管理者APIと共通サーバーストレージの設計
- 注文IDによる完了ページの表示
- チェックアウト時のJSON例外処理
- カートの読み込み状態の明確化
- サーバー側の権限と注文状態の検証
