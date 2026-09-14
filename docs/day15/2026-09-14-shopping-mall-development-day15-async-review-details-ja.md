# Day 15 復習問題 — JavaScript 非同期処理

> 各 STEP の答えは `<details>` を開いて確認できます。

## STEP 1

**Q1. 次のコードの出力順序はどうなりますか？**

```ts
console.log("A");
console.log("B");
console.log("C");
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A1.** `A → B → C` です。特別な非同期処理がなければ JavaScript は上から下へ実行されます。

**ヒント:** まず `上 → 下` を基本に考えます。

</details>

## STEP 2

**Q2. 次のコードの出力順序はどうなりますか？**

```ts
console.log("A");

setTimeout(() => {
  console.log("B");
}, 1000);

console.log("C");
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A2.** `A → C → B` です。`setTimeout()` は callback を後で実行するよう登録し、現在のコードはそのまま進みます。

**ヒント:** `setTimeout の呼び出し`と`callback の実行`を分けます。

</details>

## STEP 3

**Q3. `printOrder` と `printOrder()` の違いは何ですか？**

```ts
const printOrder = () => {
  console.log("주문");
};

setTimeout(printOrder, 1000);
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A3.** `printOrder` は関数そのものを渡し、`printOrder()` はその場で関数を呼び出して戻り値を使います。

**ヒント:** `関数名 = 関数そのもの`、`関数名() = 今呼び出す`です。

</details>

## STEP 4

**Q4. 明示的な `return` がない関数は何を返しますか？**

```ts
function getStatus() {
  console.log("배송중");
}

const result = getStatus();
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A4.** `undefined` です。`console.log()` で表示することと、関数が値を返すことは別の動作です。

**ヒント:** `console.log = 表示`、`return = 戻り値`です。

</details>

## STEP 5

**Q5. なぜ `order` に `"注文データ"` が入りませんか？**

```ts
function getOrder() {
  setTimeout(() => {
    return "주문 데이터";
  }, 1000);
}

const order = getOrder();
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A5.** 外側の `getOrder()` が先に終了して `undefined` を返すからです。後で実行される `return "注文データ"` は callback 自身の return です。

**ヒント:** その return がどの関数に属するか確認します。

</details>

## STEP 6

**Q6. Promise は何を表すオブジェクトですか？**

```ts
function getOrder() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("주문 데이터");
    }, 1000);
  });
}
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A6.** 将来決まる非同期処理の結果を表すオブジェクトです。

**ヒント:** Promise 本体と最終的な結果値を分けます。

</details>

## STEP 7

**Q7. Promise の3つの状態と可能な状態遷移を説明してください。**

<details><summary><strong>解答・解説を見る</strong></summary>

**A7.** `pending`、`fulfilled`、`rejected` です。`pending` から成功なら `fulfilled`、失敗なら `rejected` になり、一度確定すると再び変わりません。

**ヒント:** Promise は pending から一度だけ確定します。

</details>

## STEP 8

**Q8. `resolve()` と `reject()` は現在の関数を終了させますか？**

```ts
new Promise((resolve, reject) => {
  resolve("성공");
  console.log("A");
});
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A8.** いいえ。Promise の状態を確定しますが、現在の関数そのものは自動的に終了しません。

**ヒント:** `resolve/reject = Promise 確定`、`return = 関数終了`です。

</details>

## STEP 9

**Q9. 次のコードの出力順序と Promise の最終状態は？**

```ts
console.log("A");

const promise = new Promise((resolve) => {
  console.log("B");
  resolve("성공");
  console.log("C");
});

console.log("D");
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A9.** `A → B → C → D` です。Promise は `fulfilled`、結果は `"成功"` です。executor は Promise 作成時にすぐ実行されます。

**ヒント:** Promise を作るだけで内部すべてが非同期になるわけではありません。

</details>

## STEP 10

**Q10. `async` 関数が通常の値を return すると、呼び出し結果は何になりますか？**

```ts
async function getStatus() {
  return "배송중";
}

const result = getStatus();
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A10.** Promise です。`"配送中"` を return すると、その値を結果に持つ fulfilled Promise になります。

**ヒント:** `async 関数は必ず Promise を返す`を覚えます。

</details>

## STEP 11

**Q11. `await` は JavaScript 全体を停止させますか？**

```ts
async function test() {
  const result = await getOrder();
  console.log(result);
}
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A11.** いいえ。現在の async 関数の続きだけを待たせます。JavaScript 全体が停止するわけではありません。

