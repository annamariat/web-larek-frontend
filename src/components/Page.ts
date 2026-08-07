import { View } from './base/Component';
import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

interface IPage {
  title: string;
  content: HTMLElement[];
  locked: boolean;
  catalog: HTMLElement[];
  counter: number;
}

export class Page extends View<IPage> {
  protected _title: HTMLElement | null = null; 
  protected _catalog: HTMLElement | null = null;
  protected _counter: HTMLElement | null = null;

  private _locked: boolean = false;
  private _catalogItems: HTMLElement[] = [];
  private _counterValue: number = 0;
  private _titleValue: string = ''; 
  constructor(events: EventEmitter, container: HTMLElement) {
    super(events, container);

    try {
      this._title = ensureElement<HTMLElement>('.page__title', this.container);
      this._catalog = ensureElement<HTMLElement>('main.gallery', this.container);
      this._counter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    } catch (error) {
      console.warn('Не все элементы страницы найдены:', error);
    }
  }

  

  set title(value: string) {
    this._titleValue = value;
    if (this._title) {
      this.setText(this._title, value);
    }
  }

  get title(): string {
    return this._titleValue;
  }

  set catalog(items: HTMLElement[]) {
    this._catalogItems = items;
    if (this._catalog) {
      this._catalog.replaceChildren(...items);
    } else {
      console.warn('Элемент main.gallery не найден — не могу обновить каталог.');
    }
  }

  get catalog(): HTMLElement[] {
    return this._catalogItems;
  }

  set counter(value: number) {
    this._counterValue = value;
   
    if (this._counter) {
      if (value > 0) {
        this.setText(this._counter, String(value));
        this._counter.classList.remove('hidden');
      } else {
        this._counter.classList.add('hidden');
      }
    }
  }

  get counter(): number {
    return this._counterValue;
  }

  set locked(value: boolean) {
    this._locked = value;
    if (value) {
      this.container.classList.add('page_locked');
    } else {
      this.container.classList.remove('page_locked');
    }
  }

  get locked(): boolean {
    return this._locked;
  }

  
  render(data?: IPage | undefined): HTMLElement {
    if (!data) {
      return this.container;
    }

    
    if ('title' in data) {
      this.title = data.title;
    }
    if ('catalog' in data) {
      
      this.catalog = data.catalog;
    }
    if ('counter' in data) {
      this.counter = data.counter;
    }
    if ('locked' in data) {
      this.locked = data.locked;
    }

    return this.container;
  }
}