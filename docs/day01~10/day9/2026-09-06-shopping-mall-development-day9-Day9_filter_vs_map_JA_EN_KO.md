# Day 9 --- `filter()` vs `map()`

## 日本語 → English → 한국어

------------------------------------------------------------------------

# 1. 日本語

## Day 8 `filter()` vs Day 9 `map()`

Day 8 と Day 9 の違いを先に理解すると、Day 9
のコードがずっと分かりやすくなります。

核心となる質問は一つです。

> **配列からどの注文を削除するのか？**\
> vs\
> **配列の各注文を何に変えるのか？**

------------------------------------------------------------------------

## 1. 注文が3件あるとする

``` tsx
const orders = [
  {
    id: 1001,
    productName: "Mouse",
    status: "支払完了",
  },
  {
    id: 1002,
    productName: "Keyboard",
    status: "支払完了",
  },
  {
    id: 1003,
    productName: "Monitor",
    status: "支払完了",
  },
];
```

`1002` 番の注文をキャンセルするとします。

Day 8 と Day 9 は同じ 1002
番をキャンセルしますが、最終結果が異なります。

**Tip**

`filter()` と `map()`
をメソッド名だけで覚えるのではなく、**最終的な配列で 1002
番の注文がどうなってほしいのか**を先に考えると、使うメソッドを判断しやすくなります。

------------------------------------------------------------------------

## 2. Day 8 --- `filter()`

Day 8 のコード：

``` tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

`orderId` が `1002` だとします。

### 1件目

``` tsx
1001 !== 1002
```

結果は `true`。

`filter()` では `true` の要素を残します。

### 2件目

``` tsx
1002 !== 1002
```

結果は `false`。

そのため 1002 番は除外されます。

### 3件目

``` tsx
1003 !== 1002
```

結果は `true`。

そのため残ります。

結果：

``` tsx
[
  { id: 1001, productName: "Mouse", status: "支払完了" },
  { id: 1003, productName: "Monitor", status: "支払完了" },
]
```

``` text
元の配列
1001
1002  ← キャンセル対象
1003

        filter()

結果
1001
1003
```

つまり `filter()` の質問は：

> **この要素を新しい配列に入れるか、入れないか？**

callback の Boolean が重要です。

``` text
true  → 残す
false → 除外
```

**Tip**

`filter()` は「通過テスト」と考えると分かりやすいです。

``` text
条件を通過(true) → 残る
条件に失敗(false) → 消える
```

------------------------------------------------------------------------

## 3. Day 9 の要件は違う

Day 9 では 1002 番を削除してはいけません。

欲しい結果：

``` tsx
[
  {
    id: 1001,
    productName: "Mouse",
    status: "支払完了",
  },
  {
    id: 1002,
    productName: "Keyboard",
    status: "キャンセル完了",
  },
  {
    id: 1003,
    productName: "Monitor",
    status: "支払完了",
  },
]
```

``` text
1001 → そのまま
1002 → 残したまま status を変更
1003 → そのまま
```

配列の長さも変わりません。

``` text
変更前: 3件
変更後: 3件
```

そこで必要になるのが `map()` です。

------------------------------------------------------------------------

## 4. Day 9 --- `map()`

``` tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "キャンセル完了",
      }
    : order
);
```

`map()` は各要素に対して、

> **あなたは新しい配列で何になる？**

と考えることができます。

------------------------------------------------------------------------

## 5. callback を3回追跡する

`orderId = 1002` とします。

### ① 1回目

``` tsx
1001 === 1002
```

`false` なので、

``` tsx
order
```

を返します。

1001 番はそのままです。

### ② 2回目

``` tsx
1002 === 1002
```

`true` なので、

``` tsx
{
  ...order,
  status: "キャンセル完了",
}
```

を返します。

結果：

``` tsx
{
  id: 1002,
  productName: "Keyboard",
  status: "キャンセル完了",
}
```

1002 番は消えたのではなく、**変更された新しい 1002
オブジェクトになった**ということです。

**Tip**

`map()` が 1002 番を削除したのではなく、**元の 1002
番の代わりに変更済みの新しいオブジェクトを新しい配列へ入れた**と考えてください。

### ③ 3回目

``` tsx
1003 === 1002
```

`false` なので元の `order` を返します。

------------------------------------------------------------------------

## 6. 全体の流れ

``` text
orders
│
├─ 1001
│    ↓
│  1001 === 1002 ? false
│    ↓
│  元の order
│
├─ 1002
│    ↓
│  1002 === 1002 ? true
│    ↓
│  { ...order, status: "キャンセル完了" }
│    ↓
│  変更した新しいオブジェクト
│
└─ 1003
     ↓
   1003 === 1002 ? false
     ↓
   元の order

             ↓

       updatedOrders

