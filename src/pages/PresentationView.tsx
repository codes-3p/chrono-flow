import { useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, Layers, ArrowLeft, Play, Share2, FileDown, Link, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SlidePreview from "@/components/SlidePreview";
import SlideEditor from "@/components/SlideEditor";
import PresentationExporter from "@/components/PresentationExporter";
import FullscreenPresenter from "@/components/FullscreenPresenter";
import { GeneratedPresentation, GeneratedSlide } from "@/data/templates";
import { buildPptxDocument } from "@/lib/buildPptxDocument";
import { exportPdfFromSlideImages } from "@/lib/exportPdfDocument";
import { capturePresentationSlides } from "@/lib/captureSlideImages";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PresentationView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const initialPresentation = (location.state as any)?.presentation as GeneratedPresentation | undefined;
  const [presentation, setPresentation] = useState<GeneratedPresentation | undefined>(initialPresentation);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const ptDocument = useMemo(() => {
    if (!presentation) return null;
    return buildPptxDocument(presentation);
  }, [presentation]);

  const handleSlideUpdate = useCallback((index: number, updated: GeneratedSlide) => {
    if (!presentation) return;
    const newSlides = [...presentation.slides];
    newSlides[index] = updated;
    setPresentation({ ...presentation, slides: newSlides });
  }, [presentation]);

  const handleExportPdf = async () => {
    if (!presentation) return;
    setIsExportingPdf(true);
    try {
      const images = await capturePresentationSlides(presentation);
      await exportPdfFromSlideImages(images, presentation.title);
      toast({ title: "PDF exportado", description: "Download iniciado com sucesso." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Erro ao exportar PDF", description: err.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleShare = async () => {
    if (!presentation) return;
    setIsSharing(true);
    try {
      const { data, error } = await supabase
        .from("shared_presentations")
        .insert({ title: presentation.title, data: presentation as any })
        .select("share_id")
        .single();

      if (error) throw error;

      const shareUrl = `${window.location.origin}/shared/${data.share_id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: "Link copiado!", description: "O link de compartilhamento foi copiado para a area de transferencia." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Erro ao compartilhar", description: err.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setIsSharing(false);
    }
  };

  if (!presentation) {
    return (
      <div className="min-h-screen gradient-surface flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-xl font-bold text-foreground mb-3">Nenhuma apresentacao carregada</h2>
          <p className="text-sm text-muted-foreground mb-6">Gere uma apresentacao primeiro para visualizar aqui.</p>
          <Button onClick={() => navigate("/")} className="gradient-primary text-primary-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao inicio
          </Button>
        </div>
      </div>
    );
  }

  const navigateSlide = (dir: -1 | 1) => {
    setActiveSlide((prev) =>
      Math.max(0, Math.min(presentation.slides.length - 1, prev + dir))
    );
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
                <h1 className="font-display text-lg font-bold text-foreground truncate max-w-[300px]">{presentation.title}</h1>
                <p className="text-[10px] text-muted-foreground -mt-0.5">{presentation.slides.length} slides</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPresenting(true)}
                className="text-muted-foreground gap-1.5"
              >
                <Play className="h-4 w-4" /> Apresentar
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                disabled={isSharing}
                className="text-muted-foreground gap-1.5"
              >
                <Share2 className="h-4 w-4" /> {isSharing ? "..." : "Compartilhar"}
              </Button>

              <Button variant="ghost" size="sm" onClick={() => navigate("/create/ai")} className="text-muted-foreground">
                <RotateCcw className="h-4 w-4 mr-1" /> Nova
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                    <FileDown className="h-4 w-4" /> Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <div className="w-full">
                      <PresentationExporter presentation={presentation} document={ptDocument!} title={presentation.title} />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPdf} disabled={isExportingPdf}>
                    <FileDown className="h-4 w-4 mr-2" />
                    {isExportingPdf ? "Exportando PDF..." : "Exportar PDF"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Presentation view */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Sidebar thumbnails */}
            <div className="hidden md:flex flex-col gap-2 w-44 shrink-0 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
              {presentation.slides.map((_, i) => (
                <SlidePreview
                  key={i}
                  presentation={presentation}
                  index={i}
                  total={presentation.slides.length}
                  isActive={i === activeSlide}
                  onClick={() => setActiveSlide(i)}
                />
              ))}
            </div>

            {/* Main slide */}
            <div className="flex-1 flex flex-col gap-4">
              <SlidePreview
                presentation={presentation}
                index={activeSlide}
                total={presentation.slides.length}
                mode="canvas"
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

              {/* Slide editor */}
              <SlideEditor
                slide={presentation.slides[activeSlide]}
                index={activeSlide}
                onSave={handleSlideUpdate}
              />

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
      </div>

      {/* Fullscreen presenter */}
      {isPresenting && (
        <FullscreenPresenter
          presentation={presentation}
          startSlide={activeSlide}
          onExit={() => setIsPresenting(false)}
        />
      )}
    </div>
  );
};

export default PresentationView;
