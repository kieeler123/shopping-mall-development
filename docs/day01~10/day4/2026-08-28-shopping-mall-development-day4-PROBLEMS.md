# Day 4 React/Next.js 학습 --- 문제

[📖 GENERAL](2026-08-28-shopping-mall-development-day4-GENERAL_JA_EN_KO.md)\
[✅ 정답·해설](2026-08-29-shopping-mall-development-day5-ANSWER_JA_EN_KO.md)

> **팁**\
> GENERAL을 보지 않고 먼저 풀고, 확신 없이 맞힌 문제는 △로 표시한다.

## 빠른 학습 범위

`setCart(prev)` / `find` / `map` / `filter` / `reduce` / `Math.max,min`
/ JSON / useEffect / isLoaded / derived value

<a id="problem-01"></a>

## 問題 1 특정 상품의 `quantity`만 수정하면서 새로운 cart 배열을 만들 때 가장 적절한 메서드는?

1. `find()` 2. `map()` 3. `filter()` 4. `reduce()`

<a id="problem-02"></a>

## 問題 2 `productId === 2`인 상품을 제거하는 코드는?

1. `cart.filter((item) => item.productId === 2)`
2. `cart.map((item) => item.productId !== 2)`
3. `cart.filter((item) => item.productId !== 2)`
4. `cart.find((item) => item.productId !== 2)`

<a id="problem-03"></a>

## 問題 3 `setCart((prev) => ...)`의 `prev`는?

1. localStorage 문자열
2. React가 updater에 전달하는 직전 state
3. products 배열
4. totalPrice

<a id="problem-04"></a>

## 問題 4 수량을 최소 1로 제한하는 코드는?

1. `Math.min(1, item.quantity - 1)`
2. `Math.max(1, item.quantity - 1)`
3. `Math.max(10, item.quantity - 1)`
4. `Math.min(10, item.quantity - 1)`

<a id="problem-05"></a> \## 問題 5 빈칸에 들어갈 메서드는?

```tsx
const product = products.____((product) => product.id === item.productId);
```

1.  `map`
2.  `filter`
3.  `reduce`
4.  `find`

<a id="problem-06"></a>

## 問題 6

`reduce(..., 0)`에서 마지막 `0`의 역할은?

1. 최대 수량
2. productId 기본값
3. 누적값 total의 초기값
4. cart 길이

<a id="problem-07"></a>

## 問題 7 cart 배열을 localStorage에 저장하기 위한 변환은?

1. `JSON.parse(cart)`
2. `JSON.stringify(cart)`
3. `Number(cart)`
4. `cart.filter()`

<a id="problem-08"></a>

## 問題 8 SAVE effect에서 `isLoaded`를 확인하는 핵심 이유는?

1. 최대 상품 개수 제한
2. 가격 검색
3. 초기 빈 cart가 기존 저장 데이터를 덮어쓰는 것 방지
4. reduce를 한번만 실행

<a id="problem-09"></a>

## 問題 9 Day 4의 책임 분리로 가장 적절한 것은?

1. handler가 모든 저장까지 직접 처리
2. handler는 state 변경, effect는 localStorage 동기화
3. localStorage만 변경
4. 총액을 localStorage에서 직접 계산

<a id="problem-10"></a>

## 問題 10 `totalPrice`를 별도 state로 만들지 않아도 되는 이유는?

1. 숫자는 state가 될 수 없어서
2. localStorage가 계산해서
3. cart에서 reduce로 계산 가능한 파생값이라서
4. 화면에 출력할 수 없어서

<a id="problem-11"></a>

## 問題 11 --- 코드 복원

빈칸을 채우세요.

```tsx
setCart((prev) =>
  prev.____((item) =>
    item.productId === productId
      ? {
          ____,
          quantity: ____________,
        }
      : item,
  ),
);
```

조건: 수량 +1, 최대 10, 다른 속성 유지.

<a id="problem-12"></a>

## 問題 12 --- 전체 흐름 복원

```text
사용자 클릭
↓
map() / filter()
↓
________
↓
React 재렌더링
↓
________ 로 총액 계산
↓
SAVE useEffect
↓
________
```

## 복습 체크

- [ ] `find/map/filter/reduce`를 구별할 수 있다.
- [ ] `prev`를 설명할 수 있다.
- [ ] `Math.max/min`을 설명할 수 있다.
- [ ] `stringify/parse` 방향을 설명할 수 있다.
- [ ] LOAD/SAVE effect를 설명할 수 있다.
- [ ] `isLoaded`의 이유를 설명할 수 있다.
- [ ] derived value를 설명할 수 있다.
