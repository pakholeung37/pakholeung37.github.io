---
title: 提供统一DX的uniapp工程构建/迁移
date: "2020-07-01 00:00:00"
description: ""
categories: []
comments: true
---

### HBuilderX 项目迁移

1. 将 uniapp-boilerplate 克隆到你的机器上
2. 将原本使用 HBuilderX 生成的项目的根目录下的文件全部复制到 src 下
3. 将原项目根目录下的 package.json, 合并到新项目的根目录下的 package.json
4. 打开 vscode 或其他可用编辑器, npm/yarn 安装依赖, 安装 eslint, prettier, editorconfig, vetur 插件
5. 开始愉快编程

### 小程序开发(微信小程序为例)

1. 使用 vscode 或其他可用编辑器打开可用的基于 uniapp-boilerplate 项目
2. 命令行进入到项目目录下, 输入命令 npm run dev:mp-weixin
3. 打开微信开发者工具, 将项目下 dist/wp-weixin 目录导入到开发者工具
4. 开始愉快编程

### H5 端开发

1. 使用 vscode 或其他可用编辑器打开可用的基于 uniapp-boilerplate 项目
2. 使用代理或其他方式解决跨域问题, 下面内容有涉及
3. 命令行进入到项目目录下, 输入命令 npm run dev:h5
4. 打开微信开发工具, 调整到公众号网页开发(使用微信开发工具是因为未来项目里可能引入微信 h5 端特有的 api 和 SDK, 普通浏览器打开可能会报错)
5. 输入域名 localhost:8080(或你自己配置的端口)
6. 开始愉快编程

### 我还是想使用 HBuilderX

1. 将基于 uniapp-boilerplate 项目下的.editorconfig, package.json, vue.config.js 复制到 src 内
2. 将 src 作为项目根目录导入到 HBuilderX
3. 开始和原来一摸一样的编程体验, 你将得到: 统一的缩进和换行符, 你将失去, 统一的 lint 和格式化, 命令行调用.

## changelog

2020 06 17
添加 eslint rules

```json
    "no-extra-boolean-cast": "off",    // 允许使用!!转换
    "prettier/prettier": "off",        // 暂时::  暂停使用eslint-prettier, 因为团队中有使用tab进行换行, 而配置是space, 观感很不好
    "vue/no-use-v-if-with-v-for": "warn",  // 项目中大量v-if v-for 混用, 这部分从error等级降到warn
    "vue/no-unused-components": "warn",    // 暂时:: 项目中大量未使用的component声明, 从error等级降到warn
    "no-self-assign": "warn",             // 暂时:: 项目中有少量自赋值的操作, 原因不明, 从error等级降到warn
    "vue/no-parsing-error": [2, { "x-invalid-end-tag": false }]  // 允许使用end tag<input></input> 代替 单标签<input />
```

添加.eslintignore, 将不对这部分文件夹进行 lint 操作

```text
src/libs/
src/components/jyf-parser/
```

2020 06 16
添加了两个依赖分析脚本

```bash
analyz:mp-weixin   // 对mp-weixin项目进行依赖分析
analyz:h5          // 对h5项目进行依赖分析
```

## 目的

本次工程的构建目的主要有:

1. 确定代码规范, 并贯彻执行, 关于规范代码的好处已是老生常谈, 不再多谈.
2. 利用 eslint 标记老项目重构后存在的潜在 bug.
3. 提高项目自由度和可定制性.

## 详述

首先, 根据官方 quick-start 阐述, 工程的开始方式有两种, 一种 ① 是搭配 HBuilderX 进行工程创建, 工程目录如下

```bash
┌─components            uni-app组件目录
│  └─comp-a.vue         可复用的a组件
├─pages                 业务页面文件存放的目录
│  ├─index
│  │  └─index.vue       index页面
│  └─list
│     └─list.vue        list页面
├─static                存放应用引用静态资源（如图片、视频等）的目录，注意：静态资源只能存放于此
├─wxcomponents          存放小程序组件的目录，详见
├─main.js               Vue初始化入口文件
├─App.vue               应用配置，用来配置App全局样式以及监听 应用生命周期
├─manifest.json         配置应用名称、appid、logo、版本等打包信息，详见
├─package.json          配置uniapp
└─pages.json            配置页面路由、导航条、选项卡等页面类信息，详见
```

