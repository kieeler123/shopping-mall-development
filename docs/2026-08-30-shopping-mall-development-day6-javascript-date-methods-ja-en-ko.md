# JavaScript Date 문자열 변환 메서드 정리

> 언어 순서: 日本語 → English → 한국어\
> 주제: `toISOString()`, `toLocaleString()`, `toLocaleDateString()`,
> `toLocaleTimeString()`

------------------------------------------------------------------------

# 日本語

## 1. 基本概念

JavaScript の `Date` オブジェクトは日時を扱うオブジェクトである。

``` js
const date = new Date();
```

`Date`
オブジェクトそのものと、日時を文字列として表示した結果は区別して考える。

``` text
new Date()
    ↓
Date オブジェクト
    ↓
各メソッドで文字列に変換
```

主なメソッド：

``` text
toISOString()
toLocaleString()
toLocaleDateString()
toLocaleTimeString()
```

> **ヒント**
>
> これらのメソッドは「別の日時を作る」のではなく、同じ日時を異なる形式の文字列として表現する。

## 2. `toISOString()`

``` js
const date = new Date();
console.log(date.toISOString());
```

例：

``` text
2026-08-30T13:03:25.123Z
```

`toISOString()` は日時を ISO 8601 形式の文字列として返し、UTC
基準で表現する。

``` text
2026-08-30 T 13:03:25.123 Z
──────────   ────────────
   日付           時刻
```

-   `T`: 日付と時刻の区切り
-   `.123`: ミリ秒
-   `Z`: UTC を表す

韓国標準時（KST）は UTC より9時間進んでいるため、例えば：

``` text
UTC       13:03
            ↓ +9時間
KST       22:03
```

これは異なる瞬間ではなく、同じ瞬間を異なるタイムゾーンで表したものである。

ショッピングモールの注文データでは、注文作成時刻の保存に使用できる。

``` ts
createdAt: new Date().toISOString(),
```

> **ヒント**
>
> `toISOString()`
> は人間向けの表示よりも、一定した形式で日時を保存・送信するときに便利。表示のために手動で9時間を加えるのではなく、表示時にローカル時刻へ変換する。

## 3. `toLocaleString()`

``` js
const date = new Date();
console.log(date.toLocaleString());
```

`toLocaleString()`
は実行環境の言語・地域設定に合わせて、**日付と時刻の両方**を読みやすい文字列に変換する。

韓国環境では、例えば次のような表示になることがある。

``` text
2026. 8. 30. 오후 10:03:25
```

ロケールを明示的に指定することもできる。

``` js
date.toLocaleString("ko-KR");
date.toLocaleString("en-US");
date.toLocaleString("ja-JP");
```

> **ヒント**
>
> `Locale`
> は「ユーザーの言語・地域に合った表現」と考えると理解しやすい。注文履歴など、人が読む画面で特に便利。

## 4. `toLocaleDateString()`

``` js
date.toLocaleDateString();
```

これはローカル設定に合わせて **日付だけ** を文字列として表示する。

例：

``` text
2026. 8. 30.
```

比較：

``` text
toLocaleString()
→ 日付 + 時刻

toLocaleDateString()
→ 日付のみ
```

> **ヒント**
>
> メソッド名の `DateString` をそのまま覚えるとよい。「Date
> だけ表示したい」ときに使う。

## 5. `toLocaleTimeString()`

``` js
date.toLocaleTimeString();
```

これは **時刻だけ** をローカル設定に合わせて表示する。

例：

``` text
오후 10:03:25
```

整理すると：

``` text
toLocaleDateString()
→ 日付のみ

toLocaleTimeString()
→ 時刻のみ

toLocaleString()
→ 日付 + 時刻
```

> **ヒント**
>
> `DateString` は日付、`TimeString` は時刻、`LocaleString`
> は日付と時刻の両方、と関連付けると覚えやすい。

## 6. 注文データでの使用パターン

注文時には保存しやすい形式を使う。

``` ts
createdAt: new Date().toISOString()
```

例：

``` text
2026-08-30T13:03:25.123Z
```

注文履歴画面では保存された文字列から `Date` オブジェクトを作り直す。

``` ts
new Date(order.createdAt)
```

