# Day 19 React Events & Forms --- 問題 + 解答

> 範囲: Vanilla JavaScript → React → TypeScript → Next.js + TypeScript\
> 使い方: 先に自分で答えてから、各問題の `<details>`
> を開いて解答を確認してください。

## Part 1. 核心概念

### 1. Event オブジェクトを作成して handler に渡すのは誰か？

<details><summary>解答を見る</summary>

ブラウザ。Event 発生時に Event オブジェクトを作成し、登録された handler
に渡す。

</details>

### 2. `event`、`event.target`、`event.target.value`を説明せよ。

<details><summary>解答を見る</summary>

`event`は Event 情報、`event.target`は Event
が発生した要素、`event.target.value`はその要素の現在値。

</details>

### 3. `event.target.value`は React 専用の文法か？

<details><summary>解答を見る</summary>

いいえ。Web/DOM Event の基本概念であり、React でも利用する。

</details>

### 4. `preventDefault()`の役割は？

<details><summary>解答を見る</summary>

その Event に対してブラウザが行うデフォルト動作を止める。

</details>

### 5. `preventDefault()`は Event 自体を削除するか？

<details><summary>解答を見る</summary>

いいえ。Event は発生し、ブラウザのデフォルト動作だけを止める。

</details>

### 6. `onChange={handleChange}`は何を意味するか？

<details><summary>解答を見る</summary>

change Event 発生時に実行する関数 `handleChange` 自体を React に渡す。

</details>

### 7. `onChange={handleChange}`と`onChange={handleChange()}`の違いは？

<details><summary>解答を見る</summary>

前者は関数を渡す。後者はレンダリング中に関数を呼び出し、その戻り値を渡す形。

</details>

### 8. React の State 更新後、一般的に何が起こるか？

<details><summary>解答を見る</summary>

State 更新 → 再レンダリング → 新しい State を基準に UI
が再計算・反映される。

</details>

### 9. Controlled Component とは？

<details><summary>解答を見る</summary>

React State が input の値を制御し、`onChange`でユーザー変更を State
に戻す形。

</details>

### 10. `value={name}`の方向は？

<details><summary>解答を見る</summary>

`State → input`。

</details>

### 11. `onChange`の核心的な方向は？

<details><summary>解答を見る</summary>

`input → handler → State`。

</details>

### 12. 入力中 State と送信済み State を分ける理由は？

<details><summary>解答を見る</summary>

送信後に input
を編集しても、最後に送信した結果をそのまま保持できるようにするため。

</details>

### 13. 名前とメールを1回の登録で送る場合、Form は通常いくつが自然か？

<details><summary>解答を見る</summary>

1つ。1つの送信単位だから。

</details>

### 14. Form 送信で `onClick`より`onSubmit`を中心にする理由は？

<details><summary>解答を見る</summary>

特定ボタンのクリックではなく Form
全体の送信という意味・動作を扱えるから。

</details>

### 15. `<button type="submit">`の役割は？

<details><summary>解答を見る</summary>

そのボタンが Form を送信する submit ボタンであることを明示する。

</details>

## Part 2. 流れの追跡

### 16. 流れを完成せよ: 入力 → \_\_\_ Event → onChange → handler → value → \_\_\_ → State 更新 → \_\_\_ → UI。

<details><summary>解答を見る</summary>

`change`、`setter`、`再レンダリング`。

</details>

### 17. 初期値 `name=""`, `submittedName=""`。`철수`と入力し未送信。値は？

<details><summary>解答を見る</summary>

`name="철수"`、`submittedName=""`。

</details>

### 18. その状態で `setSubmittedName(name)` を実行して送信。値は？

<details><summary>解答を見る</summary>

`name="철수"`、`submittedName="철수"`。

</details>

### 19. その後 input を `영희` に変更し、まだ再送信していない。値は？

<details><summary>解答を見る</summary>

`name="영희"`、`submittedName="철수"`。

</details>

### 20. `submit → handler → preventDefault → UI → State → 再レンダリング`の順序を修正せよ。

<details><summary>解答を見る</summary>

`submit → handler → preventDefault → State 更新 → 再レンダリング → UI 反映`。

</details>

## Part 3. コード読解

### 21. ユーザーが `React` と入力したとき `setName(e.target.value)` が保存する値は？

<details><summary>解答を見る</summary>

文字列 `"React"`。

</details>

### 22. `<input value={name} onChange={handleChange} />`が Controlled Component である理由は？

<details><summary>解答を見る</summary>

State が表示値を制御し、`onChange`がユーザー変更を State に戻すから。

</details>

### 23. `<form onSubmit={handleSubmit}>`内の submit ボタンで実行される handler は？

<details><summary>解答を見る</summary>

`handleSubmit`。

</details>

### 24. Form submit handler から `preventDefault()`を削除すると何が起こり得るか？

<details><summary>解答を見る</summary>

ブラウザのデフォルト Form 送信動作が実行される可能性がある。

