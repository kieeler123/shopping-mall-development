# Next.js `[id]` Dynamic Route --- 3개 언어 학습 분석

## 0. 콘텐츠 정보

-   **콘텐츠 유형:** 개발 학습 / Next.js App Router
-   **주제:** 왜 `[id]` 동적 라우트가 필요한가?
-   **학습 초점:** Dynamic Route / URL Parameter / 주문 상세 페이지
-   **언어 순서:** 日本語 → English → 한국어

------------------------------------------------------------------------

# 日本語

## 1. 一言でいうと

`[id]` は、**注文ごとに変わる値を URL
の一部として受け取るため**に必要です。

例えば、注文が3件あるとします。

``` text
注文 1001
注文 1002
注文 1003
```

それぞれの詳細ページを開きたい場合、URL は次のようにできます。

``` text
/orders/1001
/orders/1002
/orders/1003
```

しかし、注文ごとにフォルダを作るのは現実的ではありません。

``` text
orders/
├─ 1001/page.tsx
├─ 1002/page.tsx
└─ 1003/page.tsx
```

そこで Next.js の Dynamic Route を使います。

``` text
orders/
└─ [id]/
   └─ page.tsx
```

この1つの `[id]/page.tsx`
が、`/orders/1001`、`/orders/1002`、`/orders/1003`
などをまとめて処理できます。

> **Tip**
>
> `[id]` は「id
> という固定文字」ではなく、**この位置には変化する値が入る**という印です。

## 2. 固定ルートとの違い

``` text
app/orders/detail/page.tsx
→ /orders/detail
```

`detail` は固定値です。

一方、

``` text
app/orders/[id]/page.tsx
→ /orders/1001
→ /orders/1002
→ /orders/9999
```

`[id]` の部分は URL によって変わります。

> **Tip**
>
> `detail` = 固定された部屋、`[id]` =
> 注文番号に応じて中身が変わる受付窓口、と考えると分かりやすいです。

## 3. 注文詳細ページで必要な理由

Day 6 では複数の注文を `Order[]` として保存しました。

``` text
Order[]
├─ id: 1001
├─ id: 1002
└─ id: 1003
```

Day 7 では URL を使って「どの注文を表示するか」を指定します。

``` text
/orders/1002
       ↓
      1002
       ↓
URL parameter
       ↓
orders.find(...)
       ↓
id = 1002 の Order
       ↓
注文詳細を表示
```

つまり `[id]` は、**URL と保存済みの注文データを結びつける入口**です。

> **Tip**
>
> `[id]` 自体が注文を探すわけではありません。まず URL
> の可変部分を受け取り、その値を後で `useParams()` や `find()`
> と組み合わせます。

------------------------------------------------------------------------

# English

## 1. In one sentence

`[id]` is needed to let **one Next.js route handle a changing value in
the URL**, such as an order ID.

Suppose there are three orders:

``` text
Order 1001
Order 1002
Order 1003
```

Their detail URLs can be:

``` text
/orders/1001
/orders/1002
/orders/1003
```

Creating a separate folder for every possible order would not scale.

``` text
orders/
├─ 1001/page.tsx
├─ 1002/page.tsx
└─ 1003/page.tsx
```

Instead, Next.js lets us create one dynamic route:

``` text
orders/
└─ [id]/
   └─ page.tsx
```

The same page can then handle many different order IDs.

> **Tip**
>
> Think of `[id]` as a **placeholder for a changing URL segment**, not
> as the literal text `id`.

## 2. Static route vs dynamic route

A normal folder creates a fixed route:

``` text
app/orders/detail/page.tsx
→ /orders/detail
```

A bracketed folder creates a dynamic segment:

``` text
app/orders/[id]/page.tsx
→ /orders/1001
→ /orders/1002
→ /orders/9999
```

> **Tip**
>
> Ask yourself: "Is this part of the URL always the same?" If yes, use a
> normal folder. If the value changes for each resource, a dynamic
> segment such as `[id]` is appropriate.

## 3. Why it matters for the order detail page

Day 6 stored multiple orders as `Order[]`. Day 7 needs to choose one of
them.

