# Day 22 --- React Stateの更新とイミュータビリティ

> **今日のテーマ：**
> 取得したデータをReactでどのように管理・変更するのか？

## 今日の最終目標

次のコードを自分の言葉で説明できるようになる。

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order,
  ),
);
```

### 核心となる説明

`setOrders` にupdater関数を渡すと、Reactは以前の `orders` Stateである
`Order[]` を `prevOrders` として渡す。`map()` は配列内の各 `Order`
オブジェクトを `order` として1つずつ処理する。`order.id` と
`updatedOrder.id` が一致する場合は更新対象なので `updatedOrder`
を返し、一致しない場合は既存の `order` を返す。`map()`
はそれらの戻り値を集めて新しい配列を作る。updater関数がその配列を返すと、Reactはそれを次のStateとして使用する。Stateが更新されるとコンポーネントが再レンダーされ、新しいStateを基準にJSXが再計算され、UIへ反映される。

**ヒント：** コードを「以前のState → 各要素を確認 → 新しい配列 →
次のState → 再レンダー → UI」というデータの流れとして読む。

------------------------------------------------------------------------

## 1. Day 21 → Day 22 のつながり

### Day 21

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
```

### Day 22

``` text
Order[]
↓
State
↓
setOrders
↓
イミュータビリティ
↓
以前のState
↓
spread / map / filter
↓
新しいState
↓
再レンダー
↓
UI
```

Day 21では**データをどのように取得するか**を学んだ。Day
22では、**取得したデータをReact
Stateでどのように管理・変更するか**に集中する。

**ヒント：** Day 21は「データを取得する」、Day
22は「取得したデータを管理する」と分けて考える。

------------------------------------------------------------------------

## 2. `useState` と `orders`、`setOrders`

``` ts
const [orders, setOrders] = useState<Order[]>([]);
```

### `orders`

`orders` は現在のレンダーで使用するState値である。

型：

``` ts
Order[]
```

初期値：

``` ts
[]
```

### `setOrders`

`setOrders` はReactに `orders` Stateの更新を要求するsetter関数である。

``` ts
setOrders(newOrders);
```

代表的な流れ：

``` text
setOrdersを実行
↓
Stateを更新
↓
コンポーネントを再レンダー
↓
新しいStateを基準にJSXを再計算
↓
UIへ反映
```

**ヒント：** `setOrders`
を通常の変数代入として考えず、「State更新をReactへ要求する関数」と考える。

------------------------------------------------------------------------

## 3. イミュータビリティ（Immutability）

React
Stateを更新するときは、既存のStateを直接変更せず、変更内容を反映した新しい配列やオブジェクトを作り、それを次のStateとして使用する。

次のような直接変更は避ける。

``` ts
orders[0].status = "SHIPPED";
```

基本的な考え方：

``` text
既存State
↓
直接変更しない
↓
変更内容を含む新しい値を作る
↓
setterへ渡す / updaterから返す
```

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

**ヒント：**
イミュータビリティは「古い値を直接変更せず、次の値を新しく作る」と覚える。

------------------------------------------------------------------------

## 4. updater関数と `prevOrders`

State setterには新しい値を直接渡すこともできる。

``` ts
setOrders(newOrders);
```

また、updater関数を渡すこともできる。

``` ts
setOrders((prevOrders) => {
  return newOrders;
});
```

updater関数を渡すと、Reactがその関数を呼び出し、以前のState値を引数として渡す。

``` text
現在 / 以前のorders State
↓
React
↓
updater関数を呼び出す
↓
以前のStateをprevOrdersへ渡す
```

`prevOrders` は予約語ではない。単なる引数名なので、別の名前でもよい。

``` ts
setOrders((currentOrders) => {
  return [...currentOrders, newOrder];
});
```

### 型の区別

``` ts
prevOrders   // Order[]
order        // Order
newOrder     // Order
updatedOrder // Order
```

`prevOrders` は配列全体であり、`order` はその配列内の1つの `Order`
オブジェクトである。

**ヒント：** 複数形の `orders` は配列、単数形の `order`
は1つの要素と考えると読みやすい。

------------------------------------------------------------------------

## 5. 配列Stateの代表的な3つの更新

