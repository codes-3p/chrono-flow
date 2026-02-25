import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Space } from "lucide-react";
import type { TimelineEvent } from "@/data/timelineData";

interface Props {
  events: TimelineEvent[];
}

const TimelineHorizontal = ({ events }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [lineProgress, setLineProgress] = useState(0);
  const [started, setStarted] = useState(false);

  const totalSteps = events.length;

  const advance = useCallback(() => {
    if (!started) {
      setStarted(true);
      setLineProgress(1);
      return;
    }
    setRevealedCount((prev) => {
      if (prev < totalSteps) return prev + 1;
      return prev;
    });
  }, [started, totalSteps]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [advance]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -350 : 350,
      behavior: "smooth",
    });
  };

  // Auto-scroll to latest revealed card
  useEffect(() => {
    if (revealedCount > 0 && scrollRef.current) {
      const cardWidth = 256; // 240 + gap
      const targetScroll = (revealedCount - 1) * cardWidth - scrollRef.current.clientWidth / 2 + cardWidth / 2;
      scrollRef.current.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: "smooth",
      });
    }
  }, [revealedCount]);

  return (
    <div className="relative px-4 md:px-12">
      {/* Navigation arrows */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-card shadow-lg border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-card shadow-lg border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Instruction hint */}
      <AnimatePresence>
        {!started && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <motion.div
              className="flex flex-col items-center gap-3 bg-card/90 backdrop-blur-md px-8 py-6 rounded-2xl shadow-2xl border border-border pointer-events-auto cursor-pointer"
              onClick={advance}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <div className="h-12 w-12 rounded-xl gradient-ccb flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">⎵</span>
              </div>
              <span className="text-sm font-semibold text-foreground tracking-wide">
                Pressione <kbd className="px-2 py-0.5 rounded bg-secondary text-xs font-mono">Espaço</kbd> para iniciar
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      {started && revealedCount < totalSteps && (
        <motion.div
          className="absolute top-2 right-14 z-20 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-xs text-muted-foreground font-medium">
            {revealedCount}/{totalSteps}
          </span>
          <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-ccb"
              animate={{ width: `${(revealedCount / totalSteps) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">
            <kbd className="px-1.5 py-0.5 rounded bg-secondary font-mono">Espaço</kbd>
          </span>
        </motion.div>
      )}

      {started && revealedCount === totalSteps && (
        <motion.div
          className="absolute top-2 right-14 z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-xs font-semibold text-ccb-light">✓ Completo</span>
        </motion.div>
      )}

      <div
        ref={scrollRef}
        className="overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="min-w-max px-16 py-4">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${events.length}, 240px)`,
              gridTemplateRows: "1fr 40px 1fr",
              gap: "0 16px",
            }}
          >
            {/* Row 1: Above cards (even indices) */}
            {events.map((event, i) => (
              <div key={`top-${i}`} className="flex flex-col justify-end items-center">
                <AnimatePresence>
                  {i % 2 === 0 && revealedCount > i && (
                    <motion.div
                      initial={{ opacity: 0, y: -40, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="w-full mb-2"
                    >
                      <motion.div
                        whileHover={{ scale: 1.04, y: -4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="w-full rounded-xl bg-card p-4 shadow-lg border border-border/50 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-1 w-6 rounded-full gradient-ccb" />
                          <span className="text-xs font-bold tracking-widest uppercase text-ccb-light">
                            {event.year}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-foreground leading-tight">
                          {event.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                          {event.description}
                        </p>
                      </motion.div>
                      {/* Connector line */}
                      <motion.div
                        className="mx-auto w-px h-4 bg-gradient-to-b from-ccb-light/60 to-ccb-light/20"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        style={{ transformOrigin: "top" }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Row 2: Line + Dots */}
            {events.map((event, i) => (
              <div key={`dot-${i}`} className="relative flex items-center justify-center">
                {/* Horizontal line segment */}
                <motion.div
                  className="absolute inset-y-1/2 left-0 right-0 h-0.5 -translate-y-1/2 gradient-ccb-horizontal"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: lineProgress }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ transformOrigin: "left" }}
                />
                {/* Gap connector */}
                {i > 0 && (
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 h-0.5 gradient-ccb-horizontal"
                    style={{ left: "-16px", width: "16px", transformOrigin: "left" }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: lineProgress }}
                    transition={{
                      duration: 1.0,
                      delay: i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                )}
                {/* Dot */}
                <AnimatePresence>
                  {revealedCount > i && (
                    <motion.div
                      className="relative z-10 h-5 w-5 rounded-full border-2 border-ccb-light bg-card shadow-md flex-shrink-0"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                      }}
                      whileHover={{ scale: 1.4 }}
                    >
                      <motion.div
                        className="absolute inset-0.5 rounded-full bg-ccb-light/40"
                        animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Inactive dot placeholder */}
                {revealedCount <= i && started && (
                  <motion.div
                    className="relative z-10 h-3 w-3 rounded-full bg-border/50 flex-shrink-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: i * 0.08 + 1 }}
                  />
                )}
              </div>
            ))}

            {/* Row 3: Below cards (odd indices) */}
            {events.map((event, i) => (
              <div key={`bot-${i}`} className="flex flex-col justify-start items-center">
                <AnimatePresence>
                  {i % 2 !== 0 && revealedCount > i && (
                    <motion.div
                      initial={{ opacity: 0, y: 40, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="w-full mt-2"
                    >
                      {/* Connector line */}
                      <motion.div
                        className="mx-auto w-px h-4 bg-gradient-to-b from-ccb-light/20 to-ccb-light/60"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        style={{ transformOrigin: "top" }}
                      />
                      <motion.div
                        whileHover={{ scale: 1.04, y: 4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="w-full rounded-xl bg-card p-4 shadow-lg border border-border/50 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-1 w-6 rounded-full gradient-ccb" />
                          <span className="text-xs font-bold tracking-widest uppercase text-ccb-light">
                            {event.year}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-foreground leading-tight">
                          {event.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                          {event.description}
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineHorizontal;
