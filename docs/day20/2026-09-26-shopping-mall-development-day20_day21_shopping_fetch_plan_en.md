# Day 21 Study Plan --- From Promise Review to fetch and Storefront Data

> Environment: Next.js + TypeScript\
> Starting point: Promise study was interrupted around the final `fetch`
> section.\
> Role of Day 21: Move from React fundamentals into asynchronous data
> handling and prepare the data flow required for the shopping project.\
> Principle: Do not introduce too many concepts at once. Follow
> `Promise → async/await → fetch → JSON → product data`.

## 1. Final Goal

``` text
Need product data
→ fetch()
→ Promise
→ await
→ Response
→ response.json()
→ JavaScript data
→ Product[]
→ UI
```

Connect it to Day 20:

``` text
Day 20
User action → Event → State → Props → Rendering → UI

Day 21
Server/API → fetch → Promise → await → JSON → data → UI
```

> **Tip:** The main goal is not memorizing Promise syntax. Understand
> why `fetch` cannot give you the final data immediately.

------------------------------------------------------------------------

## 2. Step A --- Synchronous vs Asynchronous Review

Review:

-   synchronous execution order
-   why asynchronous work exists
-   network requests take time
-   how to handle results that arrive later

``` ts
console.log("A");
fetch("/api/products");
console.log("B");
```

Question: Why can a network result not be used immediately like a normal
variable?

> **Tip:** Start with the simple idea that asynchronous work is work
> that takes time. Internal runtime details can wait.

------------------------------------------------------------------------

## 3. Step B --- Promise Review

Review:

-   what a Promise represents
-   pending
-   fulfilled
-   rejected
-   `.then()`
-   `.catch()`

``` ts
const promise = fetch("/api/products");
```

``` text
call fetch
→ receive a Promise
→ wait for the result
→ fulfilled or rejected
```

Read this pattern:

``` ts
fetch("/api/products")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
```

You do not need to master every `.then()` pattern today. Use it to
understand Promise flow.

> **Tip:** A useful first mental model is: a Promise represents an
> asynchronous operation whose result will be determined later.

------------------------------------------------------------------------

## 4. Step C --- async / await

Handle Promise-based code in a more readable form.

``` ts
async function getProducts() {
  const response = await fetch("/api/products");
}
```

Review:

-   `async` functions
-   `await`
-   `await` commonly waits on a Promise
-   execution inside the async function pauses until that Promise
    settles

Compare:

``` ts
fetch("/api/products").then((response) => {
  // ...
});
```

``` ts
const response = await fetch("/api/products");
```

> **Tip:** Do not treat `.then()` and `await` as unrelated concepts.
> They are two ways to work with Promise results.

------------------------------------------------------------------------

## 5. Step D --- Focus on fetch

This is the core section of Day 21.

``` ts
const response = await fetch("API URL");
```

This does not directly give you a product array.

``` text
fetch()
→ Promise<Response>
→ await
→ Response object
```

Review:

-   `fetch()` returns a Promise
-   `await fetch()` produces a `Response`
-   `Response` contains information about the HTTP response
-   the JSON body still needs to be read

> **Tip:** Avoid the misconception `response = product data`.

------------------------------------------------------------------------

## 6. Step E --- response.json()

``` ts
const response = await fetch("API URL");
const data = await response.json();
```

Flow:

``` text
fetch
→ Response
→ response.json()
→ Promise
→ await
→ JavaScript data
```

Review:

-   what JSON is
-   `response.json()` is also asynchronous
-   the response body is parsed into data JavaScript can use

> **Tip:** Be able to explain the two `await`s: one waits for the HTTP
> response; the other waits for the response body to be parsed.

------------------------------------------------------------------------

## 7. Step F --- TypeScript Product Data

Define a storefront data type.

``` ts
type Product = {
  id: number;
  title: string;
  price: number;
};
```

Target:

``` ts
const products: Product[] = ...
```

Review:

-   Product
-   Product\[\]
-   checking the real API response shape
-   connecting API data to TypeScript types

> **Tip:** Do not guess the API shape first. Inspect the actual
> response, then define the types you need.

------------------------------------------------------------------------

## 8. Step G --- Basic Error Handling

``` ts
async function getProducts() {
  try {
    const response = await fetch("API URL");
    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

Also review:

``` ts
if (!response.ok) {
  throw new Error("Failed to fetch products");
}
```

> **Tip:** Do not build elaborate error UI yet. First learn to
> distinguish successful data from failure paths.

------------------------------------------------------------------------

## 9. Step H --- Connect to Storefront Products

Practice target:

``` text
API
→ fetch
→ Response
→ json
→ Product[]
→ map
→ product list
```

Reuse Day 20 knowledge:

``` tsx
products.map((product) => (
  <div key={product.id}>
    <p>{product.title}</p>
    <p>{product.price}</p>
  </div>
));
```

The new part is where `products` comes from.

``` text
Day 20: products created inside the app
Day 21: products received from a server/API
```

> **Tip:** Think of `fetch` as a new entrance to the familiar
> `Product[] → map → UI` pipeline.

------------------------------------------------------------------------

## 10. Step I --- Where fetch Lives in Next.js

For Day 21, only recognize the distinction:

``` text
fetching on the server
vs
fetching in a Client Component
```

First master `async/await + fetch`; then connect it to Next.js
data-fetching patterns.

Questions to answer:

-   Why is this function `async`?
-   What does `fetch` return?
-   What is the result of `await fetch(...)`?
-   Why is `response.json()` needed?
-   What is the final type of `products`?

> **Tip:** Avoid mixing `useEffect` into the first fetch exercises.
> Learn the fetch pipeline itself before adding another React concept.

------------------------------------------------------------------------

## 11. Main Exercise --- Read a Product API

``` ts
type Product = {
  id: number;
  title: string;
  price: number;
};

