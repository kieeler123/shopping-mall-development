# Day 18 React 학습 총정리

## 1. 함수 Props 집중 복습

오늘 가장 먼저 확인한 부분은 **State를 가진 컴포넌트에서 handler를
만들고, 필요한 자식 컴포넌트까지 함수 Props로 전달하는 흐름**이었습니다.

``` text
App
├─ Header
└─ ProductList
   └─ ProductCard
      └─ Button
```

핵심 원리:

``` text
State를 가진 컴포넌트
↓
State를 변경하는 handler 생성
↓
함수를 Props로 전달
↓
중간 컴포넌트가 다시 전달
↓
실제로 필요한 컴포넌트에서 실행
```

예:

``` jsx
function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prevCart => [...prevCart, item]);
  };

  return (
    <>
      <Header count={cart.length} />
      <Shop addToCart={addToCart} />
    </>
  );
}
```

``` jsx
function Shop({ addToCart }) {
  return <ItemCard item={item} addToCart={addToCart} />;
}
```

``` jsx
function ItemCard({ item, addToCart }) {
  return (
    <button onClick={() => addToCart(item)}>
      장바구니 추가
    </button>
  );
}
```

> **팁:** 함수 Props가 헷갈리면
> `누가 만들었나? → 지금 누가 가지고 있나? → 누가 실행하나?`를 추적한다.

## 2. Props는 하나의 객체로 들어온다

잘못된 형태:

``` jsx
function ProductCard(product, onAdd) {
```

React 컴포넌트는 하나의 Props 객체를 받으므로 다음처럼 작성할 수 있다.

``` jsx
function ProductCard(props) {
```

또는 구조 분해를 사용한다.

``` jsx
function ProductCard({ product, onAdd }) {
```

> **팁:** `<Component a={} b={} c={} />`를 보면 받는 쪽의
> `function Component({ a, b, c })`를 연결해서 생각한다.

## 3. State 위치 판단

State를 무조건 최상위에 두는 것이 아니라, **그 State를 필요로 하는
컴포넌트들의 적절한 공통 부모**에 둔다.

``` text
App
├─ Header ← cart 개수 필요
└─ ProductList
   └─ ProductCard ← cart 추가 기능 필요
```

이 경우 `App`이 적절한 State 위치가 될 수 있다.

``` text
State가 App에 있음
↓
setState도 App에 있음
↓
State 변경 handler를 App에서 생성
↓
필요한 자식에게 Props로 전달
```

> **팁:** `가장 위가 어디지?`보다
> `이 데이터를 사용하는 컴포넌트들의 공통 부모가 어디지?`라고 질문한다.

## 4. 배열 State의 객체 수정

연습한 State:

``` jsx
const [users, setUsers] = useState([
  { id: 1, name: "A", active: false },
  { id: 2, name: "B", active: false },
]);
```

목표는 `id === 2`인 사용자만 `active: true`로 변경하는 것이었다.

여기서 핵심은 변수의 역할을 구분하는 것이다.

``` text
users
→ 기존 전체 배열

user
→ map이 현재 처리하는 요소 하나

updatedUsers
→ map이 만든 새로운 전체 배열

activateUser
→ 작업을 실행하는 함수
```

React를 잠시 빼고 보면:

``` js
const numbers = [1, 2, 3];

const doubledNumbers = numbers.map(number => {
  return number * 2;
});
```

``` text
numbers → 기존 전체 배열
number → 현재 요소 하나
doubledNumbers → 새로운 전체 배열
```

> **팁:** 복잡해지면 변수 옆에 `배열 / 객체 하나 / 함수 / 새 배열`처럼
> 역할을 표시한다.

## 5. map의 결과를 받아야 한다

`map()`은 새로운 배열을 반환한다.

잘못된 흐름:

``` js
users.map(user => {
  // ...
});

setUsers(users);
```

올바른 흐름:

``` js
const updatedUsers = users.map(user => {
  if (user.id === 2) {
    return {
      ...user,
      active: true
    };
  }

  return user;
});

setUsers(updatedUsers);
```

> **팁:** `map 안에서 무엇을 하지?`뿐 아니라
> `map이 끝나면 어떤 새로운 배열이 나오지?`까지 생각한다.

## 6. Object Spread의 역할

