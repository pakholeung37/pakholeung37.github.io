---
title: TypeScript：最佳实践
date: "2020-08-17 14:48:56"
description: ""
categories: [金风梨]
comments: true
---

## 类型保护
typescript中有三种正常的类型保护，包括自定义类型保护，typeof类型保护和instanceof类型保护。其中typeof只能用于javascript定义的六种基础类型，而instanceof只能用于当类型在要检查类型的原型链中。对于其他typescript中其他丰富的类型，typeof和instanceof都无能为力。

## 自定义类型保护
那么只剩下自定义保护能使用了，在官方文档中使用如下例子讲解自定义保护。

```typescript
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim !== undefined;
}
```


但是有很多问题。第一，它使用了违反直觉的类型断言，因为不断言，就访问不到属性.swim。第二，如果Fish没有特例属性，则无法将它和其他类型区分。考虑以下例子

```typescript
interface Cash{};
interface PayPal{ email: string; };
interface CreditCard{ cardNumber: string; securityCode: string };

type PaymentMethod = Cash | PayPal | CreditCard;

function StringifyPaymentMethod(menthod: PaymentMethod): string {};
```

函数要在内部区分各种支付方式，然后使用不同的处理方法。

在这里普通的类型保护就起不了作用了。

应用字面字符串类型，则可很好解决这个问题。

```typescript
interface Cash{ kind: 'Cash' };
interface PayPal{ kind: 'PayPal'; email: string; };
interface CreditCard{ kind: 'CreditCard'; cardNumber: string; securityCode: string };

type PaymentMethod = Cash | PayPal | CreditCard;

function StringifyPaymentMethod(menthod: PaymentMethod): string {
  switch(mentod){
    case 'Cash': ...
    case 'PayPal': ...
    case 'CreditCard': ...
  }
};
```

这里的好处有两点：一是不用再使用类型断言，二是不再依赖类型特定属性（其实说到底就是加了一个特例属性嘛）。但是即便是不使用类型断言，类型还是被保护了，在case ‘Cash’内部，Method则会被直接当做Cash类型。

依靠这种自定义的类型保护，可以更好的判断包括interface，泛型等非标准类型。

## 索引类型
使用索引类型，编译器就能够检查使用了动态属性名的代码

考虑以下例子：

```typescript
interface Type {
  a: number;
  b: string;
  c: string[];
}

function prop(obj: Type, key: 'a' | 'b' | 'c') {
  return obj[key];
}
```


可以预料到，function prop返回类型将是number | string | string[]，因为你无法预料输入参数是a，b，还是c，因为是动态的。但编译器知道只能是这三个值，所以返回值只能是number，string或string[]。

但这似乎不是我们想要的，我们希望编译器在编译的时候就知道将会返回值的类型。

typescript拥有关键字keyof，用以指代一个类型的所有key的值的集合。

在这个例子中可以将

```typescript
function prop(obj: Type, key: 'a' | 'b' | 'c')
```


改成

```typescript
function prop(obj: Type, key keyof Type)
```


cool, 但是状况似乎没什么变化。

这里就要引入到typescript中的索引类型。在typescript中指定索引T[K]，则会被解释成类型。例如这里

```typescript
function prop(obj: Type, key): Type[a] {}
```


则会被解析成number。利用这个特性，可以解决这个问题

```typescript
interface Type {
  a: number;
  b: string;
  c: string[];
}

function prop<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
```

在这个例子中，返回值会被隐式解释成T[K]，换言之，返回值直接与参数key和obj关联了，现在它可以正确指示返回值。

这种模式也被广泛应用于typescript的一些装饰性的类型，例如考虑以下例子：

```typescript
interface Point {
  x: number;
  y: number;
}

type ReadOnlyPoint = ReadOnly<Point>;

// ReadOnlyPoint {
//   readonly x: number;
//   readonly y: number;
// }
```

## ReadOnly的定义

```typescript
type ReadOnly<T> = {
  readonly [P keyof T]: T[P];
}
```


在这个例子中，利用了泛型ReadOnly装饰了接口Point，使之变成了一个只读的类型。这种模式也同样可以应用于nullable，optional等装饰性的类型上

```typescript
type Nullable<T> = {
  [P keyof T]: T[P] | null;
}

type Optional<T> = {
  [P keyof T]?: T[P];
}
```

甚至还可以形成装饰链

```typescript
type CustomPoint = ReadOnly<Nullable<Optional<Point>>>;

// CustomPoint {
//   readonly x?: number | null | undefined;
//   readonly y?: number | null | undefined;
// }
```

