# Day 19 React Review --- Events & Forms

## 1. Core Goal

The central flow for Day 19 is:

``` text
User input
→ Event occurs
→ Read the input value from the Event
→ Update React State
→ Re-render
→ Reflect the new State in the UI
→ Submit the Form
```

Each layer has a different role:

``` text
Vanilla JavaScript
→ Understand Web/Event fundamentals

React JavaScript
→ Connect Events, State, and UI

React + TypeScript
→ Add types to existing React code

Next.js + TypeScript
→ Implement the final version as a real Client Component
```

> **Tip:** When code feels complicated, first decide whether the problem
> belongs to JavaScript/Web, React, TypeScript, or Next.js.

------------------------------------------------------------------------

## 2. Vanilla JavaScript --- Event Fundamentals

When a user changes an input, the browser generates an Event.

``` js
const input = document.querySelector("input");

input.addEventListener("input", (event) => {
  console.log(event.target.value);
});
```

Key ideas:

-   `event`: information about the Event that occurred
-   `event.target`: the element where the Event occurred
-   `event.target.value`: the element's current value
-   The browser creates the Event object and passes it to the handler.

``` text
User input
→ Browser Event
→ Event object passed to handler
→ event.target
→ event.target.value
```

### `preventDefault()`

``` js
form.addEventListener("submit", (event) => {
  event.preventDefault();
});
```

`preventDefault()` does not remove the Event. It prevents the browser's
default action associated with that Event.

> **Tip:** Remember it as "prevent the browser's default behavior," not
> merely "prevent a page refresh."

------------------------------------------------------------------------

## 3. React --- `onChange` and State

React connects Event handlers through JSX.

``` jsx
const handleChange = (event) => {
  console.log(event.target.value);
};

return <input onChange={handleChange} />;
```

`onChange={handleChange}` passes the function itself instead of calling
it immediately.

``` jsx
onChange={handleChange}   // pass the function
onChange={handleChange()} // call it during rendering
```

> **Tip:** Think: "Give React the function to run when the Event
> occurs."

### Store the input value in State

``` jsx
const [name, setName] = useState("");

const handleChange = (event) => {
  setName(event.target.value);
};
```

Flow:

``` text
User input
→ onChange
→ handler
→ event.target.value
→ setName(...)
→ State update
→ Re-render
→ UI update
```

> **Tip:** When debugging a React form, trace
> `Event → handler → value → setter → re-render`.

------------------------------------------------------------------------

## 4. Controlled Components

``` jsx
<input
  value={name}
  onChange={handleChange}
/>
```

There are two directions:

``` text
value={name}
State → input

onChange
input → handler → State
```

A controlled component is an input whose displayed value is controlled
by React State, while user changes are sent back into State through
`onChange`.

> **Tip:** Remember the pair: `value={state}` + `onChange → setter`.

------------------------------------------------------------------------

## 5. Separate Input State from Submitted State

The value currently being edited and the last submitted value represent
different information.

``` jsx
const [name, setName] = useState("");
const [submittedName, setSubmittedName] = useState("");
```

Example:

``` text
User types "Chulsoo"
name = "Chulsoo"
submittedName = ""

Submit
name = "Chulsoo"
submittedName = "Chulsoo"

Change the input to "Younghee" without submitting again
name = "Younghee"
submittedName = "Chulsoo"
```

> **Tip:** Before creating State, explain in one sentence what
> information that State needs to remember.

------------------------------------------------------------------------

## 6. Multiple Inputs in One Form

Data that belongs to one submission, such as a name and email, can be
grouped in one Form.

``` jsx
<form onSubmit={handleSubmit}>
  <input value={name} onChange={handleName} />
  <input value={email} onChange={handleEmail} />
  <button type="submit">Sign Up</button>
</form>
```

One submit handler can process both values.

``` jsx
const handleSubmit = (event) => {
  event.preventDefault();

  setSubmittedName(name);
  setSubmittedEmail(email);
};
```

Flow:

``` text
Submit button
→ form submit Event
→ onSubmit
→ handleSubmit
→ preventDefault()
→ State updates
→ Re-render
→ Submitted values appear in the UI
```

### `onClick` vs. `onSubmit`

-   `onClick`: a click Event on a specific element
-   `onSubmit`: the submission Event for the Form

When implementing Form submission, design around
`<form onSubmit={...}>`.

> **Tip:** Do not automatically choose `onClick` just because there is a
> button. First ask whether the user's action is actually "submit this
> Form."

------------------------------------------------------------------------

## 7. React + TypeScript --- Add Event Types

The React behavior does not change. Type information is added to the
existing Event parameter.

### `ChangeEvent`

JavaScript:

``` jsx
const handleName = (event) => {
  setName(event.target.value);
};
```

TypeScript:

``` tsx
import type { ChangeEvent } from "react";

const handleName = (
  event: ChangeEvent<HTMLInputElement>
) => {
  setName(event.target.value);
};
```

Breakdown:

``` text
ChangeEvent
→ React change Event type

HTMLInputElement
→ HTML <input> element
```

