export default function PDFViewer({ src }) {
  if (!src) {
    return <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">No resume uploaded yet.</div>;
  }
  return <iframe title="Resume PDF" src={src} className="h-[500px] w-full rounded-3xl border border-slate-200 dark:border-slate-800" />;
}