另一种方式 ② 是通过 `vue create` 模板创建, 创建的目录如下

```bash
┌── node_modules
├── public
│   └── index.html
├── src                     项目代码
│   ├── app.css
│   ├── App.vue
│   ├── components
│   ├── ext.json
│   ├── main.js
│   ├── manifest.json
│   ├── pages
│   ├── pages.json
├── tsconfig.json           typescript配置文件, 保留
├── postcss.config.js       postCSS配置文件
├── prettier.config.js      prettier配置文件
├── .eslintrc.js            eslint配置文件
├── .editorconfig           editorconfig配置文件
├── vue.config.js           vue-cli支持的额外配置文件
├── package.json
└── yarn.lock
```

可以看到, 其实使用 cli 生成的项目的 src 和使用 HBuilderX 生成的项目是基本一致的. 他们的差异优势和缺点主要集中在以下几个地方

### 1. ① 工程只能通过 HBuilderX 的界面来调用构建操作, 而 ② 工程可以直接调用命令行构建, 也可以使用 HBuilderX 来构建

这个问题出现在项目的构建和 HB 的构建思想上, HB 为了控制生态和降低 Node 包大小考虑, 直接将构建部分的依赖放到了 HbuilderX 的文件夹内部, 而不是在项目下. 这其实有点违反前端构建的直觉. 其实你会发现, HB 中的安装插件, 其实插件都安装到了 HBuilderX/plugins/这个目录下, 在构建的时候, 直接将一个项目路径赋值到一个 node 环境变量, 然后再进行构建. 等于直接把 node_modules 和项目分开存放, 等构建时再链接在一起.
这个构建思维直接导致了, HB 控制了内部插件的版本, 配置. 所用插件等. 你没什么办法再去添加依赖. 而且, 可定制化非常差.
例如, 你不想使用 HB 使用的格式化插件 js-beautify, 而想只使用 prettier, 官方会告诉你不行, 在 HB 中, 只有.vue 文件会使用安装的 prettier 来进行格式化, 其他都用 beautify. 尽管 beautify 已经几近淘汰.
这也导致了 ① 工程一旦脱离 HB, 就没有任何办法构建, 而 ② 工程, 只需要将 src 文件中部分文件补全, 就可以使用 HB 来构建.

### 2. 统一团队格式化代码和 eslint 上, ① 工程显然不是很够看

得益于 HB 的负优化, 在 HB 中使用 eslint 和 prettier 将会面临双设置(插件全局设置和目录下设置), 但是没有任何证据表明, 在目录下设置.eslintrc.js 和 prettier.config.js 会覆盖全局设置并能起到任何效果, 而且本身编辑器不是很支持 eslint 显示. 和 vscode 相比差的实在太远.

### 3. ① 工程定制化差

在构建 H5 的时候, 我发现入口文件 index.html 并非绑定到项目中, 而是隐藏在 plugins/uniapp-cli/内, 很明显, 这个文件所有项目都会引用到, 这也导致你没什么办法去改这里面的代码. 当然可以在项目 manifest 的 h5 属性有一个 template 属性.可以定义 h5 的入口, 但是, 依赖配置文件的工程, 定制性肯定是大打折扣. 例如 h5 下还有一个 devServer 属性用来配置 webpack 的 devServer 属性, 但是 webpack 配置用 json 来配置肯定是不行的, 虽然后来官方开放 vue.config.js 这个文件用来定制 webpack, 只能说这样改法, 哪天要加个配置, 还要先等官方改吗. 当然是自己动手, 丰衣足食.

### 4. HB 有广告

虽然官方文档对 HB 一顿狂吹, 虽然要感激 DCloud 做出 uniapp, 但是仍抵不住铺天盖地的广告. 我曾设想只用 HB 来作为一个有视窗的脚本触发器. 但是 HB 的 console 一是有广告, 二是 console 中貌似只保留了自己的日志. 转到 cli 后, 日志比较正常, 而且日志等级可以设定.

