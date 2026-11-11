# Day 22 --- React Stateの更新とイミュータビリティ：復習問題70問

> まず自分で問題を解き、その後、各問題の下にある `<details>`
> を開いて答えと解説を確認する。

**学習ルール：** `setOrders`、`prevOrders`、`map()`、`filter()`
などはコード上の識別子なので、そのまま使用する。

------------------------------------------------------------------------

### 問題 1

`const [orders, setOrders] = useState<Order[]>([]);` における `orders`
の役割は何か？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`orders` は現在のレンダーで使用するState値である。型は
`Order[]`、初期値は空配列 `[]` である。

**ヒント：** `orders = 現在のState` と考える。

```{=html}
</details>
```
### 問題 2

`setOrders` の役割は何か？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`orders` Stateの更新をReactへ要求するsetter関数である。

**ヒント：** 通常の変数代入ではなくState更新要求と考える。

```{=html}
</details>
```
### 問題 3

`setOrders` 実行後の代表的な流れを説明せよ。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
State更新 → コンポーネント再レンダー → 新しいStateでJSXを再計算 →
UIへ反映、という流れになる。

**ヒント：** setterからUIまでつなげて考える。

```{=html}
</details>
```
### 問題 4

React Stateにおけるイミュータビリティとは何か？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
既存Stateを直接変更せず、変更内容を反映した新しい配列やオブジェクトを作って次のStateとして使用すること。

**ヒント：** 古い値は直接変更せず、新しい値を作る。

```{=html}
</details>
```
### 問題 5

なぜ `orders[0].status = "SHIPPED";` のような更新を避けるのか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
既存State内のオブジェクトを直接変更するため。今回の学習では新しい値を作ってsetterで更新する。

**ヒント：** 既存Stateを直接触っていないか確認する。

```{=html}
</details>
```
### 問題 6

`Order[]` と `Order` の違いを説明せよ。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`Order[]` は複数の `Order` を持つ配列、`Order`
は1つの注文オブジェクトである。

**ヒント：** 複数形と単数形を意識する。

```{=html}
</details>
```
### 問題 7

`prevOrders` はReactの予約語か？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
いいえ。updater関数の引数名にすぎず、別の名前にも変更できる。

**ヒント：** 名前より役割を理解する。

```{=html}
</details>
```
### 問題 8

`prevOrders` の値は誰が渡すのか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
Reactがupdater関数を呼び出すとき、以前のState値を引数として渡す。

**ヒント：** React → updater呼び出し → 以前のState。

```{=html}
</details>
```
### 問題 9

`orders` が `Order[]` なら `prevOrders` の型は何か？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`Order[]`。

**ヒント：** updaterは対象Stateの以前の値を受け取る。

```{=html}
</details>
```
### 問題 10

`setOrders((prevOrders) => [...prevOrders, newOrder])`
のupdater関数はどの部分か？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`(prevOrders) => [...prevOrders, newOrder]`
全体がupdater関数で、`prevOrders` はその引数である。

**ヒント：** 関数全体と引数を区別する。

```{=html}
</details>
```
### 問題 11

新しい配列内の `...prevOrders` は何をするか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`prevOrders` の既存要素を新しい配列の中へ展開する。

**ヒント：** spread = 要素の展開。

```{=html}
</details>
```
### 問題 12

spread自体が `newOrder` を追加するのか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
いいえ。spreadは既存要素を展開する。`newOrder`
が別に記述されているため追加される。

**ヒント：** spreadと追加要素の役割を分ける。

```{=html}
</details>
```
### 問題 13

`prevOrders = [{id:1},{id:2}]`、`newOrder = {id:3}` のとき
`[...prevOrders, newOrder]` の結果は？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`[{ id: 1 }, { id: 2 }, { id: 3 }]`。

**ヒント：** 結果は新しい配列。

```{=html}
</details>
```
### 問題 14

`[...prevOrders, newOrder]` と `[newOrder, ...prevOrders]` の違いは？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
前者は末尾、後者は先頭に `newOrder` が配置される。

**ヒント：** 記述順が配列内の順番になる。

```{=html}
</details>
```
### 問題 15

`[...prevOrders]` だけなら何が作られるか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
既存要素を含む新しい配列が作られる。新しい要素は追加されない。

**ヒント：** 追加値がなければ要素は増えない。

```{=html}
</details>
```
### 問題 16

`[...prevOrders, newOrder]` がイミュータビリティを保つ理由は？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
既存の `prevOrders` を直接変更せず、新しい配列を作るため。

