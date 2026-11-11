# Day 9 — Order Status Management
## STEP별 학습 정리 — 日本語 → English → 한국어

---

# STEP 1 — Order 型に `status` を追加 / Add `status` to the Order Type / Order 타입에 `status` 추가

## 日本語

注文状態を管理するために、まず `Order` 型に `status` を追加します。

```tsx
export type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: string;
};
```

新しい注文を作る場所でも初期状態を追加します。

```tsx
const newOrder: Order = {
  // ...
  status: "결제완료",
};
```

TypeScript の型を変更しても、すでに `localStorage` に保存されている古いデータは自動的には変更されません。

**Tip**

型は「データの設計」、`localStorage` は「実際に保存されたデータ」と分けて考えます。

---

## English

To manage order status, first add `status` to the `Order` type.

```tsx
export type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: string;
};
```

Also give newly created orders an initial status.

```tsx
const newOrder: Order = {
  // ...
  status: "결제완료",
};
```

Changing a TypeScript type does not automatically modify old data that is already stored in `localStorage`.

**Tip**

Think of the type as the data design and `localStorage` as the actual persisted runtime data.

---

## 한국어

주문 상태를 관리하려면 먼저 `Order` 타입에 `status`를 추가한다.

```tsx
export type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: string;
};
```

새 주문을 생성하는 곳에도 초기 상태를 추가한다.

```tsx
const newOrder: Order = {
  // ...
  status: "결제완료",
};
```

TypeScript 타입을 수정해도 이미 `localStorage`에 저장된 예전 데이터가 자동으로 변경되지는 않는다.

**팁**

`type = 데이터 설계`, `localStorage = 실제 저장 데이터`로 구분해서 이해한다.

---

# STEP 2 — 注文状態を表示 / Display the Order Status / 주문 상태 표시

## 日本語

注文詳細ページで状態を表示します。

```tsx
<p>주문상태: {order.status}</p>
```

`status` は注文全体の情報なので、`order.items.map()` の内部ではなく注文全体を表示する領域に置くのが自然です。

```tsx
<h2>주문 상세</h2>

<p>주문상태: {order.status}</p>

{order.items.map((item) => (
  // 商品表示
))}
```

**Tip**

「この値は注文全体のものか、各商品ごとのものか？」を考えて JSX の位置を決めます。

---

## English

Display the status on the order detail page.

```tsx
<p>주문상태: {order.status}</p>
```

Because `status` belongs to the entire order, it should normally be outside `order.items.map()`.

```tsx
<h2>주문 상세</h2>

<p>주문상태: {order.status}</p>

{order.items.map((item) => (
  // item UI
))}
```

**Tip**

Ask whether a value belongs to the whole order or to each individual item before deciding where to render it.

---

## 한국어

주문 상세 페이지에서 상태를 표시한다.

```tsx
<p>주문상태: {order.status}</p>
```

`status`는 상품 하나하나가 아니라 주문 전체의 정보이므로 `order.items.map()` 내부보다 주문 전체 영역에 두는 것이 자연스럽다.

```tsx
<h2>주문 상세</h2>

<p>주문상태: {order.status}</p>

{order.items.map((item) => (
  // 상품 UI
))}
```

**팁**

JSX 위치를 정할 때 `이 값은 주문 전체의 값인가, 각각의 상품 값인가?`를 먼저 생각한다.

---

# STEP 3 — `filter()` から `map()` へ / Change `filter()` to `map()` / `filter()`에서 `map()`으로 변경

## 日本語

Day 8 では注文を削除するために `filter()` を使いました。

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

しかし Day 9 では注文を削除せず、状態だけを変更します。

そのため `map()` を使います。

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

考え方：

```text
filter()
→ この要素を残す？削除する？

map()
→ この要素を新しい配列で何にする？
```

**Tip**

削除なら `filter()`、既存要素の更新ならまず `map()` を思い出します。

---

## English

Day 8 used `filter()` because the order itself was removed.

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

Day 9 keeps the order and changes only its status, so use `map()`.

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

Mental model:

```text
filter()
→ Should this element stay in the new array?

map()
→ What should this element become in the new array?
```

