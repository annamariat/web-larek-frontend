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
        if (window.location.hostname === 'localhost') {
            return Promise.resolve({
                id,
                title: `Товар ${id}`,
                price: 1000,
                category: 'other',
                image: '/images/Subtract.svg',
                description: 'Тестовый товар для локальной разработки',
            });
        }
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
        // ГЛАВНОЕ: на localhost не делаем запрос вообще
        if (window.location.hostname === 'localhost') {
            console.warn('[MOCK] Используем тестовые товары, реальный API недоступен');
            return Promise.resolve([
                {
                    id: '1',
                    title: 'Фреймворк куки судьбы',
                    price: 2500,
                    category: 'backend',
                    image: '/images/Subtract.svg',
                    description: 'Помогает быстрее писать код и меньше нервничать',
                },
                {
                    id: '2',
                    title: 'Бэкенд-антистресс',
                    price: 1000,
                    category: 'backend',
                    image: '/images/Subtract.svg',
                    description: 'Снимает напряжение от бесконечных багфиксов',
                },
                {
                    id: '3',
                    title: '+1 час в сутках',
                    price: 750,
                    category: 'soft',
                    image: '/images/Subtract.svg',
                    description: 'Даёт +60 минут продуктивности каждый день',
                },
            ]);
        }

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
        if (window.location.hostname === 'localhost') {
            // Подставь сюда то имя поля, которое у тебя в IOrderResult: id или orderId
            return Promise.resolve({
                id: 'MOCK-123',       // если в IOrderResult поле id
                // orderId: 'MOCK-123' // если в IOrderResult поле orderId
                success: true,
                total: order.total,
            });
        }
        return this.post('/order', order)
            .then((data) => data as IOrderResult);
    }
}
