# Day 13 復習問題 / Review Questions / Day 13 복습문제

[📝 General](2026-09-11-shopping-mall-development-day13-component-separation-props-review.md)\
[✅ PLAN](2026-09-11-shopping-mall-development-day14-custom-hook-logic-separation-plan.md)

---

# 日本語 --- 復習問題

## STEP 1

**Q1.** `AdminOrdersPage`、`OrderCard`、`OrderItemList` の責務を説明してください。

<details><summary><strong>解答を見る</strong></summary>

**A1.** `AdminOrdersPage` は `orders` stateと更新ロジックを所有する。`OrderCard` は注文1件のUIを担当し、`OrderItemList` はその注文の商品一覧を担当する。

</details>

## STEP 2

**Q2.** 次の `orders.map()` は何をしていますか？

```tsx
orders.map((order) => (
  <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
));
```

<details><summary><strong>解答を見る</strong></summary>

**A2.** `orders` から注文を1件ずつ取り出し、それぞれについて `OrderCard` を1つ生成する。

</details>

## STEP 3

**Q3.** Propsとは何ですか？ `OrderCardProps` は何を表しますか？

<details><summary><strong>解答を見る</strong></summary>

**A3.** Propsは親から子へ渡す値。`OrderCardProps` は `OrderCard` が必要とする `order` と `onStatusChange` の型を定義する入力契約。

</details>

## STEP 4

**Q4.** `onStatusChange={handleStatusChange}` の左側と右側の違いは何ですか？

<details><summary><strong>解答を見る</strong></summary>

**A4.** 左側の `onStatusChange` は子が受け取るprop名、右側の `handleStatusChange` は親が実際に定義した関数。

</details>

## STEP 5

**Q5.** なぜ `OrderCard` が `setOrders` を直接呼ばずcallback propを使いますか？

<details><summary><strong>解答を見る</strong></summary>

**A5.** `orders` stateを所有するのが `AdminOrdersPage` だから。子は変更を直接管理せず、callbackを呼んで親に変更を依頼する。

</details>

## STEP 6

**Q6.** なぜ `OrderItemList` は `item: OrderItem` ではなく `items: OrderItem[]` を受け取りますか？

<details><summary><strong>解答を見る</strong></summary>

**A6.** `OrderItemList` の責務が商品1件ではなく商品一覧全体だから。配列全体を受け取り、内部で `items.map()` を実行する。

</details>

## STEP 7

**Q7.** `orders.map()` と `items.map()` はそれぞれどこにあり、何を作りますか？

<details><summary><strong>解答を見る</strong></summary>

**A7.** `orders.map()` は `AdminOrdersPage` にあり `OrderCard` を作る。`items.map()` は `OrderItemList` にあり商品UIを作る。

</details>

## STEP 8

**Q8.** `key` はどこにつけますか？

<details><summary><strong>解答を見る</strong></summary>

**A8.** 各 `map()` が直接返す最上位要素につける。`orders.map()` では `OrderCard`、`items.map()` では商品を表す最上位要素につける。

</details>

## STEP 9

**Q9.** 「データは下へ、イベントは上へ」とはどういう意味ですか？

<details><summary><strong>解答を見る</strong></summary>

**A9.** データは親から子へpropsで渡され、子で起きた変更要求はcallbackを呼ぶことで親へ伝えられるという意味。

</details>

## STEP 10

**Q10.** status変更時の流れを説明してください。

<details><summary><strong>解答を見る</strong></summary>

**A10.** `OrderCard` のselect変更 → `onStatusChange(order.id, newStatus)` → 親の `handleStatusChange` → `setOrders` → 再レンダリング → 更新されたorderがpropsで再び子へ渡される。

</details>

---

# English --- Review Questions

## STEP 1

**Q1.** What are the responsibilities of `AdminOrdersPage`, `OrderCard`, and `OrderItemList`?

<details><summary><strong>Show answer</strong></summary>

**A1.** `AdminOrdersPage` owns the `orders` state and update logic. `OrderCard` renders one order. `OrderItemList` renders the list of products for that order.

</details>

## STEP 2

**Q2.** What does this `orders.map()` do?

```tsx
orders.map((order) => (
  <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
));
```

<details><summary><strong>Show answer</strong></summary>

**A2.** It takes one order at a time from `orders` and creates one `OrderCard` for each order.

</details>

## STEP 3

**Q3.** What are props, and what does `OrderCardProps` represent?

<details><summary><strong>Show answer</strong></summary>

**A3.** Props are values passed from a parent to a child. `OrderCardProps` is the input contract defining the `order` and `onStatusChange` values required by `OrderCard`.

</details>

## STEP 4

**Q4.** What is the difference between the left and right sides of `onStatusChange={handleStatusChange}`?

<details><summary><strong>Show answer</strong></summary>

**A4.** `onStatusChange` is the prop name exposed to the child; `handleStatusChange` is the actual function defined by the parent.

</details>

## STEP 5

**Q5.** Why does `OrderCard` use a callback prop instead of directly calling `setOrders`?

<details><summary><strong>Show answer</strong></summary>

**A5.** Because `AdminOrdersPage` owns the `orders` state. The child requests a change through the callback, while the parent performs the actual state update.

</details>

## STEP 6

**Q6.** Why does `OrderItemList` receive `items: OrderItem[]` instead of `item: OrderItem`?

<details><summary><strong>Show answer</strong></summary>

**A6.** Its responsibility is the entire product list, not one product. It receives the array and runs `items.map()` internally.

</details>

## STEP 7

**Q7.** Where are `orders.map()` and `items.map()`, and what does each create?

<details><summary><strong>Show answer</strong></summary>

