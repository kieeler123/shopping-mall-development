# Reusable Study Document Templates and Request Prompt

> Day {DAY} — {TOPIC} | Next.js · React · TypeScript

## 1. File Structure

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

## 2. Study Plan — Markdown Template

```markdown
# Day {DAY} — {TOPIC}
> Core question: {CORE_QUESTION}
> Stack: Next.js · React · TypeScript
> Estimated duration: {MINUTES} minutes

## 1. Learning Objectives
- {OBJECTIVE_1}
- {OBJECTIVE_2}
- {OBJECTIVE_3}

## 2. Scope
**Include:** {IN_SCOPE}
**Exclude:** {OUT_OF_SCOPE}

## 3. Schedule
| Stage | Minutes | Activity |
|---|---:|---|
| Review | 10 | {REVIEW} |
| Concepts | 20 | {CONCEPTS} |
| Project practice | 30 | {PRACTICE} |
| Assessment | 20 | {TEST} |

## 4. Connection to the Existing Project
{REAL_PROJECT_FLOW_AND_CODE}

## 5. Exercises
{PRACTICE_TASKS}

## 6. Completion Criteria
- [ ] {CHECK_1}
- [ ] {CHECK_2}

**Tip:** {ACTIONABLE_TIP}
```

## 3. Study Summary — Markdown Template

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
**Tip:** {PRACTICAL_TIP}
```

## 4. Questions and Answers — Markdown Template

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

## 5. Coding Test — HTML Specification

**15 problems: 3 reviews, 3 variations, 4 new basics, 3 practical applications, and 2 debugging tasks. Each needs difficulty, points, requirements, hints, a code editor, and a collapsible model answer with explanation.**

**The HTML must work offline and provide language switching, editable answers, localStorage autosave, TXT export, side-by-side answer comparison, and progress tracking. Do not imply that code execution or automated grading exists unless implemented.**

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

## 6. Creation Rules

- Respect existing project code, mark assumptions when implementation is unavailable, and avoid unnecessary refactoring.
- Produce independently readable Markdown documents in natural Japanese, English, and Korean. Create one browser-based HTML coding test with a three-language switcher.
- Study Plan, Summary, Q&A, and Coding Test.
- Keep the coding test separate from reading documents; no duplicate HTML files for each language.
- Use GitHub-compatible Markdown and valid `<details>` blocks.
- Check that generated files exist and archive contents are complete.

## 7. Reusable Copy-and-Paste Request

```text
Create study materials for Day {DAY}, “{TOPIC}”, using the requirements below.

Day: {DAY}
Topic: {TOPIC}
Core question: {CORE_QUESTION}
Actual Project Code or Description: {PROJECT_CONTEXT}

1. Produce independently readable Markdown documents in natural Japanese, English, and Korean. Create one browser-based HTML coding test with a three-language switcher.
2. Study Plan, Summary, Q&A, and Coding Test.
3. 15 problems: 3 reviews, 3 variations, 4 new basics, 3 practical applications, and 2 debugging tasks. Each needs difficulty, points, requirements, hints, a code editor, and a collapsible model answer with explanation.
4. The HTML must work offline and provide language switching, editable answers, localStorage autosave, TXT export, side-by-side answer comparison, and progress tracking. Do not imply that code execution or automated grading exists unless implemented.
5. Respect existing project code, mark assumptions when implementation is unavailable, and avoid unnecessary refactoring.
6. Use the attached Day 27 archive as a reference for the document organization, but use the latest agreed file structure.
7. Keep solutions collapsed by default. For Markdown Q&A, use HTML details/summary.
8. Provide individual download links and a ZIP archive; do not claim completion without verifying files.
9. Do not start the lesson; create reusable documents only.
```
