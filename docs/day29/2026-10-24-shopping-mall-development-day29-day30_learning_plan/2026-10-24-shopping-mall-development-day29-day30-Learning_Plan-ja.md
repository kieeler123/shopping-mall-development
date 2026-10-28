# Day 30 学習プラン --- React + TypeScript 実践デバッグ

> **学習目標：** Day 29 の UI
> 状態モデリングを土台に、TypeScript・ESLint・テストを使ってエラーを発見、分類、修正、検証する。
>
> **学習時間：** 100分（休憩を除く）\
> **前提知識：** Day 29 --- Loading / Error / Empty /
> Success、`&&`、早期 return、GET/PATCH エラーの分離

## 1. 到達目標

学習後には次のことができるようになる。

-   構文エラー、型エラー、Lint 警告、ロジック上のバグを区別する。
-   VS Code の Problems パネルでエラーの場所と内容を確認する。
-   `npx tsc --noEmit` と `npx eslint .` の結果を読み取る。
-   React/TSX の分割代入、Props、JSX、条件分岐のミスを修正する。
-   静的解析だけでは見つけにくい UI の不具合を検証する。
-   原因・修正・検証結果をデバッグ記録に残す。

**ヒント：**
修正を始める前に、エラーの種類・原因の予想・確認に使うツールを書き出す。

## 2. 100分の学習スケジュール

  ----------------------------------------------------------------------------------------------
  セッション                        時間 内容                           成果物
  ---------------- --------------------- ------------------------------ ------------------------
  1\. エラーの分類                  15分 Syntax / Type / Lint / Logic   分類メモ

  2\. ツール演習                    20分 VS Code                        検査結果
                                         Problems、TypeScript、ESLint   

  3\. React                         20分 `useOrders`、Props、JSX        修正したコンポーネント
  デバッグ                                                              

  4\. ロジック検証                  25分 UI の4状態、GET/PATCH          状態別検証表
                                         エラー分離                     

  5\. 実践評価                      20分 バグ修正テストと振り返り       採点表・記録

  **合計**                     **100分**                                
  ----------------------------------------------------------------------------------------------

**ヒント：** 必要に応じて途中に5〜10分の休憩を入れる。

## 3. 準備とコマンド

既存の Next.js + TypeScript プロジェクトを VS Code
で開く。必要な依存関係と ESLint の設定を確認する。

``` bash
npx tsc --noEmit
npx eslint .
```

TypeScript は型と構文を、ESLint
は設定されたルールへの違反を検査する。Prettier
は主に書式を整えるツールで、ロジックの正しさまでは保証しない。コマンドはプロジェクトの設定に応じて調整する。

**ヒント：** `ファイル → 行番号 → エラー内容 → 修正方法`
の順で記録する。

## 4. 基準となるコンポーネント

``` tsx
function AdminOrdersPage() {
  const { orders, isLoading, error } = useOrders();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (orders.length === 0) return <p>Empty</p>;

  return <OrderList orders={orders} />;
}
```

このコードに意図的にバグを入れ、ツールの検査結果を予想してから修正する。`useOrders()`
はオブジェクトを返し、`OrderList` は `orders` Props
を受け取るものとする。

## 5. 実践課題

### Level 1 --- スペルミスと分割代入

``` tsx
const [orders, isLoading, error] = useOrders();
return <p>{err}</p>;
```

オブジェクトの分割代入と、未定義の `err` を修正する。

**ヒント：** `useState` は配列を返すが、カスタム Hook
は返り値の型を確認する必要がある。

### Level 2 --- JSX と Props

``` tsx
return <OrderList order={orders}>
```

Props 名を直し、タグを正しく閉じる。

**ヒント：** 閉じ忘れなどの構文ミスは TSX パーサーで検出できる。

### Level 3 --- Success の条件

``` tsx
{!isLoading && error && orders.length > 0 && (
  <OrderList orders={orders} />
)}
```

`error` ではなく `!error` が必要な理由を説明する。

**ヒント：** 構文と型が正しくても、画面の動作が正しいとは限らない。

### Level 4 --- GET/PATCH エラーの分離

`fetchError` と `updateError`
を分ける。更新に失敗しても、取得済みの注文一覧を非表示にしない。

``` tsx
if (fetchError) return <p>取得エラー: {fetchError}</p>;

return (
  <main>
    {updateError && <p role="alert">更新エラー: {updateError}</p>}
    {orders.length === 0
      ? <p>Empty</p>
      : <OrderList orders={orders} />}
  </main>
);
```

これは Loading の処理が済んでいることを前提とした部分的な例である。

**ヒント：**
ページ全体を止めるエラーと、一部の操作だけに関係するエラーを区別する。

### Level 5 --- 動作検証

Loading / Error / Empty / Success の4状態と、PATCH
失敗後も注文一覧が残ることを確認する。

**ヒント：**
静的解析で見つかった問題と、動作テストで見つかった問題を分けて記録する。

## 6. 評価基準（100点）

  評価項目                              配点
  -------------------------------- ---------
  エラーの分類                            15
  TypeScript エラーの解釈                 20
  ESLint エラーの解釈                     15
  React コンポーネントのデバッグ          30
  ロジック修正と検証                      20
  **合計**                           **100**

**推奨合格ライン：** 80点以上。

**ヒント：** 長いコードの回答は VS Code
で作成してチャットに貼り付ける。以前発生したカーソル移動や入力文字の消失を避けるためである。

## 7. デバッグ記録テンプレート

``` md
### デバッグ記録
- 症状:
- エラーの種類:
- ツールのメッセージ:
- 原因:
- 修正内容:
- 再検証の結果:
- 再発防止策:
```

## 8. 次の学習

-   **Day 31 の提案：** React コンポーネントテストの基礎
-   **Day 32 の提案：** Vitest + React Testing Library による UI
    状態テスト

**ヒント：** Day 30
では新機能の追加よりも、既存コードの問題を正確に発見して修正することを優先する。
