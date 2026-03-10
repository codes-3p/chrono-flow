/**
 * SlideLayouts – Premium HTML/Tailwind slide renderers
 * Supports both dark and light mode templates for presenti.ai-level quality.
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

function isLight(template: SlideTemplate): boolean {
  return template.lightMode === true;
}

function textColor(template: SlideTemplate, alpha = 1): string {
  return isLight(template) ? `rgba(15,23,42,${alpha})` : `rgba(255,255,255,${alpha})`;
}

function subtextColor(template: SlideTemplate): string {
  return isLight(template) ? "rgba(71,85,105,0.8)" : "rgba(255,255,255,0.6)";
}

function cardBg(template: SlideTemplate, alpha = 0.08): string {
  return isLight(template) ? `rgba(0,0,0,${alpha * 0.5})` : hexToRgba(template.colors.primary, alpha + 0.05);
}

function bgGradient(template: SlideTemplate): string {
  const { primary, secondary } = template.colors;
  if (isLight(template)) {
    return `linear-gradient(160deg, ${secondary} 0%, ${hexToRgba(primary, 0.05)} 100%)`;
  }
  return `linear-gradient(160deg, ${secondary} 0%, ${hexToRgba(primary, 0.2)} 100%)`;
}

function coverBg(template: SlideTemplate): string {
  const { primary, secondary, accent } = template.colors;
  if (isLight(template)) {
    return `linear-gradient(135deg, ${secondary} 0%, ${hexToRgba(primary, 0.08)} 60%, ${hexToRgba(accent, 0.05)} 100%)`;
  }
  return `linear-gradient(135deg, ${primary} 0%, ${secondary} 60%, ${hexToRgba(accent, 0.3)} 100%)`;
}

function SlideNumber({ index, total, accent, light }: { index: number; total: number; accent: string; light?: boolean }) {
  return (
    <div
      className="absolute bottom-2 right-4 text-[0.55em] font-medium tracking-wider"
      style={{ color: light ? hexToRgba(accent, 0.6) : hexToRgba(accent, 0.5) }}
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

function TitleBar({ title, accent, template }: { title: string; accent: string; template: SlideTemplate }) {
  return (
    <div className="px-[6%] pt-[5%] flex items-center gap-[0.5em] mb-[3%]">
      <div className="w-[4px] h-[1.8em] rounded-full" style={{ background: accent }} />
      <h2 className="text-[1.2em] font-bold" style={{ color: textColor(template) }}>{title}</h2>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: TITLE / COVER
   ═══════════════════════════════════════════════════ */

