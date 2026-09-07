# Day 10 — Order Status Modeling

## STEP 1 — `status: string` の意味と限界 / Meaning and Limits of `status: string` / `status: string`의 의미와 한계

### 日本語

最初の `Order` 型では、注文状態を次のように定義していました。

```tsx
type Order = {
  id: number;
  status: string;
};
```

`status: string` は、`status` にすべての文字列を許可するという意味です。

そのため、正しい注文状態だけでなく、タイプミスや注文状態とは関係のない文字列も使用できます。

```tsx
const order1 = {
  id: 1,
  status: "결제완료",
};

const order2 = {
  id: 2,
  status: "아무거나",
};
```

どちらも文字列なので、`status: string` だけでは TypeScript は問題を検出できません。

### English

In the original `Order` type, the order status was defined as:

```tsx
status: string;
```

This means that `status` can contain **any string**.

TypeScript can check whether the value is a string, but it cannot determine whether that string is actually a valid order status.

For example, both `"결제완료"` and `"아무거나"` are strings, so both are accepted by `status: string`.

### 한국어

기존 `Order` 타입에서는 주문 상태를 다음과 같이 정의했습니다.

```tsx
status: string;
```

`string`은 **모든 문자열을 허용**합니다.

따라서 `"결제완료"`처럼 정상적인 주문 상태뿐만 아니라 `"아무거나"`나 오타가 포함된 문자열도 들어갈 수 있습니다.

즉 TypeScript는:

```text
이 값이 문자열인가?
```

는 검사할 수 있지만:

```text
이 문자열이 올바른 주문 상태인가?
```

까지는 판단할 수 없습니다.

> **팁**
>
> 타입의 범위가 너무 넓으면 TypeScript가 잡아낼 수 있는 실수도 줄어듭니다. Day 10은 바로 이 문제에서 시작합니다.

---

## STEP 2 — String Literal Type

### 日本語

特定の一つの文字列だけを許可したい場合、String Literal Type を使うことができます。

```tsx
type Order = {
  status: "결제완료";
};
```

ここで型の位置にある `"결제완료"` は String Literal Type です。

この場合、`status` には正確に `"결제완료"` だけを使用できます。

```tsx
const a: Order = {
  status: "결제완료",
}; // OK

const b: Order = {
  status: "취소완료",
}; // Type Error
```

### English

A String Literal Type allows one exact string instead of every possible string.

```tsx
status: "결제완료";
```

This means:

```text
Allowed:
"결제완료"

Not allowed:
"배송중"
"취소완료"
"아무거나"
```

The string must match exactly.

### 한국어

String Literal Type은 모든 문자열이 아니라 **정확히 지정된 문자열 하나만 허용하는 타입**입니다.

```tsx
status: "결제완료";
```

라고 하면:

```tsx
status: "결제완료"; // OK
status: "취소완료"; // Type Error
```

가 됩니다.

여기서 중요한 것은 같은 `"결제완료"`라는 문법이 상황에 따라 **실제 문자열 값**으로도 사용될 수 있고, **타입 위치에서는 String Literal Type**으로도 사용될 수 있다는 점입니다.

> **팁**
>
> 처음에는 `문자열 하나를 타입으로 사용할 수 있다` 정도로 이해하면 충분합니다. 용어는 개념을 이해한 뒤 붙이면 됩니다.

---

## STEP 3 — Union Type

### 日本語

注文状態は一つだけではありません。

そこで複数の String Literal Type を `|` で結合します。

```tsx
export type OrderStatus =
  | "결제완료"
  | "상품준비중"
  | "배송중"
  | "배송완료"
  | "취소완료";
```

`|` は OR のように考えることができます。

このように複数の型のうち、いずれか一つを許可する型を Union Type と呼びます。

### English

An order can have several possible statuses, so one String Literal Type is not enough.

We can combine multiple types with `|`:

```tsx
type OrderStatus =
  | "결제완료"
  | "상품준비중"
  | "배송중"
  | "배송완료"
  | "취소완료";
```

The `|` operator can be read as **OR**.

`OrderStatus` therefore allows one of the listed String Literal Types.

### 한국어

실제 주문에는 상태가 하나만 있는 것이 아니므로 여러 String Literal Type을 `|`로 연결합니다.

