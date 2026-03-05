/**
 * buildPptxDocument – Designer-Grade Slide Builder
 * Creates rich, layered slide compositions with decorative elements,
 * gradient backgrounds, rounded cards, timeline connectors, and premium typography.
 */

import type { GeneratedPresentation, GeneratedSlide } from "@/data/templates";
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

function gradientBg(primary: string, secondary: string): PtGradientFill {
  return {
    type: "linear", angle: 135,
    stops: [
      { position: 0, color: hex(secondary) },
      { position: 60, color: darken(secondary, 10) },
      { position: 100, color: darken(secondary, 25) },
    ],
  };
}

function coverGradientBg(primary: string, secondary: string): PtGradientFill {
  return {
    type: "linear", angle: 135,
    stops: [
      { position: 0, color: hex(primary) },
      { position: 50, color: darken(primary, 30) },
      { position: 100, color: hex(secondary) },
    ],
  };
}

/* ── Slide number ── */
function slideNumber(idx: number, total: number, accent: string): PtTextElement {
  return {
    type: "text", x: 8.8, y: 5.15, w: 1.1, h: 0.35,
    text: `${idx + 1} / ${total}`,
    fontSize: 9, fontFace: "Arial", color: withAlpha(accent, 0.5),
    align: "right", valign: "bottom",
  };
}

/* ── Common decorative layer (subtle bg ornamentation) ── */
function bgDecorations(primary: string, accent: string): PtElement[] {
  return [
    decoCircle(9.5, 0.5, 1.8, accent, 0.04),
    decoCircle(-0.5, 5.0, 1.2, primary, 0.05),
    // subtle horizontal line
    { type: "shape" as const, shape: "rect" as const, x: 0, y: 5.45, w: SLIDE_W, h: 0.015, fill: withAlpha(accent, 0.15) },
  ];
}

/* ═══════════════════════════════════════════════════
   LAYOUT BUILDERS
   ═══════════════════════════════════════════════════ */

function buildCoverSlide(slide: GeneratedSlide, title: string, subtitle: string, primary: string, secondary: string, accent: string, idx: number, total: number): PtSlide {
  const els: PtElement[] = [];

  // Top accent bar with gradient effect
  els.push(accentBar(0, 0, SLIDE_W, 0.06, accent));
  els.push({ type: "shape", shape: "rect", x: 0, y: 0.06, w: SLIDE_W, h: 0.03, fill: withAlpha(accent, 0.4) });

  // Decorative large circles
  els.push(decoCircle(8.0, 1.5, 2.5, accent, 0.06));
  els.push(decoCircle(8.5, 2.0, 1.5, primary, 0.08));
  els.push(decoCircle(1.0, 4.5, 1.0, accent, 0.04));

  // Left accent stripe
  els.push(accentBar(0.6, 1.8, 0.08, 2.0, accent));

  // Title
  const displayTitle = idx === 0 ? (title || slide.title) : slide.title;
  els.push({
    type: "text", x: 0.95, y: 1.6, w: 7.5, h: 1.6,
    text: displayTitle, fontSize: 42, fontFace: "Calibri",
    color: "FFFFFF", bold: true, align: "left", valign: "middle",
    charSpacing: 1.5, lineSpacingPt: 50,
  });

  // Divider line
  els.push(accentBar(0.95, 3.4, 2.5, 0.05, accent));

  // Subtitle
  const content = slide.content || [];
  const displaySub = idx === 0 ? (subtitle || content[0] || "") : content[0] || "";
  if (displaySub) {
    els.push({
      type: "text", x: 0.95, y: 3.65, w: 7.0, h: 0.8,
      text: displaySub, fontSize: 18, fontFace: "Calibri",
      color: withAlpha(accent, 0.9), italic: true, align: "left",
    });
  }

  // Bottom decorative bar
  els.push(accentBar(0, 5.45, SLIDE_W, 0.175, withAlpha(accent, 0.3)));

  els.push(slideNumber(idx, total, accent));

  return {
    elements: els,
    backgroundGradient: coverGradientBg(primary, secondary),
  };
}

