# Day 16 --- STEP 10. DELETE와 Delete

> **이번 STEP의 목표:** DELETE의 삭제 의미, 204/200 Response, 권한
> 확인과 idempotency를 이해한다.

------------------------------------------------------------------------

## 0. 이전 STEP과 연결

Day 16의 개념은 서로 떨어진 단어 목록이 아니다. 계속 같은 큰 흐름을 다른
각도에서 확대해서 보는 과정이다.

``` text
User
↓
React Client
↓
HTTP Request
↓
API / Server
↓
Database
↓
HTTP Response
↓
React State
↓
UI
```

이번 STEP에서도 새 용어가 나오면 먼저 이 그림의 어디에 위치하는지
찾는다.

> **팁**
>
> 정의를 읽기 전에
> `이 개념은 Client 쪽인가, Server 쪽인가, Request인가, Response인가, 아니면 더 큰 규칙인가?`부터
> 질문하자.

## 1. DELETE /orders/10

DELETE는 Resource 삭제를 요청하는 Method다. 단순한 주문 삭제라면
Method와 Path만으로 의도가 충분히 표현되는 경우가 많다.

``` http
DELETE /orders/10
```

성공 Response는 `204 No Content`일 수도 있고 API에 따라 `200 OK`와
Body를 반환할 수도 있다. DELETE와 204는 같은 개념이 아니다. DELETE는
safe하지 않지만 HTTP 의미론에서는 idempotent다.

> **팁**
>
> 첫 DELETE가 204이고 반복 DELETE가 404여도 idempotency와 모순되지
> 않는다. Response 동일성이 아니라 의도된 Resource 상태 효과를 보자.

## 2. Method와 Path

`Method와 Path`는 이번 STEP의 핵심 개념을 주문 프로젝트의 HTTP 흐름에
배치하는 과정이다. 정의 하나를 외우는 것보다 이 개념이 **어느 계층에
있고 어떤 질문에 답하는지**를 이해해야 한다.

``` text
React Client
↓
HTTP Request
↓
Orders API / Server
↓
HTTP Response
↓
React
```

같은 Path라도 Method가 달라지면 의미가 달라질 수 있고, 같은 Endpoint라도
상황에 따라 다른 Response가 올 수 있다. 따라서 HTTP 코드는 한 단어만
떼어 읽지 않고 Method, 목적지, 메시지 데이터, 처리 결과를 함께 읽어야
한다.

> **팁**
>
> `Method와 Path`를 공부한 뒤 주문 조회·생성·수정·삭제 중 하나의 실제
> 상황으로 다시 설명해보자.

## 3. DELETE Body 주의

HTTP에서 데이터의 **내용**, **표현 형식**, **메타데이터**를 한 덩어리로
생각하면 혼란이 생긴다. JavaScript runtime에서 사용하는 값은 필요에 따라
text representation으로 직렬화되고, 그 text가 HTTP Body에 들어갈 수
있다.

``` text
JavaScript Value
↓ serialization
JSON Text
↓
HTTP Body

HTTP Body
↓ parsing
JavaScript Value
```

Headers는 Body 자체가 아니라 메시지에 대한 부가 정보를 담는다. 따라서
JSON, Body, Content-Type은 서로 같은 말이 아니다.
`Content-Type: application/json`은 현재 메시지 Body의 media type을
설명한다.

> **팁**
>
> 코드에서 중괄호가 보인다고 무조건 JSON이라고 부르지 말자. 지금 보고
> 있는 것이 JS 값인지, JSON text인지, HTTP Body인지 위치를 먼저
> 확인하자.

## 4. Authentication

Client와 Server 사이에는 신뢰 경계가 있다. Browser에서 실행되는 Client
코드는 사용자가 관찰하거나 조작할 수 있으므로 중요한 규칙을 Client에만
의존해서는 안 된다.

``` text
Request
↓
Server
├─ Authentication
├─ Authorization
├─ Parsing
├─ Validation
├─ Business Logic
└─ Database access
↓
Response
```

