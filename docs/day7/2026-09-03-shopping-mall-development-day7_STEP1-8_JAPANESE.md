# Day 7 理論総整理 — STEP 1〜8

## STEP 1 — Dynamic Route `[id]`

Next.js App Routerでは、`app/orders/[id]/page.tsx` のように角括弧付きフォルダを作ると、URLの可変部分を受け取るDynamic Routeを作れます。

```text
app/orders/[id]/page.tsx
↓
/orders/123
/orders/456
/orders/999
```

`[id]` の `id` は値そのものではなく、URLパラメータの「名前」です。

```text
/orders/123
        ↓
       id = "123"
```

同じ `page.tsx` が異なるURLに対応します。

> **Tip**
>
> `[id]` は「123専用ページ」ではなく、「この位置にどんな値が来ても受け取る可変URL枠」と考えます。

---

## STEP 2 — `Link` で注文IDをURLへ渡す

注文一覧ページから注文詳細ページへ移動するとき、Next.jsの `Link` を使います。

```tsx
<Link href={`/orders/${order.id}`}>詳細を見る</Link>
```

もし:

```ts
order.id = 123;
```

なら、生成されるURLは:

```text
/orders/123
```

です。

ここで `Link` の役割は「注文データを直接渡す」ことではありません。

```text
order.id
↓
URLへ埋め込む
↓
/orders/123
```

詳細ページはそのURLを見て、必要な注文を探します。

> **Tip**
>
> `Link` はIDをURLに「書く」、`useParams()` はそのIDをURLから「読む」とセットで覚えます。

---

## STEP 3 — `useParams()` でURLパラメータを取得する

Client Componentでは `useParams()` を使ってDynamic Routeの値を取得できます。

```tsx
const params = useParams();
```

URLが:

```text
/orders/123
```

なら概念的には:

```ts
params = {
  id: "123",
};
```

です。

したがって:

```tsx
params.id
```

で `"123"` を取得できます。

重要なのは、URLから取得した値は文字列として扱われることです。

```text
params.id
→ "123"
→ string
```

> **Tip**
>
> フォルダ名が `[id]` なら `params.id`、`[slug]` なら `params.slug` です。フォルダ名とキー名が対応します。

---

## STEP 4 — `localStorage` から `orders[]` を読み込む

詳細ページはURLから注文IDを取得できますが、注文の名前・住所・商品などの実データは別に必要です。

今回のプロジェクトでは注文履歴を `localStorage` の `"orders"` に保存しています。

```tsx
const [orders, setOrders] = useState<Order[]>([]);

useEffect(() => {
  const savedOrders = localStorage.getItem("orders");

  if (savedOrders) {
    const parsedOrders: Order[] = JSON.parse(savedOrders);
    setOrders(parsedOrders);
  }
}, []);
```

データの流れ:

```text
localStorage
↓
JSON文字列
↓
JSON.parse()
↓
Order[]
↓
setOrders()
↓
state更新
↓
再レンダリング
```

`localStorage` はブラウザのWeb APIなので、ブラウザ側の外部システムとの同期として `useEffect()` 内で読み込みます。

> **Tip**
>
> URLは「どの注文か」、`localStorage` は「注文データ全部」を担当します。この2つを後で `find()` がつなぎます。

---

## STEP 5 — `Number()` でURLの文字列IDを数値へ変換する

`params.id` は文字列です。

```text
"123"
```

一方、`Order.id` が数値型なら:

```text
123
```

です。

厳密比較では:

```ts
"123" === 123 // false
```

なので、先に変換します。

```tsx
const orderId = Number(params.id);
```

結果:

```text
"123"
↓
Number()
↓
123
```

不正な値:

```text
Number("abc")
↓
NaN
```

`NaN` は「数値変換に失敗した特殊な数値結果」です。

```ts
Number.isNaN(orderId);
```

で判定できます。

> **Tip**
>
> IDを必ず数値にするのではありません。今回の `Order.id` がnumberだから変換します。文字列ID設計なら文字列のまま比較します。

---

## STEP 6 — `find()` で注文を1件探す

変換済みの `orderId` と `orders[]` を接続します。

```tsx
const order = orders.find((order) => order.id === orderId);
```

意味:

```text
orders[] 全体
↓
1件ずつ確認
↓
order.id === orderId ?
↓
最初にtrueになったOrderを返す
```

例:

```text
orderId = 1002

1001 === 1002 → false
1002 === 1002 → true
↓
その注文を返して終了
```

見つからない場合:

```ts
undefined
```

なので `order` の概念的な型は:

```ts
Order | undefined
```

です。

> **Tip**
>
> `find()` を見たら必ず「見つからなかった場合は `undefined`」までセットで考えます。

---

## STEP 7 — 見つけた `order` を詳細UIへ表示する

`find()` で取得した注文1件を使って詳細情報を表示します。

```tsx
<p>注文番号: {order.id}</p>
<p>名前: {order.name}</p>
<p>電話番号: {order.phone}</p>
<p>住所: {order.address}</p>
<p>合計金額: {order.totalPrice.toLocaleString()}円</p>
```

注文商品は複数あるため:

```tsx
order.items.map(...)
```

を使います。

また `item` には `productId` と `quantity` があり、商品名や価格を得るために商品配列から再び `find()` します。

```tsx
const product = products.find(
  (product) => product.id === item.productId,
);
```

構造:

```text
orders[]
↓ find()
Order 1件
↓
order.items[]
↓ map()
各item
↓
products.find()
Product 1件
↓
商品名・価格・数量・小計
```

> **Tip**
>
> `find()` は「1件選択」、`map()` は「複数件を順番にUIへ変換」と役割を区別します。

---

## STEP 8 — Loading / Not Found / Success を分ける

最初のレンダリングでは:

```text
orders = []
loading = true
order = undefined
```

になるため、`order === undefined` だけでNot Foundと判断してはいけません。

そこで:

```tsx
if (loading) {
  return <p>注文情報を確認しています。</p>;
}

if (!order) {
  return <p>該当する注文が見つかりません。</p>;
}

return <OrderDetailUI />;
```

というearly returnを使います。

3状態:

```text
Loading
→ まだデータ確認中

Not Found
→ 確認完了 + 注文なし

Success
→ 確認完了 + 注文あり
```

この順番が重要です。

```text
loading?
↓ Yes
Loading

↓ No
order存在?
↓ No
Not Found

↓ Yes
Success
```

> **Tip**
>
> Reactでは「現在のstateなら、どのUIを表示すべきか？」という考え方が重要です。

---

# Day 7 全体Mental Model

```text
注文一覧
↓
<Link href={`/orders/${order.id}`}>
↓
/orders/1002
↓
Dynamic Route [id]
↓
useParams()
↓
params.id = "1002"
↓
Number()
↓
orderId = 1002

同時に:

localStorage
↓
JSON.parse()
↓
orders[]
↓
setOrders()
↓
再レンダリング

そして:

orderId + orders[]
↓
find()
↓
Order | undefined
↓
Loading / Not Found / Success
↓
注文詳細UI
```

## 最終まとめ

Day 7の核心は、**URLに含まれる注文IDと、ブラウザに保存された注文配列を接続し、特定の注文1件を安全に表示する詳細ページを作ること**です。

> **Tip**
>
> STEP 1〜8をコードなしで説明できれば、Dynamic Route詳細ページの基本構造を理解できています。
