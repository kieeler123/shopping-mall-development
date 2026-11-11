# JSON.stringify() と JSON.parse() 完全理解

# Understanding JSON.stringify() and JSON.parse()

# JSON.stringify()와 JSON.parse() 완전 이해

------------------------------------------------------------------------

# 日本語

## 1. なぜ今 `JSON.stringify()` と `JSON.parse()` を学ぶのか

Day 3では、ショッピングモールのカート機能を作っている。

現在の流れは次のようになっている。

``` text
商品詳細
↓
数量を選択
↓
「カートに追加」をクリック
↓
CartItemを作る
↓
localStorageへ保存
```

ここで重要なのは、JavaScriptで扱っているカートデータをそのまま
`localStorage`
に保存するのではなく、保存できる形式へ変換する必要があるという点である。

今回の `CartItem` は次の形になっている。

``` ts
export type CartItem = {
  productId: number;
  quantity: number;
};
```

例えば商品IDが1の商品を2個カートに入れた場合、JavaScriptでは次のようなオブジェクトとして扱える。

``` ts
const cartItem: CartItem = {
  productId: 1,
  quantity: 2,
};
```

複数の商品を扱うカートでは配列になる。

``` ts
const cart: CartItem[] = [
  {
    productId: 1,
    quantity: 2,
  },
];
```

しかし `localStorage`
は基本的に文字列としてデータを保存する仕組みである。

そのため、次の変換が必要になる。

``` text
JavaScriptの配列・オブジェクト
↓
JSON.stringify()
↓
文字列
↓
localStorage
```

そして読み込むときは逆方向になる。

``` text
localStorage
↓
文字列
↓
JSON.parse()
↓
JavaScriptの配列・オブジェクト
```

> **Tip** `JSON.stringify()` と `JSON.parse()`
> を別々の暗記項目として考えず、「保存するとき」と「読み込むとき」の往復処理として覚える。

------------------------------------------------------------------------

## 2. まずJavaScript上のカートを理解する

例えば次のデータがある。

``` ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
];
```

これは文字列ではない。

構造として見ると次のようになる。

``` text
cart
│
└─ Array
   │
   └─ Object
      ├─ productId → number
      └─ quantity  → number
```

`cart` は配列なので、JavaScriptでは配列用の処理ができる。

例えば新しい商品を追加できる。

``` ts
cart.push({
  productId: 2,
  quantity: 1,
});
```

すると、

``` ts
[
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 2,
    quantity: 1,
  },
]
```

になる。

また、

``` ts
cart[0].quantity
```

のように値へアクセスすることもできる。

> **Tip** `JSON.stringify()`
> を理解する前に、「変換前のデータはJavaScriptの配列・オブジェクトである」という出発点を明確にする。

------------------------------------------------------------------------

## 3. `localStorage` は何を保存するのか

`localStorage` では次のようにデータを保存する。

``` ts
localStorage.setItem("cart", "hello");
```

基本形は次のイメージである。

``` ts
localStorage.setItem(key, value);
```

今回ならキーとして `"cart"` を使う。

``` text
key
↓
"cart"

value
↓
実際のカートデータ
```

問題は、カートがJavaScriptの配列であることだ。

``` ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
];
```

そこで配列・オブジェクトの構造を維持したまま文字列として表現するためにJSONを利用する。

> **Tip** `localStorage`
> を小さなデータベースのように考えすぎず、まずは「ブラウザに文字列を保存しておける場所」と考えると理解しやすい。

------------------------------------------------------------------------

## 4. JSONとは何か

JSONは **JavaScript Object Notation**
の略で、構造化されたデータをテキストとして表現するための形式である。

例えばJavaScriptでは次のようなオブジェクトを扱える。

``` ts
const item = {
  productId: 1,
  quantity: 2,
};
```

これをJSON形式の文字列として表すと、概念的には次のようになる。

``` json
{"productId":1,"quantity":2}
```

複数の商品なら、

``` json
[
  {
    "productId": 1,
    "quantity": 2
  },
  {
    "productId": 2,
    "quantity": 1
  }
]
```

のように表現できる。

ここで重要なのは、**JSON形式で表現された文字列とJavaScriptのオブジェクトは見た目が似ていても同じものではない**ということである。

> **Tip** `{ productId: 1 }` のようなJavaScriptオブジェクトと
> `'{"productId":1}'`
> のようなJSON文字列を、見た目ではなく「JavaScriptで現在どの型として扱っているか」で区別する。

------------------------------------------------------------------------

## 5. `JSON.stringify()` とは何か

`JSON.stringify()` はJavaScriptの値をJSON形式の文字列へ変換する。

例えば、

``` ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
];
```

に対して、

``` ts
const jsonCart = JSON.stringify(cart);
```

を実行する。

変換のイメージは次の通り。

``` text
JavaScript Array

[
  {
    productId: 1,
    quantity: 2
  }
]

↓ JSON.stringify()

JSON string

'[{"productId":1,"quantity":2}]'
```

つまり、

``` text
Array / Object
↓
JSON.stringify()
↓
string
```

という方向である。

`stringify` は「文字列化する」と考えると覚えやすい。

> **Tip** `JSON.stringify()` を `localStorage`
> 専用の関数だと思わないこと。JavaScriptのデータをJSON文字列へ変換する機能であり、今回は
> `localStorage` が文字列を必要とするため利用している。

------------------------------------------------------------------------

## 6. `typeof` で違いを確認する

次のコードを見る。

``` ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
];

const jsonCart = JSON.stringify(cart);

console.log(typeof cart);
console.log(typeof jsonCart);
```

概念的には、

``` text
cart
→ object

jsonCart
→ string
```

となる。

つまり、

``` ts
cart
```

と、

``` ts
JSON.stringify(cart)
```

は見た目が似ていても同じデータ型ではない。

> **Tip** JSON周辺で混乱したときは `typeof` や `console.log()`
> を使い、「今持っている値は文字列なのか、それともJavaScriptの値なのか」を確認する。

------------------------------------------------------------------------

## 7. カートを `localStorage` に保存する

ここまで理解すると、次のコードの意味が分かる。

``` ts
localStorage.setItem(
  "cart",
  JSON.stringify(cart)
);
```

処理を分解すると、

``` text
cart
↓
CartItem[]
↓
JSON.stringify(cart)
↓
JSON文字列
↓
localStorage.setItem()
↓
ブラウザへ保存
```

となる。

例えば、

``` ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
];
```

なら、保存される値は概念的には、

``` text
'[{"productId":1,"quantity":2}]'
```

のような文字列になる。

> **Tip** 保存コードを見るときは `setItem()`
> だけを見るのではなく、その直前に「何を文字列へ変換しているか」を追跡する。

------------------------------------------------------------------------

## 8. `localStorage.getItem()` で読み込む

保存したカートを再び取得する場合は、

``` ts
const savedCart = localStorage.getItem("cart");
```

とする。

ここで重要なのは、取得した `savedCart` がそのまま `CartItem[]`
になるわけではないことである。

保存したデータが存在する場合、取得されるのは文字列である。

概念的には、

``` text
localStorage

'[{"productId":1,"quantity":2}]'

↓ getItem("cart")

savedCart

'[{"productId":1,"quantity":2}]'
```

となる。

また、指定したキーにデータが存在しない場合は `null` になる。

そのため、

``` text
localStorage.getItem("cart")

↓ データあり
string

↓ データなし
null
```

と考える。

> **Tip** `getItem()`
> を使ったら、「配列を取得した」とすぐ考えず、「まず保存されていた文字列を取得した」と考える。

------------------------------------------------------------------------

## 9. なぜ `JSON.parse()` が必要なのか

`getItem()` で取得したデータは文字列である。

例えば、

``` text
'[{"productId":1,"quantity":2}]'
```

という状態である。

しかし、今後カートとして扱うなら、

``` ts
cart.push(cartItem);
```

のような配列操作をしたい。

そのため、文字列をJavaScriptの配列へ戻す必要がある。

ここで使用するのが、

``` ts
JSON.parse(savedCart);
```

である。

流れは次のようになる。

``` text
JSON string

'[{"productId":1,"quantity":2}]'

↓ JSON.parse()

JavaScript Array

[
  {
    productId: 1,
    quantity: 2
  }
]
```

つまり、

``` text
string
↓
JSON.parse()
↓
Array / Object
```

である。

> **Tip** `parse`
> は「文字列として書かれているJSONを読み取り、JavaScriptで扱える値として解釈する」と考える。

------------------------------------------------------------------------

## 10. `stringify` と `parse` は反対方向

この2つはセットで理解する。

  -----------------------------------------------------------------------
  処理                    変換方向                Day 3で使う場面
  ----------------------- ----------------------- -----------------------
  `JSON.stringify()`      JavaScript値 →          `localStorage`
                          JSON文字列              に保存するとき

  `JSON.parse()`          JSON文字列 →            `localStorage`
                          JavaScript値            から読み込んだ後
  -----------------------------------------------------------------------

全体の往復は次のようになる。

``` text
JavaScript
CartItem[]
    │
    │ JSON.stringify()
    ▼
JSON string
    │
    │ localStorage.setItem()
    ▼
localStorage


localStorage
    │
    │ localStorage.getItem()
    ▼
string
    │
    │ JSON.parse()
    ▼
CartItem[]
JavaScript
```

> **Tip** 「保存 = stringify」「読込 =
> parse」の2語だけで暗記するより、上の往復図を頭の中で再現できるようにする。

------------------------------------------------------------------------

## 11. 現在の `handleAddToCart` を1行ずつ読む

現在の基本コードは次の形である。

``` ts
const handleAddToCart = () => {
  const cartItem: CartItem = {
    productId,
    quantity,
  };

  const savedCart = localStorage.getItem("cart");

  const cart: CartItem[] = savedCart
    ? JSON.parse(savedCart)
    : [];

  cart.push(cartItem);

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
};
```

### 11.1 新しい `CartItem` を作る

``` ts
const cartItem: CartItem = {
  productId,
  quantity,
};
```

例えば、

``` ts
{
  productId: 1,
  quantity: 2
}
```

が作られる。

### 11.2 既存の保存データを読む

``` ts
const savedCart = localStorage.getItem("cart");
```

結果は、

``` text
string | null
```

と考える。

### 11.3 保存データがあれば配列へ戻す

``` ts
const cart: CartItem[] = savedCart
  ? JSON.parse(savedCart)
  : [];
```

意味は、

``` text
savedCartがある？
├─ Yes → JSON.parse(savedCart)
└─ No  → []
```

である。

### 11.4 新しい商品を配列へ追加する

``` ts
cart.push(cartItem);
```

例えば、

``` ts
[
  {
    productId: 1,
    quantity: 2,
  },
]
```

へ、

``` ts
{
  productId: 2,
  quantity: 1,
}
```

を追加すると、

