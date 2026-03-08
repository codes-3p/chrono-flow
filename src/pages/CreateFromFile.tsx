import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Layers, Loader2, Wand2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FileUploadZone from "@/components/FileUploadZone";
import LanguageSelector from "@/components/LanguageSelector";
import ModelSelector from "@/components/ModelSelector";
import PageCountSelector from "@/components/PageCountSelector";
import TemplateSelector from "@/components/TemplateSelector";
import { SlideTemplate, GeneratedPresentation } from "@/data/templates";

const typeConfig: Record<string, { title: string; description: string; accept: string; fileDesc: string }> = {
  pdf: {
    title: "PDF para Slides",
    description: "Envie um PDF e transforme o conteúdo em uma apresentação profissional",
    accept: ".pdf",
    fileDesc: "Arquivos PDF (máximo 15.000 palavras)",
  },
  word: {
    title: "Word para Slides",
    description: "Importe documentos Word com detecção automática de estrutura H1/H2/H3",
    accept: ".doc,.docx",
    fileDesc: "Documentos Word (.doc, .docx)",
  },
  markdown: {
    title: "Markdown para Slides",
    description: "Envie ou cole Markdown e a IA expande em slides completos",
    accept: ".md,.txt",
    fileDesc: "Arquivos Markdown (.md) ou texto (.txt)",
  },
};

const CreateFromFile = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "pdf";
  const config = typeConfig[type] || typeConfig.pdf;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<SlideTemplate | null>(null);
  const [language, setLanguage] = useState("pt-BR");
  const [model, setModel] = useState("google/gemini-3-flash-preview");
  const [slideCount, setSlideCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const canGenerate = file && selectedTemplate && !isGenerating;

  const handleGenerate = async () => {
    if (!file || !selectedTemplate) return;

    setIsGenerating(true);
    try {
      // Read file as text
      const text = await file.text();

      const { data, error } = await supabase.functions.invoke("generate-presentation", {
        body: {
          topic: `Create a presentation based on this ${type.toUpperCase()} content:\n\n${text.slice(0, 50000)}`,
          sourceText: text.slice(0, 50000),
          template: selectedTemplate,
          slideCount,
          language,
          model,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const presentation: GeneratedPresentation = { ...data, template: selectedTemplate };
      toast({ title: "Apresentação gerada!", description: `${data.slides.length} slides criados a partir do seu arquivo.` });
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
        <header className="border-b border-border/50 glass-strong">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
              <Layers className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">{config.title}</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">{config.description}</p>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-10">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-2">{config.title}</h2>
            <p className="text-muted-foreground text-sm">{config.description}</p>
          </motion.div>

          <div className="max-w-3xl mx-auto mb-8">
            <FileUploadZone
              accept={config.accept}
              description={config.fileDesc}
              onFile={setFile}
              file={file}
              onClear={() => setFile(null)}
            />
          </div>

          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <PageCountSelector value={slideCount} onChange={setSlideCount} />
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
                  Processando arquivo...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  Gerar Apresentação
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
              <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-muted-foreground">Extraindo conteúdo e criando slides...</span>
              </div>
            </motion.div>
          )}

          <TemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />
        </main>
      </div>
    </div>
  );
};

export default CreateFromFile;