**ヒント：** 既存配列を維持し、新しい配列を作る。

```{=html}
</details>
```
### 問題 17

`map()` の基本的な役割は？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
各要素を処理し、コールバックの戻り値から新しい配列を作る。

**ヒント：** 要素 → 戻り値 → 新しい配列。

```{=html}
</details>
```
### 問題 18

`map()` は元の配列そのものを返すか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
いいえ。新しい配列を返す。

**ヒント：** mapは新しい配列を作る。

```{=html}
</details>
```
### 問題 19

3要素の配列では `map()` のコールバックは何回実行されるか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
3回。各要素につき1回実行される。

**ヒント：** 1要素につき1回。

```{=html}
</details>
```
### 問題 20

`prevOrders.map((order) => ...)` の `order` は何か？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`prevOrders` 内の1つの `Order` オブジェクトである。

**ヒント：** 配列全体ではなく1要素。

```{=html}
</details>
```
### 問題 21

`map()` が `order` オブジェクトを新しく作るのか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
いいえ。既存配列の各要素が `order` として渡される。

**ヒント：** mapが新しく作るのは結果配列。

```{=html}
</details>
```
### 問題 22

`prevOrders.map((order) => order)` の結果配列は `prevOrders` と同一か？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
いいえ。配列自体は新しい。ただし内部要素は既存オブジェクトを参照できる。

**ヒント：** 配列と内部オブジェクトを区別する。

```{=html}
</details>
```
### 問題 23

`order.id === updatedOrder.id` の目的は？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
現在の `order` が更新対象かどうかを確認すること。

**ヒント：** この要素は対象か？と読む。

```{=html}
</details>
```
### 問題 24

なぜ更新対象の特定に `status` より `id` が適しているのか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
複数注文が同じ `status` を持つ可能性がある一方、`id`
は特定の注文を識別するために使われるから。

**ヒント：** 状態値と識別値を区別する。

```{=html}
</details>
```
### 問題 25

条件がtrueの場合、三項演算子は何を返すか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`updatedOrder`。

**ヒント：** 対象要素を更新後のオブジェクトへ置き換える。

```{=html}
</details>
```
### 問題 26

IDが一致しない場合、なぜ既存の `order` を返すのか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
更新対象ではない要素をそのまま維持するため。

**ヒント：** `: order` は非対象要素の維持。

```{=html}
</details>
```
### 問題 27

`condition ? updatedOrder : order` を `if/else` で書き換えよ。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
``` ts
if (condition) {
  return updatedOrder;
} else {
  return order;
}
```

**ヒント：** 三項演算子が読みにくい場合はif/elseへ展開する。

```{=html}
</details>
```
### 問題 28

`===` は何を比較するか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
値と型の両方が一致するかを比較する。

**ヒント：** `2 === "2"` はfalse。

```{=html}
</details>
```
### 問題 29

`updatedOrder.id = 2` の場合、ID 1・2・3では何が返るか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
1 → false → 既存order、2 → true → `updatedOrder`、3 → false →
既存order。

**ヒント：** 各要素で条件を実際に評価する。

```{=html}
</details>
```
### 問題 30

ID 2だけを `{ id: 2, status: "SHIPPED" }` へ更新すると結果はどうなるか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
ID 1と3は維持され、ID 2だけ更新後のオブジェクトへ置き換わる。

**ヒント：** 一致した要素だけ変わる。

```{=html}
</details>
```
### 問題 31

`map()` 内の `return null` は「何も返さない」という意味か？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
いいえ。`null` という値を返している。

**ヒント：** nullも値である。

```{=html}
</details>
```
### 問題 32

非対象要素で `null` を返すとどうなるか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
新しい配列の該当位置に `null` が入る。

**ヒント：** mapは戻り値を配列要素にする。

```{=html}
</details>
```
### 問題 33

要素を結果配列から除外したい場合、`map()` と `filter()`
のどちらが適切か？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`filter()`。

**ヒント：** mapは変換、filterは残すか除外するか。

```{=html}
</details>
```
### 問題 34

`const newOrders = prevOrders.map(order => order)` の後に
`newOrders === prevOrders` がfalseなのはなぜか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`map()` が新しい配列オブジェクトを作るから。

**ヒント：** 同じ要素でも配列自体は別。

```{=html}
</details>
```
### 問題 35

新しい配列を作ると、内部のすべてのオブジェクトも必ず新しくなるか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
いいえ。変更しない要素では既存オブジェクトをそのまま利用できる。