1001 支払完了
1002 キャンセル完了
1003 支払完了
```

------------------------------------------------------------------------

## 7. `filter()` と `map()` の違い

  項目              `filter()`       `map()`
  ----------------- ---------------- ----------------
  質問              残す？           何に変える？
  callback の核心   `true / false`   新しい値
  要素の削除        得意             主目的ではない
  要素の更新        主目的ではない   得意
  配列の長さ        減ることがある   基本的に同じ
  Day 8             注文削除         
  Day 9                              注文更新

``` text
削除したい
   ↓
filter()

変更したい
   ↓
map()
```

**Tip**

React の配列 state では次のように整理すると便利です。

``` text
追加 → spread
削除 → filter()
変更 → map()
```

------------------------------------------------------------------------

## 8. 次に理解すべきポイント

Day 9 のコードにはまだ重要な要素があります。

``` tsx
order.id === orderId
  ? {
      ...order,
      status: "キャンセル完了",
    }
  : order
```

ここでは、

-   三項演算子 `? :`
-   object spread `...order`
-   immutability
-   reference

がつながっています。

特に重要な疑問は：

``` tsx
order.status = "キャンセル完了";
```

と直接変更せず、なぜ

``` tsx
{
  ...order,
  status: "キャンセル完了",
}
```

と新しいオブジェクトを作るのか、という点です。

**Tip**

`map()`
を理解した次は、**なぜ元のオブジェクトを直接変更しないのか**を学ぶと
React の state 更新の仕組みにつながります。

------------------------------------------------------------------------

# 2. English

## Day 8 `filter()` vs Day 9 `map()`

Understanding this difference first makes the Day 9 code much easier to
read.

The key question is:

> **Which order should be removed from the array?**\
> vs\
> **What should each order become in the new array?**

------------------------------------------------------------------------

## 1. Start with three orders

``` tsx
const orders = [
  {
    id: 1001,
    productName: "Mouse",
    status: "Paid",
  },
  {
    id: 1002,
    productName: "Keyboard",
    status: "Paid",
  },
  {
    id: 1003,
    productName: "Monitor",
    status: "Paid",
  },
];
```

Suppose we cancel order `1002`.

Day 8 and Day 9 both deal with order 1002, but their final results are
different.

**Tip**

Do not memorize `filter()` and `map()` only by their names. First ask:
**What should happen to order 1002 in the final array?**

------------------------------------------------------------------------

## 2. Day 8 --- `filter()`

``` tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

Assume `orderId` is `1002`.

### First order

``` tsx
1001 !== 1002
```

The result is `true`, so the order remains.

### Second order

``` tsx
1002 !== 1002
```

The result is `false`, so order 1002 is excluded.

### Third order

``` tsx
1003 !== 1002
```

The result is `true`, so the order remains.

Result:

``` tsx
[
  { id: 1001, productName: "Mouse", status: "Paid" },
  { id: 1003, productName: "Monitor", status: "Paid" },
]
```

``` text
Original
1001
1002  ← target
1003

        filter()

Result
1001
1003
```

The question asked by `filter()` is:

> **Should this element be included in the new array?**

Its Boolean result matters:

``` text
true  → include
false → exclude
```

**Tip**

Think of `filter()` as a gate:

``` text
passes condition (true) → stays
fails condition (false) → disappears
```

------------------------------------------------------------------------

## 3. Day 9 has a different requirement

We must not remove order 1002.

We want:

``` tsx
[
  {
    id: 1001,
    productName: "Mouse",
    status: "Paid",
  },
  {
    id: 1002,
    productName: "Keyboard",
    status: "Cancelled",
  },
  {
    id: 1003,
    productName: "Monitor",
    status: "Paid",
  },
]
```

``` text
1001 → unchanged
1002 → preserved, but status changes
1003 → unchanged
```

The array length stays the same:

``` text
Before: 3
After: 3
```

This is where `map()` is useful.

------------------------------------------------------------------------

## 4. Day 9 --- `map()`

``` tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "Cancelled",
      }
    : order
);
```

For each element, think of `map()` as asking:

> **What should you become in the new array?**

------------------------------------------------------------------------

## 5. Trace all three callbacks

Assume `orderId = 1002`.

### ① First callback

``` tsx
1001 === 1002
```

This is `false`, so the callback returns:

``` tsx
order
```

Order 1001 remains unchanged.

### ② Second callback

``` tsx
1002 === 1002
```

This is `true`, so the callback returns:

``` tsx
{
  ...order,
  status: "Cancelled",
}
```

Result:

``` tsx
{
  id: 1002,
  productName: "Keyboard",
  status: "Cancelled",
}
```

