---
title: "TypeScript: the diffcult part"
date: "2020-08-17 14:48:56"
description: ""
categories: [金风梨]
comments: true
---

TypeScript 作为 JavaScript 的超集，在 JavaScript 之上构建了一个弱类型强检查的系统，丰富了 JavaScript 的生态。类型系统可以说是 TypeScript 最有价值的部分，配合 vsCode，使用 TypeScript 可以让团队的代码从奔放自如走向克制统一。

在 TypeScript 中，难点应该是在文档高级类型，类型兼容和类型推论的部分。

其实对于 TypeScript 的类型，用集合来理解会更容易些。

## 基础类型

TypeScript 中有由 JavaScript 来的六种类型，包括：

- number

- boolean

- string

- symbol

- null

- undefined

以上类型在 strict 模式下都是不兼容的，也就是说以下语句将会报错

```typescript
const a: number
a = undefined // error
a = null // error
a = 42 // cool
```

使用 strict 模式可以有效避开一些 null / undefined 的低级错误。建议开启。在非 strict 下，null、undefined 是所有类型的子集。能赋给所有类型。

## 空类型

- TypeScript 定义了两个空类型
- void

- never

一般使用场景下，void 指示函数不返回值

function (a,b): void {return ;} //函数不返回值
never 表示的是那些永不存在的值的类型，属于空集，意味着 never 能赋给所有类型，但反过来却不行。

nerver 的应用场景很多，例如指示一个函数不终结。

```typescript
function (): never {
  while (true) {

  }
}
```

断言无法到达的地方

```typescript
function assertNever(value: any): never {
  throw new Error(`unexpected value '${value}'`)
}
```

// 通过 assertNever 可以检查 switch 是否覆盖所有值

```typescript
function main(a: ‘red’ | ‘orange’ | ‘yellow’ | ‘black’ ) {
  switch(a)
    case 'red':
      ...
    case 'yellow':
      ...
    case 'orange':
      ...
    default:
      assertNever(a);
}
```

## 全类型

TypeScript 提供全类型关键字 any，任何类型都是 any 的子集，意味着任何类型都能赋给 any。

## 对象类型

object 表示非原始类型，也就是除 number，string，boolean，symbol，null 或 undefined 之外的类型。

object 类型在类似 Obejct.create 中定义更多，实际上更多使用隐式定义

```typescript
a: {
  b: string,
  c: number,
} // 定义一个对象，这个对象必须包含一个string和一个number
```

## 接口

接口是 TypeScript 非常重要的概念，接口是描述外形的工具，TypeScript 的接口几乎可以描述所有复杂结构

```typescript
// 描述一个函数
interface a {
  (a: string) => void;
}

// 描述一个类
interface a {
  a: string;
  geta: () => string;
}

// 描述一个字典
```

## 类类型

TypeScript 的 class 兼容 es6 class，另外还定义了 public，private，static，protect，abstract 关键词，基本与普通 OOP 一样。

## 函数类型

TypeScript 为函数类型提供了一个重载的功能，它可以为你的函数提供多个适配的类型，但是函数本身并不重载。

```typescript
function a(a1: string): void;
function a(a1: number): void;
function a(a1: string): string {
  ...// 你必须在这里做类型判断。三个重载都会调用同一个函数。
}
```

## 泛型

你可以在所有的复杂类型上使用泛型（即除了基础类型以外，因为这些类型都定死了）。

普通的泛型并不经常使用，更多时候会使用到泛型约束。

例如以下例子

```typescript
class A<T> {
  t: T
  getTlength() {
    return t.length // error
  }
}
```

普通的泛型没有约束，依据类型推论，T 会退化成 any，严格的 TypeScript 不允许使用定义类型超越它的内涵。这里 any.length 是非法的。

使用泛型约束

```typescript
interface LengthWise {
  length: number
}
class A<T extends LengthWise> {
  t: T
  getTlength() {
    return t.length // 现在可以访问而.length属性
  }
}
```

