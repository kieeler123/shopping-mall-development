# Day 15 --- 非同期処理の基礎 学習計画

## 学習目標

Day 14 では、React の state と関連するロジックを `useOrders`
に分離しました。Day 15 では、サーバー通信へ進む前に、JavaScript の
**非同期処理** とは何かを小さな例を通して理解します。

今日の中心的な流れ:

```text
同期処理と非同期処理の違い
↓
Promise
↓
async
↓
await
↓
try / catch
↓
非同期関数の実行フローを説明する
```

> Day 15 では、実際の API 通信を本格的に実装しません。 まずは非同期
> JavaScript の実行モデルを明確に理解することに集中します。

---

## STEP 1 --- まず同期処理を理解する

まずは、JavaScript
のコードが記述された順番に実行される単純な流れを基準に考えます。

```ts
console.log("1");
console.log("2");
console.log("3");
```

結果:

```text
1
2
3
```

この単純な流れを基準にして、時間のかかる処理が入ったときに何が変わるのかを比較します。

**ヒント**

非同期処理の概念をすぐに暗記しようとせず、まず「このコードが単純に上から順番に実行されたら、どのような出力になるか？」を予測します。

---

## STEP 2 --- なぜ非同期処理が必要なのか理解する

実際のアプリケーションには、すぐに完了しない処理があります。

```text
サーバーから注文データを取得する
ファイルを読み込む
タイマーを待つ
データ保存の結果を待つ
```

このような処理が完了するまでアプリケーション全体が何もできなくなると、ユーザー体験が悪くなる可能性があります。

Day 15 では、非同期処理を **結果が後から利用可能になる処理を扱う方法**
として理解します。

**ヒント**

最初は非同期処理を単に「複数の処理を同時に行うこと」と覚えないようにします。**結果を今すぐ受け取れない処理を扱うための流れ**と考えると理解しやすくなります。

---

## STEP 3 --- 小さな非同期処理の例で実行順序を観察する

`setTimeout` を使って実行順序を観察します。

```ts
console.log("開始");

setTimeout(() => {
  console.log("後で実行");
}, 1000);

console.log("終了");
```

予想される結果:

```text
開始
終了
後で実行
```

コード上では `setTimeout` が途中に書かれていますが、その callback
は後から実行されます。

**ヒント**

コードを実行する前に、自分で出力順序を書いて予想してから、実際の結果と比較します。

---

## STEP 4 --- Promise の役割を理解する

`Promise` は、非同期処理の結果を表すための JavaScript オブジェクトです。

最初は複雑な内部動作よりも、次の三つの状態を中心に理解します。

```text
pending
→ まだ結果が確定していない

fulfilled
→ 処理が成功した

rejected
→ 処理が失敗した
```

小さな例:

```ts
const orderPromise = new Promise((resolve) => {
  setTimeout(() => {
    resolve("注文データ");
  }, 1000);
});
```

ここでは次の考え方が重要です。

```text
Promise
= 将来成功または失敗する可能性のある結果を表すもの
```

**ヒント**

Promise の構文を一度にすべて暗記しようとせず、まずは
`pending → fulfilled / rejected` という状態の流れを覚えます。

---

## STEP 5 --- `async` を理解する

関数に `async` を付けると async 関数になり、`async` 関数は Promise
を返します。

```ts
async function loadOrders() {
  return "注文データ";
}
```

呼び出し:

```ts
const result = loadOrders();
console.log(result);
```

`result` を単なる文字列ではなく、Promise として確認します。

**ヒント**

`async = 待つ` と覚えないようにします。待つための構文は次の STEP で学ぶ
`await` です。`async` は Promise
ベースの非同期関数を作るためのキーワードだと理解します。

---

## STEP 6 --- `await` を理解する

`await` を使うと、待っている Promise が正常に完了するまで async
関数の続きの処理を一時停止し、その結果を受け取ってから次へ進む形でコードを書けます。

```ts
function getOrder() {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("注文データ");
    }, 1000);
  });
}

async function loadOrder() {
  const order = await getOrder();
  console.log(order);
}
```

中心となる構造:

```text
Promise を返す処理
↓
await
↓
完了した結果
↓
次のコード
```

**ヒント**

`await` を見たら、「この式はどの Promise
の結果を待っているのか？」を確認します。

---

## STEP 7 --- `async / await` の実行フローを追跡する

次のコードの出力順序を、実行する前に予想します。

