# Day 5 Theory Notes --- Next.js `Link`, HTML `<a>`, and `<button>`

------------------------------------------------------------------------

# 日本語

## 1. 今回のテーマ

今回は、Web ページでクリックできる UI
を作るときに、次の三つをどう使い分けるかを整理する。

``` tsx
<Link>
<a>
<button>
```

見た目だけでは三つとも「クリックできるもの」に見えるが、役割は同じではない。

最も重要な考え方は次の通り。

``` text
Link / a
→ 目的地へ移動するためのもの

button
→ 何らかの動作を実行するためのもの
```

そして Next.js では、移動の中でもさらに、

``` text
Next.js アプリ内部への移動
→ Link

外部 URL や一般的な anchor の機能
→ a
```

と考えることができる。

> **Tip**
>
> 見た目がボタンの形か、青い文字かで決めない。「クリックしたユーザーが何をしようとしているのか」で要素を選ぶ。

------------------------------------------------------------------------

## 2. 最初の判断基準

まず次のように考えると分かりやすい。

``` text
ユーザーがクリック
        ↓
目的は「移動」か？
   ┌────┴────┐
  YES       NO
   ↓         ↓
リンク系    button
   ↓
Next.js アプリ内部か？
 ┌────┴────┐
YES       NO
 ↓         ↓
Link       a
```

ただし、これだけでは説明できないケースがある。

たとえば、

``` text
ログインボタンをクリック
↓
ログイン処理
↓
成功
↓
/mypage へ移動
```

のように、最終的にはページが移動する場合である。

このケースでは「移動」がクリックの本来の目的ではない。

``` text
ログイン処理
```

が本来の動作であり、ページ移動は成功した結果として発生する。

そのため `button` が適切になる。

> **Tip**
>
> 最終的に URL
> が変わるかどうかだけで判断しない。「移動そのものが目的か」「処理を実行した結果として移動するのか」を区別する。

------------------------------------------------------------------------

# 3. Next.js の `Link` を使う状況

Next.js の `Link` は、Next.js
アプリ内部のページをユーザーが移動するときに使う。

例としてショッピングモールが次の Route を持っているとする。

``` text
/
├─ /products
├─ /products/1
├─ /cart
├─ /checkout
└─ /mypage
```

これらのページ間を移動する場合、基本的には `Link` を考える。

### 商品一覧から商品詳細へ

``` tsx
<Link href="/products/1">
  商品を見る
</Link>
```

### カートへ移動

``` tsx
<Link href="/cart">
  カートを見る
</Link>
```

### カートから注文ページへ

``` tsx
<Link href="/checkout">
  注文する
</Link>
```

この三つに共通するのは、

``` text
クリック
↓
別のページを見る
```

という **ナビゲーションそのものが目的** であること。

> **Tip**
>
> Next.js を学んでいる段階では「自分の Next.js
> アプリ内の別ページを見に行く → まず `Link`
> を考える」と覚えると判断しやすい。

------------------------------------------------------------------------

## 4. `Link` には import が必要

`Link` は HTML の標準タグではなく、Next.js
が提供するコンポーネントである。

そのため、

``` tsx
import Link from "next/link";
```

が必要になる。

そして、

``` tsx
<Link href="/checkout">
  注文する
</Link>
```

のように使用する。

ここで、

``` tsx
href="/checkout"
```

は移動先を表している。

> **Tip**
>
> `Link is not defined` のようなエラーが出た場合は、まず `next/link`
> から import しているか確認する。

------------------------------------------------------------------------

# 5. HTML の `<a>` を使う状況

`<a>` は HTML の基本的なリンク要素である。

``` html
<a href="...">
  ...
</a>
```

`a` は anchor を意味し、`href` に移動先を指定する。

たとえば外部サイトへ移動する場合。

``` html
<a href="https://example.com">
  外部サイト
</a>
```

ショッピングモールから、

``` text
メーカー公式サイト
外部ブログ
外部ドキュメント
GitHub
外部カスタマーサポート
```

などへ移動するなら、通常の anchor が自然である。

``` text
自分の Next.js アプリ
        ↓
      外部へ
        ↓
別の Web サイト
```

> **Tip**
>
> 最初の判断基準として「Next.js 内部 Route → Link」「外部 URL →
> a」を使うと整理しやすい。

------------------------------------------------------------------------

# 6. `<a>` 固有の用途

`a` は単純な Web ページへのリンク以外にも使われる。

### メール

``` html
<a href="mailto:help@example.com">
  メールで問い合わせ
</a>
```

### 電話

``` html
<a href="tel:01012345678">
  電話する
</a>
```

### ファイル

``` html
<a href="/manual.pdf" download>
  マニュアルを保存
</a>
```

このように HTML anchor が持つリンク機能を利用したい場合にも `<a>`
を使う。

> **Tip**
>
> `a` を「外部サイト専用」とだけ暗記しない。より本質的には HTML の
> anchor/link 要素である。

------------------------------------------------------------------------

# 7. `Link` と `<a>` はどちらもリンク系

ここが重要である。

