# Day 32 --- Route Handler와 GET API

> 쇼핑몰 프로젝트 \| Next.js App Router \| 핵심: `route.ts`, `GET()`, `Response.json()`

## 학습 목표

-   GET Route Handler가 HTTP GET 요청을 처리하고 데이터를 반환한다는 것을 설명한다.
-   `/api/orders` 경로에서 주문 배열을 JSON으로 반환한다.
-   브라우저와 개발자 도구에서 상태 코드 및 응답을 확인한다.

## 1. 핵심 개념

  개념                설명
  ------------------- ---------------------------------------------
  `route.ts`          App Router의 API 엔드포인트를 정의하는 파일
  `GET()`             HTTP GET 요청을 처리하도록 내보내는 함수
  `Response.json()`   JavaScript 값을 JSON 응답으로 직렬화
  `200 OK`            요청을 정상 처리했다는 HTTP 상태 코드

**GET Route Handler의 주요 역할은?** 클라이언트가 데이터를 조회하도록 GET 요청을 처리하고 HTTP 응답을 반환하는 것이다. GET은 원칙적으로 서버 데이터를 변경하지 않는 조회 작업에 사용한다.

**팁:** API의 URL은 폴더 구조에서 결정된다. 루트 `app`을 사용하는 프로젝트라면 `app/api/orders/route.ts`를 사용한다.

## 2. 쇼핑몰 실습 --- 주문 조회 API

파일: `app/api/orders/route.ts`

``` ts
const orders = [
  { id: 1, product: "무선 키보드", price: 59000, quantity: 1, status: "배송중" },
  { id: 2, product: "게이밍 마우스", price: 35000, quantity: 2, status: "배송완료" },
  { id: 3, product: "USB-C 허브", price: 29000, quantity: 1, status: "결제완료" },
];

export async function GET() {
  return Response.json(
    { success: true, message: "주문 목록 조회 성공", count: orders.length, orders },
    { status: 200 }
  );
}
```

### 테스트

1.  터미널에서 `npm run dev` 실행.
2.  `http://localhost:3000/api/orders` 접속.
3.  JSON의 `success: true`, `count: 3`, `orders` 배열 확인.
4.  개발자 도구 Network 탭에서 `200` 및 `application/json` 확인.

**팁:** 위 배열은 학습용 임시 데이터다. 실제 주문 API에는 사용자 인증 및 본인 주문 접근 권한 검사가 필요하다.

## 3. 실제 Day 32 디버깅 기록

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  증상                                                의미 / 확인                                              조치
  --------------------------------------------------- -------------------------------------------------------- ---------------------------------------------------------
  `Failed to open database`, `Invalid magic number`   Turbopack 내부 저장 데이터 문제 가능성(확정 원인 아님)   `.next` 삭제 시도

  `.next` 삭제 실패                                   파일이 없거나 사용 중일 가능성                           삭제 반복 대신 원인 분리

  `ERR_CONNECTION_REFUSED`                            브라우저가 개발 서버에 연결하지 못함                     서버 재실행 확인

  Webpack으로 서버 실행 성공                          Turbopack 경로를 우회해 개발 서버 실행                   `npm run dev -- --webpack`

  `/api/orders` → `404`                               서버는 응답하지만 라우트가 등록되지 않음                 `src/app/...`에서 루트 `app/api/orders/route.ts`로 이동

  `/api/orders` → `200`                               경로 수정 후 요청 성공                                   JSON 주문 3건 확인
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------

**핵심:** 캐시 손상이 정확한 근본 원인인지는 확정되지 않았다. 반면 이번 프로젝트에서 `404`는 실제 라우팅 디렉터리와 파일 위치가 맞지 않아 발생했고, 파일 이동 후 해결되었다.

**팁:** 연결 실패와 404는 다르다. 연결 실패는 서버 접근부터 확인하고, 404는 라우트 파일 위치를 확인한다.

## 4. 객관식

**Q1. GET Route Handler의 주요 역할은?** - A. CSS 적용 - B. GET 요청을 처리하고 데이터 반환 - C. 데이터베이스 자동 삭제 - D. 이미지 압축

**Q2. 루트 `app`을 사용하는 프로젝트에서 `/api/orders`에 대응하는 파일은?** - A. `public/orders.json` - B. `app/api/orders/page.tsx` - C. `app/api/orders/route.ts` - D. `components/orders.tsx`

**Q3. 서버가 응답했지만 요청 경로를 찾지 못한 상태 코드는?** - A. 200 - B. 404 - C. 500 - D. 201

## 5. 주관식 / 코딩테스트

**S1.** GET Route Handler의 역할을 쇼핑몰 주문 조회 사례로 3문장 이상 설명하라.

**S2.** `Response.json()`을 사용해 `success`, `count`, `orders`를 반환하는 GET 함수를 작성하라.

**S3.** `ERR_CONNECTION_REFUSED`와 `404`의 차이, 이번 Day 32에서 404를 해결한 방법을 설명하라.

## 6. 정답과 해설

-   Q1 **B** --- GET 요청을 처리하고 응답을 반환한다.
-   Q2 **C** --- `route.ts`가 HTTP 메서드 핸들러를 제공한다.
-   Q3 **B** --- 404는 요청한 리소스/라우트를 찾지 못했다는 뜻이다.
-   S1 예시: GET Handler는 클라이언트의 조회 요청을 처리한다. `/api/orders` 요청을 받으면 주문 목록을 준비한다. `Response.json()`으로 JSON 응답을 반환한다.
-   S2 예시:

``` ts
export async function GET() {
  return Response.json(
    { success: true, count: orders.length, orders },
    { status: 200 }
  );
}
```

-   S3 예시: 연결 거부는 서버에 연결되지 않은 상태이고 404는 서버가 요청에 응답했지만 경로를 찾지 못한 상태다. 실제 프로젝트에서 `route.ts`를 루트 `app/api/orders/`로 이동한 후 200 응답을 확인했다.

## 7. 완료 체크리스트

-   [ ] GET과 `route.ts`의 역할을 설명할 수 있다.
-   [ ] 주문 3건을 JSON으로 반환한다.
-   [ ] Network에서 200 상태와 JSON 응답을 확인했다.
-   [ ] 객관식 및 주관식을 스스로 풀었다.
