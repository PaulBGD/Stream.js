# Stream.js
500 byte library for Streams in JavaScript

## Download

[Development Version](src/stream.js) [Production Version](src/stream.prod.min.js)

## About

Stream.js is a library which adds Streams for Arrays. These Streams work in all browsers, even as far back as IE7\. They're incredibly fast, and can support a multitude of functions.

Along with this compatibility, it also supports the new ES6 arrow syntax. Prototypes can be passed to it as well.

## Examples

Streaming an unordered array of numbers into an array of just the even numbers, as strings with a decimal point:

```javascript
new Stream ([5, 2, 3, 0])
    .sort(function (o1, o2) { return o1 - o2 })
    .filter(function (o) { return o % 2 })
    .map(function (o) { return o + '.0' })
    .toArray();
// => ['0.0', '2.0']
```

Sorting an unordered array of strings into an array of them sorted alphabetically and lowercase

```javascript
new Stream(['Zebra', 'HoRse', 'Mammoth'])
    .map(String.prototype.toLowerCase)
    .sort(function(o1, o2) { return o1.charCodeAt(0) - o2.charCodeAt(0) })
    .toArray();
// -> ['horse', 'mammoth', 'zebra']
```

## Functions

### `new Stream(array) => Stream`

Returns a new Stream object with the elements of the array

### `Stream.prototype.toArray() => Array`

Converts the current Stream to an array. This does not modify the original array.

### `Stream.prototype.forEach(function (element:Object) => void) => void`

Iterates through all of the elements.

### `Stream.prototype.sum() => Number`

If all the objects in the Stream are numbers, then it will calculate the total sum.

### `Stream.prototype.count() => Number`

Returns the amount of objects currently in the stream.

### `Stream.prototype.findFirst() => Object`

Returns the first object it finds. It will return null if there are no objects in the stream.

### `Stream.prototype.map(function (element:Object) => Object) => void`

Accepts a Function which takes all of the elements, then returns new values for them.

### `Stream.prototype.filter(function (element:Object) => boolean) => void`

Accepts a Function which accepts all of the elements, then returns true if the element should stay.

### `Stream.prototype.sort(function (elementOne:Object, elementTwo:Object) => number) => void`

Accepts a function that sorts the stream. See Array.prototype.sort on what the array should be returning.

### `Stream.prototype.distinct() => void`

Uses == to check all of the elements and make sure they're distinct.

### `Stream.prototype.clone() => Stream`

Creates a new copy of the stream, with all transformers. This does not deepcopy the original array elements.
