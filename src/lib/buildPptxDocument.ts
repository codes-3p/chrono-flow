/**
 * buildPptxDocument – Designer-Grade Slide Builder
 * Creates rich, layered slide compositions with decorative elements,
 * gradient backgrounds, rounded cards, timeline connectors, and premium typography.
 * Supports both dark and light mode templates.
 */

import type { GeneratedPresentation, GeneratedSlide, SlideTemplate } from "@/data/templates";
import type { PtDocument, PtSlide, PtElement, PtShapeElement, PtTextElement, PtGradientFill } from "./pptxModel";
import { SLIDE_W, SLIDE_H } from "./pptxModel";

/* ── Helpers ── */
function hex(c: string): string { return c.replace("#", ""); }

function lighten(hexColor: string, amount: number): string {
  const c = hex(hexColor);
  const r = Math.min(255, parseInt(c.slice(0, 2), 16) + amount);
  const g = Math.min(255, parseInt(c.slice(2, 4), 16) + amount);
  const b = Math.min(255, parseInt(c.slice(4, 6), 16) + amount);
  return [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

function darken(hexColor: string, amount: number): string {
  const c = hex(hexColor);
  const r = Math.max(0, parseInt(c.slice(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(c.slice(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(c.slice(4, 6), 16) - amount);
  return [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

function withAlpha(hexColor: string, alpha: number): string {
  const a = Math.round(alpha * 255).toString(16).padStart(2, "0");
  return hex(hexColor) + a;
}

function isLight(template: SlideTemplate): boolean {
  return template.lightMode === true;
}

function textCol(template: SlideTemplate): string {
  return isLight(template) ? "0F172A" : "FFFFFF";
}

function subtextCol(template: SlideTemplate): string {
  return isLight(template) ? withAlpha("475569", 0.85) : withAlpha("FFFFFF", 0.65);
}

/* ── Reusable decorative element factories ── */

function decoCircle(x: number, y: number, r: number, color: string, alpha = 0.08): PtShapeElement {
  return { type: "shape", shape: "ellipse", x: x - r, y: y - r, w: r * 2, h: r * 2, fill: withAlpha(color, alpha) };
}

function accentBar(x: number, y: number, w: number, h: number, color: string): PtShapeElement {
  return { type: "shape", shape: "rect", x, y, w, h, fill: hex(color) };
}

function card(x: number, y: number, w: number, h: number, fillColor: string, alpha = 0.12, borderColor?: string): PtShapeElement {
  return {
    type: "shape", shape: "roundRect", x, y, w, h,
    fill: withAlpha(fillColor, alpha),
    rectRadius: 0.15,
    stroke: borderColor ? withAlpha(borderColor, 0.2) : undefined,
    strokeWidth: borderColor ? 1 : undefined,
  };
}

function iconCircle(x: number, y: number, size: number, color: string, alpha = 0.15): PtShapeElement {
  return { type: "shape", shape: "ellipse", x, y, w: size, h: size, fill: withAlpha(color, alpha) };
}

function gradientBg(template: SlideTemplate): PtGradientFill {
  const primary = template.colors.primary;
  const secondary = template.colors.secondary;
  if (isLight(template)) {
    return {
      type: "linear", angle: 135,
      stops: [
        { position: 0, color: hex(secondary) },
        { position: 100, color: lighten(secondary, 5) },
      ],
    };
  }
  return {
    type: "linear", angle: 135,
    stops: [
      { position: 0, color: hex(secondary) },
      { position: 60, color: darken(secondary, 10) },
      { position: 100, color: darken(secondary, 25) },
    ],
  };
}

function coverGradientBg(template: SlideTemplate): PtGradientFill {
  const primary = template.colors.primary;
  const secondary = template.colors.secondary;
  if (isLight(template)) {
    return {
      type: "linear", angle: 135,
      stops: [
        { position: 0, color: hex(secondary) },
        { position: 50, color: lighten(hex(primary), 200) },
        { position: 100, color: hex(secondary) },
      ],
    };
  }
  return {
    type: "linear", angle: 135,
    stops: [
      { position: 0, color: hex(primary) },
      { position: 50, color: darken(primary, 30) },
      { position: 100, color: hex(secondary) },
    ],
  };
}

function slideNumber(idx: number, total: number, accent: string): PtTextElement {
  return {
    type: "text", x: 8.8, y: 5.15, w: 1.1, h: 0.35,
    text: `${idx + 1} / ${total}`,
    fontSize: 9, fontFace: "Arial", color: withAlpha(accent, 0.5),
    align: "right", valign: "bottom",
  };
}

function bgDecorations(primary: string, accent: string): PtElement[] {
  return [
    decoCircle(9.5, 0.5, 1.8, accent, 0.04),
    decoCircle(-0.5, 5.0, 1.2, primary, 0.05),
    { type: "shape" as const, shape: "rect" as const, x: 0, y: 5.45, w: SLIDE_W, h: 0.015, fill: withAlpha(accent, 0.15) },
  ];
}

function titleSection(title: string, accent: string, template: SlideTemplate): PtElement[] {
  return [
    accentBar(0.6, 0.6, 0.07, 0.55, accent),
    {
      type: "text" as const, x: 0.85, y: 0.55, w: 8, h: 0.65,
      text: title, fontSize: 24, fontFace: "Calibri",
      color: textCol(template), bold: true,
    },
  ];
}

function cardBgAlpha(template: SlideTemplate, baseAlpha: number): number {
  return isLight(template) ? baseAlpha * 0.5 : baseAlpha;
}

/* ═══════════════════════════════════════════════════
   LAYOUT BUILDERS
   ═══════════════════════════════════════════════════ */

function buildCoverSlide(slide: GeneratedSlide, title: string, subtitle: string, template: SlideTemplate, idx: number, total: number): PtSlide {
  const { primary, secondary, accent } = template.colors;
  const els: PtElement[] = [];

  els.push(accentBar(0, 0, SLIDE_W, 0.06, accent));
  els.push({ type: "shape", shape: "rect", x: 0, y: 0.06, w: SLIDE_W, h: 0.03, fill: withAlpha(accent, 0.4) });
  els.push(decoCircle(8.0, 1.5, 2.5, accent, 0.06));
  els.push(decoCircle(8.5, 2.0, 1.5, primary, 0.08));
  els.push(decoCircle(1.0, 4.5, 1.0, accent, 0.04));
  els.push(accentBar(0.6, 1.8, 0.08, 2.0, accent));

  const displayTitle = idx === 0 ? (title || slide.title) : slide.title;
  els.push({
    type: "text", x: 0.95, y: 1.6, w: 7.5, h: 1.6,
    text: displayTitle, fontSize: 42, fontFace: "Calibri",
    color: textCol(template), bold: true, align: "left", valign: "middle",
    charSpacing: 1.5, lineSpacingPt: 50,
  });

  els.push(accentBar(0.95, 3.4, 2.5, 0.05, accent));

  const content = slide.content || [];
  const displaySub = idx === 0 ? (subtitle || content[0] || "") : content[0] || "";
  if (displaySub) {
    els.push({
      type: "text", x: 0.95, y: 3.65, w: 7.0, h: 0.8,
      text: displaySub, fontSize: 18, fontFace: "Calibri",
      color: withAlpha(accent, 0.9), italic: true, align: "left",
    });
  }

  els.push(accentBar(0, 5.45, SLIDE_W, 0.175, withAlpha(accent, 0.3)));
  els.push(slideNumber(idx, total, accent));

  return { elements: els, backgroundGradient: coverGradientBg(template) };
}

function buildBigNumberSlide(slide: GeneratedSlide, template: SlideTemplate, idx: number, total: number): PtSlide {
  const { primary, accent } = template.colors;
  const els: PtElement[] = [...bgDecorations(primary, accent)];

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));
  els.push({
    type: "text", x: 0.5, y: 0.8, w: 9, h: 0.5,
    text: slide.title.toUpperCase(), fontSize: 12, fontFace: "Calibri",
    color: subtextCol(template), align: "center", charSpacing: 4,
  });

  els.push(card(1.5, 1.6, 7, 2.4, accent, cardBgAlpha(template, 0.08)));
  els.push({
    type: "text", x: 1.5, y: 1.5, w: 7, h: 1.8,
    text: slide.bigNumber?.number || slide.content?.[0] || "0",
    fontSize: 72, fontFace: "Calibri", color: hex(accent),
    bold: true, align: "center", valign: "middle",
  });

  if (slide.bigNumber?.suffix) {
    els.push({
      type: "text", x: 1.5, y: 3.2, w: 7, h: 0.5,
      text: slide.bigNumber.suffix, fontSize: 20, fontFace: "Calibri",
      color: withAlpha(accent, 0.7), align: "center",
    });
  }

  if (slide.bigNumber?.context) {
    els.push({
      type: "text", x: 2.0, y: 4.0, w: 6, h: 0.7,
      text: slide.bigNumber.context, fontSize: 14, fontFace: "Calibri",
      color: subtextCol(template), align: "center",
    });
  }

  els.push(slideNumber(idx, total, accent));
  return { elements: els, backgroundGradient: gradientBg(template) };
}

function buildStatsSlide(slide: GeneratedSlide, template: SlideTemplate, idx: number, total: number): PtSlide {
  const { primary, accent } = template.colors;
  const els: PtElement[] = [...bgDecorations(primary, accent)];
  const stats = slide.stats || [];

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));
  els.push(...titleSection(slide.title, accent, template));

  const cardCount = Math.min(stats.length, 4);
  const totalGap = 0.25 * (cardCount - 1);
  const cardW = (8.8 - totalGap) / cardCount;
  const cardY = 1.6;

  stats.slice(0, 4).forEach((stat, i) => {
    const cx = 0.6 + i * (cardW + 0.25);
    els.push(card(cx, cardY, cardW, 1.8, primary, cardBgAlpha(template, 0.15), accent));
    els.push({ type: "shape", shape: "rect", x: cx + 0.2, y: cardY + 0.15, w: cardW - 0.4, h: 0.04, fill: hex(accent) });
    els.push(iconCircle(cx + cardW / 2 - 0.25, cardY + 0.35, 0.5, accent, 0.12));
    els.push({
      type: "text", x: cx, y: cardY + 0.9, w: cardW, h: 0.5,
      text: stat.value, fontSize: 28, fontFace: "Calibri",
      color: hex(accent), bold: true, align: "center",
    });
    els.push({
      type: "text", x: cx + 0.1, y: cardY + 1.35, w: cardW - 0.2, h: 0.35,
      text: stat.label, fontSize: 10, fontFace: "Calibri",
      color: subtextCol(template), align: "center",
    });
  });

  (slide.content || []).forEach((line, i) => {
    els.push({
      type: "text", x: 0.9, y: 3.75 + i * 0.35, w: 8.2, h: 0.3,
      text: line, fontSize: 12, fontFace: "Calibri",
      color: subtextCol(template), bullet: true,
    });
  });

  els.push(slideNumber(idx, total, accent));
  return { elements: els, backgroundGradient: gradientBg(template) };
}

function buildProcessSlide(slide: GeneratedSlide, template: SlideTemplate, idx: number, total: number): PtSlide {
  const { primary, accent } = template.colors;
  const els: PtElement[] = [...bgDecorations(primary, accent)];
  const steps = slide.steps || [];

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));
  els.push(...titleSection(slide.title, accent, template));

  const stepCount = Math.min(steps.length, 5);
  const totalGap = 0.2 * (stepCount - 1);
  const stepW = (8.8 - totalGap) / stepCount;
  const stepY = 1.6;

  steps.slice(0, 5).forEach((step, i) => {
    const sx = 0.6 + i * (stepW + 0.2);
    if (i > 0) {
      els.push({ type: "shape", shape: "rect", x: sx - 0.2, y: stepY + 0.4, w: 0.2, h: 0.06, fill: withAlpha(accent, 0.4) });
    }
    els.push(card(sx, stepY, stepW, 3.0, primary, cardBgAlpha(template, 0.1), accent));
    const circleSize = 0.5;
    els.push(iconCircle(sx + stepW / 2 - circleSize / 2, stepY + 0.2, circleSize, accent, 0.2));
    els.push({
      type: "text", x: sx + stepW / 2 - circleSize / 2, y: stepY + 0.2, w: circleSize, h: circleSize,
      text: `${i + 1}`, fontSize: 16, fontFace: "Calibri",
      color: hex(accent), bold: true, align: "center", valign: "middle",
    });
    els.push({
      type: "text", x: sx + 0.15, y: stepY + 0.85, w: stepW - 0.3, h: 0.5,
      text: step.step, fontSize: 12, fontFace: "Calibri",
      color: textCol(template), bold: true, align: "center",
    });
    els.push({ type: "shape", shape: "rect", x: sx + stepW * 0.2, y: stepY + 1.35, w: stepW * 0.6, h: 0.025, fill: withAlpha(accent, 0.3) });
    els.push({
      type: "text", x: sx + 0.15, y: stepY + 1.5, w: stepW - 0.3, h: 1.3,
      text: step.description, fontSize: 10, fontFace: "Calibri",
      color: subtextCol(template), align: "center",
    });
  });

  els.push(slideNumber(idx, total, accent));
  return { elements: els, backgroundGradient: gradientBg(template) };
}

function buildComparisonSlide(slide: GeneratedSlide, template: SlideTemplate, idx: number, total: number): PtSlide {
  const { primary, accent } = template.colors;
  const els: PtElement[] = [...bgDecorations(primary, accent)];
  const left = slide.comparison?.left;
  const right = slide.comparison?.right;

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));
  els.push(...titleSection(slide.title, accent, template));

  els.push(iconCircle(SLIDE_W / 2 - 0.3, 2.6, 0.6, accent, 0.25));
  els.push({
    type: "text", x: SLIDE_W / 2 - 0.3, y: 2.6, w: 0.6, h: 0.6,
    text: "VS", fontSize: 11, fontFace: "Calibri",
    color: hex(accent), bold: true, align: "center", valign: "middle",
  });

  [left, right].forEach((side, sideIdx) => {
    if (!side) return;
    const colX = sideIdx === 0 ? 0.6 : 5.2;
    const colW = 4.2;
    const isLeft = sideIdx === 0;
    const cardColor = isLeft ? primary : accent;

    els.push(card(colX, 1.5, colW, 3.4, cardColor, cardBgAlpha(template, 0.1), accent));
    els.push({ type: "shape", shape: "roundRect", x: colX, y: 1.5, w: colW, h: 0.7, fill: withAlpha(cardColor, isLight(template) ? 0.08 : 0.2), rectRadius: 0.15 });
    els.push({
      type: "text", x: colX + 0.2, y: 1.55, w: colW - 0.4, h: 0.6,
      text: side.title, fontSize: 16, fontFace: "Calibri",
      color: isLeft ? textCol(template) : hex(accent), bold: true, align: "center", valign: "middle",
    });

    (side.points || []).forEach((point, pi) => {
      els.push(iconCircle(colX + 0.3, 2.45 + pi * 0.5, 0.22, accent, 0.12));
      els.push({
        type: "text", x: colX + 0.6, y: 2.4 + pi * 0.5, w: colW - 0.9, h: 0.35,
        text: point, fontSize: 11, fontFace: "Calibri",
        color: subtextCol(template),
      });
    });
  });

  els.push(slideNumber(idx, total, accent));
  return { elements: els, backgroundGradient: gradientBg(template) };
}

