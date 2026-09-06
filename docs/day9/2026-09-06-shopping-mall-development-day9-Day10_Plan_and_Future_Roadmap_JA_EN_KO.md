# Day 10 — Order Status Modeling & Future Roadmap
## 천천히 실무 수준으로 발전시키는 학습 계획
### 日本語 → English → 한국어

---

# Part 1 — Day 10 Plan

## STEP 1 — `status: string` の意味と限界 / Understand `status: string` and Its Limits / `status: string`의 의미와 한계

### 日本語

Day 9 では注文状態を次のように定義しました。

```tsx
status: string;
```

これは `status` に文字列を保存できるという意味です。

しかし、TypeScript から見ると次の値もすべて `string` なので許可されます。

```tsx
status: "결제완료"
status: "취소완료"
status: "배송중"
status: "아무거나"
status: "오타"
```

注文状態として使用できる値を限定したい場合、単純な `string` だけでは十分ではありません。

Day 10 ではこの問題を出発点にして、TypeScript の Union Type を学びます。

**Tip**

新しい文法を先に暗記するのではなく、「今の `string` にはどんな問題があるか？」を理解してから Union Type に進みます。

### English

In Day 9, the order status was defined as:

```tsx
status: string;
```

This means `status` can contain a string.

However, from TypeScript's point of view, all of these are valid strings:

```tsx
status: "결제완료"
status: "취소완료"
status: "배송중"
status: "아무거나"
status: "오타"
```

If we want to restrict the values that can be used as an order status, plain `string` is too broad.

Day 10 starts from this problem and introduces TypeScript Union Types.

**Tip**

Do not memorize the new syntax first. Understand the weakness of `status: string` and then learn why a Union Type is useful.

### 한국어

Day 9에서는 주문 상태를 다음과 같이 정의했다.

```tsx
status: string;
```

이것은 `status`에 문자열을 저장할 수 있다는 뜻이다.

하지만 TypeScript 입장에서는 아래 값들이 모두 `string`이기 때문에 허용된다.

```tsx
status: "결제완료"
status: "취소완료"
status: "배송중"
status: "아무거나"
status: "오타"
```

주문 상태로 사용할 수 있는 값을 제한하고 싶다면 단순한 `string`만으로는 범위가 너무 넓다.

Day 10은 이 문제에서 출발해서 TypeScript의 Union Type을 배운다.

**팁**

새 문법부터 외우지 말고 `status: string`이 왜 부족한지를 먼저 이해한다. 문제를 이해한 뒤 Union Type을 보면 사용하는 이유가 훨씬 선명해진다.

---

## STEP 2 — String Literal Type を理解 / Understand String Literal Types / 문자열 리터럴 타입 이해

### 日本語

普通の `string` はあらゆる文字列を意味します。

```tsx
let status: string;
```

一方、特定の文字列だけを型として指定することもできます。

```tsx
let status: "결제완료";
```

この場合、`status` に入れられる値は `"결제완료"` だけです。

```tsx
status = "결제완료"; // OK
status = "배송중";   // Error
```

これを String Literal Type と考えることができます。

**Tip**

値として見えていた `"결제완료"` が、TypeScript では「許可される値を表す型」にもなれる点に注目します。

### English

A normal `string` represents any string value.

```tsx
let status: string;
```

TypeScript can also use a specific string as a type.

```tsx
let status: "결제완료";
```

Now only `"결제완료"` is allowed.

```tsx
status = "결제완료"; // OK
status = "배송중";   // Error
```

This is a String Literal Type.

**Tip**

Notice that `"결제완료"` can be more than a runtime value. In TypeScript, it can also describe the exact value that a variable is allowed to contain.

### 한국어

일반적인 `string`은 모든 문자열을 의미한다.

```tsx
let status: string;
```

반면 특정 문자열 자체를 타입으로 지정할 수도 있다.

```tsx
let status: "결제완료";
```

이제 `status`에는 `"결제완료"`만 넣을 수 있다.

```tsx
status = "결제완료"; // OK
status = "배송중";   // Error
```

이런 타입을 String Literal Type으로 이해할 수 있다.

