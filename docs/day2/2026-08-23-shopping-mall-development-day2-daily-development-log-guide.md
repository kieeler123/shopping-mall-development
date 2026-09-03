# Shopping Mall Development Log Guide
# ショッピングモール開発記録ガイド
# 쇼핑몰 개발 기록 가이드

> 이 문서는 쇼핑몰 프로젝트의 Day별 개발 기록 방식을 고정하기 위한 기준 문서다.
> 실제 구현 범위는 프로젝트 진행 상황에 따라 바뀔 수 있으며, 매일 작업 종료 시 다음 Day의 목표를 기록한다.

---

# 日本語

## 1. 記録の目的

このプロジェクトでは、最初から大きな機能をまとめて実装するのではなく、毎日小さな単位で完成させながら進める。

毎日の開発終了時に、以下を記録する。

- 今日何をしたか
- 何が完成したか
- 何を学んだか
- 問題や改善点は何か
- 明日は何をするか

これにより、単なる完成コードだけではなく、プロジェクトがどのように成長したかという過程も残す。

> **Tip**
> 「何時間作業したか」より「どのユーザーフローを完成させたか」を中心に記録する。

## 2. Dayごとの基本方針

### Day 1 — 基盤構築

目的:

- Next.jsプロジェクトの基本環境を準備する
- フォルダと基本構造を整理する
- 今後機能を追加できる最低限の土台を作る
- 開発原則とロードマップを整理する

完了基準:

- プロジェクトが正常に起動する
- 基本ページと構造が確認できる
- 今後の開発方向が文書化されている

次のDay:

- 商品一覧から商品詳細へ進める最初のショッピングフローを作る

### Day 2 — 商品一覧 → 商品詳細

目的:

- 最小限のProductデータ構造を定義する
- 商品一覧ページを作る
- 商品カードを表示する
- 商品を選択すると詳細ページへ移動できるようにする
- 動的ルーティングを理解する

想定フロー:

```text
/products
   ↓
Product Card
   ↓
/products/[id]
   ↓
Product Detail
```

完了基準:

- 複数の商品を一覧表示できる
- 商品をクリックできる
- 正しい商品詳細ページへ移動する
- 詳細ページに該当商品の情報が表示される

次のDay:

- 商品詳細から商品をカートに追加できるようにする

### Day 3 — カート追加

目的:

- 商品詳細ページに「カートに追加」機能を作る
- Client Componentが必要になる理由を理解する
- 初期カートをlocalStorageで管理する
- 商品データとカートデータの責任を分ける

想定フロー:

```text
Product Detail
   ↓
Add to Cart
   ↓
localStorage
   ↓
Cart
```

完了基準:

- 商品をカートへ追加できる
- ブラウザを更新してもカートデータが維持される
- カートページで追加した商品を確認できる

次のDay:

- カート商品の数量変更と削除を実装する

### Day 4 — カート管理

目的:

- カート内の商品一覧を完成させる
- 数量を変更できるようにする
- 商品を削除できるようにする
- 合計金額を計算する

完了基準:

- カート商品の確認ができる
- 数量変更ができる
- 商品削除ができる
- 合計金額が正しく更新される

次のDay:

- v0.1全体を確認し、リファクタリングと文書整理を行う

### Day 5 — v0.1完成と整理

目的:

- 商品一覧 → 商品詳細 → カートの全体フローを確認する
- 重複コードや不自然な責任分担を確認する
- 必要な範囲だけリファクタリングする
- requirements、ERD、architecture、decisions、roadmapを更新する
- Git履歴を整理し、必要であればv0.1.0タグを作る

完了基準:

```text
商品一覧
   ↓
商品詳細
   ↓
カート追加
   ↓
数量変更 / 削除
```

このフローが最初から最後まで正常に動作する。

> **Tip**
> Day 2〜5は固定スケジュールではない。作業が終わらなければ次の日へ持ち越し、完成していない状態で無理に次の機能へ進まない。

## 3. 毎日の記録テンプレート

```markdown
# Day XX — タイトル

## 今日の目標

- 

## 今日やったこと

- 

## 完成したこと

- 

## 学んだこと

- 

## 問題・改善点

- 

## 決定事項

- 

## Git

- Branch:
- Commit:
- Tag:

## 明日やること

- 

## 明日の完了基準

- 
```

---

# English

## 1. Purpose of the Development Log

This project will not be built by implementing many large features at once. Each day should finish a small, working piece of the shopping mall.

