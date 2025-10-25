import path from "path";
import fs from "fs-extra";

import Handlebars from "../utils/handlebars.js";

const __dirname = path.resolve();

export async function renderTemplate(data, downloadUrl, template) {
  const templatePath = path.join(__dirname, "src", "templates", `${template}.hbs`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${template}`);
  }

  const html = await fs.readFile(templatePath, "utf-8");
  const compile = Handlebars.compile(html);

  return compile({ ...data, downloadUrl });
}
