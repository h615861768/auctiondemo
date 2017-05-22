"use strict";
var express = require('express');
var ws_1 = require('ws');
var app = express();
var Product = (function () {
    function Product(id, title, price, rating, desc, categories, imgurl, bimgurl) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories;
        this.imgurl = imgurl;
        this.bimgurl = bimgurl;
    }
    return Product;
}());
exports.Product = Product;
var Comment = (function () {
    function Comment(id, productId, timestamp, user, rating, content) {
        this.id = id;
        this.productId = productId;
        this.timestamp = timestamp;
        this.user = user;
        this.rating = rating;
        this.content = content;
    }
    return Comment;
}());
exports.Comment = Comment;
var products = [
    new Product(1, 'Apple iPhone7', 1999, 3.5, '苹果（Apple）iPhone 7 Plus 128G版 4G手机5.5英寸显示屏，突破性的设计，精彩随处可见！', ['电子产品', '手机'], '../../assets/images/img1.jpg', '../../assets/images/bimg1.png'),
    new Product(2, 'HUAWEI Mate9', 1399, 2.5, '华为（HUAWEI）Mate 9 Pro 4GB+64GB版 全网通 4G手机2K双曲面屏幕，麒麟960芯片，二代徕卡双摄像头！', ['电子产品', '手机'], '../../assets/images/img2.jpg', '../../assets/images/bimg2.png'),
    new Product(3, 'Canon EOS 6D', 5999, 1.5, '佳能（Canon）EOS 6D 单反套机（EF 24-105mm f/4L IS USM 镜头）轻便小巧的高像素全画幅机型，内置Wi-Fi※创新拍摄体验，是为摄影发烧友设计的准专业级数码单反相机！', ['电子产品', '数码相机'], '../../assets/images/img3.jpg', '../../assets/images/bimg3.png'),
    new Product(4, 'Canon EOS 700D', 2399, 4.5, '佳能（Canon）EOS 700D 单反套机（18-55mm IS STM镜头）7种创意滤镜，旋转触控屏幕，手持夜景功能，入门单反旗舰！', ['电子产品', '数码相机'], '../../assets/images/img4.jpg', '../../assets/images/bimg4.png'),
    new Product(5, 'Apple AirPods', 200, 2.5, '苹果（Apple）AirPods 无线耳机全新 AirPods，无线，无繁琐，只有妙不可言！', ['电子产品', '耳机'], '../../assets/images/img5.jpg', '../../assets/images/bimg5.png'),
    new Product(6, 'Apple iPad 9', 1299, 4.5, '苹果（Apple）iPad 9.7英寸平板电脑 32G WLAN版2017年新款，自由自在，简简单单，方寸间，乐趣全开！（颜色随机发）', ['电子产品', '平板电脑'], '../../assets/images/img6.jpg', '../../assets/images/bimg6.png'),
    new Product(7, 'Midea 大1.5匹空调', 899, 4.5, '美的（Midea）大1.5匹 省电星 变频冷暖空调 KFR-35GW/BP3DN1Y-DA200(B1)一级节能，智能光线感应，ECO节能技术，空调想开就开！', ['家用电器', '空调'], '../../assets/images/img7.jpg', '../../assets/images/bimg7.png'),
    new Product(8, 'Apple iMac', 3999, 4.5, '苹果（Apple）iMac MK142CH/A 21.5英寸一体电脑具有突破性提升的全新iMac，Retina 的大作，一款又一款，方方面面都毫不妥协！', ['电脑'], '../../assets/images/img8.jpg', '../../assets/images/bimg8.png')
];
var comments = [
    new Comment(1, 1, new Date().toLocaleTimeString(), '张3', 3, '非常棒的'),
    new Comment(2, 2, new Date().toLocaleTimeString(), '张4', 4, '东西不错'),
    new Comment(3, 1, new Date().toLocaleTimeString(), '张5', 2, '东西很不错'),
    new Comment(4, 3, new Date().toLocaleTimeString(), '张6', 4, '东西是不错'),
    new Comment(5, 4, new Date().toLocaleTimeString(), '张6', 4, '东西是不错'),
    new Comment(6, 8, new Date().toLocaleTimeString(), '张6', 4, '东西是不错'),
    new Comment(7, 6, new Date().toLocaleTimeString(), '张6', 4, '东西是不错'),
    new Comment(8, 8, new Date().toLocaleTimeString(), '张6', 4, '东西是不错'),
    new Comment(9, 7, new Date().toLocaleTimeString(), '张6', 4, '东西是不错'),
    new Comment(10, 6, new Date().toLocaleTimeString(), '张6', 4, '东西是不错')
];
// app.get('/',(req,res) => {
//     res.send('Hello Express');
// });
app.get('/api/products', function (req, res) {
    var result = products;
    var params = req.query;
    if (params.title) {
        result = result.filter(function (p) { return p.title.indexOf(params.title) !== -1; });
    }
    if (params.price && result.length > 0) {
        result = result.filter(function (p) { return p.price <= parseInt(params.price); });
    }
    if (params.category !== '-1' && result.length > 0) {
        result = result.filter((function (p) { return p.categories.indexOf(params.category) !== -1; }));
    }
    res.json(result);
});
app.get('/api/product/:id', function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
app.get('/api/product/:id/comments', function (req, res) {
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});
var server = app.listen(8000, 'localhost', function () {
    console.log('服务器已经启动,地址是: http://localhost:8000');
});
var subscriptions = new Map();
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on('connection', function (websocket) {
    websocket.on('message', function (message) {
        var messageObj = JSON.parse(message);
        var productIds = subscriptions.get(websocket) || [];
        subscriptions.set(websocket, productIds.concat([messageObj.productId]));
    });
});
var currentBids = new Map();
setInterval(function () {
    products.forEach(function (p) {
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = currentBid + Math.random() * 5;
        currentBids.set(p.id, newBid);
    });
    subscriptions.forEach(function (productIds, ws) {
        if (ws.readyState === 1) {
            var newBids = productIds.map(function (pid) { return ({
                productId: pid,
                currentBid: currentBids.get(pid)
            }); });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}, 2000);
