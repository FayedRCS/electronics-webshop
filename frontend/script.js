let cart = [];

function addToCart(productName, price) {
    cart.push({
        name: productName,
        price: price
    });
    alert(productName + " lagt i handlekurv!");
    console.log(cart);
}