``` text
/orders/1002
       ↓
      "1002"
       ↓
read URL parameter
       ↓
convert type if necessary
       ↓
orders.find(...)
       ↓
Order with id 1002
       ↓
render Detail UI
```

So `[id]` provides the changing value that tells the application **which
order the user wants to view**.

> **Tip**
>
> Separate the responsibilities: `[id]` defines the dynamic URL
> position, `useParams()` reads its value, and `find()` uses that value
> to locate the matching order.

------------------------------------------------------------------------

# 한국어

## 1. 한 문장으로

`[id]`는 **주문마다 달라지는 값을 URL에서 받을 수 있도록 하기 위해**
필요합니다.

주문이 다음처럼 있다고 해봅시다.

``` text
주문 1001
주문 1002
주문 1003
```

각 주문의 상세 주소를:

``` text
/orders/1001
/orders/1002
/orders/1003
```

처럼 만들고 싶습니다.

그런데 주문마다 실제 폴더를 만드는 것은 불가능에 가깝습니다.

``` text
orders/
├─ 1001/page.tsx
├─ 1002/page.tsx
└─ 1003/page.tsx
```

주문이 새로 생길 때마다 폴더를 만들 수는 없기 때문입니다.

그래서:

``` text
orders/
└─ [id]/
   └─ page.tsx
```

하나를 만들고 여러 URL을 같은 페이지가 처리하도록 합니다.

> **팁**
>
> `[id]`를 **주문번호가 들어갈 빈칸**이라고 생각하세요.

## 2. 일반 폴더와 `[id]`의 차이

``` text
orders/detail/page.tsx
```

라면:

``` text
/orders/detail
```

처럼 `detail`이 고정됩니다.

하지만:

``` text
orders/[id]/page.tsx
```

라면:

``` text
/orders/1001
/orders/1002
/orders/7777
```

처럼 그 위치의 값이 달라질 수 있습니다.

``` text
/orders/[ 빈칸 ]
         ↑
      여기가 id

/orders/1001
/orders/1002
```

> **팁**
>
> URL에서 **항상 같은 부분은 일반 폴더**, 데이터마다 **달라지는 부분은
> `[id]` 같은 Dynamic Route**라고 구분하면 됩니다.

## 3. 주문 상세 페이지와 연결하면

Day 6에서 우리는 여러 주문을:

``` text
Order[]
```

로 저장했습니다.

Day 7에서는 그중 하나를 선택해야 합니다.

``` text
/orders/1002
       ↓
URL에 1002가 들어 있음
       ↓
useParams()로 읽기
       ↓
필요하면 string → number 변환
       ↓
orders.find(...)
       ↓
id가 1002인 주문 하나
       ↓
상세 페이지 출력
```

따라서 `[id]`의 역할은:

> **어떤 주문을 보고 싶은지 URL을 통해 구분할 수 있게 만드는 것**

입니다.

> **팁**
>
> 역할을 섞지 마세요.
>
> -   `[id]` → URL에서 값이 바뀔 자리를 만든다.
> -   `useParams()` → 그 값을 읽는다.
> -   `find()` → 그 값과 같은 주문을 찾는다.
> -   Detail UI → 찾은 주문을 화면에 보여준다.

## 4. 최종 핵심 구조

``` text
[id]
↓
동적으로 변하는 URL 자리

/orders/123
↓
123을 URL parameter로 읽음

useParams()
↓
id 획득

orders.find(...)
↓
해당 Order 찾기

Order
↓
주문 상세 UI
```

### 반드시 기억할 것

1.  `[id]`는 실제 주문번호가 아니다.
2.  `[id]`는 URL에서 값이 변하는 위치를 의미한다.
3.  주문마다 별도의 페이지 파일을 만들 필요가 없게 해준다.
4.  `/orders/123`, `/orders/456`을 같은 `[id]/page.tsx`에서 처리할 수
    있다.
5.  이후 `useParams()`와 `find()`를 연결해서 실제 주문 하나를 찾는다.

> **팁**
>
> Day 7 전체를 한 문장으로 외우면: **Dynamic Route `[id]`로 주문 ID를
> URL에 넣고 → `useParams()`로 읽고 → `find()`로 `Order[]`에서 주문
> 하나를 찾는다.**
