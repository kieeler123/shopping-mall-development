# npm과 pnpm 비교 및 패키지 매니저 선택 기준

## 1. 현재 프로젝트 결론

현재 쇼핑몰 프로젝트는 이미 `npm`으로 생성했으므로 **그대로 npm을 사용한다.**

```text
현재 선택

Node.js
   ↓
npm
   ↓
Next.js
   ↓
TypeScript
   ↓
Tailwind CSS
```

`pnpm`은 여러 장점이 있어 추천할 수 있는 패키지 매니저지만,  
이미 정상적으로 생성된 npm 프로젝트를 굳이 다시 만들 필요는 없다.

> **팁**  
> 현재 프로젝트에서는 패키지 매니저를 바꾸는 것보다 쇼핑몰 기능 구현과 프로젝트 구조를 익히는 것이 훨씬 중요하다.

---

## 2. 패키지 매니저란?

Node.js 프로젝트에서는 다양한 외부 라이브러리를 사용한다.

예를 들어 다음과 같은 패키지가 있을 수 있다.

```text
Next.js
React
Zod
Lucide
Supabase Client
```

이런 패키지를 설치하고 버전을 관리하는 도구가 **패키지 매니저**다.

대표적으로 다음이 있다.

```text
npm
pnpm
yarn
```

이들은 모두 기본적으로 다음 역할을 수행한다.

```text
패키지 설치
패키지 삭제
의존성 관리
스크립트 실행
Lockfile 관리
```

예를 들어 npm에서는:

```bash
npm install zod
```

pnpm에서는:

```bash
pnpm add zod
```

를 사용한다.

> **팁**  
> npm, pnpm 명령어 자체보다 `package.json`, dependency, devDependency, lockfile의 역할을 이해하는 것이 더 중요하다.

---

# 3. npm과 pnpm의 공통점

npm과 pnpm은 사용 목적이 거의 같다.

둘 다 다음 작업을 수행할 수 있다.

```text
라이브러리 설치
라이브러리 제거
라이브러리 버전 관리
개발 스크립트 실행
빌드 스크립트 실행
의존성 잠금
```

예:

| 작업 | npm | pnpm |
|---|---|---|
| 전체 설치 | `npm install` | `pnpm install` |
| 패키지 추가 | `npm install zod` | `pnpm add zod` |
| 패키지 삭제 | `npm uninstall zod` | `pnpm remove zod` |
| 개발 서버 | `npm run dev` | `pnpm dev` |
| 빌드 | `npm run build` | `pnpm build` |

따라서 어떤 패키지 매니저를 사용하더라도 Next.js 쇼핑몰을 개발하는 데 본질적인 문제는 없다.

> **팁**  
> npm과 pnpm 중 하나를 사용한다고 해서 애플리케이션 기능이나 품질 자체가 달라지는 것은 아니다.

---

# 4. pnpm을 추천한 이유

pnpm을 추천한 가장 큰 이유는 다음 세 가지다.

```text
1. 디스크 사용 효율
2. 빠른 설치
3. 엄격한 의존성 관리
```

---

## 4.1 디스크 사용 효율

npm 프로젝트를 여러 개 만들면 각 프로젝트의 `node_modules` 안에 많은 패키지가 설치된다.

개념적으로 보면 다음과 같다.

```text
project-a/
└─ node_modules/
   ├─ react
   ├─ next
   └─ ...

project-b/
└─ node_modules/
   ├─ react
   ├─ next
   └─ ...

project-c/
└─ node_modules/
   ├─ react
   ├─ next
   └─ ...
```

여러 프로젝트에서 비슷한 버전의 패키지를 사용하면 디스크 공간이 많이 필요할 수 있다.

pnpm은 패키지를 별도의 저장소에 보관하고 필요한 프로젝트에서 연결하여 사용한다.

개념적으로는 다음과 같다.

```text
                pnpm store
              /     |      \
           React   Next    Zod
              \      |      /
               \     |     /
          ┌────────┬────────┐
          ↓        ↓        ↓
      project-a project-b project-c
```

동일한 패키지를 여러 프로젝트에서 사용하면 중복 저장을 줄일 수 있다.

> **팁**  
> 프로젝트를 여러 개 만드는 개발자일수록 pnpm의 디스크 절약 장점을 체감하기 쉽다.

---

## 4.2 패키지 설치 효율

pnpm은 이미 로컬 저장소에 존재하는 패키지를 재사용할 수 있기 때문에  
여러 프로젝트를 반복해서 만드는 환경에서는 설치 속도가 빠르게 느껴질 수 있다.

예를 들어:

```text
프로젝트 A
React 설치

프로젝트 B
같은 React 버전 사용

프로젝트 C
같은 React 버전 사용
```

