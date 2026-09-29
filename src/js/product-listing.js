import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

async function init() {
  await loadHeaderFooter();

  const searchTerm = getParam("search");
  const category = getParam("category");
  const query = searchTerm || category;
  const dataSource = new ProductData();
  const element = document.querySelector(".product-list");
  const listing = new ProductList(query, dataSource, element);

  try {
    await listing.init();
    if (searchTerm) {
      document.querySelector(".title").textContent =
        `Search results for: ${searchTerm}`;
    }
    if (!element.children.length) {
      element.innerHTML =
        '<li class="no-results">No products found. Try another search.</li>';
    }
  } catch (error) {
    console.error("Unable to load products:", error);
    document.querySelector(".title").textContent = "Products unavailable";
    element.innerHTML =
      '<li class="no-results">Products could not be loaded. Please try again.</li>';
  }
}

init();
