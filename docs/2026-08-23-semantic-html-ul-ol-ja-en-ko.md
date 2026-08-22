# Semantic HTML — ul, ol, and Meaningful Tags

---

# 日本語

## 1. セマンティックHTMLとは

セマンティックHTMLとは、見た目ではなく「コンテンツの意味」を基準にHTMLタグを選ぶ考え方である。例えば文字を大きくしたいから`h1`を使うのではなく、ページの最上位見出しだから`h1`を使う。見た目はCSSで調整する。

> **Tip**  
> タグを選ぶ前に「どう見せるか」ではなく「これは文書の中で何か」を考える。

## 2. `ul`が適切な場合

`ul`はUnordered Listで、項目の順番そのものに重要な意味がない一覧を表す。

```html
<ul>
  <li>Tシャツ</li>
  <li>パーカー</li>
  <li>デニムパンツ</li>
</ul>
```

商品の順番を入れ替えても「商品一覧」という意味は変わらない。そのため通常の商品一覧、カテゴリ一覧、ナビゲーション項目などでは`ul`が自然である。

> **Tip**  
> 順番を入れ替えても意味が壊れないなら、`ul`を検討する。

## 3. `ol`が適切な場合

`ol`はOrdered Listで、順序自体に意味がある一覧を表す。

```html
<ol>
  <li>商品を選ぶ</li>
  <li>カートに追加する</li>
  <li>注文する</li>
  <li>決済する</li>
</ol>
```

手順のほか、ランキングや時系列なども代表例である。

```html
<ol>
  <li>売上1位</li>
  <li>売上2位</li>
  <li>売上3位</li>
</ol>
```

> **Tip**  
> 1番目、2番目、3番目であること自体が情報なら`ol`を検討する。

## 4. 今回の商品一覧はなぜ`ul`か

今回の商品は一般的な一覧であり、1位・2位・3位という順位を表していない。

```tsx
<ul>
  {products.map((product) => (
    <li key={product.id}>
      <h2>{product.name}</h2>
      <span>{product.salePrice.toLocaleString()}円</span>
      <p>{product.description}</p>
    </li>
  ))}
</ul>
```

将来「人気商品ランキング」として表示する場合は、同じ商品でも`ol`が適切になる可能性がある。

> **Tip**  
> データの種類だけでなく、その画面でデータをどんな意味として提示しているかでタグを決める。

## 5. `li`を単独で使わない理由

`li`はList Item、つまり「リストに属する項目」を意味する。そのため基本的には`ul`または`ol`の子要素として使用する。

```html
<ul>
  <li>商品A</li>
  <li>商品B</li>
</ul>
```

> **Tip**  
> `li`を使うときは「この項目は何のリストに属するのか」まで考える。

## 6. `h1`と`h2`もデザインではなく文書階層

見出しタグは文字サイズではなく文書の階層を表す。

```text
h1 商品一覧
 ├─ h2 商品A
 ├─ h2 商品B
 └─ h2 商品C
```

商品名を大きくしたいから`h1`にするのではない。大きさはCSSで変更する。

> **Tip**  
> ページを目次にしたとき自然な構造になるかを考えると、見出しレベルを判断しやすい。

## 7. 今回覚える主なセマンティックタグ

| タグ | 意味 | ショッピングモールでの例 |
|---|---|---|
| `main` | ページの主要コンテンツ | 商品一覧の本体 |
| `h1` | 最上位の見出し | 商品一覧 |
| `h2` | 下位の見出し | 商品名 |
| `ul` | 順序に意味がない一覧 | 通常の商品一覧 |
| `ol` | 順序に意味がある一覧 | 人気商品ランキング |
| `li` | リストの項目 | 商品1件 |
| `p` | 段落 | 商品説明 |

> **Tip**  
> タグ名だけを暗記せず、実際の画面での役割と結び付けて覚える。

## 8. `div`と`span`も必要

`div`と`span`は間違ったタグではない。ただし、それ自体には特定の意味がほとんどない。適切なセマンティックタグがない場合や、レイアウト・スタイルのためにまとめる場合に使える。

```text
意味を表す適切なタグがある → そのタグを検討
特別な意味がない → div / spanも適切
```

> **Tip**  
> セマンティックHTMLを「divを使わないルール」と考えない。

## 9. 実務での判断順序

```text
このコンテンツは何か？
↓
意味を表すHTMLタグがあるか？
↓
リストなら順番に意味があるか？
↓
見出しなら文書階層のどこか？
↓
特別な意味がなければdiv / span
↓
最後にCSSで見た目を調整
```

今回なら`main → h1 → ul → li → h2 / p / span`という構造になる。

> **Tip**  
> HTMLは意味と構造、CSSは見た目という役割分担を基本にする。

---

# English

## 1. What Is Semantic HTML?

