import pptxgen from "pptxgenjs";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneratedPresentation } from "@/data/templates";

interface PresentationExporterProps {
  presentation: GeneratedPresentation;
}

const PresentationExporter = ({ presentation }: PresentationExporterProps) => {
  const exportToPPTX = () => {
    const pptx = new pptxgen();
    pptx.layout = "LAYOUT_WIDE";

    const { template, slides } = presentation;
    const primaryHex = template.colors.primary.replace("#", "");
    const secondaryHex = template.colors.secondary.replace("#", "");
    const accentHex = template.colors.accent.replace("#", "");

    slides.forEach((slide, i) => {
      const s = pptx.addSlide();
      const isCover = slide.layout === "title" || slide.layout === "closing";
      const isQuote = slide.layout === "quote";

      // Background
      s.background = { fill: isCover ? primaryHex : secondaryHex };

      // Top accent line
      s.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: "100%", h: 0.04,
        fill: { color: accentHex },
      });

      if (isCover) {
        s.addText(slide.title, {
          x: 1, y: 2.5, w: 11.33, fontSize: 44, fontFace: "Arial",
          color: "FFFFFF", bold: true, align: "center",
        });
        if (slide.content.length > 0) {
          s.addText(slide.content[0], {
            x: 2, y: 4.2, w: 9.33, fontSize: 20, fontFace: "Arial",
            color: "FFFFFF", align: "center", italic: true,
          });
        }
      } else if (isQuote) {
        s.addText(`"${slide.title}"`, {
          x: 1.5, y: 2, w: 10.33, fontSize: 28, fontFace: "Arial",
          color: "FFFFFF", align: "center", italic: true,
          lineSpacingMultiple: 1.3,
        });
        if (slide.content.length > 0) {
          s.addText(`— ${slide.content[0]}`, {
            x: 1.5, y: 5, w: 10.33, fontSize: 14, fontFace: "Arial",
            color: accentHex, align: "center",
          });
        }
      } else {
        // Accent bar
        s.addShape(pptx.ShapeType.rect, {
          x: 0.8, y: 1, w: 0.6, h: 0.06,
          fill: { color: accentHex },
        });

        // Title
        s.addText(slide.title, {
          x: 0.8, y: 1.2, w: 10, fontSize: 28, fontFace: "Arial",
          color: "FFFFFF", bold: true,
        });

        // Content bullets
        const isTwo = slide.layout === "two-column";
        const colW = isTwo ? 5.2 : 11;

        slide.content.forEach((item, j) => {
          const col = isTwo ? Math.floor(j / Math.ceil(slide.content.length / 2)) : 0;
          const row = isTwo ? j % Math.ceil(slide.content.length / 2) : j;

          s.addShape(pptx.ShapeType.ellipse, {
            x: 0.8 + col * 5.8, y: 2.4 + row * 0.85,
            w: 0.12, h: 0.12,
            fill: { color: accentHex },
          });

          s.addText(item, {
            x: 1.1 + col * 5.8, y: 2.25 + row * 0.85,
            w: colW - 1, fontSize: 14, fontFace: "Arial",
            color: "E0E0E0",
            lineSpacingMultiple: 1.15,
          });
        });
      }

      // Slide number
      s.addText(`${i + 1}`, {
        x: 12.3, y: 7, w: 0.8, fontSize: 10, fontFace: "Arial",
        color: "666666", align: "right",
      });

      // Notes
      if (slide.notes) s.addNotes(slide.notes);
    });

    const safeName = presentation.title.replace(/[^a-zA-Z0-9\u00C0-\u024F ]/g, "").trim().replace(/\s+/g, "_");
    pptx.writeFile({ fileName: `${safeName}.pptx` });
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
