import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import JDInput from "@/components/drives/JDInput";
import JDPreview from "@/components/drives/JDPreview";
import JDQualityPanel from "@/components/drives/JDQualityPanel";
import { analyzeJDQuality } from "@/lib/jdQualityAnalyzer";
import { useDriveStore } from "@/store/driveStore";
import { useStudentStore } from "@/store/studentStore";

export default function AutopilotPanel() {
  const [jdText, setJdText] = useState("");
  const { students } = useStudentStore();
  const { runAutopilot, autopilotResult } = useDriveStore();
  const analysis = useMemo(() => analyzeJDQuality(jdText, students), [jdText, students]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="space-y-4">
        <div>
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Drive Autopilot</h3>
          <p className="text-sm text-slate-500">Paste a JD and generate parsing, screening, shortlist, and schedule in one run.</p>
        </div>
        <JDInput value={jdText} onChange={setJdText} />
        <Button
          onClick={() => {
            const result = runAutopilot({ jdText, baseDrive: { title: analysis.parsed.title, drive_date: new Date().toISOString().slice(0, 10) } });
            toast.success(`Autopilot shortlisted ${result.shortlisted.length} candidates.`);
          }}
        >
          Run Autopilot
        </Button>
        {autopilotResult ? (
          <div className="rounded-3xl border border-slate-200 p-4 text-sm dark:border-slate-800">
            <p>Eligible Students: {autopilotResult.summary.eligibleCount}</p>
            <p>Above 75%: {autopilotResult.summary.above75}</p>
            <p>Auto-shortlisted: {autopilotResult.summary.autoShortlisted}</p>
            <p>Schedule slots: {autopilotResult.schedule.length}</p>
          </div>
        ) : null}
      </Card>
      <div className="space-y-6">
        <JDPreview parsed={analysis.parsed} />
        <JDQualityPanel analysis={analysis} />
      </div>
    </div>
  );
}
