export default function VideoPlayer({ src, className = "w-full rounded-3xl" }) {
  if (!src) return null;
  return <video src={src} controls className={className} />;
}
