/**
 * SlideEditor – Inline editing panel for slide content
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Check, X, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { GeneratedSlide } from "@/data/templates";

interface SlideEditorProps {
  slide: GeneratedSlide;
  index: number;
  onSave: (index: number, updated: GeneratedSlide) => void;
  language?: string;
}

const SlideEditor = ({ slide, index, onSave, language = "pt-BR" }: SlideEditorProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [title, setTitle] = useState(slide.title);
  const [content, setContent] = useState(slide.content.join("\n"));
  const [notes, setNotes] = useState(slide.notes || "");

  useEffect(() => {
    setTitle(slide.title);
    setContent(slide.content.join("\n"));
    setNotes(slide.notes || "");
  }, [slide]);

  const handleSave = () => {
    onSave(index, {
      ...slide,
      title,
      content: content.split("\n").filter((l) => l.trim()),
      notes: notes || undefined,
    });
    setIsEditing(false);
    toast({ title: "Slide atualizado", description: "Alteracoes salvas com sucesso." });
  };

  const handleCancel = () => {
    setTitle(slide.title);
    setContent(slide.content.join("\n"));
    setNotes(slide.notes || "");
    setIsEditing(false);
  };

  const handlePolish = async () => {
    setIsPolishing(true);
    try {
      const { data, error } = await supabase.functions.invoke("polish-slide", {
        body: { title: slide.title, content: slide.content, notes: slide.notes, language },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setTitle(data.title || slide.title);
      setContent((data.content || slide.content).join("\n"));
      setNotes(data.notes || slide.notes || "");
      toast({ title: "Slide aprimorado pela IA", description: "Revise e salve as alteracoes." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Erro ao aprimorar", description: err.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setIsPolishing(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-muted-foreground gap-1.5">
          <Pencil className="h-3.5 w-3.5" /> Editar
        </Button>
        <Button variant="ghost" size="sm" onClick={handlePolish} disabled={isPolishing} className="text-muted-foreground gap-1.5">
          {isPolishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
          {isPolishing ? "Aprimorando..." : "Aprimorar com IA"}
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-lg p-4 space-y-3"
    >
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Titulo</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-secondary border-border" />
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Conteudo (um topico por linha)</label>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} className="bg-secondary border-border resize-none" />
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Notas do apresentador</label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="bg-secondary border-border resize-none" />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={handleCancel} className="gap-1">
          <X className="h-3.5 w-3.5" /> Cancelar
        </Button>
        <Button variant="ghost" size="sm" onClick={handlePolish} disabled={isPolishing} className="gap-1 text-muted-foreground">
          {isPolishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
          IA
        </Button>
        <Button size="sm" onClick={handleSave} className="gradient-primary text-primary-foreground gap-1">
          <Check className="h-3.5 w-3.5" /> Salvar
        </Button>
      </div>
    </motion.div>
  );
};

export default SlideEditor;
