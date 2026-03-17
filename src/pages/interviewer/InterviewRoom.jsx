import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import CandidatePanel from "@/components/interviews/CandidatePanel";
import EvaluationForm from "@/components/interviews/EvaluationForm";
import InterviewTimer from "@/components/interviews/InterviewTimer";
import SuggestedQuestions from "@/components/interviews/SuggestedQuestions";
import MainLayout from "@/components/layout/MainLayout";
import { useDriveStore } from "@/store/driveStore";
import { useStudentStore } from "@/store/studentStore";

export default function InterviewRoom() {
  const navigate = useNavigate();
  const { slotId } = useParams();
  const { interviewSlots, applications, drives, submitEvaluation } = useDriveStore();
  const { students } = useStudentStore();

  const slot = interviewSlots.find((item) => item.id === slotId) || interviewSlots[0];
  const application = applications.find((item) => item.id === slot?.application_id);
  const student = students.find((item) => item.id === application?.student_id);
  const drive = drives.find((item) => item.id === slot?.drive_id);

  return (
    <MainLayout title="Interview Room" subtitle="Trust-aware interview guidance with structured evaluation.">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <CandidatePanel student={student} application={application} />
        </div>
        <div className="space-y-6">
          <InterviewTimer minutes={drive?.interview_duration || 20} />
          <SuggestedQuestions questions={application?.suggested_questions || []} />
          <EvaluationForm
            application={application}
            drive={drive}
            onSubmit={(evaluation) => {
              submitEvaluation({
                evaluation: {
                  ...evaluation,
                  id: `eval-${Date.now()}`,
                  drive_id: drive.id,
                  application_id: application.id,
                  student_id: student.id,
                  slot_id: slot.id,
                  interviewer_id: "profile-interviewer",
                  panel_number: slot.panel_number,
                  started_at: new Date().toISOString(),
                  completed_at: new Date().toISOString()
                }
              });
              toast.success("Evaluation submitted.");
              navigate("/interviewer/selection-board");
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
}
