# `map()`・三項演算子・callback return の関係
## 日本語 → English → 한국어

---

# 1. 日本語

## `map()` と三項演算子の `return` の関係

次のコードを見てみましょう。

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "キャンセル完了",
      }
    : order
);
```

このコードで最も重要なのは、

> **三項演算子が選んだ値が、そのまま `map()` の callback の return 値になる**

という点です。

---

## 1. `map()` は各要素ごとに値を返す

まず基本形は次の通りです。

```tsx
const updatedOrders = orders.map((order) => {
  return ???;
});
```

`map()` は配列の各要素に対して callback を実行し、
その callback が返した値を使って新しい配列を作ります。

例：

```tsx
const numbers = [1, 2, 3];

const doubled = numbers.map((number) => {
  return number * 2;
});
```

結果：

```tsx
[2, 4, 6]
```

流れ：

```text
1 → return 2
2 → return 4
3 → return 6

↓
[2, 4, 6]
```

**Tip**

`map()` を見たら、

> 各要素が最終的に何として return されるのか？

を確認すると理解しやすくなります。

---

## 2. 注文コードを `if` 文で書くと分かりやすい

次のコード：

```tsx
const updatedOrders = orders.map((order) => {
  if (order.id === orderId) {
    return {
      ...order,
      status: "キャンセル完了",
    };
  }

  return order;
});
```

意味はシンプルです。

```text
現在の注文がキャンセル対象か？
          │
     ┌────┴────┐
    YES        NO
     │          │
     ▼          ▼
変更した注文    元の注文
を return      を return
```

つまりすべての注文は、必ずどちらかの値として return されます。

**Tip**

`map()` では「すべての要素に対して何を返すか」が重要です。

---

## 3. `if` 文を三項演算子にするとこうなる

`if` 文：

```tsx
if (order.id === orderId) {
  return {
    ...order,
    status: "キャンセル完了",
  };
}

return order;
```

これを三項演算子にすると：

```tsx
return order.id === orderId
  ? {
      ...order,
      status: "キャンセル完了",
    }
  : order;
```

三項演算子の基本形は：

```tsx
condition ? A : B
```

です。

意味：

```text
condition が true
→ A

condition が false
→ B
```

ここでは：

```text
order.id === orderId
        ↓

true
→ 変更した注文オブジェクト

false
→ 元の order
```

となります。

**Tip**

三項演算子を見たら、

```text
条件 ? true のときの値 : false のときの値
```

と読みます。

---

## 4. 三項演算子は「値」を返す式

例えば：

```tsx
const result = true ? "YES" : "NO";
```

結果：

```tsx
result === "YES"
```

つまり三項演算子は、2つの候補から1つの値を選びます。

注文コードでは：

```tsx
order.id === orderId
  ? modifiedOrder
  : order
```

が、

```text
変更した注文
または
元の注文
```

のどちらか1つを結果として作ります。

その結果が callback の return 値になります。

---

## 5. 1002番の注文を追跡する

例えば：

```tsx
order = {
  id: 1002,
  status: "支払い完了",
};

orderId = 1002;
```

条件：

```tsx
order.id === orderId
```

実際には：

```tsx
1002 === 1002
```

なので：

```tsx
true
```

です。

そのため `?` 側が選ばれます。

```tsx
{
  ...order,
  status: "キャンセル完了",
}
```

これは実質的に：

```tsx
return {
  ...order,
  status: "キャンセル完了",
};
```

と同じです。

---

## 6. 1001番の注文の場合

```tsx
1001 === 1002
```

は：

```tsx
false
```

です。

そのため `:` 側：

```tsx
order
```

が選ばれます。

つまり：

```tsx
return order;
```

と同じです。

---

## 7. 全体の流れ

```text
orders = [1001, 1002, 1003]

map 開始
│
├─ 1001
│   false
│   → return order
│
├─ 1002
│   true
│   → return 更新された注文
│
└─ 1003
    false
    → return order

        ↓

updatedOrders
[
  1001 元の注文,
  1002 更新された注文,
  1003 元の注文
]
```

**Tip**

`map()` を一気に理解しようとせず、
callback が1回ずつ何を返しているか追跡すると簡単です。

---

## 8. Implicit Return と Explicit Return

### Explicit Return

`{}` を使う場合：

```tsx
const updatedOrders = orders.map((order) => {
  return order.id === orderId
    ? {
        ...order,
        status: "キャンセル完了",
      }
    : order;
});
```

ここでは `return` を自分で書きます。

---

### Implicit Return

`{}` を省略すると：

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "キャンセル完了",
      }
    : order
);
```

