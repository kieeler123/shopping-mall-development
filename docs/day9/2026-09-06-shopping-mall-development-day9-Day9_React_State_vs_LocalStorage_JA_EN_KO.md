# React State vs localStorage
## 日本語 → English → 한국어

---

# 1. 日本語

## React State と `localStorage` の違い

注文キャンセル処理には、次の2つのコードがあります。

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

どちらにも `updatedOrders` を渡していますが、役割はまったく異なります。

```text
React state
→ 現在の画面で使うデータ

localStorage
→ ブラウザに保存して後でも使うデータ
```

**Tip**

最初は次のように覚えると分かりやすいです。

```text
state = 画面
localStorage = 保存
```

---

## 1. React State の役割

現在のコード：

```tsx
const [orders, setOrders] = useState<Order[]>([]);
```

`orders` は現在の React コンポーネントが使用する state です。

例えば：

```tsx
<p>注文状態: {order.status}</p>
```

のような UI も、最終的には現在の state をもとに表示されます。

そして：

```tsx
setOrders(updatedOrders);
```

を実行すると、React に新しい state を渡します。

```text
setOrders(updatedOrders)
↓
orders の state が更新される
↓
React が新しい state を使って再レンダリング
↓
画面が更新される
```

**Tip**

`setOrders()` は単なる変数代入ではなく、React の state 更新を開始する setter と考えます。

---

## 2. State は永続的な保存場所ではない

例えば：

```tsx
setOrders(updatedOrders);
```

によって現在の画面では：

```text
1001 → 支払い完了
1002 → キャンセル完了
1003 → 支払い完了
```

になったとします。

しかしページをリロードすると、コンポーネントは再び初期化されます。

```tsx
const [orders, setOrders] = useState<Order[]>([]);
```

初期値は：

```tsx
[]
```

です。

そのため React state 自体を永続的な保存場所として考えることはできません。

---

## 3. `localStorage` の役割

変更した注文を：

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

として保存します。

概念的には：

```text
Browser
└── localStorage
      └── orders
           └── updatedOrders の JSON 文字列
```

という形です。

`localStorage` のデータは通常、ページをリロードしても残ります。

**Tip**

`localStorage` は React の機能ではなく、ブラウザが提供する Web Storage の仕組みです。

---

## 4. ページ開始時に `localStorage` から State へ復元する

現在のコード：

```tsx
useEffect(() => {
  const savedOrders = localStorage.getItem("orders");

  if (savedOrders) {
    const parsedOrders: Order[] = JSON.parse(savedOrders);

    setOrders(parsedOrders);
  }

  setLoading(false);
}, []);
```

流れ：

```text
ページ開始
↓
orders = []
↓
useEffect
↓
localStorage.getItem("orders")
↓
保存された JSON 文字列
↓
JSON.parse()
↓
JavaScript の注文配列
↓
setOrders(parsedOrders)
↓
React state に復元
↓
再レンダリング
```

重要なのは、`localStorage` の値が自動的に React state になるわけではないことです。

```tsx
setOrders(parsedOrders);
```

によって明示的に state に入れています。

**Tip**

この処理は：

```text
localStorage → React state
```

をつなぐ橋だと考えると分かりやすいです。

---

## 5. 注文キャンセル時は逆方向

まず：

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

によって最新の注文配列を作ります。

その後：

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

を実行します。

```text
                    updatedOrders
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
     localStorage.setItem()      setOrders()
              │                       │
              ▼                       ▼
       ブラウザに保存           React state 更新
              │                       │
              ▼                       ▼
       リロード後も維持           UI 再レンダリング
```

---

## 6. `localStorage` だけ更新すると？

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

// setOrders(updatedOrders);
```

この場合：

```text
localStorage
→ 1002 キャンセル完了

React state
→ 1002 支払い完了
```

のようにズレる可能性があります。

`localStorage.setItem()` は React の state setter ではないため、React に state 更新を通知しません。

**Tip**

`localStorage` を変更しても React の現在の画面が自動的に更新されるとは考えないようにします。

---

## 7. `localStorage` だけ変更した後にリロードすると？

現在の画面では変化が見えなくても、リロード後に：

```tsx
localStorage.getItem("orders")
```

で最新データを読み、

```tsx
setOrders(parsedOrders);
```

を実行すると、画面に「キャンセル完了」が表示される可能性があります。

```text
キャンセル
↓
localStorage だけ更新
↓
現在の state は古いまま
↓
現在の画面も古いまま

--- Reload ---

localStorage から最新データ取得
↓
JSON.parse()
↓
setOrders()
↓
画面に反映
```

---

## 8. `setOrders()` だけ更新すると？

```tsx
// localStorage.setItem(...);

