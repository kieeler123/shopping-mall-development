# Day 16 --- STEP 13. JSON

## 이번 STEP의 목표

JSON과 JavaScript Object를 구분하고 네트워크에서 JSON이 왜 필요한지
이해한다.

## JSON이란?

JSON은 **JavaScript Object Notation**의 약자로 데이터를 표현하고
교환하는 데 널리 사용하는 텍스트 기반 형식이다.

JavaScript Object:

``` js
const order = {
  id: 10,
  status: "shipping",
};
```

JSON:

``` json
{
  "id": 10,
  "status": "shipping"
}
```

겉모습은 비슷하지만 개념은 다르다.

## JavaScript Object와 JSON

  -----------------------------------------------------------------------
  JavaScript Object                   JSON
  ----------------------------------- -----------------------------------
  JS 런타임의 데이터 구조             텍스트 기반 데이터 표현

  function 등을 가질 수 있음          function 표현 불가

  `undefined` 가능                    `undefined`는 JSON 값이 아님

  Object literal key가 항상 따옴표일  Object key는 큰따옴표 문자열
  필요 없음                           
  -----------------------------------------------------------------------

## 직렬화

JavaScript 데이터를 JSON 텍스트로 변환하는 대표적인 방법:

``` js
JSON.stringify(order)
```

개념 흐름:

``` text
JavaScript Value
↓
JSON.stringify()
↓
JSON Text
↓
HTTP Request Body
```

이 과정을 serialization이라고 한다.

## Parsing

반대 방향에서는 JSON 텍스트를 프로그램이 사용할 값으로 해석한다.

``` text
JSON Text
↓
Parsing
↓
JavaScript Value
```

JavaScript에서는 `JSON.parse()`가 대표적이다.

JSON은 Object만 표현하는 것이 아니다. Array, string, number, boolean,
null도 표현할 수 있으므로 `parse = JSON을 Object로 바꾼다`라고만 외우면
정확하지 않다.

## JSON과 HTTP

HTTP Body가 반드시 JSON인 것은 아니다.

``` text
HTTP Body
├─ JSON
├─ text
├─ HTML
├─ image
└─ 기타 형식
```

**팁**

`Body = JSON`이 아니다. **Body는 콘텐츠가 들어가는 영역이고 JSON은 그
콘텐츠를 표현하는 한 가지 형식**이다.

## STEP 13 핵심 문장

> JSON은 JavaScript Object 자체가 아니라 데이터를 교환하기 위한 텍스트
> 기반 표현 형식이다.
