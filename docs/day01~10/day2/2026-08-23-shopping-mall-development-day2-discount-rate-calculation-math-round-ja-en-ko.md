# Discount Rate Calculation Logic
# 割引率の計算ロジック
# 할인율 계산 로직

---

# 日本語

## 1. 今回使用したコード

商品詳細ページでは、通常価格と販売価格から割引率を計算した。

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
);
```

例えば通常価格が39,900円、販売価格が19,900円の場合、この式から「通常価格に対して何％安くなったか」を求める。

> **Tip**  
> 式全体を暗記するより、「値引き額を求める → 元の価格に対する割合を求める → %へ変換する → 丸める」の順番で理解する。

## 2. なぜ最初に価格を引くのか

まず次の部分を見る。

```ts
product.originalPrice - product.salePrice
```

これは値引きされた金額そのものを求めている。

```text
通常価格: 39,900
販売価格: 19,900

39,900 - 19,900
= 20,000
```

つまり20,000円安くなっている。

> **Tip**  
> この段階ではまだ「何％割引」ではない。分かるのは「何円安くなったか」だけである。

## 3. なぜ`originalPrice`で割るのか

次は値引き額を通常価格で割る。

```ts
(product.originalPrice - product.salePrice)
/
product.originalPrice
```

今回の例では、

```text
20,000 / 39,900
≈ 0.501253...
```

となる。

割引率とは「元の価格のうち、どれだけの割合が値引きされたか」なので、基準となる通常価格を分母にする。

```text
値引き額
────────
通常価格
```

> **Tip**  
> 「何に対する割合か」を考えると分母が分かる。割引率では基準が元の価格なので`originalPrice`で割る。

## 4. なぜ100を掛けるのか

割り算の結果`0.501253...`は割合を小数で表した値である。

人間がよく使うパーセント表記へ変換するため100を掛ける。

```text
0.501253... × 100
= 50.1253...%
```

コードでは次の部分になる。

```ts
((product.originalPrice - product.salePrice) / product.originalPrice) * 100
```

> **Tip**  
> `0.5 = 50%`、`0.2 = 20%`、`0.75 = 75%`という関係を覚えると、`× 100`の意味が直感的になる。

## 5. `Math.round()`とは

計算結果は必ず整数になるとは限らない。

今回なら、

```text
50.1253...%
```

のようになる。

JavaScriptの`Math.round()`は数値を最も近い整数へ丸める。

```ts
Math.round(50.1253)
```

結果:

```text
50
```

したがって画面では、

```text
50% 割引
```

のように表示できる。

> **Tip**  
> `Math.round()`は「小数点を消す関数」ではなく「最も近い整数へ四捨五入する関数」と理解する。

## 6. `Math.round()`の動作

```ts
Math.round(10.2); // 10
Math.round(10.4); // 10
Math.round(10.5); // 11
Math.round(10.8); // 11
```

基本的には小数部分が0.5以上なら上側、0.5未満なら下側の整数へ丸めると理解できる。

割引率を整数で表示したい今回のUIに適している。

> **Tip**  
> 金額計算や業務ルールでは丸め方が指定される場合があるため、常に`Math.round()`を使えばよいわけではない。

## 7. `Math.floor()`、`Math.ceil()`との違い

JavaScriptには他の丸め処理もある。

```ts
Math.round(10.7); // 11
Math.floor(10.7); // 10
Math.ceil(10.1);  // 11
```

役割は次のように異なる。

| 関数 | 意味 | 例 |
|---|---|---|
| `Math.round()` | 最も近い整数へ丸める | `10.7 → 11` |
| `Math.floor()` | 下側の整数へ丸める | `10.7 → 10` |
| `Math.ceil()` | 上側の整数へ丸める | `10.1 → 11` |

今回の割引表示では四捨五入した整数値を表示したいため`Math.round()`を使用した。

> **Tip**  
> 「丸める」という言葉だけで選ばず、商品仕様が四捨五入・切り捨て・切り上げのどれを要求しているか確認する。

## 8. 式を4段階に分解する

現在のコードは1つの式になっている。

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
);
```

学習するときは次のように分解すると理解しやすい。

```ts
const discountAmount =
  product.originalPrice - product.salePrice;

const discountRatio =
  discountAmount / product.originalPrice;

const discountPercentage =
  discountRatio * 100;

const discountRate =
  Math.round(discountPercentage);
```

意味は、

