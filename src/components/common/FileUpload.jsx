import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function FileUpload({
  accept = ".pdf",
  label = "Drag and drop a file here",
  hint = "Choose a file",
  onFileSelect
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (file) onFileSelect?.(file);
  };

  return (
    <Card
      className={`border-dashed transition ${dragging ? "border-brand-500 bg-brand-50/60 dark:bg-brand-900/10" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <UploadCloud className="h-8 w-8 text-brand-600" />
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{label}</p>
          <p className="text-sm text-slate-500">{hint}</p>
        </div>
        <input ref={inputRef} type="file" accept={accept} hidden onChange={(event) => handleFiles(event.target.files)} />
        <Button variant="secondary" onClick={() => inputRef.current?.click()}>
          Browse Files
        </Button>
      </div>
    </Card>
  );
}
