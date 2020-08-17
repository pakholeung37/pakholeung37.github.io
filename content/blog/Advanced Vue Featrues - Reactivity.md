---
title: Advanced Vue Featrues - Reactivity
date: "2020-08-17 14:48:56"
description: ""
categories: [金风梨]
comments: true
---

本文是对FrontendMaster - Advanced Vue.js Features from the Ground Up第二章Reactivity总结。

本章旨在解释vue的响应式原理。

在vue文档中有这张图

![image](assets/1240-20200817211931708.png)

大概解析了vue的响应式原理，但是比较粗浅，在reactivity中，Evanyu深入解析了具体vue是怎么实现实例的响应式的。

首先，vue中用到了一个api Object.defineProperty 这个api无法向下兼容，导致vue在ie8及往下的版本都无法使用vue。

具体实现中，每个components实例都拥有自己的data，props或者是computed 或 watched，这些属性在实例化的时候都会经过一个observe函数进行转化。

```javascript
// 简单 observe
function observe (obj) {
  Object.keys(obj).forEach((key) => {
    let value = obj[key];
    Object.defineProperty(obj, key, {
      get () {
        return value;
      },

      set (newValue) {
        value = newValue;
      },

    })
  })
}
```

这是响应式的关键，通过重置变量的setter和getter，可以重置变量的值，指向，实现响应式。但是这还不够，这样并不能实现所谓了响应式。

例如在vue中

```javascript
data() {
  return {
    a: 1;
  }
},
computed() {
  b () { return a + 1; }
}
```

光凭借简单的observe，computed的值无法随着a的更新而更新，因为setter和getter暂时只影响当前值，没办法更新依赖它的值。

所以正确的思路应该是在getter中添加依赖，并且能在调用setter时找到该依赖，并更新依赖它的值。

为此，新增一个Dep class

```javascript
window.Dep = class Dep {

  constructor() {
    this.subscribers = new Set();
  }

  depend () {
    if (activeUpdate) {
      this.subscribers.add(activeUpdate);
    }
  }

  notify () {
    this.subscribers.forEach((subscriber) => {
      subscriber();
    })
  }
};

function observe(obj) {

  Object.keys(obj).forEach((key) => {
    let dep = new Dep();
    let value = obj[key];
    Object.defineProperty(obj, key, {
      get () {
        dep.depend();
        return value;
      },

      set (newValue) {
        value = newValue;
        dep.notify();
      },

    })
  })
}

let activeUpdate;

function autorun(update) {
  function wrapperUpdate() {
    activeUpdate = wrapperUpdate;
    update();
    activeUpdate = null;
  }

  wrapperUpdate();
}
```

至此，一个简单的响应式框架就做好了，这里重点关注getter依赖添加，activeUpdate和Dep是如何将update函数添加到订阅器上的。由于js的单线程，js每次只能运行一个函数，activeUpdate会在进行autorun时记录当前autorun的update。vue中update的代码会运行在autorun下。

```javascript
// example
const state = { count: 0 };

autorun(() => { console.log(state.count); });
```

调用autorun后在update内部使用了state.count，触发了依赖，当前update函数就会添加到subscribers上

给予一个简单的sample observer

从写一个更复杂的observe函数，使之可以很好的识别data

```javascript
function observe(obj) {
  if (obj.hasOwnProperty('data')) {
    const data = obj.data();
    Object.keys(data).forEach((key) => {
      let value = data[key];
      let dep = new Dep();
      Object.defineProperty(obj, key, {
        get() {
          dep.depend();
          return value;
        },

        set(newValue) {
          value = newValue;
          dep.notify();
        },
        enumerable: true
      })
    })
    delete obj.data;
  }

}
```

测试样例

```javascript
const state = {
  data() {
    return {
      a: 1
    }
  },
}

observe(state);
console.log(state);  // { a: [Getter/Setter] }
autorun(() => {
  console.log(state.a);
})

```

此代码第一次运行时返回1，是a，b的值，当state.a重新赋值时，update再次运行 返回3。这意味这当state被改变时，会触发update函数，如果在update中添加改变视图的方法，例如document.getElement(‘div‘).text = state.a; state的改变则会驱动视图变化，perfect。这就是vue的响应式原理。