式の結果が自動的に return されます。

これは概念的に：

```tsx
(order) => {
  return (
    order.id === orderId
      ? {
          ...order,
          status: "キャンセル完了",
        }
      : order
  );
}
```

と同じです。

**Tip**

覚え方：

```text
() => 値
→ 自動 return

() => {
  return 値;
}
→ return を明示
```

---

## 9. よくあるミス

次のコードは問題があります。

```tsx
const updatedOrders = orders.map((order) => {
  order.id === orderId
    ? {
        ...order,
        status: "キャンセル完了",
      }
    : order;
});
```

`{}` を使っているのに `return` がありません。

そのため callback は実質的に：

```tsx
return undefined;
```

のようになり、

```tsx
[undefined, undefined, undefined]
```

のような結果になる可能性があります。

正しくは：

```tsx
const updatedOrders = orders.map((order) => {
  return order.id === orderId
    ? {
        ...order,
        status: "キャンセル完了",
      }
    : order;
});
```

または：

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "キャンセル完了",
      }
    : order
);
```

です。

---

## 最終 Mental Model

```text
map()
→ 各要素に callback を実行

三項演算子
→ 2つの値のうち1つを選ぶ

callback の return
→ 新しい配列の1要素になる
```

注文コードでは：

```text
キャンセル対象か？
↓
YES → 更新された注文を return
NO  → 元の注文を return
↓
map() が return 値を集めて新しい配列を作る
```

---

# 2. English

## Relationship between `map()`, the ternary operator, and `return`

Consider this code:

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "Cancelled",
      }
    : order
);
```

The key idea is:

> **The value selected by the ternary operator becomes the return value of the `map()` callback.**

---

## 1. `map()` returns one value for each element

Basic form:

```tsx
const updatedOrders = orders.map((order) => {
  return ???;
});
```

`map()` runs a callback for every element in the original array.

Each returned value becomes an element of the new array.

Example:

```tsx
const numbers = [1, 2, 3];

const doubled = numbers.map((number) => {
  return number * 2;
});
```

Result:

```tsx
[2, 4, 6]
```

Flow:

```text
1 → return 2
2 → return 4
3 → return 6

↓
[2, 4, 6]
```

**Tip**

Whenever you read `map()`, ask:

> What does each element become after the callback returns?

---

## 2. The order code is easier to understand with `if`

```tsx
const updatedOrders = orders.map((order) => {
  if (order.id === orderId) {
    return {
      ...order,
      status: "Cancelled",
    };
  }

  return order;
});
```

Meaning:

```text
Is this the target order?
          │
     ┌────┴────┐
    YES        NO
     │          │
     ▼          ▼
return the     return the
updated order  original order
```

Every callback call must produce one result.

**Tip**

With `map()`, always focus on what gets returned for every element.

---

## 3. Replacing `if` with a ternary operator

The `if` version:

```tsx
if (order.id === orderId) {
  return {
    ...order,
    status: "Cancelled",
  };
}

return order;
```

can be written as:

```tsx
return order.id === orderId
  ? {
      ...order,
      status: "Cancelled",
    }
  : order;
```

The basic ternary form is:

```tsx
condition ? A : B
```

Meaning:

```text
condition is true
→ A

condition is false
→ B
```

In our order example:

```text
order.id === orderId
        ↓

true
→ updated order object

false
→ original order
```

**Tip**

Read a ternary as:

```text
condition ? value if true : value if false
```

---

## 4. A ternary expression produces a value

Example:

```tsx
const result = true ? "YES" : "NO";
```

Result:

```tsx
result === "YES"
```

So a ternary expression chooses one of two values.

In the order code:

```tsx
order.id === orderId
  ? modifiedOrder
  : order
```

produces either:

```text
the modified order
or
the original order
```

That chosen value becomes the callback's return value.

---

## 5. Tracing order 1002

Suppose:

```tsx
order = {
  id: 1002,
  status: "Paid",
};

orderId = 1002;
```

Condition:

```tsx
order.id === orderId
```

becomes:

```tsx
1002 === 1002
```

which is:

```tsx
true
```

So the `?` branch is selected:

```tsx
{
  ...order,
  status: "Cancelled",
}
```

This is effectively:

```tsx
return {
  ...order,
  status: "Cancelled",
};
```

---

## 6. Tracing order 1001

```tsx
1001 === 1002
```

is:

```tsx
false
```

So the `:` branch:

```tsx
order
```

is selected.

That is effectively:

```tsx
return order;
```

---

## 7. Complete flow

