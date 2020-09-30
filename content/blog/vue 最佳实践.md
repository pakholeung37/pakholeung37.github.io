---
title: vue 最佳实践
date: "2020-08-06 00:00:00"
description: ""
categories: ["最佳实践"]
comments: true
---

## 模板

### 采用

模板应当首选.vue + vue-loader 的组合, 可以提供最佳的代码 lint 体验, 其次在只能使用 inline template 下, 最好使用模板字符串, 其次才是字符串拼接, 一来模板字符串有比较好的阅读体验, 不会到处是+号, 二来, 面对特殊字符诸如<'>,<">等, 拼接的字符串需要转义, 三来, 大部分的 formatter 都对第二种格式支持不好, format 时会直接丢失原有格式, 不利于代码格式化

```js
// good:
template: `
    <div>
        <div>helloworld</div>
    </div>
`
// bad:
template: +"<div>" + "<div>" + "helloworld" + "</div>" + "</div>"
```

另有 template string in vue 插件, 最大化 inline template 体验, 前提是必须使用模板字符串

![img](assets/a0e78ce3-b974-a4ee-c51e-6bf8ac8719e8)

使用前

![img](assets/f53dbfcc-f47c-80bc-7508-9e2efcf3c931)

使用后

![img](assets/5e1673fe-a192-7e9f-a280-daa4285f25d7)

## watch

### 多个 watch 有同一个函数时, 宜采用 iife 即时创建

为避免编写大量重复代码, 应当使用即时函数

```javascript
//good:
watch: (function() {
    const watch = ['a', 'b', 'c'];
    return {
        ...watch.reduce((acc, cur) => ({
          ...acc,
          [key]: function() { //watch methods }
        }), {}),
        otherWatch: function() {}
    }
})(),

//bad:
watch: {
    a() { // same methods },
    b() { // same methods },
    c() { // same, methods }
    otherWatch: function() {}
}
```

## arrow function

如果情况允许, 请使用箭头函数, 而非 that, 另外需要注意在 vue 声明中, methods 是不能使用箭头函数的, 这点与 react 的常规操作不相同. 正常来说应当减少函数的变量的依赖, 若非必要, 不要冗余声明.

```js
// good:
methods: {
    functionA() {
        return () => this.functionB();
    },
    functionB() { // do sth }
}
// bad:
methods: {
    functionA() {
        const that = this;
        return function() { that.functionB() };
    }
}
```

## Vue proterty 顺序

遵循一定的 Property 能提高可读性, 也让团队在寻找相应的 property 更快, 排列更加 make sense. 应当遵循以下规则

[ "template", "inject", "props", "data", "computed", "watch", "methods", "`<life-ci>`" ], 这种排列的依据于：

1. template 排在头部, 与 vue 文件一致
2. 跟接着是外部属性
3. 再然后是内部属性和计算属性
4. 副作用的计算排在计算属性之后
5. methods 内部应当优先排列 dom 相关方法, 如 handleClick 等
6. 尽量使用 computed 属性, 减少使用 data

## 更高效的 v-bind

一个鲜为人知的 vue 技巧, 在 React 中有非常常用 spread props 的技巧, 可以直接解构一个对象映射进子组件的 props.

```html
// example.jsx <Item {{...props}}></Item>
```

