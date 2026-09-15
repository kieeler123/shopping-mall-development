# Day 16 --- STEP 17. Success / Failure와 React State

## 이번 STEP의 목표

HTTP Response를 받은 뒤 React가 어떤 상태와 UI를 만들어야 하는지
이해한다.

## Response가 왔다고 모두 성공은 아니다

``` text
Request
↓
Response
├─ 2xx Success
└─ 4xx/5xx Failure Status
```

따라서 Response를 받은 다음 처리 결과를 확인해야 한다.

## 성공 흐름

주문 조회:

``` text
GET /orders
↓
200 + JSON
↓
Body 처리
↓
orders 데이터
↓
setOrders(...)
↓
UI
```

주문 생성:

``` text
POST /orders
↓
201 + createdOrder
↓
State에 반영
↓
UI
```

삭제:

``` text
DELETE /orders/10
↓
204 No Content
↓
Body Parsing 불필요
↓
State에서 주문 제거
↓
UI
```

성공 Response가 항상 JSON Body를 갖는 것은 아니다.

## 실패 흐름

``` text
GET /orders/999
↓
404
↓
정상 주문 데이터로 처리하지 않음
↓
Error State
↓
Error UI
```

## Data / Loading / Error

Server 데이터를 사용하는 UI에서는 세 상태를 분리해서 생각하는 것이
중요하다.

``` js
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

아직 구현을 외울 필요는 없다. 상태 모델을 이해하자.

### Loading

``` text
Request 시작
↓
loading = true
↓
"주문을 불러오는 중..."
↓
Response
↓
loading = false
```

### Empty Data와 Loading

``` text
200 + []
→ 조회 성공, 주문이 없음

아직 Response 없음
→ 결과를 모름
```

둘은 다르다.

### Error

``` text
500
→ 데이터를 성공적으로 받았다고 볼 수 없음
→ error 상태
→ 사용자에게 적절한 안내
```

## finally

Day 17 이후에는 다음 구조를 자주 볼 수 있다.

``` text
try
→ 성공 처리

catch
→ 예외 처리

finally
→ 성공/실패와 관계없이 loading 종료 등의 정리
```

**팁**

API UI를 만들 때 `데이터가 무엇인가?`만 묻지 말고 **기다릴 때 무엇을
보여줄까? 실패하면 무엇을 보여줄까?**도 함께 질문하자.

## STEP 17 핵심 문장

> HTTP 통신 결과는 React의 Data / Loading / Error State로 연결되고,
> State가 최종 UI를 결정한다.
