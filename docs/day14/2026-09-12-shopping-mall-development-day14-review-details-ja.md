# Day 14 復習問題

## STEP 1

**Q1. Day 14 の中心的な学習目標は何ですか？**

<details><summary><strong>解答を見る</strong></summary>

**A1.** `AdminOrdersPage` 内に混在していた React state と state
更新ロジックを、`useOrders` という Custom Hook に分離することです。

Day 13 では `OrderCard` と `OrderItemList` に UI の責務を分け、Day 14
では `orders`、`setOrders`、`updateOrderStatus` など注文状態に関する
React ロジックの責務を分離しました。

**ヒント:** まず
`Component = 何を表示するか`、`Custom Hook = React state と関連動作をどう管理するか`
と考えると理解しやすいです。

---

</details>

## STEP 2

**Q2. UI と React ロジックはどう区別しますか？**

<details><summary><strong>解答を見る</strong></summary>

**A2.** 画面をレンダリングすることが目的なら UI に近く、state
を保存・更新することが目的なら React ロジックに近いです。

```tsx
orders.map((order) => <OrderCard key={order.id} order={order} />);
```

上の `map()` は `OrderCard` を繰り返し画面に表示するため、UI
レンダリングです。

반면:

```tsx
setOrders(
  orders.map((order) =>
    order.id === orderId ? { ...order, status: newStatus } : order,
  ),
);
```

上の `map()` はデータを変更するために使われるのでロジックです。

**ヒント:** `map()` という構文自体を
UI/ロジックとして覚えず、そのコードの目的を見ます。

---

</details>

## STEP 3

**Q3. UI ロジック、React ロジック、ビジネスロジックの違いは何ですか？**

<details><summary><strong>解答を見る</strong></summary>

**A3.** UI
ロジックはモーダルの開閉や選択中のタブなど画面上の操作を扱います。React
ロジックは `useState`、`useEffect`、Custom Hook など React の state
やレンダリング機構を使います。ビジネスロジックは React
がなくても存在するサービスやドメインのルールです。

例えば:

```tsx
function canCancelOrder(order: Order) {
  return order.status !== "배송완료";
}
```

「配送完了した注文はキャンセルできない」というルールは React
がなくても必要なので、

**ヒント:** `React がなくなってもこのルールは必要か？`
と考えると、ビジネスロジックを区別しやすくなります。

---

</details>

## STEP 4

**Q4. 通常の関数と Custom Hook の違いは何ですか？**

<details>

<summary>

<strong>解答を見る</strong>

</summary>

**A4.** 通常の関数は React に依存しない計算やデータ処理を担当できます。

```tsx
function calculateTotal(price: number, quantity: number) {
  return price * quantity;
}
```

Custom Hook は React Hook を使って React state
と関連ロジックをまとめます。

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  return { orders };
}
```

Custom Hook も JavaScript 関数ですが、React Hook を使用し Hook
のルールに従い、名前を `use` で始めます。

**ヒント:** React の外でもそのまま実行できるなら通常の関数、
`useState` のような Hook が必要なら Custom Hook をまず検討します。

---

</details>

## STEP 5

**Q5. なぜ `orders` state を `useOrders` に移したのですか？**

<details><summary><strong>解答を見る</strong></summary>

**A5.** `AdminOrdersPage` が UI レンダリングだけでなく注文 state
の管理まで担当していたからです。

分離前:

```tsx
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  // ...
}
```

分離後:

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  return { orders };
}
```

ページ側:

```tsx
const { orders } = useOrders();
```

これで注文 state を管理する責務が `useOrders` に移りました。

**ヒント:** コンポーネントが多くのことを担当しすぎている場合は、state とその state
に 密接に関係する

---

</details>

## STEP 6

**Q6. state だけを先に `useOrders` に移したとき、なぜ `setOrders`
エラーが発生したのですか？**

<details><summary><strong>解答を見る</strong></summary>

**A6.** JavaScript の関数スコープが理由です。`setOrders` が `useOrders`
内部へ移動したため、`AdminOrdersPage` に残っていた `handleStatusChange`
からはアクセスできなくなりました。

```tsx
function useOrders() {
  const [orders, setOrders] = useState(initialOrders);
}
```

여기서 `setOrders`는 `useOrders` 내부 변수입니다.

そのため `handleStatusChange` も `useOrders`
内へ移すのが自然な次の段階でした。

**ヒント:** リファクタリング中に一時的に発生するエラーをすぐ失敗だと 考えず、

「どの関連する責務をまだ一緒に移していないのか？」を確認します。

---

</details>

## STEP 7

**Q7. なぜ `handleStatusChange` を `updateOrderStatus`に変更したのですか？**

<details><summary><strong>解答を見る</strong></summary>

**A7.** `handleStatusChange` は UI
イベントハンドラのように聞こえますが、Hook
内の関数は実際には注文ステータスデータを更新する機能を担当します。

