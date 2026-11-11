# Day 33 디버깅 일지

Next.js 쇼핑몰 주문 조회 API의 HTTP 상태 코드와 클라이언트 오류 처리를 검증했다.

## Verified observations

- GET /api/orders 요청으로 주문 목록을 표시했다.
- 주문 ID 0을 조회했을 때 HTTP 400과 입력 오류 메시지를 확인했다.
- 주문 ID 1을 조회했을 때 HTTP 200과 주문 상세 정보를 확인했다.
- 주문 ID abc를 조회했을 때 HTTP 400과 입력 오류 메시지를 확인했다.
- 주문 ID 999를 조회했을 때 HTTP 404와 주문 없음 메시지를 확인했다.
- Chrome DevTools Network 탭에서 각 요청의 상태 코드를 직접 확인했다.

## Context

- Day 32에는 API 경로를 src/app이 아닌 프로젝트 루트 app/api/orders/route.ts에 배치하여 404 경로 문제를 해결했다.
- 과거 500 응답 화면은 실제 예외 원인 확인이 아닌, HTTP 500 응답을 의도적으로 반환한 테스트였다.
- 개발 서버는 과거 Turbopack 관련 오류가 있었고 npm run dev -- --webpack 방식으로 우회 실행했다.

## Lessons

- 400: 숫자가 아니거나 0 이하인 주문 ID처럼 요청 자체가 유효하지 않다.
- 404: ID 형식은 유효하지만 해당 주문이 없다.
- 200: 주문 조회가 정상 처리되었다.
- 500: 예기치 못한 서버 내부 오류에 사용한다. 실제 내부 오류를 확인하지 않았다면 원인을 단정하지 않는다.
- fetch는 400이나 404를 받았다는 이유만으로 자동으로 reject되지 않는다. response.ok를 검사하고 필요하면 throw해야 한다.
- React UI에서는 로딩·성공·실패를 구분하고 사용자가 다시 시도할 수 있게 한다.

## 문제 상황 / 재현 단계

(Add your notes here.)

## 관찰한 결과 / Network 상태 코드

(Add your notes here.)

## 원인 가설 / 확인 근거

(Add your notes here.)

## 수정 사항 / 재검증

(Add your notes here.)

## 배운 점 / 다음 예방책

(Add your notes here.)