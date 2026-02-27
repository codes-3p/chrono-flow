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
  const isStats = slide.layout === "stats";
  const isHighlight = slide.layout === "highlight";

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
        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 w-full h-1"
          style={{ background: `linear-gradient(90deg, ${template.colors.accent}, transparent)` }}
        />

        <div className="relative z-10 h-full flex flex-col p-8 md:p-12">
          {isCover ? (
            /* ═══ TITLE / CLOSING ═══ */
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {slide.icon && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.05 }}
                  className="text-4xl md:text-6xl mb-4"
                >
                  {slide.icon}
                </motion.div>
              )}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
              >
                {slide.title}
              </motion.h1>
              {slide.content.length > 0 && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 text-sm md:text-lg text-white/70 max-w-lg"
                >
                  {slide.content[0]}
                </motion.p>
              )}
            </div>
          ) : isQuote ? (
            /* ═══ QUOTE ═══ */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
              <div
                className="text-6xl mb-4 font-serif"
                style={{ color: template.colors.accent }}
              >
                &ldquo;
              </div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-lg md:text-2xl text-white/90 italic max-w-2xl leading-relaxed"
              >
                {slide.title}
              </motion.p>
              {slide.content.length > 0 && (
                <p className="mt-4 text-sm" style={{ color: template.colors.accent }}>
                  &mdash; {slide.content[0]}
                </p>
              )}
            </div>
          ) : isStats ? (
            /* ═══ STATS ═══ */
            <>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="mb-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  {slide.icon && <span className="text-2xl">{slide.icon}</span>}
                  <div
                    className="w-10 h-1 rounded-full"
                    style={{ background: template.colors.accent }}
                  />
                </div>
                <h2 className="text-xl md:text-3xl font-bold text-white">
                  {slide.title}
                </h2>
              </motion.div>

              {/* Stats cards */}
              <div className="flex-1 flex flex-col justify-center gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(slide.stats || []).map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      className="rounded-lg p-4 text-center border border-white/10"
                      style={{ background: `${template.colors.primary}40` }}
                    >
                      {stat.icon && <div className="text-xl mb-1">{stat.icon}</div>}
                      <div
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: template.colors.accent }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs text-white/60 mt-1">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Supporting bullets */}
                {slide.content.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {slide.content.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        className="flex items-start gap-2"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                          style={{ background: template.colors.accent }}
                        />
                        <p className="text-sm text-white/70">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : isHighlight ? (
            /* ═══ HIGHLIGHT ═══ */
            <>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="mb-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  {slide.icon && <span className="text-2xl">{slide.icon}</span>}
                  <div
                    className="w-10 h-1 rounded-full"
                    style={{ background: template.colors.accent }}
                  />
                </div>
                <h2 className="text-xl md:text-3xl font-bold text-white">
                  {slide.title}
                </h2>
              </motion.div>

              <div className="flex-1 flex flex-col justify-center gap-4">
                {/* Highlighted box */}
                {slide.highlight && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-xl p-5 md:p-6 border-l-4"
                    style={{
                      borderColor: template.colors.accent,
                      background: `linear-gradient(135deg, ${template.colors.primary}30, ${template.colors.accent}15)`,
                    }}
                  >
                    <p className="text-base md:text-xl font-semibold text-white leading-relaxed">
                      {slide.highlight}
                    </p>
                  </motion.div>
                )}

                {/* Supporting bullets */}
                <div className="space-y-2">
                  {slide.content.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.25 + i * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ background: template.colors.accent }}
                      />
                      <p className="text-sm md:text-base text-white/80 leading-relaxed">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* ═══ CONTENT / TWO-COLUMN ═══ */
            <>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  {slide.icon && <span className="text-2xl">{slide.icon}</span>}
                  <div
                    className="w-12 h-1 rounded-full"
                    style={{ background: template.colors.accent }}
                  />
                </div>
                <h2 className="text-xl md:text-3xl font-bold text-white">
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
                      <p className="text-sm md:text-base text-white/80 leading-relaxed">
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
            <span className="text-xs text-white/30 font-mono">
              {index + 1} / {total}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SlideViewer;