```tsx
function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
  // 注文ステータスを変更
}
```

`updateOrderStatus` のほうが関数の実際の責務を明確に表します。

**ヒント:** 関数名は「どのように実装したか」よりも「何を
するのか」を

---

</details>

## STEP 8

**Q8. `return { orders, updateOrderStatus }` はなぜ重要ですか？**

<details><summary><strong>解答を見る</strong></summary>

**A8.** `useOrders`
が外部コンポーネントに公開する値と機能を決めるからです。

```tsx
return {
  orders,
  updateOrderStatus,
};
```

ページ側では:

```tsx
const { orders, updateOrderStatus } = useOrders();
```

のように使用できます。

一方 `setOrders` は返していないため、外部から直接使えません。

**ヒント:** Custom Hook の `return` を、その Hook の
**公開インターフェースまたは利用説明書** と考えます。

---

</details>

## STEP 9

**Q9. `setOrders` を隠すことがなぜカプセル化なのですか？**

<details><summary><strong>解答を見る</strong></summary>

**A9.** 内部の実装方法を隠し、外部には必要な機能だけを提供するからです。

`setOrders` まで公開すると、外部から:

```tsx
setOrders([]);
```

のように注文 state を自由に変更できてしまいます。

しかし:

```tsx
updateOrderStatus(1, "配送中");
```

のように意味のある機能だけを公開すれば、注文 state
を決められた方法で変更できます。

```text
setOrders

→ 内部実装のための手段

updateOrderStatus

→ 外部に公開する機能
```

**ヒント:**
カプセル化は単に隠すことではなく、**内部実装を保護し、必要な入口だけを公開すること**と理解します。

---

</details>

## STEP 10

**Q10. `setOrders()` を呼んでも `orders`
がすぐに変わらないのはなぜですか？**

<details><summary><strong>解答を見る</strong></summary>

**A10.** 現在のレンダリングの `orders` は、そのレンダリングで使う state
のスナップショットだからです。

```tsx
console.log(orders);
setOrders(newOrders);
console.log(orders);
```

二つ目のログでも、現在のレンダリングが持つ以前の `orders`
が表示されることがあります。

`setOrders()` は現在の変数を直接変更するのではなく、React に次の state

更新と再レンダリングを要求します。

**ヒント:** `setOrders()`
は「今すぐ変数を変更する」より「次のレンダリングで使う state
更新を要求する」と理解します。

---

</details>

## STEP 11

**Q11. `useOrders` 内の `useState`
はどう再レンダリングにつながりますか？**

<details><summary><strong>解答を見る</strong></summary>

**A11.** `useOrders`
自体が別コンポーネントのように再レンダリングされるわけではありません。`AdminOrdersPage`
のレンダリング時に `useOrders()` も一緒に実行されます。

```text
AdminOrdersPage を実行

→ useOrders() を実行

→ useState() を呼び出す

→ orders を返す

→ JSX を生成
```

state 変更時:

```text
updateOrderStatus()

→ setOrders()

→ state を更新

→ AdminOrdersPage を再レンダリング

→ useOrders() を再実行

→ 新しい orders を使用
```

**ヒント:** Custom Hook
は独立したコンポーネントではなく、**コンポーネントのレンダリング過程で一緒に実行される
React ロジックのまとまり**です。

---

</details>

## STEP 12

**Q12. `OrderCard` はなぜ `updateOrderStatus`の実装を知らなくてもよいのですか？**

<details><summary><strong>解答を見る</strong></summary>

**A12.** `OrderCard` は callback prop である `onStatusChange`
の呼び出し方だけ知ればよいからです。

```tsx
onStatusChange(order.id, newStatus);
```

페이지에서:

```tsx
<OrderCard order={order} onStatusChange={updateOrderStatus} />
```

として渡しているため、実際の実装が `useOrders` 内にあっても `OrderCard`
は影響を受けません。

**ヒント:** 子コンポーネントは callback
の内部実装ではなく、**どの引数を渡すか**だけ知れば十分です。

---

</details>

## STEP 13

**Q13. 注文ステータス変更の全体データフローはどうなりますか？**

<details><summary><strong>解答を見る</strong></summary>

**A13.**

```text
ユーザーが select を変更
→ OrderCard の onChange
→ onStatusChange(order.id, newStatus)
→ updateOrderStatus()
→ useOrders 内部の setOrders()
→ orders state を更新
→ AdminOrdersPage を再レンダリング
→ 新しい orders を OrderCard に渡す
→ 変更後の状態を画面に表示
```

**ヒント:** Reactのコードが複雑になったら、関数ごとに見るだけでなく、 データが
どこから始まり、どこへ移動するのかを矢印で描いてみます。

---

</details>

## STEP 14

**Q14. コンポーネント分離とロジック分離はどう違いますか？**

<details><summary><strong>解答を見る</strong></summary>

**A14.** Day 13 のコンポーネント分離は UI の責務を分ける作業でした。

