const shopContent = document.getElementById("shopContent");
const cart = [];

productos.forEach((products) => {
    const content = document.createElement("div");
    content.className = "card";
    content.innerHTML = `
        <img src="${products.img}"/>
        <h3>${products.productName}</h3>
        <p class="price">${products.price} $</p> 
    `;
    shopContent.append(content);

    const buyButton = document.createElement("button");
    buyButton.innerText = "Comprar";
    content.append(buyButton);

    buyButton.addEventListener("click", () => {
        const repeat = cart.some((p) => p.id === products.id);
        if (repeat) {
            cart.map((prod) => {
                if (prod.id === products.id) prod.quanty++;
            });
        } else {
            cart.push({ ...products });
        }
        displayCartCounter();
    });
});
