# Day 18 React Study Summary

## 1. Focused Review: Function Props

The first topic reviewed today was the flow of **creating a handler in
the component that owns the State and passing that function through
props to the child component that needs it**.

``` text
App
├─ Header
└─ ProductList
   └─ ProductCard
      └─ Button
```

Core flow:

``` text
Component that owns State
↓
Create a handler that updates the State
↓
Pass the function through props
↓
Intermediate components pass it down again
↓
The component that needs it executes it
```

Example:

``` jsx
function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prevCart => [...prevCart, item]);
  };

  return (
    <>
      <Header count={cart.length} />
      <Shop addToCart={addToCart} />
    </>
  );
}
```

``` jsx
function Shop({ addToCart }) {
  return <ItemCard item={item} addToCart={addToCart} />;
}
```

``` jsx
function ItemCard({ item, addToCart }) {
  return (
    <button onClick={() => addToCart(item)}>
      Add to Cart
    </button>
  );
}
```

> **Tip:** When function props become confusing, trace three things:
> `Who created the function? → Who has it now? → Who executes it?`

## 2. Props Arrive as One Object

Incorrect form:

``` jsx
function ProductCard(product, onAdd) {
```

A React component receives one props object, so it can be written as:

``` jsx
function ProductCard(props) {
```

Or with destructuring:

``` jsx
function ProductCard({ product, onAdd }) {
```

> **Tip:** When you see `<Component a={} b={} c={} />`, connect it to
> `function Component({ a, b, c })`.

## 3. Deciding Where State Should Live

State should not automatically be placed at the highest possible level.
It should live in an **appropriate common parent of the components that
need the data**.

``` text
App
├─ Header ← needs the cart count
└─ ProductList
   └─ ProductCard ← needs to add items to the cart
```

In this case, `App` can be an appropriate place for the State.

``` text
State lives in App
↓
setState also belongs to App
↓
Create the State-changing handler in App
↓
Pass it to the children that need it
```

> **Tip:** Instead of asking `What is the highest component?`, ask
> `What is the common parent of the components that use this data?`

## 4. Updating an Object Inside Array State

Practice State:

``` jsx
const [users, setUsers] = useState([
  { id: 1, name: "A", active: false },
  { id: 2, name: "B", active: false },
]);
```

The goal was to change only the user with `id === 2` to `active: true`.

The key was distinguishing the roles of the variables:

``` text
users
→ original whole array

user
→ one element currently being processed by map

updatedUsers
→ new whole array created by map

activateUser
→ function that performs the operation
```

Without React, the same structure looks like this:

``` js
const numbers = [1, 2, 3];

const doubledNumbers = numbers.map(number => {
  return number * 2;
});
```

``` text
numbers → original whole array
number → current element
doubledNumbers → new whole array
```

> **Tip:** When things get confusing, label variables by role:
> `array / one object / function / new array`.

## 5. Capture the Result of map

`map()` returns a new array.

Incorrect flow:

``` js
users.map(user => {
  // ...
});

setUsers(users);
```

Correct flow:

``` js
const updatedUsers = users.map(user => {
  if (user.id === 2) {
    return {
      ...user,
      active: true
    };
  }

  return user;
});

setUsers(updatedUsers);
```

> **Tip:** Do not think only about `What happens inside map?` Also ask
> `What new array does map return when it finishes?`

## 6. The Role of Object Spread

Instead of directly mutating the existing object, create a new object:

``` js
{
  ...user,
  active: true
}
```

This means:

``` text
Copy the existing properties of user
+
Overwrite only active with the new value
```

For objects that should not change:

``` js
return user;
```

> **Tip:** For object updates, remember
> `copy the existing object → overwrite the property that needs to change`.

## 7. Final Transfer Problem

The same principle was successfully applied to a product array.

``` jsx
const [products, setProducts] = useState([
  { id: 10, name: "Keyboard", price: 50000 },
  { id: 20, name: "Mouse", price: 30000 },
  { id: 30, name: "Monitor", price: 200000 },
]);
```

Increase the price of the product with `id === 20`:

``` js
const updatedProducts = products.map(product => {
  if (product.id === 20) {
    return {
      ...product,
      price: product.price + 10000
    };
  }

  return product;
});

setProducts(updatedProducts);
```

Using `price: 40000` gives the correct result for the current data, but
if the requirement is **increase the existing price by 10,000**, then
`product.price + 10000` represents the requirement more accurately.

> **Tip:** When requirements say `increase`, `decrease`,
> `from the current value`, or `based on the existing value`, check
> whether you should calculate from the existing value instead of
> hard-coding the result.

## 8. Types of Mistakes Found Today

### Conceptual areas that needed reinforcement

-   The path through which function props are passed
-   Props being a single object
-   The return value of `map`
-   Distinguishing the whole array from the current element
-   Passing the new array to the State setter

### Syntax and attention mistakes

-   `setFavorite` vs. `setFavorites`
-   `onadd` vs. `onAdd`
-   Missing JSX self-closing syntax
-   Missing Fragment
-   Writing `active: false` when the requirement was `active: true`

> **Tip:** Classify errors as
> `concept / syntax / typo / requirement-reading`. This makes it much
> clearer what actually needs more study.

## 9. Current Learning Status

  Area                                      Current status
  ----------------------------------------- ---------------------------
  Basic `useState`                          ✅
  Basic events                              ✅
  Adding/removing array items               ✅
  Function props                            ✅ Reinforced
  Props destructuring                       ✅
  Choosing State location                   ✅ Basic understanding
  `map`                                     ✅
  Selecting a target with a condition       ✅
  Updating with Object Spread               ✅
  `map` result → Setter                     ✅ Intensively reinforced
  `key` vs. normal props                    ✅
  Updating from an existing value           🟡 Needs more experience
  Tracking variable roles in complex code   🟡 Recheck later
  Implementing exact requirements           🟡 Needs attention
  JSX details                               🟡 Occasional mistakes

## 10. Future Review Strategy

Instead of immediately repeating today's exact problems, continue
progressing and later encounter the same patterns naturally in different
contexts.

Examples:

-   Change the quantity of a specific product
-   Change an option of a specific product
-   Change an order status
-   Delete a specific item
-   Update parent State from a child component

At that point, check whether these concepts can be recombined without
hints:

``` text
State location
Function props
map
Condition
Object Spread
Setter
```

> **Tip:** Do not memorize the finished code. Remember the reasoning
> flow:
> `whole array → process one at a time → find the target → create a new object → create a new whole array → Setter`.

## Starting Point for the Next Session

Next time, continue directly with **Events / Forms** rather than
repeating today's material from the beginning.

``` text
Events / Forms
↓
input
↓
onChange
↓
event.target.value
↓
value={state}
↓
Controlled Component
↓
form / onSubmit
↓
preventDefault()
```

Today's main achievement was identifying where combined concepts became
difficult, breaking them into smaller pieces, understanding each piece,
and then successfully recombining them into working code.
