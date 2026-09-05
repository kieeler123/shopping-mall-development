# useEffect Dependency Array + useRef — 日本語 → English → 한국어

---

# 1. 日本語

# useEffect Dependency Array + useRef

## 核心概念

`useEffect` は「いつ副作用を実行するか」、`useRef` は「再レンダリングせずに何を保持するか」を担当します。

```tsx
const [count, setCount] = useState(0);
const countRef = useRef(count);

useEffect(() => {
  countRef.current = count;
}, [count]);
```

流れ:

```text
count 変更
→ 再レンダリング
→ effect 実行
→ countRef.current を最新 count に同期
```

**Tip**  
最新 state を ref に同期し続けたいなら、effect の dependency にその state を入れる必要があります。

## dependency を `[]` にすると？

```tsx
useEffect(() => {
  countRef.current = count;
}, []);
```

初回だけ実行されるため、後で `count` が変わっても `countRef.current` は更新されません。

```text
state = 5
ref.current = 0
```

**Tip**  
ref は自動同期されません。`.current` は自分で更新します。

## interval と ref

```tsx
const [count, setCount] = useState(0);
const countRef = useRef(count);

useEffect(() => {
  countRef.current = count;
}, [count]);

useEffect(() => {
  const id = setInterval(() => {
    console.log(countRef.current);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

役割:

```text
Effect 1 → count を ref に同期
Effect 2 → interval を一度だけ作成
```

**Tip**  
「外部 callback は維持したいが、内部値だけ最新にしたい」場合に ref + effect が有効です。

## dependency 方式との比較

```tsx
useEffect(() => {
  const id = setInterval(() => {
    console.log(count);
  }, 1000);

  return () => clearInterval(id);
}, [count]);
```

こちらは `count` が変わるたびに interval を cleanup して作り直します。

**Tip**  
どちらが正解かではなく、外部システムを再作成してよいかで判断します。

## `ref.current` を dependency に入れる？

```tsx
useEffect(() => {
  console.log(countRef.current);
}, [countRef.current]);
```

通常は適切ではありません。

```text
ref.current 変更
→ 再レンダリングなし
→ dependency 比較のための新しい render も起きない
```

**Tip**  
dependency 配列は「すべての JavaScript 値を監視する仕組み」ではありません。

## cleanup と closure

```tsx
useEffect(() => {
  console.log("current:", count);

  return () => {
    console.log("cleanup:", count);
  };
}, [count]);
```

`count = 0` の effect が cleanup されるとき、その cleanup は `count = 0` を参照します。

**Tip**  
cleanup も、自分が作られた render の closure を持ちます。

## dependency を省略すると stale closure になることがある

```tsx
useEffect(() => {
  console.log(count);
}, []);
```

初期 `count = 0` のまま effect が古い値を参照し続ける可能性があります。

**Tip**  
effect 内で使う state/props が dependency から抜けていないか確認してください。

## ref で dependency 問題を隠さない

ref は dependency warning を避けるための道具ではありません。

**Tip**  
まず通常の dependency で正しく書けるか考え、必要な理由がある場合だけ ref を使います。

## ref + effect が特に向く場面

- `setInterval`
- WebSocket
- event listener
- DOM observer
- 長時間維持する外部 callback

```text
state 変更
→ effect
→ ref.current 更新
→ 外部 callback は維持
→ 最新 ref.current を読む
```

## Day 8 では必要？

現在の注文キャンセル:

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);

localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

ここでは ref は不要です。

**Tip**  
新しい技術を学んだからといって、必要のないコードに追加しないことも重要です。

## 最終 Mental Model

```text
useEffect
→ side effect の実行タイミング

dependency
→ effect が反応する reactive 値

useRef
→ 再レンダリングなしで値を保持

ref.current
→ mutable
→ 変更しても再レンダリングなし
```

**Tip**  
dependency は effect の反応条件、ref は再レンダリングなしで値を保持する mutable storage です。


---

# 2. English

# useEffect Dependency Array + useRef

## Core idea

`useEffect` answers “when should this side effect run?”, while `useRef` answers “what value should be retained without triggering a render?”

```tsx
const [count, setCount] = useState(0);
const countRef = useRef(count);