`Link` と `a` と `button`
を完全に同じレベルの三択として考えると混乱しやすい。

まず大きく二つに分ける。

``` text
クリックできる UI
       │
 ┌─────┴─────┐
 ↓           ↓
移動         動作
 ↓           ↓
リンク系     button
```

そしてリンク系の中で、

``` text
リンク系
  │
  ├─ HTML anchor → <a>
  │
  └─ Next.js 内部ナビゲーション → <Link>
```

と考える。

つまり、

``` text
Link と a
→ 移動を表現する仲間

button
→ 動作を表現する別の仲間
```

という整理が分かりやすい。

> **Tip**
>
> 最初に `Link vs a`
> を考えるのではなく、「これはリンクなのか、それとも動作なのか？」を先に判断する。

------------------------------------------------------------------------

# 8. `<button>` の基本的な役割

`button`
は、ユーザーがクリックしたときに何らかの動作を実行するために使う。

``` tsx
<button>
  実行
</button>
```

ショッピングモールでは、たとえば次のようなケースがある。

### 数量を増やす

``` tsx
<button onClick={handleIncrease}>
  +
</button>
```

### 数量を減らす

``` tsx
<button onClick={handleDecrease}>
  -
</button>
```

### 商品を削除する

``` tsx
<button onClick={handleRemove}>
  削除
</button>
```

これらはクリックしても「別のページを見ること」が目的ではない。

``` text
現在のページ
↓
ユーザーがクリック
↓
何らかのロジックを実行
```

という構造である。

> **Tip**
>
> `button`
> を見たら「クリックすると、どの処理を実行するのか？」と考える。

------------------------------------------------------------------------

# 9. 見た目がボタンでも `Link` の場合がある

画面上に、

``` text
┌────────────────┐
│     注文する    │
└────────────────┘
```

と表示されていると、見た目だけで `<button>` を使いたくなる。

しかし現在の Day 5 では、

``` text
/cart
↓
注文する
↓
/checkout
```

と単純に注文ページへ移動するだけである。

この場合の目的はナビゲーションなので、

``` tsx
<Link href="/checkout">
  注文する
</Link>
```

が自然である。

CSS を使えば `Link` を大きなボタンのように見せることもできる。

つまり、

``` text
見た目
≠
HTML / React 上の意味
```

である。

> **Tip**
>
> 「ボタンの形だから
> button」という判断をしない。セマンティックな役割を先に決め、見た目は
> CSS で後から作る。

------------------------------------------------------------------------

# 10. 移動するのに `button` を使う場合はあるのか

ある。

ただし重要なのは、

``` text
移動そのものが目的
```

なのか、

``` text
何らかの処理を実行
↓
その結果として移動
```

なのかという違いである。

------------------------------------------------------------------------

## 11. ケース A --- 移動そのものが目的

たとえば、

``` text
[カートを見る]
↓
/cart
```

なら、ユーザーは単純にカートページを見たい。

``` tsx
<Link href="/cart">
  カートを見る
</Link>
```

が自然である。

同様に、

``` text
[注文ページへ]
↓
/checkout
```

も、

``` tsx
<Link href="/checkout">
  注文する
</Link>
```

となる。

> **Tip**
>
> クリックした瞬間に説明が「○○ページへ行く」で終わるなら、リンクである可能性が高い。

------------------------------------------------------------------------

# 12. ケース B --- 動作の結果として移動

ログインを考える。

``` text
メールアドレス入力
↓
パスワード入力
↓
[ログイン]
↓
認証処理
↓
成功
↓
/mypage
```

ここでユーザーの主目的は、

``` text
/mypage を見る
```

だけではない。

まず、

``` text
ログインする
```

という処理を要求している。

したがって、

``` tsx
<button type="submit">
  ログイン
</button>
```

が自然である。

そしてログイン処理が成功した後、コードによって `/mypage`
へ移動することができる。

``` text
button
↓
ログイン処理
↓
成功
↓
ページ移動
```

> **Tip**
>
> 「処理が成功したら移動」という文章になる場合、最初のクリックは button
> の役割である可能性が高い。

------------------------------------------------------------------------

# 13. Checkout の最終注文も同じ

現在の `/cart` にある「注文する」は、

``` text
/cart
↓
/checkout
```

という移動なので `Link`。

しかし将来 `/checkout` で、

``` text
名前
連絡先
住所

[最終注文]
```

を作ったとする。

最終注文では、

``` text
クリック
↓
入力値チェック
↓
注文処理
↓
サーバーに注文を作成
↓
成功
↓
/order-complete
```

という処理になる可能性がある。

この場合は、

``` tsx
<button type="submit">
  最終注文
</button>
```

が自然である。

ページ移動は注文成功後の結果であり、クリックの中心的な意味は「注文処理を実行する」ことだからである。

> **Tip**
>
> 同じ「注文」という文字でも役割は違う。ラベルではなく実際の処理内容を見る。

------------------------------------------------------------------------

# 14. ログインページでも Link と button が同時に使われる

ログインページを例にすると違いが明確になる。