**A7.** `orders.map()` is in `AdminOrdersPage` and creates `OrderCard` components. `items.map()` is in `OrderItemList` and creates the individual product UI elements.

</details>

## STEP 8

**Q8.** Where should `key` be placed?

<details><summary><strong>Show answer</strong></summary>

**A8.** On the top-level element directly returned by each `map()`. For `orders.map()`, that is `OrderCard`; for `items.map()`, it is the top-level product element.

</details>

## STEP 9

**Q9.** What does “data down, events up” mean?

<details><summary><strong>Show answer</strong></summary>

**A9.** Data flows from parent to child through props, while a child communicates a requested change upward by calling a callback supplied by the parent.

</details>

## STEP 10

**Q10.** Explain the status-change flow.

<details><summary><strong>Show answer</strong></summary>

**A10.** The select changes in `OrderCard` → `onStatusChange(order.id, newStatus)` is called → the parent's `handleStatusChange` runs → `setOrders` updates state → React re-renders → the updated order flows down again through props.

</details>

---

# 한국어 --- 복습문제

## STEP 1

**Q1.** `AdminOrdersPage`, `OrderCard`, `OrderItemList`는 각각 어떤 책임을 가지나요?

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A1.** `AdminOrdersPage`는 `orders` state와 상태 변경 로직을 소유한다. `OrderCard`는 주문 하나의 UI를 담당하고, `OrderItemList`는 그 주문의 상품 목록 렌더링을 담당한다.

</details>

## STEP 2

**Q2.** 다음 `orders.map()`은 어떤 역할을 하나요?

```tsx
orders.map((order) => (
  <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
));
```

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A2.** `orders` 배열에서 주문을 하나씩 꺼내 각 주문마다 `OrderCard` 하나를 생성한다.

</details>

## STEP 3

**Q3.** props란 무엇이며 `OrderCardProps`는 무엇을 의미하나요?

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A3.** props는 부모가 자식에게 전달하는 값이다. `OrderCardProps`는 `OrderCard`가 필요로 하는 `order`와 `onStatusChange`의 타입을 정의하는 입력 계약이다.

</details>

## STEP 4

**Q4.** `onStatusChange={handleStatusChange}`에서 왼쪽과 오른쪽은 각각 무엇인가요?

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A4.** 왼쪽 `onStatusChange`는 자식이 받는 prop 이름이고, 오른쪽 `handleStatusChange`는 부모가 실제로 정의한 함수다.

</details>

## STEP 5

**Q5.** 왜 `OrderCard`가 `setOrders`를 직접 호출하지 않고 callback prop을 사용하나요?

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A5.** `orders` state의 소유자가 `AdminOrdersPage`이기 때문이다. 자식은 callback을 호출해 변경을 요청하고 실제 state 변경은 부모가 담당한다.

</details>

## STEP 6

**Q6.** 왜 `OrderItemList`는 `item: OrderItem`이 아니라 `items: OrderItem[]`을 받나요?

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A6.** `OrderItemList`의 책임이 상품 하나가 아니라 상품 목록 전체이기 때문이다. 따라서 상품 배열 전체를 받고 내부에서 `items.map()`을 실행한다.

</details>

## STEP 7

**Q7.** 현재 `orders.map()`과 `items.map()`은 각각 어디에서 실행되고 무엇을 생성하나요?

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A7.** `orders.map()`은 `AdminOrdersPage`에서 실행되어 주문별 `OrderCard`를 만든다. `items.map()`은 `OrderItemList`에서 실행되어 상품별 UI를 만든다.

</details>

## STEP 8

**Q8.** `key`는 어디에 붙여야 하나요?

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A8.** 각 `map()`이 직접 반환하는 가장 바깥 요소에 붙인다. `orders.map()`에서는 `OrderCard`, `items.map()`에서는 상품을 나타내는 최상위 요소에 붙인다.

</details>

## STEP 9

**Q9.** 데이터는 아래로, 이벤트 요청은 위로라는 말은 무슨 뜻인가요?

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A9.** 데이터는 부모가 props를 통해 자식에게 내려주고, 자식에서 발생한 변경 요청은 부모에게서 받은 callback 함수를 호출해 위로 전달한다는 뜻이다.

</details>

## STEP 10

**Q10.** 주문 상태를 변경할 때 전체 흐름을 설명해보세요.

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A10.** `OrderCard`의 select 변경 → `onStatusChange(order.id, newStatus)` 호출 → 부모의 `handleStatusChange` 실행 → `setOrders`로 state 변경 → React 재렌더링 → 변경된 `order`가 다시 props로 자식에게 내려간다.

</details>

## 최종 확인 문제

다음 두 흐름을 직접 설명해보자.

```text
orders
↓
orders.map(order)
↓
OrderCard
↓
order.items
↓
OrderItemList
↓
items.map(item)
↓
상품 UI
```

```text
select 변경
↓
onStatusChange(order.id, newStatus)
↓
handleStatusChange
↓
setOrders
↓
재렌더링
↓
변경된 데이터가 props로 다시 내려감
```

<details>
<summary><strong>정답 예시 보기</strong></summary>

`AdminOrdersPage`는 주문 배열을 `orders.map()`으로 순회하면서 주문 하나씩 `OrderCard`에 전달한다. `OrderCard`는 상품 배열인 `order.items`를 `OrderItemList`에 전달하고, `OrderItemList`는 `items.map()`으로 상품을 하나씩 렌더링한다. 사용자가 주문 상태를 변경하면 `OrderCard`가 `onStatusChange` callback을 호출하고, 부모의 `handleStatusChange`가 `setOrders`로 state를 변경한다. 이후 React가 재렌더링하면서 변경된 주문 데이터가 다시 props를 통해 아래로 전달된다.

</details>
