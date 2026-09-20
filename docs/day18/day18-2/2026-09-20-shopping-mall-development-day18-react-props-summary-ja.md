# Day 18 React 学習まとめ

## 1. 関数 Props の集中復習

今日最初に確認したのは、**State を持つコンポーネントで handler
を作り、その関数を必要な子コンポーネントまで Props
として渡す流れ**です。

``` text
App
├─ Header
└─ ProductList
   └─ ProductCard
      └─ Button
```

基本の流れ:

``` text
State を持つコンポーネント
↓
State を変更する handler を作る
↓
関数を Props として渡す
↓
中間コンポーネントがさらに下へ渡す
↓
実際に必要なコンポーネントで実行する
```

例:

``` jsx
function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prevCart => [...prevCart, item]);
  };

  return (
    <>
      <Header count={cart.length} />
      <Shop addToCart={addToCart} />
    </>
  );
}
```

``` jsx
function Shop({ addToCart }) {
  return <ItemCard item={item} addToCart={addToCart} />;
}
```

``` jsx
function ItemCard({ item, addToCart }) {
  return (
    <button onClick={() => addToCart(item)}>
      カートに追加
    </button>
  );
}
```

> **ヒント:** 関数 Props
> で混乱したら、`誰が作った？ → 今は誰が持っている？ → 最後に誰が実行する？`
> の3点を追います。

## 2. Props は1つのオブジェクトとして渡される

誤った形:

``` jsx
function ProductCard(product, onAdd) {
```

React コンポーネントが受け取る Props
は1つのオブジェクトなので、次のように書けます。

``` jsx
function ProductCard(props) {
```

または分割代入を使います。

``` jsx
function ProductCard({ product, onAdd }) {
```

> **ヒント:** `<Component a={} b={} c={} />` を見たら、受け取る側の
> `function Component({ a, b, c })` と結び付けて考えます。

## 3. State を置く場所

State は常に一番上に置くのではなく、**その State
を必要とするコンポーネントたちの適切な共通親**に置きます。

``` text
App
├─ Header ← cart の個数が必要
└─ ProductList
   └─ ProductCard ← cart に追加する機能が必要
```

この場合、`App` が State を置く適切な場所になり得ます。

``` text
State が App にある
↓
setState も App が持つ
↓
State を変更する handler を App で作る
↓
必要な子へ Props として渡す
```

> **ヒント:**
> `一番上はどこ？`ではなく、`このデータを使うコンポーネントたちの共通親はどこ？`と考えます。

## 4. 配列 State 内のオブジェクトを更新する

練習した State:

``` jsx
const [users, setUsers] = useState([
  { id: 1, name: "A", active: false },
  { id: 2, name: "B", active: false },
]);
```

目標は `id === 2` の user だけを `active: true` に変更することでした。

重要なのは変数の役割を区別することです。

``` text
users
→ 元の配列全体

user
→ map が現在処理している要素1つ

updatedUsers
→ map が作った新しい配列全体

activateUser
→ 処理を実行する関数
```

React をいったん外して考えると:

``` js
const numbers = [1, 2, 3];

const doubledNumbers = numbers.map(number => {
  return number * 2;
});
```

``` text
numbers → 元の配列全体
number → 現在の要素1つ
doubledNumbers → 新しい配列全体
```

> **ヒント:** 複雑になったら、変数の横に
> `配列 / オブジェクト1つ / 関数 / 新しい配列` のように役割を書きます。

## 5. map の結果を受け取る

`map()` は新しい配列を返します。

誤った流れ:

``` js
users.map(user => {
  // ...
});

setUsers(users);
```

正しい流れ:

``` js
const updatedUsers = users.map(user => {
  if (user.id === 2) {
    return {
      ...user,
      active: true
    };
  }

  return user;
});

setUsers(updatedUsers);
```

> **ヒント:**
> `map の中で何をする？`だけでなく、`map が終わったらどんな新しい配列が返る？`まで考えます。

## 6. Object Spread の役割