```text
"결제완료"
OR
"상품준비중"
OR
"배송중"
OR
"배송완료"
OR
"취소완료"
```

이처럼 **여러 타입 중 하나를 허용하는 타입**을 Union Type이라고 합니다.

예를 들어:

```tsx
const a: OrderStatus = "배송중";   // OK
const b: OrderStatus = "환불완료"; // Type Error
```

`"환불완료"`는 문자열이지만 `OrderStatus`에 정의된 후보에는 없습니다.

### 표현 연습

```text
1단계
OrderStatus에 "환불완료"가 없다.

2단계
OrderStatus에서 허용하지 않은 값이다.

3단계
OrderStatus에 포함되어 있지 않은 값이다.

4단계
"환불완료"라는 String Literal Type이
OrderStatus라는 Union Type에 포함되어 있지 않기 때문에
Type Error가 발생한다.
```

> **팁**
>
> `포함되어 있지 않다`라는 표현이 바로 나오지 않아도 괜찮습니다. 먼저 `OrderStatus에 없는 값이다`라고 정확하게 설명하는 것이 더 중요합니다.

---

## STEP 4 — Apply `OrderStatus` to `Order`

### 日本語

次に、作成した `OrderStatus` を `Order` 型の `status` に適用します。

```tsx
export type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;
};
```

`Order` は注文全体の構造を定義し、`OrderStatus` は注文状態として許可される値を定義します。

### English

Next, we apply `OrderStatus` to the `status` property of `Order`.

```tsx
status: OrderStatus;
```

The responsibilities are different:

```text
Order
→ defines the structure of the whole order

OrderStatus
→ defines the allowed order status values
```

### 한국어

이제 기존:

```tsx
status: string;
```

을:

```tsx
status: OrderStatus;
```

로 변경합니다.

역할을 구분하면:

```text
Order
→ 주문 전체 데이터의 구조를 정의

OrderStatus
→ 주문 상태로 허용되는 값들을 정의

status: OrderStatus
→ Order의 status에 그 규칙을 적용
```

입니다.

`Order`는 주문자 정보만 나타내는 것이 아니라 상품, 금액, 생성 시간, 상태 등을 포함하는 **주문 전체 구조**입니다.

> **팁**
>
> 타입의 역할을 설명할 때 `담는다`보다 `구조를 정의한다`, `허용되는 값을 정의한다`라는 표현이 더 정확합니다.

---

## STEP 5 — Valid / Invalid Status Test

### 日本語

`OrderStatus` を作ったら、正しい値と間違った値を実際に代入して確認できます。

```tsx
const status1: OrderStatus = "결제완료";
const status2: OrderStatus = "배송중";
const status3: OrderStatus = "배송완료오타";
```

`status3` は `OrderStatus` に含まれていないため Type Error になります。

### English

We can now test valid and invalid values:

```tsx
const status1: OrderStatus = "결제완료";     // OK
const status2: OrderStatus = "배송중";       // OK
const status3: OrderStatus = "배송완료오타"; // Type Error
```

The third value is rejected because it is not included in the `OrderStatus` union.

### 한국어

`OrderStatus`를 만들면 TypeScript가 허용된 값과 허용되지 않은 값을 구분할 수 있습니다.

```text
"배송완료오타"
↓
OrderStatus에 있는가?
↓
NO
↓
Type Error
```

또한:

```text
"배송완료"
"배송 완료"
"배송완료 "
```

는 모두 서로 다른 문자열입니다.

따라서 `OrderStatus`에 정확히 `"배송완료"`만 정의되어 있다면 나머지는 Type Error가 됩니다.

> **팁**
>
> String Literal Type에서는 공백 하나도 값의 일부입니다. `비슷한 문자열`이 아니라 `정확히 같은 문자열`인지 확인하세요.

---

## STEP 6 — State Transition & Business Logic

### 日本語

注文状態には通常、流れがあります。

```text
결제완료
↓
상품준비중
↓
배송중
↓
배송완료
```

状態から別の状態への変更を State Transition（状態遷移）として考えることができます。

しかし `OrderStatus` は「存在できる状態」を定義するだけで、「どの状態からどの状態へ移動できるか」までは定義していません。

