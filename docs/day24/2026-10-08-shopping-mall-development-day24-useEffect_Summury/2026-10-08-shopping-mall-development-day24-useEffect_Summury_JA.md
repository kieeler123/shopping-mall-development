# Day 24 学習総まとめ --- `useEffect` と外部システムの同期

> ECサイトの注文履歴ページを題材に、**なぜ render ではなく
> Effect／イベントハンドラーで実行するのか**を理解する。

## 1. 最重要ポイント

`useEffect = fetch` ではない。**Effect は React
コンポーネントを外部システムと同期させる仕組み**である。外部システムには
API、WebSocket、ブラウザーイベント、タイマー、外部ライブラリなどがある。

- **render**：現在の props と state から JSX
  を計算する。純粋であるべき処理。
- **Effect**：レンダリング結果のコミット後に外部システムと同期し、必要なら後片付け（cleanup）する。
- **イベントハンドラー**：ユーザーの特定の操作に応答する。
- **state 更新**：新しいデータを反映するための再レンダリングを促す。

**コツ：** GET／POST
や「受信／送信」で分類せず、**何が実行のきっかけか**を考える。

## 2. 注文履歴ページの流れ

```text
OrdersPage の render（orders = []）
  ↓
React が DOM 更新をコミット
  ↓
Effect のセットアップ実行
  ↓
GET /api/orders
  ↓
レスポンス → setOrders(data)
  ↓
state 更新 → 再レンダリング
  ↓
orders.map(...) で注文一覧を表示
```

Effect が直接 UI を描画するのではない。**Effect → state 更新 → render**
という関係である。既存の props/state から計算できる値なら、Effect
を使わず render 中に計算する。

**コツ：** `fetch → setOrders → orders.map`
を一続きの処理として追跡する。

## 3. render 中に API を呼ぶ危険性

```tsx
function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  loadOrders(); // ❌ render 中の副作用
  return <OrderList orders={orders} />;
}
```

API 応答のたびに `setOrders(newArray)`
を実行すると、次の循環が発生し得る。

```text
render → loadOrders → API 応答 → setOrders → render → ...
```

React
のレンダリングは**純粋**でなければならない。レンダリングは中断・再試行される可能性がある。すべての
state
更新が必ず無限ループになるわけではないが、この構造は重複リクエストや競合を招きやすい。

**コツ：** render は UI の計算、外部同期は適切な Effect
やフレームワークのデータ取得機能に分離する。

## 4. 依存配列（dependency array）の正確な意味

```tsx
useEffect(() => {
  // 外部システムとの同期
}, [userId]);
```

React は以前の依存値と現在の依存値を **`Object.is`** で比較する。

---

| 書き方                    | 動作                                                     |
| ------------------------- | -------------------------------------------------------- |
| `useEffect(fn)`           | コミットのたびに実行                                     |
| `useEffect(fn, [])`       | マウント時にセットアップ、アンマウント時にクリーンアップ |
| `useEffect(fn, [userId])` | マウント時、および `userId` 変更時に再同期               |

---

依存配列には Effect
が参照する**リアクティブな値**（props、state、コンポーネント内部で宣言された値など）を宣言する。配列が値を
Effect に「渡す」のではなく、React
が**前回と比較する**。必要な依存値を省略すると古い値を読む stale closure
の原因になる。

開発時の **Strict Mode** では不具合検出のためセットアップ →
クリーンアップ → セットアップが追加実行される場合がある。したがって
`[] = 絶対に一度だけ` ではない。

**コツ：** 実行回数よりも「何が変わったら再同期すべきか」を考える。

## 5. 関数の参照が変わると Effect が繰り返される理由

```tsx
function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const loadOrders = async () => {
    const res = await fetch("/api/orders");
    setOrders(await res.json());
  };
  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);
  return <OrderList orders={orders} />;
}
```

**コンポーネント本体で定義した関数**はレンダリングのたびに新しい関数オブジェクトになる。

```tsx
const a = () => {};
const b = () => {};
Object.is(a, b); // false
```

新しい関数参照 → `[loadOrders]` が変化 → Effect 再実行 → state 更新 →
再レンダリング → 新しい関数参照、という循環が起こり得る。

**表現の修正：**「依存配列の外に宣言したから」ではなく、**「コンポーネント本体で毎回新しく生成されるから」**である。モジュールのトップレベルに宣言した関数とは異なる。

**コツ：** 関数の中身が同じでも、参照が同じとは限らない。

## 6. 解決策 A --- Effect の内部に関数を移す

```tsx
function OrdersPage({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadOrders() {
      const res = await fetch(
        `/api/orders?userId=${encodeURIComponent(userId)}`,
      );
      if (!res.ok) throw new Error("注文の取得に失敗しました");
      setOrders(await res.json());
    }
    void loadOrders();
  }, [userId]);

  return <OrderList orders={orders} />;
}
```

