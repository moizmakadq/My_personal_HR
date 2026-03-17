import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import DriveDetailCard from "@/components/drives/DriveDetail";
import DriveTimeline from "@/components/drives/DriveTimeline";
import { useDriveStore } from "@/store/driveStore";

export default function DriveDetail() {
  const { driveId } = useParams();
  const { drives } = useDriveStore();
  const drive = drives.find((item) => item.id === driveId) || drives[0];

  return (
    <MainLayout title="Drive Detail" subtitle="Inspect drive configuration, quality, and progress.">
      <DriveDetailCard drive={drive} />
      <DriveTimeline drive={drive} />
    </MainLayout>
  );
}
