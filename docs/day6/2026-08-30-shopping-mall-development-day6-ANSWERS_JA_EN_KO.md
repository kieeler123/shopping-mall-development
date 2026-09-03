# Day 6 총정리 정답·해설 / 総復習 解答・解説 / Comprehensive Review Answers

---

[📝 문제 파일로 돌아가기](2026-08-30-shopping-mall-development-day6-QUESTIONS_JA_EN_KO.md)  
[📖 GENERAL 총정리 보기](2026-08-30-shopping-mall-development-day6-GENERAL_JA_EN_KO.md)

# 日本語

## 正答表

問題 正答

---

| 問題 | 解答                               |
| ---: | ---------------------------------- |
|    1 | 2. `cart`                          |
|    2 | 3. `Order[]`                       |
|    3 | 2. `JSON.parse()`                  |
|    4 | 3. `JSON.stringify(updatedOrders)` |
|    5 | 3. `cart` だけ削除                 |
|    6 | 2                                  |
|    7 | 2                                  |
|    8 | 4. `[]`                            |
|    9 | 2                                  |
|   10 | 3. `(a, b) => a - b`               |
|   11 | 2. `b`                             |
|   12 | `bTime - aTime`                    |

### 問題 1

**正答: `cart`**

`CartItem[]` は型であり、実際の値ではありません。`cart` が `CartItem[]`
型の実データです。

> **ヒント**
>
> 型 = データの形、値 = 実際に処理するデータ。

### 問題 2

**正答: `Order[]`**

`Order` は1件、`Order[]` は複数件です。

> **ヒント**
>
> `[]` を「複数」と読めるようにします。

### 問題 3

**正答: `JSON.parse()`**

localStorage から取得する値は文字列なので、JSON 文字列を JS
値に戻します。

### 問題 4

**正答: `JSON.stringify(updatedOrders)`**

localStorage は文字列を保存するため、配列を JSON 文字列に変換します。

### 問題 5

**正答: cart だけ削除**

完了済み注文は履歴として `orders` に残します。

### 問題 6

**正答: 2**

state は画面表示と再レンダリングに結びつくデータに使います。

### 問題 7

**正答: 2**

初期値 `[]`
だけでは「まだ確認していない」と「確認したが0件」が同じ形になります。`loading`
で区別します。

### 問題 8

**正答: `[]`**

空配列も JavaScript では truthy です。

### 問題 9

**正答: `reverse()` と `sort()`**

どちらも元の配列を変更します。

### 問題 10

**正答: `(a, b) => a - b`**

小さい値を前にするため昇順になります。

### 問題 11

**正答: `b`**

正の値では `b` が `a` より前になる方向で並べられます。

### 問題 12

**正答:**

```ts
bTime - aTime;
```

新しい日時ほど timestamp が大きいので降順にします。

### 問題 13

`[...orders]` がまず新しい配列を作り、そのコピーに対して `reverse()`
を実行するためです。

### 問題 14

`order` が truthy、つまり注文データが存在するときだけ `<section>`
を表示するという意味です。

### 問題 15

1.  読み込み・確認中
2.  確認完了・注文0件
3.  確認完了・注文あり

> **ヒント**
>
> 間違えた問題は答えだけ暗記せず、「なぜその選択肢になるか」を声に出して説明してください。

---

# English

## Answer Key

Question Answer

---

1 2\. `cart`
2 3\. `Order[]`
3 2\. `JSON.parse()`
4 3\. `JSON.stringify(updatedOrders)`
5 3\. Clear only `cart`
6 2
7 2
8 4\. `[]`
9 2
10 3\. `(a, b) => a - b`
11 2\. `b`
12 `bTime - aTime`

### Question 1

**Answer: `cart`**

`CartItem[]` is a type. `cart` is the actual runtime value with that
type.

> **Tip**
>
> Separate the type description from the actual data.

### Question 2

`Order` is one order; `Order[]` is multiple orders.

### Question 3

`JSON.parse()` converts the stored JSON string back into a JavaScript
value.

### Question 4

localStorage stores strings, so `updatedOrders` must be serialized with
`JSON.stringify()`.

### Question 5

Clear the current cart only. Preserve `orders` because completed orders
are history.

### Question 6

State is appropriate because the orders are rendered and their changes
should participate in React rendering.

### Question 7

An empty array alone cannot distinguish "not checked yet" from "checked
and found zero orders."

### Question 8

`[]` is truthy even though it is empty.

### Question 9

`reverse()` and `sort()` mutate their original arrays.

### Question 10

`a - b` produces ascending numeric order.

### Question 11

A positive comparator result means `b` should come before `a` according
to the comparator contract.

### Question 12

```ts
bTime - aTime;
```

Newer dates have larger timestamps, so descending timestamp order puts
newer orders first.

