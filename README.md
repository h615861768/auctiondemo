### Auction DEMO

本DEMO前后端为typescript编写,未使用数据库
- 前端部分:Bootstrap,Angular4
- 脚手架: angular-cli 
- 后端部分:express 
- 请求方式:http websocket

frontend 为demo前端部分
backend  为demo后端部分




### 运行步骤

注意端口号占用:

- 前端:4200 
- 后端:8000,8085,

运行前请确保这几个端口号没被占用,否则以下命令会启动失败.


1.启动前端

```
$ cd frontend 
$ npm install
$ npm run start
```



2.启动后端

```
$ cd backend 
$ npm install
$ node build/auction_server.js
```


启动后端后,数据可正常加载.

