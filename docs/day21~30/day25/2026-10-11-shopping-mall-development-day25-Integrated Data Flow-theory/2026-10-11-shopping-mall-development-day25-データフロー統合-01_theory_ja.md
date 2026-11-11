# Day 25 理論総まとめ（日本語）

## 1. 学習目標
ReactとTypeScriptで注文一覧の取得と注文キャンセルを実装する。流れは **ユーザー変更 → useEffect → GET → State更新 → 画面表示 → キャンセルクリック → POST → 再取得**。

## 2. 重要な概念

### TypeScriptとuseState
```tsx
type Order = { id: number; productName: string; status: "PAID" | "CANCELLED" };
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```
`Order[]`は注文オブジェクトの配列。`loading`は通信中かどうか、`error`はエラーメッセージまたは`null`を表す。
**ヒント:** 空配列だけでは「取得中」と「注文なし」を区別できない。

### Promise、async/await、fetch
Promiseは非同期処理の結果を表し、pending・fulfilled・rejectedの状態を持つ。`async`関数はPromiseを返す。`await`はそのasync関数の続きの実行を一時停止するが、JavaScript全体を停止しない。
```ts
const response = await fetch("/api/orders");
if (!response.ok) throw new Error("取得失敗");
const data: Order[] = await response.json();
setOrders(data);
```
最初の`await`はHTTP Responseの取得、次の`await`は本文の読み込みとJSON解析。HTTP 404/500だけでは`fetch`は自動的にrejectされない。
**ヒント:** TypeScriptの型注釈だけではAPIレスポンスの実行時検証はできない。

### イベントループ
```js
console.log("A");
Promise.resolve().then(() => console.log("B"));
setTimeout(() => console.log("C"), 0);
console.log("D");
// A, D, B, C
```
同期処理が先に実行され、その後Promiseのマイクロタスクがこのタイマー処理より先に実行される。

### useEffectと依存配列
```tsx
useEffect(() => { /* 注文取得 */ }, [userId, refreshKey]);
```
`userId`の変更で対象ユーザーを再取得し、`refreshKey`の変更で一覧を更新する。`[]`ならマウント時に設定される（開発時のStrict Modeでは追加の検証が行われる場合がある）。依存配列を省略すると各コミット後に実行される。
**ヒント:** Effect内で参照するリアクティブな値を依存配列に含める。

### cleanupとAbortController
```tsx
useEffect(() => {
  const controller = new AbortController();
  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`, {
        signal: controller.signal,
      });
      if (!r.ok) throw new Error("取得失敗");
      const data: Order[] = await r.json();
      if (!controller.signal.aborted) setOrders(data);
    } catch (e) {
      if (!controller.signal.aborted) setError("注文を取得できませんでした");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }
  void load();
  return () => controller.abort();
}, [userId]);
```
cleanupは依存値が変わって次のEffectが実行される前と、アンマウント時に実行される。開発時のStrict Modeではsetup → cleanup → setupが行われる場合がある。クライアント側の中断はサーバー処理の中断まで保証しない。
**ヒント:** 古いレスポンスが現在のユーザーのデータを上書きしないようにする。

### クロージャとStale Closure
関数は定義された場所のレキシカル環境を参照できる。Reactの各レンダリングにはStateのスナップショットがある。
```tsx
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000);
  return () => clearInterval(id);
}, []); // 初回のcountを参照し続ける可能性
```
解決策は依存値の追加、関数型更新（`setCount(prev => prev + 1)`）、適切な`useRef`の利用。
**ヒント:** コールバックがどのレンダリングで作成されたか確認する。

### イベントハンドラと注文キャンセル
```tsx
<button onClick={() => void handleCancel(order.id)}>キャンセル</button>
```
`onClick={handleCancel(order.id)}`はレンダリング中に関数を実行してしまう。
```tsx
async function handleCancel(orderId: number) {
  try {
    const r = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
    if (!r.ok) throw new Error("キャンセル失敗");
    setRefreshKey(prev => prev + 1);
  } catch {
    setCancelError("注文をキャンセルできませんでした");
  }
}
```
**ヒント:** 画面のStateを変更するだけではサーバー上の注文はキャンセルされない。

## 3. UIの状態
- 読み込み中：進捗を表示。
- エラー：アクセスしやすいエラーメッセージを表示。
- 空：取得成功、注文0件。
- 正常：注文一覧と操作ボタンを表示。
- キャンセル中：重複操作を防止。

## 4. 実務チェックリスト
`response.ok`の確認、JSON解析失敗への対応、通信のcleanup、ユーザー間の古いデータ混入防止、キャンセルの重複防止、キャンセル成功と再取得成功の区別、サーバー側の認証・認可と所有権検証、APIレスポンスの実行時検証。

## 5. 覚え方
**取得はEffect、キャンセルはイベントハンドラ、結果はState、後片付けはcleanup、再取得はrefreshKey。**
