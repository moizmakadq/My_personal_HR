import toast from "react-hot-toast";
import Card from "@/components/ui/Card";
import VideoUpload from "@/components/common/VideoUpload";
import VideoPlayer from "@/components/common/VideoPlayer";
import { useStudentStore } from "@/store/studentStore";

export default function VideoIntro({ student }) {
  const { uploadVideo } = useStudentStore();

  return (
    <Card className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Video Introduction</h3>
        <p className="text-sm text-slate-500">Optional. Record in-browser or upload MP4/WebM up to 90 seconds.</p>
      </div>
      {student.video_url ? <VideoPlayer src={student.video_url} /> : null}
      <VideoUpload
        onVideoReady={(file, previewUrl) => {
          uploadVideo({
            studentId: student.id,
            videoUrl: previewUrl,
            uploadedAt: new Date().toISOString()
          });
          toast.success(`${file.name} attached to profile.`);
        }}
      />
    </Card>
  );
}