**ヒント：** 新しい配列と新しい要素は別概念。

```{=html}
</details>
```
### 問題 36

`filter()` の基本的な役割は？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
条件がtrueの要素だけを残して新しい配列を作る。

**ヒント：** true = 残す、false = 除外。

```{=html}
</details>
```
### 問題 37

削除で `order.id !== deleteId` を使う理由は？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
削除対象以外をtrueにして残し、削除対象だけfalseにして除外するため。

**ヒント：** 削除対象だけfalseにする。

```{=html}
</details>
```
### 問題 38

`1 !== 2`、`2 !== 2`、`3 !== 2` の結果は？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
true、false、true。

**ヒント：** Boolean結果から残る要素を判断する。

```{=html}
</details>
```
### 問題 39

ID `[1,2,3]` を `deleteId = 2` でfilterすると結果は？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
ID 1と3を含む新しい配列。

**ヒント：** ID 2だけ除外される。

```{=html}
</details>
```
### 問題 40

`filter()` は元の配列から要素を直接削除するか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
いいえ。条件を通過した要素で新しい配列を作る。

**ヒント：** 直接削除ではなく新しい配列。

```{=html}
</details>
```
### 問題 41

`filter()` による削除がイミュータビリティを保つ理由は？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
既存配列を変更せず、対象を除外した新しい配列を作るから。

**ヒント：** 削除結果も新しい配列として表現する。

```{=html}
</details>
```
### 問題 42

`setOrders(prev => [...prev, newOrder])` を一文で説明せよ。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
Reactが以前の注文配列をupdaterへ渡し、updaterが既存要素と `newOrder`
を含む新しい配列を返す。

**ヒント：** 以前のState → 新しい配列 → 追加。

```{=html}
</details>
```
### 問題 43

`filter()` による削除コードを一文で説明せよ。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`deleteId` と異なるIDの注文だけを残した新しい配列を返す。

**ヒント：** 除外条件を説明する。

```{=html}
</details>
```
### 問題 44

`map()` による更新を `setOrders` からUIまで説明せよ。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
Reactが以前の注文配列をupdaterへ渡し、`map()`
が各注文を確認して一致するIDを `updatedOrder`
に置き換え、その他を維持した新しい配列を返す。その配列が次のStateとなり、再レンダー後にUIへ反映される。

**ヒント：** setter → updater → map → 新State → UI。

```{=html}
</details>
```
### 問題 45

「`map()` が新しい `order` を作って引数へ入れる」という説明を修正せよ。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
既存配列の各要素が `order` 引数として渡され、`map()`
はコールバックの戻り値から新しい結果配列を作る。

**ヒント：** 引数は既存要素を受け取る。

```{=html}
</details>
```
### 問題 46

「`setOrders` が `map()`
の各戻り値を集めて配列を作る」という説明を修正せよ。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
戻り値を集めて新しい配列を作るのは
`map()`。updaterがその配列を返し、Reactが次のStateとして使用する。

**ヒント：** mapとsetOrdersの役割を分ける。

```{=html}
</details>
```
### 問題 47

「`map()` で `null` を返すと要素が消える」という説明を修正せよ。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`null` を返すと結果配列に `null` が入る。要素を除外するなら `filter()`
が適している。

**ヒント：** nullは削除ではない。

```{=html}
</details>
```
### 問題 48

「spreadは配列へ要素を追加するメソッドである」という説明を修正せよ。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
spreadは要素を展開する構文である。`newOrder`
が別に含まれるため追加が実現される。

**ヒント：** spread = 展開。

```{=html}
</details>
```
### 問題 49

空欄を埋めよ：`setOrders(prevOrders => [______, newOrder])`

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`...prevOrders`。

**ヒント：** 既存要素を展開する。

```{=html}
</details>
```
### 問題 50

空欄を埋めよ：`order.id ______ updatedOrder.id ? updatedOrder : order`

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`===`。

**ヒント：** 更新対象のIDを一致比較する。

```{=html}
</details>
```
### 問題 51

空欄を埋めよ：`condition ? updatedOrder : ______`

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`order`。

**ヒント：** 非対象要素を維持する。

```{=html}
</details>
```
### 問題 52

空欄を埋めよ：`order.id ______ deleteId`

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`!==`。

**ヒント：** 削除対象と異なる要素を残す。

```{=html}
</details>
```
### 問題 53

完成させよ：Create → ?、Update → ?、Delete → ?

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
Create → spread、Update → `map()`、Delete → `filter()`。

