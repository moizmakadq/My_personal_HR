import Card from "@/components/ui/Card";

export default function RedFlagPanel({ flags = [] }) {
  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Red Flags</h3>
      <div className="space-y-3">
        {flags.map((flag, index) => (
          <div key={`${flag.text}-${index}`} className="rounded-3xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-200">
            {flag.text}
          </div>
        ))}
      </div>
    </Card>
  );
}
