# Day 7 STEP 1~8 — 질문답변형 총복습

## STEP 1 — Dynamic Route `[id]`

### Q1. `[id]` 폴더는 왜 만들었나요?
**A.** URL의 특정 부분을 가변 값으로 받기 위해 만들었습니다.

```text
app/orders/[id]/page.tsx
↓
/orders/123
/orders/456
```

같은 `page.tsx`가 서로 다른 주문 ID를 처리합니다.

> **팁**
>
> `[id]`는 특정 값이 아니라 **URL의 가변 슬롯**이라고 생각하세요.

### Q2. `/orders/123`의 `123`과 `[id]`는 어떤 관계인가요?
**A.** `[id]`라는 Dynamic Segment에 `"123"`이라는 값이 들어옵니다.

```text
/orders/123
↓
params.id = "123"
```

> **팁**
>
> `[id]`의 `id`는 값이 아니라 파라미터의 이름입니다.

---

## STEP 2 — `Link`

### Q3. 주문 목록에서 `Link`를 왜 사용하나요?
**A.** 선택한 주문의 ID가 포함된 상세 URL로 이동하기 위해서입니다.

```tsx
<Link href={`/orders/${order.id}`}>상세보기</Link>
```

`order.id`가 `123`이면 `/orders/123`으로 이동합니다.

> **팁**
>
> 현재 구조에서 `Link`는 주문 객체 전체를 전달하는 것이 아니라 ID를 URL에 넣습니다.

### Q4. 상세보기 링크를 왜 `order.items.map()` 밖에 두는 게 좋나요?
**A.** 상세보기는 상품 하나가 아니라 주문 하나 전체에 대한 기능이기 때문입니다. `items.map()` 안에 넣으면 같은 주문 상세 링크가 상품 개수만큼 반복됩니다.

> **팁**
>
> 주문 단위 UI와 상품 단위 UI의 책임을 구분하세요.

---

## STEP 3 — `useParams()`

### Q5. `useParams()`는 무엇을 하나요?
**A.** 현재 Dynamic Route의 URL 파라미터 값을 읽습니다.

```tsx
const params = useParams();
```

`/orders/123`이라면 `params.id`는 `"123"`이라고 생각할 수 있습니다.

> **팁**
>
> `Link`가 URL에 값을 쓰고, `useParams()`가 URL에서 값을 읽습니다.

### Q6. 왜 `params.id`는 숫자 `123`이 아니라 문자열 `"123"`인가요?
**A.** URL 경로 자체에는 JavaScript의 number 타입 정보가 없기 때문에 route parameter는 문자열 형태로 읽힙니다.

> **팁**
>
> URL에 숫자처럼 보이는 문자가 있다고 해서 JavaScript number가 되는 것은 아닙니다.

---

## STEP 4 — `localStorage`, `useState`, `useEffect`

### Q7. URL에서 ID를 얻었는데 왜 `localStorage`가 또 필요한가요?
**A.** URL에는 어떤 주문인지 알려주는 ID만 있고, 이름·주소·상품 같은 실제 주문 데이터는 저장된 주문 배열에서 가져와야 하기 때문입니다.

```text
params.id → 검색 조건
orders[] → 검색 대상
```

> **팁**
>
> URL은 **무엇을 찾을지**, `orders[]`는 **어디서 찾을지**를 담당합니다.

### Q8. 왜 `JSON.parse()`를 사용하나요?
**A.** `localStorage`에서 읽은 값은 문자열이기 때문에 저장된 JSON 문자열을 JavaScript 데이터로 복원해야 합니다.

```text
localStorage
↓
JSON 문자열
↓
JSON.parse()
↓
Order[]
```

> **팁**
>
> 저장할 때 `JSON.stringify()`, 읽을 때 `JSON.parse()`를 한 세트로 기억하세요.

### Q9. `setOrders(parsedOrders)`는 `orders = parsedOrders`와 같은가요?
**A.** 아닙니다. `setOrders()`는 현재 렌더링의 변수에 직접 대입하는 것이 아니라 React에 state 업데이트를 요청합니다. 이후 새로운 state를 사용하는 재렌더링으로 이어집니다.

> **팁**
>
> setter는 **직접 대입**이 아니라 **state 업데이트 요청**입니다.

### Q10. 재렌더링할 때 컴포넌트 함수가 다시 실행되는데 왜 `useState([])`가 다시 `[]`로 초기화되지 않나요?
**A.** `[]`는 state가 최초 생성될 때 사용하는 초기값입니다. React는 state를 렌더링 사이에서 보존합니다.

> **팁**
>
> 재렌더링과 재마운트는 다릅니다. `re-render ≠ remount`입니다.

---

## STEP 5 — `Number()`, `NaN`, `===`

### Q11. 왜 `Number(params.id)`가 필요한가요?
**A.** `params.id`는 string이고 현재 프로젝트의 `Order.id`는 number이기 때문입니다.

```ts
"123" === 123 // false
```

따라서:

```tsx
const orderId = Number(params.id);
```

로 타입을 맞춥니다.

