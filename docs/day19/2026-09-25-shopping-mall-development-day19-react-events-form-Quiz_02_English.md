# Day 19 React Events & Forms --- Questions + Answers

> Scope: Vanilla JavaScript → React → TypeScript → Next.js + TypeScript\
> How to use: Answer each question before opening its `<details>`
> answer.

## Part 1. Core Concepts

### 1. Who creates the Event object and passes it to the handler?

<details><summary>Show answer</summary>

The browser creates the Event object when the Event occurs and passes it
to the registered handler.

</details>

### 2. Explain `event`, `event.target`, and `event.target.value`.

<details><summary>Show answer</summary>

`event` contains Event information; `event.target` is the element where
the Event occurred; `event.target.value` is that element's current
value.

</details>

### 3. Is `event.target.value` React-only syntax?

<details><summary>Show answer</summary>

No. It comes from Web/DOM Event fundamentals and is also used by React.

</details>

### 4. What does `preventDefault()` do?

<details><summary>Show answer</summary>

It prevents the browser's default action associated with the Event.

</details>

### 5. Does `preventDefault()` delete the Event?

<details><summary>Show answer</summary>

No. The Event still occurs; only the browser's default behavior is
prevented.

</details>

### 6. What does `onChange={handleChange}` mean?

<details><summary>Show answer</summary>

It passes `handleChange` to React as the function to run when the change
Event occurs.

</details>

### 7. Difference between `onChange={handleChange}` and `onChange={handleChange()}`?

<details><summary>Show answer</summary>

The first passes a function reference. The second calls the function
during rendering and passes its return value.

</details>

### 8. What generally follows a React State update?

<details><summary>Show answer</summary>

State update → re-render → UI recalculated/reflected from the new State.

</details>

### 9. What is a Controlled Component?

<details><summary>Show answer</summary>

An input whose value is controlled by React State, with user changes
sent back to State through `onChange`.

</details>

### 10. What direction does `value={name}` represent?

<details><summary>Show answer</summary>

`State → input`.

</details>

### 11. What direction does `onChange` represent?

<details><summary>Show answer</summary>

`input → handler → State`.

</details>

### 12. Why separate editing State from submitted State?

<details><summary>Show answer</summary>

So editing the input after submission does not automatically change the
last submitted result.

</details>

### 13. If name and email belong to one signup submission, how many forms are normally appropriate?

<details><summary>Show answer</summary>

One form, because they belong to one submission unit.

</details>

### 14. Why prefer `onSubmit` over centering the design on `onClick` for form submission?

<details><summary>Show answer</summary>

`onSubmit` represents the Form submission itself rather than only a
click on one element.

</details>

### 15. What does `<button type="submit">` mean?

<details><summary>Show answer</summary>

It explicitly marks the button as a Form submit button.

</details>

## Part 2. Flow Tracing

### 16. Complete the core flow: user input → \_\_\_ Event → onChange → handler → value → \_\_\_ → State update → \_\_\_ → UI.

<details><summary>Show answer</summary>

`change`, `setter`, `re-render`.

</details>

### 17. Initial: `name=""`, `submittedName=""`. User types `Chulsoo` without submitting. Values?

<details><summary>Show answer</summary>

`name="Chulsoo"`, `submittedName=""`.

</details>

### 18. Then submit with `setSubmittedName(name)`. Values?

<details><summary>Show answer</summary>

`name="Chulsoo"`, `submittedName="Chulsoo"`.

</details>

### 19. Then edit input to `Younghee` without resubmitting. Values?

<details><summary>Show answer</summary>

`name="Younghee"`, `submittedName="Chulsoo"`.

</details>

### 20. Correct this order: submit → handler → preventDefault → UI → State → re-render.

<details><summary>Show answer</summary>

Correct order: submit → handler → preventDefault → State update →
re-render → UI update.

</details>

## Part 3. Reading Code

### 21. If the user types `React`, what does `setName(e.target.value)` store?

<details><summary>Show answer</summary>

The string `"React"`.

</details>

### 22. Why is `<input value={name} onChange={handleChange} />` controlled?

<details><summary>Show answer</summary>

State controls the displayed value, and `onChange` sends user changes
back into State.

</details>

### 23. Which handler runs when a submit button inside `<form onSubmit={handleSubmit}>` submits the form?

<details><summary>Show answer</summary>

`handleSubmit`.

</details>

### 24. What may happen if `preventDefault()` is removed from a Form submit handler?

<details><summary>Show answer</summary>

