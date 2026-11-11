# TypeScript `interface` と `type` / `interface` vs `type` / `interface`와 `type`

---

# 日本語

## 1. 共通点

TypeScriptの`interface`と`type`は、どちらもデータがどのような形を持つかを定義するために使用できる。

```ts
interface Product {
  id: number
  name: string
  price: number
}

type Product = {
  id: number
  name: string
  price: number
}
```

上の二つは、`Product`オブジェクトの基本的な形を定義するという目的ではほぼ同じ役割を持つ。

> **Tip**
> 最初は「どちらが正解か」より、型を使ってデータの形を明確にすることを優先する。

## 2. `interface` — オブジェクトの構造を表現するのが得意

`interface`は特にオブジェクトの構造を定義するときに自然に使える。

```ts
interface User {
  id: number
  name: string
}
```

クラスが特定の構造を満たすことを表現するときにも使いやすい。

```ts
interface User {
  id: number
  name: string
}

class Member implements User {
  id: number
  name: string

  constructor(id: number, name: string) {
    this.id = id
    this.name = name
  }
}
```

> **Tip**
> 講義やオブジェクト指向を扱う教材で`interface`をよく見たのであれば、オブジェクトやクラスの「契約」を説明しやすいことが理由の一つと考えられる。

## 3. `interface`の宣言マージ

同じ名前の`interface`を複数回宣言すると、TypeScriptはそれらをマージできる。

```ts
interface User {
  id: number
}

interface User {
  name: string
}
```

結果として`User`は次の両方を持つ。

```text
User
├─ id
└─ name
```

これはDeclaration Merging（宣言マージ）と呼ばれる。

一方、同じ名前の`type`を再宣言することはできない。

```ts
type User = {
  id: number
}

// Error
type User = {
  name: string
}
```

> **Tip**
> 宣言マージはライブラリの既存型を拡張する場面などで役立つ。ただし通常のアプリケーションコードで意図せず同名の宣言を増やす必要はない。

## 4. `type` — より幅広い型表現ができる

`type`はオブジェクトだけを表すものではない。

```ts
type ProductId = number
```

文字列リテラルの組み合わせも定義できる。

```ts
type ProductStatus = "sale" | "soldout"
```

複数の型のどれかを許可するUnion Typeも自然に表現できる。

```ts
type Id = string | number
```

もちろんオブジェクトも定義できる。

```ts
type Product = {
  id: number
  name: string
}
```

つまり、`type`は「ある型に名前を付ける」ための幅広い仕組みとして考えると理解しやすい。

> **Tip**
> `type`を単に`interface`の短い書き方として覚えない。UnionやLiteral Typeを使い始めると違いが分かりやすくなる。

## 5. 型を拡張する方法

`interface`では`extends`を使って別のインターフェースを拡張できる。

```ts
interface Product {
  id: number
  name: string
}

interface SaleProduct extends Product {
  salePrice: number
}
```

`type`ではIntersection Typeの`&`を使って型を組み合わせられる。

```ts
type Product = {
  id: number
  name: string
}

type SaleProduct = Product & {
  salePrice: number
}
```

どちらも最終的に`id`、`name`、`salePrice`を持つ構造を作れる。

> **Tip**
> `extends`と`&`を暗記するだけでなく、「既存の型を再利用して新しい型を作っている」と理解する。

## 6. 比較

| 項目 | `interface` | `type` |
|---|---|---|
| オブジェクト型 | 可能 | 可能 |
| クラスとの利用 | `implements`と自然に使える | 利用可能 |
| `extends`による拡張 | 得意 | 通常は`&`を使用 |
| Union Type | 直接定義しない | 得意 |
| Literal Type | 直接定義しない | 得意 |
| 宣言マージ | 可能 | 不可能 |
| 主なイメージ | オブジェクトの構造・契約 | 幅広い型への名前付け |

> **Tip**
> この表は「どちらが優れているか」を決める表ではない。目的とプロジェクトの規約に合わせて選択する。

## 7. ショッピングモールプロジェクトではどうするか

