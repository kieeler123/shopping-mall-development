# Day 10 --- Answers & Explanations / 解答・解説 / 정답·해설

[📝 Problems / 問題 / 문제](2026-09-07-shopping-mall-development-day10-2-PROBLEMS-JA-EN-KO.md)\
[📖 Summary / 総まとめ / 총정리](2026-09-07-shopping-mall-development-day10-1-SUMMARY-JA-EN-KO.md)

## Answer 1

**정답: 4 (`123`)**

### 日本語

`status: string` はすべての文字列を許可しますが、数値は許可しません。

### English

`status: string` accepts any string, but it does not accept a number.

### 한국어

`status: string`은 모든 문자열을 허용하지만 숫자는 허용하지 않습니다.

> **팁**
>
> `"아무거나"`도 문자열이기 때문에 타입상 허용된다는 점이 `string`의
> 한계입니다.

---

## Answer 2

**정답: `"취소완료"`는 Type Error**

### 日本語

`status` は `"결제완료"` という String Literal Type
だけを許可しているためです。

### English

The property accepts only the String Literal Type `"결제완료"`.

### 한국어

`status`에는 `"결제완료"`라는 String Literal Type만 허용되어 있기
때문입니다.

> **팁**
>
> `string인가?`가 아니라 `정확히 지정된 문자열인가?`를 확인합니다.

---

## Answer 3

**정답: 3 (`"환불완료"`)**

### 日本語

`"환불완료"` という String Literal Type は `OrderStatus` という Union
Type に含まれていないため、Type Error になります。

### English

The String Literal Type `"환불완료"` is not included in the
`OrderStatus` Union Type, so it causes a Type Error.

### 한국어

`"환불완료"`라는 String Literal Type이 `OrderStatus`라는 Union Type에
포함되어 있지 않기 때문에 Type Error가 발생합니다.

쉬운 표현:

> `OrderStatus`에 `"환불완료"`가 없기 때문입니다.

> **팁**
>
> 쉬운 표현으로 정확히 이해한 다음 기술적인 표현을 붙여도 충분합니다.

---

## Answer 4

**정답: `b`, `c`**

### 日本語

空白も文字列の一部なので、`"배송완료"`, `"배송 완료"`, `"배송완료 "`
はそれぞれ異なる文字列です。

### English

Spaces are part of a string, so all three strings are different exact
values.

### 한국어

공백도 문자열의 일부이므로 세 문자열은 서로 다른 값입니다.
`OrderStatus`에는 정확히 `"배송완료"`만 포함되어 있습니다.

> **팁**
>
> Literal Type에서는 눈으로 비슷해 보이는지가 아니라 정확한 문자열
> 일치가 중요합니다.

---

## Answer 5

### 日本語

`Order` は注文全体の構造を定義し、`OrderStatus`
は注文状態として許可される値を定義します。

### English

`Order` defines the structure of an order. `OrderStatus` defines the
values allowed as an order status.

### 한국어

`Order`는 주문 전체 구조를 정의하고, `OrderStatus`는 주문 상태로
허용되는 값들을 정의합니다.

> **팁**
>
> `OrderStatus가 상태를 담는다`보다 `허용되는 상태를 정의한다`가 더
> 정확합니다.

---

## Answer 6

### 日本語

`string`
ではすべての文字列が許可されるため、誤字や不正な注文状態も入れられます。`OrderStatus`
を使うことで、事前に定義した状態だけに制限できます。

### English

`string` is too broad because it accepts every string. `OrderStatus`
narrows the allowed values to predefined order statuses.

### 한국어

`string`은 모든 문자열을 허용해서 범위가 너무 넓습니다. `OrderStatus`를
사용하면 미리 정의한 주문 상태만 허용할 수 있고, 잘못된 상태를 Type
Error로 발견할 수 있습니다.

> **팁**
>
> `기존 문제 → 변경 → 효과` 순서로 설명하면 실무에서도 이해하기
> 쉽습니다.

---

## Answer 7

**정답: Type Error X / Business Logic상 잘못된 전환**

### 日本語

`"결제완료"` 自体は `OrderStatus` に含まれているため Type Error
は発生しません。しかし `배송중 → 결제완료`
は注文の流れとして不自然なので Business Logic 上は正しくありません。

### English

