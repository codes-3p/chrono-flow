import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TimelineEvent } from "@/data/timelineData";

interface Props {
  events: TimelineEvent[];
}

const TimelineHorizontal = ({ events }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -350 : 350,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative px-4 md:px-12">
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

      <div
        ref={scrollRef}
        className="overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="min-w-max px-16 py-4">
          {/* 3-row grid: top cards, line+dots, bottom cards */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${events.length}, 240px)`,
              gridTemplateRows: "auto 40px auto",
              gap: "0 16px",
            }}
          >
            {/* Row 1: Above cards */}
            {events.map((event, i) => (
              <div key={`top-${i}`} className="flex flex-col justify-end items-center">
                {i % 2 === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    whileHover={{ scale: 1.04, y: -4 }}
                    className="w-full rounded-xl bg-card p-4 shadow-lg border border-border/50 mb-2"
                  >
                    <span className="text-xs font-bold tracking-widest uppercase text-ccb-light">
                      {event.year}
                    </span>
                    <h3 className="mt-1 text-sm font-semibold text-foreground leading-tight">
                      {event.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </motion.div>
                ) : null}
              </div>
            ))}

            {/* Row 2: Line + Dots */}
            {events.map((event, i) => (
              <div key={`dot-${i}`} className="relative flex items-center justify-center">
                {/* Horizontal line segment */}
                <div className="absolute inset-y-1/2 left-0 right-0 h-0.5 -translate-y-1/2 gradient-ccb-horizontal" />
                {/* Extend line to neighbors */}
                {i > 0 && (
                  <div className="absolute top-1/2 -translate-y-1/2 h-0.5 gradient-ccb-horizontal" style={{ left: "-16px", width: "16px" }} />
                )}
                <motion.div
                  className="relative z-10 h-4 w-4 rounded-full border-2 border-ccb-light bg-card shadow-md flex-shrink-0"
                  whileHover={{ scale: 1.5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="absolute inset-0.5 rounded-full bg-ccb-light/30 animate-pulse-glow" />
                </motion.div>
              </div>
            ))}

            {/* Row 3: Below cards */}
            {events.map((event, i) => (
              <div key={`bot-${i}`} className="flex flex-col justify-start items-center">
                {i % 2 !== 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    whileHover={{ scale: 1.04, y: 4 }}
                    className="w-full rounded-xl bg-card p-4 shadow-lg border border-border/50 mt-2"
                  >
                    <span className="text-xs font-bold tracking-widest uppercase text-ccb-light">
                      {event.year}
                    </span>
                    <h3 className="mt-1 text-sm font-semibold text-foreground leading-tight">
                      {event.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </motion.div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineHorizontal;
