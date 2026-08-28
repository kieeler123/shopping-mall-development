# Day 5 Development Plan --- Checkout Page & Controlled Form

# 日本語

## 1. Day 5 のテーマ

Day 5 のテーマは：

**カートのデータを注文ページにつなげ、React state
で入力フォームを管理する。**

Day 4 までの流れ：

``` text
商品詳細
↓
カートに追加
↓
数量変更
↓
商品削除
↓
localStorage 同期
↓
合計金額計算
```

Day 5 ではここから：

``` text
/cart
↓
注文する
↓
/checkout
↓
注文商品確認
↓
配送情報入力
↓
最終注文金額確認
```

へ進む。

> **Tip**
>
> Day 5 では実際の決済 API はまだ実装しない。まず「カート → 注文ページ →
> 入力フォーム」というデータフローを理解することを優先する。

------------------------------------------------------------------------

## 2. `/cart` に注文ボタンを追加

カートの合計金額の下に注文ページへ移動する UI を追加する。

例：

``` tsx
<Link href="/checkout">
  注文する
</Link>
```

目標：

``` text
/cart
↓
注文するをクリック
↓
/checkout
```

> **Tip**
>
> 最初から checkout 全体を作らず、まずページ遷移だけ成功させる。

------------------------------------------------------------------------

## 3. `/checkout` ページを作る

Next.js App Router の場合：

``` text
app
├─ cart
│  └─ page.tsx
│
└─ checkout
   └─ page.tsx
```

最初は最低限：

``` tsx
export default function CheckoutPage() {
  return (
    <main>
      <h1>注文書</h1>
    </main>
  );
}
```

から始める。

> **Tip**
>
> 新しいページは「ルート作成 → 表示確認 → 機能追加」の順番で作る。

------------------------------------------------------------------------

## 4. checkout で cart を読み込む

`/checkout` でも注文商品を表示するために cart データが必要になる。

最初は Day 4 で学んだ localStorage の仕組みを再利用する。

``` text
/checkout
↓
localStorage.getItem("cart")
↓
JSON.parse()
↓
cart state
↓
注文商品を表示
```

ここで `/cart` と `/checkout`
の両方に似た読み込み処理が現れる可能性がある。

> **Tip**
>
> 重複が見えてもすぐに高度な状態管理へ移行せず、まず「なぜ共通化したいのか」をコードから確認する。

------------------------------------------------------------------------

## 5. 注文商品一覧を表示

checkout は cart の編集画面ではなく確認画面として作る。

表示候補：

``` text
商品名
価格
数量
商品ごとの小計
```

商品情報は Day 4 と同じように：

``` tsx
const product = products.find(
  (product) => product.id === item.productId,
);
```

で取得できる。

商品ごとの小計：

``` tsx
product.salePrice * item.quantity
```

> **Tip**
>
> `/cart` は編集、`/checkout`
> は確認というように、同じデータでもページごとの役割を分ける。

------------------------------------------------------------------------

## 6. 最終注文金額を計算

Day 4 で学んだ `reduce()` を再利用する。

``` tsx
const totalPrice = cart.reduce((total, item) => {
  const product = products.find(
    (product) => product.id === item.productId,
  );

  if (!product) {
    return total;
  }

  return total + product.salePrice * item.quantity;
}, 0);
```

確認すること：

``` text
/cart の合計金額
=
/checkout の合計金額
```

> **Tip**
>
> 新しい文法を増やすだけでなく、Day 4 の `find()` と `reduce()`
> を別ページで再利用して理解を固める。

------------------------------------------------------------------------

## 7. 配送情報フォームを作る

最初の入力項目：

``` text
名前
連絡先
住所
```

例えば名前 state：

``` tsx
const [name, setName] = useState("");
```

input：

