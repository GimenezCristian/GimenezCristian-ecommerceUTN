import { Preference, MercadoPagoConfig } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).send("Method not allowed");

    try {
        const cart = req.body.cart;
        const items = cart.map(p => ({
            title: p.productName,
            unit_price: Number(p.price),
            quantity: Number(p.quanty)
        }));

        const preference = new Preference(client);
        const response = await preference.create({ body: { items, back_urls: {
            success: "https://gimenez-cristian-ecommerce-ox9yt5o6d.vercel.app/success.html",
            failure: "https://gimenez-cristian-ecommerce-ox9yt5o6d.vercel.app/failure.html",
            pending: "https://gimenez-cristian-ecommerce-ox9yt5o6d.vercel.app/pending.html"
        }, auto_return: "approved" } });

        res.status(200).json({ id: response.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
