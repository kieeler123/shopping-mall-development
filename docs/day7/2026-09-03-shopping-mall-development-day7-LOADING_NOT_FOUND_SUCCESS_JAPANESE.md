# Day 7 詳細解説 — Loading / Not Found / Success

この資料では、注文詳細ページの3つのUI状態を実行順序まで含めて整理します。

## 中心テーマ
Loading / Not Found / Success は、注文詳細ページで「まだ確認中」「確認したが存在しない」「正常に見つかった」を区別するための状態設計です。
以下のコード例はDay 7で使った構造をそのまま基準にしています。

### 1. 첫 렌더링
```tsx
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);

const order = orders.find((order) => order.id === orderId);
```
처음에는 `orders=[]`, `loading=true`, `order=undefined`입니다. 이때 `undefined`는 주문이 없다는 확정이 아니라 아직 저장 데이터를 읽지 않았기 때문일 수 있습니다.

### 2. Loading
Loading은 주문 데이터 확인이 아직 끝나지 않은 상태입니다.
```tsx
if (loading) {
  return <p>주문 정보를 확인하는 중입니다.</p>;
}
```
`loading=false`는 데이터가 있다는 뜻이 아니라 **확인이 끝났다**는 뜻입니다.

### 3. useEffect와 재렌더링
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
첫 렌더링 → Loading → useEffect → localStorage 확인
→ setOrders() + setLoading(false) → 재렌더링
```

### 4. Not Found
Not Found의 정확한 조건은 개념적으로:
```text
loading = false + order = undefined
```
입니다.
```tsx
if (!order) {
  return <p>해당 주문을 찾을 수 없습니다.</p>;
}
```
반드시 Loading 검사 뒤에 둡니다.

### 5. 왜 순서가 중요한가
잘못된 순서:
```tsx
if (!order) return <p>Not Found</p>;
if (loading) return <p>Loading</p>;
```
첫 렌더링부터 `order`가 `undefined`이므로 잘못된 Not Found가 먼저 나올 수 있습니다.

올바른 순서:
```tsx
if (loading) return <p>Loading</p>;
if (!order) return <p>Not Found</p>;
return <p>Success</p>;
```

### 6. Success
Success는:
```text
loading = false + order = Order
```
입니다. Loading과 Not Found가 early return으로 제거되었기 때문에 마지막 `return`은 자연스럽게 Success가 됩니다.

### 7. Early Return
```tsx
if (loading) return <LoadingUI />;
if (!order) return <NotFoundUI />;
return <SuccessUI />;
```
각 상태에서 함수를 일찍 종료하여 중첩된 조건문을 줄입니다.

### 8. Type Narrowing
`find()` 결과는 `Order | undefined`일 수 있습니다.
```tsx
if (!order) return <p>Not Found</p>;
<p>{order.name}</p>
```
`if (!order)` 뒤에는 `undefined` 경로가 제거되므로 TypeScript가 `order`를 `Order`로 좁혀 이해할 수 있습니다.

### 9. 정상 ID 실행 흐름
```text
/orders/1002
→ 첫 렌더링: loading=true, order=undefined
→ Loading
→ localStorage 읽기
→ setOrders(), setLoading(false)
→ 재렌더링
→ find() 성공
→ Success
```

### 10. 없는 ID 실행 흐름
```text
/orders/999999
→ Loading
→ localStorage 확인 완료
→ find() 결과 undefined
→ loading=false
→ Not Found
```

### 11. 잘못된 ID
```text
/orders/abc
→ Number("abc")
→ NaN
→ 정상 숫자 주문 ID와 불일치
→ find() 결과 undefined
→ Loading 완료 후 Not Found
```
필요하다면 `Number.isNaN(orderId)`로 잘못된 형식을 별도로 처리할 수 있습니다.

### 12. 상태 조합표
| loading | order | UI |
|---|---|---|
| true | undefined/미확정 | Loading |
| false | undefined | Not Found |
| false | Order | Success |

### 13. 최종 코드
```tsx
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

const order = orders.find((order) => order.id === orderId);

if (loading) {
  return <p>주문 정보를 확인하는 중입니다.</p>;
}

if (!order) {
  return <p>해당 주문을 찾을 수 없습니다.</p>;
}

return <p>주문번호: {order.id}</p>;
```

### 14. Mental Model
```text
페이지 시작
→ loading=true
→ Loading
→ useEffect에서 저장 데이터 확인
→ state 업데이트
→ 재렌더링
→ find()
→ Order 있음: Success
→ Order 없음: Not Found
```

> **Tip**
>
> 가장 중요한 기준은 **`order`가 undefined인가?** 하나가 아니라 **Loading이 끝났는데도 order가 undefined인가?** 입니다.

## 日本語での最重要整理

```text
Loading   = まだ確認中
Not Found = 確認完了 + 該当注文なし
Success   = 確認完了 + 該当注文あり
```

**最重要:** `order === undefined` だけでは Not Found と判断できません。`loading === false` になった後でも `order === undefined` のときに初めて Not Found と判断できます。

> **Tip**
>
> 「Loading → 確認結果」という時間順序で条件を読むと、なぜLoading判定が先なのか理解しやすくなります。