**Tip**

Think `filter()` for deletion and `map()` for updating an existing array element.

---

## 한국어

Day 8에서는 주문 자체를 삭제했기 때문에 `filter()`를 사용했다.

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

하지만 Day 9에서는 주문을 삭제하지 않고 상태만 변경한다.

따라서 `map()`을 사용한다.

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

핵심 질문은 다음과 같다.

```text
filter()
→ 이 요소를 새 배열에 넣을까 말까?

map()
→ 이 요소는 새 배열에서 무엇이 될까?
```

**팁**

`삭제 = filter()`, `기존 요소 수정 = map()`을 먼저 떠올린다.

---

# STEP 4 — Object Spread で対象注文を更新 / Update the Target with Object Spread / Object Spread로 대상 주문 수정

## 日本語

対象の注文だけ新しいオブジェクトにします。

```tsx
{
  ...order,
  status: "취소완료",
}
```

`...order` で既存のプロパティをコピーし、その後の `status` で値を上書きします。

順番は重要です。

```tsx
{ ...order, status: "취소완료" }
```

は正しいですが：

```tsx
{ status: "취소완료", ...order }
```

では元の `order.status` によって上書きされる可能性があります。

また object spread は shallow copy です。

```tsx
order === updatedOrder
// false

order.items === updatedOrder.items
// true の可能性
```

**Tip**

「変更する経路だけ新しく作る」と考えます。今回はトップレベルの `status` だけなので object spread で十分です。

---

## English

Create a new object only for the target order.

```tsx
{
  ...order,
  status: "취소완료",
}
```

`...order` copies the existing top-level properties, and the later `status` property overwrites the old status.

Property order matters.

```tsx
{ ...order, status: "취소완료" }
```

is correct, while:

```tsx
{ status: "취소완료", ...order }
```

may allow the original `order.status` to overwrite the new value.

Object spread performs a shallow copy.

```tsx
order === updatedOrder
// false

order.items === updatedOrder.items
// may be true
```

**Tip**

Create new arrays/objects along the path that is being changed. For Day 9, only the top-level `status` changes.

---

## 한국어

수정 대상 주문만 새로운 객체로 만든다.

```tsx
{
  ...order,
  status: "취소완료",
}
```

`...order`가 기존 최상위 프로퍼티를 복사하고, 뒤에 작성한 `status`가 기존 값을 덮어쓴다.

순서도 중요하다.

```tsx
{ ...order, status: "취소완료" }
```

가 올바른 형태다.

반대로:

```tsx
{ status: "취소완료", ...order }
```

라고 하면 기존 `order.status`가 다시 덮어쓸 수 있다.

또한 object spread는 shallow copy다.

```tsx
order === updatedOrder
// false

order.items === updatedOrder.items
// true일 수 있음
```

**팁**

`수정하는 경로만 새로 만든다`고 생각하면 된다. 현재는 최상위 `status`만 수정하므로 `{ ...order }`면 충분하다.

---

# STEP 5 — `localStorage` に保存 / Persist to `localStorage` / `localStorage`에 저장

## 日本語

`updatedOrders` を作っただけでは、ページを再読み込みすると変更が消える可能性があります。

そのため `localStorage` に保存します。

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

`localStorage` は文字列を保存するため、配列を `JSON.stringify()` で JSON 文字列に変換します。

```text
updatedOrders
↓
JSON.stringify()
↓
JSON string
↓
localStorage
```

**Tip**

必ず変更後の `updatedOrders` を保存します。古い `orders` を保存しないように注意します。

---

## English

Creating `updatedOrders` alone does not persist the change across a page reload.

Store the updated array in `localStorage`.

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

Because `localStorage` stores strings, `JSON.stringify()` converts the JavaScript array into a JSON string.

```text
updatedOrders
↓
JSON.stringify()
↓
JSON string
↓
localStorage
```

**Tip**

Persist the newly calculated `updatedOrders`, not the old `orders`.

---

## 한국어

`updatedOrders`만 만들면 브라우저를 새로고침했을 때 변경 상태가 유지되지 않을 수 있다.

