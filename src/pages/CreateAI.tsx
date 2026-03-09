import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, ArrowLeft, ArrowRight, Loader2, Sparkles, FileText, ListTree, Pencil, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TemplateSelector from "@/components/TemplateSelector";
import LanguageSelector from "@/components/LanguageSelector";
import ModelSelector from "@/components/ModelSelector";
import PageCountSelector from "@/components/PageCountSelector";
import { SlideTemplate, GeneratedPresentation, slideTemplates } from "@/data/templates";
import { Layers } from "lucide-react";

interface OutlineItem {
  slideNumber: number;
  title: string;
  layout: string;
  keyPoints: string[];
  notes?: string;
}

interface Outline {
  title: string;
  subtitle: string;
  outline: OutlineItem[];
}

const suggestions = [
  "Pitch deck para startup de IA",
  "Plano de marketing digital 2025",
  "Relatorio trimestral de vendas",
  "Workshop de lideranca",
  "Lancamento de produto SaaS",
];

const CreateAI = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tab, setTab] = useState<string>("topic");
  const [topic, setTopic] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<SlideTemplate | null>(slideTemplates[0] || null);
  const [language, setLanguage] = useState("pt-BR");
  const [model, setModel] = useState("google/gemini-3-flash-preview");
  const [slideCount, setSlideCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  // Outline state
  const [outline, setOutline] = useState<Outline | null>(null);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [editingOutlineIndex, setEditingOutlineIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPoints, setEditPoints] = useState("");

  const inputValue = tab === "topic" ? topic : pasteText;
  const canGenerate = inputValue.trim().length > 0 && selectedTemplate && !isGenerating && !isGeneratingOutline;

  const handleGenerateOutline = async () => {
    if (!selectedTemplate || !inputValue.trim()) return;

    setIsGeneratingOutline(true);
    try {
      const body: any = {
        slideCount,
        language,
        model,
      };

      if (tab === "topic") {
        body.topic = inputValue.trim();
      } else {
        body.topic = `Create based on: ${inputValue.trim()}`;
        body.sourceText = inputValue.trim();
      }

      const { data, error } = await supabase.functions.invoke("generate-outline", { body });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setOutline(data as Outline);
      toast({ title: "Estrutura gerada!", description: "Revise e edite antes de gerar os slides finais." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Erro ao gerar estrutura", description: err.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleGenerateFromOutline = async () => {
    if (!selectedTemplate || !outline) return;

    setIsGenerating(true);
    try {
      const outlineText = outline.outline
        .map((item) => `Slide ${item.slideNumber} (${item.layout}): ${item.title}\n- ${item.keyPoints.join("\n- ")}`)
        .join("\n\n");

      const body = {
        topic: `Generate presentation following this exact outline structure:\n\nTitle: ${outline.title}\nSubtitle: ${outline.subtitle}\n\n${outlineText}`,
        sourceText: outlineText,
        template: selectedTemplate,
        slideCount: outline.outline.length,
        language,
        model,
      };

      const { data, error } = await supabase.functions.invoke("generate-presentation", { body });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const presentation: GeneratedPresentation = { ...data, template: selectedTemplate };
      toast({ title: "Apresentacao gerada!", description: `${data.slides.length} slides criados com sucesso.` });
      navigate("/presentation", { state: { presentation } });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Erro ao gerar", description: err.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDirectGenerate = async () => {
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
      toast({ title: "Apresentacao gerada!", description: `${data.slides.length} slides criados com sucesso.` });
      navigate("/presentation", { state: { presentation } });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Erro ao gerar", description: err.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const startEditOutlineItem = (index: number) => {
    const item = outline!.outline[index];
    setEditingOutlineIndex(index);
    setEditTitle(item.title);
    setEditPoints(item.keyPoints.join("\n"));
  };

  const saveOutlineItem = () => {
    if (editingOutlineIndex === null || !outline) return;
    const newOutline = [...outline.outline];
    newOutline[editingOutlineIndex] = {
      ...newOutline[editingOutlineIndex],
      title: editTitle,
      keyPoints: editPoints.split("\n").filter((l) => l.trim()),
    };
    setOutline({ ...outline, outline: newOutline });
    setEditingOutlineIndex(null);
  };

  const removeOutlineItem = (index: number) => {
    if (!outline) return;
    const newItems = outline.outline.filter((_, i) => i !== index).map((item, i) => ({
      ...item,
      slideNumber: i + 1,
    }));
    setOutline({ ...outline, outline: newItems });
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
                <p className="text-[10px] text-muted-foreground -mt-0.5">Crie apresentacoes profissionais</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-10">
          {/* Hero */}
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-2">
              Do que sera sua <span className="text-gradient">apresentacao?</span>
            </h2>
            <p className="text-muted-foreground text-sm">
              Descreva o tema ou cole seu conteudo e a IA cria slides profissionais
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
                        placeholder="Sobre o que sera sua apresentacao?"
                        className="w-full bg-transparent pl-12 pr-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none text-base font-medium"
                        disabled={isGenerating || isGeneratingOutline}
                        onKeyDown={(e) => e.key === "Enter" && canGenerate && handleGenerateOutline()}
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
                    placeholder="Cole seu texto, artigo, notas ou conteudo aqui... A IA vai estruturar em slides profissionais."
                    className="min-h-[180px] bg-transparent border-none text-foreground placeholder:text-muted-foreground focus-visible:ring-0 resize-none text-sm"
                    disabled={isGenerating || isGeneratingOutline}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      {pasteText.split(/\s+/).filter(Boolean).length} palavras
                    </span>
                    <span className="text-xs text-muted-foreground">Maximo recomendado: 15.000 palavras</span>
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

          {/* Generate buttons */}
          <motion.div
            className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-center gap-3 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <Button
              onClick={handleGenerateOutline}
              disabled={!canGenerate}
              size="lg"
              variant="outline"
              className="rounded-xl px-8 py-6 font-semibold text-base gap-2 border-border/60"
            >
              {isGeneratingOutline ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Gerando estrutura...
                </>
              ) : (
                <>
                  <ListTree className="h-5 w-5" />
                  Gerar Estrutura Primeiro
                </>
              )}
            </Button>
            <Button
              onClick={handleDirectGenerate}
              disabled={!canGenerate}
              size="lg"
              className="gradient-primary text-primary-foreground rounded-xl px-8 py-6 font-semibold text-base hover:opacity-90 transition-opacity gap-2"
            >
              {isGenerating && !outline ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Gerando apresentacao...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  Gerar Direto
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </motion.div>

          {/* Loading state */}
          {(isGenerating || isGeneratingOutline) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
              <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  {isGeneratingOutline ? "Gerando estrutura..." : "A IA esta criando seus slides..."}
                </span>
              </div>
            </motion.div>
          )}

          {/* Outline preview */}
          <AnimatePresence>
            {outline && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto mb-12"
              >
                <div className="glass-strong rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground">{outline.title}</h3>
                      <p className="text-sm text-muted-foreground">{outline.subtitle}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setOutline(null)} className="text-muted-foreground gap-1">
                        <X className="h-3.5 w-3.5" /> Descartar
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleGenerateFromOutline}
                        disabled={isGenerating}
                        className="gradient-primary text-primary-foreground gap-1.5"
                      >
                        {isGenerating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Wand2 className="h-3.5 w-3.5" />
                        )}
                        Gerar Slides
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {outline.outline.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex gap-3 p-3 rounded-lg bg-secondary/50 group"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                          {item.slideNumber}
                        </div>
                        <div className="flex-1 min-w-0">
                          {editingOutlineIndex === i ? (
                            <div className="space-y-2">
                              <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="bg-background border-border text-sm"
                              />
                              <Textarea
                                value={editPoints}
                                onChange={(e) => setEditPoints(e.target.value)}
                                rows={3}
                                className="bg-background border-border text-sm resize-none"
                                placeholder="Um topico por linha"
                              />
                              <div className="flex gap-1.5">
                                <Button size="sm" variant="ghost" onClick={() => setEditingOutlineIndex(null)}>
                                  <X className="h-3 w-3" />
                                </Button>
                                <Button size="sm" onClick={saveOutlineItem} className="gradient-primary text-primary-foreground">
                                  <Check className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{item.layout}</span>
                              </div>
                              <ul className="mt-1 space-y-0.5">
                                {item.keyPoints.map((point, j) => (
                                  <li key={j} className="text-xs text-muted-foreground">- {point}</li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                        {editingOutlineIndex !== i && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="ghost" onClick={() => startEditOutlineItem(i)} className="h-7 w-7 p-0">
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => removeOutlineItem(i)} className="h-7 w-7 p-0 text-destructive">
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Template selector */}
          <TemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />
        </main>
      </div>
    </div>
  );
};

export default CreateAI;
