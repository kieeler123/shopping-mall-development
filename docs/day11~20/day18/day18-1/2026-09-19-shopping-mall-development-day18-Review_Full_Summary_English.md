# Day 18 Review Summary --- Connecting React Fundamentals and Diagnosing Independent Implementation

## 1. Purpose of This Review

The goal was not to rush into new material, but to connect concepts
already learned to real code and diagnose **where the thought process
breaks down when starting a small project from scratch without a
reference**.

Review method: - Explain concepts from memory. - Design or implement
small requirements independently. - Separate correct usage from
imprecise explanations. - Check whether a corrected concept transfers to
a new problem. - Distinguish minor syntax mistakes from actual
conceptual gaps.

> **Tip:** Measure understanding as **can explain → can implement → can
> transfer to a different problem**, not merely "I have seen this
> before."

------------------------------------------------------------------------

## 2. Roles of HTML / CSS / JavaScript

### HTML

Defines the **structure and content** of a web page.

### CSS

Controls **presentation, layout, and design**.

### JavaScript

Handles **behavior and logic**, such as responding to users and changing
data.

``` text
HTML → Structure / Content
CSS → Presentation / Design
JavaScript → Behavior / Logic
```

> **Tip:** Move beyond "screen / make it pretty / functionality" and
> remember the more precise distinction: **structure / presentation /
> behavior**.

------------------------------------------------------------------------

## 3. Why React?

With vanilla JavaScript, changing data often requires directly finding
and updating DOM elements. React lets us manage the **relationship
between State and UI declaratively**.

``` text
State changes
↓
Re-render
↓
UI is recalculated from the new State
↓
UI is updated
```

React is not valuable merely because it can shorten code. Its major role
is to systematically manage the relationship between **changing data
(State)** and the **UI**.

> **Tip:** Think of React as a system that connects **State changes to
> UI updates**, not merely as a way to avoid manual DOM manipulation.

------------------------------------------------------------------------

## 4. DOM

The DOM is an interface in which the browser represents an HTML document
as an **object/tree structure that programs can work with**.

When JavaScript changes the page, it normally manipulates the DOM in the
browser rather than modifying the original HTML file itself.

> **Tip:** Do not equate the HTML file with the DOM. The browser parses
> HTML and creates the DOM representation.

------------------------------------------------------------------------

## 5. useState and Re-rendering

``` jsx
const [count, setCount] = useState(0);
```

``` text
count → current State value
setCount → function that updates the State
0 → initial value
```

Example flow:

``` text
count = 0
↓
setCount(count + 1)
↓
State = 1
↓
Re-render
↓
UI displays 1
```

The `0` in `useState(0)` is used as the initial value when the State is
first created. React keeps the current State across later renders.

> **Tip:** Do not reduce `useState` to "changing a value on screen."
> Think of it as **managing changing data that the component must
> remember and connecting its updates to rendering**.

------------------------------------------------------------------------

## 6. Counter Implemented from Memory

``` jsx
import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>increase</button>
    </div>
  );
}
```

The following decisions were made independently:

``` text
Changing value → count
↓
Needs State
↓
Initial value = 0
↓
Click Event
↓
setCount
↓
Re-render
↓
UI update
```

The JSX top-level wrapper and `export default` were briefly forgotten,
but these currently look more like syntax/structure recall issues than
fundamental conceptual gaps.

> **Tip:** Distinguish forgetting a small piece of syntax from being
> unable to design the feature itself.

------------------------------------------------------------------------

## 7. Translating Requirements Precisely into Code

In the name-change task, the requirement had two explicit buttons, but
the first implementation used one toggle button.

In the fruit-list task, the requirement showed separate list items, but
the first implementation used:

``` jsx
{fruit.join(", ")}
```

The functionality was valid, but the resulting UI did not exactly match
the requirement.

### Diagnosis

There is a tendency to quickly apply a familiar coding pattern while
missing **small UI details in the requirement**.

> **Tip:** Before coding, split the requirement into **data / behavior /
> UI form**, then compare the finished implementation against each
> requirement line.

------------------------------------------------------------------------

## 8. Array State and Immutability

