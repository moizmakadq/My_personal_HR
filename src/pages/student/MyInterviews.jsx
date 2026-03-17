import MainLayout from "@/components/layout/MainLayout";
import ScheduleView from "@/components/interviews/ScheduleView";
import { useAuthStore } from "@/store/authStore";
import { useDriveStore } from "@/store/driveStore";
import { useStudentStore } from "@/store/studentStore";

export default function MyInterviews() {
  const { profile } = useAuthStore();
  const { getStudentByProfileId, students } = useStudentStore();
  const { interviewSlots, applications } = useDriveStore();
  const student = getStudentByProfileId(profile?.id) || students[0];

  return (
    <MainLayout title="My Interviews" subtitle="See your slots, queue position, and room assignments.">
      <ScheduleView
        slots={interviewSlots.filter((slot) => slot.student_id === student.id)}
        applications={applications.filter((application) => application.student_id === student.id)}
      />
    </MainLayout>
  );
}
