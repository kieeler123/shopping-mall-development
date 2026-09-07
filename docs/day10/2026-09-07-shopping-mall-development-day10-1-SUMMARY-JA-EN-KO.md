# Day 10 --- Order Status Modeling / 注文ステータスのモデリング / 주문 상태 모델링

[📝 Problems / 問題 / 문제](Day10-2-PROBLEMS-JA-EN-KO.md)\
[✅ Answers / 解答 / 정답](Day10-3-ANSWER-JA-EN-KO.md)

## 0. Day 10 Goal

### 日本語

Day 10の目的は、`status: string` の問題点を理解し、String Literal Type
と Union Type
を使って注文ステータスを安全にモデリングすることです。さらに、Type と
Business Logic を区別し、注文状態を React の UI と結びつけます。

### English

The goal of Day 10 is to understand the weakness of `status: string`,
model order statuses safely with String Literal Types and Union Types,
distinguish Type rules from Business Logic, and connect order status to
React UI behavior.

### 한국어

Day 10의 목표는 `status: string`의 한계를 이해하고, String Literal
Type과 Union Type으로 주문 상태를 안전하게 모델링하는 것입니다. 또한
Type과 Business Logic을 구분하고 주문 상태를 React UI와 연결합니다.

> **팁**
>
> 핵심은 코드를 외우는 것이 아니라
> `왜 string에서 OrderStatus로 바꿨는가?`를 설명할 수 있는 것입니다.

------------------------------------------------------------------------

## 1. `status: string`

``` tsx
type Order = {
  id: number;
  status: string;
};
```

### 日本語

`string` はすべての文字列を許可します。そのため `"決済完了"`
のような正しい値だけでなく、タイプミスや関係のない文字列も型としては許可されます。

### English

`string` allows any string value. This means TypeScript can check
whether the value is a string, but it cannot determine whether the
string is a valid order status.

### 한국어

`string`은 모든 문자열을 허용합니다. 따라서 TypeScript는 문자열인지
확인할 수는 있지만, 그 문자열이 올바른 주문 상태인지는 판단하지
못합니다.

> **팁**
>
> 타입의 범위가 너무 넓으면 TypeScript가 잡아낼 수 있는 실수도
> 줄어듭니다.

------------------------------------------------------------------------

## 2. String Literal Type

``` tsx
type PaymentStatus = "결제완료";
```

### 日本語

String Literal Type
は、任意の文字列ではなく、**指定された一つの文字列だけ**を許可する型です。

### English

A String Literal Type allows one exact string value instead of every
possible string.

### 한국어

String Literal Type은 모든 문자열이 아니라 **정확히 지정한 하나의
문자열만** 허용하는 타입입니다.

``` tsx
const a: PaymentStatus = "결제완료"; // OK
const b: PaymentStatus = "배송중";   // Type Error
```

> **팁**
>
> 공백도 문자열의 일부입니다. `"배송완료"`와 `"배송 완료"`는 서로 다른
> 문자열입니다.

------------------------------------------------------------------------

## 3. Union Type

``` tsx
export type OrderStatus =
  | "결제완료"
  | "상품준비중"
  | "배송중"
  | "배송완료"
  | "취소완료";
```

### 日本語

Union Type は `|`
を使って複数の型のうち、いずれか一つを許可する型です。ここでは5つの
String Literal Type のどれか一つを注文状態として使用できます。

### English

A Union Type uses `|` to allow one of several possible types. Here, an
order status must be one of the five listed String Literal Types.

### 한국어

Union Type은 `|`를 사용하여 여러 타입 중 하나를 허용합니다. 여기서는
다섯 개의 String Literal Type 중 하나만 주문 상태로 사용할 수 있습니다.

``` tsx
const a: OrderStatus = "배송중";   // OK
const b: OrderStatus = "환불완료"; // Type Error
```

### 표현 연습 / 表現練習 / Expression Practice

``` text
쉬운 표현:
OrderStatus에 "환불완료"가 없다.

조금 더 정확한 표현:
OrderStatus에서 허용하지 않은 값이다.

기술적으로 다듬은 표현:
"환불완료"라는 String Literal Type이
OrderStatus라는 Union Type에 포함되어 있지 않기 때문에
Type Error가 발생한다.
```

> **팁**
>
> `포함되어 있지 않다`가 바로 떠오르지 않아도 괜찮습니다. 먼저
> `OrderStatus에 없는 값이다`라고 설명하고 점차 기술 표현을 붙이면
> 됩니다.

------------------------------------------------------------------------

## 4. Apply `OrderStatus` to `Order`

