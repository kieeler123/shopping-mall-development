# Day 4 --- カート数量制限 / Cart Quantity Limits / 장바구니 수량 제한

# 日本語

## 1. `Math.max()` で最小数量を制限する

カートで数量を減らすとき、単純に次のように書くと、

``` tsx
quantity: item.quantity - 1
```

ユーザーが `-` ボタンを押し続けた場合、数量が `0`
や負の数まで下がる可能性がある。

``` text
3
↓
2
↓
1
↓
0
↓
-1
```

これを防ぐために `Math.max()` を使用できる。

``` tsx
quantity: Math.max(1, item.quantity - 1)
```

`Math.max()` は、渡された数字の中から最も大きい値を返す。

``` tsx
Math.max(1, 2)
```

結果：

``` text
2
```

> **Tip**
>
> `Math.max(最小値, 計算結果)`
> という形を見ると、「計算結果が最小値より小さくならないようにする」と考えると理解しやすい。

------------------------------------------------------------------------

## 2. quantity が 3 の場合

``` tsx
Math.max(1, 3 - 1)
```

まず引き算を行う。

``` tsx
Math.max(1, 2)
```

`1` と `2` の大きい方は `2` なので、結果は：

``` text
3
↓
2
```

となる。

> **Tip**
>
> 現在の数量が十分大きい場合、通常通り `-1` される。

------------------------------------------------------------------------

## 3. quantity が 2 の場合

``` tsx
Math.max(1, 2 - 1)
```

計算すると：

``` tsx
Math.max(1, 1)
```

結果：

``` text
1
```

つまり：

``` text
2
↓
1
```

となる。

> **Tip**
>
> この時点では通常の減少処理と同じ動きになる。

------------------------------------------------------------------------

## 4. quantity が 1 の場合

ここが `Math.max()` を使う重要なポイントである。

``` tsx
Math.max(1, 1 - 1)
```

計算すると：

``` tsx
Math.max(1, 0)
```

`1` と `0` の大きい方は `1` なので：

``` text
1
↓
- ボタン
↓
1
```

となる。

数量は `0` にならない。

> **Tip**
>
> 最初の `1` が「最小数量の防御ライン」として働いている。

------------------------------------------------------------------------

## 5. `handleDecrease` に適用する

``` tsx
const handleDecrease = (productId: number) => {
  setCart((prev) => {
    const updatedCart = prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.max(1, item.quantity - 1),
          }
        : item,
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    return updatedCart;
  });
};
```

処理の流れ：

``` text
- をクリック
↓
productId を渡す
↓
以前の cart を取得
↓
map() で対象商品を確認
↓
quantity - 1
↓
ただし最小値は 1
↓
updatedCart
↓
localStorage 保存
↓
新しい state として返す
```

> **Tip**
>
> `Math.max()` は `map()` の代わりではない。`map()`
> が「どの商品を変更するか」を担当し、`Math.max()`
> が「数量をどこまで下げられるか」を担当する。

------------------------------------------------------------------------

## 6. `if` 文で書くとどうなるか

同じ考え方は `if` 文でも表現できる。

``` tsx
let newQuantity;

if (item.quantity - 1 < 1) {
  newQuantity = 1;
} else {
  newQuantity = item.quantity - 1;
}
```

これを簡潔に表現したものが：

``` tsx
Math.max(1, item.quantity - 1)
```

である。

> **Tip**
>
> `Math.max()` が分かりにくい場合は、最初に `if`
> 文へ展開して考えてから短い形へ戻すと理解しやすい。

------------------------------------------------------------------------

## 7. `Math.min()` で最大数量を制限する

反対に、商品の最大購入数量を制限したい場合は `Math.min()` を使用できる。

例えば最大数量を `10` にする。

``` tsx
quantity: Math.min(10, item.quantity + 1)
```

`Math.min()` は、渡された数字の中から最も小さい値を返す。

``` tsx
Math.min(10, 7)
```

結果：

``` text
7
```

> **Tip**
>
> `Math.min(最大値, 計算結果)`
> は「計算結果が最大値を超えないようにする」と考える。

------------------------------------------------------------------------

## 8. quantity が 9 の場合

``` tsx
Math.min(10, 9 + 1)
```

計算すると：

``` tsx
Math.min(10, 10)
```

結果：

``` text
10
```

つまり：

``` text
9
↓
+ ボタン
↓
10
```

となる。

> **Tip**
>
> 最大値に到達するまでは通常通り数量を増やせる。

------------------------------------------------------------------------

## 9. quantity が 10 の場合

``` tsx
Math.min(10, 10 + 1)
```

