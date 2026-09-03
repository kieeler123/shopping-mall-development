# Day 4 --- useEffect で cart と localStorage を自動同期する / Automatically Sync cart with localStorage Using useEffect / useEffect로 cart와 localStorage 자동 동기화

# 日本語

## 1. 目標

以前の構造では、各 handler の中で保存処理を直接呼んでいた。

``` text
handleIncrease
→ setCart()
→ saveCart()

handleDecrease
→ setCart()
→ saveCart()

handleRemove
→ setCart()
→ saveCart()
```

これを次のように変更する。

``` text
handleIncrease
→ setCart()

handleDecrease
→ setCart()

handleRemove
→ setCart()

cart が変更される
↓
useEffect()
↓
localStorage に自動保存
```

つまり、各 handler は「cart を変更すること」だけを担当し、保存は
`useEffect()` が一か所で担当する。

> **Tip**
>
> handler と保存処理の責任を分けると、新しい cart 機能を追加しても
> localStorage 保存コードを毎回書く必要がなくなる。

------------------------------------------------------------------------

## 2. 基本的な保存用 useEffect

最も単純な形は次のコードである。

``` tsx
useEffect(() => {
  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );
}, [cart]);
```

`[cart]` は、この effect が `cart` の変更に反応することを意味する。

``` text
setCart()
↓
cart が変更される
↓
再レンダー
↓
useEffect 実行
↓
現在の cart を localStorage に保存
```

> **Tip**
>
> `[cart]` は「cart を監視する対象」と考えると理解しやすい。

------------------------------------------------------------------------

## 3. handler がシンプルになる

### Increase

``` tsx
const handleIncrease = (productId: number) => {
  setCart((prev) =>
    prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.min(10, item.quantity + 1),
          }
        : item,
    ),
  );
};
```

### Decrease

``` tsx
const handleDecrease = (productId: number) => {
  setCart((prev) =>
    prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.max(1, item.quantity - 1),
          }
        : item,
    ),
  );
};
```

### Remove

``` tsx
const handleRemove = (productId: number) => {
  setCart((prev) =>
    prev.filter(
      (item) => item.productId !== productId,
    ),
  );
};
```

localStorage 保存コードは各 handler から消える。

> **Tip**
>
> `handleIncrease` は増加、`handleDecrease` は減少、`handleRemove`
> は削除だけを担当するため、関数の役割が明確になる。

------------------------------------------------------------------------

## 4. そのままでは問題がある

state の初期値が：

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

なら、最初のレンダー時点では：

``` tsx
cart = []
```

である。

そして：

``` tsx
useEffect(() => {
  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );
}, [cart]);
```

は mount 後にも実行される。

そのため、localStorage
に既存データがある場合でも、最初の空配列で上書きしてしまう可能性がある。

``` text
localStorage
商品データあり
↓
最初の cart = []
↓
保存 effect 実行
↓
localStorage が [] で上書きされる
```

> **Tip**
>
> `useEffect(..., [cart])` は cart が変わった時だけでなく、最初の mount
> 後にも一度実行されることを覚えておく。

------------------------------------------------------------------------

## 5. `isLoaded` を使って初期ロード完了を管理する

次の state を追加する。

``` tsx
const [isLoaded, setIsLoaded] = useState(false);
```

意味：

``` text
false
→ localStorage から cart をまだ読み込んでいない

true
→ 初期読み込みが完了した
```

> **Tip**
>
> 名前は `isLoaded`, `isInitialized`, `hasHydrated`
> などでもよい。重要なのは「初期復元が終わったか」を記録することである。

------------------------------------------------------------------------

## 6. localStorage から最初に読み込む effect

``` tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    const parsedCart: CartItem[] = JSON.parse(savedCart);

    setCart(parsedCart);
  }

  setIsLoaded(true);
}, []);
```

ポイントは：

``` tsx
setIsLoaded(true);
```