function buildQuoteSlide(slide: GeneratedSlide, template: SlideTemplate, idx: number, total: number): PtSlide {
  const { primary, accent } = template.colors;
  const els: PtElement[] = [];
  const content = slide.content || [];

  els.push(decoCircle(1.5, 2.8, 3.0, primary, 0.06));
  els.push(decoCircle(8.5, 1.5, 2.0, accent, 0.05));
  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));
  els.push({
    type: "text", x: 0.8, y: 1.0, w: 2, h: 1.5,
    text: "❝", fontSize: 80, fontFace: "Georgia",
    color: withAlpha(accent, 0.25), align: "left",
  });
  els.push(card(1.0, 1.5, 8.0, 2.5, primary, cardBgAlpha(template, 0.08), accent));
  els.push({
    type: "text", x: 1.5, y: 1.8, w: 7.0, h: 1.5,
    text: slide.title, fontSize: 22, fontFace: "Georgia",
    color: textCol(template), italic: true, align: "center", valign: "middle",
    lineSpacingPt: 32,
  });

  if (content.length > 0) {
    els.push(accentBar(SLIDE_W / 2 - 0.75, 3.6, 1.5, 0.04, accent));
    els.push({
      type: "text", x: 1.5, y: 3.8, w: 7, h: 0.5,
      text: `— ${content[0]}`, fontSize: 14, fontFace: "Calibri",
      color: hex(accent), align: "center",
    });
  }

  els.push(slideNumber(idx, total, accent));
  return { elements: els, backgroundGradient: gradientBg(template) };
}

