# TypeScript `import type` — Why Explicit Type Imports Matter
# TypeScript `import type` — なぜ型専用Importを明示するのか
# TypeScript `import type` — 왜 타입 전용 Import를 명시하는가

---

# 日本語

## 1. 今回の経験

ショッピングモールプロジェクトで`Product`は実行時に使う値ではなく、TypeScriptの型としてだけ使用する。

```ts
import type { Product } from "@/types/product";

export const products: Product[] = [];
```

小さな学習プロジェクトでは、次のような通常の`import`でも問題なく動く場合がある。

```ts
import { Product } from "@/types/product";
```

しかし、プロジェクトの設定、TypeScriptのコンパイル方式、使用するビルドツールやLintルールが厳しくなると、「値のImport」と「型のImport」を区別する必要が出てくる。

> **Tip**
> 「小さいプロジェクトだから動いた」ことと「どのプロジェクトでも正しい」は同じではない。設定が厳しくなるほど意図を明示したコードが重要になる。

## 2. 通常の`import`と`import type`

通常の`import`は基本的に実行時に利用する値を読み込むための構文である。

```ts
import { products } from "@/data/products";

console.log(products);
```

`products`はJavaScriptが実行されるときにも必要な実際の値である。

一方、`Product`は型チェックのためだけに必要である。

```ts
import type { Product } from "@/types/product";

const product: Product = {
  id: 1,
  name: "T-Shirt",
};
```

TypeScriptの型情報は通常、最終的なJavaScriptでは消える。

> **Tip**
> 「ブラウザやNode.jsが実行するときにも必要か？」と考える。必要なら通常の`import`、型チェックだけなら`import type`を検討する。

## 3. なぜ小さなプロジェクトでは通常の`import`でも動くことがあるのか

TypeScriptやビルドツールは、型としてしか使われていないImportを解析し、最終的なJavaScriptから除去できる場合がある。

そのため、

```ts
import { Product } from "@/types/product";
```

と書いても、環境によっては問題が表面化しない。

これは「通常の`import`を型に使えば常に安全」という意味ではない。設定によって扱いが変わる可能性がある。

> **Tip**
> エラーが出てから直すより、型だと分かっているImportは最初から`import type`で意図を明確にする。

## 4. 大きなプロジェクトで問題が見えやすくなる理由

プロジェクトが大きくなること自体が直接エラーを発生させるわけではない。

実際には、規模が大きくなるにつれて次のような条件が増えることが原因になりやすい。

```text
より厳しいTypeScript設定
Lintルール
ES Module設定
ビルドツールの違い
型と実行時コードの分離
Server / Client境界
複数パッケージ構成
```

例えば`verbatimModuleSyntax`のようにImportの書き方をより明確に扱う設定では、型専用Importを`import type`として書く必要が生じる場合がある。

> **Tip**
> 「大規模だからエラーになる」と暗記せず、「大規模になるほど厳しい設定や複雑な境界が増え、曖昧なImportが問題として現れやすい」と理解する。

## 5. 今回のショッピングモールでの使い分け

型だけを読み込む場合:

```ts
import type { Product } from "@/types/product";
```

実際のデータを読み込む場合:

```ts
import { products } from "@/data/products";
```

両方を並べると役割が分かりやすい。

```text
Product
→ 型
→ TypeScriptの型チェック用
→ import type

products
→ 実際の配列データ
→ 実行時にも必要
→ import
```

> **Tip**
> 名前が似ていても「型」と「値」は別物として考える。`Product`と`products`を区別できるとImportの判断もしやすい。

## 6. 実務での基本ルール

このプロジェクトでは次のルールを採用する。

```text
型としてだけ使う
→ import type

実行時の値として使う
→ import
```

例:

```ts
import type { Product } from "@/types/product";
import { products } from "@/data/products";
```

型と値を同じモジュールからImportする必要がある場合は、プロジェクトのTypeScript設定やコード規約に合わせて書き方を選択する。

> **Tip**
> 実務では「動くか」だけでなく「このImportが何のために存在するかが読んですぐ分かるか」も重要である。

## 7. 覚え方

```text
import
→ Runtime Value
→ 実行時にも必要

import type
→ Type Information
→ 型チェックのために必要
→ JavaScript実行時には不要
```

今回の経験は次のように整理できる。

```text
小さなプロジェクト
→ 通常のimportでも問題が見えない場合がある

プロジェクトが複雑になる
→ 設定・Lint・Module境界などが厳しくなる
→ 型Importの曖昧さが問題になりやすい

習慣
→ 型専用なら最初からimport type
```

> **Tip**
> `import type`は単なるエラー回避策ではない。「これは型だけに依存している」という設計上の意図をコードに残す手段として使う。

---

# English

## 1. What We Experienced

