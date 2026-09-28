import CheckoutProcess from "./CheckoutProcess.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();
const orderForm = document.querySelector("#checkoutForm");
const orderSummary = document.querySelector("#order-summary");
const order = new CheckoutProcess("so-cart", orderSummary);
order.init();

// Add event listeners to fire calculateOrderTotal when the user changes the zip code
document
  .querySelector("#zip")
  .addEventListener("blur", order.calculateOrderTotal.bind(order));

// listening for click on the button
document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();
  const isValid = orderForm.checkValidity();
  orderForm.reportValidity();

  if (isValid) {
    order.checkout(orderForm);
  }
});