export function TitleSlide({ slide, template, index, total, presentationTitle, presentationSubtitle }: LayoutProps) {
  const { primary, secondary, accent } = template.colors;
  const light = isLight(template);
  const title = index === 0 ? (presentationTitle || slide.title) : slide.title;
  const subtitle = index === 0 ? (presentationSubtitle || slide.content?.[0] || "") : (slide.content?.[0] || "");

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col justify-center"
      style={{ background: coverBg(template) }}
    >
      <DecoCircle x="65%" y="-10%" size="45%" color={accent} opacity={light ? 0.06 : 0.1} />
      <DecoCircle x="75%" y="50%" size="35%" color={primary} opacity={light ? 0.04 : 0.12} />
      <DecoCircle x="-5%" y="70%" size="25%" color={accent} opacity={0.06} />

      <div className="absolute top-0 left-0 right-0 h-[5px]" style={{ background: `linear-gradient(90deg, ${accent}, ${primary})` }} />

      <div className="absolute top-[15%] right-[8%] w-[15%] aspect-square rounded-2xl opacity-10 rotate-12" style={{ border: `2px solid ${accent}` }} />

      <div className="relative z-10 px-[8%] max-w-[85%]">
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

        <div className="absolute left-[5%] top-[30%] w-[3px] h-[40%] rounded-full" style={{ background: accent }} />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[2.2em] font-bold leading-[1.15] tracking-tight mb-[0.4em]"
          style={{
            color: light ? textColor(template) : "#fff",
            textShadow: light ? "none" : `0 2px 20px ${hexToRgba(secondary, 0.5)}`,
          }}
        >
          {title}
        </motion.h1>

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
            style={{ color: light ? subtextColor(template) : hexToRgba(accent, 0.9) }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[6px]" style={{ background: `linear-gradient(90deg, ${accent}, ${primary}, ${accent})` }} />
      <SlideNumber index={index} total={total} accent={accent} light={light} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: BIG NUMBER
   ═══════════════════════════════════════════════════ */

export function BigNumberSlide({ slide, template, index, total }: LayoutProps) {
  const { primary, secondary, accent } = template.colors;
  const light = isLight(template);
  const bn = slide.bigNumber;

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
      style={{ background: bgGradient(template) }}
    >
      <DecoCircle x="50%" y="30%" size="60%" color={accent} opacity={0.05} />

      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />

      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.5, y: 0 }}
        className="text-[0.6em] uppercase tracking-[0.3em] font-semibold mb-[0.8em]"
        style={{ color: subtextColor(template) }}
      >
        {slide.title}
      </motion.p>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="relative px-[5%] py-[2%] rounded-3xl"
        style={{ background: hexToRgba(accent, light ? 0.06 : 0.08), border: `1px solid ${hexToRgba(accent, 0.15)}` }}
      >
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

      {bn?.context && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-[1.2em] text-[0.7em] text-center max-w-[60%] leading-relaxed"
          style={{ color: subtextColor(template) }}
        >
          {bn.context}
        </motion.p>
      )}

      <SlideNumber index={index} total={total} accent={accent} light={light} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: STATS
   ═══════════════════════════════════════════════════ */

export function StatsSlide({ slide, template, index, total }: LayoutProps) {
  const { accent } = template.colors;
  const light = isLight(template);
  const stats = slide.stats || [];

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" style={{ background: bgGradient(template) }}>
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />
      <TitleBar title={slide.title} accent={accent} template={template} />

      <div className="px-[6%] flex-1 flex items-start">
        <div className="grid gap-[2.5%] w-full" style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)` }}>
          {stats.slice(0, 4).map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="rounded-2xl p-[8%] relative overflow-hidden"
              style={{ background: cardBg(template, 0.08), border: `1px solid ${hexToRgba(accent, 0.12)}` }}
            >
              <div className="absolute top-0 left-[15%] right-[15%] h-[3px] rounded-b-full" style={{ background: accent }} />
              {stat.icon && (
                <div className="w-[2em] h-[2em] rounded-xl flex items-center justify-center text-[1em] mb-[0.5em]" style={{ background: hexToRgba(accent, 0.15) }}>
                  {stat.icon}
                </div>
              )}
              <div className="text-[1.5em] font-black tracking-tight" style={{ color: accent }}>{stat.value}</div>
              <div className="text-[0.55em] mt-[0.3em] font-medium uppercase tracking-wider" style={{ color: subtextColor(template) }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {slide.content?.length > 0 && (
        <div className="px-[6%] pb-[4%] pt-[1%]">
          {slide.content.map((line, i) => (
            <div key={i} className="flex items-start gap-[0.4em] mb-[0.3em]">
              <div className="w-[5px] h-[5px] rounded-full mt-[0.4em] shrink-0" style={{ background: hexToRgba(accent, 0.5) }} />
              <span className="text-[0.6em] leading-relaxed" style={{ color: subtextColor(template) }}>{line}</span>
            </div>
          ))}
        </div>
      )}

      <SlideNumber index={index} total={total} accent={accent} light={light} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: PROCESS / TIMELINE
   ═══════════════════════════════════════════════════ */

export function ProcessSlide({ slide, template, index, total }: LayoutProps) {
  const { primary, secondary, accent } = template.colors;
  const light = isLight(template);
  const steps = slide.steps || [];

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" style={{ background: bgGradient(template) }}>
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />
      <TitleBar title={slide.title} accent={accent} template={template} />

      <div className="px-[6%] flex-1 flex items-start">
        <div className="relative w-full flex gap-[2%]">
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
              <div
                className="w-[2.2em] h-[2.2em] rounded-full flex items-center justify-center text-[0.7em] font-bold relative z-10 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${accent}, ${hexToRgba(accent, 0.7)})`,
                  color: light ? "#fff" : secondary,
                  boxShadow: `0 4px 15px ${hexToRgba(accent, 0.3)}`,
                }}
              >
                {i + 1}
              </div>
              <div
                className="mt-[0.6em] w-full rounded-xl p-[6%] text-center"
                style={{ background: cardBg(template, 0.08), border: `1px solid ${hexToRgba(accent, 0.1)}` }}
              >
                <h4 className="text-[0.65em] font-semibold mb-[0.3em] leading-tight" style={{ color: textColor(template) }}>{step.step}</h4>
                <div className="w-[40%] h-[2px] mx-auto rounded-full mb-[0.4em]" style={{ background: hexToRgba(accent, 0.3) }} />
                <p className="text-[0.5em] leading-relaxed" style={{ color: subtextColor(template) }}>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <SlideNumber index={index} total={total} accent={accent} light={light} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: COMPARISON
   ═══════════════════════════════════════════════════ */

