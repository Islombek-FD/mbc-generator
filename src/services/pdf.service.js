import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

import { createBrowser } from "../utils/puppeteer.util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generatePdfFromHtml(html, template) {
  const browser = await createBrowser();
  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: "networkidle0"
  });

  const cssPath = path.join(__dirname, '..', 'public', 'css', `${template}.css`);
  if (await fs.pathExists(cssPath)) {
    const css = await fs.readFile(cssPath, 'utf-8');
    await page.addStyleTag({ content: css });
  }

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20mm", bottom: "20mm", left: "10mm", right: "10mm" },
  });

  await browser.close();

  return pdfBuffer;
}