Server와 Database도 같은 개념이 아니다. Database는 저장과 조회를
담당하고, Server는 Request의 의미를 해석하고 규칙을 적용하며 필요한
Database 작업을 조율한 뒤 Response를 만든다.

> **팁**
>
> `React에서 이미 막았으니 Server에서는 검사할 필요가 없다`는 생각을
> 피하자. Client validation은 UX에 중요하지만 Server validation을
> 대체하지 않는다.

## 5. Authorization

Client와 Server 사이에는 신뢰 경계가 있다. Browser에서 실행되는 Client
코드는 사용자가 관찰하거나 조작할 수 있으므로 중요한 규칙을 Client에만
의존해서는 안 된다.

``` text
Request
↓
Server
├─ Authentication
├─ Authorization
├─ Parsing
├─ Validation
├─ Business Logic
└─ Database access
↓
Response
```

Server와 Database도 같은 개념이 아니다. Database는 저장과 조회를
담당하고, Server는 Request의 의미를 해석하고 규칙을 적용하며 필요한
Database 작업을 조율한 뒤 Response를 만든다.

> **팁**
>
> `React에서 이미 막았으니 Server에서는 검사할 필요가 없다`는 생각을
> 피하자. Client validation은 UX에 중요하지만 Server validation을
> 대체하지 않는다.

## 6. 삭제 가능 상태

DELETE는 Resource 삭제를 요청하는 Method다. 단순한 주문 삭제라면
Method와 Path만으로 의도가 충분히 표현되는 경우가 많다.

``` http
DELETE /orders/10
```

성공 Response는 `204 No Content`일 수도 있고 API에 따라 `200 OK`와
Body를 반환할 수도 있다. DELETE와 204는 같은 개념이 아니다. DELETE는
safe하지 않지만 HTTP 의미론에서는 idempotent다.

> **팁**
>
> 첫 DELETE가 204이고 반복 DELETE가 404여도 idempotency와 모순되지
> 않는다. Response 동일성이 아니라 의도된 Resource 상태 효과를 보자.

## 7. 404

Status Code는 Server가 Request를 처리한 결과를 알려주는 **Response의 한
구성요소**다. Response 전체와 Status Code를 동일시해서는 안 된다.

``` text
HTTP Response
├─ Status Code
├─ Headers
└─ Body
```

예를 들어 404 Response에도 JSON Error Body가 있을 수 있고, 204는
성공이지만 Body가 없다. Method는 Client의 요청 의도를 나타내고 Status
Code는 Server의 처리 결과를 나타낸다는 방향 차이도 중요하다.

> **팁**
>
> Status Code를 외울 때 숫자만 외우지 말고
> `어떤 Request 상황에서 이 결과가 나올 수 있는가?`를 주문 예제로 붙여
> 기억하자.

## 8. 204 No Content

Status Code는 Server가 Request를 처리한 결과를 알려주는 **Response의 한
구성요소**다. Response 전체와 Status Code를 동일시해서는 안 된다.

``` text
HTTP Response
├─ Status Code
├─ Headers
└─ Body
```

예를 들어 404 Response에도 JSON Error Body가 있을 수 있고, 204는
성공이지만 Body가 없다. Method는 Client의 요청 의도를 나타내고 Status
Code는 Server의 처리 결과를 나타낸다는 방향 차이도 중요하다.

> **팁**
>
> Status Code를 외울 때 숫자만 외우지 말고
> `어떤 Request 상황에서 이 결과가 나올 수 있는가?`를 주문 예제로 붙여
> 기억하자.

## 9. 200 + Body

HTTP에서 데이터의 **내용**, **표현 형식**, **메타데이터**를 한 덩어리로
생각하면 혼란이 생긴다. JavaScript runtime에서 사용하는 값은 필요에 따라
text representation으로 직렬화되고, 그 text가 HTTP Body에 들어갈 수
있다.