**ヒント：** 各手段がどのような新しい配列を作るかも理解する。

```{=html}
</details>
```
### 問題 54

○×：`prevOrders` はReactの予約語である。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
×。単なる引数名である。

**ヒント：** 別の名前にも変更できる。

```{=html}
</details>
```
### 問題 55

○×：`map()` は元の配列を直接変更して同じ配列を返す。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
×。新しい配列を返す。

**ヒント：** map → 新しい配列。

```{=html}
</details>
```
### 問題 56

○×：`filter()` は条件がtrueの要素を結果配列に残す。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
○。

**ヒント：** trueは残る。

```{=html}
</details>
```
### 問題 57

○×：`return null` は何も値を返さないことと同じである。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
×。`null` という値を返している。

**ヒント：** nullも戻り値。

```{=html}
</details>
```
### 問題 58

○×：`[...prevOrders, newOrder]` は `prevOrders` を直接変更する。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
×。新しい配列を作る。

**ヒント：** spreadを使った配列リテラルは新しい配列。

```{=html}
</details>
```
### 問題 59

○×：`map()` で既存の `order` を返した場合、結果配列も必ず `prevOrders`
と同一になる。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
×。結果配列自体は新しい。

**ヒント：** 配列と要素の参照を区別する。

```{=html}
</details>
```
### 問題 60

○×：`order.id === updatedOrder.id`
は現在の注文が更新対象か確認する条件である。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
○。

**ヒント：** ID比較で対象を識別する。

```{=html}
</details>
```
### 問題 61

注文10と30の `status` が両方 `PAID` でも、なぜID
30だけ安全に更新できるのか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
IDで比較すれば注文30を個別に識別できるため。

**ヒント：** 重複する状態値に影響されない。

```{=html}
</details>
```
### 問題 62

`status === "PAID"` で更新対象を探すと危険な理由は？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
複数の注文が同じstatusを持つ可能性があり、複数要素が一致する可能性があるため。

**ヒント：** 状態と識別子を混同しない。

```{=html}
</details>
```
### 問題 63

`[Order1, Order2, Order3]` でOrder2だけ更新する場合、`map()`
は各要素で何を返すべきか？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
Order1 → 既存Order1、Order2 → `updatedOrder`、Order3 → 既存Order3。

**ヒント：** 維持 / 置換 / 維持。

```{=html}
</details>
```
### 問題 64

`[Order1, Order2, Order3]` からOrder2を削除する場合、`filter()`
の条件結果は？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
Order1 → true、Order2 → false、Order3 → true。

**ヒント：** 削除対象だけfalse。

```{=html}
</details>
```
### 問題 65

`map()` と `filter()` の最も重要な違いを説明せよ。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`map()` は各要素を何として返すかを決め、`filter()`
は各要素を残すか除外するかを決める。

**ヒント：** map = 何を返すか、filter = 残すか。

```{=html}
</details>
```
### 問題 66

Create・Update・Deleteのコードに共通する原則は何か？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
既存State配列を直接変更せず、新しい配列を作って次のStateとして使用すること。

**ヒント：** 構文は違っても原則は同じ。

```{=html}
</details>
```
### 問題 67

流れを完成させよ：既存State → 直接変更しない → \_\_\_\_\_\_ →
setter/updater → \_\_\_\_\_\_ → 再レンダー → UI

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
新しい配列/オブジェクトを作る → State更新。

**ヒント：** Day 22全体の流れを覚える。

```{=html}
</details>
```
### 問題 68

更新コードで実際に新しい配列を作るのは何か？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
`map()`。

**ヒント：** setOrdersの役割と混同しない。

```{=html}
</details>
```
### 問題 69

更新コードで計算された次のStateをReactへ返すのは何か？

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
updater関数。`map()` の結果がupdaterの戻り値になる。

**ヒント：** map結果 → updaterの戻り値。

```{=html}
</details>
```
### 問題 70

Day 22の対象コードを短く説明せよ。

```{=html}
<details>
```
```{=html}
<summary>
```
答え・解説
```{=html}
</summary>
```
Reactが以前の `Order[]` を `prevOrders` としてupdaterへ渡す。`map()`
が各 `order` を確認し、IDが一致すれば
`updatedOrder`、一致しなければ既存の `order` を返す。`map()`
が新しい配列を作り、その配列が次のStateとなってUIが再レンダーされる。

**ヒント：** 構文だけでなくデータの流れを説明する。

```{=html}
</details>
```
