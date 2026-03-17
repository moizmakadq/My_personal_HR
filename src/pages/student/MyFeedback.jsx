import MainLayout from "@/components/layout/MainLayout";
import FeedbackGenerator from "@/components/interviews/FeedbackGenerator";
import { useAuthStore } from "@/store/authStore";
import { useDriveStore } from "@/store/driveStore";
import { useStudentStore } from "@/store/studentStore";

export default function MyFeedback() {
  const { profile } = useAuthStore();
  const { getStudentByProfileId, students } = useStudentStore();
  const { studentFeedback } = useDriveStore();
  const student = getStudentByProfileId(profile?.id) || students[0];
  return (
    <MainLayout title="My Feedback" subtitle="Post-interview feedback generated from the evaluation record.">
      <FeedbackGenerator feedback={studentFeedback.filter((item) => item.student_id === student.id)} />
    </MainLayout>
  );
}
