n/**
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

const SlidePreview = ({ document, template, index, total, isActive, onClick }: SlidePreviewProps) => {
  const slide = document.slides[index];
  
  if (!slide) return null;
  
  const { elements, background, backgroundGradient } = slide;
  
  // Determinar background
  let bgStyle: React.CSSProperties = {};
  if (backgroundGradient) {
    if (backgroundGradient.type === "linear") {
      bgStyle.background = `linear-gradient(${backgroundGradient.angle || 135}deg, ${backgroundGradient.colors.join(", ")})`;
    } else {
      bgStyle.background = `radial-gradient(circle, ${backgroundGradient.colors.join(", ")})`;
    }
  } else if (background) {
    bgStyle.background = `#${background}`;
  } else {
    bgStyle.background = template.colors.secondary.startsWith("#") 
      ? template.colors.secondary 
      : `#${template.colors.secondary}`;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        relative aspect-video rounded-lg overflow-hidden cursor-pointer
        transition-all duration-200 border-2
        ${isActive 
          ? "border-purple-500 shadow-lg shadow-purple-500/30" 
          : "border-transparent hover:border-purple-300"
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
      <div className="absolute bottom-2 right-3 text-xs text-white/30 font-mono">
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
          position: "relative",
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
  
  return (
    <div
      className="absolute rounded-sm"
      style={{
        left: `${inchToPctX(shape.x)}%`,
        top: `${inchToPctY(shape.y)}%`,
        width: `${inchToPctX(shape.w)}%`,
        height: `${inchToPctY(shape.h)}%`,
        backgroundColor: shapeColor,
        borderRadius: shape.borderRadius ? `${shape.borderRadius}px` : "0",
        border: shape.stroke ? `${shape.strokeWidth || 1}px solid ${shape.stroke.startsWith("#") ? shape.stroke : `#${shape.stroke}`}` : "none",
      }}
    />
  );
}

export default SlidePreview;
