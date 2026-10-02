import { renderListWithTemplate, setLocalStorage, showCartCount } from "./utils.mjs";

function cartItemTemplate(item) {
    // Support both wrapped { product, quantity } and flat product objects
    const product = item.product || item;
    const quantity = item.quantity || 1;
    const imageSrc = product.Images?.PrimarySmall || product.Image || "";
    const colorName = product.Colors?.[0]?.ColorName || "";
    const id = product.Id || item.Id || "";

    return `<li class="cart-card divider">
    <span class="cart-card__remove" data-id="${id}">&times;</span>
    <a href="/product_pages/?product=${product.Id}" class="cart-card__image">
      <img src="${imageSrc}" alt="${product.Name}" />
    </a>
    <a href="/product_pages/?product=${product.Id}">
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
        this.key = "so-cart";
    }

    async init() {
        const cartItems = this.dataSource;

        if (Array.isArray(cartItems) && cartItems.length > 0) {
            this.totalElement.classList.remove("hide");
            this.renderList(cartItems);
            const total = this.calculateTotal(cartItems);
            this.renderTotal(total);
            this.attachRemoveListeners();
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
            items,
            "afterbegin",
            true
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

    attachRemoveListeners() {
        const removeButtons = this.listElement.querySelectorAll(".cart-card__remove");
        removeButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const idToRemove = event.target.getAttribute("data-id");
                this.removeItem(idToRemove);
            });
        });
    }

    removeItem(id) {
        let cartItems = this.dataSource || [];

        // Find index of first item matching ID
        const index = cartItems.findIndex((item) => {
            const productId = item.Id || item.product?.Id;
            return productId === id;
        });

        if (index !== -1) {
            cartItems.splice(index, 1);
            setLocalStorage(this.key, cartItems);
            this.dataSource = cartItems; // Update local reference
            showCartCount(); // Update cart count in header
            this.init(); // Re-render cart and recalculate totals
        }
    }
}