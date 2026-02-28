/**
 * MockPreview: Visualização de como ficaria um slide usando a nova arquitetura
 * Este é um mock visual que mostra o resultado antes de implementar as mudanças
 */

import { useState } from "react";
import { motion } from "framer-motion";

// Mock de cores inspiradas nos templates reais da biblioteca
const mockColors = {
  primary: "#4F46E5", // Indigo
  secondary: "#1E1B4B", // Dark purple/black
  accent: "#06B6D4", // Cyan
};

// Mock de componentes visuais
const MockSlide = () => {
  return (
    <div className="relative w-full aspect-video bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl overflow-hidden shadow-2xl">
      {/* Elemento decorativo circular (gradiente) */}
      <div className="absolute -right-10 -top-10 w-64 h-64 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full opacity-20 blur-3xl" />
      <div className="absolute -left-10 bottom-0 w-48 h-48 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full opacity-20 blur-2xl" />
      
      {/* Barra decorativa superior com gradiente */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500" />
      
      {/* Conteúdo principal */}
      <div className="relative z-10 h-full flex flex-col p-10">
        {/* Ícone decorativo (svg) */}
        <motion.div 
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="w-20 h-20 mb-8 text-cyan-400"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M6 16.5v-1.5a3 3 0 013-3h8.25a3 3 0 013 3v1.5M6 16.5v2.25a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0024 18.75V9.75a2.25 2.25 0 00-2.25-2.25H15.75a2.25 2.25 0 00-2.25 2.25V12" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h.007v.007H9V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h.007v.007h-.007V9z" />
          </svg>
        </motion.div>
        
        {/* Título com efeito de gradiente */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
          style={{
            background: "linear-gradient(to right, #FFFFFF, #CFFAFE)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
        >
          Future of Technology
        </motion.h1>
        
        {/* Divider com gradiente */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "120px" }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="h-1.5 mb-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
        />
        
        {/* Subtítulo */}
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-cyan-100 max-w-2xl leading-relaxed"
        >
          Innovation is not just about creating new things - it's about creating value through technology
        </motion.p>
        
        {/* Cards em grid com efeito glassmorphism */}
        <div className="flex-1 mt-10 grid grid-cols-3 gap-4">
          {/* Card 1 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform" style={{ color: "#06B6D4" }}>
              📈
            </div>
            <div className="text-3xl font-bold text-white mb-1" style={{ color: "#06B6D4" }}>
              500+
            </div>
            <div className="text-xs text-cyan-200/70 uppercase tracking-wider">Clients</div>
          </motion.div>
          
          {/* Card 2 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform" style={{ color: "#8B5CF6" }}>
              🎯
            </div>
            <div className="text-3xl font-bold text-white mb-1" style={{ color: "#8B5CF6" }}>
              98%
            </div>
            <div className="text-xs text-purple-200/70 uppercase tracking-wider">Satisfaction</div>
          </motion.div>
          
          {/* Card 3 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform" style={{ color: "#EC4899" }}>
              ⚡
            </div>
            <div className="text-3xl font-bold text-white mb-1" style={{ color: "#EC4899" }}>
              24/7
            </div>
            <div className="text-xs text-pink-200/70 uppercase tracking-wider">Support</div>
          </motion.div>
        </div>
        
        {/* Bullet points com design moderno */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 space-y-3"
        >
          {[
            "Industry-leading technology stack",
            "Expert team with proven track record",
            "End-to-end solution delivery",
            "Customer-centric approach"
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#06B6D4" }} />
              <span className="text-cyan-50 text-sm md:text-base leading-relaxed">{item}</span>
            </div>
          ))}
        </motion.div>
        
        {/* Número do slide */}
        <div className="absolute bottom-6 right-6 text-white/20 font-mono text-sm">
          Slide 1 / 10
        </div>
      </div>
    </div>
  );
};

const MockPreview = () => {
  const [showComparison, setShowComparison] = useState(false);
  
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Mock Visual da Nova Arquitetura
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Simulação de como ficariam os slides usando a nova estrutura com componentes visuais ricos, 
            inspirados nos templates da sua biblioteca.
          </p>
          
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setShowComparison(false)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                !showComparison 
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30" 
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Visualização Moderna (Mock)
            </button>
            <button
              onClick={() => setShowComparison(true)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                showComparison 
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30" 
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Ver Comparação
            </button>
          </div>
        </div>
        
        {/* Slide Preview */}
        <div className="mb-16">
          <MockSlide />
        </div>
        
        {/* Componentes Disponíveis */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-8 rounded-full bg-gradient-to-b from-cyan-500 to-purple-600" />
              Componentes Visuais Ricos
            </h2>
            <ul className="space-y-3">
              {[
                "Card com glassmorphism (fundo semi-transparente + blur)",
                "Gradientes de texto (text-fill: transparent + gradient)",
                " Bordas arredondadas (border-radius)",
                "Efeitos de hover e transições suaves",
                "Ícones com escala ao passar o mouse",
                "Dividers com gradientes",
                "Grid de cards responsivo",
                "Space-y para espaçamento vertical"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-8 rounded-full bg-gradient-to-b from-purple-500 to-pink-600" />
              Layouts Implementados
            </h2>
            <ul className="space-y-3">
              {[
                "✅ Capa com título grande e gradiente",
                "✅ Cards em grid (3 colunas) com glassmorphism",
                "✅ Stats com números grandes e labels",
                "✅ Highlight box com barra lateral",
                "✅ Listas com bullets customizados",
                "✅ Dividers decorativos com gradientes",
                "✅ Elementos decorativos circulares",
                "✅ Número de slide elegante"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Comparação */}
        {showComparison && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Comparação: Antes vs Depois
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-red-400 mb-4">Antes (Velho Método)</h3>
                <div className="bg-white/5 rounded-lg p-6 text-left text-sm text-slate-400 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">●</span>
                    Só texto básico
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">●</span>
                    Barras decorativas simples
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">●</span>
                    Cores planas sem gradientes
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">●</span>
                    Layouts rígidos
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">●</span>
                    Sem efeitos visuais
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">●</span>
                    Fonte única (Arial)
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-green-400 mb-4">Depois (Novo Método)</h3>
                <div className="bg-white/5 rounded-lg p-6 text-left text-sm text-slate-400 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">●</span>
                    Cards com glassmorphism
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">●</span>
                    Gradientes em textos e bordas
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">●</span>
                    Efeitos de hover e transições
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">●</span>
                    Layouts flexíveis e modulares
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">●</span>
                    Ícones e elementos visuais ricos
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">●</span>
                    Fontes modernas (Poppins, etc.)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Próximos Passos */}
        <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Próximos Passos
          </h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Este mock mostra como ficariam os slides usando a nova arquitetura. 
            Se você gostar da direção, podemos proceed com a implementação real 
            usando o modelo PtDocument e a biblioteca pptxgenjs para exportação.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-600/20">
              Implementar Agora
            </button>
            <button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all border border-slate-700">
              Ajustar Design Primeiro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockPreview;
