import * as express from 'express';

import {Server} from 'ws';


const app = express();


export class Product {
    constructor(
        public id:number,
        public title:string,
        public price:number,
        public rating:number,
        public desc:string,
        public categories:Array<string>,
        public imgurl:string,
        public bimgurl:string
    ){}
}


export class Comment {
    constructor(public id:number,
                public productId:number,
                public timestamp:string,
                public user:string,
                public rating: number,
                public content: string){}
}



const products: Product[] = [
    new Product(1,'Apple iPhone7',1999,3.5,'苹果（Apple）iPhone 7 Plus 128G版 4G手机5.5英寸显示屏，突破性的设计，精彩随处可见！',['电子产品','手机'],'../../assets/images/img1.jpg','../../assets/images/bimg1.png'),
    new Product(2,'HUAWEI Mate9',1399,2.5,'华为（HUAWEI）Mate 9 Pro 4GB+64GB版 全网通 4G手机2K双曲面屏幕，麒麟960芯片，二代徕卡双摄像头！',['电子产品','手机'],'../../assets/images/img2.jpg','../../assets/images/bimg2.png'),
    new Product(3,'Canon EOS 6D',5999,1.5,'佳能（Canon）EOS 6D 单反套机（EF 24-105mm f/4L IS USM 镜头）轻便小巧的高像素全画幅机型，内置Wi-Fi※创新拍摄体验，是为摄影发烧友设计的准专业级数码单反相机！',['电子产品','数码相机'],'../../assets/images/img3.jpg','../../assets/images/bimg3.png'),
    new Product(4,'Canon EOS 700D',2399,4.5,'佳能（Canon）EOS 700D 单反套机（18-55mm IS STM镜头）7种创意滤镜，旋转触控屏幕，手持夜景功能，入门单反旗舰！',['电子产品','数码相机'],'../../assets/images/img4.jpg','../../assets/images/bimg4.png'),
    new Product(5,'Apple AirPods',200,2.5,'苹果（Apple）AirPods 无线耳机全新 AirPods，无线，无繁琐，只有妙不可言！',['电子产品','耳机'],'../../assets/images/img5.jpg','../../assets/images/bimg5.png'),
    new Product(6,'Apple iPad 9',1299,4.5,'苹果（Apple）iPad 9.7英寸平板电脑 32G WLAN版2017年新款，自由自在，简简单单，方寸间，乐趣全开！（颜色随机发）',['电子产品','平板电脑'],'../../assets/images/img6.jpg','../../assets/images/bimg6.png'),
    new Product(7,'Midea 大1.5匹空调',899,4.5,'美的（Midea）大1.5匹 省电星 变频冷暖空调 KFR-35GW/BP3DN1Y-DA200(B1)一级节能，智能光线感应，ECO节能技术，空调想开就开！',['家用电器','空调'],'../../assets/images/img7.jpg','../../assets/images/bimg7.png'),
    new Product(8,'Apple iMac',3999,4.5,'苹果（Apple）iMac MK142CH/A 21.5英寸一体电脑具有突破性提升的全新iMac，Retina 的大作，一款又一款，方方面面都毫不妥协！',['电脑'],'../../assets/images/img8.jpg','../../assets/images/bimg8.png')
];


const comments:Comment[] = [
    new Comment(1,1,new Date().toLocaleTimeString(),'张3',3,'非常棒的'),
    new Comment(2,2,new Date().toLocaleTimeString(),'张4',4,'东西不错'),
    new Comment(3,1,new Date().toLocaleTimeString(),'张5',2,'东西很不错'),
    new Comment(4,3,new Date().toLocaleTimeString(),'张6',4,'东西是不错'),
    new Comment(5,4,new Date().toLocaleTimeString(),'张6',4,'东西是不错'),
    new Comment(6,8,new Date().toLocaleTimeString(),'张6',4,'东西是不错'),
    new Comment(7,6,new Date().toLocaleTimeString(),'张6',4,'东西是不错'),
    new Comment(8,8,new Date().toLocaleTimeString(),'张6',4,'东西是不错'),
    new Comment(9,7,new Date().toLocaleTimeString(),'张6',4,'东西是不错'),
    new Comment(10,6,new Date().toLocaleTimeString(),'张6',4,'东西是不错')
];


// app.get('/',(req,res) => {
//     res.send('Hello Express');
// });


app.get('/api/products',(req,res) => {
   let result = products;
   let params = req.query;

   if(params.title){
       result = result.filter((p) => p.title.indexOf(params.title) !== -1);
   }

    if(params.price && result.length > 0){
        result = result.filter((p) => p.price <= parseInt(params.price));
    }

    if(params.category !== '-1' && result.length > 0) {
        result = result.filter((p => p.categories.indexOf(params.category) !== -1);
    }



   res.json(result);


});

app.get('/api/product/:id',(req,res) => {
    res.json(products.find((product) => product.id == req.params.id));

});

app.get('/api/product/:id/comments',(req,res) => {
    res.json(comments.filter((comment) => comment.productId == req.params.id));

});

const server = app.listen(8000,'localhost', () => {
    console.log('服务器已经启动,地址是: http://localhost:8000');
});


const subscriptions = new Map<any, number[]>();

const wsServer = new Server({port:8085});

wsServer.on('connection',websocket => {

   websocket.on('message',message => {
      let messageObj = JSON.parse(message);
      let productIds = subscriptions.get(websocket) || [];
      subscriptions.set(websocket, [...productIds, messageObj.productId]);
   });
});

const currentBids = new Map<number, number>();


setInterval(() =>{

    products.forEach( p => {
       let currentBid = currentBids.get(p.id) || p.price;
       let newBid = currentBid + Math.random() * 5;
       currentBids.set(p.id, newBid);
    });

    subscriptions.forEach((productIds: number[], ws) => {
        if(ws.readyState ===1){
           let newBids = productIds.map( pid => ({
               productId:pid,
               currentBid:currentBids.get(pid)
           }));
           ws.send(JSON.stringify(newBids));
        } else {
            subscriptions.delete(ws);
        }
    });

},2000);