コンポーネント側の関数参照を依存値にする必要がない。なお、このコードは**概念説明用**であり、完全なエラー処理やリクエスト中断処理は含まれていない。

**コツ：** Effect でしか使わない補助関数は、まず Effect
の内部に置く方法を検討する。

## 7. 解決策 B --- `useCallback` で関数参照を安定させる

```tsx
const loadOrders = useCallback(async () => {
  const res = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error("注文の取得に失敗しました");
  setOrders(await res.json());
}, [userId]);

useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

`useCallback`
は依存値が変わらない間、以前の関数参照を再利用する。`userId`
が変われば関数も変わり、Effect が再同期する。ただし **API
レスポンスのキャッシュや重複通信の自動防止は行わない**。

---

比較 Effect 内部の関数 `useCallback`

---

適した用途 Effect 専用 更新ボタンなどでも再利用

依存値 Effect: `[userId]` callback: `[userId]`、Effect:
`[loadOrders]`

長所 単純で理解しやすい 関数を再利用・受け渡しできる

注意点 外から直接呼べない 不必要に使うと複雑になる

---

**コツ：** すべての関数に `useCallback` を付ける必要はない。

## 8. Effect とイベントハンドラー：問題 4 の重要な修正

**状況 A：** 注文履歴ページの表示時、または `userId`
の変更時に注文を取得する。これは画面の状態に応じた**同期**なので Effect
が適切になり得る。

**状況 B：**
注文キャンセルボタンを押したときだけキャンセルする。これは**ユーザー操作**が原因なのでイベントハンドラーが適切。

**誤った基準：** 受信（GET）は Effect、送信（POST）はイベント。
**正しい基準：**
コンポーネントの表示・依存値の変化による同期か、特定のユーザー操作による実行か。

```tsx
async function handleCancel(orderId: number) {
  const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
  if (!res.ok) throw new Error("キャンセルに失敗しました");
}
<button onClick={() => void handleCancel(1001)}>注文をキャンセル</button>;
```

検索ボタンのクリックで GET を送ることもあるし、Effect
が外部システムへデータを送信することもある。HTTP
の向きは判断基準ではない。ルーターのデータ取得機能やクエリライブラリがより適切な場合もある。

**コツ：**「なぜ**今**この処理が必要なのか？」と問いかける。

## 9. 実務に近い例：中断・ローディング・エラー

```tsx
import { useEffect, useState } from "react";

type Order = { id: number; productName: string };

function OrdersPage({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders() {
      setLoading(true);
      setError(null);
      setOrders([]);
      try {
        const res = await fetch(
          `/api/orders?userId=${encodeURIComponent(userId)}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Order[] = await res.json();
        if (!controller.signal.aborted) setOrders(data);
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
  }, [userId]);

  if (loading) return <p>注文を読み込み中...</p>;
  if (error) return <p role="alert">エラー: {error}</p>;
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>{order.productName}</li>
      ))}
    </ul>
  );
}
```

これは学習用の実装である。本番では認証、**サーバー側の権限確認**、キャッシュ、再試行、ログ、レスポンス検証、アクセシビリティなどを検討する。**クライアントから送られた
`userId` だけでアクセス権を判断してはいけない。**

**コツ：** cleanup
は「一回しか実行しないため」ではなく、以前の同期や通信を終了・無効化するためにある。

## 10. 4 問の復習

---

| 問題   | 正解 | 核心となる理由                                                              | 補足ポイント                                                 |
| ------ | :--: | --------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 問題 1 |  ①   | render 中の API 呼び出し → state 更新 → 再レンダリングが繰り返される可能性  | React の render は**純粋**でなければならない。               |
| 問題 2 |  ②   | React が以前と現在の `userId` を `Object.is` で比較して Effect を再同期する | 依存配列は値を渡すのではなく、**比較する依存値を宣言する**。 |
| 問題 3 |  ②   | render ごとに新しい関数参照 → 依存値が変化 → Effect 再実行                  | 宣言場所だけでなく**生成タイミングと参照の同一性**が重要。   |
| 問題 4 |  ②   | ページ状態に応じた同期は Effect、クリック操作はイベントハンドラー           | **GET/POST ではなく実行のきっかけ**で判断する。              |

ではなく実行のきっかけ\*\*

---

### セルフチェック

1.  render 中に `loadOrders()` を呼ぶと何が危険か？
2.  `[]` と `[userId]` の違いは？
3.  なぜコンポーネント内の関数参照は変わるのか？
4.  注文キャンセルがイベントハンドラーに適する理由は？
5.  cleanup は何を片付けるのか？

**一文でまとめると：** render は UI を計算し、Effect
は外部システムと同期し、イベントハンドラーはユーザー操作に応答する。
