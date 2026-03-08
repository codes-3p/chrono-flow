/**
 * exportPptxDocument – High-fidelity PPTX export
 * Supports: rect, roundRect, ellipse, line, gradients, shadows, opacity, rich text
 */

import pptxgen from "pptxgenjs";
import type { PtDocument, PtShapeElement, PtTextElement, PtGradientFill } from "@/lib/pptxModel";

const PPT_LAYOUT_NAME = "SLIDEAI_16_9";
const DEFAULT_FONT = "Calibri";
const DEFAULT_TEXT_COLOR = "FFFFFF";

/* ── Color utilities ── */

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

/* ── Shape mapping ── */

function pptxShapeType(shape: string): pptxgen.ShapeType {
  switch (shape) {
    case "roundRect": return pptxgen.ShapeType.roundRect;
    case "ellipse": return pptxgen.ShapeType.ellipse;
    case "line": return pptxgen.ShapeType.line;
    default: return pptxgen.ShapeType.rect;
  }
}

/* ── Gradient fill for pptxgenjs (not natively supported, use workaround with solid) ── */
// pptxgenjs doesn't support gradient fills directly — we use the primary stop color as solid fill

function bestSolidFromGradient(gradient: PtGradientFill): { color: string; transparency?: number } {
  if (gradient.stops.length === 0) return { color: "000000" };
  // Use the first stop as primary
  const stop = gradient.stops[0];
  return parseHexColor(stop.color);
}

/* ── Add shape ── */

function addShape(slide: pptxgen.Slide, shape: PtShapeElement) {
  const shapeType = pptxShapeType(shape.shape);

  let fillProps: pptxgen.ShapeFillProps | undefined;
  if (shape.gradient) {
    const best = bestSolidFromGradient(shape.gradient);
    fillProps = {
      color: best.color,
      ...(typeof best.transparency === "number" ? { transparency: best.transparency } : {}),
    };
  } else if (shape.fill) {
    const fill = parseHexColor(shape.fill, "000000");
    fillProps = {
      color: fill.color,
      ...(typeof fill.transparency === "number" ? { transparency: fill.transparency } : {}),
    };
  }

  const stroke = shape.stroke ? parseHexColor(shape.stroke, "000000") : null;

  const options: any = {
    x: shape.x,
    y: shape.y,
    w: shape.w,
    h: shape.h,
    ...(fillProps ? { fill: fillProps } : {}),
    ...(stroke
      ? {
          line: {
            color: stroke.color,
            width: shape.strokeWidth || 1,
            ...(typeof stroke.transparency === "number" ? { transparency: stroke.transparency } : {}),
          },
        }
      : {
          line: { color: fillProps?.color || "000000", transparency: 100 },
        }),
    ...(shape.rectRadius !== undefined ? { rectRadius: shape.rectRadius } : {}),
    ...(shape.rotate !== undefined ? { rotate: shape.rotate } : {}),
  };

  // Handle opacity via transparency
  if (typeof shape.opacity === "number" && shape.opacity < 1) {
    // Already handled via hex alpha, but add explicit if fill doesn't have it
    if (options.fill && typeof options.fill.transparency !== "number") {
      options.fill.transparency = Math.round((1 - shape.opacity) * 100);
    }
  }

  // Shadow
  if (shape.shadow) {
    const shadowColor = parseHexColor(shape.shadow.color, "000000");
    options.shadow = {
      type: shape.shadow.type === "inner" ? "inner" : "outer",
      color: shadowColor.color,
      blur: shape.shadow.blur,
      offset: shape.shadow.offset,
      angle: shape.shadow.angle || 45,
      opacity: shape.shadow.opacity || 0.3,
    };
  }

  slide.addShape(shapeType, options);
}

/* ── Add text ── */

function addText(slide: pptxgen.Slide, el: PtTextElement) {
  const color = parseHexColor(el.color, DEFAULT_TEXT_COLOR);

  // Build text content (rich runs or plain)
  let textContent: string | pptxgen.TextProps[] = el.text;
  if (el.runs && el.runs.length > 0) {
    textContent = el.runs.map(run => ({
      text: run.text,
      options: {
        fontSize: run.fontSize || el.fontSize || 14,
        fontFace: run.fontFace || el.fontFace || DEFAULT_FONT,
        color: parseHexColor(run.color, color.color).color,
        bold: run.bold ?? el.bold,
        italic: run.italic ?? el.italic,
        breakLine: run.breakLine,
      },
    }));
  }

  const options: any = {
    x: el.x,
    y: el.y,
    w: el.w,
    h: el.h ?? 0.5,
    fontSize: el.fontSize ?? 14,
    fontFace: el.fontFace ?? DEFAULT_FONT,
    color: color.color,
    ...(typeof color.transparency === "number" ? { transparency: color.transparency } : {}),
    bold: el.bold,
    italic: el.italic,
    align: el.align,
    valign: el.valign || "top",
    bullet: el.bullet ? { indent: 14 } : undefined,
    margin: el.margin,
    charSpacing: el.charSpacing,
    lineSpacingPt: el.lineSpacingPt,
    paraSpaceBefore: el.paraSpaceBefore,
    paraSpaceAfter: el.paraSpaceAfter,
    ...(typeof el.opacity === "number"
      ? { transparency: Math.max(0, Math.min(100, Math.round((1 - el.opacity) * 100))) }
      : {}),
  };

  slide.addText(textContent, options);
}

/* ── Gradient background workaround ── */

function applyBackground(slide: pptxgen.Slide, ptSlide: { background?: string; backgroundGradient?: PtGradientFill }) {
  if (ptSlide.backgroundGradient) {
    const best = bestSolidFromGradient(ptSlide.backgroundGradient);
    slide.background = { fill: best.color };
  } else if (ptSlide.background) {
    const bg = parseHexColor(ptSlide.background, "0F172A");
    slide.background = { fill: bg.color };
  } else {
    slide.background = { fill: "0F172A" };
  }
}

/* ═══════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════ */

export async function exportPptxDocument(document: PtDocument, title: string) {
  const pptx = new pptxgen();
  pptx.defineLayout({ name: PPT_LAYOUT_NAME, width: 10, height: 5.625 });
  pptx.layout = PPT_LAYOUT_NAME;

  document.slides.forEach((ptSlide) => {
    const slide = pptx.addSlide();
    applyBackground(slide, ptSlide);

    ptSlide.elements.forEach((element) => {
      try {
        if (element.type === "shape") {
          addShape(slide, element);
        } else {
          addText(slide, element);
        }
      } catch (err) {
        console.warn("Element export error:", err, element);
      }
    });

    if (ptSlide.notes) {
      slide.addNotes(ptSlide.notes);
    }
  });

  await pptx.writeFile({ fileName: safeFileName(title) });
}

export async function exportPptxFromSlideImages(slideImages: string[], title: string) {
  if (!slideImages.length) {
    throw new Error("Nenhum slide foi capturado para exportação.");
  }

  const pptx = new pptxgen();
  pptx.defineLayout({ name: PPT_LAYOUT_NAME, width: 10, height: 5.625 });
  pptx.layout = PPT_LAYOUT_NAME;

  slideImages.forEach((imageData) => {
    const slide = pptx.addSlide();
    slide.addImage({
      data: imageData,
      x: 0,
      y: 0,
      w: 10,
      h: 5.625,
    });
  });

  await pptx.writeFile({ fileName: safeFileName(title) });
}