```ts
console.log("A");

async function loadOrders() {
  console.log("B");

  const result = await Promise.resolve("orders");

  console.log("C");
  return result;
}

loadOrders();

console.log("D");
```

予想される出力:

```text
A
B
D
C
```

ここでの目的は答えを暗記することではなく、`await`
の前後で実行フローがどのように変化するのかを観察することです。

`await` より前のコードは `loadOrders()`
が呼び出されたときに実行されます。一方、`await`
より後の続きの処理は、現在の同期処理が終わった後に実行されます。

**ヒント**

非同期コードは頭の中だけでは流れを把握しにくいことがあります。複数の場所に
`console.log()` を置き、実際の実行順序を目で確認します。

---

## STEP 8 --- 失敗する非同期処理と `try / catch`

サーバー通信のような非同期処理が、常に成功するとは限りません。

```ts
async function loadOrders() {
  try {
    const orders = await getOrders();
    console.log(orders);
  } catch (error) {
    console.error("注文を読み込めませんでした。", error);
  }
}
```

それぞれの役割:

```text
try
→ 成功または失敗する可能性がある処理を試す

await
→ 非同期処理の結果を待つ

catch
→ 発生したエラーを処理する
```

`try` ブロック内で `await` している Promise が reject された場合、処理は
`catch` ブロックへ移ります。

**ヒント**

`try / catch`
を単なる構文として見るのではなく、**成功する場合の流れと失敗する場合の流れを分ける構造**と考えます。

---

## STEP 9 --- ショッピングモールプロジェクトとつなげて考える

Day 15 では API
を本格的に実装しませんが、将来、注文データをサーバーから取得すると仮定して流れを考えます。

```text
現在

useOrders
↓
ローカルデータ / state
↓
AdminOrdersPage


今後

useOrders
↓
非同期の注文リクエスト
↓
Promise
↓
await
↓
orders state を更新
↓
AdminOrdersPage
```

Day 14
で行ったロジックの分離が、今後の非同期データ処理につながっていくことを確認します。

**ヒント**

まだ `fetch()` の実装へ急いで進む必要はありません。Day 15 の目的は API
ではなく、**非同期処理の結果をどのように待ち、どのように扱うのか**を理解することです。

---

## STEP 10 --- Day 15 最終練習

小さな疑似注文リクエスト関数を作ります。

```ts
type SimpleOrder = {
  id: number;
  status: string;
};

function getOrders(): Promise<SimpleOrder[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, status: "支払い完了" },
        { id: 2, status: "配送中" },
      ]);
    }, 1000);
  });
}

async function loadOrders() {
  try {
    console.log("注文リクエスト開始");

    const orders = await getOrders();

    console.log("注文リクエスト完了");
    console.log(orders);
  } catch (error) {
    console.error("注文リクエスト失敗", error);
  }
}

loadOrders();
```

この練習では、実際のサーバーを使う代わりに `Promise + setTimeout`
でサーバーからの応答を疑似的に再現します。

**ヒント**

コードをコピーして終わりにせず、`getOrders()` が何を返すのか、`await`
が何を待っているのか、成功した場合はどこへ進み、失敗した場合はどこへ進むのかを一行ずつ説明してみます。

---

## Day 15 完了チェックリスト

```text
[ ] 同期処理と非同期処理の違いを自分の言葉で説明できる

[ ] 非同期処理が必要な理由を説明できる

[ ] setTimeout の例の実行順序を予想できる

[ ] Promise が何を表すのか説明できる

[ ] pending / fulfilled / rejected を区別できる

[ ] async 関数が Promise を返すことを理解している

[ ] await の役割を説明できる

[ ] try / catch が必要な理由を説明できる

[ ] 小さな Promise の例を async / await で処理できる

[ ] Day 14 の useOrders と将来の非同期注文リクエストがどのようにつながるのか説明できる
```

**ヒント**

すべての構文を暗記できたかどうかではなく、`Promise → async → await → try / catch`
の関係を自分の言葉で説明できるかどうかを完了基準にします。

---

## Day 15 を一文でまとめる

> **非同期処理とは、結果がすぐには利用できない処理を扱う方法です。Promise
> はその将来の結果を表し、`async / await`
> はその結果を読みやすい流れで扱えるようにし、`try / catch`
> は失敗を処理します。**

次の Day では、この基礎を HTTP と API の概念につなげていきます。