따라서 `localStorage`에도 저장한다.

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

`localStorage`는 문자열을 저장하므로 `JSON.stringify()`를 이용해 JavaScript 배열을 JSON 문자열로 변환한다.

```text
updatedOrders
↓
JSON.stringify()
↓
JSON 문자열
↓
localStorage
```

**팁**

기존 `orders`가 아니라 방금 변경한 `updatedOrders`를 저장해야 한다.

---

# STEP 6 — `setOrders()` と React Re-render / `setOrders()` and React Re-render / `setOrders()`와 React 재렌더링

## 日本語

`localStorage` に保存しても、それだけでは現在の React UI が自動的に更新されるわけではありません。

```tsx
setOrders(updatedOrders);
```

で React state を更新します。

```text
updatedOrders
↓
setOrders(updatedOrders)
↓
state update
↓
re-render
↓
新しい state で JSX を再計算
↓
画面に反映
```

`setOrders()` は現在の `orders` 変数を直接書き換える普通の代入ではありません。

各 render は state の snapshot を持つと考えます。

```tsx
setOrders(updatedOrders);

console.log(orders);
```

この `console.log(orders)` は現在の render の古い値を見ることがあります。

次の render では新しい `orders` が使われます。

**Tip**

`setState()` は「今の変数を書き換える」ではなく「次の render で使う state update を React に渡す」と考えます。

---

## English

Saving to `localStorage` does not automatically make the current React UI reactive.

Update React state as well.

```tsx
setOrders(updatedOrders);
```

Flow:

```text
updatedOrders
↓
setOrders(updatedOrders)
↓
state update
↓
re-render
↓
JSX recalculated with new state
↓
UI updated
```

`setOrders()` is not a normal assignment that directly rewrites the current `orders` variable.

Each render can be understood as having its own state snapshot.

```tsx
setOrders(updatedOrders);

console.log(orders);
```

The log may still see the value from the current render. A later render uses the new state.

**Tip**

Think of a state setter as requesting/providing an update for a later render, not as directly rewriting the current local variable.

---

## 한국어

`localStorage`에 저장하는 것만으로 현재 React UI가 자동으로 반응하는 것은 아니다.

React state도 업데이트해야 한다.

```tsx
setOrders(updatedOrders);
```

흐름은:

```text
updatedOrders
↓
setOrders(updatedOrders)
↓
state 업데이트
↓
re-render
↓
새 state로 JSX 재계산
↓
현재 UI 변경
```

`setOrders()`는 현재 `orders` 변수를 즉시 덮어쓰는 일반 대입문이 아니다.

각 render는 자기 시점의 state snapshot을 가진다고 이해할 수 있다.

```tsx
setOrders(updatedOrders);

console.log(orders);
```

이 경우 `console.log(orders)`는 현재 render의 이전 값을 볼 수 있다. 새로운 값은 다음 render에서 사용된다.

**팁**

`setState()`를 `현재 변수 직접 변경`이 아니라 `다음 render에서 사용할 state 업데이트 전달`로 이해한다.

---

# STEP 7 — キャンセル済みボタンを無効化 / Disable an Already-Cancelled Order Button / 이미 취소된 주문 버튼 비활성화

## 日本語

注文状態がすでに `"취소완료"` の場合、キャンセルボタンを再びクリックできないようにします。

```tsx
<button
  type="button"
  onClick={handleCancelOrder}
  disabled={order.status === "취소완료"}
>
  주문 취소
</button>
```

条件：

```tsx
order.status === "취소완료"
```

が `true` なら：

```tsx
disabled={true}
```

となります。

`disabled` はボタンを削除する機能ではありません。

```text
ボタンは表示される
+
クリックできない
```

という状態です。

**Tip**

`disabled` と「非表示」を区別します。ボタンを消したい場合は条件付きレンダリングが必要です。

---

## English

If the order is already `"취소완료"`, prevent the cancel button from being clicked again.

```tsx
<button
  type="button"
  onClick={handleCancelOrder}
  disabled={order.status === "취소완료"}
>
  주문 취소
</button>
```

When:

```tsx
order.status === "취소완료"
```

evaluates to `true`, the button effectively has:

```tsx
disabled={true}
```

`disabled` does not remove the button from the screen.

It means:

```text
button remains visible
+
button cannot be clicked
```

**Tip**

Do not confuse disabling with hiding. Conditional rendering is needed if the button should disappear entirely.

---

## 한국어

주문 상태가 이미 `"취소완료"`라면 취소 버튼을 다시 클릭하지 못하도록 한다.

```tsx
<button
  type="button"
  onClick={handleCancelOrder}
  disabled={order.status === "취소완료"}
>
  주문 취소
</button>
```

다음 비교식:

```tsx
order.status === "취소완료"
```

이 `true`가 되면 결과적으로:

```tsx
disabled={true}
```

가 된다.

`disabled`는 버튼을 화면에서 없애는 것이 아니다.

```text
버튼은 화면에 남아 있음
+
클릭은 할 수 없음
```

이라는 뜻이다.

**팁**

`disabled = 비활성화`, `조건부 렌더링 = 표시/숨김`으로 구분한다.

---

# STEP 8 — 全体テスト / Full Test / 전체 테스트

## 日本語

Day 9 の最後に全体の流れを確認します。

### Test 1 — 新しい注文

```text
新規注文
↓
status = 결제완료
↓
キャンセルボタンはクリック可能
```

### Test 2 — Confirm でキャンセル

```text
注文キャンセルボタン
↓
confirm
↓
キャンセルを選択
↓
何も変更されない
```

### Test 3 — Confirm で確認

```text
注文キャンセルボタン
↓
confirm
↓
確認
↓
status = 취소완료
```

### Test 4 — 注文が削除されていない

```text
注文情報は残る
↓
status だけ変更
```

### Test 5 — 他の注文

対象以外の注文状態は変わらないことを確認します。

### Test 6 — Disabled

```text
status = 취소완료
↓
注文キャンセルボタン
↓
クリック不可
```

### Test 7 — localStorage

保存された注文の：

```json
{
  "status": "취소완료"
}
```

を確認します。

### Test 8 — Reload

ページを再読み込みしても：

```text
status = 취소완료
+
ボタン disabled
```

が維持されれば成功です。

**Tip**

「変更直後」だけでなく「再読み込み後」まで確認すると state と persistence の両方をテストできます。

---

## English

Finish Day 9 by testing the complete flow.

### Test 1 — New Order

```text
create new order
↓
status = 결제완료
↓
cancel button is clickable
```

### Test 2 — Cancel the Confirm Dialog

```text
click cancel order
↓
confirm dialog
↓
choose Cancel
↓
nothing changes
```

### Test 3 — Confirm Cancellation

```text
click cancel order
↓
confirm dialog
↓
choose OK
↓
status = 취소완료
```

### Test 4 — Order Is Not Deleted

```text
order remains
↓
only status changes
```

### Test 5 — Other Orders

Verify that non-target orders remain unchanged.

### Test 6 — Disabled Button

```text
status = 취소완료
↓
cancel button
↓
cannot be clicked
```

### Test 7 — localStorage

Verify that the stored order contains:

```json
{
  "status": "취소완료"
}
```

### Test 8 — Reload

After refreshing the page:

```text
status = 취소완료
+
button remains disabled
```

If this is preserved, the persistence flow works.

**Tip**

Test both the immediate UI update and the state after a browser refresh. This checks both React state and persistence.

---

## 한국어

Day 9 마지막에는 전체 데이터 흐름을 테스트한다.

### 테스트 1 — 새 주문

```text
새 주문 생성
↓
status = 결제완료
↓
취소 버튼 클릭 가능
```

### 테스트 2 — confirm에서 취소

```text
주문 취소 버튼
↓
confirm
↓
취소 선택
↓
아무 변화 없음
```

### 테스트 3 — confirm에서 확인

```text
주문 취소 버튼
↓
confirm
↓
확인 선택
↓
status = 취소완료
```

### 테스트 4 — 주문이 삭제되지 않았는지

```text
주문 정보는 그대로 유지
↓
status만 변경
```