``` jsx
const [fruit, setFruit] = useState(["Apple", "Banana"]);
setFruit([...fruit, "Orange"]);
```

React State should generally be treated as immutable: create a **new
array or object** and pass it to the setter instead of directly mutating
the existing State.

``` jsx
fruit.push("Orange");
```

mutates the existing array.

Spread does not mean "append to the end."

``` jsx
[...fruit, "Orange"] // Orange comes last
["Orange", ...fruit] // Orange comes first
```

Its position comes from the order of the syntax.

> **Tip:** Remember Spread as **expanding array elements or object
> properties**, not as "append."

------------------------------------------------------------------------

## 9. map / filter / find

### map

Transforms each element into a desired form and returns a **new array**.

### filter

Keeps elements that satisfy a condition and returns a **new array**.

``` jsx
products.filter((p) => p.id !== id)
```

### find

Returns the **first matching element**. If nothing matches, it returns
`undefined`.

> **Tip:** Use the mental model: `map = transform each`,
> `filter = keep matches`, `find = get one match`.

------------------------------------------------------------------------

## 10. Updating an Object Inside Array State

This was one of the first areas where the implementation process clearly
got stuck.

``` jsx
function handleChangeAirpot() {
  const updatedProducts = product.map((p) => {
    if (p.name === "AirPods") {
      return {
        ...p,
        price: 50,
      };
    }

    return p;
  });

  setProduct(updatedProducts);
}
```

Roles:

``` text
map → create a new array based on the old one
condition → identify the target
...p → spread existing properties into a new object
price: 50 → override price
return p → keep non-target products unchanged
setProduct → update React State with the new array
```

The initial difficulty came from combining several concepts at once:

``` text
map
+
condition
+
Object Spread
+
immutability
+
setter
```

After one structural hint, the implementation was completed correctly. A
later retest was completed without that hint.

> **Tip:** For multi-concept updates, first break the task into
> **identify target → transform data → update State**.

------------------------------------------------------------------------

## 11. Object Spread

``` js
const user = { name: "Chulsoo", age: 20 };
const newUser = { ...user, age: 30 };
```

When the same property appears more than once, the value written later
wins.

``` js
const newUser = { age: 30, ...user };
```

Here the final `age` is `20` because `...user` comes later.

> **Tip:** Spread itself does not "change" a value. It expands existing
> properties, and **property order determines which duplicate value
> wins**.

------------------------------------------------------------------------

## 12. Deleting with filter

``` jsx
function handleDelete(id) {
  setProduct(
    product.filter((p) => p.id !== id)
  );
}
```

The feature was independently designed as:

``` text
Identify target → id
Render products → map
Exclude target → filter
New array → setProduct
State changes → UI changes
```

> **Tip:** In React, think of deletion as **creating a new array that
> excludes the target**, rather than directly deleting from the old
> array.

------------------------------------------------------------------------

## 13. Combined Update + Delete

The following pattern was later implemented without a structural hint:

``` jsx
function handleAdd(id) {
  setProduct(
    product.map((p) =>
      p.id === id
        ? { ...p, price: p.price + 10 }
        : p
    )
  );
}

function handleDelete(id) {
  setProduct(
    product.filter((p) => p.id !== id)
  );
}
```

This successfully combined:

``` text
id
map
condition
Object Spread
setter
filter
Event
```

> **Tip:** A mistake during the first attempt matters less than whether
> the corrected idea can be **transferred independently to a different
> problem**.

------------------------------------------------------------------------

## 14. React key

``` jsx
<ProductCard
  key={p.id}
  product={p}
/>
```

`key` helps React identify the **identity of rendered list items**.

Important distinction:

``` text
key={p.id}
→ React uses it to identify the list item

handleDelete(p.id)
→ application code passes the target id to a function
```

JavaScript `map()` itself does not require a key; keys matter when React
renders lists of JSX elements.

Also, `key` is special and is not forwarded as a normal prop:

``` jsx
props.key // not available as a normal prop
```

If the child needs the id, pass it explicitly.

``` jsx
<ProductCard
  key={p.id}
  id={p.id}
  product={p}
/>
```