```text
discountAmount
→ 何円安くなったか

discountRatio
→ 元の価格に対してどれくらい安くなったか

discountPercentage
→ それを%へ変換

discountRate
→ 表示しやすい整数へ丸める
```

となる。

> **Tip**  
> 複雑な計算式を理解するときは、1行を意味のある中間変数へ分解してから元の式へ戻る。

## 9. 具体例で最初から計算する

通常価格:

```text
69,000円
```

販売価格:

```text
55,200円
```

まず値引き額:

```text
69,000 - 55,200
= 13,800
```

次に元の価格に対する割合:

```text
13,800 / 69,000
= 0.2
```

パーセントへ変換:

```text
0.2 × 100
= 20
```

最後に:

```ts
Math.round(20)
```

結果:

```text
20% 割引
```

> **Tip**  
> 数式が分からなくなったら、変数名を一度数字へ置き換えて紙や電卓で順番に計算する。

## 10. なぜ割引率をデータへ直接保存しなかったのか

現在の商品には、

```ts
originalPrice
salePrice
```

が存在する。

この2つがあれば割引率を計算できる。

もしさらに、

```ts
discountRate: 50
```

も保存すると、価格を変更したのに割引率を更新し忘れる可能性がある。

```text
originalPrice = 39,900
salePrice = 29,900
discountRate = 50  ← 古い値
```

このような不整合を避けるため、現在の学習プロジェクトでは価格を元データとして割引率を計算している。

> **Tip**  
> 同じ意味を持つデータを複数箇所に保存すると同期が必要になる。計算可能な値は派生データとして扱えるか検討する。

## 11. 注意点: `originalPrice`が0の場合

式には次の割り算がある。

```ts
discountAmount / product.originalPrice
```

そのため`originalPrice`が0という不正な商品データを許す場合は、そのケースを考える必要がある。

今回のMock商品では正常な通常価格を自分で定義しているため、現段階では単純な式を使用している。

実際に管理画面、API、DBから商品を受け取る段階では価格のvalidationも重要になる。

> **Tip**  
> 学習段階では計算原理を理解し、外部入力を受け取る段階で「0や負数を許可するか」というデータ検証を追加する。

## 12. 最終的な読み方

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
);
```

このコードを日本語で読むと、

```text
通常価格から販売価格を引いて値引き額を求める
↓
値引き額を通常価格で割って値引きの割合を求める
↓
100を掛けてパーセントへ変換する
↓
Math.round()で最も近い整数へ丸める
↓
discountRateへ保存する
```

となる。

> **Tip**  
> コードを記号として暗記せず、自然言語で説明できるようになれば、別の割合計算にも応用しやすくなる。

---

# English

## 1. The Code Used in This Project

The product detail page calculates the discount rate from the original price and sale price.

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
);
```

For example, if the original price is 39,900 and the sale price is 19,900, this formula calculates how much cheaper the sale price is relative to the original price.

> **Tip**  
> Instead of memorizing the formula, understand the sequence: calculate the discount amount → calculate its ratio to the original price → convert it to percent → round it.

## 2. Why Subtract the Prices First?

Start with:

```ts
product.originalPrice - product.salePrice
```

This calculates the amount of money discounted.

```text
Original price: 39,900
Sale price:     19,900

39,900 - 19,900
= 20,000
```

The product is therefore 20,000 cheaper.

> **Tip**  
> At this stage, the result is not yet a percentage. It only tells us how much money was discounted.

## 3. Why Divide by `originalPrice`?

Next, divide the discount amount by the original price.

```ts
(product.originalPrice - product.salePrice)
/
product.originalPrice
```

For this example:

```text
20,000 / 39,900
≈ 0.501253...
```

A discount rate asks what fraction of the original price has been removed, so the original price is the reference value and becomes the denominator.

```text
discount amount
───────────────
original price
```

> **Tip**  
> When calculating a percentage, ask “relative to what?” The answer identifies the denominator. A discount is relative to the original price.

## 4. Why Multiply by 100?

The result `0.501253...` is a ratio written as a decimal.

To express that ratio as a percentage, multiply it by 100.

```text
0.501253... × 100
= 50.1253...%
```

This corresponds to:

```ts
((product.originalPrice - product.salePrice) / product.originalPrice) * 100
```

> **Tip**  
> Remember the relationship `0.5 = 50%`, `0.2 = 20%`, and `0.75 = 75%`. It makes the purpose of multiplying by 100 intuitive.

## 5. What Is `Math.round()`?

The calculated percentage is not always an integer.