**ヒント:** 関数呼び出し → Promise → await → 後で再開、と読みます。

</details>

## STEP 12

**Q12. 次の2つの処理は基本的に順次実行ですか、それとも同時に開始しますか？**

```ts
const a = await getA();
const b = await getB();
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A12.** 順次実行です。最初の await が完了してから `getB()` が呼び出されます。

**ヒント:** 2つ目が1つ目の結果に依存するか確認します。

</details>

## STEP 13

**Q13. `Promise.all()` はいつ使い、1つが失敗するとどうなりますか？**

```ts
const [orders, users] = await Promise.all([
  getOrders(),
  getUsers(),
]);
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A13.** 互いに独立した複数の Promise をまとめて待つときに使います。1つでも reject されると `Promise.all()` の Promise も reject されます。結果は入力順を維持します。

**ヒント:** 互いに独立した処理か確認してから使います。

</details>

## STEP 14

**Q14. await した Promise が reject された場合、`try` 内の後続コードはどうなりますか？**

```ts
try {
  const orders = await getOrders();
  console.log(orders);
  console.log("완료");
} catch (error) {
  console.log("조회 실패");
}
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A14.** reject された await の位置で `try` の通常フローが止まり、`catch` に移動します。その後の `try` 内コードは実行されません。

**ヒント:** どの行で失敗したかを特定します。

</details>

## STEP 15

**Q15. `throw` と `reject()` の重要な違いは何ですか？**

```ts
reject("실패");
console.log("A");

// 비교
throw new Error("실패");
console.log("B");
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A15.** `reject()` は Promise を rejected にしますが、それ自体では現在の関数を終了しません。`throw` はエラーを発生させ、通常の実行フローを中断します。

**ヒント:** `reject = Promise 状態`、`throw = エラー + 通常フロー中断`です。

</details>

## STEP 16

**Q16. `new Error("サーバー接続失敗")` と `throw` の役割をそれぞれ説明してください。**

```ts
throw new Error("서버 연결 실패");
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A16.** `new Error(...)` は Error オブジェクトを作り、`throw` はそのオブジェクトを投げます。代表的な情報は `name`、`message`、`stack` です。

**ヒント:** Error の作成と throw を分けて考えます。

</details>

## STEP 17

**Q17. TypeScript で catch した `error.message` を安全に使うには？**

```ts
try {
  await getOrders();
} catch (error) {
  // ?
}
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A17.** 例えば `error instanceof Error` で確認してから `error.message` を使います。

**ヒント:** 型エラーなら `instanceof Error` を思い出します。

</details>

## STEP 18

**Q18. `finally` はいつ実行され、React ではどんな処理に便利ですか？**

```ts
setLoading(true);

try {
  const orders = await getOrders();
  setOrders(orders);
} catch (error) {
  console.error(error);
} finally {
  setLoading(false);
}
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A18.** 成功・失敗に関係なく最後に実行されます。`setLoading(false)` のような共通の後処理に便利です。

**ヒント:** 成功でも失敗でも必要な処理かを基準にします。

</details>

## STEP 19

**Q19. 次のコードの出力順序を答えてください。**

```ts
async function getData() {
  console.log("2");
  throw new Error("실패");
}

async function test() {
  console.log("1");

  try {
    await getData();
  } catch {
    console.log("3");
  }

  console.log("4");
}

console.log("A");
test();
console.log("B");
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A19.** `A → 1 → 2 → B → 3 → 4` です。`getData()` は呼び出されると `2` まで実行され、async 関数内の throw は rejected Promise になります。`test()` は await で一度待機し、外側の `B` が先に出た後、catch の `3`、続いて `4` が実行されます。

**ヒント:** 関数呼び出し → Promise状態 → await → 外側同期コード → 再開、で追います。

</details>

## STEP 20

**Q20. 次のコードで使われている Day 15 の主要概念を説明してください。**

```ts
async function loadOrders() {
  setLoading(true);

  try {
    const [orders, users] = await Promise.all([
      fetchOrders(),
      fetchUsers(),
    ]);

    setOrders(orders);
    setUsers(users);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  } finally {
    setLoading(false);
  }
}
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A20.** `async` は Promise を返し、`Promise.all()` は独立した Promise をまとめて待ち、`await` は現在の関数の続きを待機させます。失敗は `catch`、成功・失敗共通の後処理は `finally` が担当します。

**ヒント:** 構文だけでなく、開始 → リクエスト → 待機 → 成功/失敗 → 後処理という流れで読みます。

</details>

## STEP 21

**Q21. `setTimeout(..., 0)` の出力順序は？**

```ts
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A21.** `A → C → B` です。0msでも callback は現在の同期コードが終わった後に実行機会を得ます。

