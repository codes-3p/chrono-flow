import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimelineEvent } from "@/data/timelineData";
import pptxgen from "pptxgenjs";

interface ExportButtonProps {
  events: TimelineEvent[];
}

// Brand colors (matching CSS tokens)
const COLORS = {
  blueDark: "0E2A47",
  blue: "133A5C",
  blueLight: "1C8FBF",
  bluePale: "D6EDF8",
  background: "F5F8FC",
  card: "FFFFFF",
  foreground: "0F1C2E",
  muted: "5E6D7A",
  border: "D8DEE6",
  gold: "D4A843",
};

const CARD_W = 1.8;
const CARD_SPACING = 0.45;
const LINE_Y = 3.75;

const ExportButton = ({ events }: ExportButtonProps) => {
  const exportToPPT = () => {
    const pptx = new pptxgen();
    pptx.layout = "LAYOUT_WIDE";

    // ── Title Slide ──
    const titleSlide = pptx.addSlide();
    titleSlide.background = {
      fill: COLORS.background,
    };
    // Gradient accent bar at top
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: "100%", h: 0.08,
      fill: { color: COLORS.blueLight },
    });
    titleSlide.addText("Linha do Tempo", {
      x: 0.5, y: 2.2, w: "90%",
      fontSize: 48, fontFace: "Arial",
      color: COLORS.blueDark, bold: true, align: "center",
    });
    titleSlide.addText("Congregação Cristã no Brasil", {
      x: 0.5, y: 3.5, w: "90%",
      fontSize: 22, fontFace: "Arial",
      color: COLORS.blueLight, align: "center",
    });
    // Bottom accent bar
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 7.42, w: "100%", h: 0.08,
      fill: { color: COLORS.blueLight },
    });

    // ── Timeline Slide ──
    const totalWidth = events.length * CARD_W + (events.length - 1) * CARD_SPACING;
    const startX = (13.33 - totalWidth) / 2;

    const timelineSlide = pptx.addSlide();
    timelineSlide.background = { fill: COLORS.background };

    // Title
    timelineSlide.addText("Linha do Tempo", {
      x: 0.5, y: 0.3, w: 6, fontSize: 20,
      fontFace: "Arial", color: COLORS.blueDark, bold: true,
    });

    // Horizontal line
    const lineStartX = startX;
    const lineEndX = startX + totalWidth;
    timelineSlide.addShape(pptx.ShapeType.line, {
      x: lineStartX, y: LINE_Y, w: lineEndX - lineStartX, h: 0,
      line: { color: COLORS.blueLight, width: 2.5 },
    });

    events.forEach((event, i) => {
      const cx = startX + i * (CARD_W + CARD_SPACING) + CARD_W / 2;
      const isAbove = i % 2 === 0;

      // Dot on line
      const dotSize = 0.18;
      timelineSlide.addShape(pptx.ShapeType.ellipse, {
        x: cx - dotSize / 2,
        y: LINE_Y - dotSize / 2,
        w: dotSize, h: dotSize,
        fill: { color: COLORS.blueLight },
        line: { color: COLORS.blueDark, width: 1.5 },
      });

      // Vertical connector
      const connH = 0.35;
      const connX = cx - 0.01;
      if (isAbove) {
        timelineSlide.addShape(pptx.ShapeType.line, {
          x: connX, y: LINE_Y - connH - dotSize / 2,
          w: 0, h: connH,
          line: { color: COLORS.blueLight, width: 1 },
        });
      } else {
        timelineSlide.addShape(pptx.ShapeType.line, {
          x: connX, y: LINE_Y + dotSize / 2,
          w: 0, h: connH,
          line: { color: COLORS.blueLight, width: 1 },
        });
      }

      // Card
      const cardX = cx - CARD_W / 2;
      const cardH = 1.6;
      const cardY = isAbove
        ? LINE_Y - connH - dotSize / 2 - cardH
        : LINE_Y + dotSize / 2 + connH;

      // Card background (rounded rect)
      timelineSlide.addShape(pptx.ShapeType.roundRect, {
        x: cardX, y: cardY, w: CARD_W, h: cardH,
        fill: { color: COLORS.card },
        line: { color: COLORS.border, width: 0.75 },
        rectRadius: 0.1,
        shadow: {
          type: "outer", blur: 6, offset: 2,
          color: "000000", opacity: 0.08,
          angle: 270,
        },
      });

      // Year
      timelineSlide.addText(event.year, {
        x: cardX + 0.12, y: cardY + 0.1, w: CARD_W - 0.24,
        fontSize: 9, fontFace: "Arial",
        color: COLORS.blueLight, bold: true,
      });

      // Title
      timelineSlide.addText(event.title, {
        x: cardX + 0.12, y: cardY + 0.38, w: CARD_W - 0.24,
        fontSize: 8.5, fontFace: "Arial",
        color: COLORS.foreground, bold: true,
        wrap: true, lineSpacingMultiple: 1.1,
      });

      // Description
      timelineSlide.addText(event.description, {
        x: cardX + 0.12, y: cardY + 0.7, w: CARD_W - 0.24,
        fontSize: 7, fontFace: "Arial",
        color: COLORS.muted,
        wrap: true, lineSpacingMultiple: 1.15,
      });
    });

    // Bottom accent bar
    timelineSlide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 7.42, w: "100%", h: 0.08,
      fill: { color: COLORS.blueLight },
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
