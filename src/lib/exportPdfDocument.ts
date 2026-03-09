/**
 * PDF Export – Converts slide images to a downloadable PDF
 * Uses canvas to create a simple PDF with one slide per page
 */

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Creates a minimal PDF from slide images (data URLs).
 * Uses a lightweight approach without external PDF libraries.
 */
export async function exportPdfFromSlideImages(images: string[], title: string): Promise<void> {
  // Load all images as HTMLImageElement
  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const loadedImages = await Promise.all(images.map(loadImage));

  // Use canvas to create JPEG blobs for each page
  const slideWidth = 1600;
  const slideHeight = 900;

  const canvas = document.createElement("canvas");
  canvas.width = slideWidth;
  canvas.height = slideHeight;
  const ctx = canvas.getContext("2d")!;

  const pageJpegs: Uint8Array[] = [];

  for (const img of loadedImages) {
    ctx.clearRect(0, 0, slideWidth, slideHeight);
    ctx.drawImage(img, 0, 0, slideWidth, slideHeight);

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.92)
    );
    const buffer = await blob.arrayBuffer();
    pageJpegs.push(new Uint8Array(buffer));
  }

  // Build a minimal PDF manually
  const pdf = buildMinimalPdf(pageJpegs, slideWidth, slideHeight);
  const filename = `${title.replace(/[^a-zA-Z0-9\s-]/g, "").trim() || "presentation"}.pdf`;
  downloadBlob(new Blob([pdf.buffer as ArrayBuffer], { type: "application/pdf" }), filename);
}

/**
 * Build a minimal valid PDF with JPEG images, one per page.
 */
function buildMinimalPdf(jpegs: Uint8Array[], w: number, h: number): Uint8Array {
  const enc = new TextEncoder();
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let pos = 0;

  function write(s: string) {
    const bytes = enc.encode(s);
    parts.push(bytes);
    pos += bytes.length;
  }

  function writeBytes(b: Uint8Array) {
    parts.push(b);
    pos += b.length;
  }

  function markObj(n: number) {
    offsets[n] = pos;
    write(`${n} 0 obj\n`);
  }

  const pageCount = jpegs.length;
  // Object layout:
  // 1 = Catalog
  // 2 = Pages
  // 3..3+pageCount-1 = Page objects
  // 3+pageCount..3+2*pageCount-1 = Image XObjects
  const pageObjStart = 3;
  const imgObjStart = pageObjStart + pageCount;
  const totalObjs = imgObjStart + pageCount;

  // PDF points: 72 per inch. Scale to fit ~10" wide
  const pdfW = 720;
  const pdfH = (h / w) * pdfW;

  write("%PDF-1.4\n");

  // Catalog
  markObj(1);
  write("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  // Pages
  markObj(2);
  let kids = "";
  for (let i = 0; i < pageCount; i++) kids += `${pageObjStart + i} 0 R `;
  write(`<< /Type /Pages /Kids [${kids.trim()}] /Count ${pageCount} >>\nendobj\n`);

  // Page objects
  for (let i = 0; i < pageCount; i++) {
    markObj(pageObjStart + i);
    write(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfW} ${pdfH}] ` +
      `/Contents ${imgObjStart + pageCount + i} 0 R ` +
      `/Resources << /XObject << /Img${i} ${imgObjStart + i} 0 R >> >> >>\nendobj\n`
    );
  }

  // Recalculate total: need content stream objects too
  const contentObjStart = imgObjStart + pageCount;
  const finalTotalObjs = contentObjStart + pageCount;

  // Image XObjects
  for (let i = 0; i < pageCount; i++) {
    const jpeg = jpegs[i];
    markObj(imgObjStart + i);
    write(
      `<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} ` +
      `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode ` +
      `/Length ${jpeg.length} >>\nstream\n`
    );
    writeBytes(jpeg);
    write("\nendstream\nendobj\n");
  }

  // Content streams (draw image on page)
  for (let i = 0; i < pageCount; i++) {
    const stream = `q ${pdfW} 0 0 ${pdfH} 0 0 cm /Img${i} Do Q`;
    markObj(contentObjStart + i);
    write(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`);
  }

  // Xref
  const xrefPos = pos;
  write(`xref\n0 ${finalTotalObjs + 1}\n`);
  write("0000000000 65535 f \n");
  for (let i = 1; i <= finalTotalObjs; i++) {
    const off = offsets[i] || 0;
    write(`${String(off).padStart(10, "0")} 00000 n \n`);
  }

  write(`trailer\n<< /Size ${finalTotalObjs + 1} /Root 1 0 R >>\n`);
  write(`startxref\n${xrefPos}\n%%EOF\n`);

  // Concatenate
  const total = parts.reduce((s, p) => s + p.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) {
    result.set(p, offset);
    offset += p.length;
  }
  return result;
}