**ヒント:** `0ms` を「この行で即時実行」と考えないようにしましょう。

</details>

## STEP 22

**Q22. executor で `return "成功"` だけを実行すると Promise は fulfilled になりますか？**

```ts
const promise = new Promise((resolve) => {
  return "成功";
});
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A22.** いいえ。executor の通常の return 値は Promise の結果には使われません。`resolve()` がないため `pending` のままです。

**ヒント:** Promise の結果を決めるのは executor の return ではなく `resolve/reject` です。

</details>

## STEP 23

**Q23. 最終的な Promise の状態は？**

```ts
new Promise((resolve, reject) => {
  reject("失敗");
  resolve("成功");
});
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A23.** `rejected` で、理由は `"失敗"` です。最初の settlement が最終状態を決めます。

**ヒント:** 一度 settled した Promise は後の resolve/reject では変わりません。

</details>

## STEP 24

**Q24. 出力順序は？ `C` は実行されますか？**

```ts
new Promise((resolve) => {
  console.log("A");
  resolve("成功");
  console.log("B");
  return;
  console.log("C");
});
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A24.** `A → B` です。`resolve()` は関数を終了しませんが、`return` は終了するため `C` は実行されません。

**ヒント:** `resolve = Promise確定`、`return = 現在の関数終了`と分けましょう。

</details>

## STEP 25

**Q25. async 関数を宣言しただけで本体は実行されますか？**

```ts
async function getOrder() {
  console.log("A");
}
console.log("B");
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A25.** いいえ。呼び出す必要があります。出力は `B` だけです。

**ヒント:** `async` は戻り方に影響しますが、宣言自体を実行しません。

</details>

## STEP 26

**Q26. 出力順序と `result` の正体は？**

```ts
async function getStatus() {
  console.log("A");
  return "配送中";
}
console.log("B");
const result = getStatus();
console.log("C");
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A26.** `B → A → C` です。`result` は `"配送中"` を結果に持つ fulfilled Promise です。

**ヒント:** async 関数も呼び出されると、await までの本体はすぐ進みます。

</details>

## STEP 27

**Q27. `result` には Promise と文字列のどちらが入りますか？**

```ts
async function getStatus() {
  return "配送中";
}
async function test() {
  const result = await getStatus();
  console.log(result);
}
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A27.** `"配送中"` が入ります。`getStatus()` は Promise を返しますが、await が fulfilled の値を取り出します。

**ヒント:** `関数呼び出し結果 = Promise` と `await結果 = 成功値`を区別しましょう。

</details>

## STEP 28

**Q28. `getOrder()` が後で完了する場合、主な出力順序は？**

```ts
async function printOrder() {
  console.log("A");
  const result = await getOrder();
  console.log("B");
}
console.log("C");
printOrder();
console.log("D");
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A28.** `C → A → D → B` です。`printOrder()` は await で待機し、外側の同期コード `D` が先に実行されます。

**ヒント:** async 関数を `await前` と `await後の再開` に分けて考えましょう。

</details>

## STEP 29

**Q29. 各 `getOrder()` が約2秒なら全体は約何秒？**

```ts
await getOrder();
await getOrder();
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A29.** 約4秒です。最初の await が終わってから2回目の `getOrder()` が呼ばれる順次処理です。

**ヒント:** 2つ目の関数がいつ呼ばれるか確認しましょう。

</details>

## STEP 30

**Q30. この場合、2つの処理はいつ開始しますか？**

```ts
const p1 = getOrder();
const p2 = getOrder();
await p1;
await p2;
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A30.** 両方の関数が await より前に呼ばれるため、2つとも先に開始します。各2秒なら全体も約2秒程度になり得ます。

**ヒント:** 同時開始かどうかは await より関数の呼び出し位置を見ましょう。

</details>

## STEP 31

**Q31. `result` 配列は完了順ですか、入力順ですか？**

```ts
const result = await Promise.all([
  getOrder1(), // 2秒
  getOrder2(), // 1秒
]);
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A31.** 入力順です。2つ目が先に完了しても `[order1の結果, order2の結果]` の順を維持します。

**ヒント:** 完了順と結果配列の順序を混同しないようにしましょう。

</details>

## STEP 32

**Q32. なぜこの2処理を無条件に `Promise.all()` でまとめてはいけませんか？**

