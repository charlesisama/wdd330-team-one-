import { getLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

// takes the items currently stored in the cart (localstorage) and returns them in a simplified form.
function packageItems(items) {
    // convert the list of products from localStorage to the simpler form required for the checkout process.
    const simplifiedItems = items.map((item) => {
        return {
            "id": item.product.Id,
            "name": item.product.Name,
            "price": item.product.FinalPrice,
            "quantity": item.quantity
        };
    });
    return simplifiedItems;
}

// takes a form element and returns an object where the key is the "name" of the form input.
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

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
        // this.calculateOrderTotal();
    }

    calculateSubtotal() {
        let price = 0; 
        this.list.forEach((item) => {
            price += item.product.FinalPrice * item.quantity;
            // console.log(product.product.FinalPrice);
        })
        this.itemTotal = price;
        // console.log(subtotal);
        
        const numItems = document.querySelector('#num-items');
        const subtotal = document.querySelector('#subtotal');
        const itemsQuantities = this.list.map((item) => item.quantity);
        // console.log(itemsQuantities);

        numItems.innerHTML = `Items: ${itemsQuantities.reduce((quantity, item) => quantity + item)}`;
        subtotal.innerHTML = `Subtotal: $${this.itemTotal.toFixed(2)}`;
    }

    calculateOrderTotal() {
        this.tax = (this.itemTotal * 0.06);
        // console.log(this.list);
        this.shipping = 10 + (this.list.length - 1) * 2;
        this.orderTotal = this.itemTotal + this.tax + this.shipping;
        
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const tax = document.querySelector('#tax');
        const shipping = document.querySelector('#shipping');
        const total = document.querySelector('#total');

        tax.innerHTML = `Tax: $${this.tax.toFixed(2)}`;
        shipping.innerHTML = `Shipping: $${this.shipping.toFixed(2)}`;
        total.innerHTML = `Total: $${this.orderTotal.toFixed(2)}`;
    }

    async checkout(form) {
        // get the form element data by the form name
        // convert the form data to a JSON order object using the formDataToJSON function
        const order = formDataToJSON(form);
        // populate the JSON order object with the order Date, orderTotal, tax, shipping, and list of items
        order.orderDate = new Date().toISOString();
        order.orderTotal = this.orderTotal.toString();
        order.tax = this.tax.toString();
        order.shipping = this.shipping;
        order.items = packageItems(this.list);
        //console.log(order);
        // call the checkout method in the ExternalServices module and send it the JSON order data.
        try {
            const response = await services.checkout(order);
            localStorage.removeItem("so-cart");
            window.location.href = "./success.html";
            console.log(response);
        } catch (err) {
            console.log(err);
            Object.values(err.message).forEach((msg) => alertMessage(msg));
        }
    }
}