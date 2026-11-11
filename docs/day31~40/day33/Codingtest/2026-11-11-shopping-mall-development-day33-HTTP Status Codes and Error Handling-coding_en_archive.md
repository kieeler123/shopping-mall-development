# Day 33 Coding Quiz

## Multiple choice (10)

### Q1. What normally happens when fetch receives HTTP 404?

- A. It automatically enters catch
- B. It resolves with Response and ok=false
- C. It automatically retries
- D. JSON parsing always fails

<details>
<summary>Q1 정답 및 해설</summary>

B — HTTP error status alone is not a network rejection.

</details>

### Q2. What status fits id=abc?

- A. 200
- B. 400
- C. 404
- D. 500

<details>
<summary>Q2 정답 및 해설</summary>

B — The ID format is invalid.

</details>

### Q3. What status fits id=999?

- A. 200
- B. 400
- C. 404
- D. 500

<details>
<summary>Q3 정답 및 해설</summary>

C — The format is valid but the order is missing.

</details>

### Q4. What status fits an existing id=1?

- A. 200
- B. 400
- C. 404
- D. 500

<details>
<summary>Q4 정답 및 해설</summary>

A — A successful lookup returns 200.

</details>

### Q5. What status fits an unexpected server exception?

- A. 200
- B. 400
- C. 404
- D. 500

<details>
<summary>Q5 정답 및 해설</summary>

D — An internal failure returns 500.

</details>

### Q6. Which property checks HTTP success?

- A. response.ok
- B. response.url
- C. request.mode
- D. window.status

<details>
<summary>Q6 정답 및 해설</summary>

A — ok is true for 2xx.

</details>

### Q7. Which syntax handles connection exceptions?

- A. map
- B. try/catch
- C. filter
- D. sort

<details>
<summary>Q7 정답 및 해설</summary>

B — Catch network exceptions.

</details>

### Q8. Which accessibility attribute can announce an error?

- A. role="alert"
- B. role="img"
- C. hidden
- D. tabIndex="-1"

<details>
<summary>Q8 정답 및 해설</summary>

A — An alert role announces error content.

</details>

### Q9. Which construct resets loading after success or failure?

- A. switch
- B. finally
- C. break
- D. continue

<details>
<summary>Q9 정답 및 해설</summary>

B — finally runs in either case.

</details>

### Q10. Where do you inspect HTTP status in DevTools?

- A. Elements
- B. Network
- C. Sources
- D. Application

<details>
<summary>Q10 정답 및 해설</summary>

B — See the Status column in Network.

</details>

## Written and coding (5)

### W1. Compare 400 and 404 using order IDs.

Answer:

<details>
<summary>W1 정답 및 해설</summary>

400: abc or 0 is invalid input; 404: 999 is valid in form but missing.

</details>

### W2. Compare response.ok and try/catch.

Answer:

<details>
<summary>W2 정답 및 해설</summary>

ok checks HTTP success; try/catch handles exceptions.

</details>

### W3. Describe loading, success, and failure states in order search.

Answer:

<details>
<summary>W3 정답 및 해설</summary>

Start with loading=true, show the order on success, show error on failure, reset loading in finally.

</details>

### W4. Give statuses for 1, abc, 999, and 0.

Answer:

<details>
<summary>W4 정답 및 해설</summary>

1→200, abc→400, 999→404, 0→400.

</details>

### W5. Write fetch code checking response.ok.

Answer:

<details>
<summary>W5 정답 및 해설</summary>

const response = await fetch(url); if (!response.ok) throw new Error(`HTTP ${response.status}`);

</details>