### 会員登録ページへ移動

``` tsx
<Link href="/signup">
  会員登録
</Link>
```

意味：

``` text
/signup を見る
```

### ログイン処理

``` tsx
<button type="submit">
  ログイン
</button>
```

意味：

``` text
入力した情報でログイン処理を実行
```

ログイン成功後に `/mypage` へ移動したとしても、ログインボタン自体は
`button` のままである。

> **Tip**
>
> 同じ画面の中に `Link` と `button`
> が一緒に存在するのは普通である。それぞれの役割が違うからである。

------------------------------------------------------------------------

# 15. 削除後にページ移動する場合

次のような処理を考える。

``` text
[商品を削除]
↓
サーバーから商品を削除
↓
削除成功
↓
/products へ移動
```

最終的に `/products` へ移動するからといって、

``` tsx
<Link href="/products">
  商品を削除
</Link>
```

とはしない。

本来の目的は「削除」だから、

``` tsx
<button onClick={handleDelete}>
  商品を削除
</button>
```

のような button が適切である。

そして削除成功後にページを移動する。

> **Tip**
>
> 「最終的にどの URL
> になったか」ではなく「ユーザーがクリックによって何を要求したか」を見る。

------------------------------------------------------------------------

# 16. 実践的な判断フロー

迷ったときは次の順序で考える。

``` text
① クリックの目的は移動か？
        │
   ┌────┴────┐
  YES       NO
   ↓         ↓
リンク系    button
   ↓
② Next.js アプリ内部か？
   │
 ┌─┴─┐
YES  NO
 ↓    ↓
Link  a
```

ただし次のパターンでは button を考える。

``` text
クリック
↓
ログイン / 保存 / 削除 / 注文 / 送信
↓
処理成功
↓
ページ移動
```

> **Tip**
>
> 判断に迷ったら「この UI
> の目的を一つの動詞で言うと何か？」と考える。「移動する」ならリンク、「保存する・削除する・送信する」なら
> button の可能性が高い。

------------------------------------------------------------------------

# 17. ショッピングモールでの整理

  --------------------------------------------------------------------------
  状況                       選択                    理由
  -------------------------- ----------------------- -----------------------
  商品詳細へ移動             `Link`                  Next.js
                                                     内部ナビゲーション

  カートへ移動               `Link`                  Next.js
                                                     内部ナビゲーション

  `/cart → /checkout`        `Link`                  移動そのものが目的

  外部メーカーサイト         `a`                     外部リンク

  メール問い合わせ           `a`                     anchor のリンク機能

  数量 `+ / -`               `button`                state / 数量変更

  カート商品削除             `button`                削除動作

  注文フォーム送信           `button`                注文処理

  注文成功後に完了ページへ   button の処理後に移動   移動は処理成功の結果
  --------------------------------------------------------------------------

> **Tip**
>
> この表を丸暗記するより、それぞれについて「移動なのか、動作なのか」を自分で説明できることが重要。

------------------------------------------------------------------------

# 18. 最終的な核心

最も重要な一文は次の通り。

> **`Link` / `a` は目的地を表し、`button` は動作を表す。**

さらにリンクを分けると、

``` text
Next.js アプリ内部ナビゲーション
→ Link

外部 URL / HTML anchor の一般的な用途
→ a
```

そして、

``` text
何らかの処理
↓
成功
↓
ページ移動
```

なら、最終的に移動するとしても `button` を使うことがある。

> **Tip**
>
> HTML 要素はデザインではなく意味で選ぶ。デザインは CSS、意味は
> `Link`・`a`・`button` の選択で表現する。

------------------------------------------------------------------------

# English

## 1. Topic

This note explains how to choose between:

``` tsx
<Link>
<a>
<button>
```

All three may appear clickable in the UI, but they do not have the same
semantic role.

The most important distinction is:

``` text
Link / a
→ represent a destination or navigation

button
→ represents an action
```

In a Next.js application, navigation can then be divided further:

``` text
navigation inside the Next.js app
→ Link

external URL or general anchor behavior
→ a
```

> **Tip**
>
> Do not choose an element based on whether it visually looks like a
> button or a blue link. Choose it based on the user's intended action.

------------------------------------------------------------------------

## 2. Basic Decision Flow

A useful first decision tree is:

``` text
user clicks
    ↓
is the purpose navigation?
   ┌────┴────┐
  YES       NO
   ↓         ↓
link-like   button
   ↓
inside the Next.js app?
 ┌────┴────┐
YES       NO
 ↓         ↓
Link       a
```

There is one important complication: an action can eventually cause
navigation.

For example:

``` text
click Login
↓
perform authentication
↓
success
↓
navigate to /mypage
```

The final result includes navigation, but navigation was not the primary
action. The user requested a login operation, and the navigation
happened as a result of success.

In such a case, a `button` is appropriate.

> **Tip**
>
> Do not ask only "Does the URL eventually change?" Ask whether
> navigation itself is the goal or whether it happens after another
> operation succeeds.

------------------------------------------------------------------------

# 3. When to Use Next.js `Link`