Order 1002 has not disappeared. It has been replaced in the new array by
a **new, updated order object**.

**Tip**

Think of `map()` as placing an updated 1002 object into the new array
instead of deleting the original order.

### ③ Third callback

``` tsx
1003 === 1002
```

This is `false`, so the original `order` is returned.

------------------------------------------------------------------------

## 6. Full flow

``` text
orders
│
├─ 1001
│    ↓
│  1001 === 1002 ? false
│    ↓
│  original order
│
├─ 1002
│    ↓
│  1002 === 1002 ? true
│    ↓
│  { ...order, status: "Cancelled" }
│    ↓
│  new updated object
│
└─ 1003
     ↓
   1003 === 1002 ? false
     ↓
   original order

             ↓

       updatedOrders

1001 Paid
1002 Cancelled
1003 Paid
```

------------------------------------------------------------------------

## 7. `filter()` vs `map()`

  Concept             `filter()`             `map()`
  ------------------- ---------------------- -------------------------
  Main question       Keep it?               What should it become?
  Callback result     `true / false`         A value
  Removing elements   Good fit               Not the main purpose
  Updating elements   Not the main purpose   Good fit
  Array length        May decrease           Normally stays the same
  Day 8               Delete order           
  Day 9                                      Update order

``` text
Want to delete
   ↓
filter()

Want to update
   ↓
map()
```

**Tip**

For React array state, remember:

``` text
Add → spread
Delete → filter()
Update → map()
```

------------------------------------------------------------------------

## 8. What comes next?

The Day 9 expression still contains important concepts:

``` tsx
order.id === orderId
  ? {
      ...order,
      status: "Cancelled",
    }
  : order
```

These lead to:

-   ternary operator `? :`
-   object spread `...order`
-   immutability
-   reference

The next important question is why we do not simply write:

``` tsx
order.status = "Cancelled";
```

and instead create:

``` tsx
{
  ...order,
  status: "Cancelled",
}
```

**Tip**

After understanding `map()`, learning **why React state should not be
directly mutated** will connect this code to immutability and
references.

------------------------------------------------------------------------

# 3. 한국어

## Day 8 `filter()` vs Day 9 `map()`

이 차이를 먼저 제대로 이해하면 Day 9 코드가 훨씬 쉽게 보입니다.

핵심 질문은 하나입니다.

> **배열에서 어떤 주문을 없앨 것인가?**\
> vs\
> **배열의 각 주문을 무엇으로 바꿀 것인가?**

------------------------------------------------------------------------

## 1. 주문 3개가 있다고 해보자

``` tsx
const orders = [
  {
    id: 1001,
    productName: "Mouse",
    status: "결제완료",
  },
  {
    id: 1002,
    productName: "Keyboard",
    status: "결제완료",
  },
  {
    id: 1003,
    productName: "Monitor",
    status: "결제완료",
  },
];
```

`1002`번 주문을 취소한다고 해봅시다.

Day 8과 Day 9는 같은 1002번 주문을 다루지만 최종 결과가 다릅니다.

**팁**

`filter()`와 `map()`을 메서드 이름만으로 외우지 말고, **최종 배열에서
1002번 주문이 어떻게 되어야 하는가?**를 먼저 생각하면 어떤 메서드를 써야
할지 판단하기 쉬워집니다.

------------------------------------------------------------------------

## 2. Day 8 --- `filter()`

``` tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

`orderId = 1002`라고 해봅시다.

### 첫 번째 주문

``` tsx
1001 !== 1002
```

결과는 `true`.

`filter()`에서 `true`이므로 남깁니다.

### 두 번째 주문

``` tsx
1002 !== 1002
```

결과는 `false`.

따라서 1002번 주문은 제외됩니다.

### 세 번째 주문

``` tsx
1003 !== 1002
```

결과는 `true`.

따라서 남습니다.

최종 결과:

``` tsx
[
  { id: 1001, productName: "Mouse", status: "결제완료" },
  { id: 1003, productName: "Monitor", status: "결제완료" },
]
```

``` text
원본
1001
1002  ← 취소 대상
1003

        filter()

