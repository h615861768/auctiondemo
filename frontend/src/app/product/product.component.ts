import { Component, OnInit } from '@angular/core';
import {ProductService} from "../shared/product.service";
import {FormControl} from "@angular/forms";
import 'rxjs/Rx';
import {Observable} from "rxjs";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  private products:Observable<Product[]>;

  constructor(private productService:ProductService) {

  }

  ngOnInit() {
    this.products = this.productService.getProducts();

    this.productService.searchEvent.subscribe(
      params => this.products = this.productService.search(params)
    )

  }

}

export class Product {

  //定义商品包含的信息
  constructor(
    public id:number,
    public title:string,
    public price:number,
    public rating:number,
    public desc:string,
    public categories:Array<string>,
    public imgurl:string,
    public bimgurl:string
  ){

  }
}