である。

localStorage にデータがあるかどうかに関係なく、読み込み処理が終わったら
`true` にする。

> **Tip**
>
> `if (!savedCart) return;` のように途中で return すると
> `setIsLoaded(true)`
> が実行されない場合があるので、初期化完了フラグを使うときは処理順に注意する。

------------------------------------------------------------------------

## 7. 保存用 effect

``` tsx
useEffect(() => {
  if (!isLoaded) {
    return;
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );
}, [cart, isLoaded]);
```

最初は：

``` tsx
isLoaded === false
```

なので：

``` tsx
if (!isLoaded) {
  return;
}
```

で保存処理を中止する。

初期データの復元が終わって `isLoaded === true` になってから、cart
の変更を localStorage に保存する。

> **Tip**
>
> この条件が「最初の空配列で既存データを上書きする事故」を防ぐ安全装置になる。

------------------------------------------------------------------------

## 8. 全体コード

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    const parsedCart: CartItem[] = JSON.parse(savedCart);

    setCart(parsedCart);
  }

  setIsLoaded(true);
}, []);

useEffect(() => {
  if (!isLoaded) {
    return;
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );
}, [cart, isLoaded]);
```

> **Tip**
>
> 1つ目の effect を `LOAD`、2つ目の effect を `SAVE`
> と考えると整理しやすい。

------------------------------------------------------------------------

## 9. 初回アクセス時の流れ

``` text
cart = []
isLoaded = false
↓
LOAD effect
↓
localStorage を読む
↓
保存データがあれば setCart(parsedCart)
↓
setIsLoaded(true)
```

一方 SAVE effect は最初：

``` text
isLoaded = false
↓
return
↓
保存しない
```

となる。

> **Tip**
>
> 最初に「読み込み」、その後に「保存可能」という順序を作ることが重要。

------------------------------------------------------------------------

## 10. その後の増加処理

``` text
+ をクリック
↓
handleIncrease()
↓
setCart()
↓
cart が変更
↓
SAVE effect
↓
JSON.stringify(cart)
↓
localStorage 保存
```

handler は localStorage を直接知らなくてよい。

> **Tip**
>
> cart を正しく変更すれば保存は自動で追従する、という構造ができる。

------------------------------------------------------------------------

## 11. 減少・削除も同じ

### Decrease

``` text
- をクリック
↓
setCart()
↓
cart が変更
↓
useEffect()
↓
localStorage 保存
```

### Remove

``` text
削除
↓
setCart()
↓
cart が変更
↓
useEffect()
↓
localStorage 保存
```

> **Tip**
>
> 操作の種類が増えても、保存処理は一か所のままなので保守しやすい。

------------------------------------------------------------------------

## 12. `saveCart()` を直接呼ぶ方式との比較

  `saveCart()` を各 handler から呼ぶ   `useEffect` で同期
  ------------------------------------ -------------------------------
  各 handler が保存を知る              handler は state 変更だけ担当
  保存を呼び忘れる可能性がある         cart が変われば自動保存
  理解しやすい                         責任分離が明確
  呼び出しコードが増える               保存処理が一か所になる

> **Tip**
>
> まず共通関数で重複を減らし、その後 effect
> で責任を分けるとリファクタリングの意味が理解しやすい。

------------------------------------------------------------------------

## 13. State を Source of Truth として考える

この構造では、アプリ実行中の基準データは React state である。

``` text
アプリ開始時
localStorage
↓
React cart state

アプリ実行中
React cart state
↓
localStorage
```

つまり localStorage は「再読み込み後に state
を復元するための保存場所」として使われる。

> **Tip**
>
> 「どのデータが基準なのか」を考える習慣は、Context、Zustand、Redux、サーバー
> DB などを学ぶときにも重要になる。

------------------------------------------------------------------------

# English

## 1. Goal

Previously, each handler directly performed persistence:

``` text
handleIncrease
→ setCart()
→ saveCart()

