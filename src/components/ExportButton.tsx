import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimelineEvent } from "@/data/timelineData";
import pptxgen from "pptxgenjs";

interface ExportButtonProps {
  events: TimelineEvent[];
}

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

const SLIDE_W = 13.33;
const SLIDE_H = 7.5;
const MARGIN_X = 0.4;
const LINE_Y = 3.75;

const ExportButton = ({ events }: ExportButtonProps) => {
  const exportToPPT = () => {
    const pptx = new pptxgen();
    pptx.layout = "LAYOUT_WIDE";

    // ── Title Slide ──
    const titleSlide = pptx.addSlide();
    titleSlide.background = { fill: COLORS.background };
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: "100%", h: 0.06,
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
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: 0, y: SLIDE_H - 0.06, w: "100%", h: 0.06,
      fill: { color: COLORS.blueLight },
    });

    // ── Timeline Slide — all events on one slide ──
    const usableW = SLIDE_W - MARGIN_X * 2;
    const n = events.length;
    const gap = 0.12;
    const cardW = (usableW - (n - 1) * gap) / n;
    const startX = MARGIN_X;

    const timelineSlide = pptx.addSlide();
    timelineSlide.background = { fill: COLORS.background };

    // Top accent
    timelineSlide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: "100%", h: 0.06,
      fill: { color: COLORS.blueLight },
    });

    // Title
    timelineSlide.addText("Linha do Tempo", {
      x: 0.5, y: 0.2, w: 6, fontSize: 18,
      fontFace: "Arial", color: COLORS.blueDark, bold: true,
    });
    timelineSlide.addText("Congregação Cristã no Brasil", {
      x: 0.5, y: 0.55, w: 6, fontSize: 10,
      fontFace: "Arial", color: COLORS.blueLight,
    });

    // Horizontal line across all events
    const lineStartX = startX + cardW / 2;
    const lineEndX = startX + (n - 1) * (cardW + gap) + cardW / 2;
    timelineSlide.addShape(pptx.ShapeType.line, {
      x: lineStartX, y: LINE_Y, w: lineEndX - lineStartX, h: 0,
      line: { color: COLORS.blueLight, width: 2 },
    });

    events.forEach((event, i) => {
      const cx = startX + i * (cardW + gap) + cardW / 2;
      const isAbove = i % 2 === 0;

      // Dot
      const dotSize = 0.16;
      timelineSlide.addShape(pptx.ShapeType.ellipse, {
        x: cx - dotSize / 2,
        y: LINE_Y - dotSize / 2,
        w: dotSize, h: dotSize,
        fill: { color: COLORS.blueLight },
        line: { color: COLORS.blueDark, width: 1.2 },
      });

      // Vertical connector
      const connH = 0.25;
      const connX = cx - 0.008;
      if (isAbove) {
        timelineSlide.addShape(pptx.ShapeType.line, {
          x: connX, y: LINE_Y - dotSize / 2 - connH,
          w: 0, h: connH,
          line: { color: COLORS.blueLight, width: 0.75 },
        });
      } else {
        timelineSlide.addShape(pptx.ShapeType.line, {
          x: connX, y: LINE_Y + dotSize / 2,
          w: 0, h: connH,
          line: { color: COLORS.blueLight, width: 0.75 },
        });
      }

      // Card position
      const cardX = startX + i * (cardW + gap);
      const cardH = 1.55;
      const cardY = isAbove
        ? LINE_Y - dotSize / 2 - connH - cardH
        : LINE_Y + dotSize / 2 + connH;

      // Accent bar on card top/bottom
      const accentH = 0.05;
      timelineSlide.addShape(pptx.ShapeType.rect, {
        x: cardX, y: isAbove ? cardY : cardY,
        w: cardW, h: accentH,
        fill: { color: COLORS.blueLight },
      });

      // Card background
      timelineSlide.addShape(pptx.ShapeType.roundRect, {
        x: cardX, y: cardY, w: cardW, h: cardH,
        fill: { color: COLORS.card },
        line: { color: COLORS.border, width: 0.5 },
        rectRadius: 0.06,
        shadow: {
          type: "outer", blur: 4, offset: 1.5,
          color: "000000", opacity: 0.06, angle: 270,
        },
      });

      // Year
      timelineSlide.addText(event.year, {
        x: cardX + 0.08, y: cardY + 0.08, w: cardW - 0.16,
        fontSize: 8, fontFace: "Arial",
        color: COLORS.blueLight, bold: true,
      });

      // Title
      timelineSlide.addText(event.title, {
        x: cardX + 0.08, y: cardY + 0.32, w: cardW - 0.16,
        fontSize: 7, fontFace: "Arial",
        color: COLORS.foreground, bold: true,
        wrap: true, lineSpacingMultiple: 1.05,
      });

      // Description
      timelineSlide.addText(event.description, {
        x: cardX + 0.08, y: cardY + 0.62, w: cardW - 0.16,
        fontSize: 5.5, fontFace: "Arial",
        color: COLORS.muted,
        wrap: true, lineSpacingMultiple: 1.1,
      });
    });

    // Bottom accent
    timelineSlide.addShape(pptx.ShapeType.rect, {
      x: 0, y: SLIDE_H - 0.06, w: "100%", h: 0.06,
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
