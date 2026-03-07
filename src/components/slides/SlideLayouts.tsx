/**
 * SlideLayouts – Presenton-inspired HTML/Tailwind slide renderers
 * Each layout is a dedicated React component with rich visual design,
 * gradients, cards, infographics, and premium typography.
 */

import { motion } from "framer-motion";
import type { GeneratedSlide, SlideTemplate } from "@/data/templates";

interface LayoutProps {
  slide: GeneratedSlide;
  template: SlideTemplate;
  index: number;
  total: number;
  presentationTitle?: string;
  presentationSubtitle?: string;
}

/* ── Shared utilities ── */

function hexToRgba(hex: string, alpha: number): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function SlideNumber({ index, total, accent }: { index: number; total: number; accent: string }) {
  return (
    <div
      className="absolute bottom-2 right-4 text-[0.55em] font-medium tracking-wider"
      style={{ color: hexToRgba(accent, 0.5) }}
    >
      {index + 1} / {total}
    </div>
  );
}

function ProgressBar({ index, total, accent }: { index: number; total: number; accent: string }) {
  const pct = ((index + 1) / total) * 100;
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: hexToRgba(accent, 0.15) }}>
      <motion.div
        className="h-full rounded-r-full"
        style={{ background: accent }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

function DecoCircle({ x, y, size, color, opacity = 0.08 }: { x: string; y: string; size: string; color: string; opacity?: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x, top: y, width: size, height: size,
        background: `radial-gradient(circle, ${hexToRgba(color, opacity)} 0%, transparent 70%)`,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: TITLE / COVER
   ═══════════════════════════════════════════════════ */

export function TitleSlide({ slide, template, index, total, presentationTitle, presentationSubtitle }: LayoutProps) {
  const { primary, secondary, accent } = template.colors;
  const title = index === 0 ? (presentationTitle || slide.title) : slide.title;
  const subtitle = index === 0 ? (presentationSubtitle || slide.content?.[0] || "") : (slide.content?.[0] || "");

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col justify-center"
      style={{ background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 60%, ${hexToRgba(accent, 0.3)} 100%)` }}
    >
      {/* Decorative elements */}
      <DecoCircle x="65%" y="-10%" size="45%" color={accent} opacity={0.1} />
      <DecoCircle x="75%" y="50%" size="35%" color={primary} opacity={0.12} />
      <DecoCircle x="-5%" y="70%" size="25%" color={accent} opacity={0.06} />

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[5px]" style={{ background: `linear-gradient(90deg, ${accent}, ${primary})` }} />

      {/* Geometric accent */}
      <div className="absolute top-[15%] right-[8%] w-[15%] aspect-square rounded-2xl opacity-10 rotate-12" style={{ border: `2px solid ${accent}` }} />
      <div className="absolute top-[25%] right-[5%] w-[10%] aspect-square rounded-xl opacity-8 -rotate-6" style={{ background: hexToRgba(accent, 0.08) }} />

      {/* Content */}
      <div className="relative z-10 px-[8%] max-w-[85%]">
        {/* Icon badge */}
        {slide.icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-[3.5em] h-[3.5em] rounded-2xl flex items-center justify-center text-[1.5em] mb-[0.8em] shadow-lg"
            style={{ background: `linear-gradient(135deg, ${accent}, ${hexToRgba(accent, 0.7)})` }}
          >
            {slide.icon}
          </motion.div>
        )}

        {/* Left accent stripe */}
        <div className="absolute left-[5%] top-[30%] w-[3px] h-[40%] rounded-full" style={{ background: accent }} />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[2.2em] font-bold leading-[1.15] tracking-tight text-white mb-[0.4em]"
          style={{ textShadow: `0 2px 20px ${hexToRgba(secondary, 0.5)}` }}
        >
          {title}
        </motion.h1>

        {/* Accent divider */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "15%" }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="h-[3px] rounded-full mb-[0.6em]"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[0.85em] leading-relaxed max-w-[70%]"
            style={{ color: hexToRgba(accent, 0.9) }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Bottom gradient bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[6px]" style={{ background: `linear-gradient(90deg, ${accent}, ${primary}, ${accent})` }} />

      <SlideNumber index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: BIG NUMBER
   ═══════════════════════════════════════════════════ */

export function BigNumberSlide({ slide, template, index, total }: LayoutProps) {
  const { primary, secondary, accent } = template.colors;
  const bn = slide.bigNumber;

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
      style={{ background: `linear-gradient(160deg, ${secondary} 0%, ${hexToRgba(primary, 0.3)} 100%)` }}
    >
      <DecoCircle x="50%" y="30%" size="60%" color={accent} opacity={0.05} />
      <DecoCircle x="-10%" y="60%" size="30%" color={primary} opacity={0.06} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />

      {/* Category label */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.5, y: 0 }}
        className="text-[0.6em] uppercase tracking-[0.3em] font-semibold text-white/50 mb-[0.8em]"
      >
        {slide.title}
      </motion.p>

      {/* Number card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="relative px-[5%] py-[2%] rounded-3xl"
        style={{ background: hexToRgba(accent, 0.08), border: `1px solid ${hexToRgba(accent, 0.15)}` }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-3xl" style={{ boxShadow: `0 0 60px ${hexToRgba(accent, 0.15)}, inset 0 0 30px ${hexToRgba(accent, 0.05)}` }} />

        <div className="relative text-center">
          <span className="text-[3.5em] font-black leading-none tracking-tight" style={{ color: accent }}>
            {bn?.number || slide.content?.[0] || "0"}
          </span>
          {bn?.suffix && (
            <span className="block text-[0.9em] font-medium mt-[0.1em]" style={{ color: hexToRgba(accent, 0.7) }}>
              {bn.suffix}
            </span>
          )}
        </div>
      </motion.div>

      {/* Context */}
      {bn?.context && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-[1.2em] text-[0.7em] text-center max-w-[60%] leading-relaxed text-white/60"
        >
          {bn.context}
        </motion.p>
      )}

      <SlideNumber index={index} total={total} accent={accent} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: STATS
   ═══════════════════════════════════════════════════ */

export function StatsSlide({ slide, template, index, total }: LayoutProps) {
  const { primary, secondary, accent } = template.colors;
  const stats = slide.stats || [];

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: `linear-gradient(160deg, ${secondary} 0%, ${hexToRgba(primary, 0.2)} 100%)` }}
    >
      <DecoCircle x="80%" y="-5%" size="30%" color={accent} opacity={0.06} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />

      {/* Title section */}
      <div className="px-[6%] pt-[5%] flex items-center gap-[0.5em] mb-[3%]">
        <div className="w-[4px] h-[1.8em] rounded-full" style={{ background: accent }} />
        <h2 className="text-[1.2em] font-bold text-white">{slide.title}</h2>
      </div>

      {/* Stats grid */}
      <div className="px-[6%] flex-1 flex items-start">
        <div className="grid gap-[2.5%] w-full" style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)` }}>
          {stats.slice(0, 4).map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="rounded-2xl p-[8%] relative overflow-hidden"
              style={{
                background: hexToRgba(primary, 0.15),
                border: `1px solid ${hexToRgba(accent, 0.12)}`,
              }}
            >
              {/* Card top accent */}
              <div className="absolute top-0 left-[15%] right-[15%] h-[3px] rounded-b-full" style={{ background: accent }} />

              {/* Stat icon */}
              {stat.icon && (
                <div className="w-[2em] h-[2em] rounded-xl flex items-center justify-center text-[1em] mb-[0.5em]" style={{ background: hexToRgba(accent, 0.15) }}>
                  {stat.icon}
                </div>
              )}

              {/* Value */}
              <div className="text-[1.5em] font-black tracking-tight" style={{ color: accent }}>
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-[0.55em] mt-[0.3em] text-white/50 font-medium uppercase tracking-wider">
                {stat.label}
              </div>

              {/* Subtle glow */}
              <div className="absolute -bottom-[30%] -right-[30%] w-[60%] h-[60%] rounded-full" style={{ background: hexToRgba(accent, 0.05) }} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content bullets */}
      {slide.content?.length > 0 && (
        <div className="px-[6%] pb-[4%] pt-[1%]">
          {slide.content.map((line, i) => (
            <div key={i} className="flex items-start gap-[0.4em] mb-[0.3em]">
              <div className="w-[5px] h-[5px] rounded-full mt-[0.4em] shrink-0" style={{ background: hexToRgba(accent, 0.5) }} />
              <span className="text-[0.6em] text-white/60 leading-relaxed">{line}</span>
            </div>
          ))}
        </div>
      )}

      <SlideNumber index={index} total={total} accent={accent} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: PROCESS / TIMELINE
   ═══════════════════════════════════════════════════ */

export function ProcessSlide({ slide, template, index, total }: LayoutProps) {
  const { primary, secondary, accent } = template.colors;
  const steps = slide.steps || [];

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: `linear-gradient(160deg, ${secondary} 0%, ${hexToRgba(primary, 0.2)} 100%)` }}
    >
      <DecoCircle x="85%" y="10%" size="25%" color={accent} opacity={0.06} />

      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />

      {/* Title */}
      <div className="px-[6%] pt-[5%] flex items-center gap-[0.5em] mb-[4%]">
        <div className="w-[4px] h-[1.8em] rounded-full" style={{ background: accent }} />
        <h2 className="text-[1.2em] font-bold text-white">{slide.title}</h2>
      </div>

      {/* Timeline */}
      <div className="px-[6%] flex-1 flex items-start">
        <div className="relative w-full flex gap-[2%]">
          {/* Connector line */}
          <div
            className="absolute top-[1.3em] left-[5%] right-[5%] h-[2px]"
            style={{ background: `linear-gradient(90deg, ${accent}, ${hexToRgba(accent, 0.2)})` }}
          />

          {steps.slice(0, 5).map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.12 }}
              className="flex-1 flex flex-col items-center relative"
            >
              {/* Step number circle */}
              <div
                className="w-[2.2em] h-[2.2em] rounded-full flex items-center justify-center text-[0.7em] font-bold relative z-10 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${accent}, ${hexToRgba(accent, 0.7)})`,
                  color: secondary,
                  boxShadow: `0 4px 15px ${hexToRgba(accent, 0.3)}`,
                }}
              >
                {i + 1}
              </div>

              {/* Card */}
              <div
                className="mt-[0.6em] w-full rounded-xl p-[6%] text-center"
                style={{
                  background: hexToRgba(primary, 0.12),
                  border: `1px solid ${hexToRgba(accent, 0.1)}`,
                }}
              >
                <h4 className="text-[0.65em] font-semibold text-white mb-[0.3em] leading-tight">
                  {step.step}
                </h4>
                <div className="w-[40%] h-[2px] mx-auto rounded-full mb-[0.4em]" style={{ background: hexToRgba(accent, 0.3) }} />
                <p className="text-[0.5em] text-white/50 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <SlideNumber index={index} total={total} accent={accent} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: COMPARISON
   ═══════════════════════════════════════════════════ */

