# Next.js `Link` と HTML `<a>` / Next.js `Link` vs HTML `<a>` / Next.js `Link`와 HTML `<a>`

---

# 日本語

## 1. 共通点

Next.jsの`Link`とHTMLの`<a>`は、どちらもユーザーを別のURLへ移動させるために使う。

```tsx
<a href="/products/1">商品を見る</a>
```

```tsx
<Link href="/products/1">商品を見る</Link>
```

見た目の目的は似ているが、Next.jsアプリケーション内部での移動方法には違いがある。

> **Tip**  
> まず「どちらもリンクを作る」という共通点を理解し、その後にNext.js内部ナビゲーションの違いを覚える。

## 2. HTMLの`<a>`とは

`<a>`はHTMLそのものが提供するリンク要素で、Next.js専用の機能ではない。

```tsx
<a href="https://example.com">
  外部サイト
</a>
```

通常の`href`ナビゲーションでは、ブラウザの標準的なページ移動としてURLへ移動する。

> **Tip**  
> Next.jsが存在しなくても使える基本的なWebのリンクが`<a>`である。

## 3. Next.jsの`Link`とは

`Link`は`next/link`から読み込むNext.jsのコンポーネントである。

```tsx
import Link from "next/link";

<Link href="/products/1">
  商品を見る
</Link>
```

Next.jsのルーターと統合されており、アプリケーション内部のページ移動に利用する。

> **Tip**  
> Next.jsアプリケーション内のページ同士を移動するときは、まず`Link`を候補にする。

## 4. 今回の商品カードでの使用

今回のショッピングモールでは、商品ごとにIDが異なる。

```tsx
<Link href={`/products/${product.id}`}>
  ...
</Link>
```

例えば次のようにURLが作られる。

```text
product.id = 1
→ /products/1

product.id = 2
→ /products/2

product.id = 3
→ /products/3
```

このURLは`app/products/[id]/page.tsx`へ接続される。

> **Tip**  
> `${product.id}`と`[id]`を別々の文法として覚えず、「カードの商品IDを詳細URLへ渡す流れ」として理解する。

## 5. 内部移動で`Link`を使う理由

`Link`はNext.jsのクライアントサイドナビゲーションと統合されている。

そのため、Next.js App Routerでは共有レイアウトなどを活用しながら、必要なルート内容へ移動できる。

また、条件に応じてリンク先を事前取得するprefetch最適化も利用できる。

```text
/products
↓
Link
↓
/products/1
↓
Next.js Router
↓
商品詳細
```

> **Tip**  
> 単に「Linkのほうが速い」と暗記せず、「Next.js Routerと統合された内部ナビゲーション」と覚える。

## 6. 使い分けの基本

今回の学習段階では次のように整理できる。

```text
Next.jsアプリ内部
→ Link

外部Webサイト
→ <a>
```

例えば商品一覧から商品詳細への移動は`Link`が適切である。

```tsx
<Link href={`/products/${product.id}`}>
```

外部サイトへ移動する場合は通常の`<a>`が自然である。

> **Tip**  
> 最初は「自分のNext.jsアプリ内ならLink、外部ならa」と覚え、例外は実際に必要になったときに学ぶ。

## 7. 昔のNext.jsコードとの違い

古いNext.jsの資料では次のようなコードを見ることがある。

```tsx
<Link href="/products/1">
  <a>商品を見る</a>
</Link>
```

現在のNext.jsでは通常、別の`<a>`を子要素として追加せずに書ける。

```tsx
<Link href="/products/1">
  商品を見る
</Link>
```

> **Tip**  
> Next.jsのサンプルコードを調べるときは、記事や講座が対象としているNext.jsのバージョンも確認する。

## 8. 今回の機能全体のつながり

今回学んだ機能はすべて1つの流れにつながっている。

```text
ProductCard
↓
Link
↓
/products/${product.id}
↓
app/products/[id]/page.tsx
↓
params.id
↓
Number(id)
↓
products.find()
↓
商品詳細
```

`Link`は単独の機能ではなく、商品一覧から動的詳細ページへユーザーを接続する入口になっている。

> **Tip**  
> 文法を個別に暗記するより、「ユーザーが商品をクリックしてから詳細データが表示されるまで」を追跡すると理解しやすい。

## 9. 覚え方

```text
<a>
→ HTML標準のリンク

Link
→ Next.jsの内部ナビゲーション用コンポーネント

ProductCard + Link
→ 商品をクリック可能にする

/products/${product.id}
→ 商品IDをURLへ渡す

[id]
→ URLの商品IDを受け取る
```

> **Tip**  
> `Link`を学ぶ目的はタグを1つ覚えることではなく、Next.jsのルーティングとUIを接続する方法を理解することである。

