# Shopping Mall Day 4 --- UNIVERSAL 正解・Answers・정답 해설

[📖 GENERAL](2026-08-28-shopping-mall-development-day4-GENERAL_JA_EN_KO.md)\
[📝 問題・Quiz・문제](2026-08-28-shopping-mall-development-day4-REACT_PROBLEMS.md)

---

# 日本語 --- 正解・解説

## 正解表

| 問題        | 正解                                                 |
| ----------- | ---------------------------------------------------- |
| **問題 1**  | **2. `find()`**                                      |
| **問題 2**  | **1. `map()`**                                       |
| **問題 3**  | **2. 既存プロパティを引き継ぐ**                      |
| **問題 4**  | **2. `filter()`**                                    |
| **問題 5**  | **1. 結果配列に残る**                                |
| **問題 6**  | **2. 削除対象ではないIDを残す**                      |
| **問題 7**  | **4. `reduce()`**                                    |
| **問題 8**  | **3. totalの初期値**                                 |
| **問題 9**  | **2**                                                |
| **問題 10** | **1**                                                |
| **問題 11** | **コード参照**                                       |
| **問題 12** | **+クリック → updatedCart → setCart → localStorage** |

> **Tip**
>
> まず採点し、間違えた問題と「理由を説明できなかった正解」だけ詳細解説を読む。

## 問題 1 解説

**正解: 2. `find()`**

### 正解理由

`find()`は条件に一致する最初の要素を1つ返す。`productId`から商品情報1件を取得する目的に合う。

### 重要な誤答

- **`filter()`** ---
  条件に合う要素を配列として残す。1件検索とは結果の形が違う。
- **`map()`** --- 各要素を変換して新しい配列を作る。

> **Tip**
>
> 判別質問: 「欲しい結果は1要素か、配列か？」

## 問題 2 解説

**正解: 1. `map()`**

`map()`なら全CartItemを確認し、対象だけ新しいオブジェクトに置き換えた新配列を作れる。

```ts
const updatedCart = cart.map((item) =>
  item.productId === productId
    ? { ...item, quantity: item.quantity + 1 }
    : item,
);
```

> **Tip**
>
> 要素数を基本的に維持しながら内容を変更するなら `map()`。

## 問題 3 解説

**正解: 2. 既存プロパティを引き継ぐ**

```ts
{ ...item, quantity: item.quantity + 1 }
```

`...item`で既存プロパティを展開し、その後の `quantity`
が旧値を上書きする。

> **Tip**
>
> プロパティの記述順序にも注目する。後ろの同名キーが前の値を上書きする。

## 問題 4 解説

**正解: 2. `filter()`**

```ts
cart.filter((item) => item.productId !== productId);
```

削除対象以外だけを残した新配列を作る。

## 問題 5 解説

**正解: 1. 結果配列に残る**

`filter()`は条件が `true` の要素を残す。

```text
true → keep
false → exclude
```

> **Tip**
>
> `filter()`の条件は「削除条件」ではなく「残す条件」と考える。

## 問題 6 解説

**正解: 2. 削除対象ではないIDを残す**

`!==` は「等しくない」。削除対象と異なる商品だけを残すために使っている。

## 問題 7 解説

**正解: 4. `reduce()`**

複数の `salePrice × quantity` を `total` に累積して1つの数字を作るため。

## 問題 8 解説

**正解: 3. totalの初期値**

```ts
}, 0);
```

の `0` から累積を開始する。

```text
0
↓
+ 39,800
↓
39,800
↓
+ 29,900
↓
69,700
```

> **Tip**
>
> `reduce()`では「初期値」と「各反復後のaccumulator」を必ず確認する。

## 問題 9 解説

**正解: 2**

React
stateとlocalStorageは別の保存場所。`setCart()`だけではlocalStorageの文字列は自動更新されない。

> **Tip**
>
> UI更新テストだけでなく、ページ更新後の永続化テストも行う。

## 問題 10 解説

**正解: 1**

```ts
Math.max(1, item.quantity - 1);
```

計算結果が0になっても1と比較して大きい方を返すため、最小数量1を維持できる。

## 問題 11 解説 --- コード復元

**正解例**

```ts
const updatedCart = cart.map((item) =>
  item.productId === productId
    ? { ...item, quantity: item.quantity + 1 }
    : item,
);
```

### 復元順序

```text
cart.map()
→ itemを確認
→ productId比較
→ 対象なら新オブジェクト
→ quantity + 1
→ 対象外なら元item
```

## 問題 12 解説 --- 流れ復元

**正解**

```text
ユーザーが+をクリック
↓
updatedCart作成
↓
setCart(updatedCart)
↓
localStorage更新
```

