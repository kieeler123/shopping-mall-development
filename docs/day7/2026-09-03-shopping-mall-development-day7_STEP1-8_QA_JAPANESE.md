# Day 7 STEP 1〜8 — 質問・回答式 総復習

## STEP 1 — Dynamic Route `[id]`

### Q1. `[id]` フォルダは何のために使いますか？
**A.** URLの一部分を可変値として受け取るために使います。

```text
app/orders/[id]/page.tsx
↓
/orders/123
/orders/456
```

同じ `page.tsx` が複数の注文IDを処理できます。

> **Tip**
>
> `[id]` は固定値ではなく「URLの可変スロット」です。

### Q2. `/orders/123` の `123` は `[id]` とどう関係しますか？
**A.** `[id]` という名前のDynamic Segmentに `"123"` が入ります。

```text
/orders/123
        ↓
params.id = "123"
```

> **Tip**
>
> `[id]` の `id` は値ではなくパラメータ名です。

---

## STEP 2 — `Link`

### Q3. なぜ注文一覧で `Link` を使いますか？
**A.** 選択した注文のIDを含む詳細URLへ移動するためです。

```tsx
<Link href={`/orders/${order.id}`}>詳細を見る</Link>
```

`order.id` が `123` なら `/orders/123` へ移動します。

> **Tip**
>
> `Link` は注文全体を渡すのではなく、今回の構造ではIDをURLに埋め込みます。

### Q4. なぜ「詳細を見る」リンクは `order.items.map()` の外に置く方が自然ですか？
**A.** 詳細ページは商品1個ではなく注文1件全体に対応するからです。商品ごとに置くと同じ注文詳細リンクが繰り返されます。

> **Tip**
>
> 注文レベルの操作は注文 `<section>`、商品レベルの表示は `items.map()` と責務を分けます。

---

## STEP 3 — `useParams()`

### Q5. `useParams()` は何をしますか？
**A.** 現在のDynamic RouteのURLパラメータを読み取ります。

```tsx
const params = useParams();
```

`/orders/123` なら `params.id` は `"123"` と考えられます。

> **Tip**
>
> `Link` がURLへ書き、`useParams()` がURLから読みます。

### Q6. なぜ `params.id` は数値 `123` ではなく文字列 `"123"` ですか？
**A.** URLのパス部分はJavaScriptのnumber型情報を持っていないため、ルートパラメータは文字列として扱われます。

> **Tip**
>
> URLの見た目が数字でも、JavaScriptの型までnumberになるわけではありません。

---

## STEP 4 — `localStorage`, `useState`, `useEffect`

### Q7. URLからIDを取得したのに、なぜ `localStorage` も必要ですか？
**A.** URLには「どの注文か」を示すIDしかなく、名前・住所・商品などの注文データ本体は保存先から取得する必要があるからです。

```text
params.id → 検索条件
orders[] → 検索対象
```

> **Tip**
>
> URLと注文データは役割が異なります。

### Q8. なぜ `JSON.parse()` が必要ですか？
**A.** `localStorage` から取得した値は文字列なので、保存されたJSON文字列をJavaScriptの配列・オブジェクトへ戻すためです。

```text
localStorage
↓
JSON文字列
↓
JSON.parse()
↓
Order[]
```

> **Tip**
>
> 保存時は `JSON.stringify()`、読み込み時は `JSON.parse()` と対で覚えます。

### Q9. `setOrders(parsedOrders)` は `orders = parsedOrders` と同じですか？
**A.** いいえ。state setterは現在の変数への直接代入ではなく、Reactへstate更新を要求します。その更新によって次のレンダリングが行われます。

> **Tip**
>
> `setOrders()` = 「次のレンダリングで新しいstateを使うための更新要求」と理解します。

### Q10. なぜ再レンダリングしても `useState([])` が毎回 `[]` に戻らないのですか？
**A.** `[]` はstateを最初に作るときの初期値です。Reactはstateをレンダリング間で保持します。

> **Tip**
>
> re-renderとremountを区別します。re-renderでは通常stateが維持されます。

---

## STEP 5 — `Number()`, `NaN`, `===`

