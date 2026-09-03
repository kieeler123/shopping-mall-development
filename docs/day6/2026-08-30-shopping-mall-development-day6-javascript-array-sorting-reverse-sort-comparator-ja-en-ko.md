# JavaScript 配列ソート完全整理 / Array Sorting Complete Guide / JavaScript 배열 정렬 완전 정리

> 学習順序 / Study order / 학습 순서: `reverse()` → `toReversed()` →
> `sort()` → `toSorted()` → 比較関数 / comparator / 비교 함수 →
> `Date.getTime()` を使った注文の最新順ソート

------------------------------------------------------------------------

# 日本語

## 1. `reverse()` と `toReversed()`

### `reverse()` は元の配列を変更する

``` ts
const numbers = [1, 2, 3];

const reversed = numbers.reverse();

console.log(numbers);  // [3, 2, 1]
console.log(reversed); // [3, 2, 1]
console.log(numbers === reversed); // true
```

`reverse()`
は新しい配列を作るのではなく、元の配列そのものを逆順に変更して、その同じ配列を返します。

``` text
[1, 2, 3]
↓ reverse()
[3, 2, 1]

元の配列自体が変更される
```

> **ヒント**
>
> `reverse()` は **mutating method（元の値を変更するメソッド）**
> と覚えましょう。React の state
> 配列に直接使うときは特に注意が必要です。

### React ではコピーしてから `reverse()` できる

``` tsx
[...orders].reverse()
```

処理は2段階です。

``` text
orders
↓
[...orders]
↓
新しい配列を作る
↓
.reverse()
↓
コピーした配列だけを逆順にする
```

元の `orders` state は直接変更されません。

> **ヒント**
>
> `[...orders].reverse()` は「コピー →
> コピーを変更」と読めば理解しやすいです。

### `toReversed()` は元の配列を変更しない

``` ts
const numbers = [1, 2, 3];

const reversed = numbers.toReversed();

console.log(numbers);  // [1, 2, 3]
console.log(reversed); // [3, 2, 1]
console.log(numbers === reversed); // false
```

`toReversed()` は元の配列を維持し、逆順になった新しい配列を返します。

> **ヒント**
>
> React では「state
> の元データを維持し、必要な結果を新しい配列として作る」という考え方が重要です。

## 2. `sort()` と `toSorted()`

### `sort()` は元の配列を変更する

``` ts
const numbers = [3, 1, 2];

const sorted = numbers.sort();

console.log(numbers); // [1, 2, 3]
console.log(sorted);  // [1, 2, 3]
console.log(numbers === sorted); // true
```

`sort()` も `reverse()` と同じように元の配列を直接変更します。

> **ヒント**
>
> `reverse()` と `sort()` は両方とも元の配列を変更するため、React state
> に直接実行することは避けるのが基本です。

React で従来の方法を使うなら：

``` tsx
[...orders].sort(compareFunction)
```

コピーした配列だけが変更されます。

### `toSorted()` は新しい配列を返す

``` ts
const numbers = [3, 1, 2];

const sorted = numbers.toSorted();

console.log(numbers); // [3, 1, 2]
console.log(sorted);  // [1, 2, 3]
console.log(numbers === sorted); // false
```

元の配列は維持されます。

> **ヒント**
>
> `toSorted()`
> は「元の配列を変更せず、ソート済みの新しい配列を作る」と理解してください。

## 3. `reverse()` と `sort()` の目的の違い

`reverse()` は現在の順番を単純に逆転します。

``` ts
const numbers = [3, 1, 2];

numbers.reverse();
// [2, 1, 3]
```

これは数値の大きさで並べ替えたわけではありません。

一方 `sort()` は、指定された基準に従って順番を決め直します。

``` ts
const numbers = [3, 1, 2];

numbers.sort((a, b) => a - b);
// [1, 2, 3]
```

> **ヒント**
>
> `reverse()` = 現在の順番を逆転\
> `sort()` = 比較基準に従って順番を再構成

## 4. 比較関数 `(a, b) => a - b`

``` ts
numbers.sort((a, b) => a - b);
```

