# Day 7 --- Next.js `[id]` Dynamic Route 개발 Q&A

> **주제:** 주문 상세 페이지에서 왜 `[id]`가 필요한가?
>
> **언어 순서:** 日本語 → English → 한국어
>
> **학습 방식:** 개발 개념을 질문 → 짧은 답 → 상세 설명 → 코드/흐름 →
> 체크 질문 순서로 이해한다.

------------------------------------------------------------------------

# 日本語

## Q1. なぜ `[id]` が必要ですか？

### Answer

`[id]` は、**注文ごとに異なる値を URL の一部として扱うため**に必要です。

例えば：

``` text
/orders/1001
/orders/1002
/orders/1003
```

注文番号は毎回変わります。

そのため、注文ごとに別のフォルダを作るのではなく：

``` text
app/orders/[id]/page.tsx
```

という1つの Dynamic Route で複数の注文詳細 URL を処理します。

> **Tip**
>
> `[id]` は「id
> という固定文字」ではなく、**値が変わる場所を表すプレースホルダー**です。

------------------------------------------------------------------------

## Q2. 普通の `id` フォルダと `[id]` フォルダは何が違いますか？

### Answer

普通のフォルダ名は固定 URL になります。

``` text
app/orders/id/page.tsx
```

なら：

``` text
/orders/id
```

という固定 URL です。

一方：

``` text
app/orders/[id]/page.tsx
```

なら：

``` text
/orders/1001
/orders/1002
/orders/9999
```

のように `[id]` の位置を変えることができます。

> **Tip**
>
> `id` = 固定値、`[id]` = 可変値、と区別してください。

------------------------------------------------------------------------

## Q3. 注文が100件あったら、詳細ページも100個必要ですか？

### Answer

いいえ。

``` text
app/orders/[id]/page.tsx
```

1つだけで処理できます。

``` text
/orders/1
/orders/2
/orders/3
...
/orders/100
```

すべて同じ `[id]/page.tsx` に接続できます。

> **Tip**
>
> Dynamic Route
> の大きな利点は、**データ数とページファイル数を1:1にしなくてよいこと**です。

------------------------------------------------------------------------

## Q4. `/orders/123` の `123` はどうやって使いますか？

### Answer

次のステップで `useParams()` を使って読み取ります。

概念的には：

``` text
/orders/123
        ↓
       "123"
        ↓
useParams()
```

その値を注文検索に利用します。

> **Tip**
>
> `[id]` は値を受け取れる URL 構造を作り、`useParams()`
> は実際の値を読み取ります。役割を分けて覚えます。

------------------------------------------------------------------------

## Q5. `[id]` と `find()` はどのようにつながりますか？

### Answer

URL から取得した id を使って、保存されている `Order[]`
から注文1件を探します。

``` text
/orders/123
↓
id = 123
↓
Order[]
↓
find()
↓
id が 123 の Order
```

概念コード：

``` tsx
orders.find((order) => order.id === orderId)
```

> **Tip**
>
> `[id] → useParams() → find()`
> を1つの流れとして覚えると、詳細ページの仕組みが理解しやすくなります。

------------------------------------------------------------------------

## Q6. `[id]` がなければどうなりますか？

### Answer

`/orders` の一覧ページは作れますが、

``` text
/orders/1001
/orders/1002
```

のように **URL
で特定の注文を指定する詳細ページ構造**を作りにくくなります。

注文ごとに固定ページを手作業で増やす方法は、実際の動的データには適していません。

> **Tip**
>
> 商品詳細、ユーザー詳細、記事詳細など、「一覧 → 1件の詳細」という構造で
> Dynamic Route はよく使われます。

------------------------------------------------------------------------

# English

## Q1. Why do we need `[id]`?

### Answer

`[id]` is needed because **the value in that part of the URL changes for
each order**.

``` text
/orders/1001
/orders/1002
/orders/1003
```

Instead of creating one folder for every order, we create:

``` text
app/orders/[id]/page.tsx
```

and let one dynamic route handle many order detail URLs.

> **Tip**
>
> Think of `[id]` as a placeholder for a changing URL segment.

------------------------------------------------------------------------

## Q2. What is the difference between `id` and `[id]`?

### Answer

A normal folder creates a static route:

