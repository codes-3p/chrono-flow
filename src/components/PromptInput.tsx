import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromptInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

const suggestions = [
  "Pitch deck para startup de IA",
  "Plano de marketing digital 2025",
  "Relatório trimestral de vendas",
  "Workshop de liderança",
  "Lançamento de produto SaaS",
];

const PromptInput = ({ onSubmit, isLoading }: PromptInputProps) => {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) onSubmit(topic.trim());
  };

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-strong rounded-2xl p-1.5 glow-primary">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Sobre o que será sua apresentação?"
                className="w-full bg-transparent pl-12 pr-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none text-base font-medium"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              disabled={!topic.trim() || isLoading}
              className="gradient-primary text-primary-foreground rounded-xl px-6 py-6 font-semibold text-base hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Gerar <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {suggestions.map((s, i) => (
          <motion.button
            key={s}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            onClick={() => setTopic(s)}
            className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
          >
            {s}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default PromptInput;
