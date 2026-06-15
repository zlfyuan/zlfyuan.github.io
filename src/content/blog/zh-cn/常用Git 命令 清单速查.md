---
title: "常用Git 命令 清单速查"
date: 2020-06-16
lang: zh-CN
originalSlug: "常用Git 命令 清单速查"
tags: ["git", "cheatsheet"]
order: 2
draft: false
---
记录了 git 命令的一些常规操作，tag 命令、分支远端交互、分支操作、版本控制、差异化比较、仓库迁移等命令，方便记忆和查询哈。

### [](#基本操作 "基本操作")基本操作

```pgsql
git config  -l 查看git配置

git config --global core.excludesfile ~/.gitignore 配置全局的 定义Git全局的 .gitignore 文件

git config --global http.postBuffer 524288000 配置文件大小限制 500M

git ls-files 查看本地缓存（就是commit之后存在本地的文件）

git rm -r --cached . 删除本地缓存      --cached   + (文件路径）

git commit --amend -CHEAD  (使用完--cached就用 commit --amend -CHEAD 配合使用)

git commit --amend amend具有修改最后一次commit提交的功能

git init 初始化本地库

git status 查看工作区、暂存区的状态

git add <file name> 将工作区的“新建/修改”添加到暂存区

git rm --cached <file name> 移除暂存区的修改

git commit <file name> 将暂存区的内容提交到本地库

git commit -m "提交日志" <file name> 文件从暂存区到本地库
```

### [](#打-tag（发布版本） "打 tag（发布版本）")打 tag（发布版本）

```crmsh
git tag -m "tag 描述" "tag版本号" 打上标签，这个很重要

git push --tags 推送tag到远端仓库
```

### [](#远端交互 "远端交互")远端交互

```pf
git clone <远程库地址> 克隆远程库

git remote -v 查看远程库地址别名

git remote add <别名> <远程库地址> 新建远程库地址别名

git remote rm <别名> 删除本地中远程库别名

git push <别名> <分支名> 本地库某个分支推送到远程库，分支必须指定

git pull <别名> <分支名> 把远程库的修改拉取到本地（该命令包括git fetch，git merge）

git log：查看历史提交（空格向下翻页，b向上翻页，q退出）

git log --pretty=oneline：以漂亮的一行显示，包含全部哈希索引值

git log --oneline：以简洁的一行显示，包含简洁哈希索引值

git reflog：以简洁的一行显示，包含简洁哈希索引值，同时显示移动到某个历史版本所需的步数
```

### [](#分支操作 "分支操作")分支操作

```mipsasm
git branch -l 查看本地分支

git branch -r 查看远端分支

git branch -a 查看全部分支（本地和远端）

git branch -v 查看所有分支

git branch -d <分支名> 删除本地分支

git branch -r -d origin/<分支名> 删除远程分支

git push origin <分支名> 删除远程分支

git branch <分支名> 新建分支

git checkout <分支名> 切换分支

git merge <被合并分支名> 合并分支
```

### [](#版本控制 "版本控制")版本控制

```pgsql
git reset --hard 简洁/完整哈希索引值：回到指定哈希值所对应的版本

git reset --hard HEAD：强制工作区、暂存区、本地库为当前HEAD指针所在的版本

git reset --hard HEAD^：后退一个版本（一个^表示回退一个版本）

git reset --hard HEAD~1：后退一个版本（波浪线~后面的数字表示后退几个版本）
```

### [](#比较差异 "比较差异")比较差异

```fortran
git diff：比较工作区和暂存区的所有文件差异

git diff <file name>：比较工作区和暂存区的指定文件的差异

git diff HEAD|HEAD^|HEAD~|哈希索引值 <file name>：比较工作区跟本地库的某个版本的指定文件的差异
```

### [](#迁移（示例） "迁移（示例）")迁移（示例）

### [](#git-迁移 "git 迁移")git 迁移

-   从原地址克隆一份裸版本库

```bash
$ git clone --bare https://github.com/username/project.git
```

-   然后新建一个地址，比如一下

```bash
$ https://gitee.com/username/newproject.git
```

-   进入 project.git 这个全裸版本库，以镜像推送的方式上传代码到 newproject 上。

```shell
$ cd project.git

$ git push --mirror https://gitee.com/username/newproject.git
```

-   使用新地址，直接 Clone 到本地就可以了。

```crmsh
$ git clone https://gitee.com/username/newproject.git
```

### [](#git-stash（暂存命令-很实用） "git stash（暂存命令-很实用）")git stash（暂存命令-很实用）

git stash 可用来暂存当前正在进行的工作， 比如想 pull 最新代码， 又不想加新 commit， 或者另外一种情况，为了 fix 一个紧急的 bug, 先 stash, 使返回到自己上一个 commit, 改完 bug 之后再 stash pop, 继续原来的工作。  
基础命令：

```mel
git stash          存储当前未提交的文件

git stash list     列出当前git的所有暂存清单

git show stash@{0} 指定回到0的暂存文件

git stash pop      回归到最后一个暂存清单并且删除该暂存清单

git stash clear    清空暂存清单

git stash --help   查看更多信息
```

### [](#后续有记录将持续更新 "后续有记录将持续更新")后续有记录将持续更新

[Ubuntu + Django + Uwsgi + Nginx 线上部署](/zh-CN/blog/2020/07/27/Ubuntu%20+%20Django%20+%20Uwsgi%20+%20Nginx%20%E7%BA%BF%E4%B8%8A%E9%83%A8%E7%BD%B2/)[swift面试题](/zh-CN/blog/2020/03/09/swift%E9%9D%A2%E8%AF%95%E9%A2%98/)
