# Day 15 — JavaScript 非同期処理まとめ

## 1. 同期実行

基本的な JavaScript コードは上から下へ実行されます。

```ts
console.log("A");
console.log("B");
console.log("C");
```

結果:

```text
A
B
C
```

基本ルールは上から下です。ただし、タイマーやサーバー通信のように結果が後から返ってくる処理では、非同期の考え方が必要になります。

> **ヒント**
> 実行順序を考えるときは、まず上→下を基本にして、非同期処理がある場所だけ流れを分けて考えましょう。

## 2. setTimeout と非同期処理

```ts
console.log("A");

setTimeout(() => {
  console.log("B");
}, 1000);

console.log("C");
```

結果:

```text
A
C
B
```

`setTimeout()` 自体はその場で実行されますが、渡した callback は後で実行されます。

> **ヒント**
> `setTimeout の実行 ≠ callback の実行`です。

## 3. Callback

Callback とは、別の関数に渡して特定のタイミングで実行してもらう関数です。

```ts
const printOrder = () => {
  console.log("注文");
};

setTimeout(printOrder, 1000);
```

`printOrder` は関数そのもの、`printOrder()` はその場で関数を呼び出すことです。

React でも同じ考え方を使います。

```tsx
<button onClick={handleDelete}>削除</button>
```

> **ヒント**
> `関数名 = 関数そのもの`、`関数名() = 今すぐ呼び出す`と区別しましょう。

## 4. return と undefined

```ts
function getStatus() {
  return "配送中";
}
```

`return` は値を呼び出し元へ返し、現在の関数を終了します。

明示的な `return` がない場合、関数の戻り値は `undefined` です。

```ts
function getStatus() {
  console.log("配送中");
}
```

> **ヒント**
> `console.log()` は表示、`return` は値を返すものです。

## 5. 非同期処理では通常の return だけでは結果を受け取れない場合がある

```ts
function getOrder() {
  setTimeout(() => {
    return "注文データ";
  }, 1000);
}

const order = getOrder();
console.log(order);
```

`getOrder()` は先に終了して `undefined` を返します。1秒後に callback 内で実行される `return` は callback 自身の戻り値です。

> **ヒント**
> 非同期コードで `return` を見たら、どの関数の return なのかを確認しましょう。

## 6. Promise

Promise は、将来決まる非同期処理の結果を表すオブジェクトです。

```ts
function getOrder() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("注文データ");
    }, 1000);
  });
}
```

`getOrder()` は Promise をすぐに返し、実際の結果は後で決まります。

> **ヒント**
> Promise オブジェクトそのものと、Promise が最終的に持つ結果を分けて考えましょう。

## 7. Promise の状態

| 状態 | 意味 |
|---|---|
| `pending` | まだ結果が決まっていない |
| `fulfilled` | 成功 |
| `rejected` | 失敗 |

状態遷移:

```text
pending
  ├─→ fulfilled
  └─→ rejected
```

一度確定した Promise の状態は再び変わりません。

> **ヒント**
> 最初に有効になった `resolve` または `reject` が最終状態を決めます。

## 8. resolve と reject

```ts
resolve("注文データ");
```

Promise を `fulfilled` にします。

```ts
reject(new Error("取得失敗"));
```

Promise を `rejected` にします。

重要なのは、`resolve()` と `reject()` は現在の関数そのものを終了させないことです。

> **ヒント**
> `resolve/reject` は Promise の状態を決め、`return` は現在の関数を終了します。

## 9. new Promise() の executor はすぐ実行される

```ts
console.log("A");

const promise = new Promise((resolve) => {
  console.log("B");
  resolve("成功");
  console.log("C");
});

console.log("D");
```

結果:

```text
A
B
C
D
```

Promise を作ったからといって、その内部コードすべてが自動的に非同期になるわけではありません。

> **ヒント**
> `Promise = すべてのコードを非同期にする仕組み`ではありません。

## 10. async

`async` 関数は必ず Promise を返します。

```ts
async function getStatus() {
  return "配送中";
}
```

結果として `fulfilled` Promise が返ります。

```ts
async function getStatus() {
  throw new Error("取得失敗");
}
```

この場合は `rejected` Promise が返ります。

```text
return 値 → fulfilled Promise
throw error → rejected Promise
```

> **ヒント**
> `async` の中心ルールは「必ず Promise を返す」です。

## 11. await

`await` は Promise が確定するまで現在の async 関数の続きの処理を待たせ、成功時には結果を取り出します。

