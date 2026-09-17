# Day 17 復習問題 + 解答

> 範囲：Day 15 HTTP/API + Day 16 非同期JavaScript + Day 17
> `fetch()`、Mock API、React State接続
>
> 先に自分で答え、その後 `<details>` を開いて解答を確認する。

## 問題 1 --- localStorage vs API

localStorageベースの注文管理とHTTP
APIベースの注文管理の最大の違いは何か？

<details><summary>解答を見る</summary>

**解答:**
データの場所とアクセス方法が異なる。localStorageはBrowser内部のStorageへ直接アクセスするが、APIではNetwork経由でHTTP
Requestを送りResponseを受け取る。

</details>

---

## 問題 2 --- HTTP Request

Day 17で繰り返し確認したHTTP Requestの4つの主要要素は何か？

<details><summary>解答を見る</summary>

**解答:** Method、URL、Headers、Body。

</details>

---

## 問題 3 --- Methods

GET、POST、PATCH、DELETEを注文操作に対応させよ。

<details><summary>解答を見る</summary>

**解答:** GET＝取得、POST＝作成、PATCH＝部分更新、DELETE＝削除。

</details>

---

## 問題 4 --- Collection vs resource

`GET /orders`と`GET /orders/3`の違いを説明せよ。

<details><summary>解答を見る</summary>

**解答:**
`GET /orders`はCollectionを取得し通常`Order[]`を返す。`GET /orders/3`は個別Resourceを取得し、`Order`または404になり得る。

</details>

---

## 問題 5 --- API Contract

API ContractはURL一覧だけを意味するか？

<details><summary>解答を見る</summary>

**解答:** いいえ。Method、URL、Headers、Request Body、成功/失敗Status
Code、Response Bodyを含むRequest/Responseの約束である。

</details>

---

## 問題 6 --- fetch

`fetch()`はReactの機能か？

<details><summary>解答を見る</summary>

**解答:** いいえ。Browser環境で利用できるWeb APIである。

</details>

---

## 問題 7 --- Promise`<Response>`{=html}

`const result = fetch('/api/orders')`で`result`に注文配列が即座に入るか？

<details><summary>解答を見る</summary>

**解答:** いいえ。`result`は`Promise<Response>`である。

</details>

---

## 問題 8 --- Response

`const response = await fetch('/api/orders')`の`response`は注文データそのものか？

<details><summary>解答を見る</summary>

**解答:** いいえ。HTTP Responseを表す`Response`オブジェクトである。

</details>

---

## 問題 9 --- response.json

JSONのResponse BodyをJavaScript Dataとして読むコードを書け。

<details><summary>解答を見る</summary>

**解答:** `const data = await response.json();`

</details>

---

## 問題 10 --- two awaits

`await fetch(...)`と`await response.json()`で`await`が2回必要なのはなぜか？

<details><summary>解答を見る</summary>

**解答:**
Responseの到着と、そのBodyの読み取り・JSON解析という別々の非同期段階を待つため。

</details>

---

## 問題 11 --- 404 fetch

404なら必ずfetch Promiseがrejectされ`catch`へ行くか？

<details><summary>解答を見る</summary>

**解答:** いいえ。HTTP
Responseが到着すればfetchはResponseを返せる。`response.ok`を確認し必要ならthrowする。

</details>

---

## 問題 12 --- network vs HTTP

Network FailureとHTTP Failureの違いを説明せよ。

<details><summary>解答を見る</summary>

**解答:** Network
Failureは通信自体が失敗しfetchがrejectされ得る。404/500などのHTTP
FailureはResponse自体は届き`response.ok === false`となる。

</details>

---

## 問題 13 --- throw

`!response.ok`の後の`throw`は何をするか？

<details><summary>解答を見る</summary>

**解答:**
正常フローを中断し、`catch`で処理されるError/Rejectedフローへ移す。

</details>

---

## 問題 14 --- error flow

空欄を埋めよ：HTTP non-2xx → response.ok false → (A) → catch。

<details><summary>解答を見る</summary>

**解答:** `throw`。

</details>

---

## 問題 15 --- async return

`async`関数は常に何を返すか？

<details><summary>解答を見る</summary>

**解答:** Promise。

</details>

---

## 問題 16 --- async throw

async関数内で未処理の`throw`が起きるとPromiseはどの状態になるか？

<details><summary>解答を見る</summary>

**解答:** `rejected`。

</details>

---

## 問題 17 --- catch recovery

`catch`でErrorを処理し正常値をreturnした場合も必ずrejectedのままか？

<details><summary>解答を見る</summary>

**解答:** いいえ。正常値をreturnすればfulfilledへ回復できる。

</details>

---

## 問題 18 --- stringify

POST Bodyで`JSON.stringify(input)`を使う理由は？

<details><summary>解答を見る</summary>

**解答:** JavaScript ObjectをHTTP Request
Body用のJSON文字列へserializeするため。

</details>

---

## 問題 19 --- createdOrder

元のinputではなくServerが返した`createdOrder`を使う理由は？

<details><summary>解答を見る</summary>

**解答:** ServerがIDや作成日時などを決める場合があり、Request
BodyとResponse Bodyが同一とは限らないため。

</details>

---

## 問題 20 --- PATCH

PATCHでは注文全体を必ず再送する必要があるか？

