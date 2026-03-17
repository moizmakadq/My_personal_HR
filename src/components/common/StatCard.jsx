import Card from "@/components/ui/Card";

export default function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        {Icon ? <Icon className="h-5 w-5 text-brand-600" /> : null}
      </div>
      <div className="font-display text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
      {hint ? <p className="text-sm text-slate-500">{hint}</p> : null}
    </Card>
  );
}