**팁**

지금까지 값으로만 보던 `"결제완료"`가 TypeScript에서는 `허용되는 정확한 값`을 나타내는 타입 역할도 할 수 있다는 점을 잡는다.

---

## STEP 3 — Union Type の基本 / Learn the Union Type / Union Type 기본

### 日本語

複数の型を `|` でつなぐと、「この中のどれか」という型を作れます。

```tsx
type OrderStatus =
  | "결제완료"
  | "상품준비중"
  | "배송중"
  | "배송완료"
  | "취소완료";
```

意味は：

```text
OrderStatus
=
결제완료
OR 상품준비중
OR 배송중
OR 배송완료
OR 취소완료
```

です。

**Tip**

`|` を「または（OR）」と読めば理解しやすくなります。

### English

Using `|` combines multiple possible types into a Union Type.

```tsx
type OrderStatus =
  | "결제완료"
  | "상품준비중"
  | "배송중"
  | "배송완료"
  | "취소완료";
```

Conceptually:

```text
OrderStatus
=
결제완료
OR 상품준비중
OR 배송중
OR 배송완료
OR 취소완료
```

**Tip**

Read the `|` symbol as “OR”.

### 한국어

여러 타입을 `|`로 연결하면 `이 중 하나`라는 Union Type을 만들 수 있다.

```tsx
type OrderStatus =
  | "결제완료"
  | "상품준비중"
  | "배송중"
  | "배송완료"
  | "취소완료";
```

의미는 다음과 같다.

```text
OrderStatus
=
결제완료
OR 상품준비중
OR 배송중
OR 배송완료
OR 취소완료
```

**팁**

처음에는 `|` 기호를 그냥 `또는(OR)`이라고 읽는다.

---

## STEP 4 — `OrderStatus` を `Order` に適用 / Apply `OrderStatus` to `Order` / `OrderStatus`를 `Order`에 적용

### 日本語

既存の：

```tsx
status: string;
```

を：

```tsx
status: OrderStatus;
```

に変更します。

```tsx
export type OrderStatus =
  | "결제완료"
  | "상품준비중"
  | "배송중"
  | "배송완료"
  | "취소완료";

export type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;
};
```

これで TypeScript が注文状態の許可範囲を理解できます。

**Tip**

`OrderStatus` は「注文状態として許可する値のルール」、`Order` は「注文全体の構造」と分けて考えます。

### English

Replace:

```tsx
status: string;
```

with:

```tsx
status: OrderStatus;
```

For example:

```tsx
export type OrderStatus =
  | "결제완료"
  | "상품준비중"
  | "배송중"
  | "배송완료"
  | "취소완료";

export type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;
};
```

TypeScript now understands the allowed order-status values.

**Tip**

Think of `OrderStatus` as the rule for valid status values and `Order` as the structure of the complete order.

### 한국어

기존의:

```tsx
status: string;
```

을:

```tsx
status: OrderStatus;
```

로 변경한다.

```tsx
export type OrderStatus =
  | "결제완료"
  | "상품준비중"
  | "배송중"
  | "배송완료"
  | "취소완료";

export type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;
};
```

이제 TypeScript가 주문 상태에 허용되는 값의 범위를 알 수 있다.

**팁**

`OrderStatus = 주문 상태 규칙`, `Order = 주문 전체 데이터 구조`라고 역할을 나눠서 이해한다.

---

## STEP 5 — 正しい値と間違った値を実験 / Test Valid and Invalid Values / 올바른 값과 잘못된 값 실험

### 日本語

Union Type の効果を直接確認します。

```tsx
const status1: OrderStatus = "결제완료";
const status2: OrderStatus = "배송중";
```

これは正常です。

しかし：

```tsx
const status3: OrderStatus = "배송완료오타";
```

は TypeScript エラーになります。

この実験によって、Union Type が単なる書き方ではなく「不正な状態をコード段階で防ぐ仕組み」であることを確認します。

**Tip**

エラーを避けるだけでなく、意図的にエラーを作って TypeScript が何を守っているのか確認します。

### English

Test the effect of the Union Type directly.

