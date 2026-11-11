# Day 8 — Order Cancellation
## STEP-by-STEP Study Notes
### 日本語 → English → 한국어

---

# STEP 1. 既存の注文詳細ページを確認 / Check the Existing Order Detail Page / 기존 주문 상세 페이지 확인

## 日本語

Day 8 を始める前に、Day 7 で作成した注文詳細ページが正常に動作しているか確認します。

基本構造：

```tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Order = {
  id: number;
  productName: string;
  price: number;
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = Number(params.id);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");

    if (savedOrders) {
      const parsedOrders: Order[] = JSON.parse(savedOrders);
      setOrders(parsedOrders);
    }

    setLoading(false);
  }, []);

  const order = orders.find(
    (order) => order.id === orderId
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!order) {
    return <p>注文が見つかりません。</p>;
  }

  return (
    <div>
      <h1>注文詳細</h1>

      <p>注文番号: {order.id}</p>
      <p>商品名: {order.productName}</p>
      <p>価格: {order.price}</p>
    </div>
  );
}
```

確認項目：

```text
/orders/実在するID
→ 詳細表示

/orders/存在しないID
→ Not Found

/orders/abc
→ Not Found
```

**Tip**

Day 8 は既存コードを壊さず、その上にキャンセル機能を追加します。最初に Day 7 の状態を確認しておくとデバッグが簡単になります。

---

## English

Before starting Day 8, verify that the Day 7 order detail page still works correctly.

Expected checks:

```text
/orders/valid-id
→ detail page

/orders/nonexistent-id
→ Not Found

/orders/abc
→ Not Found
```

The page reads the route parameter with `useParams()`, converts it with `Number()`, loads orders from `localStorage`, and finds the matching order with `find()`.

**Tip**

Always confirm the existing feature before adding new behavior. That makes it much easier to tell whether a later bug came from the new cancellation code.

---

## 한국어

Day 8을 시작하기 전에 Day 7에서 만든 주문 상세 페이지가 정상 작동하는지 먼저 확인합니다.

확인할 경로:

```text
/orders/실제ID
→ 주문 상세 표시

/orders/없는ID
→ 주문을 찾을 수 없습니다.

/orders/abc
→ 주문을 찾을 수 없습니다.
```

핵심 흐름:

```text
useParams()
→ params.id
→ Number()
→ orderId
→ localStorage
→ JSON.parse()
→ orders
→ find()
→ 현재 주문 찾기
```

**팁**

새 기능을 추가하기 전에 기존 기능이 정상인지 확인하면, 이후 문제가 생겼을 때 원인을 Day 8 코드로 좁히기 쉽습니다.

---

# STEP 2. キャンセルボタン追加 / Add the Cancel Button / 주문 취소 버튼 추가

## 日本語

注文詳細画面にキャンセルボタンを追加します。

```tsx
<button type="button">
  注文キャンセル
</button>
```

この段階ではまだクリック処理はありません。

**Tip**

UI とロジックを同時に追加せず、まずボタンだけ追加すると変更点を小さく保てます。

---

## English

Add a cancel button to the order detail page.

```tsx
<button type="button">
  Cancel Order
</button>
```

At this step, the button does not do anything yet.

**Tip**

Separating UI creation from behavior makes each step easier to verify.

---

## 한국어

주문 상세 화면에 취소 버튼을 추가합니다.

```tsx
<button type="button">
  주문 취소
</button>
```

아직 클릭 동작은 연결하지 않습니다.

**팁**

UI 추가와 로직 추가를 한 번에 하지 말고, 먼저 버튼이 화면에 잘 나타나는지만 확인하세요.

---

# STEP 3. onClick 接続 / Connect onClick / onClick 연결

## 日本語

イベントハンドラを作ります。

```tsx
function handleCancelOrder() {
  console.log("キャンセルする注文:", orderId);
}
```

ボタンに接続：

```tsx
<button
  type="button"
  onClick={handleCancelOrder}
>
  注文キャンセル
</button>
```

ポイント：

```text
onClick
→ click event

handleCancelOrder
→ event handler
```

`onClick={handleCancelOrder}` は関数を渡します。

```tsx
onClick={handleCancelOrder()}
```