既存オブジェクトを直接変更せず、新しいオブジェクトを作ります。

``` js
{
  ...user,
  active: true
}
```

意味:

``` text
既存 user のプロパティをコピー
+
active だけ新しい値で上書き
```

変更対象でない場合は:

``` js
return user;
```

でそのまま維持します。

> **ヒント:** オブジェクト更新では
> `既存オブジェクトをコピー → 変更するプロパティだけ上書き` と考えます。

## 7. 最後の応用問題

商品配列でも同じ原理を適用できました。

``` jsx
const [products, setProducts] = useState([
  { id: 10, name: "キーボード", price: 50000 },
  { id: 20, name: "マウス", price: 30000 },
  { id: 30, name: "モニター", price: 200000 },
]);
```

`id === 20` の商品の価格を変更:

``` js
const updatedProducts = products.map(product => {
  if (product.id === 20) {
    return {
      ...product,
      price: product.price + 10000
    };
  }

  return product;
});

setProducts(updatedProducts);
```

`price: 40000` でも現在のデータでは結果は正しいですが、要件が
**現在の価格から10,000増やす** であれば、`product.price + 10000`
の方が要件を正確に表現できます。

> **ヒント:** 要件に `増加 / 減少 / 現在の値から / 既存値を基準に`
> があれば、固定値ではなく既存値を使った計算か確認します。

## 8. 今日見つかったミスの種類

### 概念として補強した部分

-   関数 Props の受け渡し経路
-   Props が1つのオブジェクトであること
-   `map` の戻り値
-   配列全体と現在の要素の区別
-   新しい配列を Setter に渡す流れ

### 文法・注意によるミス

-   `setFavorite` と `setFavorites`
-   `onadd` と `onAdd`
-   JSX の self-closing の抜け
-   Fragment の抜け
-   要件が `active: true` なのに `false` と書く

> **ヒント:** エラーを `概念 / 文法 / タイポ / 要件確認`
> に分類すると、何を復習すべきか明確になります。

## 9. 現在の学習状況

  項目                             現在の状態
  -------------------------------- -----------------------
  `useState` 基本                  ✅
  Event 基本                       ✅
  配列への追加・削除               ✅
  関数 Props                       ✅ 補強完了
  Props の分割代入                 ✅
  State の配置判断                 ✅ 基本理解
  `map`                            ✅
  条件で対象を選ぶ                 ✅
  Object Spread で更新             ✅
  `map` の結果 → Setter            ✅ 集中補強
  `key` と通常の Props の違い      ✅
  既存値を使った更新               🟡 もう少し経験が必要
  複雑なコードで変数の役割を追う   🟡 後で再確認
  要件を正確に実装する             🟡 注意
  JSX の細かい文法                 🟡 ときどきミス

## 10. 次回以降の復習方針

今日とまったく同じ問題をすぐ繰り返すのではなく、先へ進んだ後に別の文脈で同じパターンを自然に使えるか確認します。

例:

-   特定商品の数量を変更
-   特定商品のオプションを変更
-   注文ステータスを変更
-   特定項目を削除
-   子コンポーネントから親の State を更新

そのとき、ヒントなしで次の要素を再び組み合わせられるか確認します。

``` text
State の位置
関数 Props
map
条件
Object Spread
Setter
```

> **ヒント:**
> 完成コードを丸暗記するのではなく、`全体 → 1つずつ → 対象を探す → 新しいオブジェクト → 新しい全体 → Setter`
> という思考の流れを覚えます。

## 次回の開始地点

次回は今日の内容を最初から繰り返さず、**Events / Forms** から続けます。

``` text
Events / Forms
↓
input
↓
onChange
↓
event.target.value
↓
value={state}
↓
Controlled Component
↓
form / onSubmit
↓
preventDefault()
```

今日の中心的な成果は、複数の概念が組み合わさったときに難しくなる箇所を見つけ、それを小さく分解して理解し、最後にもう一度組み合わせてコードを書けたことです。