</details>

### 25. `useState("")`で設計された `submitName` は文字列か配列か？

<details><summary>解答を見る</summary>

文字列。

</details>

### 26. そこに `setSubmitName(prev => [newItem, ...prev])` が不自然な理由は？

<details><summary>解答を見る</summary>

文字列 State を突然配列として扱っているから。

</details>

### 27. 複数の商品を蓄積する自然な初期 State は？

<details><summary>解答を見る</summary>

`const [products, setProducts] = useState([]);`

</details>

## Part 4. TypeScript

### 28. `<input>`の`onChange` Event 型は？

<details><summary>解答を見る</summary>

`ChangeEvent<HTMLInputElement>`。

</details>

### 29. `<form>`の`onSubmit` Event 型は？

<details><summary>解答を見る</summary>

`FormEvent<HTMLFormElement>`。

</details>

### 30. `ChangeEvent<HTMLInputElement>`を分解して説明せよ。

<details><summary>解答を見る</summary>

`ChangeEvent`は React の change Event 型、`HTMLInputElement`は HTML
input 要素の型。

</details>

### 31. `FormEvent<HTMLFormElement>`を分解して説明せよ。

<details><summary>解答を見る</summary>

`FormEvent`は Form Event 型、`HTMLFormElement`は HTML form 要素の型。

</details>

### 32. `<input type="email">`の change handler 型は？

<details><summary>解答を見る</summary>

`ChangeEvent<HTMLInputElement>`。要素自体は input。

</details>

### 33. `<input type="number">`の change handler 型は？

<details><summary>解答を見る</summary>

`ChangeEvent<HTMLInputElement>`。要素自体は input。

</details>

### 34. `input type="number"`の `e.target.value` の基本型は？

<details><summary>解答を見る</summary>

`string`。

</details>

### 35. `useState("")`で`<string>`を省略できる理由は？

<details><summary>解答を見る</summary>

TypeScript が初期文字列から `string` と型推論できるから。

</details>

### 36. `useState`の import と `import type { ChangeEvent, FormEvent }`の違いは？

<details><summary>解答を見る</summary>

`useState`は実行時に使う React Hook。後者は TypeScript
の型情報として使う。

</details>

### 37. 型を埋めよ: `const handlePrice = (e: ___) => setPrice(e.target.value);`

<details><summary>解答を見る</summary>

`ChangeEvent<HTMLInputElement>`。

</details>

### 38. 型を埋めよ: `const handleSubmit = (e: ___) => e.preventDefault();`

<details><summary>解答を見る</summary>

`FormEvent<HTMLFormElement>`。

</details>

## Part 5. Next.js

### 39. Next.js App Router の`"use client"`は何を宣言するか？

<details><summary>解答を見る</summary>

Client Component の境界。

</details>

### 40. `"use client" = React を使うため`という説明が不正確な理由は？

<details><summary>解答を見る</summary>

すべての React Component が Client Component
である必要はなく、クライアント側 State/Event
などが必要な境界を示すものだから。

</details>

### 41. React の概念をすべて選べ: A `useState`, B `onChange`, C State 更新後の再レンダリング, D `"use client"`。

<details><summary>解答を見る</summary>

A、B、C。D は Next.js の Client Component 境界。

</details>

### 42. 分類せよ: `"use client"`, `useState`, `ChangeEvent<HTMLInputElement>`, `event.target.value`。

<details><summary>解答を見る</summary>

Next.js、React、React 型 + TypeScript、Web/JavaScript Event。

</details>

## Part 6. エラー探し

### 43. input change handler が `FormEvent<HTMLFormElement>`になっている。問題は？

<details><summary>解答を見る</summary>

`ChangeEvent<HTMLInputElement>`が適切。

</details>

### 44. form submit handler が `ChangeEvent<HTMLInputElement>`になっている。問題は？

<details><summary>解答を見る</summary>

`FormEvent<HTMLFormElement>`が適切。

</details>

### 45. 編集可能な `<input value={name} />` に `onChange` がない問題は？

<details><summary>解答を見る</summary>

State で値を固定しているが、ユーザー編集を State に戻す handler がない。

</details>

### 46. `<button onClick={handleSubmit}>`だけで Form 送信を処理するコードを改善せよ。

<details><summary>解答を見る</summary>

Form に `onSubmit={handleSubmit}`、ボタンに `type="submit"`を設定する。

</details>

### 47. `<input onChange={handleChange()} />`が通常誤りな理由は？

<details><summary>解答を見る</summary>

handler を渡すのではなく、レンダリング中に関数を呼び出しているから。

</details>

### 48. `<input type="number">`でも State が自動で number にならない理由は？

<details><summary>解答を見る</summary>

input の `value` は基本的に文字列として取得されるから。

</details>

## Part 7. コード完成

### 49. リアルタイム名前表示の Controlled input を完成させるには？

<details><summary>解答を見る</summary>