The browser's default Form submission behavior may run.

</details>

### 25. Given `useState("")`, is `submitName` designed as a string or array?

<details><summary>Show answer</summary>

A string.

</details>

### 26. Why is `setSubmitName(prev => [newItem, ...prev])` inconsistent with that design?

<details><summary>Show answer</summary>

It treats a string State as if it were an array.

</details>

### 27. What initial State is natural for accumulating multiple products?

<details><summary>Show answer</summary>

`const [products, setProducts] = useState([]);`

</details>

## Part 4. TypeScript

### 28. Type for an `<input>` `onChange` Event?

<details><summary>Show answer</summary>

`ChangeEvent<HTMLInputElement>`.

</details>

### 29. Type for a `<form>` `onSubmit` Event?

<details><summary>Show answer</summary>

`FormEvent<HTMLFormElement>`.

</details>

### 30. Break down `ChangeEvent<HTMLInputElement>`.

<details><summary>Show answer</summary>

`ChangeEvent` is React's change Event type; `HTMLInputElement`
identifies an HTML input element.

</details>

### 31. Break down `FormEvent<HTMLFormElement>`.

<details><summary>Show answer</summary>

`FormEvent` is the Form Event type; `HTMLFormElement` identifies an HTML
form element.

</details>

### 32. Type for `<input type="email">` change handler?

<details><summary>Show answer</summary>

`ChangeEvent<HTMLInputElement>`; it is still an input element.

</details>

### 33. Type for `<input type="number">` change handler?

<details><summary>Show answer</summary>

`ChangeEvent<HTMLInputElement>`; it is still an input element.

</details>

### 34. Default type of `e.target.value` for `input type="number"`?

<details><summary>Show answer</summary>

`string`.

</details>

### 35. Why can `useState("")` omit `<string>`?

<details><summary>Show answer</summary>

TypeScript can infer `string` from the initial string value.

</details>

### 36. Difference between importing `useState` and `import type { ChangeEvent, FormEvent }`?

<details><summary>Show answer</summary>

`useState` is a runtime React Hook value; the others are used as
TypeScript type information.

</details>

### 37. Fill the type: `const handlePrice = (e: ___) => setPrice(e.target.value);`

<details><summary>Show answer</summary>

`ChangeEvent<HTMLInputElement>`.

</details>

### 38. Fill the type: `const handleSubmit = (e: ___) => e.preventDefault();`

<details><summary>Show answer</summary>

`FormEvent<HTMLFormElement>`.

</details>

## Part 5. Next.js

### 39. What does `"use client"` declare in Next.js App Router?

<details><summary>Show answer</summary>

A Client Component boundary.

</details>

### 40. Why is saying `"use client" means using React` inaccurate?

<details><summary>Show answer</summary>

Not every React component needs to be a Client Component; it marks a
boundary requiring client-side capabilities such as State/Event
interaction.

</details>

### 41. Which are React concepts: A `useState`, B `onChange`, C re-render after State update, D `"use client"`?

<details><summary>Show answer</summary>

A, B, C. D belongs to Next.js Client Component boundaries.

</details>

### 42. Classify: `"use client"`, `useState`, `ChangeEvent<HTMLInputElement>`, `event.target.value`.

<details><summary>Show answer</summary>

Next.js; React; React type + TypeScript; Web/JavaScript Event concept.

</details>

## Part 6. Find the Error

### 43. Find the error: an input change handler is typed `FormEvent<HTMLFormElement>`.

<details><summary>Show answer</summary>

Use `ChangeEvent<HTMLInputElement>` for the input change handler.

</details>

### 44. Find the error: a form submit handler is typed `ChangeEvent<HTMLInputElement>`.

<details><summary>Show answer</summary>

Use `FormEvent<HTMLFormElement>`.

</details>

### 45. What is the issue with editable `<input value={name} />` without `onChange`?

<details><summary>Show answer</summary>

State fixes its value, but there is no handler to update that State from
user edits.

</details>

### 46. Improve a form that uses only `<button onClick={handleSubmit}>` for submission.

<details><summary>Show answer</summary>

Put `onSubmit={handleSubmit}` on the form and use
`<button type="submit">`.

</details>

### 47. Why is `<input onChange={handleChange()} />` usually wrong?

<details><summary>Show answer</summary>

It calls the function during rendering instead of passing it as an Event
handler.

</details>

### 48. Why doesn't `<input type="number">` automatically make State a number?

<details><summary>Show answer</summary>

The input's `value` is read as a string by default.