```tsx
const status1: OrderStatus = "결제완료";
const status2: OrderStatus = "배송중";
```

These are valid.

But:

```tsx
const status3: OrderStatus = "배송완료오타";
```

should produce a TypeScript error.

This shows that a Union Type is not merely syntax. It prevents invalid states at development time.

**Tip**

Intentionally create a type error while studying. Seeing what TypeScript rejects often makes the purpose of a type much easier to understand.

### 한국어

Union Type의 효과를 직접 실험한다.

```tsx
const status1: OrderStatus = "결제완료";
const status2: OrderStatus = "배송중";
```

이 값들은 정상이다.

하지만:

```tsx
const status3: OrderStatus = "배송완료오타";
```

처럼 허용되지 않은 값을 넣으면 TypeScript 오류가 발생해야 한다.

이를 통해 Union Type이 단순한 문법이 아니라 `잘못된 상태를 개발 단계에서 막는 장치`라는 것을 확인한다.

**팁**

공부할 때는 오류를 피하기만 하지 말고 일부러 잘못된 값을 넣어본다. TypeScript가 무엇을 막아주는지 직접 보는 것이 중요하다.

---

## STEP 6 — 注文状態の流れをモデル化 / Model the Order Status Flow / 주문 상태 흐름 모델링

### 日本語

注文状態を単なる文字列ではなく「業務の流れ」として考えます。

```text
결제완료
↓
상품준비중
↓
배송중
↓
배송완료
```

キャンセルは別の状態です。

```text
결제완료 ─────→ 취소완료
상품준비중 ───→ 취소완료
```

ここで重要なのは、型が「使用できる状態」を定義し、ビジネスロジックが「どの状態からどこへ移動できるか」を決めるという違いです。

**Tip**

`OrderStatus` に値が存在するからといって、すべての状態から自由にその値へ変更できるとは限りません。

### English

Think of order status as a business flow rather than just a string.

```text
결제완료
↓
상품준비중
↓
배송중
↓
배송완료
```

Cancellation can be another branch.

```text
결제완료 ─────→ 취소완료
상품준비중 ───→ 취소완료
```

The type defines which statuses are valid. Business logic defines which transitions are allowed.

**Tip**

A value being part of `OrderStatus` does not automatically mean every status can transition to it.

### 한국어

주문 상태를 단순한 문자열 목록이 아니라 `업무 흐름`으로 생각한다.

```text
결제완료
↓
상품준비중
↓
배송중
↓
배송완료
```

취소는 별도의 분기로 생각할 수 있다.

```text
결제완료 ─────→ 취소완료
상품준비중 ───→ 취소완료
```

여기서 중요한 차이는:

```text
Type
→ 어떤 상태가 존재할 수 있는가?

Business Logic
→ 어떤 상태에서 어떤 상태로 이동할 수 있는가?
```

이다.

**팁**

`OrderStatus` 안에 값이 있다고 해서 모든 상태에서 그 값으로 마음대로 변경할 수 있다는 뜻은 아니다. 이 구분이 나중에 실무적인 상태 관리로 이어진다.

---

## STEP 7 — 状態による UI 条件を考える / Connect Status to UI Rules / 상태와 UI 조건 연결

### 日本語

Day 9 の：

```tsx
disabled={order.status === "취소완료"}
```

も状態による UI 制御です。

Day 10 では複数の状態を持つようになるため、次のようなルールを考えられます。

```text
결제완료
→ キャンセル可能

상품준비중
→ 条件によってキャンセル可能

배송중
→ キャンセル不可

배송완료
→ キャンセル不可

취소완료
→ キャンセル不可
```

この STEP では大きな UI を作り込むのではなく、「状態が UI のルールを決める」という考え方を中心に学びます。

**Tip**

Day 10 では機能を増やしすぎず、まず状態モデルと UI 条件の関係を理解します。

### English

Day 9 already used status to control the UI:

```tsx
disabled={order.status === "취소완료"}
```

With multiple statuses, we can begin thinking about rules such as:

```text
결제완료
→ cancellation allowed

상품준비중
→ cancellation may be allowed

배송중
→ cancellation not allowed

배송완료
→ cancellation not allowed

취소완료
→ cancellation not allowed
```

The main goal here is not to build a large UI, but to understand that application state determines UI rules.

**Tip**

Keep Day 10 small. Focus on the relationship between the status model and UI behavior before adding administrator features.

### 한국어

Day 9에서 사용한:

```tsx
disabled={order.status === "취소완료"}
```

도 이미 상태에 따른 UI 제어였다.

Day 10에서 상태가 여러 개로 늘어나면 다음과 같은 규칙을 생각할 수 있다.

```text
결제완료
→ 취소 가능

상품준비중
→ 정책에 따라 취소 가능

배송중
→ 취소 불가

배송완료
→ 취소 불가

취소완료
→ 취소 불가
```

이번 STEP에서는 복잡한 UI를 만드는 것보다 `상태가 UI의 규칙을 결정한다`는 이론을 중심으로 이해한다.

**팁**

Day 10에서 관리자 기능까지 한꺼번에 만들지 않는다. 먼저 상태 모델링 자체를 충분히 이해한 뒤 다음 Day로 넘긴다.

---

## STEP 8 — Day 10 Review & Test / Day 10 Review & Test / Day 10 복습 및 테스트

### 日本語

Day 10 の確認項目：

```text
1. status: string の問題を説明できる
2. String Literal Type を説明できる
3. | を OR として理解できる
4. OrderStatus Union Type を作れる
5. Order.status に適用できる
6. 不正な status が TypeScript error になる
7. 状態の種類と状態遷移の違いを説明できる
8. 状態が UI 条件につながることを説明できる
```

**Tip**

コードを書けるだけでなく、「なぜ `string` から Union Type に変えたのか」を自分の言葉で説明できれば Day 10 の目的達成です。

### English

Day 10 checklist:

```text
1. Explain the weakness of status: string
2. Explain a String Literal Type
3. Read | as OR
4. Create an OrderStatus Union Type
5. Apply it to Order.status
6. See TypeScript reject an invalid status
7. Explain the difference between valid states and valid transitions
8. Explain how state can determine UI behavior
```

**Tip**

Day 10 is complete when you can explain why the project moved from `string` to a Union Type, not merely when the code compiles.

### 한국어

Day 10 최종 체크리스트:

```text
1. status: string의 한계를 설명할 수 있다
2. String Literal Type을 설명할 수 있다
3. |를 OR로 이해할 수 있다
4. OrderStatus Union Type을 만들 수 있다
5. Order.status에 적용할 수 있다
6. 잘못된 status에서 TypeScript 오류를 확인할 수 있다
7. 상태 종류와 상태 전환 규칙의 차이를 설명할 수 있다
8. 상태가 UI 조건으로 연결되는 이유를 설명할 수 있다
```

**팁**

코드가 동작하는 것보다 `왜 string에서 Union Type으로 바꿨는가?`를 자기 말로 설명할 수 있는지를 Day 10 완료 기준으로 잡는다.

---

# Part 2 — Expected Roadmap After Day 10

> 이 로드맵은 한 Day에 많은 내용을 넣는 계획이 아니다. 실제 학습에서는 각 주제를 다시 여러 STEP으로 잘게 나누고, 이론 → 작은 실험 → 프로젝트 적용 → 복습 순서로 진행한다.

---

# Day 11 — Admin Order List / 管理者注文一覧 / 관리자 주문 목록

## 日本語

顧客画面とは別に、管理者がすべての注文を確認できる一覧画面を作ります。

中心テーマ：

```text
配列データ
↓
map()
↓
一覧 UI
↓
注文状態表示
```

学習候補：

- 管理者画面の役割
- 注文一覧のレンダリング
- `map()` の復習
- 一覧と詳細の違い
- UI の責任

**Tip**

最初は編集機能を入れず、「一覧を正しく表示する」ことだけに集中します。

## English

Create an administrator view that can display all orders.

Main flow:

```text
array data
↓
map()
↓
list UI
↓
display order status
```

Possible topics:

- purpose of an admin page
- rendering an order list
- reviewing `map()`
- list vs detail views
- UI responsibilities

**Tip**

Do not add editing immediately. First make the admin list easy to understand and correct.

## 한국어

고객 화면과 별도로 관리자가 전체 주문을 확인할 수 있는 주문 목록 화면을 만든다.

핵심 흐름:

```text
배열 데이터
↓
map()
↓
목록 UI
↓
주문 상태 표시
```

학습 후보:

- 관리자 화면의 역할
- 주문 목록 렌더링
- `map()` 복습
- 목록 페이지와 상세 페이지의 차이
- UI의 책임

**팁**

처음부터 수정 기능까지 넣지 않는다. Day 11은 `전체 주문을 정확하게 보여준다`는 한 가지 목표에 집중한다.

---

# Day 12 — Admin Status Update / 管理者による状態変更 / 관리자 주문 상태 변경

## 日本語

管理者が注文状態を変更できる機能へ進みます。

```text
注文選択
↓
新しい status 選択
↓
map()
↓
object spread
↓
state update
↓
保存
```

Day 9 の更新パターンをより実務的な機能へ再利用します。

**Tip**

新しい文法より、既に学んだ `map()` と object spread を別の機能で再利用することを重視します。

## English

Allow an administrator to update an order status.

```text
select order
↓
choose new status
↓
map()
↓
object spread
↓
state update
↓
persist
```

This reuses the update pattern learned in Day 9.

**Tip**

The important lesson is that the same immutable update pattern can solve multiple real application problems.

## 한국어

관리자가 주문 상태를 변경할 수 있도록 확장한다.

```text
주문 선택
↓
새 status 선택
↓
map()
↓
object spread
↓
state 업데이트
↓
저장
```

Day 9에서 배운 수정 패턴을 더 실무적인 기능에서 다시 사용한다.

**팁**

새로운 문법을 계속 추가하기보다 이미 배운 `map()`과 object spread를 다른 문제에서 반복해서 사용하는 데 집중한다.

---

# Day 13 — Component Separation / コンポーネント分割 / 컴포넌트 분리

## 日本語

ページが大きくなった理由を確認してから、小さなコンポーネントへ分けます。

```text
OrderDetailPage
├── OrderInfo
├── OrderItemList
├── OrderStatus
└── CancelOrderButton
```

中心テーマ：

- component
- props
- parent / child
- responsibility
- reuse

**Tip**

最初から細かく分けすぎず、「なぜ分けたいのか」が見える部分から分割します。

## English

As pages grow, split them into smaller components.

```text
OrderDetailPage
├── OrderInfo
├── OrderItemList
├── OrderStatus
└── CancelOrderButton
```

Main concepts:

- components
- props
- parent / child relationships
- responsibility
- reuse

**Tip**

Do not split everything mechanically. Extract a component when its responsibility becomes clear.

## 한국어

페이지 코드가 커지는 문제를 먼저 경험하고 작은 컴포넌트로 나누기 시작한다.

```text
OrderDetailPage
├── OrderInfo
├── OrderItemList
├── OrderStatus
└── CancelOrderButton
```

핵심 이론:

- component
- props
- 부모 / 자식 관계
- 책임 분리
- 재사용

**팁**

무조건 파일을 많이 나누는 것이 좋은 구조는 아니다. `이 부분은 독립된 책임이 있다`고 설명할 수 있을 때 분리한다.

---

# Day 14 — Custom Hook & Logic Separation / Custom Hook とロジック分離 / Custom Hook과 로직 분리

## 日本語

UI と注文処理が混ざってきたら、注文ロジックを分離する考え方を学びます。

将来的な形：

```tsx
const {
  orders,
  updateOrder,
  cancelOrder,
} = useOrders();
```

中心テーマ：

```text
UI
↓
Custom Hook
↓
Order Logic
↓
Storage
```

**Tip**

Custom Hook を暗記するのではなく、「なぜ UI からロジックを外したいのか」を先に理解します。

## English

When UI code and order logic become mixed, begin separating the logic.

Possible future shape:

```tsx
const {
  orders,
  updateOrder,
  cancelOrder,
} = useOrders();
```

