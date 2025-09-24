// server.js
const express = require("express");
const mercadopago = require("mercadopago");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Configura tu Access Token de Mercado Pago
mercadopago.configurations.setAccessToken("APP_USR-5082808671637907-092400-792aa747dab77e72c4d4ecafc70a007f-2705622945");

// Endpoint para crear preferencia de pago
app.post("/create_preference", async (req, res) => {
    const cart = req.body.cart;

    const items = cart.map(p => ({
        title: p.productName,
        unit_price: p.price,
        quantity: p.quanty
    }));

    const preference = {
        items,
        back_urls: {
            success: "https://ecommerceutn.netlify.app/success.html",
            failure: "https://ecommerceutn.netlify.app/failure.html",
            pending: "https://ecommerceutn.netlify.app/pending.html"
        },
        auto_return: "approved"
    };

    try {
        const response = await mercadopago.preferences.create(preference);
        res.json({ preferenceId: response.body.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
