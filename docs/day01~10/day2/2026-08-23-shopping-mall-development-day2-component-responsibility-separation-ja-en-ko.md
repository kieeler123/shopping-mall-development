# Component Responsibility Separation / コンポーネントの責務分離 / 컴포넌트 책임 분리

---

# 日本語

## 1. 今回経験したこと

商品一覧を最初に作ったとき、`products/page.tsx`の中で商品の繰り返し処理と、商品1件の表示をすべて担当していた。

```tsx
<ul>
  {products.map((product) => (
    <li key={product.id}>
      <h2>{product.name}</h2>
      <span>{product.salePrice.toLocaleString()}円</span>
      <p>{product.description}</p>
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={300}
      />
    </li>
  ))}
</ul>
```

商品1件を表示する役割が明確になったため、その部分を`ProductCard`として分離した。

> **Tip**  
> コンポーネントは「コードが長いから」だけで分割するのではなく、「独立した責務が見えたか」を基準に考える。

## 2. `ProductsPage`の責務

`ProductsPage`は複数の商品を一覧として構成する責務を持つ。

```tsx
<ul>
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</ul>
```

ここでは「どの商品を何件表示するか」を管理する。一方、商品1件の内部表示方法までは担当しない。

```text
ProductsPage
→ 商品一覧を構成
→ productsを反復
→ Empty Stateを処理
→ ProductCardを並べる
```

> **Tip**  
> ページコンポーネントは画面全体の構成を担当し、細かい表示責務は下位コンポーネントへ渡すと整理しやすい。

## 3. `ProductCard`の責務

`ProductCard`は商品1件をどのように表示するかを担当する。

```tsx
type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <li>
      <h2>{product.name}</h2>
      <span>{product.salePrice.toLocaleString()}円</span>
      <p>{product.description}</p>
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={300}
      />
    </li>
  );
}
```

つまり、商品一覧全体ではなく「商品1件」がこのコンポーネントの境界になる。

> **Tip**  
> コンポーネント名を見て、一文で責務を説明できるか確認する。`ProductCard = 商品1件を表示する`と説明できれば境界が分かりやすい。

## 4. なぜ`ul`まで`ProductCard`へ移動しないのか

`ul`は複数の商品を1つのリストとしてまとめる要素である。

各`ProductCard`が`ul`まで持つと、次のような構造になる。

```html
<ul><li>商品1</li></ul>
<ul><li>商品2</li></ul>
<ul><li>商品3</li></ul>
```

しかし今回表現したい構造は次である。

```html
<ul>
  <li>商品1</li>
  <li>商品2</li>
  <li>商品3</li>
</ul>
```

そのため`ul`は複数商品を管理する`ProductsPage`に残し、商品1件を表す`li`を`ProductCard`が担当する。

> **Tip**  
> HTMLの意味構造を考えると、コンポーネントをどこで分割するべきか判断しやすくなる。

## 5. `key`を親側に置く理由

Reactの`key`は、繰り返し生成される兄弟要素をReactが識別するために使う。

```tsx
products.map((product) => (
  <ProductCard key={product.id} product={product} />
))
```

繰り返しを作っているのは`ProductsPage`なので、`key`もこの位置に置く。

`ProductCard`内部の`li`に同じ`key`を追加する必要はない。

> **Tip**  
> `key`は基本的に`map()`が返す最上位要素・コンポーネントに付ける、と覚えると判断しやすい。

## 6. Importも責務と一緒に移動する

分離前は`ProductsPage`が`Image`を直接使用していた。

分離後は`Image`を使用する責務が`ProductCard`へ移ったため、Importも移動する。

```text
ProductsPage
├─ products
└─ ProductCard

ProductCard
├─ Product type
└─ Image
```

使わなくなったImportはページ側から削除する。

> **Tip**  
> リファクタリング後は、JSXだけでなくImportと依存関係も新しい責務に合っているか確認する。

## 7. 現在のプロジェクト構造と責務

```text
src/
├─ app/
│  └─ products/
│     └─ page.tsx
├─ components/
│  └─ product/
│     └─ ProductCard.tsx
├─ data/
│  └─ products.ts
└─ types/
   └─ product.ts
```

```text
product.ts
→ Productデータの形

products.ts
→ 実際の商品データ

ProductCard.tsx
→ 商品1件の表示

products/page.tsx
→ 複数商品を一覧として構成
```

> **Tip**  
> ファイルを作るたびに「このファイルの責務を一文で説明できるか」を確認すると、大きなプロジェクトでも場所を探しやすくなる。

## 8. 覚え方

```text
Page
→ 画面全体を構成する

List
→ 複数項目を管理する

Card
→ 1件を表示する

Type
→ データの形を定義する

Data
→ 実際の値を持つ
```

今回の分離はコードを短くするためだけではなく、変更理由が異なる部分を別の責務として分けるためのリファクタリングである。

> **Tip**  
> 「何行になったら分割するか」ではなく、「変更される理由が別か」「独立した役割を説明できるか」を考える。

---

# English

## 1. What We Experienced

