import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const pageCounts = [5, 8, 10, 12, 15, 20, 25, 30, 40, 50];

interface PageCountSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const PageCountSelector = ({ value, onChange }: PageCountSelectorProps) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-muted-foreground">Quantidade de slides</label>
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className="glass-strong border-border/50 text-foreground">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {pageCounts.map((count) => (
          <SelectItem key={count} value={String(count)}>
            {count} slides
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default PageCountSelector;