```text
orders = [1001, 1002, 1003]

map starts
│
├─ 1001
│   false
│   → return original order
│
├─ 1002
│   true
│   → return updated order
│
└─ 1003
    false
    → return original order

        ↓

updatedOrders
[
  original 1001,
  updated 1002,
  original 1003
]
```

**Tip**

Do not try to understand the entire `map()` operation at once.

Trace one callback execution at a time.

---

## 8. Implicit Return vs Explicit Return

### Explicit Return

When using `{}`:

```tsx
const updatedOrders = orders.map((order) => {
  return order.id === orderId
    ? {
        ...order,
        status: "Cancelled",
      }
    : order;
});
```

You write `return` explicitly.

---

### Implicit Return

When `{}` is omitted:

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "Cancelled",
      }
    : order
);
```

the expression result is returned automatically.

Conceptually, it is the same as:

```tsx
(order) => {
  return (
    order.id === orderId
      ? {
          ...order,
          status: "Cancelled",
        }
      : order
  );
}
```

**Tip**

Remember:

```text
() => value
→ implicit return

() => {
  return value;
}
→ explicit return
```

---

## 9. Common mistake

This code is incorrect:

```tsx
const updatedOrders = orders.map((order) => {
  order.id === orderId
    ? {
        ...order,
        status: "Cancelled",
      }
    : order;
});
```

Because `{}` is used but there is no `return`.

The callback effectively returns:

```tsx
undefined
```

So the new array may look like:

```tsx
[undefined, undefined, undefined]
```

Correct versions:

```tsx
const updatedOrders = orders.map((order) => {
  return order.id === orderId
    ? {
        ...order,
        status: "Cancelled",
      }
    : order;
});
```

or:

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "Cancelled",
      }
    : order
);
```

---

## Final Mental Model

```text
map()
→ runs a callback for each element

ternary operator
→ selects one of two values

callback return value
→ becomes an element of the new array
```

For the order example:

```text
Is this the target order?
↓
YES → return updated order
NO  → return original order
↓
map() collects those return values into a new array
```

---

# 3. 한국어

## `map()`과 삼항연산자의 `return` 관계

다음 코드를 보자.

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "취소완료",
      }
    : order
);
```

이 코드에서 가장 중요한 핵심은:

> **삼항연산자가 선택한 결과값이 그대로 `map()` callback의 return 값이 된다.**

라는 것이다.

---

## 1. `map()`은 요소마다 하나의 값을 return한다

기본 형태는 다음과 같다.

```tsx
const updatedOrders = orders.map((order) => {
  return ???;
});
```

`map()`은 원본 배열의 각 요소마다 callback을 실행한다.

그리고 callback이 return한 값들을 모아서 새로운 배열을 만든다.

예:

```tsx
const numbers = [1, 2, 3];

const doubled = numbers.map((number) => {
  return number * 2;
});
```

결과:

```tsx
[2, 4, 6]
```

흐름:

```text
1 → return 2
2 → return 4
3 → return 6

↓
[2, 4, 6]
```

**팁**

`map()`을 볼 때는 항상:

> 각 요소가 최종적으로 무엇으로 return되는가?

를 먼저 확인하면 이해하기 쉽다.

---

## 2. 주문 코드를 `if`문으로 풀어보면 쉽다

```tsx
const updatedOrders = orders.map((order) => {
  if (order.id === orderId) {
    return {
      ...order,
      status: "취소완료",
    };
  }

  return order;
});
```

의미:

```text
현재 주문이 취소 대상인가?
          │
     ┌────┴────┐
    YES        NO
     │          │
     ▼          ▼
수정된 주문    기존 order
return         return
```

즉 배열의 모든 주문은 반드시 둘 중 하나의 값으로 return된다.

**팁**

`map()`에서는 모든 요소가 새 배열에서 무엇이 될지를 결정해야 한다.

---

## 3. `if`문을 삼항연산자로 줄이면

`if` 버전:

```tsx
if (order.id === orderId) {
  return {
    ...order,
    status: "취소완료",
  };
}

return order;
```

삼항연산자 버전:

```tsx
return order.id === orderId
  ? {
      ...order,
      status: "취소완료",
    }
  : order;
```

삼항연산자의 기본 형태는:

```tsx
condition ? A : B
```

이다.

의미:

```text
condition이 true
→ A

condition이 false
→ B
```

주문 코드에서는:

```text
order.id === orderId
        ↓

true
→ 수정된 주문 객체

