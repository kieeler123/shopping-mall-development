# Day 26 — Review Questions and Answers

## 9. Review questions

Solve the questions first, then expand the answer sections below.

1.  Which direction do Props flow?

2.  How do `order` and `onStatusChange` differ?

3.  Why is `onClick={onStatusChange(order.id)}` incorrect?

4.  Write a `setOrders` update that cancels only order 101.

5.  Write the JSX attribute that disables a canceled order's button.

6.  What replaces `???` in `onStatusChange={???}` on the admin page?

7.  How do `key={order.id}` and `order={order}` differ?

8.  What must you consider when using `useState` in Next.js App Router?

## 10. Answers and explanations

<details><summary>

Show answer to question 1</summary>

Parent → child. A child requests changes through a callback.

</details>

<details><summary>

Show answer to question 2</summary>

`order` is a data Prop; `onStatusChange` is a function Prop.

</details>

<details><summary>

Show answer to question 3</summary>

It calls the function during render. Use
`onClick={() => onStatusChange(order.id)}`.

</details>

<details><summary>

Show answer to question 4</summary>

`setOrders(prev => prev.map(order => order.id === 101 ? {...order, status: 'CANCELLED'} : order));`

</details>

<details><summary>

Show answer to question 5</summary>

`disabled={order.status === 'CANCELLED'}`

</details>

<details><summary>

Show answer to question 6</summary>

`updateOrderStatus` --- pass the function reference, not its result.

</details>

<details><summary>

Show answer to question 7</summary>

`key` is a special React list identity hint; `order` is a normal Prop
received by the child.

</details>

<details><summary>

Show answer to question 8</summary>

Use an appropriate `'use client'` boundary.

</details>

---

**Key takeaway:** Props flow down, callbacks carry requests up, and the
State owner performs the update.
