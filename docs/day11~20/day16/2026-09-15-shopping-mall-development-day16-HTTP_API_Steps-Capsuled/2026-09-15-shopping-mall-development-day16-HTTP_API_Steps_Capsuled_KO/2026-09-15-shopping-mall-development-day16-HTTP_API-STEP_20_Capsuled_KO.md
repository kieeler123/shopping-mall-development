# Day 16 --- STEP 20. Day 16 최종 이해 점검

## 이번 STEP의 목표

총정리 문서를 암기하는 것이 아니라 Day 17의 `fetch()`를 이해할 수 있을
정도로 Day 16의 개념 연결을 확인한다.

## 가장 먼저 떠올라야 하는 구조

``` text
Client
↓ Request
Server
↓ Response
Client
```

현재 프로젝트에 적용하면:

``` text
사용자
↓
React(Client)
↓
HTTP Request
↓
Orders API / Server
↓
Database
↓
HTTP Response
↓
React State
↓
UI
```

## Request 구조

``` text
HTTP Request
├─ Method
├─ URL
├─ Headers
└─ Body
```

질문으로 읽는다.

``` text
Method  → 무엇을 할까?
URL     → 어디에 할까?
Headers → 어떤 메타데이터가 필요한가?
Body    → 어떤 콘텐츠를 보낼까?
```

## Response 구조

``` text
HTTP Response
├─ Status Code
├─ Headers
└─ Body
```

질문으로 읽는다.

``` text
Status Code → 처리 결과는?
Headers     → Response에 대한 메타데이터는?
Body        → 실제 반환 콘텐츠는?
```

## CRUD를 HTTP로 읽기

``` text
POST   /orders      → 주문 생성
GET    /orders      → 주문 목록 조회
GET    /orders/:id  → 특정 주문 조회
PATCH  /orders/:id  → 특정 주문 수정
DELETE /orders/:id  → 특정 주문 삭제
```

이것은 CRUD 스타일 API에서 사용하는 대표적인 설계이며 모든 HTTP API가
반드시 이 형태여야 하는 것은 아니다.

## Status Code 핵심

``` text
2xx → Success
4xx → Request 측 범주의 문제
5xx → Server 측 처리 문제
```

특히:

``` text
200 → 성공
201 → Resource 생성 성공
204 → 성공, Body 없음
400 → 잘못된 Request 등
401 → Authentication 관련
403 → Authorization 관련
404 → Resource 없음
500 → Server 내부 처리 문제
```

## JSON 핵심

``` text
JavaScript Value
↓ JSON.stringify()
JSON Text
↓ HTTP Body
Server
```

Response 방향에서는 JSON Body를 Parsing해 JavaScript에서 사용할 값으로
만든다.

``` text
JSON ≠ JavaScript Object
JSON ≠ HTTP
JSON ≠ Response
```

## Day 15와 결합

``` text
fetch()
↓
Promise
↓
await
↓
HTTP Response
↓
response.ok/status 확인
↓
Body 처리
↓
Data
```

그리고:

``` text
HTTP 404/500
≠ 자동 Promise rejection

Network failure
→ Promise rejection 가능
```

이 구분은 Day 17에서 매우 중요하다.

## React UI까지 결합

``` text
Request 시작
↓
Loading
↓
Response
├─ Success → Data → State → UI
└─ Failure → Error State → Error UI
↓
Loading 종료
```

## Day 17 코드 미리 읽기

아직 외우는 것이 아니라 Day 16 개념과 연결해서 읽는다.

``` js
const response = await fetch("/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newOrder),
});
```

분해:

``` text
fetch("/orders")
→ Request를 보낼 URL

method: "POST"
→ HTTP Method

headers
→ HTTP Request Headers

Content-Type
→ Request Body의 media type 설명

body
→ HTTP Request Body

JSON.stringify(newOrder)
→ JavaScript 값을 JSON Text로 직렬화

await
→ fetch가 반환한 Promise의 결과를 기다림

response
→ HTTP Response를 나타내는 객체
```

이 코드가 왜 이런 모양인지 설명할 수 있다면 Day 16의 목적을 달성한
것이다.

## 최종 자기 점검

다음 문장을 자신의 말로 설명해보자.

> 사용자가 주문 목록을 열면 React Client가 Orders API에 `GET /orders`
> HTTP Request를 보낸다. Server는 필요한 인증·권한·비즈니스 로직과
> Database 조회를 수행하고, 처리 결과를 Status Code와 Headers, Body가
> 포함된 HTTP Response로 돌려준다. React는 성공 여부를 확인하고 Body
> 데이터를 처리해 State에 반영한 뒤 UI를 다시 렌더링한다.

그리고 주문 생성도 설명해보자.

> React는 주문 데이터를 JSON으로 직렬화해 `POST /orders` Request Body에
> 담아 보낼 수 있다. Server가 검증 후 Resource를 생성하면 대표적으로
> `201 Created`와 생성된 주문 데이터를 반환할 수 있으며 React는 Server가
> 확정한 결과를 State와 UI에 반영한다.

**팁**

Day 17 전에 모든 세부 사항을 암기할 필요는 없다. 다음 두 줄이 정확히
이해되면 충분하다.

``` text
Request = Method + URL + Headers + Body
Response = Status Code + Headers + Body
```

## STEP 20 완료

이제 `fetch()`에서 URL, Method, Headers, Body, Response가 등장하는
이유를 HTTP 구조와 연결해서 학습할 준비가 되었다.
