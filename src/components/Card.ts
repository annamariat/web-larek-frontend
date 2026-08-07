import {Component} from "./base/Component";
import {IProduct} from "../types";
import {bem, ensureElement} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void; 
}


type CardModifier = 'compact'| 'full'; 

export class Card extends Component <IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _category?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);


        this._category = container.querySelector('.card__category') ?? undefined;
        this._button = container.querySelector('.card__button') ?? undefined;
        this._image = container.querySelector('.card__image') ?? undefined;
        this._description = container.querySelector('.card__text') ?? undefined;

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick); 
            } else {
                container.addEventListener('click', actions.onClick); 
            }
        }
    }

    toggle(modifier: CardModifier) {
        this.toggleClass(bem('card', undefined, modifier).name);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string { 
        return this._title.textContent || ''; 
    }

    set price(value: number) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
        if (this._button) {
            this._button.disabled = !value;
        }
    }

set category(value: string) {
    if (this._category) {
      this.setText(this._category, value);
    } else {
      console.warn('Элемент .card__category не найден в карточке');
    }
  }


    
set image(value: string) {
    if (this._image) {
      this.setImage(this._image, value, this.title);
    } else {
      console.warn('Элемент .card__image не найден в карточке');
    }
  }
    
    

    set description(value: string) {
    if (this._description) {
      this.setText(this._description, value);
    } else {
      console.warn('Элемент .card__text не найден в карточке');
    }
  }

    setButtonText(text: string): void {
    if (this._button) {
        this.setText(this._button, text);
    }
}

    
} 

