# Next.js `src` と `public` / `src` vs `public` / `src`와 `public`

---

# 日本語

## 1. 今回経験したこと

商品一覧ページでは、`src`側のTypeScriptやReactコードは正常に動いていたのに、画像を`src/public`に置いたときは表示されなかった。

画像をプロジェクトルートの`public`へ移動すると、次のパスで正常に表示された。

```ts
image: "/images/products/20260823_054028.png"
```

この違いは、Next.jsで`src`と`public`がまったく異なる役割を持っているためである。

> **Tip**  
> ファイルの場所を決める前に「これはアプリケーションのソースコードか、ブラウザからURLで参照する静的ファイルか」を考える。

## 2. `src`の役割

`src`はアプリケーションのソースコードを整理するための領域である。

例えば次のようなファイルを置ける。

```text
src/
├─ components/
├─ data/
├─ types/
└─ lib/
```

これらはTypeScriptやJavaScriptのImportを通してアプリケーションから利用する。

```ts
import { products } from "@/data/products";
import type { Product } from "@/types/product";
```

つまり`src`の主な役割は、アプリケーションを構成するコードを整理することである。

> **Tip**  
> コンポーネント、型、データ処理、ユーティリティなど「コードとして参照するもの」は`src`側の責任として考える。

## 3. `public`の役割

`public`は画像などの静的ファイルを置くための特別なディレクトリである。

```text
project/
└─ public/
   └─ images/
      └─ products/
         └─ product.png
```

`public`内のファイルは、`public`という名前をURLに含めずルート`/`から参照できる。

```text
実際のファイル
public/images/products/product.png

ブラウザからのパス
/images/products/product.png
```

Next.jsの`Image`でも同じ考え方で使用できる。

```tsx
<Image
  src="/images/products/product.png"
  alt="商品名"
  width={300}
  height={300}
/>
```

> **Tip**  
> `public`を「URLの`/`につながる静的ファイル置き場」と考えるとパスを理解しやすい。

## 4. なぜ`src/public`では表示されなかったのか

`public`はどこに置いても特別になる名前ではない。

Next.jsが静的ファイル用として扱うのは、プロジェクトルートに置かれた`public`である。

```text
project/
├─ public/          ← 静的ファイル用
└─ src/
   └─ public/       ← 単なるsrc内のディレクトリ
```

そのため、

```tsx
<Image src="/images/products/product.png" ... />
```

と書いた場合、期待されるファイルは次の場所にある。

```text
project/public/images/products/product.png
```

`project/src/public/...`ではない。

> **Tip**  
> フォルダ名だけで役割が決まるのではなく、フレームワークが決めた場所にあることも重要である。

## 5. `src/app`が使えるのに`src/public`が使えない理由

Next.jsでは`app`をプロジェクトルートに置く構成と、`src`の中に置く構成がサポートされている。

```text
project/
└─ app/
```

または、

```text
project/
└─ src/
   └─ app/
```

一方、`public`はプロジェクトルートに置く。

```text
project/
├─ public/
└─ src/
   └─ app/
```

つまり、`app`と`public`は同じ移動ルールを持つわけではない。

> **Tip**  
> Next.jsの特殊ディレクトリはすべて同じルールだと推測せず、それぞれの役割と配置ルールを区別する。

## 6. コードのImportと画像パスの違い

`src`内のコードはModule Importで参照する。

```ts
import { products } from "@/data/products";
```

一方、`public`内の静的画像はURL形式のパスで参照する。

```ts
image: "/images/products/product.png";
```

違いを整理すると次のようになる。

```text
src
→ ソースコード
→ importで依存関係を作る
→ ビルド処理の対象

public
→ 静的ファイル
→ /から始まるURLで参照
→ ブラウザへ公開
```

> **Tip**  
> `@/data/products`と`/images/products/...`は似たパス表現に見えても、前者はModule Import、後者はブラウザ向けURLという別の仕組みである。

## 7. 今回のショッピングモールでの構造

今回の構成なら、例えば次のように整理できる。