### English

Order statuses usually follow a flow:

```text
결제완료
↓
상품준비중
↓
배송중
↓
배송완료
```

A change from one state to another is a **State Transition**.

However, `OrderStatus` only defines which individual states are valid. It does not define which transitions between those states are allowed.

### 한국어

주문에는 일반적인 상태 흐름이 있습니다.

```text
결제완료 → 상품준비중 → 배송중 → 배송완료
```

취소는 다음과 같은 별도 분기로 생각할 수 있습니다.

```text
결제완료 → 취소완료
상품준비중 → 취소완료
```

여기서 중요한 개념이 **Type과 Business Logic의 차이**입니다.

예를 들어:

```text
배송중 → 결제완료
```

라고 해봅시다.

`"결제완료"` 자체는 `OrderStatus`에 포함되어 있습니다.

따라서:

```tsx
order.status = "결제완료";
```

는 `OrderStatus`만 놓고 보면 Type Error가 아닙니다.

하지만 이미 배송 중인 주문이 다시 결제완료로 돌아가는 것은 주문 흐름상 이상합니다.

```text
Type
→ "결제완료"라는 값 자체가 가능한가?
→ YES

Business Logic
→ "배송중"에서 "결제완료"로 이동해도 되는가?
→ NO
```

### Day 10 핵심 구분

> **Type은 어떤 상태가 존재할 수 있는지를 검사하고, Business Logic은 어떤 상태 전환이 허용되는지를 판단한다.**

> **팁**
>
> 상태 문제에서는 항상 두 가지를 따로 확인하세요. `① 값 자체가 유효한가? ② 현재 상태에서 그 값으로 이동하는 것이 유효한가?`

---

## STEP 7 — Connect Status to UI Rules

### 日本語

注文状態を React の UI と結びつけることができます。

```tsx
{order.status === "결제완료" && (
  <button>주문 취소</button>
)}
```

`order.status` が `"결제완료"` の場合だけ条件が `true` になり、キャンセルボタンが表示されます。

`"배송중"` の場合は条件が `false` になるため、ボタンは表示されません。

### English

The current order status can control what the React UI displays.

```tsx
{order.status === "결제완료" && (
  <button>주문 취소</button>
)}
```

If the status is `"결제완료"`, the condition is true and the cancel button is rendered.

If the status is `"배송중"`, the condition is false and the button is not rendered.

### 한국어

현재 주문 상태를 React의 조건부 렌더링과 연결할 수 있습니다.

```text
order.status === "결제완료"
↓
true
↓
주문 취소 버튼 표시
```

반대로:

```text
order.status === "배송중"
↓
"결제완료"와 같지 않음
↓
false
↓
주문 취소 버튼 렌더링 안 함
```

전체 연결 관계는:

```text
OrderStatus
↓
가능한 주문 상태 정의

Order.status
↓
현재 주문 상태

조건문
↓
현재 상태 확인

Conditional Rendering
↓
상태에 맞는 UI 표시
```

입니다.

### UI Rule vs Business Logic

```text
UI Rule
→ 사용자에게 어떤 버튼/행동을 보여줄지 결정

Business Logic
→ 실제로 그 행동을 허용할지 결정
```

배송 중에 취소 버튼을 숨겼다고 해서 **취소 기능 자체가 완전히 차단되었다고 단정할 수는 없습니다.**

> **팁**
>
> `화면에서 버튼이 안 보인다`와 `실제로 취소 로직을 실행할 수 없다`는 서로 다른 문제입니다.

---

## STEP 8 — Review & Test

### 日本語

Day 10 では、単純な `string` から始めて、注文状態をより安全に表現する方法を学びました。

```text
string
↓
String Literal Type
↓
Union Type
↓
OrderStatus
↓
Order に適用
↓
Type Error で不正な値を検出
↓
State Transition
↓
Business Logic
↓
React UI
```

### English

Day 10 progressed from a broad `string` type to a more precise model of order states:

```text
string
↓
String Literal Type
↓
Union Type
↓
OrderStatus
↓
Apply it to Order
↓
Catch invalid values with Type Errors
↓
State Transition
↓
Business Logic
↓
React UI
```

