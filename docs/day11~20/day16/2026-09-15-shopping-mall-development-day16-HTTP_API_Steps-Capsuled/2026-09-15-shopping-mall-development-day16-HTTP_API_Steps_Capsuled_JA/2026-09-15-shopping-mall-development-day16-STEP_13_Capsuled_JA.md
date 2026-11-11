# Day 16 --- STEP 13. JSON

## この STEP の目標

JSON と JavaScript Object を区別し、ネットワーク通信で JSON
がどのような役割を持つか理解する。

## JSON とは？

JSON は **JavaScript Object Notation**
の略で、データを表現・交換するためのテキスト形式である。

JavaScript Object：

``` js
const order = {
  id: 10,
  status: "shipping",
};
```

JSON：

``` json
{
  "id": 10,
  "status": "shipping"
}
```

見た目は似ているが同じものではない。

## 比較

  -----------------------------------------------------------------------
  JavaScript Object                   JSON
  ----------------------------------- -----------------------------------
  JS runtime のデータ構造             テキストベースの表現形式

  function を持てる                   function は JSON 値ではない

  `undefined` を扱える                `undefined` は JSON 値ではない

  Object literal の key               Object key は二重引用符の文字列
  は常に引用符必須ではない            
  -----------------------------------------------------------------------

## Serialization

``` js
JSON.stringify(order)
```

概念：

``` text
JavaScript Value
↓
JSON.stringify()
↓
JSON Text
↓
HTTP Request Body
```

## Parsing

逆方向：

``` text
JSON Text
↓
Parsing
↓
JavaScript Value
```

JavaScript では `JSON.parse()` が代表的である。

JSON は Object だけではなく Array、string、number、boolean、null
も表現できる。

## HTTP Body と JSON

``` text
HTTP Body
├─ JSON
├─ text
├─ HTML
├─ image/file
└─ その他
```

したがって：

``` text
Body ≠ JSON
HTTP ≠ JSON
```

**ヒント**

`{...}` を見ただけで JSON と呼ばないこと。今扱っているものが JS runtime
の値なのか、JSON Text なのかを確認しよう。

## STEP 13 の重要ポイント

> JSON は JavaScript Object
> そのものではなく、データ交換に利用できるテキストベースの表現形式である。