```text
AdminOrdersPage
→ OrderCard
→ OrderItemList
```

Day 14 のロジック分離は React state と state
更新の責務を分ける作業でした。

```text
AdminOrdersPage
→ useOrders
→ useState
```

**ヒント:** `Component = UI の責務`、`Custom Hook = React ロジックの 責務` という
基本的な区別をまず押さえ、必要に応じてさらに細かく分けます。

---

</details>

## STEP 15

**Q15. ロジック分離とファイル分離は同じですか？**

<details><summary><strong>解答を見る</strong></summary>

**A15.** いいえ。同じ `page.tsx` 内でも:

```tsx
function useOrders() {
  // React logic
}

export default function AdminOrdersPage() {
  // UI
}
```

のように責務を分けていれば、すでにロジック分離はできています。

その後、理解と動作を確認してからファイルを分離しました。

```text
責務分離
→ 動作確認
→ ファイル分離
```

**ヒント:** 最初から多くのファイルを作るのではなく、まず責務の境界を見つけます。

---

</details>

## STEP 16

**Q16. 最終的なファイル構成と各役割はどうなりましたか？**

<details><summary><strong>解答を見る</strong></summary>

**A16.**

```text
app/admin/orders/
├─ page.tsx
├─ components/
│  ├─ OrderCard.tsx
│  └─ OrderItemList.tsx
└─ hooks/
   └─ useOrders.ts

types/
└─ order.ts
```

`page.tsx` はページ UI の組み立て、`OrderCard.tsx` は注文カード UI、

`OrderItemList.tsx` は商品一覧 UI、`useOrders.ts` は注文 state と 更新

ロジック、`types/order.ts` は注文関連の型を担当します。

**ヒント:** 各ファイルの役割を一文で説明できれば、責務は 比較的

うまく分離されています。

---

</details>

## STEP 17

**Q17. ファイル分離中に発生した `CartItem`型エラーの原因は何でしたか？**

<details><summary><strong>解答を見る</strong></summary>

**A17.** 実際の `OrderItem` には `id` がありましたが、自動 import
が別の型である `CartItem` を参照していました。

エラー:

```text
Object literal may only specify known properties,
and 'id' does not exist in type 'CartItem'.
```

重要な手掛かりは、エラーメッセージに予想していなかった `CartItem`
という型名が出ていたことです。

解決の流れ:

```text
エラーメッセージの型名を確認
→ import を確認
→ 実際の型定義の場所を確認
→ 誤った自動 import を修正
```

**ヒント:** 「型にそのプロパティが確実にあるのに、ないと表示される」場合は、型
定義そのものをすぐ

修正するのではなく、**\*\*現在どの型を実際に import
しているのか\*\***を先に

確認します。

---

</details>

## STEP 18

**Q18. `import type` はなぜ使いますか？**

<details><summary><strong>解答を見る</strong></summary>

**A18.** TypeScript の型だけを import
する意図を明確に表現できるからです。

```tsx
import type { Order, OrderStatus } from "@/types/order";
```

`Order` や `OrderStatus`のように、ランタイム値ではなく型としてのみ使用する
import に適用できます。

**ヒント:** 型専用の import に `import type` を使うと、ファイル
上部の依存関係が読みやすくなります。

---

</details>

## STEP 19

**Q19. 関数型 state 更新とは何ですか？**

<details><summary><strong>解答を見る</strong></summary>

**A19.** 新しい state が以前の state に依存するとき、以前の state
を関数引数として受け取り計算する方法です。

現在の方式:

```tsx
setOrders(
  orders.map(...)
);
```

関数型更新:

```tsx
setOrders((prevOrders) =>
  prevOrders.map((currentOrder) => {
    if (currentOrder.id === orderId) {
      return {
        ...currentOrder,
        status: newStatus,
      };
    }

    return currentOrder;
  }),
);
```

現在のコードでも動作しますが、`新しい state = 以前の state を基準に計算`
する場合は、関数型更新が役立ちます。

**ヒント:** 以前の state を使って次の state を作る場合は、
`setState(prev => ...)` のパターンを思い出します。

---

</details>

## STEP 20

**Q20. Day 14 を一文でまとめると？**

<details><summary><strong>解答を見る</strong></summary>

**A20.**

> **Custom Hook は単にコードを短くするための道具ではなく、React state**
> **とそれに関連するロジックを一つの責務として分離し、コンポーネントに必要な値と機能だけを公開するための構造です。**

今日を代表するコードは次のとおりです。

```tsx
const { orders, updateOrderStatus } = useOrders();
```

`AdminOrdersPage` は、注文 state が内部でどのように保存・
更新されるのかを知る必要がなくなり、`orders` を使って画面を描画し、
`updateOrderStatus` を必要な場所へ渡せばよくなりました。

**ヒント:** Day 14 を復習するときは、
`UI → Callback → Custom Hook → setState → rerender → UI` の流れを自分で
説明できるか確認します。

</details>
