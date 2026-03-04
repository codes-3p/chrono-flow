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
        const isProcess = slide.layout === "process";
        const isComparison = slide.layout === "comparison";
        const isBigNumber = slide.layout === "bigNumber";

        // Background
        s.background = { fill: secondaryHex };

        const content = slide.content || [];

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

        // Progress bar at top
        s.addShape(pptx.ShapeType.rect, {
          x: 0, y: 0, w: W * ((idx + 1) / slides.length), h: 0.04,
          fill: { color: accentHex },
          line: { color: accentHex, transparency: 100 },
        });

        if (isCover) {
          // ═══ TITLE / CLOSING ═══
          if (slide.icon) {
            s.addText(slide.icon, {
              x: W / 2 - 0.5, y: H * 0.15, w: 1, h: 1,
              fontSize: 54, align: "center",
            });
          }
          s.addText(slide.title, {
            x: 1.5, y: slide.icon ? H * 0.32 : H * 0.28, w: W - 3, h: 1.8,
            fontSize: 42, fontFace: "Arial",
            color: "FFFFFF", bold: true,
            align: "center", valign: "middle",
            lineSpacingMultiple: 1.1,
          });
          // Divider line
          s.addShape(pptx.ShapeType.rect, {
            x: W / 2 - 1, y: (slide.icon ? H * 0.32 : H * 0.28) + 2, w: 2, h: 0.06,
            fill: { color: accentHex },
            line: { color: accentHex, transparency: 100 },
          });
          if (content.length > 0) {
            s.addText(content[0], {
              x: 2.5, y: (slide.icon ? H * 0.32 : H * 0.28) + 2.3, w: W - 5, h: 0.8,
              fontSize: 18, fontFace: "Arial",
              color: "FFFFFF", transparency: 40,
              align: "center", valign: "top",
            });
          }

        } else if (isBigNumber) {
          // ═══ BIG NUMBER ═══
          if (slide.icon) {
            s.addText(slide.icon, {
              x: W / 2 - 0.4, y: 1.2, w: 0.8, h: 0.8,
              fontSize: 30, align: "center",
            });
          }
          s.addText(slide.title, {
            x: 2, y: slide.icon ? 2.1 : 1.5, w: W - 4, h: 0.6,
            fontSize: 14, fontFace: "Arial",
            color: "FFFFFF", transparency: 50,
            align: "center", bold: true,
          });
          const bigNum = slide.bigNumber?.number || content[0] || "";
          const suffix = slide.bigNumber?.suffix || "";
          s.addText([
            { text: bigNum, options: { fontSize: 72, bold: true, color: accentHex } },
            ...(suffix ? [{ text: ` ${suffix}`, options: { fontSize: 32, color: "FFFFFF", transparency: 40 } }] : []),
          ], {
            x: 1, y: H * 0.3, w: W - 2, h: 2,
            align: "center", valign: "middle",
            fontFace: "Arial",
          });
          // Divider
          s.addShape(pptx.ShapeType.rect, {
            x: W / 2 - 0.8, y: H * 0.3 + 2.2, w: 1.6, h: 0.04,
            fill: { color: accentHex, transparency: 40 },
            line: { color: accentHex, transparency: 100 },
          });
          const context = slide.bigNumber?.context || content[1] || "";
          if (context) {
            s.addText(context, {
              x: 2.5, y: H * 0.3 + 2.5, w: W - 5, h: 0.8,
              fontSize: 14, fontFace: "Arial",
              color: "FFFFFF", transparency: 50,
              align: "center",
            });
          }

        } else if (isQuote) {
          // ═══ QUOTE ═══
          s.addText("\u201C", {
            x: W / 2 - 0.5, y: 1.2, w: 1, h: 1,
            fontSize: 80, fontFace: "Georgia",
            color: accentHex, align: "center",
          });
          s.addText(slide.title, {
            x: 2, y: 2.5, w: W - 4, h: 2.5,
            fontSize: 24, fontFace: "Arial",
            color: "FFFFFF", transparency: 10,
            italic: true, align: "center", valign: "middle",
            lineSpacingMultiple: 1.4,
          });
          if (content.length > 0) {
            // Decorative lines around attribution
            s.addShape(pptx.ShapeType.rect, {
              x: W / 2 - 2, y: 5.4, w: 0.6, h: 0.02,
              fill: { color: accentHex },
              line: { color: accentHex, transparency: 100 },
            });
            s.addText(content[0], {
              x: W / 2 - 1.2, y: 5.2, w: 2.4, h: 0.5,
              fontSize: 13, fontFace: "Arial",
              color: accentHex, align: "center", bold: true,
            });
            s.addShape(pptx.ShapeType.rect, {
              x: W / 2 + 1.4, y: 5.4, w: 0.6, h: 0.02,
              fill: { color: accentHex },
              line: { color: accentHex, transparency: 100 },
            });
          }

        } else if (isStats) {
          // ═══ STATS ═══
          addSlideHeader(s, pptx, slide, padX, padY, accentHex, W);

          const stats = slide.stats || [];
          const cardCount = Math.max(stats.length, 1);
          const cardGap = 0.3;
          const cardW = (W - padX * 2 - (cardCount - 1) * cardGap) / cardCount;
          const cardH = 1.8;
          const cardY = 2.0;

          stats.forEach((stat, i) => {
            const cardX = padX + i * (cardW + cardGap);
            // Card bg
            s.addShape(pptx.ShapeType.roundRect, {
              x: cardX, y: cardY, w: cardW, h: cardH,
              fill: { color: primaryHex, transparency: 50 },
              line: { color: "FFFFFF", transparency: 85 },
              rectRadius: 0.12,
            });
            // Card top accent
            s.addShape(pptx.ShapeType.rect, {
              x: cardX, y: cardY, w: cardW, h: 0.04,
              fill: { color: accentHex },
              line: { color: accentHex, transparency: 100 },
            });
            if (stat.icon) {
              s.addText(stat.icon, {
                x: cardX, y: cardY + 0.15, w: cardW, h: 0.5,
                fontSize: 22, align: "center",
              });
            }
            s.addText(stat.value, {
              x: cardX, y: cardY + (stat.icon ? 0.6 : 0.3), w: cardW, h: 0.6,
              fontSize: 30, fontFace: "Arial",
              color: accentHex, bold: true, align: "center",
            });
            s.addText(stat.label, {
              x: cardX + 0.1, y: cardY + cardH - 0.5, w: cardW - 0.2, h: 0.4,
              fontSize: 9, fontFace: "Arial",
              color: "FFFFFF", transparency: 50,
              align: "center", valign: "top",
            });
          });

          addBullets(s, pptx, content, padX, cardY + cardH + 0.3, W, accentHex);

        } else if (isHighlight) {
          // ═══ HIGHLIGHT ═══
          addSlideHeader(s, pptx, slide, padX, padY, accentHex, W);

          if (slide.highlight) {
            const hlY = 2.0;
            const hlH = 1.6;
            // Left accent
            s.addShape(pptx.ShapeType.rect, {
              x: padX, y: hlY, w: 0.06, h: hlH,
              fill: { color: accentHex },
              line: { color: accentHex, transparency: 100 },
            });
            // Bg
            s.addShape(pptx.ShapeType.roundRect, {
              x: padX, y: hlY, w: W - padX * 2, h: hlH,
              fill: { color: primaryHex, transparency: 60 },
              line: { color: "FFFFFF", transparency: 90 },
              rectRadius: 0.12,
            });
            s.addText(slide.highlight, {
              x: padX + 0.4, y: hlY + 0.2, w: W - padX * 2 - 0.8, h: hlH - 0.4,
              fontSize: 18, fontFace: "Arial",
              color: "FFFFFF", bold: true,
              valign: "middle", lineSpacingMultiple: 1.3,
            });

            addBullets(s, pptx, content, padX, hlY + hlH + 0.3, W, accentHex);
          }

        } else if (isProcess) {
          // ═══ PROCESS ═══
          addSlideHeader(s, pptx, slide, padX, padY, accentHex, W);

          const steps = slide.steps || [];
          const stepCount = Math.max(steps.length, 1);
          const stepGap = 0.25;
          const stepW = (W - padX * 2 - (stepCount - 1) * stepGap) / stepCount;
          const stepH = 2.8;
          const stepY = 2.0;

          steps.forEach((step, i) => {
            const stepX = padX + i * (stepW + stepGap);
            // Card
            s.addShape(pptx.ShapeType.roundRect, {
              x: stepX, y: stepY, w: stepW, h: stepH,
              fill: { color: primaryHex, transparency: 60 },
              line: { color: "FFFFFF", transparency: 85 },
              rectRadius: 0.12,
            });
            // Step number badge
            s.addShape(pptx.ShapeType.roundRect, {
              x: stepX + 0.15, y: stepY + 0.15, w: 0.5, h: 0.5,
              fill: { color: accentHex },
              rectRadius: 0.08,
              line: { color: accentHex, transparency: 100 },
            });
            s.addText(`${i + 1}`, {
              x: stepX + 0.15, y: stepY + 0.15, w: 0.5, h: 0.5,
              fontSize: 16, fontFace: "Arial",
              color: secondaryHex, bold: true, align: "center", valign: "middle",
            });
            // Step title
            s.addText(step.step, {
              x: stepX + 0.15, y: stepY + 0.8, w: stepW - 0.3, h: 0.5,
              fontSize: 12, fontFace: "Arial",
              color: "FFFFFF", bold: true, valign: "top",
            });
            // Step description
            s.addText(step.description, {
              x: stepX + 0.15, y: stepY + 1.4, w: stepW - 0.3, h: stepH - 1.7,
              fontSize: 10, fontFace: "Arial",
              color: "FFFFFF", transparency: 50,
              valign: "top", lineSpacingMultiple: 1.3,
            });
            // Connector arrow
            if (i < stepCount - 1) {
              s.addText("→", {
                x: stepX + stepW, y: stepY + stepH / 2 - 0.2, w: stepGap, h: 0.4,
                fontSize: 16, color: accentHex, align: "center", valign: "middle",
              });
            }
          });

        } else if (isComparison) {
          // ═══ COMPARISON ═══
          addSlideHeader(s, pptx, slide, padX, padY, accentHex, W);

          const colGap = 0.4;
          const colW = (W - padX * 2 - colGap) / 2;
          const colY = 2.0;
          const colH = H - colY - 1;

          [slide.comparison?.left, slide.comparison?.right].forEach((side, sideIdx) => {
            if (!side) return;
            const colX = padX + sideIdx * (colW + colGap);

            // Card bg
            s.addShape(pptx.ShapeType.roundRect, {
              x: colX, y: colY, w: colW, h: colH,
              fill: { color: primaryHex, transparency: 60 },
              line: { color: "FFFFFF", transparency: 85 },
              rectRadius: 0.12,
            });
            // Top accent
            s.addShape(pptx.ShapeType.rect, {
              x: colX, y: colY, w: colW, h: 0.06,
              fill: { color: accentHex, transparency: sideIdx === 0 ? 0 : 40 },
              line: { color: accentHex, transparency: 100 },
            });
            // Column title
            s.addText(side.title, {
              x: colX + 0.3, y: colY + 0.2, w: colW - 0.6, h: 0.5,
              fontSize: 16, fontFace: "Arial",
              color: "FFFFFF", bold: true,
            });
            // Points
            (side.points || []).forEach((point, pi) => {
              const py = colY + 0.9 + pi * 0.55;
              s.addShape(pptx.ShapeType.ellipse, {
                x: colX + 0.3, y: py + 0.12, w: 0.08, h: 0.08,
                fill: { color: accentHex },
                line: { color: accentHex, transparency: 100 },
              });
              s.addText(point, {
                x: colX + 0.5, y: py, w: colW - 0.8, h: 0.5,
                fontSize: 11, fontFace: "Arial",
                color: "FFFFFF", transparency: 30,
                valign: "top",
              });
            });
          });

        } else {
          // ═══ CONTENT / TWO-COLUMN ═══
          addSlideHeader(s, pptx, slide, padX, padY, accentHex, W);

          const contentTop = padY + 1.3;
          const isTwo = slide.layout === "two-column";
          const colW = isTwo ? (W - padX * 2 - 0.5) / 2 : W - padX * 2;
          const itemCount = Math.max(content.length, 1);

          content.forEach((item, i) => {
            let col: number, row: number;
            if (isTwo) {
              const perCol = Math.ceil(itemCount / 2);
              col = i < perCol ? 0 : 1;
              row = i < perCol ? i : i - perCol;
            } else {
              col = 0; row = i;
            }
            const itemH = 0.6;
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

/* ── Helper Functions ── */

function addSlideHeader(
  s: any, pptx: any, slide: any,
  padX: number, padY: number, accentHex: string, W: number
) {
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
}

function addBullets(
  s: any, pptx: any, items: string[],
  padX: number, startY: number, W: number, accentHex: string
) {
  (items || []).forEach((item, i) => {
    s.addShape(pptx.ShapeType.ellipse, {
      x: padX, y: startY + i * 0.55 + 0.1, w: 0.1, h: 0.1,
      fill: { color: accentHex },
      line: { color: accentHex, transparency: 100 },
    });
    s.addText(item, {
      x: padX + 0.2, y: startY + i * 0.55, w: W - padX * 2 - 0.3, h: 0.5,
      fontSize: 12, fontFace: "Arial", color: "FFFFFF", transparency: 30,
    });
  });
}

export default PresentationExporter;