function buildHighlightSlide(slide: GeneratedSlide, template: SlideTemplate, idx: number, total: number): PtSlide {
  const { primary, accent } = template.colors;
  const els: PtElement[] = [...bgDecorations(primary, accent)];

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));
  els.push(...titleSection(slide.title, accent, template));

  if (slide.highlight) {
    els.push(card(0.6, 1.5, 8.8, 1.4, accent, cardBgAlpha(template, 0.12), accent));
    els.push(accentBar(0.6, 1.5, 0.1, 1.4, accent));
    els.push({
      type: "text", x: 1.0, y: 1.6, w: 8.0, h: 1.2,
      text: slide.highlight, fontSize: 16, fontFace: "Calibri",
      color: textCol(template), bold: true, valign: "middle", lineSpacingPt: 24,
    });
  }

  (slide.content || []).forEach((line, i) => {
    const by = 3.2 + i * 0.42;
    els.push(iconCircle(0.85, by + 0.05, 0.18, accent, 0.2));
    els.push({
      type: "text", x: 1.15, y: by, w: 8.2, h: 0.35,
      text: line, fontSize: 13, fontFace: "Calibri",
      color: subtextCol(template),
    });
  });

  els.push(slideNumber(idx, total, accent));
  return { elements: els, backgroundGradient: gradientBg(template) };
}

