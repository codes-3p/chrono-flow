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
  const isProcess = slide.layout === "process";
  const isComparison = slide.layout === "comparison";
  const isBigNumber = slide.layout === "bigNumber";

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
        <div
          className="absolute bottom-0 left-0 w-2/3 h-1/4 opacity-5"
          style={{
            background: `radial-gradient(ellipse at 20% 100%, ${template.colors.primary}, transparent 70%)`,
          }}
        />
        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 w-full h-1"
          style={{ background: `linear-gradient(90deg, ${template.colors.accent}, transparent)` }}
        />
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 h-0.5"
          style={{ 
            width: `${((index + 1) / total) * 100}%`,
            background: template.colors.accent,
            transition: 'width 0.5s ease'
          }}
        />

        <div className="relative z-10 h-full flex flex-col p-8 md:p-12">
          {isCover ? (
            /* ═══ TITLE / CLOSING ═══ */
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {slide.icon && (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.05 }}
                  className="text-5xl md:text-7xl mb-6"
                >
                  {slide.icon}
                </motion.div>
              )}
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              >
                {slide.title}
              </motion.h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-24 h-1 rounded-full mt-6 mb-4"
                style={{ background: template.colors.accent }}
              />
              {slide.content.length > 0 && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-2 text-base md:text-xl text-white/60 max-w-xl"
                >
                  {slide.content[0]}
                </motion.p>
              )}
            </div>

          ) : isBigNumber ? (
            /* ═══ BIG NUMBER ═══ */
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {slide.icon && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.05 }}
                  className="text-3xl mb-4 opacity-60"
                >
                  {slide.icon}
                </motion.div>
              )}
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm md:text-base text-white/50 uppercase tracking-widest font-medium mb-2"
              >
                {slide.title}
              </motion.p>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 0.15, stiffness: 100 }}
                className="flex items-baseline gap-3"
              >
                <span
                  className="text-6xl md:text-8xl lg:text-9xl font-black"
                  style={{ color: template.colors.accent }}
                >
                  {slide.bigNumber?.number || slide.content[0]}
                </span>
                {slide.bigNumber?.suffix && (
                  <span className="text-2xl md:text-4xl font-bold text-white/60">
                    {slide.bigNumber.suffix}
                  </span>
                )}
              </motion.div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3 }}
                className="w-20 h-0.5 rounded-full my-4"
                style={{ background: `${template.colors.accent}60` }}
              />
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-sm md:text-lg text-white/50 max-w-md"
              >
                {slide.bigNumber?.context || slide.content[1] || ""}
              </motion.p>
            </div>

          ) : isQuote ? (
            /* ═══ QUOTE ═══ */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
                className="text-7xl mb-2 font-serif leading-none"
                style={{ color: template.colors.accent }}
              >
                &ldquo;
              </motion.div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-lg md:text-2xl text-white/90 italic max-w-2xl leading-relaxed"
              >
                {slide.title}
              </motion.p>
              {slide.content.length > 0 && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 flex items-center gap-3"
                >
                  <div className="w-8 h-px" style={{ background: template.colors.accent }} />
                  <p className="text-sm font-medium" style={{ color: template.colors.accent }}>
                    {slide.content[0]}
                  </p>
                  <div className="w-8 h-px" style={{ background: template.colors.accent }} />
                </motion.div>
              )}
            </div>

          ) : isStats ? (
            /* ═══ STATS ═══ */
            <>
              <SlideHeader slide={slide} template={template} />
              <div className="flex-1 flex flex-col justify-center gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(slide.stats || []).map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      className="rounded-xl p-4 text-center border border-white/10 relative overflow-hidden"
                      style={{ background: `${template.colors.primary}30` }}
                    >
                      {/* Card top accent */}
                      <div
                        className="absolute top-0 left-0 right-0 h-0.5"
                        style={{ background: template.colors.accent }}
                      />
                      {stat.icon && <div className="text-2xl mb-2">{stat.icon}</div>}
                      <div
                        className="text-2xl md:text-3xl font-black"
                        style={{ color: template.colors.accent }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs text-white/50 mt-2 font-medium uppercase tracking-wider">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
                <BulletList items={slide.content} template={template} delay={0.4} />
              </div>
            </>

          ) : isHighlight ? (
            /* ═══ HIGHLIGHT ═══ */
            <>
              <SlideHeader slide={slide} template={template} />
              <div className="flex-1 flex flex-col justify-center gap-4">
                {slide.highlight && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-xl p-6 md:p-8 border-l-4 relative overflow-hidden"
                    style={{
                      borderColor: template.colors.accent,
                      background: `linear-gradient(135deg, ${template.colors.primary}25, ${template.colors.accent}10)`,
                    }}
                  >
                    <div
                      className="absolute top-0 right-0 w-32 h-32 opacity-10"
                      style={{ background: `radial-gradient(circle, ${template.colors.accent}, transparent)` }}
                    />
                    <p className="text-base md:text-xl font-bold text-white leading-relaxed relative z-10">
                      {slide.highlight}
                    </p>
                  </motion.div>
                )}
                <BulletList items={slide.content} template={template} delay={0.25} />
              </div>
            </>

          ) : isProcess ? (
            /* ═══ PROCESS ═══ */
            <>
              <SlideHeader slide={slide} template={template} />
              <div className="flex-1 flex items-center">
                <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {(slide.steps || []).map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.12 }}
                      className="relative"
                    >
                      <div className="rounded-xl p-4 border border-white/10 h-full relative overflow-hidden"
                        style={{ background: `${template.colors.primary}20` }}
                      >
                        {/* Step number */}
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black mb-3"
                          style={{ 
                            background: template.colors.accent,
                            color: template.colors.secondary
                          }}
                        >
                          {i + 1}
                        </div>
                        <p className="text-sm font-bold text-white mb-1">{step.step}</p>
                        <p className="text-xs text-white/50 leading-relaxed">{step.description}</p>
                      </div>
                      {/* Connector arrow */}
                      {i < (slide.steps?.length || 0) - 1 && (
                        <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                          <div className="w-3 h-3 border-t-2 border-r-2 transform rotate-45"
                            style={{ borderColor: template.colors.accent }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </>

          ) : isComparison ? (
            /* ═══ COMPARISON ═══ */
            <>
              <SlideHeader slide={slide} template={template} />
              <div className="flex-1 flex items-center">
                <div className="w-full grid grid-cols-2 gap-4">
                  {[slide.comparison?.left, slide.comparison?.right].map((side, sideIdx) => (
                    <motion.div
                      key={sideIdx}
                      initial={{ x: sideIdx === 0 ? -30 : 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + sideIdx * 0.15 }}
                      className="rounded-xl p-5 border border-white/10 relative overflow-hidden"
                      style={{ background: `${template.colors.primary}20` }}
                    >
                      {/* Top accent */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                        style={{ 
                          background: sideIdx === 0 
                            ? template.colors.accent 
                            : `${template.colors.accent}60`
                        }}
                      />
                      <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: template.colors.accent }} />
                        {side?.title || ''}
                      </h3>
                      <div className="space-y-2">
                        {(side?.points || []).map((point, pi) => (
                          <motion.div
                            key={pi}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 + pi * 0.08 }}
                            className="flex items-start gap-2"
                          >
                            <div className="w-1 h-1 rounded-full mt-2 shrink-0"
                              style={{ background: template.colors.accent }}
                            />
                            <p className="text-xs md:text-sm text-white/70 leading-relaxed">{point}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>

          ) : (
            /* ═══ CONTENT / TWO-COLUMN ═══ */
            <>
              <SlideHeader slide={slide} template={template} />
              <div className="flex-1 flex flex-col justify-center">
                <div className={`grid ${slide.layout === "two-column" ? "grid-cols-2 gap-6" : "grid-cols-1"} gap-3`}>
                  {slide.content.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -15, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
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
          )}

          {/* Slide number */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-white/20 font-mono uppercase tracking-widest">
              {slide.layout}
            </span>
            <span className="text-xs text-white/30 font-mono">
              {index + 1} / {total}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ── Shared Components ── */

function SlideHeader({ slide, template }: { slide: GeneratedSlide; template: SlideTemplate }) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="mb-4"
    >
      <div className="flex items-center gap-3 mb-2">
        {slide.icon && <span className="text-2xl">{slide.icon}</span>}
        <div className="w-10 h-1 rounded-full" style={{ background: template.colors.accent }} />
      </div>
      <h2 className="text-xl md:text-3xl font-bold text-white">{slide.title}</h2>
    </motion.div>
  );
}

function BulletList({ items, template, delay = 0 }: { items: string[]; template: SlideTemplate; delay?: number }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: delay + i * 0.08 }}
          className="flex items-start gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
            style={{ background: template.colors.accent }}
          />
          <p className="text-sm text-white/70">{item}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default SlideViewer;
