# Day 7 STEP 1–8 — Question & Answer Review

## STEP 1 — Dynamic Route `[id]`

### Q1. What is the `[id]` folder used for?
**A.** It creates a variable URL segment.

```text
app/orders/[id]/page.tsx
↓
/orders/123
/orders/456
```

The same page can handle different order IDs.

> **Tip**
>
> Think of `[id]` as a variable slot in the URL.

### Q2. How is `123` in `/orders/123` related to `[id]`?
**A.** `"123"` becomes the value of the dynamic parameter named `id`.

```text
/orders/123
↓
params.id = "123"
```

> **Tip**
>
> `id` is the parameter name, not the fixed value.

---

## STEP 2 — `Link`

### Q3. Why use `Link` on the order history page?
**A.** To navigate to a detail URL containing the selected order ID.

```tsx
<Link href={`/orders/${order.id}`}>View Details</Link>
```

> **Tip**
>
> In this architecture, `Link` puts the ID into the URL rather than passing the whole order object.

### Q4. Why should the detail link be outside `order.items.map()`?
**A.** Because it represents an action for the whole order, not for each individual product. Putting it inside the item loop would repeat the same order-level link.

> **Tip**
>
> Keep order-level UI at the order level and item-level UI inside the item loop.

---

## STEP 3 — `useParams()`

### Q5. What does `useParams()` do?
**A.** It reads the current Dynamic Route parameters.

```tsx
const params = useParams();
```

For `/orders/123`, `params.id` can be understood as `"123"`.

> **Tip**
>
> `Link` writes the value into the URL; `useParams()` reads it.

### Q6. Why is `params.id` `"123"` instead of numeric `123`?
**A.** URL path segments do not carry JavaScript number-type metadata, so route parameter values are handled as strings.

> **Tip**
>
> A URL that visually contains digits is not automatically a JavaScript number.

---

## STEP 4 — `localStorage`, `useState`, `useEffect`

### Q7. Why do we still need `localStorage` after reading the ID?
**A.** The URL tells us which order to find, but it does not contain the full order data such as name, address, and items.

```text
params.id → search condition
orders[] → search collection
```

> **Tip**
>
> Separate “which order?” from “where is the order data?”

### Q8. Why is `JSON.parse()` needed?
**A.** `localStorage` returns strings. `JSON.parse()` restores the saved JSON string into JavaScript data.

```text
localStorage
↓
JSON string
↓
JSON.parse()
↓
Order[]
```

> **Tip**
>
> Pair `JSON.stringify()` for storage with `JSON.parse()` for restoration.

### Q9. Is `setOrders(parsedOrders)` the same as `orders = parsedOrders`?
**A.** No. The setter requests a React state update. It does not directly mutate the state variable in the current render.

> **Tip**
>
> Think of a state setter as a request that leads to a render with new state.

### Q10. Why doesn't `useState([])` reset state to `[]` on every re-render?
**A.** `[]` is the initial value used when the state is first created. React preserves state across re-renders.

> **Tip**
>
> Distinguish a re-render from a remount.

---

## STEP 5 — `Number()`, `NaN`, `===`

### Q11. Why use `Number(params.id)`?
**A.** Because `params.id` is a string while the current `Order.id` model uses a number.

```ts
"123" === 123 // false
```

So:

```tsx
const orderId = Number(params.id);
```

> **Tip**
>
> Match types deliberately before strict comparison.

### Q12. What happens for `/orders/abc`?
**A.**

```text
Number("abc")
↓
NaN
```

You can test it with:

```ts
Number.isNaN(orderId);
```

> **Tip**
>
> `typeof NaN` is `"number"`, so use `Number.isNaN()` for invalid numeric conversion.

---

## STEP 6 — `find()`

### Q13. What does `find()` return?
**A.** It returns the first element satisfying the condition, or `undefined` if nothing matches.

```tsx
const order = orders.find(
  (order) => order.id === orderId
);
```

> **Tip**
>
> Always pair `find()` with the possibility of `undefined`.

### Q14. What is the `order` inside `(order) => order.id === orderId`?
**A.** It is the current single order being checked from `orders[]`.

```text
orders → all orders
order  → current order
```

> **Tip**
>
> Singular and plural naming makes array callbacks easier to read.

### Q15. Why can `order` be `undefined` on the first render?
**A.** Initially `orders` is empty and the effect has not loaded `localStorage` yet.

> **Tip**
>
> First-render `undefined` does not necessarily mean “not found.”

---

## STEP 7 — Detail UI

### Q16. Why use one `order` instead of `orders.map()` on the detail page?
**A.** Because STEP 6 already selected one specific order.

```text
list → orders.map()
detail → orders.find() → order
```

> **Tip**
>
> A list renders many records; a detail page renders one selected record.

### Q17. Why use `map()` for `order.items`?
**A.** A single order may contain multiple products, so each item needs to be rendered.

> **Tip**
>
> Think of the data shape as one Order containing many items.

### Q18. Why call `products.find()` again?
**A.** To retrieve the full product information matching each `item.productId`.

> **Tip**
>
> `orders.find()` and `products.find()` use the same search idea on different arrays.

---

## STEP 8 — Loading / Not Found / Success

### Q19. Why do we need a separate `loading` state?
**A.** Because these two situations can both have `orders = []`:

```text
not checked yet → []
checked and truly empty → []
```

> **Tip**
>
> Represent both the data and the status of obtaining that data.

### Q20. Why check Loading before Not Found?
**A.** On the first render, `order` may be `undefined` simply because data has not loaded yet.

```tsx
if (loading) return ...;
if (!order) return ...;
return ...;
```

> **Tip**
>
> The order of conditions defines the meaning of the UI states.

### Q21. Why is `order.name` safe after `if (!order) return ...`?
**A.** Execution can only continue past that condition when `order` exists. TypeScript can narrow the type based on this control flow.

> **Tip**
>
> This is a useful example of type narrowing.

### Q22. How can Day 7 be explained in one flow?
**A.** Put an order ID into the URL, read it through the Dynamic Route, match its type, load `orders[]`, find one order, and render the appropriate Loading, Not Found, or Success UI.

```text
Link
↓
[id]
↓
useParams()
↓
Number()
↓
localStorage → orders[]
↓
find()
↓
Order | undefined
↓
Loading / Not Found / Success
↓
Detail UI
```

> **Tip**
>
> If you can explain this flow without code, the main Day 7 concepts are connected.
