import { MercadoPagoConfig, Preference } from "mercadopago";
import path from "path";
import 'dotenv/config';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export class ShopController {
  static async homePage(req, res) {
    try {
      res.status(200).sendFile(path.join(process.cwd(), "client", "index.html"));
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor: " + error.message });
    }
  }

  static async createPreferenceAPI(req, res) {
    try {
      const body = {
        items: req.body.cart.map(p => ({
          title: p.productName,
          quantity: Number(p.quanty),
          unit_price: Number(p.price),
          currency_id: "ARS",
        })),
        back_urls: {
          success: "https://ecommerceutn.netlify.app/success.html",
          failure: "https://ecommerceutn.netlify.app/failure.html",
          pending: "https://ecommerceutn.netlify.app/pending.html",
        },
        auto_return: "approved",
      };

      const preference = new Preference(client);
      const result = await preference.create({ body });
      res.json({ preferenceId: result.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear la preferencia :(" });
    }
  }

  static async successAPI(req, res) {
    const data = req.query;
    res.send(`
      <div>
        <h1>Muchas gracias por tu compra ✅</h1>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </div>
    `);
  }
}
