import Card from "@/components/ui/Card";

export default function SuggestedQuestions({ questions = [] }) {
  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Suggested Questions</h3>
      <div className="space-y-3">
        {questions.map((question) => (
          <label key={question.id} className="flex gap-3 rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
            <input type="checkbox" className="mt-1" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{question.prompt}</p>
              <p className="text-sm text-slate-500">{question.purpose}</p>
            </div>
          </label>
        ))}
      </div>
    </Card>
  );
}
