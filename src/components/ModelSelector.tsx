import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Cpu } from "lucide-react";

const models = [
  { value: "google/gemini-3-flash-preview", label: "Rápido", description: "Gemini 3 Flash — velocidade otimizada", icon: Zap },
  { value: "google/gemini-2.5-flash", label: "Balanceado", description: "Gemini 2.5 Flash — equilíbrio custo/qualidade", icon: Zap },
  { value: "google/gemini-2.5-pro", label: "Avançado", description: "Gemini 2.5 Pro — máxima qualidade", icon: Cpu },
  { value: "openai/gpt-5", label: "Premium", description: "GPT-5 — raciocínio avançado", icon: Cpu },
];

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ModelSelector = ({ value, onChange }: ModelSelectorProps) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-muted-foreground">Modelo de IA</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="glass-strong border-border/50 text-foreground">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => {
          const Icon = model.icon;
          return (
            <SelectItem key={model.value} value={model.value}>
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span>{model.label}</span>
                <span className="text-muted-foreground text-xs hidden sm:inline">— {model.description}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  </div>
);

export default ModelSelector;
