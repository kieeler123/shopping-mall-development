# Day 30 Learning Plan --- Practical React + TypeScript Debugging

> **Goal:** Build on Day 29's UI state modeling and learn to detect,
> classify, fix, and verify errors with TypeScript, ESLint, and tests.
>
> **Duration:** 100 minutes, excluding breaks\
> **Prerequisites:** Day 29 --- Loading / Error / Empty / Success, `&&`,
> early returns, separating GET and PATCH errors

## 1. Learning Outcomes

By the end of the session, you should be able to:

-   Distinguish syntax, type, lint, and logic errors.
-   Read error locations and messages in VS Code's Problems panel.
-   Run and interpret `npx tsc --noEmit` and `npx eslint .`.
-   Fix destructuring, prop names, JSX syntax, and conditional rendering
    in React/TSX.
-   Test UI behavior that static checks cannot reliably validate.
-   Keep a concise debugging log.

**Tip:** Before editing code, write down the error category, suspected
cause, and tool you will use.

## 2. 100-Minute Schedule

  ------------------------------------------------------------------------
  Session                           Time Focus            Deliverable
  ---------------- --------------------- ---------------- ----------------
  1\. Classify                    15 min Syntax / Type /  Error
  errors                                 Lint / Logic     classification
                                                          notes

  2\. Tool                        20 min VS Code          Check results
  practice                               Problems,        
                                         TypeScript,      
                                         ESLint           

  3\. React                       20 min `useOrders`,     Corrected
  debugging                              props, JSX       component

  4\. Logic                       25 min Four UI states;  State
  verification                           GET/PATCH errors verification
                                                          table

  5\. Assessment                  20 min Debugging        Score and
                                         challenge and    debugging log
                                         review           

  **Total**                  **100 min**                  
  ------------------------------------------------------------------------

**Tip:** Add a 5--10 minute break between sessions if needed.

## 3. Setup and Commands

Open your existing Next.js + TypeScript project in VS Code. Confirm that
the project has the required dependencies and ESLint configuration.

``` bash
npx tsc --noEmit
npx eslint .
```

TypeScript checks types and syntax; ESLint checks configured lint rules.
Prettier primarily formats code and does not validate business logic.
Commands may need adjustment for your project.

**Tip:** Record each issue as `file → line → message → fix`.

## 4. Reference Component

``` tsx
function AdminOrdersPage() {
  const { orders, isLoading, error } = useOrders();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (orders.length === 0) return <p>Empty</p>;

  return <OrderList orders={orders} />;
}
```

Use this component for deliberate bug injection. Assume `useOrders()`
returns an object and `OrderList` accepts an `orders` prop.

## 5. Practice Levels

### Level 1 --- Typos and Destructuring

``` tsx
const [orders, isLoading, error] = useOrders();
return <p>{err}</p>;
```

Fix object destructuring and the undefined `err` variable.

**Tip:** `useState` returns an array, but a custom hook's return type
must be checked.

### Level 2 --- JSX and Props

``` tsx
return <OrderList order={orders}>
```

Use the correct prop name and close the JSX tag properly.

**Tip:** TSX parsing catches many unclosed-tag errors.

### Level 3 --- Success Logic

``` tsx
{!isLoading && error && orders.length > 0 && (
  <OrderList orders={orders} />
)}
```

Explain why the condition must use `!error`.

**Tip:** Valid syntax and types do not guarantee correct behavior.

### Level 4 --- Separate GET/PATCH Errors

Separate `fetchError` from `updateError`. A failed update should show an
alert without hiding previously loaded orders.

``` tsx
if (fetchError) return <p>Fetch error: {fetchError}</p>;

return (
  <main>
    {updateError && <p role="alert">Update error: {updateError}</p>}
    {orders.length === 0
      ? <p>Empty</p>
      : <OrderList orders={orders} />}
  </main>
);
```

This is a partial example that assumes loading has already been handled.

**Tip:** Distinguish errors that block the whole page from errors that
affect only one action.

### Level 5 --- Verify Behavior

Check Loading, Error, Empty, and Success, plus whether orders remain
visible after a PATCH failure.

**Tip:** Record what static analysis detects versus what behavioral
tests detect.

## 6. Assessment (100 Points)

  Category                             Points
  --------------------------------- ---------
  Error classification                     15
  TypeScript error interpretation          20
  ESLint error interpretation              15
  React component debugging                30
  Logic fixes and verification             20
  **Total**                           **100**

**Suggested passing score:** 80 points.

**Tip:** Write long code answers in VS Code and paste them into chat to
avoid previously observed cursor-jumping and disappearing-text issues.

## 7. Debugging Log Template

``` md
### Debugging Entry
- Symptom:
- Error category:
- Tool message:
- Root cause:
- Fix:
- Verification result:
- Prevention:
```

## 8. Next Steps

-   **Suggested Day 31:** Introduction to React component testing
-   **Suggested Day 32:** Testing UI states with Vitest and React
    Testing Library

**Tip:** Focus Day 30 on diagnosing and fixing existing code rather than
adding new features.
