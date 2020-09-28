---
title: js中的import和require
date: "2019-12-12 00:00:00"
description: ""
categories: [金风梨]
comments: true
---

因为经常需要使用 nodejs 和 es6 来写 JavaScript 代码，所以有必要总结一下 js 中 import 和 require 的用法和问题。

## require - exports

require 是早期 js 还有没有 module 的年代的产物，是模块解决方案 commonJs 的一部分。也是 node
JS 官方使用的，使用最多的模块方案。直到现在，nodejs 的稳定版本仍然在使用 commonJS，如果需要 import 则需要打开实验设置。

在 nodeJS 中，如果要引入某个模块，则有如下格式：

```js
const a = require("a")
const { a } = require("a")
const a = require("a").a
```

而他们对应的 exports 形式则可以如下：

```js
module.exports = a
----module.exports = { a }
----module.exports = { a }
```

## exports & module.exports

值得关注的是 commonJS 常用 exports 和 module.exports 两个变量，但是只有 module.exports 是真正映射出去的值，他们之间的关系形如：

```js
let exports = module.exports
```

exports 只是一个指向 module.exports 的变量。

形如

```js
exports = a // 使用module.exports = a;
exports = {} // 使用module.exports = {};
```

则不会被映射到包外。

## cjs 加载方式

模块采用运行时加载，优先读取缓存的模式。也就是说模块只会在第一次 require 进行加载，并对返回结果进行缓存。所以形如下列代码这样做都是可以的：

```js
const a = require('a');
...
const a2 = getA(require('a'));  // 在任何地方都可以进行require

exports.a = new A(); //模块返回一个new A(),但是多处require这个模块后，调用的是同一个对象。
```

## import - export

与 require，import 是 es6 的模块化方案，也就是正规军了，大部分浏览器原生支持 import 了。在大多数情况下推荐优先使用 import。

import 形式如下：

```js
import 'a';
import a1 as a from 'a';
import { a } from 'a';
import a from 'a';
```

而因为有 default 关键字的存在，他的 export 形式也更加多变

```js
1. any // 对于第一条可以export noting 或 everything
2.1 export default { a };
2.2 export a;
3.1 export default { a };
3.2 export a;
4 export default <anyname>; // 只需使用export default关键词， 其他没所谓
```

其中值得注意的是 3.1 的情况。

一般来说按照规范，export 一个对象，然后在 import 时解构赋值是完全 make sence 的，规范也允许你这样做。但是，由于目前大部分前端项目都使用 babel 和 webpack，在这种情况下将会导入失败，详细情况在[这篇文章](https://www.jianshu.com/p/ba6f582d5249)有提及到。

## esm 加载方式

和 commonJS 不同的是 import 使用的是静态编译。这样做有很多好处，例如可以运行前判断得出模块之间的依赖关系，进行代码检查。但是由于是静态编译，一些 require 动加载的奇技淫巧就无法使用了，

比如说

```js
if (xx) {
  require("a")
} else {
  require("b")
}
```

详细可以看一下[深入理解 ES6 模块机制](https://zhuanlan.zhihu.com/p/33843378)这篇文章。另外里面也谈到两个方案在处理循环依赖时的处理。

## webpack+babel 中具体表现

首先可以说的是，目前其实只有 commonJS，具体是 es6 的模块方案会被编译成 commonJS 的形式，所以其实没差。在项目中你可以看到 import 懒加载，也导致了有 export default {} 这样的 bug。所以目前来说不用太纠结这件事。但是在前端使用标准的模块语法是一个好习惯。