Semantic HTML means choosing HTML elements according to the meaning of the content rather than its appearance. For example, use `h1` because something is the top-level heading of the page, not because you want large text. Appearance belongs to CSS.

> **Tip**  
> Before asking how something should look, ask what it represents in the document.

## 2. When `ul` Is Appropriate

`ul` means Unordered List. It represents a collection where the order itself is not essential.

```html
<ul>
  <li>T-Shirt</li>
  <li>Hoodie</li>
  <li>Denim Pants</li>
</ul>
```

Reordering these products does not change the basic meaning of “product list.” This makes `ul` natural for ordinary product lists, category lists, and many navigation lists.

> **Tip**  
> If rearranging the items does not break their meaning, consider `ul`.

## 3. When `ol` Is Appropriate

`ol` means Ordered List. It represents a list where sequence itself carries meaning.

```html
<ol>
  <li>Select a product</li>
  <li>Add it to the cart</li>
  <li>Place the order</li>
  <li>Make the payment</li>
</ol>
```

Steps, rankings, and chronological sequences are common examples.

```html
<ol>
  <li>#1 Best seller</li>
  <li>#2 Best seller</li>
  <li>#3 Best seller</li>
</ol>
```

> **Tip**  
> If being first, second, or third is itself information, consider `ol`.

## 4. Why Our Product List Uses `ul`

Our current products form a normal collection, not a first-, second-, and third-place ranking.

```tsx
<ul>
  {products.map((product) => (
    <li key={product.id}>
      <h2>{product.name}</h2>
      <span>{product.salePrice.toLocaleString()} won</span>
      <p>{product.description}</p>
    </li>
  ))}
</ul>
```

If the same products are later presented as a “Popular Products Ranking,” `ol` may become more appropriate.

> **Tip**  
> Choose tags based not only on the data type, but on what the data means in that particular UI.

## 5. Why `li` Should Not Stand Alone

`li` means List Item: an item belonging to a list. It is therefore normally used as a child of `ul` or `ol`.

```html
<ul>
  <li>Product A</li>
  <li>Product B</li>
</ul>
```

> **Tip**  
> When using `li`, also ask what list those items belong to.

## 6. `h1` and `h2` Describe Hierarchy, Not Design

Heading elements represent document hierarchy rather than font size.

```text
h1 Product List
 ├─ h2 Product A
 ├─ h2 Product B
 └─ h2 Product C
```

Do not choose `h1` simply because a product name should look large. CSS controls its visual size.

> **Tip**  
> Imagine the page as a table of contents. A natural outline usually indicates a reasonable heading hierarchy.

## 7. Main Semantic Elements from This Example

| Element | Meaning | Shopping Mall Example |
|---|---|---|
| `main` | Main page content | Product-list body |
| `h1` | Top-level heading | Product List |
| `h2` | Lower-level heading | Product name |
| `ul` | List without meaningful order | Normal product list |
| `ol` | List with meaningful order | Popular-product ranking |
| `li` | List item | One product |
| `p` | Paragraph | Product description |

> **Tip**  
> Learn each element together with its role on a real screen instead of memorizing tag names in isolation.

## 8. `div` and `span` Are Still Useful

`div` and `span` are not incorrect. They simply carry little semantic meaning by themselves. They are useful when no more meaningful element applies or when grouping content for layout and styling.

```text
A meaningful element exists → Consider that element
No special meaning is needed → div / span may be appropriate
```

> **Tip**  
> Do not treat semantic HTML as a rule that forbids `div`.

## 9. A Practical Decision Process

```text
What does this content represent?
↓
Is there an HTML element for that meaning?
↓
If it is a list, does order matter?
↓
If it is a heading, where is it in the hierarchy?
↓
If no special meaning applies, use div / span as appropriate
↓
Use CSS afterward for appearance
```

For our page, this leads to a structure such as `main → h1 → ul → li → h2 / p / span`.

> **Tip**  
> Keep the basic responsibility clear: HTML describes meaning and structure; CSS controls presentation.

---

# 한국어

## 1. 시맨틱 HTML이란

시맨틱 HTML은 화면에서 어떻게 보이느냐가 아니라 콘텐츠가 어떤 의미를 가지는지를 기준으로 HTML 태그를 선택하는 방식이다. 예를 들어 글자를 크게 만들기 위해 `h1`을 사용하는 것이 아니라 페이지의 최상위 제목이기 때문에 `h1`을 사용한다. 디자인은 CSS가 담당한다.

> **팁**  
> 태그를 고르기 전에 어떻게 보여줄지를 생각하기보다 이 콘텐츠가 문서에서 무엇인지를 먼저 생각한다.

## 2. `ul`이 적절한 경우

`ul`은 Unordered List로, 항목의 순서 자체에 중요한 의미가 없는 목록을 나타낸다.

```html
<ul>
  <li>티셔츠</li>
  <li>후드</li>
  <li>데님 팬츠</li>
</ul>
```