`sort()`
が重要視するのは、返された具体的な数値そのものではなく、**負数・0・正数のどれか**です。

  戻り値   意味
  -------- ------------------------------
  `< 0`    `a` を `b` より前にする
  `> 0`    `b` を `a` より前にする
  `0`      ソート基準上は同等として扱う

### 例: `a = 3`, `b = 1`

``` ts
a - b
// 3 - 1
// 2
```

正数なので `b`、つまり `1` が `3` より前になります。

### 例: `a = 1`, `b = 3`

``` ts
a - b
// 1 - 3
// -2
```

負数なので `a`、つまり `1` が前に残ります。

結果として小さい値が前に集まります。

``` ts
const numbers = [30, 5, 100, 1];

numbers.sort((a, b) => a - b);
// [1, 5, 30, 100]
```

> **ヒント**
>
> `a - b`
> の計算結果を暗記するのではなく、「小さい値を前に送るルール」と理解しましょう。

## 5. `a - b` と `b - a`

### 昇順

``` ts
(a, b) => a - b
```

``` text
小さい値
↓
大きい値
```

例：

``` ts
[30, 5, 100, 1]
// ↓
[1, 5, 30, 100]
```

### 降順

``` ts
(a, b) => b - a
```

``` text
大きい値
↓
小さい値
```

例：

``` ts
[30, 5, 100, 1]
// ↓
[100, 30, 5, 1]
```

> **ヒント**
>
> 数値比較ではまず `a - b = 昇順`, `b - a = 降順`
> を基準にし、必要なら実際の数値を代入して確認してください。

## 6. 比較関数の `0` の意味

``` ts
const users = [
  { name: "Taro", age: 20 },
  { name: "Hanako", age: 20 },
];

users.toSorted((a, b) => a.age - b.age);
```

この場合：

``` ts
20 - 20
// 0
```

二人が同じオブジェクトという意味ではありません。

**年齢という今回のソート基準では同等**という意味です。

> **ヒント**
>
> 比較関数の `0`
> は「データ全体が同一」ではなく、「今回比較しているキーでは同じ」と理解しましょう。

## 7. `sort()` は比較規則を受け取る

開発者が指定するのは：

``` ts
(a, b) => a - b
```

という「2つの値をどう比較するか」という規則です。

概念：

``` text
JavaScript
↓
配列から必要な要素を比較
↓
比較関数に a と b を渡す
↓
負数 / 0 / 正数を受け取る
↓
その規則に基づいて全体をソート
```

実際にどの要素をどの順番で比較するかを固定して暗記する必要はありません。

> **ヒント**
>
> 開発者は **比較ルールを提供する**、JavaScript エンジンは
> **そのルールで配列全体をソートする** と役割を分けて考えてください。

## 8. 注文日時を数値に変換する `Date.getTime()`

ショッピングモールの `Order` には：

``` ts
createdAt: string;
```

があります。

保存例：

``` ts
"2026-08-30T12:00:00.000Z"
```

比較しやすくするため：

``` ts
new Date(order.createdAt).getTime()
```

を使えます。

`getTime()` は Date の時刻を、1970-01-01T00:00:00Z
からのミリ秒数として返します。

``` text
古い日時
→ より小さい timestamp

新しい日時
→ より大きい timestamp
```

> **ヒント**
>
> 日付を並べ替えるときは「日時 → `Date` → `getTime()` →
> 数値比較」という流れで考えると分かりやすいです。

## 9. 注文を最新順にする

``` tsx
orders.toSorted((a, b) => {
  const aTime = new Date(a.createdAt).getTime();
  const bTime = new Date(b.createdAt).getTime();

  return bTime - aTime;
});
```

`bTime - aTime` なので、大きい timestamp、つまり新しい注文が前に来ます。

例：

``` text
aTime = 1000  // 古い注文
bTime = 2000  // 新しい注文

bTime - aTime
= 2000 - 1000
= 1000
→ 正数
→ b を a より前へ
→ 新しい注文が前
```

> **ヒント**
>
> ソート方向が分からなくなったら、`1000` と `2000`
> のような簡単な数値を代入してください。

## 10. `/orders` ページでの最終形