``` tsx
<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

Day 5 の新しい中心概念は **Controlled Component** である。

> **Tip**
>
> 最初は名前 input
> 1つだけを作り、`入力 → onChange → setName → state → value`
> の流れを理解してから項目を増やす。

------------------------------------------------------------------------

## 8. Controlled Input のデータフロー

``` text
ユーザーが入力
↓
onChange
↓
e.target.value
↓
setName()
↓
name state 更新
↓
再レンダー
↓
input value に反映
```

> **Tip**
>
> input の表示値と React state がつながっていることが Controlled
> Component の核心。

------------------------------------------------------------------------

## 9. Day 5 の実装順序

``` text
1. /cart に注文するボタン追加
↓
2. /checkout ページ作成
↓
3. /checkout で cart 読み込み
↓
4. 注文商品一覧表示
↓
5. 商品ごとの小計表示
↓
6. reduce() で最終注文金額表示
↓
7. 名前 input
↓
8. 連絡先 input
↓
9. 住所 input
↓
10. value / onChange / useState 接続
↓
11. 全体動作確認
```

> **Tip**
>
> 各ステップが動いてから次へ進む。複数機能を一度に追加しない。

------------------------------------------------------------------------

## 10. Day 5 の学習ポイント

  機能                  学習内容
  --------------------- ------------------------------
  `/checkout` 移動      Next.js ページ遷移
  商品表示              `map()` 復習
  商品検索              `find()` 復習
  合計金額              `reduce()` 復習
  入力フォーム          `useState`
  入力変更              `onChange`
  state と input 接続   Controlled Component
  cart 再利用           ページ間のデータ管理を考える

> **Tip**
>
> Day 5 の新しい中心テーマはフォーム state。配列メソッドは Day 4
> の復習として使う。

------------------------------------------------------------------------

## 11. Day 5 完了条件

-   [ ] `/cart` から `/checkout` へ移動できる
-   [ ] checkout に注文商品が表示される
-   [ ] 数量が表示される
-   [ ] 商品ごとの小計が表示される
-   [ ] 最終注文金額が表示される
-   [ ] 名前を入力できる
-   [ ] 連絡先を入力できる
-   [ ] 住所を入力できる
-   [ ] input と React state が接続されている

> **Tip**
>
> ここまで完了すれば Day 5
> は終了。実際の決済やサーバーへの注文保存は次の段階に分ける。

------------------------------------------------------------------------

# English

## 1. Day 5 Theme

The Day 5 theme is:

**Connect cart data to a checkout page and manage form inputs with React
state.**

The flow completed through Day 4:

``` text
Product detail
↓
Add to cart
↓
Change quantity
↓
Remove products
↓
Synchronize localStorage
↓
Calculate total
```

Day 5 continues with:

``` text
/cart
↓
Checkout
↓
/checkout
↓
Review order
↓
Enter shipping information
↓
Review final total
```

> **Tip**
>
> Do not add a real payment API yet. First understand the cart →
> checkout → form data flow.

------------------------------------------------------------------------

## 2. Add a Checkout Link to `/cart`

Add navigation below the cart total.

``` tsx
<Link href="/checkout">
  주문하기
</Link>
```

Goal:

``` text
/cart
↓
click checkout
↓
/checkout
```

> **Tip**
>
> Start by verifying navigation before building the entire checkout UI.

------------------------------------------------------------------------

## 3. Create `/checkout`

With the Next.js App Router:

``` text
app
├─ cart
│  └─ page.tsx
│
└─ checkout
   └─ page.tsx
```

Start small:

``` tsx
export default function CheckoutPage() {
  return (
    <main>
      <h1>주문서</h1>
    </main>
  );
}
```

> **Tip**
>
> Build new pages in this order: route → render check → functionality.

------------------------------------------------------------------------

## 4. Load Cart Data on Checkout

The checkout page needs the same cart data.

Initially, reuse the localStorage concepts from Day 4.

``` text
/checkout
↓
localStorage.getItem("cart")
↓
JSON.parse()
↓
cart state
↓
render order items
```

Similar loading logic may now appear on both `/cart` and `/checkout`.

> **Tip**
>
> Do not immediately introduce a state-management library. First observe
> the duplication and understand why shared state may eventually help.

------------------------------------------------------------------------

## 5. Render the Order Items

The checkout page is primarily for review rather than editing.

Display:

``` text
Product name
Price
Quantity
Item subtotal
```

Find product information with:

``` tsx
const product = products.find(
  (product) => product.id === item.productId,
);
```

Calculate an item subtotal with:

``` tsx
product.salePrice * item.quantity
```

> **Tip**
>
> The same cart data can have different UI responsibilities: `/cart`
> edits it, while `/checkout` reviews it.

------------------------------------------------------------------------

## 6. Calculate the Final Order Total

Reuse `reduce()` from Day 4.

``` tsx
const totalPrice = cart.reduce((total, item) => {
  const product = products.find(
    (product) => product.id === item.productId,
  );

  if (!product) {
    return total;
  }

  return total + product.salePrice * item.quantity;
}, 0);
```

Verify:

``` text
/cart total
=
/checkout total
```

> **Tip**
>
> Reusing `find()` and `reduce()` on another page reinforces the Day 4
> concepts.

------------------------------------------------------------------------

## 7. Build the Shipping Form

Initial fields:

``` text
Name
Phone
Address
```

Example state:

``` tsx
const [name, setName] = useState("");
```

Input:

``` tsx
<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

The major new Day 5 concept is the **Controlled Component**.

> **Tip**
>
> Start with one input. Understand input → onChange → state → value
> before adding the other fields.

------------------------------------------------------------------------

## 8. Controlled Input Data Flow

``` text
user types
↓
onChange
↓
e.target.value
↓
setName()
↓
name state changes
↓
re-render
↓
input value reflects state
```

> **Tip**
>
> The key idea is that React state controls the value displayed by the
> input.

