import { motion } from "framer-motion";
import type { TimelineEvent } from "@/data/timelineData";

interface TimelineCardProps {
  event: TimelineEvent;
  index: number;
  isAbove: boolean;
}

const TimelineCard = ({ event, index, isAbove }: TimelineCardProps) => {
  return (
    <motion.div
      className="relative flex flex-col items-center"
      style={{ width: 240 }}
      initial={{ opacity: 0, y: isAbove ? -40 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Above card */}
      {isAbove && (
        <>
          <motion.div
            whileHover={{ scale: 1.04, y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full rounded-xl bg-card p-4 shadow-lg border border-border/50 backdrop-blur-sm mb-3"
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
          <div className="w-px h-6 bg-gradient-to-b from-ccb-light/60 to-ccb-light/20" />
        </>
      )}

      {/* Dot */}
      <motion.div
        className="relative z-10 h-4 w-4 rounded-full border-2 border-ccb-light bg-card shadow-md flex-shrink-0"
        whileHover={{ scale: 1.5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className="absolute inset-0.5 rounded-full bg-ccb-light/30 animate-pulse-glow" />
      </motion.div>

      {/* Below card */}
      {!isAbove && (
        <>
          <div className="w-px h-6 bg-gradient-to-b from-ccb-light/20 to-ccb-light/60" />
          <motion.div
            whileHover={{ scale: 1.04, y: 4 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full rounded-xl bg-card p-4 shadow-lg border border-border/50 backdrop-blur-sm mt-3"
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
        </>
      )}
    </motion.div>
  );
};

export default TimelineCard;