> **Tip:** Do not remember `key` as "passing the id to the child." It is
> **React's list identity information**.

------------------------------------------------------------------------

## 15. Event Handlers and Execution Timing

These are different:

``` jsx
onClick={() => handleDelete(p.id)}
```

``` jsx
onClick={handleDelete(p.id)}
```

The second form calls `handleDelete(p.id)` during rendering. The first
passes a function that can call it later when the click occurs.

If no custom argument is needed:

``` jsx
onClick={handleDelete}
```

can pass the function directly.

``` text
handleDelete → the function itself
handleDelete() → execute the function
```

> **Tip:** An Event Handler should receive **a function to run when the
> event occurs**, not the result of executing the function immediately.

------------------------------------------------------------------------

## 16. Props

The initial mental model was close to:

> Props become necessary when a project grows and components are moved
> into separate files.

The more precise principle is that Props are about **passing values
between components**, not about file boundaries.

``` jsx
<ProductCard product={product} />
```

Props are still used even when both components are in the same file.

> **Tip:** Remember Props as **the way a parent component passes values
> to a child component**, not as a way to fetch values from another
> file.

------------------------------------------------------------------------

## 17. Functions Can Be Passed as Props

This was one of the clearest gaps found during the review.

Parent:

``` jsx
function App() {
  const [count, setCount] = useState(0);

  function handleIncrease() {
    setCount(count + 1);
  }

  return (
    <CounterButton onIncrease={handleIncrease} />
  );
}
```

Child:

``` jsx
function CounterButton({ onIncrease }) {
  return (
    <button onClick={onIncrease}>
      +1
    </button>
  );
}
```

Flow:

``` text
App owns handleIncrease
↓
passes it as onIncrease
↓
CounterButton receives it
↓
button click
↓
onIncrease runs
↓
App's handleIncrease runs
↓
App State changes
```

`onIncrease` is a custom prop name, not a special React event.

> **Tip:** "Function Props" are not a separate React mechanism. **The
> value being passed through Props simply happens to be a function.**

------------------------------------------------------------------------

## 18. Data Props + Function Props

``` jsx
<ProductCard
  product={p}
  onDelete={handleDelete}
/>
```

``` text
product → data prop used for rendering
onDelete → function prop used for behavior
```

Keep these locations separate:

``` text
Where the function is created → parent
Where it is received as a prop → child
Where it is executed → child's Event
Whose State it changes → parent's State
```

> **Tip:** A function created in the parent can still be executed by the
> child after it has been passed down as a prop.

------------------------------------------------------------------------

## 19. Passing Props Through Multiple Levels

``` text
App
↓ handleDelete
ProductList
↓ handleDelete
ProductCard
↓
Delete button
↓
parent's handleDelete
↓
App State changes
```

An intermediate component may receive a prop only to pass it further
down to another child.

> **Tip:** With deeper component trees, first draw **where the State
> lives and how the Props travel** before writing code.

------------------------------------------------------------------------

## 20. Where Should State Live?

Example:

``` text
App
├── Header
│   └── needs cart count
│
└── ProductList
    └── ProductCard
        └── needs add-to-cart behavior
```

Putting `cart` State in `Header` would not work well because
`ProductCard` is not a child of `Header`.

A better principle is:

> Put State in an appropriate common parent of the components that need
> it.

In this example, `App` is the common parent.

> **Tip:** Do not memorize "put State as high as possible." Use **only
> as high as necessary**.

------------------------------------------------------------------------

## 21. When State Does Not Need to Be Lifted

If only `QuantitySelector` uses `quantity`, it can own that State
itself.

``` text
ProductPage
├── ProductInfo
└── QuantitySelector ← quantity State
```

If `ProductInfo` later also needs `quantity`, move the State to their
common parent:

``` text
ProductPage ← quantity State
├── ProductInfo
└── QuantitySelector
```

This connects to **Lifting State Up**.

> **Tip:** State location is not permanent. It can change when the set
> of components that need the data changes.

------------------------------------------------------------------------

## 22. A Useful Order for Thinking About State and Props

