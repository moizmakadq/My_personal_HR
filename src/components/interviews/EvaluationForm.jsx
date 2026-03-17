import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

const fields = [
  ["technical_score", "Technical"],
  ["problem_solving_score", "Problem Solving"],
  ["communication_score", "Communication"],
  ["project_depth_score", "Project Depth"],
  ["cultural_fit_score", "Cultural Fit"]
];

export default function EvaluationForm({ application, drive, onSubmit }) {
  const [values, setValues] = useState({
    technical_score: 7,
    problem_solving_score: 7,
    communication_score: 7,
    project_depth_score: 7,
    cultural_fit_score: 7,
    strengths: "",
    weaknesses: "",
    notes: "",
    decision: "select"
  });

  const weightedTotal = useMemo(() => {
    const weight = {
      technical_score: drive.weight_technical || 30,
      problem_solving_score: drive.weight_problem_solving || 25,
      communication_score: drive.weight_communication || 20,
      project_depth_score: drive.weight_project_depth || 15,
      cultural_fit_score: drive.weight_cultural_fit || 10
    };
    return (
      Object.entries(weight).reduce((sum, [key, currentWeight]) => sum + Number(values[key]) * currentWeight, 0) / 10
    );
  }, [drive, values]);

  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Evaluation</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map(([key, label]) => (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
            <Input type="number" min="1" max="10" value={values[key]} onChange={(event) => setValues((current) => ({ ...current, [key]: Number(event.target.value) }))} />
          </div>
        ))}
      </div>
      <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
        Weighted Total: {weightedTotal.toFixed(1)}/100
      </div>
      <Textarea placeholder="Strengths" value={values.strengths} onChange={(event) => setValues((current) => ({ ...current, strengths: event.target.value }))} />
      <Textarea placeholder="Weaknesses" value={values.weaknesses} onChange={(event) => setValues((current) => ({ ...current, weaknesses: event.target.value }))} />
      <Textarea placeholder="Notes" value={values.notes} onChange={(event) => setValues((current) => ({ ...current, notes: event.target.value }))} />
      <div className="flex flex-wrap gap-2">
        {["strong_select", "select", "waitlist", "reject"].map((decision) => (
          <button
            key={decision}
            onClick={() => setValues((current) => ({ ...current, decision }))}
            className={`rounded-2xl px-4 py-2 text-sm ${values.decision === decision ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200"}`}
          >
            {decision.replace("_", " ")}
          </button>
        ))}
      </div>
      <Button
        onClick={() =>
          onSubmit?.({
            ...application,
            ...values,
            weighted_total: weightedTotal,
            final_combined_score: (weightedTotal + application.match_score) / 2,
            actual_duration: drive.interview_duration || 20,
            created_at: new Date().toISOString()
          })
        }
      >
        Submit Evaluation
      </Button>
    </Card>
  );
}
