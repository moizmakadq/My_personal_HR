import Input from "@/components/ui/Input";

export default function InterviewSetup({ value, onChange }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Input type="number" value={value.num_panels} onChange={(event) => onChange("num_panels", Number(event.target.value))} placeholder="Panels" />
      <Input type="number" value={value.interview_duration} onChange={(event) => onChange("interview_duration", Number(event.target.value))} placeholder="Duration" />
      <Input type="number" value={value.buffer_minutes} onChange={(event) => onChange("buffer_minutes", Number(event.target.value))} placeholder="Buffer" />
      <Input type="time" value={value.interview_start_time} onChange={(event) => onChange("interview_start_time", event.target.value)} />
      <Input type="number" value={value.break_after_count} onChange={(event) => onChange("break_after_count", Number(event.target.value))} placeholder="Break after" />
      <Input type="number" value={value.break_duration} onChange={(event) => onChange("break_duration", Number(event.target.value))} placeholder="Break duration" />
    </div>
  );
}