function buildBigNumberSlide(slide: GeneratedSlide, primary: string, secondary: string, accent: string, idx: number, total: number): PtSlide {
  const els: PtElement[] = [...bgDecorations(primary, accent)];
  const content = slide.content || [];

  // Top bar
  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));

  // Label above number
  els.push({
    type: "text", x: 0.5, y: 0.8, w: 9, h: 0.5,
    text: slide.title.toUpperCase(), fontSize: 12, fontFace: "Calibri",
    color: withAlpha("FFFFFF", 0.5), align: "center", charSpacing: 4,
  });

  // Big number with card behind
  els.push(card(1.5, 1.6, 7, 2.4, accent, 0.08));
  els.push({
    type: "text", x: 1.5, y: 1.5, w: 7, h: 1.8,
    text: slide.bigNumber?.number || content[0] || "0",
    fontSize: 72, fontFace: "Calibri", color: hex(accent),
    bold: true, align: "center", valign: "middle",
  });

  // Suffix
  if (slide.bigNumber?.suffix) {
    els.push({
      type: "text", x: 1.5, y: 3.2, w: 7, h: 0.5,
      text: slide.bigNumber.suffix, fontSize: 20, fontFace: "Calibri",
      color: withAlpha(accent, 0.7), align: "center",
    });
  }

  // Context
  if (slide.bigNumber?.context) {
    els.push({
      type: "text", x: 2.0, y: 4.0, w: 6, h: 0.7,
      text: slide.bigNumber.context, fontSize: 14, fontFace: "Calibri",
      color: withAlpha("FFFFFF", 0.6), align: "center",
    });
  }

  els.push(slideNumber(idx, total, accent));

  return {
    elements: els,
    backgroundGradient: gradientBg(primary, secondary),
  };
}

function buildStatsSlide(slide: GeneratedSlide, primary: string, secondary: string, accent: string, idx: number, total: number): PtSlide {
  const els: PtElement[] = [...bgDecorations(primary, accent)];
  const content = slide.content || [];
  const stats = slide.stats || [];

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));

  // Title with left accent
  els.push(accentBar(0.6, 0.6, 0.07, 0.55, accent));
  els.push({
    type: "text", x: 0.85, y: 0.55, w: 8, h: 0.65,
    text: slide.title, fontSize: 24, fontFace: "Calibri",
    color: "FFFFFF", bold: true,
  });

  // Stats cards
  const cardCount = Math.min(stats.length, 4);
  const totalGap = 0.25 * (cardCount - 1);
  const cardW = (8.8 - totalGap) / cardCount;
  const cardY = 1.6;

  stats.slice(0, 4).forEach((stat, i) => {
    const cx = 0.6 + i * (cardW + 0.25);

    // Card bg
    els.push(card(cx, cardY, cardW, 1.8, primary, 0.15, accent));

    // Top accent line on card
    els.push({ type: "shape", shape: "rect", x: cx + 0.2, y: cardY + 0.15, w: cardW - 0.4, h: 0.04, fill: hex(accent) });

    // Icon circle
    els.push(iconCircle(cx + cardW / 2 - 0.25, cardY + 0.35, 0.5, accent, 0.12));

    // Stat value
    els.push({
      type: "text", x: cx, y: cardY + 0.9, w: cardW, h: 0.5,
      text: stat.value, fontSize: 28, fontFace: "Calibri",
      color: hex(accent), bold: true, align: "center",
    });

    // Stat label
    els.push({
      type: "text", x: cx + 0.1, y: cardY + 1.35, w: cardW - 0.2, h: 0.35,
      text: stat.label, fontSize: 10, fontFace: "Calibri",
      color: withAlpha("FFFFFF", 0.55), align: "center",
    });
  });

  // Bullets below
  content.forEach((line, i) => {
    els.push({
      type: "text", x: 0.9, y: 3.75 + i * 0.35, w: 8.2, h: 0.3,
      text: line, fontSize: 12, fontFace: "Calibri",
      color: withAlpha("FFFFFF", 0.7), bullet: true,
    });
  });

  els.push(slideNumber(idx, total, accent));

  return {
    elements: els,
    backgroundGradient: gradientBg(primary, secondary),
  };
}

