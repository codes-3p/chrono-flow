import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Wand2, ArrowLeft, ArrowRight, Loader2, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TemplateSelector from "@/components/TemplateSelector";
import LanguageSelector from "@/components/LanguageSelector";
import ModelSelector from "@/components/ModelSelector";
import PageCountSelector from "@/components/PageCountSelector";
import { SlideTemplate, GeneratedPresentation, slideTemplates } from "@/data/templates";
import { Layers } from "lucide-react";

const suggestions = [
  "Pitch deck para startup de IA",
  "Plano de marketing digital 2025",
  "Relatório trimestral de vendas",
  "Workshop de liderança",
  "Lançamento de produto SaaS",
];

const CreateAI = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tab, setTab] = useState<string>("topic");
  const [topic, setTopic] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<SlideTemplate | null>(null);
  const [language, setLanguage] = useState("pt-BR");
  const [model, setModel] = useState("google/gemini-3-flash-preview");
  const [slideCount, setSlideCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const inputValue = tab === "topic" ? topic : pasteText;
  const canGenerate = inputValue.trim().length > 0 && selectedTemplate && !isGenerating;

  const handleGenerate = async () => {
    if (!selectedTemplate || !inputValue.trim()) return;

    setIsGenerating(true);
    try {
      const body: any = {
        template: selectedTemplate,
        slideCount,
        language,
        model,
      };

      if (tab === "topic") {
        body.topic = inputValue.trim();
      } else {
        body.topic = `Create a presentation based on the following text:\n\n${inputValue.trim()}`;
        body.sourceText = inputValue.trim();
      }

      const { data, error } = await supabase.functions.invoke("generate-presentation", { body });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const presentation: GeneratedPresentation = { ...data, template: selectedTemplate };

      toast({ title: "Apresentação gerada!", description: `${data.slides.length} slides criados com sucesso.` });

      // Navigate to presentation view with state
      navigate("/presentation", { state: { presentation } });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Erro ao gerar", description: err.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen gradient-surface">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 glass-strong">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
                <Layers className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold text-foreground">Gerar com IA</h1>
                <p className="text-[10px] text-muted-foreground -mt-0.5">Crie apresentações profissionais</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-10">
          {/* Hero */}
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-2">
              Do que será sua <span className="text-gradient">apresentação?</span>
            </h2>
            <p className="text-muted-foreground text-sm">
              Descreva o tema ou cole seu conteúdo e a IA cria slides profissionais
            </p>
          </motion.div>

          {/* Input Tabs */}
          <motion.div
            className="max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="mb-4 bg-secondary">
                <TabsTrigger value="topic" className="gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Digitar um tema
                </TabsTrigger>
                <TabsTrigger value="paste" className="gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Colar texto
                </TabsTrigger>
              </TabsList>

              <TabsContent value="topic">
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
                        disabled={isGenerating}
                        onKeyDown={(e) => e.key === "Enter" && canGenerate && handleGenerate()}
                      />
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={s}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      onClick={() => setTopic(s)}
                      className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="paste">
                <div className="glass-strong rounded-2xl p-4 glow-primary">
                  <Textarea
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    placeholder="Cole seu texto, artigo, notas ou conteúdo aqui... A IA vai estruturar em slides profissionais."
                    className="min-h-[180px] bg-transparent border-none text-foreground placeholder:text-muted-foreground focus-visible:ring-0 resize-none text-sm"
                    disabled={isGenerating}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      {pasteText.split(/\s+/).filter(Boolean).length} palavras
                    </span>
                    <span className="text-xs text-muted-foreground">Máximo recomendado: 15.000 palavras</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Settings row */}
          <motion.div
            className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PageCountSelector value={slideCount} onChange={setSlideCount} />
            <ModelSelector value={model} onChange={setModel} />
            <LanguageSelector value={language} onChange={setLanguage} />
          </motion.div>

          {/* Generate button */}
          <motion.div
            className="max-w-3xl mx-auto flex justify-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate}
              size="lg"
              className="gradient-primary text-primary-foreground rounded-xl px-10 py-6 font-semibold text-base hover:opacity-90 transition-opacity gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Gerando apresentação...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  Gerar Apresentação
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </motion.div>

          {/* Loading state */}
          {isGenerating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
              <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-muted-foreground">A IA está criando seus slides...</span>
              </div>
            </motion.div>
          )}

          {/* Template selector */}
          <TemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />
        </main>
      </div>
    </div>
  );
};

export default CreateAI;
