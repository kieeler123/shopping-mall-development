# Day 33 — Questions & Answers

> HTTP Status Codes / Error Handling

## 1. What distinguishes 200 from 400?

<details>
<summary>정답 및 해설 / Answer</summary>

200 indicates success; 400 indicates an invalid request such as id=abc or id=0.

</details>

## 2. How do 400 and 404 differ?

<details>
<summary>정답 및 해설 / Answer</summary>

400 means invalid input; 404 means the ID is valid but no matching order exists.

</details>

## 3. Does fetch automatically reject on HTTP 404?

<details>
<summary>정답 및 해설 / Answer</summary>

No. It normally resolves to a Response with response.ok=false; throw explicitly if appropriate.

</details>

## 4. When is response.ok true?

<details>
<summary>정답 및 해설 / Answer</summary>

For HTTP status codes from 200 through 299.

</details>

## 5. What does try/catch handle?

<details>
<summary>정답 및 해설 / Answer</summary>

Network failures and exceptions thrown by the code. HTTP 400/404 require a separate response.ok check.

</details>

## 6. Why use finally?

<details>
<summary>정답 및 해설 / Answer</summary>

To stop the loading state after either success or failure.

</details>

## 7. Which HTTP outcomes were observed?

<details>
<summary>정답 및 해설 / Answer</summary>

id=0 → 400, id=1 → 200, id=abc → 400, id=999 → 404.

</details>

## 8. Was an unexpected 500 server exception verified?

<details>
<summary>정답 및 해설 / Answer</summary>

No. The meaning of 500 was studied, but an actual unexpected internal exception was not established.

</details>