`ChangeEvent<HTMLInputElement>` therefore describes a React change Event
associated with an input element.

> **Tip:** Determine an Event type by asking two questions: "What Event
> is it?" and "Which HTML element is involved?"

### `FormEvent`

``` tsx
import type { FormEvent } from "react";

const handleSubmit = (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
};
```

Breakdown:

``` text
FormEvent
→ Form Event type

HTMLFormElement
→ HTML <form> element
```

> **Tip:** `onChange` connects the handler;
> `ChangeEvent<HTMLInputElement>` describes the type of the Event
> parameter received by that handler.

------------------------------------------------------------------------

## 8. State Type Inference

``` tsx
const [name, setName] = useState("");
```

Because the initial value `""` is a string, TypeScript can infer that
this State is a `string`.

Therefore this is not always necessary:

``` tsx
const [name, setName] = useState<string>("");
```

> **Tip:** When TypeScript can infer a type clearly, avoid repeating the
> type without a reason.

------------------------------------------------------------------------

## 9. `input type="number"` Still Produces a String Value

Even with:

``` tsx
<input type="number" />
```

this value is still a string by default:

``` tsx
event.target.value
```

Example:

``` text
Displayed input: 50000
State value: "50000"
```

Convert it when numeric computation is actually needed, for example with
`Number(price)`.

> **Tip:** Do not confuse HTML `type="number"` with the
> JavaScript/TypeScript `number` type.

------------------------------------------------------------------------

## 10. Next.js + TypeScript --- `"use client"`

In the Next.js App Router, a component that needs client-side
interaction through State and Event handlers needs a Client Component
boundary.

``` tsx
"use client";
```

Example:

``` tsx
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
```

The underlying React flow stays the same:

``` text
input
→ onChange
→ handler
→ setState
→ Re-render
→ UI update
```

> **Tip:** Do not memorize `"use client"` as "I am using React." Think
> of it as declaring a Client Component boundary.

------------------------------------------------------------------------

## 11. Final Practice --- Product Registration Form

``` tsx
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

export default function UserForm() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");

  const [submitProduct, setSubmitProduct] = useState("");
  const [submitPrice, setSubmitPrice] = useState("");

  const handleProductNameChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setProductName(event.target.value);
  };

  const handlePriceChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setPrice(event.target.value);
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSubmitProduct(productName);
    setSubmitPrice(price);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={productName}
        onChange={handleProductNameChange}
      />

      <input
        type="number"
        value={price}
        onChange={handlePriceChange}
      />

      <button type="submit">Register Product</button>

      <p>Product: {submitProduct}</p>
      <p>Price: {submitPrice}</p>
    </form>
  );
}
```

Overall flow:

``` text
Enter product name / price
→ onChange
→ ChangeEvent<HTMLInputElement>
→ event.target.value
→ Update input State
→ Re-render

Register product
→ form submit
→ FormEvent<HTMLFormElement>
→ preventDefault()
→ Update submitted State
→ Re-render
→ Display submitted result
```

> **Tip:** As forms grow, first separate the problem into `input State`
> and `submission/result processing`.

------------------------------------------------------------------------

## 12. Separate the Technology Layers

  ---------------------------------------------------------------------------------
  Code / Concept                    Layer                   Role
  --------------------------------- ----------------------- -----------------------
  `event.target.value`              Web / JavaScript Event  Read the current input
                                                            value

  `useState`                        React                   Manage State

  `setProductName`                  React                   Request a State update

  `onChange`, `onSubmit`            React                   Connect Event handlers

  `ChangeEvent<HTMLInputElement>`   React type + TypeScript Type the change Event
                                                            parameter

  `FormEvent<HTMLFormElement>`      React type + TypeScript Type the Form Event
                                                            parameter

  `"use client"`                    Next.js                 Declare a Client
                                                            Component boundary
  ---------------------------------------------------------------------------------

> **Tip:** When an error occurs, use this separation to identify which
> layer you should debug first.

------------------------------------------------------------------------

## 13. Connecting Day 18 and Day 19

Day 18:

``` text
Array State
Objects
Spread
Props
Function Props
map
key
```

Day 19:

``` text
User input
→ Form
→ Event
→ State
→ UI
```

Together:

``` text
Product Form input
→ Create a product object
→ Add it to the products array State
→ Pass it to ProductList through Props
→ Render it with map
```

Day 18's immutable array update returns:

``` tsx
setProducts((prevProducts) => [
  newProduct,
  ...prevProducts,
]);
```

> **Tip:** Distinguish "store one submitted value" from "accumulate
> multiple products in an array." The first is a simple State update;
> the second requires an immutable array update.

------------------------------------------------------------------------

## 14. Day 19 Memory Model

``` text
Vanilla
→ How do I read a value from an Event?

React
→ How do I connect that value to State and UI?

TypeScript
→ How do I describe the Event and value types?

Next.js
→ How do I place this interactive component behind a Client Component boundary?
```

Final core flow:

``` text
User input
→ Event
→ handler
→ event.target.value
→ setter
→ State update
→ Re-render
→ UI update
→ Form Submit
```