For example:

```text
50.1253...%
```

JavaScript's `Math.round()` rounds a number to the nearest integer.

```ts
Math.round(50.1253)
```

Result:

```text
50
```

The UI can therefore display:

```text
50% off
```

> **Tip**  
> Do not think of `Math.round()` as merely removing decimals. It rounds the value to the nearest integer.

## 6. How `Math.round()` Behaves

```ts
Math.round(10.2); // 10
Math.round(10.4); // 10
Math.round(10.5); // 11
Math.round(10.8); // 11
```

For ordinary positive values, a decimal part of 0.5 or greater rounds upward, while a smaller decimal part rounds downward.

That is suitable when this UI wants an integer discount percentage.

> **Tip**  
> Real business rules may explicitly define rounding behavior, so `Math.round()` is not automatically correct for every price-related calculation.

## 7. Difference from `Math.floor()` and `Math.ceil()`

JavaScript provides other rounding functions.

```ts
Math.round(10.7); // 11
Math.floor(10.7); // 10
Math.ceil(10.1);  // 11
```

| Function | Meaning | Example |
|---|---|---|
| `Math.round()` | Round to the nearest integer | `10.7 → 11` |
| `Math.floor()` | Round downward | `10.7 → 10` |
| `Math.ceil()` | Round upward | `10.1 → 11` |

The current discount UI uses `Math.round()` because it displays the percentage rounded to the nearest integer.

> **Tip**  
> Choose a rounding function according to the product requirement: nearest rounding, downward rounding, or upward rounding.

## 8. Breaking the Formula into Four Steps

The current implementation puts everything into one expression.

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
);
```

For learning, it can be expanded:

```ts
const discountAmount =
  product.originalPrice - product.salePrice;

const discountRatio =
  discountAmount / product.originalPrice;

const discountPercentage =
  discountRatio * 100;

const discountRate =
  Math.round(discountPercentage);
```

Each variable has a clear meaning.

```text
discountAmount
→ How much money was discounted

discountRatio
→ How large the discount is relative to the original price

discountPercentage
→ Convert the ratio into percent

discountRate
→ Round it for display
```

> **Tip**  
> When a calculation looks complicated, split the expression into meaningful intermediate variables before trying to understand the compact version.

## 9. A Complete Numerical Example

Original price:

```text
69,000
```

Sale price:

```text
55,200
```

Discount amount:

```text
69,000 - 55,200
= 13,800
```

Ratio relative to the original price:

```text
13,800 / 69,000
= 0.2
```

Convert to percent:

```text
0.2 × 100
= 20
```

Finally:

```ts
Math.round(20)
```

Result:

```text
20% off
```

> **Tip**  
> If a formula becomes confusing, replace variable names with actual numbers and calculate each step manually.

## 10. Why Not Store the Discount Rate Directly?

The current product already stores:

```ts
originalPrice
salePrice
```

Those values are sufficient to calculate the discount rate.

If the application also stores:

```ts
discountRate: 50
```

the values can become inconsistent if a price changes without updating the discount rate.

```text
originalPrice = 39,900
salePrice = 29,900
discountRate = 50  ← stale value
```

For the current project, prices are treated as source data and the discount rate is derived from them.

> **Tip**  
> Duplicated information requires synchronization. Before storing a calculated value, consider whether it can remain derived data.

## 11. Edge Case: `originalPrice` Is Zero

The formula contains division by:

```ts
product.originalPrice
```

If invalid product data allows an original price of zero, that case needs special handling.

The current mock data is manually controlled and uses valid positive original prices, so the simple formula is sufficient for this stage.

When products later come from an admin form, API, or database, price validation becomes important.

> **Tip**  
> First understand the calculation. When external input is introduced, add validation rules for zero, negative, and otherwise invalid prices.

## 12. Reading the Final Formula in Plain Language

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
);
```

In plain language:

```text
Subtract the sale price from the original price
↓
Get the amount discounted
↓
Divide by the original price
↓
Get the discount ratio
↓
Multiply by 100
↓
Convert it to a percentage
↓
Use Math.round()
↓
Round to the nearest integer
↓
Store it in discountRate
```

> **Tip**  
> Once you can explain a formula in ordinary language instead of memorizing symbols, it becomes much easier to apply the same reasoning to other percentage calculations.

---

# 한국어

## 1. 이번 프로젝트에서 사용한 코드