setOrders(updatedOrders);
```

この場合、現在の画面はすぐに：

```text
キャンセル完了
```

になります。

しかし `localStorage` は古いままです。

リロードすると：

```text
Reload
↓
state 初期化
↓
localStorage から古いデータ取得
↓
setOrders()
↓
支払い完了に戻る
```

ように見える可能性があります。

**Tip**

「画面では変更されたが、リロードすると元に戻る」場合は、永続化処理を確認します。

---

## 9. なぜ両方必要なのか

現在のプロジェクトでは：

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

の両方に役割があります。

```text
localStorage.setItem()
→ 保存担当
→ リロード後にも維持

setOrders()
→ React state 更新担当
→ 現在の UI を更新
```

覚え方：

```text
localStorage = 後のために保存
setOrders() = 今の画面に反映
```

---

## 10. データ全体の循環

ページ開始：

```text
localStorage
     │
     │ getItem()
     ▼
JSON 文字列
     │
     │ JSON.parse()
     ▼
JavaScript 配列
     │
     │ setOrders()
     ▼
React state
     │
     ▼
UI
```

注文キャンセル：

```text
React state
     │
     │ map()
     ▼
updatedOrders
     │
     ├──────────────┐
     │              │
     ▼              ▼
setOrders()    JSON.stringify()
     │              │
     ▼              ▼
再レンダリング  localStorage.setItem()
                    │
                    ▼
                  保存
```

**Tip**

コードを暗記するより、「データがどこからどこへ移動するか」を矢印で追うと理解しやすくなります。

---

## 11. React は `localStorage` を自動監視しない

```tsx
localStorage.setItem("orders", ...);
```

を実行しても React が自動的に：

```text
orders が変わった！
再レンダリングしよう！
```

と判断するわけではありません。

React が管理している state は：

```tsx
const [orders, setOrders] = useState<Order[]>([]);
```

です。

そのため：

```tsx
setOrders(updatedOrders);
```

によって React の state 更新を行います。

```text
React
└── state
     └── setOrders()

Browser
└── localStorage
     └── setItem()
```

---

## Final Mental Model

```text
React state
→ 現在の UI が使うデータ

setOrders()
→ state を更新
→ React の再レンダリングにつながる

localStorage
→ ブラウザにデータを保存
→ リロード後もデータを維持

注文状態変更
→ updatedOrders を作る
→ localStorage に保存
→ setOrders() で state に反映
```

---

# 2. English

## Difference Between React State and `localStorage`

The cancellation logic contains these two operations:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

Both receive `updatedOrders`, but they have different responsibilities.

```text
React state
→ data used by the current UI

localStorage
→ data persisted in the browser for later use
```

**Tip**

A useful beginner mental model is:

```text
state = screen
localStorage = storage
```

---

## 1. What React State Does

Current code:

```tsx
const [orders, setOrders] = useState<Order[]>([]);
```

`orders` is state used by the current React component.

UI such as:

```tsx
<p>Order status: {order.status}</p>
```

is ultimately rendered from the current state.

When:

```tsx
setOrders(updatedOrders);
```

runs:

```text
setOrders(updatedOrders)
↓
orders state is updated
↓
React renders using the new state
↓
the UI reflects the new data
```

**Tip**

Think of `setOrders()` as a React state setter, not as ordinary variable assignment.

---

## 2. State Is Not Persistent Storage

Suppose:

```tsx
setOrders(updatedOrders);
```

makes the current state:

```text
1001 → Paid
1002 → Cancelled
1003 → Paid
```

The current screen can display this correctly.

However, after a page reload, the component starts again from its initial state:

```tsx
const [orders, setOrders] = useState<Order[]>([]);
```

which begins with:

```tsx
[]
```

Therefore React state itself should not be treated as persistent storage.

---

## 3. What `localStorage` Does

We save the changed orders with:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

Conceptually:

```text
Browser
└── localStorage
      └── orders
           └── JSON string of updatedOrders