そしてユーザー向けに表示する。

``` tsx
{new Date(order.createdAt).toLocaleString("ko-KR")}
```

流れ：

``` text
注文発生
↓
new Date()
↓
toISOString()
↓
文字列として保存
↓
localStorage
↓
order.createdAt を取得
↓
new Date(order.createdAt)
↓
toLocaleString()
↓
人が読みやすい形式で表示
```

> **ヒント**
>
> 「保存形式」と「表示形式」は別の問題として考える。保存には標準的な形式、表示にはユーザーが読みやすい形式を選ぶ。

## 7. 比較表

  メソッド                 主な目的                 時刻   ローカル設定 主な用途
  ------------------------ ------------------ ---------- -------------- ------------
  `toISOString()`          標準形式                 含む            UTC 保存・送信
  `toLocaleString()`       日付＋時刻の表示         含む           反映 画面表示
  `toLocaleDateString()`   日付の表示           含まない           反映 日付表示
  `toLocaleTimeString()`   時刻の表示               含む           反映 時刻表示

> **ヒント**
>
> ショッピングモール Day 6 では、まず `toISOString()`
> で保存し、`toLocaleString()` で注文日時を表示する流れを覚える。

------------------------------------------------------------------------

# English

## 1. Basic Concept

A JavaScript `Date` object represents date and time information.

``` js
const date = new Date();
```

The `Date` object itself should be distinguished from a string
representation of that date.

``` text
new Date()
    ↓
Date object
    ↓
Convert to a string using a Date method
```

Common methods:

``` text
toISOString()
toLocaleString()
toLocaleDateString()
toLocaleTimeString()
```

> **Tip**
>
> These methods do not create different moments in time. They represent
> the same date/time in different string formats.

## 2. `toISOString()`

``` js
const date = new Date();
console.log(date.toISOString());
```

Example:

``` text
2026-08-30T13:03:25.123Z
```

`toISOString()` returns an ISO 8601 date-time string expressed in UTC.

``` text
2026-08-30 T 13:03:25.123 Z
──────────   ────────────
    date          time
```

-   `T`: separates the date and time
-   `.123`: milliseconds
-   `Z`: indicates UTC

Korean Standard Time is UTC+9.

``` text
UTC       13:03
            ↓ +9 hours
KST       22:03
```

These are not different moments; they are two time-zone representations
of the same moment.

For the shopping mall project, it can be used to store the order
creation time.

``` ts
createdAt: new Date().toISOString(),
```

> **Tip**
>
> Think of `toISOString()` as useful for storing or transmitting a
> consistent date-time representation. Do not manually add nine hours to
> stored data just for Korean display; convert it when rendering.

## 3. `toLocaleString()`

``` js
const date = new Date();
console.log(date.toLocaleString());
```

`toLocaleString()` converts the date **and time** into a human-readable
string according to locale settings.

A Korean environment might display something similar to:

``` text
2026. 8. 30. 오후 10:03:25
```

A locale can also be specified explicitly.

``` js
date.toLocaleString("ko-KR");
date.toLocaleString("en-US");
date.toLocaleString("ja-JP");
```

> **Tip**
>
> Think of `Locale` as formatting for the user's language and region.
> This makes locale methods especially useful for user-facing screens
> such as order history.

## 4. `toLocaleDateString()`

``` js
date.toLocaleDateString();
```

This produces a locale-aware string containing **the date only**.

Example:

``` text
2026. 8. 30.
```

Comparison:

``` text
toLocaleString()
→ date + time

toLocaleDateString()
→ date only
```

> **Tip**
>
> The method name is a useful memory aid: `DateString` means you want
> the date portion.

## 5. `toLocaleTimeString()`

``` js
date.toLocaleTimeString();
```

This displays **the time only** using locale-aware formatting.

Example:

``` text
오후 10:03:25
```

Summary:

``` text
toLocaleDateString()
→ date only

toLocaleTimeString()
→ time only

toLocaleString()
→ date + time
```

> **Tip**
>
> Associate `DateString` with date, `TimeString` with time, and
> `LocaleString` with the full localized date-time display.

## 6. Pattern for Order Data

When an order is created, store a consistent representation.

``` ts
createdAt: new Date().toISOString()
```