handleDecrease
→ setCart()
→ saveCart()

handleRemove
→ setCart()
→ saveCart()
```

The goal is to change the structure to:

``` text
handleIncrease
→ setCart()

handleDecrease
→ setCart()

handleRemove
→ setCart()

cart changes
↓
useEffect()
↓
automatically save to localStorage
```

Each handler is responsible only for changing cart state, while one
effect handles persistence.

> **Tip**
>
> Separating state updates from persistence reduces repetition and makes
> future cart features easier to add.

------------------------------------------------------------------------

## 2. Basic Save Effect

A simple version is:

``` tsx
useEffect(() => {
  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );
}, [cart]);
```

`[cart]` means the effect reacts to changes in `cart`.

``` text
setCart()
↓
cart changes
↓
component re-renders
↓
useEffect runs
↓
current cart is saved
```

> **Tip**
>
> Think of `[cart]` as the list of values the effect watches.

------------------------------------------------------------------------

## 3. Handlers Become Simpler

### Increase

``` tsx
const handleIncrease = (productId: number) => {
  setCart((prev) =>
    prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.min(10, item.quantity + 1),
          }
        : item,
    ),
  );
};
```

### Decrease

``` tsx
const handleDecrease = (productId: number) => {
  setCart((prev) =>
    prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.max(1, item.quantity - 1),
          }
        : item,
    ),
  );
};
```

### Remove

``` tsx
const handleRemove = (productId: number) => {
  setCart((prev) =>
    prev.filter(
      (item) => item.productId !== productId,
    ),
  );
};
```

> **Tip**
>
> Each handler now describes only its actual responsibility: increase,
> decrease, or remove.

------------------------------------------------------------------------

## 4. The Simple Version Has a Problem

If state starts as:

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

then the first render has:

``` tsx
cart = []
```

The effect:

``` tsx
useEffect(() => {
  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );
}, [cart]);
```

also runs after the component first mounts.

This means an existing persisted cart could be overwritten by the
initial empty array.

``` text
localStorage contains products
↓
initial cart = []
↓
save effect runs
↓
localStorage becomes []
```

> **Tip**
>
> An effect with `[cart]` runs after the initial mount as well as after
> later cart changes.

------------------------------------------------------------------------

## 5. Track Initial Loading with `isLoaded`

Add:

``` tsx
const [isLoaded, setIsLoaded] = useState(false);
```

Meaning:

``` text
false
→ persisted cart has not been restored yet

true
→ initial restoration is complete
```

> **Tip**
>
> The name could also be `isInitialized` or `hasHydrated`. The key idea
> is tracking whether initial restoration has finished.

------------------------------------------------------------------------

## 6. Initial Load Effect

``` tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    const parsedCart: CartItem[] = JSON.parse(savedCart);

    setCart(parsedCart);
  }

  setIsLoaded(true);
}, []);
```

The important line is:

``` tsx
setIsLoaded(true);
```

It runs after the loading attempt is complete, whether or not saved data
exists.

> **Tip**
>
> Be careful with early `return` statements when an initialization flag
> still needs to be updated.

------------------------------------------------------------------------

## 7. Save Effect

``` tsx
useEffect(() => {
  if (!isLoaded) {
    return;
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );
}, [cart, isLoaded]);
```

Initially:

``` tsx
isLoaded === false
```

so the effect exits before saving.

After restoration finishes and `isLoaded` becomes `true`, cart changes
can be persisted.

> **Tip**
>
> This guard prevents the initial empty array from overwriting an
> existing cart.

------------------------------------------------------------------------

## 8. Complete Structure

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    const parsedCart: CartItem[] = JSON.parse(savedCart);

    setCart(parsedCart);
  }

  setIsLoaded(true);
}, []);

useEffect(() => {
  if (!isLoaded) {
    return;
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );
}, [cart, isLoaded]);
```