``` text
app/orders/id/page.tsx
→ /orders/id
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
> `id` means the literal path `id`; `[id]` means that position can
> contain different values.

------------------------------------------------------------------------

## Q3. Do we need 100 page files for 100 orders?

### Answer

No.

One:

``` text
app/orders/[id]/page.tsx
```

can handle:

``` text
/orders/1
/orders/2
...
/orders/100
```

> **Tip**
>
> Dynamic routing separates the number of data records from the number
> of route files.

------------------------------------------------------------------------

## Q4. How do we get `123` from `/orders/123`?

### Answer

We can read the dynamic URL parameter with `useParams()`.

``` text
/orders/123
        ↓
       "123"
        ↓
useParams()
```

> **Tip**
>
> `[id]` defines where the dynamic value goes. `useParams()` reads the
> value.

------------------------------------------------------------------------

## Q5. How does `[id]` connect to `find()`?

### Answer

The URL tells us which order the user wants, and `find()` locates that
order in `Order[]`.

``` text
/orders/123
↓
URL id
↓
Order[]
↓
find()
↓
matching Order
```

``` tsx
orders.find((order) => order.id === orderId)
```

> **Tip**
>
> Keep the responsibilities separate: route → parameter → data lookup →
> UI.

------------------------------------------------------------------------

## Q6. What is the complete mental model?

### Answer

``` text
Order history
/orders
↓
click one order
↓
/orders/123
↓
[id]
↓
useParams()
↓
"123"
↓
type conversion if needed
↓
find()
↓
Order
↓
Order Detail UI
```

> **Tip**
>
> If you can explain this flow without looking at code, you understand
> the purpose of `[id]`.

------------------------------------------------------------------------

# 한국어

## Q1. `[id]`는 왜 필요한가?

### 답변

`[id]`는 **주문마다 달라지는 값을 URL의 일부로 사용하기 위해**
필요합니다.

예를 들어:

``` text
/orders/1001
/orders/1002
/orders/1003
```

주문마다 마지막 값이 다릅니다.

주문마다 폴더를 따로 만드는 대신:

``` text
app/orders/[id]/page.tsx
```

하나를 만들어 여러 주문 상세 URL을 처리합니다.

> **팁**
>
> `[id]`는 실제 주문번호가 아니라 **주문번호가 들어갈 자리**입니다.

------------------------------------------------------------------------

## Q2. `id` 폴더와 `[id]` 폴더는 무엇이 다른가?

### 답변

일반 폴더:

``` text
app/orders/id/page.tsx
```

는:

``` text
/orders/id
```

라는 고정 주소가 됩니다.

반면:

``` text
app/orders/[id]/page.tsx
```

는:

``` text
/orders/1001
/orders/1002
/orders/9999
```

처럼 해당 위치의 값이 달라질 수 있습니다.

> **팁**
>
> `id` = 고정 문자열, `[id]` = 동적으로 바뀌는 자리라고 구분하세요.

------------------------------------------------------------------------

## Q3. 주문이 100개면 상세 페이지 파일도 100개 만들어야 하나?

### 답변

아닙니다.

``` text
app/orders/[id]/page.tsx
```

하나로:

``` text
/orders/1
/orders/2
/orders/3
...
/orders/100
```

을 모두 처리할 수 있습니다.

> **팁**
>
> 실제 쇼핑몰에서는 주문이 계속 생성되므로 주문마다 페이지 파일을 만드는
> 구조는 사용할 수 없습니다. 그래서 Dynamic Route가 필요합니다.

------------------------------------------------------------------------

## Q4. `/orders/123`에서 `123`은 어떻게 가져오는가?

### 답변

다음 단계에서 `useParams()`를 사용합니다.

``` text
/orders/123
        ↓
       "123"
        ↓
useParams()
```

즉:

``` text
[id]
↓
동적인 URL 자리를 정의

