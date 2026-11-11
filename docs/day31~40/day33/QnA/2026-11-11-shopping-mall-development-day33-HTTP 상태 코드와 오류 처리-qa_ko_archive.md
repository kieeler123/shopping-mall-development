# Day 33 — 문제답변

> HTTP Status Codes / Error Handling

## 1. 200과 400은 어떤 차이가 있나요?

<details>
<summary>정답 및 해설 / Answer</summary>

200은 요청이 성공한 상태이고, 400은 id=abc 또는 id=0처럼 요청값이 올바르지 않은 상태입니다.

</details>

## 2. 400과 404는 어떻게 구분하나요?

<details>
<summary>정답 및 해설 / Answer</summary>

400은 입력 형식이 잘못된 경우, 404는 유효한 ID지만 해당 주문이 없는 경우입니다.

</details>

## 3. fetch가 404 응답을 받으면 자동으로 catch에 들어가나요?

<details>
<summary>정답 및 해설 / Answer</summary>

아닙니다. 일반적으로 Response를 반환하며 response.ok가 false입니다. 필요하면 직접 throw해야 합니다.

</details>

## 4. response.ok는 언제 true인가요?

<details>
<summary>정답 및 해설 / Answer</summary>

HTTP 상태 코드가 200~299인 경우 true입니다.

</details>

## 5. try/catch는 어떤 오류를 처리하나요?

<details>
<summary>정답 및 해설 / Answer</summary>

네트워크 실패나 코드에서 throw한 예외를 처리합니다. HTTP 400/404는 별도로 response.ok를 확인합니다.

</details>

## 6. finally는 왜 필요한가요?

<details>
<summary>정답 및 해설 / Answer</summary>

요청 성공·실패 여부와 무관하게 loading 상태를 종료하기 위해 사용합니다.

</details>

## 7. 실제로 확인한 HTTP 결과는 무엇인가요?

<details>
<summary>정답 및 해설 / Answer</summary>

id=0은 400, id=1은 200, id=abc는 400, id=999는 404였습니다.

</details>

## 8. 500 오류는 확인됐나요?

<details>
<summary>정답 및 해설 / Answer</summary>

500은 서버 내부 오류를 뜻하지만, 이번 실습에서 실제 예기치 못한 내부 예외가 발생했다는 증거는 없습니다.

</details>

