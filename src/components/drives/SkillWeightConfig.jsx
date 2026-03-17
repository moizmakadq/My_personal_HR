import Slider from "@/components/ui/Slider";

const items = [
  ["technical", "Technical"],
  ["projectDepth", "Project Depth"],
  ["academic", "Academic"],
  ["experience", "Experience"],
  ["trust", "Trust"],
  ["authenticity", "Authenticity"]
];

export default function SkillWeightConfig({ weights, onChange }) {
  return (
    <div className="space-y-4">
      {items.map(([key, label]) => (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>{label}</span>
            <span>{weights[key]}%</span>
          </div>
          <Slider min={0} max={100} value={weights[key]} onChange={(event) => onChange(key, Number(event.target.value))} />
        </div>
      ))}
    </div>
  );
}