async function getProducts() {
  const response = await fetch("API URL");

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const products: Product[] = await response.json();

  return products;
}
```

Explain without looking at notes:

1.  Why is the function `async`?
2.  What does `fetch()` return?
3.  What does the first `await` wait for?
4.  Is `response` the product array?
5.  What does `response.json()` do?
6.  Why is the second `await` needed?
7.  What type is `products`?
8.  Where can the returned products be used?

> **Tip:** For every line, explain its input and its output instead of
> memorizing the whole block.

------------------------------------------------------------------------

## 12. Optional Exercise --- Product List UI

Only after the fetch flow is clear:

``` text
getProducts()
→ Product[]
→ product list
→ map
→ ProductItem
```

Reuse the Day 20 structure:

``` text
Product[]
→ ProductList
→ map
→ ProductItem
```

> **Tip:** Ignore visual styling for now. The goal is to verify that
> data can travel from the API to the UI.

------------------------------------------------------------------------

## 13. Debugging Layers

``` text
JavaScript
→ Promise / async / await / JSON

Web
→ HTTP / Response / response.ok

TypeScript
→ Product / Product[] / API data types

React
→ map / Props / State when needed

Next.js
→ Server / Client / fetch location
```

> **Tip:** Instead of saying "fetch is broken," identify the layer where
> the data flow stops.

------------------------------------------------------------------------

## 14. Oral Review

Explain without code:

1.  synchronous vs asynchronous
2.  Promise
3.  pending / fulfilled / rejected
4.  `.then()`
5.  `.catch()`
6.  `async`
7.  `await`
8.  `fetch()`
9.  `Response`
10. `response.ok`
11. `response.json()`
12. JSON
13. `try / catch`
14. Product vs Product\[\]
15. API → Product\[\]
16. Product\[\] → map → UI
17. why fetch needs await
18. why response.json() needs await
19. Day 20 products vs Day 21 products
20. why a storefront needs data fetching

> **Tip:** If you can say `fetch → await → response → json → data`
> smoothly and explain each transition, the core idea is connected.

------------------------------------------------------------------------

## 15. Coding Test

``` text
Level 1  Read Promise code and explain execution
Level 2  Handle a simple Promise with async/await
Level 3  fetch → Response
Level 4  fetch → response.json() → data
Level 5  Connect Product types
Level 6  Add basic error handling
Level 7  Product[] → map → UI
Level 8  Rebuild the storefront data flow from a blank file
```

> **Tip:** Reach Level 4 comfortably before combining the code with
> React UI.

------------------------------------------------------------------------

## 16. Completion Criteria

-   [ ] Explain synchronous and asynchronous execution.
-   [ ] Explain the role of a Promise.
-   [ ] Explain pending / fulfilled / rejected.
-   [ ] Read `.then()` code.
-   [ ] Explain async / await.
-   [ ] Know that `fetch()` returns a Promise.
-   [ ] Know that `await fetch()` produces a Response.
-   [ ] Explain why `response.json()` is needed.
-   [ ] Check `response.ok`.
-   [ ] Explain try/catch.
-   [ ] Connect API data to a Product type.
-   [ ] Render Product\[\] with map.
-   [ ] Explain API → fetch → JSON → Product\[\] → UI.

------------------------------------------------------------------------

## 17. Recommended Order

``` text
1. synchronous / asynchronous review
2. Promise review
3. read then / catch
4. async / await
5. fetch
6. Response
7. response.json()
8. response.ok + try/catch
9. Product typing
10. render products with map
11. oral review
12. rebuild the fetch flow from a blank file
```

Suggested emphasis:

``` text
Promise review          15%
async / await           20%
fetch / Response        25%
JSON / errors           15%
TypeScript Product      10%
storefront UI           15%
```

> **Tip:** After Day 21, move into the real product-list page and repeat
> the same data-fetching flow there.

------------------------------------------------------------------------

## 18. Day 20 → Day 21 → Storefront

``` text
Day 20
React internal data flow
Event → State → Props → UI

        ↓

Day 21
External data flow
API → fetch → Promise → await → JSON → Product[]

        ↓

Storefront
Product[]
→ product list
→ product card
→ product detail
→ later: cart and other features
```

Final Day 21 thinking process:

``` text
Where is the data?
→ How do I request it?
→ When does the result arrive?
→ How do I parse it?
→ What type is it?
→ How do I use it in the React UI?
```
