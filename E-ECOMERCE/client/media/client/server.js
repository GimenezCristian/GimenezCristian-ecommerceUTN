import express from "express";
import cors from "cors";
import { shopRouter } from "./routes/shopRouter.js";
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", shopRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