``` text
1. What data changes?
↓
State candidate

2. Which components need it?
↓
Decide State location

3. Does a child need the value?
↓
Pass data Props

4. Does a child need to change parent State?
↓
Pass a function Prop

5. Child executes function
↓
Parent State updates

6. Re-render
↓
New Props

7. UI updates
```

> **Tip:** When starting a project, do not begin with `useState`. First
> reason through **data → consumers → State location → Props flow**.

------------------------------------------------------------------------

## 23. Strengths Observed So Far

-   Basic `useState`
-   Button Events
-   Basic use of `map`, `filter`, and `find`
-   Adding items to array State
-   Deleting with `filter`
-   Identifying targets with `id`
-   Immutable object-array updates after correction
-   Object Spread override order
-   Combining update and delete functionality
-   Breaking simple requirements into State/Event/UI
-   Basic judgment about keeping State near the components that need it

> **Tip:** Future practice should spend less time re-memorizing basic
> syntax and more time **combining concepts in unfamiliar problems**.

------------------------------------------------------------------------

## 24. Areas to Reinforce

### 24.1 Precise explanations

Code can often be written correctly, but explaining the exact
responsibilities of `map`, Spread, `key`, setters, and immutability is
slower and sometimes mixes neighboring concepts.

### 24.2 Initial multi-concept composition

The first attempt at combining
`map + condition + Object Spread + immutability + setState` was
difficult, although transfer improved quickly after correction.

### 24.3 Requirement details

Small details such as number of buttons, list presentation, and button
labels can be missed even when the core functionality works.

### 24.4 Function Props

One of the clearest areas needing reinforcement. The basic flow was
understood after explanation, but a new question format caused some
confusion again.

### 24.5 `key` vs normal Props

There was confusion between using an id as a React `key` and passing an
id/data to a child. This has now been corrected.

> **Tip:** Do not only reread these explanations next time. Test whether
> each idea can be **recreated without hints in a new problem**.

------------------------------------------------------------------------

## 25. Interim Diagnosis: Why Starting a Project Independently Feels Difficult

The evidence so far does not support a simple conclusion such as
"JavaScript is not understood."

The current pattern is closer to:

``` text
Individual syntax → largely usable
Small one-file features → can implement independently
Transfer after correction → possible
Precise conceptual explanation → relatively difficult
First-time multi-concept composition → slow retrieval
State / Props / function design across components → needs reinforcement
Requirement → exact UI structure → occasional detail drift
```

The next major question is whether the following chain can be designed
independently from an empty project:

``` text
Requirements analysis
↓
Component decomposition
↓
State candidates
↓
State location
↓
Data Props
↓
Function Props
↓
Events
↓
State updates
↓
UI reflection
```

> **Tip:** Instead of saying "I can't code," record **the exact design
> step where thinking stops**.

------------------------------------------------------------------------

## 26. Items to Retest Next Time

1.  Can function Props be designed without hints?
2.  Can State location be chosen independently?
3.  Can `map + condition + Object Spread` be retrieved again?
4.  Can `key` be distinguished from data Props?
5.  Can requirements be translated precisely into component/UI
    structure?
6.  Can the reason behind written code be explained?
7.  Can data/function flow be traced through multiple component levels?

> **Tip:** It is useful to be slightly rusty next time. Try the problems
> first, then check this document only where needed.

------------------------------------------------------------------------

## 27. Core Flow from Today's Review

``` text
User requirement
↓
Find changing data
↓
State
↓
Who needs it?
↓
State location
↓
Component decomposition
↓
Parent → child data Props
↓
Event in child
↓
Function Props
↓
Parent setter
↓
State update
↓
Re-render
↓
New Props
↓
UI update
```

For array/object State:

``` text
Add → create a new array, often with Spread
Delete → filter
Update one item → map + condition + Object Spread
Find one item → find
```

------------------------------------------------------------------------

## 28. Stopping Point for Today's Review

The review stops here for today. The next session should especially
retest these items without hints:

``` text
1. Function Props
2. Choosing State location
3. State updates that combine multiple concepts
```

> **Tip:** Next time, do not begin by memorizing this document.
> **Attempt the problems first and use the notes only when stuck** so
> that actual recall and understanding can be measured.
