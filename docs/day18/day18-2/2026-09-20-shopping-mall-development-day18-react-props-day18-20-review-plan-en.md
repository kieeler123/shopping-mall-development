# Day 18--20 React Review Plan

> Background: Progress reached `fetch` by Day 17. Days 18--20 are used
> as a focused React review block.\
> Current project stack: **Next.js + TypeScript**
>
> Review strategy: **Understand concepts simply with Vanilla JavaScript
> / React JavaScript, add the necessary types, and write final
> implementations in Next.js + TypeScript.**

------------------------------------------------------------------------

# Overall Principle

## 1. Do Not Learn Four Technologies at Once

``` text
Vanilla JavaScript
→ verify web/JavaScript fundamentals

React JavaScript
→ core React understanding

React + TypeScript
→ add types

Next.js + TypeScript
→ final implementation in the real project environment
```

Do not repeat every exercise in all four versions.

Use only the layers that help each concept.

> **Tip:** When code becomes complicated, classify each part as
> `JavaScript / React / TypeScript / Next.js`.

------------------------------------------------------------------------

# Day 18 --- Review ①: State / Props / Array State

## Status

**Completed**

## Core Topics

-   `useState`
-   choosing State location
-   data Props
-   function Props
-   Props destructuring
-   passing handlers through components
-   `map`
-   `filter`
-   Object Spread
-   immutable array-State updates
-   `key` vs normal Props
-   updates based on existing values

## Core Mental Model

``` text
existing whole array
→ current element
→ check condition
→ create a new object only for the target
→ new whole array
→ Setter
```

Function Props:

``` text
component owning State
→ create handler
→ pass through Props
→ child executes it
→ parent State changes
→ re-render
```

## Main Point Found on Day 18

The important challenge was not each isolated concept, but
distinguishing:

-   whole array
-   one element
-   new array
-   handler function

when several concepts were combined.

### Going Forward

Do not immediately repeat the Day 18 problems.

On Days 19--20, check whether `map`, Spread, and function Props can be
recalled naturally when needed.

> **Tip:** Day 18 was the targeted repair stage. The next goal is
> transfer to different situations, not memorization of the same
> questions.

------------------------------------------------------------------------

# Day 19 --- Review ②: Events / Forms

Follow the separate detailed Day 19 plan.

## Learning Structure

``` text
Vanilla JS
Event fundamentals
↓
React JS
onChange / State / Controlled Component / Form
↓
React + TypeScript
ChangeEvent / FormEvent
↓
Next.js + TypeScript
final implementation in a Client Component
```

## Core Topics

-   `<input>`
-   `onChange`
-   Event object
-   `event.target.value`
-   input State
-   `value={state}`
-   Controlled Components
-   multiple inputs
-   `<form>`
-   `onSubmit`
-   `preventDefault()`
-   `ChangeEvent<HTMLInputElement>`
-   `FormEvent<HTMLFormElement>`
-   `"use client"`

## Connection to Day 18

When possible, extend the Form into adding data to an array State:

``` text
Form
→ user input
→ create new object
→ add to array State
→ render with map
```

This naturally brings back:

-   Spread
-   array addition
-   Props
-   `map`
-   `key`

## Day 19 Final Result

Implement a simple product-registration Form in **Next.js +
TypeScript**.

> **Tip:** Final TSX code does not mean types and Next.js must be
> considered from the first line. Design the React behavior first, then
> add types and the framework environment.

------------------------------------------------------------------------

# Day 20 --- Review ③: Integrated Mini Project

Day 20 focuses less on isolated quizzes and more on **designing and
implementing a small feature from scratch**.

## Example Project --- Product Manager

Final environment:

``` text
Next.js
+
TypeScript
```

Example UI:

``` text
Product name [              ]
Price        [              ]

[Add Product]

-----------------------------

Keyboard
50,000
[+10,000] [Delete]

Mouse
30,000
[+10,000] [Delete]
```

## Required Features

### Add Product

``` text
Form input
→ submit
→ create product object
→ add to products State
```