### Q11. なぜ `Number(params.id)` が必要ですか？
**A.** `params.id` がstringで、`Order.id` がnumberだからです。

```ts
"123" === 123 // false
```

そこで:

```tsx
const orderId = Number(params.id);
```

として型を合わせます。

> **Tip**
>
> 比較前にデータモデルのID型を確認します。

### Q12. `/orders/abc` の場合はどうなりますか？
**A.**

```text
Number("abc")
↓
NaN
```

となります。`Number.isNaN(orderId)` で確認できます。

> **Tip**
>
> `typeof NaN` は `"number"` なので、無効な数値判定には `Number.isNaN()` が適しています。

---

## STEP 6 — `find()`

### Q13. `find()` は何を返しますか？
**A.** 条件を満たす最初の要素1件を返します。見つからなければ `undefined` です。

```tsx
const order = orders.find(
  (order) => order.id === orderId
);
```

> **Tip**
>
> `find()` を使ったら `undefined` の可能性まで考えます。

### Q14. `(order) => order.id === orderId` の `order` は何ですか？
**A.** `orders[]` の中から現在チェックしている注文1件です。

```text
orders → 注文全体
order  → 現在確認中の注文1件
```

> **Tip**
>
> 複数形と単数形で役割を区別すると読みやすくなります。

### Q15. 最初のレンダリングで `order` が `undefined` になることがあるのはなぜですか？
**A.** 最初は `orders = []` で、まだeffectが `localStorage` を読み込んでいないからです。

> **Tip**
>
> 最初の `undefined` をすぐNot Foundと判断してはいけません。

---

## STEP 7 — Detail UI

### Q16. 注文詳細ページではなぜ `orders.map()` ではなく `order` を使いますか？
**A.** 詳細ページではSTEP 6で特定の注文1件をすでに選択しているからです。

```text
一覧 → orders.map()
詳細 → orders.find() → order
```

> **Tip**
>
> 一覧は複数、詳細は1件という違いを意識します。

### Q17. なぜ `order.items` では `map()` を使いますか？
**A.** 1件の注文の中には複数の商品が入る可能性があるためです。

> **Tip**
>
> 外側は注文1件、内側は商品複数件というデータ構造を描いてみます。

### Q18. なぜ `products.find()` をもう一度使いますか？
**A.** `item.productId` に対応する商品名や価格などの商品情報を `products[]` から1件取得するためです。

> **Tip**
>
> `orders.find()` と `products.find()` は対象配列が違うだけで基本原理は同じです。

---

## STEP 8 — Loading / Not Found / Success

### Q19. なぜ `loading` stateが必要ですか？
**A.** 次の2状態が `orders = []` だけでは区別できないからです。

```text
まだ確認前 → []
確認完了・本当に注文なし → []
```

> **Tip**
>
> データと「データ確認状態」を別々に表現します。

### Q20. なぜLoadingをNot Foundより先に判定しますか？
**A.** 最初のレンダリングでは `order` が `undefined` でも、まだデータ確認中だからです。

```tsx
if (loading) return ...;
if (!order) return ...;
return ...;
```

> **Tip**
>
> 条件の順番そのものがページ状態の意味を作ります。

### Q21. `if (!order) return ...` の後で `order.name` を安全に使えるのはなぜですか？
**A.** そこまで実行が進んだ場合、`order` が存在しないケースはすでにreturnで終了しているためです。TypeScriptもこの実行フローから型を絞り込みます。

> **Tip**
>
> これをtype narrowingの基本例として覚えます。

### Q22. Day 7全体を一文で説明すると？
**A.** 注文IDをURLへ入れ、Dynamic Routeと `useParams()` で読み、型を合わせ、`localStorage` の `orders[]` から `find()` で注文1件を選び、Loading / Not Found / Successに応じて詳細UIを表示する流れです。

```text
Link
↓
[id]
↓
useParams()
↓
Number()
↓
localStorage → orders[]
↓
find()
↓
Order | undefined
↓
Loading / Not Found / Success
↓
Detail UI
```

> **Tip**
>
> この流れをコードなしで説明できればDay 7の中心概念がつながっています。
