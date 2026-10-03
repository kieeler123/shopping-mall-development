# Day 22 --- React State の更新とイミュータビリティ

> **今日のテーマ：** 取得したデータを React
> でどのように管理し、変更するのか？

## 今日の最終目標

学習後、次のコードを自分の言葉で説明できることを目標にする。

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order,
  ),
);
```

最終的に次のように説明できればよい。

> `setOrders` に updater 関数を渡すと、React が最新の `orders` State を
> `prevOrders` として渡す。`map()`
> で新しい配列を作りながら、`updatedOrder.id` と一致する注文だけを
> `updatedOrder` に置き換え、それ以外は既存の `order`
> を維持する。そして新しい配列を State
> に設定し、再レンダリングにつなげる。

------------------------------------------------------------------------

## 1. Day 21 からの続き

Day 21 では非同期データ取得の流れを学んだ。

``` text
API
↓
fetch()
↓
Promise<Response>
↓
await
↓
Response
↓
response.json()
↓
await
↓
Order[]
↓
setOrders(data)
↓
State 変更
↓
再レンダリング
↓
UI
```

Day 22 では `setOrders` 周辺と、その後の処理を詳しく見る。

``` text
Day 21 の問い
API からデータをどう取得するか？

↓ 接続

Day 22 の問い
取得したデータを React でどう管理・変更するか？
```

------------------------------------------------------------------------

## 2. `useState` をもう一度理解する

``` ts
const [orders, setOrders] = useState<Order[]>([]);
```

### `orders`

現在の State を読むための値。

初期値：

``` ts
[]
```

API が成功したら：

``` ts
setOrders(data);
```

``` text
最初
orders = []

↓ API 成功

Order[]

↓ setOrders(data)

State 更新

↓ 次のレンダリング

orders = 新しい Order[]
```

### `setOrders`

`orders` を直接書き換えるのではなく、React に State 更新を依頼する。

``` ts
setOrders(新しい値);
```

``` text
setOrders(...)
↓
State 更新
↓
React 再レンダリング
↓
新しい orders で JSX を計算
↓
UI 更新
```

> **学習ポイント：** `setOrders`
> を単なる「値変更関数」として覚えず、**State 更新 → 再レンダリング → UI
> 更新**までつなげて理解する。

------------------------------------------------------------------------

## 3. なぜ State を直接変更しないのか？

JavaScript だけなら：

``` ts
orders[0].status = "SHIPPED";
```

のような変更は可能。

しかし React State では、既存 State
を直接変更するのではなく、新しい値・配列・オブジェクトを作って setter
に渡す。

``` text
既存 State の直接変更 X

既存 State
↓
新しい配列/オブジェクトを作成
↓
setOrders(新しい値)
```

ここで **イミュータビリティ（Immutability）** が登場する。

------------------------------------------------------------------------

## 4. イミュータビリティ

今日の段階では：

> 既存 State
> を直接書き換えず、変更を反映した新しい値・配列・オブジェクトを作って
> State を更新すること。

例：

``` ts
const numbers = [1, 2, 3];

const newNumbers = [...numbers, 4];
```

``` text
numbers
→ [1, 2, 3]

newNumbers
→ [1, 2, 3, 4]
```

> **学習範囲：**
> 関数型プログラミングの深い理論までは扱わない。`既存 State を直接変更しない → 新しい State を作る → setter に渡す`
> を理解する。

------------------------------------------------------------------------

## 5. 配列 State の代表的な3つの更新

``` text
追加
→ spread (...)

更新
→ map()

削除
→ filter()
```

### 追加

``` ts
setOrders((prevOrders) => [
  ...prevOrders,
  newOrder,
]);
```

### 更新

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id
      ? updatedOrder
      : order,
  ),
);
```

### 削除

``` ts
setOrders((prevOrders) =>
  prevOrders.filter((order) =>
    order.id !== deleteId
  ),
);
```

------------------------------------------------------------------------

## 6. `prevOrders` はどこから来るのか？

State setter には値を直接渡す方法と updater 関数を渡す方法がある。

``` ts
setOrders(newOrders);
```

または：

``` ts
setOrders((prevOrders) => {
  return newOrders;
});
```

updater 関数形式では、React が現在の State を引数として渡す。

``` text
現在の orders
↓
React
↓
updater 関数に渡す
↓
prevOrders
```