Use Next.js `Link` for user navigation between pages within the Next.js
application.

Suppose the shop has:

``` text
/
├─ /products
├─ /products/1
├─ /cart
├─ /checkout
└─ /mypage
```

Examples include:

``` tsx
<Link href="/products/1">
  View product
</Link>
```

``` tsx
<Link href="/cart">
  View cart
</Link>
```

``` tsx
<Link href="/checkout">
  Checkout
</Link>
```

The common idea is:

``` text
click
↓
view another page
```

Navigation itself is the goal.

> **Tip**
>
> At this stage of learning Next.js, a useful default is: "Navigate to
> another page in my Next.js application → consider `Link` first."

------------------------------------------------------------------------

## 4. `Link` Requires an Import

`Link` is not a native HTML tag. It is a component provided by Next.js.

``` tsx
import Link from "next/link";
```

Then:

``` tsx
<Link href="/checkout">
  Checkout
</Link>
```

The `href` specifies the destination.

> **Tip**
>
> If you see an error such as `Link is not defined`, first check whether
> `Link` was imported from `next/link`.

------------------------------------------------------------------------

# 5. When to Use HTML `<a>`

`<a>` is the standard HTML anchor element.

``` html
<a href="...">
  ...
</a>
```

It is commonly used for external destinations.

``` html
<a href="https://example.com">
  External website
</a>
```

Examples may include:

``` text
manufacturer website
external documentation
GitHub
external blog
external support site
```

Conceptually:

``` text
your Next.js application
        ↓
      external
        ↓
another website
```

> **Tip**
>
> A practical beginner rule is: "internal Next.js route → `Link`;
> external URL → `a`."

------------------------------------------------------------------------

# 6. Other Anchor Uses

The anchor element also supports link-oriented behaviors such as:

### Email

``` html
<a href="mailto:help@example.com">
  Contact by email
</a>
```

### Telephone

``` html
<a href="tel:01012345678">
  Call
</a>
```

### File

``` html
<a href="/manual.pdf" download>
  Save manual
</a>
```

This is why it is better not to memorize `<a>` as only "the external
website element." It is fundamentally the HTML anchor/link element.

> **Tip**
>
> Think about the semantic role of the anchor, not only whether the
> destination is external.

------------------------------------------------------------------------

# 7. `Link` and `<a>` Belong to the Navigation Family

It can be confusing to treat `Link`, `a`, and `button` as three
completely equal choices.

A clearer model is:

``` text
clickable UI
    │
 ┌──┴──┐
 ↓     ↓
navigate  perform action
 ↓        ↓
link      button
```

Then navigation can be divided into:

``` text
link-like navigation
├─ HTML anchor → <a>
└─ Next.js internal navigation → <Link>
```

So:

``` text
Link and a
→ navigation / destination

button
→ action
```

> **Tip**
>
> Before asking "Link or a?", first ask "Is this navigation or an
> action?"

------------------------------------------------------------------------

# 8. The Basic Role of `<button>`

A button represents an action the user wants to perform.

Examples in a shopping cart include:

### Increase quantity

``` tsx
<button onClick={handleIncrease}>
  +
</button>
```

### Decrease quantity

``` tsx
<button onClick={handleDecrease}>
  -
</button>
```

### Remove an item

``` tsx
<button onClick={handleRemove}>
  Remove
</button>
```

These interactions are not primarily about viewing another page.

``` text
stay on current page
↓
click
↓
execute some logic
```

> **Tip**
>
> When you see a `button`, ask: "What operation should run when this is
> clicked?"

------------------------------------------------------------------------

# 9. Something Can Look Like a Button but Still Be a Link

Suppose the UI looks like:

``` text
┌────────────────┐
│    Checkout    │
└────────────────┘
```

It visually looks like a button.

But in the current Day 5 flow:

``` text
/cart
↓
Checkout
↓
/checkout
```

the purpose is simply to navigate to the checkout page.

Therefore:

``` tsx
<Link href="/checkout">
  Checkout
</Link>
```

is semantically appropriate.

CSS can make a `Link` look like a large button.

Therefore:

``` text
visual appearance
≠
semantic role
```

> **Tip**
>
> Choose semantics first and styling second. CSS controls appearance;
> the element expresses meaning and behavior.

------------------------------------------------------------------------

# 10. Can a Button Be Used Even When Navigation Happens?

Yes.

The key distinction is between:

``` text
navigation is the purpose
```

and:

``` text
perform an operation
↓
navigate as a result
```

------------------------------------------------------------------------

# 11. Case A --- Navigation Is the Purpose

For:

``` text
[View Cart]
↓
/cart
```

the user simply wants to view another page.

``` tsx
<Link href="/cart">
  View Cart
</Link>
```

Similarly:

``` tsx
<Link href="/checkout">
  Checkout
</Link>
```

is appropriate when the current task is only `/cart → /checkout`.

> **Tip**
>
> If the entire click can be described as "go to page X," it is probably
> navigation.

------------------------------------------------------------------------

# 12. Case B --- Navigation Is the Result of an Action

