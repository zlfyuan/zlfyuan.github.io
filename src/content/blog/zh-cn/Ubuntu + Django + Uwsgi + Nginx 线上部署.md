---
title: "Ubuntu + Django + Uwsgi + Nginx 线上部署"
date: 2020-07-27
lang: zh-CN
originalSlug: "Ubuntu + Django + Uwsgi + Nginx 线上部署"
tags: ["ubuntu", "django", "nginx", "deploy"]
order: 3
draft: false
---
新手学习 Python Web 后端之 Django, 线上部署记录.

## [](#环境 "环境")环境

-   Ubuntu 16.04.6
-   Python 3.7.8
-   Django 3.0.6
-   Uwsgi 2.0.19.1
-   Nginx 1.10.3

### [](#安装-python3-7 "安装 python3.7")安装 python3.7

ubuntu 自带 python2.7、python3.5

-   查看所有版本

```awk
~# ls /usr/bin/python*

/usr/bin/python     /usr/bin/python2.7-config    /usr/bin/python2-pbr  /usr/bin/python3.5-config   /usr/bin/python3m-config
/usr/bin/python2    /usr/bin/python2-config      /usr/bin/python3      /usr/bin/python3.5m          /usr/bin/python3-config
/usr/bin/python2.7  /usr/bin/python2-jsonschema  /usr/bin/python3.5    /usr/bin/python3.5m-config  /usr/bin/python3m
/usr/bin/python-config
没有3.7的版本
```

-   安装 python3.7

```applescript
~# sudo apt-get install python3.7
```

-   查看默认版本

```vim
~# python --version
Python 3.5.2
```

-   系统默认环境不是 python3.7 更改默认为 python3.7  
    先删除默认的 Python 软链接

```shell
~# sudo rm /usr/bin/python
```

-   添加默认的 Python 软链接指向 3.7

```shell
~# sudo ln -s /usr/bin/python3.7 /usr/bin/python
```

-   再次查看默认版本

```vim
~# python --version
Python 3.7.8
```

-   安装 pip 包管理工具

```dts
~# wget https://bootstrap.pypa.io/get-pip.py

~# python get-pip.py

安装成功  查看pip版本
~# pip -V
pip 20.1.1 from /usr/local/lib/python3.7/dist-packages/pip (python 3.7)
```

### [](#安装虚拟环境 "安装虚拟环境")安装虚拟环境

-   venv （python 内置 仅支持 Python3 以上版本）
-   virtualenv
-   anaconda3

我们使用 venv

-   创建名为 envpy37 的 python3.7 的虚拟环境

```applescript
~# python -m venv envpy37
```

-   进入虚拟环境

```elixir
~# source env/bin/activate
(envpy37) :~#

退出envpy37
~# deactivate

为了方便切换，我们设置一个别名

~# vi .bashrc

添加 alias envpy37='source env_py37/bin/activate'

保存 退出 vim

生效.bashrc

~# source .bashrc

用设置的别名启动虚拟环境

~# envpy37

(env_py37) :~#

查看虚拟环境的python版本

(env_py37) :~# python -V

Python 3.7.7
```

### [](#安装-Git "安装 Git")安装 Git

```applescript
~# sudo apt install git

为了方便XShell或者CRT连接服务器，建议安装OpenSSH
~# sudo apt install openssh-server openssh-client

~# service ssh restart
```

### [](#安装-MySQL "安装 MySQL")安装 MySQL

```applescript
~# sudo apt install mysql-server mysql-client

~# sudo apt-get install libmysqld-dev
```

-   测试 mysql
-   本地登陆 mysql
-   修改登陆权限
-   开启 ssh 远程连接权限
-   用工具测试远程连接

### [](#测试项目 "测试项目")测试项目

-   把项目用 Git 或者 ftp 推上服务器 （比如存放在/srv/）
    
-   切换到 python 虚拟环境 ，比如上面提到的 env\_py37
    
-   进入项目根目录
    

```cmake
(env_py37) :~# cd project
(env_py37) project:~#
```

-   这个虚拟环境下安装依赖包 requirements.txt (可以通过 pip freeze .)获取该文件内容

```cmake
(env_py37) project:~# pip install -r requirements.txt
```

-   迁移数据

```cmake
(env_py37) project:~# python manage.py makemigrations
(env_py37) project:~# python manage.py migrate
```

-   运行项目
    -   记得开放 8000 端口
    -   在 setting.py—–ALLOW\_HOST 改成 \[“\*”\]
    -   在 setting.py—–DEBUG=False
    -   在浏览器用 ip 访问 http://:8000
    -   确保没有错误，和在本地运行一样没有任何错误

```cmake
(env_py37) project:~# python manage.py runserver 0.0.0.0:8000
```

### [](#安装-uwsgi-应用服务器 "安装 uwsgi 应用服务器")安装 uwsgi 应用服务器

-   uwsgi 必须安装在系统级别的 Python 环境中，不要安装到虚拟环境中

