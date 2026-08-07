import './scss/styles.scss';

import { WebLarekApi } from './components/WebLarekAPI'; 
import { API_URL, CDN_URL } from './utils/constants'; 
import { cloneTemplate, ensureElement } from './utils/utils'; 
import { IOrder, IProduct, OrderForm } from './types'; 
import { Card } from './components/Card'; 
import { Modal } from './components/common/Modal'; 

import { EventEmitter } from './components/base/events'; 
import { AppData } from './components/AppData'; 
import { Page } from './components/Page'; 

import { Basket } from './components/common/Basket';
import { Success } from './components/common/Success'; 
import { Order } from './components/Order'; 
import { Contacts } from './components/Contacts'; 
import { OrderFormErrors } from './types';


const api = new WebLarekApi(CDN_URL,API_URL); 

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog'); 
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview'); 
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket'); 

const events = new EventEmitter();
const appData = new AppData(events);

const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));
const page = new Page(events, document.body);
const basket = new Basket(events);
const orderForm = new Order(events, cloneTemplate (ensureElement<HTMLTemplateElement> ('#order')));
const contactsForm = new Contacts(events, cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')));

//События модальных окон и навигации
events.on('order:open', () => {
    modal.render({
        content: orderForm.render({
            payment: 'card',
            address: '',
            valid: false,
            errors: []
        })
    });
});

events.on('basket:open', () => {
    modal.render({
        content: basket.render()
    });
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});


events.on('basket:checkout', () => {
    modal.close(); 
   
    events.emit('order:open');
});



events.on('contacts:submit', () => {
    console.log('[Index] START contacts:submit');

    const totalSum = appData.basket.items.reduce((acc, itemId) => {
        const item = appData.items.find(i => i.id === itemId);
        return acc + (item?.price || 0);
    }, 0);

    console.log('[Index] Calculated total sum:', totalSum);

    const orderPayload: IOrder = {
        payment: appData.order.payment,
        email: appData.order.email,
        phone: appData.order.phone,
        address: appData.order.address,
        total: totalSum,
        items: [...appData.basket.items],
    };

    console.log('[Index] Sending payload:', orderPayload);

    api.orderProducts(orderPayload)
        .then(result => {
            console.log('[Index] API success:', result);
            const success = new Success(cloneTemplate(ensureElement<HTMLTemplateElement>('#success')), {
                onClick: () => {
                    modal.close();
                    appData.clearBasket();
                    if (appData.items.length > 0) {
                        page.catalog = appData.items.map(item => {
                            const card = new Card(cloneTemplate(cardCatalogTemplate), {
                                onClick: () => events.emit('card:select', item),
                            });
                            return card.render(item);
                        });
                    }
                },
            });
            modal.render({ content: success.render(result) });
        })
        .catch(err => console.error('API error:', err));
});


events.on('order:submit', () => {
    console.log('[Index] order:submit triggered. Current valid state:', orderForm.valid);

    if (!orderForm.valid) {
        console.warn('[Index] Blocked transition: form is invalid!');
        return;
    }

    console.log('[Index] Transition to contacts...');
    modal.render({
        content: contactsForm.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
});


events.on('formErrors:change', (errors: OrderFormErrors) => {
    const { payment, address, email, phone } = errors;

    const orderErrors: string[] = [];
    const contactsErrors: string[] = [];

    if (payment) orderErrors.push(payment);
    if (address) orderErrors.push(address);
    
    if (email) contactsErrors.push(email);
    if (phone) contactsErrors.push(phone);

    orderForm.errors = orderErrors;
    contactsForm.errors = contactsErrors;
});


//события вида X.field:change
events.on(/^order\..*:change/, (data: { field: keyof OrderForm, value: string }) => {
    appData.setOrderField (data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof OrderForm, value: string }) =>{
    appData.setOrderField(data.field, data.value);
});



//События данных и каталога
events.on('items:change', (items: IProduct[]) => {
    page.catalog = items.map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render(item);
    });
});

events.on('card:select', (item: IProduct) => {
    appData.setPreview(item);
});

events.on('basket:change', () => {
    page.counter = appData.basket.items.length;

    basket.items = appData.basket.items.map(id => {
        const item = appData.items.find(item => item.id === id);
        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => appData.removeFromBasket(item!)
        });
        return card.render(item);
    });
    basket.total = appData.basket.total;
});

events.on('preview:change', (item: IProduct) => {
  if (item) {
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
      onClick: () => {
        if (appData.inBasket(item)) {
          appData.removeFromBasket(item);
        } else {
          appData.addToBasket(item);
        }
        card.setButtonText(appData.inBasket(item) ? 'Удалить из корзины' : 'В корзину');
      }
    });

    card.setButtonText(appData.inBasket(item) ? 'Удалить из корзины' : 'В корзину');

    modal.render({
      content: card.render(item)
    });
  } else {
    modal.close();
  }
});


const headerBasketBtn = document.querySelector('.header__basket') as HTMLButtonElement | null;

if (headerBasketBtn) {
    headerBasketBtn.addEventListener('click', () => {
        events.emit('basket:open');
    });
} else {
    console.warn('Кнопка корзины не найдена');
}



api.getProductList()
.then(appData.setItems.bind(appData))
.catch(err  => {
    console.error(err)
});

