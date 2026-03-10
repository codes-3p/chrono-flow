export interface SlideTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  slideCount: number;
  icon: string;
  colors: { primary: string; secondary: string; accent: string };
  style: string;
}

export type TemplateCategory = "business" | "education" | "creative" | "tech" | "minimal";

export const templateCategories: { id: TemplateCategory; label: string; icon: string }[] = [
  { id: "business", label: "Negócios", icon: "Briefcase" },
  { id: "education", label: "Educação", icon: "GraduationCap" },
  { id: "creative", label: "Criativo", icon: "Palette" },
  { id: "tech", label: "Tecnologia", icon: "Cpu" },
  { id: "minimal", label: "Minimalista", icon: "Minus" },
];

export const slideTemplates: SlideTemplate[] = [
  {
    id: "pitch-deck",
    name: "Pitch Deck",
    category: "business",
    description: "Apresentação profissional para investidores e stakeholders",
    slideCount: 10,
    icon: "TrendingUp",
    colors: { primary: "#6C3AED", secondary: "#1E1B4B", accent: "#34D399" },
    style: "modern",
  },
  {
    id: "corporate-report",
    name: "Relatório Corporativo",
    category: "business",
    description: "Relatório executivo com dados e métricas",
    slideCount: 12,
    icon: "BarChart3",
    colors: { primary: "#0EA5E9", secondary: "#0F172A", accent: "#F59E0B" },
    style: "clean",
  },
  {
    id: "sales-proposal",
    name: "Proposta Comercial",
    category: "business",
    description: "Proposta persuasiva para fechar negócios",
    slideCount: 8,
    icon: "Target",
    colors: { primary: "#EF4444", secondary: "#1C1917", accent: "#FCD34D" },
    style: "bold",
  },
  {
    id: "workshop",
    name: "Workshop",
    category: "education",
    description: "Material didático para treinamentos e workshops",
    slideCount: 15,
    icon: "BookOpen",
    colors: { primary: "#8B5CF6", secondary: "#1E1B4B", accent: "#6EE7B7" },
    style: "friendly",
  },
  {
    id: "lecture",
    name: "Aula Expositiva",
    category: "education",
    description: "Slides estruturados para aulas e palestras",
    slideCount: 20,
    icon: "Presentation",
    colors: { primary: "#3B82F6", secondary: "#0F172A", accent: "#A78BFA" },
    style: "academic",
  },
  {
    id: "portfolio",
    name: "Portfólio",
    category: "creative",
    description: "Showcase visual de projetos e trabalhos",
    slideCount: 10,
    icon: "Image",
    colors: { primary: "#EC4899", secondary: "#1A1A2E", accent: "#38BDF8" },
    style: "artistic",
  },
  {
    id: "campaign",
    name: "Campanha Marketing",
    category: "creative",
    description: "Planejamento de campanhas e estratégias",
    slideCount: 12,
    icon: "Megaphone",
    colors: { primary: "#F97316", secondary: "#1C1917", accent: "#10B981" },
    style: "vibrant",
  },
  {
    id: "product-launch",
    name: "Lançamento de Produto",
    category: "tech",
    description: "Apresentação impactante de novos produtos",
    slideCount: 10,
    icon: "Rocket",
    colors: { primary: "#6366F1", secondary: "#0A0A1B", accent: "#22D3EE" },
    style: "futuristic",
  },
  {
    id: "tech-overview",
    name: "Overview Técnico",
    category: "tech",
    description: "Documentação técnica e arquitetura",
    slideCount: 14,
    icon: "Code2",
    colors: { primary: "#14B8A6", secondary: "#0F172A", accent: "#A855F7" },
    style: "technical",
  },
  {
    id: "zen",
    name: "Zen",
    category: "minimal",
    description: "Design limpo com foco no conteúdo",
    slideCount: 8,
    icon: "Sparkles",
    colors: { primary: "#64748B", secondary: "#0F0F0F", accent: "#E2E8F0" },
    style: "minimal",
  },
];

export interface StatItem {
  value: string;
  label: string;
  icon?: string;
}

export interface GeneratedSlide {
  title: string;
  content: string[];
  notes?: string;
  layout: "title" | "content" | "two-column" | "image" | "quote" | "closing" | "stats" | "highlight" | "process" | "comparison" | "bigNumber" | "iconGrid" | "threeColumn" | "roadmap" | "team" | "swot" | "pyramid";
  stats?: StatItem[];
  highlight?: string;
  icon?: string;
  /** Process layout: numbered steps */
  steps?: { step: string; description: string }[];
  /** Comparison layout */
  comparison?: { left: { title: string; points: string[] }; right: { title: string; points: string[] } };
  /** Big number layout */
  bigNumber?: { number: string; suffix?: string; context: string };
  /** Icon grid layout: features/services with icon+title+desc */
  gridItems?: { icon: string; title: string; description: string }[];
  /** Three column layout */
  columns?: { title: string; points: string[] }[];
  /** Roadmap/timeline layout */
  milestones?: { phase: string; title: string; description: string }[];
  /** Team layout */
  members?: { name: string; role: string; description: string }[];
  /** SWOT layout */
  swot?: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
  /** Pyramid layout */
  pyramidLevels?: { label: string; description: string }[];
}

export interface GeneratedPresentation {
  title: string;
  subtitle: string;
  slides: GeneratedSlide[];
  template: SlideTemplate;
}
