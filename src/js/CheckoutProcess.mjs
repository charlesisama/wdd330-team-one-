import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    async init() {
        this.list = await getLocalStorage(this.key);
        this.calculateSubtotal();
        this.calculateOrderTotal();
        this.displayOrderTotals();
    }

    calculateSubtotal() {
        let subtotal = 0; 
        this.list.forEach((item) => {
            subtotal += item.product.FinalPrice * item.quantity;
            // console.log(product.product.FinalPrice);
        })
        this.itemTotal = subtotal;
        // console.log(subtotal);
    }

    calculateOrderTotal() {
        this.tax = (this.itemTotal * 0.06);
        // console.log(this.list);
        this.shipping = 10 + (this.list.length - 1) * 2;
        this.orderTotal = this.itemTotal + this.tax + this.shipping;
    }

    displayOrderTotals() {
        const subtotal = document.querySelector('#subtotal');
        const tax = document.querySelector('#tax');
        const shipping = document.querySelector('#shipping');
        const total = document.querySelector('#total');

        subtotal.innerHTML = `Subtotal: ${this.itemTotal.toFixed(2)}`;
        tax.innerHTML = `Tax: ${this.tax.toFixed(2)}`;
        shipping.innerHTML = `Shipping: ${this.shipping.toFixed(2)}`;
        total.innerHTML = `Total: ${this.orderTotal.toFixed(2)}`;
    }
}