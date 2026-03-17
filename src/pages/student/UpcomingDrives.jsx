import toast from "react-hot-toast";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useAuthStore } from "@/store/authStore";
import { useDriveStore } from "@/store/driveStore";
import { useStudentStore } from "@/store/studentStore";

export default function UpcomingDrives() {
  const { profile } = useAuthStore();
  const { getStudentByProfileId, students } = useStudentStore();
  const { drives, applications, applyToDrive } = useDriveStore();
  const student = getStudentByProfileId(profile?.id) || students[0];
  const liveDrives = drives.filter((drive) => ["upcoming", "screening"].includes(drive.status));

  return (
    <MainLayout title="Upcoming Drives" subtitle="See eligible drives, fit score, and probability before you apply.">
      <div className="grid gap-4">
        {liveDrives.map((drive) => {
          const application = applications.find((item) => item.drive_id === drive.id && item.student_id === student.id);
          return (
            <Card key={drive.id} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{drive.title}</h3>
                  <p className="text-sm text-slate-500">
                    {drive.job_location} | {drive.drive_date}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    if (application) return;
                    applyToDrive({ driveId: drive.id, studentId: student.id });
                    toast.success("Application submitted.");
                  }}
                >
                  {application ? "Applied" : "Apply"}
                </Button>
              </div>
              {application ? (
                <p className="text-sm text-slate-500">
                  Match {Math.round(application.match_score)}% | Probability {Math.round(application.placement_probability)}%
                </p>
              ) : (
                <p className="text-sm text-slate-500">Apply to see your personalized fit and placement probability.</p>
              )}
            </Card>
          );
        })}
      </div>
    </MainLayout>
  );
}