``` ts
[
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 2,
    quantity: 1,
  },
]
```

になる。

### 11.5 更新された配列を再び保存する

``` ts
localStorage.setItem(
  "cart",
  JSON.stringify(cart)
);
```

再び、

``` text
CartItem[]
↓
JSON.stringify()
↓
string
↓
localStorage
```

という流れになる。

> **Tip** この関数を丸ごと暗記せず、「作る → 読む → parse → 配列操作 →
> stringify → 保存」という順序で説明できるようにする。

------------------------------------------------------------------------

## 12. 最初のカートが空の場合

初めてサイトを開いたユーザーには `"cart"` がまだ存在しない。

その場合、

``` ts
localStorage.getItem("cart");
```

は `null` になる。

そのため、

``` ts
const cart: CartItem[] = savedCart
  ? JSON.parse(savedCart)
  : [];
```

によって空配列から始める。

``` text
savedCart = null
↓
[]
↓
cart.push(cartItem)
↓
[{ productId: 1, quantity: 2 }]
↓
JSON.stringify()
↓
localStorageへ保存
```

> **Tip** Empty
> Stateは画面だけの概念ではない。保存データにも「まだ何も存在しない最初の状態」がある。

------------------------------------------------------------------------

## 13. 2回目以降に商品を追加する場合

すでに、

``` json
[
  {
    "productId": 1,
    "quantity": 2
  }
]
```

が保存されているとする。

次に商品2を1個追加する。

まず、

``` ts
const savedCart = localStorage.getItem("cart");
```

でJSON文字列を取得する。

次に、

``` ts
JSON.parse(savedCart);
```

によって、

``` ts
[
  {
    productId: 1,
    quantity: 2,
  },
]
```

へ戻す。

そして、

``` ts
cart.push({
  productId: 2,
  quantity: 1,
});
```

によって、

``` ts
[
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 2,
    quantity: 1,
  },
]
```

にする。

最後に再び、

``` ts
JSON.stringify(cart)
```

して保存する。

> **Tip** `localStorage` 内のデータを直接編集しているのではなく、「読む
> → JavaScriptへ戻す → JavaScriptで変更する →
> 再び文字列にして保存する」という流れである。

------------------------------------------------------------------------

## 14. よくある混乱

### `JSON.stringify()` は保存そのものではない

``` ts
JSON.stringify(cart);
```

だけでは `localStorage` には保存されない。

これは変換だけである。

実際の保存は、

``` ts
localStorage.setItem("cart", JSON.stringify(cart));
```

の `setItem()` が担当する。

### `JSON.parse()` は読み込みそのものではない

``` ts
JSON.parse(savedCart);
```

は `localStorage` からデータを取得する処理ではない。

取得は、

``` ts
localStorage.getItem("cart");
```

が担当する。

`JSON.parse()` は取得したJSON文字列をJavaScript値へ戻す役割である。

> **Tip**
> 責任を分けると混乱しにくい。`getItem/setItem = localStorageとの入出力`、`parse/stringify = データ形式の変換`
> と整理する。

------------------------------------------------------------------------

## 15. Day 3で覚える最終パターン

``` text
【保存】

JavaScript Object / Array
↓
JSON.stringify()
↓
string
↓
localStorage.setItem()


【読み込み】

localStorage.getItem()
↓
string | null
↓
存在確認
↓
JSON.parse()
↓
JavaScript Object / Array
```

一言でまとめると、

``` text
JSON.stringify()
= JavaScriptデータを保存しやすいJSON文字列へ変換する

JSON.parse()
= JSON文字列をJavaScriptで扱えるデータへ戻す
```

> **Tip** 次の `/cart` ページでは `getItem → parse → 画面表示`
> が登場する。今回の保存処理と反対方向の処理として追うと理解しやすい。

------------------------------------------------------------------------

# English

## 1. Why We Need `JSON.stringify()` and `JSON.parse()` Now

On Day 3, we are implementing the shopping cart.

The current flow is:

``` text
Product detail
↓
Select quantity
↓
Click Add to Cart
↓
Create a CartItem
↓
Save it to localStorage
```

Our `CartItem` currently looks like this:

``` ts
export type CartItem = {
  productId: number;
  quantity: number;
};
```

If product 1 is added with a quantity of 2, JavaScript can represent it
as:

``` ts
const cartItem: CartItem = {
  productId: 1,
  quantity: 2,
};
```

A cart containing multiple items is naturally represented as an array:

``` ts
const cart: CartItem[] = [
  {
    productId: 1,
    quantity: 2,
  },
];
```

The important point is that `localStorage` stores values as strings.
Therefore, our JavaScript array needs to be converted before it is
persisted.

``` text
JavaScript Array / Object
↓
JSON.stringify()
↓
string
↓
localStorage
```

When reading the cart, we travel in the opposite direction.

``` text
localStorage
↓
string
↓
JSON.parse()
↓
JavaScript Array / Object
```

> **Tip** Treat `stringify` and `parse` as the two directions of one
> storage round trip rather than two unrelated functions.

------------------------------------------------------------------------

## 2. Understanding the Cart Before Conversion

Consider:

``` ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
];
```

This is not a string. It is a JavaScript array containing an object.

``` text
cart
│
└─ Array
   │
   └─ Object
      ├─ productId → number
      └─ quantity  → number
```

Because it is an array, normal JavaScript array operations are
available.

``` ts
cart.push({
  productId: 2,
  quantity: 1,
});
```

The result becomes:

