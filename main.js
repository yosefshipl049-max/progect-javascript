// =====================================
// PRODUCTS DATA
// =====================================

const product_1 = [
    {
        id: 1,
        image: '1',
        discount: '-25%',
        Category: 'vegetables',
        Type: 'Tomatoes',
        price: 50,
        instead: 65
    },
    {
        id: 2,
        image: '2',
        discount: '-27%',
        Category: 'fruits',
        Type: 'Tomatoes',
        price: 60,
        instead: 75
    },
    {
        id: 3,
        image: '3',
        discount: '-22%',
        Category: 'vegetables',
        Type: 'Organic Cabbage',
        price: 62,
        instead: 75
    },
    {
        id: 4,
        image: '4',
        discount: '-25%',
        Category: 'food items',
        Type: 'Potatoes',
        price: 60,
        instead: 80
    },
    {
        id: 5,
        image: '5',
        discount: '-25%',
        Category: 'vegetables',
        Type: 'Pepper',
        price: 60,
        instead: 80
    },
    {
        id: 6,
        image: '6',
        discount: '-22%',
        Category: 'carbohydrates',
        Type: 'Corn',
        price: 60,
        instead: 80
    },
    {
        id: 7,
        image: '7',
        discount: '-25%',
        Category: 'carbohydrates',
        Type: 'Sweet Corn',
        price: 60,
        instead: 80
    },
    {
        id: 8,
        image: '8',
        discount: '-27%',
        Category: 'carbohydrates',
        Type: 'Fresh Corn',
        price: 65,
        instead: 80
    }
];


// =====================================
// GLOBAL ELEMENTS
// =====================================

const productContainer = document.querySelector('.Products .container');
const filterButtons = document.querySelectorAll('#product-filters button');

const heroSearchInput = document.querySelector('#hero-search-input');
const navSearchInput = document.querySelector('#nav-search-input');
const heroSearchForm = document.querySelector('#hero-search');
const navSearchForm = document.querySelector('#search-box');

let currentFilter = 'all';
let currentSearch = '';


// =====================================
// LOCAL STORAGE
// =====================================

function getStorageData(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

let cart = getStorageData('organicCart');
let wishlist = getStorageData('organicWishlist');

function saveCart() {
    localStorage.setItem('organicCart', JSON.stringify(cart));
}

function saveWishlist() {
    localStorage.setItem('organicWishlist', JSON.stringify(wishlist));
}


// =====================================
// TOAST MESSAGE
// =====================================

const toast = document.querySelector('#toast');
const toastMessage = document.querySelector('#toast-message');

let toastTimer;

function showToast(message) {
    toastMessage.textContent = message;

    toast.classList.add('active');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {
        toast.classList.remove('active');
    }, 2500);
}


// =====================================
// GET PRODUCT BY ID
// =====================================

function getProduct(id) {
    return product_1.find(function (product) {
        return product.id === Number(id);
    });
}

function getProductImage(product) {
    return `image/product${product.image}.png`;
}

function formatPrice(price) {
    return `$${Number(price).toFixed(2)}`;
}


// =====================================
// RENDER PRODUCTS
// =====================================