在 vue 中其实也存在这样的技巧, 在[官方文档](https://cn.vuejs.org/v2/api/#v-bind)表述中, v-bind 可以绑定一个对象, 这个对象以结构的形式传进子组件

```html
<!-- 绑定一个全是 attribute 的对象 -->
<div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>
```

[https://github.com/vuejs/vue/issues/4962](https://github.com/vuejs/vue/issues/4962)

[https://cn.vuejs.org/v2/api/#v-bind](https://cn.vuejs.org/v2/api/#v-bind)

## propsData

一个使用 script 生成 vue 对象的技巧, vue component 是声明式的, 他不像 svelte 或 react, 文件即组件, 要初始化一个 vue 组件需要用到一些技巧

```js
// Component.vue
{
    props: ['prop1', 'prop2'],
    data: {
        // some data
    }
}
```

面对这样一个 vue 组件, 如要使用初始化, 则可以用到

```js
// root.js
import Com from "./Component.vue"

new Vue(Com)
```

这种方法可以生成一个 component 实例, 但是, 这个方法有些缺陷, 例如, 他只能生成一个实例, 这很违反直觉, 第二, 他不能把 props 传进去. 在这里, 就需要用 Vue.extend, 生成一个真正的 Vue 组件. 这个方法可以让组件在生成时, 通过 propsData 把 props 传进去.

```js
// root.js
import Com from "./Component.vue"
const Component = Vue.extend(Com) // 生成一个真正的Component组件
new Component({
  propsData: {
    props1: "abc",
    props2: "abcde",
  },
})
```

## computed watch 和 副作用

基本原则是不要在 computed 中编写有副作用的代码, 如果含有副作用, 请使用 watch 实现.

我们可以通过一个案例看看这个最佳实践解决了哪些问题

```vue
// index.vue

<template>
  <div v-for="item in b">
    <div @click="item.click"></div>
  </div>
</template>
<script>
const a = [
  { click() => console.log("hello world") },
  {}
]
export default {
    data() {
        a: a,
        text: "",
    }
    computed: {
        b() {
              const text = this.text;
              a.click || a.click = () => { console.log(text); }
              return this.a;
        }
    }
    mounted() { this.text = "hello world"; }
}
</script>
```

上述这个例子中, 可以看到, 从逻辑上看, 是希望点击 div 时, 如果 item 有自己实现的 click, 则使用自己实现的 click, 否则应当是打印出 text 最新的值. 但是事实上并非如此. 无论 text 怎么改变, 都打印出了"",

这是因为计算属性 b 一共计算了两次, 第一次时闭包中 text 为 "", 并且设置了 click, 第二次在 mounted 设置 text 后, 再一次触发 b 计算, 但是这次 click 已经被设置了, 所以没有执行.

这种含有副作用的计算属性往往结果很难预测, 如果出现问题, 很难去定位到问题到问题出现的地方. 所以正确的做法时怎么样? 正确来说, 不应当在 computed 中使用有副作用的代码. 例如这个例子中, 不应当设置 a.click 这个值, 你应当返回一个新的对象, 以保证每次 computed 的结果都是一样的.

```js
computed: {
    b() {
        const text = this.text;
        const result = a.forEach(item => result = {
            click() { console.log(text); },
            ...item
        })
        return result;
    }
}
```

## vue remote devtools

vue devtools 的 electron standalone 版本, 可以通过监听的方式进行. 不需要浏览器安装相关插件, 非常适合类似微信浏览器这种环境. 另外不要在 wsl 中安装, 需要图形界面, wsl 没有这玩意.

[vue-remote-devtools](https://github.com/vuejs/vue-devtools/blob/dev/packages/shell-electron/README.md)

唯一比较费解的是环境变量使用 NODE_ENV = development 致使 devtool 在项目的 console 中不断吐出 info. 需要用 console filter 来过滤.

## v-if 与 v-show 指令对生命周期的影响

先说 v-show，由于 v-show 指令是通过控制元素的 css 属性(display)从而实现显示和隐藏的效果，这也就说无论 v-show 是 true 还是 false,元素都会有初始渲染，且状态改变元素不会导致元素或组件的重新生成和销毁。

- 当 v-show 指令附属于普通元素时,v-show 指令状态变化不会影响父组件的生命周期。
- 当 v-show 指令附属于组件时，v-show 指令状态变化时，父组件和本身组件的生命周期都不会被影响。

v-if 就跟 v-show 不太一样了，因为 v-if 状态改变时，是真实进行相关的 dom 操作的(插入和删除)。

- 当 v-if 指令附属于普通元素时，v-if 指令状态变化会使得父组件的 dom 发生变化，父组件将会更新视图，所以会触发父组件的 beforeUpdate 和 updated 钩子函数。

- 当 v-if 指令令附属于组件时，v-if 指令状态变化对父组件的影响和上一条一致，但是对于本身组件的生命周期的影响是不一样的。

- 1. v-if 从 false 切换到 true 时，会触发 beforeCreate，created，beforeMount，mounted 钩子。 2.v-if 从 true 切换到 false 时，会触发 beforeDestroy 和 destroyed 钩子函数。

## 编程式组件

在正常的使用中, vue 推荐的方式都是通过 template 来编写渲染函数, 将各种组件的父子关系, 事件绑定在此阶段定义. 但是, 有时候不可避免需要脱离 template 的限制, 编程式地定义各类组件, 进行挂载, 销毁. 我目前遇到最多使用这种编程式组件的地方是 popup. 一般来说, popup 是使用 vitual dom 中比较尴尬的, 一方面, 你需要 popup mount 在根元素之上, 避免被其他元素覆盖, 遮挡或 css 污染( 最简单就是使用 overflow: hidden ), 而另一方面, 你又需要子组件和 popup 的通信能力. 这种场景你很难通过正常的事件系统来处理. 一种常被认为的最佳实践是使用 portal, 在 react 中拥有官方级别的组件, vue3 也将支持这样的组件. 另一种方法则是使用编程式组件, 动态地声明新的实例. 从而与当前组件( 甚至不一定是组件, 你可以在任何地方使用这种方法 )建立联系 .

### 提前使用\$mount 并随后挂载

这种方法有点违反知觉, 但是在[官方文档](https://cn.vuejs.org/v2/api/#vm-mount)中有所提及. 官方说明, 当不提供 element 而直接使用\$mount(), vue 内部会自行创建一个新的 element 并将此 vue 组件依附在其之上. 这种方法我通常使用在唯一组件上.

```js
let el = null
const popupInstance = new Vue.extend(Popup)({
  propsData: {
    show: false,
  },
}).$mount()
```

这样这个组件就完全实例化了, 并且是开始运作的. 进入到 update 周期. 然后你可以随意将该 el append 到任意元素.

```js
document.body.appendChild(popupInstance.$el)
```

用这种方法好处在于, 一, 该组件可以是全局唯一的, 节省资源. 二, 生命周期完全由你自己控制. 你完全可以在想要的时候直接销毁

```js
popupInstance.$destroy()
```

### props 响应式

之前谈到编程式组件的 props 初始化是传递 propsData, 但是如何改变 props 的值. 查阅了相关资料, 目前已知的一种可行方法, 是直接改变\$props

```js
popupInstance.$props.show = false
```

第一, 改变最初的 propsData 并不会有什么效果, 这一点我已经验证过了, 目前已知的方法只有这个.
