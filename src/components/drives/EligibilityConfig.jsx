import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function EligibilityConfig({ value, onChange }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Input type="number" step="0.1" value={value.min_cgpa} onChange={(event) => onChange("min_cgpa", Number(event.target.value))} placeholder="Minimum CGPA" />
      <Input type="number" value={value.max_backlogs} onChange={(event) => onChange("max_backlogs", Number(event.target.value))} placeholder="Max backlogs" />
      <Input type="number" value={value.min_tenth} onChange={(event) => onChange("min_tenth", Number(event.target.value))} placeholder="Min 10th %" />
      <Input type="number" value={value.min_twelfth} onChange={(event) => onChange("min_twelfth", Number(event.target.value))} placeholder="Min 12th %" />
      <Select value={value.allowed_status?.[0] || "unplaced"} onChange={(event) => onChange("allowed_status", [event.target.value])}>
        <option value="unplaced">Unplaced only</option>
        <option value="dream_eligible">Dream eligible</option>
        <option value="placed">Placed</option>
      </Select>
    </div>
  );
}
