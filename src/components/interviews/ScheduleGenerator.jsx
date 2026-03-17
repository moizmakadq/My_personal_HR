import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useDriveStore } from "@/store/driveStore";

export default function ScheduleGenerator({ driveId }) {
  const { generateSchedule } = useDriveStore();
  return (
    <Card className="flex items-center justify-between gap-4">
      <div>
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Generate Interview Schedule</h3>
        <p className="text-sm text-slate-500">Create balanced panel assignments with standby slots.</p>
      </div>
      <Button onClick={() => generateSchedule({ driveId })}>Generate</Button>
    </Card>
  );
}
