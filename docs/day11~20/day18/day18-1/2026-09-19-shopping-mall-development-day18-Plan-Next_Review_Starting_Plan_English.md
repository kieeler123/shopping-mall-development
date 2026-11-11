# Day 18 Next Review Starting Plan

## Purpose

Continue from the exact point reached in the previous review instead of
restarting from the beginning.

Current diagnostic picture:

-   Basic `useState`, Events, `map`, and `filter` are usable.
-   Adding to and deleting from array State can be implemented
    independently.
-   `map + condition + Object Spread` was initially difficult, but the
    retest was completed independently.
-   `key` is understood as React list identity information rather than a
    normal prop.
-   Basic data Props are understood.
-   **Function Props are a clear reinforcement point.**
-   State should live in an appropriate common parent of the components
    that need it, not automatically at the topmost component.
-   Code can often be written, but precise explanations of each
    construct's responsibility are slower.
-   Small UI details in requirements can occasionally drift during
    implementation.

> **Tip:** Start with problems rather than rereading the answers. Check
> the previous summary only after getting stuck.

## STEP 1 --- Retest Function Props

Using a new example, determine without hints:

``` text
Parent Component
├─ State
├─ handler that updates State
└─ Child Component
   └─ actual Button
```

Identify where State lives, where the handler is created, what is passed
as Props, where the child executes the function, and which State
ultimately changes.

``` text
Create handler in parent
↓
Pass function to child through Props
↓
Execute it from child's Event
↓
Parent handler runs
↓
Parent State updates
↓
Re-render
```

> **Tip:** Do not memorize `onDelete={handleDelete}`. Understand that
> the function is passed because the State owner and the component where
> the Event occurs can be different.

## STEP 2 --- Choose State Location Independently

``` text
Who needs this data?
↓
Only one Component?
→ Keep it near that Component

Multiple Components?
↓
What is their common parent?
→ Lift State only as high as necessary
```

Retest Local State, common parents, Lifting State Up, data Props, and
function Props.

> **Tip:** Use **as high as necessary**, not "always put State at the
> top."

## STEP 3 --- Retest `map + condition + Object Spread`

``` js
const users = [
  { id: 1, name: "A", active: false },
  { id: 2, name: "B", active: false },
];
```

Requirement: change only user id 2 so `active` becomes `true`, without
directly mutating the original array or object.

``` text
id + map + condition + Object Spread + property override + Setter
```

> **Tip:** Think **identify target → create transformed data → update
> State** before writing code.

## STEP 4 --- Retest `key` vs Normal Props

``` jsx
<Item key={item.id} item={item} onDelete={handleDelete} />
```

``` text
key → for React, not a normal child prop
item → data Prop
onDelete → function Prop
```

> **Tip:** `key={id}` and `onDelete(id)` use the same id for different
> responsibilities.

## STEP 5 --- Design from Requirements

Before coding, independently determine the UI, changing data, Events,
Component boundaries, State location, data Props, and function Props.

> **Tip:** To diagnose why an empty project feels difficult, observe the
> design phase before JSX is written.

## STEP 6 --- Small Component-Decomposition Exercise

``` text
Product list
- Product name
- Price
- [+10]
- [Delete]
```

At minimum:

``` text
App
└─ ProductList
   └─ ProductCard
```

Design `products` State, `onDelete`, `onPriceIncrease`, `key`, and the
full Event-to-parent-State-update flow.

> **Tip:** Explain why each State and handler belongs where it was
> placed, not just whether the code works.

## STEP 7 --- Retest Explanation Ability

``` text
① Purpose
② Changing data
③ State location and reason
④ Target identification
⑤ Data transformation
⑥ State update
⑦ Re-render and UI reflection
```

> **Tip:** Explain as **purpose → data → transformation → update → UI**,
> not line by line.

## STEP 8 --- Criteria for Moving Forward

If function Props, State location, immutable object-array updates, `key`
vs Props, and requirement-to-Component design are stable, continue to:

``` text
Events / Forms
↓
Custom Hooks
↓
localStorage
↓
Product → Cart → Order
↓
TypeScript
↓
Next.js
↓
HTTP / API
↓
Async JavaScript
↓
HTTP → React State
↓
useEffect
```

> **Tip:** If a concept works in a retest, move forward and bring it
> back later in new contexts.

## First Question for the Next Session

``` text
App
├─ cart State
├─ Header
│  └─ displays number of cart items
└─ ProductList
   └─ ProductCard
      └─ [Add to Cart] Button
```

1.  Where should cart State live?
2.  What should be passed to Header through Props?
3.  Where should the add-to-cart function be created, and how should it
    reach ProductCard?
4.  Explain the flow from Button click to UI update.

**Explain the design before writing code.**

> **Tip:** Record not only whether the answer is correct, but where
> thinking becomes noticeably slower.
