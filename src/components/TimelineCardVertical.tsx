import { motion } from "framer-motion";
import type { TimelineEvent } from "@/data/timelineData";

interface TimelineCardVerticalProps {
  event: TimelineEvent;
  index: number;
}

const TimelineCardVertical = ({ event, index }: TimelineCardVerticalProps) => {
  return (
    <motion.div
      className="relative flex items-start gap-4"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      {/* Dot */}
      <div className="relative z-10 mt-1 flex-shrink-0">
        <div className="h-3.5 w-3.5 rounded-full border-2 border-ccb-light bg-card shadow-md">
          <div className="absolute inset-0.5 rounded-full bg-ccb-light/30 animate-pulse-glow" />
        </div>
      </div>

      {/* Card */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="flex-1 rounded-xl bg-card p-4 shadow-md border border-border/50"
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
    </motion.div>
  );
};

export default TimelineCardVertical;
