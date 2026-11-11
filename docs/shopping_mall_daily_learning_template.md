# Day {{DAY}} --- {{학습 주제}} 학습자료 템플릿

> 학습 흐름:
>
> `{{핵심개념1}} → {{핵심개념2}} → {{핵심개념3}} → {{최종결과}}`

## 템플릿 기본 규칙

-   **이론 정리**와 **복습문제 Q&A**는 별도 MD 파일로 만든다.
-   언어 순서는 **日本語 → English → 한국어**로 통일한다.
-   세 언어의 STEP 번호와 학습 범위는 서로 동일하게 맞춘다.
-   이론의 각 STEP에는 **Tip/팁**을 넣는다.
-   복습문제는 이론의 STEP과 직접 대응시킨다.
-   **각 문제 바로 아래에 `<details>`로 정답 및 해설**을 넣는다.
-   별도의 총정리 섹션은 만들지 않는다.
-   문제 파일 마지막에는 **최종 확인 문제 + 접이식 정답 예시**를 둔다.

------------------------------------------------------------------------

# ① 이론 정리 파일

권장 파일명:

``` text
YYYY-MM-DD-shopping-mall-development-day{{DAY}}-{{topic}}_theory_review.md
```

# 日本語

## STEP 1 --- {{日本語タイトル}}

{{STEP 1 の理論説明}}

``` text
{{必要なら概念の流れ}}
```

``` tsx
{{必要ならコード例}}
```

**Tip**

{{実践的なヒント}}

------------------------------------------------------------------------

## STEP 2 --- {{日本語タイトル}}

{{STEP 2 の理論説明}}

``` tsx
{{必要ならコード例}}
```

**Tip**

{{実践的なヒント}}

------------------------------------------------------------------------

```{=html}
<!-- 必要なSTEP数まで同じ形式で追加 -->
```
## STEP {{N}} --- {{統合・テスト}}

{{完成条件・確認ポイント}}

**Tip**

{{実践的なヒント}}

------------------------------------------------------------------------

# English

## STEP 1 --- {{English Title}}

{{STEP 1 theory explanation}}

``` text
{{Concept flow if useful}}
```

``` tsx
{{Code example if useful}}
```

**Tip**

{{Practical learning tip}}

------------------------------------------------------------------------

## STEP 2 --- {{English Title}}

{{STEP 2 theory explanation}}

**Tip**

{{Practical learning tip}}

------------------------------------------------------------------------

```{=html}
<!-- Repeat through STEP N -->
```
## STEP {{N}} --- {{Integration and Testing}}

{{Completion criteria and checks}}

**Tip**

{{Practical learning tip}}

------------------------------------------------------------------------

# 한국어

## STEP 1 --- {{한국어 제목}}

{{STEP 1 이론 설명}}

``` text
{{필요한 경우 개념 흐름}}
```

``` tsx
{{필요한 경우 코드 예시}}
```

**팁**

{{실전 학습 팁}}

------------------------------------------------------------------------

## STEP 2 --- {{한국어 제목}}

{{STEP 2 이론 설명}}

**팁**

{{실전 학습 팁}}

------------------------------------------------------------------------

```{=html}
<!-- 필요한 STEP 수까지 동일한 형식으로 추가 -->
```
## STEP {{N}} --- {{통합 및 테스트}}

{{완료 조건과 확인할 내용}}

**팁**

{{실전 학습 팁}}

------------------------------------------------------------------------

# ② 복습문제 Q&A 파일

권장 파일명:

``` text
YYYY-MM-DD-shopping-mall-development-day{{DAY}}-{{topic}}_theory_Q&A.md
```

# Day {{DAY}} 復習問題 / Review Questions / Day {{DAY}} 복습문제

## 日本語 --- 復習問題

### STEP 1

**Q1.** {{STEP 1 の理論に対応する問題}}

``` tsx
{{必要な場合のみコード}}
```

```{=html}
<details>
```
```{=html}
<summary>
```
`<strong>`{=html}解答を見る`</strong>`{=html}
```{=html}
</summary>
```
**A1.** {{正解と解説}}