``` tsx
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

### 日本語

`Order` は注文全体のデータ構造を定義し、`OrderStatus`
は注文状態として許可される値を定義します。`status: OrderStatus`
によって、このルールを `Order.status` に適用します。

### English

`Order` defines the structure of the whole order, while `OrderStatus`
defines the values allowed for the order status. `status: OrderStatus`
applies that rule to the `status` property.

### 한국어

`Order`는 주문 전체 데이터 구조를 정의하고, `OrderStatus`는 주문 상태로
허용되는 값을 정의합니다. `status: OrderStatus`를 통해 그 규칙을
`Order.status`에 적용합니다.

> **팁**
>
> 타입은 `담는다`보다 `정의한다`, `허용한다`, `제한한다`라는 표현으로
> 설명하면 더 정확합니다.

------------------------------------------------------------------------

## 5. Type Error

``` tsx
const status1: OrderStatus = "결제완료";     // OK
const status2: OrderStatus = "배송중";       // OK
const status3: OrderStatus = "배송완료오타"; // Type Error
```

### 日本語

`"배송완료오타"` は `OrderStatus` に含まれていないため Type Error
になります。

### English

`"배송완료오타"` causes a Type Error because it is not included in the
`OrderStatus` union.

### 한국어

`"배송완료오타"`는 `OrderStatus`에 포함되어 있지 않기 때문에 Type
Error가 발생합니다.

> **팁**
>
> Type Error가 보이면 먼저 `이 값이 Union에 실제로 있는가?`를
> 확인하세요.

------------------------------------------------------------------------

## 6. State Transition

``` text
결제완료 → 상품준비중 → 배송중 → 배송완료

결제완료 → 취소완료
상품준비중 → 취소완료
```

### 日本語

状態が別の状態へ変わることを State
Transition（状態遷移）として考えることができます。

### English

A change from one state to another can be modeled as a State Transition.

### 한국어

한 상태에서 다른 상태로 변경되는 것을 State Transition, 즉 상태 전환으로
생각할 수 있습니다.

> **팁**
>
> 용어가 기억나지 않으면 먼저 `상태 변경`이라고 설명해도 됩니다.

------------------------------------------------------------------------

## 7. Type vs Business Logic

### 日本語

Type は「どの状態が存在できるか」を制限します。Business Logic
は「現在の状態からどの状態へ変更できるか」を判断します。

### English

A Type controls which states may exist. Business Logic controls which
transitions are allowed from the current state.

### 한국어

Type은 **어떤 상태가 존재할 수 있는지**를 제한합니다. Business Logic은
**현재 상태에서 어떤 상태로 이동할 수 있는지**를 판단합니다.

예:

``` text
배송중 → 결제완료
```

`"결제완료"`는 `OrderStatus`에 있으므로 Type 관점에서는 유효합니다.
하지만 배송 중인 주문이 결제완료로 돌아가는 것은 일반적인 주문 흐름상
이상하므로 Business Logic 관점에서는 잘못된 전환입니다.

> **팁**
>
> 항상
> `① 값 자체가 유효한가? ② 지금 상태에서 그 값으로 바꿔도 되는가?`를
> 따로 질문하세요.

------------------------------------------------------------------------

## 8. Connect Status to React UI

``` tsx
{order.status === "결제완료" && (
  <button>주문 취소</button>
)}
```

### 日本語

注文状態が `"결제완료"` のときだけ条件が `true`
になり、キャンセルボタンが表示されます。`"배송중"` なら表示されません。

### English

The cancel button renders only when `order.status === "결제완료"` is
`true`. If the status is `"배송중"`, the condition is false and the
button is not rendered.

### 한국어

주문 상태가 `"결제완료"`일 때만 조건이 `true`가 되어 주문 취소 버튼이
렌더링됩니다. `"배송중"`이면 조건이 `false`이므로 버튼이 보이지
않습니다.

### UI Rule vs Business Logic

``` text
UI Rule
→ 어떤 버튼을 보여줄지 결정

Business Logic
→ 실제 행동을 허용할지 결정
```

> **팁**
>
> 버튼을 숨겼다고 해서 기능 자체가 완전히 차단되었다고 생각하면 안
> 됩니다. UI 방어와 실제 로직 방어는 구분합니다.

------------------------------------------------------------------------

## 9. Day 10 Flow

``` text
status: string
↓
String Literal Type
↓
Union Type
↓
OrderStatus
↓
status: OrderStatus
↓
Type Error로 잘못된 값 발견
↓
State Transition
↓
Business Logic
↓
조건부 렌더링
↓
상태에 맞는 UI
```

## 10. Key Sentence

### 日本語

**Type は存在できる値を制限し、Business Logic
はその値をどの状況でどのように使えるかを決める。**

### English

**Types restrict which values can exist; Business Logic determines how
those values may be used in a given situation.**

### 한국어

**Type은 어떤 값이 가능한지를 제한하고, Business Logic은 그 값을 어떤
상황에서 어떻게 사용할 수 있는지를 결정한다.**

> **팁**
>
> Day 10이 헷갈릴 때는 이 한 문장과 전체 흐름만 먼저 복원하세요.
