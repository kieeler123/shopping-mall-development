# Shopping Mall Development Plan — Day 3
# ショッピングモール開発計画 — Day 3
# 쇼핑몰 개발 계획 — Day 3

---

# 日本語

## 1. Day 3の目標

Day 2では、商品一覧から商品詳細ページまでの閲覧フローを完成させた。

Day 3ではその詳細ページを基盤にして、ユーザーが商品を選択し、数量を指定してカートへ追加し、カートページで確認できるところまでを目標とする。

```text
商品詳細
↓
数量選択
↓
カートに追加
↓
localStorageへ保存
↓
カートページ
↓
追加した商品を確認
```

Day 3の中心テーマは、ルーティングよりも「ユーザー操作によって変化する状態」を扱うことである。

> **Tip**  
> Day 3では機能を一度に増やさず、「商品をカートへ追加して確認する」という1つのユーザーフローを完成させる。

## 2. `CartItem`型を考える

商品そのものを表す`Product`とは別に、カートでは「どの商品を何個入れたか」という情報が必要になる。

基本形の候補は次のようになる。

```ts
type CartItem = {
  productId: number;
  quantity: number;
};
```

`Product`と`CartItem`の責務を分ける。

```text
Product
→ 商品そのものの情報

CartItem
→ カート内の商品IDと数量
```

> **Tip**  
> 商品情報とカート状態を同じ型へ無理にまとめず、それぞれが何を表しているかで型を分ける。

## 3. Client Componentを経験する

Day 2の商品詳細ページは、商品を検索して表示することが中心だった。

Day 3ではボタン操作や数量変更が入るため、ユーザー操作を担当する部分ではClient Componentが必要になる。

```text
ProductDetailPage
→ 商品を取得・表示するページ

AddToCart
→ 数量変更
→ ボタンクリック
→ ブラウザ側の処理
```

必要な部分だけをClient Componentとして分離する方向で進める。

```tsx
"use client";
```

> **Tip**  
> ページ全体をClient Componentにするのではなく、ブラウザ操作が必要な小さな部分だけを分離する考え方を身につける。

## 4. `useState`で数量を管理する

商品詳細ページで数量を変更できるようにする。

最初は次のような単純なUIを想定する。

```text
数量

[-] 1 [+]
```

数量はユーザー操作によって変化するため、`useState`で管理する。

```ts
const [quantity, setQuantity] = useState(1);
```

基本ルールとして数量は1未満にならないようにする。

> **Tip**  
> `useState`は単なる文法として覚えず、「画面上で変化し、その変化をReactに記憶してほしい値」に使用する。

## 5. カート追加ボタンを作る

数量を選択した後、商品をカートへ追加するボタンを用意する。

```text
[-] 2 [+]

[カートに追加]
```

クリック時には少なくとも次の情報を扱う。

```text
productId
quantity
```

Day 3では購入処理や注文処理までは行わず、「カートへ入れる」という責務だけに集中する。

> **Tip**  
> ボタン1つに注文・決済などの将来機能まで入れず、現在の責務を明確に保つ。

## 6. `localStorage`へ保存する

Day 3では認証やDBをまだ使用しないため、ブラウザの`localStorage`を使ってカートを保存する。

保存データのイメージは次の通り。

```json
[
  {
    "productId": 1,
    "quantity": 2
  }
]
```

`localStorage`は文字列を保存するため、配列やオブジェクトを保存するときはJSON変換が必要になる。

```text
JavaScript Object
↓
JSON.stringify()
↓
localStorage

localStorage
↓
JSON.parse()
↓
JavaScript Object
```

> **Tip**  
> `localStorage`そのものだけでなく、なぜ`JSON.stringify()`と`JSON.parse()`が必要になるかをセットで理解する。

## 7. 同じ商品を再度追加した場合を考える

最初の実装が動いた後、同じ商品をもう一度追加した場合の動作を考える。

例えば、

```text
商品1 × 2
```

がすでに存在するときに、

```text
商品1 × 1
```

を追加した場合、

```text
商品1 × 3
```

へ数量をまとめる方法がある。

ただし最初から複雑にせず、まず保存が成功するところまで作ってから改善する。