When the product list was first implemented, `products/page.tsx` handled both iterating over products and rendering the details of each individual product.

```tsx
<ul>
  {products.map((product) => (
    <li key={product.id}>
      <h2>{product.name}</h2>
      <span>{product.salePrice.toLocaleString()} won</span>
      <p>{product.description}</p>
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={300}
      />
    </li>
  ))}
</ul>
```

Once “render one product” became a clear responsibility, that part was extracted into `ProductCard`.

> **Tip**  
> Do not split a component only because the file is getting long. Look for a responsibility that can be described independently.

## 2. Responsibility of `ProductsPage`

`ProductsPage` is responsible for composing multiple products into a list.

```tsx
<ul>
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</ul>
```

It decides which products are displayed and handles the collection. It does not need to own the internal presentation of one product.

```text
ProductsPage
→ Compose the product list
→ Iterate over products
→ Handle the empty state
→ Arrange ProductCard components
```

> **Tip**  
> Let a page component organize the overall screen and delegate smaller presentation responsibilities to child components.

## 3. Responsibility of `ProductCard`

`ProductCard` is responsible for how one product is presented.

```tsx
type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <li>
      <h2>{product.name}</h2>
      <span>{product.salePrice.toLocaleString()} won</span>
      <p>{product.description}</p>
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={300}
      />
    </li>
  );
}
```

The component boundary is therefore “one product,” not the entire product collection.

> **Tip**  
> Check whether you can explain a component's responsibility in one sentence. `ProductCard = renders one product` is a clear boundary.

## 4. Why `ul` Stays Outside `ProductCard`

`ul` represents one list containing multiple items.

If every `ProductCard` owned its own `ul`, the resulting structure would look like this:

```html
<ul><li>Product 1</li></ul>
<ul><li>Product 2</li></ul>
<ul><li>Product 3</li></ul>
```

What we actually mean is:

```html
<ul>
  <li>Product 1</li>
  <li>Product 2</li>
  <li>Product 3</li>
</ul>
```

Therefore, `ProductsPage` owns the `ul`, while `ProductCard` owns the `li` representing one product.

> **Tip**  
> Semantic HTML structure can help reveal the correct component boundary.

## 5. Why `key` Belongs to the Parent

React uses `key` to identify sibling elements or components created by a repeated render.

```tsx
products.map((product) => (
  <ProductCard key={product.id} product={product} />
))
```

Because `ProductsPage` creates the repeated `ProductCard` elements, the `key` belongs at that location.

There is no need to repeat the same `key` on the internal `li`.

> **Tip**  
> As a practical rule, place `key` on the top-level element or component returned directly from `map()`.

## 6. Imports Move with Responsibilities

Before extraction, `ProductsPage` used `Image` directly.

After extraction, `ProductCard` became responsible for rendering the image, so the import moved with that responsibility.

```text
ProductsPage
├─ products
└─ ProductCard

ProductCard
├─ Product type
└─ Image
```

Unused imports should be removed from the page.

> **Tip**  
> After refactoring, review imports and dependencies as well as JSX. Dependencies should follow the responsibility that actually uses them.

## 7. Current Project Structure and Responsibilities

```text
src/
├─ app/
│  └─ products/
│     └─ page.tsx
├─ components/
│  └─ product/
│     └─ ProductCard.tsx
├─ data/
│  └─ products.ts
└─ types/
   └─ product.ts
```

```text
product.ts
→ Defines the Product data shape

products.ts
→ Holds actual product data

ProductCard.tsx
→ Renders one product

products/page.tsx
→ Composes multiple products into a list
```

> **Tip**  
> Whenever you create a file, check whether you can explain its responsibility in one sentence. This makes larger projects easier to navigate.

## 8. A Simple Way to Remember

```text
Page
→ Composes the overall screen

List
→ Manages multiple items

Card
→ Presents one item

Type
→ Defines the shape of data

Data
→ Holds actual values
```

This extraction is not merely about reducing lines of code. It separates parts of the application that have different reasons to change.

> **Tip**  
> Instead of asking how many lines justify a split, ask whether the code has a separate reason to change and an independently describable responsibility.

---

# 한국어

## 1. 이번에 경험한 내용

상품 목록을 처음 만들었을 때 `products/page.tsx` 안에서 상품 배열을 반복하는 일과 상품 하나의 내용을 표시하는 일을 모두 담당하고 있었다.

```tsx
<ul>
  {products.map((product) => (
    <li key={product.id}>
      <h2>{product.name}</h2>
      <span>{product.salePrice.toLocaleString()}원</span>
      <p>{product.description}</p>
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={300}
      />
    </li>
  ))}
</ul>
```

개발을 진행하면서 상품 하나를 표시한다는 독립적인 책임이 명확해졌기 때문에 해당 부분을 `ProductCard`로 분리했다.

> **팁**  
> 컴포넌트는 단순히 코드가 길어졌다는 이유만으로 분리하기보다 독립적으로 설명할 수 있는 책임이 생겼는지를 기준으로 판단한다.

## 2. `ProductsPage`의 책임

