import pptxgen from "pptxgenjs";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { GeneratedPresentation } from "@/data/templates";

interface PresentationExporterProps {
  presentation: GeneratedPresentation;
}

const PresentationExporter = ({ presentation }: PresentationExporterProps) => {
  const { toast } = useToast();

  const exportToPPTX = async () => {
    try {
      const pptx = new pptxgen();
      pptx.layout = "LAYOUT_WIDE";

      const { template, slides } = presentation;
      const primaryHex = template.colors.primary.replace("#", "");
      const secondaryHex = template.colors.secondary.replace("#", "");
      const accentHex = template.colors.accent.replace("#", "");

      const W = 13.33;
      const H = 7.5;
      const padX = 0.8;
      const padY = 0.8;

      slides.forEach((slide, idx) => {
        const s = pptx.addSlide();
        const isCover = slide.layout === "title" || slide.layout === "closing";
        const isQuote = slide.layout === "quote";
        const isStats = slide.layout === "stats";
        const isHighlight = slide.layout === "highlight";

        // Background
        s.background = { fill: secondaryHex };

        if (isCover) {
          s.addShape(pptx.ShapeType.rect, {
            x: 0, y: 0, w: W, h: H,
            fill: { color: primaryHex, transparency: 30 },
            line: { color: primaryHex, transparency: 100 },
          });
        }

        // Decorative glow
        s.addShape(pptx.ShapeType.ellipse, {
          x: W * 0.55, y: -1, w: W * 0.5, h: H * 0.7,
          fill: { color: accentHex, transparency: 90 },
          line: { color: accentHex, transparency: 100 },
        });

        // Bottom accent line
        s.addShape(pptx.ShapeType.rect, {
          x: 0, y: H - 0.06, w: W * 0.5, h: 0.06,
          fill: { color: accentHex, transparency: 40 },
          line: { color: accentHex, transparency: 100 },
        });

        if (isCover) {
          // ═══ TITLE / CLOSING ═══
          if (slide.icon) {
            s.addText(slide.icon, {
              x: W / 2 - 0.5, y: H * 0.18, w: 1, h: 0.8,
              fontSize: 48, align: "center",
            });
          }

          s.addText(slide.title, {
            x: 1.5, y: slide.icon ? H * 0.32 : H * 0.3, w: W - 3, h: 1.5,
            fontSize: 40, fontFace: "Arial",
            color: "FFFFFF", bold: true,
            align: "center", valign: "middle",
            lineSpacingMultiple: 1.1,
          });

          if (slide.content.length > 0) {
            s.addText(slide.content[0], {
              x: 2.5, y: (slide.icon ? H * 0.32 : H * 0.3) + 1.8, w: W - 5, h: 0.8,
              fontSize: 18, fontFace: "Arial",
              color: "FFFFFF", transparency: 30,
              align: "center", valign: "top",
            });
          }
        } else if (isQuote) {
          // ═══ QUOTE ═══
          s.addText("\u201C", {
            x: W / 2 - 0.5, y: 1.5, w: 1, h: 1,
            fontSize: 72, fontFace: "Georgia",
            color: accentHex, align: "center",
          });

          s.addText(slide.title, {
            x: 2, y: 2.8, w: W - 4, h: 2,
            fontSize: 24, fontFace: "Arial",
            color: "FFFFFF", transparency: 10,
            italic: true, align: "center", valign: "middle",
            lineSpacingMultiple: 1.4,
          });

          if (slide.content.length > 0) {
            s.addText(`\u2014 ${slide.content[0]}`, {
              x: 2, y: 5.2, w: W - 4, h: 0.5,
              fontSize: 13, fontFace: "Arial",
              color: accentHex, align: "center",
            });
          }
        } else if (isStats) {
          // ═══ STATS ═══
          // Icon + accent bar + title
          const titleY = padY;
          if (slide.icon) {
            s.addText(slide.icon, {
              x: padX, y: titleY, w: 0.5, h: 0.5, fontSize: 24,
            });
          }
          s.addShape(pptx.ShapeType.roundRect, {
            x: padX + (slide.icon ? 0.6 : 0), y: titleY + 0.15, w: 0.8, h: 0.08,
            fill: { color: accentHex }, rectRadius: 0.04,
            line: { color: accentHex, transparency: 100 },
          });
          s.addText(slide.title, {
            x: padX, y: titleY + 0.4, w: W - padX * 2, h: 0.6,
            fontSize: 24, fontFace: "Arial", color: "FFFFFF", bold: true,
          });

          // Stat cards
          const stats = slide.stats || [];
          const cardCount = stats.length || 1;
          const cardGap = 0.3;
          const cardW = (W - padX * 2 - (cardCount - 1) * cardGap) / cardCount;
          const cardH = 1.6;
          const cardY = 1.8;

          stats.forEach((stat, i) => {
            const cardX = padX + i * (cardW + cardGap);

            // Card background
            s.addShape(pptx.ShapeType.roundRect, {
              x: cardX, y: cardY, w: cardW, h: cardH,
              fill: { color: primaryHex, transparency: 50 },
              line: { color: "FFFFFF", transparency: 85 },
              rectRadius: 0.12,
            });

            // Stat icon
            if (stat.icon) {
              s.addText(stat.icon, {
                x: cardX, y: cardY + 0.15, w: cardW, h: 0.4,
                fontSize: 18, align: "center",
              });
            }

            // Stat value
            s.addText(stat.value, {
              x: cardX, y: cardY + (stat.icon ? 0.5 : 0.25), w: cardW, h: 0.6,
              fontSize: 28, fontFace: "Arial",
              color: accentHex, bold: true, align: "center",
            });

            // Stat label
            s.addText(stat.label, {
              x: cardX + 0.1, y: cardY + cardH - 0.45, w: cardW - 0.2, h: 0.35,
              fontSize: 10, fontFace: "Arial",
              color: "FFFFFF", transparency: 40,
              align: "center", valign: "top",
            });
          });

          // Supporting bullets
          const bulletY = cardY + cardH + 0.3;
          slide.content.forEach((item, i) => {
            s.addShape(pptx.ShapeType.ellipse, {
              x: padX, y: bulletY + i * 0.55 + 0.1, w: 0.1, h: 0.1,
              fill: { color: accentHex },
              line: { color: accentHex, transparency: 100 },
            });
            s.addText(item, {
              x: padX + 0.2, y: bulletY + i * 0.55, w: W - padX * 2 - 0.3, h: 0.5,
              fontSize: 12, fontFace: "Arial", color: "FFFFFF", transparency: 30,
            });
          });
        } else if (isHighlight) {
          // ═══ HIGHLIGHT ═══
          // Icon + accent bar + title
          if (slide.icon) {
            s.addText(slide.icon, {
              x: padX, y: padY, w: 0.5, h: 0.5, fontSize: 24,
            });
          }
          s.addShape(pptx.ShapeType.roundRect, {
            x: padX + (slide.icon ? 0.6 : 0), y: padY + 0.15, w: 0.8, h: 0.08,
            fill: { color: accentHex }, rectRadius: 0.04,
            line: { color: accentHex, transparency: 100 },
          });
          s.addText(slide.title, {
            x: padX, y: padY + 0.4, w: W - padX * 2, h: 0.6,
            fontSize: 24, fontFace: "Arial", color: "FFFFFF", bold: true,
          });

          // Highlight box
          if (slide.highlight) {
            const hlY = 1.8;
            const hlH = 1.4;

            // Left accent border
            s.addShape(pptx.ShapeType.rect, {
              x: padX, y: hlY, w: 0.06, h: hlH,
              fill: { color: accentHex },
              line: { color: accentHex, transparency: 100 },
            });

            // Background
            s.addShape(pptx.ShapeType.roundRect, {
              x: padX, y: hlY, w: W - padX * 2, h: hlH,
              fill: { color: primaryHex, transparency: 60 },
              line: { color: "FFFFFF", transparency: 90 },
              rectRadius: 0.12,
            });

            // Text
            s.addText(slide.highlight, {
              x: padX + 0.3, y: hlY + 0.2, w: W - padX * 2 - 0.6, h: hlH - 0.4,
              fontSize: 18, fontFace: "Arial",
              color: "FFFFFF", bold: true,
              valign: "middle", lineSpacingMultiple: 1.3,
            });

            // Bullets below
            const bulletY = hlY + hlH + 0.3;
            slide.content.forEach((item, i) => {
              s.addShape(pptx.ShapeType.ellipse, {
                x: padX, y: bulletY + i * 0.55 + 0.1, w: 0.12, h: 0.12,
                fill: { color: accentHex },
                line: { color: accentHex, transparency: 100 },
              });
              s.addText(item, {
                x: padX + 0.25, y: bulletY + i * 0.55, w: W - padX * 2 - 0.4, h: 0.5,
                fontSize: 13, fontFace: "Arial", color: "FFFFFF", transparency: 20,
                lineSpacingMultiple: 1.2,
              });
            });
          }
        } else {
          // ═══ CONTENT / TWO-COLUMN ═══
          // Icon + accent bar
          if (slide.icon) {
            s.addText(slide.icon, {
              x: padX, y: padY, w: 0.5, h: 0.5, fontSize: 24,
            });
          }
          s.addShape(pptx.ShapeType.roundRect, {
            x: padX + (slide.icon ? 0.6 : 0), y: padY + 0.15, w: 1, h: 0.08,
            fill: { color: accentHex }, rectRadius: 0.04,
            line: { color: accentHex, transparency: 100 },
          });
          s.addText(slide.title, {
            x: padX, y: padY + 0.4, w: W - padX * 2, h: 0.7,
            fontSize: 26, fontFace: "Arial", color: "FFFFFF", bold: true,
          });

          const contentTop = padY + 1.3;
          const contentH = H - contentTop - 0.8;
          const isTwo = slide.layout === "two-column";
          const colW = isTwo ? (W - padX * 2 - 0.5) / 2 : W - padX * 2;
          const itemCount = Math.max(slide.content.length, 1);

          slide.content.forEach((item, i) => {
            let col: number, row: number;
            if (isTwo) {
              const perCol = Math.ceil(itemCount / 2);
              col = i < perCol ? 0 : 1;
              row = i < perCol ? i : i - perCol;
            } else {
              col = 0; row = i;
            }

            const itemH = Math.min(contentH / Math.ceil(itemCount / (isTwo ? 2 : 1)), 0.65);
            const xBase = padX + col * (colW + 0.5);
            const yBase = contentTop + row * itemH;

            s.addShape(pptx.ShapeType.ellipse, {
              x: xBase, y: yBase + 0.12, w: 0.12, h: 0.12,
              fill: { color: accentHex },
              line: { color: accentHex, transparency: 100 },
            });
            s.addText(item, {
              x: xBase + 0.22, y: yBase, w: colW - 0.3, h: itemH,
              fontSize: 13, fontFace: "Arial", color: "FFFFFF", transparency: 20,
              valign: "top", lineSpacingMultiple: 1.2,
            });
          });
        }

        // Slide number
        s.addText(`${idx + 1} / ${slides.length}`, {
          x: W - 1.5, y: H - 0.5, w: 1.2, h: 0.3,
          fontSize: 9, fontFace: "Consolas",
          color: "FFFFFF", transparency: 70, align: "right",
        });

        if (slide.notes) s.addNotes(slide.notes);
      });

      const safeName = presentation.title
        .replace(/[^a-zA-Z0-9\u00C0-\u024F ]/g, "")
        .trim().replace(/\s+/g, "_");

      await pptx.writeFile({ fileName: `${safeName || "Apresentacao"}.pptx` });
      toast({ title: "Exportado!", description: "Arquivo PPTX baixado com sucesso." });
    } catch (err: any) {
      console.error("Export error:", err);
      toast({ title: "Erro na exportação", description: err?.message || "Falha ao gerar PPTX.", variant: "destructive" });
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
