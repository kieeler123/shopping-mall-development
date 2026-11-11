# React State Functional Updates --- `setCart((prev) => ...)`

# 日本語

## 1. `setCart((prev) => ...)` はなぜ使うのか

Day 4 のカート数量変更では、次のようなコードを使用する。

``` tsx
const handleIncrease = (productId: number) => {
  setCart((prev) =>
    prev.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    ),
  );
};
```

ここで重要なのは次の部分である。

``` tsx
setCart((prev) => ...)
```

これは、**以前の state をもとに次の state を作る関数型更新（functional
update）**である。

> **Tip**
>
> 新しい state を計算するために以前の state
> が必要なら、`setState((prev) => ...)` という形を思い出す。

------------------------------------------------------------------------

## 2. 新しい値を直接渡す方法

state は新しい値を直接渡して変更することもできる。

``` tsx
const [count, setCount] = useState(0);

setCount(10);
```

流れは次の通り。

``` text
以前の count = 0

setCount(10)
    ↓
新しい count = 10
```

この場合、新しい値 `10` を作るために以前の `count` を使う必要はない。

> **Tip**
>
> 次の値が以前の state と関係ない場合は、setter
> に値を直接渡す方法でもよい。

------------------------------------------------------------------------

## 3. カートの数量変更では以前の state が必要

例えば現在のカートが次の状態だとする。

``` tsx
[
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
]
```

1番の商品を1個増やすには、現在の数量を確認する必要がある。

``` text
以前の cart を確認
    ↓
productId = 1 を探す
    ↓
現在 quantity = 2
    ↓
2 + 1
    ↓
quantity = 3
```

つまり、次の state を作る材料として以前の state が必要である。

そこで、

``` tsx
setCart((prev) => ...)
```

を使用する。

> **Tip**
>
> `setCart((prev) => ...)` を「以前の cart を受け取って、新しい cart
> を返す」と読むと理解しやすい。

------------------------------------------------------------------------

## 4. `prev` はどこから来るのか

`prev` を自分で宣言していなくても使用できる。

``` tsx
setCart((prev) => ...)
```

ここでは `setCart` に値ではなく**関数**を渡している。

React はその関数を実行するとき、更新時点の以前の state
を引数として渡す。

概念的には次の流れである。

``` text
React
  ↓
setCart に渡された関数を実行
  ↓
以前の cart state を引数として渡す
  ↓
prev がその値を受け取る
```

例えば、

``` tsx
cart = [
  { productId: 1, quantity: 2 }
];
```

なら、`prev` は概念的に次の値を受け取る。

``` tsx
[
  { productId: 1, quantity: 2 }
]
```

> **Tip**
>
> `prev` は予約語ではない。`previousCart`、`oldCart`
> など別の名前でもよい。重要なのは「以前の state
> を受け取る引数」という役割である。

------------------------------------------------------------------------

## 5. `cart.map()` を直接使う方法との違い

次のように書くこともできる。

``` tsx
const updatedCart = cart.map((item) =>
  item.productId === productId
    ? { ...item, quantity: item.quantity + 1 }
    : item,
);

setCart(updatedCart);
```

多くの場合、このコードも正常に動作する。

しかし数量増加のように、

``` text
以前の quantity
+
1
=
新しい quantity
```

と、以前の state をもとに次の state を計算する場合は、

``` tsx
setCart((prev) => ...)
```

という関数型更新が適している。

> **Tip**
>
> 学習段階では「以前の state を使って次の state を作る →
> 関数型更新」と覚えるとよい。

------------------------------------------------------------------------

## 6. `handleIncrease` を1行ずつ読む

### 以前の cart を受け取る

``` tsx
setCart((prev) =>
```

意味：

``` text
以前の cart を prev として受け取る
```

### すべての商品を確認する

``` tsx
prev.map((item) =>
```

意味：

``` text
以前の cart の item を1件ずつ確認する
```

### 変更対象か確認する

``` tsx
item.productId === productId
```

意味：

``` text
現在の item は + ボタンを押した商品か？
```

### 対象なら数量を増やす

``` tsx
{ ...item, quantity: item.quantity + 1 }
```

意味：

``` text
既存情報を維持
+
quantity だけ 1 増加
```

### 対象でなければそのまま返す

``` tsx
: item
```

意味：

``` text
変更対象ではない商品はそのまま維持
```

全体の流れ：

