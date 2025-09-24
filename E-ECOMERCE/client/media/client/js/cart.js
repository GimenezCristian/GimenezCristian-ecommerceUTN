const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");
const cartBtn = document.getElementById("cart-btn");
const cartCounter = document.getElementById("cart-counter");

const displayCartCounter = () => {
    const cartLength = cart.reduce((acc, el) => acc + el.quanty, 0);
    if (cartLength > 0) {
        cartCounter.style.display = "block";
        cartCounter.innerText = cartLength;
    } else {
        cartCounter.style.display = "none";
    }
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
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = `<h2>Carrito de compras</h2><span class="modal-close">❌</span>`;
    modalContainer.append(modalHeader);

    modalHeader.querySelector(".modal-close").addEventListener("click", () => {
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
    });

    if (cart.length > 0) {
        cart.forEach(product => {
            const modalBody = document.createElement("div");
            modalBody.className = "modal-body";
            modalBody.innerHTML = `
                <div class="products">
                    <img class="products-img" src="${product.img}"/>
                    <div class="products-info">
                        <h4>${product.productName}</h4>
                        <p>${product.price * product.quanty} $</p>
                    </div>
                    <div class="quantity">
                        <button class="quantity-btn-decrese">-</button>
                        <span class="quantity-input">${product.quanty}</span>
                        <button class="quantity-btn-increse">+</button>
                    </div>
                    <div class="delete-products">❌</div>
                </div>
            `;
            modalContainer.append(modalBody);

            modalBody.querySelector(".quantity-btn-decrese").addEventListener("click", () => {
                if (product.quanty > 1) product.quanty--;
                displayCart();
                displayCartCounter();
            });
            modalBody.querySelector(".quantity-btn-increse").addEventListener("click", () => {
                product.quanty++;
                displayCart();
                displayCartCounter();
            });
            modalBody.querySelector(".delete-products").addEventListener("click", () => {
                deleteCartProducts(product.id);
            });
        });

        const total = cart.reduce((acc, el) => acc + el.price * el.quanty, 0);
        const modalFooter = document.createElement("div");
        modalFooter.className = "modal-footer";
        modalFooter.innerHTML = `<div>Total a pagar: ${total} $</div>`;
        modalContainer.append(modalFooter);

        const payButton = document.createElement("button");
        payButton.innerText = "Pagar con Mercado Pago";
        payButton.className = "pay-btn";
        modalContainer.append(payButton);

        payButton.addEventListener("click", async () => {
            const response = await fetch("/api/create_preference", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ cart })
            });
            const data = await response.json();
            const script = document.createElement("script");
            script.src = "https://sdk.mercadopago.com/js/v2";
            script.onload = () => {
                const mp = new MercadoPago("APP_USR-1d4b118d-72ac-4799-9a2b-5101df8f306d", { locale: 'es-AR' });
                mp.checkout({ preference: { id: data.id }, autoOpen: true });
            };
            document.body.appendChild(script);
        });

    } else {
        modalContainer.innerHTML += `<h2>Tu carrito está vacío 😢</h2>`;
    }
};

cartBtn.addEventListener("click", displayCart);