``` tsx
orders
  .toSorted((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();

    return bTime - aTime;
  })
  .map((order) => (
    <section key={order.id}>
      ...
    </section>
  ))
```

流れ：

``` text
orders
↓
toSorted()
↓
createdAt を Date に変換
↓
getTime() で timestamp に変換
↓
bTime - aTime
↓
最新順の新しい配列
↓
map()
↓
画面に表示
```

> **ヒント**
>
> 単に保存順を逆転する `reverse()` より、`createdAt`
> という明確な基準で並べる `toSorted()`
> の方が「最新順」という意図をコードに表現できます。

## 11. まとめ

  メソッド         元の配列を変更   新しい配列   主な目的
  ---------------- ---------------- ------------ ----------------------------------
  `reverse()`      O                X            現在の順番を逆転
  `toReversed()`   X                O            元を維持して逆順配列を作る
  `sort()`         O                X            基準に従って並べ替える
  `toSorted()`     X                O            元を維持してソート済み配列を作る

``` ts
(a, b) => a - b
// 昇順

(a, b) => b - a
// 降順
```

注文の最新順：

``` ts
(a, b) =>
  new Date(b.createdAt).getTime() -
  new Date(a.createdAt).getTime()
```

> **ヒント**
>
> 最終的な核心は **mutation と immutability**、そして
> **比較関数は負数・0・正数で順番を伝える** という2点です。

------------------------------------------------------------------------

# English

## 1. `reverse()` vs `toReversed()`

### `reverse()` mutates the original array

``` ts
const numbers = [1, 2, 3];

const reversed = numbers.reverse();

console.log(numbers);  // [3, 2, 1]
console.log(reversed); // [3, 2, 1]
console.log(numbers === reversed); // true
```

`reverse()` does not create a new array. It reverses the original array
in place and returns that same array.

> **Tip**
>
> Remember `reverse()` as a mutating method. Be especially careful when
> the array is React state.

### Copying before `reverse()`

``` tsx
[...orders].reverse()
```

Conceptually:

``` text
orders
↓
[...orders]
↓
create a new array
↓
reverse()
↓
mutate only the copied array
```

The original `orders` state array is not directly changed.

> **Tip**
>
> Read `[...orders].reverse()` as "copy first, then mutate the copy."

### `toReversed()` preserves the original

``` ts
const numbers = [1, 2, 3];

const reversed = numbers.toReversed();

console.log(numbers);  // [1, 2, 3]
console.log(reversed); // [3, 2, 1]
console.log(numbers === reversed); // false
```

`toReversed()` returns a new reversed array while leaving the original
untouched.

> **Tip**
>
> This matches the React mindset well: preserve the existing state value
> and derive a new value when needed.

## 2. `sort()` vs `toSorted()`

### `sort()` mutates the original array

``` ts
const numbers = [3, 1, 2];

const sorted = numbers.sort();

console.log(numbers); // [1, 2, 3]
console.log(sorted);  // [1, 2, 3]
console.log(numbers === sorted); // true
```

Like `reverse()`, `sort()` modifies the original array.

In React, a traditional safe pattern is:

``` tsx
[...orders].sort(compareFunction)
```

The copied array is sorted instead of directly mutating the state array.

> **Tip**
>
> `sort()` itself is not inherently bad. The important question is
> whether you are calling it directly on state.

### `toSorted()` returns a new array

``` ts
const numbers = [3, 1, 2];

const sorted = numbers.toSorted();

console.log(numbers); // [3, 1, 2]
console.log(sorted);  // [1, 2, 3]
console.log(numbers === sorted); // false
```

> **Tip**
>
> Think of `toSorted()` as "give me a sorted version as a new array."

## 3. `reverse()` and `sort()` solve different problems

`reverse()` simply flips the current order:

``` ts
const numbers = [3, 1, 2];

numbers.reverse();
// [2, 1, 3]
```

`sort()` reorganizes elements according to a comparison rule:

``` ts
const numbers = [3, 1, 2];

numbers.sort((a, b) => a - b);
// [1, 2, 3]
```

> **Tip**
>
> `reverse()` = flip the existing order.\
> `sort()` = establish an order according to a rule.

