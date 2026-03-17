import Textarea from "@/components/ui/Textarea";

export default function JDInput({ value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Paste Job Description</label>
      <Textarea value={value} onChange={(event) => onChange?.(event.target.value)} className="min-h-[220px]" />
    </div>
  );
}
