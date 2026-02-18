import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { TextElement } from "@/components/CertificateEditor";

interface GenerateOptions {
  templateFile: File;
  data: Record<string, string>[];
  mapping: Record<string, string>;
  elements: TextElement[];
  enableQR: boolean;
  qrPosition: { x: number; y: number };
  onProgress: (current: number) => void;
}

export async function generateCertificates(options: GenerateOptions): Promise<Blob> {
  const {
    templateFile,
    data,
    mapping,
    elements,
    enableQR,
    qrPosition,
    onProgress,
  } = options;

  const zip = new JSZip();
  const templateBytes = await templateFile.arrayBuffer();
  const isImage = templateFile.type.startsWith("image/");

  // Font mapping
  const getFontType = (fontFamily: string) => {
    switch (fontFamily) {
      case "Helvetica": return StandardFonts.Helvetica;
      case "Helvetica-Bold": return StandardFonts.HelveticaBold;
      case "Times-Roman": return StandardFonts.TimesRoman;
      case "Times-Bold": return StandardFonts.TimesRomanBold;
      case "Courier": return StandardFonts.Courier;
      case "Courier-Bold": return StandardFonts.CourierBold;
      default: return StandardFonts.Helvetica;
    }
  };

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    let pdfDoc: PDFDocument;

    if (isImage) {
      pdfDoc = await PDFDocument.create();
      const img = templateFile.type.includes("png")
        ? await pdfDoc.embedPng(templateBytes)
        : await pdfDoc.embedJpg(templateBytes);
      const { width, height } = img.scale(1);
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(img, { x: 0, y: 0, width, height });
    } else {
      pdfDoc = await PDFDocument.load(templateBytes);
    }

    const page = pdfDoc.getPages()[0];
    const { width: pageW, height: pageH } = page.getSize();

    // Scale from 800px canvas to actual PDF dimensions
    const scaleX = pageW / 800;
    const scaleY = pageH / (800 * (pageH / pageW));

    for (const el of elements) {
      if (!el.enabled) continue;
      const columnName = mapping[el.key];
      if (!columnName) continue;
      const text = String(row[columnName] ?? "");
      if (!text) continue;

      // Embed font for this element
      const font = await pdfDoc.embedFont(getFontType(el.fontFamily));

      const hexColor = el.color;
      const r = parseInt(hexColor.slice(1, 3), 16) / 255;
      const g = parseInt(hexColor.slice(3, 5), 16) / 255;
      const b = parseInt(hexColor.slice(5, 7), 16) / 255;

      const fontSize = el.fontSize * scaleX;
      const textWidth = font.widthOfTextAtSize(text, fontSize);

      page.drawText(text, {
        x: el.x * scaleX - textWidth / 2,
        y: pageH - el.y * scaleY,
        size: fontSize,
        font,
        color: rgb(r, g, b),
      });
    }

    // QR Code
    if (enableQR) {
      const certId = row[mapping["id"] || ""] || `CERT-${i + 1}`;
      const qrDataUrl = await QRCode.toDataURL(
        `https://verify.certiforge.app/cert/${certId}`,
        { width: 120, margin: 1 }
      );
      const qrImageBytes = Uint8Array.from(
        atob(qrDataUrl.split(",")[1]),
        (c) => c.charCodeAt(0)
      );
      const qrImage = await pdfDoc.embedPng(qrImageBytes);
      const qrSize = 60 * scaleX;
      page.drawImage(qrImage, {
        x: qrPosition.x * scaleX - qrSize / 2,
        y: pageH - qrPosition.y * scaleY - qrSize / 2,
        width: qrSize,
        height: qrSize,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const name = row[mapping["name"] || ""] || `certificate_${i + 1}`;
    const safeName = name.replace(/[^a-zA-Z0-9_\- ]/g, "").trim();
    zip.file(`${safeName}.pdf`, pdfBytes);

    onProgress(i + 1);
  }

  return await zip.generateAsync({ type: "blob" });
}

export function downloadZip(blob: Blob, filename = "certificates.zip") {
  saveAs(blob, filename);
}
