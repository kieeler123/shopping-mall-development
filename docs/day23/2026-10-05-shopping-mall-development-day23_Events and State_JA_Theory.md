# Day 23 --- イベントとState

## 理論まとめ

### 重要な質問

> ユーザーの操作は、どのようにStateの変更につながるのか？

``` text
ユーザー操作
↓
イベント発生
↓
onClick / onChange
↓
イベントハンドラー実行
↓
関数呼び出し
↓
State Setter呼び出し
↓
State更新
↓
コンポーネント再レンダリング
↓
JSX再計算
↓
UI更新
```

> **ポイント:**
> `ユーザー → Event → Handler → Setter → State → UI`の順番でコードを追います。

------------------------------------------------------------------------

### 1. onClick

``` tsx
onClick={handleClick}
onClick={handleClick()}
onClick={() => handleClick()}
```

`onClick={handleClick}`は関数そのものを渡し、クリックされたときに実行します。

`onClick={handleClick()}`はレンダリング時に関数をすぐに呼び出します。

引数を渡しながらクリック時に実行したい場合は：

``` tsx
onClick={() => handleStatusChange("completed")}
```

のように書けます。

> **ポイント:**
> `handleClick`は関数そのもの、`handleClick()`は関数の呼び出しです。

------------------------------------------------------------------------

### 2. onChangeとEvent

``` text
e → イベントオブジェクト
e.target → イベントが発生した要素
e.target.value → 要素の現在のvalue
```

``` tsx
<option value="completed">完了</option>
```

で「完了」を選択すると：

``` text
e.target.value = "completed"
```

になります。

> **ポイント:** ユーザーに表示される文字列と実際の`value`を区別します。

------------------------------------------------------------------------

### 3. 引数とパラメータ

``` tsx
const handleStatusChange = (
  orderId: number,
  newStatus: string
) => {};

handleStatusChange(7, "cancelled");
```

-   `orderId`, `newStatus` → パラメータ（仮引数）
-   `7`, `"cancelled"` → 引数

> **ポイント:**
> 関数定義側で受け取る変数がパラメータ、呼び出し側で渡す実際の値が引数です。

------------------------------------------------------------------------

### 4. Stateの更新

``` text
handleStatusChange("completed")
↓
newStatus = "completed"
↓
setStatus("completed")
↓
State更新
↓
再レンダリング
↓
JSX再計算
↓
UI更新
```

`handleStatusChange`が直接Stateを変更するのではなく、`setStatus()`などのsetterがState更新を要求します。

> **ポイント:**
> `setStatus()`や`setOrders()`を見つけると、State更新のポイントが分かります。

------------------------------------------------------------------------

### 5. 配列Stateの更新

``` tsx
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === orderId
      ? { ...order, status: newStatus }
      : order
  )
);
```

`handleStatusChange(20, "cancelled")`の場合：

``` text
10 === 20 → false → 変更なし
20 === 20 → true  → statusを変更
30 === 20 → false → 変更なし
```

結果：

``` tsx
[
  { id: 10, status: "pending" },
  { id: 20, status: "cancelled" },
  { id: 30, status: "completed" },
]
```

> **ポイント:** `orderId`は固定し、`order.id`を一つずつ確認します。

------------------------------------------------------------------------

### 6. Spread構文

``` tsx
{ ...order, status: newStatus }
```

既存の`order`のプロパティをコピーし、`status`だけを新しい値で上書きします。

> **ポイント:**
> `{ ...既存オブジェクト, 変更するプロパティ: 新しい値 }`という形を覚えます。

------------------------------------------------------------------------

### 7. `as OrderStatus`

``` tsx
e.target.value as OrderStatus
```

は実際の値を変更しません。TypeScriptにその値を`OrderStatus`型として扱うよう伝える**型アサーション（Type
Assertion）**です。

> **ポイント:**
> `as`は値の変換ではなくTypeScriptの型情報に関係するものです。

------------------------------------------------------------------------

### 8. 実際のプロジェクトの流れ

``` tsx
onChange={(e) => {
  onStatusChange(
    order.id,
    e.target.value as OrderStatus
  );
}}
```

``` text
ユーザーが値を変更
↓
onChange
↓
イベントオブジェクト e
↓
e.target.value
↓
注文ID + 新しいstatus
↓
onStatusChange(...)
↓
State更新関数
↓
setter
↓
State更新
↓
再レンダリング
↓
JSX再計算
↓
UI更新
```

> **ポイント:**
> `order.id → 20`、`e.target.value → "cancelled"`のように実際の値へ置き換えて考えます。

------------------------------------------------------------------------

## 要点

``` text
ユーザー
→ イベント
→ イベントハンドラー
→ 関数
→ Setter
→ State
→ 再レンダリング
→ JSX再計算
→ UI更新
```