現在のショッピングモールでは`type`を中心に進めてもよい。

```ts
type Product = {
  id: number
  name: string
  description: string
  originalPrice: number
  salePrice: number
  image: string
}
```

今後は次のような型も自然に追加できる。

```ts
type ProductStatus = "sale" | "soldout"
type ProductId = string | number
```

ただし、`interface`を使っても間違いではない。実際のチーム開発では、チームや既存コードベースの規約に合わせることが重要である。

> **Tip**
> このプロジェクトでは`type`を使いながら、`interface`が必要になる場面を見つけたときに比較すると違いを実践的に理解しやすい。

## 8. 覚え方

```text
interface
→ オブジェクトの形・契約を表すイメージ
→ extends
→ Declaration Merging

type
→ 型そのものに名前を付けるイメージ
→ Object / Union / Literal / Intersection
→ & で組み合わせ可能
```

結論として、単純なオブジェクト型では両方を使える。重要なのは文法上の優劣ではなく、必要な型表現とプロジェクトの一貫性である。

> **Tip**
> コードを見た瞬間に「なぜここはinterfaceで、ここはtypeなのか」を考える習慣をつけると、TypeScriptの型設計への理解が深まる。

---

# English

## 1. What They Have in Common

In TypeScript, both `interface` and `type` can be used to define the shape of data.

```ts
interface Product {
  id: number
  name: string
  price: number
}

type Product = {
  id: number
  name: string
  price: number
}
```

For the basic purpose of describing the shape of a `Product` object, these two examples play almost the same role.

> **Tip**
> At first, focus less on which one is “correct” and more on using types to make the shape of your data explicit.

## 2. `interface` — Well Suited to Object Structures

`interface` is especially natural when defining the structure of an object.

```ts
interface User {
  id: number
  name: string
}
```

It also works naturally when expressing that a class must satisfy a particular structure.

```ts
interface User {
  id: number
  name: string
}

class Member implements User {
  id: number
  name: string

  constructor(id: number, name: string) {
    this.id = id
    this.name = name
  }
}
```

> **Tip**
> If you saw `interface` frequently in courses or object-oriented programming material, one reason may be that it clearly expresses an object's or class's “contract.”

## 3. Declaration Merging with `interface`

When multiple interfaces have the same name, TypeScript can merge their declarations.

```ts
interface User {
  id: number
}

interface User {
  name: string
}
```

The resulting `User` contains both properties.

```text
User
├─ id
└─ name
```

This behavior is called Declaration Merging.

A `type`, on the other hand, cannot normally be redeclared with the same name.

```ts
type User = {
  id: number
}

// Error
type User = {
  name: string
}
```

> **Tip**
> Declaration merging can be useful when extending existing library types. In normal application code, however, there is usually no reason to create duplicate declarations without a clear purpose.

## 4. `type` — Supports a Wider Range of Type Expressions

A `type` alias is not limited to objects.

```ts
type ProductId = number
```

It can describe a set of string literals.

```ts
type ProductStatus = "sale" | "soldout"
```

It also naturally expresses a Union Type.

```ts
type Id = string | number
```

And it can still define an object shape.

```ts
type Product = {
  id: number
  name: string
}
```

A useful mental model is that `type` provides a general way to give a name to a type expression.

> **Tip**
> Do not memorize `type` as merely a shorter version of `interface`. The distinction becomes clearer once you start using unions and literal types.

## 5. Extending Existing Types

An `interface` can extend another interface with `extends`.

```ts
interface Product {
  id: number
  name: string
}

interface SaleProduct extends Product {
  salePrice: number
}
```

With `type`, an Intersection Type using `&` can combine types.

```ts
type Product = {
  id: number
  name: string
}

type SaleProduct = Product & {
  salePrice: number
}
```

Both approaches can produce a structure containing `id`, `name`, and `salePrice`.

> **Tip**
> Rather than memorizing only `extends` versus `&`, understand the common idea: reusing an existing type to create a new one.

## 6. Comparison