이런 환경에서는 기존에 저장된 패키지를 효율적으로 재사용할 수 있다.

> **팁**  
> 프로젝트 하나만 개발할 때보다 여러 프로젝트를 만들거나 CI 환경을 자주 사용하는 경우 차이가 더 잘 느껴질 수 있다.

---

## 4.3 더 엄격한 의존성 관리

pnpm을 추천한 중요한 이유 중 하나다.

예를 들어 프로젝트 의존성이 다음과 같다고 가정한다.

```text
내 프로젝트
│
├─ Package A
│   └─ Package B
│
└─ Package C
```

내 프로젝트가 직접 설치한 패키지는 다음뿐이다.

```json
{
  "dependencies": {
    "A": "...",
    "C": "..."
  }
}
```

그런데 코드에서 직접 `Package B`를 사용하는 경우가 생길 수 있다.

```ts
import B from "B";
```

하지만 현재 프로젝트는 `B`를 직접 dependency로 선언하지 않았다.

이처럼 **간접 의존성을 우연히 직접 사용할 수 있는 문제**를 흔히 phantom dependency 문제라고 부른다.

pnpm은 의존성을 더 엄격하게 구성하기 때문에 이런 잘못된 의존성을 발견하는 데 도움이 된다.

> **팁**  
> 프로젝트 코드에서 직접 import해서 사용하는 패키지는 반드시 프로젝트의 `package.json`에 직접 dependency로 선언하는 습관을 들인다.

---

# 5. Monorepo 환경에서 pnpm이 좋은 이유

프로젝트가 커지면 다음과 같은 구조를 사용할 수도 있다.

```text
shopping/
│
├─ apps/
│   ├─ web/
│   └─ admin/
│
├─ packages/
│   ├─ ui/
│   ├─ database/
│   └─ config/
│
└─ pnpm-workspace.yaml
```

이처럼 여러 애플리케이션과 공용 패키지를 하나의 저장소에서 관리하는 구조를  
**Monorepo**라고 한다.

pnpm은 Workspace 기능을 이용해 이런 구조를 비교적 편리하게 관리할 수 있다.

하지만 현재 쇼핑몰 프로젝트에서는 아직 필요하지 않다.

> **팁**  
> Monorepo가 실무에서 사용된다는 이유만으로 초반부터 도입하지 않는다.  
> 실제로 여러 앱이나 공용 패키지를 분리할 필요가 생겼을 때 도입한다.

---

# 6. npm을 그대로 사용해도 되는 이유

현재 프로젝트는 이미 npm으로 생성되어 있다.

예상 구조는 다음과 비슷하다.

```text
shopping-mall/
│
├─ package.json
├─ package-lock.json
├─ node_modules/
├─ src/
└─ ...
```

이 상태에서 정상적으로:

```bash
npm run dev
```

가 실행된다면 패키지 매니저를 변경할 이유가 없다.

npm도 충분히 성숙한 Node.js 패키지 매니저이며  
Next.js 프로젝트를 개발하고 배포하는 데 필요한 기능을 모두 제공한다.

즉:

```text
npm을 사용했다
        ↓
실무급 프로젝트를 만들 수 없다
```

는 잘못된 생각이다.

실제 프로젝트 품질에 더 큰 영향을 주는 것은 다음과 같은 요소다.

```text
프로젝트 구조
도메인 설계
DB 설계
보안
테스트
에러 처리
성능
코드 품질
문서화
```

패키지 매니저는 개발 도구 중 하나일 뿐이다.

> **팁**  
> 이미 정상적으로 동작하는 환경을 굳이 변경하지 않는 것도 중요한 개발 판단이다.

---

# 7. 지금 pnpm으로 바꾸지 않는 이유

현재 단계에서 npm에서 pnpm으로 변경하면 얻는 학습 효과보다  
환경을 다시 맞추는 비용이 더 클 수 있다.

예를 들어 다음 작업이 발생할 수 있다.

```text
package-lock.json 제거
↓
pnpm 설치
↓
pnpm-lock.yaml 생성
↓
node_modules 재설치
↓
환경 재확인
```

이 작업 자체가 어렵지는 않지만 현재 쇼핑몰 학습 목표와 직접적인 관련은 적다.

현재 우선순위는:

```text
패키지 매니저 변경

보다

쇼핑몰 기능 구현
Next.js 학습
컴포넌트 설계
데이터 흐름 이해
```

이다.

> **팁**  
> 새로운 도구가 더 좋다는 이유만으로 정상 동작하는 프로젝트 환경을 중간에 자주 변경하지 않는다.

---

# 8. 한 프로젝트에서는 하나의 패키지 매니저를 유지한다

