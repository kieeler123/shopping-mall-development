# Day 12 復習問題 / Review Questions / Day 12 복습문제

## 日本語 --- 復習問題

### STEP 1

**Q1.** Day 11とDay
12では、注文ステータスの扱いにどのような違いがありますか？

<details>
<summary><strong>解答を見る</strong></summary>

**A1.** Day 11は注文ステータスを表示する段階で、Day 12は管理者が
`<select>` を使ってフロントエンドstate上のステータスを変更する段階。

</details>

### STEP 2

**Q2.** 次の3つの役割を説明してください。

```text
initialOrders
orders
setOrders
```

<details>
<summary><strong>解答を見る</strong></summary>

**A2.** `initialOrders` は初期データ、`orders`
は現在の注文state、`setOrders`
はそのstateを新しい注文配列に更新する関数。

</details>

### STEP 3

**Q3.** 次のコードの `value={order.status}` は何を意味しますか？

```tsx
<select value={order.status}>
```

<details>
<summary><strong>解答を見る</strong></summary>

**A3.** 現在の `order.status` を `<select>`
の現在の選択値として表示する。

</details>

### STEP 4

**Q4.** `onChange` の `e.target.value`
は何を表しますか？また、`as OrderStatus` は実行時の値を変換しますか？

<details>
<summary><strong>解答を見る</strong></summary>

**A4.** `e.target.value` はユーザーが新しく選択した値。`as OrderStatus`
は実際の値を変換せず、TypeScriptにその値を `OrderStatus`
として扱うよう伝える型アサーション。

</details>

### STEP 5

**Q5.** 外側の `order` と内側の `currentOrder`
の役割の違いを説明してください。

```tsx
currentOrder.id === order.id;
```

は何を確認していますか？

<details>
<summary><strong>解答を見る</strong></summary>

**A5.** `order` は変更対象の注文、`currentOrder`
は新しい配列を作る途中で現在確認している注文。`currentOrder.id === order.id`
は現在確認中の注文が変更対象かを調べる。

</details>

### STEP 6

**Q6.** なぜ注文1件だけを変更する場合でも `orders.map()` で新しい
`Order[]` を作るのですか？

<details>
<summary><strong>解答を見る</strong></summary>

**A6.** `orders` stateの型が `Order[]`
なので、対象注文だけ変更しつつ他の注文も保持した新しい全体配列を
`setOrders()` に渡す必要があるため。

</details>

### STEP 7

**Q7.** 次のコードを説明してください。

```tsx
return {
  ...currentOrder,
  status: newStatus,
};
```

<details>
<summary><strong>解答を見る</strong></summary>

**A7.** 既存の注文情報を新しいオブジェクトにコピーし、`status` だけを
`newStatus` で上書きする。

</details>

### STEP 8

**Q8.** Shallow Copy（浅いコピー）とは何ですか？

次の結果について説明してください。

```tsx
currentOrder === updatedOrder;

currentOrder.items === updatedOrder.items;
```

<details>
<summary><strong>解答を見る</strong></summary>

**A8.**
浅いコピーでは外側のオブジェクトは新しくなるが、ネストした配列・オブジェクトの参照は共有されることがある。そのため
`currentOrder === updatedOrder` は `false`、`items`
を別途コピーしていなければ `currentOrder.items === updatedOrder.items`
は `true` になることがある。

</details>

### STEP 9

**Q9.** `setOrders(updatedOrders)` の後、Reactでは何が起こりますか？

<details>
<summary><strong>解答を見る</strong></summary>

**A9.** `orders`
stateが新しい配列に更新され、Reactが再レンダリングし、`value={order.status}`
に変更後のstatusが反映される。

</details>

### STEP 10

**Q10.** Day
12では注文状態の変更内容がDB/APIに保存されますか？ページを再読み込みするとどうなりますか？

<details>
<summary><strong>解答を見る</strong></summary>

**A10.** Day 12ではDB/APIには保存しない。ページを再読み込みすると
`initialOrders`
を初期値としてstateが再び作られるため、変更内容はリセットされる。

</details>

---

## English --- Review Questions

### STEP 1

**Q1.** What is the difference between Day 11 and Day 12 regarding
`order.status`?

<details>
<summary><strong>Show answers</strong></summary>

**A1.** Day 11 displays the current status. Day 12 lets the admin change
that status in frontend state using a `<select>`.

</details>

### STEP 2

**Q2.** Explain the roles of:

```text
initialOrders
orders
setOrders
```

<details>
<summary><strong>Show answers</strong></summary>

**A2.** `initialOrders` is the initial data, `orders` is the current
state, and `setOrders` updates that state with a new order array.

</details>