``` ts
[
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 2,
    quantity: 1,
  },
]
```

We can also access values such as:

``` ts
cart[0].quantity;
```

> **Tip** Always identify the starting data type first. Before
> serialization, the cart is a real JavaScript array, not text that
> merely looks like an array.

------------------------------------------------------------------------

## 3. What `localStorage` Stores

A simple `localStorage` write looks like:

``` ts
localStorage.setItem("cart", "hello");
```

Conceptually:

``` ts
localStorage.setItem(key, value);
```

For this project:

``` text
key
↓
"cart"

value
↓
the cart data
```

Our cart, however, is an array.

``` ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
];
```

To preserve that structured information while storing it as text, we use
JSON serialization.

> **Tip** At this stage, think of `localStorage` simply as browser
> storage for string values. This mental model makes the conversion
> requirement much easier to understand.

------------------------------------------------------------------------

## 4. What JSON Is

JSON stands for **JavaScript Object Notation**. It is a text format for
representing structured data.

A JavaScript object may look like:

``` ts
const item = {
  productId: 1,
  quantity: 2,
};
```

Its JSON representation can look like:

``` json
{"productId":1,"quantity":2}
```

A list of items can be represented as:

``` json
[
  {
    "productId": 1,
    "quantity": 2
  },
  {
    "productId": 2,
    "quantity": 1
  }
]
```

A JSON string and a JavaScript object may visually resemble each other,
but they are not the same runtime value.

> **Tip** Do not distinguish JavaScript objects and JSON strings only by
> appearance. Ask what type of value JavaScript is currently holding.

------------------------------------------------------------------------

## 5. What `JSON.stringify()` Does

`JSON.stringify()` converts a JavaScript value into a JSON string.

Start with:

``` ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
];
```

Then:

``` ts
const jsonCart = JSON.stringify(cart);
```

Conceptually:

``` text
JavaScript Array

[
  {
    productId: 1,
    quantity: 2
  }
]

↓ JSON.stringify()

JSON string

'[{"productId":1,"quantity":2}]'
```

The direction is:

``` text
Array / Object
↓
JSON.stringify()
↓
string
```

> **Tip** `JSON.stringify()` is not a `localStorage` function. It is a
> JSON conversion function that happens to be useful here because
> `localStorage` needs strings.

------------------------------------------------------------------------

## 6. Checking the Difference with `typeof`

Consider:

``` ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
];

const jsonCart = JSON.stringify(cart);

console.log(typeof cart);
console.log(typeof jsonCart);
```

Conceptually:

``` text
cart
→ object

jsonCart
→ string
```

So these two values are fundamentally different even though their
printed forms may look similar.

> **Tip** When JSON behavior becomes confusing, inspect the current
> value with `console.log()` and `typeof`.

------------------------------------------------------------------------

## 7. Saving the Cart

Now this code becomes easier to read:

``` ts
localStorage.setItem(
  "cart",
  JSON.stringify(cart)
);
```

Its complete data flow is:

``` text
cart
↓
CartItem[]
↓
JSON.stringify(cart)
↓
JSON string
↓
localStorage.setItem()
↓
browser storage
```

For example, a cart containing:

``` ts
[
  {
    productId: 1,
    quantity: 2,
  },
]
```

may be stored conceptually as:

``` text
'[{"productId":1,"quantity":2}]'
```

> **Tip** When reading persistence code, trace the value before it
> reaches `setItem()`. This makes the purpose of serialization obvious.

------------------------------------------------------------------------

## 8. Reading with `localStorage.getItem()`

To retrieve the cart:

``` ts
const savedCart = localStorage.getItem("cart");
```

`savedCart` is not automatically a `CartItem[]`.

If the key exists, the returned value is a string. If the key does not
exist, the result is `null`.

``` text
localStorage.getItem("cart")

├─ stored value exists → string
└─ no stored value     → null
```

For example:

``` text
localStorage

'[{"productId":1,"quantity":2}]'

↓ getItem("cart")

savedCart

'[{"productId":1,"quantity":2}]'
```

> **Tip** After `getItem()`, think "I retrieved the stored text," not "I
> retrieved my JavaScript array."

------------------------------------------------------------------------

## 9. Why `JSON.parse()` Is Needed

Suppose `savedCart` contains:

``` text
'[{"productId":1,"quantity":2}]'
```

This is still a string.

But we want to perform JavaScript array operations such as:

``` ts
cart.push(cartItem);
```

Therefore, we convert the JSON string back into a JavaScript value:

``` ts
JSON.parse(savedCart);
```

Conceptually:

``` text
JSON string

'[{"productId":1,"quantity":2}]'

↓ JSON.parse()

JavaScript Array

[
  {
    productId: 1,
    quantity: 2
  }
]
```

The direction is:

``` text
string
↓
JSON.parse()
↓
Array / Object
```

> **Tip** Think of `parse` as reading the structured meaning encoded in
> JSON text and recreating a JavaScript value from it.

------------------------------------------------------------------------

## 10. `stringify` and `parse` Are Opposite Directions

  Operation            Direction                        Day 3 use
  -------------------- -------------------------------- ---------------
  `JSON.stringify()`   JavaScript value → JSON string   Before saving
  `JSON.parse()`       JSON string → JavaScript value   After reading

The complete round trip is:

``` text
JavaScript
CartItem[]
    │
    │ JSON.stringify()
    ▼
JSON string
    │
    │ localStorage.setItem()
    ▼
localStorage


localStorage
    │
    │ localStorage.getItem()
    ▼
string
    │
    │ JSON.parse()
    ▼
CartItem[]
JavaScript
```

