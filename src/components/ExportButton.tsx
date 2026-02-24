import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimelineEvent } from "@/data/timelineData";
import pptxgen from "pptxgenjs";

interface ExportButtonProps {
  events: TimelineEvent[];
}

const ExportButton = ({ events }: ExportButtonProps) => {
  const exportToPPT = () => {
    const pptx = new pptxgen();
    pptx.layout = "LAYOUT_WIDE";

    // Title slide
    const titleSlide = pptx.addSlide();
    titleSlide.background = {
      fill: "1a3a5c",
    };
    titleSlide.addText("Linha do Tempo", {
      x: 0.5,
      y: 1.5,
      w: "90%",
      fontSize: 44,
      fontFace: "Arial",
      color: "FFFFFF",
      bold: true,
      align: "center",
    });
    titleSlide.addText("Congregação Cristã no Brasil", {
      x: 0.5,
      y: 3,
      w: "90%",
      fontSize: 24,
      fontFace: "Arial",
      color: "5BA3D9",
      align: "center",
    });

    // Timeline slide with all events
    const timelineSlide = pptx.addSlide();
    timelineSlide.background = { fill: "F5F8FC" };

    // Draw horizontal line
    timelineSlide.addShape(pptx.ShapeType.line, {
      x: 0.5,
      y: 3.75,
      w: 12.33,
      h: 0,
      line: { color: "2D5F8A", width: 3 },
    });

    const spacing = 12.33 / (events.length - 1);

    events.forEach((event, i) => {
      const x = 0.5 + i * spacing;
      const isAbove = i % 2 === 0;
      const yText = isAbove ? 1.2 : 4.3;

      // Dot
      timelineSlide.addShape(pptx.ShapeType.ellipse, {
        x: x - 0.1,
        y: 3.65,
        w: 0.2,
        h: 0.2,
        fill: { color: "2D8FCA" },
        line: { color: "1a3a5c", width: 1 },
      });

      // Year
      timelineSlide.addText(event.year, {
        x: x - 0.5,
        y: yText,
        w: 1.2,
        fontSize: 11,
        fontFace: "Arial",
        color: "2D8FCA",
        bold: true,
        align: "center",
      });

      // Title
      timelineSlide.addText(event.title, {
        x: x - 0.6,
        y: yText + 0.35,
        w: 1.4,
        fontSize: 9,
        fontFace: "Arial",
        color: "1a3a5c",
        bold: true,
        align: "center",
        wrap: true,
      });
    });

    // Individual slides for each event
    events.forEach((event) => {
      const slide = pptx.addSlide();
      slide.background = { fill: "FFFFFF" };

      // Left accent bar
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 0.15,
        h: "100%",
        fill: { color: "2D8FCA" },
      });

      slide.addText(event.year, {
        x: 0.8,
        y: 1.5,
        w: 4,
        fontSize: 48,
        fontFace: "Arial",
        color: "2D8FCA",
        bold: true,
      });

      slide.addText(event.title, {
        x: 0.8,
        y: 2.8,
        w: 10,
        fontSize: 28,
        fontFace: "Arial",
        color: "1a3a5c",
        bold: true,
      });

      slide.addText(event.description, {
        x: 0.8,
        y: 3.8,
        w: 10,
        fontSize: 16,
        fontFace: "Arial",
        color: "555555",
        wrap: true,
      });
    });

    pptx.writeFile({ fileName: "Linha_do_Tempo_CCB.pptx" });
  };

  return (
    <Button
      onClick={exportToPPT}
      className="gradient-ccb text-primary-foreground gap-2 px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
    >
      <Download className="h-4 w-4" />
      Exportar PPT
    </Button>
  );
};

export default ExportButton;
