import { renderListWithTemplate, renderWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
    const newItem = `<li class="cart-card divider">
            <a href="#" class="cart-card__image">
                <img
                src="${item.product.Images.PrimarySmall}"
                alt="${item.product.Name}"
                />
            </a>
            <a href="#">
                <h2 class="card__name">${item.product.Name}</h2>
            </a>
            <p class="cart-card__color">${item.product.Colors[0].ColorName}</p>
            <p class="cart-card__quantity">x ${item.quantity}</p>
            <p class="cart-card__price">$${item.product.FinalPrice}</p>
        </li>`;

  return newItem;
};

function cardTotalTemplate(total) {
    const cardTotal = `<h3 class="cart-total" id="cart-total">Total: $${total.toFixed(2)}</h3>`;
    
    return cardTotal;
};
//     return newItem;
// }

export default class ShoppingCart {
    constructor(dataSource, listElement, totalElement) {
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.totalElement = totalElement;
    }

    async init() {
        const cartItems = await this.dataSource;

        if(cartItems != null) {
            this.totalElement.classList.toggle("hide");
            this.renderList(cartItems);
            const total = this.calculateTotal(cartItems);
            this.renderTotal(total);
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
            return accumulator + item.product.FinalPrice * item.quantity;
        }, 0);
        return total;
    }

    renderTotal(total) {
        renderWithTemplate(cardTotalTemplate(total), this.totalElement);
    }
}