In the shopping mall project, `Product` is not a runtime value. It is used only as a TypeScript type.

```ts
import type { Product } from "@/types/product";

export const products: Product[] = [];
```

In a small learning project, a regular `import` may also appear to work without problems.

```ts
import { Product } from "@/types/product";
```

However, as project configuration, TypeScript compilation, build tooling, or lint rules become stricter, the distinction between importing a runtime value and importing a type can become important.

> **Tip**
> “It worked in a small project” does not mean “it is correct in every project.” Explicit intent becomes more valuable as project rules become stricter.

## 2. Regular `import` vs `import type`

A regular `import` is fundamentally used to bring in values that may be needed at runtime.

```ts
import { products } from "@/data/products";

console.log(products);
```

`products` is real data that JavaScript needs while the application is running.

`Product`, on the other hand, may exist only for type checking.

```ts
import type { Product } from "@/types/product";

const product: Product = {
  id: 1,
  name: "T-Shirt",
};
```

TypeScript type information normally disappears from the final JavaScript.

> **Tip**
> Ask, “Will the browser or Node.js need this while the code is running?” If yes, use a regular `import`. If it is needed only for type checking, consider `import type`.

## 3. Why a Regular `import` Can Work in Small Projects

TypeScript and build tools can sometimes detect imports that are used only as types and remove them from the generated JavaScript.

Therefore,

```ts
import { Product } from "@/types/product";
```

may work without visible problems in some environments.

That does not mean using a regular `import` for a type is universally safe. The behavior and requirements can depend on configuration.

> **Tip**
> Instead of waiting for an error, use `import type` from the beginning when you already know the dependency is type-only.

## 4. Why Problems Become More Visible in Larger Projects

Project size itself does not directly cause the error.

The real issue is that larger projects are more likely to introduce conditions such as:

```text
Stricter TypeScript configuration
Lint rules
ES Module configuration
Different build tools
Separation of types and runtime code
Server / Client boundaries
Multiple packages
```

With settings such as `verbatimModuleSyntax`, imports may need to express more explicitly whether they are type-only.

> **Tip**
> Do not memorize “large project = error.” Understand it as “larger projects tend to introduce stricter configuration and more complex boundaries, which expose ambiguous imports.”

## 5. How We Use It in the Shopping Mall

When importing only a type:

```ts
import type { Product } from "@/types/product";
```

When importing actual data:

```ts
import { products } from "@/data/products";
```

Their responsibilities are different.

```text
Product
→ Type
→ Used for TypeScript checking
→ import type

products
→ Actual array data
→ Needed at runtime
→ import
```

> **Tip**
> Even when names look similar, think of types and values as different categories. Distinguishing `Product` from `products` makes import decisions easier.

## 6. Practical Rule for This Project

We will use this rule:

```text
Used only as a type
→ import type

Used as a runtime value
→ import
```

Example:

```ts
import type { Product } from "@/types/product";
import { products } from "@/data/products";
```

If a module provides both types and runtime values, choose the exact syntax according to the project's TypeScript configuration and coding conventions.

> **Tip**
> In production code, the question is not only whether the code runs. It also matters whether another developer can immediately understand why an import exists.

## 7. A Simple Way to Remember

```text
import
→ Runtime Value
→ Needed while the program runs

import type
→ Type Information
→ Needed for type checking
→ Not needed by the final JavaScript runtime
```

Our experience can be summarized as:

```text
Small project
→ A regular import may appear to work for a type

Project becomes more complex
→ Configuration, linting, and module boundaries become stricter
→ Ambiguous type imports are more likely to become a problem

Habit
→ If it is type-only, use import type from the beginning
```

> **Tip**
> Treat `import type` as more than an error workaround. It documents the architectural intent that a module depends only on another module's type information.

---

# 한국어

## 1. 이번에 경험한 내용

쇼핑몰 프로젝트에서 `Product`는 실행할 때 사용하는 실제 값이 아니라 TypeScript의 타입으로만 사용한다.

```ts
import type { Product } from "@/types/product";

export const products: Product[] = [];
```

작은 학습 프로젝트에서는 다음처럼 일반 `import`를 사용해도 별문제 없이 동작하는 경우가 있다.

```ts
import { Product } from "@/types/product";
```

하지만 프로젝트 설정, TypeScript 컴파일 방식, 빌드 도구, Lint 규칙 등이 엄격해지면 실행 값의 Import와 타입 Import를 구분해야 하는 상황이 생길 수 있다.

> **팁**
> 작은 프로젝트에서 동작했다는 것과 모든 프로젝트에서 올바른 방식이라는 것은 다르다. 프로젝트 규칙이 엄격해질수록 코드의 의도를 명확하게 표현하는 것이 중요해진다.

## 2. 일반 `import`와 `import type`