------------------------------------------------------------------------

## 9. Day 5 Implementation Order

``` text
1. Add checkout navigation to /cart
↓
2. Create /checkout
↓
3. Load cart on /checkout
↓
4. Render order items
↓
5. Render item subtotals
↓
6. Calculate final total with reduce()
↓
7. Add name input
↓
8. Add phone input
↓
9. Add address input
↓
10. Connect value / onChange / useState
↓
11. Test the complete flow
```

> **Tip**
>
> Complete and test each small step before adding the next one.

------------------------------------------------------------------------

## 10. Day 5 Learning Points

  Feature                    Concept
  -------------------------- ------------------------------
  Navigate to `/checkout`    Next.js navigation
  Render products            Review `map()`
  Find product data          Review `find()`
  Calculate total            Review `reduce()`
  Form inputs                `useState`
  Handle typing              `onChange`
  Connect state and inputs   Controlled Components
  Reuse cart                 Think about cross-page state

> **Tip**
>
> Form state is the main new topic. The array methods serve as Day 4
> review.

------------------------------------------------------------------------

## 11. Day 5 Completion Criteria

-   [ ] Navigate from `/cart` to `/checkout`
-   [ ] Render checkout products
-   [ ] Render quantities
-   [ ] Render item subtotals
-   [ ] Render final order total
-   [ ] Enter a name
-   [ ] Enter a phone number
-   [ ] Enter an address
-   [ ] Inputs are controlled by React state

> **Tip**
>
> Stop Day 5 here. Real payment and server-side order persistence can be
> separate later milestones.

------------------------------------------------------------------------

# 한국어

## 1. Day 5 주제

Day 5의 주제는:

**장바구니 데이터를 주문서 페이지로 연결하고 React state로 입력 폼을
관리한다.**

Day 4까지의 흐름:

``` text
상품 상세
↓
장바구니 담기
↓
수량 변경
↓
상품 삭제
↓
localStorage 동기화
↓
총액 계산
```

Day 5에서는:

``` text
/cart
↓
주문하기
↓
/checkout
↓
주문 상품 확인
↓
배송 정보 입력
↓
최종 주문 금액 확인
```

으로 이어간다.

> **팁**
>
> 실제 결제 API는 아직 붙이지 않는다. 먼저 장바구니 데이터가 주문서까지
> 어떻게 이동하고 입력값이 어떻게 state가 되는지를 이해하는 데 집중한다.

------------------------------------------------------------------------

## 2. `/cart`에 주문하기 버튼 추가

장바구니 총액 아래에서 `/checkout`으로 이동할 수 있도록 한다.

예:

``` tsx
<Link href="/checkout">
  주문하기
</Link>
```

목표:

``` text
/cart
↓
주문하기 클릭
↓
/checkout
```

> **팁**
>
> checkout UI를 한 번에 만들지 말고 먼저 페이지 이동 하나만 정상
> 동작하는지 확인한다.

------------------------------------------------------------------------

## 3. `/checkout` 페이지 생성

Next.js App Router 기준:

``` text
app
├─ cart
│  └─ page.tsx
│
└─ checkout
   └─ page.tsx
```

처음에는:

``` tsx
export default function CheckoutPage() {
  return (
    <main>
      <h1>주문서</h1>
    </main>
  );
}
```

정도만 작성한다.

> **팁**
>
> 새 페이지는 `라우트 생성 → 화면 출력 확인 → 기능 추가` 순서로 진행하면
> 디버깅하기 쉽다.

------------------------------------------------------------------------

## 4. checkout에서 cart 불러오기

`/checkout`에서도 주문 상품을 보여줘야 하므로 cart 데이터가 필요하다.

처음에는 Day 4에서 배운 localStorage 방식을 재사용한다.

``` text
/checkout 진입
↓
localStorage.getItem("cart")
↓
JSON.parse()
↓
cart state
↓
주문 상품 출력
```

이 과정에서 `/cart`와 `/checkout`에 비슷한 cart 로딩 코드가 생길 수
있다.

> **팁**
>
> 중복이 보인다고 바로 Context나 Zustand로 넘어갈 필요는 없다. 먼저
> 중복을 직접 경험하고 왜 공통 상태 관리가 필요한지를 이해하는 것이
> 좋다.

------------------------------------------------------------------------

## 5. 주문 상품 목록 출력

checkout은 장바구니 수정 페이지가 아니라 주문 확인 페이지로 만든다.

표시할 정보:

``` text
상품명
가격
수량
상품별 소계
```

상품 정보는:

``` tsx
const product = products.find(
  (product) => product.id === item.productId,
);
```

로 찾는다.

상품별 소계:

``` tsx
product.salePrice * item.quantity
```

> **팁**
>
> 같은 cart 데이터라도 `/cart`에서는 수정용, `/checkout`에서는
> 확인용이라는 역할 차이를 생각하자.

