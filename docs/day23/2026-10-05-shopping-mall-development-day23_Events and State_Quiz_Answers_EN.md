# Day 23 --- Events and State

## Questions + Answers

### Question 1

Explain the difference:

``` tsx
onClick={handleClick}
onClick={handleClick()}
onClick={() => handleClick()}
```

```{=html}
<details>
```
```{=html}
<summary>
```
Show Answer
```{=html}
</summary>
```
`onClick={handleClick}` passes the function and executes it when the
click occurs.

`onClick={handleClick()}` calls the function immediately during
rendering.

`onClick={() => handleClick()}` passes an arrow function. The arrow
function executes on click and then calls `handleClick()`.

```{=html}
</details>
```
> **Tip:** Check whether `()` is present and whether the call is wrapped
> inside another function.

------------------------------------------------------------------------

### Question 2

For:

``` tsx
<option value="shipping">Shipping</option>
```

what is `e.target.value` after selecting the option?

```{=html}
<details>
```
```{=html}
<summary>
```
Show Answer
```{=html}
</summary>
```
`"shipping"`

```{=html}
</details>
```
> **Tip:** Read the `value` attribute rather than the displayed text.

------------------------------------------------------------------------

### Question 3

Given:

``` tsx
const handleStatusChange = (
  orderId: number,
  newStatus: string
) => {};

handleStatusChange(15, "completed");
```

what are `orderId` and `newStatus`, and which values are arguments?

```{=html}
<details>
```
```{=html}
<summary>
```
Show Answer
```{=html}
</summary>
```
``` text
orderId = 15
newStatus = "completed"
```

`15` and `"completed"` are arguments. `orderId` and `newStatus` are
parameters.

```{=html}
</details>
```
> **Tip:** Match arguments to parameters by position.

------------------------------------------------------------------------

### Question 4

For `handleStatusChange(20, "cancelled")`, what happens to IDs `10`,
`20`, and `30`?

```{=html}
<details>
```
```{=html}
<summary>
```
Show Answer
```{=html}
</summary>
```
``` text
10 === 20 → false → unchanged
20 === 20 → true  → status becomes "cancelled"
30 === 20 → false → unchanged
```

```{=html}
</details>
```
> **Tip:** `orderId` remains `20`; only `order.id` changes while `map()`
> iterates.

------------------------------------------------------------------------

### Question 5

Explain the complete flow:

``` tsx
onChange={(e) => {
  handleStatusChange(
    order.id,
    e.target.value as OrderStatus
  );
}}
```

```{=html}
<details>
```
```{=html}
<summary>
```
Show Answer
```{=html}
</summary>
```
``` text
User changes value
↓
onChange
↓
Event object e
↓
e.target.value
↓
order.id + new value
↓
handleStatusChange(...)
↓
State setter
↓
State update
↓
Re-render
↓
JSX recalculation
↓
UI update
```

`as OrderStatus` is a TypeScript Type Assertion. It does not change the
runtime value.

```{=html}
</details>
```
> **Tip:** Trace the value from the Event all the way to the State
> setter and UI.
