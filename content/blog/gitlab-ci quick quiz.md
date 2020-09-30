---
title: gitlab-ci quick quiz
date: "2019-12-12 00:00:00"
description: ""
categories: ["最佳实践"]
comments: true
---

以快问快答的形式综述关于我所知道的 gitlab-ci

**Q: gitlab-ci 是做什么?**

**A**: gitlab-ci 是一种为自动集成/自动部署而生的工作流模式. 通过配置相应的脚本, 可以在进行相应 git 操作之后运行部署脚本. 进而形成 push -> 集成 -> 构建 -> 部署的自动化流程. 一般而言, 在 gitlab 中使用 ci 需要服务器分配一个 runner, 这个 runner 的形式可以有很多种, 并不局限于虚拟机, docker, 真实服务器等. 也不局限操作系统. 通过创建 gitlab-ci.yml 脚本, 可以操控 runner 完成这些任务.

**Q: gitlab-ci 和 github actions 有什么异同?**

**A**: 在 github action 中, 所有 runner 都是以 docker 的形式出现的. 但是官方提供了大量的 image 供使用, 而 gitlab-ci 则不局限于 docker. 当然也没有初始化的必要. 除了 github actions, 其实还有很多类似 circle-ci 等优秀的集成自动化工具. 都是非常优秀的.

**Q: 简述一下什么是 stages, jobs, pipeline.**

**A**: 在 runner 的概念中, 从概念的大小依次排序应当是 pipeline -> stages -> jobs. pipeline 是与每次提交相关联的一个 stages 的集合. 即是本次自动化处理任务的一个总称. 每个 pipeline 则互不影响, 可并行执行. stage 是对自动化作业流水线的每个阶段的总称, 很好理解, 每个 pipeline 都是由一个个 stages 串联而成的. 当一个 stage 成功后则会触发下一个 stage 执行, 一个 stage 失败后则会终止整个 pipeline. 值得注意的是, 在 gitlab 中, stage 是必须串行的, 不存在分支控制进入不同的 stage(其实是可以使用 when 进行简单的分支控制), 一旦定义了 stage, 则必须进入(当然你可以 skip). 而 jobs 则是每个 stage 中 runner 执行每次任务的一个基本单元. 在每个 stage 中, job 都是并行执行的, 他们之间互不影响. 所以你可以看到在理想的状态下, 每个 jobs 应该是可以分配给不同的 runner 执行, 达到并行速度最优.

**Q: 简述一下 gitlab 的 yml 语法.**

