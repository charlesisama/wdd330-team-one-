import { loadHeaderFooter } from "./utils.mjs";

async function init() {
  await loadHeaderFooter();

  // const dataSource = new ExternalServices("tents");

  // const element = document.querySelector(".product-list");

  // const productList = new ProductList("Tents", dataSource, element);

  // productList.init();
}

init();
