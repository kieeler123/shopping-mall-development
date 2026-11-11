# Day 7 開発計画 / Development Plan / 개발 계획

> **テーマ / Theme / 주제:** 注文詳細ページ / Order Detail Page / 주문
> 상세 페이지\
> **学習方針 / Learning approach / 학습 방향:** Day 6
> の注文履歴を土台に、動的ルーティング・URL パラメータ・`find()`
> を追加する。

------------------------------------------------------------------------

# 日本語

## 1. Day 7 の目標

Day 6 では、注文を `Order` オブジェクトとして作成し、`orders[]` として
`localStorage`
に保存し、注文完了ページと注文履歴ページに表示できるようにした。

Day 7 では、その注文履歴の中から
**特定の注文を選択し、その注文だけを詳細ページに表示する機能**を作る。

最終的な流れ：

``` text
/orders
注文履歴一覧
↓
特定の注文の「詳細を見る」をクリック
↓
/orders/[id]
↓
URL の id を取得
↓
localStorage の orders[] を読み込む
↓
id が一致する Order を find() で探す
↓
注文詳細を表示
```

> **ヒント**
>
> Day 7 の中心は「ページを1つ増やすこと」ではなく、**URL
> の値と保存済みデータを結びつけること**です。

## 2. Day 6 から引き継ぐ知識

Day 7 では次の Day 6 の知識をそのまま再利用する。

``` text
Order
Order[]
CartItem[]
localStorage
JSON.parse()
JSON.stringify()
useState()
useEffect()
loading
Truthy / Falsy
条件付きレンダリング
map()
find()
Date
```

特に Day 6 では商品を探すために：

``` tsx
products.find(
  (product) => product.id === item.productId
)
```

を使った。

Day 7 では同じ `find()` の考え方を注文に適用する。

``` text
商品一覧から productId で商品を探す
↓
注文一覧から URL の id で注文を探す
```

> **ヒント**
>
> 新しいメソッドを大量に覚える日ではありません。すでに使った `find()`
> を別のデータに応用します。

## 3. 新しく学ぶ概念

### 3.1 Dynamic Route

Next.js App Router では、フォルダ名を：

``` text
[id]
```

のようにすると動的な URL を扱える。

Day 7 のページ構造：

``` text
app
└─ orders
   ├─ page.tsx
   └─ [id]
      └─ page.tsx
```

これにより：

``` text
/orders/123
/orders/456
/orders/789
```

のような異なる URL を同じ `[id]/page.tsx` で扱える。

> **ヒント**
>
> `[id]` は文字列 `"id"` 固定の URL
> ではなく、「この位置の値が変わる」という意味です。

### 3.2 `Link`

`/orders` の注文一覧から注文詳細ページへ移動できるようにする。

概念：

``` tsx
<Link href={`/orders/${order.id}`}>
  詳細を見る
</Link>
```

注文ごとに異なる `order.id` が URL に入る。

``` text
order.id = 123
→ /orders/123
```

> **ヒント**
>
> テンプレートリテラル `` `/orders/${order.id}` `` が「固定部分 +
> 動的な値」を作っていることを確認します。

### 3.3 URL Parameter

詳細ページでは URL の `[id]` に入った値を取得する。

Day 7 では `useParams()` を使って URL パラメータを読む方法を学ぶ。

概念：

``` text
/orders/123
        ↓
       123
        ↓
URL parameter
```

> **ヒント**
>
> URL から取得する値は、現在の `Order.id` の `number`
> と型が異なる可能性があるため、型を意識します。

### 3.4 `string` と `number`

現在の型：

``` ts
id: number;
```

一方、URL パラメータは文字列として扱う場面がある。

そのため概念的には：

``` text
URL id
string
↓
Number(...)
↓
number
↓
order.id と比較
```

という変換が必要になる。

> **ヒント**
>
> `===` は型まで比較するため、`"123" === 123` は `false` です。

### 3.5 `find()` で特定の注文を探す

`orders[]` 全体を表示するのではなく、URL の id と一致する注文1件を探す。

概念：

``` ts
orders.find((order) => order.id === orderId)
```

`find()` は条件に一致する最初の要素を返し、見つからなければ `undefined`
になる。

> **ヒント**
>
> `map()` は「全部を処理」、`find()`
> は「条件に合う1件を探す」と区別します。

## 4. 実装ステップ

### STEP 1 --- `[id]` フォルダを作る

``` text
app/orders/[id]/page.tsx
```

まず動的ルートが何を意味するか確認する。

### STEP 2 --- 注文一覧に詳細リンクを追加

既存の `/orders` ページで各注文から詳細ページへ移動できるようにする。

