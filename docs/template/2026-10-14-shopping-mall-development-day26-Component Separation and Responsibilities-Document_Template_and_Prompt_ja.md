# 学習ドキュメント共通テンプレートと依頼文

> Day {DAY} — {TOPIC} | Next.js · React · TypeScript

## 1. ファイル構成

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

## 2. 学習計画 — Markdown Template

```markdown
# Day {DAY} — {TOPIC}
> Core question: {CORE_QUESTION}
> Stack: Next.js · React · TypeScript
> Estimated duration: {MINUTES} minutes

## 1. 目標
- {OBJECTIVE_1}
- {OBJECTIVE_2}
- {OBJECTIVE_3}

## 2. 学習範囲
**Include:** {IN_SCOPE}
**Exclude:** {OUT_OF_SCOPE}

## 3. 時間配分
| Stage | Minutes | Activity |
|---|---:|---|
| Review | 10 | {REVIEW} |
| Concepts | 20 | {CONCEPTS} |
| Project practice | 30 | {PRACTICE} |
| Assessment | 20 | {TEST} |

## 4. 既存プロジェクトとの関連
{REAL_PROJECT_FLOW_AND_CODE}

## 5. 実習
{PRACTICE_TASKS}

## 6. 完了基準
- [ ] {CHECK_1}
- [ ] {CHECK_2}

**ヒント:** {ACTIONABLE_TIP}
```

## 3. 総まとめ — Markdown Template

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
**ヒント:** {PRACTICAL_TIP}
```

## 4. 問題と解答 — Markdown Template

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

## 5. コーディングテスト — HTML Specification

**復習3問、変形3問、新規基礎4問、実践3問、デバッグ2問（計15問）。各問に難易度、配点、要件、ヒント、コード入力欄、折りたたみ式模範解答と解説を付ける。**

**HTML はブラウザーでオフライン利用可能にし、言語切替、回答入力、localStorage 自動保存、TXT 書き出し、回答と模範解答の左右比較、進捗表示を実装する。コード実行や自動採点は実装したと誤認させない。**

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

## 6. 作成ルール

- 既存コードを優先し、実装を確認していない箇所は推測で断定しない。不要なリファクタリングを避ける。
- 日本語・英語・韓国語を自然に翻訳し、それぞれ独立した Markdown ファイルを作成してください。コーディングテストだけは3言語切り替え式の HTML ファイル1つにしてください。
- 学習計画・総まとめ・Q&A・コーディングテスト.
- Keep the coding test separate from reading documents; no duplicate HTML files for each language.
- Use GitHub-compatible Markdown and valid `<details>` blocks.
- Check that generated files exist and archive contents are complete.

## 7. コピーして使う依頼文

```text
以下の条件で Day {DAY}「{TOPIC}」の学習資料を作成してください。

日数: {DAY}
テーマ: {TOPIC}
Core question: {CORE_QUESTION}
実際のプロジェクトコードまたは説明: {PROJECT_CONTEXT}

1. 日本語・英語・韓国語を自然に翻訳し、それぞれ独立した Markdown ファイルを作成してください。コーディングテストだけは3言語切り替え式の HTML ファイル1つにしてください。
2. 学習計画・総まとめ・Q&A・コーディングテスト.
3. 復習3問、変形3問、新規基礎4問、実践3問、デバッグ2問（計15問）。各問に難易度、配点、要件、ヒント、コード入力欄、折りたたみ式模範解答と解説を付ける。
4. HTML はブラウザーでオフライン利用可能にし、言語切替、回答入力、localStorage 自動保存、TXT 書き出し、回答と模範解答の左右比較、進捗表示を実装する。コード実行や自動採点は実装したと誤認させない。
5. 既存コードを優先し、実装を確認していない箇所は推測で断定しない。不要なリファクタリングを避ける。
6. Use the attached Day 27 archive as a reference for the document organization, but use the latest agreed file structure.
7. Keep solutions collapsed by default. For Markdown Q&A, use HTML details/summary.
8. Provide individual download links and a ZIP archive; do not claim completion without verifying files.
9. Do not start the lesson; create reusable documents only.
```