Main model:

```text
UI
↓
Custom Hook
↓
Order Logic
↓
Storage
```

**Tip**

Learn the problem that a custom hook solves before focusing on its syntax.

## 한국어

UI 코드와 주문 처리 로직이 섞이기 시작하면 주문 로직을 분리하는 방법을 배운다.

예상 형태:

```tsx
const {
  orders,
  updateOrder,
  cancelOrder,
} = useOrders();
```

핵심 구조:

```text
UI
↓
Custom Hook
↓
주문 로직
↓
저장소
```

**팁**

Custom Hook 문법부터 외우지 않는다. `왜 UI에서 로직을 분리하고 싶은가?`라는 문제를 먼저 이해한다.

---

# Day 15 — Async / Await Foundations / 非同期処理の基礎 / 비동기 처리 기초

## 日本語

サーバー通信の前に非同期処理を小さな例から学びます。

中心テーマ：

```text
Promise
async
await
try
catch
```

**Tip**

最初から API と一緒に学ばず、同期処理と非同期処理の違いから始めます。

## English

Before server communication, learn asynchronous JavaScript with small examples.

Main topics:

```text
Promise
async
await
try
catch
```

**Tip**

First understand synchronous vs asynchronous execution. Add API calls only after the basic mental model is clear.

## 한국어

서버 통신에 들어가기 전에 비동기 JavaScript를 작은 예제로 공부한다.

핵심 이론:

```text
Promise
async
await
try
catch
```

**팁**

처음부터 API와 한꺼번에 배우지 않는다. 동기와 비동기의 차이 → Promise → async/await 순으로 잘게 나눈다.

---

# Day 16 — HTTP & API Foundations / HTTP と API の基礎 / HTTP와 API 기초

## 日本語

今までの CRUD 操作を HTTP と接続します。

```text
注文取得   → GET
注文作成   → POST
状態変更   → PATCH
注文削除   → DELETE
```

**Tip**

HTTP メソッドを単語として暗記せず、今まで作った機能と対応させます。

## English

Connect the CRUD operations already learned to HTTP.

```text
read orders   → GET
create order  → POST
update status → PATCH
delete order  → DELETE
```

**Tip**

Map each HTTP method to a feature you already understand instead of memorizing definitions in isolation.

## 한국어

지금까지 만든 CRUD 기능을 HTTP 개념과 연결한다.

```text
주문 조회   → GET
주문 생성   → POST
상태 수정   → PATCH
주문 삭제   → DELETE
```

**팁**

HTTP 메서드를 단어로 외우지 말고 지금까지 직접 만든 기능과 1:1로 연결한다.

---

# Day 17 — `fetch()` and Mock API / `fetch()` と Mock API / `fetch()`와 Mock API

## 日本語

`localStorage` からデータを読む方式と、API からデータを取得する方式を比較します。

```text
Before
React → localStorage

After
React → fetch() → API
```

**Tip**

保存場所が変わっても「取得 → state → UI」という基本フローは同じだと確認します。

## English

Compare reading data from `localStorage` with retrieving it through an API.

```text
Before
React → localStorage

After
React → fetch() → API
```

**Tip**

Notice that the storage mechanism changes, but the high-level flow remains: retrieve data → update state → render UI.

## 한국어

`localStorage`에서 데이터를 읽던 방식과 API에서 데이터를 받아오는 방식을 비교한다.

```text
Before
React → localStorage

After
React → fetch() → API
```

**팁**

저장 위치가 달라져도 `데이터 가져오기 → state → UI`라는 큰 흐름은 그대로라는 점을 확인한다.

---

# Day 18+ — Backend Foundations / Backend 基礎 / Backend 기초

## 日本語

フロントエンドだけでなく、サーバーがデータを管理する構造へ進みます。

```text
Client
↓
HTTP
↓
API
↓
Server
```

学習内容は実際のプロジェクト構成に合わせてさらに細かい Day に分割します。

**Tip**

Backend を一日で学ぼうとせず、request / response、route、server logic などを個別に分けます。

## English

