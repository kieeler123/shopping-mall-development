# Day 19 React Review Plan --- Events & Forms

> Review block: Day 18--20\
> Day 19 role: **Review Events / Forms and connect Vanilla → React →
> TypeScript → Next.js TypeScript**
>
> Principle: Do not repeat the same feature four times. **Understand
> each concept at the simplest useful layer, then implement the final
> version in the current project stack: Next.js + TypeScript.**

------------------------------------------------------------------------

## 1. Main Goal

By the end of Day 19, you should be able to explain and implement:

``` text
User input
→ Event occurs
→ Read the value
→ Update React State
→ Reflect it in the UI
→ Submit the Form
```

You should also be able to separate the same feature into four layers:

``` text
Vanilla JavaScript
→ web/Event fundamentals

React JavaScript
→ connect State and UI

React + TypeScript
→ add types to existing React code

Next.js + TypeScript
→ final implementation in the real project environment
```

> **Tip:** When stuck, first identify whether the problem belongs to
> JavaScript, React, TypeScript, or Next.js.

------------------------------------------------------------------------

# 2. Step A --- Event Fundamentals with Vanilla JavaScript

Keep the Vanilla section short.

Focus on:

-   `<input>` values
-   `input` or `change` events
-   Event objects
-   `event.target`
-   the input element's `value`
-   default form submission
-   `preventDefault()`

Example:

``` js
const input = document.querySelector("input");

input.addEventListener("input", (event) => {
  console.log(event.target.value);
});
```

Understand this flow:

``` text
User types
→ browser Event
→ element where the Event occurred
→ current value
```

### Check

-   Is `event.target.value` a React-only concept?
-   Who creates and passes the Event?
-   Where is the input value read from?

> **Tip:** The goal is not to memorize Vanilla DOM code. It is enough to
> understand the browser behavior underneath React Events.

------------------------------------------------------------------------

# 3. Step B --- Core Review with React JavaScript

This is the main part of Day 19.

## 3-1. onChange

``` jsx
function App() {
  const handleChange = (event) => {
    console.log(event.target.value);
  };

  return <input onChange={handleChange} />;
}
```

Flow:

``` text
input
→ onChange
→ handler
→ event
→ event.target.value
```

## 3-2. Store Input in State

``` jsx
const [text, setText] = useState("");

const handleChange = (event) => {
  setText(event.target.value);
};
```

``` text
input
→ onChange
→ setText
→ State changes
→ re-render
```

## 3-3. Controlled Component

``` jsx
<input
  value={text}
  onChange={handleChange}
/>
```

Separate the two directions:

``` text
value={text}
State → input

onChange
input → State
```

## 3-4. Multiple Inputs

Start with separate State values:

``` jsx
const [name, setName] = useState("");
const [email, setEmail] = useState("");
```

Move to object State only after the basic flow is stable.

## 3-5. form / onSubmit

``` jsx
<form onSubmit={handleSubmit}>
```

``` jsx
const handleSubmit = (event) => {
  event.preventDefault();
};
```

Explain the difference:

``` text
onClick
→ click Event on a particular element

onSubmit
→ submission Event for the whole Form
```

> **Tip:** If the React JS flow is unclear, do not move to TypeScript
> yet. Avoid debugging React concepts and type problems at the same
> time.

------------------------------------------------------------------------

# 4. React JS Mini Exercises

## Exercise 1 --- Live Name Preview

``` text
Name [          ]

Current input: Alex
```

Use:

-   `useState`
-   `value`
-   `onChange`
-   `event.target.value`

## Exercise 2 --- Submit a Name

``` text
Name [          ]

[Register]

Registered name: Alex
```

Use:

-   Controlled input
-   `<form>`
-   `onSubmit`
-   `preventDefault()`
-   State for the current input
-   State for the submitted result

## Exercise 3 --- Name + Email

``` text
Name  [          ]
Email [          ]

[Sign Up]
```

Display both submitted values afterward.

> **Tip:** Do not write everything at once. Build
> `name input → email input → submit` incrementally.

------------------------------------------------------------------------

# 5. Step C --- Convert to React + TypeScript

Once the React JS version is understood, **add types only**.

## ChangeEvent

JavaScript:

``` jsx
const handleChange = (event) => {
  setText(event.target.value);
};
```

