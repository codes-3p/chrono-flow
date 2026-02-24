import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TimelineCard from "@/components/TimelineCard";
import TimelineCardVertical from "@/components/TimelineCardVertical";
import ExportButton from "@/components/ExportButton";
import { timelineEvents } from "@/data/timelineData";

const Index = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen gradient-ccb-subtle overflow-hidden">
      {/* Header */}
      <motion.header
        className="pt-8 md:pt-12 pb-4 text-center px-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-ccb">
          Linha do Tempo
        </h1>
        <p className="mt-2 md:mt-3 text-muted-foreground text-xs sm:text-sm md:text-base tracking-wide">
          Congregação Cristã no Brasil
        </p>
      </motion.header>

      {/* Export button */}
      <motion.div
        className="flex justify-center mb-6 md:mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <ExportButton events={timelineEvents} />
      </motion.div>

      {/* Desktop/Tablet: Horizontal Timeline */}
      <div className="hidden md:block relative px-4 md:px-12">
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
          className="overflow-x-auto py-40"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="relative flex items-center gap-8 px-16 min-w-max">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 gradient-ccb-horizontal rounded-full" />
            {timelineEvents.map((event, i) => (
              <TimelineCard
                key={event.year}
                event={event}
                index={i}
                isAbove={i % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Vertical Timeline */}
      <div className="md:hidden relative px-4 pb-8">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 gradient-ccb rounded-full" />

        <div className="flex flex-col gap-6 pl-6">
          {timelineEvents.map((event, i) => (
            <TimelineCardVertical key={event.year} event={event} index={i} />
          ))}
        </div>
      </div>

      {/* Footer accent */}
      <div className="h-1 gradient-ccb-horizontal mt-6 md:mt-8" />
    </div>
  );
};

export default Index;
