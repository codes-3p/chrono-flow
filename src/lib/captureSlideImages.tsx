import { MotionConfig } from "framer-motion";
import { toPng } from "html-to-image";
import { createRoot } from "react-dom/client";
import { SlideLayout } from "@/components/slides/SlideLayouts";
import type { GeneratedPresentation } from "@/data/templates";

const CAPTURE_WIDTH = 1600;
const CAPTURE_HEIGHT = 900;

const waitForPaint = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function createCaptureHost() {
  const host = document.createElement("div");
  host.setAttribute("data-slide-capture", "true");
  host.style.position = "fixed";
  host.style.left = "-10000px";
  host.style.top = "0";
  host.style.width = `${CAPTURE_WIDTH}px`;
  host.style.height = `${CAPTURE_HEIGHT}px`;
  host.style.overflow = "hidden";
  host.style.zIndex = "-1";
  host.style.pointerEvents = "none";
  document.body.appendChild(host);
  return host;
}

export async function capturePresentationSlides(presentation: GeneratedPresentation): Promise<string[]> {
  const images: string[] = [];
  const total = presentation.slides.length;

  for (let index = 0; index < total; index += 1) {
    const slide = presentation.slides[index];
    const host = createCaptureHost();
    const root = createRoot(host);

    try {
      root.render(
        <MotionConfig reducedMotion="always">
          <div style={{ width: "100%", height: "100%", fontSize: "16px" }}>
            <SlideLayout
              slide={slide}
              template={presentation.template}
              index={index}
              total={total}
              presentationTitle={presentation.title}
              presentationSubtitle={presentation.subtitle}
            />
          </div>
        </MotionConfig>
      );

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      await waitForPaint();
      await wait(40);

      const dataUrl = await toPng(host, {
        cacheBust: true,
        pixelRatio: 2,
        skipAutoScale: true,
      });

      images.push(dataUrl);
    } finally {
      root.unmount();
      host.remove();
    }
  }

  return images;
}
