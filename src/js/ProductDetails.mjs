import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        this.product = await this.dataSource.findProductById(this.productId);
        // the product details are needed before rendering the HTML
        this.renderProductDetails();
        // once the HTML is rendered, add a listener to the Add to Cart button
        // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on "this" to understand why.
        document
            .getElementById("addToCart")
            .addEventListener("click", this.addProductToCart.bind(this));
    }

    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];
        // console.log(cartItems);
        // Check if the item is in already added and store the item in a variable if so
        const itemAlreadyInCart = cartItems.find(item => item.product.Id === this.productId);
        // If the item exists, modify the quantity
        if(itemAlreadyInCart) {
            itemAlreadyInCart.quantity ++;
            // console.log("already in cart");
        } else {
            // If item doesn't exist, add it along with quantity of "1"
            cartItems.push({"product": this.product, "quantity": 1});
            // console.log("new item added");
        };

        setLocalStorage("so-cart", cartItems);
        console.log(cartItems);
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
    document.querySelector("h2").textContent = product.Category.charAt(0).toUpperCase() + product.Category.slice(1);
    document.querySelector("h3").textContent = product.NameWithoutBrand;

    const backToProducts = document.getElementById("backToProducts");
    backToProducts.href += `${product.Category}`;

    const productImage = document.getElementById("productImage");
    productImage.src = product.Images.PrimaryLarge;
    productImage.alt = product.NameWithoutBrand;

    const regularPrice = product.SuggestedRetailPrice;
    const salePrice = product.FinalPrice;

    document.getElementById("productRetailPrice").textContent = formatPrice(regularPrice);
    document.getElementById("productPrice").textContent = formatPrice(salePrice);

    // Calculate the discount percentage and display it
    const discount = Math.round(((regularPrice - salePrice) / regularPrice) * 100);
    document.getElementById("productDiscount").textContent =
        discount > 0 ? `Save ${discount}%` : "";
    document.getElementById("productColor").textContent = product.Colors[0].ColorName;
    document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

    document.getElementById("addToCart").dataset.id = product.Id;
}

function formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
}