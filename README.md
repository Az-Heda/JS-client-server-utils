## For node

- [Server-Side](#for-node)
	- [Installation](#install)
	- [Usage](#usage)
	- [Sleep function](#sleep-function)
	- [Download file from url](#download-function)
	- [WebServer](#webserver)
	- [MySurreal](#mysurreal)
- [Client-Side](#client)
	- [Installation](#installation)
	- [myStorage](#class-mystorage)
	- [Loader](#class-loader)
	- [Number.map](#numbermap)
	- [Number.getid](#numbergetid)
	- [String.encodeAscii](#stringencodeascii)
	- [String.decodeAscii](#stringdecodeascii)
	- [String.hashSeed](#stringhashseed)
	- [String.getid](#stringgetid)
	- [String.capitalize](#stringcapitalize)
	- [Array.copy](#arraycopy)
	- [Array.randomize](#arrayrandomize)
	- [Array.sortByList](#arraysortbylist)
	- [Object.copy](#objectcopy)
	- [Object.sort](#objectsort)
	- [Object.getList](#objectgetlist)


## Install
```console
npm install azhedautils
```
## Usage
```js
const azhedautils = require('azhedautils');
```

## Sleep function
```js
await azhedautils.sleep(1000);
```
This will stop the code for 1000ms (1 second)

## Download function
Download a file from a url
```js
await azhedautils.downloadFile(url, filename);
```
This function will download a file from a url and save it with a specific filename.

## WebServer
```js
const server = new azhedautils.WebServer({
	host: 'localhost',
  port: 7788
});
```
This function will start a webserver, the default command are limited.

## MySurreal
```js
// method 1:
const mysur = new azhedautils.MySurreal();
mysur.setUser('<your username>', '<your password>');
mysur.setNamespace('<namespace>');
mysur.setDatabase('<database>');

// method 2:
const mysur = new azhedautils.MySurreal({
  username: '<your username>',
  password: '<your password>',
  namespace: '<namespace>',
  database: '<database>',
  // You can also use custom host, port and path, these are the default for SurrealDB, you can ignore them if you want
  host: '127.0.0.1',
  port: 8000,
  path: 'rpc'
});


// Querys:
await mysur.query('...'); // Any surreal query
await mysur.create('person:toby', { name: 'Toby', age: 20 });
await mysur.insert('person', [{ name: 'Toby', age: 20 }, { name: 'Derek', age: 30 }])
await mysur.patch('person:toby', { age: 25 });
await mysur.delete('person:toby');
await mysur.live('person');
await mysur.kill('<surreal query uuid>');
await mysur.close();
```

# Client

## Installation:
```html
<script src="https://unpkg.com/azhedautils/dist/client.js"></script>
```

## Class myStorage
```js
const testValue = 123;
const testKey = 't-key';
const time = 1000 * 60 * 60; // 1 hour in milliseconds
```
Add value 123 to localStorage with 't-key' as key,
return true if the the value was set correctly, false or null otherwise
```js
myStorage.add(testKey, testValue);
```
Checks if there's that key saved in localStorage and return the value,
if the key was not found, that returns null
```js
myStorage.get(testKey);
```
If a value is saved in localStorage with that key, the value'll be removed,
return true if this was successful, false if there was some kind of problem
```js
myStorage.remove(testKey);
```
Clear all data saved in localStorage,
returns 0 if everything was cleared correctly
```js
myStorage.clear();
```
Same as myStorage.add(), but this time, the value has an expiry time.
```js
myStorage.localcookie.set(testKey, testValue, time);
```
This function'll try to read and the value with the given key saved in localStorage.
if the key was not found this'll return null.
if the expiry time was passed, the value will'be cleared and this'll return null.
```js
myStorage.localcookie.get(key);
```

## Class Loader:
```js
const theme = 'dark'; // or 'light'
const loader = new Loader(theme);
loader.append(); // -> Add the loader in the center of the window
loader.remove(); // -> Remove the loader
```

New properties (added with prototype):
## Number.map

This will convert the number from the first range of numbers to the second one
```js
const testNumber = 7;
console.log(testNumber.map(0, 10, 0, 100));
>>> 70
```

## Number.getid
```js
const myNumber = 123;

console.log(myNumber.getid());
>>> 3050889136
```

## String.encodeAscii
```js
const testString = 'Hello';

const asciiString = testString.encodeAscii();
console.log(asciiString);
>>> 72|101|108|108|111
```
## String.decodeAscii
```js
const testString = '72|101|108|108|111';
console.log(testString.decodeAscii());
>>> Hello

```
## String.hashSeed
```js
const testString = 'Hello';
console.log(testString.hashSeed());
>>> 4867314475583282
console.log(testString.hashSeed(1));
>>> 7386249923560166
console.log(testString.hashSeed(2));
>>> 715765420405280
```

## String.getid
```js
const myString = 'Hello';

console.log(myString.getid());
>>> 1987897324
```

## String.capitalize
```js
console.log('hello'.capitalize());
>>> Hello
console.log('Hello world'.capitalize());
>>> Hello world
```

## Array.copy 

Create a deepcopy of the array
```js
const myList = [1, 2, 3];

console.log(myList.copy());
>>> [1, 2, 3]
```

## Array.randomize

This function will return a copy of the array but every item has a new random index
```js
const arr = [1, 2, 3, 4, 5];
console.log(arr.randomize());
>>> [5, 3, 1, 4, 2]
console.log(arr.randomize());
>>> [5, 1, 3, 2, 4]
console.log(arr.randomize());
>>> [1, 4, 5, 2, 3]
console.log(arr.randomize());
>>> [1, 3, 5, 2, 4]
```

## Array.sortByList

This function will sort A-Z the array, and then put the given values at the start (in the same order)
```js
const arrayToSort = [
  'dog', 'cat', 'shark',
  'parrot', 'giraffe',
  'zebra', 'dolphin'
];
const newList = arrayToSort.sortByList(['zebra', 'dolphin']);
console.log(newList);
>>> ['zebra', 'dolphin', 'dog', 'cat', 'giraffe', 'parrot', 'shark']
```

## Object.copy

Create a deepcopy of the object
```js

const myObject = { x: 1, y: 2 };

console.log(myObject.copy());
>>> { x: 1, y: 2 }
```

## Object.sort:
```js
const obj = {
  i: 1,
  a: 2,
  z: 3,
  y: 4
};
console.log(obj.sort());
>>> { a: 2, i: 1 y: 4, z: 3 }
```

## Object.getList
```js
const obj = {
  x: 1,
  y: 2,
  z: 3
};

console.log(obj.getList());
>>> [ ['x', 'y', 'z'], [ 1 ,  2 ,  3 ] ]
```

## Dependencies
- [axios](https://axios-http.com/)
- [body-parser](https://github.com/expressjs/body-parser#readme)
- [colors](https://github.com/Marak/colors.js)
- [cors](https://github.com/expressjs/cors#readme)
- [express](http://expressjs.com/)
- [express-list-endpoints](https://github.com/AlbertoFdzM/express-list-endpoints)
- [fs-extra](https://github.com/jprichardson/node-fs-extra)
- [surrealdb.js](https://github.com/surrealdb/surrealdb.js)