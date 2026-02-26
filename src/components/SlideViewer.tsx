import { motion, AnimatePresence } from "framer-motion";
import { GeneratedSlide, SlideTemplate } from "@/data/templates";

interface SlideViewerProps {
  slide: GeneratedSlide;
  template: SlideTemplate;
  index: number;
  total: number;
}

const SlideViewer = ({ slide, template, index, total }: SlideViewerProps) => {
  const isCover = slide.layout === "title" || slide.layout === "closing";
  const isQuote = slide.layout === "quote";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3 }}
        className="w-full aspect-video rounded-xl overflow-hidden relative"
        style={{
          background: isCover
            ? `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`
            : template.colors.secondary,
        }}
      >
        {/* Decorative elements */}
        <div
          className="absolute top-0 right-0 w-1/3 h-full opacity-10"
          style={{
            background: `radial-gradient(circle at 80% 20%, ${template.colors.accent}, transparent 70%)`,
          }}
        />

        <div className="relative z-10 h-full flex flex-col p-8 md:p-12">
          {isCover ? (
            /* Title/Closing slide */
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-2xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight"
              >
                {slide.title}
              </motion.h1>
              {slide.content.length > 0 && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 text-sm md:text-lg text-primary-foreground/70 max-w-lg"
                >
                  {slide.content[0]}
                </motion.p>
              )}
            </div>
          ) : isQuote ? (
            /* Quote slide */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
              <div
                className="text-6xl mb-4 font-serif"
                style={{ color: template.colors.accent }}
              >
                "
              </div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-lg md:text-2xl text-primary-foreground/90 italic max-w-2xl leading-relaxed"
              >
                {slide.title}
              </motion.p>
              {slide.content.length > 0 && (
                <p className="mt-4 text-sm text-primary-foreground/50">
                  — {slide.content[0]}
                </p>
              )}
            </div>
          ) : (
            /* Content slide */
            <>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <div
                  className="w-12 h-1 rounded-full mb-4"
                  style={{ background: template.colors.accent }}
                />
                <h2 className="text-xl md:text-3xl font-bold text-primary-foreground">
                  {slide.title}
                </h2>
              </motion.div>

              <div className="flex-1 flex flex-col justify-center">
                <div className={`grid ${slide.layout === "two-column" ? "grid-cols-2 gap-6" : "grid-cols-1"} gap-3`}>
                  {slide.content.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -15, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ background: template.colors.accent }}
                      />
                      <p className="text-sm md:text-base text-primary-foreground/80 leading-relaxed">
                        {item}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Slide number */}
          <div className="flex justify-end">
            <span className="text-xs text-primary-foreground/30 font-mono">
              {index + 1} / {total}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SlideViewer;
