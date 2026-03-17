import MainLayout from "@/components/layout/MainLayout";
import StudentProfileView from "@/components/students/StudentProfileView";
import { useAuthStore } from "@/store/authStore";
import { useStudentStore } from "@/store/studentStore";

export default function MyParsedProfile() {
  const { profile } = useAuthStore();
  const { getStudentByProfileId, students } = useStudentStore();
  const student = getStudentByProfileId(profile?.id) || students[0];

  return (
    <MainLayout title="My Parsed Profile" subtitle="Everything below is resume-derived and read-only.">
      <StudentProfileView student={student} studentView />
    </MainLayout>
  );
}
