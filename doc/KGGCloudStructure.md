# 云结构-服务端架设指南
### 注: 云结构mod不提供官方服务端, 允许自行架设服务端
### 云结构使用HTTP传递数据以支持多语言
+ ### [接口实现](#interface)
+ ### [Python示例](#python)

---

## RPC 请求
### 云结构mod通过远程RPC方法上传与下载结构数据
### 需要实现以下接口:

---

<h2 id="interface">接口</h2>

### POST `/get_token`    

接口描述: 用于验证用户 返回密钥应包含用户消息已用于下载时区分用户 云结构mod在调用/download时并不会传入用户信息  

传入数据 `JSON`:  

| 参数名    | 类型     | 描述                     |
|--------|--------|------------------------|
| user   | string | 用户名                    |
| passwd | string | 密码                     |
| method | string | 用于的操作(upload/download) |

回传数据 `JSON`:  
诺验证成功 需返回:

| 参数名   | 类型      | 值        | 描述        |
|-------|---------|----------|-----------|
| code  | integer | 200      | 操作状态      |
| token | string  | 任意不定长字符串 | 用于下载与上传操作 |

诺验证失败 需返回:

| 参数名     | 类型      | 值    | 描述         |
|---------|---------|------|------------|
| code    | integer | 非200 | 操作状态       |
| message | string  | 原因   | 失败原因       |

---

### POST `/upload?token=&path=`  
接口描述: 用于上传结构  
传入数据 `Muiltpart/form-data`:   
### 注意! 因为KGG执意要求 `token`,`path` 被放到了 URL 里 只有 `file` 使用 `Muiltpart/form-data` 其他则为 `Params` 不知道为什么 很想吐槽一下

| 参数名   | 类型             | 描述     |
|-------|----------------|--------|
| token | string         | 密钥     |
| path  | string         | 结构名称   |
| file  | string(binary) | 结构二进制流 |

回传数据 `JSON`:  
诺验证成功 需返回:

| 参数名     | 类型      | 值   | 描述   |
|---------|---------|-----|------|
| code    | integer | 200 | 操作状态 |
| message | string  | 结果  | 消息   |

诺验证失败 需返回:

| 参数名     | 类型      | 值    | 描述   |
|---------|---------|------|------|
| code    | integer | 非200 | 操作状态 |
| message | string  | 原因   | 失败原因 |

---

### GET `/download?token=&path=`  
接口描述: 用于上传结构  
传入数据 `Params`:  

| 参数名   | 类型       | 描述   |
|-------|----------|------|
| token | string   | 密钥   |
| path  | string   | 结构名称 |

回传数据 `结构二进制流`  

---
### 当实现以上三个接口后便可与云结构mod对接
#### 请先实现用户系统再实现本RPC请求
#### 提供用户使用时需提供 服务端API URL、用户名、密码

---
<h2 id="python">Python 演示</h2>

    from flask import Flask, request, jsonify, send_from_directory
    
    app = Flask("demo")
    
    
    @app.route("/get_token", methods=["POST"])
    def token():
        """客户端向网站发送请求获得授权码，再将授权码发送给MC服务器"""
        data = request.get_json()
        user = data["user"]
        passwd = data["passwd"]
        method = data["method"]
        token = user + "123"  # 授权码应该是随机生成的，这里只是举例
        return jsonify(code=200, token=token)
    
    
    @app.route("/upload", methods=["POST"])
    def upload():
        """MC服务器上传结构数据"""
        token = request.args["token"]
        path = request.args["path"]
        # 通过MC服务器发来的授权码获取上传结构的用户
        user = token[:-3]  # 注意 最好在密钥中使用对称加密存储用户信息
        file = request.files["file"]
        open(user+"/"+path+".nbt", "wb").write(file.stream.read())
        return jsonify(code=-400, message="上传失败")
    
    
    @app.route("/download", methods=["GET"])
    def download():
        """MC服务器下载结构"""
        token = request.args["token"]
        path = request.args["path"]
    
        user = token[:-3]
        return send_from_directory("", user + "/" + path + ".nbt")
    
    
    if __name__ == '__main__':
        app.run()
