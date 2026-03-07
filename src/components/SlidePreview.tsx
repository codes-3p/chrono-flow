/**
 * SlidePreview – Presenton-inspired HTML/Tailwind slide preview
 * Uses rich React layout components for web preview (HTML-first approach)
 * while maintaining PtDocument for PPTX export fidelity.
 */

import { motion } from "framer-motion";
import { SlideLayout } from "@/components/slides/SlideLayouts";
import type { GeneratedPresentation, SlideTemplate } from "@/data/templates";

interface SlidePreviewProps {
  presentation: GeneratedPresentation;
  index: number;
  total: number;
  isActive?: boolean;
  onClick?: () => void;
  mode?: "thumbnail" | "canvas";
}

const SlidePreview = ({
  presentation, index, total,
  isActive = false, onClick, mode = "thumbnail",
}: SlidePreviewProps) => {
  const slide = presentation.slides[index];
  if (!slide) return null;

  const isThumbnail = mode === "thumbnail";

  const className = isThumbnail
    ? `relative aspect-video rounded-lg overflow-hidden transition-all duration-200 border-2 shadow-2xl ${
        isActive
          ? "border-primary shadow-lg shadow-primary/30 scale-105 cursor-pointer"
          : "border-border hover:border-primary/60 hover:scale-[1.02] cursor-pointer"
      }`
    : "relative aspect-video rounded-xl overflow-hidden border border-border/60 shadow-2xl";

  // Font size scaling: thumbnail gets smaller base, canvas gets larger
  const fontSize = isThumbnail ? "6px" : "16px";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isThumbnail ? index * 0.03 : 0, duration: 0.3 }}
      className={className}
      style={{ fontSize }}
      onClick={onClick}
    >
      <SlideLayout
        slide={slide}
        template={presentation.template}
        index={index}
        total={total}
        presentationTitle={presentation.title}
        presentationSubtitle={presentation.subtitle}
      />
    </motion.div>
  );
};

export default SlidePreview;
