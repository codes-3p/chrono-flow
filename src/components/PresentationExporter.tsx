import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { PtDocument } from "@/lib/pptxModel";
import { exportPptxDocument } from "@/lib/exportPptxDocument";

interface PresentationExporterProps {
  document: PtDocument;
  title: string;
}

const PresentationExporter = ({ document, title }: PresentationExporterProps) => {
  const { toast } = useToast();

  const exportToPPTX = async () => {
    try {
      await exportPptxDocument(document, title);
      toast({ title: "Exportado!", description: "Arquivo PPTX nativo baixado com sucesso." });
    } catch (err: any) {
      console.error("Export error:", err);
      toast({
        title: "Erro na exportação",
        description: err?.message || "Falha ao gerar PPTX.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={exportToPPTX}
      className="gradient-primary text-primary-foreground gap-2 font-semibold hover:opacity-90 transition-opacity"
    >
      <Download className="h-4 w-4" />
      Exportar PPTX
    </Button>
  );
};

export default PresentationExporter;

