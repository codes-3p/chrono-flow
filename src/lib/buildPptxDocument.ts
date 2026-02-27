/**
 * Converte a resposta da IA (GeneratedPresentation) no modelo PPTX (PtDocument).
 * Posições são calculadas a partir do layout; o modelo suporta qualquer elemento em qualquer lugar.
 */

import type { GeneratedPresentation } from "@/data/templates";
import type { PtDocument, PtSlide, PtElement } from "./pptxModel";
import { SLIDE_W } from "./pptxModel";

function hexNoHash(hex: string): string {
  return hex.replace("#", "");
}

export function buildPptxDocument(presentation: GeneratedPresentation): PtDocument {
  const { title, subtitle, slides, template } = presentation;
  const primary = hexNoHash(template.colors.primary);
  const secondary = hexNoHash(template.colors.secondary);
  const accent = hexNoHash(template.colors.accent);
  const white = "FFFFFF";
  const lightGray = "EDEDED";

  const out: PtDocument = { slides: [] };

  slides.forEach((slide, index) => {
    const elements: PtElement[] = [];
    const isCover = slide.layout === "title" || slide.layout === "closing";
    const isQuote = slide.layout === "quote";

    const slideNumText = `${index + 1} / ${slides.length}`;

    // Barra no topo (todos os slides)
    elements.push({
      type: "shape",
      shape: "rect",
      x: 0,
      y: 0,
      w: SLIDE_W,
      h: 0.2,
      fill: accent,
    });

    if (isCover) {
      const slideTitle = index === 0 ? title || slide.title : slide.title;
      const slideSubtitle = index === 0 ? subtitle || slide.content[0] || "" : slide.content[0] || "";
      elements.push({
        type: "text",
        x: 0.5,
        y: 2.0,
        w: 9,
        text: slideTitle,
        fontSize: 44,
        fontFace: "Arial",
        color: white,
        bold: true,
        align: "center",
      });
      if (slideSubtitle) {
        elements.push({
          type: "text",
          x: 1.0,
          y: 3.25,
          w: 8,
          text: slideSubtitle,
          fontSize: 22,
          fontFace: "Arial",
          color: white,
          italic: true,
          align: "center",
        });
      }
    } else if (isQuote) {
      elements.push({
        type: "text",
        x: 0.8,
        y: 2.0,
        w: 8.8,
        text: `"${slide.title}"`,
        fontSize: 26,
        fontFace: "Arial",
        color: white,
        italic: true,
        align: "center",
      });
      if (slide.content.length > 0) {
        elements.push({
          type: "text",
          x: 0.8,
          y: 4.3,
          w: 8.8,
          text: `— ${slide.content[0]}`,
          fontSize: 14,
          fontFace: "Arial",
          color: accent,
          align: "center",
        });
      }
    } else {
      // Conteúdo: barra, título, bullets
      elements.push({
        type: "shape",
        shape: "rect",
        x: 0.8,
        y: 1.0,
        w: 1.5,
        h: 0.08,
        fill: accent,
      });
      elements.push({
        type: "text",
        x: 0.8,
        y: 1.22,
        w: 8.6,
        text: slide.title,
        fontSize: 26,
        fontFace: "Arial",
        color: white,
        bold: true,
      });

      const isTwoCol = slide.layout === "two-column";
      if (slide.content.length > 0) {
        if (!isTwoCol) {
          slide.content.forEach((line, i) => {
            elements.push({
              type: "text",
              x: 1.0,
              y: 2.0 + i * 0.42,
              w: 8.6,
              text: line,
              fontSize: 16,
              fontFace: "Arial",
              color: lightGray,
              bullet: true,
            });
          });
        } else {
          const mid = Math.ceil(slide.content.length / 2);
          const left = slide.content.slice(0, mid);
          const right = slide.content.slice(mid);
          left.forEach((line, i) => {
            elements.push({
              type: "text",
              x: 0.9,
              y: 2.0 + i * 0.38,
              w: 4.0,
              text: line,
              fontSize: 14,
              fontFace: "Arial",
              color: lightGray,
              bullet: true,
            });
          });
          right.forEach((line, i) => {
            elements.push({
              type: "text",
              x: 5.2,
              y: 2.0 + i * 0.38,
              w: 4.0,
              text: line,
              fontSize: 14,
              fontFace: "Arial",
              color: lightGray,
              bullet: true,
            });
          });
        }
      }
    }

    // Número do slide
    elements.push({
      type: "text",
      x: 9.0,
      y: 5.15,
      w: 0.9,
      text: slideNumText,
      fontSize: 10,
      fontFace: "Arial",
      color: "AAAAAA",
      align: "right",
    });

    out.slides.push({
      elements,
      notes: slide.notes,
      background: isCover ? primary : secondary,
    });
  });

  return out;
}