## 4. Understanding `(a, b) => a - b`

``` ts
numbers.sort((a, b) => a - b);
```

The important part is not the exact number returned. The sorting logic
cares whether the result is **negative, zero, or positive**.

  Return value   Meaning
  -------------- ------------------------------------------------
  `< 0`          place `a` before `b`
  `> 0`          place `b` before `a`
  `0`            treat them as equal for this sorting criterion

Example:

``` ts
// a = 3, b = 1
3 - 1
// 2
```

The result is positive, so `b` goes before `a`: `1` before `3`.

Another example:

``` ts
// a = 1, b = 3
1 - 3
// -2
```

The result is negative, so `a` stays before `b`.

Therefore:

``` ts
const numbers = [30, 5, 100, 1];

numbers.sort((a, b) => a - b);
// [1, 5, 30, 100]
```

> **Tip**
>
> Do not focus on the exact subtraction result. Focus on its sign:
> negative, zero, or positive.

## 5. `a - b` vs `b - a`

Ascending:

``` ts
(a, b) => a - b
```

``` text
small
↓
large
```

Descending:

``` ts
(a, b) => b - a
```

``` text
large
↓
small
```

> **Tip**
>
> A practical shortcut is `a - b` for ascending and `b - a` for
> descending. If you get confused, substitute simple numbers and
> calculate it manually.

## 6. What does returning `0` mean?

``` ts
const users = [
  { name: "Alice", age: 20 },
  { name: "Bob", age: 20 },
];

users.toSorted((a, b) => a.age - b.age);
```

The comparison can return:

``` ts
20 - 20
// 0
```

This does not mean the two objects are identical. It means they are
equal **according to the current sorting criterion: age**.

> **Tip**
>
> Comparator equality is about the sorting key, not necessarily object
> identity.

## 7. The comparator provides a rule

As developers, we provide:

``` ts
(a, b) => a - b
```

as the rule for comparing two elements.

Conceptually:

``` text
JavaScript
↓
selects elements that need comparison
↓
passes them as a and b
↓
receives negative / zero / positive
↓
uses the rule to sort the entire array
```

You should not depend on or memorize a particular sequence of comparator
calls.

> **Tip**
>
> Your job is to define a correct comparison rule. The JavaScript
> engine's job is to perform the overall sorting process.

## 8. Converting order dates with `Date.getTime()`

Our shopping mall `Order` contains:

``` ts
createdAt: string;
```

Example:

``` ts
"2026-08-30T12:00:00.000Z"
```

We can convert it to a numeric timestamp:

``` ts
new Date(order.createdAt).getTime()
```

`getTime()` returns the number of milliseconds since
`1970-01-01T00:00:00Z`.

Conceptually:

``` text
older date
→ smaller timestamp

newer date
→ larger timestamp
```

> **Tip**
>
> For date sorting, think: date string → `Date` → `getTime()` → numeric
> comparison.

## 9. Sorting orders newest first

``` tsx
orders.toSorted((a, b) => {
  const aTime = new Date(a.createdAt).getTime();
  const bTime = new Date(b.createdAt).getTime();

  return bTime - aTime;
});
```

Because the comparator uses `bTime - aTime`, larger timestamps move
toward the front.

Example:

``` text
aTime = 1000  // older
bTime = 2000  // newer

bTime - aTime
= 1000
→ positive
→ b before a
→ newer order first
```

> **Tip**
>
> If the direction feels confusing, test it with simple values such as
> `1000` and `2000`.

## 10. Final `/orders` pattern

``` tsx
orders
  .toSorted((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();

    return bTime - aTime;
  })
  .map((order) => (
    <section key={order.id}>
      ...
    </section>
  ))
```

Flow:

``` text
orders
↓
toSorted()
↓
createdAt → Date
↓
Date → timestamp with getTime()
↓
bTime - aTime
↓
new array sorted newest first
↓
map()
↓
render
```

> **Tip**
>
> Sorting explicitly by `createdAt` communicates "newest order first"
> more clearly than merely reversing whatever storage order happens to
> exist.

