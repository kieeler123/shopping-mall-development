# Day 31 — 既存プロジェクトの監査とServer / Clientの役割

**학습 시간 / 学習時間 / Study time:** 120 minutes

> 既存のNext.js + TypeScript ECサイトを対象に、各ファイルの責務と注文データの流れを説明し、ブラウザ専用ロジックを適切なClient Componentに配置する。

## 学習の順序

基礎理論20分 → 四択問題5分 → プロジェクト実習65分 → コーディング20分 → 検証・記録10分

### 基礎理論（20分）
- **App Router:** `app/`ディレクトリでページやAPIルートを定義する。
- **Server Component:** App Routerのデフォルト。`useState`、`useEffect`、`localStorage`などを直接利用しない。
- **Client Component:** `"use client"`を宣言し、ユーザー操作やブラウザ側の状態を扱う。
- **Route Handler:** `app/api/**/route.ts`で`GET`や`PATCH`などのHTTPリクエストを処理する。
- **注意:** Client Componentでもサーバー側で事前レンダリングされる場合があるため、ブラウザAPIへのアクセス時点に注意する。

**ヒント:** `localStorage`を使うファイルでは実行環境とハイドレーションを確認する。

### 四択問題（5分）
**Q. Route HandlerとClient Componentの違いとして正しいものは？**

A. Route Handlerはブラウザでのみ実行される。  
B. Route HandlerはHTTPリクエスト・レスポンスを扱い、Client ComponentはUI操作を担当する。  
C. 両方に`"use client"`が必要である。  
D. データベースにはClient Componentからのみアクセスできる。

<details><summary>正解・解説</summary>

**正解: B.** API処理とUI操作は責務が異なる。機密データへのアクセスはサーバー側に配置する。

</details>

### 既存プロジェクトでの実習（65分）
**0–10分 | ファイル構成を確認**
`app/layout.tsx`、`app/cart/page.tsx`、`app/checkout/page.tsx`、`app/orders/page.tsx`、`app/orders/[id]/page.tsx`、`app/order-complete/page.tsx`、`app/admin/orders/hooks/useOrders.ts`、`app/api/orders/route.ts`、`src/hooks/useCartStorage.ts`、`src/hooks/useOrdersStorage.ts`、`src/types/`を確認する。存在しないファイルは新規作成せず記録する。

**10–25分 | 責務の分類**
Server Component / Client Component / Route Handler / Custom Hook / Type・Dataに分類する。`"use client"`とブラウザAPIの使用箇所を調べる。

**25–45分 | 注文データフロー**
商品データ → カート保存 → チェックアウトで注文時の商品情報を保存 → 注文完了 → 注文一覧・詳細 → 管理画面のAPIを追跡する。

**45–55分 | 保存先の確認**
ユーザー画面の`localStorage`と管理画面の`/api/orders`が同じデータを参照しているか検証する。未確認なら連携済みと判断しない。

**55–65分 | 小さな改善**
ブラウザ専用ロジックのClient境界を修正する。大規模な再実装はしない。

**ヒント:** `layout.tsx`の`{children}`重複と`<main>`の入れ子も確認する。

### コーディング課題（20分）
**問題:** Server Component内で直接`localStorage`を参照するコードを、既存の`useCartStorage`を再利用したClient Componentへ修正する。

```tsx
// 修正前
export default function CartPage() {
  const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
  return <p>商品種類: {cart.length}</p>;
}
```

**条件:** `"use client"`を使用し、レンダリング中の`localStorage`直接参照を避け、ハイドレーションを考慮する。

<details><summary>解答例（Hookの実際の戻り値に合わせて調整）</summary>

```tsx
"use client";
import { useCartStorage } from "@/hooks/useCartStorage";

export default function CartPage() {
  const { cart, isReady } = useCartStorage();
  if (!isReady) return <p>読み込み中...</p>;
  return <p>商品種類: {cart.length}</p>;
}
```

Hookが配列のみを返す場合は実際の型に合わせて変更する。`isReady`も実装済みの場合に限る。

</details>

**ヒント:** まずVS Codeで実装し、Hookの戻り値を確認する。

### 検証と記録（10分）
```powershell
cd H:\shopping-mall-development
npx tsc --noEmit
npx eslint .
```

- [ ] ファイルごとの責務を分類
- [ ] 注文データフローを説明
- [ ] `localStorage`とAPIの保存先を確認
- [ ] 四択問題を1問解く
- [ ] コーディング課題を1問解く
- [ ] TypeScript・ESLintの結果を記録

**完了条件:** 注文データの流れをファイル単位で説明できる。

**採点:** 四択20点、実装・検証50点、コーディング30点。合格目安80点。

