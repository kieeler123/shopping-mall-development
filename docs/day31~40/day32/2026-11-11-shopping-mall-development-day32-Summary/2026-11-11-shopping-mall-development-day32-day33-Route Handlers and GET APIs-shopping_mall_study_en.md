# Day 32 --- Route Handlers and GET APIs

> Shopping mall project \| Next.js App Router \| `route.ts`, `GET()`, `Response.json()`

## Learning objectives

-   Explain how a GET Route Handler processes a request and returns an HTTP response.
-   Implement `/api/orders` and return an order array as JSON.
-   Inspect the endpoint, status code, and response in the browser.

## 1. Core concepts

  Term                Meaning
  ------------------- -----------------------------------------
  `route.ts`          Defines an endpoint in the App Router
  `GET()`             Exported handler for HTTP GET requests
  `Response.json()`   Serializes data as a JSON HTTP response
  `200 OK`            The request was successfully processed

**What does a GET Route Handler do?** It handles an HTTP GET request and returns a response, commonly for retrieving data without modifying server state.

**Tip:** The URL follows the folder structure. In this project, the active root directory is `app`, so the endpoint belongs in `app/api/orders/route.ts`.

## 2. Hands-on: Orders endpoint

File: `app/api/orders/route.ts`

``` ts
const orders = [
  { id: 1, product: "Wireless keyboard", price: 59000, quantity: 1, status: "Shipping" },
  { id: 2, product: "Gaming mouse", price: 35000, quantity: 2, status: "Delivered" },
  { id: 3, product: "USB-C hub", price: 29000, quantity: 1, status: "Paid" },
];

export async function GET() {
  return Response.json(
    { success: true, message: "Orders retrieved", count: orders.length, orders },
    { status: 200 }
  );
}
```

Run `npm run dev`, visit `http://localhost:3000/api/orders`, and verify `success: true`, `count: 3`, and the `orders` array. In DevTools → Network, inspect HTTP 200 and the JSON content type.

**Tip:** Hardcoded orders are for practice. Production endpoints need authentication and order-level authorization.

## 3. Day 32 debugging case study

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Symptom                                              Interpretation                                                          Action
  ---------------------------------------------------- ----------------------------------------------------------------------- ---------------------------------------------------------------
  `Failed to open database` / `Invalid magic number`   Possible Turbopack persistence/cache problem; not conclusively proven   Attempted `.next` cleanup

  Cache deletion errors                                Missing or locked files                                                 Stopped repeating failed cleanup

  `ERR_CONNECTION_REFUSED`                             Browser could not connect to the dev server                             Checked server process

  Webpack starts successfully                          Bypassed the Turbopack development path                                 `npm run dev -- --webpack`

  `/api/orders` returns 404                            Server runs, but the route is not registered                            Moved `route.ts` from `src/app/...` to root `app/api/orders/`

  `/api/orders` returns 200                            Route now resolves                                                      Verified three JSON orders
  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**Important:** Cache corruption remains a hypothesis, not a confirmed root cause. The 404 was resolved by correcting the route file location.

**Tip:** Connection refusal is not the same as 404: check server availability first for the former, and route registration for the latter.

## 4. Multiple-choice questions

**Q1. What is the main purpose of a GET Route Handler?** - A. Apply CSS - B. Process GET requests and return data - C. Delete the database - D. Compress images

**Q2. Which file implements `/api/orders` in this project?** - A. `public/orders.json` - B. `app/api/orders/page.tsx` - C. `app/api/orders/route.ts` - D. `components/orders.tsx`

**Q3. Which status indicates a requested route was not found?** - A. 200 - B. 404 - C. 500 - D. 201

## 5. Written and coding questions

**S1.** Explain a GET Route Handler using the shopping mall orders endpoint in at least three sentences.

**S2.** Write a GET handler returning `success`, `count`, and `orders` using `Response.json()`.

**S3.** Explain the difference between `ERR_CONNECTION_REFUSED` and 404, and how the Day 32 404 was fixed.

## 6. Answer key and explanations

-   Q1 **B** --- A GET handler responds to retrieval requests.
-   Q2 **C** --- Route Handlers live in `route.ts` under the active `app` tree.
-   Q3 **B** --- HTTP 404 means the requested resource or route was not found.
-   S1 sample: The client requests `/api/orders`. The server runs the exported `GET()` handler. The handler returns an order array as JSON.
-   S2 sample:

``` ts
export async function GET() {
  return Response.json(
    { success: true, count: orders.length, orders },
    { status: 200 }
  );
}
```

-   S3 sample: Connection refusal means no connection could be established; 404 means the server responded but the requested route was missing. Moving `route.ts` to `app/api/orders/` resolved the observed 404.

## 7. Completion checklist

-   [ ] Explain `route.ts`, GET, and JSON responses.
-   [ ] Return three orders from `/api/orders`.
-   [ ] Inspect status 200 in DevTools.
-   [ ] Complete the multiple-choice and written questions.
