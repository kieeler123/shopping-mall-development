# 학습 문서 공통 템플릿 및 요청문

> Day {DAY} — {TOPIC} | Next.js · React · TypeScript

## 1. 파일 구성

```text
Day{DAY}_{TOPIC}/
├── study_plan/
│   ├── Day{DAY}_study_plan-ja.md
│   ├── Day{DAY}_study_plan-en.md
│   └── Day{DAY}_study_plan-ko.md
├── summary/
│   ├── Day{DAY}_summary-ja.md
│   ├── Day{DAY}_summary-en.md
│   └── Day{DAY}_summary-ko.md
├── qa/
│   ├── Day{DAY}_qa-ja.md
│   ├── Day{DAY}_qa-en.md
│   └── Day{DAY}_qa-ko.md
└── coding_test/
    └── Day{DAY}_coding_test_multilingual.html
```

9 Markdown files + 1 HTML file. ZIP packaging optional.

## 2. 학습 계획서 — Markdown Template

```markdown
# Day {DAY} — {TOPIC}
> Core question: {CORE_QUESTION}
> Stack: Next.js · React · TypeScript
> Estimated duration: {MINUTES} minutes

## 1. 학습 목표
- {OBJECTIVE_1}
- {OBJECTIVE_2}
- {OBJECTIVE_3}

## 2. 학습 범위
**Include:** {IN_SCOPE}
**Exclude:** {OUT_OF_SCOPE}

## 3. 학습 일정
| Stage | Minutes | Activity |
|---|---:|---|
| Review | 10 | {REVIEW} |
| Concepts | 20 | {CONCEPTS} |
| Project practice | 30 | {PRACTICE} |
| Assessment | 20 | {TEST} |

## 4. 실제 프로젝트 연결
{REAL_PROJECT_FLOW_AND_CODE}

## 5. 실습 계획
{PRACTICE_TASKS}

## 6. 완료 기준
- [ ] {CHECK_1}
- [ ] {CHECK_2}

**팁:** {ACTIONABLE_TIP}
```

## 3. 총정리 — Markdown Template

~~~markdown
# Day {DAY} — {TOPIC} | Summary
## Core Concepts
{CONCEPTS_WITH_EXPLANATIONS}
## Architecture and Responsibilities
{COMPONENT_HOOK_API_BOUNDARIES}
## Actual Project Examples
```tsx
// {VERIFIED_PROJECT_CODE_OR_LABELED_EXAMPLE}
```
## Common Mistakes
{ERRORS_AND_CORRECTIONS}
## Review Checklist
{CHECKLIST}
**팁:** {PRACTICAL_TIP}
```

## 4. 문제·정답 — Markdown Template

```markdown
# Day {DAY} — {TOPIC} | Q&A
## Question 1
{QUESTION}
<details>
<summary>{SHOW_ANSWER_LABEL}</summary>

{ANSWER_AND_EXPLANATION}

</details>

## Question 2
{QUESTION}
<details>
<summary>{SHOW_ANSWER_LABEL}</summary>

{ANSWER_AND_EXPLANATION}

</details>
```

## 5. 코딩 테스트 — HTML Specification

**총 15문제: 이전 학습 복습 3, 변형 3, 신규 기초 4, 실전 응용 3, 오류 수정 2. 문제별 난이도·배점·요구사항·힌트·코드 작성란·접이식 모범 답안과 해설 포함.**

**HTML은 오프라인 브라우저에서 작동해야 하며 언어 전환, 코드 직접 입력, localStorage 자동 저장, TXT 내보내기, 내 답안과 정답 나란히 비교, 진행률 표시를 지원해 줘. 코드 실행이나 자동 채점 기능이 없다면 있다고 표현하지 마.**

HTML structure:
- Header: Day, topic, language selector (日本語 / English / 한국어)
- Progress: answered count out of 15
- Per problem: category, points, prompt, hint, editable code textarea
- Per problem: `<details><summary>...</summary>...</details>` for model answer and explanation
- Per problem: side-by-side comparison of current answer and model answer
- Footer: export answers, clear answers with confirmation
- Escape user-entered text when rendering; avoid external CDN dependencies
- Use a stable localStorage key per day and question; keep answers when switching languages
- Responsive layout, readable typography, keyboard-accessible controls

## 6. 작성 규칙

- 기존 프로젝트 코드를 우선하고, 확인되지 않은 구현은 가정으로 표시하며, 불필요한 리팩터링은 피해야 해.
- 일본어·영어·한국어로 자연스럽게 번역한 독립적인 Markdown 파일을 각각 만들고, 코딩 테스트는 3개 언어 전환이 가능한 HTML 파일 하나로 통합해 줘.
- 학습 계획서, 총정리, 문제·정답, 코딩 테스트.
- Keep the coding test separate from reading documents; no duplicate HTML files for each language.
- Use GitHub-compatible Markdown and valid `<details>` blocks.
- Check that generated files exist and archive contents are complete.

## 7. 복사해서 사용하는 요청문

```text
다음 기준으로 Day {DAY} — {TOPIC} 학습 자료를 만들어 줘.

학습 일차: {DAY}
학습 주제: {TOPIC}
Core question: {CORE_QUESTION}
실제 프로젝트 코드 또는 설명: {PROJECT_CONTEXT}

1. 일본어·영어·한국어로 자연스럽게 번역한 독립적인 Markdown 파일을 각각 만들고, 코딩 테스트는 3개 언어 전환이 가능한 HTML 파일 하나로 통합해 줘.
2. 학습 계획서, 총정리, 문제·정답, 코딩 테스트.
3. 총 15문제: 이전 학습 복습 3, 변형 3, 신규 기초 4, 실전 응용 3, 오류 수정 2. 문제별 난이도·배점·요구사항·힌트·코드 작성란·접이식 모범 답안과 해설 포함.
4. HTML은 오프라인 브라우저에서 작동해야 하며 언어 전환, 코드 직접 입력, localStorage 자동 저장, TXT 내보내기, 내 답안과 정답 나란히 비교, 진행률 표시를 지원해 줘. 코드 실행이나 자동 채점 기능이 없다면 있다고 표현하지 마.
5. 기존 프로젝트 코드를 우선하고, 확인되지 않은 구현은 가정으로 표시하며, 불필요한 리팩터링은 피해야 해.
6. Use the attached Day 27 archive as a reference for the document organization, but use the latest agreed file structure.
7. Keep solutions collapsed by default. For Markdown Q&A, use HTML details/summary.
8. Provide individual download links and a ZIP archive; do not claim completion without verifying files.
9. Do not start the lesson; create reusable documents only.
```
