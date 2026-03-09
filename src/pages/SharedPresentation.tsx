import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Layers, Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import SlidePreview from "@/components/SlidePreview";
import FullscreenPresenter from "@/components/FullscreenPresenter";
import PresentationExporter from "@/components/PresentationExporter";
import { GeneratedPresentation } from "@/data/templates";
import { buildPptxDocument } from "@/lib/buildPptxDocument";
import { supabase } from "@/integrations/supabase/client";

const SharedPresentation = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState<GeneratedPresentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);

  const ptDocument = useMemo(() => {
    if (!presentation) return null;
    return buildPptxDocument(presentation);
  }, [presentation]);

  useEffect(() => {
    if (!shareId) return;

    const load = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from("shared_presentations")
          .select("*")
          .eq("share_id", shareId)
          .single();

        if (dbError || !data) throw new Error("Apresentacao nao encontrada");

        setPresentation(data.data as unknown as GeneratedPresentation);

        // Increment views
        await supabase
          .from("shared_presentations")
          .update({ views: (data.views || 0) + 1 })
          .eq("id", data.id);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-surface flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
      </div>
    );
  }

  if (error || !presentation) {
    return (
      <div className="min-h-screen gradient-surface flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-xl font-bold text-foreground mb-3">Apresentacao nao encontrada</h2>
          <p className="text-sm text-muted-foreground mb-6">{error || "Link invalido ou expirado."}</p>
          <Button onClick={() => navigate("/")} className="gradient-primary text-primary-foreground">
            Criar nova apresentacao
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
        <header className="border-b border-border/50 glass-strong">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
                <Layers className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold text-foreground truncate max-w-[300px]">{presentation.title}</h1>
                <p className="text-[10px] text-muted-foreground -mt-0.5">{presentation.slides.length} slides</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsPresenting(true)} className="text-muted-foreground gap-1.5">
                <Play className="h-4 w-4" /> Apresentar
              </Button>
              {ptDocument && (
                <PresentationExporter presentation={presentation} document={ptDocument} title={presentation.title} />
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
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

            <div className="flex-1 flex flex-col gap-4">
              <SlidePreview
                presentation={presentation}
                index={activeSlide}
                total={presentation.slides.length}
                mode="canvas"
              />

              <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigateSlide(-1)} disabled={activeSlide === 0} className="text-muted-foreground">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex gap-1.5">
                  {presentation.slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === activeSlide ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                    />
                  ))}
                </div>
                <Button variant="ghost" size="icon" onClick={() => navigateSlide(1)} disabled={activeSlide === presentation.slides.length - 1} className="text-muted-foreground">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {presentation.slides[activeSlide]?.notes && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Notas do apresentador</p>
                  <p className="text-sm text-foreground/80">{presentation.slides[activeSlide].notes}</p>
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>

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

export default SharedPresentation;