> **Tip**
>
> Think of the first effect as `LOAD` and the second effect as `SAVE`.

------------------------------------------------------------------------

## 9. Initial Visit Flow

``` text
cart = []
isLoaded = false
↓
LOAD effect
↓
read localStorage
↓
setCart(parsedCart) if data exists
↓
setIsLoaded(true)
```

Meanwhile, the SAVE effect initially does:

``` text
isLoaded = false
↓
return
↓
do not save
```

> **Tip**
>
> The important sequence is: restore first, then allow persistence.

------------------------------------------------------------------------

## 10. Increasing Quantity Later

``` text
click +
↓
handleIncrease()
↓
setCart()
↓
cart changes
↓
SAVE effect
↓
JSON.stringify(cart)
↓
save to localStorage
```

The handler no longer needs direct knowledge of localStorage.

> **Tip**
>
> Once this structure is in place, correctly updating state is enough
> for persistence to follow automatically.

------------------------------------------------------------------------

## 11. Decrease and Remove Work the Same Way

### Decrease

``` text
click -
↓
setCart()
↓
cart changes
↓
useEffect()
↓
save
```

### Remove

``` text
remove
↓
setCart()
↓
cart changes
↓
useEffect()
↓
save
```

> **Tip**
>
> Adding more cart operations does not require adding more persistence
> code.

------------------------------------------------------------------------

## 12. Comparison: `saveCart()` vs `useEffect`

  Calling `saveCart()` in handlers       Synchronizing with `useEffect`
  -------------------------------------- -----------------------------------
  Each handler knows about persistence   Handlers only change state
  Easy to forget a save call             State changes trigger persistence
  Simple to understand                   Better responsibility separation
  Repeated calls remain                  Save logic lives in one place

> **Tip**
>
> A useful refactoring path is: first remove duplicated code with a
> helper, then separate responsibilities with an effect.

------------------------------------------------------------------------

## 13. React State as the Source of Truth

In this design:

``` text
application startup
localStorage
↓
React cart state

while application is running
React cart state
↓
localStorage
```

React state is the primary data during runtime, and localStorage is used
to restore that state after a reload or future visit.

> **Tip**
>
> Asking "which data is the source of truth?" becomes very important
> later when using Context, Zustand, Redux, or server-side databases.

------------------------------------------------------------------------

# 한국어

## 1. 목표

기존에는 각 handler 안에서 저장까지 직접 처리했다.

``` text
handleIncrease
→ setCart()
→ saveCart()

handleDecrease
→ setCart()
→ saveCart()

handleRemove
→ setCart()
→ saveCart()
```

이 구조를 다음처럼 바꾸는 것이 목표다.

``` text
handleIncrease
→ setCart()

handleDecrease
→ setCart()

handleRemove
→ setCart()

cart 변경
↓
useEffect()
↓
localStorage 자동 저장
```

즉 각 handler는 cart를 변경하는 일만 담당하고, 저장은 하나의
`useEffect()`가 담당한다.

> **팁**
>
> state 변경과 저장 책임을 분리하면 새로운 장바구니 기능을 추가해도
> localStorage 저장 코드를 매번 반복해서 작성할 필요가 줄어든다.

------------------------------------------------------------------------

## 2. 가장 기본적인 저장 effect

가장 단순하게는:

``` tsx
useEffect(() => {
  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );
}, [cart]);
```

처럼 작성할 수 있다.

여기서:

``` tsx
[cart]
```

는 이 effect가 `cart`의 변경에 반응한다는 뜻이다.

``` text
setCart()
↓
cart 변경
↓
컴포넌트 재렌더링
↓
useEffect 실행
↓
현재 cart를 localStorage에 저장
```

> **팁**
>
> `[cart]`를 effect가 관찰하는 값 목록이라고 생각하면 이해하기 쉽다.

------------------------------------------------------------------------

## 3. handler가 단순해진다

