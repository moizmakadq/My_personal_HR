import MainLayout from "@/components/layout/MainLayout";
import BulkUpload from "@/components/students/BulkUpload";
import StudentList from "@/components/students/StudentList";
import { useStudentStore } from "@/store/studentStore";

export default function ManageStudents() {
  const { students } = useStudentStore();
  return (
    <MainLayout title="Manage Students" subtitle="Review auto-built student profiles and import more records.">
      <BulkUpload />
      <StudentList students={students} />
    </MainLayout>
  );
}