```

The stored value normally survives a page reload.

**Tip**

`localStorage` is a browser Web Storage feature. It is not React state.

---

## 4. Restoring `localStorage` Data Into State

Current code:

```tsx
useEffect(() => {
  const savedOrders = localStorage.getItem("orders");

  if (savedOrders) {
    const parsedOrders: Order[] = JSON.parse(savedOrders);

    setOrders(parsedOrders);
  }

  setLoading(false);
}, []);
```

Flow:

```text
page starts
↓
orders = []
↓
useEffect
↓
localStorage.getItem("orders")
↓
stored JSON string
↓
JSON.parse()
↓
JavaScript order array
↓
setOrders(parsedOrders)
↓
React state restored
↓
render
```

The important point is that `localStorage` does not automatically become React state.

We explicitly bridge the two with:

```tsx
setOrders(parsedOrders);
```

**Tip**

Think of this as a bridge:

```text
localStorage → React state
```

---

## 5. Cancellation Goes in the Other Direction

First we create:

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

Then:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

Flow:

```text
                    updatedOrders
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
     localStorage.setItem()      setOrders()
              │                       │
              ▼                       ▼
        browser storage          React state
              │                       │
              ▼                       ▼
       survives reload          UI re-render
```

---

## 6. What If Only `localStorage` Is Updated?

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

// setOrders(updatedOrders);
```

Possible result:

```text
localStorage
→ 1002 Cancelled

React state
→ 1002 Paid
```

`localStorage.setItem()` is not a React state setter.

It does not automatically tell React that the component state has changed.

**Tip**

Do not assume that changing `localStorage` automatically updates the current React UI.

---

## 7. Why Can Reload Suddenly Show the New Value?

If only `localStorage` was changed, the current state may remain old.

But after reload:

```tsx
localStorage.getItem("orders")
```

reads the updated stored value.

Then:

```tsx
setOrders(parsedOrders);
```

puts that value into state.

```text
cancel
↓
update localStorage only
↓
current state remains old
↓
current UI may remain old

--- Reload ---

read latest localStorage
↓
JSON.parse()
↓
setOrders()
↓
UI shows Cancelled
```

---

## 8. What If Only `setOrders()` Is Called?

```tsx
// localStorage.setItem(...);

setOrders(updatedOrders);
```

The current React UI can immediately show:

```text
Cancelled
```

But `localStorage` still contains the old value.

After reload:

```text
reload
↓
state starts again
↓
read old localStorage data
↓
setOrders()
↓
Paid appears again
```

**Tip**

If a change appears correctly but disappears after a reload, check whether persistence was updated.

---

## 9. Why Both Are Needed

In the current project:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

each operation has a separate responsibility.

```text
localStorage.setItem()
→ persistence
→ keeps data after reload

setOrders()
→ React state update
→ updates the current UI
```

Mental model:

```text
localStorage = save for later
setOrders() = reflect it now
```

---

## 10. Complete Data Cycle

When the page starts:

```text
localStorage
     │
     │ getItem()
     ▼
JSON string
     │
     │ JSON.parse()
     ▼
JavaScript array
     │
     │ setOrders()
     ▼
React state
     │
     ▼
UI
```

When an order is cancelled:

```text
React state
     │
     │ map()
     ▼
updatedOrders
     │
     ├──────────────┐
     │              │
     ▼              ▼
setOrders()    JSON.stringify()
     │              │
     ▼              ▼
re-render      localStorage.setItem()
                    │
                    ▼
                 persistence
```

**Tip**

Instead of memorizing individual lines, trace where the data moves.

---

## 11. React Does Not Automatically Watch `localStorage`

Calling:

```tsx
localStorage.setItem("orders", ...);
```

does not automatically tell React:

```text
orders changed
→ re-render
```

React state is managed through:

```tsx
const [orders, setOrders] = useState<Order[]>([]);
```

and updated through:

```tsx
setOrders(updatedOrders);
```

These are two different systems:

```text
React
└── state
     └── setOrders()

Browser
└── localStorage
     └── setItem()
```

---

## Final Mental Model

```text
React state
→ data used by the current UI

setOrders()
→ updates state
→ leads React to render with the new state

localStorage
→ persists data in the browser
→ survives page reloads

order status update
→ create updatedOrders
→ persist it to localStorage
→ reflect it in React state with setOrders()
```

---

# 3. 한국어

## React State와 `localStorage`의 차이

주문 취소 코드에는 다음 두 작업이 있다.

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

둘 다 `updatedOrders`를 사용하지만 역할은 완전히 다르다.

```text
React state
→ 현재 화면에서 사용할 데이터

localStorage
→ 브라우저에 저장해서 나중에도 사용할 데이터
```

**팁**

처음에는 다음처럼 기억하면 쉽다.

```text
state = 화면
localStorage = 저장
```

---

## 1. React State의 역할

현재 코드:

```tsx
const [orders, setOrders] = useState<Order[]>([]);
```

`orders`는 현재 React 컴포넌트가 사용하는 state다.

예를 들어:

```tsx
<p>주문상태: {order.status}</p>
```

같은 UI도 결국 현재 state를 기반으로 렌더링된다.

