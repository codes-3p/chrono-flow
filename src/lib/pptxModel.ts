/**
 * Modelo de documento PPTX — Designer-Grade
 * Suporta shapes nativos do PowerPoint (rect, roundRect, ellipse, line),
 * gradientes, sombras, opacidade, border-radius e composição livre.
 */

export const SLIDE_W = 10;
export const SLIDE_H = 5.625;

/* ── Text ── */
export type PtTextRun = {
  text: string;
  fontSize?: number;
  fontFace?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  breakLine?: boolean;
};

export type PtTextElement = {
  type: "text";
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  /** Rich text runs (if provided, overrides `text` for export) */
  runs?: PtTextRun[];
  fontSize?: number;
  fontFace?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  align?: "left" | "center" | "right";
  valign?: "top" | "middle" | "bottom";
  bullet?: boolean;
  /** Opacidade (0-1) */
  opacity?: number;
  /** Letter spacing in pt */
  charSpacing?: number;
  /** Line spacing in pt */
  lineSpacingPt?: number;
  /** Paragraph space before (pt) */
  paraSpaceBefore?: number;
  /** Paragraph space after (pt) */
  paraSpaceAfter?: number;
  /** Margin/padding inside the text box (inches) */
  margin?: number | [number, number, number, number];
};

/* ── Shape ── */
export type PtShapeType = "rect" | "roundRect" | "ellipse" | "line";

export type PtGradientStop = {
  position: number; // 0-100
  color: string;    // hex without #
};

export type PtGradientFill = {
  type: "linear" | "radial";
  stops: PtGradientStop[];
  angle?: number; // degrees, for linear
};

export type PtShadow = {
  type: "outer" | "inner";
  color: string;
  blur: number;
  offset: number;
  angle?: number;
  opacity?: number; // 0-1
};

export type PtShapeElement = {
  type: "shape";
  shape: PtShapeType;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Solid fill (hex, may include alpha suffix) */
  fill?: string;
  /** Gradient fill (overrides solid fill) */
  gradient?: PtGradientFill;
  /** Border */
  stroke?: string;
  strokeWidth?: number;
  /** Border radius (only roundRect) */
  rectRadius?: number;
  /** Rotation degrees */
  rotate?: number;
  /** Opacity 0-1 */
  opacity?: number;
  /** Shadow */
  shadow?: PtShadow;
};

export type PtElement = PtTextElement | PtShapeElement;

export interface PtSlide {
  elements: PtElement[];
  notes?: string;
  /** Cor de fundo sólida (hex sem #) */
  background?: string;
  /** Gradiente de background */
  backgroundGradient?: PtGradientFill;
}

export interface PtDocument {
  slides: PtSlide[];
}

/** Converte polegadas em X/W para porcentagem (0–100) no viewer */
export function inchToPctX(inches: number): number {
  return (inches / SLIDE_W) * 100;
}

/** Converte polegadas em Y/H para porcentagem (0–100) no viewer */
export function inchToPctY(inches: number): number {
  return (inches / SLIDE_H) * 100;
}