综上所述, 我个人是比较倾向于使用 vue-cli 的方式来进行, 为此, 我创建了 uniapp-boilerplate 样板工程.
首先这个样板工程是基于 dcloudio/uni-preset-vue 生成的样板来设置的, 在设置中, 进行了以下定制:

1. 缩进, end-of-line, 编码格式 使用.editorconfig 进行设置, 不再在 prettier 进行冗余设置. 这部分规则是强制执行的, 目的也是为了规范这部分编码行为, 在过去经验中, 缩进和换行的统一能有效减少因为格式化导致的多余 commit 的问题, 具体如下

```yaml
// .editorconfig
root = true
# 指定作用文件格式
[*]
# 缩进的类型 [space | tab]
indent_style = space
# 缩进的大小
# tab_width: 设置整数用于指定替代tab的列数。默认值就是indent_size的值，一般无需指定。
indent_size = 2
# 定义换行符 [lf | cr | crlf]
end_of_line = lf
# 编码格式。支持latin1、utf-8、utf-8-bom、utf-16be和utf-16le，不建议使用uft-8-bom。
charset = utf-8
# 是否除去换行行首的任意空白字符
trim_trailing_whitespace = true
# 文件是否以一个空白行结尾 [true | false]
insert_final_newline = true
```

2. 统一使用 prettier 进行格式化, 不再提供其他格式化工具. 我个人依赖 prettier 是因为我习惯代码拿到手直接格式化, 但是有部分人可能不是太喜欢这种操作, 所以在格式化方面是尽量做到克制, 但是引号分号这种还是有必要统一. 而且有部分设定是为了覆盖编辑器原本的设置, 这样做可以保证每个人格式化后的代码都是一致的.

```javascript
module.exports = {
  semi: true, //末尾分号
  singleQuote: false, //使用双引号代替单引号
  printWidth: 80, //最长行宽
  trailingComma: "es5", //未随逗号
  arrowParens: "always", //箭头函数强制使用括号
}
```

3. eslint, 规则则是尽可能地做到克制, 只会在适当的地方做提示, 并调和和 uniapp 冲突的地方

```javascript
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // 条件编译下可能导致unreachable
    "no-unreachable": "off",
    // 没用的变量在编辑器本来就会有提示, 在这里不再做这种提示
    "no-unused-vars": "off",
  },
  globals: {
    // 在uniapp中有定义的顶级变量, 需要在这里做出声明
    uni: "readonly",
    wx: "readonly",
    swan: "readonly",
    getApp: "readonly",
    getCurrentPages: "readonly",
  },
}
```

在实际使用中, eslint 会在几个关键的地方做出提示.

1.  不符合 prettier 规则, 包括使用错误的缩进和错误的换行. 显示 warning
2.  可能造成编译错误或运行时错误的代码. 显示 error

其他地方则不再做出任何提示. 比较契合富有经验的前端团队, 如果对自己的代码规范有所顾虑, 可以替换成更高的 lint 规范. 另外需要注意的是, 在 vue.config.js 的配置中, lintOnSave 是默认关闭的. 即不会在编译阶段使用 lint. 我个人觉得 lint 有编辑器的提示已经足够的, 新项目可能还好, 在面对可能有成吨不符合规范的代码的老项目, 在编译阶段进行 lint 只会让团队显得尴尬.

4. 如果想使用 HB 来开发, 你还需要作如下处理: 复制 vue.config.js, .editorconfig, package.json 到 src 目录下, 导入项目时使用 src 作为项目根目录进行导入. 这样就可以在 HB 中进行开发, 但是同时你将失去: 统一的格式化方案, 统一的 lint 方案, 你可能和团队其他人使用不同的代码规范, 望知晓.

5. 内置 scss.

## 最佳实践

众所周知, vscode 是世界上最好的编辑器, 以下实践部分将只在 vscode 中进行演示.
这份样板拉下来之后, 如果不对编辑器进行一些配置, 其实是没办法发挥他的作用的, 代码 clone 下来, 首先要做的操作当然是直接 npm/yarn. 然后你需要安装下列这部分插件, 以达到对应的支持和效果. 这部分必要的插件是

