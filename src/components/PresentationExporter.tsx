import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { GeneratedPresentation } from "@/data/templates";
import type { PtDocument } from "@/lib/pptxModel";
import { capturePresentationSlides } from "@/lib/captureSlideImages";
import { exportPptxDocument, exportPptxFromSlideImages } from "@/lib/exportPptxDocument";

interface PresentationExporterProps {
  presentation: GeneratedPresentation;
  document: PtDocument;
  title: string;
}

const PresentationExporter = ({ presentation, document, title }: PresentationExporterProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportToPPTX = async () => {
    setIsExporting(true);

    try {
      const slideImages = await capturePresentationSlides(presentation);
      await exportPptxFromSlideImages(slideImages, title);

      toast({
        title: "Exportado com fidelidade visual",
        description: "O PowerPoint foi gerado com o mesmo visual do preview.",
      });
    } catch (pixelError: any) {
      console.warn("Pixel export failed, using fallback:", pixelError);

      try {
        await exportPptxDocument(document, title);
        toast({
          title: "Exportado com fallback",
          description: "Usamos o modo alternativo de exportação para concluir o download.",
        });
      } catch (err: any) {
        console.error("Export error:", err);
        toast({
          title: "Erro na exportação",
          description: err?.message || "Falha ao gerar PPTX.",
          variant: "destructive",
        });
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={exportToPPTX}
      disabled={isExporting}
      className="gradient-primary text-primary-foreground gap-2 font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
    >
      <Download className="h-4 w-4" />
      {isExporting ? "Exportando..." : "Exportar PPTX"}
    </Button>
  );
};

export default PresentationExporter;