```ts
const user = await getUser();
const orders = await getOrders(user.id);
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A32.** `getOrders()` が `user.id` に依存しているためです。2つ目は1つ目の結果が必要です。

**ヒント:** `BはAの結果なしで開始できるか？`を確認しましょう。

</details>

## STEP 33

**Q33. 出力順序は？**

```ts
async function getOrder() {
  console.log("A");
  throw new Error("조회 失敗");
}
async function test() {
  try {
    console.log("B");
    await getOrder();
    console.log("C");
  } catch {
    console.log("D");
  }
  console.log("E");
}
test();
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A33.** `B → A → D → E` です。`C` は実行されません。async 関数の throw は rejected Promise となり、await の失敗が catch に伝わります。

**ヒント:** await 失敗後は通常の次の行ではなく catch の流れを確認しましょう。

</details>

## STEP 34

**Q34. 通常関数と async 関数の `throw` は呼び出し側からどう違って見えますか？**

<details><summary><strong>解答・解説を見る</strong></summary>

**A34.** 通常関数の throw は呼び出し中に同期的なエラーを発生させます。async 関数内の throw は、その関数が返す Promise を rejected にします。

**ヒント:** throw を見たら、まずその関数が async か確認しましょう。

</details>

## STEP 35

**Q35. 出力順序は？**

```ts
function getOrder() {
  console.log("A");
  throw new Error("조회 失敗");
}
async function test() {
  console.log("B");
  try {
    await getOrder();
  } catch {
    console.log("C");
  }
  console.log("D");
}
console.log("E");
test();
console.log("F");
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A35.** `E → B → A → C → D → F` です。通常関数の呼び出し自体で同期的に throw し、try がすぐ捕捉します。

**ヒント:** `await` があっても、まず右辺の関数呼び出しが評価されます。

</details>

## STEP 36

**Q36. 出力順序は？**

```ts
async function getOrder() {
  console.log("A");
  throw new Error("조회 失敗");
}
async function test() {
  console.log("B");
  try {
    await getOrder();
  } catch {
    console.log("C");
  }
  console.log("D");
}
console.log("E");
test();
console.log("F");
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A36.** `E → B → A → F → C → D` です。`A` はすぐ実行されますが、async の throw は返却 Promise を rejected にし、test は await で待機します。

**ヒント:** 直前の通常関数版と比較すると違いが明確です。

</details>

## STEP 37

**Q37. `catch(error)` が受け取るのは文字列メッセージだけですか？**

```ts
try {
  throw new Error("조회 失敗");
} catch (error) {
  // error は何か？
}
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A37.** いいえ。ここでは投げられた Error オブジェクト全体を受け取ります。`error.message` が `"取得失敗"` です。

**ヒント:** `throw new Error(...)` はメッセージだけでなく Error オブジェクトを投げます。

</details>

## STEP 38

**Q38. `finally` は成功時と失敗時のどちらで実行されますか？**

```ts
try {
  await getOrders();
} catch (error) {
  console.error(error);
} finally {
  console.log("後処理");
}
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A38.** 両方です。成功時にも、失敗して catch を通った後にも実行されます。

**ヒント:** 成功・失敗共通の後処理なら finally を考えましょう。

</details>

## STEP 39

**Q39. 正確な出力順序を答えてください。**

```ts
async function getOrder() {
  console.log("A");
  throw new Error("조회 失敗");
}
async function test() {
  console.log("B");
  try {
    console.log("C");
    await getOrder();
    console.log("D");
  } catch {
    console.log("E");
  } finally {
    console.log("F");
  }
  console.log("G");
}
console.log("H");
test();
console.log("I");
```

<details><summary><strong>解答・解説を見る</strong></summary>

**A39.** `H → B → C → A → I → E → F → G` です。async 呼び出しで `A` まで実行され、throw で Promise が rejected になり、test は await で待機するため `I` が先です。

**ヒント:** `async本体はすぐ開始 + throw→rejected + await後は後で再開`を一緒に追いましょう。

</details>

## STEP 40

**Q40. Day 15 全体の非同期処理を一つの流れで説明してください。**

<details><summary><strong>解答・解説を見る</strong></summary>

**A40.** `非同期処理 → Promise(pending) → resolve/reject → fulfilled/rejected → await → 成功値を利用または catch → finally で共通後処理`です。async 関数では return が fulfilled の結果になり、throw は返却 Promise を rejected にします。

**ヒント:** `Promise状態` と `実行順序` の2軸で説明できれば十分です。

</details>