### Increase

``` tsx
const handleIncrease = (productId: number) => {
  setCart((prev) =>
    prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.min(10, item.quantity + 1),
          }
        : item,
    ),
  );
};
```

### Decrease

``` tsx
const handleDecrease = (productId: number) => {
  setCart((prev) =>
    prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.max(1, item.quantity - 1),
          }
        : item,
    ),
  );
};
```

### Remove

``` tsx
const handleRemove = (productId: number) => {
  setCart((prev) =>
    prev.filter(
      (item) => item.productId !== productId,
    ),
  );
};
```

이제 handler 내부에는 localStorage 저장 코드가 없다.

> **팁**
>
> `handleIncrease`는 증가, `handleDecrease`는 감소, `handleRemove`는
> 삭제만 담당하므로 함수 이름과 실제 책임이 더 잘 맞는다.

------------------------------------------------------------------------

## 4. 그런데 가장 단순한 방식에는 문제가 있다

state 초기값이:

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

라면 첫 렌더에서는:

``` tsx
cart = []
```

이다.

그리고:

``` tsx
useEffect(() => {
  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );
}, [cart]);
```

는 컴포넌트가 처음 mount된 뒤에도 실행된다.

따라서 localStorage에 기존 장바구니가 있어도 최초 빈 배열이 먼저
저장되어 데이터를 덮어쓸 가능성이 있다.

``` text
localStorage에 기존 상품 존재
↓
최초 cart = []
↓
저장 effect 실행
↓
localStorage가 []로 덮어쓰기됨
```

> **팁**
>
> `useEffect(..., [cart])`는 cart가 나중에 변경될 때만 실행되는 것이
> 아니라, 컴포넌트가 처음 나타난 뒤에도 한 번 실행된다는 점이 중요하다.

------------------------------------------------------------------------

## 5. `isLoaded`로 초기 복원 완료 여부 관리하기

다음 state를 추가한다.

``` tsx
const [isLoaded, setIsLoaded] = useState(false);
```

의미는:

``` text
false
→ 아직 localStorage에서 cart를 복원하지 않음

true
→ 초기 복원이 끝남
```

이다.

> **팁**
>
> 이름은 `isLoaded`, `isInitialized`, `hasHydrated` 등으로 정할 수 있다.
> 핵심은 초기 데이터 복원이 끝났는지를 표시하는 것이다.

------------------------------------------------------------------------

## 6. 처음 localStorage를 읽는 LOAD effect

``` tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    const parsedCart: CartItem[] = JSON.parse(savedCart);

    setCart(parsedCart);
  }

  setIsLoaded(true);
}, []);
```

여기서 중요한 부분은:

``` tsx
setIsLoaded(true);
```

이다.

저장된 데이터가 있든 없든 localStorage 확인 작업이 끝났다면 `true`로
바꾼다.

> **팁**
>
> 초기화 완료 플래그가 필요할 때는 `if (!savedCart) return;`처럼 너무
> 일찍 함수가 끝나지 않도록 처리 순서를 확인하자.

------------------------------------------------------------------------

## 7. 저장을 담당하는 SAVE effect

``` tsx
useEffect(() => {
  if (!isLoaded) {
    return;
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );
}, [cart, isLoaded]);
```

처음에는:

``` tsx
isLoaded === false
```

이므로:

``` tsx
if (!isLoaded) {
  return;
}
```

에서 저장하지 않고 종료한다.

초기 복원이 끝난 뒤 `isLoaded === true`가 되면, 이후 cart 변경을
localStorage에 저장한다.

> **팁**
>
> 이 조건이 최초 빈 배열로 기존 localStorage 데이터를 덮어쓰는 문제를
> 막는 안전장치다.

------------------------------------------------------------------------

## 8. 전체 구조

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    const parsedCart: CartItem[] = JSON.parse(savedCart);

    setCart(parsedCart);
  }

  setIsLoaded(true);
}, []);