false
→ 기존 order
```

가 된다.

**팁**

삼항연산자를 보면:

```text
조건 ? true일 때 값 : false일 때 값
```

이라고 읽으면 된다.

---

## 4. 삼항연산자는 하나의 값을 만든다

예:

```tsx
const result = true ? "YES" : "NO";
```

결과:

```tsx
result === "YES"
```

즉 삼항연산자는 두 후보 중 하나를 결과값으로 선택한다.

주문 코드:

```tsx
order.id === orderId
  ? modifiedOrder
  : order
```

는 결국:

```text
수정된 주문
또는
기존 주문
```

중 하나를 결과값으로 만든다.

그리고 그 값이 callback의 return 값이 된다.

---

## 5. 1002번 주문을 추적해보자

예:

```tsx
order = {
  id: 1002,
  status: "결제완료",
};

orderId = 1002;
```

조건:

```tsx
order.id === orderId
```

실제로는:

```tsx
1002 === 1002
```

결과:

```tsx
true
```

따라서 `?` 쪽이 선택된다.

```tsx
{
  ...order,
  status: "취소완료",
}
```

이 값은 사실상:

```tsx
return {
  ...order,
  status: "취소완료",
};
```

와 같다.

---

## 6. 1001번 주문은?

```tsx
1001 === 1002
```

결과:

```tsx
false
```

그러면 `:` 쪽:

```tsx
order
```

가 선택된다.

즉:

```tsx
return order;
```

와 같다.

---

## 7. 전체 흐름

```text
orders = [1001, 1002, 1003]

map 시작
│
├─ 1001
│   false
│   → 기존 order return
│
├─ 1002
│   true
│   → 수정된 주문 return
│
└─ 1003
    false
    → 기존 order return

        ↓

updatedOrders
[
  기존 1001,
  수정된 1002,
  기존 1003
]
```

**팁**

`map()` 전체를 한 번에 이해하려고 하지 말고,
callback이 한 번 실행될 때 무엇을 return하는지 하나씩 추적하면 훨씬 쉽다.

---

## 8. Implicit Return과 Explicit Return

### Explicit Return

`{}`를 사용하는 경우:

```tsx
const updatedOrders = orders.map((order) => {
  return order.id === orderId
    ? {
        ...order,
        status: "취소완료",
      }
    : order;
});
```

`return`을 직접 작성한다.

---

### Implicit Return

`{}`를 생략하면:

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "취소완료",
      }
    : order
);
```

표현식의 결과가 자동으로 return된다.

개념적으로는:

```tsx
(order) => {
  return (
    order.id === orderId
      ? {
          ...order,
          status: "취소완료",
        }
      : order
  );
}
```

와 같다.

**팁**

다음 규칙만 기억하면 된다.

```text
() => 값
→ 자동 return
→ implicit return

() => {
  return 값;
}
→ 직접 return
→ explicit return
```

---

## 9. 자주 하는 실수

다음 코드는 문제가 있다.

```tsx
const updatedOrders = orders.map((order) => {
  order.id === orderId
    ? {
        ...order,
        status: "취소완료",
      }
    : order;
});
```

`{}`를 사용했는데 `return`이 없다.

따라서 callback은 사실상:

```tsx
return undefined;
```

처럼 동작하게 된다.

결과가:

```tsx
[undefined, undefined, undefined]
```

처럼 나올 수 있다.

올바른 코드는:

```tsx
const updatedOrders = orders.map((order) => {
  return order.id === orderId
    ? {
        ...order,
        status: "취소완료",
      }
    : order;
});
```

또는:

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        status: "취소완료",
      }
    : order
);
```

이다.

---

## 최종 Mental Model

```text
map()
→ 각 요소마다 callback 실행

삼항연산자
→ 두 값 중 하나를 선택

callback의 return 값
→ 새 배열의 요소가 됨
```

주문 코드에서는:

```text
취소 대상 주문인가?
↓
YES → 수정된 주문 객체 return
NO  → 기존 order return
↓
map()이 return 값들을 모아서 새로운 배열 생성
```

---

## 핵심 공식

```text
map()
→ "각 요소를 무엇으로 바꿀까?"

삼항연산자
→ "조건에 따라 둘 중 어떤 값을 선택할까?"

return
→ "선택된 값을 새 배열에 전달"

implicit return
→ () => 값

explicit return
→ () => {
     return 값;
   }
```

**팁**

Day 9 주문 상태 변경 코드를 볼 때는 다음 순서로 읽으면 된다.

```text
1. map()이 주문을 하나 꺼낸다
2. id가 취소 대상인지 검사한다
3. 삼항연산자가 결과값을 선택한다
4. 그 값이 callback에서 return된다
5. map()이 모든 return 값을 모아 updatedOrders를 만든다
```