The most important lesson is that **valid values and valid actions are different concerns**.

### 한국어

Day 10 전체 흐름은 다음과 같습니다.

```text
status: string
↓
모든 문자열을 허용해서 범위가 너무 넓음

String Literal Type
↓
특정 문자열 하나를 타입으로 제한

Union Type
↓
여러 타입 중 하나를 허용

OrderStatus
↓
주문 상태로 가능한 값들을 정의

status: OrderStatus
↓
Order의 status에 상태 규칙 적용

Type Error
↓
잘못된 상태 값을 개발 단계에서 발견

State Transition
↓
현재 상태에서 다른 상태로 변경

Business Logic
↓
그 상태 전환이 실제 업무상 가능한지 판단

Conditional Rendering
↓
현재 상태에 맞게 React UI 변경
```

---

# Final Review Questions

## Q1

```tsx
const status: OrderStatus = "환불완료";
```

왜 Type Error가 발생하는가?

### 모범 답안

`"환불완료"`라는 String Literal Type이 `OrderStatus`라는 Union Type에 포함되어 있지 않기 때문에 Type Error가 발생합니다.

쉬운 표현으로는:

> `OrderStatus`에 `"환불완료"`가 없기 때문입니다.

---

## Q2

현재 상태가 `"배송중"`일 때:

```tsx
order.status = "결제완료";
```

는 Type Error인가?

### 모범 답안

Type Error는 아닙니다.

`"결제완료"` 자체는 `OrderStatus`에 포함되어 있기 때문입니다.

하지만:

```text
배송중 → 결제완료
```

는 주문의 정상적인 흐름과 맞지 않으므로 Business Logic 관점에서는 잘못된 상태 전환입니다.

---

## Q3

```tsx
{order.status === "결제완료" && (
  <button>주문 취소</button>
)}
```

현재 상태가 `"배송중"`이면 어떻게 되는가?

### 모범 답안

조건:

```tsx
order.status === "결제완료"
```

가 `false`이므로 주문 취소 버튼은 렌더링되지 않습니다.

하지만 버튼을 숨긴 것만으로 취소 기능 자체를 완전히 방어했다고 볼 수는 없습니다.

---

## Q4

왜:

```tsx
status: string;
```

에서:

```tsx
status: OrderStatus;
```

로 변경했는가?

### 모범 답안

`string`은 모든 문자열을 허용하기 때문에 오타나 잘못된 주문 상태도 들어갈 수 있습니다.

그래서 허용할 String Literal Type들을 `OrderStatus`라는 Union Type으로 정의하고 `status: OrderStatus`를 사용하여 주문 상태의 범위를 제한했습니다.

그 결과 정의되지 않은 잘못된 상태 값을 TypeScript가 Type Error로 발견할 수 있게 되었습니다.

---

# Day 10 Final Key Point

### 日本語

> **Type はどの値が存在できるかを制限し、Business Logic はその値をどの状況でどのように使えるかを決定する。**

### English

> **Types restrict which values can exist, while Business Logic determines how those values may be used in a given situation.**

### 한국어

> **Type은 어떤 값이 가능한지를 제한하고, Business Logic은 그 값을 어떤 상황에서 어떻게 사용할 수 있는지를 결정한다.**

---

## Development Vocabulary

| 日本語 | English | 한국어 |
|---|---|---|
| 文字列 | String | 문자열 |
| 文字列リテラル型 | String Literal Type | 문자열 리터럴 타입 |
| ユニオン型 | Union Type | 유니온 타입 |
| 型エラー | Type Error | 타입 에러 |
| 注文状態 | Order Status | 주문 상태 |
| 状態遷移 | State Transition | 상태 전환 |
| ビジネスロジック | Business Logic | 비즈니스 로직 |
| 条件付きレンダリング | Conditional Rendering | 조건부 렌더링 |
| 許可された値 | Allowed Value | 허용된 값 |
| 不正な値 | Invalid Value | 잘못된 값 |

> **팁**
>
> 이 표의 용어를 전부 암기할 필요는 없습니다. 개발할 때 반복해서 등장하는 용어를 `일본어 ↔ 영어 ↔ 한국어`로 연결하는 참고표로 사용하세요.