計算すると：

``` tsx
Math.min(10, 11)
```

`10` と `11` の小さい方は `10`。

したがって：

``` text
10
↓
+ ボタン
↓
10
```

となる。

> **Tip**
>
> `10` が最大数量の上限として働き、それ以上増えない。

------------------------------------------------------------------------

## 10. `handleIncrease` に `Math.min()` を適用する

``` tsx
const handleIncrease = (productId: number) => {
  setCart((prev) => {
    const updatedCart = prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.min(10, item.quantity + 1),
          }
        : item,
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    return updatedCart;
  });
};
```

流れ：

``` text
+ をクリック
↓
対象商品を map() で確認
↓
quantity + 1
↓
ただし最大値は 10
↓
updatedCart
↓
localStorage 保存
↓
state 更新
```

> **Tip**
>
> 最大数量 `10`
> は学習用のルールである。実際のショッピングモールでは在庫数や商品ごとの購入制限を使う場合がある。

------------------------------------------------------------------------

## 11. `Math.max()` と `Math.min()` を一緒に理解する

今回のカートでは：

``` tsx
Math.max(1, item.quantity - 1)
```

は最小数量を守り、

``` tsx
Math.min(10, item.quantity + 1)
```

は最大数量を守る。

まとめると：

  関数                  カートでの役割
  --------------------- ----------------------
  `Math.max(1, ...)`    1より小さくならない
  `Math.min(10, ...)`   10より大きくならない

結果として数量は：

``` text
1 ≤ quantity ≤ 10
```

の範囲に保たれる。

> **Tip**
>
> `max = 下限を守る`, `min = 上限を守る` と機能で覚えると混乱しにくい。

------------------------------------------------------------------------

# English

## 1. Use `Math.max()` to Enforce a Minimum Quantity

If we simply decrease quantity like this:

``` tsx
quantity: item.quantity - 1
```

repeated clicks can produce:

``` text
3
↓
2
↓
1
↓
0
↓
-1
```

To prevent that, we can use:

``` tsx
quantity: Math.max(1, item.quantity - 1)
```

`Math.max()` returns the largest value among its arguments.

``` tsx
Math.max(1, 2)
```

returns:

``` text
2
```

> **Tip**
>
> Read `Math.max(minimum, calculatedValue)` as "do not let the
> calculated value go below the minimum."

------------------------------------------------------------------------

## 2. When quantity Is 3

``` tsx
Math.max(1, 3 - 1)
```

becomes:

``` tsx
Math.max(1, 2)
```

and returns `2`.

``` text
3
↓
2
```

> **Tip**
>
> When quantity is safely above the minimum, it behaves like a normal
> `-1`.

------------------------------------------------------------------------

## 3. When quantity Is 2

``` tsx
Math.max(1, 2 - 1)
```

becomes:

``` tsx
Math.max(1, 1)
```

and returns `1`.

``` text
2
↓
1
```

> **Tip**
>
> At this point the minimum boundary has been reached.

------------------------------------------------------------------------

## 4. When quantity Is 1

``` tsx
Math.max(1, 1 - 1)
```

becomes:

``` tsx
Math.max(1, 0)
```

The larger value is `1`.

``` text
1
↓
click -
↓
1
```

Quantity never reaches zero.

> **Tip**
>
> The first argument, `1`, acts as the lower boundary.

------------------------------------------------------------------------

## 5. Applying It to `handleDecrease`

``` tsx
const handleDecrease = (productId: number) => {
  setCart((prev) => {
    const updatedCart = prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.max(1, item.quantity - 1),
          }
        : item,
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    return updatedCart;
  });
};
```

Flow:

``` text
click -
↓
pass productId
↓
receive previous cart
↓
find target with map()
↓
quantity - 1
↓
minimum is 1
↓
updatedCart
↓
save to localStorage
↓
return next state
```

> **Tip**
>
> `map()` decides which item changes. `Math.max()` decides how far its
> quantity is allowed to decrease.

------------------------------------------------------------------------

## 6. The Equivalent `if` Statement

The same rule could be written as:

``` tsx
let newQuantity;

if (item.quantity - 1 < 1) {
  newQuantity = 1;
} else {
  newQuantity = item.quantity - 1;
}
```

The shorter expression is:

``` tsx
Math.max(1, item.quantity - 1)
```

> **Tip**
>
> If `Math.max()` feels abstract, expand it into an `if` statement first
> and then return to the shorter form.

------------------------------------------------------------------------

## 7. Use `Math.min()` to Enforce a Maximum Quantity

To limit the maximum purchase quantity, we can use `Math.min()`.