export function ComparisonSlide({ slide, template, index, total }: LayoutProps) {
  const { primary, secondary, accent } = template.colors;
  const left = slide.comparison?.left;
  const right = slide.comparison?.right;

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: `linear-gradient(160deg, ${secondary} 0%, ${hexToRgba(primary, 0.2)} 100%)` }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />

      {/* Title */}
      <div className="px-[6%] pt-[5%] flex items-center gap-[0.5em] mb-[3%]">
        <div className="w-[4px] h-[1.8em] rounded-full" style={{ background: accent }} />
        <h2 className="text-[1.2em] font-bold text-white">{slide.title}</h2>
      </div>

      {/* Comparison cards */}
      <div className="px-[6%] flex-1 flex gap-[3%] items-start">
        {[left, right].map((side, sideIdx) => {
          if (!side) return null;
          const isLeft = sideIdx === 0;
          return (
            <motion.div
              key={sideIdx}
              initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + sideIdx * 0.15 }}
              className="flex-1 rounded-2xl overflow-hidden"
              style={{
                background: hexToRgba(isLeft ? primary : accent, 0.1),
                border: `1px solid ${hexToRgba(isLeft ? primary : accent, 0.15)}`,
              }}
            >
              {/* Header */}
              <div
                className="px-[8%] py-[5%] flex items-center gap-[0.4em]"
                style={{ background: hexToRgba(isLeft ? primary : accent, 0.15) }}
              >
                <div className="w-[0.5em] h-[0.5em] rounded-full" style={{ background: isLeft ? primary : accent }} />
                <h3 className="text-[0.75em] font-bold" style={{ color: isLeft ? "#fff" : accent }}>
                  {side.title}
                </h3>
              </div>

              {/* Points */}
              <div className="px-[8%] py-[5%]">
                {(side.points || []).map((point, pi) => (
                  <div key={pi} className="flex items-start gap-[0.4em] mb-[0.5em]">
                    <div
                      className="w-[6px] h-[6px] rounded-full mt-[0.35em] shrink-0"
                      style={{ background: hexToRgba(isLeft ? primary : accent, 0.5) }}
                    />
                    <span className="text-[0.55em] text-white/70 leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* VS badge */}
        <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className="w-[2.2em] h-[2.2em] rounded-full flex items-center justify-center text-[0.6em] font-black shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${accent}, ${primary})`,
              color: "#fff",
              boxShadow: `0 4px 20px ${hexToRgba(accent, 0.4)}`,
            }}
          >
            VS
          </div>
        </div>
      </div>

      <SlideNumber index={index} total={total} accent={accent} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: QUOTE
   ═══════════════════════════════════════════════════ */

export function QuoteSlide({ slide, template, index, total }: LayoutProps) {
  const { primary, secondary, accent } = template.colors;
  const attribution = slide.content?.[0] || "";

  return (
    <div
      className="relative w-full h-full overflow-hidden flex items-center justify-center"
      style={{ background: `linear-gradient(160deg, ${secondary} 0%, ${hexToRgba(primary, 0.3)} 100%)` }}
    >
      <DecoCircle x="10%" y="20%" size="50%" color={primary} opacity={0.06} />
      <DecoCircle x="70%" y="10%" size="35%" color={accent} opacity={0.05} />

      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />

      <div className="relative z-10 px-[10%] text-center max-w-[85%]">
        {/* Quote mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.2, scale: 1 }}
          className="text-[4em] leading-none font-serif absolute -top-[0.3em] left-[5%]"
          style={{ color: accent }}
        >
          ❝
        </motion.div>

        {/* Quote card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl px-[6%] py-[4%] relative"
          style={{
            background: hexToRgba(primary, 0.08),
            border: `1px solid ${hexToRgba(accent, 0.1)}`,
          }}
        >
          <p
            className="text-[1.1em] font-medium italic leading-[1.6] text-white"
            style={{ textShadow: `0 1px 10px ${hexToRgba(secondary, 0.3)}` }}
          >
            {slide.title}
          </p>
        </motion.div>

        {/* Attribution */}
        {attribution && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-[1em]"
          >
            <div className="w-[8%] h-[2px] mx-auto rounded-full mb-[0.5em]" style={{ background: accent }} />
            <p className="text-[0.65em] font-medium" style={{ color: hexToRgba(accent, 0.8) }}>
              — {attribution}
            </p>
          </motion.div>
        )}
      </div>

      <SlideNumber index={index} total={total} accent={accent} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: HIGHLIGHT
   ═══════════════════════════════════════════════════ */

export function HighlightSlide({ slide, template, index, total }: LayoutProps) {
  const { primary, secondary, accent } = template.colors;

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: `linear-gradient(160deg, ${secondary} 0%, ${hexToRgba(primary, 0.2)} 100%)` }}
    >
      <DecoCircle x="80%" y="5%" size="25%" color={accent} opacity={0.06} />

      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />

      {/* Title */}
      <div className="px-[6%] pt-[5%] flex items-center gap-[0.5em] mb-[3%]">
        <div className="w-[4px] h-[1.8em] rounded-full" style={{ background: accent }} />
        <h2 className="text-[1.2em] font-bold text-white">{slide.title}</h2>
      </div>

      {/* Highlight card */}
      {slide.highlight && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mx-[6%] rounded-2xl p-[4%] relative overflow-hidden mb-[3%]"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(accent, 0.12)}, ${hexToRgba(accent, 0.05)})`,
            border: `1px solid ${hexToRgba(accent, 0.2)}`,
          }}
        >
          {/* Left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-[4px] rounded-l-2xl" style={{ background: accent }} />

          <div className="flex items-start gap-[0.6em] pl-[1%]">
            <div className="w-[1.5em] h-[1.5em] rounded-lg flex items-center justify-center shrink-0 text-[0.7em]" style={{ background: hexToRgba(accent, 0.2) }}>
              💡
            </div>
            <p className="text-[0.75em] font-semibold text-white leading-relaxed">
              {slide.highlight}
            </p>
          </div>
        </motion.div>
      )}

      {/* Content bullets */}
      <div className="px-[6%] flex-1">
        {slide.content?.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="flex items-start gap-[0.5em] mb-[0.5em]"
          >
            <div
              className="w-[8px] h-[8px] rounded-full mt-[0.3em] shrink-0"
              style={{ background: hexToRgba(accent, 0.4), boxShadow: `0 0 6px ${hexToRgba(accent, 0.2)}` }}
            />
            <span className="text-[0.65em] text-white/70 leading-relaxed">{line}</span>
          </motion.div>
        ))}
      </div>

      <SlideNumber index={index} total={total} accent={accent} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: CONTENT (default bullets)
   ═══════════════════════════════════════════════════ */

