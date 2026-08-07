//модальное окошко с корзиной

/**
 * Компонент корзины.
 *
 * Особенности:
 * - использует шаблон #basket и cloneTemplate для инициализации DOM;
 * - через ensureElement находит .basket__list, .basket__price, .basket__button;
 * - set items обновляет список и обрабатывает случай «Корзина пуста»;
 * - set total форматирует сумму как «X синапсов»;
 * - при клике на кнопку эмитит событие order:open.
 *
 * Наследуется от View<IBasketView>, чтобы использовать:
 * - базовый setText для обновления текста;
 * - работу с контейнером;
 * - интеграцию с EventEmitter.
 */



import { View } from "../base/Component";
import { cloneTemplate, createElement, ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";

interface IBasketView {
    items: HTMLElement [];
    total: number;
}

export class Basket extends View<IBasketView> {
    static template = ensureElement<HTMLTemplateElement> ('#basket');

    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(events: EventEmitter) {
        super(events, cloneTemplate(Basket.template));

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = ensureElement<HTMLElement>('.basket__price', this.container);
    this._button = ensureElement<HTMLElement>('.basket__button', this.container);

       
        this._button.addEventListener('click', () => {
            events.emit('basket:checkout');
        });

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this._button.removeAttribute('disabled');
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста',
            }));
            
            this._button.setAttribute('disabled', 'disabled');
        
    }
}

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
}