For example, if the maximum is `10`:

``` tsx
quantity: Math.min(10, item.quantity + 1)
```

`Math.min()` returns the smallest value among its arguments.

``` tsx
Math.min(10, 7)
```

returns:

``` text
7
```

> **Tip**
>
> Read `Math.min(maximum, calculatedValue)` as "do not let the
> calculated value exceed the maximum."

------------------------------------------------------------------------

## 8. When quantity Is 9

``` tsx
Math.min(10, 9 + 1)
```

becomes:

``` tsx
Math.min(10, 10)
```

and returns `10`.

``` text
9
↓
click +
↓
10
```

> **Tip**
>
> Quantity increases normally until it reaches the upper boundary.

------------------------------------------------------------------------

## 9. When quantity Is 10

``` tsx
Math.min(10, 10 + 1)
```

becomes:

``` tsx
Math.min(10, 11)
```

The smaller value is `10`.

``` text
10
↓
click +
↓
10
```

> **Tip**
>
> The value `10` now acts as the upper boundary.

------------------------------------------------------------------------

## 10. Applying `Math.min()` to `handleIncrease`

``` tsx
const handleIncrease = (productId: number) => {
  setCart((prev) => {
    const updatedCart = prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.min(10, item.quantity + 1),
          }
        : item,
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    return updatedCart;
  });
};
```

Flow:

``` text
click +
↓
find target item with map()
↓
quantity + 1
↓
maximum is 10
↓
updatedCart
↓
save to localStorage
↓
update state
```

> **Tip**
>
> The limit of `10` is a learning example. A real store may use
> inventory or product-specific purchase limits.

------------------------------------------------------------------------

## 11. Understanding `Math.max()` and `Math.min()` Together

For this cart:

``` tsx
Math.max(1, item.quantity - 1)
```

protects the minimum, while:

``` tsx
Math.min(10, item.quantity + 1)
```

protects the maximum.

  Function              Cart responsibility
  --------------------- ---------------------
  `Math.max(1, ...)`    Never go below 1
  `Math.min(10, ...)`   Never go above 10

The quantity stays within:

``` text
1 ≤ quantity ≤ 10
```

> **Tip**
>
> Remember the purpose rather than only the names: `max` protects the
> lower bound here, while `min` protects the upper bound.

------------------------------------------------------------------------

# 한국어

## 1. `Math.max()`로 최소 수량 제한하기

장바구니에서 단순히:

``` tsx
quantity: item.quantity - 1
```

만 사용하면 `-` 버튼을 계속 눌렀을 때:

``` text
3
↓
2
↓
1
↓
0
↓
-1
```

처럼 수량이 0 이하로 내려갈 수 있다.

이를 막기 위해:

``` tsx
quantity: Math.max(1, item.quantity - 1)
```

을 사용할 수 있다.

`Math.max()`는 전달받은 숫자 중 가장 큰 값을 반환한다.

``` tsx
Math.max(1, 2)
```

결과:

``` text
2
```

> **팁**
>
> `Math.max(최솟값, 계산값)`을 보면
> `계산 결과가 최솟값보다 내려가지 않도록 막는다`라고 이해하면 쉽다.

------------------------------------------------------------------------

## 2. quantity가 3일 때

``` tsx
Math.max(1, 3 - 1)
```

먼저 계산하면:

``` tsx
Math.max(1, 2)
```

`1`과 `2` 중 큰 값은 `2`다.

``` text
3
↓
2
```

> **팁**
>
> 현재 수량이 최솟값보다 충분히 크다면 평범한 `-1`처럼 동작한다.

------------------------------------------------------------------------

## 3. quantity가 2일 때

``` tsx
Math.max(1, 2 - 1)
```

계산하면:

``` tsx
Math.max(1, 1)
```

결과는 `1`.

``` text
2
↓
1
```

> **팁**
>
> 여기까지는 일반적인 감소와 동일하고, 이제 최소 경계에 도착한 상태다.

------------------------------------------------------------------------

## 4. quantity가 1일 때

이 부분에서 `Math.max()`의 역할이 확실하게 보인다.

``` tsx
Math.max(1, 1 - 1)
```

계산하면:

``` tsx
Math.max(1, 0)
```

`1`과 `0` 중 큰 값은 `1`이다.

``` text
1
↓
- 클릭
↓
1
```

따라서 수량이 0이 되지 않는다.

> **팁**
>
> 첫 번째 값 `1`이 최소 수량을 지키는 방어선 역할을 한다.

------------------------------------------------------------------------

## 5. `handleDecrease`에 적용하기