1. Prettier 格式化代码必须
2. EditorConfig for VsCode 对.editorconfig 支持必须
3. ESLint 编辑器提示必须
4. Vetur vue 开发必须

一般来说, 拿到一份代码, 如果你是这份代码的主要负责人, 你是有责任维护这份代码的, 所以请你毫不犹豫地先格式化一遍代码. 如果代码是像这样全屏黄, 那我建议你格式化后直接 commit 一次. 少量的格式化差异, 你可以选择 commit, 恢复.

对于代码中 eslint 标红(error)的代码, 是必须要解决的.

对于代码中 eslint 标黄(warning)的代码, 你可以选择性忽略或者直接 disable.

对于由于 uniapp 条件编译标识错误的代码, 请更新 rule 到.eslintrc.js 中.

对于由于必须存在的全局变量而标识错误的, 请更新到.eslintrc.js 的 globals 中.

针对条件编译, 可以安装 better comments 插件, 并插入如下设置, 可为特殊的条件编译注释语句添加高亮

```javascript
{
  "better-comments.tags": [
    // 主要是第一个规则将#开头的注释显示为粉色, 下面都是沿用旧设置
    {
      "tag": "#",
      "color": "#f9297f",
      "strikethrough": false,
      "backgroundColor": "transparent"
    },
    {
      "tag": "!",
      "color": "#FF2D00",
      "strikethrough": false,
      "backgroundColor": "transparent"
    },
    {
      "tag": "?",
      "color": "#3498DB",
      "strikethrough": false,
      "backgroundColor": "transparent"
    },
    {
      "tag": "//",
      "color": "#474747",
      "strikethrough": true,
      "backgroundColor": "transparent"
    },
    {
      "tag": "todo",
      "color": "#FF8C00",
      "strikethrough": false,
      "backgroundColor": "transparent"
    },
    {
      "tag": "*",
      "color": "#98C379",
      "strikethrough": false,
      "backgroundColor": "transparent"
    }
  ]
}
```

提供的 scripts 有很多, 全部列在 package.json, 请仔细研究, 这里列几种比较常用的

```bash
npm run build:h5,  //构建h5版本
npm run build:mp-weixin  // 构建微信小程序版本

npm run dev:h5   //开发h5版本
npm run dev:mp-weixin,  //持续构建微信小程序版本并监听
```

虽然很隐蔽, 但是 uniapp 很鸡贼地内置了 typescript, vue-typescirpt 支持(vue-class-component, vue-property-decorator), jest 测试框架. 有兴趣可以了解以下.

开始开发 h5 版本的时候就会发现, 前端调用接口会出现跨域的问题. 我个人总结的方法是, 使用代理, 例如在 vue 的开发环境下, 会持续开启一个 webpack 构建的服务器(一般是 8080), 然后可以利用这个服务器进行一些代理操作, 绕过跨域的问题.

```javascript
// vue.config.js 进行更多设置参看vue-cli文档
module.exports = {
  configureWebpack: {
    devServer: {
      "/cros": {
        target: "http://abcd.com",
        pathReWrite: { "^cors": "" },
      },
    },
  },
}
```

这个设置可以将前端对 `localhost:8080/cors` 的部分请求, 通过这个 8080 的服务器代理到真正的`http://abcd.com`服务器上. 这样就可以绕过跨域的问题.

开发小程序版本, 真正的目录位于/dist/dev/wp-XXX/下, 将这个目录作为项目根目录导入到相关小程序开发工具可解.

HB 的发布操作应该是用 C++写的, 自然没有对应的脚本.

在 2020 06 17 的提交中, 添加了一个"x-invalid-end-tag"规则, 用于允许如`<input />`写成`<input></input>`, 但是在 vetur 中, 还是会使用内置的 eslint-plugin-vue 来对.vue 文件进行 lint. 所以有必要屏蔽这部分规则. 需要在.vscode/settings.json 添加

```json
"vetur.validation.template": false
```

来屏蔽掉 vetur 的模板 lint 行为.
