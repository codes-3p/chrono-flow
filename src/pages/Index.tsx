import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, ChevronLeft, ChevronRight, RotateCcw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PromptInput from "@/components/PromptInput";
import TemplateSelector from "@/components/TemplateSelector";
import SlidePreview from "@/components/SlidePreview";
import SlideViewer from "@/components/SlideViewer";
import PresentationExporter from "@/components/PresentationExporter";
import { SlideTemplate, GeneratedPresentation } from "@/data/templates";

const Index = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<SlideTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [presentation, setPresentation] = useState<GeneratedPresentation | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleGenerate = async (topic: string) => {
    if (!selectedTemplate) {
      toast({ title: "Selecione um template", description: "Escolha um modelo antes de gerar.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-presentation", {
        body: {
          topic,
          template: selectedTemplate,
          slideCount: selectedTemplate.slideCount,
          language: "pt-BR",
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setPresentation({ ...data, template: selectedTemplate });
      setActiveSlide(0);
      toast({ title: "Apresentação gerada!", description: `${data.slides.length} slides criados com sucesso.` });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Erro ao gerar", description: err.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setPresentation(null);
    setActiveSlide(0);
  };

  const navigateSlide = (dir: -1 | 1) => {
    if (!presentation) return;
    setActiveSlide((prev) =>
      Math.max(0, Math.min(presentation.slides.length - 1, prev + dir))
    );
  };

  return (
    <div className="min-h-screen gradient-surface">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 glass-strong">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
                <Layers className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold text-foreground">SlideAI</h1>
                <p className="text-[10px] text-muted-foreground -mt-0.5">Apresentações inteligentes</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {presentation && (
                <>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
                    <RotateCcw className="h-4 w-4 mr-1" /> Nova
                  </Button>
                  <PresentationExporter presentation={presentation} />
                </>
              )}
            </div>
          </div>
        </header>

        {!presentation ? (
          /* ─── Generator View ─── */
          <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
            {/* Hero */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <Wand2 className="h-3.5 w-3.5" />
                Powered by AI
              </motion.div>
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold">
                <span className="text-foreground">Crie apresentações</span>
                <br />
                <span className="text-gradient">incríveis em segundos</span>
              </h2>
              <p className="mt-4 text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
                Descreva o tema, escolha um template e deixe a IA criar slides profissionais prontos para exportar.
              </p>
            </motion.div>

            {/* Prompt */}
            <PromptInput onSubmit={handleGenerate} isLoading={isGenerating} />

            {/* Loading state */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 text-center"
              >
                <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm text-muted-foreground">Gerando sua apresentação...</span>
                </div>
              </motion.div>
            )}

            {/* Templates */}
            <div className="mt-12">
              <TemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />
            </div>
          </main>
        ) : (
          /* ─── Presentation View ─── */
          <main className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex gap-6">
              {/* Sidebar thumbnails */}
              <div className="hidden md:flex flex-col gap-2 w-44 shrink-0 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
                {presentation.slides.map((slide, i) => (
                  <SlidePreview
                    key={i}
                    slide={slide}
                    template={presentation.template}
                    index={i}
                    isActive={i === activeSlide}
                    onClick={() => setActiveSlide(i)}
                  />
                ))}
              </div>

              {/* Main slide */}
              <div className="flex-1 flex flex-col gap-4">
                <SlideViewer
                  slide={presentation.slides[activeSlide]}
                  template={presentation.template}
                  index={activeSlide}
                  total={presentation.slides.length}
                />

                {/* Navigation */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateSlide(-1)}
                    disabled={activeSlide === 0}
                    className="text-muted-foreground"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <div className="flex gap-1.5">
                    {presentation.slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveSlide(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === activeSlide
                            ? "w-6 bg-primary"
                            : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateSlide(1)}
                    disabled={activeSlide === presentation.slides.length - 1}
                    className="text-muted-foreground"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                {/* Speaker notes */}
                {presentation.slides[activeSlide]?.notes && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-lg p-4"
                  >
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Notas do apresentador</p>
                    <p className="text-sm text-foreground/80">{presentation.slides[activeSlide].notes}</p>
                  </motion.div>
                )}
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default Index;
