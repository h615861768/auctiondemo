### Auction DEMO

本项目包含项目前后端, 同时启动才可以运行

frontend 为demo前端部分
backend  为demo后端部分




### 运行步骤

注意端口号占用:

- 前端:4200 
- 后端8000和8085,

运行前请确保这几个端口号没被占用.


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


启动后端后,数据才可正常加载.