---

# English

## 1. What They Have in Common

Both Next.js `Link` and the HTML `<a>` element are used to move a user to another URL.

```tsx
<a href="/products/1">View product</a>
```

```tsx
<Link href="/products/1">View product</Link>
```

Their visible purpose is similar, but navigation inside a Next.js application is handled differently.

> **Tip**  
> Start with the shared idea that both create links, then learn how Next.js handles internal navigation differently.

## 2. What Is HTML `<a>`?

`<a>` is a standard HTML link element. It is not specific to Next.js.

```tsx
<a href="https://example.com">
  External website
</a>
```

With ordinary `href` navigation, the browser performs its standard navigation to the target URL.

> **Tip**  
> Think of `<a>` as the fundamental web link that works even without Next.js.

## 3. What Is Next.js `Link`?

`Link` is a Next.js component imported from `next/link`.

```tsx
import Link from "next/link";

<Link href="/products/1">
  View product
</Link>
```

It integrates with the Next.js router and is intended for navigation between routes inside the application.

> **Tip**  
> For navigation between pages inside a Next.js application, consider `Link` first.

## 4. Using It in Our Product Card

In the shopping mall project, every product has its own ID.

```tsx
<Link href={`/products/${product.id}`}>
  ...
</Link>
```

The resulting URLs look like this:

```text
product.id = 1
→ /products/1

product.id = 2
→ /products/2

product.id = 3
→ /products/3
```

These URLs connect to `app/products/[id]/page.tsx`.

> **Tip**  
> Do not memorize `${product.id}` and `[id]` as unrelated syntax. Think of them as the flow that sends a card's product ID into the detail route.

## 5. Why Use `Link` for Internal Navigation?

`Link` integrates with Next.js client-side navigation.

In the App Router, this allows Next.js to navigate to the required route while taking advantage of shared layouts and related routing behavior.

It can also use prefetch optimization for eligible links.

```text
/products
↓
Link
↓
/products/1
↓
Next.js Router
↓
Product detail
```

> **Tip**  
> Instead of memorizing “Link is faster,” remember that `Link` is integrated with the Next.js router for internal navigation.

## 6. Basic Rule for Choosing Between Them

At this learning stage, a useful rule is:

```text
Inside the Next.js application
→ Link

External website
→ <a>
```

For example, moving from the product list to a product detail page is a good use of `Link`.

```tsx
<Link href={`/products/${product.id}`}>
```

For an external website, a normal `<a>` element is generally natural.

> **Tip**  
> Start with “inside my Next.js app = Link, outside = a.” Learn special cases later when they actually appear.

## 7. Difference from Older Next.js Examples

Older Next.js tutorials may contain code such as:

```tsx
<Link href="/products/1">
  <a>View product</a>
</Link>
```

In current Next.js usage, a separate `<a>` child is normally unnecessary.

```tsx
<Link href="/products/1">
  View product
</Link>
```

> **Tip**  
> When reading Next.js tutorials, check which Next.js version the example was written for.

## 8. How the Entire Feature Connects

The concepts we learned are part of one continuous flow.

```text
ProductCard
↓
Link
↓
/products/${product.id}
↓
app/products/[id]/page.tsx
↓
params.id
↓
Number(id)
↓
products.find()
↓
Product detail
```

`Link` is therefore not an isolated feature. It is the entry point that connects the product list UI to the dynamic product detail route.

> **Tip**  
> Instead of memorizing each syntax separately, trace what happens from the moment the user clicks a product until the product data appears.

## 9. A Simple Way to Remember

```text
<a>
→ Standard HTML link

Link
→ Next.js component for internal navigation

ProductCard + Link
→ Makes a product navigable

/products/${product.id}
→ Sends the product ID through the URL

[id]
→ Receives the product ID from the URL
```

> **Tip**  
> The goal of learning `Link` is not merely to memorize another component. It is to understand how UI and Next.js routing connect.

---

# 한국어

## 1. 공통점

Next.js의 `Link`와 HTML의 `<a>`는 모두 사용자를 다른 URL로 이동시키기 위해 사용한다.

```tsx
<a href="/products/1">상품 보기</a>
```

```tsx
<Link href="/products/1">상품 보기</Link>
```

겉으로 보이는 목적은 비슷하지만 Next.js 애플리케이션 내부에서 페이지를 이동시키는 방식에는 차이가 있다.

> **팁**  
> 먼저 둘 다 링크를 만든다는 공통점을 이해하고, 그다음 Next.js 내부 이동 방식의 차이를 구분한다.

## 2. HTML의 `<a>`란?

`<a>`는 HTML 자체에서 제공하는 기본 링크 요소이며 Next.js 전용 기능이 아니다.