Consider login:

``` text
enter email
↓
enter password
↓
[Login]
↓
authenticate
↓
success
↓
/mypage
```

The primary user request is not simply "visit `/mypage`." The user wants
to perform authentication.

Therefore:

``` tsx
<button type="submit">
  Login
</button>
```

is appropriate.

After the login succeeds, application code may navigate to `/mypage`.

``` text
button
↓
login operation
↓
success
↓
navigation
```

> **Tip**
>
> If the flow is naturally described as "when the operation succeeds,
> navigate," the initial control is often a button.

------------------------------------------------------------------------

# 13. Final Checkout Submission

The current cart action:

``` text
/cart
↓
/checkout
```

is navigation, so `Link` is appropriate.

Later, the checkout page may contain:

``` text
Name
Phone
Address

[Place Order]
```

The final order operation could become:

``` text
click
↓
validate inputs
↓
submit order
↓
create order on server
↓
success
↓
/order-complete
```

Here:

``` tsx
<button type="submit">
  Place Order
</button>
```

is appropriate because the primary purpose is submitting the order.
Navigation is only a result of success.

> **Tip**
>
> Do not choose based on the label "Order." The same word can represent
> either navigation or an action depending on what actually happens.

------------------------------------------------------------------------

# 14. Login Pages Commonly Use Both

A login page might contain:

### Navigate to signup

``` tsx
<Link href="/signup">
  Sign Up
</Link>
```

### Perform login

``` tsx
<button type="submit">
  Login
</button>
```

Even if a successful login eventually navigates to `/mypage`, the login
control remains an action button.

> **Tip**
>
> It is completely normal for `Link` and `button` to appear together on
> the same page because they express different intentions.

------------------------------------------------------------------------

# 15. Delete and Then Navigate

Consider:

``` text
[Delete Product]
↓
delete product from server
↓
success
↓
/products
```

It would be incorrect to treat the delete operation as merely:

``` tsx
<Link href="/products">
  Delete Product
</Link>
```

The primary purpose is deletion.

A more appropriate control is:

``` tsx
<button onClick={handleDelete}>
  Delete Product
</button>
```

Navigation may happen after the deletion succeeds.

> **Tip**
>
> Judge the control by what the user requests when clicking, not by the
> URL visible at the end of the flow.

------------------------------------------------------------------------

# 16. Practical Decision Tree

Use this process when unsure:

``` text
1. Is the click primarily navigation?
        │
   ┌────┴────┐
  YES       NO
   ↓         ↓
link-like   button
   ↓
2. Is it internal Next.js navigation?
   │
 ┌─┴─┐
YES  NO
 ↓    ↓
Link  a
```

But consider a button for flows like:

``` text
click
↓
login / save / delete / order / submit
↓
operation succeeds
↓
navigate
```

> **Tip**
>
> Describe the user's intention with one verb. "Navigate" suggests a
> link. "Save," "delete," "submit," or "login" usually suggests a
> button.

------------------------------------------------------------------------

# 17. Shopping Mall Examples

  -----------------------------------------------------------------------
  Situation               Choice                  Reason
  ----------------------- ----------------------- -----------------------
  Open product detail     `Link`                  Internal Next.js
                                                  navigation

  Open cart               `Link`                  Internal Next.js
                                                  navigation

  `/cart → /checkout`     `Link`                  Navigation is the goal

  External manufacturer   `a`                     External link
  site                                            

  Email contact           `a`                     Anchor/link behavior

  Quantity `+ / -`        `button`                Changes quantity/state

  Remove cart item        `button`                Performs deletion

  Submit checkout form    `button`                Performs order
                                                  submission

  Go to completion page   navigate after button   Navigation is the
  after success           logic                   result
  -----------------------------------------------------------------------

> **Tip**
>
> Do not memorize the table mechanically. Practice explaining whether
> each row represents navigation or an action.

------------------------------------------------------------------------

# 18. Final Principle

The most useful rule is:

> **`Link` / `a` represent destinations; `button` represents actions.**

Then divide links further:

``` text
Next.js internal navigation
→ Link

external URL / general HTML anchor use
→ a
```

And remember:

``` text
perform operation
↓
success
↓
navigate
```

may still begin with a `button`, because navigation is the result rather
than the primary purpose.

> **Tip**
>
> Choose HTML and React elements based on meaning, not styling. Use CSS
> for appearance and the correct element for semantics.

------------------------------------------------------------------------

# 한국어

## 1. 이번 이론의 주제

이번에는 웹페이지에서 클릭 가능한 UI를 만들 때 다음 세 가지를 어떻게
구분할지 정리한다.

``` tsx
<Link>
<a>
<button>
```

화면에서는 셋 다 클릭할 수 있어 비슷하게 느껴질 수 있지만 역할은 다르다.

가장 중요한 기준은 다음과 같다.

``` text
Link / a
→ 목적지가 있는 이동

button
→ 어떤 동작을 실행
```

그리고 Next.js에서는 이동을 다시 다음처럼 나눠 생각할 수 있다.