``` text
以前の cart
    ↓
map()
    ↓
各 item の productId を確認
    ↓
対象商品 → quantity + 1
その他   → そのまま
    ↓
新しい配列
    ↓
setCart
    ↓
state 更新
```

> **Tip**
>
> コード全体を暗記せず、「以前の状態を受け取る → 全体を確認 →
> 対象だけ変更 → 新しい配列を返す」の4段階で読む。

------------------------------------------------------------------------

## 7. `map()` の結果をそのまま返せる理由

`map()` は新しい配列を返す。

そのため、

``` tsx
setCart((prev) =>
  prev.map(...)
);
```

では、`prev.map(...)` の結果である新しい `CartItem[]` が、そのまま次の
cart state になる。

概念的には次の形である。

``` text
setCart(
  以前の cart
    ↓
  新しい cart を作る
    ↓
  新しい cart を返す
)
```

> **Tip**
>
> `setCart((prev) => ...)` のコールバックでは、最終的に「次の cart
> state」が返されているかを確認する。

------------------------------------------------------------------------

## 8. Day 4 での理解ポイント

今回の `handleIncrease` は次の状態管理フローを学ぶためのコードである。

``` text
ユーザーが + をクリック
    ↓
productId を渡す
    ↓
以前の cart state を取得
    ↓
map() で対象商品を探す
    ↓
quantity + 1
    ↓
新しい cart 配列を作る
    ↓
setCart()
    ↓
再レンダリング
```

> **Tip**
>
> `setCart((prev) => ...)`
> を文法として暗記するより、「現在ある状態を材料にして次の状態を作る仕組み」と理解する。

------------------------------------------------------------------------

# English

## 1. Why Use `setCart((prev) => ...)`?

For the Day 4 cart quantity update, we can use:

``` tsx
const handleIncrease = (productId: number) => {
  setCart((prev) =>
    prev.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    ),
  );
};
```

The important part is:

``` tsx
setCart((prev) => ...)
```

This is a **functional state update**: the next state is calculated from
the previous state.

> **Tip**
>
> When the next state depends on the previous state, think of
> `setState((prev) => ...)`.

------------------------------------------------------------------------

## 2. Passing a New Value Directly

A state setter can also receive a value directly.

``` tsx
const [count, setCount] = useState(0);

setCount(10);
```

The flow is:

``` text
previous count = 0

setCount(10)
    ↓
new count = 10
```

The new value does not need the previous value.

> **Tip**
>
> If the next value does not depend on the previous state, passing a
> value directly is often sufficient.

------------------------------------------------------------------------

## 3. Cart Quantity Updates Need the Previous State

Suppose the current cart is:

``` tsx
[
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
]
```

To increase product 1, we first need its current quantity.

``` text
check previous cart
    ↓
find productId = 1
    ↓
current quantity = 2
    ↓
2 + 1
    ↓
quantity = 3
```

The previous state is therefore an input for creating the next state.

That is why we use:

``` tsx
setCart((prev) => ...)
```

> **Tip**
>
> Read this as: "Give me the previous cart so I can create the next
> cart."

------------------------------------------------------------------------

## 4. Where Does `prev` Come From?

We never manually declare `prev`.

``` tsx
setCart((prev) => ...)
```

This works because we pass a **function** to `setCart`.

When React runs that function, it provides the previous state as its
argument.

Conceptually:

``` text
React
  ↓
runs the function passed to setCart
  ↓
passes the previous cart state
  ↓
prev receives that value
```

If the current cart is:

``` tsx
[
  { productId: 1, quantity: 2 }
]
```

then `prev` conceptually receives that array.

> **Tip**
>
> `prev` is not a reserved word. You could use `previousCart` or another
> meaningful parameter name.

------------------------------------------------------------------------

## 5. Difference from Using `cart.map()` Directly

This is also possible:

``` tsx
const updatedCart = cart.map((item) =>
  item.productId === productId
    ? { ...item, quantity: item.quantity + 1 }
    : item,
);

setCart(updatedCart);
```

This can work correctly in many situations.

However, quantity increase follows this relationship:

``` text
previous quantity
+
1
=
next quantity
```

Because the next state depends on the previous state, the functional
form:

``` tsx
setCart((prev) => ...)
```

is a natural choice.

> **Tip**
>
> A useful learning rule is: previous state needed → consider a
> functional update.

------------------------------------------------------------------------