Example:

``` text
2026-08-30T13:03:25.123Z
```

On the order-history page, convert the stored string back into a `Date`
object.

``` ts
new Date(order.createdAt)
```

Then format it for the user.

``` tsx
{new Date(order.createdAt).toLocaleString("ko-KR")}
```

Flow:

``` text
Order created
↓
new Date()
↓
toISOString()
↓
Store as a string
↓
localStorage
↓
Read order.createdAt
↓
new Date(order.createdAt)
↓
toLocaleString()
↓
Human-readable display
```

> **Tip**
>
> Treat storage format and display format as separate concerns. Store
> dates consistently; format them for people when rendering the UI.

## 7. Comparison

  --------------------------------------------------------------------------------------
  Method                   Main purpose    Includes time     Locale-aware Typical use
  ------------------------ ------------ ---------------- ---------------- --------------
  `toISOString()`          Standard                  Yes              UTC Storage /
                           date-time                                      transmission
                           format                                         

  `toLocaleString()`       Date + time               Yes              Yes UI display
                           display                                        

  `toLocaleDateString()`   Date display               No              Yes Date-only UI

  `toLocaleTimeString()`   Time display              Yes              Yes Time-only UI
  --------------------------------------------------------------------------------------

> **Tip**
>
> For Shopping Mall Day 6, the most important pattern is: save with
> `toISOString()`, then display the order time with `toLocaleString()`.

------------------------------------------------------------------------

# 한국어

## 1. 기본 개념

JavaScript의 `Date` 객체는 날짜와 시간을 다루는 객체다.

``` js
const date = new Date();
```

`Date` 객체 자체와 그 날짜를 문자열로 표현한 결과는 구분해야 한다.

``` text
new Date()
    ↓
Date 객체
    ↓
각 메서드를 사용하여 문자열로 변환
```

대표적인 메서드:

``` text
toISOString()
toLocaleString()
toLocaleDateString()
toLocaleTimeString()
```

> **팁**
>
> 이 메서드들은 서로 다른 시간을 만드는 것이 아니다. 같은 날짜와 시간을
> 서로 다른 문자열 형식으로 표현한다.

## 2. `toISOString()`

``` js
const date = new Date();
console.log(date.toISOString());
```

예:

``` text
2026-08-30T13:03:25.123Z
```

`toISOString()`은 날짜와 시간을 ISO 8601 형식의 문자열로 반환하며 UTC
기준으로 표현한다.

``` text
2026-08-30 T 13:03:25.123 Z
──────────   ────────────
   날짜          시간
```

-   `T`: 날짜와 시간의 구분
-   `.123`: 밀리초
-   `Z`: UTC 기준임을 표시

한국 표준시(KST)는 UTC보다 9시간 빠르다.

``` text
UTC       13:03
            ↓ +9시간
KST       22:03
```

두 값은 서로 다른 순간이 아니라 같은 순간을 서로 다른 시간대 기준으로
표현한 것이다.

쇼핑몰 주문 데이터에서는 주문 생성 시간을 저장하는 데 사용할 수 있다.

``` ts
createdAt: new Date().toISOString(),
```

> **팁**
>
> `toISOString()`은 사람이 보기 좋은 표현보다는 날짜와 시간을 일정한
> 형식으로 저장하거나 전송할 때 유용하다. 한국시간으로 보이게 하려고
> 저장 데이터에 직접 9시간을 더하지 말고, 화면에 표시할 때 변환한다.

## 3. `toLocaleString()`

``` js
const date = new Date();
console.log(date.toLocaleString());
```

`toLocaleString()`은 실행 환경의 언어·지역 설정에 맞춰 **날짜와 시간을
모두** 사람이 읽기 좋은 문자열로 변환한다.

한국 환경에서는 대략 다음과 같이 보일 수 있다.

``` text
2026. 8. 30. 오후 10:03:25
```

locale을 직접 지정할 수도 있다.

``` js
date.toLocaleString("ko-KR");
date.toLocaleString("en-US");
date.toLocaleString("ja-JP");
```

> **팁**
>
> `Locale`은 사용자의 언어와 지역에 맞춘 표현이라고 생각하면 쉽다.
> 주문내역처럼 사람이 직접 읽는 화면에서 특히 유용하다.