No Type Error occurs because `"결제완료"` is a valid `OrderStatus`.
However, the transition `배송중 → 결제완료` is invalid from a Business
Logic perspective.

### 한국어

`"결제완료"`는 `OrderStatus`에 포함되어 있으므로 Type Error는 발생하지
않습니다. 하지만 `배송중 → 결제완료`는 주문 흐름상 이상하므로 Business
Logic 관점에서는 잘못된 상태 전환입니다.

> **팁**
>
> **유효한 값이라고 해서 모든 상태에서 그 값으로 이동할 수 있는 것은
> 아닙니다.**

---

## Answer 8

**정답: 자동으로 막지 못함**

### 日本語

`OrderStatus`
は存在可能な状態だけを定義しています。どの状態からどの状態へ移動できるかという遷移ルールは定義していません。

### English

`OrderStatus` defines which states may exist, but it does not define
which transitions are allowed between those states.

### 한국어

`OrderStatus`에는 가능한 상태 값만 정의되어 있고, 어떤 상태에서 어떤
상태로 이동 가능한지는 정의되어 있지 않습니다.

> **팁**
>
> TypeScript는 우리가 알려준 규칙까지만 검사합니다.

---

## Answer 9

### 日本語

`"결제완료"` の場合は条件が `true`
なのでボタンが表示されます。`"배송중"` の場合は `false`
なので表示されません。

### English

For `"결제완료"`, the condition is true and the button renders. For
`"배송중"`, the condition is false and the button does not render.

### 한국어

`"결제완료"`이면 조건이 `true`라서 주문 취소 버튼이 보이고,
`"배송중"`이면 `false`라서 보이지 않습니다.

> **팁**
>
> `조건 && UI`는 `조건이 true일 때만 오른쪽 UI를 보여준다`라고 읽으면
> 됩니다.

---

## Answer 10

**정답: 완전한 방어라고 볼 수 없음**

### 日本語

ボタンを非表示にすることは UI
上の制御です。実際にキャンセル処理を許可するかどうかは Business Logic
でも制御する必要があります。

### English

Hiding the button is a UI rule. Whether cancellation is actually allowed
must also be enforced by Business Logic.

### 한국어

버튼을 숨기는 것은 UI 차원의 방어입니다. 실제 취소 동작을 허용할지는
Business Logic에서도 별도로 제어해야 합니다.

> **팁**
>
> `화면에서 할 수 없음`과 `로직상 실행할 수 없음`을 구분하세요.

---

## Answer 11 --- Example

### 日本語

最初は `status: string`
だったため、すべての文字列が許可されていました。そこで String Literal
Type を学び、複数の状態を表現するために Union Type を使って
`OrderStatus` を作りました。これにより不正な状態を Type Error
として検出できます。しかし、有効な状態値と有効な State Transition
は別の問題なので、状態遷移には Business Logic
が必要です。最後に現在の状態を Conditional Rendering
と結びつけ、状態に応じて UI を変更しました。

### English

At first, `status: string` allowed every string. We introduced String
Literal Types and combined them with a Union Type to create
`OrderStatus`, allowing TypeScript to catch invalid status values. We
then learned that valid state values and valid State Transitions are
different concerns, so transition rules belong to Business Logic.
Finally, we connected the current order status to Conditional Rendering
so the UI changes according to the state.

### 한국어

처음에는 `status: string`이라 모든 문자열이 허용되었습니다. 그래서
String Literal Type을 배우고, 여러 주문 상태를 표현하기 위해 Union
Type으로 `OrderStatus`를 만들었습니다. 이를 통해 잘못된 상태 값을 Type
Error로 발견할 수 있게 되었습니다. 하지만 유효한 상태 값과 유효한 State
Transition은 다른 문제이므로 상태 전환에는 Business Logic이 필요합니다.
마지막으로 현재 주문 상태를 조건부 렌더링과 연결하여 상태에 따라 UI가
달라지도록 했습니다.

### Key Sentence

> **Type은 어떤 값이 가능한지를 제한하고, Business Logic은 그 값을 어떤
> 상황에서 어떻게 사용할 수 있는지를 결정한다.**

> **팁**
>
> 예시 답안을 그대로 외우지 말고
> `string → Literal → Union → OrderStatus → Business Logic → UI` 흐름을
> 자기 말로 설명할 수 있는지를 확인하세요.