function buildProcessSlide(slide: GeneratedSlide, primary: string, secondary: string, accent: string, idx: number, total: number): PtSlide {
  const els: PtElement[] = [...bgDecorations(primary, accent)];
  const steps = slide.steps || [];

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));

  // Title
  els.push(accentBar(0.6, 0.6, 0.07, 0.55, accent));
  els.push({
    type: "text", x: 0.85, y: 0.55, w: 8, h: 0.65,
    text: slide.title, fontSize: 24, fontFace: "Calibri",
    color: "FFFFFF", bold: true,
  });

  const stepCount = Math.min(steps.length, 5);
  const totalGap = 0.2 * (stepCount - 1);
  const stepW = (8.8 - totalGap) / stepCount;
  const stepY = 1.6;

  steps.slice(0, 5).forEach((step, i) => {
    const sx = 0.6 + i * (stepW + 0.2);

    // Connector line between steps
    if (i > 0) {
      els.push({
        type: "shape", shape: "rect",
        x: sx - 0.2, y: stepY + 0.4, w: 0.2, h: 0.06,
        fill: withAlpha(accent, 0.4),
      });
    }

    // Card
    els.push(card(sx, stepY, stepW, 3.0, primary, 0.1, accent));

    // Step number circle
    const circleSize = 0.5;
    els.push(iconCircle(sx + stepW / 2 - circleSize / 2, stepY + 0.2, circleSize, accent, 0.2));
    els.push({
      type: "text", x: sx + stepW / 2 - circleSize / 2, y: stepY + 0.2, w: circleSize, h: circleSize,
      text: `${i + 1}`, fontSize: 16, fontFace: "Calibri",
      color: hex(accent), bold: true, align: "center", valign: "middle",
    });

    // Step title
    els.push({
      type: "text", x: sx + 0.15, y: stepY + 0.85, w: stepW - 0.3, h: 0.5,
      text: step.step, fontSize: 12, fontFace: "Calibri",
      color: "FFFFFF", bold: true, align: "center",
    });

    // Divider
    els.push({
      type: "shape", shape: "rect",
      x: sx + stepW * 0.2, y: stepY + 1.35, w: stepW * 0.6, h: 0.025,
      fill: withAlpha(accent, 0.3),
    });

    // Step description
    els.push({
      type: "text", x: sx + 0.15, y: stepY + 1.5, w: stepW - 0.3, h: 1.3,
      text: step.description, fontSize: 10, fontFace: "Calibri",
      color: withAlpha("FFFFFF", 0.6), align: "center",
    });
  });

  els.push(slideNumber(idx, total, accent));

  return {
    elements: els,
    backgroundGradient: gradientBg(primary, secondary),
  };
}

function buildComparisonSlide(slide: GeneratedSlide, primary: string, secondary: string, accent: string, idx: number, total: number): PtSlide {
  const els: PtElement[] = [...bgDecorations(primary, accent)];
  const left = slide.comparison?.left;
  const right = slide.comparison?.right;

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));

  // Title
  els.push(accentBar(0.6, 0.6, 0.07, 0.55, accent));
  els.push({
    type: "text", x: 0.85, y: 0.55, w: 8, h: 0.65,
    text: slide.title, fontSize: 24, fontFace: "Calibri",
    color: "FFFFFF", bold: true,
  });

  // VS badge
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

    // Card
    els.push(card(colX, 1.5, colW, 3.4, cardColor, 0.1, accent));

    // Header bg
    els.push({
      type: "shape", shape: "roundRect", x: colX, y: 1.5, w: colW, h: 0.7,
      fill: withAlpha(cardColor, 0.2), rectRadius: 0.15,
    });

    // Title
    els.push({
      type: "text", x: colX + 0.2, y: 1.55, w: colW - 0.4, h: 0.6,
      text: side.title, fontSize: 16, fontFace: "Calibri",
      color: isLeft ? "FFFFFF" : hex(accent), bold: true, align: "center", valign: "middle",
    });

    // Points
    (side.points || []).forEach((point, pi) => {
      els.push(iconCircle(colX + 0.3, 2.45 + pi * 0.5, 0.22, accent, 0.12));
      els.push({
        type: "text", x: colX + 0.6, y: 2.4 + pi * 0.5, w: colW - 0.9, h: 0.35,
        text: point, fontSize: 11, fontFace: "Calibri",
        color: withAlpha("FFFFFF", 0.75),
      });
    });
  });

  els.push(slideNumber(idx, total, accent));

  return {
    elements: els,
    backgroundGradient: gradientBg(primary, secondary),
  };
}

