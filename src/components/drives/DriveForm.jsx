import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import EligibilityConfig from "@/components/drives/EligibilityConfig";
import InterviewSetup from "@/components/drives/InterviewSetup";
import JDInput from "@/components/drives/JDInput";
import JDPreview from "@/components/drives/JDPreview";
import JDQualityPanel from "@/components/drives/JDQualityPanel";
import SkillWeightConfig from "@/components/drives/SkillWeightConfig";
import { analyzeJDQuality } from "@/lib/jdQualityAnalyzer";
import { useStudentStore } from "@/store/studentStore";

export default function DriveForm({ initialValue, onSubmit }) {
  const { students } = useStudentStore();
  const [form, setForm] = useState(
    initialValue || {
      title: "",
      drive_date: new Date().toISOString().slice(0, 10),
      jd_raw_text: "",
      min_cgpa: 6,
      min_tenth: 0,
      min_twelfth: 0,
      max_backlogs: 0,
      allowed_status: ["unplaced"],
      weights: { technical: 35, projectDepth: 20, academic: 15, experience: 10, trust: 10, authenticity: 10 },
      num_panels: 2,
      interview_duration: 20,
      buffer_minutes: 5,
      interview_start_time: "10:00",
      break_after_count: 4,
      break_duration: 15
    }
  );

  const analysis = useMemo(() => analyzeJDQuality(form.jd_raw_text, students), [form.jd_raw_text, students]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="space-y-5">
        <Input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Drive title" />
        <Input type="date" value={form.drive_date} onChange={(event) => setForm((current) => ({ ...current, drive_date: event.target.value }))} />
        <JDInput value={form.jd_raw_text} onChange={(value) => setForm((current) => ({ ...current, jd_raw_text: value }))} />
        <EligibilityConfig value={form} onChange={(key, value) => setForm((current) => ({ ...current, [key]: value }))} />
        <SkillWeightConfig weights={form.weights} onChange={(key, value) => setForm((current) => ({ ...current, weights: { ...current.weights, [key]: value } }))} />
        <InterviewSetup value={form} onChange={(key, value) => setForm((current) => ({ ...current, [key]: value }))} />
        <Button onClick={() => onSubmit?.({ ...form, ...analysis.parsed })}>Save Drive</Button>
      </Card>
      <div className="space-y-6">
        <JDPreview parsed={analysis.parsed} />
        <JDQualityPanel analysis={analysis} />
      </div>
    </div>
  );
}