일반 `import`는 기본적으로 실행 시점에도 필요한 실제 값을 가져올 때 사용한다.

```ts
import { products } from "@/data/products";

console.log(products);
```

`products`는 JavaScript가 실행될 때 실제로 필요한 배열 데이터다.

반면 `Product`는 타입 검사를 위해서만 필요할 수 있다.

```ts
import type { Product } from "@/types/product";

const product: Product = {
  id: 1,
  name: "T-Shirt",
};
```

TypeScript의 타입 정보는 일반적으로 최종 JavaScript에서는 사라진다.

> **팁**
> 브라우저나 Node.js가 코드를 실행할 때도 이것이 필요한지를 생각한다. 필요하면 일반 `import`, 타입 검사에만 필요하면 `import type`을 고려한다.

## 3. 작은 프로젝트에서는 일반 `import`도 동작할 수 있는 이유

TypeScript와 빌드 도구는 타입으로만 사용된 Import를 분석해서 최종 JavaScript에서 제거할 수 있는 경우가 있다.

따라서:

```ts
import { Product } from "@/types/product";
```

라고 작성해도 환경에 따라 문제가 겉으로 드러나지 않을 수 있다.

하지만 이것이 타입을 항상 일반 `import`로 가져와도 안전하다는 뜻은 아니다. 프로젝트 설정에 따라 처리 방식과 요구사항이 달라질 수 있다.

> **팁**
> 에러가 발생한 뒤 수정하기보다 타입 전용이라는 것을 이미 알고 있다면 처음부터 `import type`으로 의도를 명확하게 표현한다.

## 4. 큰 프로젝트에서 문제가 더 잘 드러나는 이유

프로젝트 규모 자체가 직접 에러를 만드는 것은 아니다.

실제로는 프로젝트가 커지면서 다음과 같은 조건이 함께 늘어나는 것이 원인이 되기 쉽다.

```text
더 엄격한 TypeScript 설정
Lint 규칙
ES Module 설정
다른 빌드 도구
타입과 런타임 코드의 분리
Server / Client 경계
여러 패키지 구성
```

예를 들어 `verbatimModuleSyntax`처럼 Import를 더 명확하게 다루는 설정에서는 타입 전용 Import를 `import type`으로 작성해야 하는 상황이 생길 수 있다.

> **팁**
> 큰 프로젝트라서 에러가 난다고 외우지 않는다. 프로젝트가 커질수록 엄격한 설정과 복잡한 경계가 늘어나면서 애매한 Import가 문제로 드러나기 쉬워진다고 이해한다.

## 5. 현재 쇼핑몰에서의 구분

타입만 가져올 때:

```ts
import type { Product } from "@/types/product";
```

실제 데이터를 가져올 때:

```ts
import { products } from "@/data/products";
```

둘의 역할을 비교하면 명확하다.

```text
Product
→ 타입
→ TypeScript 타입 검사에 사용
→ import type

products
→ 실제 배열 데이터
→ 실행 시점에도 필요
→ import
```

> **팁**
> 이름이 비슷해도 타입과 값은 서로 다른 종류라고 생각한다. `Product`와 `products`를 구분하면 Import 방식도 판단하기 쉬워진다.

## 6. 이번 프로젝트의 실무 규칙

이 프로젝트에서는 다음 규칙을 사용한다.

```text
타입으로만 사용
→ import type

실행할 때 필요한 값으로 사용
→ import
```

예:

```ts
import type { Product } from "@/types/product";
import { products } from "@/data/products";
```

하나의 모듈에서 타입과 실제 값을 모두 가져와야 한다면 프로젝트의 TypeScript 설정과 코드 컨벤션에 맞춰 정확한 방식을 선택한다.

> **팁**
> 실무에서는 코드가 동작하는지만 보는 것이 아니라 다른 개발자가 Import를 보고 왜 필요한 의존성인지 바로 이해할 수 있는지도 중요하다.

## 7. 기억하는 방법

```text
import
→ Runtime Value
→ 실행 시점에도 필요

import type
→ Type Information
→ 타입 검사에 필요
→ 최종 JavaScript 실행에는 필요하지 않음
```

이번 경험은 다음처럼 정리할 수 있다.

```text
작은 프로젝트
→ 타입을 일반 import로 가져와도 문제가 안 보일 수 있음

프로젝트가 복잡해짐
→ 설정 / Lint / Module 경계 등이 엄격해짐
→ 애매한 타입 Import가 문제로 드러나기 쉬움

습관
→ 타입 전용이면 처음부터 import type
```

> **팁**
> `import type`을 단순한 에러 방지 문법으로 생각하지 않는다. 이 파일은 다른 파일의 실행 값이 아니라 타입 정보에만 의존한다는 설계 의도를 코드에 남기는 방법으로 이해한다.
