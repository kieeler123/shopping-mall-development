# Day 31 学習プラン — 既存プロジェクト監査とServer / Clientの役割

**Duration / 학습 시간 / 学習時間:** 120 min
**Topics:** Next.js App Router · Server Components · Client Components · Route Handlers

## 1. 学習目標
ECプロジェクトのファイル構成と注文フローを理解し、Client ComponentとRoute Handlerの責務を区別します。

**学習のコツ:** コードを変更する前に各ファイルの実行環境・データの保存先・責務を記録しましょう。

## 2. スケジュール
| Time | 学習内容 | 成果物 |
|---|---|---|
| 00–20 min | 概念の復習 | 1 |
| 20–40 min | ファイル構成の監査 | 2 |
| 40–65 min | 注文フロー追跡 | 3 |
| 65–85 min | 管理者APIの分析 | 4 |
| 85–105 min | コーディング演習 | 5 |
| 105–120 min | クイズと振り返り | 6 |

## 3. 基本概念
Server Componentはサーバーデータ取得とUI構築、Client Componentはユーザー操作、Route HandlerはHTTPリクエスト処理とサーバー側検証を担当します。Client Componentも初期HTMLがサーバーで事前レンダリングされることがあるため、レンダリング中のwindow/localStorage参照には注意が必要です。

| Type | Responsibility |
|---|---|
| Server Component | Server-side data and UI composition |
| Client Component | Hooks, state, browser interactions |
| Route Handler | GET/PATCH, authorization, server data |

## 4. ファイル構成の確認
```text
app/
├── cart/page.tsx
├── checkout/page.tsx
├── orders/page.tsx
├── orders/[id]/page.tsx
├── order-complete/page.tsx
├── admin/orders/hooks/useOrders.ts
└── api/orders/
    ├── route.ts
    └── [id]/route.ts
hooks/
├── useCartStorage.ts
└── useOrdersStorage.ts
```
以前の監査では注文APIの2ファイルが見つかりませんでした。現在のプロジェクトで再確認してください。

- [ ] `app/cart/page.tsx`
- [ ] `app/checkout/page.tsx`
- [ ] `app/orders/page.tsx`
- [ ] `app/orders/[id]/page.tsx`
- [ ] `app/admin/orders/hooks/useOrders.ts`
- [ ] `app/api/orders/route.ts`
- [ ] `app/api/orders/[id]/route.ts`
- [ ] `useCartStorage` and `useOrdersStorage`

## 5. 注文データフロー
カート → チェックアウト → 注文保存 → 注文履歴 → 管理者API

1. `app/cart/page.tsx` → `useCartStorage()` → `localStorage["cart"]`
2. `app/checkout/page.tsx` → order snapshot → `localStorage["orders"]`
3. `app/order-complete/page.tsx` → show completed order; verify its ID
4. `app/orders/page.tsx` → `useOrdersStorage()`
5. `app/admin/orders/hooks/useOrders.ts` → `GET /api/orders` and `PATCH /api/orders/[id]`

### 設計上の注意
ブラウザのlocalStorageにあるordersはサーバーAPIと自動的に共有されません。

## 6. 演習
### A. Reuse the existing cart Hook
```tsx
"use client";
import { useCartStorage } from "@/hooks/useCartStorage";
export default function CartCount() {
  const cart = useCartStorage();
  return <p>상품 종류: {cart.length}</p>;
}
```
### B. Explain Route Handler responsibilities
```ts
// Example only: this endpoint is NOT implemented yet.
import { NextResponse } from "next/server";
export async function GET() {
  // TODO: authorization and server-side order lookup
  return NextResponse.json({message:"Not implemented"}, {status:501});
}
```
HTTP 501 indicates an intentionally unimplemented exercise endpoint.

## 7. 理解度チェック
1. Route HandlerとClient Componentの違いは？
2. "use client"でもlocalStorage参照が危険な場合は？
3. useSyncExternalStoreは何を解決する？
4. 管理者APIが顧客のlocalStorageを直接読めない理由は？
5. 最後に保存された注文が今回の注文とは限らない理由は？

## 8. 最終成果物
- [ ] File-by-file responsibility table
- [ ] Cart-to-order flow diagram
- [ ] Admin API and storage boundary analysis
- [ ] Hook reuse exercise
- [ ] Learning reflection

**学習のコツ:** コードを変更する前に各ファイルの実行環境・データの保存先・責務を記録しましょう。
