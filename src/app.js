import path from "path";
import express from "express";
import { fileURLToPath } from 'url';
import bodyParser from "body-parser";

import { config } from "./config/env.js";

import pdfRoutes from "./routes/pdf.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json({ limit: "1024mb" }));

app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/fonts', express.static(path.join(__dirname, 'public', 'fonts')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.use("/api/v1/pdf", pdfRoutes);

app.listen(config.port, () => {
  console.log(`✅ Generator running on ${config.port} port.`);
});