> **Tip**
>
> 実装では「イベント → 新データ → state → 永続化」という流れを意識する。

---

# English --- Answers & Explanations

## Answer Table

Question Answer

---

1 **2. `find()`**
2 **1. `map()`**
3 **2. Preserve existing properties**
4 **2. `filter()`**
5 **1. It remains**
6 **2. Keep non-target IDs**
7 **4. `reduce()`**
8 **3. Initial total**
9 **2**
10 **1**
11 **See code**
12 **click + → updatedCart → setCart → localStorage**

> **Tip**
>
> Treat a correct answer without a clear reason as something that still
> needs review.

## Question 1

**Answer: 2. `find()`**

`find()` returns the first matching element. `filter()` would return an
array, while `map()` creates a transformed array.

## Question 2

**Answer: 1. `map()`**

`map()` is appropriate when the cart should keep its items while one
item's data changes.

## Question 3

**Answer: 2. Preserve existing properties**

Spread syntax copies the existing properties into the new object, and
the later `quantity` property overwrites the old value.

## Question 4

**Answer: 2. `filter()`**

It creates a new array containing only the elements that should remain.

## Question 5

**Answer: 1. It remains**

For `filter()`, `true` means keep and `false` means exclude.

## Question 6

**Answer: 2. Keep non-target IDs**

`!==` means not equal, so the target product is excluded.

## Question 7

**Answer: 4. `reduce()`**

The required result is one accumulated number rather than another array.

## Question 8

**Answer: 3. Initial total**

The final `0` initializes the accumulator.

## Question 9

**Answer: 2**

React state and browser persistence are separate. A refresh can reveal
stale persisted data if localStorage was not updated.

## Question 10

**Answer: 1**

`Math.max(1, item.quantity - 1)` prevents the resulting quantity from
falling below 1.

## Question 11 --- Code Reconstruction

```ts
const updatedCart = cart.map((item) =>
  item.productId === productId
    ? { ...item, quantity: item.quantity + 1 }
    : item,
);
```

## Question 12 --- Flow Reconstruction

```text
user clicks +
↓
create updatedCart
↓
setCart(updatedCart)
↓
update localStorage
```

> **Tip**
>
> Reconstruct the data flow from the user's action rather than
> memorizing code line order.

---

# 한국어 --- 정답·해설

## 정답표

문제 정답

---

문제 1 **2. `find()`**
문제 2 **1. `map()`**
문제 3 **2. 기존 속성 유지**
문제 4 **2. `filter()`**
문제 5 **1. 결과 배열에 남는다**
문제 6 **2. 삭제 대상이 아닌 ID를 남긴다**
문제 7 **4. `reduce()`**
문제 8 **3. total의 초기값**
문제 9 **2**
문제 10 **1**
문제 11 **아래 코드**
문제 12 **+ 클릭 → updatedCart → setCart → localStorage**

> **팁**
>
> 먼저 정답표로 빠르게 채점하고, 틀린 문제와 근거를 설명하지 못한 문제만
> 상세 해설을 확인한다.

## 문제 1 해설

**정답: 2. `find()`**

### 정답 이유

`find()`는 조건과 일치하는 첫 번째 요소 하나를 반환한다. `productId`로
실제 상품 하나를 찾는 목적에 적합하다.

### 중요한 오답

- **`filter()`** --- 조건을 통과한 항목들을 배열로 반환한다.
- **`map()`** --- 배열 각 요소를 변환하여 새로운 배열을 만든다.

> **팁**
>
> `find()`와 `filter()`가 헷갈리면 결과가 `한 요소`인지 `배열`인지 먼저
> 생각한다.

## 문제 2 해설

**정답: 1. `map()`**

### 정답 이유

상품 개수는 그대로 유지하면서 특정 CartItem의 `quantity`만 바꾼 새
배열을 만들기 때문이다.

```ts
const updatedCart = cart.map((item) =>
  item.productId === productId
    ? { ...item, quantity: item.quantity + 1 }
    : item,
);
```

### 중요한 오답

- **`filter()`** --- 수정보다 항목 제외에 적합하다.
- **`find()`** --- 하나를 찾지만 새로운 cart 배열을 만들어주지는
  않는다.

> **팁**
>
> `개수 유지 + 내용 변경 = map()`을 기준으로 판단한다.

## 문제 3 해설

**정답: 2. 기존 속성 유지**

### 코드 구조

```ts
{
  ...item,
  quantity: item.quantity + 1
}
```

먼저 기존 `item`의 속성을 새 객체에 펼치고, 뒤에서 `quantity`를 새로운
값으로 덮어쓴다.

> **팁**
>
> React에서 특정 속성만 변경할 때 `{ ...기존객체, 바꿀속성: 새값 }`
> 패턴을 자주 사용한다.