useEffect(() => {
  if (!isLoaded) {
    return;
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );
}, [cart, isLoaded]);
```

> **팁**
>
> 첫 번째 effect는 `LOAD`, 두 번째 effect는 `SAVE`라고 이름 붙여서
> 생각하면 훨씬 정리하기 쉽다.

------------------------------------------------------------------------

## 9. 최초 접속 시 데이터 흐름

``` text
cart = []
isLoaded = false
↓
LOAD effect
↓
localStorage 읽기
↓
저장 데이터가 있으면 setCart(parsedCart)
↓
setIsLoaded(true)
```

반면 SAVE effect는 처음에는:

``` text
isLoaded = false
↓
return
↓
저장하지 않음
```

이 된다.

> **팁**
>
> 핵심 순서는 `먼저 복원 → 그다음 저장 허용`이다.

------------------------------------------------------------------------

## 10. 이후 수량 증가 흐름

``` text
+ 클릭
↓
handleIncrease()
↓
setCart()
↓
cart 변경
↓
SAVE effect 실행
↓
JSON.stringify(cart)
↓
localStorage 저장
```

이제 `handleIncrease()`는 localStorage를 직접 알 필요가 없다.

> **팁**
>
> cart state만 올바르게 변경하면 저장 로직이 자동으로 따라오게 만드는
> 것이 핵심이다.

------------------------------------------------------------------------

## 11. 감소와 삭제도 같은 구조

### Decrease

``` text
- 클릭
↓
setCart()
↓
cart 변경
↓
useEffect()
↓
localStorage 저장
```

### Remove

``` text
삭제
↓
setCart()
↓
cart 변경
↓
useEffect()
↓
localStorage 저장
```

> **팁**
>
> cart 조작 기능이 늘어나도 저장 코드는 한 곳에 그대로 유지할 수 있다.

------------------------------------------------------------------------

## 12. `saveCart()` 직접 호출 방식과 비교

  `saveCart()`를 handler에서 호출   `useEffect`로 자동 동기화
  --------------------------------- -----------------------------
  각 handler가 저장을 알고 있음     handler는 state 변경만 담당
  저장 호출을 빼먹을 수 있음        cart 변경 시 자동 저장
  이해하기 단순함                   책임 분리가 더 명확함
  호출 코드가 반복됨                저장 로직이 한 곳에 위치

> **팁**
>
> 리팩터링은 `중복 제거 → 책임 분리` 순서로 진행하면 왜 구조를 바꾸는지
> 이해하기 쉽다.

------------------------------------------------------------------------

## 13. React state를 Source of Truth로 생각하기

이 구조에서는 앱 실행 중 기준 데이터가 React state다.

``` text
앱 시작
localStorage
↓
React cart state

앱 실행 중
React cart state
↓
localStorage
```

즉 localStorage는 새로고침이나 재접속 뒤에 cart state를 다시 복원하기
위한 저장 공간 역할을 한다.

> **팁**
>
> 앞으로 Context, Zustand, Redux, 서버 DB 등을 배울 때도
> `어떤 데이터가 기준 데이터인가?`라는 질문을 계속 가져가면 상태 관리
> 구조를 이해하는 데 큰 도움이 된다.

------------------------------------------------------------------------

## 14. 핵심 요약

``` text
처음:
localStorage → React state

이후:
React state → localStorage
```

그리고 역할을 나누면:

``` text
handleIncrease / handleDecrease / handleRemove
→ state 변경 담당

LOAD useEffect
→ 초기 복원 담당

SAVE useEffect
→ 자동 저장 담당
```

이 된다.

> **팁**
>
> 문법을 외우기보다 `누가 state를 바꾸고`,
> `누가 처음 데이터를 불러오고`, `누가 저장을 담당하는지`를 역할
> 기준으로 구분하면 훨씬 오래 기억할 수 있다.
