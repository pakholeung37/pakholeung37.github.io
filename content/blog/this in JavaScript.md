---
title: this in JavaScript
date: "2019-12-12 00:00:00"
description: ""
categories: [金风梨]
comments: true
---

上次谈到执行环境的时候，也谈到了 this，说道 this 值实则与函数无关，而与上下文有关。再者，this 的值在创建上下文的时候就已经确定了，无法在 runtime 中改变，例如

```javascript
function A() {
  let a = b
  this = a
} // 这样当然不可以了，但是在python却可以
```

这篇文章将探讨创建上下文时，this 值将如何改变。

## 引用类型-ReferenceType

在这之前先看一下 JavaScript 內建类型的伪代码

```javascript
var valueOfReferenceType = {
  base: <base object>,
  propertyName: <property name>
};
```

引用类型的值只有两种情况：

当处理一个标识符时；

或处理一个属性访问器；

```javascript
// 标识符
var a
function a() {}

//属性访问器
var a = { b: 1 }
a.b //是一个引用类型，且是一个属性访问器，他的base是a
```

而对于关联的 this 值的改变，则只会和以下情况有关：

在一个函数上下文中，this 的值由调用者 caller 提供，且由调用函数的方式决定（即由函数如何调用决定）。

如果调用括号(…)的左边是引用类型的值，this 将设为这个引用类型值的 base 对象

在其他情况下（与引用类型不同的任何其它属性），this 的值都为 null。不过，实际不存在 this 的值为 null 的情况，因为当 this 的值为 null 的时候，其值会被隐式转换为全局对象。

可以看以下例子

```javascript
var foo = {
  bar: function () {
    alert(this)
  },
}

var bar = foo.bar
foo.bar() // Reference, OK => foo
bar() // Reference global

foo.bar() // Reference, OK => foo

;(foo.bar = foo.bar)() // global
;(false || foo.bar)() // global
;(foo.bar, foo.bar)() // global
;(function () {
  alert(this)
})() // global
```

第一种调用适用第一种情况，this 是由引用类型 foo.bar 调用，base 是 foo，所以 this 指向 foo。

第二种情况，this 由引用类型 foo.bar 调用，base 是 bar，this 指向 global

第三种情况则适用第二种情况，由左侧括号调用，而左值则是引用类型，base 为 foo。

第四种情况， 赋值运算符调用 getValue 方法，返回结果是函数对象，不是引用类型，则 this 设定为 global

第五种、第六种情况也一样，使用操作符调用了 getValue 方法，得到函数对象，同样设定为 global。

第七种情况可以看到左值为函数对象时是怎么作用的，同样设定为 global。

来看一件更酷的东西

```javascript
function foo() {
  alert(this)
}

foo() // global

alert(foo === foo.prototype.constructor) // true

// another form of the call expression

foo.prototype.constructor() // foo.prototype
```

这个例子充分印证 this 值在由不同引用句柄调用而发生的变化。

当直接调用的时候，引用类型的 base 为 global，自然 this 指向 global。

而当使用 foo.prototype.constructor 调用时，情况却发生了变化，由于句柄变成了 foo.prototype，所以自然 this 指向了 foo.prototype，也就是 foo 的原型对象。

## base 值的改变

之前的一些情况都是在父上下文是 global 上的一些情况，并没有探讨父上下文更复杂的情况。在有些时候，base 会被设置成激活对象（Activation Object）。

看以下这个例子。

```javascript
function foo() {
  function bar() {
    console.log(this) // global
  }
  bar() // the same as AO.bar()
}
```

这里引用类型 bar 调用了，内部函数 bar 被父函数 foo 调用，上下文的 base 则被设置成父上下文的
AO，AO 总是返回 this 的值为 null，而调用 bar(),相当于调用 AO.bar()则 null.bar()，this 指向 global。

看另一个例子

```javascript
var x = 10

with ({
  foo: function () {
    console.log(this.x)
  },
  x: 20,
}) {
  foo() // 20
}
```

使用 with 语句后，with 对象添加到 Scope chain 的前面，AO 前面插入 with 对象，此时 base 被指向到 with 对象了，foo 的 base 是 with 对象，this 指向 with 对象，this.x = 20。
