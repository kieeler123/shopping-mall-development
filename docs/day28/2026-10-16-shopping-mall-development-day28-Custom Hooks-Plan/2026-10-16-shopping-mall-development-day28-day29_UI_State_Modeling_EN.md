# Day 29 — UI State Modeling

> **Core question:** What UI states exist beyond simply having data?

- **Stack:** Next.js · React · TypeScript
- **Duration:** 90 minutes
- **Method:** Learn each step → one multiple-choice question → explanation → next step. Finish with a 15-question test focused on written responses and coding.

## 1. Learning objectives

- Explain the differences between Loading, Error, Empty, and Success.
- Determine UI states using `isLoading`, `error`, and `orders`.
- Write conditional rendering with `&&`, `!`, and ternary expressions.
- Prioritize UI states and understand overlapping conditions.
- Trace UI changes following successful and failed API requests.
- Analyze rendering conditions in the real `AdminOrdersPage`.
- Demonstrate understanding through written explanations and TypeScript code.

> **Tip:** Explain the condition for each state in your own words instead of memorizing only its name.

## 2. Core UI state model

```text
Request starts
  ↓
Loading
  ├─ Failure → Error
  └─ Success
      ├─ No data → Empty
      └─ Data exists → Success
```

| State | Condition | UI |
|---|---|---|
| Loading | Request in progress | Loading orders... |
| Error | Request failed | Error message |
| Empty | Request succeeded, zero orders | No orders found. |
| Success | Request succeeded, one or more orders | Order cards |

> **Tip:** This model applies to **fetching the list**. Other UI states may arise while updating an order (PATCH) or retrying.

## 3. 90-minute schedule

| Step | Time | Topic | Check |
|---|---:|---|---|
| 1. Review Day 28 | 10 min | State, Props, React re-rendering | 1 multiple-choice question |
| 2. Four UI states | 15 min | Loading / Error / Empty / Success | 1 multiple-choice question |
| 3. Conditional rendering | 15 min | `&&`, `!`, ternary operator | 1 multiple-choice question |
| 4. State priority | 15 min | Conflicting conditions, `if`, early return | 1 multiple-choice question |
| 5. Project practice | 15 min | Analyze `AdminOrdersPage` conditions | 1 multiple-choice question |
| 6. Comprehensive coding test | 20 min | 15 mostly written/coding questions and review | Includes 1 multiple-choice question |
| **Total** | **90 min** | | |

## 4. Step-by-step learning plan

### Step 1 — Review Day 28 (10 min)

- Review how `useOrders()` provides state and functions.
- Understand React re-rendering and Props propagation after `setOrders()`.
- **Multiple-choice:** Why does the UI update when `setOrders()` changes the order array?

> **Tip:** Describe the Hook → Page → OrderCard path aloud.

### Step 2 — Loading, Error, Empty, Success (15 min)

- Distinguish pending requests, failures, successful empty arrays, and successful responses with data.
- Think of a helpful message for each state.
- **Multiple-choice:** What UI state applies when the API request succeeds but `orders.length === 0`?

> **Tip:** An empty array is not an error. The request succeeded but has nothing to display.

### Step 3 — Conditional rendering (15 min)

```tsx
{isLoading && <p>Loading orders...</p>}
{error && <p>Error: {error}</p>}
{!isLoading && !error && orders.length === 0 && (
  <p>No orders found.</p>
)}
```

- Understand `&&`, logical NOT `!`, and strict equality `===`.
- Compare a ternary expression where useful.
- **Multiple-choice:** What does `!isLoading && !error` mean?

> **Tip:** Substitute `true` or `false` for each condition and evaluate the expression.

### Step 4 — UI state priority (15 min)

- Understand how Loading and Error can appear together if both conditions are true.
- Express explicit priorities with `if` and early returns.
- Conceptually compare modeling UI state as a single value, without introducing a library.
- **Multiple-choice:** How should the UI handle simultaneous Loading and Error conditions?

> **Tip:** Decide which state users should see first, then write the condition.

### Step 5 — Real project practice (15 min)

Analyze the existing `AdminOrdersPage` conditions.

```tsx
{!isLoading && !error && orders.length > 0 && (
  <div className="space-y-6">
    {orders.map((order) => (
      <OrderCard
        key={order.id}
        order={order}
        onStatusChange={updateOrderStatus}
      />
    ))}
  </div>
)}
```

- Check rendering after successful or failed list fetching.
- Analyze why a PATCH failure sets `error`, makes `!error` false, and hides the order list.
- Avoid unnecessary changes when existing functionality works.
- **Multiple-choice:** Why can the order cards disappear after a PATCH error?

> **Tip:** Distinguish deleted data from data merely hidden by conditional rendering.

### Step 6 — Comprehensive coding test (20 min)

**15 questions:**

| Type | Questions |
|---|---:|
| Written conceptual explanations | 5 |
| Write code from scratch | 6 |
| Debugging | 3 |
| Final multiple-choice check | 1 |
| **Total** | **15** |

Topics:
- Explain the four UI states in your own words.
- Write conditions for Loading / Error / Empty / Success.
- Render based on `orders.length`.
- Build UI with `if` and early returns.
- Correct faulty conditions.
- Describe how to improve PATCH error handling on the existing order page.

If delivered as a separate HTML workbook, it will include answer input, collapsible solutions, answer comparison, and browser autosave.

> **Tip:** Even after selecting a multiple-choice answer, explain why in one or two sentences. For written answers, jot down keywords before forming sentences.

## 5. Completion criteria

- [ ] I can explain Loading, Error, Empty, and Success.
- [ ] I can write rendering conditions for each state.
- [ ] I understand conditional rendering with `&&` and `!`.
- [ ] I can explain UI state priorities.
- [ ] I can analyze the real order page's rendering conditions.
- [ ] I completed all 15 comprehensive test questions.
- [ ] I verified that existing order-management functionality still works.

## 6. Step 1 starter question

Consider this code:

```tsx
const { orders, isLoading, error } = useOrders();
```

**Question 1.** Why does React update the UI when `setOrders()` changes the order array inside `useOrders()`?

- A. `fetch()` automatically edits the HTML.
- B. React re-renders components when State changes and passes updated Props.
- C. `OrderCard` fetches the data again directly from the server.
- D. `useEffect()` automatically calls the API on every State change.

**Answer:** B

**Explanation:** When React processes a state update, the relevant component re-renders and passes new Props derived from the updated `orders` to `OrderCard`.

> **Tip:** Hide the answer until you have attempted the question.

---

## Suggested follow-up questions

- [1] Let's work through Day 29 Step 1 and continue in order.
- [2] Explain the four UI states in detail with examples.
- [3] Create the Day 29 comprehensive coding test as an HTML workbook.

Enter 1, 2, or 3, or continue the conversation!

---

Made by 👉 [챗과장](https://gpts.kr/chat)