``` text
Next.js 앱 내부 페이지 이동
→ Link

외부 URL 또는 일반적인 anchor 기능
→ a
```

> **팁**
>
> 파란 글씨인지 네모난 버튼 모양인지로 결정하지 않는다. **사용자가
> 클릭해서 무엇을 하려는가**를 기준으로 선택한다.

------------------------------------------------------------------------

## 2. 가장 기본적인 판단 흐름

먼저 다음 순서로 생각하면 쉽다.

``` text
사용자가 클릭
        ↓
목적이 "이동"인가?
   ┌────┴────┐
  YES       NO
   ↓         ↓
링크 계열   button
   ↓
Next.js 앱 내부인가?
 ┌────┴────┐
YES       NO
 ↓         ↓
Link       a
```

하지만 여기에는 중요한 예외처럼 보이는 상황이 있다.

``` text
로그인 버튼 클릭
↓
로그인 처리
↓
성공
↓
/mypage 이동
```

최종적으로 페이지를 이동하지만, 클릭의 핵심 목적은 `/mypage`로 이동하는
것이 아니다.

먼저:

``` text
로그인
```

이라는 작업을 수행하고, 성공한 결과로 이동하는 것이다.

따라서 이런 경우에는 `button`이 자연스럽다.

> **팁**
>
> **최종적으로 URL이 바뀌는가?**만 보지 않는다. **이동 자체가 목적인가,
> 작업 성공의 결과로 이동하는가?**를 구분한다.

------------------------------------------------------------------------

# 3. Next.js `Link`를 사용하는 상황

Next.js 애플리케이션 내부의 다른 페이지를 사용자가 탐색할 때 `Link`를
사용한다.

쇼핑몰 Route가 다음과 같다고 해보자.

``` text
/
├─ /products
├─ /products/1
├─ /cart
├─ /checkout
└─ /mypage
```

### 상품 상세로 이동

``` tsx
<Link href="/products/1">
  상품 보기
</Link>
```

### 장바구니로 이동

``` tsx
<Link href="/cart">
  장바구니 보기
</Link>
```

### 장바구니에서 checkout으로 이동

``` tsx
<Link href="/checkout">
  주문하기
</Link>
```

공통점은:

``` text
클릭
↓
다른 페이지를 본다
```

라는 **페이지 탐색 자체가 목적**이라는 것이다.

> **팁**
>
> 현재 Next.js를 배우는 단계에서는 **내 Next.js 프로젝트 내부의 다른
> 페이지로 이동한다 → 우선 `Link`를 생각한다**라고 잡으면 좋다.

------------------------------------------------------------------------

## 4. `Link`는 import가 필요하다

`Link`는 HTML 기본 태그가 아니라 Next.js에서 제공하는 컴포넌트다.

따라서:

``` tsx
import Link from "next/link";
```

가 필요하다.

그리고:

``` tsx
<Link href="/checkout">
  주문하기
</Link>
```

처럼 사용한다.

`href`는 목적지를 나타낸다.

> **팁**
>
> `Link is not defined` 같은 오류가 나오면 가장 먼저 `next/link`에서
> import했는지 확인한다.

------------------------------------------------------------------------

# 5. HTML `<a>`를 사용하는 상황

`<a>`는 HTML의 기본 anchor 요소다.

``` html
<a href="...">
  ...
</a>
```

대표적으로 외부 사이트로 이동할 때 사용할 수 있다.

``` html
<a href="https://example.com">
  외부 사이트
</a>
```

쇼핑몰에서 다음과 같은 곳으로 연결할 수 있다.

``` text
제조사 공식 사이트
외부 문서
GitHub
외부 블로그
외부 고객지원 페이지
```

개념적으로:

``` text
내 Next.js 앱
    ↓
앱 바깥으로 이동
    ↓
다른 웹사이트
```

다.

> **팁**
>
> 입문 단계에서는 **Next.js 내부 Route → Link / 외부 URL → a**를 첫 번째
> 기준으로 사용하면 편하다.

------------------------------------------------------------------------

# 6. `<a>`가 가진 다른 링크 기능

`a`는 외부 사이트에만 사용하는 요소라고 외우면 부족하다.

예를 들어:

### 이메일

``` html
<a href="mailto:help@example.com">
  이메일 문의
</a>
```

### 전화

``` html
<a href="tel:01012345678">
  전화하기
</a>
```

### 파일

``` html
<a href="/manual.pdf" download>
  매뉴얼 저장
</a>
```

처럼 HTML anchor의 링크 기능을 활용할 수도 있다.

> **팁**
>
> `<a>`를 단순히 **외부 사이트 전용**이라고 외우기보다 **HTML의 기본적인
> 링크/anchor 요소**라고 이해한다.

------------------------------------------------------------------------

# 7. `Link`와 `<a>`는 같은 링크 계열이다

`Link`, `a`, `button`을 완전히 동일한 레벨의 세 가지 선택지라고 생각하면
헷갈리기 쉽다.

먼저 크게 두 종류로 나눈다.