> **Tip** Memorize the direction of the data, not just the names of the
> functions.

------------------------------------------------------------------------

## 11. Reading `handleAddToCart` Step by Step

Our basic implementation is:

``` ts
const handleAddToCart = () => {
  const cartItem: CartItem = {
    productId,
    quantity,
  };

  const savedCart = localStorage.getItem("cart");

  const cart: CartItem[] = savedCart
    ? JSON.parse(savedCart)
    : [];

  cart.push(cartItem);

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
};
```

### 11.1 Create the new cart item

``` ts
const cartItem: CartItem = {
  productId,
  quantity,
};
```

For example:

``` ts
{
  productId: 1,
  quantity: 2
}
```

### 11.2 Read previously stored data

``` ts
const savedCart = localStorage.getItem("cart");
```

Think of the result as:

``` text
string | null
```

### 11.3 Restore the array or start empty

``` ts
const cart: CartItem[] = savedCart
  ? JSON.parse(savedCart)
  : [];
```

Meaning:

``` text
Does savedCart exist?
├─ Yes → JSON.parse(savedCart)
└─ No  → []
```

### 11.4 Add the new item

``` ts
cart.push(cartItem);
```

### 11.5 Serialize and save the updated array

``` ts
localStorage.setItem(
  "cart",
  JSON.stringify(cart)
);
```

> **Tip** Read the function as a process: create → read → parse → modify
> → stringify → save.

------------------------------------------------------------------------

## 12. What Happens for a Brand-New Cart

A new visitor may not have a `"cart"` key yet.

Then:

``` ts
localStorage.getItem("cart");
```

returns `null`.

Our conditional creates an empty array:

``` ts
const cart: CartItem[] = savedCart
  ? JSON.parse(savedCart)
  : [];
```

The flow becomes:

``` text
savedCart = null
↓
[]
↓
cart.push(cartItem)
↓
[{ productId: 1, quantity: 2 }]
↓
JSON.stringify()
↓
save
```

> **Tip** Empty states exist in stored data as well as UI. Always
> consider what the application should do before any data has been
> saved.

------------------------------------------------------------------------

## 13. Adding Another Item Later

Assume this is already stored:

``` json
[
  {
    "productId": 1,
    "quantity": 2
  }
]
```

We add product 2 with quantity 1.

First:

``` ts
const savedCart = localStorage.getItem("cart");
```

Then:

``` ts
const cart = JSON.parse(savedCart);
```

Conceptually restores:

``` ts
[
  {
    productId: 1,
    quantity: 2,
  },
]
```

Then:

``` ts
cart.push({
  productId: 2,
  quantity: 1,
});
```

produces:

``` ts
[
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 2,
    quantity: 1,
  },
]
```

Finally the updated array is stringified and saved again.

> **Tip** We are not editing the internal `localStorage` string
> directly. We read it, reconstruct JavaScript data, modify that data,
> serialize it again, and overwrite the stored value.

------------------------------------------------------------------------

## 14. Common Misunderstandings

### `JSON.stringify()` does not save anything by itself

``` ts
JSON.stringify(cart);
```

only performs conversion.

Actual storage is performed by:

``` ts
localStorage.setItem("cart", JSON.stringify(cart));
```

### `JSON.parse()` does not read from `localStorage`

``` ts
JSON.parse(savedCart);
```

only converts an already available JSON string.

Retrieval is performed by:

``` ts
localStorage.getItem("cart");
```

> **Tip** Separate responsibilities: `getItem/setItem` handle storage
> I/O, while `parse/stringify` handle data conversion.

------------------------------------------------------------------------

## 15. Final Day 3 Pattern

``` text
SAVE

JavaScript Object / Array
↓
JSON.stringify()
↓
string
↓
localStorage.setItem()


READ

localStorage.getItem()
↓
string | null
↓
check whether data exists
↓
JSON.parse()
↓
JavaScript Object / Array
```

In one sentence:

``` text
JSON.stringify()
= convert JavaScript data into a JSON string suitable for storage

JSON.parse()
= convert a JSON string back into JavaScript data
```

> **Tip** On the `/cart` page, the direction will mainly be
> `getItem → parse → render`. Compare that directly with the add-to-cart
> storage flow.

------------------------------------------------------------------------

# 한국어

## 1. 왜 지금 `JSON.stringify()`와 `JSON.parse()`를 배우는가

Day 3에서는 쇼핑몰의 장바구니 기능을 만들고 있다.

현재 우리가 만든 흐름은 다음과 같다.

``` text
상품 상세
↓
수량 선택
↓
장바구니 담기 클릭
↓
CartItem 생성
↓
localStorage 저장
```

현재 `CartItem` 타입은 다음과 같다.

``` ts
export type CartItem = {
  productId: number;
  quantity: number;
};
```

예를 들어 1번 상품을 2개 담으면 JavaScript에서는 다음처럼 표현할 수
있다.

``` ts
const cartItem: CartItem = {
  productId: 1,
  quantity: 2,
};
```

여러 상품을 담는 장바구니는 배열로 표현할 수 있다.

``` ts
const cart: CartItem[] = [
  {
    productId: 1,
    quantity: 2,
  },
];
```

여기서 중요한 문제가 생긴다.

`cart`는 JavaScript의 배열인데 `localStorage`는 기본적으로 문자열 형태의
값을 저장한다.

따라서 저장하기 전에 변환 과정이 필요하다.