| Feature | `interface` | `type` |
|---|---|---|
| Object types | Yes | Yes |
| Working with classes | Natural with `implements` | Also possible |
| Extension with `extends` | Strong fit | Usually uses `&` instead |
| Union Type | Not directly defined | Strong fit |
| Literal Type | Not directly defined | Strong fit |
| Declaration Merging | Yes | No |
| Main mental model | Object structure / contract | Naming general type expressions |

> **Tip**
> This table is not meant to decide which one is superior. Choose according to the type you need and the conventions of the project.

## 7. What to Use in the Shopping Mall Project

For the current shopping mall project, using `type` as the main convention is a reasonable choice.

```ts
type Product = {
  id: number
  name: string
  description: string
  originalPrice: number
  salePrice: number
  image: string
}
```

Later, other types can naturally be added.

```ts
type ProductStatus = "sale" | "soldout"
type ProductId = string | number
```

Using `interface` would not be wrong. In real team development, following the convention of the team and the existing codebase is usually more important.

> **Tip**
> Use `type` in this project, and when you eventually encounter a case where `interface` is useful, compare the two in that real situation. The distinction will become much easier to remember.

## 8. A Simple Way to Remember

```text
interface
→ Think object shape / contract
→ extends
→ Declaration Merging

type
→ Think naming a type expression
→ Object / Union / Literal / Intersection
→ Combine with &
```

In short, both work well for simple object types. The important question is not which syntax is universally better, but which type expression is needed and how consistently the project uses it.

> **Tip**
> When reading code, make a habit of asking, “Why did this code use interface here and type there?” That question gradually develops practical TypeScript type-design skills.

---

# 한국어

## 1. 공통점

TypeScript의 `interface`와 `type`은 둘 다 데이터가 어떤 형태를 가지는지 정의하는 데 사용할 수 있다.

```ts
interface Product {
  id: number
  name: string
  price: number
}

type Product = {
  id: number
  name: string
  price: number
}
```

위 두 코드는 `Product` 객체의 기본적인 형태를 정의한다는 목적에서는 거의 같은 역할을 한다.

> **팁**
> 처음에는 무엇이 정답인지 고민하기보다 타입을 사용해 데이터의 형태를 명확하게 표현하는 것에 집중한다.

## 2. `interface` — 객체 구조 표현에 잘 어울린다

`interface`는 특히 객체의 구조를 정의할 때 자연스럽게 사용할 수 있다.

```ts
interface User {
  id: number
  name: string
}
```

클래스가 특정 구조를 만족해야 한다는 것을 표현할 때도 자연스럽게 사용할 수 있다.

```ts
interface User {
  id: number
  name: string
}

class Member implements User {
  id: number
  name: string

  constructor(id: number, name: string) {
    this.id = id
    this.name = name
  }
}
```

> **팁**
> 강의나 객체지향 관련 학습 자료에서 `interface`를 자주 봤다면 객체나 클래스의 '계약'을 설명하기 좋다는 점이 이유 중 하나일 수 있다.

## 3. `interface`의 선언 병합

같은 이름의 `interface`를 여러 번 선언하면 TypeScript가 선언을 합칠 수 있다.

```ts
interface User {
  id: number
}

interface User {
  name: string
}
```

결과적으로 `User`는 두 속성을 모두 가진다.

```text
User
├─ id
└─ name
```

이 동작을 Declaration Merging, 즉 선언 병합이라고 한다.

반면 같은 이름의 `type`은 다시 선언할 수 없다.

```ts
type User = {
  id: number
}

// Error
type User = {
  name: string
}
```

> **팁**
> 선언 병합은 라이브러리의 기존 타입을 확장하는 등의 상황에서 유용하다. 다만 일반적인 애플리케이션 코드에서는 명확한 이유 없이 같은 이름의 선언을 여러 개 만들 필요는 없다.

## 4. `type` — 더 넓은 타입 표현이 가능하다

`type`은 객체만 표현하는 기능이 아니다.

```ts
type ProductId = number
```

