# Day 27 — 問題と解答・解説

## Part 1：責務分類（各10点、80点）
次のコードを `AdminOrdersPage` / `OrderCard` / `OrderItemList` / `useOrders` に分類しよう。

| No. | 問題 | 正解 | 理由 |
|---|---|---|---|
| 1 | `orders.map(order => ...)` | AdminOrdersPage | 全注文を繰り返す |
| 2 | `order.name / phone / address` | OrderCard | 注文1件の顧客情報 |
| 3 | `items.map(item => ...)` | OrderItemList | 注文内の商品一覧 |
| 4 | `isLoading` の案内表示 | AdminOrdersPage | ページ全体の読み込み状態 |
| 5 | `<select value={order.status}>` | OrderCard | 注文1件の操作UI |
| 6 | 状態を実際に更新する関数 | useOrders | データ更新処理 |
| 7 | `orders.length === 0` の表示 | AdminOrdersPage | 全体の空状態 |
| 8 | `item.quantity / item.price` | OrderItemList | 商品単位の表示 |

## Part 2：理解度チェック
**Q1.** 注文が0件のメッセージはどこ？  
**A.** `AdminOrdersPage`。ページ全体の空状態だから。

**Q2.** `OrderItemList` を既に使っている場合、同じ一覧コンポーネントを作る？  
**A.** 作らない。既存の責務分離を確認する。

**Q3.** 10行を超えたJSXは必ず分割する？  
**A.** いいえ。意味・重複・変更理由・Props境界で判断する。

**Q4.** `OrderCard` 内で `useOrders()` を再度呼ぶべき？  
**A.** 今回の構成では不要。親から `onStatusChange` を受け取る。

**Q5.** `function User({ name: string })` は型注釈？  
**A.** いいえ。`name` を `string` という変数名に変更する分割代入。

**Q6.** 正しいProps宣言は？
```tsx
function User({ name, age }: { name: string; age: number }) {
  return <p>{name} {age}</p>;
}
```
**A.** 正しい。前半は値の取り出し、後半は型宣言。

## Part 3：自己確認
- `orders.map` と `items.map` の責務の違いを説明できる。
- `key` はReactの識別用であり、画面表示そのものではないと説明できる。
- `onStatusChange` の呼び出しと実際のデータ更新を区別できる。
- 必須ではない分割を見送れる。

**ヒント：** 正解を暗記するより、各コードの変更理由とデータの範囲を言葉にしてみよう。
