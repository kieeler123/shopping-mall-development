# Day 9 — Order Status Management
## 日本語 → English → 한국어

---

# 1. 日本語

# Day 9 — 注文ステータス管理機能

## Day 9 の最終目標

Day 8 では `filter()` を使ってキャンセル対象の注文自体を配列から削除しました。

Day 9 では注文を削除せず、`map()` と object spread を使って対象注文の `status` だけを変更します。

```text
注文ステータス変更
↓
map()
↓
対象注文を維持
↓
status だけ変更
```

例：

```tsx
{
  id: 1002,
  productName: "Keyboard",
  price: 50000,
  status: "支払完了"
}
```

↓

```tsx
{
  id: 1002,
  productName: "Keyboard",
  price: 50000,
  status: "キャンセル完了"
}
```

**Tip**

実際のショッピングモールでは注文履歴を完全に削除するより、注文を残したまま状態を変更する設計の方が自然です。

---

## Day 8 → Day 9 の核心

```text
追加 → spread
削除 → filter()
更新 → map()
```

Day 8:

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

Day 9:

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "キャンセル完了",
      }
    : order
);
```

**Tip**

`filter()` は対象を除外し、`map()` は各要素を新しい結果へ変換すると考えると分かりやすいです。

---

# Day 9 STEP 構成

```text
STEP 1
Order 型に status を追加

STEP 2
注文詳細に status を表示

STEP 3
キャンセル処理を filter → map に変更

STEP 4
object spread で対象注文を更新

STEP 5
localStorage に保存

STEP 6
setOrders() で state 更新

STEP 7
キャンセル済み注文のボタン制御

STEP 8
全体テスト
```

**Tip**

特に STEP 3〜4 の `map()` + `{ ...order }` が Day 9 の中心です。

---

# STEP 1 — Order 型に status を追加

```tsx
type Order = {
  id: number;
  productName: string;
  price: number;
  status: string;
};
```

**Tip**

型を先に更新すると、その後 `order.status` を TypeScript 上で安全に扱えます。

---

# STEP 2 — status を画面に表示

```tsx
<p>注文状態: {order.status}</p>
```

**Tip**

変更機能を作る前に現在値を画面に表示すると、更新結果を目で確認できます。

---

# STEP 3 — filter() を map() に変更

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "キャンセル完了",
      }
    : order
);
```

**Tip**

各 `order` に対して callback が何を return するかを一件ずつ追跡してください。

---

# STEP 4 — `{ ...order }` の役割

```tsx
{
  ...order,
  status: "キャンセル完了",
}
```

既存プロパティをコピーして、最後の `status` で古い値を上書きします。

**Tip**

spread の後に変更プロパティを書くことが重要です。

---

# STEP 5 — localStorage 更新

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

```text
map()
↓
updatedOrders
↓
JSON.stringify()
↓
localStorage
```

**Tip**

Day 8 との違いはデータ計算方法です。保存方法は同じです。

---

# STEP 6 — React state 更新

```tsx
setOrders(updatedOrders);
```

```text
updatedOrders
↓
setOrders()
↓
再レンダリング
↓
status: キャンセル完了
```

**Tip**

注文は削除されないため、配列の長さは変わりません。

---

# STEP 7 — キャンセル済み注文を制御

```tsx
<button
  type="button"
  onClick={handleCancelOrder}
  disabled={order.status === "キャンセル完了"}
>
  注文キャンセル
</button>
```

**Tip**

`disabled={条件}` は Boolean による conditional UI の基本パターンです。

---

# STEP 8 — 最終テスト

1. 注文詳細で現在 status を確認
2. キャンセルボタンをクリック
3. confirm でキャンセル → 変更なし
4. confirm で確認 → status 変更
5. localStorage を確認
6. 注文自体が残っていることを確認
7. ボタンが disabled になることを確認

```text
キャンセル前: 3件
キャンセル後: 3件
```

**Tip**

Day 9 は削除ではなく更新なので、注文数が維持されることが重要なチェックポイントです。

---

# Day 8 vs Day 9

| 項目 | Day 8 | Day 9 |
|---|---|---|
| 目的 | 注文削除 | status 更新 |
| 配列メソッド | `filter()` | `map()` |
| 配列長 | 減少 | 維持 |
| 対象注文 | 削除 | 維持 |
| object spread | ほぼ不要 | 重要 |
| localStorage | 更新 | 更新 |
| React state | 更新 | 更新 |

---

# 最終目標コード

```tsx
function handleCancelOrder() {
  const confirmed = window.confirm(
    "本当にこの注文をキャンセルしますか？"
  );

  if (!confirmed) return;

  const updatedOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status: "キャンセル完了",
        }
      : order
  );

  localStorage.setItem(
    "orders",
    JSON.stringify(updatedOrders)
  );

  setOrders(updatedOrders);
}
```