**A**: 快速教程请看[GitLab CI 介绍——入门篇](https://juejin.im/post/6844903902387650567), 详细请看[官方文档](https://docs.gitlab.com/ee/ci/yaml/README.html)

**Q: 在 yml 语法上, 有什么考究的吗?**

**A**: 需要注意破折号的使用, script 中使用的是字符串数组, 他的一般形式为

```yaml
script:
  - xxxxxx
  - xxxxxx
  - xxxxxx
```

而我所使用的是

```yml
script:
  - xxxxxx
    xxxxxx
    xxxxxx
```

会被当做一条字符串.

**Q: 相较于之前的脚本, 我做了哪些改进?**

**A**: 在附录 2 中有以前的 gitlabci 脚本. 对比来看

- **stage 运用** 可以看到, 我的脚本每个 stage 更加的细化, 包含更新库代码, 安装依赖, 构建项目, 部署项目等环节. 旧脚本只有安装依赖的过程和部署

- **安装依赖的方法** 在我的脚本中, 安装依赖前一个 stage 是更新库代码, 这样的做法是因为你的依赖包和版本可能会更新, 如果仅仅安装依赖, 那你新的包和版本并不能更新到仓库中. 另外, 可以看到我使用了`yarn --frozen-lockfile`这个脚本的作用是保持 yarn.lock, 这样的好处是使用 yarn 安装和检查依赖时, 会严格按照.lock 文件的版本来进行, 可以更好的控制各个依赖的版本.

- **控制流** 我的 stage 是有明确 success fail 的, 旧的脚本则总是成功.

  在旧的脚本中使用的是如下形式的工作流

  ```bash
  - ssh -p 50805 $SSH_REMOTE << EOF
  - cd ~/git/repo/edu/fk-education/
  - yarn --frozen-lockfile
  - EOF
  ```

  这个工作有两个问题: 1. 由于利用了 ssh, 在 ssh 代码的时候, 脚本 exit code 恒为 0, 即成功, 这样导致一个 jobs 恒为 true, 无法在脚本真正出错的时候即刻终止 pipeline 的运行. 2. 在 ssh 的脚本中间一条命令如果出现错误, 那下一条命令仍然会继续执行, 这是不能被容忍的. 为此需要使用正确的流

  ```bash
  - ssh -p 50805 $SSH_REMOTE << EOF
  - cd ~/git/repo/edu/fk-education/ &&
    yarn --frozen-lockfile ||
    exit 1
  - EOF
  ```

  新修改的代码有一些不一样的区别, 1, 在命令与命令之间添加了&&逻辑, 而且, 这些命令虽然换行了, 但是没有加破折号, 意味着这些语句都是当作一条语句来执行的. 2, 在命令末尾新增了 exit code, 如果前面有命令执行失败, 则会进入||, 使 ssh 脚本非正常退出, 并且 code 为 1(正常应该为 0), 经过检验, runner 的成功和失败其实都是看最后一条命令的 exit code 的, 这样写, 则可以正确地返回正确的 stage 状态, 及时中断 stage.

- **如何控制分支构建流程** 旧的脚本控制分支构建流程是直接写在脚本上的

  ```yaml
  only:a
  - prod
  ```

  我认为这是不合理的, 第一, 这种做法控制手法低效, 如果我有几个分支, 完全不一样的脚本, 或者几种 jobs 混杂在一起, 这样的脚本通常需要编写出非常多而且不合理的代码才能做到. 而我的选择是直接在每个分支中绑定一个该分支的.gitlab-ci.yml, 每个分支的 ci 流程都有自己的流程脚本. 可以比较合理地解决这个问题.

- **git 操作** 我的代码中有绑定当前分支的分支名的变量

  ```yaml
  git fetch origin $CI_COMMIT_REF_NAME &&
  git checkout $CI_COMMIT_REF_NAME &&
  git pull ||
  ```

  更加合理地获取当前 ci 构建的分支的代码.

**Q: 简述一下你在 fetch 阶段的 git 操作.**

**A**: 请看大屏幕

```bash
> git fetch origin $CI_COMMIT_REF_NAME &&  # 获取远程分支commit信息
> git checkout $CI_COMMIT_REF_NAME &&  # 切换到该远程分支
> git pull || # 拉取代码合并到本地
```

## 附录

### 附录 1 - 我的 gitlab-ci.yml

```yaml
stages:
  - fetch
  - install_deps
  - build
  - deploy

variables:
  SSH_REMOTE: faier@dev3.faidev.cc
fetch:
  stage: fetch
  script:
    - ssh -p 50805 $SSH_REMOTE << EOF
    - cd ~/git/repo/edu/fk-education/ &&
      git fetch origin $CI_COMMIT_REF_NAME &&
      git checkout $CI_COMMIT_REF_NAME &&
      git pull ||
      exit 1
    - EOF
install_deps:
  stage: install_deps
  script:
    - ssh -p 50805 $SSH_REMOTE << EOF
    - cd ~/git/repo/edu/fk-education/ &&
      yarn --frozen-lockfile ||
      exit 1
    - EOF
build:h5-weixin:
  stage: build
  script:
    - ssh -p 50805 $SSH_REMOTE << EOF
    - cd ~/git/repo/edu/fk-education/ &&
      yarn build:h5-weixin --vconsole ||
      exit 1
    - EOF
deploy:h5-weixin:
  stage: deploy
  script:
    - ssh -p 50805 $SSH_REMOTE << EOF
    - cp ~/git/repo/edu/fk-education/dist/build/h5/index.jsp.inc ~/svn/web/edu/entrance/index.jsp.inc &&
      cp -r ~/git/repo/edu/fk-education/dist/build/h5/static ~/svn/res/edu/h5/ ||
      exit 1
    - EOF
```

### 附录 2 - gitlab 上常规的[gitlab-ci.yml](http://gitlab.faidev.cc/yueke/myueke-wxapp/blob/master/.gitlab-ci.yml)

```yaml
stages:
  - install_deps
  - deploy

before_script:
  - echo "starting task"

install_deps:
  stage: install_deps
  tags:
    - jmin-tag-myueke
  when: manual
  only:
    - prod
  script:
    - echo 'install dep'
    - cd D:/prod/myueke-wxapp
    - fnpm install
  allow_failure: true

deploy:
  stage: deploy
  tags:
    - jmin-tag-myueke
  only:
    - prod
  script:
    - echo 'build and upload'
    - cd D:/prod/myueke-wxapp
    - pwd
    - git branch
    - git pull
    - npm run build
    - wxpatch build --no-cache
    - npm run upload
  allow_failure: true
```
