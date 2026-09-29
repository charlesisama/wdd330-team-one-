// CheckoutProcess.mjs
import { getLocalStorage, setLocalStorage, alertMessage, removeAllAlerts } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";


const services = new ExternalServices();

function formDataToJSON(formElement) {
  // convert the form data to a JSON object
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  const simplifiedItems = items.map((item) => {
    console.log(item);
    return {
      id: item.Id,
      price: item.FinalPrice,
      name: item.Name,
      quantity: 1,
    };
  });
  return simplifiedItems;
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

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    const summaryElement = document.querySelector(
      `${this.outputSelector} #cartTotal`
    );
    const itemNumElement = document.querySelector(
      `${this.outputSelector} #num-items`
    );

    itemNumElement.innerText = this.list.length;

    if (this.list.length === 0) {
      this.itemTotal = 0;
      summaryElement.innerText = "$0.00";
      return;
    }

    // Calculate total by looking for FinalPrice on item or nested product
    this.itemTotal = this.list.reduce((sum, item) => {
      // Check item.FinalPrice OR item.product.FinalPrice
      const price =
        item.FinalPrice ??
        item.product?.FinalPrice ??
        item.ListPrice ??
        item.product?.ListPrice ??
        0;

      const qty = item.quantity ?? 1;

      return sum + (Number(price) * Number(qty));
    }, 0);

    summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);

    if (tax) tax.innerText = `$${this.tax.toFixed(2)}`;
    if (shipping) shipping.innerText = `$${this.shipping.toFixed(2)}`;
    if (orderTotal) orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout() {
    const formElement = document.forms["checkout"];
    removeAllAlerts();

    // 1. Validate form fields
    if (!formElement.checkValidity()) {
      formElement.reportValidity();
      alertMessage("Please fill in all required fields with valid input.");
      return;
    }

    // 2. Validate empty cart
    if (!this.list || this.list.length === 0) {
      alertMessage("Your shopping cart is empty.");
      return;
    }

    const order = formDataToJSON(formElement);

    // Ensure hidden orderDate is set
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.tax = this.tax.toFixed(2);
    order.shipping = this.shipping.toFixed(2);
    order.items = packageItems(this.list);

    try {
      const response = await services.checkout(order);

      // Clear cart on successful order placement
      setLocalStorage(this.key, []);

      // Redirect to a success / confirmation page (or show success banner)
      alertMessage("Order placed successfully! Redirecting...", true, 0);
      setTimeout(() => {
        window.location.href = "../checkout/success.html";
      }, 2000);

    } catch (err) {
      // 3. Catch and display server validation errors
      if (err.message && typeof err.message === "object") {
        for (const message in err.message) {
          alertMessage(`${message}: ${err.message[message]}`);
        }
      } else {
        alertMessage("There was an error processing your order. Please try again.");
      }
      console.error("Checkout Error:", err);
    }
  }
}