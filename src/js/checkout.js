import CheckoutProcess from "./CheckoutProcess.mjs";
import { loadHeaderFooter } from "./utils.mjs";

async function init() {
    await loadHeaderFooter();
    const orderSummary = document.querySelector('#order-summary')
    const checkout = new CheckoutProcess('so-cart', orderSummary);
    checkout.init();
}

init();