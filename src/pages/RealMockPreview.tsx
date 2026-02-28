/**
 * RealMockPreview: Mock visual REAL usando os templates da biblioteca
 * Baseado em: Infographic - PPT Template e Milestones Slides
 */

import { useState } from "react";
import { motion } from "framer-motion";

// Cores REAIS extraídas dos templates
const infographicColors = {
  primary: "#4472C4", // Blue - accent1 (real da template)
  secondary: "#ED7D31", // Orange/Red - accent2 (real da template)
  accent: "#A5A5A5", // Gray - accent3 (real da template)
  bg: "#E7E6E6", // Light gray background (real da template)
};

const milestonesColors = {
  primary: "#9375BE", // Deep blue/purple
  secondary: "#FF5572", // Vibrant pink/red
  accent: "#00AABF", // Teal
  bg: "#FFFFFF", // White background
};

// Componente: Forma Orgânica (Freeform) - típico dos templates
const OrganicShape = ({ 
  position = "left", 
  gradient = "blue",
  className = "" 
}: { 
  position?: "left" | "right";
  gradient?: "blue" | "orange" | "purple";
  className?: string;
}) => {
  const gradientColors = {
    blue: "from-blue-500 via-blue-600 to-indigo-700",
    orange: "from-orange-400 via-red-500 to-pink-600",
    purple: "from-purple-500 via-pink-600 to-red-600",
  };
  
  // Forma orgânica estilo hand-drawn (curvas irregulares)
  return (
    <div 
      className={`absolute ${position === "left" ? "-left-10" : "-right-10"} top-20 w-64 h-48 rounded-bl-[100px] rounded-tr-[40px] rounded-br-[20px] ${className}`}
      style={{
        background: `linear-gradient(135deg, ${
          gradient === 'blue' ? '#3B82F6, #2563EB, #1E40AF' :
          gradient === 'orange' ? '#F97316, #EF4444, #EC4899' :
          '#9333EA, #EC4899, #DC2626'
        })`,
        clipPath: 'polygon(0% 0%, 30% 10%, 50% 0%, 70% 20%, 90% 40%, 100% 30%, 95% 60%, 80% 100%, 50% 90%, 20% 80%, 0% 60%)',
      }}
    >
      <div className="w-full h-full opacity-20 bg-white mix-blend-overlay" />
    </div>
  );
};

// Componente: Número Circular (Milestones)
const NumberedCircle = ({ 
  number, 
  color = "blue" 
}: { 
  number: number;
  color?: "blue" | "orange" | "purple";
}) => {
  const colors = {
    blue: "bg-blue-500 text-white",
    orange: "bg-orange-500 text-white",
    purple: "bg-purple-500 text-white",
  };
  
  return (
    <div className={`
      relative flex items-center justify-center w-24 h-24 rounded-full shadow-2xl
      ${colors[color]}
    `}>
      <span className="text-4xl font-bold">{number}</span>
      <div className="absolute inset-0 rounded-full border-4 border-white/20" />
    </div>
  );
};

// Componente: Top Accent Bar (barra superior típica dos templates)
const TopAccentBar = ({ color }: { color: string }) => (
  <div 
    className="absolute top-0 left-0 right-0 h-2"
    style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }}
  />
);

// Componente: Card com Glassmorphism (moderno)
const GlassCard = ({ 
  title, 
  subtitle, 
  gradient = "blue",
  delay = 0 
}: { 
  title: string;
  subtitle: string;
  gradient?: "blue" | "orange" | "purple";
  delay?: number;
}) => {
  const gradientClass = {
    blue: "from-blue-400 to-indigo-500",
    orange: "from-orange-400 to-red-500",
    purple: "from-purple-400 to-pink-500",
  };
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-colors shadow-lg"
    >
      <div className={`w-12 h-1 rounded-full mb-4 bg-gradient-to-r ${gradientClass[gradient]}`} />
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/80 text-sm leading-relaxed">{subtitle}</p>
    </motion.div>
  );
};

