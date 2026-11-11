# Day 32 | Next.js GET API 디버깅 · 코딩테스트 문제집

실제 쇼핑몰 프로젝트에서 발생한 오류를 바탕으로 구성한 실습·기술면접 문제집입니다. 먼저 문제만 풀고, 아래 정답 및 해설을 확인하세요.

## Part A — Questions / 문제 / 設問

### Q01 [개념]

GET Route Handler는 무엇을 하는가? `route.ts`, `GET()`, `Response.json()`의 역할을 각각 설명하라.

### Q02 [원인 분석]

브라우저에서 `ERR_CONNECTION_REFUSED`가 발생했다. 이것은 404와 어떻게 다른가?

### Q03 [원인 분석]

`Failed to open database`, `Invalid magic number`가 개발 서버 로그에 나타났다. 무엇을 알 수 있고 무엇을 단정할 수 없는가?

### Q04 [디버깅]

`.next` 삭제 도중 파일을 찾을 수 없다는 오류가 발생했다. 안전한 다음 행동을 설명하라.

### Q05 [디버깅]

`npm run dev -- --webpack`으로 서버가 시작됐다. 이것이 입증하는 것과 입증하지 못하는 것은?

### Q06 [경로 분석]

프로젝트 루트에 `app/`과 `src/app/`이 모두 있다. `src/app/api/orders/route.ts`를 만들었는데 404가 발생했다. 왜인가?

### Q07 [코딩]

주문 2개를 반환하는 GET 핸들러를 작성하라. 응답에는 `success`, `count`, `orders`가 있어야 한다.

### Q08 [코드 수정]

다음 코드의 문제를 찾아 수정하라: `export function GET() { return { orders: [] }; }`

### Q09 [검증]

`/api/orders`가 정상인지 브라우저 개발자 도구에서 무엇을 확인해야 하는가?

### Q10 [면접]

이번 Day 32 오류를 상황–조치–결과 순서로 5문장 이내에 설명하라.

---

## Part B — Answers & Explanations / 정답 및 해설 / 模範解答

### A01

GET Route Handler는 HTTP GET 요청을 처리하고 응답을 반환한다. `route.ts`는 App Router의 경로별 핸들러 파일, `GET()`은 GET 요청을 처리하는 export 함수, `Response.json()`은 JSON 본문과 적절한 Content-Type을 가진 Response를 생성한다.

**Tip / 팁 / ポイント:** GET은 조회에 사용하고 서버 상태를 변경하지 않도록 설계한다.

### A02

연결 거부는 지정한 주소와 포트에서 연결을 받아 주는 서버가 없거나 연결이 차단된 상황이다. 404는 서버에 도달했지만 요청한 경로를 찾지 못한 HTTP 응답이다.

**Tip / 팁 / ポイント:** 서버 프로세스, 포트, 터미널 로그를 먼저 확인한다.

### A03

Turbopack 내부 지속 저장소 또는 캐시를 읽는 과정에서 문제가 발생한 정황이 있다. 로그만으로 정확한 손상 원인이나 애플리케이션 데이터베이스 문제라고 단정할 수 없다.

**Tip / 팁 / ポイント:** 로그의 오류 위치와 실제 앱 DB 연결 오류를 구분한다.

### A04

실행 중인 개발 서버를 중지하고 `.next`만 대상으로 삭제 여부를 확인한다. 삭제 실패 시 잠금·파일 변경 가능성을 확인하고, 반복적으로 무작정 삭제하기보다 다른 실행 방식으로 문제를 분리한다.

**Tip / 팁 / ポイント:** 소스 폴더나 `node_modules`를 무조건 지우지 않는다.

### A05

Webpack 개발 모드에서 서버가 실행될 수 있음을 보여 준다. Turbopack 경로의 문제를 우회한 것이지만 Turbopack 오류의 정확한 원인을 입증하거나 캐시가 복구됐다는 뜻은 아니다.

**Tip / 팁 / ポイント:** 우회책과 근본 원인 해결을 구분해 기록한다.

### A06

Next.js는 루트 `app/`이 존재하면 그 디렉터리를 App Router 기준으로 사용하므로 `src/app/`에 만든 라우트가 무시될 수 있다. 실제 사례에서는 파일을 `app/api/orders/route.ts`로 이동한 뒤 200 응답을 확인했다.

**Tip / 팁 / ポイント:** 프로젝트에서 실제 사용되는 app 디렉터리를 먼저 확인한다.

### A07

```ts
const orders = [
  { id: 1, product: "키보드", price: 59000 },
  { id: 2, product: "마우스", price: 35000 },
];

export async function GET() {
  return Response.json({ success: true, count: orders.length, orders });
}
```

**Tip / 팁 / ポイント:** 현재 코드는 임시 배열이다. 실제 주문 정보는 인증·권한 검사를 거쳐 조회해야 한다.

### A08

Route Handler는 Response 또는 NextResponse를 반환해야 한다.
```ts
export function GET() {
  return Response.json({ orders: [] });
}
```

**Tip / 팁 / ポイント:** `async`는 비동기 작업이 없으면 필수가 아니다.

### A09

Network에서 요청 URL, GET 메서드, HTTP 200, `Content-Type: application/json`, JSON 본문 구조와 주문 건수를 확인한다.

**Tip / 팁 / ポイント:** 200만 확인하지 말고 실제 응답 필드도 검사한다.

### A10

GET API 개발 중 Turbopack 저장소 오류로 서버 연결이 거부됐다. `.next` 캐시 삭제를 시도했으나 일부 파일 오류로 완전히 삭제되지 않았다. Webpack 모드로 서버를 실행해 연결 문제를 우회했다. 이후 `/api/orders`가 404를 반환해 루트 `app/`과 `src/app/`의 중복을 확인했다. 핸들러를 루트 `app/api/orders/route.ts`로 옮겨 HTTP 200과 주문 3건 반환을 검증했다.

**Tip / 팁 / ポイント:** 관찰 사실, 추정 원인, 검증된 결과를 나눠 말한다.

---

## Practical checklist

- Verify the development server is running / 개발 서버 실행 확인 / 開発サーバーの起動確認
- Confirm the active `app/` directory / 실제 라우트 경로 확인 / 使用中の `app/` を確認
- Check GET `/api/orders`, HTTP 200 and JSON / API 응답 검증 / APIレスポンスを確認
- Keep hypotheses separate from verified causes / 추정과 사실 구분 / 推測と確認済み事実を区別