## 4. `toLocaleDateString()`

``` js
date.toLocaleDateString();
```

지역 설정에 맞춰 **날짜만** 문자열로 표시한다.

예:

``` text
2026. 8. 30.
```

비교:

``` text
toLocaleString()
→ 날짜 + 시간

toLocaleDateString()
→ 날짜만
```

> **팁**
>
> 메서드 이름의 `DateString`을 그대로 기억하면 된다. 날짜 부분만 필요할
> 때 사용한다.

## 5. `toLocaleTimeString()`

``` js
date.toLocaleTimeString();
```

지역 설정에 맞춰 **시간만** 표시한다.

예:

``` text
오후 10:03:25
```

정리:

``` text
toLocaleDateString()
→ 날짜만

toLocaleTimeString()
→ 시간만

toLocaleString()
→ 날짜 + 시간
```

> **팁**
>
> `DateString = 날짜`, `TimeString = 시간`,
> `LocaleString = 날짜 + 시간`으로 연결해서 기억하면 쉽다.

## 6. 쇼핑몰 주문 데이터에서 사용하는 패턴

주문이 생성될 때는 저장하기 좋은 일정한 형식으로 만든다.

``` ts
createdAt: new Date().toISOString()
```

예:

``` text
2026-08-30T13:03:25.123Z
```

localStorage에서 주문 데이터를 다시 읽으면 `createdAt`은 문자열이다.

``` ts
order.createdAt
```

따라서 다시 `Date` 객체로 만든다.

``` ts
new Date(order.createdAt)
```

그리고 사용자에게 보여줄 때 지역화된 문자열로 변환한다.

``` tsx
{new Date(order.createdAt).toLocaleString("ko-KR")}
```

전체 흐름:

``` text
주문 발생
↓
new Date()
↓
toISOString()
↓
문자열로 저장
↓
localStorage
↓
order.createdAt 읽기
↓
new Date(order.createdAt)
↓
toLocaleString()
↓
사람이 읽기 좋은 주문일시 출력
```

> **팁**
>
> **저장 형식과 표시 형식은 별개의 문제**라고 생각하는 것이 중요하다.
> 저장할 때는 일정한 형식을 사용하고, 화면에 보여줄 때는 사용자에게 읽기
> 좋은 형식으로 바꾼다.

## 7. 비교표

  메서드                   주목적                    시간 포함   지역 설정 반영 대표 용도
  ------------------------ ----------------------- ----------- ---------------- -------------
  `toISOString()`          표준 날짜·시간 문자열             O         UTC 기준 저장 / 전송
  `toLocaleString()`       날짜 + 시간 표시                  O                O 화면 출력
  `toLocaleDateString()`   날짜 표시                         X                O 날짜만 출력
  `toLocaleTimeString()`   시간 표시                         O                O 시간만 출력

> **팁**
>
> 쇼핑몰 Day 6에서는 우선 다음 한 줄을 기억하면 된다.
>
> ``` text
> 저장 → toISOString()
> 표시 → toLocaleString()
> ```

## 8. 최종 정리

``` text
toISOString()
→ 표준화된 UTC 날짜 + 시간
→ 저장 / 전송에 유용

toLocaleString()
→ 지역에 맞는 날짜 + 시간
→ 화면 출력에 유용

toLocaleDateString()
→ 지역에 맞는 날짜만
→ 날짜 출력에 유용

toLocaleTimeString()
→ 지역에 맞는 시간만
→ 시간 출력에 유용
```

쇼핑몰 Day 6에서는 다음 흐름으로 연결된다.

``` text
Order 생성
↓
createdAt: new Date().toISOString()
↓
orders[]에 저장
↓
localStorage 저장
↓
/orders에서 다시 읽기
↓
new Date(order.createdAt)
↓
toLocaleString("ko-KR")
↓
주문일시를 사용자에게 표시
```

> **팁**
>
> 코드를 외우기보다 데이터의 상태 변화를 따라가자.
> `Date 객체 → 저장용 문자열 → localStorage → 문자열 읽기 → Date 객체 복원 → 표시용 문자열`의
> 흐름을 이해하면 날짜 처리의 핵심을 잡을 수 있다.