At the end of each development session, record:

- What was worked on today
- What was completed
- What was learned
- Problems or areas for improvement
- What should be done tomorrow

This preserves not only the final code but also the process of how the project evolved.

> **Tip**
> Focus the log on which user flow was completed rather than how many hours were spent coding.

## 2. Day-by-Day Direction

### Day 1 — Foundation

Goals:

- Prepare the basic Next.js project environment
- Organize the initial folders and project structure
- Build the minimum foundation for adding features later
- Document the development principles and roadmap

Definition of done:

- The project runs correctly
- The basic pages and structure can be verified
- The future development direction is documented

Next Day:

- Build the first shopping flow from the product list to product details

### Day 2 — Product List → Product Detail

Goals:

- Define the minimum Product data structure
- Build the product list page
- Display product cards
- Navigate from a selected product to its detail page
- Understand dynamic routing

Expected flow:

```text
/products
   ↓
Product Card
   ↓
/products/[id]
   ↓
Product Detail
```

Definition of done:

- Multiple products are displayed
- A product can be clicked
- The correct product detail page opens
- The selected product information appears on the detail page

Next Day:

- Allow a product to be added to the cart from the product detail page

### Day 3 — Add to Cart

Goals:

- Add an Add to Cart action to the product detail page
- Understand why a Client Component is needed
- Store the initial cart in localStorage
- Separate product-data responsibility from cart-data responsibility

Expected flow:

```text
Product Detail
   ↓
Add to Cart
   ↓
localStorage
   ↓
Cart
```

Definition of done:

- A product can be added to the cart
- Cart data remains after a browser refresh
- Added products appear on the cart page

Next Day:

- Implement quantity changes and product removal in the cart

### Day 4 — Cart Management

Goals:

- Complete the cart item list
- Allow quantity changes
- Allow item removal
- Calculate the total price

Definition of done:

- Cart items can be viewed
- Quantities can be changed
- Items can be removed
- The total price updates correctly

Next Day:

- Review v0.1 and perform focused refactoring and documentation updates

### Day 5 — Complete and Review v0.1

Goals:

- Verify the complete Product List → Product Detail → Cart flow
- Review duplicated code and unclear responsibilities
- Refactor only where necessary
- Update requirements, ERD, architecture, decisions, and roadmap documents
- Clean up Git history and create a v0.1.0 tag if appropriate

Definition of done:

```text
Product List
   ↓
Product Detail
   ↓
Add to Cart
   ↓
Change Quantity / Remove Item
```

The entire flow works correctly from beginning to end.

> **Tip**
> Days 2–5 are not fixed deadlines. If a task is unfinished, carry it forward instead of moving to the next feature with an incomplete implementation.

## 3. Daily Development Log Template

```markdown
# Day XX — Title

## Today's Goal

- 

## What I Did Today

- 

## What I Completed

- 

## What I Learned

- 

## Problems / Improvements

- 

## Decisions

- 

## Git

- Branch:
- Commit:
- Tag:

## What I Will Do Tomorrow

- 

## Tomorrow's Definition of Done

- 
```

---

# 한국어

## 1. 기록 목적

이 프로젝트는 처음부터 많은 기능을 한꺼번에 구현하지 않고, 매일 작은 단위의 기능을 실제로 완성하면서 진행한다.

매일 개발을 마칠 때 다음 내용을 기록한다.

- 오늘 무엇을 했는지
- 무엇을 완성했는지
- 무엇을 배웠는지
- 문제점이나 개선할 부분은 무엇인지
- 내일 무엇을 할 것인지

이를 통해 최종 코드뿐 아니라 프로젝트가 어떤 과정을 거쳐 발전했는지도 함께 남긴다.

> **팁**
> 몇 시간 개발했는지보다 어떤 사용자 흐름을 완성했는지를 중심으로 기록한다.

## 2. Day별 기본 방향

### Day 1 — 밑바탕 구축

목표:

- Next.js 프로젝트 기본 환경을 준비한다
- 폴더와 기본 구조를 정리한다
- 이후 기능을 추가할 수 있는 최소한의 밑바탕을 만든다
- 개발 원칙과 로드맵을 정리한다

완료 기준:

- 프로젝트가 정상적으로 실행된다
- 기본 페이지와 구조를 확인할 수 있다
- 앞으로의 개발 방향이 문서화되어 있다

다음 Day:

- 상품 목록에서 상품 상세로 이어지는 첫 번째 쇼핑 흐름을 만든다

### Day 2 — 상품 목록 → 상품 상세

목표:

- 최소한의 Product 데이터 구조를 정의한다
- 상품 목록 페이지를 만든다
- 상품 카드를 표시한다
- 상품을 선택하면 상세 페이지로 이동하도록 만든다
- 동적 라우팅을 이해한다

예상 흐름:

```text
/products
   ↓
Product Card
   ↓
/products/[id]
   ↓
Product Detail
```

완료 기준:

- 여러 상품이 목록에 표시된다
- 상품을 클릭할 수 있다
- 올바른 상품 상세 페이지로 이동한다
- 상세 페이지에 선택한 상품 정보가 표시된다

다음 Day:

- 상품 상세에서 상품을 장바구니에 추가할 수 있도록 만든다

### Day 3 — 장바구니 추가

목표:

- 상품 상세 페이지에 장바구니 추가 기능을 만든다
- Client Component가 필요한 이유를 이해한다
- 초기 장바구니를 localStorage로 관리한다
- 상품 데이터와 장바구니 데이터의 책임을 분리한다

예상 흐름:

```text
Product Detail
   ↓
Add to Cart
   ↓
localStorage
   ↓
Cart
```

완료 기준:

- 상품을 장바구니에 추가할 수 있다
- 브라우저를 새로고침해도 장바구니 데이터가 유지된다
- 장바구니 페이지에서 추가한 상품을 확인할 수 있다

다음 Day:

- 장바구니 상품의 수량 변경과 삭제를 구현한다

### Day 4 — 장바구니 관리

목표:

- 장바구니 상품 목록을 완성한다
- 수량을 변경할 수 있도록 한다
- 상품을 삭제할 수 있도록 한다
- 총 금액을 계산한다

완료 기준:

- 장바구니 상품을 확인할 수 있다
- 수량을 변경할 수 있다
- 상품을 삭제할 수 있다
- 총 금액이 올바르게 갱신된다

다음 Day:

- v0.1 전체를 점검하고 리팩터링과 문서 정리를 진행한다

### Day 5 — v0.1 완성과 정리

목표:

- 상품 목록 → 상품 상세 → 장바구니 전체 흐름을 확인한다
- 중복 코드와 어색한 책임 분리를 점검한다
- 필요한 범위에서만 리팩터링한다
- requirements, ERD, architecture, decisions, roadmap 문서를 업데이트한다
- Git 기록을 정리하고 필요하면 v0.1.0 태그를 만든다

완료 기준:

```text
상품 목록
   ↓
상품 상세
   ↓
장바구니 추가
   ↓
수량 변경 / 삭제
```

전체 흐름이 처음부터 끝까지 정상적으로 동작한다.

> **팁**
> Day 2~5는 고정된 일정이 아니다. 해당 작업이 끝나지 않았다면 다음 날 이어서 진행하고, 미완성 상태에서 억지로 다음 기능으로 넘어가지 않는다.

## 3. 매일 개발 기록 템플릿

```markdown
# Day XX — 제목

## 오늘의 목표

- 

## 오늘 한 일

- 

## 완료한 것

- 

## 배운 것

- 

## 문제점 / 개선할 점

- 

## 결정 사항

- 

## Git

- Branch:
- Commit:
- Tag:

## 내일 할 일

- 

## 내일의 완료 기준

- 
```

---

# 기록 운영 원칙

언어 순서는 항상 다음과 같이 유지한다.

```text
日本語
↓
English
↓
한국어
```

세 언어는 가능한 한 동일한 의미와 비슷한 정보량을 유지한다.

매일 작업이 끝나면 해당 Day의 실제 결과를 기록하고, 마지막에 다음 Day의 목표와 완료 기준을 작성한다.

```text
오늘 계획
↓
실제 구현
↓
완료 여부 확인
↓
배운 점 / 문제 기록
↓
Git 기록
↓
내일 할 일 작성
```

계획과 실제 결과가 달라져도 계획을 억지로 맞추지 않는다. 차이가 발생했다면 그 이유 자체를 개발 기록으로 남긴다.

> **팁**
> 개발 기록은 미래의 계획표이면서 동시에 과거의 작업 일지다. 매일 종료 시점에 다음 작업을 한 단계만 명확하게 정해두면 다음 개발 세션을 바로 시작하기 쉬워진다.
