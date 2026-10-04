# Day 22 --- React State Updates and Immutability: 70 Review Questions

> Solve each question yourself first. Then open the `<details>` section
> below the question to check the answer and explanation.

**Study rule:** Keep code identifiers such as `setOrders`, `prevOrders`,
`map()`, and `filter()` unchanged because they are code, not
natural-language text.

------------------------------------------------------------------------

### Question 1

What is the role of `orders` in
`const [orders, setOrders] = useState<Order[]>([]);`?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`orders` is the current State value used by the current render. Its type
is `Order[]`, and its initial value is an empty array.

**Tip:** `orders` means the current State value.

```{=html}
</details>
```
### Question 2

What is the role of `setOrders`?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`setOrders` is the setter function used to request an update to the
`orders` State.

**Tip:** Think "request a State update," not ordinary assignment.

```{=html}
</details>
```
### Question 3

Describe the typical flow after calling `setOrders`.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`setOrders` requests a State update → the component re-renders → JSX is
recalculated using the new State → the UI reflects the result.

**Tip:** Connect the setter all the way to the UI.

```{=html}
</details>
```
### Question 4

What does immutability mean when updating React State?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
Do not directly mutate the existing State. Create a new array or object
containing the desired changes and use it as the next State.

**Tip:** Old value untouched → create new value.

```{=html}
</details>
```
### Question 5

Why should `orders[0].status = "SHIPPED"` be avoided as the State update
pattern in this lesson?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
It directly mutates an object inside the existing State. The pattern
learned here creates a new value and updates State through the setter.

**Tip:** Ask whether the existing State is being directly changed.

```{=html}
</details>
```
### Question 6

What is the difference between `Order[]` and `Order`?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`Order[]` is an array of Order objects. `Order` is one Order object.

**Tip:** Plural means collection; singular means one item.

```{=html}
</details>
```
### Question 7

Is `prevOrders` a React reserved word?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
No. It is only a parameter name and can be renamed.

**Tip:** A meaningful name is useful, but the exact name is not special.

```{=html}
</details>
```
### Question 8

Who supplies the value received as `prevOrders`?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
React supplies the previous State value when it calls the updater
function.

**Tip:** React calls updater → previous State becomes the argument.

```{=html}
</details>
```
### Question 9

If `orders` has type `Order[]`, what type does `prevOrders` have?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`Order[]`.

**Tip:** The updater receives the State value of the same State.

```{=html}
</details>
```
### Question 10

In `setOrders((prevOrders) => [...prevOrders, newOrder])`, what is the
updater function?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
The entire `(prevOrders) => [...prevOrders, newOrder]` expression is the
updater function. `prevOrders` is its parameter.

**Tip:** Do not confuse a function with its parameter.

```{=html}
</details>
```
### Question 11

What does `...prevOrders` do inside a new array?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
It expands the elements of `prevOrders` into the new array.

**Tip:** Spread expands existing elements.

```{=html}
</details>
```
### Question 12

Does spread itself add `newOrder`?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
No. Spread expands existing elements. `newOrder` is added because it is
separately included after `...prevOrders`.

**Tip:** Spread and the new item have different roles.

```{=html}
</details>
```
### Question 13

Given `prevOrders = [{id:1},{id:2}]` and `newOrder = {id:3}`, what does
`[...prevOrders, newOrder]` produce?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`[{ id: 1 }, { id: 2 }, { id: 3 }]`.

**Tip:** The result is a new array.

```{=html}
</details>
```
### Question 14

How do `[...prevOrders, newOrder]` and `[newOrder, ...prevOrders]`
differ?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
The first places `newOrder` at the end; the second places it at the
beginning.

**Tip:** Array position follows the written order.

```{=html}
</details>
```
### Question 15

What does `[...prevOrders]` produce?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
A new array containing the existing elements of `prevOrders`, with no
additional item.

**Tip:** No extra value means no extra item.

```{=html}
</details>
```
### Question 16

Why does `[...prevOrders, newOrder]` preserve array State immutability?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
It does not directly mutate `prevOrders`; it creates a new array
containing the existing elements plus `newOrder`.

