# Day 16 --- STEP 01. 왜 HTTP와 API가 필요한가?

## 이번 STEP의 목표

지금까지 만든 React 쇼핑몰은 주문 데이터를 브라우저의 `localStorage`에
저장했다. 이 단계에서는 왜 실제 서버 구조로 넘어갈 때 HTTP와 API가
필요해지는지 이해한다.

## 기존 구조: React와 localStorage

기존 구조는 단순했다.

``` text
React
↓
useOrders
↓
localStorage
```

`localStorage`는 브라우저 안에 존재한다. 따라서 React 코드가 브라우저
내부의 Web API를 이용해 데이터를 읽고 저장할 수 있었다.

예를 들어 주문 목록을 읽는다는 것은 개념적으로 다음과 같았다.

``` text
React
↓
localStorage에서 orders 읽기
↓
JavaScript 데이터로 변환
↓
React State
↓
UI
```

여기에는 다른 컴퓨터에 있는 Server와의 네트워크 통신이 없다.

## 서버 구조에서는 무엇이 달라질까?

실제 서비스에서는 주문 데이터를 여러 사용자와 공유하고, 서버에서
검증하고, 영구적으로 관리해야 하는 경우가 많다.

구조는 개념적으로 다음처럼 바뀐다.

``` text
React
↓
HTTP Request
↓
API
↓
Server
↓
Database
```

그리고 결과가 다시 돌아온다.

``` text
Database
↓
Server
↓
HTTP Response
↓
React
↓
State
↓
UI
```

즉 데이터가 브라우저 안에만 있는 것이 아니라 네트워크 반대편에 있는
시스템으로 이동한다.

## 핵심 질문

여기서 새로운 문제가 생긴다.

> 브라우저에 있는 React와 Server는 어떤 규칙으로 요청과 데이터를
> 주고받을까?

이 질문에 연결되는 것이 **HTTP**이고, Server가 Client에게 기능과
데이터를 사용할 수 있도록 제공하는 인터페이스가 **API**다.

아직 `fetch()` 문법을 외울 필요는 없다. 먼저 왜 네트워크 통신 계층이
필요한지 이해하는 것이 중요하다.

## localStorage와 Server API 비교

  -----------------------------------------------------------------------
  구분                    localStorage 구조       Server API 구조
  ----------------------- ----------------------- -----------------------
  데이터 위치             브라우저 내부           Server/Database 측

  네트워크                필요 없음               필요

  결과 대기               일반적인 localStorage   네트워크 통신은 비동기
                          사용은 동기적           

  HTTP                    사용하지 않음           일반적인 Web API에서
                                                  사용

  실패 상황               비교적 단순             네트워크, 인증, 권한,
                                                  Server 오류 등

  여러 Client 공유        직접적인 공유 저장소가  Server 데이터를 여러
                          아님                    Client가 사용할 수 있음
  -----------------------------------------------------------------------

## Day 15와 연결

Server에 Request를 보내면 Response가 즉시 생기는 것이 아니다.

``` text
Request
↓
네트워크 이동
↓
Server 처리
↓
Database 작업
↓
Response
```

따라서 Day 15에서 배운 Promise, `async`, `await`, `try/catch`가 실제
의미를 갖기 시작한다.

**팁**

`HTTP/API를 배운다 = 완전히 새로운 앱을 만든다`고 생각하지 말자. 지금은
기존의 `React → useOrders → localStorage`에서 **데이터 접근 경로를
Server 쪽으로 확장하는 과정**이다.

## STEP 01 핵심 문장

``` text
기존:
React → useOrders → localStorage

앞으로:
React → HTTP Request → API/Server → Database
React ← HTTP Response ← API/Server
```

다음 STEP에서는 이 구조의 양쪽 주체인 **Client와 Server**를 정확히
구분한다.
