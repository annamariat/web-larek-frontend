import { Form } from "./common/Form";
import { OrderForm } from "../types";
import { EventEmitter } from "./base/events"; 

export class Contacts extends Form<OrderForm> {
    constructor(events: EventEmitter, container: HTMLFormElement) {
        super(events, container);
        this.validate(); 
    }

    protected onInputChange(field: keyof OrderForm, value: string) {
        super.onInputChange(field, value);
        this.validate();
    }

    set email(value: string) {
        const input = this.container.elements.namedItem('email') as HTMLInputElement | null;
        if (input) input.value = value;
    }

    set phone(value: string) {
        const input = this.container.elements.namedItem('phone') as HTMLInputElement | null;
        if (input) input.value = value;
    }

    private validate() {
        const emailInput = this.container.querySelector('input[name="email"]') as HTMLInputElement | null;
        const phoneInput = this.container.querySelector('input[name="phone"]') as HTMLInputElement | null;

        const isEmailFilled = emailInput ? emailInput.value.trim().length > 0 : false;
        const isPhoneFilled = phoneInput ? phoneInput.value.trim().length > 0 : false;
        const isValid = isEmailFilled && isPhoneFilled;

        console.log('[Contacts] validate called. Email:', isEmailFilled, 'Phone:', isPhoneFilled, 'Valid:', isValid);

        this.valid = isValid;

        if (!isValid) {
            const errors: string[] = [];
            if (!isEmailFilled) errors.push('Введите email');
            if (!isPhoneFilled) errors.push('Введите телефон');
            this.errors = errors;
        } else {
            this.errors = [];
        }
    }
}

