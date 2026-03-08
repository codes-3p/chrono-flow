import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Layers, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FileUploadZone from "@/components/FileUploadZone";
import LanguageSelector from "@/components/LanguageSelector";
import ModelSelector from "@/components/ModelSelector";
import TemplateSelector from "@/components/TemplateSelector";
import { SlideTemplate, GeneratedPresentation } from "@/data/templates";

const BeautifySlides = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<SlideTemplate | null>(null);
  const [language, setLanguage] = useState("pt-BR");
  const [model, setModel] = useState("google/gemini-2.5-pro");
  const [isGenerating, setIsGenerating] = useState(false);

  const canGenerate = file && selectedTemplate && !isGenerating;

  const handleGenerate = async () => {
    if (!file || !selectedTemplate) return;

    setIsGenerating(true);
    try {
      const text = await file.text();

      const { data, error } = await supabase.functions.invoke("generate-presentation", {
        body: {
          topic: `Redesign and beautify the following presentation content with premium layouts, modern typography, and data-rich visuals. Keep the same information but make it visually stunning:\n\n${text.slice(0, 50000)}`,
          sourceText: text.slice(0, 50000),
          template: selectedTemplate,
          slideCount: 10,
          language,
          model,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const presentation: GeneratedPresentation = { ...data, template: selectedTemplate };
      toast({ title: "Slides redesenhados!", description: `${data.slides.length} slides com novo visual.` });
      navigate("/presentation", { state: { presentation } });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Erro ao embelezar", description: err.message || "Tente novamente.", variant: "destructive" });
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
        <header className="border-b border-border/50 glass-strong">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
              <Layers className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">Embelezar Slides</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Redesenhe com IA</p>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-10">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-2">
              Transforme seus slides com <span className="text-gradient">design profissional</span>
            </h2>
            <p className="text-muted-foreground text-sm">
              Envie um PPTX existente e a IA redesenha com layouts premium e tipografia moderna
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto mb-8">
            <FileUploadZone
              accept=".pptx,.ppt"
              description="Arquivos PowerPoint (.pptx, .ppt)"
              onFile={setFile}
              file={file}
              onClear={() => setFile(null)}
            />
          </div>

          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <ModelSelector value={model} onChange={setModel} />
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>

          <div className="max-w-3xl mx-auto flex justify-center mb-12">
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate}
              size="lg"
              className="gradient-primary text-primary-foreground rounded-xl px-10 py-6 font-semibold text-base hover:opacity-90 transition-opacity gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Redesenhando slides...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Embelezar Slides
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
              <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-muted-foreground">A IA está redesenhando seus slides...</span>
              </div>
            </motion.div>
          )}

          <TemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />
        </main>
      </div>
    </div>
  );
};

export default BeautifySlides;