상품 상세 페이지에서는 정상가와 판매가를 이용해 할인율을 계산했다.

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
);
```

예를 들어 정상가가 39,900원이고 판매가가 19,900원이라면 이 계산식은 **정상가에 비해 판매가가 몇 % 저렴해졌는지** 계산한다.

> **팁**  
> 계산식 전체를 통째로 외우기보다 `할인된 금액 계산 → 정상가에 대한 비율 계산 → % 변환 → 반올림` 순서로 이해한다.

## 2. 왜 먼저 가격끼리 빼는가?

먼저 다음 부분을 본다.

```ts
product.originalPrice - product.salePrice
```

이 계산은 실제로 얼마가 할인됐는지를 구한다.

```text
정상가: 39,900원
판매가: 19,900원

39,900 - 19,900
= 20,000
```

즉 20,000원이 할인된 상품이다.

> **팁**  
> 이 단계에서는 아직 `몇 % 할인`인지는 모른다. 단지 `몇 원 할인됐는지`만 계산한 상태다.

## 3. 왜 `originalPrice`로 나누는가?

다음으로 할인된 금액을 정상가로 나눈다.

```ts
(product.originalPrice - product.salePrice)
/
product.originalPrice
```

예제에서는:

```text
20,000 / 39,900
≈ 0.501253...
```

가 된다.

할인율은 **원래 가격을 기준으로 얼마만큼 가격이 줄었는가**를 나타내는 비율이므로 기준이 되는 정상가가 분모에 들어간다.

```text
할인된 금액
──────────
정상가
```

> **팁**  
> 비율 계산에서 무엇으로 나눠야 할지 헷갈리면 `무엇을 기준으로 한 비율인가?`를 생각한다. 할인율의 기준은 원래 가격이다.

## 4. 왜 100을 곱하는가?

나눗셈으로 나온:

```text
0.501253...
```

은 비율을 소수로 나타낸 것이다.

우리가 익숙한 `%` 형태로 바꾸려면 100을 곱한다.

```text
0.501253... × 100
= 50.1253...%
```

그래서 코드에서는:

```ts
((product.originalPrice - product.salePrice) / product.originalPrice) * 100
```

가 된다.

> **팁**  
> `0.5 = 50%`, `0.2 = 20%`, `0.75 = 75%`라는 관계를 기억하면 `× 100`이 왜 필요한지 쉽게 이해할 수 있다.

## 5. `Math.round()`란?

할인율을 계산했다고 해서 항상 정수가 나오는 것은 아니다.

이번 예제처럼:

```text
50.1253...%
```

가 나올 수도 있다.

JavaScript의 `Math.round()`는 숫자를 **가장 가까운 정수로 반올림**한다.

```ts
Math.round(50.1253)
```

결과:

```text
50
```

따라서 화면에서는:

```text
50% 할인
```

처럼 깔끔하게 표시할 수 있다.

> **팁**  
> `Math.round()`를 단순히 `소수점을 없앤다`라고 기억하면 안 된다. 정확히는 `가장 가까운 정수로 반올림한다`이다.

## 6. `Math.round()`의 동작

```ts
Math.round(10.2); // 10
Math.round(10.4); // 10
Math.round(10.5); // 11
Math.round(10.8); // 11
```

일반적인 양수에서는 소수 부분이 0.5 이상이면 위쪽 정수로, 0.5보다 작으면 아래쪽 정수로 반올림한다고 이해하면 된다.

현재 쇼핑몰에서는 할인율을 정수로 보여주기 위해 사용했다.

> **팁**  
> 실제 서비스에서는 반올림 규칙이 업무 정책으로 정해질 수 있으므로 가격 관련 계산이라고 해서 무조건 `Math.round()`를 사용하는 것은 아니다.

## 7. `Math.floor()`, `Math.ceil()`과의 차이

JavaScript에는 다른 숫자 처리 함수도 있다.

```ts
Math.round(10.7); // 11
Math.floor(10.7); // 10
Math.ceil(10.1);  // 11
```

| 함수 | 의미 | 예 |
|---|---|---|
| `Math.round()` | 가장 가까운 정수로 반올림 | `10.7 → 11` |
| `Math.floor()` | 아래쪽 정수로 내림 | `10.7 → 10` |
| `Math.ceil()` | 위쪽 정수로 올림 | `10.1 → 11` |

이번 할인율 UI에서는 가장 가까운 정수로 표시하려고 `Math.round()`를 선택했다.

> **팁**  
> `숫자를 정수로 만든다`만 보고 함수를 고르지 말고 서비스 요구사항이 반올림, 내림, 올림 중 무엇인지 확인한다.

## 8. 계산식을 4단계로 분해하기

현재 코드는 한 번에 작성되어 있다.

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
);
```