## Final Mental Model

```text
orders
↓
map()
↓
対象注文か？
├─ YES → { ...order, status: 新しい値 }
└─ NO  → 元の order
↓
updatedOrders
↓
localStorage
↓
setOrders()
↓
React Re-render
```

**Tip**

核心は **「配列は `map()` で新しく作り、変更するオブジェクトは `{ ...object }` で新しく作る」** です。


---

# 2. English

# Day 9 — Order Status Management

## Final Goal

On Day 8, cancellation removed an order from the array with `filter()`.

On Day 9, the order remains in the array. We use `map()` and object spread to change only its `status`.

```text
Change order status
↓
map()
↓
Keep the target order
↓
Change only status
```

Example:

```tsx
{
  id: 1002,
  productName: "Keyboard",
  price: 50000,
  status: "Paid"
}
```

↓

```tsx
{
  id: 1002,
  productName: "Keyboard",
  price: 50000,
  status: "Cancelled"
}
```

**Tip**

Real commerce systems usually preserve order history and change its state instead of deleting the record completely.

---

## Day 8 → Day 9 Core Change

```text
Add → spread
Delete → filter()
Update → map()
```

Day 8:

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

Day 9:

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "Cancelled",
      }
    : order
);
```

**Tip**

Think of `filter()` as deciding which items remain, while `map()` decides what each item becomes.

---

# Day 9 STEP Plan

```text
STEP 1
Add status to the Order type

STEP 2
Display status on the detail page

STEP 3
Change cancellation logic from filter to map

STEP 4
Update the target order with object spread

STEP 5
Persist the changed orders to localStorage

STEP 6
Update React state with setOrders()

STEP 7
Handle the cancel button for an already-cancelled order

STEP 8
Run the complete test
```

**Tip**

Steps 3–4 are the heart of Day 9: understanding why `map()` and `{ ...order }` work together.

---

# STEP 1 — Add status to Order

```tsx
type Order = {
  id: number;
  productName: string;
  price: number;
  status: string;
};
```

**Tip**

Updating the TypeScript type first allows later code to use `order.status` safely.

---

# STEP 2 — Display the status

```tsx
<p>Order status: {order.status}</p>
```

**Tip**

Display the current value before implementing the update so you can visually verify the result.

---

# STEP 3 — Replace filter() with map()

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "Cancelled",
      }
    : order
);
```

**Tip**

Trace what the callback returns for every order. This makes `map()` much easier to understand.

---

# STEP 4 — Why `{ ...order }`?

```tsx
{
  ...order,
  status: "Cancelled",
}
```

The spread copies the existing properties and the later `status` property overwrites the old status.

**Tip**

Property order matters: put the property you want to change after the spread.

---

# STEP 5 — Update localStorage

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

```text
map()
↓
updatedOrders
↓
JSON.stringify()
↓
localStorage
```

**Tip**

The persistence mechanism is the same as Day 8. The major change is how `updatedOrders` is calculated.

---

# STEP 6 — Update React State

```tsx
setOrders(updatedOrders);
```

```text
updatedOrders
↓
setOrders()
↓
re-render
↓
status: Cancelled
```

**Tip**

The order remains in the array, so the number of orders should not decrease.

---

# STEP 7 — Handle an Already-Cancelled Order

```tsx
<button
  type="button"
  onClick={handleCancelOrder}
  disabled={order.status === "Cancelled"}
>
  Cancel Order
</button>
```

**Tip**

`disabled={condition}` is a common React pattern for controlling UI behavior with a Boolean expression.

---

# STEP 8 — Final Test

1. Verify the current status on the detail page.
2. Click Cancel Order.
3. Cancel the confirmation dialog → no change.
4. Confirm cancellation → status changes.
5. Check localStorage.
6. Confirm the order still exists.
7. Confirm the cancel button is disabled.

```text
Before: 3 orders
After: 3 orders
```

**Tip**

Day 9 performs an update rather than a deletion, so preserving the array length is an important test.

---

# Day 8 vs Day 9

| Concept | Day 8 | Day 9 |
|---|---|---|
| Goal | Remove order | Change status |
| Array method | `filter()` | `map()` |
| Array length | Decreases | Stays the same |
| Target order | Removed | Preserved |
| Object spread | Mostly unnecessary | Important |
| localStorage | Updated | Updated |
| React state | Updated | Updated |

---

# Final Target Code

```tsx
function handleCancelOrder() {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmed) return;

  const updatedOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status: "Cancelled",
        }
      : order
  );

  localStorage.setItem(
    "orders",
    JSON.stringify(updatedOrders)
  );

  setOrders(updatedOrders);
}
```

## Final Mental Model