export function ContentSlide({ slide, template, index, total }: LayoutProps) {
  const { primary, secondary, accent } = template.colors;

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: `linear-gradient(160deg, ${secondary} 0%, ${hexToRgba(primary, 0.2)} 100%)` }}
    >
      <DecoCircle x="85%" y="5%" size="20%" color={accent} opacity={0.05} />
      <DecoCircle x="-5%" y="75%" size="18%" color={primary} opacity={0.05} />

      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />

      {/* Title */}
      <div className="px-[6%] pt-[5%] flex items-center gap-[0.5em] mb-[1%]">
        <div className="w-[4px] h-[1.8em] rounded-full" style={{ background: accent }} />
        <h2 className="text-[1.2em] font-bold text-white">{slide.title}</h2>
      </div>

      {/* Divider */}
      <div className="mx-[6%] mb-[3%]">
        <div className="w-[12%] h-[2px] rounded-full" style={{ background: accent }} />
      </div>

      {/* Bullet cards */}
      <div className="px-[6%] flex-1">
        {slide.content?.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="flex items-start gap-[0.5em] mb-[0.4em] rounded-xl px-[2%] py-[1.5%]"
            style={{ background: hexToRgba(primary, 0.06) }}
          >
            <div
              className="w-[8px] h-[8px] rounded-full mt-[0.3em] shrink-0"
              style={{ background: hexToRgba(accent, 0.4) }}
            />
            <span className="text-[0.65em] text-white/75 leading-relaxed">{line}</span>
          </motion.div>
        ))}
      </div>

      <SlideNumber index={index} total={total} accent={accent} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: TWO-COLUMN
   ═══════════════════════════════════════════════════ */

