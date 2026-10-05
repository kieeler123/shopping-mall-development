# Day 23 --- イベントとState

## 問題 + 解答

### 問題1

次の違いを説明してください。

``` tsx
onClick={handleClick}
onClick={handleClick()}
onClick={() => handleClick()}
```

```{=html}
<details>
```
```{=html}
<summary>
```
解答を見る
```{=html}
</summary>
```
`onClick={handleClick}`は関数そのものを渡し、クリックされたときに実行します。

`onClick={handleClick()}`はレンダリング時に関数をすぐに呼び出します。

`onClick={() => handleClick()}`はアロー関数を渡し、クリックされたときにその中で`handleClick()`を呼び出します。

```{=html}
</details>
```
> **ポイント:**
> `()`があるか、関数呼び出しが別の関数で包まれているか確認します。

------------------------------------------------------------------------

### 問題2

``` tsx
<option value="shipping">配送中</option>
```

「配送中」を選択した場合、`e.target.value`は何ですか？

```{=html}
<details>
```
```{=html}
<summary>
```
解答を見る
```{=html}
</summary>
```
`"shipping"`

```{=html}
</details>
```
> **ポイント:** 表示される文字列ではなく`value`属性を確認します。

------------------------------------------------------------------------

### 問題3

``` tsx
const handleStatusChange = (
  orderId: number,
  newStatus: string
) => {};

handleStatusChange(15, "completed");
```

`orderId`と`newStatus`は何になりますか？また、引数はどれですか？

```{=html}
<details>
```
```{=html}
<summary>
```
解答を見る
```{=html}
</summary>
```
``` text
orderId = 15
newStatus = "completed"
```

`15`と`"completed"`は引数です。

`orderId`と`newStatus`はパラメータです。

```{=html}
</details>
```
> **ポイント:** 引数を左から順番にパラメータへ対応させます。

------------------------------------------------------------------------

### 問題4

`handleStatusChange(20, "cancelled")`の場合、ID
`10`、`20`、`30`はどうなりますか？

```{=html}
<details>
```
```{=html}
<summary>
```
解答を見る
```{=html}
</summary>
```
``` text
10 === 20 → false → 変更なし
20 === 20 → true  → statusを"cancelled"に変更
30 === 20 → false → 変更なし
```

20番の注文だけが変更されます。

```{=html}
</details>
```
> **ポイント:**
> `orderId = 20`は固定され、`map()`の中で`order.id`だけが変わります。

------------------------------------------------------------------------

### 問題5

次のコードの流れを説明してください。

``` tsx
onChange={(e) => {
  handleStatusChange(
    order.id,
    e.target.value as OrderStatus
  );
}}
```

```{=html}
<details>
```
```{=html}
<summary>
```
解答を見る
```{=html}
</summary>
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
order.idと新しいvalue
↓
handleStatusChange(...)
↓
State setter
↓
State更新
↓
再レンダリング
↓
JSX再計算
↓
UI更新
```

`as OrderStatus`は実際の値を変更せず、TypeScriptにその値を`OrderStatus`型として扱うよう伝える型アサーションです。

```{=html}
</details>
```
> **ポイント:** EventからState
> setter、そしてUIまで値の流れを順番に追います。