``` text
JavaScript Value
↓ serialization
JSON Text
↓
HTTP Body

HTTP Body
↓ parsing
JavaScript Value
```

Headers는 Body 자체가 아니라 메시지에 대한 부가 정보를 담는다. 따라서
JSON, Body, Content-Type은 서로 같은 말이 아니다.
`Content-Type: application/json`은 현재 메시지 Body의 media type을
설명한다.

> **팁**
>
> 코드에서 중괄호가 보인다고 무조건 JSON이라고 부르지 말자. 지금 보고
> 있는 것이 JS 값인지, JSON text인지, HTTP Body인지 위치를 먼저
> 확인하자.

## 10. DELETE와 Status 분리

Status Code는 Server가 Request를 처리한 결과를 알려주는 **Response의 한
구성요소**다. Response 전체와 Status Code를 동일시해서는 안 된다.

``` text
HTTP Response
├─ Status Code
├─ Headers
└─ Body
```

예를 들어 404 Response에도 JSON Error Body가 있을 수 있고, 204는
성공이지만 Body가 없다. Method는 Client의 요청 의도를 나타내고 Status
Code는 Server의 처리 결과를 나타낸다는 방향 차이도 중요하다.

> **팁**
>
> Status Code를 외울 때 숫자만 외우지 말고
> `어떤 Request 상황에서 이 결과가 나올 수 있는가?`를 주문 예제로 붙여
> 기억하자.

## 11. Safe

`Safe`는 이번 STEP의 핵심 개념을 주문 프로젝트의 HTTP 흐름에 배치하는
과정이다. 정의 하나를 외우는 것보다 이 개념이 **어느 계층에 있고 어떤
질문에 답하는지**를 이해해야 한다.

``` text
React Client
↓
HTTP Request
↓
Orders API / Server
↓
HTTP Response
↓
React
```

같은 Path라도 Method가 달라지면 의미가 달라질 수 있고, 같은 Endpoint라도
상황에 따라 다른 Response가 올 수 있다. 따라서 HTTP 코드는 한 단어만
떼어 읽지 않고 Method, 목적지, 메시지 데이터, 처리 결과를 함께 읽어야
한다.

> **팁**
>
> `Safe`를 공부한 뒤 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로
> 다시 설명해보자.

## 12. Idempotent

`Idempotent`는 이번 STEP의 핵심 개념을 주문 프로젝트의 HTTP 흐름에
배치하는 과정이다. 정의 하나를 외우는 것보다 이 개념이 **어느 계층에
있고 어떤 질문에 답하는지**를 이해해야 한다.

``` text
React Client
↓
HTTP Request
↓
Orders API / Server
↓
HTTP Response
↓
React
```

같은 Path라도 Method가 달라지면 의미가 달라질 수 있고, 같은 Endpoint라도
상황에 따라 다른 Response가 올 수 있다. 따라서 HTTP 코드는 한 단어만
떼어 읽지 않고 Method, 목적지, 메시지 데이터, 처리 결과를 함께 읽어야
한다.

> **팁**
>
> `Idempotent`를 공부한 뒤 주문 조회·생성·수정·삭제 중 하나의 실제
> 상황으로 다시 설명해보자.

## 13. 204 후 404

Status Code는 Server가 Request를 처리한 결과를 알려주는 **Response의 한
구성요소**다. Response 전체와 Status Code를 동일시해서는 안 된다.

``` text
HTTP Response
├─ Status Code
├─ Headers
└─ Body
```

예를 들어 404 Response에도 JSON Error Body가 있을 수 있고, 204는
성공이지만 Body가 없다. Method는 Client의 요청 의도를 나타내고 Status
Code는 Server의 처리 결과를 나타낸다는 방향 차이도 중요하다.

> **팁**
>
> Status Code를 외울 때 숫자만 외우지 말고
> `어떤 Request 상황에서 이 결과가 나올 수 있는가?`를 주문 예제로 붙여
> 기억하자.