## 문제 4 해설

**정답: 2. `filter()`**

### 정답 이유

삭제할 항목을 직접 없애는 것이 아니라, 삭제 대상이 아닌 항목만 남긴
새로운 배열을 만들기 때문이다.

```ts
const updatedCart = cart.filter((item) => item.productId !== productId);
```

> **팁**
>
> `filter()`에서는 항상 `무엇을 남길 것인가?`를 먼저 묻는다.

## 문제 5 해설

**정답: 1. 결과 배열에 남는다**

```text
true
→ 새 배열에 포함

false
→ 새 배열에서 제외
```

> **팁**
>
> `filter = true 생존 / false 탈락`으로 기억하면 조건식을 읽기 쉽다.

## 문제 6 해설

**정답: 2. 삭제 대상이 아닌 ID를 남긴다**

`!==`는 `같지 않다`라는 뜻이다.

```ts
item.productId !== productId;
```

는 현재 item이 삭제 대상과 다른 경우에만 `true`가 된다.

## 문제 7 해설

**정답: 4. `reduce()`**

### 정답 이유

각 상품의:

```text
salePrice × quantity
```

를 `total`에 계속 누적하여 최종 숫자 하나를 만들기 때문이다.

> **팁**
>
> 결과가 `배열`이 아니라 `총액 하나`라는 점이 `reduce()` 선택의
> 핵심이다.

## 문제 8 해설

**정답: 3. total의 초기값**

```ts
cart.reduce((total, item) => {
  // ...
}, 0);
```

마지막 `0`에서 누적을 시작한다.

```text
0
↓
39800
↓
69700
```

> **팁**
>
> `reduce()`를 볼 때 callback만 보지 말고 마지막 초기값까지 반드시
> 확인한다.

## 문제 9 해설

**정답: 2**

### 정답 이유

`setCart()`가 관리하는 React state와 `localStorage`는 서로 다른 저장
영역이다.

```text
setCart
→ 현재 UI state

localStorage
→ 브라우저에 저장된 데이터
```

state만 변경하면 화면은 정상적으로 바뀔 수 있지만, 새로고침 후 저장된
이전 값이 다시 로드될 수 있다.

> **팁**
>
> 장바구니 수정 기능은 `클릭 직후`와 `새로고침 후`를 모두 테스트한다.

## 문제 10 해설

**정답: 1**

```ts
Math.max(1, item.quantity - 1);
```

예를 들어 현재 수량이 1이면:

```text
item.quantity - 1
= 0

Math.max(1, 0)
= 1
```

따라서 최소 수량 1이 유지된다.

## 문제 11 해설 --- 코드 복원

**정답 예시**

```ts
const updatedCart = cart.map((item) =>
  item.productId === productId
    ? { ...item, quantity: item.quantity + 1 }
    : item,
);
```

### 복원 순서

```text
cart.map()
↓
item 하나씩 확인
↓
productId 비교
↓
같으면 새 객체
↓
quantity + 1
↓
다르면 기존 item
↓
updatedCart
```

> **팁**
>
> 코드를 통째로 외우기보다 `순회 → 비교 → 대상 수정 → 나머지 유지` 네
> 단계로 복원한다.

## 문제 12 해설 --- 흐름 복원

**정답**

```text
사용자가 + 클릭
↓
updatedCart 생성
↓
setCart(updatedCart)
↓
localStorage 업데이트
```

### 핵심 포인트

사용자 이벤트가 먼저 발생하고, 그 이벤트를 바탕으로 새로운 데이터를 만든
뒤 React state와 저장소에 반영한다.

> **팁**
>
> Day 4 실제 구현에서 코드가 막히면 이 순서를 먼저 주석으로 작성한 다음
> 코드를 채운다.

---

## 오답 복습 순서

1.  틀린 문제의 **정답 이유**를 확인한다.
2.  가장 헷갈린 오답과 정답의 **결과 형태**를 비교한다.
3.  GENERAL의 해당 메서드 설명으로 돌아간다.
4.  장바구니가 아닌 간단한 배열 예제로 한 번 다시 작성한다.
5.  다음 학습 시작 전에 문제만 다시 푼다.

## 최종 복습 기록

문제 결과 헷갈린 이유 다시 볼 핵심

---

문제 \[ \] O / X / △ \[이유\] `find/map/filter/reduce`
문제 \[ \] O / X / △ \[이유\] state / localStorage

> **팁**
>
> 정답을 맞혔더라도 이유를 설명할 수 없으면 `△`로 기록한다. 오늘의
> 목표는 선택지 번호가 아니라 데이터 흐름을 설명할 수 있는 상태가 되는
> 것이다.
