import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadZoneProps {
  accept: string;
  maxSizeMB?: number;
  description: string;
  onFile: (file: File) => void;
  file: File | null;
  onClear: () => void;
}

const FileUploadZone = ({ accept, maxSizeMB = 20, description, onFile, file, onClear }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f && f.size <= maxSizeMB * 1024 * 1024) {
        onFile(f);
      }
    },
    [onFile, maxSizeMB]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  };

  if (file) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong rounded-2xl p-6 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClear} className="text-muted-foreground">
          <X className="h-4 w-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`glass-strong rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 border-2 border-dashed ${
        isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border/50 hover:border-primary/40"
      }`}
    >
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      <Upload className={`h-10 w-10 mx-auto mb-4 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
      <p className="text-sm font-semibold text-foreground mb-1">Arraste e solte ou clique para selecionar</p>
      <p className="text-xs text-muted-foreground">{description}</p>
      <p className="text-xs text-muted-foreground mt-1">Máximo: {maxSizeMB} MB</p>
    </motion.div>
  );
};

export default FileUploadZone;
