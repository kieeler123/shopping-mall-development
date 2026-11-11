# Day 30 학습 플랜 --- React + TypeScript 실전 디버깅

> **학습 목표:** Day 29의 UI 상태 모델링을 기반으로 TypeScript, ESLint,
> 테스트를 사용해 오류를 탐지·분류·수정한다.
>
> **총 학습 시간:** 100분 (휴식 제외)\
> **선행 학습:** Day 29 --- Loading / Error / Empty / Success, `&&`,
> Early Return, GET/PATCH 오류 분리

## 1. 학습 성과

학습 종료 후 다음을 수행할 수 있다.

-   문법 오류(Syntax), 타입 오류(Type), 린트 경고(Lint), 논리
    오류(Logic)를 구분한다.
-   VS Code의 Problems 패널에서 오류 위치와 메시지를 읽는다.
-   `npx tsc --noEmit`과 `npx eslint .`를 실행하고 결과를 해석한다.
-   React/TSX 컴포넌트의 구조 분해, Props, JSX 태그, 조건문 오류를
    수정한다.
-   자동 검사로 놓칠 수 있는 UI 논리 오류를 테스트한다.
-   수정 원인과 검증 결과를 짧은 디버깅 기록으로 남긴다.

**팁:** 코드를 바로 고치기 전에 오류 종류, 예상 원인, 확인할 도구를 먼저
적는다.

## 2. 100분 학습 시간표

  ------------------------------------------------------------------------
  교시                              시간 내용             결과물
  ---------------- --------------------- ---------------- ----------------
  1\. 오류 분류                     15분 Syntax / Type /  오류 분류표
                                         Lint / Logic     
                                         구분             

  2\. 도구 실습                     20분 VS Code          검사 결과 기록
                                         Problems,        
                                         TypeScript,      
                                         ESLint           

  3\. React 디버깅                  20분 `useOrders`,     수정된 컴포넌트
                                         Props, JSX 오류  
                                         수정             

  4\. 논리 오류                     25분 UI 4상태,        상태별 검증표
  검증                                   GET/PATCH 오류   
                                         분리             

  5\. 실전                          20분 오류 수정        채점표·오류 노트
  평가·기록                              테스트와 회고    

  **합계**                     **100분**                  
  ------------------------------------------------------------------------

**팁:** 2교시와 4교시 사이에 5\~10분 휴식을 추가해도 좋다.

## 3. 준비 및 검사 명령어

기존 Next.js + TypeScript 프로젝트를 VS Code에서 연다. 프로젝트에 필요한
패키지와 ESLint 설정이 이미 있는지 확인한다.

``` bash
npx tsc --noEmit
npx eslint .
```

`tsc`는 TypeScript의 타입·문법 오류를, ESLint는 설정된 규칙 위반을
확인한다. Prettier는 주로 서식을 정리하며, 논리 오류를 검증하지는
않는다. 검사 명령어는 프로젝트 설정에 따라 조정할 수 있다.

**팁:** 오류 메시지를 `파일 경로 → 줄 번호 → 오류 설명 → 수정 내용`
순서로 기록한다.

## 4. 기준 컴포넌트

``` tsx
function AdminOrdersPage() {
  const { orders, isLoading, error } = useOrders();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (orders.length === 0) return <p>Empty</p>;

  return <OrderList orders={orders} />;
}
```

이 코드를 기준으로 일부러 오류를 주입하고, 검사 도구의 결과를 예측한 뒤
수정한다. `useOrders()`는 객체를 반환하며 `OrderList`는 `orders` Props를
받는다고 가정한다.

## 5. 실습 단계

### Level 1 --- 철자 및 구조 분해 오류

``` tsx
const [orders, isLoading, error] = useOrders();
return <p>{err}</p>;
```

객체 구조 분해를 고치고 `err` 오타를 수정한다.

**팁:** `useState`는 배열을 반환하지만 사용자 정의 Hook은 반환 타입을
직접 확인해야 한다.

### Level 2 --- JSX 및 Props 오류

``` tsx
return <OrderList order={orders}>
```

Props 이름을 `orders`로 수정하고 자체 종료 태그를 사용한다.

**팁:** JSX 문법 오류는 TypeScript/TSX 파서가 감지할 수 있다.

### Level 3 --- Success 논리 오류

``` tsx
{!isLoading && error && orders.length > 0 && (
  <OrderList orders={orders} />
)}
```

`error`가 아닌 `!error`가 필요한 이유를 설명한다.

**팁:** 문법과 타입이 모두 정상이어도 UI 동작이 틀릴 수 있다.

### Level 4 --- GET/PATCH 오류 분리

조회 실패(`fetchError`)와 수정 실패(`updateError`)를 분리한다. 수정 실패
시에는 오류 알림을 표시하되 기존 주문 목록을 유지한다.

``` tsx
if (fetchError) return <p>조회 오류: {fetchError}</p>;

return (
  <main>
    {updateError && <p role="alert">수정 오류: {updateError}</p>}
    {orders.length === 0
      ? <p>Empty</p>
      : <OrderList orders={orders} />}
  </main>
);
```

이 코드는 Loading 처리가 앞서 완료되었다고 가정한 부분 예제다.

**팁:** 화면 전체를 막아야 하는 오류와 일부 작업 실패 알림을 구분한다.

### Level 5 --- 검증

Loading / Error / Empty / Success의 네 상태와 PATCH 실패 후 목록 유지
여부를 직접 확인한다.

**팁:** 도구가 찾아주는 오류와 테스트가 찾아주는 오류를 따로 기록한다.

## 6. 평가 기준 (100점)

  평가 항목                     점수
  ------------------------ ---------
  오류 종류 구분                  15
  TypeScript 오류 해석            20
  ESLint 오류 해석                15
  React 컴포넌트 디버깅           30
  논리 오류 수정 및 검증          20
  **총점**                   **100**

**권장 통과 기준:** 80점 이상.

**팁:** 장문의 답안은 VS Code에서 작성해 채팅에 붙여넣는다. 이전에
발생한 입력창 커서 이동·글자 삭제 문제를 피하기 위한 방식이다.

## 7. 디버깅 기록 템플릿

``` md
### 오류 기록
- 증상:
- 오류 종류:
- 도구 메시지:
- 원인:
- 수정:
- 재검증 결과:
- 다음에 예방할 방법:
```

## 8. 후속 학습

-   **Day 31 제안:** React 컴포넌트 테스트 기초
-   **Day 32 제안:** Vitest + React Testing Library로 UI 상태 테스트

**팁:** Day 30에서는 새로운 기능 추가보다 기존 코드의 오류를 빠르고
정확하게 발견·수정하는 능력에 집중한다.