> **Tip**  
> 最初の実装と改善を分ける。まず「保存できる」、次に「同じ商品を正しく統合できる」という順番で進める。

## 8. カートページを作る

新しいルートとしてカートページを作る。

```text
app/
└─ cart/
   └─ page.tsx
```

最初の完成条件は、保存した商品を読み込み、商品と数量を確認できること。

```text
カート

商品A
数量: 2
価格: 19,900円
```

必要に応じて`productId`から既存の`products`データを検索して商品情報と接続する。

> **Tip**  
> Day 2で学んだ「IDから商品を検索する」という考え方をカートでも再利用する。

## 9. Day 3で学ぶデータフロー

Day 3では次のデータフローを理解する。

```text
Product
↓
商品詳細
↓
quantity state
↓
カート追加イベント
↓
CartItem
↓
localStorage
↓
カートページ
↓
productIdから商品情報を検索
↓
画面表示
```

Day 2がURLを中心としたデータフローなら、Day 3はユーザー操作とブラウザ状態を中心としたデータフローになる。

> **Tip**  
> Day 2とDay 3を別々の知識として考えず、「商品データがどこを通って画面へ届くか」という流れで比較する。

## 10. Day 3ではまだ行わないこと

Day 3の範囲を広げすぎないため、次の機能は後のDayへ回す。

```text
カート内数量変更
商品削除
合計金額の本格的な管理
注文
決済
ログインユーザー別カート
DBへのカート保存
```

Day 3では「商品を選択してカートへ保存し、確認する」ことを完成条件とする。

> **Tip**  
> 実務レベルを目指す場合でも、すべてを同時に作る必要はない。機能を完成可能な単位に分けることも実務的な設計の一部である。

## 11. 予想されるファイル構造

Day 3の進行によって、必要になった責務から次のようなファイルが追加される可能性がある。

```text
app/
└─ cart/
   └─ page.tsx

src/
├─ components/
│  ├─ product/
│  │  ├─ ProductCard.tsx
│  │  └─ AddToCart.tsx
│  └─ cart/
│     └─ CartItem.tsx
├─ types/
│  ├─ product.ts
│  └─ cart.ts
└─ lib/
   └─ cart.ts
```

ただし、最初からすべてのファイルを作るのではなく、責務が実際に発生した時点で分離する。

> **Tip**  
> フォルダ構造を先に完成させるのではなく、重複や独立した責務が見えたときにファイルを作る。

## 12. Day 3の実装順序

```text
1. CartItem型を定義
↓
2. AddToCart領域を作る
↓
3. Client Componentを理解
↓
4. useStateで数量を管理
↓
5. カート追加ボタン
↓
6. localStorageへ保存
↓
7. /cartページを作成
↓
8. 保存データを読み込む
↓
9. 商品データと接続
↓
10. 全体テスト
```

> **Tip**  
> 各段階が動くことを確認してから次へ進む。複数の問題を同時にデバッグしないようにする。

## 13. Day 3の完了条件

最終的に次のユーザーフローが成功すればDay 3完了とする。

```text
/products/1
↓
数量を2に変更
↓
カートに追加
↓
localStorageへ保存
↓
/cart
↓
商品1と数量2を確認
```

さらにブラウザを更新しても保存内容を再取得できることを確認する。

> **Tip**  
> 正常なクリックだけでなく、ページ更新後にもカートが残るか確認することで`localStorage`を使う意味を体験する。

## 14. Day 2からDay 3への接続

```text
Day 1
プロジェクトの土台を作る

Day 2
商品を見ることができる

Day 3
商品を選択してカートへ追加できる
```

Day 3では、静的に「表示する」だけだった商品UIが、ユーザー操作によって状態を持つUIへ発展する。

> **Tip**  
> Day 3の重要な成果はカート画面そのものより、「ユーザー操作 → React state → ブラウザ保存」という新しい状態管理の流れを理解することである。

---

# English

## 1. Day 3 Goal

Day 2 completed the browsing flow from the product list to the product detail page.

Day 3 will build on the detail page so that a user can select a quantity, add a product to the cart, persist it, and confirm it on the cart page.