### STEP 3 --- 詳細ページで URL の id を取得

`useParams()` と URL parameter の関係を学ぶ。

### STEP 4 --- localStorage から `orders[]` を読む

Day 6 のコードを復習する。

``` text
localStorage
↓
getItem("orders")
↓
JSON.parse()
↓
Order[]
```

### STEP 5 --- `find()` で注文1件を探す

``` text
Order[]
+
URL id
↓
find()
↓
Order 1件
```

### STEP 6 --- 注文詳細を表示

表示候補：

``` text
注文番号
注文日時
名前
電話番号
住所
注文商品
数量
価格
小計
合計金額
```

### STEP 7 --- 注文が見つからない場合を処理

例えば存在しない URL：

``` text
/orders/999999
```

にアクセスした場合：

``` text
注文が見つかりません。
```

のような UI を表示する。

### STEP 8 --- loading / not found / success を分ける

詳細ページでも状態を分ける。

``` text
1. 読み込み中
2. 注文が見つからない
3. 注文が見つかった
```

> **ヒント**
>
> Day 6 の `/orders` で学んだ loading
> の考え方を、今度は注文詳細ページに再利用します。

## 5. Day 7 の完成条件

次の動作がすべてできれば Day 7 完了。

``` text
[ ] /orders に注文履歴が表示される
[ ] 各注文に詳細ページへのリンクがある
[ ] /orders/[id] に移動できる
[ ] URL の id を取得できる
[ ] localStorage から orders[] を読み込める
[ ] find() で該当する注文を取得できる
[ ] 注文情報と商品情報を表示できる
[ ] 存在しない注文 id を処理できる
[ ] loading 状態を処理できる
```

## 6. Day 7 ではやらないこと

Day 7 の学習範囲を明確にするため、次はまだ実装しない。

``` text
注文削除
注文キャンセル
注文内容の編集
決済 API
サーバー DB
ログインユーザー別注文
配送ステータス
在庫管理
本番用注文番号
```

> **ヒント**
>
> Day 7 は CRUD 全体を作る日ではなく、**Dynamic Route → Parameter →
> find() → Detail UI** の流れを理解する日にします。

## 7. Day 7 の核心

``` text
Day 6
Order[] を保存して一覧表示
↓
Day 7
URL で1件を指定
↓
id を取得
↓
find()
↓
Order 1件
↓
詳細表示
```

------------------------------------------------------------------------

# English

## 1. Day 7 Goal

Day 6 created completed `Order` objects, stored them in `orders[]` in
localStorage, and displayed them on the order-complete and order-history
pages.

Day 7 extends that structure by allowing the user to select **one
specific order** and open its detail page.

``` text
/orders
↓
click an order detail link
↓
/orders/[id]
↓
read id from the URL
↓
read orders[] from localStorage
↓
find the matching Order
↓
render the order details
```

> **Tip**
>
> The main goal is to connect a dynamic value in the URL to previously
> stored application data.

## 2. Concepts Reused from Day 6

``` text
Order / Order[]
localStorage
JSON.parse()
useState()
useEffect()
loading
Truthy / Falsy
conditional rendering
map()
find()
Date
```

The `find()` concept previously used to locate products will now be
applied to orders.

> **Tip**
>
> Day 7 is mostly an extension of existing concepts rather than a
> completely new architecture.

## 3. New Concepts

### Dynamic Routes

Create:

``` text
app/orders/[id]/page.tsx
```

The same page structure can handle URLs such as:

``` text
/orders/123
/orders/456
/orders/789
```

> **Tip**
>
> `[id]` represents a changing URL segment.

### `Link`

From each item in `/orders`, create navigation to its detail URL.

``` tsx
<Link href={`/orders/${order.id}`}>
  View details
</Link>
```

### URL Parameters

Learn how to read the dynamic `[id]` value using `useParams()`.

``` text
/orders/123
        ↓
       123
```

### `string` vs `number`

The current `Order` type uses:

``` ts
id: number;
```

A URL parameter may be handled as a string, so Day 7 introduces explicit
type conversion and strict equality.

``` text
"123"
↓ Number(...)
123
```

> **Tip**
>
> Remember that `"123" === 123` is false.

### Finding One Order

``` ts
orders.find((order) => order.id === orderId)
```

`find()` returns the first matching element or `undefined` if nothing
matches.

> **Tip**
>
> `map()` processes many items; `find()` searches for one matching item.

## 4. Implementation Steps

``` text
STEP 1  Create app/orders/[id]/page.tsx
STEP 2  Add a detail Link to /orders
STEP 3  Read the URL id
STEP 4  Read orders[] from localStorage
STEP 5  Convert/compare the id correctly
STEP 6  find() the matching Order
STEP 7  Render order and item details
STEP 8  Handle loading and missing orders
```

