import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const languages = [
  { value: "pt-BR", label: "Portugues (BR)" },
  { value: "pt-PT", label: "Portugues (PT)" },
  { value: "en", label: "English" },
  { value: "es", label: "Espanol" },
  { value: "fr", label: "Francais" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese (Simplified)" },
  { value: "zh-TW", label: "Chinese (Traditional)" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "ru", label: "Russian" },
  { value: "nl", label: "Nederlands" },
  { value: "sv", label: "Svenska" },
  { value: "pl", label: "Polski" },
  { value: "tr", label: "Turkce" },
  { value: "da", label: "Dansk" },
  { value: "fi", label: "Suomi" },
  { value: "no", label: "Norsk" },
  { value: "cs", label: "Cestina" },
  { value: "hu", label: "Magyar" },
  { value: "ro", label: "Romana" },
  { value: "bg", label: "Bulgarian" },
  { value: "hr", label: "Hrvatski" },
  { value: "sk", label: "Slovencina" },
  { value: "sl", label: "Slovenscina" },
  { value: "uk", label: "Ukrainian" },
  { value: "el", label: "Greek" },
  { value: "he", label: "Hebrew" },
  { value: "th", label: "Thai" },
  { value: "vi", label: "Vietnamese" },
  { value: "id", label: "Bahasa Indonesia" },
  { value: "ms", label: "Bahasa Melayu" },
  { value: "tl", label: "Filipino" },
  { value: "bn", label: "Bengali" },
  { value: "ta", label: "Tamil" },
  { value: "ur", label: "Urdu" },
  { value: "fa", label: "Persian" },
  { value: "sw", label: "Swahili" },
  { value: "af", label: "Afrikaans" },
  { value: "ca", label: "Catala" },
  { value: "eu", label: "Euskara" },
  { value: "gl", label: "Galego" },
  { value: "lt", label: "Lietuviu" },
  { value: "lv", label: "Latviesu" },
  { value: "et", label: "Eesti" },
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
      <SelectContent className="max-h-[300px]">
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
