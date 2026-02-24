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
      style={{ minWidth: 220 }}
      initial={{ opacity: 0, y: isAbove ? -40 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Card */}
      <div
        className={`absolute ${
          isAbove ? "bottom-10" : "top-10"
        } w-52`}
      >
        <motion.div
          whileHover={{ scale: 1.05, y: isAbove ? -4 : 4 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="rounded-xl bg-card p-4 shadow-lg border border-border/50 backdrop-blur-sm"
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

        {/* Connector line */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b ${
            isAbove
              ? "bottom-0 translate-y-full from-ccb-light/60 to-transparent"
              : "top-0 -translate-y-full from-transparent to-ccb-light/60"
          }`}
        />
      </div>

      {/* Dot on timeline */}
      <motion.div
        className="relative z-10 h-4 w-4 rounded-full border-2 border-ccb-light bg-card shadow-md"
        whileHover={{ scale: 1.5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className="absolute inset-0.5 rounded-full bg-ccb-light/30 animate-pulse-glow" />
      </motion.div>
    </motion.div>
  );
};

export default TimelineCard;