```text
project/
├─ public/
│  └─ images/
│     └─ products/
│        ├─ 20260823_054028.png
│        ├─ 20260823_060024.png
│        └─ 20260823_060628.png
│
└─ src/
   ├─ app/
   │  └─ products/
   │     └─ page.tsx
   ├─ components/
   ├─ data/
   │  └─ products.ts
   ├─ types/
   │  └─ product.ts
   └─ lib/
```

商品データからは次のように参照する。

```ts
image: "/images/products/20260823_054028.png";
```

> **Tip**  
> 実際のプロジェクト構造に結びつけて覚えると、`src`と`public`の違いを単なるルールとして暗記する必要がなくなる。

## 8. 覚え方

```text
src
→ Source
→ アプリケーションコード
→ importして使用

public
→ Public Static Assets
→ 画像などの静的ファイル
→ URLで使用
```

今回の問題は次の流れだった。

```text
画像をsrc/publicへ配置
→ /images/...では見つからない
→ 画像が表示されない

画像をルートpublicへ移動
→ /images/...で参照できる
→ Imageで正常に表示
```

> **Tip**  
> ファイルが見つからないときは、パス文字列だけでなく「そのファイルをNext.jsがどの仕組みで扱うべきなのか」まで確認する。

---

# English

## 1. What We Experienced

On the product-list page, the TypeScript and React code under `src` worked correctly, but the images did not appear when they were placed under `src/public`.

After moving the images to the root-level `public` directory, they worked with paths such as:

```ts
image: "/images/products/20260823_054028.png"
```

This happens because `src` and `public` have completely different responsibilities in Next.js.

> **Tip**  
> Before deciding where a file belongs, ask whether it is application source code or a static file that the browser should access through a URL.

## 2. The Role of `src`

`src` is an area used to organize application source code.

For example:

```text
src/
├─ components/
├─ data/
├─ types/
└─ lib/
```

These files are typically consumed through TypeScript or JavaScript imports.

```ts
import { products } from "@/data/products";
import type { Product } from "@/types/product";
```

The main purpose of `src` is therefore to organize the code that makes up the application.

> **Tip**  
> Think of components, types, data logic, and utilities as things that belong to the source-code side of the project.

## 3. The Role of `public`

`public` is a special directory for static files such as images.

```text
project/
└─ public/
   └─ images/
      └─ products/
         └─ product.png
```

Files inside `public` are accessible from the root URL without including the word `public` in the path.

```text
Actual file
public/images/products/product.png

Browser path
/images/products/product.png
```

The same idea applies when using Next.js `Image`.

```tsx
<Image
  src="/images/products/product.png"
  alt="Product name"
  width={300}
  height={300}
/>
```

> **Tip**  
> Think of `public` as the static-file directory connected to the browser's `/` URL root.

## 4. Why `src/public` Did Not Work

A directory does not become special simply because its name is `public`.

Next.js treats the root-level `public` directory as the directory for publicly served static files.

```text
project/
├─ public/          ← static assets
└─ src/
   └─ public/       ← just another directory under src
```

Therefore, when the code uses:

```tsx
<Image src="/images/products/product.png" ... />
```

the expected file location is:

```text
project/public/images/products/product.png
```

not `project/src/public/...`.

> **Tip**  
> A directory's role depends not only on its name but also on whether it is located where the framework expects it.

## 5. Why `src/app` Can Work but `src/public` Cannot

Next.js supports an `app` directory at the project root or inside `src`.

```text
project/
└─ app/
```

or:

```text
project/
└─ src/
   └─ app/
```

The `public` directory, however, belongs at the project root.

```text
project/
├─ public/
└─ src/
   └─ app/
```

Therefore, `app` and `public` do not share the same placement rules.

> **Tip**  
> Do not assume that every special Next.js directory follows the same placement rule. Learn the responsibility and location rule of each one.

## 6. Code Imports vs Image Paths

Code under `src` is referenced through module imports.

```ts
import { products } from "@/data/products";
```

Static images under `public` are referenced through URL-style paths.

