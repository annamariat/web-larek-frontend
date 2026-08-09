import { Api, ApiListResponse } from "./base/api";
import { IOrder, IOrderResult, IProduct } from "../types";
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

    private readonly _mockProducts: IProduct[] = [
        {
            id: "854cef69-976d-4c2a-a18c-2aa45046c390",
            title: "+1 час в сутках",
            category: "софт-скил",
            description: "Если планируете решать задачи в тренажёре, берите два.",
            image: subtractImage,
            price: 750,
        },
        {
            id: "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
            title: "HEX-леденец",
            category: "другое",
            description:
                "Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.",
            image: subtractImage,
            price: 1450,
        },
        {
            id: "b06cde61-912f-4663-9751-09956c0eed67",
            title: "Мамка-таймер",
            category: "софт-скил",
            description: "Будет стоять над душой и не давать прокрастинировать.",
            image: subtractImage,
            price: null,
        },
        {
            id: "412bcf81-7e75-4e70-bdb9-d3c73c9803b7",
            title: "Фреймворк куки судьбы",
            category: "дополнительное",
            description:
                "Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.",
            image: subtractImage,
            price: 2500,
        },
        {
            id: "1c521d84-c48d-48fa-8cfb-9d911fa515fd",
            title: "Кнопка «Замьютить кота»",
            category: "кнопка",
            description: "Если орёт кот, нажмите кнопку.",
            image: subtractImage,
            price: 2000,
        },
        {
            id: "f3867296-45c7-4603-bd34-29cea3a061d5",
            title: "БЭМ-пилюлька",
            category: "другое",
            description:
                "Чтобы научиться правильно называть модификаторы, без этого не обойтись.",
            image: subtractImage,
            price: 1500,
        },
        {
            id: "54df7dcb-1213-4b3c-ab61-92ed5f845535",
            title: "Портативный телепорт",
            category: "другое",
            description: "Измените локацию для поиска работы.",
            image: subtractImage,
            price: 100000,
        },
        {
            id: "6a834fb8-350a-440c-ab55-d0e9b959b6e3",
            title: "Микровселенная в кармане",
            category: "другое",
            description: "Даст время для изучения React, ООП и бэкенда",
            image: subtractImage,
            price: 750,
        },
        {
            id: "48e86fc0-ca99-4e13-b164-b98d65928b53",
            title: "UI/UX-карандаш",
            category: "хард-скил",
            description: "Очень полезный навык для фронтендера. Без шуток.",
            image: subtractImage,
            price: 10000,
        },
        {
            id: "90973ae5-285c-4b6f-a6d0-65d1d760b102",
            title: "Бэкенд-антистресс",
            category: "другое",
            description: "Сжимайте мячик, чтобы снизить стресс от тем по бэкенду.",
            image: subtractImage,
            price: 1000,
        },
    ];

    getProductItem(id: string): Promise<IProduct> {
        const isLocal = window.location.hostname === "localhost";
        const isDemo = window.location.hostname.includes("github.io");

        if (isLocal || isDemo) {
            const product = this._mockProducts.find((p) => p.id === id);
            if (!product) {
                throw new Error("Товар не найден");
            }
            return Promise.resolve(product);
        }

        return this.get(`/product/${id}`).then((data) => {
            const product = data as IProduct;
            return {
                ...product,
                image: this.cdn + product.image,
            };
        });
    }

    getProductList(): Promise<IProduct[]> {
        const isLocal = window.location.hostname === "localhost";
        const isDemo = window.location.hostname.includes("github.io");

        if (isLocal || isDemo) {
            console.warn("[MOCK] Используем тестовые товары, реальный API недоступен");
            return Promise.resolve([...this._mockProducts]);
        }

        return this.get("/product").then((data) => {
            const response = data as ApiListResponse<IProduct>;
            return response.items.map((item: IProduct) => ({
                ...item,
                image: this.cdn + item.image,
            }));
        });
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        const isLocal = window.location.hostname === "localhost";
        const isDemo = window.location.hostname.includes("github.io");

        if (isLocal || isDemo) {
            // Сценарий 1: неверная сумма заказа
            if (typeof order.total !== "number" || order.total <= 0) {
                throw new Error("Неверная сумма заказа");
            }

            // Сценарий 2: не указан адрес
            if (!order.address || order.address.trim() === "") {
                throw new Error("Не указан адрес");
            }

            return Promise.resolve({
                id: "MOCK-123",
                success: true,
                total: order.total,
            });
        }

        return this.post("/order", order).then((data) => data as IOrderResult);
    }
}
