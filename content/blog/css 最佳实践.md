---
title: css 最佳实践
date: "2020-06-11 00:00:00"
description: ""
categories: []
comments: true
---

总结, 记录一直以来遇到的 CSS 问题, 和最佳实践.

## CSS 方案

### 纯 CSS

基本不会编写纯 CSS. 公司的架构是使用纯 CSS + post CSS + gulp 的组合, 比较落后. 在工作的经常会遇到命名重复, 样式覆盖等问题, 再加上使用和 bootstrap 类似的 css 框架, 样式覆盖更加严重. 感觉不会写代码了. 没办法清空样式. 命名不规范导致的样式污染问题也同样非常严重. 不会再爱了. 如果要写以 global tree 架构的 css, 建议还是直接上 scss + BEM

### SCSS + BEM

在前 react 项目 soundtrap 中使用过这种架构, 是以 styles 文件树组织的 global css tree 输出单一编译 css 文件的一种方案. 优点是可以减少样式污染的问题. 但是没办法从根本上解决这个问题. 毕竟 BEM 只是一种规范, 怎么用还是人决定的. 同样因为 global 属性防止不了写出有污染的代码. 另这种风格反人类, 经常可以写出非常长的 CSS selector, 只要嵌套的足够深. 输出的 css 和 dom 结构可读性尚可, 但是仍然避免不了冗长. 另此方案没有强绑组件和样式的关系, 反正也是想写哪就写哪. 同样看人, 在团队中使用不见得比纯 CSS 管用.

### react CSS Module & svelte

CSS Module 应该是目前所有框架主流解决方案. 强绑样式到组件上, 有效避免全局污染, 又可以按需加载, 实在是非常好的解决方案. dom 可读性方面略有欠缺. 在 react 上则可读性也是一般, 毕竟 react 本来就不绑定 CSS Module, CSS Module 方案都是第三方的方案.

在此方案上提几点实践建议:

1. 放弃 BEM, CSS Module 能很好解决 BEM 的问题, 不需要再使用 BEM 来构成复杂, 难以阅读, 冗长的 CSS Selecotor
2. 扁平化 scss, 过多的嵌套会让选择器非常长,难以阅读 也加大浏览器解析成本和 css 文件大小, 尽量只在使用 & 的情况下使用嵌套.
3. 项目文件和 css module 文件放在一起吧. 特别是 react 这种天生只有第三方方案的选手.

### Vue scoped CSS

早些年流行的 vue css 的解决方案, 通过向 vue component 中注入一个自定义的 attribute hash, 通过 attribute 选择器来实现 scope, 这种做法优点在于可以保持 html 结构和文档的简洁, 当然也造成一定的问题. attribute 选择器的优先级是很高的, 这会导致 css 侵入组件变得异常的困难. 同时 attribute 选择器在性能上也不如后代选择器. 所以新项目还是建议直接使用 CSS Module 来的实在.

### CSS in JS

被誉为前端未来的 css 方案, 注意 CSS in JS 和 CSS Module 有本质上的区别, CSS Module 是通过改写选择器的名称来实现 scoped 的概念, 生成的 CSS 依然是静态的, 而 CSS in JS 则是真正意义上的动态 CSS. 我试用过 styled-component, 实在蛋痛, 没用了. 当然也有不可比拟的优点, 动态样式, 按需引入, 可惜要花时间计算 css 样式, css 样式在没有 SSR 的情况下体验难以评估(毕竟 CSS 都是内嵌在 JS 中, 要等到关键 CSS 运行完才能加载完成), 感觉坑很多, 没看了.

## 技巧

### FlexBox trick

在使用 flexbox 时有一个非常常见的需求, 要求 flex 项目保持一定的间距, 但是最右的项目希望紧贴 container 的右侧. 通常的做法并不能满足这个要求

![img](assets/2929ad9e-c414-4c1f-ab82-68fa43aee023)

在上面这个例子中, 右侧边距为 child 右边距加上容器右边距, 没办法和左侧一致. 一个办法是, 将 child 的左右边距设置为一致, 但是这个行为违反直觉, 也会为左右边距变得更宽, 不是太合理. 另一种做法, 则可以给上层 container 设置一个和 child 右边距一致的负右边距, 让他在视觉上将这种效果抵消

![img](assets/fc74c98f-22cd-dba7-8a0e-03e0878c9f17)

上述例子中, container 设置负右边距, 使得在视觉上抵消了 child 的右边距.

## 最佳实践

### CSS Module 命名 使用

