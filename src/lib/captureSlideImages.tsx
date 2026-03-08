import { MotionConfig } from "framer-motion";
import { toPng } from "html-to-image";
import { createRoot } from "react-dom/client";
import { SlideLayout } from "@/components/slides/SlideLayouts";
import type { GeneratedPresentation } from "@/data/templates";

const CAPTURE_WIDTH = 1600;
const CAPTURE_HEIGHT = 900;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function createCaptureHost() {
  const host = document.createElement("div");
  host.setAttribute("data-slide-capture", "true");
  // Use visibility:hidden instead of off-screen positioning
  // This ensures the browser fully renders and paints the element
  host.style.position = "fixed";
  host.style.left = "0";
  host.style.top = "0";
  host.style.width = `${CAPTURE_WIDTH}px`;
  host.style.height = `${CAPTURE_HEIGHT}px`;
  host.style.overflow = "hidden";
  host.style.zIndex = "-9999";
  host.style.opacity = "0";
  host.style.pointerEvents = "none";
  document.body.appendChild(host);
  return host;
}

/** Check if a data URL is likely a blank/white image */
function isLikelyBlank(dataUrl: string): boolean {
  // A blank 1600x900 PNG at pixelRatio 2 would be very small
  // Real slide images with content are typically > 50KB
  const base64 = dataUrl.split(",")[1] || "";
  return base64.length < 5000; // ~3.7KB means likely blank
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
          <div
            style={{
              width: `${CAPTURE_WIDTH}px`,
              height: `${CAPTURE_HEIGHT}px`,
              fontSize: "16px",
              overflow: "hidden",
            }}
          >
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

      // Wait for fonts, then give browser time to paint
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      // More generous wait for rendering to complete
      await wait(300);

      // Try capture with retries
      let dataUrl = "";
      for (let attempt = 0; attempt < 3; attempt++) {
        dataUrl = await toPng(host, {
          cacheBust: true,
          pixelRatio: 2,
          width: CAPTURE_WIDTH,
          height: CAPTURE_HEIGHT,
          canvasWidth: CAPTURE_WIDTH * 2,
          canvasHeight: CAPTURE_HEIGHT * 2,
          skipAutoScale: true,
          
        });

        if (!isLikelyBlank(dataUrl)) break;

        console.warn(`Slide ${index + 1}: capture attempt ${attempt + 1} produced blank image, retrying...`);
        await wait(200);
      }

      if (isLikelyBlank(dataUrl)) {
        console.warn(`Slide ${index + 1}: all capture attempts produced blank image`);
      }

      images.push(dataUrl);
    } finally {
      root.unmount();
      host.remove();
    }
  }

  return images;
}