> **팁**
>
> 변환부터 하지 말고 먼저 **비교 대상의 타입이 무엇인지** 확인하는 습관을 들이세요.

### Q12. `/orders/abc`라면 어떻게 되나요?
**A.**

```text
Number("abc")
↓
NaN
```

이 됩니다.

```tsx
Number.isNaN(orderId)
```

로 확인할 수 있습니다.

> **팁**
>
> `typeof NaN`은 `"number"`이므로 변환 실패 확인에는 `Number.isNaN()`이 적합합니다.

---

## STEP 6 — `find()`

### Q13. `find()`는 무엇을 반환하나요?
**A.** 조건을 만족하는 첫 번째 요소 하나를 반환하며, 아무것도 찾지 못하면 `undefined`를 반환합니다.

```tsx
const order = orders.find(
  (order) => order.id === orderId
);
```

> **팁**
>
> `find()`를 보면 항상 **못 찾으면 `undefined`**까지 연결하세요.

### Q14. `(order) => order.id === orderId`의 `order`는 무엇인가요?
**A.** `orders[]`에서 현재 검사하고 있는 주문 하나입니다.

```text
orders → 전체 주문 배열
order  → 현재 검사 중인 주문 하나
```

> **팁**
>
> 복수형 `orders`와 단수형 `order`를 구분하면 콜백 코드가 훨씬 쉽게 읽힙니다.

### Q15. 왜 첫 렌더링에서는 `order`가 `undefined`일 수 있나요?
**A.** 최초에는 `orders = []`이고 아직 `useEffect()`가 `localStorage`를 읽기 전이기 때문입니다.

> **팁**
>
> 첫 렌더링의 `undefined`를 바로 **주문 없음**이라고 판단하면 안 됩니다.

---

## STEP 7 — 주문 상세 UI

### Q16. 상세 페이지에서는 왜 `orders.map()`이 아니라 `order` 하나를 사용하나요?
**A.** STEP 6에서 이미 URL과 일치하는 특정 주문 하나를 선택했기 때문입니다.

```text
주문 목록 → orders.map()
주문 상세 → orders.find() → order
```

> **팁**
>
> 목록은 여러 개, 상세는 선택된 하나라는 차이를 기억하세요.

### Q17. 왜 `order.items`에는 `map()`을 사용하나요?
**A.** 주문 하나 안에는 주문 상품이 여러 개 존재할 수 있기 때문입니다.

```text
Order 하나
↓
items 여러 개
↓
map()
↓
상품별 UI
```

> **팁**
>
> 데이터 구조를 **주문 1개 안에 상품 N개**라고 그려보세요.

### Q18. 왜 `products.find()`를 또 사용하나요?
**A.** 각 `item.productId`와 일치하는 상품을 `products[]`에서 찾아 상품명과 가격 같은 정보를 얻기 위해서입니다.

> **팁**
>
> `orders.find()`와 `products.find()`는 검색 대상 배열만 다르고 원리는 같습니다.

---

## STEP 8 — Loading / Not Found / Success

### Q19. 왜 `loading` state를 따로 만들어야 하나요?
**A.** 다음 두 상황은 `orders`만 보면 모두 빈 배열이기 때문입니다.

```text
아직 확인 전 → []
확인 완료 + 실제 주문 없음 → []
```

그래서 데이터와 로딩 상태를 분리합니다.

> **팁**
>
> state는 데이터뿐 아니라 **현재 UI가 어느 단계인지**도 표현할 수 있습니다.

### Q20. 왜 Not Found보다 Loading을 먼저 검사하나요?
**A.** 첫 렌더링에서 `order`가 `undefined`인 이유가 아직 데이터를 읽지 않았기 때문일 수 있기 때문입니다.

```tsx
if (loading) return ...;
if (!order) return ...;
return ...;
```

> **팁**
>
> 조건문의 **순서**도 프로그램의 의미입니다.

### Q21. `if (!order) return ...` 뒤에서는 왜 `order.name`을 안전하게 사용할 수 있나요?
**A.** `order`가 없는 경우는 이미 `return`으로 함수 실행이 종료됐기 때문입니다. 이후 코드에는 `order`가 존재하는 경우만 남습니다. TypeScript도 이 실행 흐름을 바탕으로 타입을 좁힙니다.

> **팁**
>
> 이것이 **type narrowing**의 대표적인 예입니다.

### Q22. Day 7 전체를 한 흐름으로 설명하면?
**A.** 주문 목록에서 ID를 URL에 넣고, Dynamic Route와 `useParams()`로 읽고, 타입을 맞춘 다음, `localStorage`의 `orders[]`에서 `find()`로 주문 하나를 선택하고, Loading / Not Found / Success에 맞춰 상세 UI를 보여주는 과정입니다.

```text
Link
↓
[id]
↓
useParams()
↓
Number()
↓
localStorage → orders[]
↓
find()
↓
Order | undefined
↓
Loading / Not Found / Success
↓
주문 상세 UI
```

> **팁**
>
> 이 흐름을 코드를 보지 않고 말할 수 있다면 Day 7의 핵심 이론이 연결된 것입니다.