결과
1001
1003
```

즉 `filter()`가 묻는 것은:

> **이 요소를 새 배열에 넣을까, 말까?**

입니다.

callback의 Boolean 결과가 중요합니다.

``` text
true  → 포함
false → 제외
```

**팁**

`filter()`를 **통과 시험**이라고 생각해보세요.

``` text
조건 통과(true) → 살아남음
조건 탈락(false) → 사라짐
```

------------------------------------------------------------------------

## 3. 그런데 Day 9 요구사항은 다르다

이번에는 1002번을 없애면 안 됩니다.

원하는 결과:

``` tsx
[
  {
    id: 1001,
    productName: "Mouse",
    status: "결제완료",
  },
  {
    id: 1002,
    productName: "Keyboard",
    status: "취소완료",
  },
  {
    id: 1003,
    productName: "Monitor",
    status: "결제완료",
  },
]
```

즉:

``` text
1001 → 그대로
1002 → 존재하지만 status 변경
1003 → 그대로
```

배열 길이도 그대로입니다.

``` text
변경 전: 3개
변경 후: 3개
```

그래서 필요한 것이 `map()`입니다.

------------------------------------------------------------------------

## 4. Day 9 --- `map()`

``` tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "취소완료",
      }
    : order
);
```

`map()`은 각각의 요소에게 다음과 같이 묻는다고 생각할 수 있습니다.

> **너는 새 배열에서 무엇이 될 거야?**

------------------------------------------------------------------------

## 5. 실제 callback 3번 추적하기

`orderId = 1002`라고 합시다.

### ① 첫 번째 callback

``` tsx
1001 === 1002
```

`false`이므로:

``` tsx
order
```

를 반환합니다.

1001번 주문은 그대로입니다.

### ② 두 번째 callback

``` tsx
1002 === 1002
```

`true`이므로:

``` tsx
{
  ...order,
  status: "취소완료",
}
```

를 반환합니다.

결과:

``` tsx
{
  id: 1002,
  productName: "Keyboard",
  status: "취소완료",
}
```

1002번이 사라진 것이 아닙니다.

**수정된 새로운 1002 객체가 새 배열에 들어간 것**입니다.

**팁**

`map()`이 1002번을 삭제했다고 생각하면 안 됩니다.

``` text
기존 1002 객체
      ↓
새로운 1002 객체 생성
      ↓
status만 취소완료로 변경
      ↓
새 배열에 배치
```

라고 이해하면 정확합니다.

### ③ 세 번째 callback

``` tsx
1003 === 1002
```

`false`이므로 기존 `order`를 그대로 반환합니다.

------------------------------------------------------------------------

## 6. 전체 흐름

``` text
orders
│
├─ 1001
│    ↓
│  1001 === 1002 ? false
│    ↓
│  기존 order 반환
│
├─ 1002
│    ↓
│  1002 === 1002 ? true
│    ↓
│  { ...order, status: "취소완료" }
│    ↓
│  수정된 새 객체 반환
│
└─ 1003
     ↓
   1003 === 1002 ? false
     ↓
   기존 order 반환

             ↓

       updatedOrders

1001 결제완료
1002 취소완료
1003 결제완료
```

------------------------------------------------------------------------

## 7. `filter()`와 `map()`의 진짜 차이

  구분                 `filter()`       `map()`
  -------------------- ---------------- ------------------
  질문                 남길까?          무엇으로 바꿀까?
  callback 핵심 결과   `true / false`   새로운 값
  배열 요소 삭제       적합             주목적이 아님
  배열 요소 수정       주목적이 아님    적합
  배열 길이            줄어들 수 있음   기본적으로 동일
  Day 8                주문 삭제        
  Day 9                                 주문 수정

``` text
삭제하고 싶다
   ↓
filter()

수정하고 싶다
   ↓
map()
```

**팁**

앞으로 React 배열 state를 다룰 때 요구사항을 먼저 한국어로 바꿔보세요.

``` text
하나 추가해라 → spread
하나 없애라 → filter()
하나 바꿔라 → map()
```

그러면 코드를 작성하기 전에 사용할 도구부터 결정할 수 있습니다.

------------------------------------------------------------------------

## 8. 다음으로 이해할 핵심

Day 9 코드를 다시 보면:

``` tsx
orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "취소완료",
      }
    : order
);
```

아직 중요한 개념들이 남아 있습니다.

``` text
? :
↓
삼항 연산자

...order
↓
object spread

그리고
↓
immutability
reference
```

특히 다음 질문이 중요합니다.

``` tsx
order.status = "취소완료";
```

라고 직접 바꾸면 될 것 같은데, 왜 굳이:

``` tsx
{
  ...order,
  status: "취소완료",
}
```

처럼 새로운 객체를 만드는가?

이 질문이 **object spread → reference → immutability → React state
업데이트**로 연결됩니다.

**팁**

Day 9에서는 최종적으로 다음 공식을 코드 없이 설명할 수 있으면 좋습니다.

``` text
배열 추가 → spread
배열 삭제 → filter()
배열 수정 → map()
객체 수정 → object spread
```

그리고 가장 중요한 문장은:

> **배열은 `map()`으로 새로 만들고, 수정할 객체는 `{ ...object }`로 새로
> 만든다.**