**Tip:** Existing array remains untouched.

```{=html}
</details>
```
### Question 17

What is the basic role of `map()`?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`map()` processes each array element and creates a new array from the
callback's return values.

**Tip:** Element → return value → new array.

```{=html}
</details>
```
### Question 18

Does `map()` return the original array itself?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
No. It returns a new array.

**Tip:** `map()` produces a new array.

```{=html}
</details>
```
### Question 19

How many times does a `map()` callback run for an array containing three
elements?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
Three times, once for each element.

**Tip:** One callback execution per element.

```{=html}
</details>
```
### Question 20

In `prevOrders.map((order) => ...)`, what is `order`?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
It is one `Order` object from `prevOrders`, received one element at a
time.

**Tip:** `prevOrders` is the array; `order` is one element.

```{=html}
</details>
```
### Question 21

Does `map()` create the `order` object passed to the callback?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
No. The existing array element is passed into the callback as `order`.

**Tip:** The new thing created by `map()` is the result array.

```{=html}
</details>
```
### Question 22

Is `prevOrders.map((order) => order)` the same array object as
`prevOrders`?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
No. The result is a new array, although its elements may reference the
same existing objects.

**Tip:** Separate array identity from element identity.

```{=html}
</details>
```
### Question 23

What is the purpose of `order.id === updatedOrder.id`?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
It checks whether the current `order` is the exact item that should be
updated.

**Tip:** Read it as "Is this the target?"

```{=html}
</details>
```
### Question 24

Why is `id` more appropriate than `status` for identifying the update
target?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
Multiple orders can share the same status, while an ID is used to
identify a specific order.

**Tip:** Use identity, not a potentially duplicated state value.

```{=html}
</details>
```
### Question 25

What is returned when `order.id === updatedOrder.id` is true?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`updatedOrder`.

**Tip:** The target item is replaced.

```{=html}
</details>
```
### Question 26

Why return the existing `order` when the ID does not match?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
Because non-target items should remain unchanged in the new array.

**Tip:** `: order` preserves unchanged items.

```{=html}
</details>
```
### Question 27

Rewrite `condition ? updatedOrder : order` as `if/else`.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
``` ts
if (condition) {
  return updatedOrder;
} else {
  return order;
}
```

**Tip:** A ternary can be expanded into an if/else.

```{=html}
</details>
```
### Question 28

What does `===` check?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
Strict equality: both value and type must match.

**Tip:** `2 === "2"` is false.

```{=html}
</details>
```
### Question 29

If `updatedOrder.id` is `2`, what happens for IDs 1, 2, and 3?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`1 === 2` → false → existing order; `2 === 2` → true → `updatedOrder`;
`3 === 2` → false → existing order.

**Tip:** Evaluate the condition for every element.

```{=html}
</details>
```
### Question 30

What is the result when only the order with ID 2 is replaced by
`{ id: 2, status: "SHIPPED" }`?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
The new array keeps IDs 1 and 3 unchanged and contains the updated
object for ID 2.

**Tip:** Only the matching item changes.

```{=html}
</details>
```
### Question 31

Does `return null` inside `map()` mean "return nothing"?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
No. It returns the value `null`.

**Tip:** `null` is still a value.

```{=html}
</details>
```
### Question 32

If non-matching items return `null` in the update `map()`, what appears
in those positions?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`null` values appear in those positions.

**Tip:** `map()` stores callback return values.

```{=html}
</details>
```
### Question 33

Which is more appropriate for excluding elements from an array: `map()`
or `filter()`?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`filter()`.

**Tip:** `map()` transforms; `filter()` keeps or excludes.

```{=html}
</details>
```
### Question 34

Why is `newOrders === prevOrders` false after
`const newOrders = prevOrders.map(order => order)`?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
Because `map()` creates a new array object.

**Tip:** Same elements do not imply the same array.

```{=html}
</details>
```
### Question 35

Does creating a new array mean every object inside it must also be a new
object?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
No. Unchanged items can still be the same existing objects.