> **Tip**
>
> Implement one step at a time instead of writing the entire detail page
> at once.

## 5. Completion Criteria

Day 7 is complete when the application can navigate from an
order-history item to `/orders/[id]`, identify the correct order from
localStorage, display its details, and handle an invalid order id.

## 6. Out of Scope

Do not add payment APIs, databases, authentication, order
deletion/cancellation/editing, inventory management, delivery status, or
production-grade order numbers yet.

> **Tip**
>
> Keep the learning target focused on **Dynamic Route → Parameter →
> find() → Detail UI**.

## 7. Core Mental Model

``` text
Day 6
Order[]
↓
Day 7
URL id
↓
find()
↓
Order
↓
Detail UI
```

------------------------------------------------------------------------

# 한국어

## 1. Day 7 목표

Day 6에서는 주문 정보를 하나의 `Order` 객체로 만들고, 완료된 주문들을
`orders[]`로 localStorage에 저장한 뒤 주문 완료 페이지와 주문 내역
페이지에서 확인했습니다.

Day 7에서는 여기서 한 단계 확장해서 **주문 내역 중 특정 주문 하나를
선택하고 해당 주문의 상세 페이지를 보여주는 기능**을 만듭니다.

``` text
/orders
주문 내역
↓
특정 주문의 상세보기 클릭
↓
/orders/[id]
↓
URL의 id 가져오기
↓
localStorage의 orders[] 읽기
↓
id가 같은 Order 찾기
↓
주문 상세 정보 출력
```

> **팁**
>
> Day 7의 핵심은 페이지를 하나 더 만드는 것이 아니라 **URL의 동적 값과
> 저장된 주문 데이터를 연결하는 것**입니다.

## 2. Day 6에서 다시 사용하는 개념

``` text
Order
Order[]
CartItem[]
localStorage
JSON.parse()
useState()
useEffect()
loading
Truthy / Falsy
조건부 렌더링
map()
find()
Date
```

Day 6에서는:

``` tsx
products.find(
  (product) => product.id === item.productId
)
```

처럼 상품을 찾았습니다.

Day 7에서는 같은 생각을 주문에 적용합니다.

``` text
products에서 productId로 상품 찾기
↓
orders에서 URL id로 주문 찾기
```

> **팁**
>
> `find()`라는 새로운 문법을 배우는 것이 아니라 **이미 사용했던 find를
> 다른 데이터에 적용하는 연습**이라고 생각하세요.

## 3. 새롭게 배우는 개념

### 3.1 Dynamic Route

Next.js App Router에서:

``` text
[id]
```

같은 폴더를 사용하면 URL의 특정 부분이 바뀌는 동적 경로를 만들 수
있습니다.

``` text
app
└─ orders
   ├─ page.tsx
   └─ [id]
      └─ page.tsx
```

그러면 하나의 `[id]/page.tsx`가:

``` text
/orders/123
/orders/456
/orders/789
```

같은 여러 주소를 처리할 수 있습니다.

> **팁**
>
> `[id]`는 주소에 문자 그대로 `[id]`가 들어간다는 뜻이 아니라 **그
> 위치의 값이 달라질 수 있다는 표시**입니다.

### 3.2 `Link`

`/orders`에서 특정 주문의 상세 페이지로 이동할 수 있도록 연결합니다.

개념적으로:

``` tsx
<Link href={`/orders/${order.id}`}>
  상세보기
</Link>
```

`order.id`가 `123`이라면:

``` text
/orders/123
```

으로 연결됩니다.

> **팁**
>
> 여기서 템플릿 리터럴의 `${order.id}`가 주문마다 서로 다른 URL을 만드는
> 부분입니다.

### 3.3 URL Parameter

상세 페이지에서는 `[id]` 위치에 들어온 값을 읽어야 합니다.

Day 7에서는 `useParams()`를 이용해 URL 파라미터를 가져오는 방법을
공부합니다.

``` text
/orders/123
        ↓
       123
        ↓
URL parameter
```

### 3.4 `string`과 `number`

현재 `Order` 타입은:

``` ts
id: number;
```

입니다.

URL에서 가져온 값은 문자열로 다루는 상황이 있기 때문에 다음 관계를
공부합니다.

``` text
URL id
string
↓
Number(...)
↓
number
↓
order.id와 비교
```

그리고 strict equality:

``` ts
"123" === 123
// false
```

도 연결해서 이해합니다.

