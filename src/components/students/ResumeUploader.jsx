import { useState } from "react";
import toast from "react-hot-toast";
import FileUpload from "@/components/common/FileUpload";
import Card from "@/components/ui/Card";
import { parseResumeFile } from "@/lib/resumeParser";
import { useStudentStore } from "@/store/studentStore";

export default function ResumeUploader({ student }) {
  const { replaceResume } = useStudentStore();
  const [parsing, setParsing] = useState(false);

  return (
    <Card className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Resume</h3>
        <p className="text-sm text-slate-500">
          Uploading a new resume replaces all parsed profile data. Students cannot edit parsed fields manually.
        </p>
      </div>
      <FileUpload
        accept=".pdf"
        label="Drag and drop a new resume"
        hint={parsing ? "Parsing resume..." : "PDF only, max 5 MB"}
        onFileSelect={async (file) => {
          try {
            setParsing(true);
            const parsed = await parseResumeFile(file);
            replaceResume({
              studentId: student.id,
              parsedData: parsed,
              resumeUrl: URL.createObjectURL(file),
              uploadedAt: new Date().toISOString()
            });
            toast.success("Resume parsed and profile rebuilt.");
          } catch (error) {
            toast.error(error.message || "Failed to parse resume.");
          } finally {
            setParsing(false);
          }
        }}
      />
    </Card>
  );
}
