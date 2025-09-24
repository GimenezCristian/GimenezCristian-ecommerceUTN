const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");
const cartBtn = document.getElementById("cart-btn");
const cartCounter = document.getElementById("cart-counter");

const displayCartCounter = () => {
    const cartLength = cart.reduce((acc, el) => acc + el.quanty, 0);
    cartCounter.style.display = cartLength > 0 ? "block" : "none";
    cartCounter.innerText = cartLength;
};

const deleteCartProducts = (id) => {
    const index = cart.findIndex(el => el.id === id);
    cart.splice(index, 1);
    displayCart();
    displayCartCounter();
};

const displayCart = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";

    const modalHeader = document.createElement("div");
    const modalClose = document.createElement("div");
    modalClose.innerText = "❌";
    modalClose.className = "modal-close";
    modalClose.addEventListener("click", () => {
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
    });
    modalHeader.append(modalClose);

    const modalTitle = document.createElement("div");
    modalTitle.innerText = "Carrito de compras";
    modalTitle.className = "modal-title";
    modalHeader.append(modalTitle);
    modalContainer.append(modalHeader);

    if (cart.length > 0) {
        cart.forEach(products => {
            const modalBody = document.createElement("div");
            modalBody.className = "modal-body";
            modalBody.innerHTML = `
                <div class="products">
                    <img class="products-img" src="${products.img}"/>
                    <div class="products-info"><h4>${products.productName}</h4></div>
                    <div class="quantity">
                        <span class="quantity-btn-decrese">-</span>
                        <span class="quantity-input">${products.quanty}</span>
                        <span class="quantity-btn-increse">+</span>
                    </div>
                    <div class="price">${products.price * products.quanty} $</div>
                    <div class="delete-products">❌</div>
                </div>
            `;
            modalContainer.append(modalBody);

            modalBody.querySelector(".quantity-btn-decrese").addEventListener("click", () => {
                if (products.quanty !== 1) products.quanty--;
                displayCart();
                displayCartCounter();
            });
            modalBody.querySelector(".quantity-btn-increse").addEventListener("click", () => {
                products.quanty++;
                displayCart();
                displayCartCounter();
            });
            modalBody.querySelector(".delete-products").addEventListener("click", () => {
                deleteCartProducts(products.id);
            });
        });

        const total = cart.reduce((acc, el) => acc + el.price * el.quanty, 0);
        const modalFooter = document.createElement("div");
        modalFooter.className = "modal-footer";
        modalFooter.innerHTML = `<div class="total-price">Total a pagar 💸 es: ${total}</div>`;
        modalContainer.append(modalFooter);

        const payButton = document.createElement("button");
        payButton.innerText = "Pagar con Mercado Pago 💳";
        payButton.className = "pay-btn";
        modalContainer.append(payButton);

        payButton.addEventListener("click", async () => {
            const response = await fetch("https://mi-backend-mercadopago.onrender.com/create_preference", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart })
            });
            const data = await response.json();
            const preferenceId = data.preferenceId;

            const script = document.createElement("script");
            script.src = "https://sdk.mercadopago.com/js/v2";
            script.onload = () => {
                const mp = new MercadoPago("APP_USR-1d4b118d-72ac-4799-9a2b-5101df8f306d", { locale: 'es-AR' });
                mp.checkout({ preference: { id: preferenceId }, autoOpen: true });
            };
            document.body.appendChild(script);
        });
    } else {
        const modalText = document.createElement("h2");
        modalText.className = "modal-body";
        modalText.innerText = "Tu carrito 🛒 está vacío :(";
        modalContainer.append(modalText);
    }
};

cartBtn.addEventListener("click", displayCart);
