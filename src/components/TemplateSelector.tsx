import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import {
  Briefcase, GraduationCap, Palette, Cpu, Minus,
  TrendingUp, BarChart3, Target, BookOpen, Presentation,
  Image, Megaphone, Rocket, Code2, Sparkles,
} from "lucide-react";
import { SlideTemplate, TemplateCategory, templateCategories, slideTemplates } from "@/data/templates";

const iconMap: Record<string, React.ElementType> = {
  Briefcase, GraduationCap, Palette, Cpu, Minus,
  TrendingUp, BarChart3, Target, BookOpen, Presentation,
  Image, Megaphone, Rocket, Code2, Sparkles,
};

interface TemplateSelectorProps {
  selected: SlideTemplate | null;
  onSelect: (template: SlideTemplate) => void;
}

const TemplateSelector = ({ selected, onSelect }: TemplateSelectorProps) => {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "all">("all");

  const filtered = activeCategory === "all"
    ? slideTemplates
    : slideTemplates.filter((t) => t.category === activeCategory);

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">
        Escolha um template
      </h3>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={`text-xs font-medium px-4 py-2 rounded-full transition-all whitespace-nowrap ${
            activeCategory === "all"
              ? "gradient-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-muted"
          }`}
        >
          Todos
        </button>
        {templateCategories.map((cat) => {
          const Icon = iconMap[cat.icon];
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? "gradient-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((template) => {
            const Icon = iconMap[template.icon];
            const isSelected = selected?.id === template.id;

            return (
              <motion.button
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => onSelect(template)}
                className={`relative group text-left p-4 rounded-xl transition-all duration-300 ${
                  isSelected
                    ? "ring-2 ring-primary glow-primary bg-secondary"
                    : "glass hover:bg-secondary/80"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="template-check"
                    className="absolute top-2 right-2 h-5 w-5 rounded-full gradient-primary flex items-center justify-center"
                  >
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </motion.div>
                )}

                {/* Color preview */}
                <div
                  className="h-16 rounded-lg mb-3 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
                  }}
                >
                  {Icon && <Icon className="h-6 w-6 text-primary-foreground/80" />}
                </div>

                <p className="text-sm font-semibold text-foreground truncate">{template.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                  {template.description}
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-1.5">
                  {template.slideCount} slides
                </p>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TemplateSelector;
