import { setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");
const productId = new URLSearchParams(window.location.search).get("products");

if (productId) {
  const productDetails = new ProductDetails(productId, dataSource);
  productDetails.init();
} else {
  const addToCartButton = document.getElementById("addToCart");

  if (addToCartButton?.dataset.id) {
    addToCartButton.addEventListener("click", async () => {
      const product = await dataSource.findProductById(addToCartButton.dataset.id);
      setLocalStorage("so-cart", product);
    });
  } else {
    document.querySelector(".product-detail").innerHTML =
      "<p>We couldn't find that product. <a href='../index.html'>Browse tents</a></p>";
  }
}