import path from "path";
import fs from "fs-extra";

import Handlebars from "../utils/handlebars.js";
import { generateQRCode } from "../utils/qr.js";

const __dirname = path.resolve();

export async function renderTemplate(data, utils) {
  const templatePath = path.join(__dirname, "src", "templates", `${utils.template}.hbs`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${utils.template}`);
  }

  const html = await fs.readFile(templatePath, "utf-8");
  const compile = Handlebars.compile(html);

  if (utils.qrCode) {
    utils.qrCode = await generateQRCode(utils.qrCode);
  }

  return compile({ ...data, ...utils });
}