```text
Product detail
↓
Select quantity
↓
Add to cart
↓
Save to localStorage
↓
Cart page
↓
Confirm added product
```

The main theme of Day 3 is handling state that changes through user interaction rather than focusing primarily on routing.

> **Tip**  
> Keep Day 3 focused on one complete user flow: add a product to the cart and confirm that it was saved.

## 2. Designing the `CartItem` Type

Unlike `Product`, which represents the product itself, the cart needs information about which product was added and how many units were selected.

A basic candidate is:

```ts
type CartItem = {
  productId: number;
  quantity: number;
};
```

The responsibilities are separated as follows:

```text
Product
→ Information about the product itself

CartItem
→ Product ID and quantity in the cart
```

> **Tip**  
> Do not force product information and cart state into the same type. Separate types according to what each piece of data represents.

## 3. Experiencing Client Components

On Day 2, the product detail page mainly looked up and rendered data.

Day 3 introduces button clicks and quantity changes, so the part responsible for user interaction will require a Client Component.

```text
ProductDetailPage
→ Retrieve and display a product

AddToCart
→ Change quantity
→ Handle button clicks
→ Browser-side behavior
```

Only the interactive area should be separated into a Client Component when possible.

```tsx
"use client";
```

> **Tip**  
> Avoid converting the whole page into a Client Component automatically. Isolate the smallest area that actually requires browser interaction.

## 4. Managing Quantity with `useState`

The product detail page will allow the user to change the quantity.

A simple initial UI can be:

```text
Quantity

[-] 1 [+]
```

Because quantity changes through user interaction, it can be managed with `useState`.

```ts
const [quantity, setQuantity] = useState(1);
```

The basic rule will be to prevent the quantity from going below 1.

> **Tip**  
> Do not memorize `useState` only as syntax. Use it for values that change on the screen and need React to remember their current value.

## 5. Creating the Add-to-Cart Button

After choosing a quantity, the user needs a button to add the product to the cart.

```text
[-] 2 [+]

[Add to cart]
```

At minimum, the click handler needs:

```text
productId
quantity
```

Day 3 will focus only on adding to the cart, not ordering or payment.

> **Tip**  
> Keep each button's responsibility narrow. Do not mix future order and payment behavior into the current add-to-cart action.

## 6. Saving to `localStorage`

Authentication and a database are not part of Day 3 yet, so the cart will be persisted using browser `localStorage`.

A possible stored structure is:

```json
[
  {
    "productId": 1,
    "quantity": 2
  }
]
```

Because `localStorage` stores strings, arrays and objects need JSON conversion.

```text
JavaScript Object
↓
JSON.stringify()
↓
localStorage

localStorage
↓
JSON.parse()
↓
JavaScript Object
```

> **Tip**  
> Learn `localStorage` together with the reason `JSON.stringify()` and `JSON.parse()` are needed.

## 7. Adding the Same Product Again

After the basic implementation works, consider what should happen when the same product is added again.

For example, if the cart already contains:

```text
Product 1 × 2
```

and the user adds:

```text
Product 1 × 1
```

the quantities can be merged into:

```text
Product 1 × 3
```

However, the first goal is simply to save the cart successfully before improving duplicate handling.

> **Tip**  
> Separate the first working implementation from improvements: first make saving work, then make repeated additions behave correctly.

## 8. Creating the Cart Page

Create a new route for the cart.

```text
app/
└─ cart/
   └─ page.tsx
```

The initial completion condition is to load the saved cart and display the product and quantity.

```text
Cart

Product A
Quantity: 2
Price: 19,900
```

When necessary, use `productId` to find the matching product from the existing `products` data.

> **Tip**  
> Reuse the Day 2 idea of looking up a product by ID instead of inventing a completely new data flow.

## 9. Day 3 Data Flow

Day 3 introduces this data flow:

```text
Product
↓
Product detail
↓
quantity state
↓
Add-to-cart event
↓
CartItem
↓
localStorage
↓
Cart page
↓
Look up product by productId
↓
Render UI
```

If Day 2 was mainly a URL-driven data flow, Day 3 is mainly a user-interaction and browser-state flow.

