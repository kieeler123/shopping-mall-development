# Day 33 — 問題・解答

> HTTP Status Codes / Error Handling

## 1. 200と400の違いは？

<details>
<summary>정답 및 해설 / Answer</summary>

200は成功、400はid=abcやid=0など無効なリクエストです。

</details>

## 2. 400と404の違いは？

<details>
<summary>정답 및 해설 / Answer</summary>

400は入力値が不正、404は有効なIDでも該当する注文が存在しない状態です。

</details>

## 3. fetchで404を受けると自動的にcatchへ移りますか？

<details>
<summary>정답 및 해설 / Answer</summary>

通常は移りません。Responseが返り、response.okはfalseになります。必要ならthrowします。

</details>

## 4. response.okがtrueになる条件は？

<details>
<summary>정답 및 해설 / Answer</summary>

HTTPステータスが200～299のときです。

</details>

## 5. try/catchは何を処理しますか？

<details>
<summary>정답 및 해설 / Answer</summary>

ネットワークエラーや明示的にthrowした例外を処理します。

</details>

## 6. finallyの役割は？

<details>
<summary>정답 및 해설 / Answer</summary>

成功・失敗に関係なくloadingを終了するためです。

</details>

## 7. 確認済みのHTTP結果は？

<details>
<summary>정답 및 해설 / Answer</summary>

id=0→400、id=1→200、id=abc→400、id=999→404です。

</details>

## 8. 500は実際の内部例外として確認されましたか？

<details>
<summary>정답 및 해설 / Answer</summary>

いいえ。500の意味は学習しましたが、予期しないサーバー内部例外の実証とは区別します。

</details>

