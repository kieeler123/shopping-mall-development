# Day 33 コーディングクイズ

## Multiple choice (10)

### Q1. fetchがHTTP 404を受け取ったときの通常の動作は？

- A. 自動的にcatchへ進む
- B. Responseが返りokはfalse
- C. 自動で再試行する
- D. JSON解析が必ず失敗する

<details>
<summary>Q1 정답 및 해설</summary>

B — HTTPエラーだけではネットワーク例外にならない。

</details>

### Q2. id=abcの適切なステータスは？

- A. 200
- B. 400
- C. 404
- D. 500

<details>
<summary>Q2 정답 및 해설</summary>

B — ID形式が不正。

</details>

### Q3. id=999の適切なステータスは？

- A. 200
- B. 400
- C. 404
- D. 500

<details>
<summary>Q3 정답 및 해설</summary>

C — 形式は正しいが注文がない。

</details>

### Q4. 存在するid=1の取得結果は？

- A. 200
- B. 400
- C. 404
- D. 500

<details>
<summary>Q4 정답 및 해설</summary>

A — 正常取得は200。

</details>

### Q5. 予期しないサーバー内部例外は？

- A. 200
- B. 400
- C. 404
- D. 500

<details>
<summary>Q5 정답 및 해설</summary>

D — 内部エラーは500。

</details>

### Q6. HTTP成功判定のプロパティは？

- A. response.ok
- B. response.url
- C. request.mode
- D. window.status

<details>
<summary>Q6 정답 및 해설</summary>

A — 2xxでtrueになる。

</details>

### Q7. 接続失敗を扱う構文は？

- A. map
- B. try/catch
- C. filter
- D. sort

<details>
<summary>Q7 정답 및 해설</summary>

B — 例外をcatchできる。

</details>

### Q8. エラー通知に使える属性は？

- A. role="alert"
- B. role="img"
- C. hidden
- D. tabIndex="-1"

<details>
<summary>Q8 정답 및 해설</summary>

A — alertロールで通知できる。

</details>

### Q9. 成功・失敗後にloadingを終了する構文は？

- A. switch
- B. finally
- C. break
- D. continue

<details>
<summary>Q9 정답 및 해설</summary>

B — finallyは両方で実行される。

</details>

### Q10. HTTPステータスを確認するDevToolsタブは？

- A. Elements
- B. Network
- C. Sources
- D. Application

<details>
<summary>Q10 정답 및 해설</summary>

B — NetworkのStatus欄。

</details>

## Written and coding (5)

### W1. 400と404を注文IDで比較してください。

Answer:

<details>
<summary>W1 정답 및 해설</summary>

400はabcや0、404は形式が正しいが存在しない999。

</details>

### W2. response.okとtry/catchの役割は？

Answer:

<details>
<summary>W2 정답 및 해설</summary>

okはHTTP成功判定、try/catchは例外処理。

</details>

### W3. 注文検索UIの状態遷移を説明してください。

Answer:

<details>
<summary>W3 정답 및 해설</summary>

開始時loading=true、成功時注文表示、失敗時エラー表示、finallyでfalse。

</details>

### W4. 1、abc、999、0のステータスを答えてください。

Answer:

<details>
<summary>W4 정답 및 해설</summary>

1→200、abc→400、999→404、0→400。

</details>

### W5. response.okを確認するfetchコードを書いてください。

Answer:

<details>
<summary>W5 정답 및 해설</summary>

const response = await fetch(url); if (!response.ok) throw new Error(`HTTP ${response.status}`);

</details>

