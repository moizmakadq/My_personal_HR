import MatchBreakdown from "@/components/screening/MatchBreakdown";
import SkillMatchVisual from "@/components/screening/SkillMatchVisual";
import RedFlagPanel from "@/components/screening/RedFlagPanel";
import VideoPreview from "@/components/screening/VideoPreview";
import StudentProfileView from "@/components/students/StudentProfileView";

export default function CandidateDetail({ application, student }) {
  if (!application || !student) return null;
  return (
    <div className="space-y-6">
      <StudentProfileView student={student} />
      <div className="grid gap-6 xl:grid-cols-2">
        <MatchBreakdown application={application} />
        <SkillMatchVisual application={application} />
        <RedFlagPanel flags={application.red_flags || []} />
        <VideoPreview src={student.video_url} />
      </div>
    </div>
  );
}