## 11. Summary

  Method           Mutates original?   New array?   Main purpose
  ---------------- ------------------- ------------ --------------------------
  `reverse()`      Yes                 No           Flip current order
  `toReversed()`   No                  Yes          Create reversed copy
  `sort()`         Yes                 No           Sort according to a rule
  `toSorted()`     No                  Yes          Create sorted copy

``` ts
(a, b) => a - b
// ascending

(a, b) => b - a
// descending
```

Newest orders first:

``` ts
(a, b) =>
  new Date(b.createdAt).getTime() -
  new Date(a.createdAt).getTime()
```

> **Tip**
>
> The two central ideas are **mutation vs immutability** and the
> comparator's **negative / zero / positive contract**.

------------------------------------------------------------------------

# 한국어

## 1. `reverse()`와 `toReversed()`

### `reverse()`는 원본 배열을 변경한다

``` ts
const numbers = [1, 2, 3];

const reversed = numbers.reverse();

console.log(numbers);  // [3, 2, 1]
console.log(reversed); // [3, 2, 1]
console.log(numbers === reversed); // true
```

`reverse()`는 새로운 배열을 만드는 것이 아니라 **기존 배열 자체의 순서를
뒤집고 그 배열을 다시 반환**합니다.

``` text
[1, 2, 3]
↓ reverse()
[3, 2, 1]

원본 자체가 변경됨
```

그래서:

``` ts
numbers === reversed
// true
```

입니다.

> **팁**
>
> `reverse()`를 보면 **mutating method, 즉 원본 변경 메서드**라고
> 생각하세요. 특히 React state 배열에 직접 실행하는 것은 피하는 것이
> 좋습니다.

### React에서는 복사 후 `reverse()`할 수 있다

``` tsx
[...orders].reverse()
```

이 표현은 두 단계입니다.

``` text
orders
↓
[...orders]
↓
새 배열 생성
↓
.reverse()
↓
새 배열의 순서만 변경
```

따라서 원래 `orders` state 배열 자체는 직접 변경하지 않습니다.

> **팁**
>
> `[...orders].reverse()`는 **복사 → 복사본 변경**이라고 읽으면 됩니다.

### `toReversed()`는 원본을 변경하지 않는다

``` ts
const numbers = [1, 2, 3];

const reversed = numbers.toReversed();

console.log(numbers);  // [1, 2, 3]
console.log(reversed); // [3, 2, 1]
console.log(numbers === reversed); // false
```

원본 `numbers`는 그대로이고 새로운 역순 배열이 만들어집니다.

> **팁**
>
> React에서는 **기존 state는 유지하고 필요한 결과를 새로운 값으로
> 만든다**는 사고방식이 중요합니다.

## 2. `sort()`와 `toSorted()`

### `sort()`는 원본 배열을 변경한다

``` ts
const numbers = [3, 1, 2];

const sorted = numbers.sort();

console.log(numbers); // [1, 2, 3]
console.log(sorted);  // [1, 2, 3]
console.log(numbers === sorted); // true
```

`sort()` 역시 `reverse()`처럼 원본 배열을 직접 변경합니다.

React state에서 예전 방식으로 안전하게 사용하려면:

``` tsx
[...orders].sort(compareFunction)
```

처럼 먼저 복사할 수 있습니다.

> **팁**
>
> `sort()` 자체가 나쁜 것이 아니라 **state 원본에 바로 `sort()`를
> 실행하는 것**을 주의해야 합니다.

### `toSorted()`는 새로운 배열을 반환한다

``` ts
const numbers = [3, 1, 2];

const sorted = numbers.toSorted();

console.log(numbers); // [3, 1, 2]
console.log(sorted);  // [1, 2, 3]
console.log(numbers === sorted); // false
```

원본은 그대로 유지됩니다.

> **팁**
>
> `toSorted()`는 **원본을 유지하면서 정렬된 버전의 새 배열을
> 만들어준다**고 이해하면 됩니다.

## 3. `reverse()`와 `sort()`의 목적 차이

`reverse()`:

``` ts
const numbers = [3, 1, 2];

numbers.reverse();
// [2, 1, 3]
```

현재 순서를 단순히 뒤집습니다.

반면 `sort()`:

``` ts
const numbers = [3, 1, 2];

numbers.sort((a, b) => a - b);
// [1, 2, 3]
```

는 주어진 **정렬 기준**에 따라 순서를 다시 결정합니다.

> **팁**
>
> `reverse()` = 현재 순서 뒤집기\
> `sort()` = 기준에 따라 순서 정하기

## 4. 비교 함수 `(a, b) => a - b`

``` ts
numbers.sort((a, b) => a - b);
```

여기서 `sort()`가 중요하게 보는 것은 계산 결과의 정확한 숫자가 아닙니다.

**음수인지, 0인지, 양수인지**가 중요합니다.

  반환값   의미
  -------- ----------------------------------------
  `< 0`    `a`를 `b`보다 앞에 둔다
  `> 0`    `b`를 `a`보다 앞에 둔다
  `0`      현재 정렬 기준에서는 동등하게 취급한다

### `a = 3`, `b = 1`

``` ts
3 - 1
// 2
```

양수입니다.

따라서 `b`, 즉 `1`이 `3`보다 앞으로 갑니다.

### `a = 1`, `b = 3`

``` ts
1 - 3
// -2
```

음수이므로 `a`, 즉 `1`이 `3`보다 앞에 있게 됩니다.

결국 작은 숫자가 앞쪽에 배치됩니다.

``` ts
const numbers = [30, 5, 100, 1];

numbers.sort((a, b) => a - b);
// [1, 5, 30, 100]
```

> **팁**
>
> `a - b`의 결과가 `-29`, `5`, `100`인지 자체는 중요하지 않습니다.
> **음수 / 0 / 양수 중 무엇인지**에 집중하세요.

## 5. `a - b`와 `b - a`

### 오름차순

``` ts
(a, b) => a - b
```

``` text
작은 값
↓
큰 값
```

``` ts
[30, 5, 100, 1]
// → [1, 5, 30, 100]
```

### 내림차순

``` ts
(a, b) => b - a
```

``` text
큰 값
↓
작은 값
```

``` ts
[30, 5, 100, 1]
// → [100, 30, 5, 1]
```

> **팁**
>
> 우선 `a - b = 오름차순`, `b - a = 내림차순` 패턴을 기억하고, 헷갈리면
> 실제 숫자를 넣어서 계산해보세요.

## 6. 비교 결과 `0`은 무슨 뜻인가?

``` ts
const users = [
  { name: "철수", age: 20 },
  { name: "영희", age: 20 },
];

users.toSorted((a, b) => a.age - b.age);
```

나이 비교 결과:

``` ts
20 - 20
// 0
```

이것은 철수와 영희가 같은 객체라는 뜻이 아닙니다.

현재 사용한 **나이라는 정렬 기준에서 두 값이 동등하다**는 뜻입니다.

> **팁**
>
> 비교 함수의 `0`은 데이터 전체가 같다는 뜻이 아니라 **현재 비교하고
> 있는 기준값이 같다**는 뜻입니다.

## 7. 개발자는 비교 규칙을 제공한다

우리가 작성하는:

``` ts
(a, b) => a - b
```

는 전체 배열을 직접 정렬하는 코드가 아닙니다.

두 요소가 주어졌을 때 **어느 쪽이 앞에 와야 하는지 알려주는
규칙**입니다.

``` text
JavaScript 엔진
↓
필요한 요소들을 비교
↓
a, b를 비교 함수에 전달
↓
음수 / 0 / 양수 반환
↓
그 규칙으로 전체 배열 정렬
```

실제 엔진이 요소를 정확히 어떤 순서로 비교하는지를 외울 필요는 없습니다.

> **팁**
>
> 개발자는 **비교 규칙을 설계**하고 JavaScript 엔진은 **그 규칙을 이용해
> 전체 정렬을 수행**한다고 역할을 나누어 생각하세요.

## 8. `Date.getTime()`으로 주문시간을 숫자로 바꾸기

현재 `Order`에는:

``` ts
createdAt: string;
```

이 있습니다.

예:

``` ts
"2026-08-30T12:00:00.000Z"
```

정렬할 때는:

``` ts
new Date(order.createdAt).getTime()
```