### Update Price

``` text
product id
→ map
→ condition
→ Object Spread
→ existing price + 10000
→ new array
→ Setter
```

### Delete Product

``` text
product id
→ filter
→ new array
→ Setter
```

### Render List

``` text
products
→ map
→ ProductCard
→ key
```

------------------------------------------------------------------------

# Day 20 Implementation Stages

## Step 1 --- Design from Requirements

Before coding, answer:

-   What State is needed?
-   Where should the State live?
-   What components are needed?
-   What handlers are needed?
-   What Props are needed?
-   What data types are needed?

## Step 2 --- Design the React Data Flow

Example:

``` text
ProductManager
├─ ProductForm
└─ ProductList
   └─ ProductCard
```

Possible flow:

``` text
ProductForm
→ onAdd
→ parent State changes

ProductCard
→ onIncrease
→ parent State changes

ProductCard
→ onDelete
→ parent State changes
```

## Step 3 --- Write Core Logic at React JS Level

Verify the logic without focusing on type syntax first:

-   add
-   update
-   delete
-   Prop passing

## Step 4 --- Add TypeScript Types

Example:

``` tsx
type Product = {
  id: number;
  name: string;
  price: number;
};
```

Function Props:

``` tsx
type ProductCardProps = {
  product: Product;
  onIncrease: (id: number) => void;
  onDelete: (id: number) => void;
};
```

## Step 5 --- Place It in the Next.js Structure

Use State/Event boundaries to decide which components need to be Client
Components.

Use:

``` tsx
"use client";
```

where needed.

Do not force advanced Next.js features into the review project.

## Step 6 --- Final TSX Implementation

Finish the result as **Next.js + TypeScript code**.

## Step 7 --- Explain the Code

After implementation, classify the code:

``` text
this part is JavaScript
this part is React
this part is TypeScript
this part is Next.js
```

Then explain the data flow.

------------------------------------------------------------------------

# Day 20 Evaluation Criteria

Do not evaluate only whether the app runs.

### React

-   Can you explain State location?
-   Can you explain the function-Prop flow?
-   Can you choose `map` vs `filter` appropriately?
-   Do you avoid direct mutation?
-   Do you understand the Form flow?

### TypeScript

-   Can you define data types?
-   Can you read and write Props types?
-   Do you understand function-Prop types?

### Next.js

-   Can you explain why a Client Component is needed?
-   Can you distinguish React concepts from Next.js features?

> **Tip:** A TypeScript error does not automatically mean the React
> logic is wrong. Identify the problem layer first.

------------------------------------------------------------------------

# Day 18--20 Flow

``` text
Day 17
existing progress through fetch
        ↓
────────────────────
Review block
────────────────────
        ↓
Day 18
State / Props / array State
targeted concept review
        ↓
Day 19
Events / Forms
Vanilla → React → TS → Next.js TS
        ↓
Day 20
integrated mini project
design → React logic → types → final Next.js TS
        ↓
────────────────────
Review complete
────────────────────
        ↓
Day 21
return to existing curriculum
continue after fetch
```

------------------------------------------------------------------------

# Controlling the Workload

Do **not** do this:

``` text
complete app in Vanilla
+
same complete app in React JS
+
same complete app in React TS
+
same complete app in Next.js TS
```

Instead:

``` text
Vanilla
→ tiny code for fundamentals

React JS
→ concept learning and core exercises

TypeScript
→ add only the type differences

Next.js TS
→ final result
```

This connects fundamentals to the real project stack without multiplying
the workload.

------------------------------------------------------------------------

# After the Review Block

From Day 21 onward, stop separating technologies purely for review.
Apply them as needed in the real curriculum.

``` text
fetch
→ response data
→ TypeScript types
→ React State
→ rendering
→ user Events
→ UI updates
```

Use this process to keep checking whether the Day 18--20 concepts can be
recalled.

> **Tip:** The final goal of review is not to become good at a problem
> bank. It is to use React and JavaScript principles confidently inside
> real Next.js + TypeScript project code.
