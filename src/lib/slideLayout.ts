/**
 * Especificação única do layout dos slides.
 * É a fonte da verdade: o que aparece na tela (SlideViewer) e o que vai no PPTX (PresentationExporter)
 * usam exatamente estes valores. Slide = 16:9 (10" x 5,625" no PowerPoint).
 */

export const SLIDE_WIDTH = 10;
export const SLIDE_HEIGHT = 5.625;

/** Valores em "polegadas" (mesmo sistema do PowerPoint) para o exportador PPTX */
export const LAYOUT = {
  /** Barra de destaque no topo (todos os slides) */
  topBar: { x: 0, y: 0, w: 10, h: 0.2 },

  /** Capa / Encerramento */
  cover: {
    title: { x: 0.5, y: 2.0, w: 9, fontSize: 44 },
    subtitle: { x: 1.0, y: 3.25, w: 8, fontSize: 22 },
  },

  /** Slide de conteúdo (título + bullets) */
  content: {
    accentBar: { x: 0.8, y: 1.0, w: 1.5, h: 0.08 },
    title: { x: 0.8, y: 1.22, w: 8.6, fontSize: 26 },
    bullets: { x: 1.0, y: 2.0, w: 8.6, fontSize: 16, lineSpacing: 0.42 },
    bulletsTwoCol: { leftX: 0.9, rightX: 5.2, y: 2.0, w: 4.0, fontSize: 14, lineSpacing: 0.38 },
  },

  /** Slide de citação */
  quote: {
    text: { x: 0.8, y: 2.0, w: 8.8, fontSize: 26 },
    author: { x: 0.8, y: 4.3, w: 8.8, fontSize: 14 },
  },

  /** Número do slide (canto inferior direito) */
  slideNum: { x: 9.0, y: 5.15, w: 0.9, fontSize: 10 },
} as const;

/** Converte posição/dimensão em "polegadas" para porcentagem (0–100) para o viewer em 16:9 */
export function inchToPercent(
  type: "x" | "y" | "w" | "h",
  valueInInches: number
): number {
  if (type === "x" || type === "w") return (valueInInches / SLIDE_WIDTH) * 100;
  return (valueInInches / SLIDE_HEIGHT) * 100;
}
