# Day 21 --- 非同期データフロー 復習問題・解答

> まず自分で問題を解き、その後 `<details>`
> を開いて解答と解説を確認する。

---

## 問題 1

次のコードで `result` は `Product[]` と `Promise<Product[]>`
のどちらか？

```ts
async function getProducts() {
  return [{ id: 1, title: "スニーカー", price: 59000 }];
}

const result = getProducts();
```

<details><summary>解答・解説を見る</summary>

### 解答

`Promise<Product[]>`

### 解説

`async` 関数は常に Promise を返す。関数内部で `Product[]` を return
していても、`await` なしで `getProducts()` を呼び出すと
`Promise<Product[]>` になる。

```ts
const result = await getProducts();
```

とすれば、`result` は実際の `Product[]` になる。

</details>

---

## 問題 2

次のコードで `response` と `products` の役割・型をそれぞれ説明せよ。

```ts
const response = await fetch("/api/products");
const products: Product[] = await response.json();
```

<details><summary>解答・解説を見る</summary>

### 解答

- `response` → `Response`
- `products` → `Product[]`

### 解説

```text
fetch()
→ Promise<Response>
→ await
→ Response
```

その後：

```text
response.json()
→ Promise
→ await
→ JavaScript データ
→ Product[]
```

`Response` と最終的な商品データを区別することが重要。

</details>

---

## 問題 3

なぜ次のコードには `await` が2回必要なのか？

```ts
const response = await fetch("/api/products");
const products = await response.json();
```

<details><summary>解答・解説を見る</summary>

### 解答

`fetch()` と `response.json()` がそれぞれ Promise を返すから。

### 解説

最初の `await` は `Promise<Response>` を待ち、2つ目は JSON
を読み取って変換する非同期処理を待つ。

</details>

---

## 問題 4

サーバーが 404 を返した場合でも、なぜ `response.ok`
を確認する必要があるのか？

```ts
const response = await fetch("/api/products");

if (!response.ok) {
  throw new Error("商品の取得に失敗しました");
}
```

<details><summary>解答・解説を見る</summary>

### 解答

404 や 500 の HTTP エラーステータスでも `Response`
オブジェクトを受け取れる場合があるため。

### 解説

`response.ok` を確認することで HTTP
ステータスが成功かどうかを判定し、失敗なら `throw`
でエラー処理へ移せる。

</details>

---

## 問題 5

次の async 関数で `throw` が実行され、内部に `catch`
がない場合はどうなるか？

```ts
async function getProducts() {
  throw new Error("失敗");
}
```

<details><summary>解答・解説を見る</summary>

### 解答

`getProducts()` が返す Promise が `rejected` になる。

### 解説

```text
async 関数
↓
throw Error
↓
内部 catch なし
↓
Promise rejected
```

呼び出し側で `await getProducts()` を `try/catch` して処理できる。

</details>

---

## 問題 6

次の A と B の違いを説明せよ。

### A

```ts
const products: Product[] = await response.json();
return products;
```

### B

```ts
const orders: Order[] = await response.json();
setOrders(orders);
```

<details><summary>解答・解説を見る</summary>

### 解答

A はデータを呼び出し元へ返し、B はデータを React State に保存する。

### 解説

A：

```text
Product[]
→ return
→ 呼び出し元
```

B：

```text
Order[]
→ setOrders
→ State 変更
→ 再レンダリング
→ UI 更新
```

`response.json()` までの非同期処理の原理は同じ。

</details>

---

## 問題 7

`setOrders(data)` が実行された後、React ではどのような流れになるか？

<details><summary>解答・解説を見る</summary>

### 解答

`orders` State が更新され、React が新しい State
を基準に再レンダリングする。

```text
setOrders(data)
↓
orders State 変更
↓
再レンダリング
↓
新しい orders
↓
orders.map()
↓
OrderCard
```

</details>

---

## 問題 8

今日学んだ基準で、次の機能を Server / Client の役割に分けよ。

1.  ページを最初に開いたときに必要な商品データの取得
2.  カート追加ボタンの `onClick`
3.  `+ / -` ボタンによる数量変更
4.  初期商品一覧のレンダリング

<details><summary>解答・解説を見る</summary>

### 解答

- 1 → まず Server を検討
- 2 → Client
- 3 → Client
- 4 → 初期データに基づくならまず Server を検討

### 解説

ブラウザでのユーザー操作やクライアント側 State の変更が必要なら Client
の役割になる。初期ページデータは Server 側で扱う方法をまず検討できる。

</details>

---

## 問題 9

次の `useEffect` は現在のプロジェクトでどのような役割を持つか？

```ts
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

<details><summary>解答・解説を見る</summary>

### 解答

レンダリング後に `loadOrders()` を呼び出し、注文データの取得を開始する。

### 解説

```text
レンダリング
↓
useEffect
↓
loadOrders()
↓
fetch("/api/orders")
↓
Order[]
↓
setOrders()
↓
再レンダリング
```

`[loadOrders]` は Effect が `loadOrders` に依存していることを示す。

</details>

---

## 問題 10

空欄を埋めよ。

```text
fetch("/api/orders")
↓
( ① )
↓ await
Response
↓
response.json()
↓
( ② )
↓ await
Order[]
↓
( ③ )
↓
State 変更
↓
( ④ )
↓
orders.map()
↓
OrderCard
```

<details><summary>解答・解説を見る</summary>

### 解答

1.  `Promise<Response>`
2.  概念的な JSON 変換の非同期結果 `Promise<Order[]>`
3.  `setOrders(data)`
4.  React の再レンダリング

完全な流れ：

```text
fetch("/api/orders")
↓
Promise<Response>
↓ await
Response
↓
response.json()
↓
Promise<Order[]>
↓ await
Order[]
↓
setOrders(data)
↓
State 変更
↓
再レンダリング
↓
orders.map()
↓
OrderCard
```

</details>

---

## 最終セルフチェック

コードを見ずに次を説明できれば、今日の目標は十分達成できている。

- なぜ `fetch()` は Promise を返すのか？
- `await fetch()` の後に何を得るのか？
- なぜ `response.json()` にもう一度 `await` が必要なのか？
- async 関数内の `return` と `throw` は Promise
  の状態とどうつながるのか？
- なぜ `response.ok` を確認するのか？
- `Product[]` や `Order[]` はどのように UI まで届くのか？
- `setOrders(data)` の後になぜ画面が変わるのか？
- Server と Client の役割をどの基準で分けるのか？
- 現在のプロジェクトの `useEffect` はなぜ `loadOrders()` を呼ぶのか？