``` text
JavaScript 배열 / 객체
↓
JSON.stringify()
↓
문자열
↓
localStorage
```

반대로 저장된 값을 읽을 때는:

``` text
localStorage
↓
문자열
↓
JSON.parse()
↓
JavaScript 배열 / 객체
```

가 된다.

> **팁** `JSON.stringify()`와 `JSON.parse()`를 각각 따로 외우기보다
> `저장 → 문자열화`, `읽기 → JavaScript 데이터로 복원`이라는 왕복
> 과정으로 이해한다.

------------------------------------------------------------------------

## 2. 변환하기 전의 `cart`부터 이해하기

다음 코드가 있다고 하자.

``` ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
];
```

이 값은 문자열이 아니다.

구조를 펼쳐보면:

``` text
cart
│
└─ Array
   │
   └─ Object
      ├─ productId → number
      └─ quantity  → number
```

즉 JavaScript 배열 안에 JavaScript 객체가 들어있는 상태다.

배열이기 때문에 다음처럼 `push()`를 사용할 수 있다.

``` ts
cart.push({
  productId: 2,
  quantity: 1,
});
```

그러면:

``` ts
[
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 2,
    quantity: 1,
  },
]
```

가 된다.

또한:

``` ts
cart[0].quantity;
```

처럼 내부 값에도 접근할 수 있다.

> **팁** JSON을 공부할 때 먼저 `현재 데이터가 무엇인가?`를 확인한다.
> 지금 `cart`는 JSON 문자열이 아니라 실제 JavaScript 배열이다.

------------------------------------------------------------------------

## 3. `localStorage`에는 무엇을 저장하는가

`localStorage`에는 다음처럼 값을 저장한다.

``` ts
localStorage.setItem("cart", "hello");
```

기본적인 형태는:

``` ts
localStorage.setItem(key, value);
```

라고 볼 수 있다.

우리 장바구니에서는:

``` text
key
↓
"cart"

value
↓
장바구니 데이터
```

가 된다.

그런데 우리가 가진 데이터는:

``` ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
];
```

처럼 배열이다.

이 배열 구조를 보존하면서 문자열로 표현하기 위해 JSON 형식을 이용한다.

> **팁** 현재 단계에서는 `localStorage`를 복잡한 DB처럼 생각하지 말고
> `브라우저에 문자열 데이터를 보관할 수 있는 저장 공간`이라고 이해하면
> 충분하다.

------------------------------------------------------------------------

## 4. JSON이란 무엇인가

JSON은 **JavaScript Object Notation**의 약자다.

객체나 배열처럼 구조가 있는 데이터를 텍스트 형태로 표현할 수 있는
형식이다.

JavaScript에서는:

``` ts
const item = {
  productId: 1,
  quantity: 2,
};
```

라고 표현하던 데이터를 JSON 형태로는 다음과 같이 표현할 수 있다.

``` json
{"productId":1,"quantity":2}
```

여러 상품이라면:

``` json
[
  {
    "productId": 1,
    "quantity": 2
  },
  {
    "productId": 2,
    "quantity": 1
  }
]
```

처럼 표현할 수 있다.

여기서 매우 중요한 점은 **JavaScript 객체와 JSON 문자열은 생김새가
비슷해도 같은 것이 아니라는 것**이다.

> **팁** `{ productId: 1 }`과 `'{"productId":1}'`을 눈으로만 구별하려
> 하지 말고, 현재 JavaScript에서 `object`인지 `string`인지 생각한다.

------------------------------------------------------------------------

## 5. `JSON.stringify()`란 무엇인가

`JSON.stringify()`는 JavaScript 값을 JSON 문자열로 변환한다.

예를 들어:

``` ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
];
```

가 있다고 하자.

여기에:

``` ts
const jsonCart = JSON.stringify(cart);
```

를 실행한다.

개념적으로는:

``` text
JavaScript Array

[
  {
    productId: 1,
    quantity: 2
  }
]

↓ JSON.stringify()

JSON string

'[{"productId":1,"quantity":2}]'
```

로 바뀐다.

즉 방향은:

``` text
Array / Object
↓
JSON.stringify()
↓
string
```

이다.

`stringify`라는 이름도 `문자열화한다` 정도로 생각하면 이해하기 쉽다.

> **팁** `JSON.stringify()`를 `localStorage` 전용 함수라고 외우면 안
> 된다. JavaScript 데이터를 JSON 문자열로 변환하는 기능이고, 지금은
> `localStorage`에 문자열을 저장하기 위해 사용하는 것이다.

------------------------------------------------------------------------

## 6. `typeof`로 실제 차이 확인하기

다음 코드를 실행해보자.

``` ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
];

const jsonCart = JSON.stringify(cart);

console.log(typeof cart);
console.log(typeof jsonCart);
```

개념적으로 결과는:

``` text
cart
→ object

jsonCart
→ string
```

이다.

즉:

``` ts
cart
```

와:

``` ts
JSON.stringify(cart)
```

는 콘솔에서 비슷하게 보일 수 있어도 실제로는 다른 종류의 값이다.

> **팁** JSON을 다루다가 헷갈리면 `console.log()`와 `typeof`를 사용해서
> 지금 가지고 있는 값이 실제로 무엇인지 확인한다.

------------------------------------------------------------------------

## 7. `localStorage`에 카트를 저장하는 과정

이제 다음 코드의 의미를 정확히 이해할 수 있다.

