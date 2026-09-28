import { getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter } from "./utils.mjs";

async function init() {
  await loadHeaderFooter();

  const dataSource = new ExternalServices();
  const productId = getParam("product");

  const product = new ProductDetails(productId, dataSource);

  product.init();
}

init();

// // add listener to Add to Cart button
// document
//   .getElementById("addToCart")
//   .addEventListener("click", addToCartHandler);
