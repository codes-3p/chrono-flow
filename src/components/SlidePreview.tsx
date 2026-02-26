import { motion } from "framer-motion";
import { GeneratedSlide, SlideTemplate } from "@/data/templates";

interface SlidePreviewProps {
  slide: GeneratedSlide;
  template: SlideTemplate;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const SlidePreview = ({ slide, template, index, isActive, onClick }: SlidePreviewProps) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`w-full text-left rounded-lg overflow-hidden transition-all duration-200 ${
        isActive ? "ring-2 ring-primary scale-[1.02]" : "opacity-70 hover:opacity-100"
      }`}
    >
      <div
        className="aspect-video p-3 flex flex-col justify-between"
        style={{
          background: slide.layout === "title" || slide.layout === "closing"
            ? `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`
            : template.colors.secondary,
        }}
      >
        <p className="text-[8px] font-bold text-primary-foreground/90 truncate leading-tight">
          {slide.title}
        </p>
        {slide.content.length > 0 && slide.layout !== "title" && (
          <div className="space-y-0.5 mt-1">
            {slide.content.slice(0, 3).map((c, i) => (
              <div key={i} className="flex items-start gap-1">
                <div className="w-0.5 h-0.5 rounded-full bg-primary-foreground/40 mt-[3px] shrink-0" />
                <p className="text-[5px] text-primary-foreground/60 truncate">{c}</p>
              </div>
            ))}
          </div>
        )}
        <p className="text-[6px] text-primary-foreground/30 text-right">{index + 1}</p>
      </div>
    </motion.button>
  );
};

export default SlidePreview;