export function ComparisonSlide({ slide, template, index, total }: LayoutProps) {
  const { primary, accent } = template.colors;
  const light = isLight(template);
  const left = slide.comparison?.left;
  const right = slide.comparison?.right;

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" style={{ background: bgGradient(template) }}>
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />
      <TitleBar title={slide.title} accent={accent} template={template} />

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
                background: cardBg(template, isLeft ? 0.06 : 0.08),
                border: `1px solid ${hexToRgba(isLeft ? primary : accent, 0.15)}`,
              }}
            >
              <div className="px-[8%] py-[5%] flex items-center gap-[0.4em]" style={{ background: hexToRgba(isLeft ? primary : accent, light ? 0.08 : 0.15) }}>
                <div className="w-[0.5em] h-[0.5em] rounded-full" style={{ background: isLeft ? primary : accent }} />
                <h3 className="text-[0.75em] font-bold" style={{ color: isLeft ? textColor(template) : accent }}>{side.title}</h3>
              </div>
              <div className="px-[8%] py-[5%]">
                {(side.points || []).map((point, pi) => (
                  <div key={pi} className="flex items-start gap-[0.4em] mb-[0.5em]">
                    <div className="w-[6px] h-[6px] rounded-full mt-[0.35em] shrink-0" style={{ background: hexToRgba(isLeft ? primary : accent, 0.5) }} />
                    <span className="text-[0.55em] leading-relaxed" style={{ color: subtextColor(template) }}>{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}

        <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className="w-[2.2em] h-[2.2em] rounded-full flex items-center justify-center text-[0.6em] font-black shadow-lg"
            style={{ background: `linear-gradient(135deg, ${accent}, ${primary})`, color: "#fff", boxShadow: `0 4px 20px ${hexToRgba(accent, 0.4)}` }}
          >
            VS
          </div>
        </div>
      </div>

      <SlideNumber index={index} total={total} accent={accent} light={light} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: QUOTE
   ═══════════════════════════════════════════════════ */

export function QuoteSlide({ slide, template, index, total }: LayoutProps) {
  const { primary, accent } = template.colors;
  const light = isLight(template);
  const attribution = slide.content?.[0] || "";

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center" style={{ background: bgGradient(template) }}>
      <DecoCircle x="10%" y="20%" size="50%" color={primary} opacity={0.06} />
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />

      <div className="relative z-10 px-[10%] text-center max-w-[85%]">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.2, scale: 1 }}
          className="text-[4em] leading-none font-serif absolute -top-[0.3em] left-[5%]"
          style={{ color: accent }}
        >
          ❝
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl px-[6%] py-[4%] relative"
          style={{ background: cardBg(template, 0.06), border: `1px solid ${hexToRgba(accent, 0.1)}` }}
        >
          <p className="text-[1.1em] font-medium italic leading-[1.6]" style={{ color: textColor(template) }}>{slide.title}</p>
        </motion.div>

        {attribution && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-[1em]">
            <div className="w-[8%] h-[2px] mx-auto rounded-full mb-[0.5em]" style={{ background: accent }} />
            <p className="text-[0.65em] font-medium" style={{ color: hexToRgba(accent, 0.8) }}>— {attribution}</p>
          </motion.div>
        )}
      </div>

      <SlideNumber index={index} total={total} accent={accent} light={light} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: HIGHLIGHT
   ═══════════════════════════════════════════════════ */

export function HighlightSlide({ slide, template, index, total }: LayoutProps) {
  const { accent } = template.colors;
  const light = isLight(template);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" style={{ background: bgGradient(template) }}>
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />
      <TitleBar title={slide.title} accent={accent} template={template} />

      {slide.highlight && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mx-[6%] rounded-2xl p-[4%] relative overflow-hidden mb-[3%]"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(accent, light ? 0.08 : 0.12)}, ${hexToRgba(accent, 0.05)})`,
            border: `1px solid ${hexToRgba(accent, 0.2)}`,
          }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-[4px] rounded-l-2xl" style={{ background: accent }} />
          <div className="flex items-start gap-[0.6em] pl-[1%]">
            <div className="w-[1.5em] h-[1.5em] rounded-lg flex items-center justify-center shrink-0 text-[0.7em]" style={{ background: hexToRgba(accent, 0.2) }}>
              💡
            </div>
            <p className="text-[0.75em] font-semibold leading-relaxed" style={{ color: textColor(template) }}>{slide.highlight}</p>
          </div>
        </motion.div>
      )}

      <div className="px-[6%] flex-1">
        {slide.content?.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="flex items-start gap-[0.5em] mb-[0.5em]"
          >
            <div className="w-[8px] h-[8px] rounded-full mt-[0.3em] shrink-0" style={{ background: hexToRgba(accent, 0.4), boxShadow: `0 0 6px ${hexToRgba(accent, 0.2)}` }} />
            <span className="text-[0.65em] leading-relaxed" style={{ color: subtextColor(template) }}>{line}</span>
          </motion.div>
        ))}
      </div>

      <SlideNumber index={index} total={total} accent={accent} light={light} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: CONTENT (default bullets)
   ═══════════════════════════════════════════════════ */

