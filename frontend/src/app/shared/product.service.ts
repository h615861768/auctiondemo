import {Injectable, EventEmitter} from '@angular/core';
import {Http, URLSearchParams} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";



@Injectable()
export class ProductService {

  searchEvent:EventEmitter<ProductSearchParams> = new EventEmitter();



  constructor(private http:Http) { }

  getAllCategories():string[]{
    return ["电子产品","耳机","电脑","空调","手机","家用电器","平板电脑","数码相机"];
  }

  getProducts():Observable<Product[]>{
    return this.http.get("/api/products").map(res => res.json());
  }

  getProduct(id:number) :Observable<Product> {
    return this.http.get("/api/product/"+id).map(res => res.json());
  }

  getCommentsForProductId(id:number):Observable<Comment[]>{
    return this.http.get("/api/product/"+id+"/comments").map(res => res.json());
  }

  search(params: ProductSearchParams):Observable<Product[]> {
   return this.http.get("/api/products",{search: this.encodeParams(params)}).map(res => res.json());

  }

  encodeParams(params: ProductSearchParams){
    return Object.keys(params)
      .filter(key => params[key])
      .reduce((sum:URLSearchParams ,key:string) => {
        sum.append(key, params[key]);
        return sum;
      },new URLSearchParams());
  }

}

export class ProductSearchParams {

  constructor(public title:string,
              public price:number,
              public category:string
  ){}
}


export class Product {
  constructor(
    public id:number,
    public title:string,
    public price:number,
    public rating:number,
    public desc:string,
    public categories:Array<string>
  ){}
}

export class Comment {
  constructor(public id:number,
              public productId:number,
              public timestamp:string,
              public user:string,
              public rating: number,
              public content: string
  ){}
}
