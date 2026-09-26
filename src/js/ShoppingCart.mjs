import { renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
    // Support both wrapped { product, quantity } and flat product objects
    const product = item.product || item;
    const quantity = item.quantity || 1;
    const imageSrc = product.Images?.PrimarySmall || product.Image || "";
    const colorName = product.Colors?.[0]?.ColorName || "";

    return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${imageSrc}" alt="${product.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${product.Name}</h2>
    </a>
    <p class="cart-card__color">${colorName}</p>
    <p class="cart-card__quantity">qty: ${quantity}</p>
    <p class="cart-card__price">$${product.FinalPrice}</p>
  </li>`;
}

function cardTotalTemplate(total) {
    return `<h3 class="cart-total" id="cart-total">Total: $${total.toFixed(2)}</h3>`;
}

export default class ShoppingCart {
    constructor(dataSource, listElement, totalElement) {
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.totalElement = totalElement;
    }

    async init() {
        const cartItems = await this.dataSource;

        if (Array.isArray(cartItems) && cartItems.length > 0) {
            this.totalElement.classList.remove("hide");
            this.renderList(cartItems);
            const total = this.calculateTotal(cartItems);
            this.renderTotal(total);
        } else {
            this.totalElement.classList.add("hide");
            if (this.listElement) {
                this.listElement.innerHTML = "<p class=\"empty-cart\">Your cart is empty.</p>";
            }
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
        return items.reduce((accumulator, item) => {
            const product = item.product || item;
            const quantity = item.quantity || 1;
            return accumulator + (product.FinalPrice || 0) * quantity;
        }, 0);
    }

    renderTotal(total) {
        this.totalElement.innerHTML = cardTotalTemplate(total);
    }
}