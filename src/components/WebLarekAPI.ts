import { Api, ApiListResponse } from "./base/api";
import { IOrder, IOrderResult, IProduct } from "../types";


export interface IFilmAPI { 
    getProductList: () => Promise<IProduct[]>; 
    getProductItem: (id: string) => Promise<IProduct>; 
    orderProducts: (order: IOrder) => Promise<IOrderResult>; 

}

export class WebLarekApi extends Api implements IFilmAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

   
    getProductItem(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`)
        .then((data) => {
            const product = data as IProduct;
            return {
                ...product,
                image: this.cdn + product.image
            };
        });
}


    
    getProductList(): Promise<IProduct[]> {
    return this.get('/product')
        .then((data) => {
            const response = data as ApiListResponse<IProduct>;
            return response.items.map((item: IProduct) => ({
                ...item,
                image: this.cdn + item.image
            }));
        });
}


   
    orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order)
        .then((data) => {
            const result = data as IOrderResult;
            return result;
        });
}

}