# Day 33 코딩 퀴즈

## Multiple choice (10)

### Q1. HTTP 404 응답을 받은 fetch의 일반적인 동작은?

- A. 자동으로 catch로 이동한다
- B. Response가 반환되고 ok는 false다
- C. 자동으로 재시도한다
- D. 반드시 JSON 파싱이 실패한다

<details>
<summary>Q1 정답 및 해설</summary>

B — HTTP 오류 응답 자체는 fetch의 네트워크 예외가 아니다.

</details>

### Q2. id=abc 요청에 적절한 상태 코드는?

- A. 200
- B. 400
- C. 404
- D. 500

<details>
<summary>Q2 정답 및 해설</summary>

B — 숫자가 아닌 ID는 잘못된 요청이다.

</details>

### Q3. id=999 요청에 적절한 상태 코드는?

- A. 200
- B. 400
- C. 404
- D. 500

<details>
<summary>Q3 정답 및 해설</summary>

C — ID 형식은 유효하지만 주문이 존재하지 않는다.

</details>

### Q4. 존재하는 id=1 주문을 조회했을 때는?

- A. 200
- B. 400
- C. 404
- D. 500

<details>
<summary>Q4 정답 및 해설</summary>

A — 정상 조회이므로 200이다.

</details>

### Q5. 예기치 못한 서버 내부 예외에 적절한 상태 코드는?

- A. 200
- B. 400
- C. 404
- D. 500

<details>
<summary>Q5 정답 및 해설</summary>

D — 내부 서버 오류는 500으로 나타낸다.

</details>

### Q6. HTTP 성공 여부를 확인하는 속성은?

- A. response.ok
- B. response.url
- C. request.mode
- D. window.status

<details>
<summary>Q6 정답 및 해설</summary>

A — response.ok는 2xx 응답에서 true다.

</details>

### Q7. 네트워크 연결 실패를 잡는 문법은?

- A. map
- B. try/catch
- C. filter
- D. sort

<details>
<summary>Q7 정답 및 해설</summary>

B — 네트워크 실패로 발생한 예외는 catch로 처리할 수 있다.

</details>

### Q8. 오류 메시지에 사용할 수 있는 접근성 역할은?

- A. role="alert"
- B. role="img"
- C. hidden
- D. tabIndex="-1"

<details>
<summary>Q8 정답 및 해설</summary>

A — role=alert는 오류 메시지를 알리는 데 유용하다.

</details>

### Q9. 로딩 상태를 성공·실패 후 모두 종료하는 데 적합한 구문은?

- A. switch
- B. finally
- C. break
- D. continue

<details>
<summary>Q9 정답 및 해설</summary>

B — finally는 성공과 실패 양쪽에서 실행된다.

</details>

### Q10. Chrome DevTools에서 HTTP 상태 코드를 확인하는 탭은?

- A. Elements
- B. Network
- C. Sources
- D. Application

<details>
<summary>Q10 정답 및 해설</summary>

B — Network 요청 목록의 Status 열에서 확인한다.

</details>

## Written and coding (5)

### W1. 400과 404를 주문 ID 예시로 비교하세요.

Answer:

<details>
<summary>W1 정답 및 해설</summary>

400: id=abc 또는 id=0처럼 요청이 잘못됨. 404: id=999처럼 유효한 형식이지만 주문이 없음.

</details>

### W2. response.ok와 try/catch의 역할을 비교하세요.

Answer:

<details>
<summary>W2 정답 및 해설</summary>

response.ok는 HTTP 상태의 성공 여부를 확인한다. try/catch는 네트워크 실패나 명시적으로 throw한 오류를 처리한다.

</details>

### W3. 주문 검색 UI의 로딩·성공·실패 흐름을 설명하세요.

Answer:

<details>
<summary>W3 정답 및 해설</summary>

시작 시 loading=true, 오류 초기화. 성공 시 주문 표시, 실패 시 오류 표시, finally에서 loading=false.

</details>

### W4. id=1, abc, 999, 0의 상태 코드를 적으세요.

Answer:

<details>
<summary>W4 정답 및 해설</summary>

1→200, abc→400, 999→404, 0→400.

</details>

### W5. response.ok를 확인하는 fetch 코드를 작성하세요.

Answer:

<details>
<summary>W5 정답 및 해설</summary>

const response = await fetch(url); if (!response.ok) throw new Error(`HTTP ${response.status}`);

</details>

