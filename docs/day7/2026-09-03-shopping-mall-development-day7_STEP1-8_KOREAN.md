# Day 7 이론 총정리 — STEP 1~8

## STEP 1 — Dynamic Route `[id]`

Next.js App Router에서:

```text
app/orders/[id]/page.tsx
```

처럼 대괄호 폴더를 만들면 URL의 특정 위치를 가변 값으로 받을 수 있습니다.

```text
/orders/123
/orders/456
/orders/999
```

모두 같은:

```text
app/orders/[id]/page.tsx
```

가 처리합니다.

여기서 `[id]`의 `id`는 실제 주문번호가 아니라 **URL 파라미터의 이름**입니다.

```text
/orders/123
        ↓
       id = "123"
```

> **팁**
>
> `[id]`를 특정 주문번호가 아니라 **URL에 값을 끼워 넣는 빈칸**이라고 생각하면 이해하기 쉽습니다.

---

## STEP 2 — `Link`로 주문 ID를 URL에 넣기

주문 목록에서 상세 페이지로 이동하려면:

```tsx
<Link href={`/orders/${order.id}`}>상세보기</Link>
```

를 사용합니다.

예를 들어:

```ts
order.id = 123;
```

이라면 실제 링크는:

```text
/orders/123
```

이 됩니다.

중요한 점은 `Link`가 주문 객체 전체를 상세 페이지로 넘기는 것이 아니라는 것입니다.

```text
order.id
↓
URL에 삽입
↓
/orders/123
```

> **팁**
>
> `Link`는 ID를 URL에 **쓰기**, `useParams()`는 URL에서 ID를 **읽기**라고 한 쌍으로 기억하세요.

---

## STEP 3 — `useParams()`로 URL 값 읽기

Client Component에서는:

```tsx
const params = useParams();
```

로 Dynamic Route 값을 읽습니다.

URL이:

```text
/orders/123
```

이라면 개념적으로:

```ts
params = {
  id: "123",
};
```

처럼 생각할 수 있습니다.

따라서:

```tsx
params.id
```

는:

```text
"123"
```

입니다.

중요한 점:

```text
params.id
→ "123"
→ string
```

URL에는 JavaScript의 number 타입 정보가 포함되어 있지 않기 때문입니다.

> **팁**
>
> `[id]` → `params.id`, `[slug]` → `params.slug`처럼 **동적 폴더 이름이 params의 key가 된다**고 연결하세요.

---

## STEP 4 — `localStorage`에서 `orders[]` 가져오기

URL에서 얻은 것은 주문 ID뿐입니다.

실제 주문자의 이름, 전화번호, 주소, 주문 상품 등을 보여주려면 저장된 주문 데이터가 필요합니다.

현재 프로젝트에서는:

```text
localStorage["orders"]
```

에 주문 배열을 저장하고 있습니다.

```tsx
const [orders, setOrders] = useState<Order[]>([]);

useEffect(() => {
  const savedOrders = localStorage.getItem("orders");

  if (savedOrders) {
    const parsedOrders: Order[] = JSON.parse(savedOrders);
    setOrders(parsedOrders);
  }
}, []);
```

전체 데이터 흐름:

```text
localStorage
↓
JSON 문자열
↓
JSON.parse()
↓
Order[]
↓
setOrders()
↓
state 업데이트
↓
재렌더링
```

`localStorage`는 브라우저 Web API이며, 현재 프로젝트에서는 렌더링 이후 브라우저의 외부 시스템과 동기화하는 작업으로 `useEffect()`에서 읽습니다.

> **팁**
>
> `params.id`는 **어떤 주문을 찾을지**, `orders[]`는 **어디서 찾을지**를 담당합니다.

---

## STEP 5 — `Number()`로 string ID를 number로 변환하기

URL에서 얻은:

```tsx
params.id
```

는:

```text
"123"
```

이라는 문자열입니다.

반면 `Order.id`가 number라면:

```text
123
```

입니다.

`===`는 타입까지 비교하므로:

```ts
"123" === 123 // false
```

입니다.

그래서:

```tsx
const orderId = Number(params.id);
```

로 변환합니다.

```text
"123"
↓
Number()
↓
123
```

잘못된 값이면:

```text
Number("abc")
↓
NaN
```

이 나옵니다.

```tsx
Number.isNaN(orderId)
```

로 `NaN` 여부를 확인할 수 있습니다.

> **팁**
>
> ID라고 무조건 `Number()`를 쓰는 것은 아닙니다. **현재 데이터 모델의 `Order.id` 타입에 맞춰 변환하는 것**이 핵심입니다.

---

## STEP 6 — `find()`로 주문 하나 찾기

이제 두 데이터가 준비됐습니다.

```text
orderId
+
orders[]
```

이를 연결하는 코드가:

```tsx
const order = orders.find((order) => order.id === orderId);
```

입니다.

읽는 방법:

```text
orders에서
↓
order를 하나씩 검사하면서
↓
order.id === orderId인지 확인
↓
처음 true가 되는 주문 하나 반환
```

예:

```text
orderId = 1002

1001 === 1002 → false
1002 === 1002 → true
↓
해당 Order 반환
```

찾지 못하면:

```ts
undefined
```

를 반환합니다.

따라서 개념적으로:

```ts
Order | undefined
```

입니다.

> **팁**
>
> `find()`는 **하나를 찾는 메서드**이며, 사용할 때는 항상 `undefined` 가능성을 함께 생각하세요.

---

## STEP 7 — 찾은 `order`를 상세 UI로 출력하기

이제:

```tsx
order.id
order.name
order.phone
order.address
order.totalPrice
order.createdAt
```

같은 값을 JSX에 표시할 수 있습니다.

```tsx
<p>주문번호: {order.id}</p>
<p>이름: {order.name}</p>
<p>전화번호: {order.phone}</p>
<p>주소: {order.address}</p>
<p>총 주문금액: {order.totalPrice.toLocaleString()}원</p>
```

주문 상품은 여러 개일 수 있으므로:

```tsx
order.items.map(...)
```

을 사용합니다.

각 `item`에는:

```text
productId
quantity
```

등이 들어 있고, 상품명과 가격은 `products[]`에서 다시 찾아야 합니다.

```tsx
const product = products.find(
  (product) => product.id === item.productId,
);
```

구조:

```text
orders[]
↓ find()
Order 하나
↓
order.items[]
↓ map()
item 하나씩
↓
products.find()
Product 하나
↓
상품명 / 가격 / 수량 / 소계
```

> **팁**
>
> `find()`는 **특정 하나 선택**, `map()`은 **여러 데이터를 반복해서 UI로 변환**한다고 구분하세요.

---

## STEP 8 — Loading / Not Found / Success 분리하기

첫 렌더링에서는:

```text
orders = []
loading = true
order = undefined
```

가 됩니다.

따라서:

```text
order === undefined
```

만 보고 바로 Not Found라고 판단하면 안 됩니다.

아직 localStorage를 읽기 전일 수 있기 때문입니다.

그래서:

```tsx
if (loading) {
  return (
    <main>
      <p>주문 정보를 확인하는 중입니다.</p>
    </main>
  );
}

if (!order) {
  return (
    <main>
      <p>해당 주문을 찾을 수 없습니다.</p>
    </main>
  );
}

return (
  <main>
    {/* 주문 상세 UI */}
  </main>
);
```

처럼 early return을 사용합니다.

세 상태:

```text
Loading
→ 아직 주문 데이터 확인 중

Not Found
→ 확인 완료 + 해당 주문 없음

Success
→ 확인 완료 + 해당 주문 있음
```

조건 순서:

```text
loading인가?
↓ Yes
Loading

↓ No
order가 없는가?
↓ Yes
Not Found

↓ No
Success
```

> **팁**
>
> `undefined` 하나만 보지 말고 **데이터 로딩이 끝났는지까지 함께 확인**해야 올바른 UI 상태를 결정할 수 있습니다.

---

# Day 7 전체 실행 흐름

```text
주문 목록
↓
<Link href={`/orders/${order.id}`}>
↓
/orders/1002
↓
Dynamic Route [id]
↓
useParams()
↓
params.id = "1002"
↓
Number()
↓
orderId = 1002

동시에:

useState([])
↓
첫 렌더링
↓
loading = true
↓
Loading UI
↓
useEffect()
↓
localStorage.getItem("orders")
↓
JSON.parse()
↓
parsedOrders
↓
setOrders(parsedOrders)
↓
setLoading(false)
↓
재렌더링
↓
orders[]

이후:

orderId + orders[]
↓
find()
↓
Order | undefined
↓
┌─────────────────┐
│                 │
Order 있음       Order 없음
│                 │
↓                 ↓
Success         Not Found
↓
주문 상세 UI
```

# STEP 1~8 연결 요약

```text
STEP 1
Dynamic Route로 가변 URL 만들기

STEP 2
Link로 주문 ID를 URL에 넣기

STEP 3
useParams()로 URL ID 읽기

STEP 4
localStorage에서 orders[] 읽기

STEP 5
Number()로 ID 타입 맞추기

STEP 6
find()로 주문 하나 찾기

STEP 7
찾은 Order를 상세 UI로 출력하기

STEP 8
Loading / Not Found / Success 분리하기
```

## 최종 핵심 문장

**Day 7은 주문 목록의 ID를 URL에 넣고, Dynamic Route와 `useParams()`로 그 ID를 읽은 뒤, `localStorage`에서 불러온 `orders[]`와 연결하여 `find()`로 주문 하나를 찾고, 그 결과를 Loading / Not Found / Success 상태에 맞게 상세 UI로 보여주는 과정입니다.**

> **팁**
>
> 이 전체 흐름을 코드 없이 설명할 수 있으면 Day 7의 핵심 이론을 제대로 이해한 것입니다.