### STEP 3

**Q3.** What does this mean?

```tsx
<select value={order.status}>
```

<details>
<summary><strong>Show answers</strong></summary>

**A3.** It makes the `<select>` display the current `order.status`.

</details>

### STEP 4

**Q4.** What does `e.target.value` represent inside `onChange`? Does
`as OrderStatus` convert the runtime value?

<details>
<summary><strong>Show answers</strong></summary>

**A4.** `e.target.value` is the value newly selected by the user.
`as OrderStatus` does not convert the runtime value; it is a TypeScript
type assertion.

</details>

### STEP 5

**Q5.** Explain the difference between the outer `order` and the inner
`currentOrder`. What does this comparison check?

```tsx
currentOrder.id === order.id;
```

<details>
<summary><strong>Show answers</strong></summary>

**A5.** `order` is the target order being changed. `currentOrder` is
each order being checked while constructing the new array. The ID
comparison checks whether the current item is the target.

</details>

### STEP 6

**Q6.** Why do we create a new `Order[]` with `orders.map()` even though
only one order changes?

<details>
<summary><strong>Show answers</strong></summary>

**A6.** The state itself is an `Order[]`, so `setOrders()` needs a
complete new array that keeps the unchanged orders and replaces only the
target order.

</details>

### STEP 7

**Q7.** Explain:

```tsx
return {
  ...currentOrder,
  status: newStatus,
};
```

<details>
<summary><strong>Show answers</strong></summary>

**A7.** It creates a new object from the existing order properties and
overwrites only `status` with `newStatus`.

</details>

### STEP 8

**Q8.** What is a shallow copy? Explain the possible results of:

```tsx
currentOrder === updatedOrder;

currentOrder.items === updatedOrder.items;
```

<details>
<summary><strong>Show answers</strong></summary>

**A8.** A shallow copy creates a new outer object but can share
references to nested values. Therefore `currentOrder === updatedOrder`
is `false`, while `currentOrder.items === updatedOrder.items` can be
`true` if `items` was not copied separately.

</details>

### STEP 9

**Q9.** What happens after:

```tsx
setOrders(updatedOrders);
```

<details>
<summary><strong>Show answers</strong></summary>

**A9.** React updates the `orders` state, re-renders the component, and
the new `order.status` appears through `value={order.status}`.

</details>

### STEP 10

**Q10.** Does Day 12 persist the status change to a DB/API? What happens
after a page refresh?

<details>
<summary><strong>Show answers</strong></summary>

**A10.** No. Day 12 does not persist the change to a DB/API. Refreshing
recreates state from `initialOrders`, so the frontend-only changes are
reset.

</details>

---

## 한국어 --- 복습문제

### STEP 1

**Q1.** Day 11과 Day 12에서 `order.status`를 다루는 방식의 차이를
설명해보세요.

<details>
<summary><strong>정답 및 해설 보기</strong></summary>

**A1.** Day 11에서는 주문 상태를 화면에 표시하기만 했다. Day 12에서는
관리자가 `<select>`를 이용해 프론트엔드 state의 주문 상태를 변경한다.

</details>

### STEP 2

**Q2.** 다음 세 가지의 역할을 각각 설명해보세요.

```text
initialOrders
orders
setOrders
```

<details>
<summary><strong>정답 및 해설 보기</strong></summary>

**A2.** `initialOrders`는 최초 주문 데이터, `orders`는 현재 화면이
사용하는 주문 state, `setOrders`는 새로운 `Order[]`를 state로 저장하는
함수다.

</details>

### STEP 3

**Q3.** 다음 코드의 `value={order.status}`는 어떤 역할을 하나요?

```tsx
<select value={order.status}>
```

<details>
<summary><strong>정답 및 해설 보기</strong></summary>

**A3.** 현재 주문의 `order.status`를 `<select>`의 현재 선택값으로
보여준다. state가 변경되어 `order.status`가 바뀌면 재렌더링 후
`<select>`에도 변경된 값이 표시된다.

</details>

### STEP 4

**Q4.** `onChange` 안의 `e.target.value`는 무엇을 의미하나요?
`as OrderStatus`는 실제 값을 변환하는 코드인가요?

<details>
<summary><strong>정답 및 해설 보기</strong></summary>

**A4.** `e.target.value`는 사용자가 `<select>`에서 새로 선택한 값이다.
`as OrderStatus`는 실제 문자열을 변환하는 코드가 아니라 TypeScript에게
이 값을 `OrderStatus` 타입으로 취급하겠다고 알려주는 타입 단언이다.

</details>

### STEP 5

**Q5.** 바깥쪽 `order`와 안쪽 `currentOrder`의 차이를 설명해보세요.