``` text
클릭 가능한 UI
      │
 ┌────┴────┐
 ↓         ↓
이동       동작
 ↓         ↓
링크 계열  button
```

그리고 링크 계열 안에서:

``` text
링크
├─ HTML 기본 anchor → <a>
└─ Next.js 내부 탐색 → <Link>
```

라고 생각한다.

즉:

``` text
Link와 a
→ 이동 / 목적지

button
→ 행동 / 작업
```

이다.

> **팁**
>
> 처음부터 `Link냐 a냐`를 고민하지 않는다. 먼저 **이것이 링크인가,
> 행동인가?**부터 결정한다.

------------------------------------------------------------------------

# 8. `<button>`의 기본 역할

`button`은 사용자가 어떤 동작을 실행하려 할 때 사용한다.

쇼핑몰을 예로 들어보자.

### 수량 증가

``` tsx
<button onClick={handleIncrease}>
  +
</button>
```

### 수량 감소

``` tsx
<button onClick={handleDecrease}>
  -
</button>
```

### 상품 삭제

``` tsx
<button onClick={handleRemove}>
  삭제
</button>
```

이 기능들의 목적은 다른 페이지로 이동하는 것이 아니다.

``` text
현재 페이지
↓
클릭
↓
특정 로직 실행
```

이다.

> **팁**
>
> `button`을 보면 **클릭하면 어떤 함수 또는 작업을 실행해야 하는가?**를
> 생각한다.

------------------------------------------------------------------------

# 9. 버튼처럼 생겼어도 `Link`일 수 있다

화면에서:

``` text
┌────────────────┐
│     주문하기    │
└────────────────┘
```

처럼 보이면 `<button>`을 사용해야 할 것처럼 느껴질 수 있다.

하지만 현재 Day 5의 `/cart`에서는:

``` text
/cart
↓
주문하기 클릭
↓
/checkout
```

이 전부다.

아직 주문을 서버에 생성하는 것도 아니고, 결제를 하는 것도 아니다.

단순히 checkout 페이지를 보러 가는 것이므로:

``` tsx
<Link href="/checkout">
  주문하기
</Link>
```

가 의미상 자연스럽다.

CSS를 적용하면 `Link`도 버튼 모양으로 만들 수 있다.

따라서:

``` text
겉모습
≠
요소의 의미
```

다.

> **팁**
>
> 의미를 먼저 선택하고 디자인은 CSS로 만든다. **버튼처럼 보인다 →
> button**이라는 식으로 판단하지 않는다.

------------------------------------------------------------------------

# 10. 이동하는데도 `button`을 사용하는 경우가 있을까?

있다.

핵심은 다음 두 상황의 차이다.

``` text
이동 자체가 목적
```

과:

``` text
어떤 작업 실행
↓
작업 성공
↓
결과적으로 이동
```

은 다르다.

------------------------------------------------------------------------

# 11. 상황 A --- 이동 자체가 목적

예를 들어:

``` text
[장바구니 보기]
↓
/cart
```

사용자의 목적은 단순히 장바구니 페이지를 보는 것이다.

따라서:

``` tsx
<Link href="/cart">
  장바구니 보기
</Link>
```

가 자연스럽다.

현재 Day 5의:

``` text
/cart
↓
/checkout
```

도 마찬가지다.

``` tsx
<Link href="/checkout">
  주문하기
</Link>
```

를 사용한다.

> **팁**
>
> 클릭 동작을 설명했을 때 **○○ 페이지로 간다**에서 설명이 끝난다면
> 링크일 가능성이 높다.

------------------------------------------------------------------------

# 12. 상황 B --- 어떤 작업의 결과로 이동

로그인을 생각해보자.

``` text
이메일 입력
↓
비밀번호 입력
↓
[로그인]
↓
로그인/인증 처리
↓
성공
↓
/mypage
```

사용자가 요청한 핵심 동작은 `/mypage`로 이동하는 것이 아니다.

먼저:

``` text
로그인한다
```

라는 작업이 핵심이다.

따라서:

``` tsx
<button type="submit">
  로그인
</button>
```

이 자연스럽다.

그리고 로그인에 성공하면 코드에서 `/mypage`로 이동시킬 수 있다.

``` text
button
↓
로그인 처리
↓
성공
↓
페이지 이동
```

> **팁**
>
> **성공하면 이동한다**라는 구조라면, 이동보다 앞에 있는 작업이 무엇인지
> 확인한다.

------------------------------------------------------------------------

# 13. 쇼핑몰 최종 주문도 같은 원리다

현재 `/cart`에서:

``` text
/cart
↓
주문하기
↓
/checkout
```

은 단순 이동이다.

따라서 `Link`.

하지만 나중에 `/checkout`에서:

``` text
이름
연락처
주소

[최종 주문하기]
```

가 생기고 실제 동작이:

``` text
최종 주문 클릭
↓
입력값 검증
↓
주문 요청
↓
서버에 주문 생성
↓
성공
↓
/order-complete
```

이라면:

``` tsx
<button type="submit">
  최종 주문하기
</button>
```