``` tsx
const handleDecrease = (productId: number) => {
  setCart((prev) => {
    const updatedCart = prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.max(1, item.quantity - 1),
          }
        : item,
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    return updatedCart;
  });
};
```

전체 흐름:

``` text
- 클릭
↓
productId 전달
↓
이전 cart 받기
↓
map()으로 대상 상품 확인
↓
quantity - 1
↓
단, 최소값은 1
↓
updatedCart
↓
localStorage 저장
↓
새 state 반환
```

> **팁**
>
> `map()`과 `Math.max()`의 역할을 구분하자. `map()`은 어떤 상품을 바꿀지
> 결정하고, `Math.max()`는 그 상품의 수량이 어디까지 내려갈 수 있는지
> 결정한다.

------------------------------------------------------------------------

## 6. `if`문으로 표현하면?

같은 로직을 길게 쓰면:

``` tsx
let newQuantity;

if (item.quantity - 1 < 1) {
  newQuantity = 1;
} else {
  newQuantity = item.quantity - 1;
}
```

이걸 간단하게 표현한 것이:

``` tsx
Math.max(1, item.quantity - 1)
```

이라고 볼 수 있다.

> **팁**
>
> `Math.max()`가 헷갈릴 때는 먼저 `if`문으로 풀어서 생각한 다음 짧은
> 표현으로 돌아오면 이해하기 쉽다.

------------------------------------------------------------------------

## 7. `Math.min()`으로 최대 수량 제한하기

반대로 최대 구매 수량을 제한하려면 `Math.min()`을 사용할 수 있다.

예를 들어 최대 수량이 `10`개라면:

``` tsx
quantity: Math.min(10, item.quantity + 1)
```

`Math.min()`은 전달받은 숫자 중 가장 작은 값을 반환한다.

``` tsx
Math.min(10, 7)
```

결과:

``` text
7
```

> **팁**
>
> `Math.min(최댓값, 계산값)`을 보면
> `계산 결과가 최댓값을 넘지 못하게 막는다`라고 이해하면 된다.

------------------------------------------------------------------------

## 8. quantity가 9일 때

``` tsx
Math.min(10, 9 + 1)
```

계산하면:

``` tsx
Math.min(10, 10)
```

결과:

``` text
10
```

즉:

``` text
9
↓
+ 클릭
↓
10
```

이 된다.

> **팁**
>
> 최대 수량에 도달하기 전까지는 평범하게 `+1` 된다.

------------------------------------------------------------------------

## 9. quantity가 10일 때

``` tsx
Math.min(10, 10 + 1)
```

계산하면:

``` tsx
Math.min(10, 11)
```

`10`과 `11` 중 작은 값은 `10`이다.

따라서:

``` text
10
↓
+ 클릭
↓
10
```

이 된다.

> **팁**
>
> 여기서는 `10`이 최대 수량의 방어선 역할을 한다.

------------------------------------------------------------------------

## 10. `handleIncrease`에 `Math.min()` 적용하기

``` tsx
const handleIncrease = (productId: number) => {
  setCart((prev) => {
    const updatedCart = prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.min(10, item.quantity + 1),
          }
        : item,
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    return updatedCart;
  });
};
```

전체 흐름:

``` text
+ 클릭
↓
map()으로 대상 상품 확인
↓
quantity + 1
↓
단, 최대값은 10
↓
updatedCart
↓
localStorage 저장
↓
state 업데이트
```

> **팁**
>
> 여기서 `10`은 학습용 최대 수량이다. 실제 쇼핑몰에서는 재고 수량이나
> 상품별 구매 제한을 기준으로 최대 수량을 정할 수 있다.

------------------------------------------------------------------------

## 11. `Math.max()`와 `Math.min()` 같이 이해하기

현재 장바구니에서:

``` tsx
Math.max(1, item.quantity - 1)
```

은 최소 수량을 지킨다.

반대로:

``` tsx
Math.min(10, item.quantity + 1)
```

은 최대 수량을 지킨다.

  함수                  장바구니에서의 역할
  --------------------- -------------------------------
  `Math.max(1, ...)`    수량이 1보다 작아지지 않게 함
  `Math.min(10, ...)`   수량이 10보다 커지지 않게 함

결국 수량은:

``` text
1 ≤ quantity ≤ 10
```

범위 안에서 유지된다.

> **팁**
>
> 이름 때문에 헷갈릴 수 있으니 기능으로 기억하자. 이 사용법에서는
> `Math.max()`가 아래쪽 경계를 지키고, `Math.min()`이 위쪽 경계를
> 지킨다.