## 6. Reading `handleIncrease` Line by Line

### Receive the previous cart

``` tsx
setCart((prev) =>
```

Meaning:

``` text
receive the previous cart as prev
```

### Inspect every item

``` tsx
prev.map((item) =>
```

Meaning:

``` text
check each item in the previous cart
```

### Check whether it is the target

``` tsx
item.productId === productId
```

Meaning:

``` text
is this the product whose + button was clicked?
```

### Increase the target quantity

``` tsx
{ ...item, quantity: item.quantity + 1 }
```

Meaning:

``` text
keep existing information
+
increase only quantity by 1
```

### Keep other items unchanged

``` tsx
: item
```

Overall:

``` text
previous cart
    ↓
map()
    ↓
check each productId
    ↓
target → quantity + 1
others → unchanged
    ↓
new array
    ↓
setCart
    ↓
state update
```

> **Tip**
>
> Instead of memorizing the code, read it as four steps: receive
> previous state → inspect items → update the target → return a new
> array.

------------------------------------------------------------------------

## 7. Why Can `map()` Be Returned Directly?

`map()` returns a new array.

Therefore:

``` tsx
setCart((prev) =>
  prev.map(...)
);
```

returns the new `CartItem[]` directly as the next cart state.

Conceptually:

``` text
setCart(
  previous cart
      ↓
  create next cart
      ↓
  return next cart
)
```

> **Tip**
>
> When using a functional setter, check what the callback finally
> returns. That return value becomes the next state.

------------------------------------------------------------------------

## 8. Day 4 Learning Flow

The `handleIncrease` function represents this state-management flow:

``` text
user clicks +
    ↓
pass productId
    ↓
receive previous cart state
    ↓
use map() to inspect items
    ↓
quantity + 1 for the target
    ↓
create a new cart array
    ↓
setCart()
    ↓
re-render
```

> **Tip**
>
> Understand `setCart((prev) => ...)` as a mechanism for creating the
> next state from the current state, rather than memorizing it as
> syntax.

------------------------------------------------------------------------

# 한국어

## 1. `setCart((prev) => ...)`는 왜 사용할까?

Day 4 장바구니 수량 증가에서 다음 코드를 사용할 수 있다.

``` tsx
const handleIncrease = (productId: number) => {
  setCart((prev) =>
    prev.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    ),
  );
};
```

핵심은:

``` tsx
setCart((prev) => ...)
```

이다.

이 방식은 **이전 state를 기준으로 다음 state를 계산하는 함수형
업데이트(functional update)**다.

> **팁**
>
> 새로운 state를 계산하는 데 이전 state가 필요하다면
> `setState((prev) => ...)` 형태를 떠올리면 된다.

------------------------------------------------------------------------

## 2. 새로운 값을 직접 넣는 방법

state setter에는 새로운 값을 직접 전달할 수도 있다.

``` tsx
const [count, setCount] = useState(0);

setCount(10);
```

흐름은:

``` text
이전 count = 0

setCount(10)
    ↓
새로운 count = 10
```

이다.

새로운 값 `10`을 만드는 데 이전 `count`가 필요하지 않다.

> **팁**
>
> 새로운 값이 이전 state와 관계없다면 setter에 값을 직접 전달해도 된다.

------------------------------------------------------------------------

## 3. 카트 수량 변경에서는 이전 state가 필요하다

현재 장바구니가 다음과 같다고 하자.

``` tsx
[
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
]
```

1번 상품을 하나 증가시키려면 현재 수량을 먼저 알아야 한다.

``` text
이전 cart 확인
    ↓
productId = 1 찾기
    ↓
현재 quantity = 2
    ↓
2 + 1
    ↓
quantity = 3
```

즉 새로운 state를 만드는 재료로 이전 state가 필요하다.

그래서:

``` tsx
setCart((prev) => ...)
```

를 사용한다.

> **팁**
>
> 이 코드를 `이전 cart를 받아서 새로운 cart를 만든다`라고 읽으면
> 이해하기 쉽다.

------------------------------------------------------------------------

## 4. `prev`는 어디서 나오는가?

우리는 따로:

``` tsx
const prev = ...
```

라고 선언하지 않았다.

그런데도:

``` tsx
setCart((prev) => ...)
```

가 가능한 이유는 `setCart`에 **함수**를 전달하기 때문이다.

