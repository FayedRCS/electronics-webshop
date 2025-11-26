//const { createElement } = require("react");

// laster inn cart eller tom array
let cart = JSON.parse(localStorage.getItem("cart")) || []; 

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
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
});