</details>

## Part 7. Code Completion

### 49. Complete a live-name controlled input.

<details><summary>Show answer</summary>

`setName(e.target.value)` in the handler, and `value={name}` plus
`onChange={handleChange}` on the input.

</details>

### 50. Complete a submit handler that stores `name` in `submittedName`.

<details><summary>Show answer</summary>

`e.preventDefault(); setSubmittedName(name);`

</details>

### 51. How do you submit both name and email in one handler?

<details><summary>Show answer</summary>

`e.preventDefault(); setSubmittedName(name); setSubmittedEmail(email);`

</details>

### 52. Convert `const handleEmail = (e) => setEmail(e.target.value);` to TS.

<details><summary>Show answer</summary>

`const handleEmail = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);`

</details>

### 53. Convert a JS form submit handler to TS.

<details><summary>Show answer</summary>

`const handleSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); };`

</details>

## Part 8. Design

### 54. Design four States for product name/price input and submitted result.

<details><summary>Show answer</summary>

`productName`, `price`, `submitProduct`, `submitPrice`, each initialized
with `useState("")`.

</details>

### 55. Map product form actions to Events.

<details><summary>Show answer</summary>

Product name → `onChange`; price → `onChange`; Form submission →
`onSubmit`.

</details>

### 56. Name three handlers for that form.

<details><summary>Show answer</summary>

For example: `handleProductNameChange`, `handlePriceChange`,
`handleSubmit`.

</details>

### 57. Give the three handler Event types.

<details><summary>Show answer</summary>

First two: `ChangeEvent<HTMLInputElement>`; submit:
`FormEvent<HTMLFormElement>`.

</details>

### 58. Why does that product form need `"use client"`?

<details><summary>Show answer</summary>

It uses State and Event handlers for browser-side user interaction.

</details>

## Part 9. Day 18 Connection

### 59. Difference between one `submitProduct` string and a `products` array?

<details><summary>Show answer</summary>

The string stores one submitted result; the array accumulates multiple
products.

</details>

### 60. Write an immutable update that prepends `newProduct`.

<details><summary>Show answer</summary>

`setProducts(prevProducts => [newProduct, ...prevProducts]);`

</details>

### 61. Why use spread in that array update?

<details><summary>Show answer</summary>

To create a new array containing the existing items without directly
mutating the old array.

</details>

### 62. Describe Form → product object → products array → ProductList.

<details><summary>Show answer</summary>

Manage input through State; create a product on submit; immutably add it
to products; pass products via Props; render with `map`.

</details>

## Part 10. Final Review

### 63. Classify lines in a component containing `"use client"`, `useState`, `ChangeEvent<HTMLInputElement>`, and `e.target.value`.

<details><summary>Show answer</summary>

Next.js; React; React type + TypeScript; Web/Event concept.

</details>

### 64. Write Day 19's complete one-line flow.

<details><summary>Show answer</summary>

User input → Event → handler → `event.target.value` → setter → State
update → re-render → UI update → Form submit.

</details>

### 65. Describe the roles of Vanilla/Web, React, TypeScript, and Next.js.

<details><summary>Show answer</summary>

Web: Event/value fundamentals. React: connect Event, State, UI.
TypeScript: describe types. Next.js: place interactive code behind a
Client Component boundary.

</details>

### 66. Final implementation challenge: build the product registration form in Next.js + TypeScript.

<details><summary>Show answer</summary>

Use `"use client"`, four string States, two
`ChangeEvent<HTMLInputElement>` handlers, one
`FormEvent<HTMLFormElement>` submit handler, controlled inputs,
`preventDefault()`, and separate submitted State.

</details>

## Final Checklist

- [ ] I can explain where the Event object comes from.
- [ ] I can explain `event.target.value`.
- [ ] I can distinguish `handler` from `handler()`.
- [ ] I can explain Controlled Components.
- [ ] I can separate editing State and submitted State.
- [ ] I can distinguish `onClick` and `onSubmit`.
- [ ] I can explain `preventDefault()`.
- [ ] I can use `ChangeEvent<HTMLInputElement>`.
- [ ] I can use `FormEvent<HTMLFormElement>`.
- [ ] I know number-input values are strings by default.
- [ ] I can explain `"use client"`.
- [ ] I can separate Web / React / TypeScript / Next.js concerns.
- [ ] I can build a Next.js + TypeScript Form without looking at the
      answer.

> **Tip:** Treat an answer as mastered only if you can explain or code
> it before opening `<details>`.
