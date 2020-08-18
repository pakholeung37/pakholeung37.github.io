---
title: gitlab-ci quick quiz
date: "2020-08-17 14:48:56"
description: ""
categories: [前端工程化]
comments: true
---

以快问快答的形式综述关于我所知道的 gitlab-ci

**Q**: gitlab-ci 是做什么?

**A**: gitlab-ci 是一种为自动集成/自动部署而生的工作流模式. 通过配置相应的脚本, 可以在进行相应 git 操作之后运行部署脚本. 进而形成 push -> 集成 -> 构建 -> 部署的自动化流程. 一般而言, 在 gitlab 中使用 ci 需要服务器分配一个 runner, 这个 runner 的形式可以有很多种, 并不局限于虚拟机, docker, 真实服务器等. 也不局限操作系统. 通过创建 gitlab-ci.yml 脚本, 可以操控 runner 完成这些任务.

**Q**: gitlab-ci 和 github actions 有什么异同?

**A**: 在 github action 中, 所有 runner 都是以 docker 的形式出现的. 但是官方提供了大量的 image 供使用, 而 gitlab-ci 则不局限于 docker. 当然也没有初始化的必要. 除了 github actions, 其实还有很多类似 circle-ci 等优秀的集成自动化工具. 都是非常优秀的.

**Q**: 简述一下本次 ci 的选型方案.

**A**:

### 附录

```yaml
stages:
  - fetch
  - install_deps
  - build
  - deploy

variables:
  SSH_REMOTE: faier@dep3.faisvr.cc
fetch:
  stage: fetch
  script:
    - ssh -p 50805 $SSH_REMOTE << ssh
    - cd ~/git/repo/edu/fk-education/
    - git fetch origin $CI_COMMIT_REF_NAME
    - git checkout $CI_COMMIT_REF_NAME
    - ssh

install_deps:
  stage: install_deps
  script:
    - ssh -p 50805 $SSH_REMOTE << ssh
    - cd ~/git/repo/edu/fk-education/
    - /home/faier/.npm-global/bin/yarn --frozen-lockfile
    - ssh

build:h5-weixin:
  stage: build
  script:
    - ssh -p 50805 $SSH_REMOTE << ssh
    - cd ~/git/repo/edu/fk-education/
    - /home/faier/.npm-global/bin/yarn build:h5-weixin --vconsole
    - ssh

deploy:h5-weixin:
  stage: deploy
  script:
    - ssh -p 50805 $SSH_REMOTE << ssh
    - cp ~/git/repo/edu/fk-education/dist/build/h5/index.jsp.inc ~/svn/web/edu/entrance/index.jsp.inc
    - cp -r ~/git/repo/edu/fk-education/dist/build/h5/static ~/svn/res/edu/h5/
    - ssh
```