```tsx
currentOrder.id === order.id;
```

<details>
<summary><strong>정답 및 해설 보기</strong></summary>

**A5.** `order`는 사용자가 변경한 대상 주문이고, `currentOrder`는 새로운
배열을 만들기 위해 현재 검사 중인 주문이다.
`currentOrder.id === order.id`는 현재 검사 중인 주문이 변경 대상
주문인지 확인한다.

</details>

는 무엇을 확인하는 코드인가요?

### STEP 6

**Q6.** 주문 하나의 상태만 바꾸는데도 왜 `orders.map()`을 이용해 새로운
`Order[]` 전체를 만들어야 하나요?

<details>
<summary><strong>정답 및 해설 보기</strong></summary>

**A6.** `orders` state 자체의 타입이 `Order[]`이기 때문이다. 변경된 주문
하나뿐 아니라 변경되지 않은 다른 주문들도 유지한 새로운 전체 배열을
만들어 `setOrders()`에 전달해야 한다.

</details>

### STEP 7

**Q7.** 다음 코드를 말로 설명해보세요.

```tsx
return {
  ...currentOrder,
  status: newStatus,
};
```

<details>
<summary><strong>정답 및 해설 보기</strong></summary>

**A7.** `...currentOrder`로 기존 주문의 속성을 새 객체에 복사하고, 그
뒤의 `status: newStatus`로 기존 status만 새 값으로 덮어쓴다. 따라서 기존
객체를 직접 수정하지 않고 변경된 새 주문 객체를 만들 수 있다.

</details>

### STEP 8

**Q8.** 얕은 복사(Shallow Copy)란 무엇인가요?

다음 두 비교의 결과가 어떻게 될 수 있는지 설명해보세요.

```tsx
currentOrder === updatedOrder;

currentOrder.items === updatedOrder.items;
```

<details>
<summary><strong>정답 및 해설 보기</strong></summary>

**A8.** 얕은 복사는 바깥 객체는 새로 만들지만 내부의 배열이나 객체까지
자동으로 새로 만들지는 않는 복사다. 따라서
`currentOrder === updatedOrder`는 `false`지만, `items`를 따로 복사하지
않았다면 `currentOrder.items === updatedOrder.items`는 `true`일 수 있다.

</details>

### STEP 9

**Q9.** 다음 코드가 실행된 이후 React에서는 어떤 과정이 일어나나요?

```tsx
setOrders(updatedOrders);
```

<details>
<summary><strong>정답 및 해설 보기</strong></summary>

**A9.** `orders` state가 `updatedOrders`로 변경되고 React가 컴포넌트를
재렌더링한다. 새 `orders`를 기준으로 JSX가 다시 실행되고
`value={order.status}`에 변경된 상태가 표시된다.

</details>

### STEP 10

**Q10.** Day 12에서 변경한 주문 상태는 DB/API에 저장되나요? 페이지를
새로고침하면 어떻게 되나요?

<details>
<summary><strong>정답 및 해설 보기</strong></summary>

**A10.** Day 12에서는 아직 DB/API에 저장하지 않는다. 따라서 페이지를
새로고침하면 `useState(initialOrders)`가 다시 실행되어 초기 주문 상태로
돌아간다.

</details>

## 최종 확인 문제

다음 흐름의 빈칸을 직접 설명해보자.

```text
initialOrders
↓
useState
↓
orders
↓
<select value={order.status}>
↓
onChange
↓
e.target.value
↓
newStatus
↓
orders.map()
↓
currentOrder.id === order.id
↓
{ ...currentOrder, status: newStatus }
↓
updatedOrders
↓
setOrders(updatedOrders)
↓
React 재렌더링
↓
변경된 주문 상태 표시
```

그리고 다음 코드를 한 문장으로 설명해보자.

```tsx
onChange={(e) => {
  const newStatus = e.target.value as OrderStatus;

  const updatedOrders = orders.map((currentOrder) => {
    if (currentOrder.id === order.id) {
      return {
        ...currentOrder,
        status: newStatus,
      };
    }

    return currentOrder;
  });

  setOrders(updatedOrders);
}}
```

**정답 예시**

<details>

<summary>
<strong>정답 예시 보기</strong>

</summary>
사용자가 주문 상태를 변경하면 `onChange`에서 새 상태값을 가져오고, 현재
`orders`를 `map()`으로 순회하면서 `id`가 변경 대상과 일치하는 주문만
기존 정보를 복사한 새 객체로 만들어 `status`를 변경한 뒤, 완성된 새로운
`Order[]`를 `setOrders()`에 전달하여 React가 변경된 상태를 다시 화면에
렌더링한다.

</details>
