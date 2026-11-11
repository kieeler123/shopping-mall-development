# Day 17 --- STEP 05. response.json()

## 이번 STEP의 목표

Response Body의 JSON을 JavaScript 데이터로 읽는 두 번째 비동기 단계를
이해한다.

## 핵심 흐름

``` text
Response → response.json() → Promise<Data> → await → Data
```

## 핵심 코드/표현

``` js
const data = await response.json();
```

## 왜 중요한가?

Day 17에서는 HTTP 용어를 코드와 분리해서 외우지 않는다. 이 STEP의 내용이
**Request → Mock API → Response → React State → UI** 중 어디에
위치하는지 확인하는 것이 중요하다.

## Day 15\~17 연결

-   Day 15에서 배운 HTTP의 Method / URL / Headers / Body / Response /
    Status Code / JSON을 실제 코드에서 찾는다.
-   Day 16에서 배운 Promise / `async` / `await` / `try/catch`가 네트워크
    대기와 오류 처리에 어떻게 사용되는지 연결한다.
-   Day 17에서는 그 결과를 React State와 UI까지 이어서 본다.

> **팁** 코드를 외우기보다 이 STEP에서 **무엇을 기다리고 있는지, 어떤
> HTTP 정보가 오가고 있는지, 결과가 어떤 State를 바꾸는지**를 말로
> 설명해본다.

## STEP 핵심 문장

> Response Body의 JSON을 JavaScript 데이터로 읽는 두 번째 비동기 단계를
> 이해한다.
