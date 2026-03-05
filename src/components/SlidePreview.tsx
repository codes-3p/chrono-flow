/**
 * SlidePreview – Designer-Grade Preview Renderer
 * Renders PtDocument elements with full visual fidelity including
 * gradients, rounded rects, ellipses, shadows, and layered compositions.
 */

import { motion } from "framer-motion";
import type { PtDocument, PtElement, PtShapeElement, PtTextElement, PtGradientFill } from "@/lib/pptxModel";
import { inchToPctX, inchToPctY } from "@/lib/pptxModel";

interface SlidePreviewProps {
  document: PtDocument;
  template: {
    colors: { primary: string; secondary: string; accent: string };
  };
  index: number;
  total: number;
  isActive?: boolean;
  onClick?: () => void;
  mode?: "thumbnail" | "canvas";
}

/* ── Color helpers ── */

function norm(color: string): string {
  if (!color) return "#000000";
  return color.startsWith("#") ? color : `#${color}`;
}

function gradientCSS(g: PtGradientFill): string {
  const stops = g.stops.map(s => `${norm(s.color)} ${s.position}%`).join(", ");
  if (g.type === "radial") return `radial-gradient(circle, ${stops})`;
  return `linear-gradient(${g.angle || 135}deg, ${stops})`;
}

function parseAlpha(hex: string): { color: string; opacity: number } {
  const clean = hex.replace("#", "");
  if (clean.length === 8) {
    const rgb = clean.slice(0, 6);
    const alpha = parseInt(clean.slice(6, 8), 16) / 255;
    return { color: `#${rgb}`, opacity: alpha };
  }
  return { color: norm(hex), opacity: 1 };
}

/* ── Component ── */

const SlidePreview = ({
  document, template, index, total,
  isActive = false, onClick, mode = "thumbnail",
}: SlidePreviewProps) => {
  const slide = document.slides[index];
  if (!slide) return null;

  const isThumbnail = mode === "thumbnail";
  const { elements, background, backgroundGradient } = slide;

  let bgStyle: React.CSSProperties = {};
  if (backgroundGradient) {
    bgStyle.background = gradientCSS(backgroundGradient);
  } else if (background) {
    bgStyle.background = norm(background);
  } else {
    bgStyle.background = norm(template.colors.secondary);
  }

  const className = isThumbnail
    ? `relative aspect-video rounded-lg overflow-hidden transition-all duration-200 border-2 shadow-2xl ${
        isActive
          ? "border-primary shadow-lg shadow-primary/30 scale-105 cursor-pointer"
          : "border-border hover:border-primary/60 hover:scale-[1.02] cursor-pointer"
      }`
    : "relative aspect-video rounded-xl overflow-hidden border border-border/60 shadow-2xl";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isThumbnail ? index * 0.03 : 0, duration: 0.3 }}
      className={className}
      style={bgStyle}
      onClick={onClick}
    >
      {elements.map((el, i) => (
        <ElementRenderer key={i} element={el} />
      ))}
    </motion.div>
  );
};

/* ── Element Renderers ── */

function ElementRenderer({ element }: { element: PtElement }) {
  if (element.type === "text") return <TextElement el={element} />;
  return <ShapeElement el={element} />;
}

function TextElement({ el }: { el: PtTextElement }) {
  const { color: textColor, opacity: textOpacity } = parseAlpha(el.color || "FFFFFF");

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${inchToPctX(el.x)}%`,
    top: `${inchToPctY(el.y)}%`,
    width: `${inchToPctX(el.w)}%`,
    height: el.h ? `${inchToPctY(el.h)}%` : "auto",
    fontSize: el.fontSize ? `${el.fontSize * 0.26}rem` : undefined,
    fontFamily: el.fontFace || "Calibri, Arial, sans-serif",
    color: textColor,
    fontWeight: el.bold ? "bold" : "normal",
    fontStyle: el.italic ? "italic" : "normal",
    textAlign: el.align || "left",
    opacity: (el.opacity ?? 1) * textOpacity,
    letterSpacing: el.charSpacing ? `${el.charSpacing * 0.3}px` : undefined,
    lineHeight: el.lineSpacingPt ? `${el.lineSpacingPt * 0.065}rem` : undefined,
    display: "flex",
    alignItems: el.valign === "middle" ? "center" : el.valign === "bottom" ? "flex-end" : "flex-start",
    justifyContent: el.align === "center" ? "center" : el.align === "right" ? "flex-end" : "flex-start",
    whiteSpace: "pre-wrap",
    overflow: "hidden",
  };

  if (el.bullet) {
    style.paddingLeft = "1.2em";
  }

  return (
    <div style={style}>
      {el.bullet && (
        <span style={{ position: "absolute", left: "0.2em", color: textColor }}>•</span>
      )}
      <span>{el.text}</span>
    </div>
  );
}

function ShapeElement({ el }: { el: PtShapeElement }) {
  const { color: bgColor, opacity: bgOpacity } = el.fill ? parseAlpha(el.fill) : { color: "transparent", opacity: 1 };

  let background: string = bgColor;
  if (el.gradient) {
    background = gradientCSS(el.gradient);
  }

  const borderRadius =
    el.shape === "ellipse" ? "50%" :
    el.shape === "roundRect" ? `${(el.rectRadius || 0.15) * 40}px` :
    "0";

  const strokeParsed = el.stroke ? parseAlpha(el.stroke) : null;

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${inchToPctX(el.x)}%`,
    top: `${inchToPctY(el.y)}%`,
    width: `${inchToPctX(el.w)}%`,
    height: `${inchToPctY(el.h)}%`,
    background: el.gradient ? background : undefined,
    backgroundColor: !el.gradient ? bgColor : undefined,
    opacity: (el.opacity ?? 1) * bgOpacity,
    borderRadius,
    border: strokeParsed
      ? `${el.strokeWidth || 1}px solid ${strokeParsed.color}`
      : "none",
    transform: el.rotate ? `rotate(${el.rotate}deg)` : undefined,
  };

  // Shadow
  if (el.shadow) {
    const sc = parseAlpha(el.shadow.color || "000000");
    const blur = el.shadow.blur || 10;
    const offset = el.shadow.offset || 4;
    const op = el.shadow.opacity ?? 0.3;
    if (el.shadow.type === "inner") {
      style.boxShadow = `inset 0 ${offset}px ${blur}px rgba(0,0,0,${op})`;
    } else {
      style.boxShadow = `0 ${offset}px ${blur}px rgba(0,0,0,${op})`;
    }
  }

  return <div style={style} />;
}

export default SlidePreview;
