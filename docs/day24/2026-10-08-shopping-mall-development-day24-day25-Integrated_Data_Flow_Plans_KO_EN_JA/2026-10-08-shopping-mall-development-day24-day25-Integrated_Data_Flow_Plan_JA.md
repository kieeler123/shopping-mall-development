# Day 25 — データフロー統合 学習プラン

> **題材：** ECサイトの注文履歴表示と注文キャンセル  
> **目標：** Day 21〜24 の非同期処理、State、Event、Effect を一つの機能として結び付ける。  
> **学習時間の目安：** 90〜120分  
> **前提知識：** `async/await`、`fetch`、`useState`、イベントハンドラー、`useEffect`、依存配列

## 1. 今日の中心となる問い

**サーバーのデータはどのように UI になり、ユーザー操作はどのようにサーバーと UI を更新するのか？**

```text
【初回取得】
ページの render → useEffect → fetch(GET) → サーバー応答
→ setOrders(新しいデータ) → 再レンダリング → 注文一覧 UI

【注文キャンセル】
キャンセルをクリック → イベントハンドラー → fetch(POST)
→ サーバー側でキャンセル → 最新の注文データを再取得
→ setOrders(更新データ) → 再レンダリング → 更新後の UI
```

**コツ：** データの**取得元（サーバー）**、**保存先（State）**、**表示先（UI）**、**実行のきっかけ（Event）**を区別する。

## 2. Day 21〜24 のつながり

| 既習内容 | 今日の役割 | 実際のコード |
|---|---|---|
| Day 21 — 非同期 | API 応答を待ち、失敗に対処する | `async/await`、`fetch` |
| Day 22 — State | 注文・読み込み中・エラーを保存する | `useState` |
| Day 23 — Event | キャンセルボタンのクリックに応答する | `onClick`、`handleCancel` |
| Day 24 — Effect | ページ表示・ユーザー変更に応じて注文を取得する | `useEffect`、`[userId]` |

**コツ：** コードの各処理に「非同期／State／Event／Effect」のラベルを付けてみる。

## 3. 今日実装する機能

1. ページを開いたら該当ユーザーの注文を取得する。
2. 通信中は読み込みメッセージを表示する。
3. 注文一覧を表示する。
4. キャンセル可能な注文にボタンを表示する。
5. ボタンのクリック後にだけキャンセル API を呼ぶ。
6. 成功後に最新の注文を再取得して UI を更新する。
7. 失敗した場合はエラーを表示する。

**学習用 API 仕様（仮定）：**
- `GET /api/orders?userId=...` → `Order[]`
- `POST /api/orders/:orderId/cancel` → 成功時は 2xx

この URL とレスポンス形式は**学習用の仮定**である。実際のプロジェクトに合わせて変更する。サーバー側では、クライアントが送った `userId` だけを信用せず、認証・権限確認を行う。

**コツ：** 実装前に API の入力、出力、失敗時の振る舞いを確認する。

## 4. 学習スケジュール

| 段階 | 時間 | 学習・実習 | 完了条件 |
|---|---:|---|---|
| 1. フローを描く | 10分 | 取得とキャンセルを図にする | きっかけの違いを説明 |
| 2. 型・State | 15分 | `Order`、`orders`、`loading`、`error` | State の役割を説明 |
| 3. 初回取得 | 20分 | Effect 内で GET | ページ表示時に注文が出る |
| 4. キャンセル | 20分 | `handleCancel` 内で POST | クリック時のみ実行 |
| 5. UI の再同期 | 15分 | 成功後に再取得 | UI がサーバーと一致 |
| 6. 例外処理 | 15分 | エラー・読み込み・連打防止 | 適切なフィードバック |
| 7. 復習 | 10分 | 全体の流れを説明 | コードを言葉で追える |

**コツ：** 一度に全部書かず、各段階でブラウザーの動作を確認する。

## 5. 統合実習コード（React + TypeScript）

