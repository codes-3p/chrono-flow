import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ExportButton from "@/components/ExportButton";
import TimelineCardVertical from "@/components/TimelineCardVertical";
import TimelineHorizontal from "@/components/TimelineHorizontal";
import { timelineEvents } from "@/data/timelineData";

const Index = () => {
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
      <div className="hidden md:block">
        <TimelineHorizontal events={timelineEvents} />
      </div>

      {/* Mobile: Vertical Timeline */}
      <div className="md:hidden relative px-4 pb-8">
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