export function ContentSlide({ slide, template, index, total }: LayoutProps) {
  const { primary, accent } = template.colors;
  const light = isLight(template);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" style={{ background: bgGradient(template) }}>
      <DecoCircle x="85%" y="5%" size="20%" color={accent} opacity={0.05} />
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />
      <TitleBar title={slide.title} accent={accent} template={template} />

      <div className="mx-[6%] mb-[3%]">
        <div className="w-[12%] h-[2px] rounded-full" style={{ background: accent }} />
      </div>

      <div className="px-[6%] flex-1">
        {slide.content?.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="flex items-start gap-[0.5em] mb-[0.4em] rounded-xl px-[2%] py-[1.5%]"
            style={{ background: cardBg(template, 0.04) }}
          >
            <div className="w-[8px] h-[8px] rounded-full mt-[0.3em] shrink-0" style={{ background: hexToRgba(accent, 0.4) }} />
            <span className="text-[0.65em] leading-relaxed" style={{ color: subtextColor(template) }}>{line}</span>
          </motion.div>
        ))}
      </div>

      <SlideNumber index={index} total={total} accent={accent} light={light} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: TWO-COLUMN
   ═══════════════════════════════════════════════════ */

export function TwoColumnSlide({ slide, template, index, total }: LayoutProps) {
  const { accent } = template.colors;
  const light = isLight(template);
  const content = slide.content || [];
  const mid = Math.ceil(content.length / 2);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" style={{ background: bgGradient(template) }}>
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />
      <TitleBar title={slide.title} accent={accent} template={template} />

      <div className="px-[6%] flex-1 flex gap-[3%]">
        {[content.slice(0, mid), content.slice(mid)].map((items, colIdx) => (
          <motion.div
            key={colIdx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + colIdx * 0.15 }}
            className="flex-1 rounded-2xl p-[4%]"
            style={{ background: cardBg(template, 0.06), border: `1px solid ${hexToRgba(accent, 0.08)}` }}
          >
            {items.map((line, i) => (
              <div key={i} className="flex items-start gap-[0.4em] mb-[0.5em]">
                <div className="w-[6px] h-[6px] rounded-full mt-[0.35em] shrink-0" style={{ background: hexToRgba(accent, 0.4) }} />
                <span className="text-[0.6em] leading-relaxed" style={{ color: subtextColor(template) }}>{line}</span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <SlideNumber index={index} total={total} accent={accent} light={light} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: CLOSING
   ═══════════════════════════════════════════════════ */

export function ClosingSlide({ slide, template, index, total }: LayoutProps) {
  const { primary, accent } = template.colors;
  const light = isLight(template);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center" style={{ background: coverBg(template) }}>
      <DecoCircle x="40%" y="30%" size="50%" color={accent} opacity={0.06} />
      <div className="absolute top-0 left-0 right-0 h-[5px]" style={{ background: `linear-gradient(90deg, ${accent}, ${primary})` }} />

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

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[2em] font-bold text-center tracking-wide"
        style={{ color: light ? textColor(template) : "#fff" }}
      >
        {slide.title}
      </motion.h2>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "20%" }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="h-[3px] rounded-full my-[0.6em]"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      {slide.content?.[0] && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[0.8em] text-center max-w-[60%]"
          style={{ color: light ? subtextColor(template) : hexToRgba(accent, 0.85) }}
        >
          {slide.content[0]}
        </motion.p>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-[6px]" style={{ background: `linear-gradient(90deg, ${accent}, ${primary}, ${accent})` }} />
      <SlideNumber index={index} total={total} accent={accent} light={light} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: ICON GRID (NEW)
   ═══════════════════════════════════════════════════ */

export function IconGridSlide({ slide, template, index, total }: LayoutProps) {
  const { accent } = template.colors;
  const light = isLight(template);
  const items = slide.gridItems || [];
  const cols = items.length <= 4 ? 2 : 3;

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" style={{ background: bgGradient(template) }}>
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />
      <TitleBar title={slide.title} accent={accent} template={template} />

      <div className="px-[6%] flex-1">
        <div className="grid gap-[2%]" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {items.slice(0, 6).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="rounded-2xl p-[8%] relative overflow-hidden text-center"
              style={{ background: cardBg(template, 0.06), border: `1px solid ${hexToRgba(accent, 0.1)}` }}
            >
              <div className="w-[2.5em] h-[2.5em] rounded-2xl mx-auto flex items-center justify-center text-[1.1em] mb-[0.5em]" style={{ background: hexToRgba(accent, 0.12) }}>
                {item.icon}
              </div>
              <h4 className="text-[0.65em] font-bold mb-[0.2em]" style={{ color: textColor(template) }}>{item.title}</h4>
              <p className="text-[0.5em] leading-relaxed" style={{ color: subtextColor(template) }}>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <SlideNumber index={index} total={total} accent={accent} light={light} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: THREE COLUMN (NEW)
   ═══════════════════════════════════════════════════ */

export function ThreeColumnSlide({ slide, template, index, total }: LayoutProps) {
  const { accent } = template.colors;
  const light = isLight(template);
  const columns = slide.columns || [];

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" style={{ background: bgGradient(template) }}>
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />
      <TitleBar title={slide.title} accent={accent} template={template} />

      <div className="px-[6%] flex-1 flex gap-[2.5%]">
        {columns.slice(0, 3).map((col, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            className="flex-1 rounded-2xl overflow-hidden"
            style={{ background: cardBg(template, 0.06), border: `1px solid ${hexToRgba(accent, 0.1)}` }}
          >
            <div className="px-[8%] py-[5%] text-center" style={{ background: hexToRgba(accent, light ? 0.06 : 0.1) }}>
              <div className="w-[3px] h-[1em] rounded-full mx-auto mb-[0.3em]" style={{ background: accent }} />
              <h3 className="text-[0.7em] font-bold" style={{ color: textColor(template) }}>{col.title}</h3>
            </div>
            <div className="px-[8%] py-[5%]">
              {(col.points || []).map((pt, pi) => (
                <div key={pi} className="flex items-start gap-[0.4em] mb-[0.4em]">
                  <div className="w-[5px] h-[5px] rounded-full mt-[0.35em] shrink-0" style={{ background: hexToRgba(accent, 0.5) }} />
                  <span className="text-[0.5em] leading-relaxed" style={{ color: subtextColor(template) }}>{pt}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <SlideNumber index={index} total={total} accent={accent} light={light} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: ROADMAP / TIMELINE (NEW)
   ═══════════════════════════════════════════════════ */

export function RoadmapSlide({ slide, template, index, total }: LayoutProps) {
  const { accent } = template.colors;
  const light = isLight(template);
  const milestones = slide.milestones || [];

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" style={{ background: bgGradient(template) }}>
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />
      <TitleBar title={slide.title} accent={accent} template={template} />

      <div className="px-[6%] flex-1 relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[9%] top-0 bottom-[10%] w-[2px]" style={{ background: `linear-gradient(180deg, ${accent}, ${hexToRgba(accent, 0.15)})` }} />

        {milestones.slice(0, 5).map((ms, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.12 }}
            className="flex items-start gap-[3%] mb-[2.5%] relative"
          >
            {/* Timeline dot */}
            <div className="relative z-10 shrink-0">
              <div
                className="w-[1.6em] h-[1.6em] rounded-full flex items-center justify-center text-[0.5em] font-bold shadow-md"
                style={{ background: `linear-gradient(135deg, ${accent}, ${hexToRgba(accent, 0.7)})`, color: light ? "#fff" : "#000" }}
              >
                {i + 1}
              </div>
            </div>

            {/* Phase label */}
            <div className="shrink-0 w-[15%]">
              <span className="text-[0.55em] font-bold uppercase tracking-wider" style={{ color: accent }}>{ms.phase}</span>
            </div>

            {/* Card */}
            <div
              className="flex-1 rounded-xl p-[3%]"
              style={{ background: cardBg(template, 0.06), border: `1px solid ${hexToRgba(accent, 0.1)}` }}
            >
              <h4 className="text-[0.6em] font-bold mb-[0.2em]" style={{ color: textColor(template) }}>{ms.title}</h4>
              <p className="text-[0.48em] leading-relaxed" style={{ color: subtextColor(template) }}>{ms.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <SlideNumber index={index} total={total} accent={accent} light={light} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: TEAM (NEW)
   ═══════════════════════════════════════════════════ */

export function TeamSlide({ slide, template, index, total }: LayoutProps) {
  const { accent } = template.colors;
  const light = isLight(template);
  const members = slide.members || [];

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" style={{ background: bgGradient(template) }}>
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />
      <TitleBar title={slide.title} accent={accent} template={template} />

      <div className="px-[6%] flex-1">
        <div className="grid gap-[3%]" style={{ gridTemplateColumns: `repeat(${Math.min(members.length, 4)}, 1fr)` }}>
          {members.slice(0, 4).map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="rounded-2xl p-[6%] text-center relative overflow-hidden"
              style={{ background: cardBg(template, 0.06), border: `1px solid ${hexToRgba(accent, 0.1)}` }}
            >
              {/* Avatar placeholder */}
              <div
                className="w-[3em] h-[3em] rounded-full mx-auto mb-[0.5em] flex items-center justify-center text-[1.2em] font-bold"
                style={{ background: hexToRgba(accent, 0.15), color: accent }}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
              <h4 className="text-[0.65em] font-bold" style={{ color: textColor(template) }}>{member.name}</h4>
              <p className="text-[0.5em] font-medium mb-[0.3em]" style={{ color: accent }}>{member.role}</p>
              <p className="text-[0.45em] leading-relaxed" style={{ color: subtextColor(template) }}>{member.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <SlideNumber index={index} total={total} accent={accent} light={light} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: SWOT (NEW)
   ═══════════════════════════════════════════════════ */

export function SwotSlide({ slide, template, index, total }: LayoutProps) {
  const { accent } = template.colors;
  const light = isLight(template);
  const swot = slide.swot;

  const quadrants = [
    { title: "Strengths", items: swot?.strengths || [], color: "#22C55E" },
    { title: "Weaknesses", items: swot?.weaknesses || [], color: "#EF4444" },
    { title: "Opportunities", items: swot?.opportunities || [], color: "#3B82F6" },
    { title: "Threats", items: swot?.threats || [], color: "#F59E0B" },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" style={{ background: bgGradient(template) }}>
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />
      <TitleBar title={slide.title} accent={accent} template={template} />

      <div className="px-[6%] flex-1 grid grid-cols-2 grid-rows-2 gap-[2%]">
        {quadrants.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="rounded-xl p-[5%] relative overflow-hidden"
            style={{ background: cardBg(template, 0.05), border: `1px solid ${hexToRgba(q.color, 0.2)}` }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: q.color }} />
            <h4 className="text-[0.6em] font-bold mb-[0.4em] flex items-center gap-[0.3em]">
              <div className="w-[0.5em] h-[0.5em] rounded-sm" style={{ background: q.color }} />
              <span style={{ color: textColor(template) }}>{q.title}</span>
            </h4>
            {q.items.slice(0, 3).map((item, ii) => (
              <div key={ii} className="flex items-start gap-[0.3em] mb-[0.3em]">
                <div className="w-[4px] h-[4px] rounded-full mt-[0.35em] shrink-0" style={{ background: hexToRgba(q.color, 0.5) }} />
                <span className="text-[0.45em] leading-relaxed" style={{ color: subtextColor(template) }}>{item}</span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <SlideNumber index={index} total={total} accent={accent} light={light} />
      <ProgressBar index={index} total={total} accent={accent} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT: PYRAMID (NEW)
   ═══════════════════════════════════════════════════ */

export function PyramidSlide({ slide, template, index, total }: LayoutProps) {
  const { accent } = template.colors;
  const light = isLight(template);
  const levels = slide.pyramidLevels || [];
  const count = Math.min(levels.length, 5);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" style={{ background: bgGradient(template) }}>
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />
      <TitleBar title={slide.title} accent={accent} template={template} />

      <div className="px-[6%] flex-1 flex flex-col items-center justify-center gap-[1%]">
        {levels.slice(0, count).map((level, i) => {
          const widthPct = 30 + ((count - 1 - i) / (count - 1 || 1)) * 60;
          const opacity = 0.9 - i * 0.12;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="rounded-xl py-[1.5%] px-[3%] text-center relative overflow-hidden"
              style={{
                width: `${widthPct}%`,
                background: hexToRgba(accent, opacity * 0.15),
                border: `1px solid ${hexToRgba(accent, opacity * 0.25)}`,
              }}
            >
              <h4 className="text-[0.6em] font-bold" style={{ color: accent }}>{level.label}</h4>
              <p className="text-[0.45em] leading-relaxed" style={{ color: subtextColor(template) }}>{level.description}</p>
            </motion.div>
          );
        })}
      </div>

      <SlideNumber index={index} total={total} accent={accent} light={light} />
      <ProgressBar index={index} total={total} accent={accent} />
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
    case "iconGrid": return <IconGridSlide {...props} />;
    case "threeColumn": return <ThreeColumnSlide {...props} />;
    case "roadmap": return <RoadmapSlide {...props} />;
    case "team": return <TeamSlide {...props} />;
    case "swot": return <SwotSlide {...props} />;
    case "pyramid": return <PyramidSlide {...props} />;
    default: return <ContentSlide {...props} />;
  }
}