```ts
image: "/images/products/product.png";
```

The distinction can be summarized as:

```text
src
→ Source code
→ Dependencies through imports
→ Processed as application code

public
→ Static files
→ Referenced from URLs beginning with /
→ Served to the browser
```

> **Tip**  
> `@/data/products` and `/images/products/...` may both look like paths, but the first is a module import path and the second is a browser URL.

## 7. Structure for Our Shopping Mall

A suitable structure for the current project can look like this:

```text
project/
├─ public/
│  └─ images/
│     └─ products/
│        ├─ 20260823_054028.png
│        ├─ 20260823_060024.png
│        └─ 20260823_060628.png
│
└─ src/
   ├─ app/
   │  └─ products/
   │     └─ page.tsx
   ├─ components/
   ├─ data/
   │  └─ products.ts
   ├─ types/
   │  └─ product.ts
   └─ lib/
```

The product data can then reference an image like this:

```ts
image: "/images/products/20260823_054028.png";
```

> **Tip**  
> Connect the rule to your actual project structure. That makes the difference between `src` and `public` easier to remember than memorizing it in isolation.

## 8. A Simple Way to Remember

```text
src
→ Source
→ Application code
→ Used through imports

public
→ Public Static Assets
→ Images and other static files
→ Used through URLs
```

Our issue followed this sequence:

```text
Image placed in src/public
→ /images/... cannot find it
→ Image does not appear

Image moved to root public
→ /images/... can access it
→ Image renders correctly
```

> **Tip**  
> When a file cannot be found, check not only the path string but also which Next.js mechanism is supposed to handle that file.

---

# 한국어

## 1. 이번에 경험한 내용

상품 목록 페이지에서 `src` 쪽의 TypeScript와 React 코드는 정상적으로 동작했지만, 이미지를 `src/public`에 넣었을 때는 표시되지 않았다.

이미지를 프로젝트 루트의 `public` 폴더로 옮기자 다음과 같은 경로로 정상적으로 표시됐다.

```ts
image: "/images/products/20260823_054028.png"
```

이 차이가 발생한 이유는 Next.js에서 `src`와 `public`이 완전히 다른 역할을 담당하기 때문이다.

> **팁**  
> 파일 위치를 정하기 전에 이 파일이 애플리케이션 소스 코드인지, 브라우저가 URL로 접근해야 하는 정적 파일인지를 먼저 생각한다.

## 2. `src`의 역할

`src`는 애플리케이션의 소스 코드를 정리하기 위한 영역이다.

예를 들면 다음과 같은 구조를 둘 수 있다.

```text
src/
├─ components/
├─ data/
├─ types/
└─ lib/
```

이 파일들은 TypeScript나 JavaScript의 Import를 통해 애플리케이션에서 사용한다.

```ts
import { products } from "@/data/products";
import type { Product } from "@/types/product";
```

즉 `src`의 핵심 역할은 애플리케이션을 구성하는 코드를 정리하는 것이다.

> **팁**  
> 컴포넌트, 타입, 데이터 처리, 유틸리티처럼 코드로 참조해서 사용하는 것은 `src` 쪽의 책임이라고 생각하면 이해하기 쉽다.

## 3. `public`의 역할

`public`은 이미지 같은 정적 파일을 두는 특별한 디렉터리다.

```text
project/
└─ public/
   └─ images/
      └─ products/
         └─ product.png
```

`public` 안의 파일은 URL에서 `public`이라는 이름을 포함하지 않고 루트 `/`부터 접근한다.

```text
실제 파일
public/images/products/product.png

브라우저에서 사용하는 경로
/images/products/product.png
```

Next.js의 `Image`에서도 같은 방식으로 사용할 수 있다.

```tsx
<Image
  src="/images/products/product.png"
  alt="상품명"
  width={300}
  height={300}
/>
```

> **팁**  
> `public`을 브라우저의 `/` URL과 연결된 정적 파일 보관소라고 생각하면 경로를 이해하기 쉽다.

## 4. 왜 `src/public`에서는 이미지가 안 떴을까

