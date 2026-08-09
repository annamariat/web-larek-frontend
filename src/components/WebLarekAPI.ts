import { Api, ApiListResponse } from "./base/api";
import { IOrder, IOrderResult, IProduct } from "../types";
// Если картинки всё ещё не грузятся — закомментируй импорт и используй placeholder ниже
import subtractImage from "../images/Subtract.svg"; 

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
        const isLocal = window.location.hostname === 'localhost';
        const isDemo = window.location.hostname.includes('github.io');

        if (isLocal || isDemo) {
            // Подбираем товар под ID для консистентности
            const mockProducts = [
                { id: '1', title: 'Фреймворк куки судьбы', price: 2500, category: 'backend', description: 'Помогает быстрее писать код и меньше нервничать' },
                { id: '2', title: 'Бэкенд-антистресс', price: 1000, category: 'other', description: 'Снимает напряжение от бесконечных багфиксов' },
                { id: '3', title: '+1 час в сутках', price: 750, category: 'soft', description: 'Даёт +60 минут продуктивности каждый день' },
                { id: '4', title: 'БЭМ-пилюлька', price: 150000, category: 'css', description: 'Лечит любые проблемы с версткой' },
            ];
            const product = mockProducts.find(p => p.id === id);
            if (!product) throw new Error('Товар не найден');
            
            return Promise.resolve({
                ...product,
                image: subtractImage, // или замени на placeholder, если картинки не работают
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
        const isLocal = window.location.hostname === 'localhost';
        const isDemo = window.location.hostname.includes('github.io');

        if (isLocal || isDemo) {
            console.warn('[MOCK] Используем тестовые товары, реальный API недоступен');
            return Promise.resolve([
                {
                    id: '1',
                    title: 'Фреймворк куки судьбы',
                    price: 2500,
                    category: 'backend',
                    image: subtractImage,
                    description: 'Помогает быстрее писать код и меньше нервничать',
                },
                {
                    id: '2',
                    title: 'Бэкенд-антистресс',
                    price: 1000,
                    category: 'other',
                    image: subtractImage,
                    description: 'Снимает напряжение от бесконечных багфиксов',
                },
                {
                    id: '3',
                    title: '+1 час в сутках',
                    price: 750,
                    category: 'soft',
                    image: subtractImage,
                    description: 'Даёт +60 минут продуктивности каждый день',
                },
                {
                    id: '4',
                    title: 'БЭМ-пилюлька',
                    price: 150000,
                    category: 'css',
                    image: subtractImage,
                    description: 'Лечит любые проблемы с версткой',
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
        const isLocal = window.location.hostname === 'localhost';
        const isDemo = window.location.hostname.includes('github.io');

        if (isLocal || isDemo) {
            return Promise.resolve({
                id: 'MOCK-123',
                success: true,
                total: order.total,
            });
        }
        return this.post('/order', order)
            .then((data) => data as IOrderResult);
    }
}