<details><summary>解答を見る</summary>

**解答:** いいえ。Day
17では`{ status: newStatus }`のような部分変更に使用した。

</details>

---

## 問題 21 --- map

更新された注文だけをState内で置き換えるのに便利な配列Methodは？

<details><summary>解答を見る</summary>

**解答:** `map()`。

</details>

---

## 問題 22 --- filter

削除済み注文をStateから除外するのに便利な配列Methodは？

<details><summary>解答を見る</summary>

**解答:** `filter()`。

</details>

---

## 問題 23 --- 204

`204 No Content`後に`response.json()`を無条件で呼んではいけない理由は？

<details><summary>解答を見る</summary>

**解答:** 204は成功だがResponse Bodyがないため。

</details>

---

## 問題 24 --- State

Serverから注文配列を受け取ればReact UIは自動更新されるか？

<details><summary>解答を見る</summary>

**解答:**
いいえ。`setOrders(data)`などでStateへ反映し、Re-renderにつなげる。

</details>

---

## 問題 25 --- UI states

Server Data UIで確認した代表的な4状態は？

<details><summary>解答を見る</summary>

**解答:** Loading、Error、Empty、Data。

</details>

---

## 問題 26 --- Loading

Loading Stateが必要な理由は？

<details><summary>解答を見る</summary>

**解答:** HTTP
Requestには時間がかかるため、成功/失敗が決まるまでの通信中状態をUIで表す必要がある。

</details>

---

## 問題 27 --- effect async

`useEffect(async () => { ... })`を避ける理由は？

<details><summary>解答を見る</summary>

**解答:** async関数は常にPromiseを返す一方、Effect
callbackはcleanup関数または何も返さない形が期待されるため。

</details>

---

## 問題 28 --- cleanup

useEffect cleanupはunmount時だけ実行されるか？

<details><summary>解答を見る</summary>

**解答:**
いいえ。dependency変更でEffectが再実行される前にも実行される。開発時Strict
Modeでは追加setup/cleanupが見えることもある。

</details>

---

## 問題 29 --- Hook abstraction

useOrdersがComponent側のInterfaceを保ったままlocalStorageからHTTPへ変更できるのはなぜか？

<details><summary>解答を見る</summary>

**解答:** ComponentはHookが公開するState/Actionだけを利用し、内部Data
Sourceの実装詳細を知る必要がないため。

</details>

---

## 問題 30 --- duplicate Order

実プロジェクトで見つかった`Order` Typeの問題は？

<details><summary>解答を見る</summary>

**解答:**
重複した`Order`定義があり、一方は`items: CartItem[]`、もう一方は`items: OrderItem[]`で互換性がなかった。

</details>

---

## 問題 31 --- CartItem vs OrderItem

CartItemとOrderItemを自動的に同じTypeへ統合してはいけない理由は？

<details><summary>解答を見る</summary>

**解答:**
責任とライフサイクルが異なるため。CartItemは現在の商品参照と数量、OrderItemは注文時点の商品Snapshotを保持する。

</details>

---

## 問題 32 --- flow blanks

主要フローの空欄を埋めよ：AdminOrdersPage → useOrders → (A) →
Promise`<Response>`{=html} → ... → (B) → response.json() → Order Data →
(C) → React State。

<details><summary>解答を見る</summary>

**解答:** (A) `fetch()`、(B) `response.ok`確認、(C) `setOrders`。

</details>

---

## 問題 33 --- status flow

注文Statusを`배송완료`へ変更する全体フローを説明せよ。

<details><summary>解答を見る</summary>

**解答:** User操作 → `updateOrderStatus` → JSON statusをBodyにしたPATCH
`/orders/:id` → Mock API更新 → 200 + `updatedOrder` → `response.json()`
→ `setOrders(map)` → UI再描画。

</details>

---

## 問題 34 --- PATCH anatomy

PATCHのfetchコードをMethod / URL / Headers / Body / Promise /
Responseで説明せよ。

<details><summary>解答を見る</summary>

**解答:**
Method=PATCH、URL=`/api/orders/:id`、Headers=`Content-Type: application/json`、Body=JSON
status、fetchは`Promise<Response>`を返し、await後に`Response`を得る。

</details>

---

## 問題 35 --- one sentence

Day 17を一文で説明せよ。

<details><summary>解答を見る</summary>

**解答:** Day 17はDay 15のHTTP/APIとDay
16の非同期JavaScriptを`fetch()`でつなぎ、Request → API → Response → JSON
→ React State → UIの流れを理解した日。

</details>

---

## 問題 36 --- API Layer timing

`ordersApi` API Layerを実際のGET/PATCH実装後まで延期する理由は？

<details><summary>解答を見る</summary>

**解答:**
fetch/status/json/headers/body処理の重複やHook責任の混在という問題を先に体験し、その解決策としてAPI
Layerを導入するため。

</details>

---

# 自己評価

- **30〜36:** Day 17の中心フローがかなりつながっている。
- **22〜29:** 間違えた領域を選択的に復習する。
- **15〜21:** Promise / HTTP / React Stateの接続を再確認する。
- **0〜14:** Day 15 HTTP → Day 16 Promise → Day 17
  fetchの順に再接続する。

> **ヒント**
> 点数より、自分の言葉で説明できるかを重視する。`<details>`を開く前に声に出して説明してみる。
