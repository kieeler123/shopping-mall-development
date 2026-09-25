# Day 20 Final Review Plan --- Integrating React Fundamentals

> Review range: Day 18--20\
> Day 20 role: **Final review. Do not add many new concepts; connect
> everything already learned into one React data flow.**
>
> Final environment: **Next.js + TypeScript**

## 1. Final Goal

``` text
User input
→ Event
→ State
→ Create object
→ Update array State
→ Props
→ map
→ UI
```

Combine Day 18 and Day 19:

``` text
Day 18
State / Array / Object / Spread / Props / map / key

        +

Day 19
Event / Form / Controlled Component / Event Types

        ↓

Day 20
Build a small React feature from start to finish without the answer
```

> **Tip:** The success criterion is not "I understand it when I see it."
> It is "I can decide the structure from a blank file."

------------------------------------------------------------------------

## 2. Step A --- Quick JavaScript Recall

Review:

-   Array / Object
-   functions / callbacks
-   `map`
-   `filter`
-   spread
-   destructuring
-   `event.target.value`
-   `Number()`

``` js
const products = [
  { id: 1, name: "Keyboard", price: 50000 },
  { id: 2, name: "Mouse", price: 30000 },
];

const nextProducts = [
  { id: 3, name: "Monitor", price: 250000 },
  ...products,
];
```

Explain:

``` text
What does spread do?
Why avoid mutating the old array?
What is the difference between map and filter?
How do you convert "50000" into a number?
```

> **Tip:** If JavaScript itself is the problem, do not misdiagnose it as
> a React problem.

------------------------------------------------------------------------

## 3. Step B --- State and Immutable Updates

``` tsx
const [count, setCount] = useState(0);

setCount((prevCount) => prevCount + 1);
```

Array:

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

Object:

``` tsx
setForm((prevForm) => ({
  ...prevForm,
  name: "Chulsoo",
}));
```

Review State, setters, re-rendering, functional updates, and immutable
object/array updates.

> **Tip:** A setter is a request to React to update State, not ordinary
> variable assignment.

------------------------------------------------------------------------

## 4. Step C --- Props / map / key

``` tsx
<ProductList products={products} />
```

``` tsx
products.map((product) => (
  <ProductItem
    key={product.id}
    product={product}
  />
));
```

Function Props:

``` tsx
<ProductItem
  product={product}
  onDelete={handleDelete}
/>
```

``` text
Parent State
→ Props
→ Child
→ UI

Child action
→ function Prop
→ parent handler
→ parent State update
```

> **Tip:** When State location is unclear, ask who changes the data and
> which components need it.

------------------------------------------------------------------------

## 5. Step D --- Events / Controlled Components / Forms

``` tsx
const [productName, setProductName] = useState("");

<input
  value={productName}
  onChange={handleProductNameChange}
/>
```

``` text
User input
→ change Event
→ onChange
→ handler
→ event.target.value
→ setter
→ State
→ re-render
```

Form:

``` tsx
<form onSubmit={handleSubmit}>
```

``` tsx
const handleSubmit = (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
};
```

> **Tip:** Separate Form reasoning into input (`onChange`) and
> submission (`onSubmit`).

------------------------------------------------------------------------

## 6. Step E --- Final TypeScript Check

``` tsx
type Product = {
  id: number;
  name: string;
  price: number;
};

const [products, setProducts] = useState<Product[]>([]);
```

Events:

``` tsx
ChangeEvent<HTMLInputElement>
FormEvent<HTMLFormElement>
```

Props:

``` tsx
type ProductListProps = {
  products: Product[];
};
```

> **Tip:** Design the React flow first, then describe its values,
> Events, and Props with types.

------------------------------------------------------------------------

## 7. Step F --- Final Next.js Check

``` tsx
"use client";
```

For today's scope:

``` text
useState
+
Event handlers
+
browser interaction
↓
Client Component
```

> **Tip:** Do not expand into advanced Next.js topics today. Use the
> React fundamentals naturally inside Next.js + TypeScript.

------------------------------------------------------------------------

## 8. Main Challenge --- Product Manager Mini App

``` text
Product [             ]
Price   [             ]

[Add Product]

Product List
Keyboard - 50000
Mouse - 30000
```

A submitted product should be added to the list.

Use:

-   `"use client"`
-   `useState`
-   Controlled Components
-   `onChange` / `onSubmit`
-   `preventDefault()`
-   Event types
-   `Product`
-   array State / spread
-   Props
-   `map` / `key`

> **Tip:** Do not write the entire app at once.

------------------------------------------------------------------------

## 9. Implementation Order

### 1 --- Product type

``` tsx
type Product = {
  id: number;
  name: string;
  price: number;
};
```

### 2 --- Input State

``` text
productName
price
```

### 3 --- Controlled inputs

Connect product name and price to State.

### 4 --- Form submit

``` text
onSubmit
→ preventDefault()
→ read current input State
```

### 5 --- Create `newProduct`

``` tsx
const newProduct: Product = {
  id: Date.now(),
  name: productName,
  price: Number(price),
};
```

### 6 --- Add to array State

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

### 7 --- Render with `map`

### 8 --- Split Components after it works

``` text
ProductForm
ProductList
ProductItem
```

### 9 --- Connect Props

``` text
Parent → ProductList → ProductItem
```

> **Tip:** Make the data flow work before splitting components. The
> required Props will then be much clearer.

------------------------------------------------------------------------

## 10. Optional Challenge --- Delete

``` text
Delete click
→ product.id
→ parent handler
→ filter
→ new array
→ setProducts
→ re-render
```

``` tsx
const handleDelete = (id: number) => {
  setProducts((prevProducts) =>
    prevProducts.filter((product) => product.id !== id)
  );
};
```

> **Tip:** Skip deletion until product registration can be implemented
> independently.

------------------------------------------------------------------------

## 11. Debugging by Layer

``` text
JavaScript/Web
→ value / spread / map / filter / Number

React
→ State / setter / Props / Controlled / key

TypeScript
→ Event / Product / Product[] / Props types

Next.js
→ Client Component / "use client"
```

> **Tip:** Classify the problem before randomly changing code.

------------------------------------------------------------------------

## 12. Final Oral Test

Explain without code:

1.  State vs. Props
2.  Immutable updates
3.  spread
4.  `map` / `key`
5.  Controlled Components
6.  `onChange`
7.  `onSubmit` vs. `onClick`
8.  `preventDefault()`
9.  `ChangeEvent<HTMLInputElement>`
10. `FormEvent<HTMLFormElement>`
11. number input values
12. `"use client"`
13. Form → Product → products → UI
14. function Props
15. delete → id → filter → State

> **Tip:** Explain how data moves, rather than reciting definitions.

------------------------------------------------------------------------

## 13. Final Coding Test

``` text
Level 1
input → State → UI

Level 2
name + email → Form → submitted result

Level 3
product + price
→ Product
→ products State
→ map

Level 4
ProductForm / ProductList / ProductItem
→ Props

Level 5 (optional)
Delete
→ function Props
→ id
→ filter
→ State
```

> **Tip:** If Level 3 works without an answer, the core Day 18--20 flow
> is well connected.

------------------------------------------------------------------------

## 14. Completion Criteria

-   [ ] Design State yourself
-   [ ] Immutably update objects and arrays
-   [ ] Explain Props and function Props
-   [ ] Use `map` and `key`
-   [ ] Build Controlled inputs
-   [ ] Handle Form submission
-   [ ] Write Event types
-   [ ] Type Product / Product\[\] / Props
-   [ ] Explain `"use client"`
-   [ ] Create objects from Form input
-   [ ] Add objects to array State
-   [ ] Split Components and connect Props
-   [ ] Debug by technology layer

------------------------------------------------------------------------

## 15. Day 18 → 19 → 20

``` text
Day 18
Manage, pass, and render data
↓
State / Object / Array / Spread / Props / map / key

Day 19
Receive data from the user
↓
Event / Controlled input / Form / Event Types

Day 20
Connect everything
↓
Form
→ State
→ Product
→ products
→ Props
→ map
→ UI
```

Final mental model:

``` text
User action
→ Event
→ State update
→ data structure update
→ Props
→ Rendering
→ UI
```

------------------------------------------------------------------------

## 16. Recommended Order

``` text
1. 10–15 min JavaScript recall
2. State / Object / Array / Spread
3. Props / map / key
4. Event / Form
5. TypeScript types
6. Product manager mini app
7. Split Components
8. Optional Delete
9. Oral test
10. Rebuild from a blank file
```

> **Tip:** After Day 20, shift from syntax-focused review toward
> building small features and mini-projects.