function buildContentSlide(slide: GeneratedSlide, template: SlideTemplate, idx: number, total: number): PtSlide {
  const { primary, accent } = template.colors;
  const els: PtElement[] = [...bgDecorations(primary, accent)];
  const content = slide.content || [];
  const isTwoCol = slide.layout === "two-column";

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));
  els.push(...titleSection(slide.title, accent, template));
  els.push({ type: "shape", shape: "rect", x: 0.85, y: 1.25, w: 2.0, h: 0.035, fill: hex(accent) });

  if (content.length > 0) {
    if (!isTwoCol) {
      content.forEach((line, i) => {
        const by = 1.6 + i * 0.55;
        els.push(card(0.6, by, 8.8, 0.48, primary, cardBgAlpha(template, 0.06)));
        els.push(iconCircle(0.75, by + 0.12, 0.22, accent, 0.15));
        els.push({
          type: "text", x: 1.1, y: by + 0.05, w: 8.0, h: 0.38,
          text: line, fontSize: 14, fontFace: "Calibri",
          color: subtextCol(template), valign: "middle",
        });
      });
    } else {
      const mid = Math.ceil(content.length / 2);
      const leftItems = content.slice(0, mid);
      const rightItems = content.slice(mid);

      els.push(card(0.6, 1.6, 4.2, 3.2, primary, cardBgAlpha(template, 0.08), accent));
      leftItems.forEach((line, i) => {
        els.push(iconCircle(0.85, 1.85 + i * 0.5, 0.18, accent, 0.15));
        els.push({
          type: "text", x: 1.15, y: 1.8 + i * 0.5, w: 3.4, h: 0.4,
          text: line, fontSize: 12, fontFace: "Calibri", color: subtextCol(template),
        });
      });

      els.push(card(5.2, 1.6, 4.2, 3.2, primary, cardBgAlpha(template, 0.08), accent));
      rightItems.forEach((line, i) => {
        els.push(iconCircle(5.45, 1.85 + i * 0.5, 0.18, accent, 0.15));
        els.push({
          type: "text", x: 5.75, y: 1.8 + i * 0.5, w: 3.4, h: 0.4,
          text: line, fontSize: 12, fontFace: "Calibri", color: subtextCol(template),
        });
      });
    }
  }

  els.push(slideNumber(idx, total, accent));
  return { elements: els, backgroundGradient: gradientBg(template) };
}

