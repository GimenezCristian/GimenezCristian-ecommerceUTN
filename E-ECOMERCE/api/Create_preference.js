import { MercadoPagoConfig, Preference } from "mercadopago";

const mp = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res) {
    if (req.method === "POST") {
        const cart = req.body.cart || [];
        const items = cart.map(p => ({
            title: p.productName,
            unit_price: p.price,
            quantity: p.quanty,
            currency_id: "ARS"
        }));

        const preference = {
            items,
            back_urls: {
                success: `${req.headers.origin}/api/success`,
                failure: `${req.headers.origin}/api/failure`,
                pending: `${req.headers.origin}/api/pending`
            },
            auto_return: "approved"
        };

        try {
            const p = new Preference(mp);
            const response = await p.create({ body: preference });
            res.status(200).json({ id: response.id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).end(); // Método no permitido
    }
}
