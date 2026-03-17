import { Camera, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function VideoUpload({ onVideoReady }) {
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => () => stream?.getTracks().forEach((track) => track.stop()), [stream]);

  const startRecording = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setStream(mediaStream);
    if (videoRef.current) videoRef.current.srcObject = mediaStream;
    chunksRef.current = [];
    recorderRef.current = new MediaRecorder(mediaStream);
    recorderRef.current.ondataavailable = (event) => chunksRef.current.push(event.data);
    recorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const file = new File([blob], `video-intro-${Date.now()}.webm`, { type: "video/webm" });
      onVideoReady?.(file, URL.createObjectURL(blob));
      mediaStream.getTracks().forEach((track) => track.stop());
      setStream(null);
    };
    recorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex gap-3">
          <Button type="button" onClick={recording ? stopRecording : startRecording}>
            <Camera className="h-4 w-4" />
            {recording ? "Stop Recording" : "Record New"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
          <input
            ref={inputRef}
            hidden
            type="file"
            accept="video/mp4,video/webm"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onVideoReady?.(file, URL.createObjectURL(file));
            }}
          />
        </div>
        {stream ? <video ref={videoRef} autoPlay muted className="w-full rounded-3xl" /> : null}
      </div>
    </Card>
  );
}
