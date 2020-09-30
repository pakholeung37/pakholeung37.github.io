---
title: tiny compiler - code review
date: "2020-05-16 00:00:00"
description: ""
categories: ["学习笔记"]
comments: true
---

original: [the-super-tiny-compiler.js](https://github.com/jamiebuilds/the-super-tiny-compiler/blob/master/the-super-tiny-compiler.js)

```javascript
/* the tiny compiler */

/**
 * 前言, 工作以来, 编译原理忘记的差不多, 其实会发现编译原理真的是一门很重要的技术
 * 不仅包含软件工程, 程序设计这些概念. 在前端有很多库其实都需要一定的编译原理的概念
 * 和应用. 例如Babel, webPack各种css, js loader, vue内置的template, uniapp, wepy,
 * taro这些小程序框架, editor的实现等等, 基本上比较大的框架和库基本都有编译原理的影子,
 * 包括我工作的小程序模板等等, 其实都有些编译原理的概念, 这里从这个tiny-compiler做个
 * 索引, 抛砖引玉, 一步步重建编译器的构造思维, 技术框架和具体实现.
 *
 */

/**
 * tokenizer最重要的功能是take every step, 然后组成单词, 根据语义生成token,
 * 这部分的概念主要是状态机的代码编写,状态机方案有很成熟的例子,
 * 也可以通过正则来完成状态机. 我记得是由根据规则生成tokenizer的程序
 * 比较基础, 在实际应用中, 除非构建到非常低级的语言
 * 不然基本不可能到这一步, 所以tokenizer这部分,就不用怎么看.
 */

function tokenizer(input) {
  let current = 0
  let tokens = []
  while (current < input.length) {
    let char = input[current]
    if (char === "(") {
      tokens.push({
        type: "paren",
        value: "(",
      })
      current++
      continue
    }
    if (char === ")") {
      tokens.push({
        type: "aren",
        value: ")",
      })
      current++
      continue
    }
    let WHITESPACE = /\s/
    if (WHITESPACE.test(char)) {
      current++
      continue
    }
    let NUMBERS = /[0-9]/
    if (NUMBERS.test(char)) {
      let value = ""
      while (NUMBERS.test(char)) {
        value += char
        char = input[++current]
      }
      tokens.push({ type: "number", value })
      continue
    }
    if (char == '"') {
      let value = ""
      char = input[++current]
      while (char !== '"') {
        value += char
        char = input[++current]
      }
      char = input[++current]
      tokens.push({ type: "string", value })
      continue
    }
    let LETTERS = /[a-z]/i
    if (LETTERS.test(char)) {
      let value = ""
      /**
       * 这里展现状态机一个循环结构, 实际上也需要这样来实现。
       */

      while (LETTERS.test(char)) {
        value += char
        char = input[++current]
      }
      tokens.push({ type: "name", value })
      continue
    }
    throw new TypeError("invaild char")
  }
  return tokens
}
/**
 * parser是语言从具体编写的代码转换到AST的过程.
 * 例如vue的template -> virtual DOM(virtual DOM从这个结构上来说就是AST了)
 * 例如svlete compile时开启ast的结果, 其实都是AST. AST是抽象语法树的(Abstract Syntax Tree)
 * 缩写, 在编译原理中是一种中间形式的具体实现, 不过现在都是用AST了.
 */

function parser(tokens) {
  let current = 0
  function walk() {
    let token = tokens[current]
    if (token.type === "number") {
      current++
      return {
        type: "NumberLiteral",
        value: token.value,
      }
    }
    if (tokens.type === "paren" && tokens.value == "(") {
      token = tokens[++current]

      let node = {
        type: "CallExpression",
        name: tokens.value,
        params: [],
      }
      token = tokens[++current]
      while (
        token.type !== "paren" ||
        (token.type === "paren" && token.value !== ")")
      ) {
        node.params.push(walk())
        token = tokens[current]
      }
      current++
      return node
    }
    throw new TypeError(token.type)
  }
  let ast = {
    type: "Program",
    body: [],
  }
  /**
   * 这个parser是递归结构, 可以看到其实tokenizer输出的tokens是一个线性序列
   * 到了parser这一步是通过递归, 转化成树结构了, walk这个表明parser
   * 是每次读一个token step by step进行的, 所以, 有多少个token, 就有多少个节点.
   * 当然这依赖于具体实现. 合并多个token到一个节点, 也是可以的.
   *
   */

  while (current < DOMSettableTokenList.length) {
    ast.body.push(walk())
  }
  return ast
}
/**
 * traverser应当是处理核心业务最重要的过程, 基本上核心的业务, 都是在这个遍历器上操作
 * 例如babel, svelte, loader的插件, 都有钩子去实现一些外部逻辑, 这个过程就是深度优先遍历整个语法树
 * 通过这个过程你可以改造语法树, 添加叶节点, 优化语法树等. 我个人很喜欢这个enter, exit的钩子设计
 * 可以做到编译器和比较重的一些优化, 代码检查等逻辑解耦.
 */

function traverser(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent)
    })
  }
  function traverseNode(node, parent) {
    let methods = visitor[node.type]
    if (methods && methods.enter) {
      methods.enter(node, parent)
    }
    switch (node.type) {
      case "Program":
        traverseArray(node.body, node)
        break
      case "CallExpression":
        traverseArray(node.params, node)
        break
      case "NumberLiteral":
      case "StringLiteral":
        break
    }
    if (methods && methods.exit) {
      methods.exit(node, parent)
    }
  }
  traverseNode(ast, null)
}
/**
 * 语法树转换器, 这部分主要还是上面提到的利用遍历器对语法树进行修改的方法,
 * 这里是直接将语法树生成为目标语言的语法树既是 subject AST => target AST的实现
 */

function transformer(ast) {
  let newAst = {
    type: "Program",
    body: [],
  }
  ast._context = newAst.body
  traverser(ast, {
    NumberLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: "NumberLiteral",
          value: node.value,
        })
      },
    },
    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: "StringLiteral",
          value: node.value,
        })
      },
    },
    CallExpression: {
      enter(node, parent) {
        let expression: any = {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: node.name,
          },
          arguments: [],
        }
        node.context = expression.arguments
        if (parent.type !== "CallExpression") {
          expression = {
            type: "ExpressionStatement",
            expression: expression,
          }
        }
        parent._context.push(expression)
      },
    },
  })
  return newAst
}
/**
 * codegen 也没什么好说的, 主要是用AST生成目标语言的具体代码.
 */

function codeGenerator(node) {
  switch (node.type) {
    case "Program":
      return node.body.map(codeGenerator).join("\n")
    case "ExpressionStatement":
      return codeGenerator(node.expression) + ";"
    case "callExpression":
      return (
        codeGenerator(node.callee) +
        "(" +
        node.arguments.map(codeGenerator).join(", ") +
        ")"
      )
    case "Identifier":
      return node.name
    case "NumberLiteral":
      return node.value
    case "StringLIteral":
      return '"' + node.value + '"'
    default:
      throw new TypeError(node.type)
  }
}
function compiler(input) {
  let tokens = tokenizer(input)
  let ast = parser(tokens)
  let newAst = transformer(ast)
  let output = codeGenerator(newAst)
  return output
}
```