학습할 때는 다음처럼 나누면 훨씬 이해하기 쉽다.

```ts
const discountAmount =
  product.originalPrice - product.salePrice;

const discountRatio =
  discountAmount / product.originalPrice;

const discountPercentage =
  discountRatio * 100;

const discountRate =
  Math.round(discountPercentage);
```

각 변수의 의미는:

```text
discountAmount
→ 몇 원 할인됐는가

discountRatio
→ 정상가에 비해 얼마나 할인됐는가

discountPercentage
→ 비율을 %로 변환

discountRate
→ 화면에 보여주기 좋게 정수로 반올림
```

이다.

> **팁**  
> 복잡한 한 줄 계산식을 만났을 때 바로 외우려고 하지 말고 의미가 있는 중간 변수로 나눈 뒤 다시 한 줄 식으로 합쳐본다.

## 9. 실제 숫자로 처음부터 계산해보기

정상가가:

```text
69,000원
```

이고 판매가가:

```text
55,200원
```

이라고 해보자.

먼저 할인된 금액:

```text
69,000 - 55,200
= 13,800
```

정상가에 대한 할인 비율:

```text
13,800 / 69,000
= 0.2
```

퍼센트로 변환:

```text
0.2 × 100
= 20
```

마지막으로:

```ts
Math.round(20)
```

결과는:

```text
20% 할인
```

이다.

> **팁**  
> 계산식이 갑자기 어려워 보이면 변수명을 실제 숫자로 바꿔서 한 단계씩 직접 계산해본다. 코드의 괄호 구조도 훨씬 쉽게 보인다.

## 10. 왜 할인율을 데이터에 직접 저장하지 않았는가?

현재 `Product`에는 이미:

```ts
originalPrice
salePrice
```

가 있다.

이 두 값만 있으면 할인율을 계산할 수 있다.

그런데 추가로:

```ts
discountRate: 50
```

까지 저장하면 가격만 수정하고 할인율을 수정하지 않았을 때 데이터가 서로 맞지 않을 수 있다.

```text
originalPrice = 39,900
salePrice = 29,900
discountRate = 50  ← 예전 값이 남음
```

그래서 현재 프로젝트에서는 가격을 원본 데이터로 두고 할인율은 필요할 때 계산하는 **파생 값**으로 사용했다.

> **팁**  
> 같은 의미를 나타내는 정보를 여러 곳에 저장하면 동기화 문제가 생길 수 있다. 기존 데이터로 계산 가능한 값이라면 파생 데이터로 둘 수 있는지 먼저 검토한다.

## 11. 주의할 점: `originalPrice`가 0이라면?

현재 계산식에는:

```ts
discountAmount / product.originalPrice
```

라는 나눗셈이 있다.

따라서 정상가가 0인 잘못된 상품 데이터까지 허용한다면 별도의 방어 처리가 필요하다.

현재 단계에서는 우리가 직접 정상적인 Mock 상품 가격을 작성하고 있으므로 기본 계산식으로 충분하다.

나중에 관리자 페이지, API, DB 등 외부 입력으로 상품을 등록하게 되면 가격 validation도 중요해진다.

> **팁**  
> 지금은 계산 원리를 정확히 이해하고, 외부에서 데이터를 입력받기 시작할 때 `0원`, 음수 가격 등 비정상 값을 허용할 것인지 validation 규칙을 추가한다.

## 12. 최종 계산식을 말로 읽어보기

```ts
const discountRate = Math.round(
  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
);
```

이 코드를 한국어로 풀어서 읽으면:

```text
정상가에서 판매가를 뺀다
↓
얼마가 할인됐는지 구한다
↓
할인된 금액을 정상가로 나눈다
↓
정상가에 대한 할인 비율을 구한다
↓
100을 곱한다
↓
퍼센트로 바꾼다
↓
Math.round()를 사용한다
↓
가장 가까운 정수로 반올림한다
↓
discountRate에 저장한다
```

가 된다.

> **팁**  
> 계산 코드를 기호로 외우는 것보다 자연어로 설명할 수 있을 정도로 이해해두면 나중에 할인율뿐 아니라 증가율, 달성률, 진행률 같은 다른 비율 계산에도 그대로 응용할 수 있다.