useEffect(() => {
  countRef.current = count;
}, [count]);
```

Flow:

```text
count changes
→ re-render
→ effect runs
→ countRef.current receives latest count
```

**Tip**  
If a ref must keep tracking the latest state, the effect that performs the synchronization must react to that state.

## What if the dependency array is `[]`?

```tsx
useEffect(() => {
  countRef.current = count;
}, []);
```

The effect runs only after the initial mount, so later state changes do not update the ref.

```text
state = 5
ref.current = 0
```

**Tip**  
A ref is not automatically synchronized. You must update `.current` explicitly.

## Interval + ref pattern

```tsx
const [count, setCount] = useState(0);
const countRef = useRef(count);

useEffect(() => {
  countRef.current = count;
}, [count]);

useEffect(() => {
  const id = setInterval(() => {
    console.log(countRef.current);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

Responsibilities:

```text
Effect 1 → synchronize count into the ref
Effect 2 → create the interval once
```

**Tip**  
This pattern is useful when an external callback should stay registered while still reading fresh data.

## Alternative: depend directly on count

```tsx
useEffect(() => {
  const id = setInterval(() => {
    console.log(count);
  }, 1000);

  return () => clearInterval(id);
}, [count]);
```

Now the interval is cleaned up and recreated whenever `count` changes.

**Tip**  
Neither approach is universally better. Decide whether recreating the external system is acceptable.

## Should `ref.current` be a dependency?

```tsx
useEffect(() => {
  console.log(countRef.current);
}, [countRef.current]);
```

Usually, no.

```text
ref.current changes
→ no render
→ no new dependency comparison
```

**Tip**  
The dependency array is not a generic JavaScript value watcher.

## Cleanup functions also close over values

```tsx
useEffect(() => {
  console.log("current:", count);

  return () => {
    console.log("cleanup:", count);
  };
}, [count]);
```

A cleanup created when `count = 0` can still read `0` when it runs later.

**Tip**  
A cleanup belongs to the effect instance created by a particular render.

## Missing dependencies can produce stale closures

```tsx
useEffect(() => {
  console.log(count);
}, []);
```

If `count` changes later, this effect does not rerun and may keep using the initial value.

**Tip**  
Check whether state or props used inside an effect are missing from the dependency array.

## Do not hide dependency problems with refs

Refs are not an escape hatch for dependency warnings.

**Tip**  
Start with normal reactive dependencies. Use refs only when there is a clear reason to keep an external callback or object stable.

## Good use cases for ref + effect

- `setInterval`
- WebSocket
- event listeners
- DOM observers
- long-lived external callbacks

```text
state changes
→ effect
→ ref.current updated
→ external callback remains active
→ callback reads latest ref.current
```

## Is it needed in Day 8?

Current cancellation code:

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);

localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

No ref is needed here.

**Tip**  
Learning a tool does not mean every piece of code needs that tool.

## Final Mental Model

```text
useEffect
→ when a side effect runs

dependency
→ which reactive values trigger that effect

useRef
→ persistent mutable storage without rendering

ref.current
→ mutable
→ changing it does not trigger a render
```

**Tip**  
The dependency array describes an effect’s reactive inputs, while a ref stores mutable data outside the render-triggering state flow.


---

# 3. 한국어

# useEffect Dependency Array + useRef

## 핵심 개념

`useEffect`는 “언제 부수 효과를 실행할까?”, `useRef`는 “재렌더링 없이 어떤 값을 유지할까?”를 담당합니다.

```tsx
const [count, setCount] = useState(0);
const countRef = useRef(count);

useEffect(() => {
  countRef.current = count;
}, [count]);
```

흐름:

```text
count 변경
→ 재렌더링
→ effect 실행
→ countRef.current를 최신 count로 동기화
```

**팁**  
최신 state를 ref에 계속 동기화하려면, 그 state 변화에 effect가 반응하도록 dependency를 지정해야 합니다.

## dependency가 `[]`면?

```tsx
useEffect(() => {
  countRef.current = count;
}, []);
```

초기 마운트 뒤 한 번만 실행되므로, 이후 `count`가 바뀌어도 ref는 갱신되지 않습니다.

```text
state = 5
ref.current = 0
```

**팁**  
ref는 자동 동기화 장치가 아닙니다. `.current`는 직접 갱신해야 합니다.

## interval + ref 패턴

```tsx
const [count, setCount] = useState(0);
const countRef = useRef(count);

useEffect(() => {
  countRef.current = count;
}, [count]);

useEffect(() => {
  const id = setInterval(() => {
    console.log(countRef.current);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

역할:

```text
Effect 1 → count를 ref에 동기화
Effect 2 → interval은 한 번만 생성
```

**팁**  
“외부 callback은 유지하면서 내부에서 최신 값만 읽고 싶다”면 ref + effect가 유용합니다.

## dependency 방식과 비교

```tsx
useEffect(() => {
  const id = setInterval(() => {
    console.log(count);
  }, 1000);

  return () => clearInterval(id);
}, [count]);
```

이 방식에서는 `count`가 바뀔 때마다 기존 interval을 cleanup하고 새로 만듭니다.

**팁**  
두 방식 중 무엇이 무조건 정답이 아니라, 외부 시스템을 재생성해도 되는지가 판단 기준입니다.

## `ref.current`를 dependency에 넣을까?

```tsx
useEffect(() => {
  console.log(countRef.current);
}, [countRef.current]);
```

보통 적절하지 않습니다.

```text
ref.current 변경
→ 재렌더링 없음
→ dependency 비교를 위한 새 render도 없음
```

**팁**  
dependency 배열은 모든 JavaScript 값 변경을 감지하는 watcher가 아닙니다.

## cleanup도 closure를 가진다

```tsx
useEffect(() => {
  console.log("현재:", count);

  return () => {
    console.log("cleanup:", count);
  };
}, [count]);
```

`count = 0`일 때 만들어진 effect의 cleanup은 나중에 실행되어도 `count = 0`을 참조할 수 있습니다.

**팁**  
cleanup도 자신이 만들어진 렌더링의 snapshot을 기억한다고 생각하세요.

## dependency 누락과 stale closure

```tsx
useEffect(() => {
  console.log(count);
}, []);
```

effect 안에서 `count`를 사용하지만 dependency가 비어 있으면, 이후 최신 count를 반영하지 못할 수 있습니다.

**팁**  
effect 안에서 읽는 state/props가 dependency에서 빠졌다면 stale closure를 의심하세요.

## ref로 dependency 문제를 숨기지 말자

ref는 dependency warning을 피하는 편법이 아닙니다.

**팁**  
먼저 정상적인 dependency로 해결 가능한지 확인하고, 외부 callback이나 객체를 유지해야 하는 명확한 이유가 있을 때 ref를 사용하세요.

## ref + effect가 잘 맞는 상황

- `setInterval`
- WebSocket
- 이벤트 listener
- DOM observer
- 오래 유지되는 외부 callback

```text
state 변경
→ effect 실행
→ ref.current 최신화
→ 외부 callback은 유지
→ callback이 최신 ref.current 읽음
```

## Day 8 주문 취소 코드에는 필요한가?

현재:

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);

localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

여기에는 ref가 필요하지 않습니다.

**팁**  
새 개념을 배웠다고 모든 코드에 넣지 마세요. 필요 없는 복잡성을 만들지 않는 것도 중요한 실력입니다.

## dependency 판단 4단계

1. effect 안에서 어떤 값을 읽는가?
2. 그 값이 바뀌면 effect도 다시 실행되어야 하는가?
3. 외부 시스템을 다시 연결해야 하는가?
4. 다시 연결하지 않고 최신 값만 읽어야 하는가?

4번이 YES라면 ref를 고려할 수 있습니다.

**팁**  
dependency 배열을 먼저 채우기보다 effect의 목적을 한 문장으로 정의해보세요.

## 최종 비교

| 상황 | 추천 |
|---|---|
| state가 바뀌면 effect도 다시 실행 | dependency에 state 추가 |
| 외부 subscription은 유지하고 최신 값만 읽기 | ref + effect 고려 |
| UI를 갱신하는 값 | state |
| 렌더링 없이 유지할 값 | ref |
| `ref.current` 변경을 dependency로 감지 | 적절하지 않음 |
| 최신 이전 state로 새 state 계산 | 함수형 updater |

## Final Mental Model

```text
useEffect
→ side effect 실행 시점

dependency
→ effect가 반응하는 reactive 값

useRef
→ 렌더링 없이 값을 유지

ref.current
→ 직접 변경 가능
→ 변경해도 재렌더링 없음
```

**팁**  
가장 중요한 한 문장:

**dependency 배열은 effect의 반응 조건이고, ref는 렌더링을 일으키지 않으면서 값을 유지하는 mutable 저장소입니다. ref를 dependency 회피 수단으로 사용하지 마세요.**
