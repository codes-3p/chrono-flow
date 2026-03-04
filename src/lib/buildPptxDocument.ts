/**
 * Converte a resposta da IA (GeneratedPresentation) no modelo PPTX (PtDocument).
 */

import type { GeneratedPresentation } from "@/data/templates";
import type { PtDocument, PtSlide, PtElement } from "./pptxModel";
import { SLIDE_W } from "./pptxModel";

function hexNoHash(hex: string): string {
  return hex.replace("#", "");
}

export function buildPptxDocument(presentation: GeneratedPresentation): PtDocument {
  const { title, subtitle, template } = presentation;
  const slides = presentation.slides || [];
  const primary = hexNoHash(template.colors.primary);
  const secondary = hexNoHash(template.colors.secondary);
  const accent = hexNoHash(template.colors.accent);
  const white = "FFFFFF";
  const lightGray = "EDEDED";

  const out: PtDocument = { slides: [] };

  slides.forEach((slide, index) => {
    const content = slide.content || [];
    const elements: PtElement[] = [];
    const isCover = slide.layout === "title" || slide.layout === "closing";
    const isQuote = slide.layout === "quote";
    const isBigNumber = slide.layout === "bigNumber";
    const isStats = slide.layout === "stats";
    const isProcess = slide.layout === "process";
    const isComparison = slide.layout === "comparison";
    const isHighlight = slide.layout === "highlight";

    const slideNumText = `${index + 1} / ${slides.length}`;

    // Top accent bar
    elements.push({
      type: "shape", shape: "rect",
      x: 0, y: 0, w: SLIDE_W, h: 0.15,
      fill: accent,
    });

    if (isCover) {
      const slideTitle = index === 0 ? title || slide.title : slide.title;
      const slideSubtitle = index === 0 ? subtitle || content[0] || "" : content[0] || "";
      elements.push({
        type: "text", x: 0.5, y: 2.0, w: 9,
        text: slideTitle, fontSize: 44, fontFace: "Arial",
        color: white, bold: true, align: "center",
      });
      if (slideSubtitle) {
        elements.push({
          type: "text", x: 1.0, y: 3.25, w: 8,
          text: slideSubtitle, fontSize: 22, fontFace: "Arial",
          color: white, italic: true, align: "center",
        });
      }
    } else if (isBigNumber) {
      elements.push({
        type: "text", x: 0.5, y: 1.0, w: 9,
        text: slide.title, fontSize: 14, fontFace: "Arial",
        color: "AAAAAA", align: "center",
      });
      elements.push({
        type: "text", x: 0.5, y: 2.0, w: 9,
        text: slide.bigNumber?.number || content[0] || "",
        fontSize: 60, fontFace: "Arial",
        color: accent, bold: true, align: "center",
      });
      if (slide.bigNumber?.context) {
        elements.push({
          type: "text", x: 1.5, y: 3.5, w: 7,
          text: slide.bigNumber.context, fontSize: 16, fontFace: "Arial",
          color: "AAAAAA", align: "center",
        });
      }
    } else if (isQuote) {
      elements.push({
        type: "text", x: 0.8, y: 2.0, w: 8.8,
        text: `"${slide.title}"`, fontSize: 26, fontFace: "Arial",
        color: white, italic: true, align: "center",
      });
      if (content.length > 0) {
        elements.push({
          type: "text", x: 0.8, y: 4.3, w: 8.8,
          text: `— ${content[0]}`, fontSize: 14, fontFace: "Arial",
          color: accent, align: "center",
        });
      }
    } else if (isStats) {
      elements.push({
        type: "text", x: 0.8, y: 0.8, w: 8.6,
        text: slide.title, fontSize: 26, fontFace: "Arial",
        color: white, bold: true,
      });
      (slide.stats || []).forEach((stat, i) => {
        const cardW = 2.0;
        const cardX = 0.8 + i * (cardW + 0.3);
        elements.push({
          type: "shape", shape: "rect",
          x: cardX, y: 1.8, w: cardW, h: 1.2,
          fill: `${primary}30`,
        });
        elements.push({
          type: "text", x: cardX, y: 1.9, w: cardW,
          text: stat.value, fontSize: 28, fontFace: "Arial",
          color: accent, bold: true, align: "center",
        });
        elements.push({
          type: "text", x: cardX, y: 2.6, w: cardW,
          text: stat.label, fontSize: 10, fontFace: "Arial",
          color: "AAAAAA", align: "center",
        });
      });
      content.forEach((line, i) => {
        elements.push({
          type: "text", x: 1.0, y: 3.4 + i * 0.38, w: 8.6,
          text: line, fontSize: 14, fontFace: "Arial",
          color: lightGray, bullet: true,
        });
      });
    } else if (isProcess) {
      elements.push({
        type: "text", x: 0.8, y: 0.8, w: 8.6,
        text: slide.title, fontSize: 26, fontFace: "Arial",
        color: white, bold: true,
      });
      (slide.steps || []).forEach((step, i) => {
        const stepW = 1.8;
        const stepX = 0.6 + i * (stepW + 0.2);
        elements.push({
          type: "shape", shape: "rect",
          x: stepX, y: 1.8, w: stepW, h: 2.5,
          fill: `${primary}20`,
        });
        elements.push({
          type: "text", x: stepX + 0.1, y: 1.9, w: 0.5,
          text: `${i + 1}`, fontSize: 16, fontFace: "Arial",
          color: accent, bold: true,
        });
        elements.push({
          type: "text", x: stepX + 0.1, y: 2.4, w: stepW - 0.2,
          text: step.step, fontSize: 12, fontFace: "Arial",
          color: white, bold: true,
        });
        elements.push({
          type: "text", x: stepX + 0.1, y: 2.9, w: stepW - 0.2,
          text: step.description, fontSize: 10, fontFace: "Arial",
          color: "AAAAAA",
        });
      });
    } else if (isComparison) {
      elements.push({
        type: "text", x: 0.8, y: 0.8, w: 8.6,
        text: slide.title, fontSize: 26, fontFace: "Arial",
        color: white, bold: true,
      });
      [slide.comparison?.left, slide.comparison?.right].forEach((side, sideIdx) => {
        if (!side) return;
        const colX = 0.6 + sideIdx * 4.6;
        elements.push({
          type: "shape", shape: "rect",
          x: colX, y: 1.8, w: 4.2, h: 3,
          fill: `${primary}20`,
        });
        elements.push({
          type: "text", x: colX + 0.2, y: 1.9, w: 3.8,
          text: side.title, fontSize: 16, fontFace: "Arial",
          color: white, bold: true,
        });
        (side.points || []).forEach((point, pi) => {
          elements.push({
            type: "text", x: colX + 0.3, y: 2.6 + pi * 0.4, w: 3.6,
            text: point, fontSize: 11, fontFace: "Arial",
            color: lightGray, bullet: true,
          });
        });
      });
    } else if (isHighlight) {
      elements.push({
        type: "text", x: 0.8, y: 0.8, w: 8.6,
        text: slide.title, fontSize: 26, fontFace: "Arial",
        color: white, bold: true,
      });
      if (slide.highlight) {
        elements.push({
          type: "shape", shape: "rect",
          x: 0.8, y: 1.7, w: 8.4, h: 1.2,
          fill: `${primary}30`,
        });
        elements.push({
          type: "text", x: 1.0, y: 1.8, w: 8.0,
          text: slide.highlight, fontSize: 16, fontFace: "Arial",
          color: white, bold: true,
        });
      }
      content.forEach((line, i) => {
        elements.push({
          type: "text", x: 1.0, y: 3.2 + i * 0.38, w: 8.4,
          text: line, fontSize: 14, fontFace: "Arial",
          color: lightGray, bullet: true,
        });
      });
    } else {
      // Content / two-column
      elements.push({
        type: "shape", shape: "rect",
        x: 0.8, y: 1.0, w: 1.5, h: 0.08,
        fill: accent,
      });
      elements.push({
        type: "text", x: 0.8, y: 1.22, w: 8.6,
        text: slide.title, fontSize: 26, fontFace: "Arial",
        color: white, bold: true,
      });

      const isTwoCol = slide.layout === "two-column";
      if (content.length > 0) {
        if (!isTwoCol) {
          content.forEach((line, i) => {
            elements.push({
              type: "text", x: 1.0, y: 2.0 + i * 0.42, w: 8.6,
              text: line, fontSize: 16, fontFace: "Arial",
              color: lightGray, bullet: true,
            });
          });
        } else {
          const mid = Math.ceil(content.length / 2);
          const left = content.slice(0, mid);
          const right = content.slice(mid);
          left.forEach((line, i) => {
            elements.push({
              type: "text", x: 0.9, y: 2.0 + i * 0.38, w: 4.0,
              text: line, fontSize: 14, fontFace: "Arial",
              color: lightGray, bullet: true,
            });
          });
          right.forEach((line, i) => {
            elements.push({
              type: "text", x: 5.2, y: 2.0 + i * 0.38, w: 4.0,
              text: line, fontSize: 14, fontFace: "Arial",
              color: lightGray, bullet: true,
            });
          });
        }
      }
    }

    // Slide number
    elements.push({
      type: "text", x: 9.0, y: 5.15, w: 0.9,
      text: slideNumText, fontSize: 10, fontFace: "Arial",
      color: "AAAAAA", align: "right",
    });

    out.slides.push({
      elements,
      notes: slide.notes,
      background: isCover ? primary : secondary,
    });
  });

  return out;
}