### Question 13

`[...orders]` creates a new array first. `reverse()` mutates that copy
rather than directly mutating the state array.

### Question 14

The section renders only when `order` is truthy, meaning an order value
exists.

### Question 15

1.  Checking/loading
2.  Checked and zero orders
3.  Checked and orders exist

> **Tip**
>
> For every wrong answer, explain the rule in your own words before
> looking at the code again.

---

# 한국어

## 정답표

문제 정답

---

1 2\. `cart`
2 3\. `Order[]`
3 2\. `JSON.parse()`
4 3\. `JSON.stringify(updatedOrders)`
5 3\. `cart`만 삭제
6 2
7 2
8 4\. `[]`
9 2
10 3\. `(a, b) => a - b`
11 2\. `b`
12 `bTime - aTime`

### 문제 1

**정답: `cart`**

`CartItem[]`는 타입이고 실제 값이 아닙니다. `cart`가 실제 `CartItem[]`
데이터입니다.

> **팁**
>
> 타입은 설계도, 값은 실제 데이터라고 구분하세요.

### 문제 2

**정답: `Order[]`**

`Order`는 주문 한 건이고 `Order[]`는 여러 주문입니다.

### 문제 3

**정답: `JSON.parse()`**

localStorage에서 가져온 JSON 문자열을 JavaScript 값으로 되돌립니다.

### 문제 4

**정답: `JSON.stringify(updatedOrders)`**

localStorage는 문자열을 저장하므로 배열을 JSON 문자열로 직렬화해야
합니다.

### 문제 5

**정답: `cart`만 삭제**

`cart`는 현재 쇼핑 데이터라 주문 완료 후 비우지만, `orders`는 완료된
주문 기록이므로 유지합니다.

### 문제 6

**정답: 2**

`orders`는 화면에 렌더링하는 데이터이며 변경이 React 렌더링에 반영되어야
하기 때문입니다.

### 문제 7

**정답: 2**

`orders = []`만 있으면 아직 localStorage를 확인하지 않은 상태와
확인했지만 주문이 없는 상태가 동일하게 보입니다. `loading`이 이 둘을
구분합니다.

### 문제 8

**정답: `[]`**

빈 배열은 JavaScript에서 truthy입니다.

> **팁**
>
> `!orders`로 빈 배열 여부를 검사할 수 없는 이유입니다.

### 문제 9

**정답: `reverse()`와 `sort()`**

둘 다 원본 배열을 직접 변경합니다. `toReversed()`와 `toSorted()`는 새
배열을 반환합니다.

### 문제 10

**정답: `(a, b) => a - b`**

작은 숫자가 앞에 오도록 하므로 오름차순입니다.

### 문제 11

**정답: `b`**

비교 함수 결과가 양수이면 `b`가 `a`보다 앞으로 오는 방향으로 정렬됩니다.

### 문제 12

**정답:**

```ts
bTime - aTime;
```

최신 시간일수록 timestamp가 크므로 큰 값이 앞으로 오게 내림차순으로
비교합니다.

### 문제 13

`[...orders]`가 먼저 새로운 배열을 만듭니다. 그 뒤 `reverse()`는 원본
`orders`가 아니라 복사된 배열을 변경합니다.

```text
orders
↓
[...orders]
↓
새 배열
↓
reverse()
↓
복사본만 변경
```

> **팁**
>
> 핵심은 `reverse()`가 안전해진 것이 아니라, **reverse할 대상을 먼저
> 복사했다**는 점입니다.

### 문제 14

`order`가 truthy일 때만 괄호 안 JSX를 렌더링한다는 뜻입니다.

`order`가 `null`이면 표시하지 않고, 실제 `Order` 객체가 있으면 주문
정보를 표시합니다.

> **팁**
>
> `Order | null`과 `order && (...)`를 연결해서 이해하세요.

### 문제 15

주문 내역 페이지의 3가지 상태는 다음과 같습니다.

1.  아직 주문 내역을 확인하는 중
2.  확인이 끝났지만 주문이 0건
3.  확인이 끝났고 주문이 존재함

> **팁**
>
> `orders`는 "무슨 데이터인가?", `loading`은 "확인이 끝났는가?"에 답하는
> state라고 구분하면 쉽습니다.

## 오답 복습 방법

```text
문제 다시 풀기
↓
틀린 문제 표시
↓
정답 이유 설명
↓
헷갈린 오답과 비교
↓
GENERAL에서 개념 다시 확인
↓
코드 없이 직접 설명
↓
다음날 문제만 재시험
```

> **팁**
>
> 맞혔더라도 이유를 설명하지 못한 문제는 `△`로 표시하세요. 개발
> 공부에서는 정답 번호보다 **왜 그렇게 동작하는지 설명할 수 있는가**가
> 더 중요합니다.