### 테스트 5 — 다른 주문

취소 대상이 아닌 주문의 상태는 그대로여야 한다.

### 테스트 6 — disabled

```text
status = 취소완료
↓
주문 취소 버튼
↓
클릭 불가능
```

### 테스트 7 — localStorage

저장된 주문 데이터에서:

```json
{
  "status": "취소완료"
}
```

인지 확인한다.

### 테스트 8 — 새로고침

브라우저를 새로고침한 뒤에도:

```text
status = 취소완료
+
버튼 클릭 불가능
```

상태가 유지되어야 한다.

**팁**

변경 직후만 확인하지 말고 반드시 새로고침까지 해본다. 그래야 React state와 `localStorage` persistence를 함께 검증할 수 있다.

---

# Day 9 — Complete Code Flow

## 日本語

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

```tsx
<button
  type="button"
  onClick={handleCancelOrder}
  disabled={order.status === "취소완료"}
>
  주문 취소
</button>
```

データフロー：

```text
orders
↓
map()
↓
対象注文？
├─ No  → 元の order
└─ Yes → { ...order, status: "취소완료" }
↓
updatedOrders
↓
├─ JSON.stringify() → localStorage
└─ setOrders() → React state
                    ↓
                 re-render
                    ↓
              status 表示更新
                    ↓
              disabled 再計算
```

---

## English

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

```tsx
<button
  type="button"
  onClick={handleCancelOrder}
  disabled={order.status === "취소완료"}
>
  주문 취소
</button>
```

Data flow:

```text
orders
↓
map()
↓
target order?
├─ No  → original order
└─ Yes → { ...order, status: "취소완료" }
↓
updatedOrders
↓
├─ JSON.stringify() → localStorage
└─ setOrders() → React state
                    ↓
                 re-render
                    ↓
              status UI updates
                    ↓
              disabled recalculated
```

---

## 한국어

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

```tsx
<button
  type="button"
  onClick={handleCancelOrder}
  disabled={order.status === "취소완료"}
>
  주문 취소
</button>
```

전체 데이터 흐름:

```text
orders
↓
map()
↓
수정 대상 주문인가?
├─ No  → 기존 order 그대로
└─ Yes → { ...order, status: "취소완료" }
↓
updatedOrders
↓
├─ JSON.stringify() → localStorage 저장
└─ setOrders() → React state 업데이트
                    ↓
                 re-render
                    ↓
              상태 표시 다시 계산
                    ↓
              disabled 조건 다시 계산
```

---

# Day 9 — Final Formula

## 日本語

```text
追加
→ spread

削除
→ filter()

配列内の要素を更新
→ map()

オブジェクトの一部を更新
→ object spread

永続化
→ JSON.stringify() + localStorage

現在の UI を更新
→ setState()

状態による UI 制御
→ Boolean 条件
```

**Tip**

コードを丸暗記するより、「今やりたい操作は追加・削除・更新・保存・UI反映のどれか？」と分類します。

---

## English

```text
Add
→ spread

Delete
→ filter()

Update an element in an array
→ map()

Update part of an object
→ object spread

Persist
→ JSON.stringify() + localStorage

Update the current React UI
→ setState()

Control UI from state
→ Boolean conditions
```

**Tip**

Instead of memorizing the entire code, first classify the operation: add, delete, update, persist, or reflect state in the UI.

---

## 한국어

```text
추가
→ spread

삭제
→ filter()

배열 안 요소 수정
→ map()

객체 일부 수정
→ object spread

영구 저장
→ JSON.stringify() + localStorage

현재 React UI 반영
→ setState()

상태에 따른 UI 제어
→ Boolean 조건식
```

**팁**

코드를 통째로 외우기보다 `지금 하는 일이 추가 / 삭제 / 수정 / 저장 / UI 반영 중 무엇인가?`를 먼저 판단한다.

---

# Day 9 — One-Line Mental Model

```text
배열은 map()으로 새로 만들고,
수정할 객체는 { ...object }로 새로 만든다.
↓
localStorage에 저장하고,
setState()로 현재 UI에 반영한다.
```
