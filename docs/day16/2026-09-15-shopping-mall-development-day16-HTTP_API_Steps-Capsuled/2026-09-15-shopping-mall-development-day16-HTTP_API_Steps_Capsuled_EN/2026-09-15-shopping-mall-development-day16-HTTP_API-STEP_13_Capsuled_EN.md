# Day 16 --- STEP 13. JSON

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

JSON stands for **JavaScript Object Notation**. It is a text-based
format widely used for representing and exchanging data.

A JavaScript object:

``` js
const order = {
  id: 10,
  status: "shipping",
};
```

JSON representation:

``` json
{
  "id": 10,
  "status": "shipping"
}
```

They look similar but are different concepts.

  -----------------------------------------------------------------------
  JavaScript Object                   JSON
  ----------------------------------- -----------------------------------
  Runtime data structure              Text-based representation

  Can contain functions               Functions are not JSON values

  Can contain `undefined`             `undefined` is not a JSON value

  Object-literal keys need not always JSON object keys use double-quoted
  be quoted                           strings
  -----------------------------------------------------------------------

### Serialization

``` js
JSON.stringify(order)
```

Conceptually:

``` text
JavaScript Value
↓
JSON.stringify()
↓
JSON Text
↓
HTTP Request Body
```

### Parsing

In the other direction:

``` text
JSON Text
↓
Parsing
↓
JavaScript Value
```

`JSON.parse()` is the familiar JavaScript operation. Parsing JSON does
not always produce an Object; JSON can represent arrays, strings,
numbers, booleans, and null as well.

HTTP Body is not synonymous with JSON:

``` text
HTTP Body
├─ JSON
├─ text
├─ HTML
├─ images/files
└─ other media types
```

**Tip:** Do not call every `{...}` value JSON. Ask whether you are
looking at a JavaScript runtime value or serialized JSON text.

## STEP 13 Key Sentence

JSON is a text-based data representation, not the same thing as a
JavaScript Object.
