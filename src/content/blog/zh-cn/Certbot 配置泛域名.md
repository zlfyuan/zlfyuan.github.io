---
title: "Let’s Encrypt 免费泛域名配置"
date: 2023-12-05
lang: zh-CN
originalSlug: "Certbot 配置泛域名"
tags: ["certbot", "https", "linux"]
order: 7
draft: false
---
# [](#Let’s-Encrypt "Let’s Encrypt")Let’s Encrypt

Let’s Encrypt 为了让互联网用户过渡到使用安全的通信服务，提供域名/泛域名证书，有效期为 3 个月，可以续期,主要是免费的哇！！！

1.先安装 snap,如果你的`Ubuntu 大于等于16.04`,则无需安装，默认自带了 snap, 跳过第一步。

```bash
$ sudo apt update
$ sudo apt install snap

##可以测试安装结果
$ sudo snap install hello-world
hello-world 6.4 from Canonical✓ installed
$ hello-world
Hello World!
```

2.安装 Certbot

```bash
$ sudo snap install --classic certbot
```

3.建立软连接 ,方便使用

```bash
$ sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

4.测试 certbot

```bash
$ certbot --version
certbot 1.21.0
```

5.使用 certbot 生成泛域名 ssl

```bash
$ sudo certbot certonly -d "*.example.cn" --manual --preferred-challenges dns-01 --server https://acme-v02.api.letsencrypt.org/directory --no-bootstrap


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please deploy a DNS TXT record under the name:

_acme-challenge.example.cn.

with the following value:

xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Press Enter to Continue

Before continuing, verify the TXT record has been deployed. Depending on the DNS
provider, this may take some time, from a few seconds to multiple minutes. You can
check if it has finished deploying with aid of online tools, such as the Google
Admin Toolbox: https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.example.cn.
Look for one or more bolded line(s) below the line ';ANSWER'. It should show the
value(s) you've just added.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Press Enter to Continue

`添加好Text后可以在https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.example.cn.这里查下 然后继续`


Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/example.cn/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/example.cn/privkey.pem
This certificate expires on 2024-03-03.
These files will be updated when the certificate renews.

NEXT STEPS:
- This certificate will not be renewed automatically. Autorenewal of --manual certificates requires the use of an authentication hook script (--manual-auth-hook) but one was not provided. To renew this certificate, repeat this same certbot command before the certificate's expiry date.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

6.配置好了就可以自由去配置 nginx 了，证书有效期是三个月，看上面也写了有效期 `This certificate expires on 2024-03-03.` 可以手动续订 或者定时续订

7.手动续订,并且刷新 nginx

```bash
$ certbot renew --renew-hook "service nginx reload"
```

[钱哪去里了-用户协议和隐私政策](/zh-CN/blog/2024/02/29/qaql/)[iOS Android 打包分发插件 fastlane-plugin-notifyworker 适用于企业微信，钉钉](/zh-CN/blog/2021/10/26/iOS%20Android%20%E6%89%93%E5%8C%85%E5%88%86%E5%8F%91%E6%8F%92%E4%BB%B6%20fastlane-plugin-notifyworker%20%E9%80%82%E7%94%A8%E4%BA%8E%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%EF%BC%8C%E9%92%89%E9%92%89/)