```cmake
# 记得退出虚拟环境
(env_py37) project:~# deactivate

~# pip install uwsgi
```

-   测试 uwsgi
    -   在根目录下新建一个 testuwsgi.py 并且添加内容
    -   测试 uwsgi 服务器的响应 执行 testuwsgi.py (必须在 testuwsgi 的同级目录下执行)

```gradle
(env_py37) :~# cd project
(env_py37) project:~# vi testuwsgi.py3

#添加以下代码
def application(env,start_response):
	start_response('200 ok',[('Content-Type','text/html')])
	return [b'Hello world']



(保存退出vim)
(env_py37) project:~# uwsgi --http :8000 --wsgi-file testuwsgi.py

在浏览器用ip访问 http://<your ip>:8000
正常结果是是返回一个Hello world 网页
```

-   为项目配置 uwsgi 的启动文件

```routeros
(env_py37) project:~# vi project_uwsgi.ini

#添加以下配置
[uwsgi]

# 虚拟环境的路径
home=/root/env_py37

# 项目的绝对路径
chdir=/srv/project

#主进程
master=true
# 工作进程
processes=4

# 工作线程
threads=2

# socket 用于连接nginx （nginx的server）
socket=127.0.0.1:8002

# 退出的时候是否清理环境
vacuum=true

# 设置一个uwsgi.pid 文件
pidfile = uwsgi.pid

# 项目的wsgi文件
wsgi-file=shudong_server/wsgi.py

(保存退出vim)
```

-   测试启动文件

```cmake
(env_py37) project:~# uwsgi --ini djangotest.ini

没有错误的话，可以试着访问项目
```

### [](#安装-nginx "安装 nginx")安装 nginx

-   nginx 是一个 web 服务器。用来加载静态文件和接收 http 请求的
-   同样安装到系统环境
-   nginx 常用命令
    -   启动 nginx：service nginx start
    -   关闭 nginx：service nginx stop
    -   重启 nginx：service nginx restart
    -   刷新 nginx 配置: nginx -s reload

```applescript
~# sudo apt install nginx
~# nginx -v
nginx version: nginx/1.10.3 (Ubuntu)  # 安装成功
```

-   收集静态文件
    
    -   静态文件应该让`nginx`来处理，而不是让`django`来做。
    -   首先确保你的`settings.py`文件中有一个`STATIC_ROOT`配置，这个配置应该指定你的静态文件要放在哪个目录下
    -   那么我们可以执行以下命令：`python manage.py collectstatic`来收集所有静态文件
    -   执行完毕 可以查看目录是否生成静态文件

```ini
# 在setting.py 添加以下代码

STATIC_ROOT = '/srv/project/static/' #指定静态文件目录
STATIC_URL = '/static/'
STATICFILES_DIRS = [
   os.path.join(BASE_DIR, "static"),
   '/srv/project/static/',
]
```

-   编写 nginx 的配置文件 在/etc/nginx/conf.d 目录下 新建一个 project.conf
    -   测试配置文件 service nginx configtest
    -   改完配置需要重启 service nginx restart

```crmsh
conf.d:~# vi project.conf

#添加以下配置

# configuration of the server
server {
    # the port your site will be served on
    listen      80;
    # the domain name it will serve for
    server_name <你的域名>（可选  没有的话 用 _ 替代）; # substitute your machine's IP address or FQDN
    charset     utf-8;

    # max upload size
    client_max_body_size 75M;   # adjust to taste

    # Django media

    location /static {
        alias /srv/project/static; # 项目静态文件目录
    }

    # Finally, send all non-media requests to the Django server.
    location / {
        uwsgi_pass  127.0.0.1:8002; # 配置和uwsgi通讯的地址（和uwsgi.ini的socket一样）
        include     /etc/nginx/uwsgi_params; # the uwsgi_params file you installed 这个文件在nginx下面，可以查看
    }
}

(保存退出vim)
```

nginx 测试 ok

在项目根目录执行 启动项目

```applescript
~# service nginx start && uwsgi -d --ini uwsgi.ini
```

在浏览器访问 访问成功 即部署成功

# [](#到此即部署完成 "到此即部署完成")到此即部署完成

### [](#第一次接触后端-如果有误～欢迎指正！ "第一次接触后端 如果有误～欢迎指正！")第一次接触后端 如果有误～欢迎指正！

[快捷方式：iTerm2/终端 打开 iOS/Mac 项目](/zh-CN/blog/2020/12/16/%E4%BD%BF%E7%94%A8iTerm2%E7%BB%88%E7%AB%AF%E6%89%93%E5%BC%80iOS,Mac%E9%A1%B9%E7%9B%AE/)[常用Git 命令 清单速查](/zh-CN/blog/2020/06/16/%E5%B8%B8%E7%94%A8Git%20%E5%91%BD%E4%BB%A4%20%E6%B8%85%E5%8D%95%E9%80%9F%E6%9F%A5/)
