import toast from "react-hot-toast";
import MainLayout from "@/components/layout/MainLayout";
import DriveForm from "@/components/drives/DriveForm";
import { useDriveStore } from "@/store/driveStore";

export default function CreateDrive() {
  const { runAutopilot } = useDriveStore();
  return (
    <MainLayout title="Create Drive" subtitle="Build manually or let Autopilot parse and configure the drive.">
      <DriveForm
        onSubmit={(payload) => {
          runAutopilot({ jdText: payload.jd_raw_text, baseDrive: payload });
          toast.success("Drive created and pre-screened.");
        }}
      />
    </MainLayout>
  );
}
