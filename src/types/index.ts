export type PaymentMethod = 'cash' | 'card';

export interface IProduct { 
    id: string;
    title: string;
    price: number | null; 
    category: string;
    image: string;
    description: string;
}

export interface IBasket { 
    items: string[];
    total: number;
}

export interface IOrder {
    payment: 'card' | 'cash';
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[]; 
}

export interface OrderFormErrors {
    payment?: string;
    address?: string;
    email?: string;
    phone?: string;
}

export type OrderForm = Omit<IOrder, 'total'|'items'>; 

export interface IOrderResult {
    id: string;
    total: number;
}

