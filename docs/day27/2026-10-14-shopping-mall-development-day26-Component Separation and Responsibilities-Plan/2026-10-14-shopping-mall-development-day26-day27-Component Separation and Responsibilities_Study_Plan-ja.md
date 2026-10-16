# Day 28 — データフローと状態更新

中心となる問い：Custom Hook が提供する状態と関数を UI で安全に使い、変更を画面へ反映するには？

**Stack:** Next.js · React · TypeScript  
**Duration:** 90 min

## 1. 学習目標

- Props と Callback によるデータの流れを説明する
- `updateOrderStatus` までの呼び出し経路を追う
- `map()` を使った不変な状態更新を理解する
- API の成功・失敗と UI への反映を説明する
- 関数 Props の TypeScript 型を記述する

## 2. 学習範囲

**対象：** 単方向データフロー、Callback Props、状態の不変性、非同期更新、エラー処理、TypeScript。

**対象外：** 新しい状態管理ライブラリ、API の再設計、大規模なリファクタリング。

## 3. 90分の学習スケジュール

| 段階                     |     時間 | 内容                         |
| ------------------------ | -------: | ---------------------------- |
| Day 27〜28 の復習        |     10分 | コンポーネントと Hook の責務 |
| データフロー             |     15分 | Props と Callback            |
| 状態更新                 |     15分 | 配列・オブジェクトの不変性   |
| API 更新処理             |     15分 | 成功・失敗                   |
| プロジェクト演習         |     15分 | 既存関数の分析               |
| 概念・コーディングテスト |     20分 | 15問                         |
| **合計**                 | **90分** |                              |

## 4. 演習計画

1. **Callback を追う：** `AdminOrdersPage` → `OrderCard` → `onStatusChange` → `updateOrderStatus`。
2. **不変性：** 直接変更と `map()`・スプレッド構文を比較する。
3. **非同期：** API 失敗時の処理と UI の同期を確認する。
4. **型：** Props の分割代入と TypeScript 型注釈を復習する。

既存の動作に問題がなければ、不要な変更はしない。

### Reference code (illustrative)

```tsx
const { orders, isLoading, error, updateOrderStatus } = useOrders();

<OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} />;
```

```tsx
setOrders((prev) =>
  prev.map((order) =>
    order.id === targetId ? { ...order, status: newStatus } : order,
  ),
);
```

## 5. コーディングテスト計画（15問）

| 種類             | 問題数 |
| ---------------- | -----: |
| 既習内容の復習   |      3 |
| 応用・変形       |      3 |
| 新しい基礎問題   |      4 |
| プロジェクト実践 |      3 |
| バグ修正         |      2 |
| **合計**         | **15** |

別の HTML 問題集では、コード入力、折りたたみ式解答、左右比較、自動保存を利用できる予定。

## 6. 完了基準

- [ ] Props と Callback の流れを説明できる
- [ ] `updateOrderStatus` の呼び出し経路を追える
- [ ] State の直接変更が問題となる理由を説明できる
- [ ] `map()` で不変な更新を書ける
- [ ] API エラー処理を説明できる
- [ ] 関数 Props の型を書ける
- [ ] 15問を完了する
- [ ] 既存の注文管理機能を確認する

## 7. 学習のヒント

**ヒント：** 変更前に実際の `useOrders()` を読み、API リクエストとローカル状態更新の順序を確認する。

## 8. 学習のヒント