function buildQuoteSlide(slide: GeneratedSlide, primary: string, secondary: string, accent: string, idx: number, total: number): PtSlide {
  const els: PtElement[] = [];
  const content = slide.content || [];

  // Decorative circles
  els.push(decoCircle(1.5, 2.8, 3.0, primary, 0.06));
  els.push(decoCircle(8.5, 1.5, 2.0, accent, 0.05));

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));

  // Large quote mark
  els.push({
    type: "text", x: 0.8, y: 1.0, w: 2, h: 1.5,
    text: "❝", fontSize: 80, fontFace: "Georgia",
    color: withAlpha(accent, 0.25), align: "left",
  });

  // Quote card
  els.push(card(1.0, 1.5, 8.0, 2.5, primary, 0.08, accent));

  // Quote text
  els.push({
    type: "text", x: 1.5, y: 1.8, w: 7.0, h: 1.5,
    text: slide.title, fontSize: 22, fontFace: "Georgia",
    color: "FFFFFF", italic: true, align: "center", valign: "middle",
    lineSpacingPt: 32,
  });

  // Attribution
  if (content.length > 0) {
    els.push(accentBar(SLIDE_W / 2 - 0.75, 3.6, 1.5, 0.04, accent));
    els.push({
      type: "text", x: 1.5, y: 3.8, w: 7, h: 0.5,
      text: `— ${content[0]}`, fontSize: 14, fontFace: "Calibri",
      color: hex(accent), align: "center",
    });
  }

  els.push(slideNumber(idx, total, accent));

  return {
    elements: els,
    backgroundGradient: gradientBg(primary, secondary),
  };
}

function buildHighlightSlide(slide: GeneratedSlide, primary: string, secondary: string, accent: string, idx: number, total: number): PtSlide {
  const els: PtElement[] = [...bgDecorations(primary, accent)];
  const content = slide.content || [];

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));

  // Title
  els.push(accentBar(0.6, 0.6, 0.07, 0.55, accent));
  els.push({
    type: "text", x: 0.85, y: 0.55, w: 8, h: 0.65,
    text: slide.title, fontSize: 24, fontFace: "Calibri",
    color: "FFFFFF", bold: true,
  });

  // Highlight card (prominent)
  if (slide.highlight) {
    els.push(card(0.6, 1.5, 8.8, 1.4, accent, 0.12, accent));
    els.push(accentBar(0.6, 1.5, 0.1, 1.4, accent)); // left accent bar
    els.push({
      type: "text", x: 1.0, y: 1.6, w: 8.0, h: 1.2,
      text: slide.highlight, fontSize: 16, fontFace: "Calibri",
      color: "FFFFFF", bold: true, valign: "middle",
      lineSpacingPt: 24,
    });
  }

  // Bullets with icon dots
  content.forEach((line, i) => {
    const by = 3.2 + i * 0.42;
    els.push(iconCircle(0.85, by + 0.05, 0.18, accent, 0.2));
    els.push({
      type: "text", x: 1.15, y: by, w: 8.2, h: 0.35,
      text: line, fontSize: 13, fontFace: "Calibri",
      color: withAlpha("FFFFFF", 0.75),
    });
  });

  els.push(slideNumber(idx, total, accent));

  return {
    elements: els,
    backgroundGradient: gradientBg(primary, secondary),
  };
}

function buildContentSlide(slide: GeneratedSlide, primary: string, secondary: string, accent: string, idx: number, total: number): PtSlide {
  const els: PtElement[] = [...bgDecorations(primary, accent)];
  const content = slide.content || [];
  const isTwoCol = slide.layout === "two-column";

  els.push(accentBar(0, 0, SLIDE_W, 0.05, accent));

  // Title with accent bar
  els.push(accentBar(0.6, 0.6, 0.07, 0.55, accent));
  els.push({
    type: "text", x: 0.85, y: 0.55, w: 8, h: 0.65,
    text: slide.title, fontSize: 24, fontFace: "Calibri",
    color: "FFFFFF", bold: true,
  });

  // Decorative divider under title
  els.push({ type: "shape", shape: "rect", x: 0.85, y: 1.25, w: 2.0, h: 0.035, fill: hex(accent) });

  if (content.length > 0) {
    if (!isTwoCol) {
      // Cards-style bullets
      content.forEach((line, i) => {
        const by = 1.6 + i * 0.55;
        // Subtle card bg
        els.push(card(0.6, by, 8.8, 0.48, primary, 0.06));
        // Accent dot
        els.push(iconCircle(0.75, by + 0.12, 0.22, accent, 0.15));
        // Text
        els.push({
          type: "text", x: 1.1, y: by + 0.05, w: 8.0, h: 0.38,
          text: line, fontSize: 14, fontFace: "Calibri",
          color: withAlpha("FFFFFF", 0.8), valign: "middle",
        });
      });
    } else {
      // Two column with cards
      const mid = Math.ceil(content.length / 2);
      const leftItems = content.slice(0, mid);
      const rightItems = content.slice(mid);

      // Left card
      els.push(card(0.6, 1.6, 4.2, 3.2, primary, 0.08, accent));
      leftItems.forEach((line, i) => {
        els.push(iconCircle(0.85, 1.85 + i * 0.5, 0.18, accent, 0.15));
        els.push({
          type: "text", x: 1.15, y: 1.8 + i * 0.5, w: 3.4, h: 0.4,
          text: line, fontSize: 12, fontFace: "Calibri",
          color: withAlpha("FFFFFF", 0.75),
        });
      });

      // Right card
      els.push(card(5.2, 1.6, 4.2, 3.2, primary, 0.08, accent));
      rightItems.forEach((line, i) => {
        els.push(iconCircle(5.45, 1.85 + i * 0.5, 0.18, accent, 0.15));
        els.push({
          type: "text", x: 5.75, y: 1.8 + i * 0.5, w: 3.4, h: 0.4,
          text: line, fontSize: 12, fontFace: "Calibri",
          color: withAlpha("FFFFFF", 0.75),
        });
      });
    }
  }

  els.push(slideNumber(idx, total, accent));

  return {
    elements: els,
    backgroundGradient: gradientBg(primary, secondary),
  };
}

