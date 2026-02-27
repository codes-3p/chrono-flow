/**
 * Demo: Página para testar os novos componentes visuais modernos
 * Mostra exemplos de slides com cards, stats, highlights, etc.
 */

import { useState } from "react";
import SlidePreview from "@/components/SlidePreview";
import { PtDocument } from "@/lib/pptxModel";
import {
  buildModernCover,
  buildContentWithCards,
  buildStatsSlide,
  buildHighlightSlide,
} from "@/lib/components";

const demoColors = {
  primary: "6366F1", // Indigo
  secondary: "0A0A1B", // Dark blue/black
  accent: "22D3EE", // Cyan
};

// Criar documento de demonstração
const createDemoDocument = (): PtDocument => {
  return {
    slides: [
      // Slide 1: Cover Moderno
      buildModernCover(
        "Future of Technology",
        "Innovating tomorrow, today",
        demoColors
      ),
      // Slide 2: Conteúdo com Cards
      buildContentWithCards(
        "Key Solutions",
        [
          "Cloud Infrastructure Scalable and secure cloud solutions",
          "AI Integration Advanced machine learning capabilities",
          "Data Analytics Real-time insights and reporting",
          "Mobile First Native apps for iOS and Android",
          "Security First Enterprise-grade protection",
          "24/7 Support Dedicated team always available",
        ],
        demoColors
      ),
      // Slide 3: Stats
      buildStatsSlide(
        "Our Impact",
        [
          { value: "500+", label: "Clients Worldwide" },
          { value: "98%", label: "Customer Satisfaction" },
          { value: "24/7", label: "Support Available" },
          { value: "10+", label: "Years Experience" },
        ],
        demoColors
      ),
      // Slide 4: Highlight
      buildHighlightSlide(
        "Why Choose Us",
        "We deliver cutting-edge solutions that drive business growth and innovation",
        [
          "Industry-leading technology stack",
          "Experienced team of experts",
          "Proven track record of success",
          "Commitment to excellence",
        ],
        demoColors
      ),
    ],
  };
};

const ModernComponentsDemo = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [document] = useState<PtDocument>(createDemoDocument);
  
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          Novos Componentes Visuais
        </h1>
        <p className="text-gray-400 mb-8">
          Demonstração de slides modernos com cards, stats e highlights
        </p>
        
        {/* Slide principal */}
        <div className="mb-8">
          <SlidePreview
            document={document}
            template={{ colors: demoColors }}
            index={activeSlide}
            total={document.slides.length}
            isActive={true}
            onClick={() => {}}
          />
        </div>
        
        {/* Thumbnails */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {document.slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`
                flex-shrink-0 w-48 rounded-lg overflow-hidden border-2 transition-all
                ${activeSlide === i 
                  ? "border-purple-500 ring-2 ring-purple-500/50" 
                  : "border-gray-700 hover:border-gray-500"
                }
              `}
            >
              <SlidePreview
                document={document}
                template={{ colors: demoColors }}
                index={i}
                total={document.slides.length}
                isActive={activeSlide === i}
                onClick={() => setActiveSlide(i)}
              />
            </button>
          ))}
        </div>
        
        {/* Legenda */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Componentes disponíveis:</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• <code>buildModernCover()</code> - Capa com título centralizado e elementos decorativos</li>
            <li>• <code>buildContentWithCards()</code> - Slide com cards em grid</li>
            <li>• <code>buildStatsSlide()</code> - Slide com estatísticas em cards</li>
            <li>• <code>buildHighlightSlide()</code> - Slide com caixa de destaque</li>
            <li>• <code>createCard()</code> - Card individual</li>
            <li>• <code>createStatCard()</code> - Card de estatística</li>
            <li>• <code>createHighlightBox()</code> - Caixa de destaque</li>
            <li>• <code>createBulletList()</code> - Lista com bullets</li>
            <li>• <code>createGradientBox()</code> - Barra com gradiente</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModernComponentsDemo;
