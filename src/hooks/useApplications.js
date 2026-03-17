import { useDriveStore } from "@/store/driveStore";

export const useApplications = () => {
  const { applications, applyToDrive, shortlistTopCandidates } = useDriveStore();
  return { applications, applyToDrive, shortlistTopCandidates };
};

export default useApplications;