## 14. React State

Server에서 결과가 만들어졌다고 React 화면이 자동으로 바뀌는 것은 아니다.
Client는 Response를 처리하고 자신의 State를 갱신해야 한다.

``` text
HTTP Response
↓
결과 확인 / Body 처리
↓
React State
↓
rerender
↓
UI
```

Server Data와 React State는 역할이 다르다. Server가 지속 데이터의 기준이
되더라도 React는 현재 UI를 표현하기 위한 Client-side State를 가진다.
그래서 API 기반 UI에서는 Data뿐 아니라 Loading과 Error도 함께 모델링하게
된다.

> **팁**
>
> 모든 Network 예제의 마지막에
> `어떤 State가 바뀌고 화면이 어떻게 변하는가?`까지 이어서 생각하자.

------------------------------------------------------------------------

## 전체 주문 프로젝트 흐름에서 다시 보기

``` text
React Client
      │
      │ HTTP Request
      │ ├─ Method
      │ ├─ URL / Endpoint
      │ ├─ Headers
      │ └─ Body
      ▼
Orders API / Server
      │
      ├─ Authentication
      ├─ Authorization
      ├─ Parsing
      ├─ Validation
      ├─ Business Logic
      └─ Database
      │
      ▼
HTTP Response
      │ ├─ Status Code
      │ ├─ Headers
      │ └─ Body
      ▼
React
      │
      ├─ Data
      ├─ Loading
      └─ Error
      ▼
State → rerender → UI
```

## 자주 하는 오해 점검

1.  `DELETE와 Delete`을 다른 HTTP 구성요소 전체와 같은 개념으로 취급하지
    않는다.
2.  Method와 Status Code처럼 **Request 의도**와 **Response 결과**를 섞지
    않는다.
3.  JSON을 HTTP, Body, JavaScript Object와 동일시하지 않는다.
4.  Server와 Database를 같은 시스템 역할로 생각하지 않는다.
5.  HTTP Response가 왔다고 React UI가 자동 갱신된다고 생각하지 않는다.

> **팁**
>
> 헷갈리는 개념은 `A ≠ B`에서 끝내지 말고
> `A는 어떤 질문에 답하고 B는 어떤 질문에 답하는가?`까지 적어보자.

## 스스로 설명해보기

1.  **DELETE와 Delete**을 코드 없이 자신의 말로 설명해보자.
2.  주문 목록 조회 상황에서는 이 개념이 어디에 등장하는가?
3.  주문 생성 상황에서는 어떻게 달라지는가?
4.  실패 상황에서는 어떤 Response 또는 React State가 필요할까?
5.  Day 17의 `fetch()` 코드에서는 이 개념이 어느 부분에 나타날까?

> **팁**
>
> 답을 바로 보지 말고 30초라도 먼저 말로 설명해보자. 설명이 끊기는
> 부분이 복습 지점이다.

## STEP 10 체크리스트

-   [ ] DELETE의 삭제 의미, 204/200 Response, 권한 확인과 idempotency를
    이해한다.
-   [ ] 주문 프로젝트 예제로 설명할 수 있다.
-   [ ] Request와 Response의 방향을 유지해서 설명할 수 있다.
-   [ ] 비슷한 용어와의 차이를 설명할 수 있다.
-   [ ] React State/UI까지 흐름을 연결할 수 있다.
-   [ ] Day 17 `fetch()`와 어떻게 연결될지 대략 설명할 수 있다.

## STEP 10 최종 핵심 문장

> **DELETE의 삭제 의미, 204/200 Response, 권한 확인과 idempotency를
> 이해한다.**

## 다음 STEP과의 연결

이번 STEP에서 확대했던 개념을 다시 전체 HTTP 왕복 흐름에 넣어두자. 다음
STEP에서는 그 다음 요소를 같은 방식으로
`왜 필요한가 → 정확한 역할 → 주문 예제 → 오해 → React 연결` 순서로
확대한다.