``` ts
localStorage.setItem(
  "cart",
  JSON.stringify(cart)
);
```

이 코드는 한 번에 보지 말고 다음처럼 나눠서 생각한다.

``` text
cart
↓
CartItem[]
↓
JSON.stringify(cart)
↓
JSON 문자열
↓
localStorage.setItem()
↓
브라우저에 저장
```

예를 들어:

``` ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
];
```

라면 저장되는 값은 개념적으로:

``` text
'[{"productId":1,"quantity":2}]'
```

와 같은 문자열이다.

> **팁** 저장 코드를 볼 때 `setItem()`만 보지 말고 `setItem()` 안으로
> 어떤 형태의 값이 들어가는지 역으로 추적해본다.

------------------------------------------------------------------------

## 8. `localStorage.getItem()`으로 다시 읽기

저장했던 장바구니를 읽으려면:

``` ts
const savedCart = localStorage.getItem("cart");
```

를 사용한다.

중요한 점은 이 순간 `savedCart`가 바로 `CartItem[]`이 되는 것이 아니라는
것이다.

저장된 값이 있다면 문자열을 가져온다.

``` text
localStorage

'[{"productId":1,"quantity":2}]'

↓ getItem("cart")

savedCart

'[{"productId":1,"quantity":2}]'
```

그리고 `"cart"`라는 키 자체가 아직 존재하지 않는다면 `null`이 나온다.

따라서:

``` text
localStorage.getItem("cart")

├─ 저장된 값 있음 → string
└─ 저장된 값 없음 → null
```

이라고 이해하면 된다.

> **팁** `getItem()`을 사용한 직후에는 `배열을 가져왔다`고 생각하지 말고
> `저장되어 있던 문자열을 가져왔다`고 생각한다.

------------------------------------------------------------------------

## 9. 그래서 `JSON.parse()`가 필요하다

`getItem()`으로 가져온 값은 문자열이다.

예를 들어:

``` text
'[{"productId":1,"quantity":2}]'
```

라고 하자.

그런데 장바구니에서는 앞으로:

``` ts
cart.push(cartItem);
```

같은 배열 기능을 사용해야 한다.

문자열에는 우리가 원하는 방식으로 배열의 `push()`를 사용할 수 없다.

따라서 JSON 문자열을 다시 JavaScript 배열로 복원해야 한다.

그 역할을 하는 것이:

``` ts
JSON.parse(savedCart);
```

이다.

흐름은:

``` text
JSON string

'[{"productId":1,"quantity":2}]'

↓ JSON.parse()

JavaScript Array

[
  {
    productId: 1,
    quantity: 2
  }
]
```

가 된다.

즉:

``` text
string
↓
JSON.parse()
↓
Array / Object
```

방향이다.

> **팁** `parse`는
> `JSON 형식으로 작성된 문자열을 읽어서 JavaScript가 사용할 수 있는 값으로 해석한다`라고
> 이해하면 된다.

------------------------------------------------------------------------

## 10. `stringify`와 `parse`는 서로 반대 방향이다

둘의 관계를 표로 정리하면 다음과 같다.

  -----------------------------------------------------------------------
  기능                    변환 방향               Day 3에서 사용하는 순간
  ----------------------- ----------------------- -----------------------
  `JSON.stringify()`      JavaScript 값 → JSON    `localStorage`에
                          문자열                  저장하기 전

  `JSON.parse()`          JSON 문자열 →           `localStorage`에서
                          JavaScript 값           읽어온 후
  -----------------------------------------------------------------------

전체 왕복 흐름은:

``` text
JavaScript
CartItem[]
    │
    │ JSON.stringify()
    ▼
JSON string
    │
    │ localStorage.setItem()
    ▼
localStorage


localStorage
    │
    │ localStorage.getItem()
    ▼
string
    │
    │ JSON.parse()
    ▼
CartItem[]
JavaScript
```

이다.

> **팁** `stringify = 저장`, `parse = 읽기`라고만 외우기보다 데이터가
> 어느 방향으로 변환되는지 그림으로 기억한다.

------------------------------------------------------------------------

## 11. 현재 `handleAddToCart`를 한 줄씩 해석하기

현재 기본 코드는:

``` ts
const handleAddToCart = () => {
  const cartItem: CartItem = {
    productId,
    quantity,
  };

  const savedCart = localStorage.getItem("cart");

  const cart: CartItem[] = savedCart
    ? JSON.parse(savedCart)
    : [];

  cart.push(cartItem);

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
};
```

이다.

### 11.1 새로운 `CartItem` 생성

``` ts
const cartItem: CartItem = {
  productId,
  quantity,
};
```

예를 들어 현재 상품이 1번이고 수량이 2라면:

``` ts
{
  productId: 1,
  quantity: 2
}
```

가 만들어진다.

### 11.2 기존 장바구니 읽기

``` ts
const savedCart = localStorage.getItem("cart");
```

여기서는:

``` text
string | null
```

이 올 수 있다고 생각한다.

### 11.3 저장된 데이터가 있으면 배열로 복원

``` ts
const cart: CartItem[] = savedCart
  ? JSON.parse(savedCart)
  : [];
```

이를 말로 풀면:

``` text
savedCart가 있는가?

├─ Yes
│  ↓
│  JSON.parse(savedCart)
│  ↓
│  기존 장바구니 배열
│
└─ No
   ↓
   []
```

이다.

### 11.4 새 상품을 배열에 추가

``` ts
cart.push(cartItem);
```

기존:

``` ts
[
  {
    productId: 1,
    quantity: 2,
  },
]
```

