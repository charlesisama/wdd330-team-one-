import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    return `
    <li class="product-card">
      <a href="../product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h2 class="card__name">${product.Brand.Name}</h2>
        <h3 class="card__brand">${product.Name}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.dataSource.getData(this.category);

        // const availableIds = ["880RR", "985RF", "985PR", "344YJ"];

        // const availableProducts = list.filter((product) =>
        //     availableIds.includes(product.Id)
        // );

        this.renderList(list);
    }

    renderList(list) {
        renderListWithTemplate(
            productCardTemplate,
            this.listElement,
            list
        );
    }
}