폴더 이름을 `public`이라고 만들었다고 해서 어디에서나 특별한 폴더가 되는 것은 아니다.

Next.js가 정적 파일용으로 특별하게 처리하는 것은 프로젝트 루트에 위치한 `public`이다.

```text
project/
├─ public/          ← 정적 파일용
└─ src/
   └─ public/       ← src 안의 일반 폴더
```

따라서 다음 코드를 사용하면:

```tsx
<Image src="/images/products/product.png" ... />
```

Next.js에서 기대하는 실제 파일 위치는:

```text
project/public/images/products/product.png
```

이다. `project/src/public/...`을 찾는 것이 아니다.

> **팁**  
> 폴더의 역할은 이름만으로 결정되는 것이 아니다. 프레임워크가 정해둔 위치에 존재하는지도 중요하다.

## 5. `src/app`은 되는데 왜 `src/public`은 안 될까

Next.js에서는 `app` 디렉터리를 프로젝트 루트에 두는 방식과 `src` 내부에 두는 방식을 지원한다.

```text
project/
└─ app/
```

또는:

```text
project/
└─ src/
   └─ app/
```

반면 `public`은 프로젝트 루트에 둔다.

```text
project/
├─ public/
└─ src/
   └─ app/
```

즉 `app`과 `public`은 같은 위치 규칙을 가지는 폴더가 아니다.

> **팁**  
> Next.js의 특별한 폴더가 모두 같은 규칙으로 움직인다고 추측하지 말고, 각 폴더의 역할과 위치 규칙을 따로 구분한다.

## 6. 코드 Import와 이미지 경로의 차이

`src` 안의 코드는 Module Import로 참조한다.

```ts
import { products } from "@/data/products";
```

반면 `public`의 정적 이미지는 URL 형태의 경로로 참조한다.

```ts
image: "/images/products/product.png";
```

차이를 정리하면 다음과 같다.

```text
src
→ 소스 코드
→ import로 의존 관계를 연결
→ 애플리케이션 코드로 처리

public
→ 정적 파일
→ /로 시작하는 URL로 참조
→ 브라우저에 제공
```

> **팁**  
> `@/data/products`와 `/images/products/...`가 둘 다 경로처럼 보여도 전자는 모듈 Import 경로이고 후자는 브라우저 URL이라는 완전히 다른 개념이다.

## 7. 현재 쇼핑몰 프로젝트 구조

현재 프로젝트에서는 예를 들어 다음과 같이 정리할 수 있다.

```text
project/
├─ public/
│  └─ images/
│     └─ products/
│        ├─ 20260823_054028.png
│        ├─ 20260823_060024.png
│        └─ 20260823_060628.png
│
└─ src/
   ├─ app/
   │  └─ products/
   │     └─ page.tsx
   ├─ components/
   ├─ data/
   │  └─ products.ts
   ├─ types/
   │  └─ product.ts
   └─ lib/
```

상품 데이터에서는 다음과 같이 이미지 경로를 사용할 수 있다.

```ts
image: "/images/products/20260823_054028.png";
```

> **팁**  
> 실제 프로젝트 폴더 구조와 연결해서 기억하면 `src`와 `public`의 차이를 단순 규칙으로 암기하지 않아도 된다.

## 8. 기억하는 방법

```text
src
→ Source
→ 애플리케이션 코드
→ import해서 사용

public
→ Public Static Assets
→ 이미지 등의 정적 파일
→ URL로 사용
```

이번에 직접 경험한 문제는 다음과 같이 정리할 수 있다.

```text
이미지를 src/public에 배치
→ /images/...에서 찾을 수 없음
→ 이미지가 표시되지 않음

이미지를 루트 public으로 이동
→ /images/...로 접근 가능
→ Image에서 정상 표시
```

> **팁**  
> 파일을 찾지 못하는 문제가 생기면 경로 문자열만 확인하지 말고, 해당 파일을 Next.js가 어떤 방식으로 처리해야 하는 파일인지까지 확인한다.