처럼 사용할 수 있습니다.

`getTime()`은 해당 시간을 `1970-01-01T00:00:00Z`를 기준으로 한 밀리초
숫자로 반환합니다.

그래서 개념적으로:

``` text
오래된 시간
→ 작은 timestamp

최신 시간
→ 큰 timestamp
```

가 됩니다.

> **팁**
>
> 날짜 정렬은 **날짜 문자열 → Date → getTime() → 숫자 비교** 순서로
> 생각하면 쉽습니다.

## 9. 최신 주문부터 정렬하기

``` tsx
orders.toSorted((a, b) => {
  const aTime = new Date(a.createdAt).getTime();
  const bTime = new Date(b.createdAt).getTime();

  return bTime - aTime;
});
```

여기서는:

``` ts
bTime - aTime
```

을 사용합니다.

최신 날짜일수록 timestamp가 크기 때문에 큰 값을 앞으로 보내는 내림차순
정렬입니다.

실제 숫자를 넣어보면:

``` text
aTime = 1000
→ 오래된 주문

bTime = 2000
→ 최신 주문
```

비교:

``` ts
2000 - 1000
// 1000
```

양수입니다.

비교 함수 규칙에 따라 `b`가 `a`보다 앞으로 갑니다.

``` text
최신 주문
↓
오래된 주문
```

> **팁**
>
> 정렬 방향이 헷갈리면 `1000`, `2000`처럼 단순한 숫자를 넣어서 직접
> 계산하세요. 가장 확실한 확인 방법입니다.

## 10. `/orders` 페이지에 적용하는 최종 형태

``` tsx
orders
  .toSorted((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();

    return bTime - aTime;
  })
  .map((order) => (
    <section key={order.id}>
      ...
    </section>
  ))
```

전체 흐름:

``` text
orders
↓
toSorted()
↓
주문 a와 b 비교
↓
createdAt
↓
new Date()
↓
getTime()
↓
timestamp 숫자
↓
bTime - aTime
↓
최신순의 새로운 배열
↓
map()
↓
화면 출력
```

> **팁**
>
> 단순히 배열의 저장 순서를 뒤집는 것보다 `createdAt`을 기준으로
> 정렬하면 **최신 주문순**이라는 코드의 의도가 더 명확해집니다.

## 11. `reverse`, `toReversed`, `sort`, `toSorted` 최종 비교

  메서드           원본 변경   새 배열   목적
  ---------------- ----------- --------- ----------------------------
  `reverse()`      O           X         현재 배열 순서 뒤집기
  `toReversed()`   X           O         원본 유지 + 역순 배열 생성
  `sort()`         O           X         기준에 따라 원본 정렬
  `toSorted()`     X           O         원본 유지 + 정렬 배열 생성

React 관점에서는:

``` text
state 원본
↓
직접 mutation 하지 않기
↓
새 배열 생성
↓
필요한 화면 결과 만들기
```

라는 방향으로 생각하면 좋습니다.

> **팁**
>
> 이 네 메서드를 외울 때 메서드 이름만 외우지 말고 **원본을 바꾸는가? 새
> 배열을 만드는가?**를 기준으로 분류하세요.

## 12. 최종 핵심 정리

숫자 오름차순:

``` ts
(a, b) => a - b
```

숫자 내림차순:

``` ts
(a, b) => b - a
```

주문 최신순:

``` ts
(a, b) =>
  new Date(b.createdAt).getTime() -
  new Date(a.createdAt).getTime()
```

그리고 비교 함수는:

``` text
음수
→ a가 앞

양수
→ b가 앞

0
→ 현재 정렬 기준상 동등
```

입니다.

> **팁**
>
> 이번 학습의 핵심은 두 가지입니다.
>
> **1. Mutation vs Immutability**\
> `sort()` / `reverse()`는 원본을 변경하고, `toSorted()` /
> `toReversed()`는 새 배열을 만듭니다.
>
> **2. Comparator의 역할**\
> 비교 함수는 전체 배열을 직접 정렬하는 것이 아니라, `a`와 `b` 중 어느
> 값이 앞에 와야 하는지를 음수·0·양수로 알려줍니다.