> **Tip**  
> Compare Day 2 and Day 3 by tracing where product data travels instead of treating them as unrelated topics.

## 10. What Day 3 Will Not Cover Yet

To keep the scope manageable, the following features will be postponed:

```text
Changing quantity inside the cart
Removing products
Full total-price management
Orders
Payments
Per-user carts
Database cart persistence
```

Day 3 is complete when a product can be selected, stored in the cart, and confirmed.

> **Tip**  
> Even in a production-oriented project, building everything at once is unnecessary. Breaking features into finishable units is itself a practical development skill.

## 11. Expected File Structure

As Day 3 progresses, responsibilities may naturally lead to files such as:

```text
app/
└─ cart/
   └─ page.tsx

src/
├─ components/
│  ├─ product/
│  │  ├─ ProductCard.tsx
│  │  └─ AddToCart.tsx
│  └─ cart/
│     └─ CartItem.tsx
├─ types/
│  ├─ product.ts
│  └─ cart.ts
└─ lib/
   └─ cart.ts
```

These files should not all be created in advance. Extract them when their responsibilities actually appear.

> **Tip**  
> Let the project structure grow from real responsibilities and duplication instead of designing every folder before implementation begins.

## 12. Day 3 Implementation Order

```text
1. Define CartItem
↓
2. Create the AddToCart area
↓
3. Understand Client Components
↓
4. Manage quantity with useState
↓
5. Add the cart button
↓
6. Save to localStorage
↓
7. Create /cart
↓
8. Read saved cart data
↓
9. Connect cart data with product data
↓
10. Test the complete flow
```

> **Tip**  
> Verify that each step works before adding the next one. This keeps multiple unrelated bugs from being debugged at the same time.

## 13. Day 3 Completion Criteria

Day 3 is complete when this user flow works:

```text
/products/1
↓
Change quantity to 2
↓
Add to cart
↓
Save to localStorage
↓
/cart
↓
Confirm Product 1 with quantity 2
```

Also confirm that the saved cart can still be loaded after refreshing the browser.

> **Tip**  
> Test persistence after a page refresh, not only the immediate button click. That demonstrates why `localStorage` is being used.

## 14. Connecting Day 2 to Day 3

```text
Day 1
Build the project foundation

Day 2
View products

Day 3
Select a product and add it to the cart
```

Day 3 evolves the product UI from something that only displays data into an interface that holds state and responds to user interaction.

> **Tip**  
> The most important Day 3 result is not merely a cart screen. It is understanding the flow `user interaction → React state → browser persistence`.

---

# 한국어

## 1. Day 3 목표

Day 2에서는 상품 목록에서 상품 상세 페이지까지 이어지는 상품 탐색 흐름을 완성했다.

Day 3에서는 이 상세 페이지를 기반으로 사용자가 상품 수량을 선택하고 장바구니에 담은 뒤, 저장된 상품을 장바구니 페이지에서 확인할 수 있는 단계까지 진행한다.

```text
상품 상세
↓
수량 선택
↓
장바구니 담기
↓
localStorage 저장
↓
장바구니 페이지
↓
담은 상품 확인
```

Day 3의 중심 주제는 라우팅보다는 **사용자 조작에 따라 변하는 상태를 다루는 것**이다.

> **팁**  
> Day 3에서는 기능을 한꺼번에 늘리지 말고 `상품을 장바구니에 담고 확인한다`라는 사용자 흐름 하나를 완성하는 데 집중한다.

## 2. `CartItem` 타입 설계

상품 자체를 나타내는 `Product`와 달리 장바구니에서는 어떤 상품을 몇 개 담았는지에 대한 정보가 필요하다.

기본 형태의 후보는 다음과 같다.

```ts
type CartItem = {
  productId: number;
  quantity: number;
};
```

두 타입의 책임을 구분하면 다음과 같다.

```text
Product
→ 상품 자체의 정보

CartItem
→ 장바구니에 담긴 상품 ID와 수량
```

> **팁**  
> 상품 정보와 장바구니 상태를 하나의 타입에 억지로 합치지 말고 각각 무엇을 표현하는 데이터인지에 따라 타입을 나눈다.

