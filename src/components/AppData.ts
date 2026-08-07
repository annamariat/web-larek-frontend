import { IBasket, IOrder, IProduct, OrderForm, PaymentMethod, OrderFormErrors } from "../types";
import { IEvents } from "./base/events";

export class AppData {
    items: IProduct[] = [];
    preview: IProduct | null = null;
    basket: IBasket = { items: [], total: 0 };
    order: IOrder = {
        payment: "card",
        email: "",
        phone: "",
        address: "",  
        total: 0,     
        items: []     
    };

    formErrors: OrderFormErrors = {};  

    constructor(protected events: IEvents) {}

    setItems(items: IProduct[]) {
        this.items = items;
        this.events.emit('items:change', this.items);
    }

    setPreview(item: IProduct) {
        this.preview = item;
        this.events.emit('preview:change', this.preview);
    }

    inBasket(item: IProduct) {
        return this.basket.items.includes(item.id);
    }

    addToBasket(item: IProduct) {
        this.basket.items.push(item.id);
        if (item.price !== null) {
            this.basket.total += item.price;
        } else {
            console.warn('Цена товара не указана или равна null');
        }
        this.events.emit('basket:change', this.basket);
    }

    removeFromBasket(item: IProduct) {
        this.basket.items = this.basket.items.filter(id => id !== item.id);
        if (item.price !== null) {
            this.basket.total -= item.price;
        } else {
            console.warn('Цена товара не указана или равна null');
        }
        this.events.emit('basket:change', this.basket);
    }

    clearBasket() {
        this.basket.items = [];
        this.basket.total = 0;
        this.events.emit('basket:change', this.basket);
    }

    setPaymentMethod(method: PaymentMethod) {
        this.order.payment = method;
    }

    setOrderField(field: keyof OrderForm, value: string) {
        if (field === 'payment') {
            this.setPaymentMethod(value as PaymentMethod);
        } else {
            (this.order as any)[field] = value;
        }

        this.validateOrder();
    }

    validateOrder(): boolean {
        const errors: OrderFormErrors = {};

        if (!this.order.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';  
        }

        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);

        return Object.keys(errors).length === 0;
    }
}