function buildClosingSlide(slide: GeneratedSlide, template: SlideTemplate, idx: number, total: number): PtSlide {
  const { primary, accent } = template.colors;
  const els: PtElement[] = [];
  const content = slide.content || [];

  els.push(decoCircle(5.0, 2.8, 3.5, accent, 0.05));
  els.push(decoCircle(2.0, 1.5, 2.0, primary, 0.06));
  els.push(accentBar(0, 0, SLIDE_W, 0.06, accent));
  els.push({ type: "shape", shape: "rect", x: 0, y: 0.06, w: SLIDE_W, h: 0.03, fill: withAlpha(accent, 0.4) });

  els.push({
    type: "text", x: 0.5, y: 1.8, w: 9, h: 1.2,
    text: slide.title, fontSize: 38, fontFace: "Calibri",
    color: textCol(template), bold: true, align: "center", valign: "middle", charSpacing: 2,
  });
  els.push(accentBar(SLIDE_W / 2 - 1.5, 3.2, 3.0, 0.05, accent));

  if (content[0]) {
    els.push({
      type: "text", x: 1.5, y: 3.5, w: 7, h: 0.7,
      text: content[0], fontSize: 16, fontFace: "Calibri",
      color: withAlpha(accent, 0.85), align: "center",
    });
  }

  els.push(accentBar(0, 5.45, SLIDE_W, 0.175, withAlpha(accent, 0.3)));
  els.push(slideNumber(idx, total, accent));
  return { elements: els, backgroundGradient: coverGradientBg(template) };
}