**Tip:** New array does not mean all-new elements.

```{=html}
</details>
```
### Question 36

What is the basic role of `filter()`?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`filter()` creates a new array containing only elements whose condition
evaluates to true.

**Tip:** true = keep; false = exclude.

```{=html}
</details>
```
### Question 37

Why use `order.id !== deleteId` for deletion?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
It makes all non-target orders true so they remain, while the target
order becomes false and is excluded.

**Tip:** Make the delete target the false case.

```{=html}
</details>
```
### Question 38

Evaluate `1 !== 2`, `2 !== 2`, and `3 !== 2`.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`true`, `false`, `true`.

**Tip:** Use the Boolean results to determine what remains.

```{=html}
</details>
```
### Question 39

What is the result of filtering IDs `[1,2,3]` with `deleteId = 2`?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
A new array containing IDs 1 and 3.

**Tip:** ID 2 is excluded.

```{=html}
</details>
```
### Question 40

Does `filter()` directly remove an element from the original array?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
No. It creates a new array containing the elements that passed the
condition.

**Tip:** Think new array, not in-place deletion.

```{=html}
</details>
```
### Question 41

Why does the `filter()` deletion pattern preserve immutability?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
Because it leaves the existing array untouched and creates a new array
without the target item.

**Tip:** Deletion is represented by a newly computed array.

```{=html}
</details>
```
### Question 42

Explain `setOrders(prev => [...prev, newOrder])` in one sentence.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
React provides the previous orders to the updater, which returns a new
array containing all previous items followed by `newOrder`.

**Tip:** Previous State → new array → added item.

```{=html}
</details>
```
### Question 43

Explain the `filter()` deletion pattern in one sentence.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
It returns a new array containing every order whose ID is different from
`deleteId`.

**Tip:** Describe exclusion through a true/false condition.

```{=html}
</details>
```
### Question 44

Explain the full `map()` update pattern from `setOrders` to UI.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
React supplies the previous orders to the updater; `map()` checks each
order, replaces the matching ID with `updatedOrder`, preserves the
others, returns a new array, and React uses that array as the next State
before re-rendering the UI.

**Tip:** Setter → updater → previous State → map → new State → UI.

```{=html}
</details>
```
### Question 45

Correct this statement: "`map()` creates a new `order` object and puts
it into the `order` parameter."

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`map()` receives each existing array element as the `order` parameter.
It creates a new result array from callback return values.

**Tip:** The parameter receives an element; it is not automatically
created.

```{=html}
</details>
```
### Question 46

Correct this statement: "`setOrders` collects each `map()` return value
into a new array."

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`map()` collects its callback return values into a new array. The
updater returns that array, and React uses it as the next State.

**Tip:** Keep the responsibilities separate.

```{=html}
</details>
```
### Question 47

Correct this statement: "Returning `null` from `map()` removes the
element."

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
Returning `null` places `null` in the result array. Use `filter()` when
the goal is to exclude elements.

**Tip:** `null` is a value, not deletion.

```{=html}
</details>
```
### Question 48

Correct this statement: "Spread is an array add method."

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
Spread is syntax that expands iterable elements. In
`[...prevOrders, newOrder]`, the new item is added because `newOrder` is
separately included.

**Tip:** Spread = expand.

```{=html}
</details>
```
### Question 49

Fill in the blank: `setOrders(prevOrders => [______, newOrder])`.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`...prevOrders`.

**Tip:** Expand the existing elements first.

```{=html}
</details>
```
### Question 50

Fill in the condition:
`order.id ______ updatedOrder.id ? updatedOrder : order`.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`===`.

**Tip:** Match the target ID.

```{=html}
</details>
```
### Question 51

Fill in the final branch: `condition ? updatedOrder : ______`.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`order`.

**Tip:** Keep non-target items unchanged.

```{=html}
</details>
```
### Question 52

Fill in the deletion operator: `order.id ______ deleteId`.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`!==`.

**Tip:** Keep IDs that are different from the delete target.

```{=html}
</details>
```
### Question 53