export function TwoColumnSlide({ slide, template, index, total }: LayoutProps) {
  const { primary, secondary, accent } = template.colors;
  const content = slide.content || [];
  const mid = Math.ceil(content.length / 2);
  const leftItems = content.slice(0, mid);
  const rightItems = content.slice(mid);

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: `linear-gradient(160deg, ${secondary} 0%, ${hexToRgba(primary, 0.2)} 100%)` }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />

      {/* Title */}
      <div className="px-[6%] pt-[5%] flex items-center gap-[0.5em] mb-[3%]">
        <div className="w-[4px] h-[1.8em] rounded-full" style={{ background: accent }} />
        <h2 className="text-[1.2em] font-bold text-white">{slide.title}</h2>
      </div>

      {/* Two columns */}
      <div className="px-[6%] flex-1 flex gap-[3%]">
        {[leftItems, rightItems].map((items, colIdx) => (
          <motion.div
            key={colIdx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + colIdx * 0.15 }}
            className="flex-1 rounded-2xl p-[4%]"
            style={{
              background: hexToRgba(primary, 0.08),
              border: `1px solid ${hexToRgba(accent, 0.08)}`,
            }}
          >
            {items.map((line, i) => (
              <div key={i} className="flex items-start gap-[0.4em] mb-[0.5em]">
                <div className="w-[6px] h-[6px] rounded-full mt-[0.35em] shrink-0" style={{ background: hexToRgba(accent, 0.4) }} />
                <span className="text-[0.6em] text-white/70 leading-relaxed">{line}</span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <SlideNumber index={index} total={total} accent={accent} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: CLOSING
   ═══════════════════════════════════════════════════ */

export function ClosingSlide({ slide, template, index, total }: LayoutProps) {
  const { primary, secondary, accent } = template.colors;

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 60%, ${hexToRgba(accent, 0.3)} 100%)` }}
    >
      <DecoCircle x="40%" y="30%" size="50%" color={accent} opacity={0.06} />
      <DecoCircle x="10%" y="50%" size="30%" color={primary} opacity={0.08} />
      <DecoCircle x="75%" y="60%" size="20%" color={accent} opacity={0.05} />

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[5px]" style={{ background: `linear-gradient(90deg, ${accent}, ${primary})` }} />

      {/* Icon */}
      {slide.icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="w-[3em] h-[3em] rounded-2xl flex items-center justify-center text-[1.3em] mb-[0.8em] shadow-lg"
          style={{ background: `linear-gradient(135deg, ${accent}, ${hexToRgba(accent, 0.7)})` }}
        >
          {slide.icon}
        </motion.div>
      )}

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[2em] font-bold text-white text-center tracking-wide"
        style={{ textShadow: `0 2px 20px ${hexToRgba(secondary, 0.5)}` }}
      >
        {slide.title}
      </motion.h2>

      {/* Divider */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "20%" }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="h-[3px] rounded-full my-[0.6em]"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      {/* Subtitle/CTA */}
      {slide.content?.[0] && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[0.8em] text-center max-w-[60%]"
          style={{ color: hexToRgba(accent, 0.85) }}
        >
          {slide.content[0]}
        </motion.p>
      )}

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[6px]" style={{ background: `linear-gradient(90deg, ${accent}, ${primary}, ${accent})` }} />

      <SlideNumber index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT DISPATCHER
   ═══════════════════════════════════════════════════ */

export function SlideLayout(props: LayoutProps) {
  const layout = props.slide.layout || "content";
  switch (layout) {
    case "title": return <TitleSlide {...props} />;
    case "closing": return <ClosingSlide {...props} />;
    case "bigNumber": return <BigNumberSlide {...props} />;
    case "stats": return <StatsSlide {...props} />;
    case "process": return <ProcessSlide {...props} />;
    case "comparison": return <ComparisonSlide {...props} />;
    case "quote": return <QuoteSlide {...props} />;
    case "highlight": return <HighlightSlide {...props} />;
    case "two-column": return <TwoColumnSlide {...props} />;
    default: return <ContentSlide {...props} />;
  }
}