```ts
const result = await getOrder();
```

大切なのは JavaScript 全体が停止するのではなく、その async 関数の続きだけが待機することです。

> **ヒント**
> `await getOrder()` は `関数呼び出し → Promise取得 → await → 後で再開` と分けて考えましょう。

## 12. await が複数ある場合

```ts
const a = await getA();
const b = await getB();
```

これは順次処理です。

```text
getA 開始
↓
A 完了
↓
getB 開始
↓
B 完了
```

互いに独立しているなら、先に Promise を作れます。

```ts
const promiseA = getA();
const promiseB = getB();

const a = await promiseA;
const b = await promiseB;
```

> **ヒント**
> 2つ目の処理が1つ目の結果を必要としているか確認しましょう。

## 13. Promise.all()

独立した複数の Promise がすべて完了するのをまとめて待つときに使います。

```ts
const [orders, users] = await Promise.all([
  getOrders(),
  getUsers(),
]);
```

結果配列の順序は完了順ではなく、入力した順序を維持します。

1つでも失敗すると `Promise.all()` 全体が `rejected` になります。

> **ヒント**
> `Promise.all()` は互いに依存しない処理に向いています。

## 14. try/catch

```ts
async function loadOrders() {
  try {
    const orders = await getOrders();
    console.log(orders);
  } catch (error) {
    console.log("注文取得失敗");
  }
}
```

await した Promise が失敗すると、`try` 内の通常の流れが中断され `catch` に移ります。

> **ヒント**
> `try` のどこで失敗したかを見つけると、その後どのコードが実行されないか判断しやすくなります。

## 15. throw

`throw` はエラーを発生させ、通常の実行フローを中断します。

```ts
console.log("A");
throw new Error("失敗");
console.log("B");
```

`B` は実行されません。

| コード | 役割 | 後続コード |
|---|---|---|
| `return` | 現在の関数を終了 | 実行されない |
| `resolve(value)` | Promise 成功 | 実行可能 |
| `reject(error)` | Promise 失敗 | 実行可能 |
| `throw error` | エラー発生 | 通常フロー中断 |

> **ヒント**
> `reject` は Promise の状態変更、`throw` はエラー発生 + 通常フロー中断です。

## 16. Error オブジェクト

```ts
const error = new Error("サーバー接続失敗");
```

代表的な情報:

```text
error.name
error.message
error.stack
```

`throw new Error("失敗")` は Error オブジェクトを作成し、そのオブジェクトを throw します。

> **ヒント**
> `new Error(...)` と `throw` を別々の役割として考えましょう。

## 17. TypeScript の catch(error)

TypeScript では catch した値が必ず Error オブジェクトとは限らないため、確認が必要になる場合があります。

```ts
try {
  await getOrders();
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
```

> **ヒント**
> `error.message` で型エラーが出たら `error instanceof Error` を思い出しましょう。

## 18. finally

`finally` は成功・失敗に関係なく最後に実行されます。

```ts
async function loadOrders() {
  setLoading(true);

  try {
    const orders = await getOrders();
    setOrders(orders);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}
```

> **ヒント**
> 成功でも失敗でも必ず行う後処理には `finally` が向いています。

## 19. 実行順序の例

```ts
async function getData() {
  console.log("2");
  throw new Error("失敗");
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

結果:

```text
A
1
2
B
3
4
```

重要なのは、`await` の後続処理が一度待機し、その間に外側の同期コードが先に進むことです。

> **ヒント**
> 実行順序は `関数呼び出し → Promise状態 → await → 外側コード → 再開` の順で追いましょう。

## 20. 実際のコードにまとめる

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

このコードには Day 15 の主要な考え方がほぼすべて含まれています。

## Day 15 概念マップ

```text
非同期処理
   ↓
Promise
   ↓
pending
 ├─ resolve → fulfilled
 └─ reject  → rejected
          ↓
         await
      ┌────┴────┐
      ↓         ↓
     成功       失敗
      ↓         ↓
   結果利用     catch
      └────┬────┘
           ↓
        finally
```

`async` 関数では:

```text
return 値  → fulfilled Promise
throw Error → rejected Promise
```

## 最後に覚える3つ

1. Promise は将来の結果を表す。
2. `await` は JavaScript 全体ではなく、現在の async 関数の続きだけを待たせる。
3. 成功は `fulfilled`、失敗は `rejected` になり、失敗は `try/catch` で処理できる。

**Day 15 — 非同期処理の基礎: 完了**