에:

``` ts
{
  productId: 2,
  quantity: 1,
}
```

을 추가하면:

``` ts
[
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 2,
    quantity: 1,
  },
]
```

이 된다.

### 11.5 변경된 배열을 다시 저장

``` ts
localStorage.setItem(
  "cart",
  JSON.stringify(cart)
);
```

다시:

``` text
CartItem[]
↓
JSON.stringify()
↓
string
↓
localStorage
```

과정을 거친다.

> **팁** `handleAddToCart` 전체를 코드 덩어리로 외우지 말고
> `생성 → 읽기 → parse → 수정 → stringify → 저장`이라는 처리 순서로
> 기억한다.

------------------------------------------------------------------------

## 12. 처음 장바구니를 사용하는 경우

사용자가 처음 사이트에 들어왔다면 `localStorage`에 `"cart"`가 없을 수
있다.

그러면:

``` ts
localStorage.getItem("cart");
```

의 결과는:

``` ts
null
```

이다.

그래서:

``` ts
const cart: CartItem[] = savedCart
  ? JSON.parse(savedCart)
  : [];
```

에서 빈 배열을 만든다.

전체 흐름은:

``` text
savedCart = null
↓
[]
↓
cart.push(cartItem)
↓
[
  {
    productId: 1,
    quantity: 2
  }
]
↓
JSON.stringify()
↓
localStorage 저장
```

이다.

> **팁** Empty State는 화면에서만 필요한 개념이 아니다. 저장
> 데이터에서도 `아직 아무것도 저장되지 않은 상태`를 반드시 생각해야
> 한다.

------------------------------------------------------------------------

## 13. 두 번째 상품을 추가하면 어떻게 되는가

이미 다음 데이터가 저장되어 있다고 하자.

``` json
[
  {
    "productId": 1,
    "quantity": 2
  }
]
```

이 상태에서 2번 상품 1개를 추가한다.

먼저:

``` ts
const savedCart = localStorage.getItem("cart");
```

로 문자열을 가져온다.

그리고:

``` ts
JSON.parse(savedCart);
```

를 하면 JavaScript 배열:

``` ts
[
  {
    productId: 1,
    quantity: 2,
  },
]
```

로 돌아온다.

그다음:

``` ts
cart.push({
  productId: 2,
  quantity: 1,
});
```

하면:

``` ts
[
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 2,
    quantity: 1,
  },
]
```

이 된다.

그리고 다시:

``` ts
JSON.stringify(cart);
```

해서 문자열로 만든 뒤 저장한다.

> **팁** `localStorage` 안에 들어있는 문자열을 직접 수정하는 것이
> 아니다.
> `읽기 → JavaScript 데이터로 복원 → 수정 → 다시 문자열화 → 저장` 순서로
> 처리한다.

------------------------------------------------------------------------

## 14. 자주 헷갈리는 부분

### `JSON.stringify()`가 저장까지 해주는 것은 아니다

``` ts
JSON.stringify(cart);
```

는 변환만 한다.

실제로 저장하는 것은:

``` ts
localStorage.setItem(
  "cart",
  JSON.stringify(cart)
);
```

에서 `setItem()`이다.

### `JSON.parse()`가 localStorage에서 읽어오는 것도 아니다

``` ts
JSON.parse(savedCart);
```

는 이미 가지고 있는 JSON 문자열을 JavaScript 값으로 변환할 뿐이다.

실제로 `localStorage`에서 가져오는 것은:

``` ts
localStorage.getItem("cart");
```

이다.

따라서 책임을 나누면:

``` text
localStorage.getItem()
→ 저장소에서 가져오기

JSON.parse()
→ 문자열을 JavaScript 데이터로 변환

JSON.stringify()
→ JavaScript 데이터를 문자열로 변환

localStorage.setItem()
→ 저장소에 저장
```

이다.

> **팁** 함수 이름을 외우는 것보다 각 함수가 담당하는 책임을 분리해서
> 설명할 수 있어야 한다.

------------------------------------------------------------------------

## 15. Day 3에서 최종적으로 기억할 패턴

### 저장할 때

``` text
JavaScript Object / Array
↓
JSON.stringify()
↓
string
↓
localStorage.setItem()
```

### 읽을 때

``` text
localStorage.getItem()
↓
string | null
↓
데이터 존재 여부 확인
↓
JSON.parse()
↓
JavaScript Object / Array
```

한 문장으로 정리하면:

``` text
JSON.stringify()
= JavaScript 데이터를 저장하기 좋은 JSON 문자열로 바꾼다.

JSON.parse()
= JSON 문자열을 JavaScript에서 다시 사용할 수 있는 데이터로 되돌린다.
```

그리고 현재 장바구니의 전체 흐름으로 연결하면:

``` text
productId + quantity
↓
CartItem
↓
기존 cart 읽기
↓
JSON.parse()
↓
CartItem[]
↓
push()
↓
JSON.stringify()
↓
localStorage 저장
↓
나중에 /cart에서 다시 getItem()
↓
JSON.parse()
↓
상품 화면 출력
```

이 흐름을 이해하는 것이 Day 3의 핵심이다.

> **팁** 다음 `/cart` 구현에서는 이번과 반대로
> `getItem → parse → 데이터 사용 → 화면 출력`을 직접 경험하게 된다. 저장
> 코드와 읽기 코드를 서로 비교하면서 진행하면 `localStorage`와 JSON의
> 관계가 확실하게 정리된다.
