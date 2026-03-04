import pptxgen from "pptxgenjs";
import type { PtDocument, PtShapeElement, PtTextElement } from "@/lib/pptxModel";

const PPT_LAYOUT_NAME = "LOVABLE_NATIVE_16_9";
const DEFAULT_FONT = "Arial";
const DEFAULT_TEXT_COLOR = "FFFFFF";

function sanitizeHex(value?: string): string | null {
  if (!value) return null;
  const clean = value.replace("#", "").trim();
  if (/^[0-9a-fA-F]{6}$/.test(clean)) return clean.toUpperCase();
  if (/^[0-9a-fA-F]{8}$/.test(clean)) return clean.toUpperCase();
  return null;
}

function parseHexColor(value?: string, fallback = DEFAULT_TEXT_COLOR): { color: string; transparency?: number } {
  const valid = sanitizeHex(value);
  if (!valid) return { color: fallback };

  if (valid.length === 8) {
    const rgb = valid.slice(0, 6);
    const alphaHex = valid.slice(6, 8);
    const alpha = parseInt(alphaHex, 16) / 255;
    const transparency = Math.max(0, Math.min(100, Math.round((1 - alpha) * 100)));
    return transparency > 0 ? { color: rgb, transparency } : { color: rgb };
  }

  return { color: valid };
}

function safeFileName(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9\u00C0-\u024F ]/g, "").trim().replace(/\s+/g, "_");
  return `${cleaned || "Apresentacao"}.pptx`;
}

function addShape(slide: pptxgen.Slide, shape: PtShapeElement) {
  const fill = parseHexColor(shape.fill, "000000");
  const stroke = shape.stroke ? parseHexColor(shape.stroke, "000000") : null;

  slide.addShape(pptxgen.ShapeType.rect, {
    x: shape.x,
    y: shape.y,
    w: shape.w,
    h: shape.h,
    fill: {
      color: fill.color,
      ...(typeof fill.transparency === "number" ? { transparency: fill.transparency } : {}),
    },
    ...(stroke
      ? {
          line: {
            color: stroke.color,
            pt: shape.strokeWidth || 1,
            ...(typeof stroke.transparency === "number" ? { transparency: stroke.transparency } : {}),
          },
        }
      : {
          line: { color: fill.color, transparency: 100 },
        }),
  });
}

function addText(slide: pptxgen.Slide, textElement: PtTextElement) {
  const color = parseHexColor(textElement.color, DEFAULT_TEXT_COLOR);

  slide.addText(textElement.text, {
    x: textElement.x,
    y: textElement.y,
    w: textElement.w,
    h: textElement.h ?? 0.5,
    fontSize: textElement.fontSize ?? 14,
    fontFace: textElement.fontFace ?? DEFAULT_FONT,
    color: color.color,
    ...(typeof color.transparency === "number" ? { transparency: color.transparency } : {}),
    bold: textElement.bold,
    italic: textElement.italic,
    align: textElement.align,
    valign: "top",
    bullet: textElement.bullet ? { indent: 14 } : undefined,
    ...(typeof textElement.opacity === "number"
      ? { transparency: Math.max(0, Math.min(100, Math.round((1 - textElement.opacity) * 100))) }
      : {}),
  });
}

export async function exportPptxDocument(document: PtDocument, title: string) {
  const pptx = new pptxgen();
  pptx.defineLayout({ name: PPT_LAYOUT_NAME, width: 10, height: 5.625 });
  pptx.layout = PPT_LAYOUT_NAME;

  document.slides.forEach((ptSlide) => {
    const slide = pptx.addSlide();
    const background = parseHexColor(ptSlide.background, "0F172A");
    slide.background = { fill: background.color };

    ptSlide.elements.forEach((element) => {
      if (element.type === "shape") {
        addShape(slide, element);
      } else {
        addText(slide, element);
      }
    });

    if (ptSlide.notes) {
      slide.addNotes(ptSlide.notes);
    }
  });

  await pptx.writeFile({ fileName: safeFileName(title) });
}
