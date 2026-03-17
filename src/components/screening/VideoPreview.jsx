import Card from "@/components/ui/Card";
import VideoPlayer from "@/components/common/VideoPlayer";

export default function VideoPreview({ src }) {
  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Video Intro</h3>
      {src ? <VideoPlayer src={src} /> : <p className="text-sm text-slate-500">No video uploaded.</p>}
    </Card>
  );
}
