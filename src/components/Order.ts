
import { Form } from "./common/Form";
import { OrderForm, PaymentMethod } from "../types";
import { EventEmitter } from "./base/events";
import { ensureElement } from "../utils/utils";

export class Order extends Form<OrderForm> {
    protected _paymentCard: HTMLButtonElement;
    protected _paymentCash: HTMLButtonElement;

    private _selectedPayment: PaymentMethod | null = null; 

    constructor(events: EventEmitter, container: HTMLFormElement) {
        super(events, container);

        this._paymentCard = ensureElement<HTMLButtonElement>('.button_alt[name=card]', this.container);
        this._paymentCash = ensureElement<HTMLButtonElement>('.button_alt[name=cash]', this.container);

        const addressInput = container.querySelector('input[name="address"]') as HTMLInputElement | null;

        
        this._paymentCard.addEventListener('click', () => {
            this._selectedPayment = 'card'; 
            this.payment = 'card';         
            this.onInputChange('payment', 'card');
            this.validate();               
        });

        this._paymentCash.addEventListener('click', () => {
            this._selectedPayment = 'cash';
            this.payment = 'cash';
            this.onInputChange('payment', 'cash');
            this.validate();
        });

        if (addressInput) {
            addressInput.addEventListener('input', () => this.validate());
        }

        this.validate();
    }

    set payment(value: PaymentMethod) {
        
        if (value === 'card') {
            this._paymentCard.classList.add('button_alt-active');
            this._paymentCash.classList.remove('button_alt-active');
        } else {
            this._paymentCard.classList.remove('button_alt-active');
            this._paymentCash.classList.add('button_alt-active');
        }
    }

    set address(value: string) {
        const input = this.container.elements.namedItem('address') as HTMLInputElement;
        input.value = value;
        this.validate();
    }

    private validate() {
    const isPaymentSelected = this._selectedPayment !== null;
    const addressInput = this.container.querySelector('input[name="address"]') as HTMLInputElement | null;
    const isAddressFilled = addressInput ? addressInput.value.trim().length > 0 : false;
    const isValid = isPaymentSelected && isAddressFilled;

    console.log('[Order] validate called. Payment selected:', isPaymentSelected, 'Address filled:', isAddressFilled, 'Valid:', isValid);

    
    this.valid = isValid;

    if (!isValid) {
        const errors: string[] = [];
        if (!isPaymentSelected) errors.push('Выберите способ оплаты');
        if (!isAddressFilled) errors.push('Введите адрес доставки');
        this.errors = errors;
    } else {
        this.errors = [];
    }
}




}

