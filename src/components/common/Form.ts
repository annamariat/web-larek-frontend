//для описания и работы с формами

import { View } from "../base/Component";
import { EventEmitter } from "../base/events";
import { ensureElement } from "../../utils/utils";

interface IFormState {
    valid?: boolean;      
    errors?: string[];    
}




export class Form<T> extends View<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    
    private _isValid: boolean = false;

    constructor(events: EventEmitter, protected container: HTMLFormElement) {
        super(events, container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }



    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value,
        });
    }

   
    get valid(): boolean {
        return this._isValid;
    }

    
    set valid(value: boolean) {
        this._isValid = value;
        this._submit.disabled = !value;
    }

    set errors(value: string[]) {
        this.setText(this._errors, value.length ? value.join('; ') : '');
    }

    render(state: Partial<T> & IFormState) {
    const { errors, ...inputs } = state;

    
    if (errors) {
        this.errors = errors;
    }
    Object.assign(this, inputs);
    return this.container;
}

}


