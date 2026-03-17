import { useDriveStore } from "@/store/driveStore";

export const useInterviews = () => {
  const {
    interviewSlots,
    interviewEvaluations,
    interviewerMetrics,
    submitEvaluation,
    getSmartWaitlistRecommendation
  } = useDriveStore();

  return {
    interviewSlots,
    interviewEvaluations,
    interviewerMetrics,
    submitEvaluation,
    getSmartWaitlistRecommendation
  };
};

export default useInterviews;