`ProductsPage`는 여러 상품을 하나의 목록으로 구성하는 책임을 가진다.

```tsx
<ul>
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</ul>
```

여기서는 어떤 상품들을 몇 개 보여줄지 관리한다. 반면 상품 하나의 내부 표현 방식까지 직접 담당할 필요는 없다.

```text
ProductsPage
→ 상품 목록 구성
→ products 반복
→ Empty State 처리
→ ProductCard 배치
```

> **팁**  
> 페이지 컴포넌트는 전체 화면 구성을 담당하고 세부적인 표시 책임은 하위 컴포넌트에 넘기면 구조를 파악하기 쉬워진다.

## 3. `ProductCard`의 책임

`ProductCard`는 상품 하나를 어떻게 보여줄지를 담당한다.

```tsx
type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <li>
      <h2>{product.name}</h2>
      <span>{product.salePrice.toLocaleString()}원</span>
      <p>{product.description}</p>
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={300}
      />
    </li>
  );
}
```

즉 상품 목록 전체가 아니라 상품 하나가 이 컴포넌트의 경계가 된다.

> **팁**  
> 컴포넌트 이름을 보고 책임을 한 문장으로 설명할 수 있는지 확인한다. `ProductCard = 상품 하나를 표시한다`처럼 설명할 수 있으면 경계가 명확하다.

## 4. 왜 `ul`까지 `ProductCard`로 옮기지 않는가

`ul`은 여러 상품을 하나의 목록으로 묶는 요소다.

각 `ProductCard`가 `ul`까지 가지면 결과적으로 다음 구조가 된다.

```html
<ul><li>상품 1</li></ul>
<ul><li>상품 2</li></ul>
<ul><li>상품 3</li></ul>
```

하지만 현재 표현하려는 의미는 다음과 같다.

```html
<ul>
  <li>상품 1</li>
  <li>상품 2</li>
  <li>상품 3</li>
</ul>
```

따라서 여러 상품을 관리하는 `ProductsPage`가 `ul`을 담당하고, 상품 하나를 나타내는 `ProductCard`가 `li`를 담당한다.

> **팁**  
> 시맨틱 HTML의 의미 구조를 먼저 생각하면 컴포넌트를 어디까지 분리해야 하는지도 자연스럽게 판단되는 경우가 많다.

## 5. `key`를 부모에 두는 이유

React의 `key`는 반복해서 만들어지는 형제 요소나 컴포넌트를 구분하기 위해 사용한다.

```tsx
products.map((product) => (
  <ProductCard key={product.id} product={product} />
))
```

반복을 생성하는 곳이 `ProductsPage`이므로 `key`도 이 위치에 둔다.

`ProductCard` 내부의 `li`에 같은 `key`를 다시 넣을 필요는 없다.

> **팁**  
> 실전에서는 `map()`이 직접 반환하는 최상위 요소 또는 컴포넌트에 `key`를 둔다고 기억하면 판단하기 쉽다.

## 6. Import도 책임과 함께 이동한다

분리하기 전에는 `ProductsPage`가 `Image`를 직접 사용했다.

분리한 뒤에는 이미지를 렌더링하는 책임이 `ProductCard`로 이동했기 때문에 Import도 함께 이동한다.

```text
ProductsPage
├─ products
└─ ProductCard

ProductCard
├─ Product type
└─ Image
```

페이지에서 더 이상 사용하지 않는 Import는 제거한다.

> **팁**  
> 리팩터링 후에는 JSX만 확인하지 말고 Import와 의존 관계도 새로운 책임에 맞게 이동했는지 확인한다.

## 7. 현재 프로젝트 구조와 책임

```text
src/
├─ app/
│  └─ products/
│     └─ page.tsx
├─ components/
│  └─ product/
│     └─ ProductCard.tsx
├─ data/
│  └─ products.ts
└─ types/
   └─ product.ts
```

```text
product.ts
→ Product 데이터 형태 정의

products.ts
→ 실제 상품 데이터 보관

ProductCard.tsx
→ 상품 하나를 화면에 표시

products/page.tsx
→ 여러 상품을 하나의 목록으로 구성
```

> **팁**  
> 파일을 만들 때마다 이 파일의 책임을 한 문장으로 설명할 수 있는지 확인하면 프로젝트가 커져도 파일 위치를 찾기가 훨씬 쉬워진다.

## 8. 기억하는 방법

```text
Page
→ 전체 화면을 구성

List
→ 여러 항목을 관리

Card
→ 항목 하나를 표현

Type
→ 데이터의 형태를 정의

Data
→ 실제 값을 보관
```

이번 컴포넌트 분리는 단순히 코드 줄 수를 줄이기 위한 작업이 아니다. 서로 다른 이유로 변경될 수 있는 코드를 각자의 책임으로 분리한 리팩터링이다.

> **팁**  
> 몇 줄이 되면 컴포넌트를 나눌지를 고민하기보다 변경되는 이유가 서로 다른지, 독립된 역할을 설명할 수 있는지를 기준으로 판단한다.