function renderProducts() {

    let filteredProducts = product_1.filter(function (product) {

        let matchesCategory =
            currentFilter === 'all' ||
            product.Category.toLowerCase() === currentFilter;

        let matchesSearch =
            product.Type.toLowerCase().includes(currentSearch.toLowerCase()) ||
            product.Category.toLowerCase().includes(currentSearch.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    productContainer.innerHTML = '';

    if (filteredProducts.length === 0) {

        productContainer.innerHTML = `
            <div class="empty-products">
                <i class="fa-solid fa-box-open"></i>
                <h3>No Products Found</h3>
                <p>Try another search or choose another category.</p>
            </div>
        `;

        return;
    }

    filteredProducts.forEach(function (product, index) {

        let nextProduct = filteredProducts[(index + 1) % filteredProducts.length];

        let isFavorite = wishlist.some(function (item) {
            return item.id === product.id;
        });

        productContainer.innerHTML += `
            <div class="card" data-id="${product.id}">

                <div class="content">

                    <img
                        class="main-image"
                        src="${getProductImage(product)}"
                        alt="${product.Type}"
                    >

                    <img
                        class="hover-image"
                        src="${getProductImage(nextProduct)}"
                        alt="${nextProduct.Type}"
                    >

                    <div class="top-card">
                        <span>${product.Category}</span>
                        <strong>${product.discount}</strong>
                    </div>

                    <div class="down-card">

                        <p>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-regular fa-star" id="active"></i>
                            (4.0)
                        </p>

                        <h3>${product.Type}</h3>

                        <strong>
                            ${formatPrice(product.price)}
                            <del>${formatPrice(product.instead)}</del>
                        </strong>

                    </div>

                    <div class="hover-icons">

                        <button
                            type="button"
                            class="add-cart-button"
                            data-action="add-cart"
                            data-id="${product.id}"
                            aria-label="Add to cart"
                            title="Add to cart"
                        >
                            <i class="fa-solid fa-basket-shopping"></i>
                        </button>

                        <button
                            type="button"
                            class="view-product-button"
                            data-action="view-product"
                            data-id="${product.id}"
                            aria-label="View product"
                            title="View product"
                        >
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </button>

                        <button
                            type="button"
                            class="favorite-button ${isFavorite ? 'is-favorite' : ''}"
                            data-action="favorite"
                            data-id="${product.id}"
                            aria-label="Add to wishlist"
                            title="Add to wishlist"
                        >
                            <i class="${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>

                    </div>

                </div>
            </div>
        `;
    });
}

renderProducts();


// =====================================
// PRODUCT FILTERS
// =====================================

filterButtons.forEach(function (button) {

    button.addEventListener('click', function () {

        filterButtons.forEach(function (item) {
            item.classList.remove('active');
        });

        this.classList.add('active');

        currentFilter = this.dataset.filter;

        renderProducts();
    });
});


// =====================================
// SEARCH PRODUCTS
// =====================================

function searchProducts(value) {

    currentSearch = value.trim();

    renderProducts();

    document.querySelector('#search-results-info').textContent =
        currentSearch
            ? `Search results for: ${currentSearch}`
            : '';
}

heroSearchInput.addEventListener('input', function () {

    navSearchInput.value = this.value;

    searchProducts(this.value);
});

navSearchInput.addEventListener('input', function () {

    heroSearchInput.value = this.value;

    searchProducts(this.value);
});

heroSearchForm.addEventListener('submit', function (event) {
    event.preventDefault();

    searchProducts(heroSearchInput.value);

    document.querySelector('#products-section').scrollIntoView({
        behavior: 'smooth'
    });
});

navSearchForm.addEventListener('submit', function (event) {
    event.preventDefault();

    searchProducts(navSearchInput.value);

    document.querySelector('#products-section').scrollIntoView({
        behavior: 'smooth'
    });
});


// =====================================
// HERO CATEGORY DROPDOWN
// =====================================

const categoryButton = document.querySelector('#btn');
const categoryMenu = document.querySelector('.con');
const selectedCategory = document.querySelector('#selected-category');

categoryButton.addEventListener('click', function () {
    categoryMenu.classList.toggle('active');
});

categoryMenu.querySelectorAll('p').forEach(function (item) {

    item.addEventListener('click', function () {

        const category = this.dataset.category;

        selectedCategory.textContent = this.textContent;

        categoryMenu.classList.remove('active');

        currentFilter = category;

        filterButtons.forEach(function (button) {
            button.classList.toggle(
                'active',
                button.dataset.filter === category
            );
        });

        renderProducts();

        document.querySelector('#products-section').scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.addEventListener('click', function (event) {

    if (!event.target.closest('.category-select')) {
        categoryMenu.classList.remove('active');
    }

});


// =====================================
// ADD TO CART
// =====================================

function addToCart(id) {

    const product = getProduct(id);

    if (!product) return;

    let existingProduct = cart.find(function (item) {
        return item.id === product.id;
    });

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
    showToast(`${product.Type} added to your cart`);
}


// =====================================
// REMOVE FROM CART
// =====================================

function removeFromCart(id) {

    cart = cart.filter(function (item) {
        return item.id !== Number(id);
    });

    saveCart();
    renderCart();

    showToast('Product removed from cart');
}


// =====================================
// CHANGE PRODUCT QUANTITY
// =====================================

function changeQuantity(id, amount) {

    let item = cart.find(function (product) {
        return product.id === Number(id);
    });

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeFromCart(id);
        return;
    }

    saveCart();
    renderCart();
}


// =====================================
// RENDER CART
// =====================================

const cartItemsContainer = document.querySelector('#cart-items');
const cartCount = document.querySelector('#cart-count');
const cartTotal = document.querySelector('#cart-total');

function renderCart() {

    cartItemsContainer.innerHTML = '';

    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach(function (item) {

        const product = getProduct(item.id);

        if (!product) return;

        totalQuantity += item.quantity;
        totalPrice += product.price * item.quantity;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">

                <img src="${getProductImage(product)}" alt="${product.Type}">

                <div class="item-info">
                    <h4>${product.Type}</h4>
                    <strong>${formatPrice(product.price)}</strong>

                    <div class="quantity-control">

                        <button
                            type="button"
                            data-action="decrease"
                            data-id="${product.id}"
                        >-</button>

                        <span>${item.quantity}</span>

                        <button
                            type="button"
                            data-action="increase"
                            data-id="${product.id}"
                        >+</button>

                    </div>
                </div>

                <button
                    type="button"
                    class="remove-item"
                    data-action="remove-cart"
                    data-id="${product.id}"
                    aria-label="Remove product"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>
        `;
    });

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatPrice(totalPrice);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-message">
                <i class="fa-solid fa-bag-shopping"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to your cart.</p>
            </div>
        `;
    }
}

renderCart();


// =====================================
// WISHLIST
// =====================================

function toggleWishlist(id) {

    const product = getProduct(id);

    if (!product) return;

    const exists = wishlist.some(function (item) {
        return item.id === product.id;
    });

    if (exists) {

        wishlist = wishlist.filter(function (item) {
            return item.id !== product.id;
        });

        showToast(`${product.Type} removed from wishlist`);

    } else {

        wishlist.push({
            id: product.id
        });

        showToast(`${product.Type} added to your wishlist`);
    }

    saveWishlist();
    renderWishlist();
    renderProducts();
}


// =====================================
// RENDER WISHLIST
// =====================================

const wishlistItemsContainer = document.querySelector('#wishlist-items');
const wishlistCount = document.querySelector('#wishlist-count');

function renderWishlist() {

    wishlistItemsContainer.innerHTML = '';

    wishlistCount.textContent = wishlist.length;

    wishlist.forEach(function (item) {

        const product = getProduct(item.id);

        if (!product) return;

        wishlistItemsContainer.innerHTML += `
            <div class="wishlist-item">

                <img src="${getProductImage(product)}" alt="${product.Type}">

                <div class="item-info">
                    <h4>${product.Type}</h4>
                    <strong>${formatPrice(product.price)}</strong>
                </div>

                <button
                    type="button"
                    class="remove-item"
                    data-action="remove-wishlist"
                    data-id="${product.id}"
                    aria-label="Remove from wishlist"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>
        `;
    });

    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = `
            <div class="empty-message">
                <i class="fa-regular fa-heart"></i>
                <h3>Your wishlist is empty</h3>
                <p>Save your favorite products here.</p>
            </div>
        `;
    }
}

renderWishlist();


// =====================================
// PRODUCT DETAILS MODAL
// =====================================

const productModal = document.querySelector('#product-modal');
const modalContent = document.querySelector('#modal-product-content');
const modalClose = document.querySelector('#modal-close');

function openProductDetails(id) {

    const product = getProduct(id);

    if (!product) return;

    modalContent.innerHTML = `
        <div class="modal-product">

            <img src="${getProductImage(product)}" alt="${product.Type}">

            <div class="details">

                <span>${product.Category}</span>

                <h2>${product.Type}</h2>

                <p>
                    Discover this fresh product from our organic store.
                    Add it to your shopping cart or save it to your wishlist.
                </p>

                <strong>
                    ${formatPrice(product.price)}
                    <del>${formatPrice(product.instead)}</del>
                </strong>

                <button
                    type="button"
                    class="modal-add-cart"
                    data-action="add-cart"
                    data-id="${product.id}"
                >
                    <i class="fa-solid fa-basket-shopping"></i>
                    Add To Cart
                </button>

            </div>

        </div>
    `;

    productModal.classList.add('active');
    document.body.classList.add('no-scroll');
}

function closeProductDetails() {
    productModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

modalClose.addEventListener('click', closeProductDetails);

productModal.addEventListener('click', function (event) {

    if (event.target === productModal) {
        closeProductDetails();
    }

});


// =====================================
// EVENT DELEGATION FOR PRODUCT BUTTONS
// =====================================

document.addEventListener('click', function (event) {

    const button = event.target.closest('[data-action]');

    if (!button) return;

    const action = button.dataset.action;
    const id = Number(button.dataset.id);

    if (action === 'add-cart') {
        addToCart(id);
    }

    if (action === 'favorite') {
        toggleWishlist(id);
    }

    if (action === 'view-product') {
        openProductDetails(id);
    }

    if (action === 'increase') {
        changeQuantity(id, 1);
    }

    if (action === 'decrease') {
        changeQuantity(id, -1);
    }

    if (action === 'remove-cart') {
        removeFromCart(id);
    }

    if (action === 'remove-wishlist') {

        wishlist = wishlist.filter(function (item) {
            return item.id !== id;
        });

        saveWishlist();
        renderWishlist();
        renderProducts();

        showToast('Product removed from wishlist');
    }

});


// =====================================
// CART AND WISHLIST PANELS
// =====================================

const cartPanel = document.querySelector('#cart-panel');
const wishlistPanel = document.querySelector('#wishlist-panel');

const cartOverlay = document.querySelector('#cart-overlay');
const wishlistOverlay = document.querySelector('#wishlist-overlay');

const cartLink = document.querySelector('#cart-link');
const wishlistLink = document.querySelector('#wishlist-link');

function openPanel(panel, overlay) {

    closeAllPanels();

    panel.classList.add('active');
    overlay.classList.add('active');

    document.body.classList.add('no-scroll');
}

function closePanel(panel, overlay) {

    panel.classList.remove('active');
    overlay.classList.remove('active');

    document.body.classList.remove('no-scroll');
}

function closeAllPanels() {

    cartPanel.classList.remove('active');
    wishlistPanel.classList.remove('active');

    cartOverlay.classList.remove('active');
    wishlistOverlay.classList.remove('active');

    document.body.classList.remove('no-scroll');
}

cartLink.addEventListener('click', function (event) {
    event.preventDefault();
    openPanel(cartPanel, cartOverlay);
});

wishlistLink.addEventListener('click', function (event) {
    event.preventDefault();
    openPanel(wishlistPanel, wishlistOverlay);
});

cartOverlay.addEventListener('click', closeAllPanels);
wishlistOverlay.addEventListener('click', closeAllPanels);

document.querySelectorAll('.close-panel').forEach(function (button) {

    button.addEventListener('click', function () {

        const panelId = this.dataset.close;

        if (panelId === 'cart-panel') {
            closePanel(cartPanel, cartOverlay);
        }

        if (panelId === 'wishlist-panel') {
            closePanel(wishlistPanel, wishlistOverlay);
        }
    });

});

document.querySelector('#cart-page-link').addEventListener('click', function (event) {
    event.preventDefault();
    openPanel(cartPanel, cartOverlay);
});

document.querySelector('#wishlist-page-link').addEventListener('click', function (event) {
    event.preventDefault();
    openPanel(wishlistPanel, wishlistOverlay);
});


// =====================================
// CLEAR CART
// =====================================

document.querySelector('#clear-cart').addEventListener('click', function () {

    if (cart.length === 0) {
        showToast('Your cart is already empty');
        return;
    }

    cart = [];

    saveCart();
    renderCart();

    showToast('Your cart has been cleared');
});


// =====================================
// CHECKOUT BUTTON
// =====================================

document.querySelector('.checkout-button').addEventListener('click', function () {

    if (cart.length === 0) {
        showToast('Your cart is empty');
        return;
    }

    showToast('Checkout is not connected yet');
});


// =====================================
// MOBILE NAVBAR
// =====================================

const menuButton = document.querySelector('#menu-button');
const navbarContent = document.querySelector('#navbar-content');

menuButton.addEventListener('click', function () {

    navbarContent.classList.toggle('active');

    const icon = this.querySelector('i');

    if (navbarContent.classList.contains('active')) {
        icon.classList.replace('fa-bars', 'fa-xmark');
    } else {
        icon.classList.replace('fa-xmark', 'fa-bars');
    }
});


// =====================================
// FRESH CATEGORIES
// =====================================

const freshCategories = [
    {
        image: 'image/ctg_icon1.png',
        name: 'All Fresh',
        number: 30,
        filter: 'all'
    },
    {
        image: 'image/ctg_icon2.png',
        name: 'Fresh Products',
        number: 30,
        filter: 'all'
    },
    {
        image: 'image/ctg_icon3.png',
        name: 'Beverages',
        number: 30,
        filter: 'all'
    },
    {
        image: 'image/ctg_icon4.png',
        name: 'Babies & Kids',
        number: 30,
        filter: 'all'
    },
    {
        image: 'image/ctg_icon5.png',
        name: 'Frozen Foods',
        number: 30,
        filter: 'all'
    }
];

const freshCategoriesContainer = document.querySelector('#fresh-categories');

freshCategories.forEach(function (category, index) {

    freshCategoriesContainer.innerHTML += `
        <div class="${index === 0 ? 'active' : ''}"
             data-fresh-filter="${category.filter}">

            <img class="img" src="${category.image}" alt="">

            <p>${category.name}</p>

            <span>${category.number}</span>

        </div>
    `;
});


// =====================================
// FRESH PRODUCTS
// =====================================

const freshProducts = [
    {
        image: 'image/cat6.png',
        category: 'Fresh',
        name: 'Organic Cabbage',
        price: '50.00',
        instead: '65.00'
    },
    {
        image: 'image/cat7.png',
        category: 'Fresh',
        name: 'Organic Cabbage',
        price: '50.00',
        instead: '65.00'
    },
    {
        image: 'image/cat8.png',
        category: 'Fresh',
        name: 'Organic Cabbage',
        price: '50.00',
        instead: '65.00'
    },
    {
        image: 'image/cat9.png',
        category: 'Fresh',
        name: 'Organic Cabbage',
        price: '50.00',
        instead: '65.00'
    },
    {
        image: 'image/cat10.png',
        category: 'Fresh',
        name: 'Organic Cabbage',
        price: '50.00',
        instead: '65.00'
    },
    {
        image: 'image/cat11.png',
        category: 'Fresh',
        name: 'Organic Cabbage',
        price: '50.00',
        instead: '65.00'
    }
];

const freshProductsContainer = document.querySelector('#fresh-products');

function renderFreshProducts() {

    freshProductsContainer.innerHTML = '';

    freshProducts.forEach(function (product) {

        freshProductsContainer.innerHTML += `
            <div class="card">

                <div class="data2">
                    <img src="${product.image}" alt="${product.name}">
                </div>

                <div class="content">

                    <span>${product.category}</span>

                    <p>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                        (4.0)
                    </p>

                    <h3>${product.name}</h3>

                    <strong>
                        $${product.price}
                        <del>$${product.instead}</del>
                    </strong>

                </div>

            </div>
        `;
    });
}

renderFreshProducts();


// =====================================
// FRESH CATEGORY CLICK
// =====================================

freshCategoriesContainer.addEventListener('click', function (event) {

    const categoryCard = event.target.closest('[data-fresh-filter]');

    if (!categoryCard) return;

    freshCategoriesContainer.querySelectorAll('[data-fresh-filter]').forEach(function (item) {
        item.classList.remove('active');
    });

    categoryCard.classList.add('active');

    renderFreshProducts();
});


// =====================================
// CATEGORIES SLIDER
// =====================================

const sliderProducts = [
    { image: 'image/cat1.png', content: 'Awesome Broccoli' },
    { image: 'image/cat2.png', content: 'Fruits & Vegetables' },
    { image: 'image/cat3.png', content: 'Grocery & Staples' },
    { image: 'image/cat4.png', content: 'Health & Wellness' },
    { image: 'image/cat5.png', content: 'Package & Foods' },
    { image: 'image/cat3.png', content: 'Package & Foods' },
    { image: 'image/cat2.png', content: 'Fresh Products' }
];

const slider = document.querySelector('.slider');

sliderProducts.forEach(function (item) {

    slider.innerHTML += `
        <div class="card">
            <div>
                <img src="${item.image}" alt="${item.content}">
                <p>${item.content}</p>
            </div>
        </div>
    `;
});


// =====================================
// SLICK INITIALIZATION
// =====================================

$(document).ready(function () {

    $('.slider').slick({
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        pauseOnFocus: true,
        cssEase: 'ease-in-out',

        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 650,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 400,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });

});


// =====================================
// CLOSE MODAL WITH ESCAPE
// =====================================

document.addEventListener('keydown', function (event) {

    if (event.key === 'Escape') {
        closeAllPanels();
        closeProductDetails();
        categoryMenu.classList.remove('active');
    }

});
// =====================================
// PROFESSIONAL SCROLL SYSTEM
// =====================================


// Create Scroll Progress
const scrollProgress = document.createElement('div');

scrollProgress.className = 'scroll-progress';

document.body.appendChild(scrollProgress);


// Create Back To Top Button
const backToTop = document.createElement('button');

backToTop.id = 'back-to-top';
backToTop.type = 'button';
backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';

backToTop.setAttribute('aria-label', 'Back to top');

document.body.appendChild(backToTop);


// =====================================
// SCROLL REVEAL ELEMENTS
// =====================================

const revealElements = document.querySelectorAll(
    '.Categories .data, .Categories .slider, .Categories .vegtables .card, ' +
    '.Products .data, .Products .container .card, ' +
    '.GetEvery .card, .Fresh .left, .Fresh .right'
);

revealElements.forEach(function (element, index) {

    if (element.classList.contains('slider')) {
        element.classList.add('reveal-left');
    } 
    else if (element.closest('.Fresh .right')) {
        element.classList.add('reveal-right');
    } 
    else {
        element.classList.add('reveal');
    }

    element.style.transitionDelay = `${(index % 4) * 100}ms`;

});


// =====================================
// INTERSECTION OBSERVER
// =====================================

const revealObserver = new IntersectionObserver(function (entries) {

    entries.forEach(function (entry) {

        if (entry.isIntersecting) {

            entry.target.classList.add('show');

            revealObserver.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.15
});


function observeRevealElements() {

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
        .forEach(function (element) {

            if (!element.classList.contains('show')) {
                revealObserver.observe(element);
            }

        });

}

observeRevealElements();


// =====================================
// UPDATE DYNAMIC PRODUCT CARDS
// =====================================

const productObserver = new MutationObserver(function () {

    observeRevealElements();

});

const productsSection = document.querySelector('.Products .container');

if (productsSection) {

    productObserver.observe(productsSection, {
        childList: true
    });

}


// =====================================
// SCROLL PROGRESS + NAVBAR
// =====================================

const siteHeader = document.querySelector('#site-header');

let lastScroll = 0;

window.addEventListener('scroll', function () {

    const scrollTop = window.scrollY;

    const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress =
        documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

    // Update Progress
    scrollProgress.style.width = `${progress}%`;


    // Navbar Background
    if (scrollTop > 100) {

        siteHeader.classList.add('scrolled');

    } else {

        siteHeader.classList.remove('scrolled');
        siteHeader.classList.remove('hide-navbar');

    }


    // Hide Navbar When Scrolling Down
    if (scrollTop > lastScroll && scrollTop > 250) {

        siteHeader.classList.add('hide-navbar');

    }

    // Show Navbar When Scrolling Up
    else {

        siteHeader.classList.remove('hide-navbar');

    }


    // Back To Top Visibility
    if (scrollTop > 500) {

        backToTop.classList.add('active');

    } else {

        backToTop.classList.remove('active');

    }


    lastScroll = scrollTop;

}, { passive: true });


// =====================================
// BACK TO TOP
// =====================================

backToTop.addEventListener('click', function () {

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

});