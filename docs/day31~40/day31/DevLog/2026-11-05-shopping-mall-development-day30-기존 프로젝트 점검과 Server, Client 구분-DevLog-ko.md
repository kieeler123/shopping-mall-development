# Day 31 — 학습 기록
> 기존 프로젝트 점검과 Server / Client 구분

**학습일:** 2026-11-05  |  **계획 학습 시간:** 120 min  |  **Score:** 94/100 (PASS)

## 수행한 학습
- 상품 데이터(products.ts) 확인
- 장바구니 localStorage["cart"] 읽기
- 체크아웃에서 name·price·quantity 주문 스냅샷 생성
- localStorage["orders"] 저장 및 orders-updated 알림
- 장바구니 삭제 및 cart-updated 알림
- 주문 완료 페이지로 이동
- 주문 목록·상세에서 조회 및 취소

- 16 files checked: 14 present, 2 missing
- Multiple choice: B, 20/20
- Project analysis: 50/50
- Coding challenge: 24/30

## 검사 기록
```powershell
npx tsc --noEmit
npx eslint .
```
터미널 스크린샷상 오류·경고 출력 없이 프롬프트로 복귀했다. 종료 코드는 별도 확인하지 않았고, 브라우저 전체 기능 테스트는 수행하지 않았다.

## 발견 사항
관리자 API Route Handler 두 개가 존재하지 않으며, 사용자 주문은 브라우저 localStorage에 저장됩니다.

## 학습 성찰
서버 API와 브라우저 저장소는 자동으로 연결되지 않습니다.

실행 위치와 데이터 저장 위치를 먼저 확인하세요.