handler で `setName(e.target.value)`、input に
`value={name}`と`onChange={handleChange}`。

</details>

### 50. name を submittedName に保存する submit handler を完成させよ。

<details><summary>解答を見る</summary>

`e.preventDefault(); setSubmittedName(name);`

</details>

### 51. 名前とメールを1つの handler で送信するには？

<details><summary>解答を見る</summary>

`e.preventDefault(); setSubmittedName(name); setSubmittedEmail(email);`

</details>

### 52. JS の email handler を TypeScript に変換せよ。

<details><summary>解答を見る</summary>

`const handleEmail = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);`

</details>

### 53. JS の Form submit handler を TypeScript に変換せよ。

<details><summary>解答を見る</summary>

`const handleSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); };`

</details>

## Part 8. 設計

### 54. 商品名・価格の入力値と送信結果に必要な4つの State を設計せよ。

<details><summary>解答を見る</summary>

`productName`, `price`, `submitProduct`, `submitPrice`をそれぞれ
`useState("")`で用意する。

</details>

### 55. 商品 Form の行動と Event を対応させよ。

<details><summary>解答を見る</summary>

商品名変更 → `onChange`、価格変更 → `onChange`、Form 送信 → `onSubmit`。

</details>

### 56. 必要な3つの handler 名の例を挙げよ。

<details><summary>解答を見る</summary>

`handleProductNameChange`, `handlePriceChange`, `handleSubmit`。

</details>

### 57. 3つの handler の Event 型は？

<details><summary>解答を見る</summary>

最初の2つは `ChangeEvent<HTMLInputElement>`、送信は
`FormEvent<HTMLFormElement>`。

</details>

### 58. 商品 Form に`"use client"`が必要な理由は？

<details><summary>解答を見る</summary>

State と Event handler を使ってブラウザ上でユーザーとやり取りするため。

</details>

## Part 9. Day 18との接続

### 59. 1つの `submitProduct`文字列と`products`配列の違いは？

<details><summary>解答を見る</summary>

前者は1件の送信結果、後者は複数商品を蓄積する。

</details>

### 60. `newProduct`を配列の先頭に追加するイミュータブル更新を書け。

<details><summary>解答を見る</summary>

`setProducts(prevProducts => [newProduct, ...prevProducts]);`

</details>

### 61. その配列更新で spread を使う理由は？

<details><summary>解答を見る</summary>

既存配列を直接変更せず、既存要素を含む新しい配列を作るため。

</details>

### 62. Form → 商品オブジェクト → products 配列 → ProductList の流れを説明せよ。

<details><summary>解答を見る</summary>

入力を State 管理し、submit で商品オブジェクトを作成、products
に不変更新で追加し、Props で ProductList に渡して `map`で表示する。

</details>

## Part 10. 最終総合

### 63. `"use client"`, `useState`, `ChangeEvent<HTMLInputElement>`, `e.target.value`を含むコードをレイヤー分類せよ。

<details><summary>解答を見る</summary>

Next.js、React、React 型 + TypeScript、Web/Event。

</details>

### 64. Day 19 全体を1行の流れで書け。

<details><summary>解答を見る</summary>

ユーザー入力 → Event → handler → `event.target.value` → setter → State
更新 → 再レンダリング → UI 反映 → Form Submit。

</details>

### 65. Vanilla/Web、React、TypeScript、Next.js の役割を説明せよ。

<details><summary>解答を見る</summary>

Web: Event と値の原理。React: Event・State・UI を接続。TypeScript:
型を表現。Next.js: 対話的コードを Client Component 境界に配置。

</details>

### 66. 最終実装: Next.js + TypeScript で商品登録 Form を作成せよ。

<details><summary>解答を見る</summary>

`"use client"`、4つの文字列 State、2つの `ChangeEvent<HTMLInputElement>`
handler、1つの `FormEvent<HTMLFormElement>` submit handler、Controlled
input、`preventDefault()`、入力 State と送信 State の分離を使う。

</details>

## 最終チェックリスト

- [ ] Event オブジェクトがどこから来るか説明できる。
- [ ] `event.target.value`を説明できる。
- [ ] `handler`と`handler()`を区別できる。
- [ ] Controlled Component を説明できる。
- [ ] 入力 State と送信 State を分離できる。
- [ ] `onClick`と`onSubmit`を区別できる。
- [ ] `preventDefault()`を説明できる。
- [ ] `ChangeEvent<HTMLInputElement>`を使える。
- [ ] `FormEvent<HTMLFormElement>`を使える。
- [ ] number input の value が基本的に文字列だと理解している。
- [ ] `"use client"`を説明できる。
- [ ] Web / React / TypeScript / Next.js を分類できる。
- [ ] Next.js + TypeScript Form を解答なしで実装できる。

> **ヒント:**
> `<details>`を開く前に、自分の言葉で説明するか実際にコードを書けるかを基準に復習してください。