`prevOrders` は予約語ではなく、ただの引数名。

``` ts
setOrders((currentOrders) => {
  // ...
});
```

でもよい。

------------------------------------------------------------------------

## 7. なぜ以前の State を基準に更新するのか？

現在：

``` text
[
  注文1,
  注文2,
  注文3
]
```

注文2だけ変更するなら：

``` text
注文1 → 維持
注文2 → 変更
注文3 → 維持
```

する必要がある。

そのため現在の配列を受け取り、それを基準に新しい配列を作る。

------------------------------------------------------------------------

## 8. 実際の `map()` コードを読む

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id
      ? updatedOrder
      : order,
  ),
);
```

``` ts
prevOrders.map(...)
```

は現在の注文をすべて確認しながら新しい配列を作る。

各要素は `order` に入り：

``` ts
order.id === updatedOrder.id
```

で更新対象か確認する。

------------------------------------------------------------------------

## 9. 三項演算子で更新対象を選ぶ

``` ts
order.id === updatedOrder.id
  ? updatedOrder
  : order
```

``` text
ID が同じ？

YES
↓
updatedOrder

NO
↓
既存 order
```

例：

``` text
既存
[
  { id: 1, status: "PAID" },
  { id: 2, status: "PREPARING" },
  { id: 3, status: "SHIPPED" }
]

updatedOrder
{ id: 2, status: "SHIPPED" }
```

結果：

``` text
[
  既存の注文1,
  更新された注文2,
  既存の注文3
]
```

------------------------------------------------------------------------

## 10. なぜ更新には `map()` なのか？

`map()` は各要素を確認しながら **新しい配列** を作る。

``` text
既存 Order[]
↓
各 order を確認
↓
更新対象？
├─ YES → updatedOrder
└─ NO  → 既存 order
↓
新しい Order[]
```

> **学習ポイント：** `map()` を JSX
> の一覧表示専用と考えない。配列をもとに新しい配列を作るメソッドとして理解する。

------------------------------------------------------------------------

## 11. 追加には spread

``` ts
setOrders((prevOrders) => [
  ...prevOrders,
  newOrder,
]);
```

``` text
既存
[注文1, 注文2, 注文3]

↓ ...prevOrders

注文1
注文2
注文3

↓ newOrder

新しい配列
[注文1, 注文2, 注文3, 注文4]
```

------------------------------------------------------------------------

## 12. 削除には `filter()`

``` ts
setOrders((prevOrders) =>
  prevOrders.filter(
    (order) => order.id !== deleteId
  )
);
```

削除 ID が 2 なら：

``` text
id 1 !== 2 → true  → 残す
id 2 !== 2 → false → 除外
id 3 !== 2 → true  → 残す
```

------------------------------------------------------------------------

## 13. CRUD と配列 State

``` text
Create
追加
→ spread

Read
取得
→ fetch + setState

Update
更新
→ map

Delete
削除
→ filter
```

実際のサーバー CRUD では API
通信も必要だが、サーバー結果を受け取った後の Client State
更新を理解する基本モデルになる。

------------------------------------------------------------------------

## 14. Day 21 → Day 22

``` text
Day 21

API
↓
fetch
↓
Promise
↓
await
↓
Response
↓
json
↓
Order[]

        ↓

Day 22

Order[]
↓
State
↓
setOrders
↓
イミュータビリティ
↓
prevState
↓
map / filter / spread
↓
新しい State
↓
再レンダリング
↓
UI
```

------------------------------------------------------------------------

## Day 22 完了チェック

次を自分の言葉で説明できれば完了。

1.  `orders` と `setOrders` の役割は？
2.  なぜ State を直接変更しない？
3.  イミュータビリティとは？
4.  `prevOrders` は誰が渡す？
5.  更新になぜ `map()` を使う？
6.  なぜ `order.id` と `updatedOrder.id` を比較する？
7.  更新対象でない注文はなぜ既存 `order` を返す？
8.  `map()` の結果は既存配列か、新しい配列か？
9.  削除になぜ `filter()` が適している？
10. 追加時の spread の役割は？

## 今日扱わないもの

``` text
useEffect の深掘り
useCallback の深掘り
Effect lifecycle の詳細
React 内部レンダリング実装
関数型プログラミングの深い理論
```

今日の完了基準：

> **`setOrders(prevOrders => prevOrders.map(...))`
> を自分で説明できる。**
