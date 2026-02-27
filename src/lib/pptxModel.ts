/**
 * Modelo de documento em linguagem PPTX.
 * Cada slide é uma lista de elementos (texto, forma) com posição e tamanho em polegadas.
 * O construtor trabalha só com este modelo; preview e export usam o mesmo.
 * Liberdade: qualquer elemento em qualquer posição; o builder preenche a partir da IA.
 */

export const SLIDE_W = 10;
export const SLIDE_H = 5.625;

export type PtTextElement = {
  type: "text";
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  fontSize?: number;
  fontFace?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  align?: "left" | "center" | "right";
  bullet?: boolean;
  /** Opacidade (0-1) */
  opacity?: number;
};

export type PtShapeElement = {
  type: "shape";
  shape: "rect";
  x: number;
  y: number;
  w: number;
  h: number;
  /** Cor de preenchimento (hex ou rgba com opacidade) */
  fill: string;
  /** Borda */
  stroke?: string;
  strokeWidth?: number;
  /** Border radius ( cantos arredondados) */
  borderRadius?: number;
};

export type PtElement = PtTextElement | PtShapeElement;

export interface PtSlide {
  elements: PtElement[];
  notes?: string;
  /** Cor de fundo do slide (hex sem #) */
  background?: string;
  /** Gradiente de background */
  backgroundGradient?: {
    type: "linear" | "radial";
    colors: string[];
    angle?: number;
  };
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
