import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const languages = [
  { value: "pt-BR", label: "Português (BR)" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "zh", label: "中文" },
  { value: "ar", label: "العربية" },
  { value: "hi", label: "हिन्दी" },
  { value: "ru", label: "Русский" },
  { value: "nl", label: "Nederlands" },
  { value: "sv", label: "Svenska" },
  { value: "pl", label: "Polski" },
  { value: "tr", label: "Türkçe" },
];

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const LanguageSelector = ({ value, onChange }: LanguageSelectorProps) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-muted-foreground">Idioma</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="glass-strong border-border/50 text-foreground">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default LanguageSelector;