/* ── NEW LAYOUT BUILDERS ── */

function buildIconGridSlide(slide: GeneratedSlide, template: SlideTemplate, idx: number, total: number): PtSlide {
  const { primary, accent } = template.colors;
  const els: PtElement[] = [...bgDecorations(primary, accent)];
  const items = slide.gridItems || [];

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));
  els.push(...titleSection(slide.title, accent, template));

  const cols = items.length <= 4 ? 2 : 3;
  const rows = Math.ceil(Math.min(items.length, 6) / cols);
  const cellW = (8.8 - (cols - 1) * 0.25) / cols;
  const cellH = (3.6 - (rows - 1) * 0.2) / rows;

  items.slice(0, 6).forEach((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = 0.6 + col * (cellW + 0.25);
    const cy = 1.5 + row * (cellH + 0.2);

    els.push(card(cx, cy, cellW, cellH, primary, cardBgAlpha(template, 0.08), accent));
    els.push(iconCircle(cx + cellW / 2 - 0.25, cy + 0.15, 0.5, accent, 0.12));
    els.push({
      type: "text", x: cx + 0.1, y: cy + 0.7, w: cellW - 0.2, h: 0.35,
      text: item.title, fontSize: 12, fontFace: "Calibri",
      color: textCol(template), bold: true, align: "center",
    });
    els.push({
      type: "text", x: cx + 0.1, y: cy + 1.0, w: cellW - 0.2, h: 0.5,
      text: item.description, fontSize: 10, fontFace: "Calibri",
      color: subtextCol(template), align: "center",
    });
  });

  els.push(slideNumber(idx, total, accent));
  return { elements: els, backgroundGradient: gradientBg(template) };
}

function buildThreeColumnSlide(slide: GeneratedSlide, template: SlideTemplate, idx: number, total: number): PtSlide {
  const { primary, accent } = template.colors;
  const els: PtElement[] = [...bgDecorations(primary, accent)];
  const columns = slide.columns || [];

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));
  els.push(...titleSection(slide.title, accent, template));

  const colW = 2.8;
  columns.slice(0, 3).forEach((col, i) => {
    const cx = 0.6 + i * (colW + 0.3);
    els.push(card(cx, 1.5, colW, 3.5, primary, cardBgAlpha(template, 0.08), accent));
    els.push({ type: "shape", shape: "roundRect", x: cx, y: 1.5, w: colW, h: 0.6, fill: withAlpha(accent, isLight(template) ? 0.06 : 0.1), rectRadius: 0.15 });
    els.push({
      type: "text", x: cx + 0.1, y: 1.55, w: colW - 0.2, h: 0.5,
      text: col.title, fontSize: 14, fontFace: "Calibri",
      color: textCol(template), bold: true, align: "center", valign: "middle",
    });

    (col.points || []).forEach((pt, pi) => {
      els.push(iconCircle(cx + 0.2, 2.35 + pi * 0.45, 0.15, accent, 0.12));
      els.push({
        type: "text", x: cx + 0.45, y: 2.3 + pi * 0.45, w: colW - 0.65, h: 0.35,
        text: pt, fontSize: 10, fontFace: "Calibri", color: subtextCol(template),
      });
    });
  });

  els.push(slideNumber(idx, total, accent));
  return { elements: els, backgroundGradient: gradientBg(template) };
}

