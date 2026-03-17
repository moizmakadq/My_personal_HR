import { useDriveStore } from "@/store/driveStore";
import { useStudentStore } from "@/store/studentStore";

export const useAnalytics = () => {
  const { drives, applications, interviewEvaluations, interviewerMetrics, plagiarismRecords } = useDriveStore();
  const { students } = useStudentStore();
  return { drives, applications, interviewEvaluations, interviewerMetrics, plagiarismRecords, students };
};

export default useAnalytics;
