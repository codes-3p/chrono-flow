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
    pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5

    const { template, slides } = presentation;
    const primaryHex = template.colors.primary.replace("#", "");
    const secondaryHex = template.colors.secondary.replace("#", "");
    const accentHex = template.colors.accent.replace("#", "");

    // Slide dimensions
    const W = 13.33;
    const H = 7.5;
    const padX = 0.8;
    const padY = 0.8;

    slides.forEach((slide, idx) => {
      const s = pptx.addSlide();
      const isCover = slide.layout === "title" || slide.layout === "closing";
      const isQuote = slide.layout === "quote";

      // ── Background ──
      if (isCover) {
        // Gradient background matching the web: linear-gradient(135deg, primary, secondary)
        s.background = {
          fill: { type: "solid", color: secondaryHex },
        } as any;
        // Overlay gradient via a full-slide shape
        s.addShape(pptx.ShapeType.rect, {
          x: 0, y: 0, w: W, h: H,
          fill: {
            type: "solid",
            color: primaryHex,
          },
          rectRadius: 0,
        });
        // Second layer for gradient effect (darker bottom-right)
        s.addShape(pptx.ShapeType.rect, {
          x: 0, y: 0, w: W, h: H,
          fill: {
            type: "solid",
            color: secondaryHex,
            alpha: 50,
          } as any,
        });
      } else {
        s.background = { fill: secondaryHex };
      }

      // ── Decorative accent glow (top-right) – mirrors the radial-gradient ──
      s.addShape(pptx.ShapeType.ellipse, {
        x: W * 0.55, y: -1,
        w: W * 0.5, h: H * 0.7,
        fill: { type: "solid", color: accentHex, alpha: 8 } as any,
      });

      if (isCover) {
        // ═══ TITLE / CLOSING slide ═══
        s.addText(slide.title, {
          x: 1.5, y: H * 0.3, w: W - 3, h: 1.5,
          fontSize: 40, fontFace: "Arial",
          color: "FFFFFF", bold: true,
          align: "center", valign: "middle",
          lineSpacingMultiple: 1.1,
        });

        if (slide.content.length > 0) {
          s.addText(slide.content[0], {
            x: 2.5, y: H * 0.3 + 1.8, w: W - 5, h: 0.8,
            fontSize: 18, fontFace: "Arial",
            color: "FFFFFF",
            transparency: 30,
            align: "center", valign: "top",
          });
        }
      } else if (isQuote) {
        // ═══ QUOTE slide ═══
        // Big quotation mark
        s.addText("\u201C", {
          x: W / 2 - 0.5, y: 1.5, w: 1, h: 1,
          fontSize: 72, fontFace: "Georgia",
          color: accentHex, align: "center",
        });

        s.addText(slide.title, {
          x: 2, y: 2.8, w: W - 4, h: 2,
          fontSize: 24, fontFace: "Arial",
          color: "FFFFFF",
          transparency: 10,
          italic: true, align: "center", valign: "middle",
          lineSpacingMultiple: 1.4,
        });

        if (slide.content.length > 0) {
          s.addText(`— ${slide.content[0]}`, {
            x: 2, y: 5.2, w: W - 4, h: 0.5,
            fontSize: 13, fontFace: "Arial",
            color: "FFFFFF",
            transparency: 50,
            align: "center",
          });
        }
      } else {
        // ═══ CONTENT / TWO-COLUMN slide ═══

        // Accent bar (matches the w-12 h-1 div)
        s.addShape(pptx.ShapeType.rect, {
          x: padX, y: padY,
          w: 1.0, h: 0.08,
          fill: { color: accentHex },
          rectRadius: 0.04,
        });

        // Title
        s.addText(slide.title, {
          x: padX, y: padY + 0.25, w: W - padX * 2, h: 0.7,
          fontSize: 26, fontFace: "Arial",
          color: "FFFFFF", bold: true,
          valign: "top",
        });

        // Content area
        const contentTop = padY + 1.3;
        const contentH = H - contentTop - 0.8;
        const isTwo = slide.layout === "two-column";
        const colCount = isTwo ? 2 : 1;
        const colW = isTwo ? (W - padX * 2 - 0.5) / 2 : W - padX * 2;
        const itemCount = slide.content.length;

        slide.content.forEach((item, i) => {
          let col: number, row: number;
          if (isTwo) {
            const perCol = Math.ceil(itemCount / 2);
            col = i < perCol ? 0 : 1;
            row = i < perCol ? i : i - perCol;
          } else {
            col = 0;
            row = i;
          }

          const itemH = Math.min(contentH / Math.ceil(itemCount / colCount), 0.65);
          const xBase = padX + col * (colW + 0.5);
          const yBase = contentTop + row * itemH;

          // Bullet dot
          s.addShape(pptx.ShapeType.ellipse, {
            x: xBase, y: yBase + 0.12,
            w: 0.12, h: 0.12,
            fill: { color: accentHex },
          });

          // Text
          s.addText(item, {
            x: xBase + 0.22, y: yBase,
            w: colW - 0.3, h: itemH,
            fontSize: 13, fontFace: "Arial",
            color: "FFFFFF",
            transparency: 20,
            valign: "top",
            lineSpacingMultiple: 1.2,
          });
        });
      }

      // ── Slide number (bottom-right) ──
      s.addText(`${idx + 1} / ${slides.length}`, {
        x: W - 1.5, y: H - 0.6, w: 1.2, h: 0.3,
        fontSize: 9, fontFace: "Consolas",
        color: "FFFFFF",
        transparency: 70,
        align: "right",
      });

      // ── Speaker notes ──
      if (slide.notes) s.addNotes(slide.notes);
    });

    const safeName = presentation.title
      .replace(/[^a-zA-Z0-9\u00C0-\u024F ]/g, "")
      .trim()
      .replace(/\s+/g, "_");
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