// SLIDE 1: Cover do Infographic Template (estilo real)
const InfographicCover = () => (
  <div className="relative w-full aspect-video bg-[#E7E6E6] rounded-xl overflow-hidden shadow-2xl">
    <TopAccentBar color={infographicColors.primary} />
    
    <div className="relative z-10 h-full flex items-center">
      {/* Forma orgânica azul à esquerda */}
      <OrganicShape position="left" gradient="blue" />
      
      {/* Forma orgânica laranja à direita */}
      <OrganicShape position="right" gradient="orange" className="opacity-80 scale-75" />
      
      {/* Conteúdo principal */}
      <div className="relative z-10 max-w-2xl mx-auto text-center px-12">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 mb-8 mx-auto bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold text-[#1F2937] mb-6"
          style={{ fontFamily: '"Albert Sans", "Poppins", sans-serif' }}
        >
          Future of Technology
        </motion.h1>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "160px" }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="h-1.5 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-400 via-cyan-500 to-purple-500"
        />
        
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[#374151] text-xl leading-relaxed"
          style={{ fontFamily: '"Albert Sans", "Poppins", sans-serif' }}
        >
          Innovation is not just about creating new things - it's about creating value through technology
        </motion.p>
        
        {/* Número do slide estilo template */}
        <div className="absolute bottom-8 right-8 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#E7E6E6] flex items-center justify-center bg-white shadow-lg">
            <span className="font-bold text-[#1F2937]">1</span>
          </div>
          <span className="text-[#1F2937] font-semibold">1 / 10</span>
        </div>
      </div>
    </div>
  </div>
);

// SLIDE 2: Milestones (estilo real)
const MilestonesSlide = () => (
  <div className="relative w-full aspect-video bg-[#FFFFFF] rounded-xl overflow-hidden shadow-2xl">
    <TopAccentBar color={milestonesColors.primary} />
    
    <div className="relative z-10 h-full flex flex-col px-16 pt-16">
      <div className="mb-12">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-[#1F2937] mb-4"
          style={{ fontFamily: '"Poppins", "Albert Sans", sans-serif' }}
        >
          Our Journey
        </motion.h2>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "120px" }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full"
        />
      </div>
      
      <div className="flex-1 flex gap-8 items-center">
        {/* Milestone 1 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-start gap-6"
        >
          <NumberedCircle number={1} color="blue" />
          <div>
            <h3 className="text-2xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Market Research
            </h3>
            <p className="text-[#4B5563] leading-relaxed">
              Comprehensive analysis of market trends and customer needs to establish foundation
            </p>
          </div>
        </motion.div>
        
        {/* Line connector */}
        <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-purple-300 to-pink-300" />
        
        {/* Milestone 2 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-start gap-6"
        >
          <NumberedCircle number={2} color="purple" />
          <div>
            <h3 className="text-2xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Product Development
            </h3>
            <p className="text-[#4B5563] leading-relaxed">
              Design and build innovative solutions based on research findings and requirements
            </p>
          </div>
        </motion.div>
        
        <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-pink-300 to-orange-300" />
        
        {/* Milestone 3 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-start gap-6"
        >
          <NumberedCircle number={3} color="orange" />
          <div>
            <h3 className="text-2xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Launch & Growth
            </h3>
            <p className="text-[#4B5563] leading-relaxed">
              Market entry strategy and continuous optimization for sustainable growth
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

// SLIDE 3: Infographic com Cards (estilo real)
const InfographicCards = () => (
  <div className="relative w-full aspect-video bg-[#E7E6E6] rounded-xl overflow-hidden shadow-2xl">
    <TopAccentBar color={infographicColors.primary} />
    
    <div className="relative z-10 h-full px-16 py-12 flex flex-col">
      <div className="mb-10">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-[#1F2937] mb-4 max-w-xl"
          style={{ fontFamily: '"Albert Sans", "Poppins", sans-serif' }}
        >
          Key Performance Indicators
        </motion.h2>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "140px" }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="h-1.5 mb-6 rounded-full bg-gradient-to-r from-blue-400 via-cyan-500 to-purple-500"
        />
        
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[#374151] text-lg leading-relaxed max-w-2xl"
        >
          Track and measure your success with these critical performance indicators
        </motion.p>
      </div>
      
      <div className="flex-1 flex items-center gap-8">
        {/* Forma orgânica decorativa */}
        <div 
          className="w-64 h-64 rounded-bl-[80px] rounded-tr-[50px]"
          style={{
            background: 'linear-gradient(135deg, #3B82F6, #2563EB, #1E40AF)',
            clipPath: 'polygon(0% 0%, 40% 10%, 60% 0%, 80% 30%, 100% 20%, 90% 70%, 70% 100%, 40% 90%, 20% 70%, 0% 50%)',
          }}
        />
        
        <div className="flex-1 grid grid-cols-2 gap-6">
          <GlassCard 
            title="500+" 
            subtitle="Active Clients" 
            gradient="blue"
            delay={0.4}
          />
          <GlassCard 
            title="98%" 
            subtitle="Satisfaction" 
            gradient="orange"
            delay={0.5}
          />
          <GlassCard 
            title="24/7" 
            subtitle="Support" 
            gradient="purple"
            delay={0.6}
          />
          <GlassCard 
            title="10+" 
            subtitle="Years Exp" 
            gradient="blue"
            delay={0.7}
          />
        </div>
      </div>
      
      {/* Número do slide */}
      <div className="absolute bottom-8 right-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#E7E6E6] flex items-center justify-center bg-white shadow-lg">
            <span className="font-bold text-[#1F2937]">3</span>
          </div>
          <span className="text-[#1F2937] font-semibold">3 / 10</span>
        </div>
      </div>
    </div>
  </div>
);

const RealMockPreview = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  
  const slides = [
    { component: <InfographicCover />, title: "Infographic Cover", template: "Infographic - PPT Template" },
    { component: <MilestonesSlide />, title: "Milestones", template: "Milestones Slides" },
    { component: <InfographicCards />, title: "Infographic Cards", template: "Infographic - PPT Template" },
  ];
  
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Mock Real baseado nos seus Templates
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">
            Esses slides usam as cores, formas e componentes REAIS extraídos dos 
            templates da sua biblioteca ("Infographic" e "Milestones").
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                showInfo 
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30" 
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {showInfo ? "Ocultar Informações" : "Ver Detalhes dos Templates"}
            </button>
          </div>
          
          {showInfo && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 max-w-3xl mx-auto text-left mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Templates Analisados:</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">Infographic Template</h4>
                  <ul className="text-sm text-slate-400 space-y-2">
                    <li>• Cores: Azul (#4472C4), Laranja (#ED7D31), Fundo Cinza (#E7E6E6)</li>
                    <li>• Formas: Orgânicas (freeform) com gradientes</li>
                    <li>• Fonte: Albert Sans / Poppins</li>
                    <li>• Layout: Assimétrico com formas em um lado</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">Milestones Template</h4>
                  <ul className="text-sm text-slate-400 space-y-2">
                    <li>• Cores: Roxo (#9375BE), Rosa (#FF5572), Teal (#00AABF)</li>
                    <li>• Elementos: Círculos numerados (bubbles)</li>
                    <li>• Fonte: Poppins</li>
                    <li>• Layout: Timeline com números circulares</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Slide Preview */}
        <div className="mb-16">
          <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-lg text-white">
            <span className="text-sm text-slate-400">Exemplo:</span>
            <span className="ml-2 font-semibold text-blue-400">{slides[activeSlide].template}</span>
          </div>
          
          {slides[activeSlide].component}
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveSlide(prev => prev === 0 ? slides.length - 1 : prev - 1)}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all border border-slate-700"
          >
            ← Anterior
          </button>
          
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`
                  w-3 h-3 rounded-full transition-all
                  ${activeSlide === i 
                    ? "w-8 bg-purple-500" 
                    : "bg-slate-600 hover:bg-slate-500"
                  }
                `}
              />
            ))}
          </div>
          
          <button
            onClick={() => setActiveSlide(prev => prev === slides.length - 1 ? 0 : prev + 1)}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all border border-slate-700"
          >
            Próximo →
          </button>
        </div>
        
        {/* Comparison Section */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Comparação: Velho vs Novo
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-950/50 rounded-lg p-6 border border-slate-800">
              <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                <div className="w-2 h-6 rounded-full bg-red-500" />
                Antes (Construtor Antigo)
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Só texto básico e barras simples
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Cores planas sem gradientes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Formas retangulares genéricas
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Layouts rígidos e genéricos
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Sem formas orgânicas ou gradientes
                </li>
              </ul>
            </div>
            
            <div className="bg-slate-950/50 rounded-lg p-6 border border-slate-800">
              <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                <div className="w-2 h-6 rounded-full bg-green-500" />
                Depois (Construtor Novo com seus Templates)
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  Formas orgânicas (freeform) com gradientes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  Cores REAIS dos seus templates
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  Círculos numerados estilo Milestones
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  Cards com glassmorphism moderno
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  Layouts inspirados nos templates reais
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            O que você acha?
          </h2>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Estes slides usam as cores, formas e componentes REAIS dos seus templates. 
            Se gostar desta direção, posso implementar o construtor real com exportação para PPTX.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-purple-600/20">
              Implementar Agora
            </button>
            <button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all border border-slate-700">
              Ajustar Detalhes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealMockPreview;
