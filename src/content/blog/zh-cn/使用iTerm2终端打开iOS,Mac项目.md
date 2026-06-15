---
title: "快捷方式：iTerm2/终端 打开 iOS/Mac 项目"
date: 2020-12-16
lang: zh-CN
originalSlug: "使用iTerm2终端打开iOS,Mac项目"
tags: ["iterm2", "xcode", "ios", "mac"]
order: 4
draft: false
---
# [](#😂iOS-开发-最佳偷懒方式！！！！！！ "😂iOS 开发 最佳偷懒方式！！！！！！")😂iOS 开发 最佳偷懒方式！！！！！！

> icode 命令 支持在终端打开 iOS/Mac 的项目  
> 在终端执行一下 即可使用

```bash
curl https://codeload.github.com/zlfyuan/iOSNote/tar.gz/master | tar -xz -C . --strip=3 iOSNote-master/xcode_commandline/bin/icode && mv icode /usr/local/bin
```

示例：

```bash
$ icode .    /// 打开当前项目
$ icode project /// 打开project项目
```

[一些杂乱的 OC 面试题](/zh-CN/blog/2021/02/23/%E4%B8%80%E4%BA%9B%E6%9D%82%E4%B9%B1%E7%9A%84OC%E9%9D%A2%E8%AF%95%E9%A2%98/)[Ubuntu + Django + Uwsgi + Nginx 线上部署](/zh-CN/blog/2020/07/27/Ubuntu%20+%20Django%20+%20Uwsgi%20+%20Nginx%20%E7%BA%BF%E4%B8%8A%E9%83%A8%E7%BD%B2/)