function buildRoadmapSlide(slide: GeneratedSlide, template: SlideTemplate, idx: number, total: number): PtSlide {
  const { primary, accent } = template.colors;
  const els: PtElement[] = [...bgDecorations(primary, accent)];
  const milestones = slide.milestones || [];

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));
  els.push(...titleSection(slide.title, accent, template));

  // Vertical timeline line
  els.push({ type: "shape", shape: "rect", x: 1.5, y: 1.5, w: 0.04, h: 3.6, fill: withAlpha(accent, 0.3) });

  milestones.slice(0, 5).forEach((ms, i) => {
    const my = 1.5 + i * 0.75;
    els.push(iconCircle(1.35, my + 0.05, 0.35, accent, 0.2));
    els.push({
      type: "text", x: 1.35, y: my + 0.05, w: 0.35, h: 0.35,
      text: `${i + 1}`, fontSize: 10, fontFace: "Calibri",
      color: hex(accent), bold: true, align: "center", valign: "middle",
    });
    els.push({
      type: "text", x: 2.0, y: my, w: 1.5, h: 0.35,
      text: ms.phase, fontSize: 10, fontFace: "Calibri",
      color: hex(accent), bold: true,
    });
    els.push(card(3.5, my - 0.05, 5.8, 0.55, primary, cardBgAlpha(template, 0.06), accent));
    els.push({
      type: "text", x: 3.7, y: my, w: 2.0, h: 0.35,
      text: ms.title, fontSize: 12, fontFace: "Calibri",
      color: textCol(template), bold: true,
    });
    els.push({
      type: "text", x: 5.8, y: my, w: 3.3, h: 0.35,
      text: ms.description, fontSize: 10, fontFace: "Calibri",
      color: subtextCol(template),
    });
  });

  els.push(slideNumber(idx, total, accent));
  return { elements: els, backgroundGradient: gradientBg(template) };
}

function buildTeamSlide(slide: GeneratedSlide, template: SlideTemplate, idx: number, total: number): PtSlide {
  const { primary, accent } = template.colors;
  const els: PtElement[] = [...bgDecorations(primary, accent)];
  const members = slide.members || [];

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));
  els.push(...titleSection(slide.title, accent, template));

  const count = Math.min(members.length, 4);
  const cardW = (8.8 - (count - 1) * 0.25) / count;

  members.slice(0, 4).forEach((m, i) => {
    const cx = 0.6 + i * (cardW + 0.25);
    els.push(card(cx, 1.5, cardW, 3.2, primary, cardBgAlpha(template, 0.08), accent));
    els.push(iconCircle(cx + cardW / 2 - 0.4, 1.7, 0.8, accent, 0.15));
    els.push({
      type: "text", x: cx + cardW / 2 - 0.4, y: 1.7, w: 0.8, h: 0.8,
      text: m.name.charAt(0).toUpperCase(), fontSize: 28, fontFace: "Calibri",
      color: hex(accent), bold: true, align: "center", valign: "middle",
    });
    els.push({
      type: "text", x: cx + 0.1, y: 2.65, w: cardW - 0.2, h: 0.4,
      text: m.name, fontSize: 14, fontFace: "Calibri",
      color: textCol(template), bold: true, align: "center",
    });
    els.push({
      type: "text", x: cx + 0.1, y: 3.0, w: cardW - 0.2, h: 0.3,
      text: m.role, fontSize: 10, fontFace: "Calibri",
      color: hex(accent), align: "center",
    });
    els.push({
      type: "text", x: cx + 0.15, y: 3.35, w: cardW - 0.3, h: 0.8,
      text: m.description, fontSize: 9, fontFace: "Calibri",
      color: subtextCol(template), align: "center",
    });
  });

  els.push(slideNumber(idx, total, accent));
  return { elements: els, backgroundGradient: gradientBg(template) };
}

function buildSwotSlide(slide: GeneratedSlide, template: SlideTemplate, idx: number, total: number): PtSlide {
  const { primary, accent } = template.colors;
  const els: PtElement[] = [...bgDecorations(primary, accent)];
  const swot = slide.swot;

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));
  els.push(...titleSection(slide.title, accent, template));

  const quadrants = [
    { title: "Strengths", items: swot?.strengths || [], color: "22C55E" },
    { title: "Weaknesses", items: swot?.weaknesses || [], color: "EF4444" },
    { title: "Opportunities", items: swot?.opportunities || [], color: "3B82F6" },
    { title: "Threats", items: swot?.threats || [], color: "F59E0B" },
  ];

  quadrants.forEach((q, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const qx = 0.6 + col * 4.7;
    const qy = 1.5 + row * 1.9;
    const qw = 4.3;
    const qh = 1.7;

    els.push(card(qx, qy, qw, qh, q.color, cardBgAlpha(template, 0.06)));
    els.push({ type: "shape", shape: "rect", x: qx, y: qy, w: qw, h: 0.04, fill: q.color });
    els.push({
      type: "text", x: qx + 0.15, y: qy + 0.1, w: qw - 0.3, h: 0.35,
      text: q.title, fontSize: 13, fontFace: "Calibri",
      color: q.color, bold: true,
    });

    q.items.slice(0, 3).forEach((item, ii) => {
      els.push({
        type: "text", x: qx + 0.3, y: qy + 0.5 + ii * 0.35, w: qw - 0.5, h: 0.3,
        text: item, fontSize: 10, fontFace: "Calibri",
        color: subtextCol(template), bullet: true,
      });
    });
  });

  els.push(slideNumber(idx, total, accent));
  return { elements: els, backgroundGradient: gradientBg(template) };
}