useParams()
↓
그 자리에 실제로 들어온 값을 읽음
```

입니다.

> **팁**
>
> `[id]`와 `useParams()`를 같은 기능이라고 생각하면 안 됩니다. 하나는
> **라우트 구조**, 하나는 **값 읽기**입니다.

------------------------------------------------------------------------

## Q5. 왜 URL의 id가 필요한가?

### 답변

주문 상세 페이지에서는 `Order[]` 전체가 아니라 **사용자가 선택한 주문
하나**가 필요하기 때문입니다.

``` text
Order[]
├─ id: 1001
├─ id: 1002
└─ id: 1003
```

사용자가:

``` text
/orders/1002
```

로 들어왔다면 애플리케이션은:

``` text
1002
```

를 기준으로 해당 주문을 찾아야 합니다.

> **팁**
>
> URL의 id는 애플리케이션에게 **어떤 주문을 보여줘야 하는가?**를
> 알려주는 값입니다.

------------------------------------------------------------------------

## Q6. `[id]`와 `find()`는 어떤 관계인가?

### 답변

`[id]`를 통해 URL에 주문 ID가 들어올 수 있게 만들고, `useParams()`로 그
값을 읽은 뒤, `find()`로 실제 주문을 찾습니다.

``` text
/orders/1002
↓
useParams()
↓
"1002"
↓
Number(...)
↓
1002
↓
orders.find(...)
↓
id === 1002인 Order
```

개념적으로:

``` tsx
orders.find((order) => order.id === orderId)
```

입니다.

> **팁**
>
> `find()`는 URL을 읽는 기능이 아닙니다. `find()`는 이미 얻은 id를
> 가지고 `Order[]`에서 데이터 하나를 찾는 역할입니다.

------------------------------------------------------------------------

## Q7. 왜 `string`과 `number` 이야기가 나오는가?

### 답변

현재 주문 타입이:

``` ts
id: number;
```

이고 URL에서 읽은 값이 문자열이라면:

``` ts
"123" === 123
```

은 `false`입니다.

따라서 필요한 경우:

``` text
"123"
↓
Number("123")
↓
123
```

으로 변환한 뒤 비교합니다.

> **팁**
>
> 타입 변환을 별도의 문법으로 외우기보다 **왜 `find()`가 주문을 못 찾을
> 수 있는가?**와 연결해서 이해하세요.

------------------------------------------------------------------------

## Q8. `[id]`가 없으면 주문 상세 페이지를 만들 수 없는가?

### 답변

상세 화면 자체를 만드는 것은 가능하지만, 주문처럼 계속 늘어나는 데이터에
대해:

``` text
/orders/1001
/orders/1002
/orders/1003
```

처럼 **각 데이터를 URL로 구분하는 구조**를 효율적으로 만들기
어려워집니다.

Dynamic Route를 사용하면 하나의 페이지 구조를 재사용할 수 있습니다.

> **팁**
>
> 이 패턴은 주문뿐 아니라 상품 상세 `/products/[id]`, 게시글
> `/posts/[id]`, 사용자 `/users/[id]` 같은 구조에도 그대로 적용됩니다.

------------------------------------------------------------------------

## Q9. Day 7에서 `[id]`의 역할만 한 문장으로 설명하면?

### 답변

> **`[id]`는 URL에서 주문마다 달라지는 ID가 들어갈 동적인 자리를 만드는
> Next.js Dynamic Route입니다.**

> **팁**
>
> 이 문장을 자기 말로 설명할 수 있으면 `[id]`의 목적은 제대로 이해한
> 것입니다.

------------------------------------------------------------------------

## Q10. Day 7 전체 흐름은?

### 답변

``` text
Day 6
Order[] 저장
↓
/orders
주문 목록
↓
상세보기 클릭

──────────────

Day 7
/orders/123
↓
[id]
↓
useParams()
↓
URL id
↓
string → number
↓
orders.find()
↓
Order 하나
↓
주문 상세 UI
```

> **팁**
>
> 앞으로 코드를 작성할 때도 이 순서를 그대로 따라가세요. 문제가 생기면
> **URL이 문제인지 → params가 문제인지 → 타입이 문제인지 → find가
> 문제인지** 단계별로 확인할 수 있습니다.

------------------------------------------------------------------------

# 개발자 셀프 체크

아래 질문에 코드 없이 답할 수 있는지 확인하세요.

1.  왜 `orders/id`가 아니라 `orders/[id]`인가?
2.  주문이 100개여도 `[id]/page.tsx` 하나로 가능한 이유는?
3.  `[id]`와 `useParams()`의 역할 차이는?
4.  `/orders/123`의 `123`은 무엇을 의미하는가?
5.  URL id를 왜 `number`로 변환할 수 있는가?
6.  `find()`는 어떤 데이터를 대상으로 무엇을 찾는가?
7.  `[id] → useParams() → find()`를 순서대로 설명할 수 있는가?

> **팁**
>
> 개발 공부에서는 객관식보다 **왜? → 어떻게? → 코드에서 어디?**를 직접
> 설명하는 Q&A 방식이 실제 구현과 디버깅에 더 잘 연결됩니다.