vue-loader 有箱即用的[CSS Module 支持](https://vue-loader.vuejs.org/zh/guide/css-modules.html#用法), 这会向 vue 组件中注入一个\$style 的变量. 在 react 中, 通常是直接 import \*.module.css 以支持 CSS Module,

```jsx
import "./another-stylesheet.css" // Import regular stylesheet
class Button extends Component {
  render() {
    // reference as a js object
    return <button className={styles.error}>Error Button</button>
  }
}
```

我看了很多的示例, 基本都是使用点号作为属性访问器, 一般建议使用"\_"作为单词分隔符. 但是我还是建议使用[]作为属性访问器.

1. 使用[]访问能支持 old-fashion 的 css 编写方式, 特别是"-"的使用.
2. 阅读性

![img](assets/7dca8732-4353-b2ff-03d6-d33f6183576d)![img](assets/906ec645-e77e-ae7f-e9e6-15ef9e5edd7b)

上图分别是在 vue 中使用 CSS Module 的点号和方括号的比较. 可以看到使用方括号有更好的阅读性, 更像原来 css 的写法.

在这基础上我建议使用尽可能短的 CSS Module 对象名, 例如上面我是用"s"代替冗长的"\$style", 这个可以在`<style module="s">`中这样设置. 这只是 computed 的一个语法糖, 但是可以大幅提可读性.

```jsx
export default {
  computed: {
    s() {
      return this.$style
    },
  },
}
```

### CSS Module 最佳侵入实践

在开发时有时候会有改变第三方组件的样式的需求, 如何可以在不影响其他地方的第三方组件样式改变独立样式就变得可以研究. 答案是使用 CSS Module 的[:global 特性](https://github.com/css-modules/css-modules#exceptions). 首先需要真正理解 CSS Module 只是通过改选择器的名称来形成 scope, global 特性则刚好相反, 他会形成不具有 scope 特性的 css 选择器.

```css
.special {
  :global(.internal-component-name) {
    display: none;
  }
}
```

上面是一个使用:global 影响第三方组件样式的例子, 首先通过一个 css module 选择器来包裹这个第三方组件, 形成 scope, 在 scope 内部再改变第三方组件的样式. 它最终会影响形如

```html
<div class="special-<css module hash>">
  <div class="interal-component-name"></div>
</div>
```

的组件, 而不会影响到原有的组件.

### 等比例自适应

利用 padding-bottom 的百分比属性是相对于宽度的特点, 将一个容器实现宽度自适应, 高度等比例的效果.

![img](assets/a61b9eda-4f8f-a568-c5c3-0ce50874785a)![img](assets/190b75c4-8ef1-4976-4fbe-5953daabaf37)

例如在上述案例中, 希望中心视频的比例是固定 1.78:1 的效果, 在原先的设定中, width 设定为 345, height 设定为 194, 但是由于宽度是可变的, 导致在宽度变化时, 视频容器的比例也变化了, 解决办法是使用 padding-top, 先将容器的比例固定, 同时需要设定 height = 0 来配合, 这部分高度被 padding-top 占据了

![img](assets/4908329e-248b-cc5c-78e5-6782cc5af727)

```css
video-wrapper {
  width: 100%;
  height: 0;
  padding-top: 56.18%; // 1: 1.78
}
```

![img](assets/c1b8841c-0083-f35b-6bbf-3fc1d7c5b846)

同时这部分高度是不属于子容器的高度的, 需要调整子容器 postion 为相对于父容器 absolute,

```css
video-wrapper {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 56.18%; // 1: 1.78
}

video {
  width: 100%;
  height: 100%;
  position: absolute;
}
```

[CSS 实现宽高等比例自适应矩形- 掘金](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwj3pore3PjpAhV0yIsBHYP5DmYQFjAAegQIBRAB&url=https%3A%2F%2Fjuejin.im%2Fpost%2F5b0784566fb9a07abd0e14ae&usg=AOvVaw1SO2l68MxeVcbLKOAasfQZ)

[css 中如何做到容器按比例缩放– AlloyTeam](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwj3pore3PjpAhV0yIsBHYP5DmYQFjADegQIBBAB&url=http%3A%2F%2Fwww.alloyteam.com%2F2015%2F05%2Fcss%E4%B8%AD%E5%A6%82%E4%BD%95%E5%81%9A%E5%88%B0%E5%AE%B9%E5%99%A8%E6%8C%89%E6%AF%94%E4%BE%8B%E7%BC%A9%E6%94%BE%2F&usg=AOvVaw1pMmgdUJCZgqKVsntPAEeB)
