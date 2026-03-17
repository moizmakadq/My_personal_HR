import Card from "@/components/ui/Card";

export default function FeedbackGenerator({ feedback = [] }) {
  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Generated Feedback</h3>
      <div className="space-y-3">
        {feedback.map((item) => (
          <div key={item.id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="font-semibold text-slate-900 dark:text-white">{item.result}</p>
            <p className="text-sm text-slate-500">{item.summary}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