가능하면 한 프로젝트에서는 패키지 매니저를 하나만 사용한다.

좋은 예:

```text
프로젝트 시작
↓
npm 선택
↓
npm 계속 사용
```

불필요한 예:

```text
npm
↓
pnpm
↓
yarn
↓
다시 npm
```

패키지 매니저를 자주 변경하면 여러 lockfile이 섞이는 문제가 발생할 수 있다.

예:

```text
package-lock.json
pnpm-lock.yaml
yarn.lock
```

가능하면 하나만 유지한다.

현재 프로젝트는 npm을 선택했으므로:

```text
package.json
package-lock.json
```

을 기준으로 관리한다.

> **팁**  
> `package-lock.json`은 Git에 커밋한다.  
> `node_modules`는 Git에 커밋하지 않는다.

---

# 9. package.json과 package-lock.json

## package.json

프로젝트에서 사용하는 패키지와 실행 스크립트를 정의한다.

예:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "...",
    "react": "...",
    "react-dom": "..."
  }
}
```

즉:

```text
이 프로젝트가 무엇을 사용하는지
```

를 설명하는 파일이다.

---

## package-lock.json

npm이 실제 설치한 패키지들의 구체적인 버전과 의존성 정보를 기록한다.

이를 통해 다른 개발 환경에서도 가능한 한 동일한 의존성 구조를 재현할 수 있다.

따라서 다음 파일은 Git에 포함한다.

```text
package.json
package-lock.json
```

반면:

```text
node_modules/
```

는 일반적으로 Git에 포함하지 않는다.

> **팁**  
> `package.json`은 의존성 선언, `package-lock.json`은 실제 설치 상태를 재현하기 위한 잠금 파일이라고 이해하면 된다.

---

# 10. 현재 프로젝트 운영 원칙

현재 쇼핑몰 프로젝트에서는 다음 원칙을 사용한다.

```text
Package Manager: npm
```

패키지 설치:

```bash
npm install <package>
```

개발 서버:

```bash
npm run dev
```

Production Build 확인:

```bash
npm run build
```

패키지 삭제:

```bash
npm uninstall <package>
```

의존성 전체 설치:

```bash
npm install
```

앞으로 프로젝트 문서와 명령어도 npm 기준으로 작성한다.

> **팁**  
> 프로젝트에서 사용하는 패키지 매니저를 README 또는 개발 문서에 명시해두면 나중에 다시 프로젝트를 열었을 때 혼란을 줄일 수 있다.

---

# 11. 나중에 pnpm을 경험하는 방법

현재 프로젝트는 npm을 유지하고  
다음에 새로운 작은 프로젝트를 만들 때 pnpm을 사용해보는 것이 좋다.

예:

```text
현재 쇼핑몰
→ npm

다음 연습 프로젝트
→ pnpm
```

그러면 직접 다음을 비교해볼 수 있다.

```text
설치 속도
node_modules 구조
lockfile
패키지 설치 명령어
디스크 사용량
dependency 관리 방식
```

직접 두 환경을 경험하면 각각의 장단점을 훨씬 쉽게 이해할 수 있다.

> **팁**  
> 도구 비교는 설명만 읽는 것보다 작은 프로젝트를 각각 한 번씩 만들어 보는 것이 가장 빠르다.

---

# 12. 최종 결론

## npm

```text
장점

- Node.js 기본 패키지 매니저
- 사용자가 많고 자료가 많음
- 사용법이 익숙함
- 대부분의 프로젝트에서 충분히 사용 가능
```

## pnpm

```text
장점

- 디스크 사용 효율
- 패키지 재사용
- 빠른 설치 경험
- 엄격한 dependency 관리
- Workspace / Monorepo에 강점
```

하지만 현재 프로젝트에서는:

```text
이미 npm으로 생성
       ↓
정상 동작
       ↓
변경 필요 없음
```

따라서 최종 결정은 다음과 같다.

> **현재 쇼핑몰 프로젝트는 npm을 그대로 사용한다.**

pnpm을 추천한 이유는 npm이 부족해서가 아니라  
패키지 저장 방식, 의존성 관리, Workspace 등에서 좋은 장점이 있기 때문이다.

현재 프로젝트의 우선순위는 패키지 매니저 교체가 아니라  
작은 쇼핑몰부터 완성하면서 점진적으로 확장하는 것이다.

```text
npm 유지
   ↓
프로젝트 기반 완성
   ↓
상품
   ↓
장바구니
   ↓
주문
   ↓
점진적 확장
```

> **팁**  
> 좋은 도구를 고르는 것도 중요하지만, 이미 충분히 좋은 도구를 선택했다면 그 선택을 유지하고 실제 제품을 만드는 데 집중하는 것이 더 중요하다.
