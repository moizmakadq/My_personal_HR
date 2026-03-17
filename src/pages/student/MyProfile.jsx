import MainLayout from "@/components/layout/MainLayout";
import ResumeUploader from "@/components/students/ResumeUploader";
import StudentProfileView from "@/components/students/StudentProfileView";
import VideoIntro from "@/components/students/VideoIntro";
import { useAuthStore } from "@/store/authStore";
import { useStudentStore } from "@/store/studentStore";

export default function MyProfile() {
  const { profile } = useAuthStore();
  const { getStudentByProfileId, students } = useStudentStore();
  const student = getStudentByProfileId(profile?.id) || students[0];

  return (
    <MainLayout title="My Profile" subtitle="Upload a resume, upload a video, and review your read-only parsed profile.">
      <div className="grid gap-6 xl:grid-cols-2">
        <ResumeUploader student={student} />
        <VideoIntro student={student} />
      </div>
      <StudentProfileView student={student} studentView />
    </MainLayout>
  );
}