React가 이 함수를 실행할 때 업데이트 시점의 이전 state를 인수로
넣어준다.

개념적인 흐름은:

``` text
React
  ↓
setCart에 전달한 함수 실행
  ↓
이전 cart state 전달
  ↓
prev가 그 값을 받음
```

이다.

예를 들어 현재 cart가:

``` tsx
[
  { productId: 1, quantity: 2 }
]
```

라면 `prev`는 개념적으로 이 배열을 받는다.

> **팁**
>
> `prev`는 예약어가 아니다. `previousCart`, `oldCart` 등으로 바꿔도
> 된다. 중요한 것은 `이전 state를 받는 매개변수`라는 역할이다.

------------------------------------------------------------------------

## 5. 그냥 `cart.map()`을 사용하는 것과 차이는?

다음처럼 작성할 수도 있다.

``` tsx
const updatedCart = cart.map((item) =>
  item.productId === productId
    ? { ...item, quantity: item.quantity + 1 }
    : item,
);

setCart(updatedCart);
```

이 방식도 많은 상황에서 정상적으로 동작한다.

하지만 수량 증가는:

``` text
이전 quantity
+
1
=
새로운 quantity
```

처럼 이전 state를 기준으로 다음 state를 계산한다.

따라서:

``` tsx
setCart((prev) => ...)
```

형태의 함수형 업데이트가 잘 맞는다.

> **팁**
>
> 처음에는
> `이전 state가 다음 state 계산에 필요하다 → 함수형 업데이트`라는
> 기준으로 판단하면 충분하다.

------------------------------------------------------------------------

## 6. `handleIncrease`를 한 줄씩 읽기

### 이전 cart 받기

``` tsx
setCart((prev) =>
```

의미:

``` text
이전 cart를 prev로 받는다
```

### 모든 상품 확인

``` tsx
prev.map((item) =>
```

의미:

``` text
이전 cart의 item을 하나씩 확인한다
```

### 수정 대상인지 확인

``` tsx
item.productId === productId
```

의미:

``` text
현재 item이 + 버튼을 누른 상품인가?
```

### 대상이라면 수량 증가

``` tsx
{ ...item, quantity: item.quantity + 1 }
```

의미:

``` text
기존 정보 유지
+
quantity만 1 증가
```

### 대상이 아니라면 그대로 유지

``` tsx
: item
```

전체 흐름은:

``` text
이전 cart
    ↓
map()
    ↓
각 item의 productId 확인
    ↓
대상 상품 → quantity + 1
다른 상품 → 그대로
    ↓
새로운 배열
    ↓
setCart
    ↓
state 업데이트
```

이다.

> **팁**
>
> 코드를 통째로 외우지 말고
> `이전 상태 받기 → 전체 검사 → 대상만 변경 → 새 배열 반환`의 네 단계로
> 읽는다.

------------------------------------------------------------------------

## 7. `map()` 결과를 바로 반환할 수 있는 이유

`map()`은 새로운 배열을 반환한다.

그래서:

``` tsx
setCart((prev) =>
  prev.map(...)
);
```

에서는 `prev.map(...)`이 만든 새로운 `CartItem[]`가 그대로 다음 cart
state가 된다.

개념적으로:

``` text
setCart(
  이전 cart
    ↓
  새로운 cart 생성
    ↓
  새로운 cart 반환
)
```

이라고 볼 수 있다.

> **팁**
>
> 함수형 setter를 사용할 때는 콜백 함수가 마지막에 무엇을 반환하는지
> 확인한다. 그 반환값이 다음 state가 된다.

------------------------------------------------------------------------

## 8. Day 4에서 이 코드가 의미하는 전체 흐름

`handleIncrease`는 단순히 수량을 1 올리는 코드가 아니라 다음 React 상태
관리 흐름을 연습하는 코드다.

``` text
사용자가 + 클릭
    ↓
productId 전달
    ↓
이전 cart state 받기
    ↓
map()으로 각 상품 확인
    ↓
대상 상품 quantity + 1
    ↓
새로운 cart 배열 생성
    ↓
setCart()
    ↓
재렌더링
```

> **팁**
>
> `setCart((prev) => ...)`를 문법으로 암기하기보다
> `현재 상태를 재료로 다음 상태를 만드는 방식`이라고 이해하면 이후
> `setCount`, `setTodos`, `setUsers` 같은 다른 state에도 그대로 적용할
> 수 있다.