문자열 리터럴의 조합도 정의할 수 있다.

```ts
type ProductStatus = "sale" | "soldout"
```

여러 타입 중 하나를 허용하는 Union Type도 자연스럽게 표현할 수 있다.

```ts
type Id = string | number
```

물론 객체 구조도 정의할 수 있다.

```ts
type Product = {
  id: number
  name: string
}
```

따라서 `type`은 어떤 타입 표현 자체에 이름을 붙이는 넓은 기능이라고 이해하면 쉽다.

> **팁**
> `type`을 단순히 `interface`의 짧은 문법이라고 외우지 않는다. Union이나 Literal Type을 사용하기 시작하면 둘의 차이가 훨씬 선명해진다.

## 5. 기존 타입을 확장하는 방법

`interface`는 `extends`를 사용해 다른 인터페이스를 확장할 수 있다.

```ts
interface Product {
  id: number
  name: string
}

interface SaleProduct extends Product {
  salePrice: number
}
```

`type`에서는 Intersection Type인 `&`를 사용해 타입을 조합할 수 있다.

```ts
type Product = {
  id: number
  name: string
}

type SaleProduct = Product & {
  salePrice: number
}
```

두 방법 모두 최종적으로 `id`, `name`, `salePrice`를 가진 구조를 만들 수 있다.

> **팁**
> `extends`와 `&` 문법만 외우기보다 기존 타입을 재사용해서 새로운 타입을 만든다는 공통 원리를 이해한다.

## 6. 비교

| 구분 | `interface` | `type` |
|---|---|---|
| 객체 타입 | 가능 | 가능 |
| 클래스와 사용 | `implements`와 자연스럽게 사용 | 사용 가능 |
| `extends` 확장 | 잘 어울림 | 보통 `&` 사용 |
| Union Type | 직접 정의하지 않음 | 잘 어울림 |
| Literal Type | 직접 정의하지 않음 | 잘 어울림 |
| 선언 병합 | 가능 | 불가능 |
| 핵심 이미지 | 객체 구조 / 계약 | 다양한 타입 표현에 이름 붙이기 |

> **팁**
> 이 표는 둘 중 무엇이 더 우수한지를 결정하기 위한 표가 아니다. 필요한 타입 표현과 프로젝트의 규칙에 맞춰 선택하면 된다.

## 7. 쇼핑몰 프로젝트에서는 어떻게 사용할까

현재 쇼핑몰 프로젝트에서는 `type`을 중심으로 진행해도 좋다.

```ts
type Product = {
  id: number
  name: string
  description: string
  originalPrice: number
  salePrice: number
  image: string
}
```

앞으로는 다음과 같은 타입도 자연스럽게 추가할 수 있다.

```ts
type ProductStatus = "sale" | "soldout"
type ProductId = string | number
```

그렇다고 `interface`를 사용하는 것이 틀린 것은 아니다. 실제 팀 개발에서는 팀과 기존 코드베이스의 컨벤션을 따르는 것이 더 중요하다.

> **팁**
> 이번 프로젝트에서는 `type`을 사용해보고, 나중에 `interface`가 유용한 상황을 실제로 만났을 때 비교하면 차이를 훨씬 실전적으로 이해할 수 있다.

## 8. 기억하는 방법

```text
interface
→ 객체의 형태 / 계약을 떠올린다
→ extends
→ Declaration Merging

type
→ 타입 표현에 이름을 붙인다고 생각한다
→ Object / Union / Literal / Intersection
→ &로 조합 가능
```

결론적으로 단순한 객체 타입에서는 둘 다 사용할 수 있다. 중요한 것은 문법적으로 무엇이 무조건 더 좋은가가 아니라, 어떤 타입 표현이 필요한지와 프로젝트 전체에서 얼마나 일관성 있게 사용하는지다.

> **팁**
> 코드를 볼 때 `왜 여기는 interface이고 여기는 type일까?`를 한 번씩 생각하는 습관을 들이면 TypeScript 타입 설계에 대한 감각이 빠르게 좋아진다.
