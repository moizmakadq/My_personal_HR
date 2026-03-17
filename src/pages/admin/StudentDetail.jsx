import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import StudentProfileView from "@/components/students/StudentProfileView";
import { useStudentStore } from "@/store/studentStore";

export default function StudentDetail() {
  const { studentId } = useParams();
  const { students } = useStudentStore();
  const student = students.find((item) => item.id === studentId) || students[0];

  return (
    <MainLayout title="Student Detail" subtitle="Read-only parsed profile with trust and authenticity evidence.">
      <StudentProfileView student={student} />
    </MainLayout>
  );
}
