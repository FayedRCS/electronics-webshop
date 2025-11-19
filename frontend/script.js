let cart = [];

function addToCart(productName, price) {
    cart.push({
        name: productName,
        price: price
    });
    alert(productName + " lagt i handlekurv!");
    console.log(cart);
}

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.product-card button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            // Extract just the number from "Kr 5,-"
            const price = parseInt(productPrice.match(/\d+/)[0]);
            
            addToCart(productName, price);
        });
    });
});