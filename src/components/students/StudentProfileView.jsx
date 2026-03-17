import ParsedDataView from "@/components/students/ParsedDataView";
import SkillAuthenticityView from "@/components/students/SkillAuthenticityView";
import TrustScorePanel from "@/components/students/TrustScorePanel";

export default function StudentProfileView({ student, studentView = false }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <ParsedDataView student={student} />
      <div className="space-y-6">
        <TrustScorePanel student={student} studentView={studentView} />
        <SkillAuthenticityView student={student} />
      </div>
    </div>
  );
}