## 高级类型

## 交叉类型

交叉类型是将多个类型合并为一个类型，交叉类型必须拥有全部的属性。相当于交集。

```typescript
interface A {
  a: string
}
interface B {
  b: string
}

interface C {
  c: A & B
} // c

const test: C = {
  c: {
    a: "haha",
    b: "??",
  },
}
```

### 联合类型

联合类型常用地方更多，表示一个类型可以是多个类型之一，相当于并集。例如一个函数希望接受 number 或 string。

```typescript
function a(a: string | number) {}
```

类型退化与类型进化
首先给出集合中外延和内涵的大概定义，以帮助更好理解接下来的文段。

对于一个集合而言，外延是一个类型适用的所有值的集合，内涵则是指这个集合共有的特性。

在一些领域，内涵和外延是有域的，如对个体域为：{1，2，5，4，6，9，12}则偶数的外延是集合{2，4，6，12}，内涵就是什么是偶数—— 一个数能被 2 整除。

更具体地说，外延则是指类型所指代所有值的集合，内涵则是指类型共有的属性。

很重要的一个推论就是：当一个外延越来越小的时候，它的内涵就越丰富。

在 TypeScript，类型的定义是很严格的，当一个变量被确定了类型，则不能使用超过这个类型内涵的内涵。但是有一个类型例外，那就是 any，any 接受一切内涵而不会报错，而不是直觉上的所有内涵都报错（因为它的外延最大，除了值外，似乎没有什么属性是所有类型的外延共有的）。归根到底是因为 native script 对于 TypeScript 而然是一个无类型系统，所有没有推论的类型都属于 any，总不能满屏幕都是错误吧。所以为了兼容 JavaScript，TypeScript 的 any 接受任何内涵。当然最好的方法是不使用 any 了。

这里也给出这里使用类型退化和类型进化的意义：当一个类型的内涵更丰富，我们说这个类型进化了。反之则说这个类型退化了。例如：

```typescript
function A(a: Array<number> | number) {
  console.log((a as Array<number>).length)
}
```

这里使用一种名叫类型断言的机制使类型进化了，结果是，他的内涵丰富了，让他可以使用.length 属性。

了解这两个关键字可以有效帮助我们进行类型判断，包括类型兼容和类型保护的一些难点。

## 类型兼容

TypeScript 没有真正的类型，它遵循“鸭子”编程的规范。则当一个类型像鸭子，能像鸭子一样叫，一样走，那它就能当做一只鸭子。例如：

```typescript
interface Duck {
  fly: () => void;
  weight: number;
}

interface LikeDuck {
  fly: () => void;
  weight: number;
  height: number;
}

const b: LikeDuck = {
  fly() {},
  weight: 10,
  height: 10,
};

const a: Duck = b;
```

简单来说，只要声明的类型的外延，不超过既定定义的类型的外延，都是可以的。也就是说 TypeScript 只关注集合本身，而不在乎你声明的类型是什么。一个更小的外延可以赋值包含它外延的类型。

而在函数类型的兼容方面则会更宽容些，TypeScript 定义了，只要一个函数的前缀参数表和返回值匹配另一个函数的参数表和返回值，则新函数可以赋值给就函数。例如

```typescript
let x = (a: number) => 0
let y = (b: number, s: string) => 0

y = x // OK
x = y // Error
```

类类型方面则不比较构造函数和静态部分，当包含私有成员和受保护成员，情况又会不一样，具体可以看文档。

## 类型进化-类型保护

使用类型保护来丰富内涵，有时候是一种必要手段。而且也很常见。这部分完全可以看文档，总的来说，在类型保护上，可以使用的手段有

## 自定义保护

typeof 保护-适用于基础类型

instanceof 保护-适用于对象类型

类型断言-使用 as 语法或！语法去除 null 与 undefined
