import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".checkout-summary");
order.init();

// Calculate totals initially on load
order.calculateOrderTotal();

// Re-calculate when zip code loses focus
const zipInput = document.querySelector("#zip");
if (zipInput) {
  zipInput.addEventListener("blur", order.calculateOrderTotal.bind(order));
}

// Form submission handler
const checkoutBtn = document.querySelector("#checkoutSubmit");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    order.checkout();
  });
}
