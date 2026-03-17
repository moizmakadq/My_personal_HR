import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function BulkShortlist({ onRun }) {
  return (
    <Card className="flex items-center justify-between gap-4">
      <div>
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Bulk Shortlist</h3>
        <p className="text-sm text-slate-500">Auto-shortlist the highest matching candidates for the active drive.</p>
      </div>
      <Button onClick={onRun}>Shortlist Top Candidates</Button>
    </Card>
  );
}