> **팁**
>
> Day 7에서 타입 변환을 따로 외우기보다 **왜 주문을 찾지 못하는지
> 해결하는 과정에서 string과 number의 차이를 배우는 것**이 좋습니다.

### 3.5 `find()`로 주문 하나 찾기

전체 주문:

``` ts
Order[]
```

중에서 URL의 id와 같은 주문 하나를 찾습니다.

개념:

``` ts
orders.find((order) => order.id === orderId)
```

`find()`는 조건에 맞는 첫 번째 요소를 반환하고, 없으면 `undefined`가
됩니다.

> **팁**
>
> `map()`은 여러 데이터를 하나씩 처리하고, `find()`는 조건에 맞는
> **하나를 찾는다**고 구분하세요.

## 4. Day 7 구현 순서

### STEP 1 --- `[id]` 동적 라우트 만들기

``` text
app/orders/[id]/page.tsx
```

먼저 `[id]`가 URL에서 어떤 역할을 하는지 확인합니다.

### STEP 2 --- `/orders`에 상세보기 링크 추가

각 주문에서 해당 주문의 상세 페이지로 이동할 수 있도록 합니다.

### STEP 3 --- URL의 id 가져오기

`useParams()`와 URL parameter의 관계를 공부합니다.

### STEP 4 --- localStorage에서 `orders[]` 읽기

Day 6 복습입니다.

``` text
localStorage
↓
getItem("orders")
↓
JSON.parse()
↓
Order[]
```

### STEP 5 --- URL id와 `order.id` 비교하기

필요한 경우 문자열을 숫자로 변환한 뒤 비교합니다.

### STEP 6 --- `find()`로 주문 하나 찾기

``` text
Order[]
+
URL id
↓
find()
↓
Order 하나
```

### STEP 7 --- 주문 상세 정보 출력

다음 정보를 표시하는 것을 목표로 합니다.

``` text
주문번호
주문시간
이름
전화번호
주소
주문 상품
상품 가격
수량
소계
총 주문금액
```

### STEP 8 --- UI 상태 처리

상세 페이지에서도 최소한 다음 세 상태를 구분합니다.

``` text
1. 주문을 확인하는 중
2. 주문을 찾을 수 없음
3. 주문을 정상적으로 찾음
```

> **팁**
>
> 이 부분은 Day 6에서 배운 `loading`을 새로운 페이지에서 다시 사용하는
> 복습입니다.

## 5. Day 7 완료 조건

``` text
[ ] /orders에서 주문 내역 확인
[ ] 각 주문에 상세보기 링크 존재
[ ] /orders/[id]로 이동 가능
[ ] URL의 id를 읽을 수 있음
[ ] localStorage에서 orders[] 읽기
[ ] find()로 해당 주문 찾기
[ ] 주문 정보 출력
[ ] 주문 상품 목록 출력
[ ] 잘못된 id 처리
[ ] loading 처리
```

> **팁**
>
> 체크리스트를 전부 만족하면 Day 7 완료로 보고 다음 기능으로 넘어가면
> 됩니다.

## 6. Day 7에서 하지 않을 것

이번에는 다음 기능까지 확장하지 않습니다.

``` text
주문 삭제
주문 취소
주문 수정
결제 API
서버 DB
로그인 사용자별 주문
배송 상태
재고 관리
실서비스용 주문번호
```

Day 7의 학습 초점이 흐려지지 않도록 하기 위해서입니다.

> **팁**
>
> Day 7을 **Dynamic Route → Parameter → find() → Detail UI** 네 단계로
> 기억하세요.

## 7. Day 6 → Day 7 연결

``` text
Day 6
여러 주문 저장
↓
Order[]
↓
주문 목록 표시
↓
────────────────
↓
Day 7
특정 주문 선택
↓
/orders/[id]
↓
URL parameter
↓
find()
↓
Order 하나
↓
상세 화면
```

## 8. Day 7 학습 완료 후 설명할 수 있어야 하는 것

Day 7이 끝난 뒤에는 코드 없이 다음 질문에 답할 수 있는 것이 목표입니다.

``` text
왜 [id] 폴더를 사용하는가?

Link의 href에 왜 order.id를 넣는가?

URL에서 받은 id와 Order.id의 타입은 왜 확인해야 하는가?

map()과 find()의 역할은 어떻게 다른가?

find() 결과가 없으면 어떻게 되는가?

왜 상세 페이지에도 loading 상태가 필요한가?

Order[]에서 어떻게 Order 하나를 찾는가?
```

> **팁**
>
> 기능이 동작하는 것만으로 끝내지 말고 이 질문들을 자신의 말로 설명할 수
> 있으면 Day 7의 핵심 개념까지 제대로 학습한 것입니다.