``` text
Create
→ spread

Update
→ map()

Delete
→ filter()
```

共通するポイントは、既存のState配列を直接変更せず、新しい配列を作ることである。

### Create --- spread

``` ts
setOrders((prevOrders) => [
  ...prevOrders,
  newOrder,
]);
```

`...prevOrders` は既存配列の要素を新しい配列の中へ展開する。

``` text
prevOrders
[Order1, Order2, Order3]

↓ ...prevOrders

Order1, Order2, Order3

↓ その後ろにnewOrderを配置

新しい配列
[Order1, Order2, Order3, NewOrder]
```

重要なポイント：

-   spread自体が「追加メソッド」なのではない。
-   spreadは既存要素を展開する。
-   `newOrder` を後ろに記述したため、新しい要素が追加される。
-   既存の `prevOrders` は直接変更されない。

**ヒント：** `[...prevOrders]`
は既存要素を含む新しい配列、`[...prevOrders, newOrder]`
はさらに新しい要素を末尾へ含めた新しい配列である。

------------------------------------------------------------------------

## 6. Update --- `map()`

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id
      ? updatedOrder
      : order,
  ),
);
```

### `map()` の核心

`map()`
は配列の各要素を1つずつ処理し、コールバックの戻り値を集めて**新しい配列**を作る。

``` text
既存配列
↓
各要素を1つずつ受け取る
↓
各要素で何を返すか決める
↓
戻り値を集める
↓
新しい配列
```

例：

``` ts
const prevOrders = [
  { id: 1, status: "PAID" },
  { id: 2, status: "PREPARING" },
  { id: 3, status: "SHIPPED" },
];
```

コールバックは3回実行される。

``` text
1回目 → order = { id: 1, status: "PAID" }
2回目 → order = { id: 2, status: "PREPARING" }
3回目 → order = { id: 3, status: "SHIPPED" }
```

`map()` が `order`
オブジェクトを新しく作るわけではない。既存配列の各要素がコールバックの
`order` 引数として渡される。

**ヒント：** `map = 更新`
と丸暗記せず、「各要素の戻り値から新しい配列を作る」と理解する。

------------------------------------------------------------------------

## 7. ID比較と三項演算子

``` ts
order.id === updatedOrder.id
  ? updatedOrder
  : order
```

次のように読む。

``` text
現在確認している注文は更新対象か？

YES
→ updatedOrderを返す
→ 更新後の注文へ置き換える

NO
→ 既存のorderを返す
→ その注文をそのまま維持する
```

例：

``` ts
const updatedOrder = {
  id: 2,
  status: "SHIPPED",
};
```

``` text
id 1 === id 2 → false → 既存のorder
id 2 === id 2 → true  → updatedOrder
id 3 === id 2 → false → 既存のorder
```

結果：

``` ts
[
  { id: 1, status: "PAID" },
  { id: 2, status: "SHIPPED" },
  { id: 3, status: "SHIPPED" },
]
```

### なぜIDを比較するのか？

`status` は複数の注文で同じ値になる可能性がある。一方、`id`
は特定の注文を識別するために使われるため、更新対象を探すのに適している。

### `===`

`===` は値と型の両方が一致しているかを比較する。

``` ts
2 === 2   // true
2 === "2" // false
```

**ヒント：** `order.id === updatedOrder.id`
を「今見ている注文は、更新したいその注文なのか？」と読む。

------------------------------------------------------------------------

## 8. 変更しない注文で `order` を返す理由

``` ts
order.id === updatedOrder.id
  ? updatedOrder
  : order
```

更新対象ではない注文は変更する必要がないため、既存の `order`
をそのまま返す。

``` text
Order1 → 維持
Order2 → 置き換え
Order3 → 維持
```

`map()`
はコールバックの戻り値を新しい配列の要素として使用する。そのため、既存要素を維持したい場合は、その
`order` を返す。

### `null` を返すとどうなるか？

``` ts
prevOrders.map((order) =>
  order.id === updatedOrder.id
    ? updatedOrder
    : null
);
```

`null` は「何も返さない」という意味ではない。`null`
という値を返している。

結果：

``` ts
[
  null,
  updatedOrder,
  null,
]
```

**ヒント：** `map()`
では「何をreturnしたか」を確認する。その値が新しい配列の要素になる。

------------------------------------------------------------------------

## 9. 新しい配列と既存オブジェクト

``` ts
const newOrders = prevOrders.map((order) =>
  order.id === updatedOrder.id
    ? updatedOrder
    : order
);
```

`map()` が返す `newOrders` は `prevOrders` とは別の新しい配列である。

``` ts
newOrders === prevOrders
// false
```

ただし、更新対象ではない要素では既存の `order`
をそのまま返すことができる。

``` text
prevOrders → [Order1, OldOrder2, Order3]
                        ↓
                      map()
                        ↓