のように書くと、render 時にすぐ実行されるため通常は間違いです。

**Tip**

関数名だけなら「渡す」、`()` が付くと「今すぐ実行」と覚えましょう。

---

## English

Create an event handler:

```tsx
function handleCancelOrder() {
  console.log("Order to cancel:", orderId);
}
```

Connect it to the button:

```tsx
<button
  type="button"
  onClick={handleCancelOrder}
>
  Cancel Order
</button>
```

Core idea:

```text
onClick
→ click event

handleCancelOrder
→ event handler
```

`onClick={handleCancelOrder}` passes the function.

`onClick={handleCancelOrder()}` usually invokes it immediately during render.

**Tip**

A function reference means “run this later.” A function invocation means “run this now.”

---

## 한국어

이벤트 핸들러를 만듭니다.

```tsx
function handleCancelOrder() {
  console.log("취소할 주문:", orderId);
}
```

버튼과 연결합니다.

```tsx
<button
  type="button"
  onClick={handleCancelOrder}
>
  주문 취소
</button>
```

개념:

```text
onClick
→ 클릭 이벤트

handleCancelOrder
→ 이벤트 핸들러
```

`onClick={handleCancelOrder}`는 함수를 전달하는 것입니다.

반면:

```tsx
onClick={handleCancelOrder()}
```

는 렌더링 중 바로 실행될 수 있어 일반적으로 잘못된 형태입니다.

**팁**

함수 이름만 있으면 “전달”, `()`가 붙으면 “즉시 실행”이라고 구분하세요.

---

# STEP 4. confirm 追加 / Add Confirmation / confirm 추가

## 日本語

ユーザーが本当にキャンセルしたいか確認します。

```tsx
function handleCancelOrder() {
  const confirmed = window.confirm(
    "本当にこの注文をキャンセルしますか？"
  );

  if (!confirmed) return;

  console.log(
    "キャンセル処理を続行:",
    orderId
  );
}
```

`window.confirm()` の戻り値：

```text
OK
→ true

Cancel
→ false
```

`if (!confirmed) return;` は Early Return です。

```text
confirmed = false
→ !confirmed = true
→ return
→ 関数終了
```

**Tip**

異常ケースや中止ケースを先に `return` すると、正常処理を深い `if` の中に入れずに済みます。

---

## English

Ask the user to confirm the cancellation.

```tsx
function handleCancelOrder() {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmed) return;

  console.log(
    "Continue cancellation:",
    orderId
  );
}
```

`window.confirm()` returns a boolean.

```text
OK
→ true

Cancel
→ false
```

`if (!confirmed) return;` is an Early Return / guard clause.

**Tip**

Exit early for invalid or cancelled cases so the normal logic remains flat and readable.

---

## 한국어

사용자에게 정말 주문을 취소할지 확인합니다.

```tsx
function handleCancelOrder() {
  const confirmed = window.confirm(
    "정말 이 주문을 취소하시겠습니까?"
  );

  if (!confirmed) return;

  console.log(
    "취소 진행 주문:",
    orderId
  );
}
```

`window.confirm()` 결과:

```text
확인
→ true

취소
→ false
```

`if (!confirmed) return;`은 Early Return입니다.

```text
confirmed = false
→ !confirmed = true
→ return
→ 함수 종료
```

**팁**

취소/실패 케이스를 먼저 종료시키면 정상 로직을 아래쪽에 깔끔하게 유지할 수 있습니다.

---

# STEP 5. filter() 適用 / Apply filter() / filter() 적용

## 日本語

キャンセル対象の注文を除外した新しい配列を作ります。

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

例：

```text
orders
[1001, 1002, 1003]

orderId
1002
```

判定：

```text
1001 !== 1002
→ true
→ 残す

1002 !== 1002
→ false
→ 除外

1003 !== 1002
→ true
→ 残す
```

結果：

```text
[1001, 1003]
```

重要：

```text
find + ===
→ 対象を探す

filter + !==
→ 対象以外を残す
```

`filter()` は元の配列を直接削除せず、新しい配列を作ります。

**Tip**

`filter()` の条件は「削除条件」ではなく「残す条件」です。

---

## English

Create a new array that excludes the cancelled order.

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

Example:

```text
orders
[1001, 1002, 1003]

orderId
1002
```

Result:

```text
[1001, 1003]
```

Mental model:

```text
find + ===
→ find this item

filter + !==
→ keep everything except this item
```

`filter()` does not mutate the original array. It creates a new one.

**Tip**

The callback condition in `filter()` answers: “Should this item stay?”

---

## 한국어

취소할 주문을 제외한 새 배열을 만듭니다.

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

예:

```text
orders
[1001, 1002, 1003]

orderId
1002
```

판단:

```text
1001 !== 1002
→ true
→ 유지

1002 !== 1002
→ false
→ 제외

1003 !== 1002
→ true
→ 유지
```

결과:

```text
[1001, 1003]
```

핵심:

```text
find + ===
→ 얘를 찾아줘

filter + !==
→ 얘 빼고 다 남겨줘
```

`filter()`는 원본 배열을 직접 수정하지 않고 새 배열을 만듭니다.

**팁**

`filter()` 조건은 삭제 조건이 아니라 **남길 조건**입니다.

---

# STEP 6. localStorage 保存 / Save to localStorage / localStorage 저장

## 日本語

作成した `updatedOrders` を `localStorage` に保存します。

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

保存の流れ：

```text
JavaScript Array
↓
JSON.stringify()
↓
JSON String
↓
localStorage
```

`localStorage` は文字列を保存するため `JSON.stringify()` が必要です。

この段階では React state はまだ変わっていません。

```text
React state
[1001,1002,1003]

localStorage
[1001,1003]
```

のように一時的にズレることがあります。

**Tip**

保存するのは必ず `updatedOrders` です。古い `orders` を保存するとキャンセル結果が反映されません。

---

## English

Persist the new array to `localStorage`.

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

Flow:

```text
JavaScript Array
↓
JSON.stringify()
↓
JSON String
↓
localStorage
```

`localStorage` stores strings, so arrays/objects must be serialized.

At this step, React state has not yet changed.

```text
React state
[1001,1002,1003]

localStorage
[1001,1003]
```

**Tip**

Save `updatedOrders`, not the old `orders`.

---

## 한국어

새로 계산한 `updatedOrders`를 `localStorage`에 저장합니다.

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

흐름:

```text
JavaScript 배열
↓
JSON.stringify()
↓
JSON 문자열
↓
localStorage
```

`localStorage`는 문자열 형태로 저장하기 때문에 `JSON.stringify()`가 필요합니다.

이 시점에는 React state가 아직 바뀌지 않았습니다.

```text
React state
[1001,1002,1003]

localStorage
[1001,1003]
```

처럼 잠시 불일치할 수 있습니다.

**팁**

저장할 값은 반드시 `updatedOrders`입니다. 기존 `orders`를 저장하면 취소 결과가 사라집니다.

---

# STEP 7. State 更新 / Update React State / state 갱신

## 日本語

React state も同じ新しい配列に更新します。

```tsx
setOrders(updatedOrders);
```

これで：

```text
localStorage
[1001,1003]

React state
[1001,1003]
```

が一致します。

ただし state は現在の handler 内の変数を直接書き換えるわけではありません。

概念：

```text
Render #1
orders = [1001,1002,1003]

↓ setOrders([1001,1003])

Render #2
orders = [1001,1003]
```

これは state snapshot の考え方です。

その後：

```tsx
const order = orders.find(
  (order) => order.id === orderId
);
```

が再計算され、キャンセルされた `1002` は見つからなくなります。

**Tip**

`setOrders()` は「今の変数を直接変更」ではなく「次の render 用 state 更新を React に要求」と理解しましょう。

---

## English

Update React state with the same new array.

```tsx
setOrders(updatedOrders);
```

Now storage and state match:

```text
localStorage
[1001,1003]

React state
[1001,1003]
```

State behaves like a render snapshot:

```text
Render #1
orders = [1001,1002,1003]

↓ setOrders([1001,1003])

Render #2
orders = [1001,1003]
```

The current event handler may still see the old `orders` snapshot until the next render.

**Tip**

Think of a state setter as requesting the next render state, not mutating the current variable in place.

---

## 한국어

React state도 동일한 새 배열로 갱신합니다.

