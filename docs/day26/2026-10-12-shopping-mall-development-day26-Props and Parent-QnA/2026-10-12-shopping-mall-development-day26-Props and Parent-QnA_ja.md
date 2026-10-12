# Day 26 — 復習問題と解答

## 9. 復習問題

先に問題を解き、下の解答欄を開いて確認しましょう。

1.  Propsはどの方向に渡される？

2.  `order`と`onStatusChange`の役割の違いは？

3.  `onClick={onStatusChange(order.id)}`が適切でない理由は？

4.  注文ID 101だけをキャンセルする`setOrders`を書こう。

5.  キャンセル済みボタンを無効化するJSX属性を書こう。

6.  管理画面の`onStatusChange={???}`に入る値は？

7.  `key={order.id}`と`order={order}`の違いは？

8.  Next.js App Routerで`useState`を使うときの注意点は？

## 10. 解答と解説

<details><summary>問題1の解答を見る

</summary>

親 → 子。子からの変更依頼はコールバックで伝える。

</details>

<details><summary>問題2の解答を見る

</summary>

`order`はデータProps、`onStatusChange`は関数Props。

</details>

<details><summary>問題3の解答を見る

</summary>

レンダリング中に関数を呼び出してしまうため。`onClick={() => onStatusChange(order.id)}`を使う。

</details>

<details><summary>問題4の解答を見る

</summary>

`setOrders(prev => prev.map(order => order.id === 101 ? {...order, status: 'CANCELLED'} : order));`

</details>

<details><summary>問題5の解答を見る

</summary>

`disabled={order.status === 'CANCELLED'}`

</details>

<details><summary>問題6の解答を見る

</summary>

`updateOrderStatus`。実行結果ではなく関数そのものを渡す。

</details>

<details><summary>問題7の解答を見る

</summary>

`key`はReactのリスト識別用の特別な属性、`order`は子が受け取る通常のProps。

</details>

<details><summary>問題8の解答を見る

</summary>

適切な`'use client'`境界を設ける。

</details>

---

**要点:**
Propsは下へ、変更依頼はコールバックで上へ、Stateの更新は所有者が行う。