## 3. Client Component 경험

Day 2의 상품 상세 페이지는 상품을 조회하고 화면에 보여주는 역할이 중심이었다.

Day 3부터는 버튼 클릭과 수량 변경이 들어오기 때문에 사용자 상호작용을 담당하는 부분에는 Client Component가 필요해진다.

```text
ProductDetailPage
→ 상품 조회 및 표시

AddToCart
→ 수량 변경
→ 버튼 클릭
→ 브라우저 측 처리
```

가능하면 상호작용이 필요한 부분만 Client Component로 분리한다.

```tsx
"use client";
```

> **팁**  
> 페이지 전체를 무조건 Client Component로 바꾸기보다 실제 브라우저 상호작용이 필요한 작은 영역만 분리하는 방법을 익힌다.

## 4. `useState`로 수량 관리

상품 상세 페이지에서 사용자가 수량을 변경할 수 있도록 만든다.

처음에는 다음처럼 단순한 UI로 시작할 수 있다.

```text
수량

[-] 1 [+]
```

수량은 사용자 조작에 따라 변하기 때문에 `useState`로 관리한다.

```ts
const [quantity, setQuantity] = useState(1);
```

기본적으로 수량이 1보다 작아지지 않도록 처리한다.

> **팁**  
> `useState`를 단순 문법으로 외우지 말고 화면에서 값이 변하고 React가 현재 값을 기억해야 할 때 사용하는 상태 관리 도구라고 이해한다.

## 5. 장바구니 담기 버튼

수량을 선택한 뒤 상품을 장바구니에 넣을 버튼을 만든다.

```text
[-] 2 [+]

[장바구니 담기]
```

클릭할 때 최소한 다음 정보를 다룬다.

```text
productId
quantity
```

Day 3에서는 주문이나 결제까지 연결하지 않고 `장바구니에 담는다`라는 책임만 처리한다.

> **팁**  
> 하나의 버튼에 앞으로 만들 주문·결제 기능까지 섞지 말고 현재 필요한 책임만 명확하게 유지한다.

## 6. `localStorage`에 저장

Day 3에서는 아직 로그인이나 DB를 사용하지 않으므로 브라우저의 `localStorage`에 장바구니를 저장한다.

저장 형태의 예시는 다음과 같다.

```json
[
  {
    "productId": 1,
    "quantity": 2
  }
]
```

`localStorage`는 문자열을 저장하므로 배열이나 객체를 저장하려면 JSON 변환이 필요하다.

```text
JavaScript Object
↓
JSON.stringify()
↓
localStorage

localStorage
↓
JSON.parse()
↓
JavaScript Object
```

> **팁**  
> `localStorage` 사용법만 외우지 말고 왜 `JSON.stringify()`와 `JSON.parse()`가 함께 필요한지도 이해한다.

## 7. 같은 상품을 다시 담는 경우

기본 저장 기능이 동작한 다음 같은 상품을 다시 담았을 때 어떻게 처리할지 생각한다.

예를 들어 이미:

```text
상품 1 × 2
```

가 들어 있는데 다시:

```text
상품 1 × 1
```

을 담았다면:

```text
상품 1 × 3
```

으로 수량을 합치는 방법이 있다.

다만 처음부터 복잡하게 구현하지 않고 우선 저장 성공을 확인한 다음 개선한다.

> **팁**  
> 최초 구현과 개선을 분리한다. 먼저 `저장된다`를 만들고 그다음 `같은 상품을 올바르게 합친다`로 발전시킨다.

## 8. 장바구니 페이지 생성

새로운 라우트로 장바구니 페이지를 만든다.

```text
app/
└─ cart/
   └─ page.tsx
```

첫 번째 완료 기준은 저장한 장바구니 데이터를 읽고 상품과 수량을 화면에서 확인할 수 있는 것이다.

```text
장바구니

상품 A
수량: 2
가격: 19,900원
```

필요하면 `productId`를 이용해 기존 `products` 데이터에서 해당 상품을 다시 찾는다.

> **팁**  
> Day 2에서 경험한 `ID로 상품 하나를 조회한다`라는 개념을 장바구니에서도 재사용한다.

