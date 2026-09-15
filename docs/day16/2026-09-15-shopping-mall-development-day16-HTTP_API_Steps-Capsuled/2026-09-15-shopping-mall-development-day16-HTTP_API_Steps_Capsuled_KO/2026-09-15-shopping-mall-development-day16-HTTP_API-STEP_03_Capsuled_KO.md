# Day 16 --- STEP 03. HTTP란 무엇인가?

## 이번 STEP의 목표

HTTP를 Server, API, Internet과 구분하고 정확히 어떤 역할을 하는지
이해한다.

## HTTP의 의미

HTTP는 **Hypertext Transfer Protocol**의 약자다. 핵심은 `Protocol`이다.

Protocol은 통신할 때 서로 따라야 하는 규칙 또는 약속이다.

``` text
Client
   │
   │ HTTP라는 규칙을 사용
   ▼
Server
```

HTTP를 사용하면 Client와 Server는 Request와 Response라는 형태의 메시지를
주고받는다.

## HTTP는 인터넷 자체가 아니다

인터넷은 여러 네트워크가 연결된 훨씬 큰 개념이다. HTTP는 그 위에서 Web
통신에 널리 사용하는 응용 계층 프로토콜이다.

따라서 다음처럼 구분한다.

``` text
HTTP ≠ Internet
HTTP ≠ Server
HTTP ≠ API
HTTP ≠ JSON
```

## HTTP에서 앞으로 볼 요소

Request에서는 다음을 보게 된다.

``` text
Method
URL
Headers
Body
```

Response에서는 다음을 보게 된다.

``` text
Status Code
Headers
Body
```

즉 Day 16의 나머지 내용은 사실상 HTTP 메시지를 구성하는 요소들을 하나씩
확대해서 배우는 과정이다.

## 주문 API에 적용

``` text
React Client
↓
GET /orders
↓
HTTP Request
↓
Server
↓
200 OK + JSON
↓
HTTP Response
↓
React Client
```

HTTP는 이 왕복 메시지가 어떤 방식으로 표현되고 해석되는지에 대한 규칙을
제공한다.

**팁**

HTTP를 `데이터를 가져오는 기능`으로 기억하지 말자. **Client와 Server가
메시지를 주고받기 위한 통신 규칙**이라고 기억하면 이후 Method, Status
Code가 자연스럽게 연결된다.

## STEP 03 핵심 문장

> HTTP는 Client와 Server가 Request와 Response를 주고받기 위해 사용하는
> 통신 프로토콜이다.