newOrders  → [Order1, NewOrder2, Order3]
```

つまり：

-   配列自体は新しい配列。
-   変更しないオブジェクトは既存オブジェクトをそのまま利用できる。
-   更新対象だけ `updatedOrder` へ置き換える。

**ヒント：**
「新しい配列」と「配列内のすべてのオブジェクトが新しいオブジェクト」は同じ意味ではない。

------------------------------------------------------------------------

## 10. Delete --- `filter()`

``` ts
setOrders((prevOrders) =>
  prevOrders.filter(
    (order) => order.id !== deleteId
  ),
);
```

`filter()` は条件が `true` になる要素だけを残し、新しい配列を作る。

`deleteId = 2` の場合：

``` text
id 1 !== 2 → true  → 残す
id 2 !== 2 → false → 除外
id 3 !== 2 → true  → 残す
```

結果：

``` ts
[
  { id: 1, status: "PAID" },
  { id: 3, status: "SHIPPED" },
]
```

`filter()`
が既存配列から要素を直接取り除くわけではない。削除対象を除外した**新しい配列**を作る。

**ヒント：** `filter = 削除`
とだけ覚えず、「条件がtrueの要素だけを残した新しい配列を作る」と理解する。

------------------------------------------------------------------------

## 11. CRUDと配列State

  CRUD     Stateの処理        核心
  -------- ------------------ ---------------------------------------
  Create   spread             既存要素 + 新しい要素を含む新しい配列
  Read     fetch + setState   サーバーのデータをStateへ保存
  Update   `map()`            対象要素だけを置き換えた新しい配列
  Delete   `filter()`         対象要素を除外した新しい配列

共通原則：

``` text
既存Stateを直接変更しない
↓
既存Stateを基に新しい配列を作る
↓
setterへ渡す / updaterから返す
↓
Stateを更新
↓
再レンダー
↓
新しいStateを基準にJSXを再計算
↓
UIへ反映
```

**ヒント：**
Create・Update・Deleteでは使う構文が違っても、共通する考え方は「古いStateを直接変更せず、新しいStateを作る」である。

------------------------------------------------------------------------

# 最終復習カード

## State

``` text
orders
→ 現在のState

setOrders
→ State更新を要求するsetter
```

## イミュータビリティ

``` text
既存Stateを直接変更しない
→ 新しい配列 / オブジェクトを作る
→ 次のStateとして使用する
```

## updater

``` text
setOrders((prevOrders) => ...)
              ↑
Reactが以前のStateを渡す
```

## 型

``` text
prevOrders   → Order[]
order        → Order
newOrder     → Order
updatedOrder → Order
```

## Create

``` ts
[...prevOrders, newOrder]
```

``` text
既存要素を展開
+
新しい要素を追加
→ 新しい配列
```

## Update

``` ts
prevOrders.map((order) =>
  order.id === updatedOrder.id
    ? updatedOrder
    : order
);
```

``` text
更新対象 → 置き換え
その他 → 維持
→ 新しい配列
```

## Delete

``` ts
prevOrders.filter(
  (order) => order.id !== deleteId
);
```

``` text
true → 残す
false → 除外
→ 新しい配列
```

## Day 22を一文でまとめると

> **Reactの配列Stateを更新するときは既存Stateを直接変更せず、spread・`map()`・`filter()`
> などを使って変更内容を反映した新しい配列を作り、その配列を次のStateとして使用する。**

------------------------------------------------------------------------

## 完了基準

次のコードを見て、自分の言葉で説明できればDay 22は完了。

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order,
  ),
);
```