------------------------------------------------------------------------

## 6. 최종 주문 금액 계산

Day 4에서 배운 `reduce()`를 다시 사용한다.

``` tsx
const totalPrice = cart.reduce((total, item) => {
  const product = products.find(
    (product) => product.id === item.productId,
  );

  if (!product) {
    return total;
  }

  return total + product.salePrice * item.quantity;
}, 0);
```

확인할 것:

``` text
/cart 총액
=
/checkout 총액
```

> **팁**
>
> Day 5에서 무조건 새로운 문법만 배우려 하지 말고 `find()`와
> `reduce()`를 다시 사용해서 Day 4 내용을 복습한다.

------------------------------------------------------------------------

## 7. 배송 정보 입력 폼 만들기

첫 입력 항목은 다음 정도로 잡는다.

``` text
이름
연락처
주소
```

예를 들어 이름 state:

``` tsx
const [name, setName] = useState("");
```

input:

``` tsx
<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

여기서 Day 5의 새로운 핵심 개념인 **Controlled Component**를 배운다.

> **팁**
>
> 처음부터 세 input을 모두 만들지 말고 이름 input 하나로
> `입력 → onChange → setName → state → value` 흐름을 먼저 이해한다.

------------------------------------------------------------------------

## 8. Controlled Input 데이터 흐름

``` text
사용자가 입력
↓
onChange 발생
↓
e.target.value
↓
setName()
↓
name state 변경
↓
재렌더링
↓
input의 value에 state 반영
```

즉 React state가 input에 표시되는 값을 관리한다.

> **팁**
>
> `value={name}`과 `onChange`를 한 쌍으로 보자. value는 현재 상태를
> 보여주고, onChange는 새로운 입력을 state에 반영한다.

------------------------------------------------------------------------

## 9. Day 5 구현 순서

``` text
1. /cart에 주문하기 버튼 추가
↓
2. /checkout 페이지 생성
↓
3. /checkout에서 cart 불러오기
↓
4. 주문 상품 목록 출력
↓
5. 상품별 소계 출력
↓
6. reduce()로 최종 주문 금액 출력
↓
7. 이름 input 구현
↓
8. 연락처 input 구현
↓
9. 주소 input 구현
↓
10. value / onChange / useState 연결
↓
11. 전체 동작 테스트
```

> **팁**
>
> 하나가 정상 작동한 것을 확인한 다음 다음 단계로 넘어간다. 여러 기능을
> 동시에 추가하면 어디에서 문제가 발생했는지 찾기 어려워진다.

------------------------------------------------------------------------

## 10. Day 5 핵심 학습 개념

  구현 기능             학습 개념
  --------------------- ----------------------------
  `/checkout` 이동      Next.js 페이지 이동
  주문 상품 출력        `map()` 복습
  실제 상품 정보 찾기   `find()` 복습
  최종 주문 금액        `reduce()` 복습
  배송 정보 입력        `useState`
  입력값 변경           `onChange`
  input과 state 연결    Controlled Component
  cart 데이터 재사용    페이지 간 데이터 관리 고민

> **팁**
>
> Day 4의 핵심이 배열 메서드와 cart state였다면 Day 5의 새로운 핵심은
> `폼 입력값을 React state로 관리하는 것`이다.

------------------------------------------------------------------------

## 11. Day 5 완료 조건

-   [ ] `/cart`에서 `/checkout`으로 이동할 수 있다.
-   [ ] checkout에 주문 상품이 출력된다.
-   [ ] 상품 수량이 출력된다.
-   [ ] 상품별 소계가 출력된다.
-   [ ] 최종 주문 금액이 출력된다.
-   [ ] 이름을 입력할 수 있다.
-   [ ] 연락처를 입력할 수 있다.
-   [ ] 주소를 입력할 수 있다.
-   [ ] input과 React state가 연결되어 있다.

> **팁**
>
> 여기까지 완료하면 Day 5를 종료한다. 실제 결제 처리와 서버 주문 저장은
> 다음 학습 단계로 분리한다.

------------------------------------------------------------------------

## 12. Day 5 한 줄 요약

``` text
장바구니 데이터를 주문서로 연결하고,
React state로 배송 정보 입력 폼을 관리한다.
```

Day 5의 전체 흐름:

``` text
/cart
↓
주문하기
↓
/checkout
↓
localStorage에서 cart 복원
↓
find() / map()으로 주문 상품 표시
↓
reduce()로 최종 금액 계산
↓
input
↓
onChange
↓
useState
↓
배송 정보 state 관리
```

> **팁**
>
> 다음 학습을 시작할 때는 이 문서 전체를 다시 읽기보다 첫 단계인
> `/cart → /checkout` 이동부터 바로 구현하고, 필요한 부분을 그때그때
> 참고한다.
