# Days 21–25 Questions, Answers & Explanations (English)

> 10 questions · 10 points each (100 points)

## Question
### 1. What does `useState<Order[]>([])` mean?

### 2. Why await both `fetch()` and `response.json()`?

### 3. Does an HTTP 500 response automatically reject `fetch`?

### 4. What happens when `userId` changes in `useEffect(..., [userId])`?

### 5. What is AbortController mainly used for here?

### 6. Why use `onClick={() => handleCancel(order.id)}`?

### 7. Why increment `refreshKey`?

### 8. What is a stale closure?

### 9. Why use `setCount(prev => prev + 1)`?

### 10. When does Effect cleanup run?

## Answer Key & Explanations

### 1. Answer
It initializes State as an empty array of Order objects.

### 2. Answer
Receiving the HTTP Response and reading/parsing the body are separate asynchronous operations.

### 3. Answer
No. Check `response.ok` or `status`.

### 4. Answer
The previous Effect is cleaned up and the Effect runs again with the new value.

### 5. Answer
Canceling obsolete requests and reducing the risk of stale results overwriting State.

### 6. Answer
It defers execution until the click and passes the order ID.

### 7. Answer
To trigger the dependent Effect to refetch the order list.

### 8. Answer
A function created in an earlier render reads an outdated value when a newer value is intended.

### 9. Answer
It safely computes a new State value from the previous one.

### 10. Answer
Before a changed Effect is set up and on unmount, plus possible development Strict Mode checks.

**Study tip:** Hide the answers first, explain your reasoning, then check the key.