function buildClosingSlide(slide: GeneratedSlide, primary: string, secondary: string, accent: string, idx: number, total: number): PtSlide {
  const els: PtElement[] = [];
  const content = slide.content || [];

  // Decorative circles
  els.push(decoCircle(5.0, 2.8, 3.5, accent, 0.05));
  els.push(decoCircle(2.0, 1.5, 2.0, primary, 0.06));
  els.push(decoCircle(8.0, 4.0, 1.5, accent, 0.04));

  els.push(accentBar(0, 0, SLIDE_W, 0.06, accent));
  els.push({ type: "shape", shape: "rect", x: 0, y: 0.06, w: SLIDE_W, h: 0.03, fill: withAlpha(accent, 0.4) });

  // Thank you / CTA
  els.push({
    type: "text", x: 0.5, y: 1.8, w: 9, h: 1.2,
    text: slide.title, fontSize: 38, fontFace: "Calibri",
    color: "FFFFFF", bold: true, align: "center", valign: "middle",
    charSpacing: 2,
  });

  // Accent divider
  els.push(accentBar(SLIDE_W / 2 - 1.5, 3.2, 3.0, 0.05, accent));

  // Subtitle/CTA
  if (content[0]) {
    els.push({
      type: "text", x: 1.5, y: 3.5, w: 7, h: 0.7,
      text: content[0], fontSize: 16, fontFace: "Calibri",
      color: withAlpha(accent, 0.85), align: "center",
    });
  }

  // Bottom accent
  els.push(accentBar(0, 5.45, SLIDE_W, 0.175, withAlpha(accent, 0.3)));

  els.push(slideNumber(idx, total, accent));

  return {
    elements: els,
    backgroundGradient: coverGradientBg(primary, secondary),
  };
}

/* ═══════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════ */

export function buildPptxDocument(presentation: GeneratedPresentation): PtDocument {
  const { title, subtitle, template } = presentation;
  const slides = presentation.slides || [];
  const primary = template.colors.primary;
  const secondary = template.colors.secondary;
  const accent = template.colors.accent;
  const total = slides.length;

  const out: PtDocument = { slides: [] };

  slides.forEach((slide, idx) => {
    const layout = slide.layout || "content";

    let ptSlide: PtSlide;

    switch (layout) {
      case "title":
        ptSlide = buildCoverSlide(slide, title, subtitle, primary, secondary, accent, idx, total);
        break;
      case "closing":
        ptSlide = buildClosingSlide(slide, primary, secondary, accent, idx, total);
        break;
      case "bigNumber":
        ptSlide = buildBigNumberSlide(slide, primary, secondary, accent, idx, total);
        break;
      case "stats":
        ptSlide = buildStatsSlide(slide, primary, secondary, accent, idx, total);
        break;
      case "process":
        ptSlide = buildProcessSlide(slide, primary, secondary, accent, idx, total);
        break;
      case "comparison":
        ptSlide = buildComparisonSlide(slide, primary, secondary, accent, idx, total);
        break;
      case "quote":
        ptSlide = buildQuoteSlide(slide, primary, secondary, accent, idx, total);
        break;
      case "highlight":
        ptSlide = buildHighlightSlide(slide, primary, secondary, accent, idx, total);
        break;
      default:
        ptSlide = buildContentSlide(slide, primary, secondary, accent, idx, total);
        break;
    }

    ptSlide.notes = slide.notes;
    out.slides.push(ptSlide);
  });

  return out;
}