```{=html}
</details>
```
### STEP 2

**Q2.** {{STEP 2 の理論に対応する問題}}

```{=html}
<details>
```
```{=html}
<summary>
```
`<strong>`{=html}解答を見る`</strong>`{=html}
```{=html}
</summary>
```
**A2.** {{正解と解説}}

```{=html}
</details>
```
```{=html}
<!-- 理論のSTEP数に合わせて追加 -->
```

------------------------------------------------------------------------

## English --- Review Questions

### STEP 1

**Q1.** {{Question corresponding to theory STEP 1}}

``` tsx
{{Code only if useful}}
```

```{=html}
<details>
```
```{=html}
<summary>
```
`<strong>`{=html}Show answers`</strong>`{=html}
```{=html}
</summary>
```
**A1.** {{Answer and explanation}}

```{=html}
</details>
```
### STEP 2

**Q2.** {{Question corresponding to theory STEP 2}}

```{=html}
<details>
```
```{=html}
<summary>
```
`<strong>`{=html}Show answers`</strong>`{=html}
```{=html}
</summary>
```
**A2.** {{Answer and explanation}}

```{=html}
</details>
```
```{=html}
<!-- Match all theory STEPs -->
```

------------------------------------------------------------------------

## 한국어 --- 복습문제

### STEP 1

**Q1.** {{STEP 1 이론에 대응하는 문제}}

``` tsx
{{필요한 경우에만 코드}}
```

```{=html}
<details>
```
```{=html}
<summary>
```
`<strong>`{=html}정답 및 해설 보기`</strong>`{=html}
```{=html}
</summary>
```
**A1.** {{정답}}

{{왜 그런지, 코드 흐름과 핵심 개념까지 설명}}

```{=html}
</details>
```
### STEP 2

**Q2.** {{STEP 2 이론에 대응하는 문제}}

```{=html}
<details>
```
```{=html}
<summary>
```
`<strong>`{=html}정답 및 해설 보기`</strong>`{=html}
```{=html}
</summary>
```
**A2.** {{정답 및 해설}}

```{=html}
</details>
```
```{=html}
<!-- 이론 STEP 수와 동일하게 추가 -->
```
## 최종 확인 문제

다음 전체 흐름을 직접 설명해보자.

``` text
{{핵심개념1}}
↓
{{핵심개념2}}
↓
{{핵심개념3}}
↓
{{최종결과}}
```

그리고 오늘의 핵심 코드를 자신의 말로 설명해보자.

``` tsx
{{DAY 핵심 코드}}
```

```{=html}
<details>
```
```{=html}
<summary>
```
`<strong>`{=html}정답 예시 보기`</strong>`{=html}
```{=html}
</summary>
```
{{각 개념을 연결하여 전체 데이터/코드 흐름을 설명한 모범 답안}}

```{=html}
</details>
```

------------------------------------------------------------------------

# ③ 매일 작성할 때 체크리스트

``` text
[ ] 이론 정리와 Q&A를 별도 MD 파일로 만들었는가?
[ ] 日本語 → English → 한국어 순서인가?
[ ] 세 언어의 STEP 번호와 범위가 같은가?
[ ] 각 이론 STEP에 Tip/팁이 있는가?
[ ] 코드가 필요한 곳에만 코드 블록을 사용했는가?
[ ] Q1은 STEP 1, Q2는 STEP 2처럼 이론과 문제가 대응하는가?
[ ] 각 문제 바로 아래에 <details> 정답/해설이 있는가?
[ ] 정답은 결과뿐 아니라 이유까지 설명하는가?
[ ] 별도의 총정리 섹션을 넣지 않았는가?
[ ] 마지막에 최종 확인 문제가 있는가?
```

**팁**

`{{...}}` 부분만 해당 Day의 학습 내용으로 교체하면 된다. STEP 수는 매일
달라도 되지만 **이론 STEP과 문제 STEP의 대응 관계**는 유지한다.