그리고:

```tsx
setOrders(updatedOrders);
```

를 실행하면:

```text
setOrders(updatedOrders)
↓
orders state 업데이트
↓
React가 새로운 state를 사용해 다시 렌더링
↓
화면에 새로운 데이터 반영
```

이라는 흐름이 만들어진다.

**팁**

`setOrders()`는 단순 변수 대입이 아니라 React의 state 업데이트를 요청하는 setter라고 생각하면 된다.

---

## 2. State는 영구 저장소가 아니다

예를 들어:

```tsx
setOrders(updatedOrders);
```

를 실행해서 현재 state가:

```text
1001 → 결제완료
1002 → 취소완료
1003 → 결제완료
```

가 되었다고 하자.

현재 화면에서는 정상적으로 보일 수 있다.

하지만 페이지를 새로고침하면 컴포넌트가 다시 시작된다.

```tsx
const [orders, setOrders] = useState<Order[]>([]);
```

초기값은:

```tsx
[]
```

이다.

따라서 React state 자체를 영구 저장소처럼 생각하면 안 된다.

---

## 3. `localStorage`의 역할

변경된 주문은:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

로 저장한다.

개념적으로:

```text
Browser
└── localStorage
      └── orders
           └── updatedOrders의 JSON 문자열
```

형태다.

`localStorage`에 저장한 값은 일반적으로 페이지를 새로고침해도 남아 있다.

**팁**

`localStorage`는 React 기능이 아니라 브라우저가 제공하는 Web Storage 기능이다. React state와 별개의 시스템이라고 생각해야 한다.

---

## 4. 페이지 시작 시 `localStorage`에서 State로 복원

현재 코드:

```tsx
useEffect(() => {
  const savedOrders = localStorage.getItem("orders");

  if (savedOrders) {
    const parsedOrders: Order[] = JSON.parse(savedOrders);

    setOrders(parsedOrders);
  }

  setLoading(false);
}, []);
```

흐름:

```text
페이지 시작
↓
orders = []
↓
useEffect
↓
localStorage.getItem("orders")
↓
저장된 JSON 문자열
↓
JSON.parse()
↓
JavaScript 주문 배열
↓
setOrders(parsedOrders)
↓
React state에 복원
↓
재렌더링
```

중요한 점은 `localStorage`의 데이터가 자동으로 React state가 되는 것이 아니라는 것이다.

우리가 직접:

```tsx
setOrders(parsedOrders);
```

를 실행해서 state에 넣는다.

**팁**

이 부분은:

```text
localStorage → React state
```

를 연결하는 다리라고 생각하면 된다.

---

## 5. 주문 취소 시에는 반대 방향으로 진행된다

먼저:

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

로 최신 주문 배열을 만든다.

그다음:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

를 실행한다.

```text
                    updatedOrders
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
     localStorage.setItem()      setOrders()
              │                       │
              ▼                       ▼
       브라우저에 저장           React state 변경
              │                       │
              ▼                       ▼
       새로고침 후 유지            UI 재렌더링
```

---

## 6. `localStorage`만 업데이트하면?

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

// setOrders(updatedOrders);
```

이 경우:

```text
localStorage
→ 1002 취소완료

React state
→ 1002 결제완료
```

처럼 서로 다른 상태가 될 수 있다.

`localStorage.setItem()`은 React state setter가 아니기 때문이다.

React에게 state가 변경되었다고 자동으로 알려주지 않는다.

**팁**

`localStorage`가 변경되었다고 현재 React UI까지 자동으로 변경된다고 생각하면 안 된다.

---

## 7. 그런데 새로고침하면 왜 바뀐 값이 나타날 수 있을까?

`localStorage`만 업데이트했다면 현재 state는 여전히 오래된 상태일 수 있다.

하지만 새로고침하면:

```tsx
localStorage.getItem("orders")
```

로 최신 저장 데이터를 읽고:

```tsx
setOrders(parsedOrders);
```

로 state에 넣는다.

```text
주문 취소
↓
localStorage만 변경
↓
현재 state는 그대로
↓
현재 화면도 그대로일 수 있음

--- 새로고침 ---

localStorage에서 최신 데이터 읽기
↓
JSON.parse()
↓
setOrders()
↓
화면에 취소완료 표시
```

---

## 8. 반대로 `setOrders()`만 실행하면?

```tsx
// localStorage.setItem(...);

