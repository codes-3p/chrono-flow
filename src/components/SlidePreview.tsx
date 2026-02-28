/**
 * SlidePreview: Preview visual de slides usando o modelo PtDocument
 * Este componente renderiza os elementos conforme definidos no modelo
 */

import { motion } from "framer-motion";
import { PtDocument, PtElement, PtShapeElement, PtTextElement, inchToPctX, inchToPctY } from "@/lib/pptxModel";

interface SlidePreviewProps {
  document: PtDocument;
  template: {
    colors: { primary: string; secondary: string; accent: string };
  };
  index: number;
  total: number;
  isActive: boolean;
  onClick: () => void;
}

// Função auxiliar para normalizar cor (garantir #)
function normalizeColor(color: string): string {
  if (!color) return "#000000";
  return color.startsWith("#") ? color : `#${color}`;
}

const SlidePreview = ({ document, template, index, total, isActive, onClick }: SlidePreviewProps) => {
  const slide = document.slides[index];
  
  if (!slide) return null;
  
  const { elements, background, backgroundGradient } = slide;
  
  // Determinar background
  let bgStyle: React.CSSProperties = {};
  if (backgroundGradient) {
    if (backgroundGradient.type === "linear") {
      bgStyle.background = `linear-gradient(${backgroundGradient.angle || 135}deg, ${backgroundGradient.colors.map(c => normalizeColor(c)).join(", ")})`;
    } else {
      bgStyle.background = `radial-gradient(circle, ${backgroundGradient.colors.map(c => normalizeColor(c)).join(", ")})`;
    }
  } else if (background) {
    bgStyle.background = normalizeColor(background);
  } else {
    // Usar cor secundária do template
    bgStyle.background = normalizeColor(template.colors.secondary);
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        relative aspect-video rounded-lg overflow-hidden cursor-pointer
        transition-all duration-200 border-2 shadow-2xl
        ${isActive 
          ? "border-purple-500 shadow-lg shadow-purple-500/50 scale-105" 
          : "border-gray-700 hover:border-purple-400 hover:scale-102"
        }
      `}
      style={bgStyle}
      onClick={onClick}
    >
      {/* Elementos do slide */}
      {elements.map((el, i) => (
        <SlideElement key={i} element={el} />
      ))}
      
      {/* Número do slide */}
      <div className="absolute bottom-2 right-3 text-xs text-white/30 font-mono pointer-events-none">
        {index + 1} / {total}
      </div>
    </motion.div>
  );
};

/**
 * Renderiza um elemento individual (texto ou shape)
 */
function SlideElement({ element }: { element: PtElement }) {
  if (element.type === "text") {
    // Normalizar cor - garantir que tem #
    const textColor = element.color 
      ? (element.color.startsWith("#") ? element.color : `#${element.color}`)
      : "#FFFFFF";
    
    return (
      <div
        className="absolute whitespace-pre-wrap"
        style={{
          left: `${inchToPctX(element.x)}%`,
          top: `${inchToPctY(element.y)}%`,
          width: `${inchToPctX(element.w)}%`,
          height: element.h ? `${inchToPctY(element.h)}%` : "auto",
          fontSize: element.fontSize ? `${element.fontSize * 0.26}rem` : undefined,
          fontFamily: element.fontFace || "Arial, sans-serif",
          color: textColor,
          fontWeight: element.bold ? "bold" : "normal",
          fontStyle: element.italic ? "italic" : "normal",
          textAlign: element.align || "left",
          paddingLeft: element.bullet ? "1em" : 0,
          opacity: element.opacity ?? 1,
        }}
      >
        {element.bullet && (
          <span 
            className="absolute left-0"
            style={{ color: textColor }}
          >
            •
          </span>
        )}
        {element.text}
      </div>
    );
  }
  
  // Shape (rect)
  const shape = element as PtShapeElement;
  const shapeColor = shape.fill.startsWith("#") ? shape.fill : `#${shape.fill}`;
  
  // Se o fill tiver opacidade (ex: "6366F140"), preserves the opacity
  let backgroundColor = shapeColor;
  let opacity = 1;
  
  // Verifica se a cor tem formato hex com opacidade (ex: "6366F140" ou "#6366F140")
  const hexWithOpacity = shapeColor.match(/^#?([0-9A-F]{6})([0-9A-F]{2})$/i);
  if (hexWithOpacity) {
    const [, hex, alpha] = hexWithOpacity;
    backgroundColor = `#${hex}`;
    // Converte alpha hex para opacity (00=0, FF=1)
    opacity = parseInt(alpha, 16) / 255;
  }
  
  const strokeColor = shape.stroke 
    ? (shape.stroke.startsWith("#") ? shape.stroke : `#${shape.stroke}`)
    : undefined;
  
  return (
    <div
      className="absolute"
      style={{
        left: `${inchToPctX(shape.x)}%`,
        top: `${inchToPctY(shape.y)}%`,
        width: `${inchToPctX(shape.w)}%`,
        height: `${inchToPctY(shape.h)}%`,
        backgroundColor,
        opacity,
        borderRadius: shape.borderRadius ? `${shape.borderRadius}px` : "0",
        border: strokeColor 
          ? `${shape.strokeWidth || 1}px solid ${strokeColor}`
          : "none",
      }}
    />
  );
}

export default SlidePreview;