Move from a frontend-only application to a structure where a server manages data.

```text
Client
↓
HTTP
↓
API
↓
Server
```

The backend phase should be divided into smaller days based on the actual project stack.

**Tip**

Do not treat “backend” as one topic. Separate requests, responses, routes, server logic, and persistence into small learning units.

## 한국어

프론트엔드만 존재하는 앱에서 서버가 데이터를 관리하는 구조로 발전한다.

```text
Client
↓
HTTP
↓
API
↓
Server
```

실제 프로젝트 기술 스택이 정해지면 Backend도 여러 Day로 다시 잘게 나눈다.

**팁**

`백엔드`를 하나의 거대한 주제로 공부하지 않는다. request / response / route / server logic 등을 각각 작은 단위로 분해한다.

---

# Later Phase — Database / データベース / 데이터베이스

## 日本語

注文データをブラウザではなく Database に保存します。

将来的なデータ：

```text
users
products
orders
order_items
```

学習テーマ：

- schema
- table
- primary key
- foreign key
- relationship
- CRUD

**Tip**

Database も注文データと商品データの関係から少しずつ学びます。

## English

Persist application data in a database rather than only in the browser.

Possible data model:

```text
users
products
orders
order_items
```

Topics:

- schema
- tables
- primary keys
- foreign keys
- relationships
- CRUD

**Tip**

Learn database concepts through the data already present in the project rather than through unrelated examples.

## 한국어

브라우저가 아니라 Database에 실제 데이터를 저장하는 단계로 발전한다.

예상 데이터 구조:

```text
users
products
orders
order_items
```

학습 주제:

- schema
- table
- primary key
- foreign key
- relationship
- CRUD

**팁**

Database 역시 별개의 예제보다 지금 프로젝트의 상품과 주문 관계를 이용해서 하나씩 배운다.

---

# Later Phase — Authentication & Authorization / 認証と権限 / 인증과 권한

## 日本語

ユーザーごとの注文を区別し、管理者権限も追加します。

```text
Sign Up
↓
Login
↓
Authentication
↓
My Orders

USER / ADMIN
↓
Authorization
```

**Tip**

注文 API と Database の基本が理解できてから認証へ進みます。

## English

Add user identity and distinguish normal users from administrators.

```text
Sign Up
↓
Login
↓
Authentication
↓
My Orders

USER / ADMIN
↓
Authorization
```

**Tip**

Authentication becomes easier to understand after the order API and database flow are already clear.

## 한국어

사용자별 주문을 구분하고 관리자 권한까지 추가한다.

```text
회원가입
↓
로그인
↓
인증
↓
내 주문

USER / ADMIN
↓
권한 관리
```

**팁**

주문 API와 Database 흐름을 이해한 다음 인증으로 넘어간다. 어려운 개념을 동시에 겹치지 않는 것이 중요하다.

---

# Later Phase — Production-Level UX / 実務レベル UX / 실무 수준 UX

## 日本語

機能だけでなく、実際のユーザーが遭遇する状態を処理します。

```text
Loading
Error
Empty State
Validation
404
Permission
Feedback
```

**Tip**

正常ケースだけでなく「データがない」「通信に失敗した」「入力が間違っている」ケースを考えます。

## English

Handle the states that real users encounter, not only the successful path.

```text
Loading
Error
Empty State
Validation
404
Permission
Feedback
```

**Tip**

A production-quality project must explain what happens when data is missing, requests fail, or input is invalid.

## 한국어

기능 성공 상황뿐 아니라 실제 사용자가 만날 수 있는 여러 상태를 처리한다.

```text
Loading
Error
Empty State
Validation
404
Permission
Feedback
```

**팁**

`정상적으로 됐을 때`만 구현하지 않고 `데이터가 없을 때`, `통신 실패`, `잘못된 입력`까지 생각하기 시작한다.

---

# Later Phase — Testing, Refactoring & Deployment / テスト・リファクタリング・デプロイ / 테스트·리팩터링·배포

## 日本語

最後は「動くコード」から「維持できるプロジェクト」へ進みます。

将来学ぶテーマ：