setOrders(updatedOrders);
```

현재 React state는 바로 바뀌므로 화면에는:

```text
취소완료
```

가 나타날 수 있다.

하지만 `localStorage`에는 여전히 이전 데이터가 있다.

새로고침하면:

```text
새로고침
↓
state 초기화
↓
localStorage에서 옛날 데이터 읽기
↓
setOrders()
↓
다시 결제완료
```

처럼 보일 수 있다.

**팁**

화면에서는 정상적으로 바뀌었는데 새로고침하면 원래대로 돌아온다면 저장 처리가 빠졌는지 확인하면 좋다.

---

## 9. 그래서 둘 다 필요하다

현재 프로젝트에서는:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

둘 다 각각의 역할이 있다.

```text
localStorage.setItem()
→ 저장 담당
→ 새로고침 후에도 데이터 유지

setOrders()
→ React state 변경 담당
→ 현재 UI에 변경 반영
```

간단히 기억하면:

```text
localStorage = 나중을 위해 저장
setOrders() = 지금 화면에 반영
```

---

## 10. 전체 데이터 순환 구조

페이지가 시작될 때:

```text
localStorage
     │
     │ getItem()
     ▼
JSON 문자열
     │
     │ JSON.parse()
     ▼
JavaScript 배열
     │
     │ setOrders()
     ▼
React state
     │
     ▼
UI
```

주문을 취소할 때:

```text
React state
     │
     │ map()
     ▼
updatedOrders
     │
     ├──────────────┐
     │              │
     ▼              ▼
setOrders()    JSON.stringify()
     │              │
     ▼              ▼
재렌더링       localStorage.setItem()
                    │
                    ▼
                 영구 저장
```

그리고 다음 새로고침 때 다시:

```text
localStorage
↓
React state
↓
UI
```

로 이어진다.

**팁**

코드를 한 줄씩 외우는 것보다 데이터가 어디에서 어디로 이동하는지를 화살표로 그리는 연습이 훨씬 중요하다.

---

## 11. React는 `localStorage`를 자동으로 감시하지 않는다

다음 코드를 실행했다고 해서:

```tsx
localStorage.setItem("orders", ...);
```

React가 자동으로:

```text
orders가 바뀌었다!
↓
재렌더링하자!
```

라고 판단하는 것은 아니다.

React가 관리하는 state는:

```tsx
const [orders, setOrders] = useState<Order[]>([]);
```

이고, 이를 업데이트하는 것은:

```tsx
setOrders(updatedOrders);
```

이다.

두 시스템을 구분하면:

```text
React
└── state
     └── setOrders()

Browser
└── localStorage
     └── setItem()
```

이다.

**팁**

`useState`와 `localStorage`를 같은 종류의 저장소로 생각하지 않는 것이 중요하다.

---

## 12. 지금까지 배운 불변성과 연결

우리는 state를:

```tsx
orders = updatedOrders;
```

처럼 직접 바꾸지 않는다.

대신:

```tsx
setOrders(updatedOrders);
```

를 사용한다.

또한 주문 객체도:

```tsx
order.status = "취소완료";
```

처럼 직접 수정하지 않고:

```tsx
{
  ...order,
  status: "취소완료",
}
```

로 새 객체를 만든다.

전체 구조:

```text
기존 orders
     │
     │ map()
     ▼
새 배열
     │
     ├─ 대상이 아닌 주문 → 기존 객체
     │
     └─ 수정 대상 주문
          │
          │ { ...order }
          ▼
        새 객체
          │
          ▼
     updatedOrders
          │
     ┌────┴─────┐
     ▼          ▼
setOrders()   localStorage
     │          │
     ▼          ▼
현재 UI       지속 저장
```

---

## 최종 Mental Model

```text
① React state
→ 현재 UI가 사용하는 데이터

② setOrders()
→ React state를 변경
→ 새로운 state를 기준으로 렌더링

③ localStorage
→ 브라우저에 데이터를 저장
→ 새로고침 후에도 유지

④ 주문 상태를 변경하면
→ updatedOrders 생성
→ localStorage에 저장
→ setOrders()로 state에 반영
```

Day 9 코드:

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

최종 흐름:

```text
orders
↓
map()
↓
새로운 주문 배열
↓
대상 주문은 {...order}로 새 객체 생성
↓
status: "취소완료"
↓
updatedOrders
↓
┌───────────────────┬───────────────────┐
▼                   ▼
localStorage         React state
저장                 업데이트
↓                   ↓
새로고침 후 유지      현재 UI 재렌더링
```

**팁**

이 코드를 외우기보다 다음 문장을 이해하는 것이 핵심이다.

> **같은 `updatedOrders`를 사용하지만, `localStorage`는 지속 저장을 담당하고 `setOrders()`는 현재 React UI가 사용할 state 업데이트를 담당한다.**