Complete: Create → ?, Update → ?, Delete → ?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
Create → spread, Update → `map()`, Delete → `filter()`.

**Tip:** Also understand why each creates a new array.

```{=html}
</details>
```
### Question 54

True or False: `prevOrders` is a reserved React keyword.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
False.

**Tip:** It is only a parameter name.

```{=html}
</details>
```
### Question 55

True or False: `map()` directly mutates the original array and returns
it.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
False.

**Tip:** `map()` creates a new array.

```{=html}
</details>
```
### Question 56

True or False: `filter()` keeps elements for which the condition is
true.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
True.

**Tip:** true means the element stays.

```{=html}
</details>
```
### Question 57

True or False: `return null` is equivalent to returning no value.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
False.

**Tip:** `null` is an actual returned value.

```{=html}
</details>
```
### Question 58

True or False: `[...prevOrders, newOrder]` directly mutates
`prevOrders`.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
False.

**Tip:** It creates a new array.

```{=html}
</details>
```
### Question 59

True or False: If `map()` returns existing `order` objects, the result
array must be the same array as `prevOrders`.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
False.

**Tip:** The result array is new even when some element references are
reused.

```{=html}
</details>
```
### Question 60

True or False: `order.id === updatedOrder.id` checks whether the current
order is the update target.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
True.

**Tip:** The ID comparison identifies the target.

```{=html}
</details>
```
### Question 61

If orders 10 and 30 both have status `PAID`, why can ID 30 still be
updated safely by comparing IDs?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
Because the ID comparison identifies order 30 specifically, regardless
of another order having the same status.

**Tip:** Duplicated status values do not affect unique identification.

```{=html}
</details>
```
### Question 62

Why can updating by `status === "PAID"` be dangerous?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
Because multiple orders may have the same status, so more than one item
may match.

**Tip:** Do not confuse a state value with an identity value.

```{=html}
</details>
```
### Question 63

For `[Order1, Order2, Order3]`, if only Order2 is updated, what should
`map()` return for each item?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
Order1 → existing Order1; Order2 → `updatedOrder`; Order3 → existing
Order3.

**Tip:** Keep / replace / keep.

```{=html}
</details>
```
### Question 64

For `[Order1, Order2, Order3]`, if Order2 is deleted, what should the
`filter()` condition produce?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
Order1 → true; Order2 → false; Order3 → true.

**Tip:** Only the delete target should fail the condition.

```{=html}
</details>
```
### Question 65

State the main difference between `map()` and `filter()`.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`map()` decides what value each element becomes in a new array;
`filter()` decides whether each element remains in the new array.

**Tip:** map = what value; filter = keep or exclude.

```{=html}
</details>
```
### Question 66

What do the Create, Update, and Delete patterns have in common?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
They avoid directly mutating the existing State array and instead create
a new array for the next State.

**Tip:** Different syntax, same immutability principle.

```{=html}
</details>
```
### Question 67

Complete the flow: existing State → do not mutate directly →
\_\_\_\_\_\_ → setter/updater → \_\_\_\_\_\_ → re-render → UI.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
Create a new array/object → State update.

**Tip:** This is the Day 22 data-flow model.

```{=html}
</details>
```
### Question 68

In the update code, what actually creates the new array?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
`map()`.

**Tip:** Do not attribute `map()`'s job to `setOrders`.

```{=html}
</details>
```
### Question 69

In the update code, what returns the calculated next State to React?

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
The updater function returns the `map()` result.

**Tip:** The map result becomes the updater's return value.

```{=html}
</details>
```
### Question 70

Give a short final explanation of the target Day 22 code.

```{=html}
<details>
```
```{=html}
<summary>
```
Answer & Explanation
```{=html}
</summary>
```
React passes the previous `Order[]` to the updater as `prevOrders`.
`map()` checks every `order`; the matching ID returns `updatedOrder`,
while other IDs return the existing `order`. `map()` builds a new array,
the updater returns it as the next State, and React re-renders the UI
using that State.

**Tip:** Explain the data flow, not just the syntax.

```{=html}
</details>
```