상품 순서를 바꿔도 상품 목록이라는 기본 의미는 달라지지 않는다. 따라서 일반 상품 목록, 카테고리 목록, 많은 내비게이션 목록 등에 `ul`이 자연스럽다.

> **팁**  
> 항목 순서를 바꿔도 의미가 깨지지 않는다면 `ul`을 고려한다.

## 3. `ol`이 적절한 경우

`ol`은 Ordered List로, 순서 자체가 의미를 가지는 목록을 나타낸다.

```html
<ol>
  <li>상품을 선택한다</li>
  <li>장바구니에 추가한다</li>
  <li>주문한다</li>
  <li>결제한다</li>
</ol>
```

작업 절차, 순위, 시간 순서 등이 대표적인 예다.

```html
<ol>
  <li>판매량 1위</li>
  <li>판매량 2위</li>
  <li>판매량 3위</li>
</ol>
```

> **팁**  
> 1번째, 2번째, 3번째라는 사실 자체가 정보라면 `ol`을 고려한다.

## 4. 이번 상품 목록에서 `ul`이 맞는 이유

현재 상품들은 일반적인 상품 목록이지 1위, 2위, 3위라는 순위를 나타내는 것이 아니다.

```tsx
<ul>
  {products.map((product) => (
    <li key={product.id}>
      <h2>{product.name}</h2>
      <span>{product.salePrice.toLocaleString()}원</span>
      <p>{product.description}</p>
    </li>
  ))}
</ul>
```

나중에 같은 상품을 인기 상품 순위로 보여준다면 `ol`이 더 적절해질 수 있다.

> **팁**  
> 데이터 종류만 보고 태그를 정하지 말고 해당 화면에서 그 데이터가 어떤 의미로 제시되는지를 기준으로 결정한다.

## 5. `li`를 단독으로 사용하지 않는 이유

`li`는 List Item, 즉 목록에 속하는 하나의 항목이라는 의미다. 따라서 기본적으로 `ul`이나 `ol`의 자식으로 사용한다.

```html
<ul>
  <li>상품 A</li>
  <li>상품 B</li>
</ul>
```

> **팁**  
> `li`를 사용할 때는 이 항목들이 어떤 목록에 속하는지까지 함께 생각한다.

## 6. `h1`과 `h2`도 디자인이 아니라 문서 계층이다

제목 태그는 글자 크기가 아니라 문서의 제목 계층을 표현한다.

```text
h1 상품 목록
 ├─ h2 상품 A
 ├─ h2 상품 B
 └─ h2 상품 C
```

상품명을 크게 보이게 하고 싶다는 이유만으로 `h1`을 사용하지 않는다. 크기는 CSS로 조절한다.

> **팁**  
> 페이지를 목차로 만들었다고 생각했을 때 자연스러운 구조인지 확인하면 제목 단계를 판단하기 쉽다.

## 7. 이번에 기억할 주요 시맨틱 태그

| 태그 | 의미 | 쇼핑몰에서의 예 |
|---|---|---|
| `main` | 페이지의 핵심 콘텐츠 | 상품 목록 본문 |
| `h1` | 최상위 제목 | 상품 목록 |
| `h2` | 하위 제목 | 상품명 |
| `ul` | 순서에 의미가 없는 목록 | 일반 상품 목록 |
| `ol` | 순서에 의미가 있는 목록 | 인기 상품 순위 |
| `li` | 목록의 개별 항목 | 상품 하나 |
| `p` | 문단 | 상품 설명 |

> **팁**  
> 태그 이름만 외우지 말고 실제 화면에서 어떤 역할을 하는지와 연결해서 기억한다.

## 8. `div`와 `span`도 필요하다

`div`와 `span`이 잘못된 태그인 것은 아니다. 다만 태그 자체에 특별한 의미가 거의 없다. 적절한 시맨틱 태그가 없거나 레이아웃과 스타일을 위해 콘텐츠를 묶을 때 사용할 수 있다.

```text
의미를 표현할 적절한 태그가 있음 → 해당 태그를 고려
특별한 의미가 없음 → div / span도 적절
```

> **팁**  
> 시맨틱 HTML을 `div`를 사용하지 않는 규칙으로 생각하지 않는다.

## 9. 실무에서의 판단 순서

```text
이 콘텐츠는 무엇인가?
↓
그 의미를 표현하는 HTML 태그가 있는가?
↓
목록이라면 순서에 의미가 있는가?
↓
제목이라면 문서 계층의 어디인가?
↓
특별한 의미가 없다면 div / span
↓
마지막에 CSS로 디자인 조정
```

이번 상품 페이지라면 `main → h1 → ul → li → h2 / p / span`과 같은 구조가 된다.

> **팁**  
> HTML은 의미와 구조를 만들고 CSS는 화면 표현을 만든다는 역할 분담을 기본으로 기억한다.
