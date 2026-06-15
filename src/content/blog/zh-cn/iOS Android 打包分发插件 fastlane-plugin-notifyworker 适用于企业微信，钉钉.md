---
title: "iOS Android 打包分发插件 fastlane-plugin-notifyworker\n                适用于企业微信，钉钉"
date: 2021-10-26
lang: zh-CN
originalSlug: "iOS Android 打包分发插件 fastlane-plugin-notifyworker 适用于企业微信，钉钉"
tags: ["fastlane", "ios", "android", "ci"]
order: 6
draft: false
---
我司采用蒲公英分发测试，随着测试人员的增加，分发设备增多，在打包通知后需要统一通知到位，我立马想到的是 webhook，蒲公英平台自带了 webhook，尝试了之后发现信息内容里不能自定义没有我们想要的二维码下载方式，于是 notifyworker 诞生了，利用平台的 webhook，写了个简易的 fastlane 插件，支持（企业微信、钉钉）[notifyworker](https://github.com/zlfyuan/fastlane-plugin-notifyworker)

## [](#使用方式 "使用方式")使用方式

将“fastlane-plugin-notifyworker” 添加到你的项目 fastlane/Pluginfile 文件中，运行以下命令将其添加到您的插件文件中：

```bash
fastlane add_plugin notifyworker
```

在 lane 中

```ruby
notifyworker(
    webhook = ""    #str (required paramter)
    api_key = ""    #str (required paramter) 来自蒲公英
    app_key = ""    #str (required paramter) 来自蒲公英
    updateDes = "" #str (optional paramter)
    platform = ""  #str (optional paramter(DingTalk,WeChat) default: dingTalk )
    atAll = ""  #bool (optional paramter)
)
```

## [](#如果对你有所帮助-😁，欢迎-star-issues "如果对你有所帮助 😁，欢迎 star issues")如果对你有所帮助 😁，欢迎 [star issues](https://github.com/zlfyuan/fastlane-plugin-notifyworker)

[Let’s Encrypt 免费泛域名配置](/zh-CN/blog/2023/12/05/Certbot%20%E9%85%8D%E7%BD%AE%E6%B3%9B%E5%9F%9F%E5%90%8D/)[一些杂乱的 OC 面试题](/zh-CN/blog/2021/02/23/%E4%B8%80%E4%BA%9B%E6%9D%82%E4%B9%B1%E7%9A%84OC%E9%9D%A2%E8%AF%95%E9%A2%98/)
