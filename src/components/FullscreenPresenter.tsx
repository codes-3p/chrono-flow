/**
 * FullscreenPresenter – Live presentation mode
 * Fullscreen API, keyboard navigation, auto-hide cursor, slide counter
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlideLayout } from "@/components/slides/SlideLayouts";
import type { GeneratedPresentation } from "@/data/templates";

interface FullscreenPresenterProps {
  presentation: GeneratedPresentation;
  startSlide?: number;
  onExit: () => void;
}

const FullscreenPresenter = ({ presentation, startSlide = 0, onExit }: FullscreenPresenterProps) => {
  const [current, setCurrent] = useState(startSlide);
  const [showUI, setShowUI] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  const total = presentation.slides.length;

  const goTo = useCallback((dir: 1 | -1) => {
    setCurrent((p) => Math.max(0, Math.min(total - 1, p + dir)));
    flashUI();
  }, [total]);

  const flashUI = useCallback(() => {
    setShowUI(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowUI(false), 2500);
  }, []);

  // Enter fullscreen on mount
  useEffect(() => {
    const el = containerRef.current;
    if (el && !document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    }
    flashUI();

    const handleFsChange = () => {
      if (!document.fullscreenElement) onExit();
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      clearTimeout(hideTimer.current);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "PageDown":
          e.preventDefault();
          goTo(1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          goTo(-1);
          break;
        case "Escape":
          e.preventDefault();
          document.exitFullscreen?.().catch(() => {});
          onExit();
          break;
        case "Home":
          e.preventDefault();
          setCurrent(0);
          flashUI();
          break;
        case "End":
          e.preventDefault();
          setCurrent(total - 1);
          flashUI();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goTo, total, flashUI, onExit]);

  // Mouse move → show UI
  useEffect(() => {
    const handler = () => flashUI();
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [flashUI]);

  const slide = presentation.slides[current];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      style={{ cursor: showUI ? "default" : "none" }}
      onClick={() => goTo(1)}
      onContextMenu={(e) => { e.preventDefault(); goTo(-1); }}
    >
      {/* Slide */}
      <div className="w-full h-full relative overflow-hidden" style={{ fontSize: "16px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <SlideLayout
              slide={slide}
              template={presentation.template}
              index={current}
              total={total}
              presentationTitle={presentation.title}
              presentationSubtitle={presentation.subtitle}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Overlay UI */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => { e.stopPropagation(); goTo(-1); }}
              disabled={current === 0}
              className="text-white/70 hover:text-white disabled:text-white/20 transition-colors text-sm"
            >
              &#9664;
            </button>
            <span className="text-white/80 text-xs font-medium min-w-[60px] text-center">
              {current + 1} / {total}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); goTo(1); }}
              disabled={current === total - 1}
              className="text-white/70 hover:text-white disabled:text-white/20 transition-colors text-sm"
            >
              &#9654;
            </button>
            <div className="w-px h-4 bg-white/20" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                document.exitFullscreen?.().catch(() => {});
                onExit();
              }}
              className="text-white/50 hover:text-white text-xs transition-colors"
            >
              ESC
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
        <motion.div
          className="h-full bg-white/30"
          initial={{ width: 0 }}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default FullscreenPresenter;
