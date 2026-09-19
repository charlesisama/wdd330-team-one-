import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

async function init() {
  await loadHeaderFooter();

  const category = getParam("category");
  const dataSource = new ProductData();
  const element = document.querySelector(".product-list");
  const productList = new ProductList(category, dataSource, element);

  document.getElementById("list-header").textContent += category;

  productList.init();
}

init();