```tsx
setOrders(updatedOrders);
```

이제:

```text
localStorage
[1001,1003]

React state
[1001,1003]
```

로 맞춰집니다.

state snapshot 관점:

```text
Render #1
orders = [1001,1002,1003]

↓ setOrders([1001,1003])

Render #2
orders = [1001,1003]
```

`setOrders()`는 현재 실행 중인 handler의 `orders` 변수를 직접 바꾸는 것이 아닙니다.

그 다음 렌더링에서는:

```tsx
const order = orders.find(
  (order) => order.id === orderId
);
```

가 다시 계산되고, 취소된 주문은 더 이상 찾을 수 없게 됩니다.

**팁**

`setOrders()`는 현재 변수 mutation이 아니라 **다음 렌더링에 사용할 state 업데이트 요청**입니다.

---

# STEP 8. /orders へ移動 / Navigate to /orders / /orders 이동

## 日本語

最後に注文一覧ページへ移動します。

import：

```tsx
import {
  useParams,
  useRouter,
} from "next/navigation";
```

component 内：

```tsx
const router = useRouter();
```

handler の最後：

```tsx
router.push("/orders");
```

完成した handler：

```tsx
function handleCancelOrder() {
  const confirmed = window.confirm(
    "本当にこの注文をキャンセルしますか？"
  );

  if (!confirmed) return;

  const updatedOrders = orders.filter(
    (order) => order.id !== orderId
  );

  localStorage.setItem(
    "orders",
    JSON.stringify(updatedOrders)
  );

  setOrders(updatedOrders);

  router.push("/orders");
}
```

流れ：

```text
注文キャンセル
↓
confirm
↓
filter()
↓
localStorage 保存
↓
state 更新
↓
router.push("/orders")
↓
注文一覧
```

`router.push()` は新しい history entry を追加しながら移動します。

`router.replace("/orders")` を使うと現在の history entry を置き換えるため、キャンセル済み詳細ページに戻らせたくない場合に検討できます。

**Tip**

学習段階では `push()` で十分です。実際の UX では「戻るボタンでキャンセル済み詳細に戻る必要があるか？」を基準に `push` と `replace` を選びます。

---

## English

Finally, navigate back to the order list.

Import:

```tsx
import {
  useParams,
  useRouter,
} from "next/navigation";
```

Inside the component:

```tsx
const router = useRouter();
```

At the end of the handler:

```tsx
router.push("/orders");
```

Final handler:

```tsx
function handleCancelOrder() {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmed) return;

  const updatedOrders = orders.filter(
    (order) => order.id !== orderId
  );

  localStorage.setItem(
    "orders",
    JSON.stringify(updatedOrders)
  );

  setOrders(updatedOrders);

  router.push("/orders");
}
```

Flow:

```text
Cancel button
↓
confirm
↓
filter()
↓
save to localStorage
↓
update state
↓
router.push("/orders")
↓
order list
```

`router.push()` adds a new history entry.

`router.replace("/orders")` replaces the current history entry and may be better when returning to the cancelled detail page would be undesirable.

**Tip**

Use `push()` to learn the basic navigation flow. Later, choose `push` or `replace` based on the desired Back button behavior.

---

## 한국어

마지막으로 주문 목록 페이지로 이동합니다.

import:

```tsx
import {
  useParams,
  useRouter,
} from "next/navigation";
```

컴포넌트 내부:

```tsx
const router = useRouter();
```

handler 마지막:

```tsx
router.push("/orders");
```

최종 handler:

```tsx
function handleCancelOrder() {
  const confirmed = window.confirm(
    "정말 이 주문을 취소하시겠습니까?"
  );

  if (!confirmed) return;

  const updatedOrders = orders.filter(
    (order) => order.id !== orderId
  );

  localStorage.setItem(
    "orders",
    JSON.stringify(updatedOrders)
  );

  setOrders(updatedOrders);

  router.push("/orders");
}
```

전체 흐름:

```text
주문 취소 클릭
↓
confirm
↓
filter()
↓
localStorage 저장
↓
state 갱신
↓
router.push("/orders")
↓
주문 목록
```

`router.push()`는 history에 새 경로를 추가하면서 이동합니다.