```tsx
<a href="https://example.com">
  외부 사이트
</a>
```

일반적인 `href` 내비게이션에서는 브라우저의 표준 페이지 이동 방식으로 해당 URL에 이동한다.

> **팁**  
> Next.js가 없어도 사용할 수 있는 웹의 기본 링크가 `<a>`라고 생각하면 된다.

## 3. Next.js의 `Link`란?

`Link`는 `next/link`에서 가져오는 Next.js 컴포넌트다.

```tsx
import Link from "next/link";

<Link href="/products/1">
  상품 보기
</Link>
```

Next.js 라우터와 통합되어 있으며 애플리케이션 내부 라우트 사이를 이동할 때 사용한다.

> **팁**  
> Next.js 애플리케이션 내부 페이지끼리 이동한다면 우선 `Link`를 생각한다.

## 4. 현재 ProductCard에서의 사용

현재 쇼핑몰 프로젝트에서는 각 상품마다 서로 다른 ID가 있다.

```tsx
<Link href={`/products/${product.id}`}>
  ...
</Link>
```

그러면 다음과 같은 URL이 만들어진다.

```text
product.id = 1
→ /products/1

product.id = 2
→ /products/2

product.id = 3
→ /products/3
```

이 URL들은 `app/products/[id]/page.tsx`와 연결된다.

> **팁**  
> `${product.id}`와 `[id]`를 서로 다른 문법으로 따로 외우지 말고 상품 카드의 ID를 상세 URL로 전달하는 하나의 흐름으로 이해한다.

## 5. 내부 이동에서 `Link`를 사용하는 이유

`Link`는 Next.js의 클라이언트 사이드 내비게이션과 통합되어 있다.

App Router에서는 이를 통해 공유 레이아웃 같은 구조를 활용하면서 필요한 라우트로 이동할 수 있다.

조건에 따라 링크 목적지를 미리 가져오는 prefetch 최적화도 사용할 수 있다.

```text
/products
↓
Link
↓
/products/1
↓
Next.js Router
↓
상품 상세
```

> **팁**  
> 단순히 `Link가 더 빠르다`라고 외우지 말고 `Next.js Router와 연결된 내부 내비게이션 컴포넌트`라고 기억한다.

## 6. 기본적인 사용 기준

현재 학습 단계에서는 다음처럼 구분하면 충분하다.

```text
Next.js 애플리케이션 내부
→ Link

외부 웹사이트
→ <a>
```

상품 목록에서 상품 상세로 이동하는 것은 `Link`가 적절하다.

```tsx
<Link href={`/products/${product.id}`}>
```

반면 외부 웹사이트로 이동할 때는 일반적인 `<a>`가 자연스럽다.

> **팁**  
> 처음에는 `내 Next.js 앱 안 = Link`, `외부 = a`로 기억하고 예외적인 상황은 실제로 만났을 때 확장한다.

## 7. 예전 Next.js 코드와의 차이

오래된 Next.js 자료에서는 다음과 같은 코드를 볼 수 있다.

```tsx
<Link href="/products/1">
  <a>상품 보기</a>
</Link>
```

현재 Next.js에서는 일반적으로 별도의 `<a>` 자식을 추가하지 않아도 된다.

```tsx
<Link href="/products/1">
  상품 보기
</Link>
```

> **팁**  
> Next.js 예제를 검색할 때는 해당 글이나 강의가 어느 Next.js 버전을 기준으로 작성됐는지도 확인한다.

## 8. 이번 기능 전체의 연결 관계

지금까지 배운 기능은 모두 하나의 흐름으로 연결된다.

```text
ProductCard
↓
Link
↓
/products/${product.id}
↓
app/products/[id]/page.tsx
↓
params.id
↓
Number(id)
↓
products.find()
↓
상품 상세
```

즉 `Link`는 독립된 기능 하나가 아니라 상품 목록 UI와 동적 상품 상세 페이지를 연결하는 출발점이다.

> **팁**  
> 각각의 문법을 따로 외우기보다 사용자가 상품을 클릭한 순간부터 상품 데이터가 표시될 때까지 코드의 흐름을 추적한다.

## 9. 기억하는 방법

```text
<a>
→ HTML 표준 링크

Link
→ Next.js 내부 내비게이션 컴포넌트

ProductCard + Link
→ 상품을 클릭해서 이동할 수 있게 함

/products/${product.id}
→ 상품 ID를 URL로 전달

[id]
→ URL에서 상품 ID를 받음
```

> **팁**  
> `Link`를 배우는 목적은 태그 하나를 추가로 외우는 것이 아니라 UI와 Next.js 라우팅이 어떻게 연결되는지를 이해하는 것이다.
