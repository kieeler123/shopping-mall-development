# Day 20 React Fundamentals Integration --- Theory Review

> Scope: Days 18--20\
> Environment: Next.js + TypeScript\
> Core goal: connect user input all the way to UI rendering through one
> coherent React data flow.

## 1. The Complete Data Flow

``` text
User input
→ Event
→ handler
→ State
→ create a Product object
→ update the products array State
→ Props
→ map
→ ProductItem
→ UI
```

When an action starts in a child component, such as deletion:

``` text
Child Event
→ function Props
→ parent handler
→ parent State update
→ Props
→ child UI re-render
```

**Tip:** Do not memorize every syntax item in one long sequence. First
understand the larger flow:
`input → State → object → array → Props → rendering`.

## 2. State and Setters

``` tsx
const [productName, setProductName] = useState("");
const [price, setPrice] = useState("");
const [products, setProducts] = useState<Product[]>([]);
```

-   State is data a component needs to remember.
-   A setter asks React to update that State.
-   When State changes, React re-renders the necessary UI.
-   When the next State depends on the previous State, use a functional
    update.

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

**Tip:** Distinguish ordinary variable assignment from a React State
update. If the UI must react to a value change, update it through the
setter.

## 3. Immutable Updates and Spread

Do not directly mutate array or object State. Create a new array or
object.

Array update:

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

Object update:

``` tsx
setForm((prevForm) => ({
  ...prevForm,
  name: "Chulsoo",
}));
```

`...prevProducts` expands the existing array elements into a new array.
`...prevForm` copies the existing object's properties into a new object.

**Tip:** Remember the skeleton `setState(prev => nextValue)`, then build
a new array or object inside it.

## 4. Arrays: map and filter

### map

`map` transforms every array element and returns a new array.

``` tsx
products.map((product) => (
  <ProductItem
    key={product.id}
    product={product}
  />
));
```

Here the transformation is `Product → JSX`.

### filter

`filter` returns a new array containing only elements whose condition is
`true`.

``` tsx
setProducts((prevProducts) =>
  prevProducts.filter((product) => product.id !== id)
);
```

Products whose ids differ from the target id remain; the matching
product is excluded.

**Tip:** `filter` does not mean "delete." Its precise meaning is "build
a new array from elements that pass the condition."

## 5. Product vs Product\[\]

``` tsx
type Product = {
  id: number;
  name: string;
  price: number;
};
```

-   `Product`: one product object
-   `Product[]`: an array containing multiple Product objects

``` tsx
const [products, setProducts] = useState<Product[]>([]);
```

**Tip:** Connect singular `product` with one item and plural `products`
with an array.

## 6. Creating a Product from Input Values

``` tsx
const newProduct: Product = {
  id: Date.now(),
  name: productName,
  price: Number(price),
};
```

Even with `input type="number"`, `event.target.value` is handled as a
string. If `Product.price` must be a number, convert it with
`Number(price)`.

**Tip:** The type used while collecting input does not have to match the
final data model's type.

## 7. Controlled Components

``` tsx
<input
  type="text"
  value={productName}
  onChange={handleChangeProductName}
/>
```

Flow:

``` text
User types
→ change Event
→ onChange
→ handler
→ event.target.value
→ setter
→ State
→ re-render
→ value={State}
```

State controls what the input displays, while user changes flow back
into State through Events.

Resetting inputs:

``` tsx
setProductName("");
setPrice("");
```

Because the inputs use `value={State}`, resetting State also clears the
displayed input values.

**Tip:** With controlled components, change the source of
truth---State---instead of manipulating the DOM directly.

## 8. Events and Event Types

Input change:

``` tsx
const handleChangeProductName = (
  e: ChangeEvent<HTMLInputElement>
) => {
  setProductName(e.target.value);
};
```

Form submission:

``` tsx
const handleSubmit = (
  e: FormEvent<HTMLFormElement>
) => {
  e.preventDefault();
};
```

-   `ChangeEvent<HTMLInputElement>`: an input change event
-   `FormEvent<HTMLFormElement>`: a form event
-   `preventDefault()`: prevents the browser's default form submission
    behavior

**Tip:** Start by separating `input = onChange` and
`submission = onSubmit`.

## 9. onSubmit vs onClick

Use a form submit handler for submitting the whole form:

``` tsx
<form onSubmit={handleSubmit}>
```

Use a click handler for a specific button action:

``` tsx
<button onClick={() => handleDelete(product.id)}>
  Delete
</button>
```

`onClick={() => handleDelete(product.id)}` passes the current product id
to the delete function when the button is clicked.

**Tip:** When a function needs arguments at click time, think of the
pattern `() => function(argument)`.

## 10. Props

A parent passes data to a child.

``` tsx
<ProductList products={products} />
```

Read it as:

``` text
products={products}
    ↑         ↑
Prop name    value being passed
```

The parent's `products` State is passed under the Prop name `products`.

**Tip:** Read JSX `xxx={yyy}` as "pass the value `yyy` under the Prop
name `xxx`."

## 11. Props Types and Destructuring

``` tsx
type ProductListProps = {
  products: Product[];
};

function ProductList({ products }: ProductListProps) {
  // ...
}
```

`{ products }` destructures the `products` property from the Props
object.

A component receiving one product:

``` tsx
type ProductItemProps = {
  product: Product;
};

function ProductItem({ product }: ProductItemProps) {
  return (
    <div>
      <p>{product.name}</p>
      <p>{product.price}</p>
    </div>
  );
}
```

**Tip:** Look for values a component needs but does not own; those
values are strong candidates for Props.

## 12. Function Props

Functions can also be passed through Props.

``` tsx
type ProductItemProps = {
  product: Product;
  handleDelete: (id: number) => void;
};
```

Function type:

``` text
(id: number) => void
```

-   `id: number`: input parameter
-   `void`: no return value is used

Flow:

``` text
App's handleDelete
→ ProductList function Prop
→ ProductItem function Prop
→ button click
→ handleDelete(product.id)
→ App handler runs
```

**Tip:** Read a function type as
`(what it receives) => what it returns`.

## 13. Component Separation

Final structure:

``` text
App
├── ProductForm
├── ProductList
│   └── ProductItem
```

Responsibilities:

-   `App`: owns State and major handlers
-   `ProductForm`: input and submission UI
-   `ProductList`: receives `Product[]` and maps it
-   `ProductItem`: receives one `Product` and renders it

**Tip:** Do not split components too early. Get the data flow working
first; then extract components once the required Props become clear.

## 14. map and key

``` tsx
products.map((product) => (
  <ProductItem
    key={product.id}
    product={product}
  />
));
```

-   `map`: transforms each Product into JSX
-   `key`: a special value React uses to identify list items
-   `key` is not ordinary child data received like a normal Prop

**Tip:** Prefer a stable, unique identifier such as `product.id` for a
list key.

## 15. Product Addition Pattern

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

General pattern:

``` text
previous State
→ calculate a new array
→ setter
→ State changes
→ re-render
```

**Tip:** Think of addition as creating a new array containing
`new item + existing items`.

## 16. Product Deletion Pattern

``` tsx
const handleDelete = (id: number) => {
  setProducts((prevProducts) =>
    prevProducts.filter((product) => product.id !== id)
  );
};
```

Flow:

``` text
Delete button
→ product.id
→ function Props
→ parent handleDelete
→ filter
→ new Product[]
→ setProducts
→ re-render
```

Calling `products.filter(...)` alone creates a new array but does not
update React State, so the UI does not change.

**Tip:** After calculating new data in React, ask: "Which setter should
receive this result?"

## 17. Next.js "use client"

``` tsx
"use client";
```

Within this learning scope, components that use `useState`, event
handlers, and browser user interaction are written as Client Components.

**Tip:** For Day 20, focus on using React fundamentals correctly inside
Next.js + TypeScript rather than expanding into advanced Next.js
features.

## 18. Debugging by Layer

``` text
JavaScript / Web
→ value, Number, spread, map, filter

React
→ State, setter, Props, Controlled Component, key

TypeScript
→ Product, Product[], Event types, Props types, function types

Next.js
→ "use client"
```

**Tip:** When an error occurs, first classify which layer it belongs to
instead of changing code at random.

## 19. Six Core Code Patterns

### Input

``` tsx
onChange={handleChange}

const handleChange = (
  e: ChangeEvent<HTMLInputElement>
) => {
  setState(e.target.value);
};
```

### Create an object

``` tsx
const newProduct: Product = {
  id: Date.now(),
  name: productName,
  price: Number(price),
};
```

### Add to an array

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

### Pass Props

``` tsx
<ProductList products={products} />
```

### Render a list

``` tsx
products.map((product) => (
  <ProductItem
    key={product.id}
    product={product}
  />
));
```

### Delete

``` tsx
setProducts((prevProducts) =>
  prevProducts.filter((product) => product.id !== id)
);
```

**Tip:** Do not memorize the entire app. Associate each of these six
patterns with the problem it solves.

## 20. Final Mental Model

``` text
Input
→ State
→ object
→ array State
→ Props
→ map
→ UI
```

In more detail:

``` text
User action
→ Event
→ handler
→ setter
→ State update
→ data structure update
→ Props
→ Rendering
→ UI
```

When a child needs to cause a parent State change:

``` text
Child Event
→ function Props
→ parent handler
→ parent State
→ Props
→ child UI
```

**Tip:** When stuck, do not immediately search for the complete answer.
First ask: "Which stage of this data flow am I implementing right now?"