반면:

```tsx
router.replace("/orders");
```

는 현재 history 항목을 교체하므로 취소된 상세 페이지로 뒤로 돌아가게 하고 싶지 않을 때 고려할 수 있습니다.

**팁**

현재 학습에서는 `push()`를 사용하고, 실제 UX에서는 “뒤로가기로 취소된 상세 페이지에 돌아가는 것이 자연스러운가?”를 기준으로 `push`와 `replace`를 선택하세요.

---

# Day 8 Final Code / 最終コード / 최종 코드

```tsx
"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

type Order = {
  id: number;
  productName: string;
  price: number;
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = Number(params.id);

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const savedOrders =
      localStorage.getItem("orders");

    if (savedOrders) {
      const parsedOrders: Order[] =
        JSON.parse(savedOrders);

      setOrders(parsedOrders);
    }

    setLoading(false);
  }, []);

  const order = orders.find(
    (order) => order.id === orderId
  );

  function handleCancelOrder() {
    const confirmed = window.confirm(
      "정말 이 주문을 취소하시겠습니까?"
    );

    if (!confirmed) return;

    const updatedOrders = orders.filter(
      (order) => order.id !== orderId
    );

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

    setOrders(updatedOrders);

    router.push("/orders");
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!order) {
    return <p>주문을 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <h1>주문 상세</h1>

      <p>주문번호: {order.id}</p>
      <p>상품명: {order.productName}</p>
      <p>가격: {order.price}</p>

      <button
        type="button"
        onClick={handleCancelOrder}
      >
        주문 취소
      </button>
    </div>
  );
}
```

---

# Day 8 Final Mental Model / 最終メンタルモデル / 최종 Mental Model

```text
Order Detail
注文詳細
주문 상세
        ↓
Cancel Button
キャンセルボタン
취소 버튼
        ↓
onClick
        ↓
handleCancelOrder
        ↓
confirm
        ↓
if (!confirmed) return
        ↓
filter()
        ↓
updatedOrders
        ↓
┌──────────────────────┐
│ localStorage.setItem │
└──────────────────────┘
        ↓
setOrders(updatedOrders)
        ↓
router.push("/orders")
        ↓
Order List
注文一覧
주문 목록
```

---

# Day 8 Key Concepts / 主要概念 / 핵심 개념

| Concept | 日本語 | English | 한국어 |
|---|---|---|---|
| `onClick` | クリックイベント | Click event | 클릭 이벤트 |
| Event Handler | イベント処理関数 | Event handler | 이벤트 핸들러 |
| `window.confirm()` | 確認ダイアログ | Confirmation dialog | 확인창 |
| Boolean | 真偽値 | Boolean | 불리언 |
| `!` | 論理NOT | Logical NOT | 논리 NOT |
| Early Return | 早期終了 | Early Return | 조기 반환 |
| `filter()` | 条件に合う要素を残す | Keep matching items | 조건에 맞는 항목 유지 |
| Immutability | 不変性 | Immutability | 불변성 |
| `JSON.stringify()` | JSデータをJSON文字列化 | Serialize JS data | JS 데이터를 JSON 문자열로 변환 |
| `localStorage` | ブラウザ保存領域 | Browser storage | 브라우저 저장소 |
| `setOrders()` | React state 更新 | React state update | React state 갱신 |
| State Snapshot | renderごとのstate値 | State per render | 렌더링별 state 값 |
| `useRouter()` | Router操作Hook | Router control hook | 라우터 제어 훅 |
| `router.push()` | 新しい履歴を追加して移動 | Navigate with new history entry | 새 history를 추가하며 이동 |
| `router.replace()` | 現在履歴を置換 | Replace current history entry | 현재 history 항목 교체 |

---

# Day 8 One-Line Summary / 一行まとめ / 한 줄 요약

```text
日本語
注文を探す Day 7 から、
注文データを変更・保存・画面遷移する Day 8 へ。

English
Day 7 was about reading order data.
Day 8 is about changing, persisting, and navigating after that change.

한국어
Day 7이 주문 데이터를 읽는 날이었다면,
Day 8은 주문 데이터를 변경하고 저장한 뒤 화면 흐름까지 바꾸는 날이다.
```
