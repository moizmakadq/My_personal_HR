import Papa from "papaparse";
import toast from "react-hot-toast";
import Card from "@/components/ui/Card";
import FileUpload from "@/components/common/FileUpload";
import { useStudentStore } from "@/store/studentStore";

export default function BulkUpload() {
  const { bulkUploadStudents } = useStudentStore();

  return (
    <Card className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Bulk Upload Students</h3>
        <p className="text-sm text-slate-500">CSV columns: full_name, email, roll_number, department, branch.</p>
      </div>
      <FileUpload
        accept=".csv"
        label="Drop CSV here"
        onFileSelect={async (file) => {
          const content = await file.text();
          const parsed = Papa.parse(content, { header: true }).data;
          const students = parsed
            .filter((row) => row.full_name && row.email)
            .map((row, index) => ({
              id: `bulk-${Date.now()}-${index}`,
              profile_id: `bulk-profile-${Date.now()}-${index}`,
              full_name: row.full_name,
              parsed_name: row.full_name,
              email: row.email,
              parsed_email: row.email,
              parsed_phone: "",
              roll_number: row.roll_number,
              department: row.department || "CSE",
              branch: row.branch || row.department || "CSE",
              degree: "B.Tech",
              university: "National Unity University",
              cgpa: 0,
              tenth_percentage: 0,
              twelfth_percentage: 0,
              graduation_year: 2025,
              backlogs_current: 0,
              skills: [],
              skill_categories: {},
              resume_raw_text: "",
              resume_parsed_data: { education: {}, projects: [], experiences: [], certifications: [] },
              resume_url: "",
              resume_uploaded_at: "",
              video_url: "",
              video_uploaded_at: "",
              github_url: "",
              linkedin_url: "",
              portfolio_url: "",
              trust_score: 0,
              trust_breakdown: {},
              skill_authenticity: {},
              readiness_score: 0,
              percentile_overall: 0,
              percentile_skills: 0,
              percentile_projects: 0,
              percentile_experience: 0,
              placement_status: "unplaced",
              profile_completion: 20,
              profile_strength: 0
            }));
          bulkUploadStudents(students);
          toast.success(`${students.length} students imported.`);
        }}
      />
    </Card>
  );
}
