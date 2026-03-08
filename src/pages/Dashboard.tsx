import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Wand2, FileText, FileType, Code2, Sparkles, Layers, ArrowRight } from "lucide-react";

const creationCards = [
  {
    id: "ai",
    title: "Gerar com IA",
    description: "Digite um tema ou cole texto e deixe a IA criar slides profissionais",
    icon: Wand2,
    path: "/create/ai",
    gradient: "from-violet-600 to-purple-800",
    glow: "shadow-violet-500/20",
  },
  {
    id: "pdf",
    title: "PDF para Slides",
    description: "Envie um PDF e transforme o conteúdo em uma apresentação incrível",
    icon: FileText,
    path: "/create/file?type=pdf",
    gradient: "from-rose-500 to-pink-700",
    glow: "shadow-rose-500/20",
  },
  {
    id: "word",
    title: "Word para Slides",
    description: "Importe documentos .doc/.docx com estrutura de tópicos automática",
    icon: FileType,
    path: "/create/file?type=word",
    gradient: "from-blue-500 to-indigo-700",
    glow: "shadow-blue-500/20",
  },
  {
    id: "markdown",
    title: "Markdown para Slides",
    description: "Cole ou envie Markdown e a IA expande em slides completos",
    icon: Code2,
    path: "/create/file?type=markdown",
    gradient: "from-emerald-500 to-teal-700",
    glow: "shadow-emerald-500/20",
  },
  {
    id: "beautify",
    title: "Embelezar Slides",
    description: "Envie um PPTX existente e a IA redesenha com layouts profissionais",
    icon: Sparkles,
    path: "/create/beautify",
    gradient: "from-amber-500 to-orange-700",
    glow: "shadow-amber-500/20",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-surface">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 glass-strong">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
                <Layers className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold text-foreground">SlideAI</h1>
                <p className="text-[10px] text-muted-foreground -mt-0.5">Apresentações inteligentes</p>
              </div>
            </div>
          </div>
        </header>

        {/* Hero */}
        <main className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <Wand2 className="h-3.5 w-3.5" />
              Powered by AI
            </motion.div>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold">
              <span className="text-foreground">Crie apresentações</span>
              <br />
              <span className="text-gradient">incríveis em segundos</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
              Escolha como deseja começar — gere do zero com IA, importe arquivos ou melhore uma apresentação existente.
            </p>
          </motion.div>

          {/* Creation cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {creationCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  onClick={() => navigate(card.path)}
                  className={`group relative text-left p-6 rounded-2xl glass hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl ${card.glow}`}
                >
                  {/* Icon badge */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="font-display text-lg font-bold text-foreground mb-1.5">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{card.description}</p>

                  <div className="flex items-center gap-1.5 text-primary text-xs font-semibold group-hover:gap-2.5 transition-all">
                    Começar <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
