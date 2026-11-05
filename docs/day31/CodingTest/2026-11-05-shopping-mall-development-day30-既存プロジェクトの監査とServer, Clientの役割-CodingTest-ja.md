# Day 31 — コーディングテスト
> 既存プロジェクトの点検とServer / Clientの区別

**学習日:** 2026-11-05  |  **予定学習時間:** 120 min  |  **Score:** 94/100 (PASS)

## 問題
```tsx
export default function CartPage() {
  const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
  return <p>상품 종류: {cart.length}</p>;
}
```

## 要件
- "use client"を宣言
- 既存のuseCartStorage Hookを再利用
- レンダリング中にlocalStorageを直接読まない
- SSR・ハイドレーションを考慮

## 提出コード
```tsx
"use client";

import { useCartStorage } from "@/hooks/useCartStorage";
import { CartItem } from "@/types/cart";

export default function CartPage() {
  const cart = useCartStorage();
  const updateCart = (updatedCart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));
    updateCart(updatedCart);
  };

  return <p>상품 종류: {cart.length}</p>;
}
```

## 採点とフィードバック
**24 / 30** — 5/5 + 10/10 + 5/5 + 4/10

未使用のupdateCart関数が終了条件なしで自分自身を呼び出す。現在は呼び出されないため直ちにエラーにはならないが、実行するとスタックオーバーフローにつながる。未使用の関数とimportも削除する。

## 修正後のコード
```tsx
"use client";

import { useCartStorage } from "@/hooks/useCartStorage";

export default function CartPage() {
  const cart = useCartStorage();

  return <p>상품 종류: {cart.length}</p>;
}
```

実行環境とデータの保存場所を先に確認しましょう。