```tsx
import { useEffect, useState } from "react";

type OrderStatus = "PAID" | "CANCELLED";
type Order = {
  id: number;
  productName: string;
  status: OrderStatus;
};

export default function OrdersPage({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Day 24: ユーザー変更やキャンセル成功後に同期
  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders() {
      setLoading(true);
      setError(null);
      setOrders([]);

      try {
        // Day 21: 非同期 API 取得
        const response = await fetch(
          `/api/orders?userId=${encodeURIComponent(userId)}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("注文の取得に失敗しました。");

        const data: Order[] = await response.json();
        if (!controller.signal.aborted) {
          // Day 22: State 更新 → 再レンダリング
          setOrders(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "不明なエラー");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadOrders();
    return () => controller.abort();
  }, [userId, refreshKey]);

  // Day 23: ユーザーの明示的な操作
  async function handleCancel(orderId: number) {
    if (cancellingId !== null) return;
    setCancellingId(orderId);
    setError(null);

    try {
      // Day 21: 非同期の変更リクエスト
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("注文のキャンセルに失敗しました。");

      // 最新のサーバーデータを再取得する
      setRefreshKey((key) => key + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "不明なエラー");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <section>
      <h1>注文履歴</h1>
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p>注文を読み込み中...</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              {order.productName} — {order.status}
              {order.status === "PAID" && (
                <button
                  disabled={cancellingId !== null}
                  onClick={() => void handleCancel(order.id)}
                >
                  {cancellingId === order.id ? "処理中..." : "注文をキャンセル"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

### コードの流れ

1. React がページを render し、変更をコミットする。
2. Effect が `userId` と `refreshKey` に応じて注文を取得する。
3. `setOrders` で State を更新し、注文一覧が再レンダリングされる。
4. キャンセルボタンを押すと **Effect ではなく `handleCancel`** が実行される。
5. サーバーでのキャンセル成功後、`refreshKey` を増やす。
6. Effect が再実行され、**サーバーの最新状態**を取得する。
7. `setOrders` が更新され、UI に反映される。

**注意：** `refreshKey` は**学習用の簡単な再取得トリガー**である。実務ではクエリの無効化（invalidation）やルーターの再検証を利用する場合がある。再取得が終わるまで以前の一覧が一時的に表示されることもある。

**コツ：** `setRefreshKey` が注文をキャンセルするわけではない。**変更はイベントハンドラー、再同期は Effect** が担当する。

## 6. 動作確認チェックリスト

- [ ] 初回表示時に GET が実行される。
- [ ] `userId` の変更時に新しい注文が取得される。
- [ ] クリックしていないのに POST が実行されない。
- [ ] キャンセル成功後に GET で最新状態を取得する。
- [ ] キャンセル失敗時に成功したような表示をしない。
- [ ] 読み込み中・エラーメッセージが表示される。
- [ ] キャンセルボタンの連打を防止できる。
- [ ] ページ離脱や `userId` 変更時に以前の GET が中断される。

**コツ：** 開発者ツールの Network タブで **GET → POST → GET** を確認する。開発時の Strict Mode では Effect の追加チェックによりリクエストが増える場合がある。

## 7. 理解度チェック

**問題 1.** 初回 GET はどこで開始するのが適切か？  
① render 本体 ② `useEffect` ③ キャンセルボタンの `onClick`

**問題 2.** キャンセル POST はいつ実行すべきか？  
① render のたび ② `userId` 変更のたび ③ ユーザーがキャンセルをクリックしたとき

**問題 3.** `setOrders(data)` の主な役割は？  
① サーバー DB を直接変更 ② State を更新して再レンダリングを促す ③ 通信を切断する

**問題 4.** 成功後に `refreshKey` を増やす理由は？  
① Effect に最新の注文を再取得させる ② POST を自動的に再送する ③ React を終了する

**問題 5.** 正しい説明は？  
① GET は必ず Effect で実行する。  
② POST は render 中に実行する。  
③ Effect とイベントハンドラーは**実行のきっかけ**で区別する。

### 正解と解説

1. **②** — ページ表示に応じた外部データとの同期。
2. **③** — キャンセルはユーザー操作によって始まる。
3. **②** — State の更新が再レンダリングを促す。
4. **①** — 依存値の変化により Effect が再実行される。
5. **③** — HTTP メソッドは判断基準ではない。

**コツ：** 正解だけでなく、不正解の選択肢がなぜ違うかも説明してみる。

## 8. 今日の達成条件

- [ ] `API → fetch → Data → State → UI` を説明できる。
- [ ] `UI → Event → API 変更 → 最新 Data → State → UI` を説明できる。
- [ ] Effect とイベントハンドラーを区別できる。
- [ ] 失敗時に誤った成功表示をしない。
- [ ] Day 21〜24 の概念がコードのどこにあるか説明できる。

**一文でまとめると：** Effect でサーバーデータを同期し、State から UI を描画し、ユーザー操作でサーバーを変更した後、最新データを再同期する。

**コツ：** コードを見ずに **GET → State → UI → クリック → POST → 再取得 → State → UI** を説明してみる。
