# Day 16 --- STEP 15. HTTP와 Promise / async / await / try-catch

## 이번 STEP의 목표

Day 15의 비동기 JavaScript가 HTTP 통신에서 왜 필요한지 연결한다.

## HTTP에는 기다림이 있다

``` text
React
↓
Request 전송
↓
Network
↓
Server 처리
↓
Database
↓
Response
```

결과가 즉시 준비되지 않는다.

따라서 JavaScript에서는 이런 작업을 비동기로 다뤄야 한다.

## Promise와 fetch()

정확히 구분해야 한다.

``` text
HTTP 자체
→ Promise를 반환하는 JavaScript 함수가 아님

fetch()
→ 브라우저의 JavaScript Web API
→ Promise 반환
```

개념적으로:

``` text
fetch()
↓
Promise pending
↓
HTTP 통신 진행
↓
Promise settlement
↓
Response 또는 rejection
```

## await

``` js
const response = await fetch("/orders");
```

`await`는 Promise 기반 작업의 결과를 기다린다.

브라우저 전체와 UI를 정지시키는 것이 아니라 **현재 async 함수의 이후
실행**이 Promise 완료까지 기다리게 된다.

## response는 주문 데이터인가?

아니다.

``` text
response
→ HTTP Response를 나타내는 객체

data
→ Response Body를 처리해서 얻은 JavaScript 값
```

개념적으로:

``` js
const response = await fetch("/orders");
const data = await response.json();
```

`response.json()`의 Body 읽기/Parsing 과정도 비동기다.

## try/catch

``` js
try {
  // 비동기 작업
} catch (error) {
  // throw된 예외 또는 awaited Promise rejection 처리
}
```

하지만 매우 중요한 차이가 있다.

### HTTP 404/500

Server가 404 또는 500 Response를 정상적으로 보내면 `fetch()`는
일반적으로 그 이유만으로 reject되지 않는다.

``` text
Server → 404 Response → Client
```

Response는 실제로 도착했기 때문이다.

따라서:

``` js
if (!response.ok) {
  throw new Error("요청 실패");
}
```

처럼 HTTP 실패 상태를 확인하고 필요하면 JavaScript 예외 흐름으로 연결할
수 있다.

### Network Failure

Server에 연결할 수 없는 등의 네트워크/전송 실패는 Promise rejection으로
이어질 수 있으며 `catch`에서 처리할 수 있다.

**팁**

두 실패를 반드시 구분하자.

``` text
HTTP Error Status
→ Response가 있음
→ response.ok/status 확인

Network/Promise Failure
→ Promise reject 가능
→ catch
```

## STEP 15 핵심 문장

> `fetch()`는 Promise를 반환하고 `await`로 Response를 기다릴 수 있다.
> HTTP 4xx/5xx와 Promise rejection은 같은 개념이 아니다.
