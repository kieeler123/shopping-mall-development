# Day 16 --- STEP 02. Client와 Server

## 이번 STEP의 목표

HTTP를 이해하기 전에 누가 요청하고 누가 응답하는지 구분한다.

## Client란?

Client는 서비스를 사용하는 쪽이며 Server에 Request를 보낸다. 현재
프로젝트에서는 브라우저에서 실행되는 React 애플리케이션이 Client 역할을
한다.

``` text
React(Client)
↓
Request
↓
Server
```

Client가 반드시 React일 필요는 없다. 모바일 앱이나 다른 프로그램도
Server API를 사용하는 Client가 될 수 있다.

## Server란?

Server는 Client의 Request를 받고 필요한 처리를 한 뒤 Response를
돌려준다.

``` text
Server
├─ Request 해석
├─ 인증/권한 확인 가능
├─ 입력 검증 가능
├─ Business Logic 실행
├─ Database 접근 가능
└─ Response 생성
```

Server는 단순한 데이터 창고가 아니다.

## Server와 Database는 다르다

초보 단계에서 자주 생기는 혼동이다.

``` text
Client
↓
Server
↓
Database
```

Database는 데이터를 저장하고 검색·수정·삭제하는 시스템이다. Server는
Request를 처리하고 어떤 Database 작업을 할지 결정하며 결과를 Client용
Response로 만든다.

예를 들어:

``` text
GET /orders/10
↓
Server
↓
사용자 확인
↓
10번 주문을 볼 권한 확인
↓
Database에서 주문 조회
↓
필요한 데이터만 구성
↓
Response
```

따라서 HTTP Method와 Database 명령을 1:1로 동일시하면 안 된다.

## Request와 Response 방향

가장 중요한 방향은 다음과 같다.

``` text
Client
   │
   │ Request
   ▼
Server
   │
   │ Response
   ▼
Client
```

Request는 Client → Server, Response는 Server → Client다.

**팁**

HTTP 용어가 헷갈리면 먼저 화살표를 그리자. `누가 누구에게 보내는가?`를
알면 Request와 Response를 쉽게 구분할 수 있다.

## STEP 02 핵심 문장

> Client는 요청하고, Server는 요청을 처리해 응답한다. Database는
> Server와 같은 개념이 아니다.
