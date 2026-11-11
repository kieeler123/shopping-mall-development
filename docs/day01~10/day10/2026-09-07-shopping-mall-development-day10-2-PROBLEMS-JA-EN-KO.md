# Day 10 --- Review Problems / 復習問題 / 복습 문제

[📖 Summary / 総まとめ / 총정리](2026-09-07-shopping-mall-development-day10-1-SUMMARY-JA-EN-KO.md)\
[✅ Answers / 解答 / 정답](2026-09-07-shopping-mall-development-day10-3-ANSWER-JA-EN-KO.md)

> **팁**
>
> 각 문제는 일본어 → 영어 → 한국어 순서입니다. 가장 편한 언어로 먼저
> 이해한 뒤 다른 두 언어의 개발 표현도 같이 확인하세요.

---

## Problem 1 --- `string`

### 日本語

`status: string` のとき、次のうち Type Error になるものはどれですか？

### English

With `status: string`, which value causes a Type Error?

### 한국어

`status: string`일 때 다음 중 Type Error가 발생하는 것은 무엇인가요?

1.  `"결제완료"`
2.  `"배송중"`
3.  `"아무거나"`
4.  `123`

---

## Problem 2 --- String Literal Type

```tsx
type Order = {
  status: "결제완료";
};
```

### 日本語

`"취소완료"` を代入すると、なぜ Type Error になりますか？

### English

Why does assigning `"취소완료"` cause a Type Error?

### 한국어

`"취소완료"`를 넣으면 왜 Type Error가 발생하나요?

---

## Problem 3 --- Union Type

```tsx
type OrderStatus =
  | "결제완료"
  | "상품준비중"
  | "배송중"
  | "배송완료"
  | "취소완료";
```

### 日本語

次のうち Type Error になる値はどれですか？可能なら Union Type と String
Literal Type を使って説明してください。

### English

Which value causes a Type Error? If possible, explain using the terms
Union Type and String Literal Type.

### 한국어

다음 중 Type Error가 발생하는 값은 무엇인가요? 가능하면 Union Type과
String Literal Type을 사용해서 설명하세요.

1.  `"배송중"`
2.  `"상품준비중"`
3.  `"환불완료"`
4.  `"취소완료"`

---

## Problem 4 --- Exact Strings

```tsx
const a: OrderStatus = "배송완료";
const b: OrderStatus = "배송 완료";
const c: OrderStatus = "배송완료 ";
```

### 日本語

Type Error になるものをすべて選んでください。

### English

Select every assignment that causes a Type Error.

### 한국어

Type Error가 발생하는 것을 모두 고르세요.

---

## Problem 5 --- `Order` and `OrderStatus`

```tsx
type Order = {
  id: number;
  status: OrderStatus;
};
```

### 日本語

`Order` と `OrderStatus` はそれぞれ何を定義しますか？

### English

What does `Order` define, and what does `OrderStatus` define?

### 한국어

`Order`와 `OrderStatus`는 각각 무엇을 정의하나요?

---

## Problem 6 --- Why `OrderStatus`?

### 日本語

なぜ `status: string` を `status: OrderStatus` に変更しましたか？

### English

Why did we change `status: string` to `status: OrderStatus`?

### 한국어

왜 `status: string`을 `status: OrderStatus`로 변경했나요?

---

## Problem 7 --- Type vs Business Logic

현재 상태:

```tsx
order.status = "배송중";
```

변경:

```tsx
order.status = "결제완료";
```

### 日本語

Type Error は発生しますか？Business Logic の観点では正しい変更ですか？

### English

Does this cause a Type Error? Is the transition valid from a Business
Logic perspective?

### 한국어

Type Error가 발생하나요? Business Logic 관점에서는 올바른 상태
전환인가요?

---

## Problem 8 --- State Transition

### 日本語

`OrderStatus` だけで `배송중 → 결제완료` のような不自然な状態遷移を
TypeScript が自動的に防げますか？理由も説明してください。

### English

Can TypeScript automatically prevent an invalid transition such as
`배송중 → 결제완료` using only `OrderStatus`? Explain why.

### 한국어

`OrderStatus`만으로 TypeScript가 `배송중 → 결제완료` 같은 잘못된 상태
전환을 자동으로 막을 수 있나요? 이유도 설명하세요.

---

## Problem 9 --- Conditional Rendering

```tsx
{
  order.status === "결제완료" && <button>주문 취소</button>;
}
```

### 日本語

状態が `"결제완료"` の場合と `"배송중"`
の場合、ボタンはそれぞれどうなりますか？

### English

What happens to the button when the status is `"결제완료"` versus
`"배송중"`?

### 한국어

상태가 `"결제완료"`일 때와 `"배송중"`일 때 버튼은 각각 어떻게 되나요?

---

## Problem 10 --- UI vs Business Logic

### 日本語

配送中の注文でキャンセルボタンを非表示にすれば、キャンセル機能を完全に防いだと言えますか？

### English

If the cancel button is hidden for an order in transit, does that
completely prevent cancellation?

### 한국어

배송 중인 주문에서 취소 버튼을 숨기면 취소 기능을 완전히 막았다고 볼 수
있나요?

---

## Problem 11 --- Final Review

### 日本語

次のキーワードをつなげて Day 10 の流れを自分の言葉で説明してください。

### English

Use the following keywords to explain the Day 10 learning flow in your
own words.

### 한국어

다음 키워드를 연결해서 Day 10의 전체 흐름을 자기 말로 설명하세요.

```text
status: string
String Literal Type
Union Type
OrderStatus
Type Error
State Transition
Business Logic
Conditional Rendering
```

> **팁**
>
> 막히면 `기존 문제 → 해결 방법 → 새로 발견한 문제 → UI 연결` 순서로
> 설명하세요.
