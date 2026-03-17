import jsPDF from "jspdf";
import Papa from "papaparse";
import { formatDate, round } from "@/lib/utils";

export const generateDrivePdfReport = ({ drive, applications = [], slots = [], evaluations = [] }) => {
  const pdf = new jsPDF();
  pdf.setFontSize(20);
  pdf.text("PlaceRight Drive Report", 14, 18);
  pdf.setFontSize(12);
  pdf.text(`Drive: ${drive.title}`, 14, 30);
  pdf.text(`Date: ${formatDate(drive.drive_date)}`, 14, 38);
  pdf.text(`Company: ${drive.company_name || drive.company?.name || "N/A"}`, 14, 46);
  pdf.text(`Applications: ${applications.length}`, 14, 54);
  pdf.text(`Scheduled Interviews: ${slots.length}`, 14, 62);

  const selectedCount = evaluations.filter((item) => ["strong_select", "select"].includes(item.decision)).length;
  pdf.text(`Positive Decisions: ${selectedCount}`, 14, 70);

  pdf.text("Top Candidates", 14, 84);
  applications.slice(0, 5).forEach((application, index) => {
    pdf.text(
      `${index + 1}. ${application.student_name || application.student_id} - Match ${round(application.match_score)}`,
      18,
      94 + index * 8
    );
  });

  return pdf;
};

export const exportApplicationsCsv = (applications = []) =>
  Papa.unparse(
    applications.map((application) => ({
      student_id: application.student_id,
      student_name: application.student_name,
      match_score: application.match_score,
      trust_score: application.trust_score_at_application,
      screening_status: application.screening_status,
      final_status: application.final_status,
      probability: application.placement_probability
    }))
  );