가 자연스럽다.

페이지 이동은 **주문 처리 성공의 결과**이기 때문이다.

> **팁**
>
> 둘 다 화면에 `주문하기`라고 적혀 있다고 같은 요소를 사용하는 것이
> 아니다. **실제로 무엇을 수행하는지**가 기준이다.

------------------------------------------------------------------------

# 14. 로그인 페이지에는 Link와 button이 함께 있을 수 있다

예를 들어 로그인 페이지에:

### 회원가입 페이지 이동

``` tsx
<Link href="/signup">
  회원가입
</Link>
```

### 실제 로그인

``` tsx
<button type="submit">
  로그인
</button>
```

이 동시에 있을 수 있다.

첫 번째는:

``` text
/signup으로 이동
```

이 목적이다.

두 번째는:

``` text
로그인 처리
```

가 목적이다.

로그인 성공 후 `/mypage`로 이동하더라도 로그인 컨트롤 자체는
`button`이다.

> **팁**
>
> 같은 화면에 `Link`와 `button`이 같이 있는 것은 전혀 이상하지 않다.
> 각각 사용자의 다른 의도를 표현한다.

------------------------------------------------------------------------

# 15. 삭제한 뒤 이동하는 경우

다음 상황도 생각해보자.

``` text
[상품 삭제]
↓
서버에서 상품 삭제
↓
성공
↓
/products 이동
```

최종적으로 `/products`로 이동한다고 해서:

``` tsx
<Link href="/products">
  상품 삭제
</Link>
```

라고 하면 의미가 맞지 않는다.

사용자가 요청한 핵심은:

``` text
상품 삭제
```

이기 때문이다.

따라서:

``` tsx
<button onClick={handleDelete}>
  상품 삭제
</button>
```

처럼 처리하고 삭제가 성공한 뒤 페이지를 이동시키는 구조가 자연스럽다.

> **팁**
>
> **마지막 URL이 무엇인가**보다 **클릭 순간 사용자가 무엇을
> 요청했는가**를 기준으로 판단한다.

------------------------------------------------------------------------

# 16. 실전 판단 알고리즘

앞으로 헷갈리면 다음 순서로 판단한다.

``` text
① 클릭의 주목적이 이동인가?
        │
   ┌────┴────┐
  YES       NO
   ↓         ↓
링크 계열   button
   ↓
② Next.js 앱 내부 이동인가?
   │
 ┌─┴─┐
YES  NO
 ↓    ↓
Link  a
```

그리고 다음과 같은 경우는 최종적으로 이동하더라도 `button`일 수 있다.

``` text
클릭
↓
로그인 / 저장 / 삭제 / 주문 / 제출
↓
작업 성공
↓
페이지 이동
```

> **팁**
>
> 사용자의 목적을 동사 하나로 표현해본다. **이동한다**면 링크 계열,
> **저장한다 / 삭제한다 / 로그인한다 / 제출한다**면 button일 가능성이
> 높다.

------------------------------------------------------------------------

# 17. 현재 쇼핑몰 기준 비교표

  -----------------------------------------------------------------------
  상황                    선택                    이유
  ----------------------- ----------------------- -----------------------
  상품 상세 페이지로 이동 `Link`                  Next.js 내부 탐색

  장바구니 페이지로 이동  `Link`                  Next.js 내부 탐색

  `/cart → /checkout`     `Link`                  이동 자체가 목적

  외부 제조사 사이트      `a`                     외부 링크

  이메일 문의             `a`                     anchor의 링크 기능

  수량 `+ / -`            `button`                수량/state 변경

  장바구니 상품 삭제      `button`                삭제 동작

  checkout 주문 폼 제출   `button`                주문 처리

  주문 성공 후 완료       button 처리 후 이동     이동은 성공의 결과
  페이지 이동                                     
  -----------------------------------------------------------------------

> **팁**
>
> 표를 외우기보다 각 항목에 대해 **왜 이동이고 왜 동작인지** 설명해보는
> 것이 더 중요하다.

------------------------------------------------------------------------

# 18. 최종 핵심

가장 중요한 문장은 다음과 같다.

> **`Link` / `a`는 목적지를 나타내고, `button`은 행동을 나타낸다.**

그리고 링크 안에서는:

``` text
Next.js 내부 페이지 탐색
→ Link

외부 URL / 일반 HTML anchor 기능
→ a
```

로 구분한다.

마지막으로:

``` text
작업 실행
↓
성공
↓
페이지 이동
```

구조라면 최종적으로 URL이 바뀌어도 처음 클릭한 요소는 `button`일 수
있다.

현재 Day 5의 `/cart → /checkout`은:

``` text
이동 자체가 목적
↓
Next.js 내부 Route
↓
Link
```

이므로 지금 작성한:

``` tsx
<Link href="/checkout">
  주문하기
</Link>
```

가 목적에 맞는 선택이다.

> **팁**
>
> 앞으로 요소를 선택할 때 **디자인은 CSS가 담당하고, 의미는 HTML/React
> 요소가 담당한다**는 원칙을 기억한다.
