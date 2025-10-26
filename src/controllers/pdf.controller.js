import { renderTemplate } from "../services/template.service.js";
import { generatePdfFromHtml } from "../services/pdf.service.js";

export async function generatePdf(req, res) {
  try {
    const { data, downloadUrl, template, fileName, userId } = req.body;

    if (!data || !template) {
      return res.status(400).json({ error: "Template and data required" });
    }

    const html = await renderTemplate(data, downloadUrl, template, userId);

    const pdfBuffer = await generatePdfFromHtml(html, template);

    const pdfFileName = fileName || `${template}-${Date.now()}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${pdfFileName}"`,
      'Content-Length': pdfBuffer.length,
    });

    res.write(pdfBuffer);
    res.end();
  } catch (err) {
    console.error('Error when pdf generating: ', err);
    return res.status(500).json({ error: err.message });
  }
}
