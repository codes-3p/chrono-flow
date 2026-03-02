/**
 * Biblioteca de componentes visuais para slides modernos
 * Estes componentes são usados tanto no preview (React) quanto na exportação (pptxgenjs)
 */

import { PtElement, PtSlide, SLIDE_W, SLIDE_H } from "./pptxModel";

export interface ComponentOptions {
  x: number;
  y: number;
  w: number;
  h?: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

/**
 * Cria um retângulo com gradiente (simulado com solid fill)
 */
export function createGradientBox(options: ComponentOptions): PtElement {
  const { x, y, w, h = 0.15, colors } = options;
  return {
    type: "shape",
    shape: "rect",
    x,
    y,
    w,
    h,
    fill: colors.accent,
  };
}

/**
 * Cria um card com borda arredondada e sombra (representado como shape)
 */
export function createCard(options: ComponentOptions & { 
  title?: string; 
  subtitle?: string;
}): PtElement {
  const { x, y, w, h = 2, colors } = options;
  return {
    type: "shape",
    shape: "rect",
    x,
    y,
    w,
    h,
    fill: colors.primary,
  };
}

/**
 * Cria um texto com estilo de título
 */
export function createTitle(options: ComponentOptions & { text: string }): PtElement {
  const { x, y, w, text, colors } = options;
  return {
    type: "text",
    x,
    y,
    w,
    text,
    fontSize: 36,
    fontFace: "Poppins",
    color: "FFFFFF",
    bold: true,
  };
}

/**
 * Cria um texto de subtítulo
 */
export function createSubtitle(options: ComponentOptions & { text: string }): PtElement {
  const { x, y, w, text, colors } = options;
  return {
    type: "text",
    x,
    y,
    w,
    text,
    fontSize: 18,
    fontFace: "Poppins",
    color: colors.accent,
    italic: true,
  };
}

/**
 * Cria uma lista com bullets customizados
 */
export function createBulletList(options: ComponentOptions & { 
  items: string[];
  startY?: number;
  itemHeight?: number;
}): PtElement[] {
  const { x, w, colors, items, startY = 3, itemHeight = 0.45 } = options;
  
  return items.map((item, i) => ({
    type: "text" as const,
    x,
    y: startY + i * itemHeight,
    w,
    text: item,
    fontSize: 14,
    fontFace: "Poppins",
    color: "CCCCCC",
    bullet: true,
  }));
}

/**
 * Cria um elemento decorativo (círculo)
 */
export function createDecorativeCircle(options: ComponentOptions & { 
  radius?: number;
}): PtElement {
  const { x, y, w = 1, h = 1, colors } = options;
  return {
    type: "shape",
    shape: "rect", // pptxgenjs usa rect, mas podemos simular com dimensions
    x,
    y,
    w,
    h,
    fill: colors.accent,
  };
}

/**
 * Cria um divider/linha decorativa
 */
export function createDivider(options: ComponentOptions & { width?: number }): PtElement {
  const { x, y, w, colors, width = 0.1 } = options;
  return {
    type: "shape",
    shape: "rect",
    x,
    y,
    w,
    h: width,
    fill: colors.accent,
  };
}

/**
 * Cria um stat card (número grande com label)
 */
export function createStatCard(options: ComponentOptions & { 
  value: string;
  label: string;
}): PtElement[] {
  const { x, y, w, colors } = options;
  const elements: PtElement[] = [];
  
  // Background do card
  elements.push({
    type: "shape",
    shape: "rect",
    x,
    y,
    w,
    h: 1.2,
    fill: `${colors.primary}40`, // transparent-ish
  });
  
  // Valor (número grande)
  elements.push({
    type: "text",
    x: x + 0.1,
    y: y + 0.1,
    w: w - 0.2,
    text: options.value,
    fontSize: 32,
    fontFace: "Poppins",
    color: colors.accent,
    bold: true,
    align: "center",
  });
  
  // Label
  elements.push({
    type: "text",
    x: x + 0.1,
    y: y + 0.8,
    w: w - 0.2,
    text: options.label,
    fontSize: 11,
    fontFace: "Poppins",
    color: "AAAAAA",
    align: "center",
  });
  
  return elements;
}

/**
 * Cria um highlight box (caixa destacada)
 */
export function createHighlightBox(options: ComponentOptions & { 
  text: string;
}): PtElement[] {
  const { x, y, w, colors } = options;
  const elements: PtElement[] = [];
  
  // Barra lateral accent
  elements.push({
    type: "shape",
    shape: "rect",
    x,
    y,
    w: 0.08,
    h: 1.5,
    fill: colors.accent,
  });
  
  // Background
  elements.push({
    type: "shape",
    shape: "rect",
    x: x + 0.15,
    y,
    w: w - 0.15,
    h: 1.5,
    fill: `${colors.primary}30`,
  });
  
  // Texto
  elements.push({
    type: "text",
    x: x + 0.3,
    y: y + 0.2,
    w: w - 0.4,
    text: options.text,
    fontSize: 16,
    fontFace: "Poppins",
    color: "FFFFFF",
  });
  
  return elements;
}

/**
 * Layout: Slide de Cover Moderno
 * Título centralizado com elementos decorativos
 */
export function buildModernCover(
  title: string,
  subtitle: string,
  colors: { primary: string; secondary: string; accent: string }
): PtSlide {
  const elements: PtElement[] = [];
  
  // Barra no topo
  elements.push(createGradientBox({ x: 0, y: 0, w: SLIDE_W, h: 0.15, colors }));
  
  // Elemento decorativo canto direito
  elements.push(createDecorativeCircle({ 
    x: 7.5, y: 0.5, w: 3, h: 3, colors 
  }));
  
  // Título principal
  elements.push(createTitle({
    x: 0.8,
    y: 2,
    w: 8.4,
    text: title,
    colors,
  }));
  
  // Divider
  elements.push(createDivider({
    x: 3.5, y: 2.8, w: 3, colors
  }));
  
  // Subtítulo
  elements.push(createSubtitle({
    x: 1, y: 3.1, w: 8, text: subtitle, colors
  }));
  
  // Número do slide
  elements.push({
    type: "text",
    x: 9, y: 5.2, w: 0.9,
    text: "1",
    fontSize: 10,
    color: "666666",
    align: "right",
  });
  
  return {
    elements,
    background: colors.secondary.replace("#", ""),
  };
}

/**
 * Layout: Slide de Conteúdo com Cards
 */
export function buildContentWithCards(
  title: string,
  bullets: string[],
  colors: { primary: string; secondary: string; accent: string }
): PtSlide {
  const elements: PtElement[] = [];
  
  // Barra no topo
  elements.push(createGradientBox({ x: 0, y: 0, w: SLIDE_W, h: 0.12, colors }));
  
  // Barra lateral accent no título
  elements.push(createDivider({ x: 0.6, y: 1.0, w: 0.08, h: 0.8, colors }));
  
  // Título
  elements.push(createTitle({
    x: 0.9, y: 1.0, w: 8, text: title, colors,
  }));
  
  // Cards (3 em linha)
  const cardWidth = 2.8;
  const cardGap = 0.3;
  const cardY = 2.0;
  
  bullets.slice(0, 3).forEach((item, i) => {
    const cardX = 0.6 + i * (cardWidth + cardGap);
    
    // Card background
    elements.push({
      type: "shape",
      shape: "rect",
      x: cardX,
      y: cardY,
      w: cardWidth,
      h: 2.2,
      fill: `${colors.primary}20`,
    });
    
    // Card border top
    elements.push({
      type: "shape",
      shape: "rect",
      x: cardX,
      y: cardY,
      w: cardWidth,
      h: 0.06,
      fill: colors.accent,
    });
    
    // Card text (primeira linha como título do card)
    const cardTitle = item.split(" ").slice(0, 3).join(" ");
    const cardContent = item.split(" ").slice(3).join(" ");
    
    elements.push({
      type: "text",
      x: cardX + 0.15,
      y: cardY + 0.2,
      w: cardWidth - 0.3,
      text: cardTitle,
      fontSize: 13,
      fontFace: "Poppins",
      color: colors.accent,
      bold: true,
    });
    
    if (cardContent) {
      elements.push({
        type: "text",
        x: cardX + 0.15,
        y: cardY + 0.6,
        w: cardWidth - 0.3,
        text: cardContent,
        fontSize: 11,
        fontFace: "Poppins",
        color: "BBBBBB",
      });
    }
  });
  
  // Mais bullets abaixo dos cards
  const extraBullets = bullets.slice(3);
  if (extraBullets.length > 0) {
    elements.push(...createBulletList({
      x: 0.8,
      y: 4.5,
      w: 8.4,
      items: extraBullets,
      startY: 4.5,
      colors,
    }));
  }
  
  // Número do slide
  elements.push({
    type: "text",
    x: 9, y: 5.2, w: 0.9,
    text: "2",
    fontSize: 10,
    color: "666666",
    align: "right",
  });
  
  return {
    elements,
    background: colors.secondary.replace("#", ""),
  };
}

/**
 * Layout: Slide de Stats/Números
 */
export function buildStatsSlide(
  title: string,
  stats: { value: string; label: string }[],
  colors: { primary: string; secondary: string; accent: string }
): PtSlide {
  const elements: PtElement[] = [];
  
  // Barra no topo
  elements.push(createGradientBox({ x: 0, y: 0, w: SLIDE_W, h: 0.12, colors }));
  
  // Título
  elements.push(createTitle({
    x: 0.6, y: 1.0, w: 8, text: title, colors,
  }));
  
  // Stats cards (4 em linha)
  const cardWidth = 2.1;
  const cardGap = 0.35;
  const cardY = 2.0;
  
  stats.slice(0, 4).forEach((stat, i) => {
    const cardX = 0.6 + i * (cardWidth + cardGap);
    elements.push(...createStatCard({
      x: cardX, y: cardY, w: cardWidth, 
      value: stat.value, label: stat.label, colors
    }));
  });
  
  // Número do slide
  elements.push({
    type: "text",
    x: 9, y: 5.2, w: 0.9,
    text: "3",
    fontSize: 10,
    color: "666666",
    align: "right",
  });
  
  return {
    elements,
    background: colors.secondary.replace("#", ""),
  };
}

/**
 * Layout: Slide com Highlight Box
 */
export function buildHighlightSlide(
  title: string,
  highlightText: string,
  bullets: string[],
  colors: { primary: string; secondary: string; accent: string }
): PtSlide {
  const elements: PtElement[] = [];
  
  // Barra no topo
  elements.push(createGradientBox({ x: 0, y: 0, w: SLIDE_W, h: 0.12, colors }));
  
  // Título
  elements.push(createTitle({
    x: 0.6, y: 0.9, w: 8, text: title, colors,
  }));
  
  // Highlight box
  elements.push(...createHighlightBox({
    x: 0.6,
    y: 1.7,
    w: 8.8,
    text: highlightText,
    colors,
  }));
  
  // Bullets abaixo
  elements.push(...createBulletList({
    x: 0.8,
    y: 3.5,
    w: 8.4,
    items: bullets,
    startY: 3.5,
    colors,
  }));
  
  // Número do slide
  elements.push({
    type: "text",
    x: 9, y: 5.2, w: 0.9,
    text: "4",
    fontSize: 10,
    color: "666666",
    align: "right",
  });
  
  return {
    elements,
    background: colors.secondary.replace("#", ""),
  };
}
