//const { createElement } = require("react");

// laster inn cart eller tom array
let cart = JSON.parse(localStorage.getItem("cart")) || []; 

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Fjern produkt fra handlekurv
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    displayCart(); // Oppdater visningen
}

function addToCart(product) {
    //finn existerende produkter
    const existingItem = cart.find(item => item.id === product.id)

    if (existingItem) {
        existingItem.quantity += 1;
   } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            img_url: product.img_url,
            quantity: 1
        });
   }

   saveCart()
   alert(product.name + " lagt i handlekurven!")
   console.log("cart", cart)
}

// Endre antall av produkt
function updateQuantity(productId, action) {
    const item = cart.find(item => item.id === productId);
    
    if (!item) return;
    
    if (action === 'increase') {
        item.quantity += 1;
    } else if (action === 'decrease') {
        item.quantity -= 1;
        
        // Hvis antall blir 0, fjern produktet
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
    }
    
    saveCart();
    displayCart();
}

// vis handlekurv
function displayCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<tr><td colspan='5' style='text-align: center;'>Handlekurven er tom</td></tr>";
        subtotalElement.innerHTML = "Kr 0,-"
        totalElement.innerHTML = "Kr 0,-"
        return;
    }

    cartItemsContainer.innerHTML = "";

    let total = 0;

    // lager en rad for hvert produkt
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>Kr ${item.price},-</td>
            <td>
                <button class="qty-btn" data-id="${item.id}" data-action="decrease">-</button>
                <span style="margin: 0 1rem;">${item.quantity}</span>
                <button class="qty-btn" data-id="${item.id}" data-action="increase">+</button>
            </td>
            <td>Kr ${itemTotal},-</td>
            <td><button class="remove-btn" data-id="${item.id}">Fjern</button></td>
        `;

        cartItemsContainer.appendChild(row);

    });
    // Oppdater totalene
    subtotalElement.textContent = `Kr ${total},-`;
    totalElement.textContent = `Kr ${total},-`;

    // Legg til event listeners for fjern-knapper
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });

    // Legg til event listeners for +/- knapper
    const qtyButtons = document.querySelectorAll('.qty-btn');
    qtyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const action = this.getAttribute('data-action');
            updateQuantity(productId, action);
        });
    });
}

function loadProducts() {
    fetch('http://127.0.0.1:5000/api/products')
    .then(response => response.json())
    .then(products => {
        const container = document.getElementById('products-container');
        container.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <img src="${product.img_url}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>High quality component</p>
                <div class="price">Kr ${product.price},-</div>
                <button>Legg i kurv</button>
            `;
            
            // Attach click handler with full product data
            const button = productCard.querySelector('button');
            button.addEventListener('click', function() {
                addToCart(product);
            });
            
            container.appendChild(productCard);
                });
            }) 
            // catch for bedre error håndtering
            .catch(error => {
                console.error('Error loading products:', error);
                document.getElementById('products-container').innerHTML = 
            '<p>Could not load products. Please try again later.</p>';
            });
}

function loadRandoms() {
    fetch("http://127.0.0.1:5000/api/products")
    .then(results => results.json())
    .then(products => {
        const randomShuffle = products.sort(() => 0.5 - Math.random()); //random tall fra -0.5 & 0.5
        const popularProds = randomShuffle.slice(0,4); //slice kun de første 4 fra liste

        const container = document.getElementById("popular-products");
        container.innerHTML = "";


        popularProds.forEach(product => {
            const productCard = document.createElement("div")
            productCard.className = "product-card"

            productCard.innerHTML = `
            <img src="${product.img_url}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Classic</p> 
            <div class="price">Kr ${product.price} ,-</div>
            <button>Legg i kurv</button>
            `;
            
        //button funksjonalitet 
        const button = productCard.querySelector("button");
        button.addEventListener("click", function() {
            addToCart(product);
        });

        container.appendChild(productCard)
        });
    })

    .catch(error => {
        console.error("Error loading popular products:", error);
    });
}
       
// Laster inn produkter når siden er lastet inn
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('products-container')) {
        loadProducts();
    }

    if (document.getElementById("popular-products")) {
        loadRandoms();
    }

    //last inn handlekurv
    if (document.getElementById("cart-items")) {
        displayCart()
    }
});