```text
Testing
Refactoring
Folder Structure
Error Handling
Environment Variables
Build
Deployment
README
```

**Tip**

テストやリファクタリングは最後に一度だけ行う作業ではありません。プロジェクトが成長する各段階で少しずつ導入します。

## English

Move from code that merely works to a project that can be maintained and deployed.

Future topics:

```text
Testing
Refactoring
Folder Structure
Error Handling
Environment Variables
Build
Deployment
README
```

**Tip**

Testing and refactoring should gradually become part of the development process rather than being treated as one final cleanup task.

## 한국어

마지막에는 `동작하는 코드`에서 `유지보수하고 배포할 수 있는 프로젝트`로 발전한다.

예상 학습 주제:

```text
Testing
Refactoring
Folder Structure
Error Handling
Environment Variables
Build
Deployment
README
```

**팁**

테스트와 리팩터링은 마지막에 한꺼번에 하는 작업으로 생각하지 않는다. 프로젝트가 커질 때마다 조금씩 적용한다.

---

# Overall Learning Strategy

## 日本語

今後の基本学習サイクル：

```text
1. 問題を確認
↓
2. 理論を学ぶ
↓
3. 小さいコードで実験
↓
4. 現在のプロジェクトに適用
↓
5. 動作確認
↓
6. なぜ動くか説明
↓
7. 復習
↓
8. 次の小さいテーマ
```

一度に大きな機能を作らず、必要なら一つの Day をさらに複数の STEP に分けます。

**Tip**

進度より「自分で説明できるか」を優先します。

## English

Use this learning cycle going forward:

```text
1. Identify a problem
↓
2. Learn the theory
↓
3. Test it with a small example
↓
4. Apply it to the current project
↓
5. Verify behavior
↓
6. Explain why it works
↓
7. Review
↓
8. Move to the next small topic
```

Large features can be split into many smaller steps whenever necessary.

**Tip**

Prioritize being able to explain the code over finishing the roadmap quickly.

## 한국어

앞으로 기본 학습 사이클을 다음처럼 가져간다.

```text
1. 현재 문제 확인
↓
2. 이론 공부
↓
3. 작은 코드로 실험
↓
4. 현재 프로젝트에 적용
↓
5. 동작 테스트
↓
6. 왜 동작하는지 직접 설명
↓
7. 복습
↓
8. 다음 작은 주제로 이동
```

한 Day의 내용도 어렵거나 많다면 다시 여러 STEP으로 잘게 쪼갠다.

**팁**

로드맵을 빨리 끝내는 것을 목표로 하지 않는다. `내가 이 코드가 왜 필요한지 설명할 수 있는가?`를 다음 단계로 넘어가는 기준으로 삼는다.

---

# Roadmap at a Glance

```text
Day 9
Order Status Update
map() + object spread + localStorage + setState
        ↓
Day 10
Order Status Modeling
string → String Literal → Union Type → Business State
        ↓
Day 11
Admin Order List
        ↓
Day 12
Admin Status Update
        ↓
Day 13
Component Separation + Props
        ↓
Day 14
Custom Hook + Logic Separation
        ↓
Day 15
Async JavaScript
        ↓
Day 16
HTTP + API Theory
        ↓
Day 17
fetch() + Mock API
        ↓
Day 18+
Backend
        ↓
Database
        ↓
Authentication / Authorization
        ↓
Production UX
        ↓
Testing / Refactoring
        ↓
Deployment
        ↓
Production-Level Portfolio Project
```

---

# Final Goal

```text
현재 학습 프로젝트
↓
기능 추가
↓
Type Safety
↓
상태 모델링
↓
컴포넌트 구조화
↓
로직 분리
↓
API 통신
↓
Backend
↓
Database
↓
Authentication
↓
Error / Loading / Validation
↓
Testing
↓
Deployment
↓
실무 수준의 프로젝트
```

핵심 원칙:

> **크게 한 번에 만들지 않는다. 작은 문제 하나를 이해하고, 작은 기능 하나를 완성하고, 왜 그렇게 만들었는지 설명할 수 있게 된 뒤 다음 단계로 이동한다.**
