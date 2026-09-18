import { renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
            <a href="#" class="cart-card__image">
                <img
                src="${item.Image}"
                alt="${item.Name}"
                />
            </a>
            <a href="#">
                <h2 class="card__name">${item.Name}</h2>
            </a>
            <p class="cart-card__color">${item.Colors[0].ColorName}</p>
            <p class="cart-card__quantity">qty: 1</p>
            <p class="cart-card__price">$${item.FinalPrice}</p>
        </li>`;

  return newItem;
}

export default class ShoppingCart {
    constructor(dataSource, listElement, totalElement) {
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.totalElement = totalElement;
    }

    async init() {
        const cartItems = await this.dataSource;

        if(cartItems != null) {
            this.renderList(cartItems);
            const total = this.calculateTotal(cartItems);
            this.renderTotal(total, this.totalElement);
        }
    }

    renderList(items) {
        renderListWithTemplate(
            cartItemTemplate,
            this.listElement,
            items
        );
    }

    calculateTotal(items) {
        const total = items.reduce((accumulator, item) => {
            return accumulator + item.FinalPrice;
        }, 0);
        return total;
    }

    renderTotal(total) {
        this.totalElement.textContent = `Total: $${total.toFixed(2)}`;
    }
}