```text
orders
↓
map()
↓
Is this the target order?
├─ YES → { ...order, status: newValue }
└─ NO  → original order
↓
updatedOrders
↓
localStorage
↓
setOrders()
↓
React Re-render
```

**Tip**

The key rule is: **create the new array with `map()`, and create a new object with `{ ...object }` for the item being updated.**


---

# 3. 한국어

# Day 9 — 주문 상태 관리 기능 학습 계획

## Day 9 최종 목표

Day 8에서는 주문 취소 시 `filter()`로 주문 자체를 배열에서 제거했습니다.

```text
주문 취소
↓
filter()
↓
주문 자체를 배열에서 제거
```

Day 9에서는 주문을 삭제하지 않고 `map()`을 사용하여 주문의 `status`만 변경합니다.

```text
주문 상태 변경
↓
map()
↓
해당 주문은 유지
↓
status만 변경
```

예:

```tsx
{
  id: 1002,
  productName: "Keyboard",
  price: 50000,
  status: "결제완료"
}
```

↓

```tsx
{
  id: 1002,
  productName: "Keyboard",
  price: 50000,
  status: "취소완료"
}
```

**팁**

실제 쇼핑몰에서는 주문 기록을 완전히 삭제하기보다 주문을 유지하고 상태를 변경하는 구조가 더 자연스럽습니다.

---

## Day 8 → Day 9 핵심 변화

### Day 8 — 삭제

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

```text
1002 주문 자체를 제거
```

### Day 9 — 수정

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "취소완료",
      }
    : order
);
```

```text
1002 주문 유지
↓
1002 객체만 새 객체 생성
↓
status 변경
```

### 배열 state 기본 공식

```text
추가 → spread
삭제 → filter()
수정 → map()
```

**팁**

Day 8의 `filter()`와 Day 9의 `map()`을 비교하면 React 배열 state에서 삭제와 수정의 차이를 명확하게 이해할 수 있습니다.

---

# Day 9 STEP 구성

```text
STEP 1
Order 타입에 status 추가

↓

STEP 2
주문 상세에 status 표시

↓

STEP 3
취소 로직을 filter → map으로 변경

↓

STEP 4
객체 spread로 target 주문 수정

↓

STEP 5
localStorage에 변경된 주문 저장

↓

STEP 6
setOrders()로 state 갱신

↓

STEP 7
취소 완료 주문의 버튼 처리

↓

STEP 8
전체 테스트
```

**팁**

Day 9의 핵심은 STEP 3~4입니다. `map()`과 `{ ...order }`가 왜 함께 사용되는지를 이해하는 것이 중요합니다.

---

# STEP 1 — `Order` 타입에 `status` 추가

기존:

```tsx
type Order = {
  id: number;
  productName: string;
  price: number;
};
```

Day 9:

```tsx
type Order = {
  id: number;
  productName: string;
  price: number;
  status: string;
};
```

주문 데이터 예:

```tsx
{
  id: 1002,
  productName: "Keyboard",
  price: 50000,
  status: "결제완료"
}
```

**팁**

TypeScript 타입부터 수정하면 이후 `order.status`를 안전하게 사용할 수 있습니다.

---

# STEP 2 — 주문 상태 화면에 표시

```tsx
<p>주문상태: {order.status}</p>
```

예상 화면:

```text
주문번호: 1002
상품명: Keyboard
가격: 50000
주문상태: 결제완료

[주문 취소]
```

**팁**

데이터 변경 기능을 만들기 전에 현재 값을 화면에서 확인할 수 있도록 해두면 테스트가 쉬워집니다.

---

# STEP 3 — `filter()`를 `map()`으로 변경

Day 8:

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

Day 9:

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "취소완료",
      }
    : order
);
```

**팁**

`map()` callback이 각각의 주문에 대해 무엇을 `return`하는지 한 항목씩 추적해보세요.

---

# STEP 4 — 왜 `{ ...order }`가 필요한가?

```tsx
{
  ...order,
  status: "취소완료",
}
```

기존 주문:

```tsx
{
  id: 1002,
  productName: "Keyboard",
  price: 50000,
  status: "결제완료"
}
```

변경 결과:

```tsx
{
  id: 1002,
  productName: "Keyboard",
  price: 50000,
  status: "취소완료"
}
```

`...order`로 기존 속성을 복사하고 뒤쪽의 `status`가 기존 값을 덮어씁니다.

**팁**

spread 순서가 중요합니다.

```tsx
{
  ...order,
  status: "취소완료",
}
```

처럼 변경할 속성을 spread 뒤에 작성해야 합니다.

---

# STEP 5 — localStorage 업데이트

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

흐름:

```text
map()
↓
updatedOrders
↓
JSON.stringify()
↓
localStorage
```

**팁**

Day 9에서 바뀌는 것은 새 데이터를 계산하는 방법입니다. `localStorage` 저장 방식은 Day 8과 같습니다.

