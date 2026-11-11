# Day 32 | Next.js GET API Debugging — Coding & Interview Practice

A standalone practice set based on the shopping-mall project. Solve the questions first, then review the model answers and practical tips.

## Part A — Questions / 문제 / 設問

### Q01 [Concept]

What does a GET Route Handler do? Explain `route.ts`, `GET()`, and `Response.json()`.

### Q02 [Diagnosis]

How does `ERR_CONNECTION_REFUSED` differ from HTTP 404?

### Q03 [Diagnosis]

The log shows `Failed to open database` and `Invalid magic number`. What can you infer?

### Q04 [Debugging]

Deleting `.next` fails with a missing-file error. What is a safe next step?

### Q05 [Debugging]

What does a successful `npm run dev -- --webpack` tell you?

### Q06 [Routing]

Why might `src/app/api/orders/route.ts` return 404 when the project also has a root `app/`?

### Q07 [Coding]

Write a GET handler returning two orders with `success`, `count`, and `orders`.

### Q08 [Code review]

Fix this handler: `export function GET() { return { orders: [] }; }`

### Q09 [Verification]

How would you verify `/api/orders` in browser DevTools?

### Q10 [Interview]

Summarize the Day 32 debugging story in five sentences or fewer.

---

## Part B — Answers & Explanations / 정답 및 해설 / 模範解答

### A01

A GET Route Handler processes HTTP GET requests. `route.ts` defines a route handler in the App Router; an exported `GET()` handles GET requests; `Response.json()` builds an HTTP Response with a JSON body and appropriate Content-Type.

**Tip / 팁 / ポイント:** Design GET endpoints for retrieval without unintended state changes.

### A02

Connection refused means the browser could not establish a connection to the target host and port. HTTP 404 means the server responded but did not find the requested route.

**Tip / 팁 / ポイント:** Check whether the dev server is listening before debugging routing.

### A03

The error suggests a failure while reading Turbopack persistence/cache data. The log alone does not prove the precise cause or that the application’s business database is corrupted.

**Tip / 팁 / ポイント:** Distinguish build-tool storage errors from application database failures.

### A04

Stop the dev server, verify the target is only `.next`, and check whether processes are modifying or locking files. Isolate the issue rather than repeatedly deleting unrelated project folders.

**Tip / 팁 / ポイント:** Avoid deleting source files or dependencies as a first reaction.

### A05

The app can start using Webpack development mode. It is a workaround that helps isolate the Turbopack path; it does not establish the root cause or prove that the Turbopack cache was repaired.

**Tip / 팁 / ポイント:** Document workarounds separately from confirmed fixes.

### A06

With a root `app/` present, Next.js uses it as the App Router directory, so routes in `src/app/` may not be discovered. In this case, moving the file to `app/api/orders/route.ts` led to successful responses.

**Tip / 팁 / ポイント:** Inspect the active App Router root before adding routes.

### A07

```ts
const orders = [
  { id: 1, product: "Keyboard", price: 59000 },
  { id: 2, product: "Mouse", price: 35000 },
];

export async function GET() {
  return Response.json({ success: true, count: orders.length, orders });
}
```

**Tip / 팁 / ポイント:** Production order APIs require authentication and authorization.

### A08

Return a Response rather than a plain object.
```ts
export function GET() {
  return Response.json({ orders: [] });
}
```

**Tip / 팁 / ポイント:** `async` is optional if no asynchronous work is performed.

### A09

Inspect the Network entry: URL, GET method, HTTP 200, `Content-Type: application/json`, and the actual JSON fields and order count.

**Tip / 팁 / ポイント:** A 200 status alone does not validate the response contract.

### A10

The GET API initially failed alongside a Turbopack persistence error and a refused browser connection. Attempts to remove `.next` ran into missing-file errors. Starting the development server with Webpack bypassed the startup issue. The API still returned 404 because the handler was under `src/app/` while the project used root `app/`. Moving it to `app/api/orders/route.ts` produced HTTP 200 and three orders.

**Tip / 팁 / ポイント:** Separate observed symptoms, hypotheses, actions, and verified outcomes.

---

## Practical checklist

- Verify the development server is running / 개발 서버 실행 확인 / 開発サーバーの起動確認
- Confirm the active `app/` directory / 실제 라우트 경로 확인 / 使用中の `app/` を確認
- Check GET `/api/orders`, HTTP 200 and JSON / API 응답 검증 / APIレスポンスを確認
- Keep hypotheses separate from verified causes / 추정과 사실 구분 / 推測と確認済み事実を区別
