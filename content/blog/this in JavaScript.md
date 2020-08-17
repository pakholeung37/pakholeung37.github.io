---
title: this in JavaScript
date: "2020-08-17 14:48:56"
description: ""
categories: [金风梨]
comments: true

---

上次谈到执行环境的时候，也谈到了this，说道this值实则与函数无关，而与上下文有关。再者，this的值在创建上下文的时候就已经确定了，无法在runtime中改变，例如

```javascript
function A() { let a = b; this = a; }// 这样当然不可以了，但是在python却可以
```


这篇文章将探讨创建上下文时，this值将如何改变。

## 引用类型-ReferenceType
在这之前先看一下JavaScript內建类型的伪代码

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
var a;
function a() {};

//属性访问器
var a = { b: 1 };
a.b //是一个引用类型，且是一个属性访问器，他的base是a
```


而对于关联的this值的改变，则只会和以下情况有关：

在一个函数上下文中，this的值由调用者caller提供，且由调用函数的方式决定（即由函数如何调用决定）。

如果调用括号(…)的左边是引用类型的值，this将设为这个引用类型值的base对象

在其他情况下（与引用类型不同的任何其它属性），this的值都为null。不过，实际不存在this的值为null的情况，因为当this的值为null的时候，其值会被隐式转换为全局对象。

可以看以下例子

```javascript
var foo = {
  bar: function () {
    alert(this);
  }
};

var bar = foo.bar;
foo.bar(); // Reference, OK => foo
bar(); // Reference global

(foo.bar)(); // Reference, OK => foo

(foo.bar = foo.bar)(); // global
(false || foo.bar)(); // global
(foo.bar, foo.bar)(); // global
(function(){ alert(this); })() // global
```


第一种调用适用第一种情况，this是由引用类型foo.bar调用，base是foo，所以this指向foo。

第二种情况，this由引用类型foo.bar调用，base是bar，this指向global

第三种情况则适用第二种情况，由左侧括号调用，而左值则是引用类型，base为foo。

第四种情况， 赋值运算符调用getValue方法，返回结果是函数对象，不是引用类型，则this设定为global

第五种、第六种情况也一样，使用操作符调用了getValue方法，得到函数对象，同样设定为global。

第七种情况可以看到左值为函数对象时是怎么作用的，同样设定为global。

来看一件更酷的东西

```javascript
function foo() {
  alert(this);
}

foo(); // global

alert(foo === foo.prototype.constructor); // true

// another form of the call expression

foo.prototype.constructor(); // foo.prototype
```


这个例子充分印证this值在由不同引用句柄调用而发生的变化。

当直接调用的时候，引用类型的base为global，自然this指向global。

而当使用foo.prototype.constructor调用时，情况却发生了变化，由于句柄变成了foo.prototype，所以自然this指向了foo.prototype，也就是foo的原型对象。

## base值的改变
之前的一些情况都是在父上下文是global上的一些情况，并没有探讨父上下文更复杂的情况。在有些时候，base会被设置成激活对象（Activation Object）。

看以下这个例子。

```javascript
function foo() {
  function bar() {
    console.log(this); // global
  }
  bar(); // the same as AO.bar()
}
```


这里引用类型bar调用了，内部函数bar被父函数foo调用，上下文的base则被设置成父上下文的
AO，AO总是返回this的值为null，而调用bar(),相当于调用AO.bar()则null.bar()，this指向global。

看另一个例子

```javascript
var x = 10;

with ({ 
  foo: function () {
    console.log(this.x);
  },
  x: 20 
}) {
  foo(); // 20
 }
```


使用with语句后，with对象添加到Scope chain的前面，AO前面插入with对象，此时base被指向到with对象了，foo的base是with对象，this指向with对象，this.x = 20。