---

# STEP 6 — React state 업데이트

```tsx
setOrders(updatedOrders);
```

핵심 코드:

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "취소완료",
      }
    : order
);

localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

재렌더링 후:

```text
주문상태: 취소완료
```

가 표시됩니다.

**팁**

Day 8과 달리 주문 객체 자체는 배열에서 사라지지 않습니다. 따라서 `find()`로 해당 주문을 계속 찾을 수 있습니다.

---

# STEP 7 — 이미 취소된 주문 처리

```tsx
<button
  type="button"
  onClick={handleCancelOrder}
  disabled={order.status === "취소완료"}
>
  주문 취소
</button>
```

조건:

```text
결제완료
→ 버튼 활성화

취소완료
→ 버튼 비활성화
```

새로운 학습 포인트:

```tsx
disabled={조건}
```

**팁**

Boolean 조건으로 UI의 사용 가능 여부를 제어하는 패턴은 React에서 매우 자주 사용됩니다.

---

# STEP 8 — 최종 테스트

1. `/orders/1002`에서 `status: 결제완료` 확인
2. 주문 취소 클릭
3. confirm에서 취소 → 변화 없음
4. 다시 주문 취소 클릭
5. confirm에서 확인
6. `status`가 `취소완료`로 변경되는지 확인
7. localStorage에서 주문 1002가 삭제되지 않고 status만 변경됐는지 확인
8. 취소 버튼이 비활성화되는지 확인

특히 주문 개수를 확인합니다.

```text
취소 전: 3개
취소 후: 3개
```

**팁**

Day 9의 취소는 “삭제”가 아니라 “상태 수정”이므로 배열 길이가 유지되어야 합니다.

---

# Day 8 vs Day 9

| 개념 | Day 8 | Day 9 |
|---|---|---|
| 목표 | 주문 제거 | 주문 상태 변경 |
| 배열 메서드 | `filter()` | `map()` |
| 배열 길이 | 감소 | 유지 |
| 주문 객체 | 제거 | 유지 |
| 변경 객체 | 없음 | 새 객체 생성 |
| 객체 spread | 거의 불필요 | 중요 |
| localStorage | 갱신 | 갱신 |
| React state | 갱신 | 갱신 |
| 핵심 개념 | 삭제 | 수정 |

**팁**

Day 9를 완료하면 React 배열 state에서 삭제와 수정 패턴을 실제 기능으로 모두 경험하게 됩니다.

---

# Day 9에서 깊게 공부할 이론

```text
map()
↓
callback return
↓
삼항 연산자 ? :
↓
object spread
↓
property overwrite
↓
reference
↓
immutability
↓
conditional UI
↓
disabled
```

핵심 표현:

```tsx
order.id === orderId
  ? {
      ...order,
      status: "취소완료",
    }
  : order
```

**팁**

삼항 연산자가 복잡하게 느껴진다면 먼저 `if` 문으로 풀어서 이해한 뒤 다시 삼항 연산자로 변환하세요.

---

# Day 9 최종 목표 코드

```tsx
function handleCancelOrder() {
  const confirmed = window.confirm(
    "정말 이 주문을 취소하시겠습니까?"
  );

  if (!confirmed) return;

  const updatedOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status: "취소완료",
        }
      : order
  );

  localStorage.setItem(
    "orders",
    JSON.stringify(updatedOrders)
  );

  setOrders(updatedOrders);
}
```

Day 8과 비교하면 핵심 변화는:

```text
filter()
↓
map() + spread
```

입니다.

**팁**

최종 코드를 외우기보다 STEP별로 직접 만들어가며 각 줄의 역할을 설명할 수 있도록 공부하는 것이 목표입니다.

---

# Day 9 Final Mental Model

```text
Day 8
────────────────────
orders
↓
filter()
↓
대상 제거
↓
새 배열


Day 9
────────────────────
orders
↓
map()
↓
각 주문 검사
↓
대상인가?
   │
 ┌─┴───────────┐
 YES            NO
 │              │
 ▼              ▼
새 객체 생성     기존 객체 유지
│
{ ...order }
│
status 변경
 └──────┬───────┘
        ▼
 updatedOrders
        ↓
 localStorage
        ↓
    setOrders
        ↓
 React Re-render
        ↓
 상태: 취소완료
```

## 최종 핵심 공식

```text
배열 추가
→ spread

배열 항목 삭제
→ filter()

배열 항목 수정
→ map()

객체 수정
→ object spread
```

**팁**

Day 9에서 가장 중요한 한 문장은 다음과 같습니다.

> **배열은 `map()`으로 새로 만들고, 수정할 객체는 `{ ...object }`로 새로 만든다.**

Day 8에서 배운 immutability, reference, state snapshot 개념이 Day 9에서 실제 Update 기능으로 연결됩니다.