기존 객체를 직접 수정하지 않고 새 객체를 만든다.

``` js
{
  ...user,
  active: true
}
```

의미:

``` text
기존 user 속성 복사
+
active만 새로운 값으로 덮어쓰기
```

수정 대상이 아니면:

``` js
return user;
```

로 유지한다.

> **팁:** 객체 수정에서는 `기존 객체 복사 → 변경할 속성 덮어쓰기`를
> 떠올린다.

## 7. 최종 전이 문제

상품 배열에서도 같은 원리를 적용했다.

``` jsx
const [products, setProducts] = useState([
  { id: 10, name: "키보드", price: 50000 },
  { id: 20, name: "마우스", price: 30000 },
  { id: 30, name: "모니터", price: 200000 },
]);
```

`id === 20`인 상품의 가격을 변경:

``` js
const updatedProducts = products.map(product => {
  if (product.id === 20) {
    return {
      ...product,
      price: product.price + 10000
    };
  }

  return product;
});

setProducts(updatedProducts);
```

`price: 40000`도 현재 데이터에서는 결과가 맞지만, 요구사항이 **기존
가격에서 10,000 증가**라면 `product.price + 10000`이 더 정확하다.

> **팁:** `증가 / 감소 / 현재 값에서 / 기존 값 기준`이라는
> 요구사항에서는 고정값보다 기존 값을 이용한 계산인지 확인한다.

## 8. 오늘 발견한 실수 유형

### 개념적으로 보강한 부분

-   함수 Props의 전달 경로
-   Props가 하나의 객체라는 점
-   `map`의 반환값
-   전체 배열과 현재 요소의 구분
-   새로운 배열을 Setter에 전달하는 과정

### 문법·주의 실수

-   `setFavorite` ↔ `setFavorites`
-   `onadd` ↔ `onAdd`
-   JSX self-closing 누락
-   Fragment 누락
-   요구사항이 `active: true`인데 `false` 작성

> **팁:** 오류를 `개념 오류 / 문법 오류 / 오타 / 요구사항 확인 실수`로
> 분류하면 무엇을 복습해야 하는지 명확해진다.

## 9. 현재 학습 상태

  영역                             현재 상태
  -------------------------------- -----------------------
  `useState` 기본                  ✅
  Event 기본                       ✅
  배열 추가/삭제                   ✅
  함수 Props                       ✅ 보강 완료
  Props 구조 분해                  ✅
  State 위치 판단                  ✅ 기본 가능
  `map`                            ✅
  조건으로 대상 선택               ✅
  Object Spread 수정               ✅
  `map` 결과 → Setter              ✅ 집중 보강
  `key`와 Props 차이               ✅
  기존 값 기반 업데이트            🟡 한 번 더 경험 필요
  복잡한 구조에서 변수 역할 추적   🟡 장기적으로 확인
  요구사항 세부 구현               🟡 주의
  JSX 세부 문법                    🟡 가끔 실수

## 10. 다음 복습 전략

오늘 문제를 바로 반복하기보다는 진도를 더 진행한 뒤 다른 맥락에서 같은
패턴을 자연스럽게 다시 사용해 본다.

예:

-   특정 상품 수량 변경
-   특정 상품 옵션 변경
-   주문 상태 변경
-   특정 항목 삭제
-   자식 컴포넌트에서 부모 State 변경

그때 별도의 힌트 없이 다음을 다시 조합할 수 있는지 확인한다.

``` text
State 위치
함수 Props
map
조건
Object Spread
Setter
```

> **팁:** 코드를 통째로 외우기보다
> `전체 → 하나씩 → 대상 찾기 → 새 객체 → 새 전체 → Setter`라는 사고
> 과정을 기억한다.

## 다음 학습 시작점

다음 시간에는 오늘 내용을 처음부터 반복하지 않고 **Events / Forms**부터
이어간다.

``` text
Events / Forms
↓
input
↓
onChange
↓
event.target.value
↓
value={state}
↓
Controlled Component
↓
form / onSubmit
↓
preventDefault()
```

오늘의 핵심은 여러 개념이 합쳐졌을 때 막히는 지점을 발견하고, 이를
분해해서 이해한 뒤 다시 합쳐서 코드를 작성해 본 것이다.