## 9. Day 3에서 배우는 데이터 흐름

Day 3에서는 다음 흐름을 경험하게 된다.

```text
Product
↓
상품 상세
↓
quantity state
↓
장바구니 담기 이벤트
↓
CartItem
↓
localStorage
↓
장바구니 페이지
↓
productId로 상품 조회
↓
화면 출력
```

Day 2가 URL을 중심으로 한 데이터 흐름이었다면 Day 3는 사용자 조작과 브라우저 상태를 중심으로 한 데이터 흐름이다.

> **팁**  
> Day 2와 Day 3를 서로 다른 지식으로 외우기보다 상품 데이터가 어디를 거쳐 화면까지 이동하는지를 기준으로 비교한다.

## 10. Day 3에서 아직 하지 않을 것

Day 3의 범위가 너무 커지지 않도록 다음 기능은 이후 Day로 넘긴다.

```text
장바구니 안에서 수량 변경
상품 삭제
본격적인 총액 관리
주문
결제
로그인 사용자별 장바구니
DB 장바구니 저장
```

Day 3에서는 상품을 선택해 장바구니에 저장하고 확인하는 것까지를 완료 기준으로 잡는다.

> **팁**  
> 실무급 프로젝트를 목표로 하더라도 모든 기능을 동시에 만드는 것은 아니다. 기능을 완성 가능한 단위로 나누는 것 자체가 실무적인 개발 방식이다.

## 11. 예상 파일 구조

Day 3를 진행하면서 실제 책임이 생기면 다음과 같은 파일이 추가될 수 있다.

```text
app/
└─ cart/
   └─ page.tsx

src/
├─ components/
│  ├─ product/
│  │  ├─ ProductCard.tsx
│  │  └─ AddToCart.tsx
│  └─ cart/
│     └─ CartItem.tsx
├─ types/
│  ├─ product.ts
│  └─ cart.ts
└─ lib/
   └─ cart.ts
```

하지만 처음부터 모든 파일을 만들어놓지 않고 실제 책임이 생기는 시점에 분리한다.

> **팁**  
> 폴더 구조를 먼저 완성하려 하지 말고 중복이나 독립적인 책임이 실제 코드에서 보이기 시작할 때 파일을 만든다.

## 12. Day 3 구현 순서

```text
1. CartItem 타입 정의
↓
2. AddToCart 영역 만들기
↓
3. Client Component 이해
↓
4. useState로 수량 관리
↓
5. 장바구니 담기 버튼
↓
6. localStorage 저장
↓
7. /cart 페이지 생성
↓
8. 저장 데이터 읽기
↓
9. 상품 데이터와 연결
↓
10. 전체 흐름 테스트
```

> **팁**  
> 각 단계가 정상적으로 동작하는지 확인한 뒤 다음 단계로 넘어간다. 여러 문제를 한꺼번에 디버깅하지 않는 습관을 만든다.

## 13. Day 3 완료 기준

최종적으로 다음 사용자 흐름이 성공하면 Day 3를 완료한다.

```text
/products/1
↓
수량을 2로 변경
↓
장바구니 담기
↓
localStorage 저장
↓
/cart
↓
1번 상품 + 수량 2 확인
```

추가로 브라우저를 새로고침한 뒤에도 저장된 장바구니를 다시 읽을 수 있는지 확인한다.

> **팁**  
> 버튼을 누른 직후만 확인하지 말고 새로고침 후에도 장바구니가 유지되는지 테스트해야 `localStorage`를 사용하는 이유를 제대로 경험할 수 있다.

## 14. Day 2에서 Day 3로 연결

```text
Day 1
프로젝트 밑바탕 만들기

Day 2
상품을 볼 수 있게 만들기

Day 3
상품을 선택해서 장바구니에 담을 수 있게 만들기
```

Day 3부터는 단순히 데이터를 표시하던 상품 UI가 사용자 조작에 반응하고 상태를 가지는 UI로 발전한다.

> **팁**  
> Day 3의 가장 중요한 결과는 장바구니 화면 자체보다 `사용자 조작 → React state → 브라우저 저장`이라는 새로운 상태 관리 흐름을 이해하는 것이다.