TypeScript:

``` tsx
import type { ChangeEvent } from "react";

const handleChange = (
  event: ChangeEvent<HTMLInputElement>
) => {
  setText(event.target.value);
};
```

Understand:

``` text
ChangeEvent
→ React change-event type

HTMLInputElement
→ type of the input element
```

## FormEvent

``` tsx
import type { FormEvent } from "react";

const handleSubmit = (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
};
```

The React behavior itself has not changed.

``` text
React JS
handleSubmit(event)

React + TS
handleSubmit(event: FormEvent<HTMLFormElement>)
```

### Type Goals

-   `ChangeEvent<HTMLInputElement>`
-   `FormEvent<HTMLFormElement>`
-   State type inference
-   object types when needed

> **Tip:** In the TypeScript step, ask "How is the existing value
> typed?" rather than "What new React syntax is this?"

------------------------------------------------------------------------

# 6. Object Form State --- Only When Useful

After the basic input flow is stable:

``` tsx
type FormData = {
  name: string;
  email: string;
};

const [form, setForm] = useState<FormData>({
  name: "",
  email: "",
});
```

Update:

``` tsx
setForm((prevForm) => ({
  ...prevForm,
  name: event.target.value,
}));
```

This naturally brings back Day 18's **Object Spread**.

``` text
existing object
→ copy with Spread
→ overwrite the changed property
→ new object
→ Setter
```

> **Tip:** The goal is not merely to learn object-form State. Check
> whether Day 18's immutable-update pattern can be recalled in a new
> context.

------------------------------------------------------------------------

# 7. Step D --- Final Application in Next.js + TypeScript

The final version should match the real project environment.

``` tsx
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

export default function UserForm() {
  const [name, setName] = useState("");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setName(event.target.value);
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    console.log(name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={handleChange}
      />

      <button type="submit">
        Register
      </button>
    </form>
  );
}
```

## Next.js Checks

-   Why is `"use client"` needed?
-   Why does a component using `useState` and Event handlers need to be
    a Client Component?
-   Which React State/Event principles remain unchanged in Next.js?

Do not expand into advanced Next.js topics yet.

> **Tip:** Day 19 is not an App Router deep dive. The goal is simply to
> use the React Form correctly inside a real Next.js project file.

------------------------------------------------------------------------

# 8. Natural Retest of Day 18

If Day 19 requires something like:

``` text
Form input
→ create product object
→ add to products array
→ pass to ProductList
→ render with map
```

naturally review:

-   array State
-   Spread
-   Props
-   function Props
-   `map`
-   `key`

Try to recall them before checking an answer.

------------------------------------------------------------------------

# 9. Day 19 Final Task

## Simple Product Registration Form

Write the final code in **Next.js + TypeScript**.

Requirements:

``` text
Product name [          ]
Price        [          ]

[Register Product]

Result
Product: Keyboard
Price: 50000
```

Before implementation, decide:

1.  What State is needed?
2.  What Events are needed?
3.  What handlers are needed?
4.  What types are needed?
5.  Why is this a Client Component?

Implementation order:

``` text
Design from a React perspective
↓
understand the behavior at React JS level
↓
add required types
↓
write the final Next.js Client Component
```

------------------------------------------------------------------------

# 10. Completion Criteria

You should be able to explain:

-   relationship between browser Events and React Events
-   `onChange`
-   `event.target.value`
-   State/input connection
-   Controlled Components
-   `onSubmit`
-   `preventDefault()`
-   `ChangeEvent<HTMLInputElement>`
-   `FormEvent<HTMLFormElement>`
-   why `"use client"` is needed

When code looks complicated, classify each part:

``` text
JavaScript?
React?
TypeScript?
Next.js?
```

------------------------------------------------------------------------

# 11. Day 19 Learning Order

``` text
Vanilla JS
briefly verify Event fundamentals
↓
React JS
focus on Forms
↓
React + TypeScript
add Event types
↓
Next.js + TypeScript
final Form implementation
```

This is **not** the same lesson repeated four times.

``` text
Vanilla = fundamentals
React = core understanding
TypeScript = types
Next.js TS = final practical implementation
```

> **Tip:** React JS remains the center of Day 19. The final code uses
> Next.js + TypeScript, but the key understanding is still React's
> State/Event flow.
