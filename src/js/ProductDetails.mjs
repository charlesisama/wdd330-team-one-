import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();

        const addToCartBtn = document.getElementById("addToCart");
        if (addToCartBtn) {
            addToCartBtn.addEventListener("click", () => {
                this.addToCart();

                // 1. Change button text temporarily
                const originalText = addToCartBtn.textContent;
                addToCartBtn.textContent = "Product Added to Cart ✅ !";
                addToCartBtn.classList.add("added");

                setTimeout(() => {
                    addToCartBtn.textContent = originalText;
                    addToCartBtn.classList.remove("added");
                }, 5000);

                // 2. Display non-blocking toast notification
                showToast(`${this.product.NameWithoutBrand || "Product"} added to cart!`);
            });
        }
    }

    addToCart() {
        let cart = getLocalStorage("so-cart") || [];
        if (!Array.isArray(cart)) cart = [];

        const existingIndex = cart.findIndex(
            (item) => (item.product?.Id || item.Id) === this.product.Id
        );

        if (existingIndex > -1) {
            cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
        } else {
            cart.push({ product: this.product, quantity: 1 });
        }

        setLocalStorage("so-cart", cart);
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

// Toast notification helper function
function showToast(message) {
    // Remove existing toast if clicked quickly
    const existingToast = document.querySelector(".toast-notification");
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.textContent = message;

    document.body.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    // Automatically hide and remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function productDetailsTemplate(product) {
    if (!product) return;

    const category = product.Category || "";
    document.querySelector("h2").textContent =
        category ? category.charAt(0).toUpperCase() + category.slice(1) : "";

    document.querySelector("h3").textContent = product.NameWithoutBrand || product.Name || "";

    const backToProducts = document.getElementById("backToProducts");
    if (backToProducts) {
        backToProducts.href += `${category}`;
    }

    const productImage = document.getElementById("productImage");
    if (productImage) {
        productImage.src = product.Images?.PrimaryLarge || product.Image || "";
        productImage.alt = product.NameWithoutBrand || product.Name || "";
    }

    const regularPrice = product.SuggestedRetailPrice || product.FinalPrice || 0;
    const salePrice = product.FinalPrice || 0;

    document.getElementById("productRetailPrice").textContent = formatPrice(regularPrice);
    document.getElementById("productPrice").textContent = formatPrice(salePrice);

    const discount = regularPrice > salePrice
        ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
        : 0;

    document.getElementById("productDiscount").textContent =
        discount > 0 ? `Save ${discount}%` : "";

    const colorName = product.Colors?.[0]?.ColorName || "";
    document.getElementById("productColor").textContent = colorName;
    document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple || "";

    document.getElementById("addToCart").dataset.id = product.Id;
}

function formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
}