function buildPyramidSlide(slide: GeneratedSlide, template: SlideTemplate, idx: number, total: number): PtSlide {
  const { primary, accent } = template.colors;
  const els: PtElement[] = [...bgDecorations(primary, accent)];
  const levels = slide.pyramidLevels || [];

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));
  els.push(...titleSection(slide.title, accent, template));

  const count = Math.min(levels.length, 5);
  levels.slice(0, count).forEach((level, i) => {
    const widthRatio = 0.3 + ((count - 1 - i) / (count - 1 || 1)) * 0.6;
    const w = 8.0 * widthRatio;
    const x = SLIDE_W / 2 - w / 2;
    const y = 1.5 + i * 0.75;
    const opacity = 0.9 - i * 0.12;

    els.push(card(x, y, w, 0.6, accent, cardBgAlpha(template, opacity * 0.15)));
    els.push({
      type: "text", x: x + 0.1, y: y + 0.05, w: w * 0.35, h: 0.5,
      text: level.label, fontSize: 12, fontFace: "Calibri",
      color: hex(accent), bold: true, valign: "middle",
    });
    els.push({
      type: "text", x: x + w * 0.38, y: y + 0.05, w: w * 0.58, h: 0.5,
      text: level.description, fontSize: 10, fontFace: "Calibri",
      color: subtextCol(template), valign: "middle",
    });
  });

  els.push(slideNumber(idx, total, accent));
  return { elements: els, backgroundGradient: gradientBg(template) };
}

/* ═══════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════ */

export function buildPptxDocument(presentation: GeneratedPresentation): PtDocument {
  const { title, subtitle, template } = presentation;
  const slides = presentation.slides || [];
  const total = slides.length;

  const out: PtDocument = { slides: [] };

  slides.forEach((slide, idx) => {
    const layout = slide.layout || "content";

    let ptSlide: PtSlide;

    switch (layout) {
      case "title":
        ptSlide = buildCoverSlide(slide, title, subtitle, template, idx, total);
        break;
      case "closing":
        ptSlide = buildClosingSlide(slide, template, idx, total);
        break;
      case "bigNumber":
        ptSlide = buildBigNumberSlide(slide, template, idx, total);
        break;
      case "stats":
        ptSlide = buildStatsSlide(slide, template, idx, total);
        break;
      case "process":
        ptSlide = buildProcessSlide(slide, template, idx, total);
        break;
      case "comparison":
        ptSlide = buildComparisonSlide(slide, template, idx, total);
        break;
      case "quote":
        ptSlide = buildQuoteSlide(slide, template, idx, total);
        break;
      case "highlight":
        ptSlide = buildHighlightSlide(slide, template, idx, total);
        break;
      case "iconGrid":
        ptSlide = buildIconGridSlide(slide, template, idx, total);
        break;
      case "threeColumn":
        ptSlide = buildThreeColumnSlide(slide, template, idx, total);
        break;
      case "roadmap":
        ptSlide = buildRoadmapSlide(slide, template, idx, total);
        break;
      case "team":
        ptSlide = buildTeamSlide(slide, template, idx, total);
        break;
      case "swot":
        ptSlide = buildSwotSlide(slide, template, idx, total);
        break;
      case "pyramid":
        ptSlide = buildPyramidSlide(slide, template, idx, total);
        break;
      default:
        ptSlide = buildContentSlide(slide, template, idx, total);
        break;
    }

    ptSlide.notes = slide.notes;
    out.slides.push(ptSlide);
  });

  return out;
}
