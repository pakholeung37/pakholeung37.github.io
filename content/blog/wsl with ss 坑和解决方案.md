---
title: wsl with ss 坑和解决方案
date: "2020-04-27 00:00:00"
description: ""
categories: []
comments: true
---

最近在使用 yarn 安装 node-sass cypress 时下载额外脚本有连接超时的问题, 遂翻墙

环境:

家用: win10 wsl2 ssr 端口 1080

公司: win10 wsl ssr 端口 1080

## proxychains4

proxychains4 是支持 socks5 proxy 的联级代理, 但是只能做一层代理, 该代理为应用层级, 可规定应用走代理链. 理想很美好, 现实很残酷. 家用和公司电脑均无法通过这种方式连接网络. 无法 curl www.google.com, 无论采用 wsl2 和 wsl1. 放弃了

[proxychains - github](https://github.com/haad/proxychains)

## shadowsocksR http 代理

使用 shadowsocksR 的"允许来自局域网的连接"

[[SS/SSR\] 分析&相关科普：“允许来自局域网的连接”到底怎么用](https://moe.best/gotagota/ss-ssr-allow-lan.html)

具体原理在于, linux 在系统层级是不支持 socks5 代理的, 但是支持 http 和 https 的代理. 而在 ssr 的客户端中是有使用 http 代理来翻墙的. 例如 PAC 模式即智能代理模式就是使用 http 来代理 1080 端口的, 另外还有一个 socks5 代理同样运行在 1080 端口, 所以 ssR 其实是在同一个端口上监听了两种代理协议.

所以其实只需要 wsl 的 http 代理设置到本机的 1080 端口就可以了.

实战中可以使用

```bash
export http_proxy="http://127.0.0.1:1080"

export https_proxy="http://127.0.0.1:1080"
```

用于设置当前终端代理. 重新带来终端后需重新设置, 这个模式只能跑 http, 对于其他需要走 socks5 的流量就差点意思了, 不过对于目前情况是够用的.

也可添加脚本简化开启和关闭 proxy[用 Proxy 进一步提高 npm 安装速度](https://fe.rualc.com/note/npm-speedup.html#peng-dao-de-wen-ti)

```bash
export no_proxy=localhost,127.0.0.1,mysite.com # 白名单
function proxyon() {

  export http_proxy="http://127.0.0.1:1080" # 改成你自己的地址

  export https_proxy="http://127.0.0.1:1080" # 改成你自己的地址

  echo "HTTP Proxy on"

}

function proxyoff() {

  unset http_proxy https_proxy # 取消 proxy

  echo "HTTP Proxy off"

}

proxy # 可以加入这一行实现打开终端直接开启 proxy
```

最近发现在 wsl2 下使用的常规 svelte-realword(sapper - rollup) 无法 watch /destop/_project_/src/\*\*文件变更, 只能改回 wsl1
